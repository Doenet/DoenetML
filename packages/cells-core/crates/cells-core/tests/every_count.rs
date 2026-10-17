//! The promise of ADR 0012, checked independently of how the probe keeps
//! it: a document that loads with the cycle check on has no dependency loop
//! at any iteration count, and its structure settles at every count a
//! student can reach.
//!
//! Every document of the golden set (`crates/cells-bench/golden`),
//! `fixtures/sir.doenet`, every generated fixture (`npm run fixtures`;
//! skipped when absent) and the documents of ADR 0012 and the rebuild-cycle
//! survey ([`HOLES`]) is loaded at four seeds. When it loads, each repeat
//! element is stamped at 0 to 4 iterations, one element at a time and all
//! together, with the other repeats at the counts their cells settle to,
//! and every such build is scheduled, which must not fail with
//! `Error::Cycle`; from there every count is let settle, which it must
//! within the passes a load allows. Then the same counts are requested on
//! the count cells, and no tick may fail its rebuild with a cycle or an
//! unsettled structure.
//!
//! Every build at those counts, and every rebuild, is a later build of the
//! load, from the load's compile (ADR 0015): none may find an error the
//! load did not report (ADR 0014), which is `Error::Unchecked`.
//!
//! This is the regression net for a structural read that bypasses the
//! structure view (`build/view.rs`): the probe cannot model such a read, so
//! a document it should reject loads, and a count here closes the loop. The
//! documents in `HOLES` are rejected at load today and skipped; they are
//! here for the day one is not.

use std::collections::{BTreeSet, HashMap};
use std::path::Path;
use std::sync::Arc;

use cells_core::build::{BuildError, Repeat, ScopeId, build};
use cells_core::components::ComponentType;
use cells_core::dast::{Dast, NodeId, NodeKind};
use cells_core::session::{Counts, Session};
use cells_core::testing::test_utils::{dast_json, repo_root};
use cells_core::{Document, Error, LoadOptions, Request};

const SEEDS: [u64; 4] = [0, 1, 2, 3];
const COUNTS: std::ops::RangeInclusive<u32> = 0..=4;
/// Builds a stamping may take to settle: a load's eight passes, plus the
/// forced build it starts from.
const MAX_PASSES: usize = 9;

/// Documents at the holes ADR 0012 and `docs/rebuild-cycles-survey.md`
/// closed: each loaded clean before and failed at a count a student
/// reaches.
const HOLES: &[(&str, &str)] = &[
    (
        "adr-index-past-count",
        r#"<numberInput name="n" value="1"/>
        <repeatForSequence name="r" length="$n"><number name="x">$y</number></repeatForSequence>
        <number name="y">$r[2].x</number>"#,
    ),
    (
        "adr-two-sided-neighbors",
        r#"<numberInput name="n" value="1"/>
        <repeatForSequence name="r" length="$n" indexName="i">
          <number name="x">$r[$i-1].x + $r[$i+1].x</number>
        </repeatForSequence>"#,
    ),
    (
        "adr-count-reads-own-iteration",
        r#"<graph><repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence></graph>
        <boolean name="b">$r[2].p.x > 0</boolean><number name="k">2 - $b</number>"#,
    ),
    (
        "survey-collect-by-index",
        r#"<numberInput name="n" value="1"/>
        <repeatForSequence name="r" length="$n"><number name="x">$y</number></repeatForSequence>
        <collect name="c" from="$r" componentType="number"/>
        <number name="y">$c[2]</number>"#,
    ),
    (
        "survey-collect-count",
        r#"<booleanInput name="g"/>
        <repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence>
        <collect name="c" from="$r" componentType="point"/>
        <boolean name="two">$c.count = 2</boolean>
        <number name="k">2 - $g*$two</number>"#,
    ),
    (
        "survey-counts-read-each-other",
        r#"<booleanInput name="g"/>
        <repeatForSequence name="r" length="$a"><number name="x">1</number></repeatForSequence>
        <repeatForSequence name="s" length="$b"><number name="y">1</number></repeatForSequence>
        <boolean name="bs">$s[2].y > 0</boolean>
        <boolean name="br">$r[2].x > 0</boolean>
        <number name="a">2 - $g*$bs</number>
        <number name="b">2 - $g*$br</number>"#,
    ),
    (
        "survey-select-in-repeat",
        r#"<numberInput name="n" value="1"/>
        <repeatForSequence name="r" length="$n">
          <select name="s">
            <option><number name="a">1</number><number name="b">2</number></option>
            <option><number name="a">$b</number><number name="b">$a</number></option>
          </select>
        </repeatForSequence>"#,
    ),
    (
        "survey-select-in-repeat-collected",
        r#"<numberInput name="n" value="1"/>
        <repeatForSequence name="r" length="$n">
          <select name="s">
            <option><number name="a">1</number></option>
            <option><point name="p">($y,0)</point></option>
          </select>
        </repeatForSequence>
        <collect name="c" from="$r" componentType="point"/>
        <number name="y">$c[1].x</number>"#,
    ),
    (
        "survey-nested",
        r#"<numberInput name="n" value="1"/>
        <repeatForSequence name="o" length="$n" indexName="i">
          <repeatForSequence name="r" length="$i" indexName="j"><number name="x">$y</number></repeatForSequence>
        </repeatForSequence>
        <number name="y">$o[2].r[2].x</number>"#,
    ),
];

#[test]
fn no_count_closes_a_loop_the_load_did_not_reject() {
    let docs = documents();
    assert!(docs.len() >= 12, "the golden set is missing");
    let mut checked = 0;
    for (name, bytes) in &docs {
        checked += check(name, bytes) as usize;
    }
    // The golden set alone has documents with repeats.
    assert!(checked > 0, "no document with a repeat loaded");
}

/// (name, DAST bytes) of every document under test.
fn documents() -> Vec<(String, Vec<u8>)> {
    let root = repo_root();
    let mut sources = doenet_files(&root.join("crates/cells-bench/golden"));
    sources.push(root.join("fixtures/sir.doenet"));
    let mut out: Vec<(String, Vec<u8>)> = sources
        .iter()
        .map(|p| {
            let src = std::fs::read_to_string(p).unwrap();
            (stem(p), dast_json(&src).into_bytes())
        })
        .chain(
            HOLES
                .iter()
                .map(|(name, src)| (name.to_string(), dast_json(src).into_bytes())),
        )
        .collect();
    let mut generated: Vec<_> = std::fs::read_dir(root.join("fixtures"))
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "json"))
        .filter(|p| !out.iter().any(|(n, _)| *n == stem(p)))
        .collect();
    generated.sort();
    for p in generated {
        out.push((stem(&p), std::fs::read(&p).unwrap()));
    }
    out
}

fn doenet_files(dir: &Path) -> Vec<std::path::PathBuf> {
    let mut v: Vec<_> = std::fs::read_dir(dir)
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "doenet"))
        .collect();
    v.sort();
    v
}

/// (node, component type) of every element of a known type.
fn element_types(dast: &Dast) -> Vec<(NodeId, ComponentType)> {
    (0..dast.len() as NodeId)
        .filter(|&n| dast.kind(n) == NodeKind::Element)
        .filter_map(|n| ComponentType::from_tag(dast.str(n)).map(|t| (n, t)))
        .collect()
}

fn stem(p: &Path) -> String {
    p.file_stem().unwrap().to_string_lossy().into_owned()
}

/// Check one document at every seed; whether it had a repeat to vary.
fn check(name: &str, bytes: &[u8]) -> bool {
    let dast = Arc::new(cells_core::dast::load(bytes).unwrap());
    let types = element_types(&dast);
    // Every element built like a repeat, instantiated at load or not.
    let nodes: BTreeSet<NodeId> = types
        .iter()
        .filter(|(_, t)| t.count_prop().is_some())
        .map(|&(n, _)| n)
        .collect();
    if nodes.is_empty() {
        return false; // the structure never changes, and the check never runs
    }
    // Without a load-time choice, every seed builds the same document.
    let draws = types
        .iter()
        .any(|(_, t)| matches!(t, ComponentType::Select | ComponentType::SelectFromSequence));
    let seeds = if draws { &SEEDS[..] } else { &SEEDS[..1] };
    for &seed in seeds {
        let options = LoadOptions {
            seed,
            ..Default::default()
        };
        let Ok((mut doc, _)) = Document::load(bytes, options) else {
            continue; // the promise is about documents that load
        };
        let at = |what: &str| format!("{name}, seed {seed}, {what}");
        for &node in &nodes {
            for c in COUNTS {
                let what = at(&format!("repeat node {node} at {c}"));
                stamp(&what, seed, &doc, &|n| (n == node).then_some(c));
                drive(&what, &mut doc, &|n| n == node, c);
            }
        }
        for c in COUNTS {
            let what = at(&format!("every repeat at {c}"));
            stamp(&what, seed, &doc, &|_| Some(c));
            drive(&what, &mut doc, &|_| true, c);
        }
    }
    true
}

/// Build with every repeat `forced` names stamped at that count and the
/// others at what their count cells settle to, then let every count
/// settle from there, scheduling each build: the stamped graph must have
/// no cycle at any of those counts, and the counts must settle. A build can
/// fail no other way (`BuildError`), and neither way is allowed.
fn stamp(what: &str, seed: u64, loaded: &Document, forced: &dyn Fn(NodeId) -> Option<u32>) {
    let mut counts: HashMap<(ScopeId, NodeId), u32> = HashMap::new();
    for free in [false, true] {
        let mut settled = false;
        for _ in 0..MAX_PASSES {
            let session = Session::new(seed, false);
            let mut stamped = Counts::default();
            for (&(scope, node), &n) in &counts {
                stamped.set(scope, node, n);
            }
            let compiled = loaded.compiled.clone().expect("a document with a repeat");
            let doc = build(&compiled, &session, &stamped, false)
                .and_then(|built| built.schedule(compiled.clone()));
            let mut doc = match doc {
                Ok(doc) => doc,
                Err(BuildError::Cycle(at)) => {
                    panic!("{what}: a cycle at {at} the load did not reject")
                }
                Err(BuildError::Unchecked(e)) => {
                    panic!("{what}: an error the load did not report: {e}")
                }
            };
            doc.recompute();
            settled = true;
            for r in &doc.structure.repeats {
                let force = if free { None } else { forced(r.node) };
                let want = force.unwrap_or_else(|| doc.repeat_count(r));
                if r.iterations != want {
                    counts.insert((r.scope, r.node), want);
                    settled = false;
                }
            }
            if settled {
                break;
            }
        }
        assert!(
            settled,
            "{what}: the counts did not settle within {MAX_PASSES} builds"
        );
    }
}

/// Request count `c` on the count cell of every repeat `which` names, as a
/// student's input would set it: the rebuild must not fail with a cycle or
/// an unsettled structure. A request no input can carry is dropped.
fn drive(what: &str, doc: &mut Document, which: &dyn Fn(NodeId) -> bool, c: u32) {
    let requests: Vec<Request> = doc
        .structure
        .repeats
        .iter()
        .filter(|r| which(r.node))
        .map(|r| Request {
            cell: count_cell(doc, r),
            value: c as f64,
        })
        .collect();
    if requests.is_empty() {
        return;
    }
    let outcome = doc.request(&requests);
    if let Some(e) = outcome.rebuild_error {
        assert!(
            !structural(&e),
            "{what}: the rebuild failed although the load passed: {e}"
        );
    }
}

fn count_cell(doc: &Document, r: &Repeat) -> cells_core::CellIdx {
    let pi = doc
        .component_type(r.comp)
        .count_prop()
        .expect("a repeat has a count");
    doc.comp_cells(r.comp)[pi]
}

/// Whether a rebuild error is a cycle, an unsettled structure or an error
/// the load did not report: a tick reports the error as text, so it is
/// matched against the three messages.
fn structural(e: &str) -> bool {
    let prefix = |full: String, param: &str| full[..full.find(param).unwrap()].to_string();
    let cycle = prefix(Error::Cycle("\u{1}".into()).to_string(), "\u{1}");
    let unsettled = prefix(Error::UnstableStructure(987_654).to_string(), "987654");
    let unchecked = prefix(Error::Unchecked("\u{1}".into()).to_string(), "\u{1}");
    e.starts_with(&cycle) || e.starts_with(&unsettled) || e.starts_with(&unchecked)
}

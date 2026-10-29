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

use cells_core::CompIdx;
use std::collections::{BTreeSet, HashMap};
use std::path::Path;
use std::sync::Arc;

use cells_core::build::{BuildError, Repeat, ScopeId, build};
use cells_core::components::ComponentType;
use cells_core::dast::{Dast, NodeId, NodeKind};
use cells_core::session::{Counts, Session};
use cells_core::testing::test_utils::{dast_json, repo_root};
use cells_core::testing::{ProbeEdges, probe_edges, uncovered};
use cells_core::{Compiled, Document, Error, LoadOptions, Request};

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
    NodeId::below(dast.len())
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
        let compiled = doc
            .loaded
            .compiled
            .clone()
            .expect("a document with a repeat");
        let probe = probe_edges(&compiled).unwrap_or_else(|e| panic!("{name}: the probe: {e}"));
        let at = |what: &str| format!("{name}, seed {seed}, {what}");
        for &node in &nodes {
            for c in COUNTS {
                let what = at(&format!("repeat node {node} at {c}"));
                stamp(&what, seed, &doc, &probe, &|n| (n == node).then_some(c));
                drive(&what, &mut doc, &|n| n == node, c);
            }
        }
        for c in COUNTS {
            let what = at(&format!("every repeat at {c}"));
            stamp(&what, seed, &doc, &probe, &|_| Some(c));
            drive(&what, &mut doc, &|_| true, c);
        }
    }
    true
}

/// Build with every repeat `forced` names stamped at that count and the
/// others at what their count cells settle to, then let every count
/// settle from there, scheduling each build: the stamped graph must have
/// no cycle at any of those counts, and the counts must settle. A build
/// fails only with `BuildError::Unchecked`, which is never allowed.
fn stamp(
    what: &str,
    seed: u64,
    loaded: &Document,
    probe: &ProbeEdges,
    forced: &dyn Fn(NodeId) -> Option<u32>,
) {
    let mut counts: HashMap<(ScopeId, NodeId), u32> = HashMap::new();
    for free in [false, true] {
        let mut settled = false;
        for _ in 0..MAX_PASSES {
            let session = Session::new(seed, false);
            let mut stamped = Counts::default();
            for (&(scope, node), &n) in &counts {
                stamped.set(scope, node, n);
            }
            let compiled = loaded
                .loaded
                .compiled
                .clone()
                .expect("a document with a repeat");
            covered(what, probe, &compiled, &session, &stamped);
            let doc = build(&compiled, &session, &stamped, false)
                .and_then(|built| built.schedule(compiled.clone()));
            let mut doc = match doc {
                Ok(doc) => doc,
                // A cycle included: the compile finds every one.
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
    // A count is no input's prop: forcing it is the machinery's test.
    let outcome = cells_core::testing::request_unchecked(doc, &requests);
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

/// Every dependency of the build at `counts` must be one the probe's graph
/// has, with a label its iterations satisfy: what lets the compile's check
/// stand for every build (ADR 0012, ADR 0014).
fn covered(
    what: &str,
    probe: &ProbeEdges,
    compiled: &Compiled,
    session: &Session,
    counts: &Counts,
) {
    let missing = uncovered(probe, compiled, session, counts)
        .unwrap_or_else(|e| panic!("{what}: the build: {e}"));
    assert!(
        missing.is_empty(),
        "{what}: {} dependencies the probe does not have, first: {}",
        missing.len(),
        missing[0]
    );
}

// A document without a repeat has one build per seed, which must be
// covered too: a select's draw is what the probe stands for there.
#[test]
fn the_probe_covers_every_build_of_a_document_without_repeats() {
    let mut checked = 0;
    for (name, bytes) in documents() {
        let dast = cells_core::dast::load(&bytes).unwrap();
        let Ok(compiled) = cells_core::testing::compile(&dast) else {
            continue;
        };
        if has_repeats(&dast) {
            continue; // `stamp` covers these at every count
        }
        let probe = probe_edges(&compiled).unwrap_or_else(|e| panic!("{name}: the probe: {e}"));
        for seed in SEEDS {
            let session = Session::new(seed, false);
            covered(
                &format!("{name}, seed {seed}"),
                &probe,
                &compiled,
                &session,
                &Counts::default(),
            );
        }
        checked += 1;
    }
    assert!(checked > 0);
}

fn has_repeats(dast: &Dast) -> bool {
    element_types(dast)
        .iter()
        .any(|(_, t)| t.count_prop().is_some())
}

/// ADR 0018: a value slot is essential when a student's action can write
/// it, and the probe's record of those slots stands for every build. For
/// every document, at every seed it draws with and every repeat at 0 to 4
/// iterations, two things are checked against builds at those counts:
///
/// - every slot a build's own walk finds writable is one the record holds,
///   so no build meets a write it did not expect;
/// - a request on every interactive cell, every submit and every trigger,
///   made in the same build with every value essential (the classing off),
///   writes only cells the record makes essential. That checks the walk
///   against the inverses themselves, not against their declarations.
#[test]
fn every_write_lands_on_a_cell_the_record_makes_essential() {
    let docs = documents();
    assert!(docs.len() >= 12, "the golden set is missing");
    for (name, bytes) in &docs {
        let dast = cells_core::dast::load(bytes).unwrap();
        let types = element_types(&dast);
        let draws = types
            .iter()
            .any(|(_, t)| matches!(t, ComponentType::Select | ComponentType::SelectFromSequence));
        let seeds = if draws { &SEEDS[..] } else { &SEEDS[..1] };
        let counts: Vec<Option<u32>> = if has_repeats(&dast) {
            COUNTS.map(Some).collect()
        } else {
            vec![None]
        };
        for &seed in seeds {
            let Ok(on) = cells_core::testing::compile(&dast) else {
                continue; // the promise is about documents that load
            };
            let off = cells_core::testing::compile_unclassified(&dast).unwrap();
            let own = cells_core::testing::with_own_walk(&on);
            for &c in &counts {
                let what = format!("{name}, seed {seed}, count {c:?}");
                let (session, stamped) = settle_at(&on, seed, c);
                let at = |compiled: &Arc<Compiled>| {
                    let mut doc = build(compiled, &session, &stamped, false)
                        .and_then(|b| b.schedule(compiled.clone()))
                        .unwrap_or_else(|e| panic!("{what}: {e}"));
                    doc.recompute();
                    doc
                };
                let essential: BTreeSet<(ScopeId, u32)> =
                    at(&on).structure.essential_slots.iter().copied().collect();
                for key in &at(&own).structure.essential_slots {
                    assert!(
                        essential.contains(key),
                        "{what}: {key:?} is writable in this build's own walk, not in the record"
                    );
                }
                let unclassified = at(&off);
                for (action, key) in writes(&unclassified) {
                    assert!(
                        essential.contains(&key),
                        "{what}: {action} writes {key:?}, which the record makes fixed"
                    );
                }
            }
        }
    }
}

/// The session and counts of a build with every repeat at `c` (None: as
/// the document's cells settle), letting nested repeats appear.
fn settle_at(compiled: &Arc<Compiled>, seed: u64, c: Option<u32>) -> (Session, Counts) {
    let mut counts: HashMap<(ScopeId, NodeId), u32> = HashMap::new();
    for _ in 0..MAX_PASSES {
        let session = Session::new(seed, false);
        let mut stamped = Counts::default();
        for (&(scope, node), &n) in &counts {
            stamped.set(scope, node, n);
        }
        let mut doc = build(compiled, &session, &stamped, false)
            .and_then(|b| b.schedule(compiled.clone()))
            .unwrap();
        doc.recompute();
        let mut settled = true;
        for r in &doc.structure.repeats {
            let want = c.unwrap_or_else(|| doc.repeat_count(r));
            if r.iterations != want {
                counts.insert((r.scope, r.node), want);
                settled = false;
            }
        }
        if settled {
            return (Session::new(seed, false), stamped);
        }
    }
    panic!("the counts did not settle within {MAX_PASSES} builds");
}

/// Every action a student can take on `doc`, each on a copy of it, with
/// the essential keys it writes: those it touches (ADR 0017).
fn writes(doc: &Document) -> Vec<(String, (ScopeId, u32))> {
    let mut out = Vec::new();
    let mut record = |action: String, tick: &dyn Fn(&mut Document)| {
        let mut copy = doc.clone();
        tick(&mut copy);
        for &key in copy.session.touched.iter() {
            out.push((action.clone(), key));
        }
    };
    for cell in doc.interactive_cells() {
        let cur = doc.cells[cell.index()];
        let value = match doc.value_types[cell.index()] {
            cells_core::ValueType::Number if cur.is_nan() => 1.0,
            cells_core::ValueType::Number => cur + 1.5,
            // Text and math ask for what they hold: the walk is the same.
            _ => cur,
        };
        record(format!("a request on cell {cell}"), &|d| {
            d.request(&[Request { cell, value }]);
        });
    }
    for c in CompIdx::below(doc.n_components()) {
        match doc.component_type(c) {
            ComponentType::Answer => record(format!("a submit of {c}"), &|d| {
                d.submit(c);
            }),
            ComponentType::TriggerSet | ComponentType::UpdateValue => {
                record(format!("a trigger of {c}"), &|d| {
                    d.trigger(c);
                })
            }
            _ => {}
        }
    }
    out
}

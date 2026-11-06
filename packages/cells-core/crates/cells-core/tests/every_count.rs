//! A document that loads with the cycle check on has no dependency loop at
//! any iteration count, and its structure settles at every count a student
//! can reach, checked independently of the compile's check, and every
//! dependency of every such build is one the template graph has (ADR 0032,
//! step 8), with a label its iterations satisfy.
//!
//! Every golden document, `sir.doenet`, every generated fixture (skipped
//! when absent), [`HOLES`] and [`CONSTRUCTS`] is loaded at four seeds, and each repeat is
//! stamped and requested at 0 to 4 iterations, one at a time and all
//! together. No build may fail with a cycle, an unsettled structure, or an
//! error the load did not report.

use cells_core::CompIdx;
use std::collections::{BTreeSet, HashMap};
use std::path::Path;
use std::sync::Arc;

use cells_core::build::{BuildError, Repeat, ScopeId, SlotClass, TemplateSlot, build};
use cells_core::components::ComponentType;
use cells_core::dast::{Dast, NodeId, NodeKind};
use cells_core::session::{Counts, MathStore, Session};
use cells_core::testing::test_utils::{dast_json, repo_root};
use cells_core::testing::{GraphEdges, graph_edges, par_map, uncovered};
use cells_core::{Built, Compiled, Document, Error, LoadOptions, Request};

const SEEDS: [u64; 4] = [0, 1, 2, 3];
const COUNTS: std::ops::RangeInclusive<u32> = 0..=4;
/// Builds a stamping may take to settle: a load's eight passes, plus the
/// forced build it starts from.
const MAX_PASSES: usize = 9;

/// Documents that once loaded clean and failed at a count a student
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

/// Documents with a counted value, one that follows the counts: a
/// collect's count, a section's number after a repeat, before a repeat
/// inside an iteration, or after sections collected from one, and the
/// credit of a section whose answers are all in a repeat.
const STRUCTURE_VALUES: &[(&str, &str)] = &[
    (
        "collect-count",
        r#"<numberInput name="n" value="2"/>
        <graph><repeatForSequence name="r" length="$n"><point name="p">(1,2)</point></repeatForSequence></graph>
        <collect name="c" from="$r" componentType="point"/>
        <number name="k">$c.count</number>"#,
    ),
    (
        "section-after-repeat",
        r#"<numberInput name="n" value="2"/>
        <repeatForSequence name="r" length="$n"><section name="s"/></repeatForSequence>
        <section name="after"/>"#,
    ),
    (
        "credit-of-repeated-answers",
        r#"<numberInput name="n" value="2"/>
        <section name="s" aggregateScores>
          <repeatForSequence name="r" length="$n"><mathInput name="m"/><answer name="a" response="$m">1</answer></repeatForSequence>
        </section>"#,
    ),
    (
        "section-before-nested-repeat",
        r#"<numberInput name="n" value="2"/>
        <repeatForSequence name="o" length="$n">
          <section name="a"/>
          <repeatForSequence name="r" length="$n"><section name="b"/></repeatForSequence>
        </repeatForSequence>"#,
    ),
    (
        "section-after-collected-sections",
        r#"<numberInput name="n" value="2"/>
        <group name="g"><repeatForSequence name="r" length="$n"><section name="s"/></repeatForSequence></group>
        <collect name="c" from="$g" componentType="section"/>
        <section name="after"/>"#,
    ),
];

/// Documents for what the golden set has little of, which the template
/// graph was held to the abstract build on (ADR 0032, step 8): references
/// into and across iterations, by a cell, through interfaces and whole
/// picks, a first-iteration specialization, scores under cases, repeats
/// and copies, `$ref` children, collects, point lists, holds and copies of
/// a list type.
const CONSTRUCTS: &[(&str, &str)] = &[
    (
        "neighbors",
        r#"<numberInput name="n" value="3"/>
        <repeatForSequence name="r" length="$n" indexName="i">
          <number name="x">$r[$i-1].x + 1</number>
          <number name="y">$r[2].x</number>
        </repeatForSequence>
        <number name="z">$r[1].x + $r[$n].y</number>"#,
    ),
    (
        "nested",
        r#"<numberInput name="n" value="2"/>
        <repeatForSequence name="o" length="$n" indexName="i">
          <repeatForSequence name="r" length="$i" indexName="j">
            <number name="x">$i + $j + $o[$i-1].r[$j].x</number>
          </repeatForSequence>
        </repeatForSequence>
        <number name="y">$o[2].r[1].x</number>"#,
    ),
    (
        "iterate",
        r#"<numberInput name="n" value="3"/>
        <repeatForSequence name="r" length="$n" indexName="i">
          <number name="x">$i</number>
        </repeatForSequence>
        <math name="m">$r[1].x + y</math>
        <math name="s">$m + 1</math>"#,
    ),
    (
        "conditional",
        r#"<booleanInput name="b"/>
        <conditionalContent name="cc">
          <case condition="$b"><number name="x">1</number></case>
          <else><number name="x">2</number></else>
        </conditionalContent>
        <number name="y">$cc.x + 1</number>"#,
    ),
    (
        "picks",
        r#"<select name="s" numToSelect="2">
          <option><number name="a">1</number></option>
          <option><number name="a">2</number></option>
          <option><number name="a">3</number></option>
        </select>
        <number name="x">$s[1].a + $s[2].a</number>
        <number name="w">$s[1]</number>"#,
    ),
    (
        "scored",
        r#"<booleanInput name="b"/>
        <section name="s0" aggregateScores>
          <mathInput name="m"/><answer name="a" response="$m">1</answer>
          <conditionalContent name="cc">
            <case condition="$b">
              <section name="s1" aggregateScores><answer name="a2" response="$m">2</answer></section>
            </case>
            <else><section name="s2"/></else>
          </conditionalContent>
          <section name="s3"/>
        </section>
        <section name="s4"/>"#,
    ),
    (
        "scored-repeat",
        r#"<numberInput name="n" value="2"/>
        <section name="s" aggregateScores>
          <repeatForSequence name="r" length="$n">
            <section name="t"/><mathInput name="m"/><answer name="a" response="$m">1</answer>
          </repeatForSequence>
          <section name="u"/>
        </section>"#,
    ),
    (
        "ref-children",
        r#"<number name="x">2</number><mathInput name="mi"/>
        <p>$x and $mi and $x.value</p>
        <numberInput name="n" value="2"/>
        <repeatForSequence name="r" length="$n"><p>$x</p></repeatForSequence>
        <number name="y">$r[1].value</number>"#,
    ),
    (
        "collect-index",
        r#"<numberInput name="n" value="1"/>
        <repeatForSequence name="r" length="$n"><number name="x">2</number></repeatForSequence>
        <collect name="c" from="$r" componentType="number"/>
        <number name="y">$c[2] + $c[$n]</number>
        <number name="k">$c.count</number>"#,
    ),
    (
        "point-list",
        r#"<graph>
          <polygon name="pg" vertices="(0,0) (1,0) (0,1)"/>
          <pointList name="l" extend="$pg.vertices"/>
          <point name="q">($l[2].x, 3)</point>
        </graph>"#,
    ),
    (
        "held",
        r#"<booleanInput name="f"/>
        <number name="v">3</number>
        <number name="w" extend="$v" fixed="$f"/>
        <number name="u" extend="$v" fixed="$f"/>"#,
    ),
    (
        "list-copy",
        r#"<graph>
          <polygon name="pg" vertices="(0,0) (1,0) (0,1)"/>
          <polygon name="pg2" extend="$pg"/>
        </graph>"#,
    ),
    (
        "list-points",
        r#"<graph>
          <polygon name="pg" vertices="(0,0) (1,0) (0,1)"/>
          <pointList name="l" extend="$pg.vertices"/>
          <point name="q" extend="$l[3]"/>
          <pointList name="m" extend="$l"/>
        </graph>
        <number name="j">$q.y</number>"#,
    ),
    (
        "ref-child-iterations",
        r#"<numberInput name="n" value="2"/>
        <repeatForSequence name="r" length="$n">$x</repeatForSequence>
        <number name="x">3</number>
        <number name="y" extend="$r[1]"/>
        <p>$r[1]</p>"#,
    ),
    (
        // An indexed `$ref` child is placed after the collects, which
        // gather it as the placeholder it still is: nothing.
        "indexed-ref-child-uncollected",
        r#"<numberInput name="n" value="2"/>
        <repeatForSequence name="r" length="$n" indexName="i">
          <number name="x">$i</number>
          <group name="g">$r[$i-1].x</group>
          <collect name="c" from="$g" componentType="number"/>
          <number name="y">$c[1] + 1</number>
        </repeatForSequence>"#,
    ),
    (
        "scored-copies",
        r#"<section name="s" aggregateScores>
          <group name="g"><mathInput name="m"/><answer name="a" response="$m">1</answer></group>
          <p>$a</p>
          <collect name="c" from="$g" componentType="answer"/>
        </section>"#,
    ),
    (
        "held-alike",
        r#"<number name="v">3</number>
        <number name="w" extend="$v" fixed="true"/>
        <number name="u" extend="$v" fixed="true"/>
        <number name="x" extend="$w" fixed="true"/>"#,
    ),
    (
        // A drag on `p` writes `b`, not the held `c`: only when `$c + $b`
        // is turned round.
        "oriented",
        r#"<number name="c" fixed>3</number>
        <number name="b">1</number>
        <graph><point name="p">($c + $b, 0)</point></graph>"#,
    ),
    (
        // `n` is read only through the seed.
        "seeded-from-setup",
        r#"<setup><number name="n">5</number></setup>
        <mathInput name="mi" prefill="$n"/>"#,
    ),
    (
        // A drag on the fixed point stops at it: `a` is not written.
        "held-copy",
        r#"<number name="a">1</number>
        <graph><point name="p" fixed>($a, 2)</point></graph>"#,
    ),
    (
        // An answer's response, symbolic math over symbolic math: its
        // leaf is a math leaf in the signature's template.
        "math-over-math",
        r#"<math name="m">x + 1</math><math name="m2">$m + y</math>
        <answer name="a" response="$m2">x</answer>"#,
    ),
    (
        // A drawn bound: the point's domain holds the value drawn.
        "drawn-bound",
        r#"<selectFromSequence name="s" from="1" to="100"/>
        <graph xmax="$s"><point name="p">(1,2)</point></graph>"#,
    ),
    (
        // Load-time choices over constants (ADR 0037): a pick over another,
        // an iteration's index and a stable read into a repeat, an exclude,
        // and a select whose `numToSelect` is an author's number.
        "picks-over-constants",
        r#"<selectFromSequence name="a" from="1" to="5"/>
        <selectFromSequence name="b" from="$a" to="$a * 2 + 1" exclude="$a"/>
        <numberInput name="k" value="2"/>
        <repeatForSequence name="r" length="9" indexName="i">
          <selectFromSequence name="s" from="1" to="10 - $i"/>
          <number name="t">$s + $k</number>
        </repeatForSequence>
        <repeatForSequence name="q" length="$k"><number name="u">$r[3].s</number></repeatForSequence>
        <number name="n">2</number>
        <select name="o" numToSelect="$n">
          <option><number name="v">1</number></option>
          <option><number name="v">2</number></option>
          <option><number name="v">3</number></option>
        </select>
        <number name="c">$a + $b + $o[1].v + $o[2].v + $r[1].s</number>"#,
    ),
    (
        "points",
        r#"<graph>
          <point name="p">(1,2)</point>
          <point name="q">($p.x + 1, $p.y)</point>
          <line name="l" through="$p $q"/>
        </graph>
        <number name="k">$l.slope</number>"#,
    ),
];

#[test]
fn no_count_closes_a_loop_the_load_did_not_reject() {
    let docs = documents();
    assert!(docs.len() >= 12, "the golden set is missing");
    let loads: Vec<Load<'_>> = par_map(&docs, |(name, bytes)| loads(name, bytes))
        .into_iter()
        .flatten()
        .collect();
    // The golden set alone has documents with repeats.
    assert!(!loads.is_empty(), "no document with a repeat loaded");
    // A stamping reads the load's compile, which no request changes, so
    // the stampings of every load are independent of each other and of
    // the requests below.
    let stampings: Vec<(&Load, Option<NodeId>, u32)> = loads
        .iter()
        .flat_map(|l| {
            // Each repeat forced alone, then every repeat at once.
            let forced = l.nodes.iter().map(|&n| Some(n)).chain([None]);
            forced.flat_map(move |node| COUNTS.map(move |c| (l, node, c)))
        })
        .collect();
    par_map(&stampings, |&(l, node, c)| {
        let what = l.at(node, c);
        match node {
            Some(node) => stamp(&what, l, &|n| (n == node).then_some(c)),
            None => stamp(&what, l, &|_| Some(c)),
        }
    });
    // The requests of one load follow each other, each from where the
    // last left the document.
    par_map(&loads, |l| {
        let mut doc = l.load();
        for &node in &l.nodes {
            for c in COUNTS {
                drive(&l.at(Some(node), c), &mut doc, &|n| n == node, c);
            }
        }
        for c in COUNTS {
            drive(&l.at(None, c), &mut doc, &|_| true, c);
        }
    });
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
                .chain(STRUCTURE_VALUES)
                .chain(CONSTRUCTS)
                .map(|(name, src)| (name.to_string(), dast_json(src).into_bytes())),
        )
        .collect();
    // More items than one choose reads, by a cell: chooses in chunks.
    let many: String = (1..=70).map(|k| format!("<number>{k}</number>")).collect();
    let src = format!(
        r#"<group name="g">{many}</group>
        <collect name="c" from="$g" componentType="number"/>
        <numberInput name="n" value="1"/>
        <number name="y">$c[$n] + $c[65]</number>"#
    );
    out.push(("many-items".to_string(), dast_json(&src).into_bytes()));
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

/// A document with a repeat that loads at one seed, and what its sweep
/// needs: the load's compile, every element built like a repeat, and the
/// template graph's edges. Not the document, which stays on its thread.
struct Load<'a> {
    name: String,
    bytes: &'a [u8],
    seed: u64,
    compiled: Arc<Compiled>,
    edges: GraphEdges,
    nodes: BTreeSet<NodeId>,
}

impl Load<'_> {
    /// The document as loaded.
    fn load(&self) -> Document {
        let options = LoadOptions {
            seed: self.seed,
            ..Default::default()
        };
        Document::load(self.bytes, options).unwrap().0
    }

    /// Where a check is: the repeat node forced to `c`, or every repeat.
    fn at(&self, node: Option<NodeId>, c: u32) -> String {
        let (name, seed) = (&self.name, self.seed);
        match node {
            Some(node) => format!("{name}, seed {seed}, repeat node {node} at {c}"),
            None => format!("{name}, seed {seed}, every repeat at {c}"),
        }
    }
}

/// The loads of one document, one at every seed it draws with; none when
/// it has no repeat to vary, or does not load.
fn loads<'a>(name: &str, bytes: &'a [u8]) -> Vec<Load<'a>> {
    let dast = Arc::new(cells_core::dast::load(bytes).unwrap());
    let types = element_types(&dast);
    // Every element built like a repeat, instantiated at load or not.
    let nodes: BTreeSet<NodeId> = types
        .iter()
        .filter(|(_, t)| t.count_prop().is_some())
        .map(|&(n, _)| n)
        .collect();
    if nodes.is_empty() {
        return Vec::new(); // the structure never changes, and the check never runs
    }
    // Without a load-time choice, every seed builds the same document.
    let draws = types
        .iter()
        .any(|(_, t)| matches!(t, ComponentType::Select | ComponentType::SelectFromSequence));
    let seeds = if draws { &SEEDS[..] } else { &SEEDS[..1] };
    let mut out = Vec::new();
    for &seed in seeds {
        let options = LoadOptions {
            seed,
            ..Default::default()
        };
        let Ok((doc, _)) = Document::load(bytes, options) else {
            continue; // the promise is about documents that load
        };
        let compiled = doc
            .loaded
            .compiled
            .clone()
            .expect("a document with a repeat");
        let edges = graph_edges(&compiled);
        out.push(Load {
            name: name.to_string(),
            bytes,
            seed,
            compiled,
            edges,
            nodes: nodes.clone(),
        });
    }
    out
}

/// Build with every repeat `forced` names stamped at that count and the
/// others at what their count cells settle to, then let every count
/// settle from there, scheduling each build: the stamped graph must have
/// no cycle at any of those counts, and the counts must settle. A build
/// fails only with `BuildError::Unchecked`, which is never allowed.
fn stamp(what: &str, load: &Load, forced: &dyn Fn(NodeId) -> Option<u32>) {
    let (seed, compiled, edges) = (load.seed, &load.compiled, &load.edges);
    let mut counts: HashMap<(ScopeId, NodeId), u32> = HashMap::new();
    for free in [false, true] {
        let mut settled = false;
        for _ in 0..MAX_PASSES {
            let session = Session::new(seed);
            let mut stamped = Counts::default();
            for (&(scope, node), &n) in &counts {
                stamped.set(scope, node, n);
            }
            covered(what, edges, compiled, &session, &stamped);
            // A fresh session, so fresh math: no value carries a handle.
            let mut math = MathStore::default();
            let doc = build(compiled, &session, &mut math, &stamped, false)
                .and_then(|built| built.schedule(compiled.clone(), math));
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

/// Whether a rebuild error is a cycle or an error the load did not report
/// (an unsettled structure among them), matched on its message.
fn structural(e: &str) -> bool {
    let prefix = |full: String, param: &str| full[..full.find(param).unwrap()].to_string();
    let cycle = prefix(Error::Cycle("\u{1}".into()).to_string(), "\u{1}");
    let unchecked = prefix(Error::Unchecked("\u{1}".into()).to_string(), "\u{1}");
    e.starts_with(&cycle) || e.starts_with(&unchecked)
}

/// Every dependency of the build at `counts` must be one the template
/// graph has, with a label its iterations satisfy.
fn covered(
    what: &str,
    edges: &GraphEdges,
    compiled: &Compiled,
    session: &Session,
    counts: &Counts,
) {
    let missing = uncovered(edges, compiled, session, counts)
        .unwrap_or_else(|e| panic!("{what}: the build: {e}"));
    assert!(
        missing.is_empty(),
        "{what}: {} dependencies the template graph does not have, first: {}",
        missing.len(),
        missing[0]
    );
}

// A document without a repeat has one build per seed, which must be
// covered too: a select's draw is what the template graph stands for
// there.
#[test]
fn the_template_graph_covers_every_build_of_a_document_without_repeats() {
    let docs = documents();
    let checked = par_map(&docs, |(name, bytes)| {
        let dast = cells_core::dast::load(bytes).unwrap();
        let Ok(compiled) = cells_core::testing::compile(&dast) else {
            return false;
        };
        if has_repeats(&dast) {
            return false; // `stamp` covers these at every count
        }
        let edges = graph_edges(&compiled);
        for seed in SEEDS {
            let session = Session::new(seed);
            covered(
                &format!("{name}, seed {seed}"),
                &edges,
                &compiled,
                &session,
                &Counts::default(),
            );
        }
        true
    });
    assert!(checked.contains(&true));
}

fn has_repeats(dast: &Dast) -> bool {
    element_types(dast)
        .iter()
        .any(|(_, t)| t.count_prop().is_some())
}

/// A value slot is essential when a student's action can write it, and
/// the compile's record of those slots, found over the template graph,
/// stands for every build. For
/// every document, seed, and repeat count from 0 to 4:
///
/// - every slot a build's own walk finds writable is one the record holds;
/// - a request on every interactive cell, every submit and every trigger,
///   made with the classing off, writes only cells the record makes
///   essential.
#[test]
fn every_write_lands_on_a_cell_the_record_makes_essential() {
    let docs = documents();
    assert!(docs.len() >= 12, "the golden set is missing");
    // Per document: its compiles, classed and not, which no seed reaches,
    // and the seeds and counts to build at.
    let compiles = par_map(&docs, |(name, bytes)| {
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
        let Ok(on) = cells_core::testing::compile(&dast) else {
            return None; // the promise is about documents that load
        };
        let off = cells_core::testing::compile_unclassified(&dast).unwrap();
        Some((name, on, off, seeds, counts))
    });
    let builds: Vec<_> = compiles
        .iter()
        .flatten()
        .flat_map(|(name, on, off, seeds, counts)| {
            seeds
                .iter()
                .flat_map(move |&seed| counts.iter().map(move |&c| (name, on, off, seed, c)))
        })
        .collect();
    par_map(&builds, |&(name, on, off, seed, c)| {
        let what = format!("{name}, seed {seed}, count {c:?}");
        let (session, stamped) = settle_at(on, seed, c);
        let at = |compiled: &Arc<Compiled>| {
            let mut math = MathStore::default();
            let mut doc = build(compiled, &session, &mut math, &stamped, false)
                .and_then(|b| b.schedule(compiled.clone(), math))
                .unwrap_or_else(|e| panic!("{what}: {e}"));
            doc.recompute();
            doc
        };
        let checked = at(on);
        let essential: BTreeSet<(ScopeId, TemplateSlot)> =
            checked.structure.essential_slots.iter().copied().collect();
        for key in &checked.structure.walked_essential_slots {
            assert!(
                essential.contains(key),
                "{what}: {key:?} is writable in this build's own walk, not in the record"
            );
        }
        let unclassified = at(off);
        for (action, key) in writes(&unclassified) {
            assert!(
                essential.contains(&key),
                "{what}: {action} writes {key:?}, which the record makes fixed"
            );
        }
    });
}

/// The session and counts of a build with every repeat at `c` (None: as
/// the document's cells settle), letting nested repeats appear.
fn settle_at(compiled: &Arc<Compiled>, seed: u64, c: Option<u32>) -> (Session, Counts) {
    let mut counts: HashMap<(ScopeId, NodeId), u32> = HashMap::new();
    for _ in 0..MAX_PASSES {
        let session = Session::new(seed);
        let mut stamped = Counts::default();
        for (&(scope, node), &n) in &counts {
            stamped.set(scope, node, n);
        }
        let mut math = MathStore::default();
        let mut doc = build(compiled, &session, &mut math, &stamped, false)
            .and_then(|b| b.schedule(compiled.clone(), math))
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
            return (Session::new(seed), stamped);
        }
    }
    panic!("the counts did not settle within {MAX_PASSES} builds");
}

/// Every action a student can take on `doc`, each on a copy of it, with
/// the essential keys it writes.
fn writes(doc: &Document) -> Vec<(String, (ScopeId, TemplateSlot))> {
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

/// A constant depends on the source, the seed and its scope alone: for
/// every document with a repeat, at every seed, a template slot that is a
/// constant in one build of a scope is the same constant in every build of
/// it, whatever the counts, and a document constant has the same value in
/// every scope.
#[test]
fn a_constant_is_the_same_in_every_build() {
    let docs = documents();
    assert!(docs.len() >= 12, "the golden set is missing");
    let mut failures = par_map(&docs, |(name, bytes)| {
        let mut failures = Vec::new();
        let dast = cells_core::dast::load(bytes).unwrap();
        if !has_repeats(&dast) {
            return failures; // one structure, one build
        }
        let types = element_types(&dast);
        let draws = types
            .iter()
            .any(|(_, t)| matches!(t, ComponentType::Select | ComponentType::SelectFromSequence));
        let seeds = if draws { &SEEDS[..] } else { &SEEDS[..1] };
        for &seed in seeds {
            let options = LoadOptions {
                seed,
                ..Default::default()
            };
            let Ok((doc, _)) = Document::load(bytes, options) else {
                continue;
            };
            let compiled = doc
                .loaded
                .compiled
                .clone()
                .expect("a document with a repeat");
            // (scope, template, template slot) -> (count it was first seen
            // at, class).
            let mut seen: HashMap<(ScopeId, u32, TemplateSlot), (u32, SlotClass)> = HashMap::new();
            // (template, template slot) -> (scope first seen in, value) of
            // a document constant.
            let mut document: HashMap<(u32, TemplateSlot), (ScopeId, f64)> = HashMap::new();
            // One session throughout: scope ids are stable within it. One
            // math with it: its values are handles into it.
            let mut session = Session::new(seed);
            let mut math = MathStore::default();
            for c in COUNTS.chain(COUNTS.rev()) {
                for built in builds_at(&compiled, &mut session, &mut math, c) {
                    for &(key, class) in &built.structure.slot_classes {
                        let (at, first) = *seen.entry(key).or_insert((c, class));
                        if !same_class(first, class) {
                            failures.push(format!(
                                "{name}, seed {seed}: scope {} slot {} is {first:?} at count {at} and {class:?} at count {c}",
                                key.0, key.2
                            ));
                        }
                        if let SlotClass::Constant {
                            value,
                            document: true,
                            ..
                        } = class
                        {
                            let (scope, first) =
                                *document.entry((key.1, key.2)).or_insert((key.0, value));
                            if !same_value(first, value) {
                                failures.push(format!(
                                    "{name}, seed {seed}: document constant at template {} slot {} is {first} in scope {scope} and {value} in scope {}",
                                    key.1, key.2, key.0
                                ));
                            }
                        }
                    }
                }
            }
        }
        failures
    })
    .concat();
    failures.dedup_by(|a, b| a.split(" is ").next() == b.split(" is ").next());
    assert!(
        failures.is_empty(),
        "{} constants change with the counts:\n{}",
        failures.len(),
        failures.join("\n")
    );
}

/// What the check marks a constant (`PortAttrs::CONSTANT`, ADR 0037)
/// holds every constant a build makes, its folds included: at every count
/// and seed of every document, no template slot is a constant in a build
/// and unmarked. The attribute is the fold rule without its scope rule, so
/// it may mark more than a build folds, never less.
#[test]
fn every_constant_a_build_makes_is_one_the_check_marked() {
    let docs = documents();
    assert!(docs.len() >= 12, "the golden set is missing");
    let mut failures = par_map(&docs, |(name, bytes)| {
        let mut failures = Vec::new();
        let dast = cells_core::dast::load(bytes).unwrap();
        let types = element_types(&dast);
        let draws = types
            .iter()
            .any(|(_, t)| matches!(t, ComponentType::Select | ComponentType::SelectFromSequence));
        let seeds = if draws { &SEEDS[..] } else { &SEEDS[..1] };
        let counts: Vec<u32> = if has_repeats(&dast) {
            COUNTS.collect()
        } else {
            vec![0]
        };
        for &seed in seeds {
            let options = LoadOptions {
                seed,
                ..Default::default()
            };
            let Ok((doc, _)) = Document::load(bytes, options) else {
                continue;
            };
            let Some(compiled) = doc.loaded.compiled.clone() else {
                // No repeat: the load is its one build.
                for &((_, t, slot), class) in &doc.structure.slot_classes {
                    if let SlotClass::Constant { marked: false, .. } = class {
                        failures.push(format!("{name}, seed {seed}: template {t} slot {slot}"));
                    }
                }
                continue;
            };
            let mut session = Session::new(seed);
            let mut math = MathStore::default();
            for &c in &counts {
                for built in builds_at(&compiled, &mut session, &mut math, c) {
                    for &((_, t, slot), class) in &built.structure.slot_classes {
                        if let SlotClass::Constant { marked: false, .. } = class {
                            failures.push(format!(
                                "{name}, seed {seed}, count {c}: template {t} slot {slot}"
                            ));
                        }
                    }
                }
            }
        }
        failures
    })
    .concat();
    failures.dedup();
    assert!(
        failures.is_empty(),
        "{} constants the check did not mark, first: {}",
        failures.len(),
        failures.first().map_or("", String::as_str)
    );
}

/// What the check's evaluator finds of a constant holds in every build
/// (ADR 0037): at every count and seed of every document, a number a build
/// makes a constant lies in the range the evaluator gives its port, and is
/// that value where the range is one value (a document constant, exactly).
#[test]
fn every_constant_lies_in_the_range_the_check_evaluated() {
    use cells_core::program::{Range, ValueType};
    let docs = documents();
    assert!(docs.len() >= 12, "the golden set is missing");
    let failures = par_map(&docs, |(name, bytes)| {
        let mut failures = Vec::new();
        let dast = cells_core::dast::load(bytes).unwrap();
        let types = element_types(&dast);
        let draws = types
            .iter()
            .any(|(_, t)| matches!(t, ComponentType::Select | ComponentType::SelectFromSequence));
        let seeds = if draws { &SEEDS[..] } else { &SEEDS[..1] };
        let Ok(compiled) = cells_core::testing::compile(&dast) else {
            return failures;
        };
        let ranges = cells_core::testing::constant_ranges(&compiled);
        let counts: Vec<u32> = if has_repeats(&dast) {
            COUNTS.collect()
        } else {
            vec![0]
        };
        let mut check = |what: String, built: &Built| {
            let numbers: std::collections::HashSet<_> = built
                .structure
                .slot_types
                .iter()
                .filter(|(_, ty)| *ty == ValueType::Number)
                .map(|(k, _)| *k)
                .collect();
            for &(key, class) in &built.structure.slot_classes {
                let SlotClass::Constant { value, .. } = class else {
                    continue;
                };
                if !numbers.contains(&key) {
                    continue;
                }
                let Some(&range) = ranges.get(&(key.1, key.2)) else {
                    failures.push(format!(
                        "{what}: template {} slot {} has no range",
                        key.1, key.2
                    ));
                    continue;
                };
                let ok = match range {
                    Range::Top => true,
                    Range::Span(lo, hi) if lo == hi => {
                        value.to_bits() == lo.to_bits() || value == lo
                    }
                    Range::Span(..) => range.holds(value),
                };
                if !ok {
                    failures.push(format!(
                        "{what}: template {} slot {} is {value}, outside {range:?}",
                        key.1, key.2
                    ));
                }
            }
        };
        for &seed in seeds {
            let mut session = Session::new(seed);
            let mut math = MathStore::default();
            for &c in &counts {
                for built in builds_at(&compiled, &mut session, &mut math, c) {
                    check(format!("{name}, seed {seed}, count {c}"), &built);
                }
            }
        }
        failures
    })
    .concat();
    assert!(
        failures.is_empty(),
        "{} constants outside their range:\n{}",
        failures.len(),
        failures.join("\n")
    );
}

/// Two classes of one template slot agree: the same class, and for a
/// constant the same value (NaN equal to NaN) and kind.
fn same_class(a: SlotClass, b: SlotClass) -> bool {
    match (a, b) {
        (
            SlotClass::Constant {
                value: x,
                document: dx,
                ..
            },
            SlotClass::Constant {
                value: y,
                document: dy,
                ..
            },
        ) => same_value(x, y) && dx == dy,
        (SlotClass::Constant { .. }, _) | (_, SlotClass::Constant { .. }) => false,
        _ => true,
    }
}

/// Equal, or both NaN.
fn same_value(x: f64, y: f64) -> bool {
    x.to_bits() == y.to_bits() || (x.is_nan() && y.is_nan())
}

/// Every build, settled or not, on the way to stamping every repeat with
/// `c` iterations, each reading the session the one before returned and
/// lent `math`, which the session's values are handles into.
fn builds_at(
    compiled: &Arc<Compiled>,
    session: &mut Session,
    math: &mut MathStore,
    c: u32,
) -> Vec<Built> {
    let mut out = Vec::new();
    let mut counts = Counts::default();
    for _ in 0..MAX_PASSES {
        let (doc, next) = build(compiled, session, math, &counts, false)
            .and_then(|built| built.schedule_built())
            .expect("a build of a document that loaded");
        *session = next;
        let mut settled = true;
        for r in &doc.structure.repeats {
            if r.iterations != c {
                counts.set(r.scope, r.node, c);
                settled = false;
            }
        }
        out.push(doc);
        if settled {
            break;
        }
    }
    out
}

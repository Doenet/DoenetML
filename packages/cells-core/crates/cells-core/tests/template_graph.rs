//! The compile's template graph (ADR 0032, step 8) against the abstract
//! build's graph: between element ports, through every other node, the
//! two have the same dependencies with the same labels, on every document
//! that compiles, and every document of its own compiles and compares
//! some.
//!
//! The documents are every golden document, `sir.doenet`, every generated
//! fixture (skipped when absent) and [`DOCUMENTS`].

use std::path::Path;

use cells_core::testing::test_utils::{dast_json, repo_root};
use cells_core::testing::{
    attributes_disagreement, define_failures_agree, definitions_disagreement, par_map,
    template_graph_agreement, warnings_disagreement,
};

/// Documents for what the golden set has little of: references into and
/// across iterations, by a cell, through interfaces and whole picks, a
/// first-iteration specialization, scores under cases, repeats and copies,
/// `$ref` children, collects, point lists, holds and copies of a list type.
const DOCUMENTS: &[(&str, &str)] = &[
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
fn the_template_graph_agrees_with_the_abstract_build() {
    let docs = documents();
    let results = par_map(&docs, |(name, bytes)| {
        let dast = cells_core::dast::load(bytes).unwrap();
        let compiled = match cells_core::testing::compile(&dast) {
            Ok(compiled) => compiled,
            Err(e) => {
                eprintln!("{name} does not compile: {e}");
                return None; // the promise is about documents that compile
            }
        };
        let agreement = template_graph_agreement(&compiled)
            .unwrap_or_else(|e| panic!("{name}: the abstract build: {e}"));
        Some((name.clone(), agreement))
    });
    let mut failures = Vec::new();
    let mut compared = Vec::new();
    for (name, a) in results.into_iter().flatten() {
        if a.compared > 0 {
            compared.push(name.clone());
        }
        for line in &a.extra {
            failures.push(format!("{name}: the template graph has more: {line}"));
        }
        for line in &a.missing {
            failures.push(format!("{name}: the template graph lacks: {line}"));
        }
    }
    for (name, _) in DOCUMENTS.iter().chain([&("many-items", "")]) {
        if !compared.iter().any(|c| c == name) {
            failures.push(format!("{name}: compiled to nothing to compare"));
        }
    }
    assert!(
        failures.is_empty(),
        "{} disagreements:\n{}",
        failures.len(),
        failures.join("\n")
    );
}

// The definitions (ADR 0032, step 8, part 4): each element port's, unfolded
// to element ports, with what holds and seeds it and whether it is counted
// or may be a document constant, the same as the abstract build's.
#[test]
fn the_template_graph_defines_what_the_abstract_build_does() {
    let docs = documents();
    let results = par_map(&docs, |(name, bytes)| {
        let dast = cells_core::dast::load(bytes).unwrap();
        let compiled = cells_core::testing::compile(&dast).ok()?;
        let found = definitions_disagreement(&compiled)
            .unwrap_or_else(|e| panic!("{name}: the abstract build: {e}"));
        Some((name.clone(), found))
    });
    let mut failures = Vec::new();
    let mut compared = 0;
    for (name, (disagree, n)) in results.into_iter().flatten() {
        compared += n;
        failures.extend(disagree.into_iter().map(|d| format!("{name}: {d}")));
    }
    assert!(compared > 0, "no port compared");
    assert!(
        failures.is_empty(),
        "{} disagreements:\n{}",
        failures.len(),
        failures.join("\n")
    );
}

// Define over the graph (ADR 0032, step 8, part 4): every port's
// attributes, writable, live, counted and document constant, the same as
// the abstract build found.
#[test]
fn define_over_the_template_graph_classes_every_port_as_the_abstract_build_does() {
    let docs = documents();
    let results = par_map(&docs, |(name, bytes)| {
        let dast = cells_core::dast::load(bytes).unwrap();
        let compiled = cells_core::testing::compile(&dast).ok()?;
        let found = attributes_disagreement(&compiled)
            .unwrap_or_else(|e| panic!("{name}: define over the graph: {e}"));
        Some((name.clone(), found))
    });
    let mut failures = Vec::new();
    let mut compared = 0;
    for (name, (disagree, n)) in results.into_iter().flatten() {
        compared += n;
        failures.extend(disagree.into_iter().map(|d| format!("{name}: {d}")));
    }
    assert!(compared > 0, "no port compared");
    assert!(
        failures.is_empty(),
        "{} disagreements:\n{}",
        failures.len(),
        failures.join("\n")
    );
}

/// Requests the program refuses or drops, and one it lands.
const REFUSALS: &[(&str, &str)] = &[
    (
        "refused-square",
        r#"<numberInput name="n" value="2"/><graph><point name="p" x="$n * $n" y="0"/></graph>"#,
    ),
    (
        "refused-two-paths",
        r#"<numberInput name="n" value="1"/><number name="a">$n + 1</number>
        <graph><point name="p" x="$a + $n" y="0"/></graph>"#,
    ),
    (
        "dropped-power",
        r#"<numberInput name="n" value="2"/><graph><point name="p" x="$n^2" y="0"/></graph>"#,
    ),
    (
        "landed",
        r#"<number name="k">2</number><numberInput name="n" value="3"/>
        <graph><point name="p" x="$k $n" y="0"/></graph>"#,
    ),
    (
        // Two outputs of one circle operator, read together: a vector
        // operator's later outputs are its outputs too.
        "refused-circle-outputs",
        r#"<graph><point name="a">(0,0)</point><point name="b">(2,0)</point>
        <circle name="c" through="$a $b"/>
        <point name="p" x="$c.cx + $c.radius" y="0"/></graph>"#,
    ),
    (
        // A conditional content's stand-in chooses by its first input and
        // writes the others: the branch's value, reached twice.
        "refused-through-a-choice",
        r#"<booleanInput name="b"/>
        <conditionalContent name="cc">
          <case condition="$b"><number name="x">1</number></case>
          <else><number name="x">2</number></else>
        </conditionalContent>
        <graph><point name="p" x="$cc.x * $cc.x" y="0"/></graph>"#,
    ),
    (
        "refused-unnamed",
        r#"<numberInput name="n" value="2"/><graph><point x="$n * $n" y="0"/></graph>"#,
    ),
];

// The refuse warnings over the graph are the abstract build's, word for
// word, on every document.
#[test]
fn define_over_the_template_graph_warns_as_the_abstract_build_does() {
    let mut docs = documents();
    docs.extend(
        REFUSALS
            .iter()
            .map(|(name, src)| (name.to_string(), dast_json(src).into_bytes())),
    );
    let results = par_map(&docs, |(name, bytes)| {
        let dast = cells_core::dast::load(bytes).unwrap();
        let compiled = cells_core::testing::compile(&dast).ok()?;
        let found = warnings_disagreement(&compiled)
            .unwrap_or_else(|e| panic!("{name}: define over the graph: {e}"));
        Some((name.clone(), found))
    });
    let mut failures = Vec::new();
    let mut warned = 0;
    for (name, (disagree, n)) in results.into_iter().flatten() {
        warned += n;
        failures.extend(disagree.into_iter().map(|d| format!("{name}: {d}")));
    }
    assert!(failures.is_empty(), "{}", failures.join("\n"));
    assert!(warned >= 4, "only {warned} warnings compared");
}

/// Prefills the rule refuses or allows: a computed value is refused, a
/// counted value and a given one are not.
const PREFILLS: &[(&str, &str)] = &[
    (
        "prefill-computed",
        r#"<number name="x">1</number><number name="n">$x + 1</number>
        <mathInput name="mi" prefill="$n"/>"#,
    ),
    (
        "prefill-counted",
        r#"<numberInput name="k" value="2"/>
        <graph><repeatForSequence name="r" length="$k"><point name="p">(1,2)</point></repeatForSequence></graph>
        <collect name="c" from="$r" componentType="point"/>
        <mathInput name="mi" prefill="$c.count"/>"#,
    ),
    (
        "prefill-given",
        r#"<number name="n">5</number><mathInput name="mi" prefill="$n"/>"#,
    ),
];

// The prefill rule over the graph refuses what the abstract build's
// refuses, on the same element, at every attempt of the compile's loop.
#[test]
fn define_over_the_template_graph_refuses_the_prefills_the_abstract_build_does() {
    let mut docs = documents();
    docs.extend(
        PREFILLS
            .iter()
            .map(|(name, src)| (name.to_string(), dast_json(src).into_bytes())),
    );
    let failures: Vec<String> = par_map(&docs, |(name, bytes)| {
        let dast = cells_core::dast::load(bytes).unwrap();
        define_failures_agree(&dast)
            .into_iter()
            .map(|d| format!("{name}: {d}"))
            .collect::<Vec<_>>()
    })
    .into_iter()
    .flatten()
    .collect();
    assert!(failures.is_empty(), "{}", failures.join("\n"));
    // The refused one is refused: the comparison compared a refusal.
    let dast = cells_core::dast::load(dast_json(PREFILLS[0].1).as_bytes()).unwrap();
    assert!(
        cells_core::diagnose(&dast).iter().any(|d| d
            .message
            .contains("a prefill reference must name a value that is not computed")),
        "the computed prefill is refused"
    );
}

/// (name, DAST bytes) of every document under test.
fn documents() -> Vec<(String, Vec<u8>)> {
    let root = repo_root();
    let mut sources: Vec<_> = std::fs::read_dir(root.join("crates/cells-bench/golden"))
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "doenet"))
        .collect();
    sources.sort();
    sources.push(root.join("fixtures/sir.doenet"));
    let mut out: Vec<(String, Vec<u8>)> = sources
        .iter()
        .map(|p| {
            let src = std::fs::read_to_string(p).unwrap();
            (stem(p), dast_json(&src).into_bytes())
        })
        .chain(
            DOCUMENTS
                .iter()
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

fn stem(p: &Path) -> String {
    p.file_stem().unwrap().to_string_lossy().into_owned()
}

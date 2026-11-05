//! The refuse analysis over the abstract build's definitions finds the
//! refusals it finds over its program (ADR 0035, step 2): the same warnings,
//! asked cell by asked cell, on every document under test. The analysis
//! over the program in the abstract build goes once this has held.

use std::path::{Path, PathBuf};

use cells_core::dast::Dast;
use cells_core::testing::par_map;
use cells_core::testing::refuse_pair;
use cells_core::testing::test_utils::{dast_json, repo_root};

/// Documents of what the analysis reads: values reaching a cell along two
/// paths, chains, operators with no inverse, holds by a literal, by a
/// constant and by an input, vector operators, symbolic ones, and copies.
const SOURCES: &[(&str, &str)] = &[
    (
        "twice",
        r#"<numberInput name="n" value="2"/><number name="a">$n + 1</number>
<graph><point name="p" x="$n * $n" y="$a + $n"/><point name="q" x="2 * $a" y="$n"/></graph>"#,
    ),
    (
        "drops",
        r#"<numberInput name="n" value="2"/><numberInput name="m" value="3"/>
<graph><point name="p" x="$n^2" y="$m"/></graph>
<boolean name="b">$n &lt; $m</boolean><booleanInput name="bi" bindValueTo="$b"/>"#,
    ),
    (
        "held",
        r#"<booleanInput name="f"/><boolean name="t">true</boolean><numberInput name="n" value="1"/>
<graph><point name="a" x="$n" y="0" fixed/><point name="b" x="$n" y="1" fixed="$f"/>
<point name="c" x="$n" y="2" fixed="$t"/><point name="d" x="$n * $n" y="3" fixed="$t"/></graph>"#,
    ),
    (
        "vectors",
        r#"<numberInput name="r" value="2"/><graph>
<point name="a" x="1" y="1"/><point name="b" x="3" y="2"/><point name="c" x="0" y="4"/>
<circle name="k" through="$a $b $c"/><circle name="d" center="$a" radius="$r"/>
<circle name="e" center="($r, $r)" radius="$r"/><polygon name="q" vertices="$a $b $c"/>
<line name="l" through="$a $b"/></graph>"#,
    ),
    (
        "symbolic",
        r#"<mathInput name="x"/><numberInput name="n" value="2"/>
<math name="m">2$x + $n</math><math name="s" simplify>$m + $x</math>
<graph><point name="p" x="$n + $n" y="0"/></graph>
<evaluate name="e" function="$m" input="$n"/><number name="v">$e + $n</number>
<slider name="sl" from="0" to="10"/><number name="w">$sl * $sl</number>"#,
    ),
    (
        "copies",
        r#"<numberInput name="n" value="1"/><graph><point name="p" x="$n" y="$n"/>
<point name="c" extend="$p"/><point name="o" extend="$p" y="$n + $n"/></graph>
<repeatForSequence name="r" from="1" to="3" valueName="i"><graph><point name="pi" x="$i $n" y="$n $n"/></graph></repeatForSequence>"#,
    ),
];

#[test]
fn definitions_refuse_as_the_program_does() {
    let docs = documents();
    let pairs = par_map(&docs, |(name, dast)| {
        let (from_definitions, from_program) =
            refuse_pair(dast).unwrap_or_else(|e| panic!("{name}: {e}"));
        (name.clone(), from_definitions, from_program)
    });
    let mut found = 0;
    for (name, from_definitions, from_program) in pairs {
        assert_eq!(
            from_definitions, from_program,
            "{name}: the refusals read off the definitions differ from the program's"
        );
        found += from_definitions.len();
    }
    assert!(found > 0, "no document under test has a refused request");
}

/// (name, DAST) of every document under test: the golden documents, the
/// hand-written and generated fixtures, and `SOURCES`.
fn documents() -> Vec<(String, Dast)> {
    let root = repo_root();
    let mut sources = doenet_files(&root.join("crates/cells-bench/golden"));
    sources.push(root.join("fixtures/sir.doenet"));
    let mut out: Vec<(String, Dast)> = sources
        .iter()
        .map(|p| {
            let src = std::fs::read_to_string(p).unwrap();
            (stem(p), dast(&src))
        })
        .chain(
            SOURCES
                .iter()
                .map(|(name, src)| (name.to_string(), dast(src))),
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
        let json = std::fs::read_to_string(&p).unwrap();
        out.push((stem(&p), Dast::from_json(&json).unwrap()));
    }
    out
}

fn dast(src: &str) -> Dast {
    Dast::from_json(&dast_json(src)).unwrap()
}

fn doenet_files(dir: &Path) -> Vec<PathBuf> {
    let mut v: Vec<_> = std::fs::read_dir(dir)
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "doenet"))
        .collect();
    v.sort();
    v
}

fn stem(p: &Path) -> String {
    p.file_stem().unwrap().to_string_lossy().into_owned()
}

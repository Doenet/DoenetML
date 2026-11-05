//! The input signature read off the abstract build's definitions is the
//! one read off its program (ADR 0035, step 1): the same inputs, props,
//! domains, derivations and defaults, hash for hash, on every document
//! under test. The signer over the program goes once this has held.

use std::path::{Path, PathBuf};

use cells_core::dast::Dast;
use cells_core::testing::par_map;
use cells_core::testing::signature_pair;
use cells_core::testing::test_utils::{dast_json, repo_root};

/// Documents of the constructs the signature hashes differently: symbolic
/// templates and their posts, math and text constants, seeds, holds,
/// vector operators, sampled curves, choices and selects, bounds by
/// cells, cases and repeats around an input.
const SOURCES: &[(&str, &str)] = &[
    (
        "template",
        r#"<mathInput name="x"/><numberInput name="n" value="2"/>
<math name="m">2$x + $n</math><math name="s" simplify>$m + $x - $x</math>
<math name="e" expand>($x+1)^2</math><number name="v">$n^2 + 1</number>
<p>$m $s $e $v</p>"#,
    ),
    (
        "seeded",
        r#"<mathInput name="k" prefill="x^2+1"/><mathInput name="a" prefill="$k.expr"/>
<number name="three">3</number><mathInput name="b" prefill="$three"/>
<mathInput name="c" prefill="$a.expr"/><p>$a $b $c</p>"#,
    ),
    (
        "held",
        r#"<booleanInput name="f"/><numberInput name="n" fixed="$f" value="1"/>
<numberInput name="m" fixed value="2"/><graph><point name="p" x="$n" y="$m"/></graph>
<p>$n $m</p>"#,
    ),
    (
        "vectors",
        r#"<graph name="g" xmin="-5" xmax="5" ymin="-5" ymax="5">
<point name="a" x="1" y="1"/><point name="b" x="3" y="2"/><point name="c" x="0" y="4"/>
<circle name="k" through="$a $b $c"/><circle name="d" center="$a" through="$b"/>
<polygon name="q" vertices="(0,0) (2,0) (2,2)"/><line name="l" through="$a $b"/>
</graph><p>$k.radius $d.radius $l.slope</p>"#,
    ),
    (
        "curves",
        r#"<mathInput name="f" prefill="x^2"/><numberInput name="t" value="1"/>
<graph name="g"><function name="h">$f + $t x</function><derivative name="dh">$h</derivative>
<function name="c">sin(x) + $t</function></graph>
<evaluate name="e" function="$h" input="$t"/><point name="p" x="1" y="$e"/>
<boolean name="eq">$f = x^2</boolean><p>$eq</p>"#,
    ),
    (
        "choices",
        r#"<choiceInput name="ci"><choice>one</choice><choice>two <m>x</m></choice></choiceInput>
<select name="s" numToSelect="1"><option><numberInput name="n"/></option><option><numberInput name="n" value="2"/></option></select>
<textInput name="ti" prefill="hi"/><text name="t">$ti</text><p>$ci.selectedIndex $t</p>"#,
    ),
    (
        "bounds",
        r#"<numberInput name="w" value="4"/><number name="neg">-$w</number>
<graph name="g" xmin="$neg" xmax="$w"><point name="p" x="1" y="1"/></graph>
<graph name="h" xmin="-3" xmax="3" ymin="-3" ymax="3"><point name="q"/></graph>"#,
    ),
    (
        "around",
        r#"<booleanInput name="b"/><numberInput name="count" value="3"/>
<conditionalContent name="cc"><case condition="$b"><numberInput name="m"/></case><else><numberInput name="m" value="5"/></else></conditionalContent>
<repeatForSequence name="r" from="1" to="$count" valueName="i"><p><numberInput name="x" value="$i"/><number name="y">$x $i</number></p></repeatForSequence>
<graph><point name="hidden" hide="$b"/></graph><number name="next">$count + 1</number>
<answer name="ans"><mathInput name="mi"/><award><math>x+1</math></award></answer>
<updateValue name="uv" target="$count" newValue="$next"/>"#,
    ),
];

#[test]
fn definitions_sign_as_the_program_does() {
    let docs = documents();
    let pairs = par_map(&docs, |(name, dast)| {
        let (from_program, from_definitions) =
            signature_pair(dast).unwrap_or_else(|e| panic!("{name}: {e}"));
        (name.clone(), from_program, from_definitions)
    });
    for (name, from_program, from_definitions) in pairs {
        assert_eq!(
            from_program, from_definitions,
            "{name}: the signature read off the definitions differs from the program's"
        );
    }
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

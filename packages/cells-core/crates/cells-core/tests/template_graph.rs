//! The compile's findings over the template graph (ADR 0032, step 8) on
//! documents of its own: the diagnostics the check gives each, word for
//! word, apart from accessibility's. They are what the check gave when the
//! template graph was held to the abstract build it replaced, on these and
//! every other document, and agreed: the refuse warnings, the prefill rule
//! and the elements that cannot be built. What the graph reads of every
//! build is `tests/every_count.rs`'s.

use cells_core::testing::par_map;
use cells_core::testing::test_utils::dast_json;

/// A document, and the check's diagnostics of it, accessibility's aside.
type Findings = (&'static str, &'static str, &'static [&'static str]);

/// Requests the program refuses or drops, and one it lands: the refuse
/// warnings.
const REFUSALS: &[Findings] = &[
    (
        "refused-square",
        r#"<numberInput name="n" value="2"/><graph><point name="p" x="$n * $n" y="0"/></graph>"#,
        &[
            "a request on 'p.x' is refused: the value it would write, 'n.value', reaches it along more than one path, so the request could not land where it asks",
        ],
    ),
    (
        "refused-two-paths",
        r#"<numberInput name="n" value="1"/><number name="a">$n + 1</number>
        <graph><point name="p" x="$a + $n" y="0"/></graph>"#,
        &[
            "a request on 'p.x' is refused: the value it would write, 'n.value', reaches it along more than one path, so the request could not land where it asks",
        ],
    ),
    (
        "dropped-power",
        r#"<numberInput name="n" value="2"/><graph><point name="p" x="$n^2" y="0"/></graph>"#,
        &[
            "a request on 'p.x' is dropped: it reaches an operator with no inverse (a power or a comparison)",
        ],
    ),
    (
        "landed",
        r#"<number name="k">2</number><numberInput name="n" value="3"/>
        <graph><point name="p" x="$k $n" y="0"/></graph>"#,
        &[],
    ),
    (
        // Two outputs of one circle operator, read together: a vector
        // operator's later outputs are its outputs too.
        "refused-circle-outputs",
        r#"<graph><point name="a">(0,0)</point><point name="b">(2,0)</point>
        <circle name="c" through="$a $b"/>
        <point name="p" x="$c.cx + $c.radius" y="0"/></graph>"#,
        &[
            "a request on 'p.x' is refused: the value it would write, 'a.x', reaches it along more than one path, so the request could not land where it asks",
        ],
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
        &[
            "a request on 'p.x' is refused: the value it would write, 'x.value', reaches it along more than one path, so the request could not land where it asks",
        ],
    ),
    (
        "refused-unnamed",
        r#"<numberInput name="n" value="2"/><graph><point x="$n * $n" y="0"/></graph>"#,
        &[
            "a request on '<point>.x' is refused: the value it would write, 'n.value', reaches it along more than one path, so the request could not land where it asks",
        ],
    ),
];

/// Prefills the rule refuses or allows: a computed value is refused, a
/// counted value and a given one are not.
const PREFILLS: &[Findings] = &[
    (
        "prefill-computed",
        r#"<number name="x">1</number><number name="n">$x + 1</number>
        <mathInput name="mi" prefill="$n"/>"#,
        &[
            "unsupported: prefill=\"$n.value\": a prefill reference must name a value that is not computed",
        ],
    ),
    (
        "prefill-counted",
        r#"<numberInput name="k" value="2"/>
        <graph><repeatForSequence name="r" length="$k"><point name="p">(1,2)</point></repeatForSequence></graph>
        <collect name="c" from="$r" componentType="point"/>
        <mathInput name="mi" prefill="$c.count"/>"#,
        &[],
    ),
    (
        "prefill-given",
        r#"<number name="n">5</number><mathInput name="mi" prefill="$n"/>"#,
        &[],
    ),
];

/// Documents the planners pass and the template graph's stamping fails,
/// one or more for each way it fails.
const RESOLVE_FAILURES: &[Findings] = &[
    (
        "no-default-prop",
        r#"<graph name="g"><point name="p">(1,2)</point></graph><number name="y">$g</number>"#,
        &["'g' has no default prop, so a bare reference to it cannot supply a value"],
    ),
    (
        "numeric-function-in-symbolic-math",
        r#"<number name="n">1</number><math name="m">round($n) + x</math>"#,
        &[
            "cannot parse math 'round( cellN0 ) + x': round, floor, min, max and clamp are for numeric math only",
        ],
    ),
    (
        "collect-from-by-a-cell",
        r#"<group name="g"><number>1</number><number>2</number></group>
        <collect name="c" from="$g" componentType="number"/><numberInput name="k" value="1"/>
        <collect name="c2" from="$c[$k]" componentType="number"/>"#,
        &["unsupported: <collect from> cannot be indexed by a cell"],
    ),
    (
        "list-copy-loop",
        r#"<graph><polygon name="a" extend="$b"/><polygon name="b" extend="$a"/></graph>"#,
        &[
            "dependency cycle involving component 'a'",
            "'$a' names a component with an error of its own, so this cannot be planned from it",
        ],
    ),
    (
        "tuple-over-a-cell",
        r#"<number name="n">1</number><boolean name="b">($n, x) = ($n, x)</boolean>"#,
        &[
            "cannot parse math '( cellN0 , x )': '( cellN0 , x )' is not supported in a math cell (a relation, tuple or multi-argument function)",
        ],
    ),
    (
        "whole-pick-of-two",
        r#"<select name="s" numToSelect="1">
          <option><number name="x">1</number><number name="z">1</number></option>
          <option><number name="x">2</number></option>
        </select>
        <number name="y">$s</number>"#,
        &[
            "unsupported: '$s' names a whole pick, so every option must hold one component, all of one type: name the content and use $s[k].name",
        ],
    ),
    (
        "component-by-a-cell-as-a-child",
        r#"<repeatForSequence name="r" length="2" indexName="i"><number name="x">$i</number></repeatForSequence>
        <numberInput name="k" value="1"/>
        <p>$r[$k]</p>"#,
        &[
            "unsupported: '$r' names a component by a cell, which only a value can be read through: name a prop of it",
        ],
    ),
    (
        "component-by-a-cell-extended",
        r#"<repeatForSequence name="r" length="2" indexName="i"><number name="x">$i</number></repeatForSequence>
        <numberInput name="k" value="1"/>
        <number name="y" extend="$r[$k]"/>"#,
        &[
            "unsupported: '$r' names a component by a cell, which only a value can be read through: name a prop of it",
        ],
    ),
    (
        "whole-conditional-copied",
        r#"<conditionalContent name="cc" condition="true"><number name="x">1</number></conditionalContent><p>$cc</p>"#,
        &[
            "not allowed: copying a whole <conditionalContent>: reference its interface names instead",
        ],
    ),
    (
        "extend-text-as-number",
        r#"<text name="t">a</text><number name="n" extend="$t"/>"#,
        &[
            "cannot extend a <text> (extend=\"$t\") as a <number>: only related types may differ (a number and a math, an input and its value type)",
        ],
    ),
    (
        "extend-text-as-point",
        r#"<text name="t">a</text><point name="p" extend="$t"/>"#,
        &[
            "cannot extend a <text> (extend=\"$t\") as a <point>: only related types may differ (a number and a math, an input and its value type)",
        ],
    ),
    (
        "collect-item-indexed",
        r#"<group name="g"><number>1</number></group>
        <collect name="c" from="$g" componentType="number"/>
        <number name="y">$c[1][1]</number>"#,
        &["'$c' cannot be indexed; only repeats and collects can"],
    ),
    (
        "collected-point-inside-numeric-math",
        r#"<group name="g"><point>(1,2)</point><point>(3,4)</point></group>
        <collect name="c" from="$g" componentType="point"/><numberInput name="k" value="1"/>
        <number name="y">$c[$k] + 1</number>"#,
        &["cannot parse math 'c': a reference inside math must name one cell"],
    ),
    (
        "collected-point-inside-symbolic-math",
        r#"<point name="p">(1,2)</point><group name="g">$p</group>
        <collect name="c" from="$g" componentType="point"/><math name="y">$c[1] + x</math>"#,
        &["cannot parse math 'c': a reference inside math must name one cell"],
    ),
    (
        "collected-point-as-a-number",
        r#"<group name="g"><point>(1,2)</point></group>
        <collect name="c" from="$g" componentType="point"/>
        <number name="y">$c[1]</number>"#,
        &["prop 'value' of <number> expects 1 cell(s) but the reference supplies 2"],
    ),
    (
        "collected-number-as-a-center",
        r#"<group name="g"><number>1</number></group>
        <collect name="c" from="$g" componentType="number"/>
        <circle name="ci" center="$c[1]"/>"#,
        &["prop 'coords' of <circle> expects 2 cell(s) but the reference supplies 1"],
    ),
    (
        "point-as-a-flag",
        r#"<point name="p">(1,2)</point><number name="x" fixed="$p">1</number>"#,
        &["prop '' of <> expects 1 cell(s) but the reference supplies 2"],
    ),
];

// Each document's diagnostics are the ones recorded, in order.
#[test]
fn the_check_over_the_template_graph_finds_what_it_found() {
    let docs: Vec<Findings> = REFUSALS
        .iter()
        .chain(PREFILLS)
        .chain(RESOLVE_FAILURES)
        .copied()
        .collect();
    let failures: Vec<String> = par_map(&docs, |&(name, src, expected)| {
        let dast = cells_core::dast::load(dast_json(src).as_bytes()).unwrap();
        let found: Vec<String> = cells_core::diagnose(&dast)
            .into_iter()
            .filter(|d| !d.code.starts_with("doenet-a"))
            .map(|d| d.message)
            .collect();
        (found != expected).then(|| format!("{name}: found {found:?}, expected {expected:?}"))
    })
    .into_iter()
    .flatten()
    .collect();
    assert!(failures.is_empty(), "{}", failures.join("\n"));
}

// More references inside one math than an operator reads: the stamping
// refuses the math, and the element is boxed.
#[test]
fn a_math_over_more_references_than_an_operator_reads_is_refused() {
    let numbers: String = (0..260)
        .map(|k| format!(r#"<number name="a{k}">{k}</number>"#))
        .collect();
    let sum: Vec<String> = (0..260).map(|k| format!("$a{k}")).collect();
    let src = format!(r#"{numbers}<math name="m">{} + x</math>"#, sum.join(" + "));
    let dast = cells_core::dast::load(dast_json(&src).as_bytes()).unwrap();
    let found: Vec<String> = cells_core::diagnose(&dast)
        .into_iter()
        .map(|d| d.message)
        .collect();
    assert!(
        found.len() == 1 && found[0].ends_with("more than 255 references"),
        "{found:?}"
    );
}

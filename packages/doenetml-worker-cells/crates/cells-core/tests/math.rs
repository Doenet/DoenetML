//! `<math>`: numeric expressions lower to operators at build time; symbolic
//! ones are math cells holding engine handles, instantiated and evaluated by
//! symbolic instructions (ADR 0008).

mod common;

use cells_core::Document;
use cells_core::program::Op;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::req;

fn has_evaluate(doc: &Document) -> bool {
    doc.program
        .instrs
        .iter()
        .any(|i| matches!(i.op, Op::Sym(..)))
}

#[test]
fn numeric_math_lowers_to_operators_and_inverts_through_them() {
    let mut doc =
        load(r#"<numberInput name="a" value="2"/><math name="m">3$a + 2</math>"#).unwrap();
    assert_eq!(doc.value("m", "value"), Some(8.0));
    assert!(!has_evaluate(&doc), "a numeric math is plain operators");
    // Scale then Offset: two instructions, no fixed literal cells.
    assert_eq!(doc.program.len(), 2);
    assert_eq!(
        doc.n_fixed, 3,
        "only the (NaN) expression handle and the document's two credit cells are fixed"
    );
    // Dragging the math's value inverts through the lowered chain.
    doc.request(&[req(&doc, "m", "value", 14.0)]);
    assert_eq!(doc.value("a", "value"), Some(4.0));
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn number_children_accept_math_text() {
    let doc = load(r#"<numberInput name="a" value="3"/><number name="n">2$a^2 - (1 + $a)/2</number><number name="k">4 * pi</number>"#).unwrap();
    assert_eq!(doc.value("n", "value"), Some(16.0));
    assert!((doc.value("k", "value").unwrap() - 4.0 * std::f64::consts::PI).abs() < 1e-12);
    assert!(!has_evaluate(&doc));
}

#[test]
fn symbolic_math_is_a_handle_and_evaluates_to_nan() {
    let doc = load(r#"<numberInput name="a" value="2"/><math name="f">x^2 + $a</math><number name="n">$f</number>"#).unwrap();
    assert!(doc.value("f", "value").unwrap().is_nan());
    assert!(doc.value("n", "value").unwrap().is_nan());
    assert!(has_evaluate(&doc));
    let handle = doc.value("f", "expr").unwrap();
    assert!(handle.fract() == 0.0 && handle >= 0.0);
    // The handle is derived from the template and `a`: no inverse.
    let mut doc = doc;
    let tick = doc.request(&[req(&doc, "f", "expr", 0.0)]);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(doc.math_text(doc.cell("f", "expr").unwrap()), "x^2 + 2");
    doc.request(&[req(&doc, "a", "value", 5.0)]);
    assert_eq!(doc.math_text(doc.cell("f", "expr").unwrap()), "x^2 + 5");
}

#[test]
fn evaluate_at_feeds_a_symbolic_math_into_a_numeric_cell() {
    let mut doc = load(
        r#"<numberInput name="a" value="2"/><numberInput name="t" value="3"/>
           <math name="f">x^2 + $a</math>
           <evaluate name="e" function="$f" input="$t"/>
           <graph><point name="p" x="$t" y="$e"/></graph>"#,
    )
    .unwrap();
    assert_eq!(doc.value("e", "value"), Some(11.0));
    // Both the symbolic expression's cell leaf and the input are live.
    doc.request(&[req(&doc, "t", "value", 4.0)]);
    assert_eq!(doc.value("e", "value"), Some(18.0));
    doc.request(&[req(&doc, "a", "value", 1.0)]);
    assert_eq!(doc.value("e", "value"), Some(17.0));
    // No symbolic inverse: dragging the point's y is dropped, x still moves.
    let tick = doc.request(&[req(&doc, "p", "y", 5.0), req(&doc, "p", "x", 2.0)]);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(doc.value("t", "value"), Some(2.0));
    assert_eq!(doc.value("e", "value"), Some(5.0));
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn math_of_math_lowers_through_and_a_symbolic_leaf_stays_symbolic() {
    let doc = load(r#"<numberInput name="a" value="2"/><math name="m">$a + 1</math><math name="n">2$m</math><math name="g">$m + y</math>"#).unwrap();
    assert_eq!(doc.value("n", "value"), Some(6.0));
    assert!(doc.value("g", "value").unwrap().is_nan());
    // `$m` inside g is a numeric leaf: the lowered m's value, not its tree.
    assert_eq!(doc.math_text(doc.cell("g", "expr").unwrap()), "3 + y");
    assert!(
        doc.value("m", "expr").unwrap().is_nan(),
        "a numeric math is not a math cell"
    );
}

#[test]
fn math_parse_errors_are_reported() {
    let err = load(r#"<math name="m">3 +</math>"#).unwrap_err();
    assert!(matches!(err, cells_core::Error::BadMath { .. }), "{err}");
    let err = load(r#"<math name="m">(1 + 2</math>"#).unwrap_err();
    assert!(matches!(err, cells_core::Error::BadMath { .. }), "{err}");
}

#[test]
fn function_calls_lower_to_their_operators() {
    let mut doc = load(
        r#"<numberInput name="a" value="2.6"/><numberInput name="b" value="-4"/>
<number name="r">round($a)</number>
<number name="f">floor($a) + 1</number>
<number name="lo">min($a, $b, 0)</number>
<number name="hi">max($a, 2$b)</number>
<number name="c">clamp(3$a, -2*3, 6)</number>
<number name="k">max(1, round(2.5)) + floor(-0.5)</number>"#,
    )
    .unwrap();
    assert_eq!(doc.value("r", "value"), Some(3.0));
    assert_eq!(doc.value("f", "value"), Some(3.0));
    assert_eq!(doc.value("lo", "value"), Some(-4.0));
    assert_eq!(doc.value("hi", "value"), Some(2.6));
    assert_eq!(doc.value("c", "value"), Some(6.0));
    assert_eq!(doc.value("k", "value"), Some(2.0), "constant calls fold");
    assert!(!has_evaluate(&doc));
    // A clamp inverts by projection: asking for 9 asks for 6, so a = 2.
    doc.request(&[req(&doc, "c", "value", 9.0)]);
    assert_eq!(doc.value("a", "value"), Some(2.0));
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn function_calls_build_the_same_operators_as_op() {
    let ops = |src: &str| {
        let doc = load(src).unwrap();
        doc.program
            .instrs
            .iter()
            .map(|i| match i.op {
                Op::Min(..) => "Min".to_string(),
                Op::Clamp(_, lo, hi) => format!("Clamp {lo} {hi}"),
                other => format!("{other:?}"),
            })
            .collect::<Vec<_>>()
    };
    let a = r#"<numberInput name="a" value="2"/><numberInput name="b" value="1"/>"#;
    assert_eq!(
        ops(&format!(
            "{a}<number name='c'>clamp(min($a, $b), -9, 9)</number>"
        )),
        ops(&format!(
            r#"{a}<op name="m" kind="min" args="$a $b"/><op name="c" kind="clamp" lo="-9" hi="9" args="$m"/>"#
        )),
    );
}

#[test]
fn function_call_errors_are_reported() {
    for text in [
        "round($a, 1)",
        "min($a)",
        "clamp($a, 0)",
        "clamp($a, $a, 1)",
        "clamp($a, 2, 1)",
        "max($a, 1",
        "round(x)",
    ] {
        let err = load(&format!(
            r#"<numberInput name="a" value="2"/><math name="m">{text}</math>"#
        ))
        .unwrap_err();
        assert!(
            matches!(err, cells_core::Error::BadMath { .. }),
            "{text}: {err}"
        );
    }
}

//! A `<math>`'s own text is read as the current core reads it (ADR 0083):
//! text the compile's parser does not read is the engine's (LaTeX, a
//! missing operand, subscripts of expressions, `±`), and the literal
//! attributes `format`, `splitSymbols` and `functionSymbols` say how the
//! engine reads it.

mod common;
use common::v;

use cells_core::testing::test_utils::{load, load_error};

fn text(doc: &cells_core::Document, name: &str) -> String {
    doc.math_text(doc.cell(name, "expr").unwrap())
}

#[test]
fn latex_is_read_as_latex() {
    let doc = load(
        r#"<math name="m" format="latex">\frac{x}{z}</math>
           <math name="h" format="latex">\frac{1}{2}</math>
           <math name="n" format="latex">2</math>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "m"), "x/z");
    assert_eq!(text(&doc, "h"), "1/2");
    assert_eq!(v(&doc, "h", "value"), 0.5);
    assert_eq!(v(&doc, "n", "value"), 2.0);
}

#[test]
fn latex_holding_a_reference_is_refused() {
    let (code, m) = load_error(
        r#"<number name="a">2</number><math name="m" format="latex">\frac{$a}{z}</math>"#,
    );
    assert_eq!(code, "cells-bad-math", "{m}");
}

#[test]
fn symbols_split_unless_the_math_says_not_to() {
    let doc = load(
        r#"<math name="a">xyz</math>
           <math name="b" splitSymbols="false">xyz</math>
           <math name="c" splitSymbols="true">xyz</math>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "a"), "x y z");
    assert_eq!(text(&doc, "b"), "xyz");
    assert_eq!(text(&doc, "c"), "x y z");
}

#[test]
fn function_symbols_are_applied() {
    let doc = load(
        r#"<math name="a">h(x)</math>
           <math name="b" functionSymbols="h">h(x)</math>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "a"), "h x");
    assert_eq!(text(&doc, "b"), "h(x)");
}

#[test]
fn a_bound_reading_attribute_is_refused() {
    let (code, m) =
        load_error(r#"<booleanInput name="s"/><math name="m" splitSymbols="$s">xyz</math>"#);
    assert_eq!(code, "cells-banned", "{m}");
}

#[test]
fn text_the_compile_does_not_read_is_the_engines() {
    let doc = load(
        r#"<number name="n">3</number>
           <math name="a">2x_1y_23+z_456</math>
           <math name="b">a ± b</math>
           <math name="c">x^() + /2</math>
           <math name="d">$n x^()</math>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "a"), "2 x_1 y_23 + z_456");
    assert_eq!(text(&doc, "b"), "a ± b");
    assert_eq!(text(&doc, "c"), "x^＿ + ＿/2");
    assert_eq!(text(&doc, "d"), "3 x^＿");
}

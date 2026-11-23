//! A `<mathInput>` bound to a cell that holds an expression (an entry of a
//! math list, a symbolic math, another input) has that expression as its
//! own: it shows it, and typing writes an expression there, never a
//! number (ADR 0041, step 2). One bound to a number stays numeric.

mod common;

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::{set, type_into, v};

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

#[test]
fn an_input_bound_to_a_math_list_entry_writes_an_expression() {
    let mut doc = load(
        r#"<mathList name="ml">x y+1</mathList>
           <mathInput name="mi" bindValueTo="$ml[1]"/>
           <mathInput name="mj">$ml[2]</mathInput>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "mi"), "x");
    assert_eq!(text(&doc, "mj"), "y + 1");
    type_into(&mut doc, "mi", "z^2");
    assert_eq!(text(&doc, "ml"), "z^2, y + 1");
    assert_eq!(text(&doc, "mi"), "z^2");
    // A number typed is an expression too, not a handle's index.
    type_into(&mut doc, "mj", "5");
    assert_eq!(text(&doc, "ml"), "z^2, 5");
    assert_eq!(text(&doc, "mj"), "5");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn an_input_bound_to_a_symbolic_math_shows_and_writes_its_expression() {
    let mut doc = load(
        r#"<mathInput name="mi0" prefill="(0,1)"/>
           <math name="a">$mi0</math>
           <mathInput name="mi" bindValueTo="$a"/>
           <math name="c">x+1</math>
           <mathInput name="mc" bindValueTo="$c"/>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "mi"), "(0, 1)");
    assert_eq!(text(&doc, "mc"), "x + 1");
    type_into(&mut doc, "mi", "z^2");
    assert_eq!(text(&doc, "a"), "z^2");
    assert_eq!(text(&doc, "mi0"), "z^2");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn an_input_bound_to_a_number_stays_numeric() {
    let mut doc = load(
        r#"<number name="n">3</number>
           <mathInput name="mi" bindValueTo="$n"/>"#,
    )
    .unwrap();
    assert!(v(&doc, "mi", "expr").is_nan());
    assert_eq!(text(&doc, "mi"), "3");
    set(&mut doc, "mi", "value", 7.0);
    assert_eq!(v(&doc, "n", "value"), 7.0);
}

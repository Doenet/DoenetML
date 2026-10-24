//! `<boolean>`: literal content as an essential 0/1 cell, a lone reference
//! as an alias, conditions over numeric math, and `=` between
//! expressions compared in the engine under the compare attributes.

mod common;

use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_error};
use common::{req, set, type_into, v};

fn b(doc: &cells_core::Document, name: &str) -> f64 {
    v(doc, name, "value")
}

#[test]
fn empty_boolean_is_essential_and_false() {
    let mut doc = load(r#"<boolean name="b"/>"#).unwrap();
    assert_eq!(b(&doc, "b"), 0.0);
    assert!(doc.is_essential(doc.cell("b", "value").unwrap()));
    assert_eq!(doc.rendered_text(doc.component("b").unwrap()), "false");
    let t = set(&mut doc, "b", "value", 1.0);
    assert!(t.dropped.is_empty());
    assert_eq!(b(&doc, "b"), 1.0);
    assert_eq!(doc.rendered_text(doc.component("b").unwrap()), "true");
}

#[test]
fn update_value_writes_an_empty_boolean() {
    let mut doc = load(
        r#"<boolean name="b"/>
        <updateValue name="uv" target="$b" newValue="true"/>"#,
    )
    .unwrap();
    assert_eq!(b(&doc, "b"), 0.0);
    doc.trigger(doc.component("uv").unwrap());
    assert_eq!(b(&doc, "b"), 1.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn literal_content_is_state_with_that_initial_value() {
    let mut doc = load(
        r#"<boolean name="t">true</boolean><boolean name="f">false</boolean>
        <boolean name="mixed">trUe</boolean>
        <boolean name="one">1</boolean><boolean name="ten">10</boolean>"#,
    )
    .unwrap();
    assert_eq!(b(&doc, "t"), 1.0);
    assert_eq!(b(&doc, "f"), 0.0);
    assert_eq!(b(&doc, "mixed"), 1.0);
    assert_eq!(b(&doc, "one"), 1.0);
    assert_eq!(b(&doc, "ten"), 0.0);
    assert!(doc.is_essential(doc.cell("f", "value").unwrap()));
    set(&mut doc, "f", "value", 1.0);
    assert_eq!(b(&doc, "f"), 1.0);
}

#[test]
fn a_lone_reference_aliases_the_referent() {
    let mut doc = load(
        r#"<booleanInput name="bi"/>
        <boolean name="b1">$bi</boolean>
        <boolean name="b2" extend="$bi"/>
        <boolean name="b3" extend="$b2"/>
        <boolean name="lit">true</boolean>
        <booleanInput name="bound" bindValueTo="$lit"/>"#,
    )
    .unwrap();
    let bi = doc.cell("bi", "value").unwrap();
    assert_eq!(doc.cell("b1", "value"), Some(bi));
    assert_eq!(doc.cell("b2", "value"), Some(bi));
    assert_eq!(doc.cell("b3", "value"), Some(bi));
    assert_eq!(doc.cell("bound", "value"), doc.cell("lit", "value"));
    // Writing through a copy writes the input.
    set(&mut doc, "b3", "value", 1.0);
    assert_eq!(b(&doc, "bi"), 1.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn conditions_over_numbers() {
    let mut doc = load(
        r#"<numberInput name="n" value="2"/><booleanInput name="a"/><booleanInput name="c"/>
        <boolean name="gt">$n > 3</boolean>
        <boolean name="le">$n <= 2</boolean>
        <boolean name="eq">$n + 1 = 3</boolean>
        <boolean name="ne">$n != 2</boolean>
        <boolean name="logic">$a and not $c</boolean>
        <boolean name="t">not(not true or false)</boolean>
        <boolean name="f">true and not true</boolean>
        <boolean name="notx">not x</boolean>"#,
    )
    .unwrap();
    assert_eq!(b(&doc, "gt"), 0.0);
    assert_eq!(b(&doc, "le"), 1.0);
    assert_eq!(b(&doc, "eq"), 1.0);
    assert_eq!(b(&doc, "ne"), 0.0);
    assert_eq!(b(&doc, "logic"), 0.0);
    assert_eq!(b(&doc, "t"), 1.0);
    assert_eq!(b(&doc, "f"), 0.0);
    // A free symbol evaluates to NaN, which is not truthy.
    assert_eq!(b(&doc, "notx"), 1.0);
    assert!(!doc.is_essential(doc.cell("gt", "value").unwrap()));
    set(&mut doc, "n", "value", 5.0);
    assert_eq!(b(&doc, "gt"), 1.0);
    assert_eq!(b(&doc, "le"), 0.0);
    assert_eq!(b(&doc, "eq"), 0.0);
    assert_eq!(b(&doc, "ne"), 1.0);
    set(&mut doc, "a", "value", 1.0);
    assert_eq!(b(&doc, "logic"), 1.0);
    set(&mut doc, "c", "value", 1.0);
    assert_eq!(b(&doc, "logic"), 0.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn functions_the_lowering_does_not_know_are_evaluated_by_the_engine() {
    let mut doc = load(
        r#"<numberInput name="i" value="1"/>
        <boolean name="small">abs(cos(pi*$i/2)) < 10^(-12)</boolean>
        <boolean name="sq">sqrt($i) = 1</boolean>"#,
    )
    .unwrap();
    assert_eq!(b(&doc, "small"), 1.0);
    assert_eq!(b(&doc, "sq"), 1.0);
    set(&mut doc, "i", "value", 2.0);
    assert_eq!(b(&doc, "small"), 0.0);
    assert_eq!(b(&doc, "sq"), 0.0);
    set(&mut doc, "i", "value", 3.0);
    assert_eq!(b(&doc, "small"), 1.0);
}

#[test]
fn equality_of_expressions_in_the_engine() {
    let doc = load(
        r#"<boolean name="n1">sin^(-1)(x) = arcsin(x)</boolean>
        <boolean name="s1" symbolicEquality>sin^(-1)(x) = arcsin(x)</boolean>
        <boolean name="n2">sin^(-1)(1) = pi/2</boolean>
        <boolean name="s2" symbolicEquality>sin^(-1)(1) = pi/2</boolean>
        <boolean name="ss2" symbolicEquality simplifyOnCompare>sin^(-1)(1) = pi/2</boolean>
        <boolean name="sse2" symbolicEquality simplifyOnCompare expandOnCompare>sin^(-1)(1) = pi/2</boolean>
        <boolean name="n3">(x+1)^2 = x^2 + 2x + 1</boolean>
        <boolean name="s3" symbolicEquality>(x+1)^2 = x^2 + 2x + 1</boolean>
        <boolean name="ss3" symbolicEquality simplifyOnCompare>(x+1)^2 = x^2 + 2x + 1</boolean>
        <boolean name="sse3" symbolicEquality simplifyOnCompare expandOnCompare>(x+1)^2 = x^2 + 2x + 1</boolean>
        <boolean name="ne">x + 1 != x + 2</boolean>
        <boolean name="xy">xy = x*y</boolean>
        <boolean name="diff">x = y</boolean>
        <boolean name="tuple">(a, b) = (a, b)</boolean>
        <boolean name="pct">50% = 0.5</boolean>"#,
    )
    .unwrap();
    assert_eq!(b(&doc, "n1"), 1.0);
    assert_eq!(b(&doc, "s1"), 1.0);
    assert_eq!(b(&doc, "n2"), 1.0);
    assert_eq!(b(&doc, "s2"), 0.0);
    assert_eq!(b(&doc, "ss2"), 1.0);
    assert_eq!(b(&doc, "sse2"), 1.0);
    assert_eq!(b(&doc, "n3"), 1.0);
    assert_eq!(b(&doc, "s3"), 0.0);
    assert_eq!(b(&doc, "ss3"), 0.0);
    assert_eq!(b(&doc, "sse3"), 1.0);
    assert_eq!(b(&doc, "ne"), 1.0);
    assert_eq!(b(&doc, "xy"), 1.0);
    assert_eq!(b(&doc, "diff"), 0.0);
    assert_eq!(b(&doc, "tuple"), 1.0);
    assert_eq!(b(&doc, "pct"), 1.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn equality_with_a_math_input_follows_what_is_typed() {
    let mut doc = load(
        r#"<mathInput name="m"/>
        <boolean name="b">$m = x</boolean>
        <boolean name="s" symbolicEquality>$m = 2x</boolean>"#,
    )
    .unwrap();
    assert_eq!(b(&doc, "b"), 0.0);
    type_into(&mut doc, "m", "x");
    assert_eq!(b(&doc, "b"), 1.0);
    assert_eq!(b(&doc, "s"), 0.0);
    type_into(&mut doc, "m", "x+x");
    assert_eq!(b(&doc, "b"), 0.0);
    assert_eq!(b(&doc, "s"), 0.0);
    type_into(&mut doc, "m", "2x");
    assert_eq!(b(&doc, "s"), 1.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_boolean_drives_a_choice_and_an_answer_does_not_change() {
    let mut doc = load(
        r#"<numberInput name="n" value="1"/>
        <boolean name="big">$n > 2</boolean>
        <conditionalContent name="cc" condition="$big"><number name="x">7</number></conditionalContent>"#,
    )
    .unwrap();
    assert_eq!(doc.rendered_text(doc.component("cc").unwrap()), "");
    doc.request(&[req(&doc, "n", "value", 3.0)]);
    assert_eq!(doc.rendered_text(doc.component("cc").unwrap()), "7");
}

#[test]
fn child_elements_are_unsupported_by_name() {
    let unsupported = |src: &str| {
        let (code, msg) = load_error(src);
        assert_eq!(code, "cells-unsupported", "{msg}");
        msg
    };
    let msg =
        unsupported(r#"<boolean><mathList>1 2</mathList> = <mathList>1 2</mathList></boolean>"#);
    assert!(msg.contains("<mathList>"), "{msg}");
    let msg = unsupported(r#"<boolean><text>a</text> = a</boolean>"#);
    assert!(msg.contains("<text>"), "{msg}");
}

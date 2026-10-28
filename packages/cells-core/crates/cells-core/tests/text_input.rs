//! `<textInput>` and text that changes at tick time: essential text cells,
//! interning, binding to a `<text>`, rendered text, rebuilds and text
//! comparisons.

mod common;

use cells_core::Error;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_error};
use cells_core::{Document, Request};
use common::{set, v};

fn text(doc: &Document, name: &str) -> String {
    doc.text_value(doc.cell(name, "value").unwrap())
}

/// Type `s` into the text input `name`: intern, then request the id.
fn type_text(doc: &mut Document, name: &str, s: &str) {
    let id = doc.intern(s);
    let t = set(doc, name, "value", id);
    assert!(t.dropped.is_empty(), "dropped {:?}", t.dropped);
}

#[test]
fn prefill_is_the_essential_value() {
    let doc = load(r#"<textInput name="ti" prefill="hello"/>"#).unwrap();
    assert_eq!(text(&doc, "ti"), "hello");
    assert!(doc.is_essential(doc.cell("ti", "value").unwrap()));
}

#[test]
fn empty_input_holds_the_empty_string() {
    let mut doc = load(r#"<textInput name="ti"/>"#).unwrap();
    assert_eq!(text(&doc, "ti"), "");
    assert!(doc.is_essential(doc.cell("ti", "value").unwrap()));
    type_text(&mut doc, "ti", "bye");
    assert_eq!(text(&doc, "ti"), "bye");
}

#[test]
fn literal_text_is_its_value_and_empty_text_is_blank() {
    let mut doc = load(
        r#"<text name="t">hello there</text><text name="e"/>
        <textInput name="ei" bindValueTo="$e"/>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "t"), "hello there");
    assert_eq!(text(&doc, "e"), "");
    // An input bound to the text makes it state (ADR 0018).
    assert!(doc.is_essential(doc.cell("e", "value").unwrap()));
    type_text(&mut doc, "ei", "filled");
    assert_eq!(text(&doc, "e"), "filled");
}

#[test]
fn bind_value_to_writes_through_to_the_text() {
    let mut doc = load(
        r#"<text name="t1">hello</text>
        <textInput name="ti" bindValueTo="$t1"/>
        <text name="copy">$ti</text>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "ti"), "hello");
    assert_eq!(doc.cell("ti", "value"), doc.cell("t1", "value"));
    assert_eq!(doc.cell("copy", "value"), doc.cell("t1", "value"));
    type_text(&mut doc, "ti", "bye");
    assert_eq!(text(&doc, "t1"), "bye");
    assert_eq!(text(&doc, "copy"), "bye");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn reference_child_binds_like_bind_value_to() {
    let mut doc = load(r#"<text name="t1">a</text><textInput name="ti">$t1</textInput>"#).unwrap();
    assert_eq!(doc.cell("ti", "value"), doc.cell("t1", "value"));
    type_text(&mut doc, "ti", "b");
    assert_eq!(text(&doc, "t1"), "b");
}

#[test]
fn a_reference_child_wins_over_bind_value_to() {
    let doc = load(
        r#"<text name="t1">hello</text><text name="ignored">ignore me</text>
        <textInput name="ti" bindValueTo="$ignored">$t1</textInput>"#,
    )
    .unwrap();
    assert_eq!(doc.cell("ti", "value"), doc.cell("t1", "value"));
    assert_eq!(text(&doc, "ti"), "hello");
}

#[test]
fn text_inside_math_is_refused() {
    for src in [
        r#"<textInput name="ti"/><math>$ti</math>"#,
        r#"<text name="t">3</text><number>$t + 1</number>"#,
    ] {
        let (code, what) = load_error(src);
        assert!(
            code == "cells-unsupported" && what.contains("text value"),
            "{src}: {code} {what}"
        );
    }
}

#[test]
fn rendered_text_shows_the_input_and_its_references() {
    let mut doc = load(
        r#"<textInput name="ti" prefill="rain"/>
        <p name="p">You typed $ti and $ti.value.</p>"#,
    )
    .unwrap();
    let p = doc.component("p").unwrap();
    assert_eq!(doc.rendered_text(p), "You typed rain and rain.");
    type_text(&mut doc, "ti", "snow");
    assert_eq!(doc.rendered_text(p), "You typed snow and snow.");
}

#[test]
fn interning_dedups_and_the_same_text_gets_the_same_id() {
    let mut doc = load(r#"<text name="t">hello</text><textInput name="ti"/>"#).unwrap();
    let literal = doc.cells[doc.cell("t", "value").unwrap().index()];
    assert_eq!(doc.intern("hello"), literal);
    let n = doc.strings.len();
    let a = doc.intern("new words");
    let b = doc.intern("new words");
    assert_eq!(a, b);
    assert_eq!(doc.strings.len(), n + 1);
    let t = doc.request(&[Request {
        cell: doc.cell("ti", "value").unwrap(),
        value: a,
    }]);
    assert!(t.dropped.is_empty());
    assert_eq!(text(&doc, "ti"), "new words");
}

#[test]
fn interned_ids_survive_a_rebuild() {
    let mut doc = load(
        r#"<numberInput name="n">2</numberInput>
        <textInput name="ti"/>
        <text name="t"/><textInput name="tb" bindValueTo="$t"/>
        <repeatForSequence name="r" length="$n" valueName="v"><number name="m">$v</number></repeatForSequence>"#,
    )
    .unwrap();
    type_text(&mut doc, "ti", "kept");
    type_text(&mut doc, "tb", "also kept");
    let before = doc.strings.len();
    let t = set(&mut doc, "n", "value", 4.0);
    assert!(t.rebuilt);
    assert_eq!(doc.strings.len(), before);
    assert_eq!(text(&doc, "ti"), "kept");
    assert_eq!(text(&doc, "t"), "also kept");
    // Interning after the rebuild continues the same table.
    type_text(&mut doc, "ti", "after");
    assert_eq!(text(&doc, "ti"), "after");
    let t = set(&mut doc, "n", "value", 1.0);
    assert!(t.rebuilt);
    assert_eq!(text(&doc, "ti"), "after");
    assert_eq!(doc.intern("kept"), doc.intern("kept"));
}

#[test]
fn text_compares_by_id() {
    let mut doc = load(
        r#"<textInput name="ti" prefill="rain"/>
        <text name="t">snow</text>
        <boolean name="b1">$ti = rain</boolean>
        <boolean name="b2">snow != $ti</boolean>
        <boolean name="b3">$ti.value = $t</boolean>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "b1", "value"), 1.0);
    assert_eq!(v(&doc, "b2", "value"), 1.0);
    assert_eq!(v(&doc, "b3", "value"), 0.0);
    type_text(&mut doc, "ti", "snow");
    assert_eq!(v(&doc, "b1", "value"), 0.0);
    assert_eq!(v(&doc, "b2", "value"), 0.0);
    assert_eq!(v(&doc, "b3", "value"), 1.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn text_in_an_award_when() {
    let mut doc = load(
        r#"<textInput name="ti"/>
        <answer name="a"><award><when>$ti = rain</when></award></answer>"#,
    );
    // Out of scope unless the answer's planner admits text inputs: either
    // way it must not load as a numeric comparison.
    match doc {
        Ok(ref mut doc) => {
            type_text(doc, "ti", "rain");
            doc.submit(doc.component("a").unwrap());
            assert_eq!(v(doc, "a", "credit"), 1.0);
        }
        Err(Error::Unsupported(_)) => {}
        Err(e) => panic!("{e}"),
    }
}

#[test]
fn text_never_compares_as_a_number() {
    for src in [
        r#"<textInput name="ti"/><boolean>$ti < 3</boolean>"#,
        r#"<textInput name="ti"/><boolean>$ti + 1 = 2</boolean>"#,
        r#"<textInput name="ti"/><number name="n">3</number><boolean>$ti = $n</boolean>"#,
    ] {
        let (code, what) = load_error(src);
        assert!(
            code == "cells-unsupported" && what.contains("text value"),
            "{src}: {code} {what}"
        );
    }
}

#[test]
fn mixed_text_input_content_is_refused() {
    assert_eq!(
        load_error(r#"<textInput name="ti">hello</textInput>"#).0,
        "cells-unsupported"
    );
}

// Math reads numbers: a string id named inside math is refused.
#[test]
fn math_does_not_read_text() {
    let doc = load(r#"<text name="t">hi</text><number name="o">-$t</number>"#).unwrap();
    let errors: Vec<&str> = doc
        .diagnostics()
        .iter()
        .filter(|d| d.kind == cells_core::DiagnosticKind::Error)
        .map(|d| d.message.as_str())
        .collect();
    assert_eq!(errors, ["unsupported: a text value ($t) inside math"]);
}

// A choice's interface name holds what its branches hold: the value of a
// text named in every case is text, placed as one, before and after the
// case changes.
#[test]
fn a_text_interface_names_value_is_text() {
    let mut doc = load(
        r#"<booleanInput name="g"/>
<conditionalContent name="cc">
  <case condition="$g"><text name="t">yes</text></case>
  <else><text name="t">no</text></else>
</conditionalContent>
<p name="p1">$cc.t.value</p>"#,
    )
    .unwrap();
    let shown = |doc: &Document| doc.rendered_text(doc.component("p1").unwrap());
    assert_eq!(shown(&doc), "no");
    set(&mut doc, "g", "value", 1.0);
    assert_eq!(shown(&doc), "yes");
}

// The same through a select's pick.
#[test]
fn a_text_picked_by_a_select_is_text() {
    let doc = load(
        r#"<select name="s"><option><text name="t">hi</text></option></select>
<p name="p1">$s[1].t.value</p>"#,
    )
    .unwrap();
    assert_eq!(doc.rendered_text(doc.component("p1").unwrap()), "hi");
}

// A text extending another inherits its value, which is text when placed.
#[test]
fn a_text_extending_a_text_places_as_text() {
    let doc = load(
        r#"<p name="p1">$t2.value</p><text name="t1">hello</text><text name="t2" extend="$t1"/>"#,
    )
    .unwrap();
    assert_eq!(doc.rendered_text(doc.component("p1").unwrap()), "hello");
}

//! An `extend` with attributes or children of its own is the referent with
//! those changes (REF-3 of the principles), and what it takes from the
//! referent keeps the meaning it has there (REF-6, ADR 0023): a reference
//! in an inherited attribute, in inherited children or in an inherited
//! constraint binds where the referent sits, while a reference the extend
//! writes itself binds where the extend sits (NAME-4).

mod common;
use common::{set, v};

use cells_core::DiagnosticKind;
use cells_core::testing::test_utils::load;

/// Two sections each with an `n`; the point in the first reads it.
const TWO_SCOPES: &str = r#"
<section name="A">
  <number name="n">1</number>
  <boolean name="h">true</boolean>
  <circle name="c" center="(0,0)" radius="1"/>
  <point name="P" x="$n" y="0" hide="$h"/>
  <point name="T">($n, 0)</point>
  <point name="K" x="5" y="0"><constraints><constrainTo>$c</constrainTo></constraints></point>
</section>
<section name="B">
  <number name="n">2</number>
  <boolean name="h">false</boolean>
  <circle name="c" center="(10,0)" radius="1"/>
  <point name="Q" extend="$A.P" y="5"/>
  <point name="R" extend="$A.P" x="$n"/>
  <point name="U" extend="$A.T" y="5"/>
  <point name="L" extend="$A.K" y="0"/>
</section>"#;

#[test]
fn an_inherited_attribute_keeps_the_referents_binding() {
    let doc = load(TWO_SCOPES).unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .all(|d| d.kind != DiagnosticKind::Error),
        "{:?}",
        doc.diagnostics()
    );
    // `x="$n"` inherited from `A.P` is A's `n`, though B has one too.
    assert_eq!((v(&doc, "B.Q", "x"), v(&doc, "B.Q", "y")), (1.0, 5.0));
    // So is the inherited `hide="$h"`.
    assert_eq!(v(&doc, "B.Q", "hide"), 1.0);
}

#[test]
fn an_attribute_written_on_the_extend_binds_where_it_sits() {
    let mut doc = load(TWO_SCOPES).unwrap();
    assert_eq!(v(&doc, "B.R", "x"), 2.0);
    // And a write through it lands on B's `n`.
    assert!(set(&mut doc, "B.R", "x", 7.0).dropped.is_empty());
    assert_eq!(
        (v(&doc, "B.n", "value"), v(&doc, "A.n", "value")),
        (7.0, 1.0)
    );
}

#[test]
fn inherited_children_keep_the_referents_binding() {
    let doc = load(TWO_SCOPES).unwrap();
    // `($n, 0)` from `A.T`: A's `n`.
    assert_eq!((v(&doc, "B.U", "x"), v(&doc, "B.U", "y")), (1.0, 5.0));
}

#[test]
fn an_inherited_constraint_keeps_the_referents_binding() {
    let doc = load(TWO_SCOPES).unwrap();
    // `K` at (5, 0) constrained to A's unit circle at the origin lands at
    // (1, 0); constrained to B's circle at (10, 0) it would land at (9, 0).
    assert_eq!(v(&doc, "A.K", "x"), 1.0);
    assert_eq!(v(&doc, "B.L", "x"), 1.0);
}

/// An extend whose referent is reached by an index or sits in another
/// repeat or choice has nothing in this scope to take the rest from: with
/// attributes or children of its own it is refused, rather than planned
/// from its own attributes alone with defaults for the rest.
#[test]
fn overrides_on_an_extend_across_a_scope_are_refused() {
    let doc = load(
        r#"<repeatForSequence name="r" from="1" to="3" valueName="v">
             <point name="P" x="$v" y="0"/>
           </repeatForSequence>
           <point name="Q" extend="$r[2].P" y="5"/>
           <point name="S" extend="$r[2].P"/>"#,
    )
    .unwrap();
    let errors: Vec<_> = doc
        .diagnostics()
        .iter()
        .filter(|d| d.kind == DiagnosticKind::Error)
        .collect();
    assert_eq!(errors.len(), 1, "{:?}", doc.diagnostics());
    // The plan prints the path without its index.
    assert!(
        errors[0].message.contains("extend of '$r.P'"),
        "{}",
        errors[0].message
    );
    assert!(doc.component("Q").is_none());
    // The bare extend aliases the iteration's point.
    assert_eq!(v(&doc, "S", "x"), 2.0);
}

// Children written inside a container extend are appended after the
// referent's (REF-4), and a `<label>` child is a component of its element,
// which a reference presents through its referent (ADR 0024).

#[test]
fn children_written_inside_a_container_extend_are_appended() {
    let doc = load(
        r#"<p name="p">a<text name="t">x</text></p>
           <p name="pe" extend="$p">b<text name="u">y</text></p>"#,
    )
    .unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .all(|d| d.kind != DiagnosticKind::Error),
        "{:?}",
        doc.diagnostics()
    );
    let pe = doc.component("pe").unwrap();
    assert_eq!(doc.rendered_text(pe), "axby");
    // The clone of `t` is reached through the copy's name, and so is the
    // copy's own child.
    assert!(doc.component("pe.t").is_some());
    assert!(doc.component("pe.u").is_some());
    assert_eq!(doc.rendered_text(doc.component("p").unwrap()), "ax");
}

#[test]
fn a_label_child_is_kept_and_a_reference_knows_its_referent() {
    let doc = load(
        r#"<graph><point name="P">(1,2)<label>A</label></point></graph>
           <graph><point name="Q" extend="$P"/>$P</graph>
           <mathInput name="mi"><label>x</label></mathInput>"#,
    )
    .unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .all(|d| d.kind != DiagnosticKind::Error),
        "{:?}",
        doc.diagnostics()
    );
    let p = doc.component("P").unwrap();
    assert_eq!(v(&doc, "P", "x"), 1.0);
    // The label is a child component of the point, with its text.
    let kids: Vec<_> = doc
        .children(p)
        .filter_map(|c| match c {
            cells_core::Child::Component(k) => Some(k),
            _ => None,
        })
        .collect();
    assert_eq!(kids.len(), 1);
    assert_eq!(doc.rendered_text(kids[0]), "A");
    // References record what they refer to; the original refers to nothing.
    let q = doc.component("Q").unwrap();
    assert_eq!(doc.components.referent(q), Some(p));
    assert_eq!(doc.components.referent(p), None);
    let mi = doc.component("mi").unwrap();
    assert_eq!(doc.children(mi).count(), 1);
}

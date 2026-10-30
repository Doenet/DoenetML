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
    assert_eq!(doc.value("Q", "x"), None, "Q is boxed");
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
    let pe = doc.resolve_path("pe").unwrap();
    assert_eq!(doc.rendered_text(pe), "axby");
    // The clone of `t` is reached through the copy's name, and so is the
    // copy's own child.
    assert!(doc.resolve_path("pe.t").is_some());
    assert!(doc.resolve_path("pe.u").is_some());
    assert_eq!(doc.rendered_text(doc.resolve_path("p").unwrap()), "ax");
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
    let p = doc.resolve_path("P").unwrap();
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
    let q = doc.resolve_path("Q").unwrap();
    assert_eq!(doc.components.referent(q), Some(p));
    assert_eq!(doc.components.referent(p), None);
    let mi = doc.resolve_path("mi").unwrap();
    assert_eq!(doc.children(mi).count(), 1);
}

// A bare reference to an input is its value (REF-1a, ADR 0025), and an
// extend across related types is the referent's value as the element's
// type; any other pair is refused (REF-5, D26).

fn child_types(doc: &cells_core::Document, path: &str) -> Vec<&'static str> {
    let c = doc.resolve_path(path).unwrap();
    doc.children(c)
        .filter_map(|ch| match ch {
            cells_core::Child::Component(k) => Some(doc.component_type(k).tag()),
            _ => None,
        })
        .collect()
}

#[test]
fn a_bare_reference_to_an_input_is_its_value() {
    let mut doc = load(
        r#"<mathInput name="mi" prefill="2"/><textInput name="ti" prefill="hi"/>
           <booleanInput name="bi" value="true"/><numberInput name="ni" value="4"/>
           <p name="out">$mi $ti $bi $ni</p>
           <repeatForSequence name="r" from="1" to="1"><mathInput name="in" prefill="7"/></repeatForSequence>
           <p name="iter">$r[1]</p>
           <p name="second"><mathInput extend="$mi"/></p>"#,
    )
    .unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .all(|d| d.kind != DiagnosticKind::Error),
        "{:?}",
        doc.diagnostics()
    );
    assert_eq!(
        child_types(&doc, "out"),
        ["math", "text", "boolean", "number"]
    );
    // Through an iteration, and written out, it is the input.
    assert_eq!(child_types(&doc, "iter"), ["mathInput"]);
    assert_eq!(child_types(&doc, "second"), ["mathInput"]);
    // The value follows the input, and the math knows its referent.
    let out = doc.resolve_path("out").unwrap();
    let m = doc
        .children(out)
        .find_map(|ch| match ch {
            cells_core::Child::Component(k) => Some(k),
            _ => None,
        })
        .unwrap();
    assert_eq!(doc.components.referent(m), doc.resolve_path("mi"));
    assert_eq!(doc.rendered_text(m), "2");
    set(&mut doc, "mi", "value", 5.0);
    assert_eq!(doc.rendered_text(m), "5");
}

#[test]
fn an_extend_across_related_types_is_the_value_as_that_type() {
    let mut doc = load(
        r#"<number name="n">3</number>
           <math name="m" extend="$n"/>
           <math name="sym">x</math><number name="k" extend="$sym"/>
           <mathInput name="mi" extend="$n"/>
           <textInput name="ti" prefill="hi"/><text name="t" extend="$ti"/>"#,
    )
    .unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .all(|d| d.kind != DiagnosticKind::Error),
        "{:?}",
        doc.diagnostics()
    );
    assert_eq!(v(&doc, "m", "value"), 3.0);
    assert!(
        v(&doc, "k", "value").is_nan(),
        "a symbolic math has no number"
    );
    assert_eq!(doc.rendered_text(doc.resolve_path("t").unwrap()), "hi");
    // The input is bound to n: typing changes n, and m follows.
    assert!(set(&mut doc, "mi", "value", 8.0).dropped.is_empty());
    assert_eq!((v(&doc, "n", "value"), v(&doc, "m", "value")), (8.0, 8.0));
}

#[test]
fn an_extend_across_unrelated_types_is_refused() {
    let doc = load(r#"<section name="s"><p>x</p></section><math name="m" extend="$s"/><number name="ok">1</number>"#).unwrap();
    let errors: Vec<_> = doc
        .diagnostics()
        .iter()
        .filter(|d| d.kind == DiagnosticKind::Error)
        .collect();
    assert_eq!(errors.len(), 1, "{:?}", doc.diagnostics());
    assert_eq!(errors[0].code, "cells-extend-type-mismatch");
    assert!(
        errors[0].message.contains("<section>") && errors[0].message.contains("<math>"),
        "{}",
        errors[0].message
    );
    assert_eq!(v(&doc, "ok", "value"), 1.0);
}

/// What an extend shares with its referent does not depend on which comes
/// first in the document: the referent is planned before the copy reads
/// its shared state.
#[test]
fn an_extend_shares_state_whichever_comes_first() {
    for source in [
        r#"<graph><point name="P" x="1" y="2"/><point name="Q" extend="$P" y="5"/></graph>"#,
        r#"<graph><point name="Q" extend="$P" y="5"/><point name="P" x="1" y="2"/></graph>"#,
    ] {
        let mut doc = load(source).unwrap();
        assert_eq!(
            (v(&doc, "Q", "x"), v(&doc, "Q", "y")),
            (1.0, 5.0),
            "{source}"
        );
        // `x` is shared, from either side.
        assert!(set(&mut doc, "Q", "x", 7.0).dropped.is_empty(), "{source}");
        assert_eq!(v(&doc, "P", "x"), 7.0, "{source}");
        set(&mut doc, "P", "x", 3.0);
        assert_eq!(v(&doc, "Q", "x"), 3.0, "{source}");
        // `y` is the copy's own.
        set(&mut doc, "Q", "y", 6.0);
        assert_eq!(
            (v(&doc, "P", "y"), v(&doc, "Q", "y")),
            (2.0, 6.0),
            "{source}"
        );
    }
}

/// An index into a `<collect>` later in the document is planned as one
/// earlier is: the collect is planned first, so `$c[1]` is indexable, in
/// an `extend` and in an attribute.
#[test]
fn an_index_into_a_later_collect_is_planned_as_an_earlier_one() {
    let collect = r#"<repeatForSequence name="r" length="2"><number>3</number></repeatForSequence>
<collect name="c" from="$r" componentType="number"/>"#;
    let reads =
        r#"<math name="m" extend="$c[1]"/><graph><point name="P" x="$c[1]" y="2"/></graph>"#;
    for source in [format!("{collect}{reads}"), format!("{reads}{collect}")] {
        let doc = load(&source).unwrap();
        assert!(
            doc.diagnostics()
                .iter()
                .all(|d| d.kind != DiagnosticKind::Error),
            "{source}: {:?}",
            doc.diagnostics()
        );
        assert_eq!(
            (v(&doc, "m", "value"), v(&doc, "P", "x")),
            (3.0, 3.0),
            "{source}"
        );
    }
}

/// A container copy whose referent holds a `<collect>` is refused
/// whichever comes first; the collect is known as one once planned.
#[test]
fn a_copied_collect_is_refused_whichever_comes_first() {
    let repeat = r#"<repeatForSequence name="r" length="2"><point/></repeatForSequence>"#;
    let g = r#"<graph name="g"><collect name="c" from="$r" componentType="point"/></graph>"#;
    let copy = r#"<graph name="g2" extend="$g"/>"#;
    for source in [format!("{repeat}{g}{copy}"), format!("{repeat}{copy}{g}")] {
        let doc = load(&source).unwrap();
        let codes: Vec<_> = doc
            .diagnostics()
            .iter()
            .filter(|d| d.kind == DiagnosticKind::Error)
            .map(|d| d.code)
            .collect();
        assert_eq!(codes, ["cells-uncopyable-type"], "{source}");
    }
}

/// A container copy of a copy later in the document has the clones its
/// referent gets when planned.
#[test]
fn a_copy_of_a_later_container_copy_has_its_clones() {
    let g = r#"<graph name="g"><point name="A" x="3" y="0"/></graph>"#;
    let g2 = r#"<graph name="g2" extend="$g"/>"#;
    let g3 = r#"<graph name="g3" extend="$g2"/>"#;
    for source in [format!("{g}{g2}{g3}"), format!("{g3}{g2}{g}")] {
        let doc = load(&source).unwrap();
        assert_eq!(v(&doc, "g3.A", "x"), 3.0, "{source}");
    }
}

/// A cycle of extends with attributes of their own is a cycle in what
/// reads whose plan (ADR 0027): an error on an element of the cycle, not
/// a compile that never ends.
#[test]
fn a_cycle_of_extends_is_reported() {
    for source in [
        r#"<graph><point name="A" extend="$B" x="1"/><point name="B" extend="$A" y="2"/></graph>"#,
        r#"<graph><point name="A" extend="$A" x="1"/></graph>"#,
        r#"<graph name="g" extend="$h"/><graph name="h" extend="$g"/>"#,
    ] {
        let doc = load(source).unwrap_or_else(|e| panic!("{source}: {e}"));
        assert!(
            doc.diagnostics()
                .iter()
                .any(|d| d.kind == DiagnosticKind::Error
                    && d.node.is_some()
                    && d.message.contains("dependency cycle")),
            "{source}: {:?}",
            doc.diagnostics()
        );
    }
}

/// A reference into a `<math>` reads the type planning gives it (a tuple
/// of two is a point) whichever comes first in the document.
#[test]
fn a_reference_into_a_later_math_reads_its_planned_type() {
    let m = r#"<math name="m">(3, 4)</math>"#;
    let reads =
        r#"<graph><point name="P" x="$m.x" y="$m[2]"/><point name="Q" extend="$m"/></graph>"#;
    for source in [format!("{m}{reads}"), format!("{reads}{m}")] {
        let doc = load(&source).unwrap();
        assert!(
            doc.diagnostics()
                .iter()
                .all(|d| d.kind != DiagnosticKind::Error),
            "{source}: {:?}",
            doc.diagnostics()
        );
        assert_eq!(
            (v(&doc, "P", "x"), v(&doc, "P", "y"), v(&doc, "Q", "x")),
            (3.0, 4.0, 3.0),
            "{source}"
        );
    }
}

/// A cycle of values between elements is no cycle of plans: each is
/// planned without the other's, and the build reports the cycle.
#[test]
fn a_cycle_of_values_is_the_builds() {
    for source in [
        r#"<point name="a" x="$b.x"/><point name="b" x="$a.x"/>"#,
        r#"<math name="a">$b + 1</math><math name="b">$a + 1</math>"#,
    ] {
        let err = load(source)
            .err()
            .unwrap_or_else(|| panic!("{source}: loaded"));
        assert!(
            err.to_string().contains("dependency cycle"),
            "{source}: {err}"
        );
    }
}

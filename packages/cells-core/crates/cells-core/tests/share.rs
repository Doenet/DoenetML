//! Equal computations share one cell (ADR 0033), decided by the compile:
//! the plans alias a derived port to an equal one, and a math expression's
//! equal subexpressions are lowered once.

use cells_core::components::ComponentType;
use cells_core::testing::test_utils::dast_json;
use cells_core::{CompIdx, Document, LoadOptions};

fn load(src: &str, share: bool) -> Document {
    let options = LoadOptions {
        prune: false,
        share,
        ..Default::default()
    };
    Document::load(dast_json(src).as_bytes(), options)
        .unwrap()
        .0
}

/// The `prop` cells of every component of type `ty`, in order.
fn cells_of(doc: &Document, ty: ComponentType, prop: &str) -> Vec<cells_core::CellIdx> {
    CompIdx::below(doc.n_components())
        .filter(|&c| doc.component_type(c) == ty)
        .map(|c| {
            let cells = doc.prop_cells(c, prop).unwrap();
            assert_eq!(cells.len(), 1, "{prop}");
            cells[0]
        })
        .collect()
}

/// An extend in another template (a repeat's body) sees its referent
/// through its path: every iteration's circle shares the referent's
/// derived cells, though each is planned again from its own record.
#[test]
fn an_extend_in_a_repeat_shares_its_referents_cells() {
    let src = r#"<graph>
  <circle name="c" through="(0,0) (4,0) (0,3)"/>
  <repeatForSequence length="3"><circle extend="$c" styleNumber="2"/></repeatForSequence>
</graph>"#;
    let doc = load(src, true);
    for prop in ["radius", "area", "centerX"] {
        let cells = cells_of(&doc, ComponentType::Circle, prop);
        assert_eq!(cells.len(), 4, "{prop}");
        assert!(cells.iter().all(|&c| c == cells[0]), "{prop}: {cells:?}");
    }
    assert_eq!(doc.value("c", "radius"), Some(2.5));
    let unshared = load(src, false);
    let cells = cells_of(&unshared, ComponentType::Circle, "area");
    assert!(cells.iter().skip(1).all(|&c| c != cells[0]));
    assert!(doc.program.instrs.len() < unshared.program.instrs.len());
}

/// A subexpression two coordinates share is lowered once: `$a $b` is one
/// instruction, and each coordinate's own operator reads it.
#[test]
fn a_shared_subexpression_is_lowered_once() {
    let src = r#"<number name="a">2</number><number name="b">3</number>
<graph><point name="P" x="$a $b + 1" y="$a $b - 1"/></graph>"#;
    let (shared, unshared) = (load(src, true), load(src, false));
    for doc in [&shared, &unshared] {
        assert_eq!(doc.value("P", "x"), Some(7.0));
        assert_eq!(doc.value("P", "y"), Some(5.0));
    }
    assert_eq!(
        shared.program.instrs.len() + 1,
        unshared.program.instrs.len()
    );
}

/// Two unrelated elements with the same math share it, as two extends do;
/// a held one keeps its own (ADR 0022), and so does a draggable point's
/// coordinate beside a number's value, whose cells carry different marks.
#[test]
fn equal_math_shares_unless_marks_or_holds_differ() {
    let src = r#"<number name="a">2</number>
<number name="m">$a + 1</number>
<number name="n">$a + 1</number>
<number name="h" fixed>$a + 1</number>
<graph><point name="P" x="$a + 1" y="0"/></graph>"#;
    let doc = load(src, true);
    let cell = |name: &str, prop: &str| doc.cell(name, prop).unwrap();
    assert_eq!(cell("m", "value"), cell("n", "value"));
    assert_ne!(cell("h", "value"), cell("m", "value"));
    assert_ne!(cell("P", "x"), cell("m", "value"));
    for name in ["m", "n", "h"] {
        assert_eq!(doc.value(name, "value"), Some(3.0), "{name}");
    }
}

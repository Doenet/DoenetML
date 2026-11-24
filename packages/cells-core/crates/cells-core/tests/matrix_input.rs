//! `<matrixInput>`: a grid of boxes it owns (ADR 0045), sized by a
//! structural count (ADR 0041, step 4), typing into them, resizing, and
//! the matrix they make, as the current core's `matrixinput.test.ts`.

mod common;

use cells_core::components::ComponentType;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load_unpruned;
use cells_core::{Child, CompIdx, Document, Request};

/// The components among `c`'s children.
fn kids(doc: &Document, c: CompIdx) -> Vec<CompIdx> {
    doc.children(c)
        .filter_map(|k| match k {
            Child::Component(k) => Some(k),
            Child::Text(_) => None,
        })
        .collect()
}

/// The boxes of matrix input `name`, by row.
fn boxes(doc: &Document, name: &str) -> Vec<Vec<CompIdx>> {
    let mi = doc.resolve_path(name).unwrap();
    kids(doc, mi).into_iter().map(|r| kids(doc, r)).collect()
}

/// Type `s` into box (`i`, `j`), from 0, of `name`, as a renderer would.
fn type_into(doc: &mut Document, name: &str, i: usize, j: usize, s: &str) {
    let b = boxes(doc, name)[i][j];
    let h = doc.parse_math(s).unwrap();
    doc.request(&[Request {
        cell: doc.prop_cells(b, "expr").unwrap()[0],
        value: h,
    }]);
}

/// Ask for `name`'s `prop` (its `numRows` or `numColumns`) to be `v`, as
/// the renderer's size controls do.
fn resize(doc: &mut Document, name: &str, prop: &str, v: f64) {
    let c = doc.resolve_path(name).unwrap();
    doc.request(&[Request {
        cell: doc.prop_cells(c, prop).unwrap()[0],
        value: v,
    }]);
}

/// The expression a prop of `name` holds, as text; "" for a blank one.
fn text(doc: &Document, name: &str, prop: &str) -> String {
    let c = doc.resolve_path(name).unwrap();
    let cell = doc.prop_cells(c, prop).unwrap()[0];
    if doc.cells[cell.index()].is_nan() {
        String::new()
    } else {
        doc.math_text(cell)
    }
}

#[test]
fn a_grid_of_boxes_it_owns_and_the_matrix_they_make() {
    let mut doc = load_unpruned(r#"<matrixInput name="mi" numRows="2" numColumns="2"/>"#).unwrap();
    let bs = boxes(&doc, "mi");
    assert_eq!(bs.len(), 2);
    for row in &bs {
        assert_eq!(row.len(), 2);
        for &b in row {
            assert_eq!(doc.component_type(b), ComponentType::MatrixInputCell);
            assert!(doc.is_essential(doc.prop_cells(b, "expr").unwrap()[0]));
        }
    }
    type_into(&mut doc, "mi", 0, 0, "a");
    type_into(&mut doc, "mi", 1, 1, "d");
    assert_eq!(text(&doc, "mi", "expr"), "[[a, ＿], [＿, d]]");
    assert_eq!(reference::check(&doc), None);
}

/// A change of size rebuilds the grid, and each box keeps what was typed
/// into it by its row and column, as the current core's
/// `accumulatedComponents` does.
#[test]
fn a_resize_keeps_what_was_typed_by_row_and_column() {
    let mut doc = load_unpruned(r#"<matrixInput name="mi"/>"#).unwrap();
    assert_eq!(text(&doc, "mi", "expr"), "[[＿]]");
    type_into(&mut doc, "mi", 0, 0, "a");
    resize(&mut doc, "mi", "numRows", 2.0);
    type_into(&mut doc, "mi", 1, 0, "b");
    resize(&mut doc, "mi", "numColumns", 2.0);
    assert_eq!(text(&doc, "mi", "expr"), "[[a, ＿], [b, ＿]]");
    type_into(&mut doc, "mi", 0, 1, "c");
    type_into(&mut doc, "mi", 1, 1, "d");
    resize(&mut doc, "mi", "numRows", 1.0);
    assert_eq!(text(&doc, "mi", "expr"), "[[a, c]]");
    type_into(&mut doc, "mi", 0, 1, "e");
    resize(&mut doc, "mi", "numColumns", 1.0);
    type_into(&mut doc, "mi", 0, 0, "f");
    assert_eq!(text(&doc, "mi", "expr"), "[[f]]");
    resize(&mut doc, "mi", "numColumns", 2.0);
    resize(&mut doc, "mi", "numRows", 2.0);
    assert_eq!(text(&doc, "mi", "expr"), "[[f, e], [b, d]]");
    // Three columns: the third is new, and the second keeps its entries.
    resize(&mut doc, "mi", "numColumns", 3.0);
    assert_eq!(text(&doc, "mi", "expr"), "[[f, e, ＿], [b, d, ＿]]");
    resize(&mut doc, "mi", "numRows", 0.0);
    assert_eq!(doc.value("mi", "numRows"), Some(0.0));
    assert_eq!(reference::check(&doc), None);
}

/// A size that follows an input: the input's change rebuilds the grid,
/// and a request on the size writes the input. A size that is no number
/// counts none.
#[test]
fn a_size_that_follows_an_input() {
    let mut doc = load_unpruned(
        r#"<mathInput name="n"/>
           <matrixInput name="mi" prefill="(a,b)^T" numRows="$n" numColumns="2"/>"#,
    )
    .unwrap();
    assert_eq!(doc.value("mi", "numRows"), Some(0.0));
    resize(&mut doc, "mi", "numRows", 2.0);
    assert_eq!(doc.value("n", "value"), Some(2.0));
    assert_eq!(text(&doc, "mi", "expr"), "[[a, b], [＿, ＿]]");
    assert_eq!(reference::check(&doc), None);
}

/// Bound to a value, the size and the boxes are read from it, and typing
/// into a box writes the value with that entry replaced; a request on the
/// size writes it resized.
#[test]
fn bound_to_a_value_the_boxes_are_its_entries() {
    let mut doc = load_unpruned(
        r#"<mathInput name="m" prefill="(a,b)"/>
           <matrixInput name="mi" bindValueTo="$m"/>"#,
    )
    .unwrap();
    assert_eq!(doc.value("mi", "numRows"), Some(2.0));
    assert_eq!(text(&doc, "mi", "expr"), "[[a], [b]]");
    type_into(&mut doc, "mi", 1, 0, "q");
    assert_eq!(text(&doc, "m", "expr"), "(a, q)");
    assert_eq!(text(&doc, "mi", "expr"), "[[a], [q]]");
    resize(&mut doc, "mi", "numRows", 3.0);
    assert_eq!(text(&doc, "m", "expr"), "(a, q, ＿)");
    resize(&mut doc, "mi", "numColumns", 2.0);
    assert_eq!(text(&doc, "mi", "expr"), "[[a, ＿], [q, ＿], [＿, ＿]]");
    assert_eq!(reference::check(&doc), None);
}

/// Bound to a `<matrix>`, typing into a box writes the matrix's entry
/// (ADR 0060), and a copy of the matrix follows; the matrix's size is
/// fixed, so a request to resize is dropped.
#[test]
fn bound_to_a_matrix_typing_writes_its_entry() {
    let mut doc = load_unpruned(
        r#"<matrix name="A"><row>a b</row><row>c d</row></matrix>
           <matrix name="A2" extend="$A.value"/>
           <matrixInput name="mi" bindValueTo="$A"/>
           <matrixInput name="mi2" bindValueTo="$A2"/>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "mi", "expr"), "[[a, b], [c, d]]");
    type_into(&mut doc, "mi", 0, 1, "x");
    assert_eq!(text(&doc, "A", "expr"), "[[a, x], [c, d]]");
    assert_eq!(text(&doc, "A2", "expr"), "[[a, x], [c, d]]");
    // Through the copy of its value, to the matrix it copies.
    type_into(&mut doc, "mi2", 1, 0, "y");
    assert_eq!(text(&doc, "A", "expr"), "[[a, x], [y, d]]");
    resize(&mut doc, "mi", "numRows", 3.0);
    assert_eq!(doc.value("mi", "numRows"), Some(2.0));
    assert_eq!(reference::check(&doc), None);
}

/// `$A[i][j]` is entry (i, j) of a matrix, row then column (ADR 0041,
/// decisions 3 and 9), by literals or by cells; an input bound to one
/// writes the matrix's entry.
#[test]
fn an_entry_by_row_then_column_writes_back() {
    let mut doc = load_unpruned(
        r#"<matrix name="A"><row>a b</row><row>c d</row></matrix>
           <mathInput name="i" prefill="1"/><mathInput name="j" prefill="2"/>
           <math name="e">$A[$i][$j]</math>
           <mathInput name="w" bindValueTo="$A[2][1]"/>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "e", "expr"), "b");
    let w = doc.resolve_path("w").unwrap();
    let h = doc.parse_math("z").unwrap();
    doc.request(&[Request {
        cell: doc.prop_cells(w, "expr").unwrap()[0],
        value: h,
    }]);
    assert_eq!(text(&doc, "A", "expr"), "[[a, b], [z, d]]");
    let i = doc.resolve_path("i").unwrap();
    doc.request(&[Request {
        cell: doc.prop_cells(i, "value").unwrap()[0],
        value: 2.0,
    }]);
    let j = doc.resolve_path("j").unwrap();
    doc.request(&[Request {
        cell: doc.prop_cells(j, "value").unwrap()[0],
        value: 1.0,
    }]);
    assert_eq!(text(&doc, "e", "expr"), "z");
    assert_eq!(reference::check(&doc), None);
}

/// As an answer's input, its matrix is the response.
#[test]
fn as_an_answer_input() {
    let mut doc = load_unpruned(
        r#"<matrix name="A"><row>1 x</row></matrix>
           <answer name="ans"><matrixInput name="mi" numRows="1" numColumns="2"/>
             <award>$A</award></answer>"#,
    )
    .unwrap();
    type_into(&mut doc, "mi", 0, 0, "1");
    type_into(&mut doc, "mi", 0, 1, "x");
    let ans = doc.resolve_path("ans").unwrap();
    doc.submit(ans);
    assert_eq!(doc.value("ans", "creditAchieved"), Some(1.0));
}

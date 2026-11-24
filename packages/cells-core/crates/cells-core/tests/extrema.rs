//! A function's extrema (ADR 0061): the current core's numerical search
//! (`utils/extrema.js`), its results inside the function's math cells.

mod common;
use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

/// The expression `name.prop` holds, as the engine prints it.
fn expr(doc: &Document, name: &str, prop: &str) -> String {
    doc.math_text(doc.cell(name, prop).unwrap())
}

#[test]
fn a_functions_extrema_are_entries_of_its_math_cells() {
    let doc = load(
        r#"<function name="f">x^4-8x^2+8</function>
           <math name="a" extend="$f.minima[2]"/>
           <math name="b" extend="$f.minima[2][1]"/>
           <math name="c" extend="$f.maxima[1][2]"/>
           <math name="d" extend="$f.globalMinimum[2]"/>
           <math name="e" extend="$f.globalMaximum[1]"/>
           <math name="m" extend="$f.minima"/>
           <number name="n" extend="$f.numExtrema"/>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "m", "expr"), "(-2, -8), (2, -8)");
    assert_eq!(expr(&doc, "a", "expr"), "(2, -8)");
    assert_eq!(expr(&doc, "b", "expr"), "2");
    assert_eq!(expr(&doc, "c", "expr"), "8");
    assert_eq!(expr(&doc, "d", "expr"), "-8");
    // No maximum: the entry is the missing value.
    assert!(v(&doc, "e", "expr").is_nan());
    assert_eq!(v(&doc, "n", "value"), 3.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_piecewise_functions_extrema_are_its_pieces_and_its_corners() {
    let doc = load(
        r#"<piecewiseFunction name="f">
             <function domain="(-Infinity, 0)">-x</function>
             <function domain="[0, 2]">x^2-2x</function>
             <function domain="(2, Infinity)">x-2</function>
           </piecewiseFunction>
           <math name="min" extend="$f.minima"/>
           <math name="max" extend="$f.maxima"/>
           <math name="g" extend="$f.globalMinimum"/>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "min", "expr"), "(1, -1)");
    // At 0 it falls through, from the left and to the right: no maximum.
    assert_eq!(expr(&doc, "max", "expr"), "");
    assert_eq!(expr(&doc, "g", "expr"), "(1, -1)");
    assert_eq!(reference::check(&doc), None);
}

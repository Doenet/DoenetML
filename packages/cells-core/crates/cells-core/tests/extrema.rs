//! A function's extrema (ADR 0061): the current core's numerical search
//! (`utils/extrema.js`), its results inside the function's math cells.

mod common;
use cells_core::Document;
use cells_core::LoadOptions;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{dast_json, load};

/// `src` loaded with every cell computed, as a reader that evaluates a
/// function anywhere loads it (the parity adapter).
fn load_unpruned(src: &str) -> Document {
    let options = LoadOptions {
        prune: false,
        ..Default::default()
    };
    Document::load(dast_json(src).as_bytes(), options)
        .unwrap()
        .0
}
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

/// `name` at each of `xs`, as a reader evaluates it.
fn at(doc: &mut Document, name: &str, xs: &[f64]) -> Vec<f64> {
    let c = doc.resolve_path(name).unwrap();
    xs.iter()
        .map(|&x| doc.function_value(c, x).unwrap())
        .collect()
}

fn close(got: &[f64], want: &[f64]) {
    for (g, w) in got.iter().zip(want) {
        assert!((g - w).abs() < 1e-9, "{got:?} is not {want:?}");
    }
}

#[test]
fn a_function_through_points_maxima_and_minima_is_a_spline() {
    // `functionTag.test.ts`: "function with single minimum, change x-scale
    // and y-scale", "function with min and max", "copy function and
    // overwrite extrema".
    let mut doc = load_unpruned(
        r#"<function name="f" xscale="3" yscale="5" minima="(2)"/>
           <function name="g" minima="(0,0)" maxima="(1,1)"/>
           <function name="h" minima="(2,3)" maxima="(4,4)"/>
           <function name="k" extend="$h" maxima="(0,4)"/>
           <math name="hmax" extend="$h.maxima"/>"#,
    );
    close(&at(&mut doc, "f", &[0., 3., 6., -3.]), &[2., 7., 22., 7.]);
    close(
        &at(&mut doc, "g", &[0., 1., 0.5, -2., 3.]),
        &[0., 1., 0.5, 4., -3.],
    );
    close(
        &at(&mut doc, "h", &[2., 4., 1., 3., 5.]),
        &[3., 4., 4., 3.5, 3.],
    );
    close(
        &at(&mut doc, "k", &[0., 2., -1., 1., 3.]),
        &[4., 3., 3., 3.5, 4.],
    );
    assert_eq!(expr(&doc, "hmax", "expr"), "(4, 4)");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_spline_follows_the_points_it_is_given() {
    let mut doc = load(
        r#"<graph>
             <point name="P">(0,5)</point>
           </graph>
           <function name="f" through="$P (8,4)" maxima="(5,6)"/>
           <math name="m" extend="$f.maxima"/>"#,
    )
    .unwrap();
    close(&at(&mut doc, "f", &[0., 5., 8.]), &[5., 6., 4.]);
    set(&mut doc, "P", "x", -2.0);
    close(&at(&mut doc, "f", &[-2., 5.]), &[5., 6.]);
    assert_eq!(expr(&doc, "m", "expr"), "(5, 6)");
    assert_eq!(reference::check(&doc), None);
}

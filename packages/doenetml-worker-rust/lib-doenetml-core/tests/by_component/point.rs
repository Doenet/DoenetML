use super::*;

use doenetml_core::{components::doenet::point::PointProps, state::types::math_expr::MathExpr};

// Note: we can only test values points with numerical values, as otherwise it requires wasm to call out to math-expressions

const X_LOCAL_IDX: LocalPropIdx = PointProps::X.local_idx();
const Y_LOCAL_IDX: LocalPropIdx = PointProps::Y.local_idx();

#[test]
fn point_is_2d_zero_by_default() {
    let dast_root = dast_root_no_position(r#"<point></point>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the point will be index 1, as the document tag will be index 0.
    let point_idx = 1;

    let math_zero: MathExpr = 0.0.into();

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);

    assert_eq!(x_prop.value, math_zero.clone().into());
    assert_eq!(y_prop.value, math_zero.into());
}

#[test]
fn point_that_specifies_just_x() {
    let dast_root = dast_root_no_position(r#"<point x="-7"></point>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the point will be index 1, as the document tag will be index 0.
    let point_idx = 1;

    let math_x: MathExpr = (-7.0).into();
    let math_zero: MathExpr = 0.0.into();

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);

    assert_eq!(x_prop.value, math_x.into());
    assert_eq!(y_prop.value, math_zero.into());
}

#[test]
fn point_that_specifies_just_y() {
    let dast_root = dast_root_no_position(r#"<point y="3.1"></point>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the point will be index 1, as the document tag will be index 0.
    let point_idx = 1;

    let math_zero: MathExpr = 0.0.into();
    let math_y: MathExpr = 3.1.into();

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);

    assert_eq!(x_prop.value, math_zero.into());
    assert_eq!(y_prop.value, math_y.into());
}

#[test]
fn point_that_specifies_x_and_y() {
    let dast_root = dast_root_no_position(r#"<point x="8.9" y="6.2"></point>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the point will be index 1, as the document tag will be index 0.
    let point_idx = 1;

    let math_x: MathExpr = 8.9.into();
    let math_y: MathExpr = 6.2.into();

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);

    assert_eq!(x_prop.value, math_x.into());
    assert_eq!(y_prop.value, math_y.into());
}

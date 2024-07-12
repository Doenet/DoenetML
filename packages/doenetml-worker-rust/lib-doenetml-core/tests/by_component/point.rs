use super::*;

use doenetml_core::{components::doenet::point::PointProps, state::types::math_expr::MathExpr};

// Note: we cannot do much with point here, as it requires wasm to call out to math-expressions

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

    assert_eq!(x_prop.value, math_zero);

    dbg!(x_prop, y_prop);
}

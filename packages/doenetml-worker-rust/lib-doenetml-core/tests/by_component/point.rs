use super::*;

use doenetml_core::{
    components::{
        doenet::point::{PointActions, PointMoveActionArgs, PointProps},
        types::{Action, ActionBody},
        ActionsEnum,
    },
    state::types::math_expr::{JsMathExpr, MathExpr},
};

// Note: we can only test values points with numerical values, as otherwise it requires wasm to call out to math-expressions

const X_LOCAL_IDX: LocalPropIdx = PointProps::X.local_idx();
const Y_LOCAL_IDX: LocalPropIdx = PointProps::Y.local_idx();
const COORDS_LOCAL_IDX: LocalPropIdx = PointProps::Coords.local_idx();

#[test]
fn point_is_2d_zero_by_default() {
    let dast_root = dast_root_no_position(r#"<point name="P"></point>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let point_idx = core.get_component_index_by_name("P");

    let math_zero: MathExpr = 0.0.into();
    let math_zero_zero = MathExpr {
        math_object: JsMathExpr("[\"vector\",0,0]".to_string()),
    };

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);
    let coords_prop = core.get_prop(point_idx, COORDS_LOCAL_IDX);

    assert_eq!(x_prop.value, math_zero.clone().into());
    assert_eq!(y_prop.value, math_zero.into());
    assert_eq!(coords_prop.value, math_zero_zero.into());
}

#[test]
fn point_that_specifies_just_x() {
    let dast_root = dast_root_no_position(r#"<point name="P" x="-7"></point>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let point_idx = core.get_component_index_by_name("P");

    let math_x: MathExpr = (-7.0).into();
    let math_zero: MathExpr = 0.0.into();
    let math_coords = MathExpr {
        math_object: JsMathExpr("[\"vector\",-7,0]".to_string()),
    };

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);
    let coords_prop = core.get_prop(point_idx, COORDS_LOCAL_IDX);

    assert_eq!(x_prop.value, math_x.into());
    assert_eq!(y_prop.value, math_zero.into());
    assert_eq!(coords_prop.value, math_coords.into());
}

#[test]
fn point_that_specifies_just_y() {
    let dast_root = dast_root_no_position(r#"<point name="P" y="3.1"></point>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let point_idx = core.get_component_index_by_name("P");

    let math_zero: MathExpr = 0.0.into();
    let math_y: MathExpr = 3.1.into();
    let math_coords = MathExpr {
        math_object: JsMathExpr("[\"vector\",0,3.1]".to_string()),
    };

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);
    let coords_prop = core.get_prop(point_idx, COORDS_LOCAL_IDX);

    assert_eq!(x_prop.value, math_zero.into());
    assert_eq!(y_prop.value, math_y.into());
    assert_eq!(coords_prop.value, math_coords.into());
}

#[test]
fn point_that_specifies_x_and_y() {
    let dast_root = dast_root_no_position(r#"<point name="P" x="8.9" y="6.2"></point>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let point_idx = core.get_component_index_by_name("P");

    let math_x: MathExpr = 8.9.into();
    let math_y: MathExpr = 6.2.into();
    let math_coords = MathExpr {
        math_object: JsMathExpr("[\"vector\",8.9,6.2]".to_string()),
    };

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);
    let coords_prop = core.get_prop(point_idx, COORDS_LOCAL_IDX);

    assert_eq!(x_prop.value, math_x.into());
    assert_eq!(y_prop.value, math_y.into());
    assert_eq!(coords_prop.value, math_coords.into());
}

#[test]
fn move_default_point() {
    let dast_root = dast_root_no_position(r#"<point name="P"></point>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let point_idx = core.get_component_index_by_name("P");

    let move_action = Action {
        component_idx: point_idx.into(),
        action: ActionsEnum::Point(PointActions::Move(ActionBody {
            args: PointMoveActionArgs { x: 1.0, y: 3.2 },
        })),
    };

    let _ = core.dispatch_action(move_action);

    let math_x: MathExpr = 1.0.into();
    let math_y: MathExpr = 3.2.into();
    let math_coords = MathExpr {
        math_object: JsMathExpr("[\"vector\",1,3.2]".to_string()),
    };

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);
    let coords_prop = core.get_prop(point_idx, COORDS_LOCAL_IDX);

    assert_eq!(x_prop.value, math_x.clone().into());
    assert_eq!(y_prop.value, math_y.into());
    assert_eq!(coords_prop.value, math_coords.into());
}

#[test]
fn move_point_with_x() {
    // Note: in order to be able to invert the x-coordinate of `point` in this test environment without wasm,
    // the x-coordinate must reference a number.
    // Otherwise, the x-coordinate will be based on a string, and its `invert()` will be depend on `.to_text()` of `MathExpr`,
    // which requires a call to wasm to run.
    let dast_root =
        dast_root_no_position(r#"<number name="x">-5.2</number><point name="P" x="$x"></point>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let point_idx = core.get_component_index_by_name("P");

    let math_x: MathExpr = (-5.2).into();
    let math_y: MathExpr = 0.0.into();
    let math_coords = MathExpr {
        math_object: JsMathExpr("[\"vector\",-5.2,0]".to_string()),
    };

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);
    let coords_prop = core.get_prop(point_idx, COORDS_LOCAL_IDX);

    assert_eq!(x_prop.value, math_x.clone().into());
    assert_eq!(y_prop.value, math_y.into());
    assert_eq!(coords_prop.value, math_coords.into());

    let move_action = Action {
        component_idx: point_idx.into(),
        action: ActionsEnum::Point(PointActions::Move(ActionBody {
            args: PointMoveActionArgs { x: 1.0, y: 3.2 },
        })),
    };

    let _ = core.dispatch_action(move_action);

    let math_x: MathExpr = 1.0.into();
    let math_y: MathExpr = 3.2.into();
    let math_coords = MathExpr {
        math_object: JsMathExpr("[\"vector\",1,3.2]".to_string()),
    };

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);
    let coords_prop = core.get_prop(point_idx, COORDS_LOCAL_IDX);

    assert_eq!(x_prop.value, math_x.clone().into());
    assert_eq!(y_prop.value, math_y.into());
    assert_eq!(coords_prop.value, math_coords.into());
}

#[test]
fn move_point_with_x_and_y() {
    // Note: in order to be able to invert the coordinates of `point` in this test environment without wasm,
    // the coordinates must reference numbers.
    // Otherwise, the coordinates will be based on strings, and their `invert()` will be depend on `.to_text()` of `MathExpr`,
    // which requires a call to wasm to run.
    let dast_root = dast_root_no_position(
        r#"<number name="x">3.7</number><number name="y">4.8</number><point name="P" x="$x" y="$y"></point>"#,
    );

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let point_idx = core.get_component_index_by_name("P");

    let math_x: MathExpr = 3.7.into();
    let math_y: MathExpr = 4.8.into();
    let math_coords = MathExpr {
        math_object: JsMathExpr("[\"vector\",3.7,4.8]".to_string()),
    };

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);
    let coords_prop = core.get_prop(point_idx, COORDS_LOCAL_IDX);

    assert_eq!(x_prop.value, math_x.clone().into());
    assert_eq!(y_prop.value, math_y.into());
    assert_eq!(coords_prop.value, math_coords.into());

    let move_action = Action {
        component_idx: point_idx.into(),
        action: ActionsEnum::Point(PointActions::Move(ActionBody {
            args: PointMoveActionArgs { x: 1.0, y: -3.2 },
        })),
    };

    let _ = core.dispatch_action(move_action);

    let math_x: MathExpr = 1.0.into();
    let math_y: MathExpr = (-3.2).into();
    let math_coords = MathExpr {
        math_object: JsMathExpr("[\"vector\",1,-3.2]".to_string()),
    };

    let x_prop = core.get_prop(point_idx, X_LOCAL_IDX);
    let y_prop = core.get_prop(point_idx, Y_LOCAL_IDX);
    let coords_prop = core.get_prop(point_idx, COORDS_LOCAL_IDX);

    assert_eq!(x_prop.value, math_x.clone().into());
    assert_eq!(y_prop.value, math_y.into());
    assert_eq!(coords_prop.value, math_coords.into());
}

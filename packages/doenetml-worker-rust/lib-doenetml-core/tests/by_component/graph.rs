use doenetml_core::{
    components::doenet::graph::GraphProps,
    dast::{ForRenderPropValue, ForRenderPropValueOrContent, ForRenderProps},
    props::cache::PropWithMeta,
};

use super::*;

// Note: we can only test values points with numerical values, as otherwise it requires wasm to call out to math-expressions

const X_MIN_LOCAL_IDX: LocalPropIdx = GraphProps::XMin.local_idx();
const X_MAX_LOCAL_IDX: LocalPropIdx = GraphProps::XMax.local_idx();
const Y_MIN_LOCAL_IDX: LocalPropIdx = GraphProps::YMin.local_idx();
const Y_MAX_LOCAL_IDX: LocalPropIdx = GraphProps::YMax.local_idx();

#[test]
fn graph_with_default_axis_limits() {
    let dast_root = dast_root_no_position(r#"<graph name="g" />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let graph_idx = core.get_component_index_by_name("g");

    let x_min_prop = core.get_prop(graph_idx, X_MIN_LOCAL_IDX);
    let x_max_prop = core.get_prop(graph_idx, X_MAX_LOCAL_IDX);
    let y_min_prop = core.get_prop(graph_idx, Y_MIN_LOCAL_IDX);
    let y_max_prop = core.get_prop(graph_idx, Y_MAX_LOCAL_IDX);

    let x_min_graph_node = core
        .core
        .document_model
        .prop_pointer_to_prop_node(PropPointer {
            component_idx: graph_idx.into(),
            local_prop_idx: X_MIN_LOCAL_IDX,
        });
    let x_max_graph_node = core
        .core
        .document_model
        .prop_pointer_to_prop_node(PropPointer {
            component_idx: graph_idx.into(),
            local_prop_idx: X_MAX_LOCAL_IDX,
        });
    let y_min_graph_node = core
        .core
        .document_model
        .prop_pointer_to_prop_node(PropPointer {
            component_idx: graph_idx.into(),
            local_prop_idx: Y_MIN_LOCAL_IDX,
        });
    let y_max_graph_node = core
        .core
        .document_model
        .prop_pointer_to_prop_node(PropPointer {
            component_idx: graph_idx.into(),
            local_prop_idx: Y_MAX_LOCAL_IDX,
        });

    assert_eq!(
        x_min_prop,
        PropWithMeta {
            value: (-10.0).into(),
            came_from_default: true,
            changed: true,
            origin: Some(x_min_graph_node)
        }
    );
    assert_eq!(
        x_max_prop,
        PropWithMeta {
            value: (10.0).into(),
            came_from_default: true,
            changed: true,
            origin: Some(x_max_graph_node)
        }
    );
    assert_eq!(
        y_min_prop,
        PropWithMeta {
            value: (-10.0).into(),
            came_from_default: true,
            changed: true,
            origin: Some(y_min_graph_node)
        }
    );
    assert_eq!(
        y_max_prop,
        PropWithMeta {
            value: (10.0).into(),
            came_from_default: true,
            changed: true,
            origin: Some(y_max_graph_node)
        }
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();

    let graph_rendered_element = &flat_dast.elements[graph_idx];

    assert_eq!(
        graph_rendered_element.data.props,
        Some(ForRenderProps(vec![
            ForRenderPropValue {
                name: "xMin",
                value: ForRenderPropValueOrContent::PropValue((-10.0).into())
            },
            ForRenderPropValue {
                name: "xMax",
                value: ForRenderPropValueOrContent::PropValue((10.0).into())
            },
            ForRenderPropValue {
                name: "yMin",
                value: ForRenderPropValueOrContent::PropValue((-10.0).into())
            },
            ForRenderPropValue {
                name: "yMax",
                value: ForRenderPropValueOrContent::PropValue((10.0).into())
            }
        ]))
    );
}

#[test]
fn graph_with_specified_axis_limits() {
    let dast_root =
        dast_root_no_position(r#"<graph name="g" xmin="-5" xmax="15" ymin="-20" ymax="30" />"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    let graph_idx = core.get_component_index_by_name("g");

    let x_min_prop = core.get_prop(graph_idx, X_MIN_LOCAL_IDX);
    let x_max_prop = core.get_prop(graph_idx, X_MAX_LOCAL_IDX);
    let y_min_prop = core.get_prop(graph_idx, Y_MIN_LOCAL_IDX);
    let y_max_prop = core.get_prop(graph_idx, Y_MAX_LOCAL_IDX);

    let x_min_graph_node = core
        .core
        .document_model
        .prop_pointer_to_prop_node(PropPointer {
            component_idx: graph_idx.into(),
            local_prop_idx: X_MIN_LOCAL_IDX,
        });
    let x_max_graph_node = core
        .core
        .document_model
        .prop_pointer_to_prop_node(PropPointer {
            component_idx: graph_idx.into(),
            local_prop_idx: X_MAX_LOCAL_IDX,
        });
    let y_min_graph_node = core
        .core
        .document_model
        .prop_pointer_to_prop_node(PropPointer {
            component_idx: graph_idx.into(),
            local_prop_idx: Y_MIN_LOCAL_IDX,
        });
    let y_max_graph_node = core
        .core
        .document_model
        .prop_pointer_to_prop_node(PropPointer {
            component_idx: graph_idx.into(),
            local_prop_idx: Y_MAX_LOCAL_IDX,
        });

    assert_eq!(
        x_min_prop,
        PropWithMeta {
            value: (-5.0).into(),
            came_from_default: false,
            changed: true,
            origin: Some(x_min_graph_node)
        }
    );
    assert_eq!(
        x_max_prop,
        PropWithMeta {
            value: (15.0).into(),
            came_from_default: false,
            changed: true,
            origin: Some(x_max_graph_node)
        }
    );
    assert_eq!(
        y_min_prop,
        PropWithMeta {
            value: (-20.0).into(),
            came_from_default: false,
            changed: true,
            origin: Some(y_min_graph_node)
        }
    );
    assert_eq!(
        y_max_prop,
        PropWithMeta {
            value: (30.0).into(),
            came_from_default: false,
            changed: true,
            origin: Some(y_max_graph_node)
        }
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();

    let graph_rendered_element = &flat_dast.elements[graph_idx];

    assert_eq!(
        graph_rendered_element.data.props,
        Some(ForRenderProps(vec![
            ForRenderPropValue {
                name: "xMin",
                value: ForRenderPropValueOrContent::PropValue((-5.0).into())
            },
            ForRenderPropValue {
                name: "xMax",
                value: ForRenderPropValueOrContent::PropValue((15.0).into())
            },
            ForRenderPropValue {
                name: "yMin",
                value: ForRenderPropValueOrContent::PropValue((-20.0).into())
            },
            ForRenderPropValue {
                name: "yMax",
                value: ForRenderPropValueOrContent::PropValue((30.0).into())
            }
        ]))
    );
}

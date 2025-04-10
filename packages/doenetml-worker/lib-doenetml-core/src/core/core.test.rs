use crate::{
    components::types::ComponentIdx, dast::ElementRefAnnotation, graph_node::GraphNode,
    test_utils::dast_root_no_position,
};

use super::*;

#[test]
fn test_can_get_annotated_children() {
    let dast_root =
        dast_root_no_position(r#"<text name="t">Hello</text><text extend="$t"> World</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);
    let c = core
        .document_model
        .get_component_content_children(ComponentIdx::from(2));
    assert_eq!(c, vec![GraphNode::String(0), GraphNode::String(1)]);

    let c = core
        .document_model
        .get_component_content_children_annotated(ComponentIdx::from(2));
    assert_eq!(
        c,
        vec![
            (GraphNode::String(0), ElementRefAnnotation::Duplicate),
            (GraphNode::String(1), ElementRefAnnotation::Original)
        ]
    );
}

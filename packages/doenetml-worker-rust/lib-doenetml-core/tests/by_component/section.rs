use super::*;

use doenetml_core::{dast::FlatDastElementContent, graph_node::GraphNode};
use test_helpers::*;

#[test]
fn section_finds_beginning_title_tag() {
    let dast_root =
        dast_root_no_position(r#"<section><title>Hello</title><text>content</text></section>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let section_idx = 1;

    assert_eq!(get_title_prop(section_idx, &mut core), 2);

    assert_eq!(
        get_rendered_children_prop(section_idx, &mut core),
        vec![GraphNode::Component(2), GraphNode::Component(3),]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx].children;

    assert_eq!(
        *section_children,
        vec![
            FlatDastElementContent::Element(2),
            FlatDastElementContent::Element(3),
        ]
    );
}

#[test]
fn section_finds_title_tag_in_middle() {
    let dast_root = dast_root_no_position(
        r#"<section>
<text>text content</text> string outside
<title>Hello</title> more outside
<text>more content</text>
</section>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let section_idx = 1;

    assert_eq!(get_title_prop(section_idx, &mut core), 3);

    // Note we have blank string children between all the component children.
    // When title child gets moved up, we have multiple strings between component children
    assert_eq!(
        get_rendered_children_prop(section_idx, &mut core),
        vec![
            GraphNode::Component(3),
            GraphNode::String(1),
            GraphNode::Component(2),
            GraphNode::String(2),
            GraphNode::String(3),
            GraphNode::Component(4),
            GraphNode::String(4),
        ]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx].children;

    assert_eq!(
        *section_children,
        vec![
            FlatDastElementContent::Element(3),
            FlatDastElementContent::Text("\n".to_string()),
            FlatDastElementContent::Element(2),
            FlatDastElementContent::Text(" string outside\n".to_string()),
            FlatDastElementContent::Text(" more outside\n".to_string()),
            FlatDastElementContent::Element(4),
            FlatDastElementContent::Text("\n".to_string()),
        ]
    );
}

#[test]
fn section_with_multiple_title_tags_picks_last() {
    let dast_root = dast_root_no_position(
        r#"<section>
<title>title 1</title> after title 1
<text>text content</text> string outside
<title>title 2</title> after title 2
<text>more content</text>
</section>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let section_idx = 1;

    assert_eq!(get_title_prop(section_idx, &mut core), 4);

    // Note we have blank string children between all the component children.
    // When title children get removed and moved up, we have multiple strings between component children
    assert_eq!(
        get_rendered_children_prop(section_idx, &mut core),
        vec![
            GraphNode::Component(4),
            GraphNode::String(1),
            GraphNode::String(2),
            GraphNode::Component(3),
            GraphNode::String(3),
            GraphNode::String(4),
            GraphNode::Component(5),
            GraphNode::String(5),
        ]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx].children;

    assert_eq!(
        *section_children,
        vec![
            FlatDastElementContent::Element(4),
            FlatDastElementContent::Text("\n".to_string()),
            FlatDastElementContent::Text(" after title 1\n".to_string()),
            FlatDastElementContent::Element(3),
            FlatDastElementContent::Text(" string outside\n".to_string()),
            FlatDastElementContent::Text(" after title 2\n".to_string()),
            FlatDastElementContent::Element(5),
            FlatDastElementContent::Text("\n".to_string()),
        ]
    );
}

mod test_helpers {

    use doenetml_core::{components::Section, state::types::element_refs::ElementRefs};

    use super::*;

    /// Resolves `title` from a `<section>` component and returns its value as a `ComponentIdx`
    pub fn get_title_prop(component_idx: ComponentIdx, core: &mut Core) -> ComponentIdx {
        let title_local_idx = LocalPropIdx(
            Section::PROP_NAMES
                .into_iter()
                .position(|name| name.eq(&"title"))
                .unwrap(),
        );

        let prop_node = core.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: title_local_idx,
        });
        let value = core.get_prop_for_render_untracked(prop_node).value;

        let element_refs: ElementRefs = (*value).clone().try_into().unwrap();

        element_refs[0]
    }

    /// Resolves `renderedChildren` from a `<section>` component and returns its value
    pub fn get_rendered_children_prop(
        component_idx: ComponentIdx,
        core: &mut Core,
    ) -> Vec<GraphNode> {
        let rendered_children_local_idx = LocalPropIdx(
            Section::PROP_NAMES
                .into_iter()
                .position(|name| name.eq(&"renderedChildren"))
                .unwrap(),
        );

        let prop_node = core.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: rendered_children_local_idx,
        });
        let value = core.get_prop_for_render_untracked(prop_node).value;

        let graph_nodes: Vec<GraphNode> = (*value).clone().try_into().unwrap();

        graph_nodes
    }
}

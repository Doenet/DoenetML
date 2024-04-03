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
    let section_idx = 1.into();

    assert_eq!(get_title_prop(section_idx, &mut core).unwrap(), 2.into());

    assert_eq!(
        get_rendered_children_prop(section_idx, &mut core),
        vec![GraphNode::Component(2), GraphNode::Component(3),]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx.as_usize()].children;

    assert_eq!(
        *section_children,
        vec![
            FlatDastElementContent::Element(2),
            FlatDastElementContent::Element(3),
        ]
    );
}

#[test]
fn section_handles_missing_title_tag() {
    let dast_root =
        dast_root_no_position(r#"<section><titleX>Hello</titleX><text>content</text></section>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let section_idx = 1.into();

    assert_eq!(get_title_prop(section_idx, &mut core), None);

    assert_eq!(
        get_rendered_children_prop(section_idx, &mut core),
        vec![GraphNode::Component(2), GraphNode::Component(3),]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx.as_usize()].children;

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
    let section_idx = 1.into();

    assert_eq!(get_title_prop(section_idx, &mut core).unwrap(), 3.into());

    // Note we have blank string children between all the component children.
    // When title child gets moved up, we have multiple strings between component children
    assert_eq!(
        get_rendered_children_prop(section_idx, &mut core),
        vec![
            GraphNode::Component(3),
            GraphNode::String(0),
            GraphNode::Component(2),
            GraphNode::String(1),
            GraphNode::String(2),
            GraphNode::Component(4),
            GraphNode::String(3),
        ]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx.as_usize()].children;

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
    let section_idx = 1.into();

    assert_eq!(get_title_prop(section_idx, &mut core).unwrap(), 4.into());

    // Note we have blank string children between all the component children.
    // When title children get removed and moved up, we have multiple strings between component children
    assert_eq!(
        get_rendered_children_prop(section_idx, &mut core),
        vec![
            GraphNode::Component(4),
            GraphNode::String(0),
            GraphNode::String(1),
            GraphNode::Component(3),
            GraphNode::String(2),
            GraphNode::String(3),
            GraphNode::Component(5),
            GraphNode::String(4),
        ]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx.as_usize()].children;

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

#[test]
fn section_gets_serial_number() {
    // Items with idx 1 and 5 are <section> elements
    let dast_root = dast_root_no_position(
        r#"
        <section><title>Hello</title><text>content</text></section>
        <p>Random paragraph not in a section</p>
        <section><title>Hello2</title><text>content2</text></section>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let section_idx = 1.into();

    assert_eq!(get_serial_number_prop(section_idx, &mut core), 7);
}

mod test_helpers {

    use doenetml_core::{
        components::doenet::section::SectionProps,
        props::{prop_type, traits::IntoPropView, PropView},
    };

    use super::*;

    const TITLE_LOCAL_IDX: LocalPropIdx = SectionProps::local_idx(&SectionProps::Title);
    const RENDERED_CHILDREN_LOCAL_IDX: LocalPropIdx =
        SectionProps::local_idx(&SectionProps::RenderedChildren);

    /// Resolves `title` from a `<section>` component and returns its value as a `ComponentIdx`
    pub fn get_title_prop(component_idx: ComponentIdx, core: &mut Core) -> Option<ComponentIdx> {
        let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: TITLE_LOCAL_IDX,
        });
        let prop = core.get_prop_for_render_untracked(prop_node);
        let prop_view: PropView<prop_type::ElementRef> = prop.into_prop_view();

        prop_view.value.map(|v| v.0)
    }

    /// Resolves `renderedChildren` from a `<section>` component and returns its value
    pub fn get_rendered_children_prop(
        component_idx: ComponentIdx,
        core: &mut Core,
    ) -> Vec<GraphNode> {
        let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: RENDERED_CHILDREN_LOCAL_IDX,
        });
        let prop = core.get_prop_for_render_untracked(prop_node);
        let prop_view: PropView<prop_type::GraphNodes> = prop.into_prop_view();

        (*prop_view.value).clone()
    }

    /// Resolves `serialNumber` from a `<section>` and returns it.
    pub fn get_serial_number_prop(
        component_idx: ComponentIdx,
        core: &mut Core,
    ) -> prop_type::Integer {
        println!("{}", core.to_mermaid_structure_graph());
        println!("\n\n\n");
        println!("{}", core.to_mermaid_dependency_graph());
        let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: SectionProps::SerialNumber.local_idx(),
        });
        let prop = core.get_prop_for_render_untracked(prop_node);
        let prop_view: PropView<prop_type::Integer> = prop.into_prop_view();

        prop_view.value
    }
}

use super::*;

use doenetml_core::{
    components::doenet::division::DivisionProps, dast::FlatDastElementContent, props::prop_type,
    state::types::content_refs::ContentRef,
};
use test_helpers::*;

#[test]
fn section_content_excludes_title_tag() {
    let dast_root =
        dast_root_no_position(r#"<section><title>Hello</title><text>content</text></section>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let section_idx = 1.into();

    assert_eq!(get_title_prop(section_idx, &mut core).unwrap(), 2.into());

    assert_eq!(
        get_rendered_children(section_idx, &mut core),
        vec![ContentRef::Component(3.into()),]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx.as_usize()].children;

    assert_eq!(
        *section_children,
        vec![FlatDastElementContent::new_original_element(3),]
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
        get_rendered_children(section_idx, &mut core),
        vec![
            ContentRef::Component(2.into()),
            ContentRef::Component(3.into()),
        ]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx.as_usize()].children;

    assert_eq!(
        *section_children,
        vec![
            FlatDastElementContent::new_original_element(2),
            FlatDastElementContent::new_original_element(3),
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
        get_rendered_children(section_idx, &mut core),
        vec![
            ContentRef::String(0.into()),
            ContentRef::Component(2.into()),
            ContentRef::String(1.into()),
            ContentRef::String(2.into()),
            ContentRef::Component(4.into()),
            ContentRef::String(3.into()),
        ]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx.as_usize()].children;

    assert_eq!(
        *section_children,
        vec![
            FlatDastElementContent::Text("\n".to_string()),
            FlatDastElementContent::new_original_element(2),
            FlatDastElementContent::Text(" string outside\n".to_string()),
            FlatDastElementContent::Text(" more outside\n".to_string()),
            FlatDastElementContent::new_original_element(4),
            FlatDastElementContent::Text("\n".to_string()),
        ]
    );

    let title_prop = get_title_prop(1.into(), &mut core);
    assert_eq!(title_prop, Some(3.into()));
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
        get_rendered_children(section_idx, &mut core),
        vec![
            ContentRef::String(0.into()),
            ContentRef::String(1.into()),
            ContentRef::Component(3.into()),
            ContentRef::String(2.into()),
            ContentRef::String(3.into()),
            ContentRef::Component(5.into()),
            ContentRef::String(4.into()),
        ]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();
    let section_children = &flat_dast.elements[section_idx.as_usize()].children;

    assert_eq!(
        *section_children,
        vec![
            FlatDastElementContent::Text("\n".to_string()),
            FlatDastElementContent::Text(" after title 1\n".to_string()),
            FlatDastElementContent::new_original_element(3),
            FlatDastElementContent::Text(" string outside\n".to_string()),
            FlatDastElementContent::Text(" after title 2\n".to_string()),
            FlatDastElementContent::new_original_element(5),
            FlatDastElementContent::Text("\n".to_string()),
        ]
    );

    let title_prop = get_title_prop(1.into(), &mut core);
    assert_eq!(title_prop, Some(4.into()));
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
    assert_eq!(get_serial_number_prop(section_idx, &mut core), 0);

    let section_idx = 5.into();
    assert_eq!(get_serial_number_prop(section_idx, &mut core), 1);
}

#[test]
fn section_gets_code_number() {
    // Items with idx 1 and 5 are <section> elements
    let dast_root = dast_root_no_position(
        r#"
        <section>
            <title>Hello</title><text>content</text>
            <section>
                <title>Inner title</title>
                <p>
                    Inner paragraph
                    <section>More inner section</section>
                </p>
            </section>
        </section>
        <p>Random paragraph not in a section</p>
        <section><title>Hello2</title><text>content2</text></section>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    //core.to_flat_dast();

    //// the document tag will be index 0.
    let section_idx = 1.into();
    assert_eq!(get_code_number_prop(section_idx, &mut core).as_str(), "1");
    let section_idx = 4.into();
    assert_eq!(get_code_number_prop(section_idx, &mut core).as_str(), "1.1");
    let section_idx = 7.into();
    assert_eq!(
        get_code_number_prop(section_idx, &mut core).as_str(),
        "1.1.1"
    );
    let section_idx = 9.into();
    assert_eq!(get_code_number_prop(section_idx, &mut core).as_str(), "2");
}

#[test]
fn section_gets_division_depth() {
    // Items with idx 1 and 5 are <section> elements
    let dast_root = dast_root_no_position(
        r#"
        <section>
            <title>Hello</title><text>content</text>
            <section>
                <title>Inner title</title>
                <p>
                    Inner paragraph
                    <section>More inner section</section>
                </p>
            </section>
        </section>
        <p>Random paragraph not in a section</p>
        <section><title>Hello2</title><text>content2</text></section>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    //// the document tag will be index 0.
    let section_idx = 1.into();
    assert_eq!(get_division_depth_prop(section_idx, &mut core), 0);
    let section_idx = 4.into();
    assert_eq!(get_division_depth_prop(section_idx, &mut core), 1);
    let section_idx = 7.into();
    assert_eq!(get_division_depth_prop(section_idx, &mut core), 2);
    let section_idx = 9.into();
    assert_eq!(get_division_depth_prop(section_idx, &mut core), 0);
}

#[test]
fn section_title_reference_works() {
    // Items with idx 1 and 5 are <section> elements
    let dast_root = dast_root_no_position(
        r#"
       <section name="s1"><title>Hello</title><text>content</text></section> $s1.title
       "#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // just to make sure this doesn't error
    core.to_flat_dast();

    let fragment_idx = 4.into();

    assert_eq!(
        get_fragment_rendered_children_prop(fragment_idx, &mut core),
        vec![ContentRef::Component(2.into()),]
    );

    //println!("{}", core.to_mermaid_structure_graph());
    //println!("\n\n\n");
    //println!("{}", core.to_mermaid_dependency_graph());
}

#[test]
fn can_get_xref_label() {
    let dast_root = dast_root_no_position(
        r#"
       <section /><section><section /></section>
       "#,
    );

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // just to make sure this doesn't error
    core.to_flat_dast();

    // Get the nested section
    let section_idx = 3;
    let xref_label: prop_type::XrefLabel =
        core.get_prop_value_typed(section_idx, DivisionProps::XrefLabel.local_idx());

    assert_eq!(xref_label.label, "Section");
    assert_eq!(xref_label.global_ident, "2.1");
    assert_eq!(xref_label.local_ident, "1");

    //println!("{}", core.to_mermaid_structure_graph());
    //println!("\n\n\n");
    //println!("{}", core.to_mermaid_dependency_graph());
}

mod test_helpers {

    use doenetml_core::{
        components::doenet::{_fragment::_FragmentProps, division::DivisionProps},
        props::{PropView, prop_type, traits::IntoPropView},
        state::types::content_refs::ContentRef,
    };

    use super::*;

    const TITLE_LOCAL_IDX: LocalPropIdx = DivisionProps::Title.local_idx();
    const RENDERED_CHILDREN_LOCAL_IDX: LocalPropIdx = DivisionProps::RenderedChildren.local_idx();

    /// Resolves `title` from a `<section>` component and returns its value as a `ComponentIdx`
    pub fn get_title_prop(component_idx: ComponentIdx, core: &mut Core) -> Option<ComponentIdx> {
        let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: TITLE_LOCAL_IDX,
        });
        let prop = core.get_prop_for_render_untracked(prop_node);
        let prop_view: PropView<prop_type::ComponentRef> = prop.into_prop_view();

        prop_view.value.map(|v| v.0)
    }

    /// Resolves `renderedChildren` from a `<section>` component and returns its value
    pub fn get_rendered_children(component_idx: ComponentIdx, core: &mut Core) -> Vec<ContentRef> {
        let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: RENDERED_CHILDREN_LOCAL_IDX,
        });
        let prop = core.get_prop_for_render_untracked(prop_node);
        let prop_view: PropView<prop_type::AnnotatedContentRefs> = prop.into_prop_view();

        (*prop_view.value)
            .clone()
            .into_vec()
            .into_iter()
            .map(|(c, _a)| c)
            .collect()
    }

    /// Resolves `serialNumber` from a `<section>` and returns it.
    pub fn get_serial_number_prop(
        component_idx: ComponentIdx,
        core: &mut Core,
    ) -> prop_type::Integer {
        let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: DivisionProps::SerialNumber.local_idx(),
        });
        let prop = core.get_prop_for_render_untracked(prop_node);
        let prop_view: PropView<prop_type::Integer> = prop.into_prop_view();

        prop_view.value
    }

    /// Resolves `codeNumber` from a `<section>` and returns it.
    pub fn get_code_number_prop(component_idx: ComponentIdx, core: &mut Core) -> prop_type::String {
        let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: DivisionProps::CodeNumber.local_idx(),
        });
        let prop = core.get_prop_for_render_untracked(prop_node);
        let prop_view: PropView<prop_type::String> = prop.into_prop_view();

        prop_view.value
    }

    /// Resolves `divisionDepth` from a `<section>` and returns it.
    pub fn get_division_depth_prop(
        component_idx: ComponentIdx,
        core: &mut Core,
    ) -> prop_type::Integer {
        let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: DivisionProps::DivisionDepth.local_idx(),
        });
        let prop = core.get_prop_for_render_untracked(prop_node);
        let prop_view: PropView<prop_type::Integer> = prop.into_prop_view();

        prop_view.value
    }

    /// Resolves `renderedChildren` from a `<section>` component and returns its value
    pub fn get_fragment_rendered_children_prop(
        component_idx: ComponentIdx,
        core: &mut Core,
    ) -> Vec<ContentRef> {
        let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: _FragmentProps::RenderedChildren.local_idx(),
        });
        let prop = core.get_prop_for_render_untracked(prop_node);
        let prop_view: PropView<prop_type::AnnotatedContentRefs> = prop.into_prop_view();

        (*prop_view.value)
            .clone()
            .into_vec()
            .into_iter()
            .map(|(c, _a)| c)
            .collect()
    }
}

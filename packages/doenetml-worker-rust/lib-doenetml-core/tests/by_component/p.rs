use super::*;

use doenetml_core::{dast::FlatDastElementContent, state::types::content_refs::ContentRef};
use test_helpers::*;

// TODO: add a test where a child with "hidden" is dynamically changed to hidden/unhidden.

#[test]
fn p_rendered_children() {
    let dast_root = dast_root_no_position(r#"<p><text>Hello</text> and <text>bye</text>!</p>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let p_idx = 1.into();

    // check the rendered children prop
    assert_eq!(
        get_rendered_children_prop(p_idx, &mut core),
        vec![
            ContentRef::Component(2.into()),
            ContentRef::String(0.into()),
            ContentRef::Component(3.into()),
            ContentRef::String(1.into()),
        ]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();

    let p_children = &flat_dast.elements[p_idx.as_usize()].children;

    // TODO: when have rendered props, change to check the actual result with text values
    assert_eq!(
        *p_children,
        vec![
            FlatDastElementContent::new_original_element(2),
            FlatDastElementContent::Text(" and ".to_string()),
            FlatDastElementContent::new_original_element(3),
            FlatDastElementContent::Text("!".to_string()),
        ]
    );
}

#[test]
fn p_hidden_children_not_rendered() {
    let dast_root =
        dast_root_no_position(r#"<p><text>Hello</text> and <text hide>bye</text>!</p>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0.
    let p_idx = 1.into();

    assert_eq!(
        get_rendered_children_prop(p_idx, &mut core),
        vec![
            ContentRef::Component(2.into()),
            ContentRef::String(0.into()),
            ContentRef::String(1.into()),
        ]
    );

    // check the flat dast
    let flat_dast = core.to_flat_dast();

    let p_children = &flat_dast.elements[p_idx.as_usize()].children;

    // TODO: when have rendered props, change to check the actual result with text values
    assert_eq!(
        *p_children,
        vec![
            FlatDastElementContent::new_original_element(2),
            FlatDastElementContent::Text(" and ".to_string()),
            FlatDastElementContent::Text("!".to_string()),
        ]
    );
}

/// <p>, a component with `pass_through_children` extending itself
#[test]
fn ps_extending_ps_concatenate_children() {
    let dast_root = dast_root_no_position(
        r#"<p name="p1">one</p><p name="p2" extend="$p1">two</p><p extend="$p2">three</p>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // p1 will be index 1, etc., as the document tag will be index 0.
    let p1_idx = 1;
    let p2_idx = 2;
    let p3_idx = 3;

    let flat_dast = core.to_flat_dast();

    // p1 has one string child "one"
    let p1 = &flat_dast.elements[p1_idx];
    assert_eq!(get_string_children(p1), vec![Some("one")]);

    // p2 has two string children "one" and "two"
    let p2 = &flat_dast.elements[p2_idx];
    assert_eq!(get_string_children(p2), vec![Some("one"), Some("two")]);

    // p3 has two string children "one", "two", and "three"
    let p3 = &flat_dast.elements[p3_idx];
    assert_eq!(
        get_string_children(p3),
        vec![Some("one"), Some("two"), Some("three")]
    );
}

/// <p>, a component with `pass_through_children` extending
/// <text>, a component marked `extend_via_default_prop`
#[test]
fn p_extending_text() {
    let dast_root =
        dast_root_no_position(r#"<text name="t">one</text><p name="p2" extend="$t">two</p>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // indices start at 1, as the document tag will be index 0.
    let p_idx = 2;

    let flat_dast = core.to_flat_dast();

    // p has two text/string child "one" and "two"
    let p = &flat_dast.elements[p_idx];
    assert_eq!(
        get_string_text_children(p, &flat_dast.elements),
        vec![Some("one"), Some("two")]
    );
}

/// <p>, a component with `pass_through_children` extending a prop
#[test]
fn p_extending_text_value() {
    let dast_root =
        dast_root_no_position(r#"<text name="t">one</text><p extend="$t.value">two</p>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // indices start at 1, as the document tag will be index 0.
    let p_idx = 2;

    let flat_dast = core.to_flat_dast();

    // p has two text/string child "one" and "two"
    let p = &flat_dast.elements[p_idx];
    assert_eq!(
        get_string_text_children(p, &flat_dast.elements),
        vec![Some("one"), Some("two")]
    );
}

/// <p>, a component with `pass_through_children` extending
/// <section>, a component that is not marked `extend_via_default_prop`
#[test]
fn p_extending_section() {
    let dast_root =
        dast_root_no_position(r#"<section name="s">one</section><p name="p2" extend="$s">two</p>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // indices start at 1, as the document tag will be index 0.
    let p_idx = 2;

    let flat_dast = core.to_flat_dast();

    // p has two text/string child "one" and "two"
    let p = &flat_dast.elements[p_idx];
    assert_eq!(
        get_string_text_children(p, &flat_dast.elements),
        vec![Some("one"), Some("two")]
    );
}

mod test_helpers {

    use doenetml_core::{
        components::P,
        dast::{FlatDastElement, FlatDastElementContent, ForRenderPropValueOrContent},
        props::{PropValue, PropView, prop_type, traits::IntoPropView},
        state::types::content_refs::ContentRef,
    };

    use super::*;

    /// Resolves `renderedChildren` from a `<p>` component and returns its value
    pub fn get_rendered_children_prop(
        component_idx: ComponentIdx,
        core: &mut Core,
    ) -> Vec<ContentRef> {
        let rendered_children_local_idx = LocalPropIdx::new(
            P::PROP_NAMES
                .into_iter()
                .position(|name| name.eq(&"renderedChildren"))
                .unwrap(),
        );

        let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: rendered_children_local_idx,
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

    pub fn get_string_children(element: &FlatDastElement) -> Vec<Option<&str>> {
        element
            .children
            .iter()
            .map(|child| match child {
                FlatDastElementContent::Text(s) => Some(s.as_str()),
                _ => None,
            })
            .collect()
    }

    pub fn get_string_text_children<'a>(
        element: &'a FlatDastElement,
        elements: &'a [FlatDastElement],
    ) -> Vec<Option<&'a str>> {
        element
            .children
            .iter()
            .map(|child| match child {
                FlatDastElementContent::Text(s) => Some(s.as_str()),
                FlatDastElementContent::Element(child_idx) => {
                    let child_elt = &elements[child_idx.id];
                    if child_elt.name == "text" {
                        let prop_values = &child_elt.data.props.as_ref().unwrap().0;

                        prop_values.iter().find_map(|prop_val| {
                            if prop_val.name == "value".to_string() {
                                match &prop_val.value {
                                    ForRenderPropValueOrContent::PropValue(PropValue::String(
                                        string_val,
                                    )) => Some(string_val.as_str()),
                                    _ => panic!("must have string value"),
                                }
                            } else {
                                None
                            }
                        })
                    } else {
                        None
                    }
                }
            })
            .collect()
    }
}

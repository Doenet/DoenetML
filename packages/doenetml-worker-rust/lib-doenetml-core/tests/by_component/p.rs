use super::*;

use test_helpers::*;

/// <p>, a component with `pass_through_children` extending itself
#[test]
fn ps_extending_ps_concatenate_children() {
    let dast_root = dast_root_no_position(
        r#"<p name="p1">one</p><p name="p2" extend="$p1">two</p><p extend="$p2">three</p>"#,
    );
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

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
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

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
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

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
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

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
        components::RenderedState,
        dast::{FlatDastElement, FlatDastElementContent},
    };

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
                    let child_elt = &elements[*child_idx];
                    if child_elt.name == "text" {
                        match child_elt.data.state.as_ref().unwrap() {
                            RenderedState::TextState(text_state) => {
                                text_state.value.as_ref().map(|s| s.as_str())
                            }
                            _ => None,
                        }
                    } else {
                        None
                    }
                }
            })
            .collect()
    }
}

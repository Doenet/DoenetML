use super::*;

use test_helpers::*;

#[test]
fn value_prop_from_string_child() {
    let dast_root = dast_root_no_position(r#"<text>hello</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the text will be index 1, as the document tag will be index 0.
    let text_idx = 1;

    assert_eq!(get_value_prop(text_idx, &mut core), "hello");
}

#[test]
fn text_prop_is_alias_of_value() {
    let dast_root = dast_root_no_position(r#"<text>hello</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the text will be index 1, as the document tag will be index 0.
    let text_idx = 1;

    assert_eq!(
        get_value_prop(text_idx, &mut core),
        get_text_prop(text_idx, &mut core)
    );
}

/// <text>, a component with `no_rendered_children` and marked `extend_via_default_prop`
/// extending itself
#[test]
fn texts_extending_texts_concatenate_values() {
    let dast_root = dast_root_no_position(
        r#"<text name="t1">One</text><text name="t2" extend="$t1">Two</text><text extend="$t2">Three</text>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // indices start at 1, as the document tag will be index 0.
    let text1_idx = 1;
    let text2_idx = 2;
    let text3_idx = 3;

    assert_eq!(get_value_prop(text1_idx, &mut core), "One");
    assert_eq!(get_value_prop(text2_idx, &mut core), "OneTwo");
    assert_eq!(get_value_prop(text3_idx, &mut core), "OneTwoThree");
}

/// <text>, a component with `no_rendered_children` and marked `extend_via_default_prop`
/// extending a string prop
#[test]
fn texts_extending_text_values_concatenate_values() {
    let dast_root = dast_root_no_position(
        r#"<text name="t1">One</text><text name="t2" extend="$t1.value">Two</text><text extend="$t2.value">Three</text>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // indices start at 1, as the document tag will be index 0.
    let text1_idx = 1;
    let text2_idx = 2;
    let text3_idx = 3;

    assert_eq!(get_value_prop(text1_idx, &mut core), "One");
    assert_eq!(get_value_prop(text2_idx, &mut core), "OneTwo");
    assert_eq!(get_value_prop(text3_idx, &mut core), "OneTwoThree");
}

/// <text>, a component with `no_rendered_children` and marked `extend_via_default_prop`
/// extending <p>, a component with pass through children and not marked `extend_via_default_prop`
#[test]
fn text_extending_p_concatenate_children() {
    let dast_root = dast_root_no_position(r#"<p name="p">One</p><text extend="$p">Two</text>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // indices start at 1, as the document tag will be index 0.
    let text_idx = 2;

    assert_eq!(get_value_prop(text_idx, &mut core), "OneTwo");
}

/// <text>, a component with `no_rendered_children` and marked `extend_via_default_prop`
// extending <textInput> another component with `no_rendered_children` and marked `extend_via_default_prop`
#[test]
fn text_extending_text_input() {
    let dast_root = dast_root_no_position(
        r#"<textInput name="ti">One</textInput><text extend="$ti">Two</text>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // indices start at 1, as the document tag will be index 0.
    let text_idx = 2;

    assert_eq!(get_value_prop(text_idx, &mut core), "OneTwo");
}

#[test]
fn text_hidden() {
    let dast_root = dast_root_no_position(
        r#"<text>hello</text>
        <text hide>hello</text>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // indices start at 1, as the document tag will be index 0.
    let text1_idx = 1;
    let text2_idx = 2;

    assert_eq!(get_hidden_prop(text1_idx, &mut core), false);
    assert_eq!(get_hidden_prop(text2_idx, &mut core), true);
}

mod test_helpers {

    use super::*;

    // const VALUE_IDX: LocalPropIdx = TextProps::get_value_prop_index();
    // const TEXT_IDX: LocalPropIdx = TextProps::get_text_prop_index();

    // XXX - get these indices from the component type
    const VALUE_LOCAL_IDX: LocalPropIdx = LocalPropIdx(0);
    const TEXT_LOCAL_IDX: LocalPropIdx = LocalPropIdx(1);
    const HIDDEN_LOCAL_IDX: LocalPropIdx = LocalPropIdx(1); // XXX - this won't be the same ias TEXT!!!

    /// Resolves `value` from a `<text>` component and returns its value as a `String`
    pub fn get_value_prop(component_idx: ComponentIdx, core: &mut Core) -> String {
        let prop_node = core.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: VALUE_LOCAL_IDX,
        });
        let value = core.get_prop_for_render(prop_node).value;

        (*value).clone().try_into().unwrap()
    }

    /// Resolves `text` from a `<text>` component and returns its value as a `String`
    pub fn get_text_prop(component_idx: ComponentIdx, core: &mut Core) -> String {
        let prop_node = core.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: TEXT_LOCAL_IDX,
        });
        let value = core.get_prop_for_render(prop_node).value;

        (*value).clone().try_into().unwrap()
    }

    /// Resolves `hidden` from a `<text>` component and returns its value as a `bool`
    pub fn get_hidden_prop(component_idx: ComponentIdx, core: &mut Core) -> bool {
        let prop_node = core.prop_pointer_to_prop_node(PropPointer {
            component_idx,
            local_prop_idx: HIDDEN_LOCAL_IDX,
        });
        let value = core.get_prop_for_render(prop_node).value;

        (*value).clone().try_into().unwrap()
    }
}

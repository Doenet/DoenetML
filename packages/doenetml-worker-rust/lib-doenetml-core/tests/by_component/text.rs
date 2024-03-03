use super::*;

use test_helpers::*;

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

mod test_helpers {

    use doenetml_core::state::PropPointer;

    use super::*;

    const VALUE_IDX: PropIdx = TextProps::get_value_prop_index();
    const TEXT_IDX: PropIdx = TextProps::get_text_prop_index();

    /// Resolves `value` from a `<text>` component and returns its value as a `String`
    pub fn get_value_prop(component_idx: ComponentIdx, core: &mut Core) -> String {
        core.get_prop_value(PropPointer {
            component_idx,
            local_prop_idx: VALUE_IDX,
        })
        .try_into()
        .unwrap()
    }

    /// Resolves `text` from a `<text>` component and returns its value as a `String`
    pub fn get_text_prop(component_idx: ComponentIdx, core: &mut Core) -> String {
        core.get_prop_value(PropPointer {
            component_idx,
            local_prop_idx: TEXT_IDX,
        })
        .try_into()
        .unwrap()
    }
}

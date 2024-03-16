use super::*;

use test_helpers::*;

#[test]
fn value_prop_from_string_child() {
    let dast_root = dast_root_no_position(r#"<boolean>true</boolean><boolean>false</boolean>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0
    let boolean1_idx = 1.into();
    let boolean2_idx = 2.into();

    assert_eq!(get_value_prop(boolean1_idx, &mut core), true);
    assert_eq!(get_value_prop(boolean2_idx, &mut core), false);
}

#[test]
fn value_prop_from_boolean_child() {
    let dast_root = dast_root_no_position(
        r#"
        <boolean><boolean>true</boolean></boolean>
        <boolean><boolean>false</boolean></boolean>
        "#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0
    let boolean1_idx = 1.into();
    let boolean3_idx = 3.into();

    assert_eq!(get_value_prop(boolean1_idx, &mut core), true);
    assert_eq!(get_value_prop(boolean3_idx, &mut core), false);
}

#[ignore]
#[test]
fn boolean_prop_is_alias_of_value() {
    let dast_root = dast_root_no_position(r#"<boolean>true</boolean>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the boolean will be index 1, as the document tag will be index 0.
    let boolean_idx = 1.into();

    assert_eq!(
        get_value_prop(boolean_idx, &mut core),
        get_boolean_prop(boolean_idx, &mut core)
    );
}

#[ignore]
#[test]
fn text_prop_converts_value() {
    let dast_root = dast_root_no_position(r#"<boolean>true</boolean>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the boolean will be index 1, as the document tag will be index 0.
    let boolean_idx = 1.into();

    assert_eq!(get_value_prop(boolean_idx, &mut core), true);
    assert_eq!(get_text_prop(boolean_idx, &mut core), "true");
}

/// <boolean> extends text by concatenating strings
#[test]
fn boolean_extending_texts_concatenate_values() {
    let dast_root = dast_root_no_position(
        r#"<text name="t">Tr</text><boolean extend="$t">Ue</boolean><boolean extend="$t">true</boolean>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the document tag will be index 0
    let boolean1_idx = 2.into();
    let boolean2_idx = 3.into();

    assert_eq!(get_value_prop(boolean1_idx, &mut core), true);
    assert_eq!(get_value_prop(boolean2_idx, &mut core), false);
}

#[test]
fn boolean_hidden() {
    let dast_root = dast_root_no_position(
        r#"<boolean>true</boolean>
        <boolean hide>true</boolean>"#,
    );

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // indices start at 1, as the document tag will be index 0.
    let boolean1_idx = 1.into();
    let boolean2_idx = 2.into();

    assert_eq!(get_hidden_prop(boolean1_idx, &mut core), false);
    assert_eq!(get_hidden_prop(boolean2_idx, &mut core), true);
}

mod test_helpers {

    use super::*;

    // const VALUE_IDX: LocalPropIdx = BooleanProps::get_value_prop_index();
    // const BOOLEAN_IDX: LocalPropIdx = BooleanProps::get_boolean_prop_index();
    // const TEXT_IDX: LocalPropIdx = BooleanProps::get_text_prop_index();

    // XXX - get these indices from the component type
    const VALUE_LOCAL_IDX: LocalPropIdx = LocalPropIdx::new(0);
    const BOOLEAN_LOCAL_IDX: LocalPropIdx = LocalPropIdx::new(1);
    const TEXT_LOCAL_IDX: LocalPropIdx = LocalPropIdx::new(2);
    const HIDDEN_LOCAL_IDX: LocalPropIdx = LocalPropIdx::new(1); // XXX - this won't be the same as BOOLEAN!!!

    /// Resolves `value` from a `<boolean>` component and returns its value as a `bool`
    pub fn get_value_prop(component_idx: ComponentIdx, core: &mut Core) -> bool {
        let prop_node = PropPointer {
            component_idx,
            local_prop_idx: VALUE_LOCAL_IDX,
        }
        .into_prop_node(&core.document_model.document_structure);
        let value = core.get_prop_for_render_untracked(prop_node).value;

        (*value).clone().try_into().unwrap()
    }

    /// Resolves `boolean` from a `<boolean>` component and returns its value as a `bool`
    pub fn get_boolean_prop(component_idx: ComponentIdx, core: &mut Core) -> bool {
        let prop_node = PropPointer {
            component_idx,
            local_prop_idx: BOOLEAN_LOCAL_IDX,
        }
        .into_prop_node(&core.document_model.document_structure);
        let value = core.get_prop_for_render_untracked(prop_node).value;

        (*value).clone().try_into().unwrap()
    }

    /// Resolves `text` from a `<boolean>` component and returns its value as a `String`
    pub fn get_text_prop(component_idx: ComponentIdx, core: &mut Core) -> String {
        let prop_node = PropPointer {
            component_idx,
            local_prop_idx: TEXT_LOCAL_IDX,
        }
        .into_prop_node(&core.document_model.document_structure);
        let value = core.get_prop_for_render_untracked(prop_node).value;

        (*value).clone().try_into().unwrap()
    }

    /// Resolves `hidden` from a `<text>` component and returns its value as a `bool`
    pub fn get_hidden_prop(component_idx: ComponentIdx, core: &mut Core) -> bool {
        let prop_node = PropPointer {
            component_idx,
            local_prop_idx: HIDDEN_LOCAL_IDX,
        }
        .into_prop_node(&core.document_model.document_structure);
        let value = core.get_prop_for_render_untracked(prop_node).value;

        (*value).clone().try_into().unwrap()
    }
}

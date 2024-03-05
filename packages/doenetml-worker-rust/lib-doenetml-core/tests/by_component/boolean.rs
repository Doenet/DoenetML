use super::*;

use test_helpers::*;

#[test]
fn boolean_prop_is_alias_of_value() {
    let dast_root = dast_root_no_position(r#"<boolean>true</boolean>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the boolean will be index 1, as the document tag will be index 0.
    let boolean_idx = 1;

    assert_eq!(
        get_value_prop(boolean_idx, &mut core),
        get_boolean_prop(boolean_idx, &mut core)
    );
}

#[test]
fn text_prop_converts_value() {
    let dast_root = dast_root_no_position(r#"<boolean>true</boolean>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the boolean will be index 1, as the document tag will be index 0.
    let boolean_idx = 1;

    assert_eq!(get_value_prop(boolean_idx, &mut core), true);
    assert_eq!(get_text_prop(boolean_idx, &mut core), "true");
}

mod test_helpers {

    use doenetml_core::state::PropPointer;

    use super::*;

    const VALUE_IDX: PropIdx = BooleanProps::get_value_prop_index();
    const BOOLEAN_IDX: PropIdx = BooleanProps::get_boolean_prop_index();
    const TEXT_IDX: PropIdx = BooleanProps::get_text_prop_index();

    /// Resolves `value` from a `<boolean>` component and returns its value as a `bool`
    pub fn get_value_prop(component_idx: ComponentIdx, core: &mut Core) -> bool {
        core.get_prop_for_render(PropPointer {
            component_idx,
            local_prop_idx: VALUE_IDX,
        })
        .try_into()
        .unwrap()
    }

    /// Resolves `boolean` from a `<boolean>` component and returns its value as a `bool`
    pub fn get_boolean_prop(component_idx: ComponentIdx, core: &mut Core) -> bool {
        core.get_prop_for_render(PropPointer {
            component_idx,
            local_prop_idx: BOOLEAN_IDX,
        })
        .try_into()
        .unwrap()
    }

    /// Resolves `text` from a `<boolean>` component and returns its value as a `String`
    pub fn get_text_prop(component_idx: ComponentIdx, core: &mut Core) -> String {
        core.get_prop_for_render(PropPointer {
            component_idx,
            local_prop_idx: TEXT_IDX,
        })
        .try_into()
        .unwrap()
    }
}

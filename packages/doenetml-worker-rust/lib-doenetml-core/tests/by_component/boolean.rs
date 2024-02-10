use super::*;

use test_helpers::*;

#[test]
fn boolean_sv_is_alias_of_value() {
    let dast_root = dast_root_no_position(r#"<boolean>true</boolean>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the boolean will be index 1, as the document tag will be index 0.
    let boolean_idx = 1;

    assert_eq!(
        get_value_prop(boolean_idx, &mut core),
        get_boolean_prop(boolean_idx, &mut core)
    );
}

#[test]
fn text_sv_converts_value() {
    let dast_root = dast_root_no_position(r#"<boolean>true</boolean>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the boolean will be index 1, as the document tag will be index 0.
    let boolean_idx = 1;

    assert_eq!(get_value_prop(boolean_idx, &mut core), true);
    assert_eq!(get_text_prop(boolean_idx, &mut core), "true");
}

mod test_helpers {
    use crate::DoenetMLCore;

    use super::*;

    const VALUE_IDX: StateVarIdx = BooleanState::get_value_state_variable_index();
    const BOOLEAN_IDX: StateVarIdx = BooleanState::get_boolean_state_variable_index();
    const TEXT_IDX: StateVarIdx = BooleanState::get_text_state_variable_index();

    /// Resolves `value` from a `<boolean>` component and returns its value as a `bool`
    pub fn get_value_prop(component_idx: ComponentIdx, core: &mut DoenetMLCore) -> bool {
        core.get_state_var_value(component_idx, VALUE_IDX)
            .try_into()
            .unwrap()
    }

    /// Resolves `boolean` from a `<boolean>` component and returns its value as a `bool`
    pub fn get_boolean_prop(component_idx: ComponentIdx, core: &mut DoenetMLCore) -> bool {
        core.get_state_var_value(component_idx, BOOLEAN_IDX)
            .try_into()
            .unwrap()
    }

    /// Resolves `text` from a `<boolean>` component and returns its value as a `String`
    pub fn get_text_prop(component_idx: ComponentIdx, core: &mut DoenetMLCore) -> String {
        core.get_state_var_value(component_idx, TEXT_IDX)
            .try_into()
            .unwrap()
    }
}

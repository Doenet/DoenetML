use super::*;

use test_helpers::*;

use crate::{
    components::prelude::StateVarIdx, test_utils::dast_root_no_position, ComponentIdx, DoenetMLCore,
};

#[test]
fn text_sv_is_alias_of_value() {
    let dast_root = dast_root_no_position(r#"<text>hello</text>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text will be index 1, as the document tag will be index 0.
    let text_idx = 1;

    assert_eq!(
        get_value_prop(text_idx, &mut core),
        get_text_prop(text_idx, &mut core)
    );
}

mod test_helpers {
    use crate::DoenetMLCore;

    use super::*;

    const VALUE_IDX: StateVarIdx = TextState::get_value_state_variable_index();
    const TEXT_IDX: StateVarIdx = TextState::get_text_state_variable_index();

    /// Resolves `value` from a `<text>` component and returns its value as a `String`
    pub fn get_value_prop(component_idx: ComponentIdx, core: &mut DoenetMLCore) -> String {
        core.get_state_var_value(component_idx, VALUE_IDX)
            .try_into()
            .unwrap()
    }

    /// Resolves `text` from a `<text>` component and returns its value as a `String`
    pub fn get_text_prop(component_idx: ComponentIdx, core: &mut DoenetMLCore) -> String {
        core.get_state_var_value(component_idx, TEXT_IDX)
            .try_into()
            .unwrap()
    }
}

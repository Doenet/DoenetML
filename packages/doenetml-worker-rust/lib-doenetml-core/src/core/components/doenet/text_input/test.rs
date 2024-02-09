use crate::{
    components::{
        actions::{Action, ActionBody},
        doenet::text_input::{
            test::test_helpers::*, TextInputAction, TextInputActionArgs, TextInputState,
        },
        prelude::StateVarIdx,
        ActionsEnum,
    },
    test_utils::dast_root_no_position,
    ComponentIdx, DoenetMLCore,
};

const IMMEDIATE_VALUE_IDX: ComponentIdx =
    TextInputState::get_immediate_value_state_variable_index();
const VALUE_IDX: StateVarIdx = TextInputState::get_value_state_variable_index();

/// The `UpdateImmediateValue` action updates `immediate_value` but not `value`.
///
/// The `UpdateValue` action updates the `value` to match `immediate_value`.
#[test]
fn value_and_immediate_value_respond_to_actions() {
    let dast_root = dast_root_no_position(r#"<textInput/>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "");
    assert_eq!(get_value(text_input_idx, &mut core), "");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value state variable
    let type_word_action = update_immediate_value_action(String::from("hello"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");
}

/// The UpdateImmediateValue and UpdateValue actions work the same with a prefill,
/// only their initial values are from prefill.
#[test]
fn value_and_immediate_value_with_prefill_respond_to_actions() {
    let dast_root = dast_root_no_position(r#"<textInput prefill="hello" />"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value state variable
    let type_word_action = update_immediate_value_action(String::from("bye"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "bye");
}

mod test_helpers {
    use super::*;

    /// Resolves `immediate_value` and returns its value as a `String`
    pub fn get_immediate_value(component_idx: ComponentIdx, core: &mut DoenetMLCore) -> String {
        core.get_state_var_value(component_idx, IMMEDIATE_VALUE_IDX)
            .try_into()
            .unwrap()
    }

    /// Resolves `value` and returns its value as a `String`
    pub fn get_value(component_idx: ComponentIdx, core: &mut DoenetMLCore) -> String {
        core.get_state_var_value(component_idx, VALUE_IDX)
            .try_into()
            .unwrap()
    }

    /// Return the action for updating `immediate_value` to `text`.
    pub fn update_immediate_value_action(text: String, component_idx: ComponentIdx) -> Action {
        Action {
            component_idx,
            action: ActionsEnum::TextInput(TextInputAction::UpdateImmediateValue(ActionBody {
                args: TextInputActionArgs { text },
            })),
        }
    }

    /// Return the action for updating `value` to match `immediate_value`.
    pub fn update_value_action(component_idx: ComponentIdx) -> Action {
        Action {
            component_idx,
            action: ActionsEnum::TextInput(TextInputAction::UpdateValue),
        }
    }
}

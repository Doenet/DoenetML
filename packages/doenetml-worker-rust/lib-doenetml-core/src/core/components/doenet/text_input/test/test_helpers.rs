use super::*;

use crate::{
    components::{
        actions::{Action, ActionBody},
        doenet::{boolean::BooleanState, text::TextState},
        prelude::StateVarIdx,
        ActionsEnum,
    },
    ComponentIdx,
};

const IMMEDIATE_VALUE_IDX: StateVarIdx = TextInputState::get_immediate_value_state_variable_index();
const VALUE_IDX: StateVarIdx = TextInputState::get_value_state_variable_index();

const TEXT_VALUE_IDX: StateVarIdx = TextState::get_value_state_variable_index();
const BOOLEAN_VALUE_IDX: StateVarIdx = BooleanState::get_value_state_variable_index();

/// Resolves `immediate_value` of a text input and returns its value as a `String`
pub fn get_immediate_value(component_idx: ComponentIdx, core: &mut DoenetMLCore) -> String {
    core.get_state_var_value(component_idx, IMMEDIATE_VALUE_IDX)
        .try_into()
        .unwrap()
}

/// Resolves `value` of a text input and returns its value as a `String`
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

/// Resolves `value` from a `<text>` component and returns its value as a `String`
pub fn get_text_value(component_idx: ComponentIdx, core: &mut DoenetMLCore) -> String {
    core.get_state_var_value(component_idx, TEXT_VALUE_IDX)
        .try_into()
        .unwrap()
}

/// Resolves `value` from a `<boolean>` component and returns its value as a `bool`
pub fn get_boolean_value(component_idx: ComponentIdx, core: &mut DoenetMLCore) -> bool {
    core.get_state_var_value(component_idx, BOOLEAN_VALUE_IDX)
        .try_into()
        .unwrap()
}

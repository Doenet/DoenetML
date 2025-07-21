use doenetml_core::components::{
    ActionsEnum,
    doenet::{
        boolean::BooleanProps,
        text::TextProps,
        text_input::{TextInputActionArgs, TextInputActions, TextInputProps},
    },
    types::{Action, ActionBody},
};

use super::*;

const IMMEDIATE_VALUE_IDX: LocalPropIdx = TextInputProps::ImmediateValue.local_idx();
const VALUE_IDX: LocalPropIdx = TextInputProps::Value.local_idx();

const TEXT_VALUE_IDX: LocalPropIdx = TextProps::Value.local_idx();
const BOOLEAN_VALUE_IDX: LocalPropIdx = BooleanProps::Value.local_idx();

/// Resolves `immediate_value` of a text input and returns its value as a `String`
pub fn get_immediate_value(component_idx: ComponentIdx, core: &mut Core) -> String {
    let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx,
        local_prop_idx: IMMEDIATE_VALUE_IDX,
    });
    let value = core.get_prop_for_render_untracked(prop_node).value;

    (value).clone().try_into().unwrap()
}

/// Resolves `value` of a text input and returns its value as a `String`
pub fn get_value(component_idx: ComponentIdx, core: &mut Core) -> String {
    let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx,
        local_prop_idx: VALUE_IDX,
    });
    let value = core.get_prop_for_render_untracked(prop_node).value;

    (value).clone().try_into().unwrap()
}

/// Return the action for updating `immediate_value` to `text`.
pub fn update_immediate_value_action(text: String, component_idx: ComponentIdx) -> Action {
    Action {
        component_idx,
        action: ActionsEnum::TextInput(TextInputActions::UpdateImmediateValue(ActionBody {
            args: TextInputActionArgs { text },
        })),
    }
}

/// Return the action for updating `value` to match `immediate_value`.
pub fn update_value_action(component_idx: ComponentIdx) -> Action {
    Action {
        component_idx,
        action: ActionsEnum::TextInput(TextInputActions::UpdateValue),
    }
}

/// Resolves `value` from a `<text>` component and returns its value as a `String`
pub fn get_text_value(component_idx: ComponentIdx, core: &mut Core) -> String {
    let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx,
        local_prop_idx: TEXT_VALUE_IDX,
    });
    let value = core.get_prop_for_render_untracked(prop_node).value;

    (value).clone().try_into().unwrap()
}

/// Resolves `value` from a `<boolean>` component and returns its value as a `bool`
pub fn get_boolean_value(component_idx: ComponentIdx, core: &mut Core) -> bool {
    let prop_node = core.document_model.prop_pointer_to_prop_node(PropPointer {
        component_idx,
        local_prop_idx: BOOLEAN_VALUE_IDX,
    });
    let value = core.get_prop_for_render_untracked(prop_node).value;

    (value).clone().try_into().unwrap()
}

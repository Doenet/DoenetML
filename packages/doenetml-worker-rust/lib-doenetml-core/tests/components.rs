mod by_component;
mod test_utils;

use test_utils::*;

use doenetml_core::{
    components::{
        actions::{Action, ActionBody},
        doenet::{
            boolean::BooleanProps,
            text::TextProps,
            text_input::{TextInputAction, TextInputActionArgs, TextInputProps},
        },
        ActionsEnum, ComponentNode,
    },
    new_core::graph_based_core::Core,
    state::PropIdx,
    ComponentIdx,
};

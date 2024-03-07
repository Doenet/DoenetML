mod by_component;
mod test_utils;

use test_utils::*;

use doenetml_core::{
    components::{
        doenet::{
            boolean::BooleanProps,
            text::TextProps,
            text_input::{TextInputAction, TextInputActionArgs, TextInputProps},
        },
        types::{Action, ActionBody},
        ActionsEnum, ComponentNode,
    },
    new_core::graph_based_core::Core,
    state::PropIdx,
    ComponentIdx,
};

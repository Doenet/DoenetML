mod by_component;
mod test_utils;

use test_utils::*;

use doenetml_core::{
    components::{
        actions::{Action, ActionBody},
        doenet::{
            boolean::BooleanState,
            text::TextState,
            text_input::{TextInputAction, TextInputActionArgs, TextInputState},
        },
        ActionsEnum, ComponentNode,
    },
    state::PropIdx,
    ComponentIdx, DoenetMLCore,
};

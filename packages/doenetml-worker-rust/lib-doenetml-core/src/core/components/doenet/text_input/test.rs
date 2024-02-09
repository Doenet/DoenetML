use crate::{
    components::{
        actions::{Action, ActionBody},
        doenet::{
            text::TextState,
            text_input::{TextInputAction, TextInputActionArgs, TextInputState},
        },
        prelude::StateVarIdx,
        ActionsEnum, ComponentNode,
    },
    test_utils::dast_root_no_position,
    ComponentIdx, DoenetMLCore,
};

mod basic_actions;
mod test_helpers;
mod with_references;

use test_helpers::*;

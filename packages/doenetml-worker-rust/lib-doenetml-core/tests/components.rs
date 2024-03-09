mod by_component;
mod test_utils;

use test_utils::*;

use doenetml_core::{
    components::{
        types::{Action, ActionBody, ComponentIdx, PropIdx, PropPointer},
        ActionsEnum, ComponentNode,
    },
    core::graph_based_core::Core,
};

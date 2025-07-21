use enum_dispatch::enum_dispatch;

use serde::{Deserialize, Serialize};

use crate::components::{
    ComponentEnum,
    doenet::{
        graph::GraphActions, point::PointActions, text::TextActions, text_input::TextInputActions,
    },
    types::{ActionQueryProp, UpdateFromAction},
};

use super::{ComponentActions, ComponentNode};

/// An enum listing the actions that are available for each component type.
/// A deserialized version of this action will be sent to the component.
#[derive(Debug, Deserialize, Serialize, derive_more::TryInto)]
#[serde(tag = "component")]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub enum ActionsEnum {
    Text(TextActions),
    TextInput(TextInputActions),
    Point(PointActions),
    Graph(GraphActions),
}

/// The `ComponentOnAction` trait allows a component to handle actions sent to the component.
/// The default implementation throws an error on any action.
/// To add actions, a component type can implement the trait to override the defaults.
#[enum_dispatch]
pub trait ComponentOnAction: ComponentNode + ComponentActions {
    /// The function called when a renderer calls an action on this component.
    /// Given an `action_name` that is in the vector returned by `get_action_names()`,
    /// the function processes the `args` to return a vector where each component
    /// specifies a prop index and its desired value.
    ///
    /// Panics: if `action_name` is not in the vector returned by `get_action_names()`.
    #[allow(unused)]
    fn on_action(
        &self,
        action: ActionsEnum,
        query_prop: ActionQueryProp,
    ) -> Result<Vec<UpdateFromAction>, String> {
        Err(format!(
            "Unknown action '{:?}' called on {}. Expected one of {:?}",
            action,
            self.get_component_type(),
            self.get_action_names()
        ))
    }
}

use enum_dispatch::enum_dispatch;

use crate::components::*;

use super::ComponentNode;

/// The ComponentActions trait can be derived for a component,
/// giving it the default implementation of no actions.
/// To add actions, a component type can implement the trait to override the defaults.
#[enum_dispatch]
pub trait ComponentActions: ComponentNode {
    /// Return a list of the action names that the renderer can call on this component.
    /// The list much match
    fn get_action_names(&self) -> &'static [&'static str] {
        &[]
    }
}

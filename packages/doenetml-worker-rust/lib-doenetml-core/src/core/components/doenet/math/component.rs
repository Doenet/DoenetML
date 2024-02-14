use crate::components::prelude::*;

use super::MathState;

/// Definition of the `<math>` DoenetML component
#[derive(
    Debug,
    Default,
    ComponentNode,
    ComponentState,
    ComponentActions,
    ComponentAttributes,
    RenderedChildren,
)]
#[no_rendered_children]
#[component(when_extending(match_profile = "Math", store_in = "value"))]
pub struct Math {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The state variables that underlie the `<math>` component.
    pub state: MathState,
}

use std::collections::HashMap;

use crate::components::prelude::*;
use crate::general_prop::{PropAlias, StringProp};

/// Definition of the `<text>` DoenetML component
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
#[component(when_extending(match_profile = "String", store_in = "value"))]
pub struct Text {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The props that underlie the `<text>` component.
    pub state: TextState,
}

/// The props that underlie the `<text>` component.
#[derive(Debug, ComponentState)]
pub struct TextState {
    /// The value of the `<text>` component.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.value`.
    ///
    /// It is marked `for_renderer` to send this value to the renderer of the `<text>` component.
    ///
    /// It is marked as a component profile prop,
    /// which means this prop will be used if a parent of a `<text>` component
    /// queries for children with the `Text` component profile.
    #[is_public]
    #[for_renderer]
    #[component_profile_prop]
    value: Prop<String>,

    /// An alias to the `value` prop.
    ///
    /// It is marked public so that it can be referenced in DoenetML via `.text`.
    #[is_public]
    text: Prop<String>,
}

impl TextState {
    fn new() -> Self {
        TextState {
            value: StringProp::new_from_children("".to_string()).into_prop(),
            text: PropAlias::new(TextState::get_value_prop_index()).into_prop(),
        }
    }
}

impl Default for TextState {
    fn default() -> Self {
        TextState::new()
    }
}

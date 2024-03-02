use crate::components::prelude::*;
use crate::general_prop::{BooleanProp, BooleanToStringProp, PropAlias};

/// Definition of the `<boolean>` DoenetML component
#[derive(
    Debug,
    Default,
    ComponentNode,
    ComponentProps,
    ComponentActions,
    ComponentAttributes,
    ComponentChildrenOld,
)]
#[no_rendered_children]
#[component(extend_via_default_prop)]
pub struct Boolean {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The props that underlie the `<boolean>` component.
    pub state: BooleanState,
}

impl ComponentChildren for Boolean {
    fn get_children(&self, _child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return no children
        Vec::new()
    }
}

/// The props that underlie the `<boolean>` component.
#[derive(Debug, ComponentProps)]
pub struct BooleanState {
    /// The value of the `<boolean>` component.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.value`.
    ///
    /// It is marked `for_renderer` to send this value to the renderer of the `<boolean>` component.
    ///
    /// It is marked as a component profile prop,
    /// which means this prop will be used if a parent of a `<boolean>` component
    /// queries for children with the `Boolean` component profile.
    ///
    /// It is marked `default_prop`, which in combination with the component being marked `extend_via_default_prop`,
    /// means the `value` prop will be used if a `<boolean>` is extended to another component type.
    #[is_public]
    #[for_renderer]
    #[component_profile_prop]
    #[default_prop]
    value: Prop<bool>,

    /// An alias to the `value` prop.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.boolean`.
    #[is_public]
    boolean: Prop<bool>,

    /// A conversion of the boolean value into a string.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.text`.
    ///
    /// It is marked as a component profile prop,
    /// which means this prop will be used if a parent of a `<boolean>` component
    /// queries for children with the `Text` component profile.
    #[is_public]
    #[component_profile_prop]
    text: Prop<String>,
}

impl BooleanState {
    fn new() -> Self {
        BooleanState {
            value: BooleanProp::new_from_children(false).into_prop(),
            boolean: PropAlias::new(BooleanState::get_value_prop_index()).into_prop(),
            text: BooleanToStringProp::new(BooleanState::get_value_prop_index()).into_prop(),
        }
    }
}

impl Default for BooleanState {
    fn default() -> Self {
        BooleanState::new()
    }
}

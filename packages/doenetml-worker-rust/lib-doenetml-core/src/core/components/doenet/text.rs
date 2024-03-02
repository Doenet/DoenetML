use std::collections::HashMap;
use strum::VariantNames;

use crate::components::prelude::*;
use crate::general_prop::{BooleanProp, PropAlias, StringProp};

#[derive(Debug, AttributeProp)]
pub enum TextAttribute {
    /// Whether the `<text>` should be hidden.
    #[attribute(prop = BooleanProp, default = false)]
    Hide,
}

/// Definition of the `<text>` DoenetML component
#[derive(Debug, Default, ComponentNode, ComponentState, ComponentActions, ComponentChildrenOld)]
#[no_rendered_children]
#[component(extend_via_default_prop)]
pub struct Text {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The props that underlie the `<text>` component.
    pub state: TextState,
}

impl ComponentChildren for Text {
    fn get_children(&self, _child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return no children
        Vec::new()
    }
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
    ///
    /// It is marked `default_prop`, which in combination with the component being marked `extend_via_default_prop`,
    /// means the `value` prop will be used if a `<text>` is extended to another component type.
    #[is_public]
    #[for_renderer]
    #[component_profile_prop]
    #[default_prop]
    value: Prop<String>,

    /// An alias to the `value` prop.
    ///
    /// It is marked public so that it can be referenced in DoenetML via `.text`.
    #[is_public]
    text: Prop<String>,

    /// A variable that determines whether or not a text should be sent to the renderer (i.e., appear in the render tree).
    ///
    /// If `hidden` is true, then don't send the text to the renderer. (TODO: implement this)
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.hidden`.
    #[is_public]
    hidden: Prop<bool>,
}

impl TextState {
    fn new() -> Self {
        TextState {
            value: StringProp::new_from_children("".to_string()).into_prop(),
            text: PropAlias::new(TextState::get_value_prop_index()).into_prop(),
            hidden: TextAttribute::Hide.prop(),
        }
    }
}

impl Default for TextState {
    fn default() -> Self {
        TextState::new()
    }
}

impl ComponentAttributes for Text {
    fn get_attribute_names(&self) -> Vec<AttributeName> {
        TextAttribute::VARIANTS.into()
    }
}

use std::collections::HashMap;
use strum::VariantNames;

use crate::components::prelude::*;

use crate::general_prop::BooleanProp;

#[derive(Debug, AttributeProp)]
pub enum PAttribute {
    /// Whether the `<p>` should be hidden.
    #[attribute(prop = BooleanProp, default = false)]
    Hide,
}

#[derive(Debug, Default, ComponentNode, ComponentChildrenOld, ComponentProps, ComponentActions)]
#[pass_through_children]
pub struct P {
    pub common: ComponentCommonData,

    pub props: PProps,
}

#[derive(Debug, ComponentProps)]
pub struct PProps {
    /// A variable that determines whether or not a p should be sent to the renderer (i.e., appear in the render tree).
    ///
    /// If `hidden` is true, then don't send the p to the renderer. (TODO: implement this)
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.hidden`.
    #[is_public]
    hidden: Prop<bool>,
}

impl PProps {
    fn new() -> Self {
        PProps {
            hidden: PAttribute::Hide.prop(),
        }
    }
}

impl Default for PProps {
    fn default() -> Self {
        PProps::new()
    }
}

impl ComponentAttributes for P {
    fn get_attribute_names(&self) -> Vec<AttributeName> {
        PAttribute::VARIANTS.into()
    }
}

impl ComponentChildren for P {
    fn get_rendered_children(&self, child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return children without modification
        child_query_object.child_iter().collect()
    }
}

use strum::VariantNames;

use crate::{components::prelude::*, general_prop::BooleanProp};

use super::MathProps;

#[derive(Debug, AttributeProp)]
pub enum MathAttribute {
    /// Whether the `<math>` should split multi-character symbols into the product of the characters.
    #[attribute(prop = BooleanProp, default = true)]
    SplitSymbols,
}

/// Definition of the `<math>` DoenetML component
#[derive(Debug, Default, ComponentNode, ComponentProps, ComponentActions, ComponentChildrenOld)]
#[no_rendered_children]
#[component(extend_via_default_prop)]
pub struct Math {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The props that underlie the `<math>` component.
    pub props: MathProps,
}

impl ComponentAttributes for Math {
    fn get_attribute_names(&self) -> Vec<AttributeName> {
        MathAttribute::VARIANTS.into()
    }
}

impl ComponentChildren for Math {
    fn get_rendered_children(&self, _child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return no children
        Vec::new()
    }
}

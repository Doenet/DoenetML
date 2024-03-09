use crate::components::prelude::*;
use crate::general_prop::StringProp;
use doenetml_derive::component;

#[component(name = Text)]
mod component {
    enum Props {
        #[prop(value_type = PropValueType::String, is_public, profile = ComponentProfile::String, default)]
        Value,
    }

    enum Attributes {
        /// Whether the `<text>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}

pub use component::Text;
pub use component::TextActions;
pub use component::TextAttributes;
pub use component::TextProps;

// XXX - ignoring hide attribute

impl PropGetUpdater for component::Props {
    fn get_updater(&self) -> Box<dyn PropUpdater> {
        match self {
            component::Props::Value => Box::new(StringProp::new_from_children("".to_string())),
        }
    }
}

impl ComponentChildren for component::Component {
    fn get_rendered_children(&self, _child_query_object: ChildQueryObject) -> Vec<GraphNode> {
        // Return no children
        Vec::new()
    }
}
// #[derive(Debug, AttributeProp)]
// pub enum TextAttribute {
//     /// Whether the `<text>` should be hidden.
//     #[attribute(prop = BooleanProp, default = false)]
//     Hide,
// }

// impl ComponentAttributes for Text {
//     fn get_attribute_names(&self) -> Vec<AttributeName> {
//         TextAttribute::VARIANTS.into()
//     }
// }

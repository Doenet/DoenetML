use crate::components::prelude::*;
use crate::general_prop::{BooleanProp, StringProp};

#[component(name = Text, children = "none", extend_via_default_prop)]
mod component {
    enum Props {
        /// The value of the `<text>`. This is the content that will be displayed inside
        /// the `<text>` component.
        #[prop(
            value_type = PropValueType::String,
            is_public,
            profile = ComponentProfile::String,
            default
        )]
        Value,
        #[prop(value_type = PropValueType::Boolean)]
        Hidden,
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

impl PropGetUpdater for TextProps {
    fn get_updater(&self) -> Box<dyn PropUpdater> {
        match self {
            TextProps::Value => Box::new(StringProp::new_from_children("".to_string())),
            // TODO: derive this from TextAttributes so don't have to repeat the default value
            // or match the string name
            TextProps::Hidden => Box::new(BooleanProp::new_from_attribute("hide", false)),
        }
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

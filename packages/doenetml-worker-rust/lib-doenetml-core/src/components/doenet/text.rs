use crate::components::prelude::*;
use crate::general_prop::StringProp;

/// The `<text>` component displays its contents as text. It is one of the simplest
/// DoenetML components.
#[component(name = Text, extend_via_default_prop)]
mod component {

    use crate::general_prop::BooleanProp;

    enum Props {
        /// The value of the `<text>`. This is the content that will be displayed inside
        /// the `<text>` component.
        #[prop(
            value_type = PropValueType::String,
            is_public,
            profile = PropProfile::String,
            default,
            for_render,
        )]
        Value,

        /// Whether the `<text>` should be hidden.
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
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

impl PropGetUpdater for TextProps {
    fn get_updater(&self) -> Box<dyn PropUpdater> {
        match self {
            TextProps::Value => Box::new(StringProp::new_from_children("".to_string())),
            TextProps::Hidden => TextAttributes::Hide.get_prop_updater(),
        }
    }
}

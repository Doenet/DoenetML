use crate::components::prelude::*;
use crate::general_prop::PropAlias;
use crate::general_prop::StringProp;
use crate::props::UpdaterObject;

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
            profile = PropProfile::String,
            is_public,
            default,
            for_render,
        )]
        Value,

        #[prop(
            value_type = PropValueType::String,
            profile = PropProfile::String,
            is_public,
        )]
        Text,

        /// Whether the `<text>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
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
use component::attrs;
use component::props;

impl PropGetUpdater for TextProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            TextProps::Value => as_updater_object::<_, props::types::Value>(
                StringProp::new_from_children("".to_string()),
            ),
            TextProps::Text => as_updater_object::<_, props::types::Text>(PropAlias::new(
                TextProps::Value.local_idx(),
            )),
            TextProps::Hidden => {
                as_updater_object::<_, props::types::Hidden>(attrs::Hide::get_prop_updater())
            }
        }
    }
}

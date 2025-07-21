use crate::components::prelude::*;
use crate::general_prop::NumberProp;
use crate::general_prop::NumberToStringProp;
use crate::props::UpdaterObject;

/// The `<number>` component calculates a numerical (floating point) value from its contents
/// and displays the result as text.
#[component(name = Number, extend_via_default_prop)]
mod component {

    use crate::general_prop::BooleanProp;

    enum Props {
        /// The value of the `<number>`.
        #[prop(
            value_type = PropValueType::Number,
            profile = PropProfile::Number,
            is_public,
            default,
        )]
        Value,

        #[prop(
            value_type = PropValueType::String,
            profile = PropProfile::String,
            is_public,
            for_render,
        )]
        Text,

        /// Whether the `<number>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,
    }

    enum Attributes {
        /// Whether the `<number>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}

pub use component::Number;
pub use component::NumberActions;
pub use component::NumberAttributes;
pub use component::NumberProps;
use component::attrs;
use component::props;

impl PropGetUpdater for NumberProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            NumberProps::Value => as_updater_object::<_, props::types::Value>(
                NumberProp::new_from_children(prop_type::Number::NAN),
            ),
            NumberProps::Text => as_updater_object::<_, props::types::Text>(
                NumberToStringProp::new(NumberProps::Value.local_idx()),
            ),
            NumberProps::Hidden => {
                as_updater_object::<_, props::types::Hidden>(attrs::Hide::get_prop_updater())
            }
        }
    }
}

use crate::components::prelude::*;
use crate::general_prop::BooleanProp;
use crate::general_prop::BooleanToStringProp;
use crate::general_prop::PropAlias;
use crate::props::UpdaterObject;

#[component(name = Boolean, extend_via_default_prop)]
mod component {
    use crate::general_prop::BooleanProp;

    enum Props {
        /// The value of the `<boolean>`. This is the content that will be displayed inside
        /// the `<boolean>` component.
        #[prop(
            value_type = PropValueType::Boolean,
            is_public,
            profile = PropProfile::Boolean,
            default,
            for_render
        )]
        Value,

        #[prop(
            value_type = PropValueType::Boolean,
            is_public,
            profile = PropProfile::Boolean,
        )]
        Boolean,

        #[prop(value_type = PropValueType::String, is_public, profile = PropProfile::String)]
        Text,

        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,
    }

    enum Attributes {
        /// Whether the `<boolean>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}

pub use component::Boolean;
pub use component::BooleanActions;
pub use component::BooleanAttributes;
pub use component::BooleanProps;

impl PropGetUpdater for BooleanProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            BooleanProps::Value => as_updater_object::<_, component::props::types::Value>(
                BooleanProp::new_from_children(false),
            ),
            BooleanProps::Boolean => as_updater_object::<_, component::props::types::Boolean>(
                PropAlias::new(BooleanProps::Value.local_idx()),
            ),
            BooleanProps::Text => as_updater_object::<_, component::props::types::Text>(
                BooleanToStringProp::new(BooleanProps::Value.local_idx()),
            ),
            BooleanProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
        }
    }
}

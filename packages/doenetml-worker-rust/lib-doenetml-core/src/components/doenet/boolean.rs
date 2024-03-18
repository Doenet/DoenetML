use crate::components::prelude::*;
use crate::general_prop::BooleanProp;
use crate::props::BoxedUpdater;

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
            default
        )]
        Value,
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
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
    fn get_updater(&self) -> BoxedUpdater {
        match self {
            BooleanProps::Value => BooleanProp::new_from_children(false).into(),
            BooleanProps::Hidden => BooleanAttributes::Hide.get_prop_updater(),
        }
    }
}

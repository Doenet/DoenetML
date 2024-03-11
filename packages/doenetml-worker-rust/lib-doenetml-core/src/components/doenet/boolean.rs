use crate::components::prelude::*;
use crate::general_prop::BooleanProp;

#[component(name = Boolean, rendered_children = "none", extend_via_default_prop)]
mod component {
    use crate::general_prop::BooleanProp;

    enum Props {
        /// The value of the `<boolean>`. This is the content that will be displayed inside
        /// the `<boolean>` component.
        #[prop(
            value_type = PropValueType::Boolean,
            is_public,
            profile = ComponentProfile::Boolean,
            default
        )]
        Value,
        // #[prop(value_type = PropValueType::Boolean)]
        // Hidden,
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
    fn get_updater(&self) -> Box<dyn PropUpdater> {
        match self {
            BooleanProps::Value => Box::new(BooleanProp::new_from_children(false)),
        }
    }
}

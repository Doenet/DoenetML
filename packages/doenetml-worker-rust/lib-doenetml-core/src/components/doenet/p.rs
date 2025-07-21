use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

/// The `<p>` component renders its children
#[component(name = P)]
mod component {

    use crate::general_prop::BooleanProp;

    enum Props {
        /// Whether the `<p>` should be hidden.
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
        Hidden,
        #[prop(value_type = PropValueType::AnnotatedContentRefs, profile = PropProfile::RenderedChildren)]
        RenderedChildren,
    }

    enum Attributes {
        /// Whether the `<p>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}

pub use component::P;
pub use component::PActions;
pub use component::PAttributes;
pub use component::PProps;

impl PropGetUpdater for PProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            PProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
            PProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
        }
    }
}

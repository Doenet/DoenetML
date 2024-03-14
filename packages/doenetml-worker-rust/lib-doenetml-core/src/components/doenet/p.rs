use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;

/// The `<p>` component renders its children
#[component(name = P)]
mod component {

    use crate::general_prop::BooleanProp;

    enum Props {
        /// Whether the `<p>` should be hidden.
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
        Hidden,
        #[prop(value_type = PropValueType::GraphNodes, profile = PropProfile::RenderedChildren)]
        RenderedChildren,
    }

    enum Attributes {
        /// Whether the `<p>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}

pub use component::PActions;
pub use component::PAttributes;
pub use component::PProps;
pub use component::P;

impl PropGetUpdater for PProps {
    fn get_updater(&self) -> Box<dyn PropUpdater> {
        match self {
            PProps::Hidden => PAttributes::Hide.get_prop_updater(),
            PProps::RenderedChildren => Box::new(RenderedChildrenPassthroughProp::new()),
        }
    }
}

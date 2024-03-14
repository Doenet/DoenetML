use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;

/// The `<title>` component renders its children
#[component(name = Title)]
mod component {

    enum Props {
        #[prop(value_type = PropValueType::GraphNodes, profile = PropProfile::RenderedChildren)]
        RenderedChildren,
    }
}

pub use component::Title;
pub use component::TitleActions;
pub use component::TitleAttributes;
pub use component::TitleProps;

impl PropGetUpdater for TitleProps {
    fn get_updater(&self) -> Box<dyn PropUpdater> {
        match self {
            TitleProps::RenderedChildren => Box::new(RenderedChildrenPassthroughProp::new()),
        }
    }
}

use std::rc::Rc;

use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::BoxedUpdater;

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
    fn get_updater(&self) -> BoxedUpdater {
        match self {
            TitleProps::RenderedChildren => Rc::new(RenderedChildrenPassthroughProp::new()),
        }
    }
}

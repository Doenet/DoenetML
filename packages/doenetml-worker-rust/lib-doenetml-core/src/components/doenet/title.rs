use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

/// The `<title>` component renders its children
#[component(name = Title)]
mod component {

    enum Props {
        #[prop(
            value_type = PropValueType::AnnotatedContentRefs,
            profile = PropProfile::RenderedChildren
        )]
        RenderedChildren,
    }
}

pub use component::Title;
pub use component::TitleActions;
pub use component::TitleAttributes;
pub use component::TitleProps;

impl PropGetUpdater for TitleProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            TitleProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
        }
    }
}

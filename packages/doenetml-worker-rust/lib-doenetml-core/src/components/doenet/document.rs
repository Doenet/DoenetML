use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

/// The `Document` component is the root of every _DoenetML_ document.
#[component(name = Document)]
pub mod component {
    use crate::props::ForRenderOutputs;

    enum Props {
        #[prop(
            value_type = PropValueType::AnnotatedContentRefs,
            profile = PropProfile::RenderedChildren
        )]
        RenderedChildren,
    }
}

// Re-export the components generated by the `#[component]` macro.
pub use component::Document;
pub use component::DocumentActions;
pub use component::DocumentAttributes;
pub use component::DocumentProps;

impl PropGetUpdater for DocumentProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            DocumentProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
        }
    }
}

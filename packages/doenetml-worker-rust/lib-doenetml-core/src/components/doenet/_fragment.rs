use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

/// An internal-use-only component that is used to group content together for rendering.
/// For example, this component is used to render `$s.title` in `<section name="s" />$s.title`.
#[component(name = _Fragment)]
mod component {
    enum Props {
        #[prop(
            value_type = PropValueType::AnnotatedContentRefs,
            profile = PropProfile::RenderedChildren
        )]
        RenderedChildren,
    }
}

pub use component::_Fragment;
pub use component::_FragmentActions;
pub use component::_FragmentAttributes;
pub use component::_FragmentProps;

impl PropGetUpdater for _FragmentProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            _FragmentProps::RenderedChildren => {
                as_updater_object::<_, component::props::types::RenderedChildren>(
                    RenderedChildrenPassthroughProp::new(),
                )
            }
        }
    }
}

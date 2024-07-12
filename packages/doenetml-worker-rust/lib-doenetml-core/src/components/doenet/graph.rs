use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

#[component(name = Graph)]
mod component {

    use crate::general_prop::BooleanProp;

    enum Props {
        /// Whether the `<graph>` should be hidden.
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
        Hidden,
        #[prop(value_type = PropValueType::AnnotatedContentRefs, profile = PropProfile::RenderedChildren)]
        RenderedChildren,
    }

    enum Attributes {
        /// Whether the `<graph>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}

pub use component::Graph;
pub use component::GraphActions;
pub use component::GraphAttributes;
pub use component::GraphProps;

impl PropGetUpdater for GraphProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            GraphProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
            GraphProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
        }
    }
}

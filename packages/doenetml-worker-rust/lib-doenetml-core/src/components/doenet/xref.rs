use crate::components::prelude::*;
use crate::general_prop::RenderedChildrenPassthroughProp;
use crate::props::UpdaterObject;

/// The `<xref>` component renders its children
#[component(name = Xref)]
mod component {

    use super::*;
    use crate::general_prop::{BooleanProp, ComponentRefProp};

    enum Props {
        /// Whether the `<xref>` should be hidden.
        #[prop(
            value_type = PropValueType::Boolean,
            profile = PropProfile::Hidden
        )]
        Hidden,

        /// The component that this `<xref>` refers to.
        #[prop(
            value_type = PropValueType::ComponentRef,
        )]
        Referent,

        #[prop(
            value_type = PropValueType::ContentRefs,
            profile = PropProfile::RenderedChildren
        )]
        RenderedChildren,
    }

    enum Attributes {
        /// Whether the `<xref>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,

        /// The item this `<xref>` refers to.
        #[attribute(prop = ComponentRefProp, default = None, preserve_refs)]
        Ref,
    }
}

pub use component::Xref;
pub use component::XrefActions;
pub use component::XrefAttributes;
pub use component::XrefProps;

impl PropGetUpdater for XrefProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            XrefProps::Hidden => as_updater_object::<_, component::props::types::Hidden>(
                component::attrs::Hide::get_prop_updater(),
            ),
            XrefProps::RenderedChildren => as_updater_object::<
                _,
                component::props::types::RenderedChildren,
            >(RenderedChildrenPassthroughProp::new()),
            XrefProps::Referent => as_updater_object::<_, component::props::types::Referent>(
                component::attrs::Ref::get_prop_updater(),
            ),
        }
    }
}

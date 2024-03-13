use crate::components::prelude::*;
use crate::general_prop::ElementRefsProp;

/// The `<section>` component renders its children along with a title
#[component(name = Section, rendered_children = "passthrough")]
mod component {

    use crate::general_prop::BooleanProp;

    enum Props {
        /// The `<title>` child of the `<section>` that contain's the section's title
        #[prop(
            value_type = PropValueType::ElementRefs,
            is_public,
        )]
        Title,
        /// Whether the `<section>` should be hidden.
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
        Hidden,
    }

    enum Attributes {
        /// Whether the `<text>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}

pub use component::Section;
pub use component::SectionActions;
pub use component::SectionAttributes;
pub use component::SectionProps;

impl PropGetUpdater for SectionProps {
    fn get_updater(&self) -> Box<dyn PropUpdater> {
        match self {
            SectionProps::Title => Box::new(ElementRefsProp::new_from_last_matching_child("title")),
            SectionProps::Hidden => SectionAttributes::Hide.get_prop_updater(),
        }
    }
}

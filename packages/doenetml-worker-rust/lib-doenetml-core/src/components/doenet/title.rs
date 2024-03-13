use crate::components::prelude::*;

/// The `<title>` component renders its children
#[component(name = Title, rendered_children = "passthrough")]
mod component {}

pub use component::Title;
pub use component::TitleActions;
pub use component::TitleAttributes;
pub use component::TitleProps;

impl PropGetUpdater for TitleProps {
    fn get_updater(&self) -> Box<dyn PropUpdater> {
        unimplemented!()
    }
}

use crate::components::{types::PropPointer, Boolean, PropProfile, Text};

use super::{PropUpdater, PropValueDiscriminants};

/// Data associated with a prop that is "owned" by a component.
#[derive(Debug, Clone)]
pub struct PropComponentMeta {
    // Name of the prop
    pub name: &'static str,
    /// PropPointer to this prop.
    pub prop_pointer: PropPointer,
    /// The profile that this prop matches.
    pub profile: Option<PropProfile>,
    /// Whether this prop is _always_ computed whenever this component is rendered.
    pub for_renderer: bool,
    pub public: bool,
}

/// A `Prop` is a piece of dynamically computed data associated with a component.
/// Its value is lazily computed and can depend on other `Prop`s.
#[derive(Debug)]
pub struct Prop {
    /// The updater holds all of the `calculate`, etc. functions for the prop.
    pub updater: Box<dyn PropUpdater>,
    pub variant: PropValueDiscriminants,
    /// Information about the prop that can only be determined from the parent component.
    pub meta: PropComponentMeta,
}

impl Prop {
    /// Sometimes we need to render a prop. Since only components can be rendered,
    /// the prop needs to be wrapped in a component. This function returns the component
    /// type that should be used to wrap the prop.
    pub fn preferred_component_type(&self) -> &'static str {
        match self.variant {
            PropValueDiscriminants::Integer => {
                unimplemented!("haven't yet created a number component")
            }
            PropValueDiscriminants::Number => {
                unimplemented!("haven't yet created a number component")
            }
            PropValueDiscriminants::String => Text::NAME,
            PropValueDiscriminants::Boolean => Boolean::NAME,
            PropValueDiscriminants::Math => "math",
        }
    }
}

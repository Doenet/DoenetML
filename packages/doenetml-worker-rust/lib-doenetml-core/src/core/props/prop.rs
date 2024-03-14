use crate::components::{types::PropPointer, Boolean, Text};

use super::{PropProfile, PropUpdater, PropValueDiscriminants};

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

/// A `PropDefinition` stores functions needed to compute a `PropValue` as required
/// by a component.
/// Its value is lazily computed and can depend on props coming from other components.
#[derive(Debug)]
pub struct PropDefinition {
    /// The updater holds all of the `calculate`, etc. functions for the prop.
    pub updater: Box<dyn PropUpdater>,
    pub variant: PropValueDiscriminants,
    /// Information about the prop that can only be determined from the parent component.
    pub meta: PropComponentMeta,
}

impl PropDefinition {
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
            // TODO: starting to accumulate these "no preferred" panics.
            // Maybe a sign that we need to rethink how this `preferred_component_type()` works?
            PropValueDiscriminants::ElementRefs => {
                panic!("No preferred component type for an ElementRefs PropValue")
            }
            PropValueDiscriminants::GraphNodes => {
                panic!("No preferred component type for an GraphNodes PropValue")
            }
        }
    }
}

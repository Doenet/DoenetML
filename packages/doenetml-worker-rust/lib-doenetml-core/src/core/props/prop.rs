use std::rc::Rc;

use crate::components::{types::PropPointer, Boolean, Text, _Fragment};

use super::{PropProfile, PropUpdaterUntyped, PropValueDiscriminants};

/// Data associated with a prop that is "owned" by a component.
#[derive(Debug, Clone)]
pub struct PropDefinitionMeta {
    // Name of the prop
    pub name: &'static str,
    /// PropPointer to this prop.
    pub prop_pointer: PropPointer,
    /// The profile that this prop matches.
    pub profile: Option<PropProfile>,
    /// Whether this prop is _always_ computed whenever this component is rendered.
    pub for_render: bool,
    pub public: bool,
}

/// Type of `PropUpdater` trait object.
pub type UpdaterObject = Rc<dyn PropUpdaterUntyped>;

/// A `PropDefinition` stores functions needed to compute a `PropValue` as required
/// by a component.
/// Its value is lazily computed and can depend on props coming from other components.
#[derive(Debug, Clone)]
pub struct PropDefinition {
    /// The updater holds all of the `calculate`, etc. functions for the prop.
    pub updater: UpdaterObject,
    pub variant: PropValueDiscriminants,
    /// Information about the prop that can only be determined from the parent component.
    pub meta: PropDefinitionMeta,
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
            PropValueDiscriminants::ComponentRef
            | PropValueDiscriminants::ComponentRefs
            | PropValueDiscriminants::ContentRefs
            | PropValueDiscriminants::ContentRef => _Fragment::NAME,
        }
    }
}

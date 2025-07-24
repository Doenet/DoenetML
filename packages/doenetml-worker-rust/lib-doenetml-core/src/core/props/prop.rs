use std::rc::Rc;

use crate::components::{_Fragment, Boolean, Math, Number, Text, types::PropPointer};

use super::{PropProfile, PropUpdaterUntyped, PropValueType};

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
    pub for_render: ForRenderOutputs,
    pub public: bool,
}

/// Type of `PropUpdater` trait object.
pub type UpdaterObject = Rc<dyn PropUpdaterUntyped>;

/// `ForRenderOutputs` specifies whether or not a prop is sent to the UI when the component is
/// being rendered in a graph or in text.
#[derive(Debug, Clone, Copy, Default)]
pub struct ForRenderOutputs {
    pub in_graph: bool,
    pub in_text: bool,
}

#[derive(Debug, Clone, Copy)]
pub enum RenderContext {
    InGraph,
    InText,
}

/// A `PropDefinition` stores functions needed to compute a `PropValue` as required
/// by a component.
/// Its value is lazily computed and can depend on props coming from other components.
#[derive(Debug, Clone)]
pub struct PropDefinition {
    /// The updater holds all of the `calculate`, etc. functions for the prop.
    pub updater: UpdaterObject,
    pub variant: PropValueType,
    /// Information about the prop that can only be determined from the parent component.
    pub meta: PropDefinitionMeta,
}

impl PropDefinition {
    /// Sometimes we need to render a prop. Since only components can be rendered,
    /// the prop needs to be wrapped in a component. This function returns the component
    /// type that should be used to wrap the prop.
    pub fn preferred_component_type(&self) -> &'static str {
        match self.variant {
            PropValueType::Number => Number::NAME,
            PropValueType::Math => Math::NAME,
            PropValueType::String => Text::NAME,
            PropValueType::Boolean => Boolean::NAME,

            PropValueType::Integer => {
                unimplemented!("haven't yet created a integer component")
            }

            PropValueType::ComponentRef
            | PropValueType::ComponentRefs
            | PropValueType::AnnotatedContentRefs
            | PropValueType::ContentRefs
            | PropValueType::ContentRef => _Fragment::NAME,

            PropValueType::XrefLabel
            | PropValueType::ListDepth
            | PropValueType::ListMarker
            | PropValueType::DivisionType => {
                panic!("no bare references to {:?} allowed", self.variant)
            }
            _ => {
                panic!("No preferred component type for {:?}", self.variant)
            }
        }
    }

    pub fn profile_from_prop_value_type(&self) -> Option<PropProfile> {
        match self.variant {
            PropValueType::Number => Some(PropProfile::Number),
            PropValueType::Math => Some(PropProfile::Math),
            PropValueType::String => Some(PropProfile::String),
            PropValueType::Boolean => Some(PropProfile::Boolean),
            _ => None,
        }
    }
}

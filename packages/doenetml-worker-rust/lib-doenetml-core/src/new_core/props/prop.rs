use crate::{components::ComponentProfile, state::PropPointer};

use super::{PropUpdater, PropValueDiscriminants};

/// Data associated with a prop that is "owned" by a component.
#[derive(Debug, Clone)]
pub struct PropComponentMeta {
    // Name of the prop
    pub name: &'static str,
    /// PropPointer to this prop.
    pub prop_pointer: PropPointer,
    /// The profile that this prop matches.
    pub profile: Option<ComponentProfile>,
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
    pub fn preferred_component_type(&self) -> &'static str {
        match self.variant {
            PropValueDiscriminants::Integer => {
                unimplemented!("haven't yet created a number component")
            }
            PropValueDiscriminants::Number => {
                unimplemented!("haven't yet created a number component")
            }
            PropValueDiscriminants::String => "text",
            PropValueDiscriminants::Boolean => "boolean",
            PropValueDiscriminants::Math => "math",
        }
    }
    //    pub fn new() -> Self {
    //        Self {
    //            component_meta: None,
    //        }
    //    }
    //    pub fn with_component_meta(self, component_meta: PropComponentMeta) -> Self {
    //        Self {
    //            component_meta: Some(component_meta),
    //        }
    //    }
}

//struct TrivialPropUpdater {}
//impl PropUpdater for TrivialPropUpdater {
//    fn data_queries(&self) -> Vec<DataQuery> {
//        vec![]
//    }
//    fn calculate(&self, _data: Vec<DataQueryResult>) -> PropCalcResult<PropValue> {
//        PropCalcResult::Calculated(PropValue::String("".to_string()))
//    }
//}

use std::fmt::Display;

/// The name (camelCase) of a state variable that could be
/// a basic or an array depending on the component.
pub type StateVarName = &'static str;

/// camelCase
pub type InstructionName = &'static str;

/// camelCase
pub type ComponentType = &'static str;

/// camelCase
pub type AttributeName = &'static str;

/// A ComponentName is not static because it cannot be known at compile time.
pub type ComponentName = String;


/// A single value
#[derive(Debug, PartialEq, Eq, Hash, Clone, serde::Serialize)]
pub enum StateVarReference {
    Basic(StateVarName),
    ArrayElement(StateVarName, usize),
    SizeOf(StateVarName),
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, serde::Serialize)]
pub enum StateVarGroup {
    Single(StateVarReference),
    Array(StateVarName),
}

impl StateVarReference {
    pub fn name(&self) -> StateVarName {
        match self {
            Self::Basic(name) => name,
            Self::ArrayElement(name, _) => name,
            Self::SizeOf(name) => name,
        }
    }
}


/// Macros for logging.
macro_rules! log {
    ( $( $t:tt )* ) => {

        #[cfg(feature = "web")]
        web_sys::console::log_1(&format!( $( $t )* ).into());

        #[cfg(not(feature = "web"))]
        println!( $( $t )* )
    }
}
macro_rules! log_json {
    ( $label:expr, $a:expr ) => {

        #[cfg(feature = "web")]
        web_sys::console::log_2(&$label.into(), &wasm_bindgen::JsValue::from_serde(&$a).unwrap());
    }
}
macro_rules! log_debug {
    ( $( $t:tt )* ) => {

        #[cfg(feature = "web")]
        web_sys::console::debug_1(&format!( $( $t )* ).into());

        #[cfg(not(feature = "web"))]
        println!( $( $t )* )
    }
}

pub(crate) use log;
pub(crate) use log_json;
pub(crate) use log_debug;





/// This error is caused by invalid DoenetML.
/// It is thrown only on core creation.
#[derive(Debug)]
pub enum DoenetMLError {
    ComponentDoesNotExist {
        comp_name: String
    },
    StateVarDoesNotExist {
        comp_name: String,
        sv_name: String,
    },
    AttributeDoesNotExist {
        comp_name: String,
        attr_name: String,
    },
    InvalidComponentType {
        comp_type: String,
    },

    ComponentCopiesAncestor {
        comp_name: String,
        ancestor_name: String,
    },

//     CyclicalReference {
//         comp_name: String,
//         sv_name: String,
//     },
}

impl std::error::Error for DoenetMLError {}
impl Display for DoenetMLError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use DoenetMLError::*;

        match self {
            ComponentDoesNotExist { comp_name } => 
                write!(f, "Component {} does not exist", comp_name),
            StateVarDoesNotExist { comp_name, sv_name } =>
                write!(f, "State variable {} does not exist on {}", sv_name, comp_name),
            AttributeDoesNotExist { comp_name, attr_name } =>
                write!(f, "Attribute {} does not exist on {}", attr_name, comp_name),
            InvalidComponentType { comp_type } => 
                write!(f, "Component type {} does not exist", comp_type),
            ComponentCopiesAncestor { comp_name, ancestor_name } => 
                write!(f, "Component {} copies ancestor {}", comp_name, ancestor_name),
            // CyclicalReference { comp_name, sv_name } => 
                // write!(f, "State variable {} for {} references itself", comp_name, sv_name),

        }
    }
}




impl Display for StateVarReference {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Basic(sv_name) => write!(f, "{}", sv_name),
            Self::SizeOf(sv_name) => write!(f, "{}.size", sv_name),
            Self::ArrayElement(sv_name, i) => write!(f, "{}[{}]", sv_name, i),
        }
    }
}
impl Display for StateVarGroup {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Single(sv_ref) => write!(f, "Single::{}", sv_ref),
            Self::Array(sv_name) => write!(f, "Array::{}", sv_name),
        }
    }
}

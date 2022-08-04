/// camelCase
pub type StateVarName = &'static str;

/// camelCase
pub type InstructionName = &'static str;

/// camelCase
pub type ComponentType = &'static str;

/// camelCase
pub type AttributeName = &'static str;

// A ComponentName is not be static because it cannot be known at compile time.
pub type ComponentName = String;


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
            StateVarReference::Basic(name) => name,
            StateVarReference::ArrayElement(name, _) => name,
            StateVarReference::SizeOf(name) => name,
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
use std::{fmt::Display};

pub(crate) use log;
pub(crate) use log_json;
pub(crate) use log_debug;



impl Display for StateVarGroup {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}
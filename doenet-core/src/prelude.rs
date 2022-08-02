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


/// A basic StateVarReference refers to either of the following:
/// - StateVarDefinition, refering to the single state variable
/// - StateVarArrayDefinition, refering to the entire array
///
/// ArrayElement and SizeOf refer to state variables that go along with
/// an array state variable.
/// They are "subsets" of a basic reference to an array state var.
#[derive(Debug, PartialEq, Eq, Hash, Clone)]
pub enum StateVarReference {
    Basic(StateVarName),
    ArrayElement(StateVarName, usize),
    SizeOf(StateVarName),
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
pub(crate) use log;
pub(crate) use log_json;
pub(crate) use log_debug;


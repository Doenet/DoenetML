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

/// Macros providing println! style syntax for logging.
macro_rules! log {
    ( $( $t:tt )* ) => {

        #[cfg(feature = "web")]
        web_sys::console::log_1(&format!( $( $t )* ).into());

        #[cfg(not(feature = "web"))]
        println!( $( $t )* )
    }
}
macro_rules! log_json {
    ( $label:expr, $a:ident ) => {

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

// #[link(name = "logger", kind = "static")]
// extern "Rust" {
//     pub fn log_json(json_obj: serde_json::Value);
// }
// pub(crate) use log_json;

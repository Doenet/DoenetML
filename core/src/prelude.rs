/// camelCase
pub type StateVarName = &'static str;

/// camelCase
pub type InstructionName = &'static str;

/// camelCase
pub type ComponentType = &'static str;

/// camelCase
pub type AttributeName = &'static str;


/// A macro to provide println! style syntax for console.log logging.
macro_rules! log {
    ( $( $t:tt )* ) => {

        #[cfg(feature = "web")]
        web_sys::console::log_1(&format!( $( $t )* ).into());

        #[cfg(not(feature = "web"))]
        println!( $( $t )* )
    }
}
pub(crate) use log;

// #[link(name = "logger", kind = "static")]
// extern "Rust" {
//     pub fn log_json(json_obj: serde_json::Value);
// }
// pub(crate) use log_json;

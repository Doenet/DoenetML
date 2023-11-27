// use crate::state::EssentialStateVar;
// use crate::EssentialDataOrigin;

use serde_json::{json, Map, Value};

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
        web_sys::console::log_2(
            &$label.into(),
            &wasm_bindgen::JsValue::from_serde(&$a).unwrap(),
        );
    };
}
macro_rules! log_debug {
    ( $( $t:tt )* ) => {

        // #[cfg(all(feature = "web", feature = "web-debug-log"))]
        #[cfg(feature = "web")]
        web_sys::console::debug_1(&format!( $( $t )* ).into());

        // #[cfg(not(feature = "web"))]
        // println!( $( $t )* )
    }
}

pub(crate) use log;
pub(crate) use log_debug;
pub(crate) use log_json;

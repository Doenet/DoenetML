use std::collections::HashMap;

pub trait KeyValueIgnoreCase<K, V> {
    fn get_key_value_ignore_case<'a>(&'a self, key: &str) -> Option<(&'a K, &'a V)>;
}

impl<K, V> KeyValueIgnoreCase<K, V> for HashMap<K, V>
where
    K: ToString + std::cmp::Eq + std::hash::Hash,
{
    /// Match key to the HashMap keys, ignoring case.
    /// Return the original key-value pair the the HashMap.
    fn get_key_value_ignore_case<'a>(&'a self, key: &str) -> Option<(&'a K, &'a V)> {
        let lowercase_to_original: HashMap<String, &K> = self
            .keys()
            .map(|k| (k.to_string().to_lowercase(), k))
            .collect();

        lowercase_to_original
            .get(&key.to_string().to_lowercase())
            .and_then(|k| self.get_key_value(k))
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

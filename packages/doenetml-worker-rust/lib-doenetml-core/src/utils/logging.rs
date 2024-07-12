/// Macros for logging.
#[macro_export]
#[allow(unused)]
macro_rules! log {
    ( $( $t:tt )* ) => {

      #[cfg(feature = "testing")]
      {
          println!( $( $t )* );
      }
      #[cfg(not(feature = "testing"))]
      {
          #[cfg(feature = "web")]
          web_sys::console::log_1(&format!( $( $t )* ).into());

          #[cfg(not(feature = "web"))]
          println!( $( $t )* );
      }
    }
}
#[macro_export]
#[allow(unused)]
macro_rules! log_json {
    ( $label:expr, $a:expr ) => {
        #[cfg(not(feature = "testing"))]
        {
            #[cfg(feature = "web")]
            web_sys::console::log_2(
                &$label.into(),
                &wasm_bindgen::Jpropalue::from_serde(&$a).unwrap(),
            );
        }
    };
}
#[macro_export]
#[allow(unused)]
macro_rules! log_debug {
    ( $( $t:tt )* ) => {

      #[cfg(not(feature = "testing"))]
      {
        // #[cfg(all(feature = "web", feature = "web-debug-log"))]
        #[cfg(feature = "web")]
        web_sys::console::debug_1(&format!( $( $t )* ).into());

        // #[cfg(not(feature = "web"))]
        // println!( $( $t )* )
      }
    }
}

#[macro_export]
#[allow(unused)]
pub(crate) use log;
#[macro_export]
#[allow(unused)]
pub(crate) use log_debug;
#[macro_export]
#[allow(unused)]
pub(crate) use log_json;

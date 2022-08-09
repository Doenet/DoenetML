mod utils;

extern crate web_sys;

use wasm_bindgen::prelude::*;

use doenet_core::DoenetCore;


// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// A macro to provide println! style syntax for console.log logging.
// macro_rules! log {
//     ( $( $t:tt )* ) => {
//         web_sys::console::log_1(&format!( $( $t )* ).into());
//     }
// }

// Raw module means that this relative path is based on the wasm file's location
// -#[wasm_bindgen(raw_module = "/src/Core/CoreWorker.js")]
// -extern "C" {
// -    fn logJson(label: &str, json_obj: String);
// -}

// // Raw module means that this relative path is based on the wasm file's location
// #[wasm_bindgen(module = "compiled_parser/parser")]
// extern "C" {
//     pub fn parseAndCompile(in_text: String) -> JsValue;
// }



#[wasm_bindgen]
#[derive(Debug)]
pub struct PublicDoenetCore(DoenetCore);



#[wasm_bindgen]
impl PublicDoenetCore {
    /// Create components from JSON tree and create all dependencies.
    pub fn new(program: &str) -> PublicDoenetCore {

        utils::set_panic_hook();

        web_sys::console::time_with_label("DoenetCore creation");
                
        let (core, doenet_ml_errors) = doenet_core::create_doenet_core(program);

        for ml_error in doenet_ml_errors {
            web_sys::console::error_1(&JsValue::from_str(&format!("DoenetML Error: {}", ml_error)));
        }

        web_sys::console::time_end_with_label("DoenetCore creation");
    
        PublicDoenetCore(core)
    }


    pub fn display_all_state(&self) -> String {
        serde_json::to_string(&doenet_core::utils::json_components(
            &self.0.component_nodes,
            &self.0.component_states
        )).unwrap_or_default()
    }


    pub fn update_renderers(&self) -> String {

        web_sys::console::time_with_label("Update renderers");

        let result = doenet_core::update_renderers(&self.0);

        web_sys::console::time_end_with_label("Update renderers");

        result

    }



    pub fn handle_action(&self, action: &str) {

        doenet_core::handle_action_from_json(&self.0, action);
    }

}

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
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

// // Raw module means that this relative path is based on the wasm file's location
// #[wasm_bindgen(raw_module = "/src/Core/CoreWorker.js")]
// extern "C" {
//     fn logJson(label: &str, json_obj: String);
// }


// // Raw module means that this relative path is based on the wasm file's location
// #[wasm_bindgen(module = "compiled_parser/parser")]
// extern "C" {
//     pub fn parseAndCompile(in_text: String) -> JsValue;
// }



// pub extern "Rust" fn log_json(_json_obj: serde_json::Value) {
//     logJson();src/Parser/ompiled_parser
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
                
        log!("core recieved the string: {}", program);

        let core = doenet_core::create_doenet_core(program);

        // logJson("Components on core creation\n", to_string(&doenet_core::json_components(&core)).unwrap());
        // logJson("Dependencies on core creation\n", to_string(&doenet_core::utils::json_dependencies(&core.dependencies)).unwrap());

        web_sys::console::time_end_with_label("DoenetCore creation");
    
        PublicDoenetCore(core)
    }




    pub fn update_renderers(&self) -> String {

        // log!("Components\n{:#?}", &self.0.components);
        doenet_core::update_renderers(&self.0)
    }



    pub fn handle_action(&self, action: &str) {

        // log!("core recieved the string: {}", action);

        doenet_core::handle_action_from_json(&self.0, action);

        // logJson(
        //     "Updated component tree\n",
        //     serde_json::to_string(&doenet_core::json_components(&self.0)).unwrap()
        // );
    }


    // pub fn components_as_json_string(&self) -> String {

    //     let root_component = self.0.components.get(&self.0.root_component_name).unwrap();
    //     let json_obj = doenet_core::package_subtree_as_json(root_component);

    //     serde_json::to_string(&json_obj).unwrap()
    // }
}

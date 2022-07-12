mod utils;

extern crate web_sys;

use wasm_bindgen::prelude::*;

use core::DoenetCore;




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


#[wasm_bindgen]
#[derive(Debug)]
pub struct PublicDoenetCore(DoenetCore);



#[wasm_bindgen]
impl PublicDoenetCore {
    /// Create components from JSON tree and create all dependencies.
    pub fn new(program: &str) -> PublicDoenetCore {

        utils::set_panic_hook();
                
        // log!("core recieved the string: {}", program);

        let json_deserialized: serde_json::Value = serde_json::from_str(program).unwrap();

        // log!("rust json: {:#?}", json_deserialized);

        let core = core::create_doenet_core(json_deserialized);

        log!("Components\n{:#?}", core.components);
        log!("Dependencies\n{:#?}", core.dependencies);
    
        PublicDoenetCore(core)
    }




    pub fn update_renderers(&self) -> String {
        let json_obj = core::update_renderers(&self.0);
        serde_json::to_string(&json_obj).unwrap()
    }



    pub fn handle_action(&self, action: &str) {
        let json_action: serde_json::Value = serde_json::from_str(&action).unwrap();

        core::handle_action(&self.0, json_action);

        log!("Components after action: {:#?}", self.0.components);
    }


    pub fn component_tree_as_json_string(&self) -> String {

        let root_component = self.0.components.get(&self.0.root_component_name).unwrap();
        let json_obj = core::package_subtree_as_json(&self.0, root_component);

        serde_json::to_string(&json_obj).unwrap()
    }
}

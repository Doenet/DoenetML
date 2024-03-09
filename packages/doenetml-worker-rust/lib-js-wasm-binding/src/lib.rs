mod utils;

extern crate web_sys;

use std::collections::HashMap;

use serde::Serialize;
use tsify::Tsify;
use wasm_bindgen::prelude::*;

use doenetml_core::{
    components::{prelude::ComponentIdx, types::Action},
    core::graph_based_core::Core,
    dast::{DastRoot, FlatDastElementUpdate, FlatDastRoot},
};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug)]
pub struct PublicDoenetMLCore {
    core: Core,
    dast_root: Option<DastRoot>,
    source: String,
    flags_json: Option<String>,
    initialized: bool,
}

#[derive(Debug, Clone, Serialize, Tsify)]
#[tsify(into_wasm_abi)]
pub struct ActionResponse {
    payload: HashMap<ComponentIdx, FlatDastElementUpdate>,
}

#[wasm_bindgen]
impl PublicDoenetMLCore {
    #[allow(clippy::new_without_default)]
    pub fn new() -> PublicDoenetMLCore {
        utils::set_panic_hook();
        PublicDoenetMLCore {
            core: Core::new(),
            dast_root: None,
            source: "".to_string(),
            flags_json: None,
            initialized: false,
        }
    }

    pub fn set_source(&mut self, dast: DastRoot, source: &str) -> Result<(), String> {
        self.dast_root = Some(dast);
        self.source = source.to_string();
        self.initialized = false;
        Ok(())
    }

    pub fn set_flags(&mut self, flags: &str) {
        self.flags_json = Some(flags.to_string());
        self.initialized = false;
    }

    pub fn return_dast(&mut self) -> Result<FlatDastRoot, String> {
        if !self.initialized {
            let _flags = match &self.flags_json {
                Some(f) => f,
                None => return Err("Cannot create core before flags are set.".to_string()),
            };
            let dast_root = match &self.dast_root {
                Some(d) => d,
                None => return Err("Cannot create core before source is set.".to_string()),
            };

            // Create components from JSON tree and create all dependencies.
            self.core.init_from_dast_root(dast_root);
            self.initialized = true;
        }

        Ok(self.core.to_flat_dast())
    }

    /// Send an action to DoenetMLCore. This is often in response to a user
    /// interaction with a component (and requesting a change to that component, like
    /// changing the value of a slider).
    ///
    /// Returns updates to the FlatDast.
    pub fn dispatch_action(&mut self, _action: Action) -> Result<ActionResponse, String> {
        Ok(ActionResponse {
            // XXX: add dispatch action to core
            payload: HashMap::new(), //self.core.dispatch_action(action)?,
        })
    }
}

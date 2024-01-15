mod utils;

extern crate web_sys;

use std::collections::HashMap;

use serde::Serialize;
use tsify::Tsify;
use wasm_bindgen::prelude::*;

use doenetml_core::{
    dast::{FlatDastElementUpdate, FlatDastRoot},
    ComponentIdx, DoenetMLCore,
};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug)]
pub struct PublicDoenetMLCore {
    core: Option<DoenetMLCore>,
    dast_json: Option<String>,
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
    pub fn new() -> PublicDoenetMLCore {
        utils::set_panic_hook();
        PublicDoenetMLCore {
            core: None,
            dast_json: None,
            source: "".to_string(),
            flags_json: None,
            initialized: false,
        }
    }

    pub fn set_source(&mut self, dast_json: &str, source: &str) {
        self.dast_json = Some(dast_json.to_string());
        self.source = source.to_string();
        self.initialized = false;
    }

    pub fn set_flags(&mut self, flags: &str) {
        self.flags_json = Some(flags.to_string());
        self.initialized = false;
    }

    pub fn return_dast(&mut self) -> Result<FlatDastRoot, String> {
        if !self.initialized {
            let flags = match &self.flags_json {
                Some(f) => f,
                None => return Err("Cannot create core before flags are set.".to_string()),
            };
            let dast_json = match &self.dast_json {
                Some(d) => d,
                None => return Err("Cannot create core before source is set.".to_string()),
            };

            // Create components from JSON tree and create all dependencies.
            self.core = Some(DoenetMLCore::new(dast_json, &self.source, flags, None));
            self.initialized = true;
        }

        Ok(self.core.as_mut().unwrap().to_flat_dast())
    }

    /// Send an action to DoenetMLCore. This is often in response to a user
    /// interaction with a component (and requesting a change to that component, like
    /// changing the value of a slider).
    ///
    /// Returns updates to the FlatDast.
    pub fn dispatch_action(&mut self, action_json: &str) -> ActionResponse {
        ActionResponse {
            payload: self.core.as_mut().unwrap().dispatch_action(action_json),
        }
    }
}

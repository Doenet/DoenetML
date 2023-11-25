extern crate web_sys;

use wasm_bindgen::prelude::*;

use doenetml_core::DoenetMLCore;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(getter_with_clone)]
#[derive(Debug)]
pub struct PublicDoenetCore(DoenetMLCore);

#[wasm_bindgen]
impl PublicDoenetCore {
    /// Create components from JSON tree and create all dependencies.
    pub fn new(program: &str) -> Result<PublicDoenetCore, String> {
        Ok(PublicDoenetCore(DoenetMLCore { a_number: 1 }))
    }
}

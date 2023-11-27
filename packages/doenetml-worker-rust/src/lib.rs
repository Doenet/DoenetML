mod utils;

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
pub struct PublicDoenetMLCore(DoenetMLCore);

#[wasm_bindgen]
impl PublicDoenetMLCore {
    /// Create components from JSON tree and create all dependencies.
    pub fn new(
        dast_string: &str,
        doenetml: &str,
        flags_string: &str,
    ) -> Result<PublicDoenetMLCore, String> {
        utils::set_panic_hook();

        doenetml_core::create_doenetml_core(dast_string, doenetml, flags_string);
        Ok(PublicDoenetMLCore(DoenetMLCore { a_number: 1 }))
    }
}

#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;
#[cfg(feature = "web")]
use web_sys::js_sys::JsString;

use crate::DoenetMLCore;

impl DoenetMLCore {
    #[cfg(feature = "web")]
    pub fn eval_js(&self, source: &str) -> Result<String, String> {
        let result: JsString = evalWithMathExpressionsInScope(JsString::from(source))
            .map_err(|e| format!("{:?}", e))?;
        Ok(result.into())
    }
    #[cfg(not(feature = "web"))]
    pub fn eval_js(&self, _js: &str) -> Result<String, String> {
        Err("eval_js is only available when compiled with the `web` feature".to_string())
    }
}

#[cfg(feature = "web")]
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = __forDoenetWorker, catch)]
    pub fn evalWithMathExpressionsInScope(source: JsString) -> Result<JsString, JsValue>;
}

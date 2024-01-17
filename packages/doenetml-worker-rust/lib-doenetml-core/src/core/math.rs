#[cfg(features = "web")]
use web_sys::js_sys::JsString;

use crate::DoenetMLCore;

impl DoenetMLCore {
    #[cfg(features = "web")]
    pub fn eval_js(&self, _js: &str) -> Result<String, String> {
        let result: JsString = evalWithMathExpressionsInScope(source)?;
        Ok(result.into())
    }
    #[cfg(not(features = "web"))]
    pub fn eval_js(&self, _js: &str) -> Result<String, String> {
        Err("eval_js is only available when compiled with the `web` feature".to_string())
    }
}

#[cfg(features = "web")]
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = __forDoenetWorker)]
    pub fn evalWithMathExpressionsInScope(source: JsString) -> JsString;
}

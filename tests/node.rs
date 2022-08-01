
// #![cfg(target_arch = "wasm32")]

use doenet_core::{DoenetCore, state_variables::StateVarValue};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use wasm_bindgen_test::*;

// NOTE: These tests rely on a version of the parser that was compiled by babel
// to be common js.
// To recompile:
// npx babel src/Parser -d tests/babel_compiled_parser/parser
#[wasm_bindgen(module = "tests/babel_compiled_parser/parser")]
extern "C" {
    fn parseAndCompile(in_text: String) -> JsValue;
    
}

fn doenet_core_from(data: &str) -> DoenetCore {
    let parsed = parseAndCompile(data.to_string());
    let program: String = js_sys::JSON::stringify(&parsed).unwrap().into();
    doenet_core::create_doenet_core(&program)
}


fn assert_state_var_is(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: StateVarValue) {
    let state_value = dc.component_states.get(comp_name).expect(
            &format!("Component {} does not exist", comp_name)
        ).get(sv_name).expect(
            &format!("State var [{}]:[{}] does not exist", comp_name, sv_name)
        ).copy_value_if_resolved().expect(
            &format!("State var [{}]:[{}] was not resolved", comp_name, sv_name)
        );

    assert_eq!(state_value, value);
}

fn assert_state_var_is_string(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: &'static str) {
    assert_state_var_is(dc, comp_name, sv_name, StateVarValue::String(value.into()));
}


#[wasm_bindgen_test]
fn p_preserves_spaces_between_text_tags() {

    let data = r#"
    <document><p><text>Hello</text> <text>there</text>!</p>
    <p><text>We <text>could</text> be <text copySource="/_text2" />.</text></p></document>
    "#;
    let dc = doenet_core_from(data);
    doenet_core::update_renderers(&dc);

    assert_state_var_is_string(&dc, "/_p1", "value", "Hello there!");
    assert_state_var_is_string(&dc, "/_p2", "value", "We could be there.");

}
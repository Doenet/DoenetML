
// #![cfg(target_arch = "wasm32")]

use doenet_core::{DoenetCore, state_variables::StateVarValue, DoenetMLError, prelude::StateVarReference, state_var::{StateForStateVar, State}};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

// NOTE: These tests rely on a version of the parser that was compiled by babel
// to be common js.
// To recompile:
// npx babel src/Parser -d tests/babel_compiled_parser/parser
#[wasm_bindgen(module = "tests/babel_compiled_parser/parser")]
extern "C" {
    fn parseAndCompile(in_text: String) -> JsValue;
    
}

pub fn doenet_core_from(data: &str) -> (DoenetCore, Vec<DoenetMLError>) {
    let parsed = parseAndCompile(data.to_string());
    let program: String = js_sys::JSON::stringify(&parsed).unwrap().into();
    doenet_core::create_doenet_core(&program)
}


pub fn assert_state_var_is(dc: &DoenetCore, comp_name: &'static str, sv_ref: &StateVarReference, value: StateVarValue) {

    let state_value = dc.component_states.get(comp_name).expect(
        &format!("Component {} does not exist", comp_name)
    ).get(sv_ref.name()).expect(
        &format!("State var [{}]:[{}] does not exist", comp_name, sv_ref.name())
    );

    let state = match sv_ref {
        StateVarReference::Basic(sv_name) => {
            match state_value {
                StateForStateVar::Single(sv) => sv.get_state(),
                _ => panic!("State var [{}]:[{}] is basic but does not have single state", comp_name, sv_name)
            }
        },

        StateVarReference::SizeOf(sv_name) => {
            match state_value {
                StateForStateVar::Array { size, elements: _ } => size.get_state(),
                _ => panic!("State var [{}]:[{}] is SizeOf but does not have array state", comp_name, sv_name)
            }
        },

        StateVarReference::ArrayElement(sv_name, id) => {
            match state_value {
                StateForStateVar::Array { size: _, elements } => {
                    elements.borrow().get(*id).expect(
                        &format!("State var [{}]:[{}] does not have element index {}", comp_name, sv_name, id)
                    ).get_state()
                },

                _ => panic!("State var [{}]:[{}] is SizeOf but does not have array state", comp_name, sv_name)
            }
        },

    };

    assert_eq!(State::Resolved(value), state, "Incorrect value from [{}]:[{}]", comp_name, sv_ref);
}

pub fn assert_state_var_basic_is_string(
    dc: &DoenetCore,
    comp_name: &'static str,
    sv_name: &'static str,
    value: &'static str) {

    assert_state_var_is(dc, comp_name, &StateVarReference::Basic(sv_name), StateVarValue::String(value.into()));
}

pub fn assert_state_var_basic_is_number(
    dc: &DoenetCore,
    comp_name: &'static str,
    sv_name: &'static str,
    value: f64) {

    assert_state_var_is(dc, comp_name, &StateVarReference::Basic(sv_name), StateVarValue::Number(value));
}


pub fn assert_state_var_array_element_is_number(
    dc: &DoenetCore,
    comp_name: &'static str,
    sv_name: &'static str,
    id: usize,
    value: f64) {

    assert_state_var_is(dc, comp_name, &StateVarReference::ArrayElement(sv_name, id), StateVarValue::Number(value));
}

pub fn assert_state_var_array_size_is(
    dc: &DoenetCore,
    comp_name: &'static str,
    sv_name: &'static str,
    size: usize,
) {
    assert_state_var_is(dc, comp_name, &StateVarReference::SizeOf(sv_name), StateVarValue::Integer(size as i64));
}
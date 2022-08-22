
#![allow(dead_code)]
// #![cfg(target_arch = "wasm32")]

use std::borrow::Borrow;
use std::convert::TryInto;

use doenet_core::parse_json::DoenetMLError;
use doenet_core::state_variables::StateRef;
use doenet_core::{DoenetCore, state_variables::StateVarValue, state::{StateForStateVar, State}};
use serde_json::Value;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

// NOTE: These tests rely on a version of the parser that was compiled by babel
// to be common js.
// To recompile:
// npx babel src/Parser -d tests/babel_compiled_parser/parser
#[wasm_bindgen(module = "tests/babel_compiled_parser/parser")]
extern "C" {
    fn parseAndCompile(in_text: String) -> JsValue;
    
}

macro_rules! display_doenet_ml_on_failure {
    ($data:expr) => {
        if !thread::panicking() {
            set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), $data)));
        }
    }
}



pub fn doenet_core_from(data: &str) -> Result<DoenetCore, DoenetMLError> {
    let parsed = parseAndCompile(data.to_string());
    let program: String = js_sys::JSON::stringify(&parsed).unwrap().into();
    doenet_core::create_doenet_core(&program)
}

fn assert_state_var_is(dc: &DoenetCore, comp_name: &'static str, sv_ref: &StateRef, value: StateVarValue) {

    let state_value = dc.component_states.get(comp_name).expect(
        &format!("Component {} does not exist", comp_name)
    ).get(sv_ref.name()).expect(
        &format!("State var [{}]:[{}] does not exist", comp_name, sv_ref.name())
    );

    let state = match sv_ref {
        StateRef::Basic(sv_name) => {
            match state_value {
                StateForStateVar::Single(sv) => sv.get_state(),
                _ => panic!("State var [{}]:[{}] is basic but does not have single state", comp_name, sv_name)
            }
        },
        StateRef::SizeOf(sv_name) => {
            match state_value {
                StateForStateVar::Array { size, .. } => size.get_state(),
                _ => panic!("State var [{}]:[{}] is SizeOf but does not have array state", comp_name, sv_name)
            }
        },
        StateRef::ArrayElement(sv_name, id) => {
            match state_value {
                StateForStateVar::Array { elements, .. } => {
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

pub fn assert_sv_is_string(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: &'static str) {
    assert_state_var_is(dc, comp_name, &StateRef::Basic(sv_name), StateVarValue::String(value.into()));
}
pub fn assert_sv_is_number(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: f64) {
    assert_state_var_is(dc, comp_name, &StateRef::Basic(sv_name), StateVarValue::Number(value));
}
pub fn assert_sv_is_boolean(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: bool) {
    assert_state_var_is(dc, comp_name, &StateRef::Basic(sv_name), StateVarValue::Boolean(value));
}
pub fn assert_sv_is_integer(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: i64) {
    assert_state_var_is(dc, comp_name, &StateRef::Basic(sv_name), StateVarValue::Integer(value));
}




pub fn assert_sv_array_element_is_number(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, id: usize, value: f64) {
    assert_state_var_is(dc, comp_name, &StateRef::ArrayElement(sv_name, id), StateVarValue::Number(value));
}

pub fn assert_sv_array_size_is(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, size: usize,) {
    assert_state_var_is(dc, comp_name, &StateRef::SizeOf(sv_name), StateVarValue::Integer(size as i64));
}




pub fn assert_sv_array_is_number_list(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, values: Vec<f64>) {
    let (size, element_values) = get_array_state(dc, comp_name, sv_name);

    let num_values: Vec<f64> = element_values.into_iter().map(|elem|
        elem.try_into().expect(
            &format!("Not all elements of [{}]:[{}] were numbers", comp_name, sv_name)
        )
    ).collect();

    assert_eq!(values.len(), size);
    assert_eq!(values, num_values);
}

fn get_array_state(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str) -> (usize, Vec<StateVarValue>) {

    let state_value = dc.component_states.get(comp_name).expect(
        &format!("Component {} does not exist", comp_name)
    ).get(sv_name).expect(
        &format!("State var [{}]:[{}] does not exist", comp_name, sv_name)
    );

    match state_value {
        StateForStateVar::Array { size, elements, .. } => {

            let size_value = if let State::Resolved(val) = size.borrow().get_state() {
                let val: i64 = val.try_into().unwrap();
                val as usize
            } else {
                panic!("Size of state var [{}]:[{}] is not resolved", comp_name, sv_name);
            };

            let state_values = elements.borrow().iter().map(|elem| {
                if let State::Resolved(elem_val) = elem.get_state() {
                    elem_val
                } else {
                    panic!()
                }
            }).collect();


            (size_value, state_values)

        },
        _ => {
            panic!("State for [{}]:[{}] is not an array", comp_name, sv_name)
        },
    }
}






pub fn get_render_data<'a>(render_tree: &'a Value, component_name: &'static str) -> &'a serde_json::Map<String, Value> {

    render_tree.as_array().unwrap().iter().find( |render_item| {
        if let Some(render_obj) = render_item.as_object() {
            if render_obj.get("componentName") == Some(&Value::String(component_name.to_string())) {
                true
            } else {
                false
            }
        } else {
            false
        }

    }).unwrap().as_object().unwrap()
}

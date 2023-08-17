
#![allow(dead_code)]
// #![cfg(target_arch = "wasm32")]

use std::collections::HashMap;
use std::convert::TryInto;

use doenet_core::{EssentialDataOrigin, Action, Instance};
use doenet_core::ComponentName;
use doenet_core::parse_json::{DoenetMLError, DoenetMLWarning};
use doenet_core::state::EssentialStateVar;
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


pub fn doenet_core_with_no_warnings(data: &str) -> DoenetCore {
    let (core, warnings) = doenet_core_from(data).expect("DoenetCore creation threw an error");
    assert_eq!(warnings, vec![], "There were DoenetML warning(s)");
    core
}

pub fn doenet_core_from(data: &str) -> Result<(DoenetCore, Vec<DoenetMLWarning>), DoenetMLError> {
    let parsed = parseAndCompile(data.to_string());
    let program: String = js_sys::JSON::stringify(&parsed).unwrap().into();
    doenet_core::create_doenet_core(&program, None)
}

pub fn doenet_core_with_essential_data(
    program_str: &str,
    essential_data: HashMap<ComponentName, HashMap<EssentialDataOrigin, EssentialStateVar>>,
) -> Result<(DoenetCore, Vec<DoenetMLWarning>), DoenetMLError> {
    
    let parsed = parseAndCompile(program_str.to_string());
    let program: String = js_sys::JSON::stringify(&parsed).unwrap().into();
    doenet_core::create_doenet_core(&program, Some(essential_data))
}

fn get_state_var(dc: &DoenetCore, comp_name: &'static str, map: &Instance, sv_ref: &StateRef) -> State<StateVarValue> {

    let state_value = dc.component_states.get(comp_name).expect(
        &format!("Component {} does not exist", comp_name)
    ).get(sv_ref.name()).expect(
        &format!("State var [{}]:[{}] does not exist", comp_name, sv_ref.name())
    );

    match sv_ref {
        StateRef::Basic(sv_name) => {
            match state_value {
                StateForStateVar::Single(sv) => sv.instance(map).get_state(),
                _ => panic!("State var [{}]:[{}] is basic but does not have single state", comp_name, sv_name)
            }
        },
        StateRef::SizeOf(sv_name) => {
            match state_value {
                StateForStateVar::Array { size, .. } => size.instance(map).get_state(),
                _ => panic!("State var [{}]:[{}] is SizeOf but does not have array state", comp_name, sv_name)
            }
        },
        StateRef::ArrayElement(sv_name, id) => {
            match state_value {
                StateForStateVar::Array { elements, .. } => {
                    elements.instance(map).get(*id).expect(
                        &format!("State var [{}]:[{}] does not have element index {}", comp_name, sv_name, id)
                    ).get_state()
                },

                _ => panic!("State var [{}]:[{}] is SizeOf but does not have array state", comp_name, sv_name)
            }
        },
    }
}


fn assert_state_var_is(dc: &DoenetCore, comp_name: &'static str, map: &Instance, sv_ref: &StateRef, value: StateVarValue) {

    let state = get_state_var(dc, comp_name, map, sv_ref);

    match value {
        StateVarValue::Number(num_val) => {
            let resolved_sv_val = state.into_resolved().expect(
                &format!("Value [{}]:[{}] was stale, expected {}", comp_name, sv_ref, value)
            );

            let actual_num: f64 = if let StateVarValue::Number(actual_num) = resolved_sv_val {
                actual_num
            } else {
                panic!("Value [{}]:[{}] was {}, expected {}", comp_name, sv_ref, resolved_sv_val, value);
            };

            assert!(
                // Float NaN do not have equality with other NaNs, therefore we have to
                // do this funky thing for numbers
                numbers_are_equal_or_both_nan(actual_num, num_val),
                "Value [{}]:[{}] was {}, expected {}", comp_name, sv_ref, resolved_sv_val, value
            );

        },
        _ => {
            assert_eq!(State::Resolved(value), state, "Incorrect value from [{}]:[{}]", comp_name, sv_ref);
        },
    }
}

pub fn assert_state_var_stale(dc: &DoenetCore, comp_name: &'static str, map: &Instance, sv_ref: &StateRef) {

    let state = get_state_var(dc, comp_name, map, sv_ref);

    assert_eq!(State::Stale, state, "Expected stale for [{}]:[{}] but found {:?}", comp_name, sv_ref, state);
}

fn numbers_are_equal_or_both_nan(num1: f64, num2: f64) -> bool {
    (num1.is_nan() && num2.is_nan()) || (num1 == num2)
}

pub fn assert_sv_is_string(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: &'static str) {
    assert_state_var_is(dc, comp_name, &Instance::default(), &StateRef::Basic(sv_name), StateVarValue::String(value.into()));
}
pub fn assert_sv_is_number(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: f64) {
    assert_state_var_is(dc, comp_name, &Instance::default(), &StateRef::Basic(sv_name), StateVarValue::Number(value));
}
pub fn assert_sv_is_boolean(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: bool) {
    assert_state_var_is(dc, comp_name, &Instance::default(), &StateRef::Basic(sv_name), StateVarValue::Boolean(value));
}
pub fn assert_sv_is_integer(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: i64) {
    assert_state_var_is(dc, comp_name, &Instance::default(), &StateRef::Basic(sv_name), StateVarValue::Integer(value));
}
pub fn assert_sv_array_element_is_number(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, id: usize, value: f64) {
    assert_state_var_is(dc, comp_name, &Instance::default(), &StateRef::ArrayElement(sv_name, id), StateVarValue::Number(value));
}
pub fn assert_sv_array_size_is(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, size: usize,) {
    assert_state_var_is(dc, comp_name, &Instance::default(), &StateRef::SizeOf(sv_name), StateVarValue::Integer(size as i64));
}
pub fn assert_sv_array_is_number_list(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, values: Vec<f64>) {
    assert_sv_array_is_number_list_with_map(dc, comp_name, Instance::default(), sv_name, values)
}

pub fn assert_sv_is_string_with_map(dc: &DoenetCore, comp_name: &'static str, map: Instance, sv_name: &'static str, value: &'static str) {
    assert_state_var_is(dc, comp_name, &map, &StateRef::Basic(sv_name), StateVarValue::String(value.into()));
}
pub fn assert_sv_is_number_with_map(dc: &DoenetCore, comp_name: &'static str, map: Instance, sv_name: &'static str, value: f64) {
    assert_state_var_is(dc, comp_name, &map, &StateRef::Basic(sv_name), StateVarValue::Number(value));
}
pub fn assert_sv_is_boolean_with_map(dc: &DoenetCore, comp_name: &'static str, map: Instance, sv_name: &'static str, value: bool) {
    assert_state_var_is(dc, comp_name, &map, &StateRef::Basic(sv_name), StateVarValue::Boolean(value));
}
pub fn assert_sv_is_integer_with_map(dc: &DoenetCore, comp_name: &'static str, map: Instance, sv_name: &'static str, value: i64) {
    assert_state_var_is(dc, comp_name, &map, &StateRef::Basic(sv_name), StateVarValue::Integer(value));
}
pub fn assert_sv_array_element_is_number_with_map(dc: &DoenetCore, comp_name: &'static str, map: Instance, sv_name: &'static str, id: usize, value: f64) {
    assert_state_var_is(dc, comp_name, &map, &StateRef::ArrayElement(sv_name, id), StateVarValue::Number(value));
}
pub fn assert_sv_array_size_is_with_map(dc: &DoenetCore, comp_name: &'static str, map: Instance, sv_name: &'static str, size: usize,) {
    assert_state_var_is(dc, comp_name, &map, &StateRef::SizeOf(sv_name), StateVarValue::Integer(size as i64));
}

pub fn assert_sv_array_is_number_list_with_map(dc: &DoenetCore, comp_name: &'static str, map: Instance, sv_name: &'static str, values: Vec<f64>) {
    let (size, element_values) = get_array_state(dc, comp_name, &map, sv_name);

    let num_values: Vec<f64> = element_values.into_iter().map(|elem|
        elem.try_into().expect(
            &format!("Not all elements of [{}]:[{}] were numbers", comp_name, sv_name)
        )
    ).collect();

    assert_eq!(values.len(), size, "Number list was wrong size");

    for (expected_value, actual_value) in values.iter().zip(num_values.iter()) {
        assert!(numbers_are_equal_or_both_nan(*expected_value, *actual_value), "Expected {:?} but found {:?}", values, num_values);
    }
}

fn get_array_state(dc: &DoenetCore, comp_name: &'static str, map: &Instance, sv_name: &'static str) -> (usize, Vec<StateVarValue>) {

    let state_value = dc.component_states.get(comp_name).expect(
        &format!("Component {} does not exist", comp_name)
    ).get(sv_name).expect(
        &format!("State var [{}]:[{}] does not exist", comp_name, sv_name)
    );

    match state_value {
        StateForStateVar::Array { size, elements, .. } => {

            let size_value = if let State::Resolved(val) = size.instance(map).get_state() {
                let val: i64 = val.try_into().unwrap();
                val as usize
            } else {
                panic!("Size of state var [{}]:[{}] is not resolved", comp_name, sv_name);
            };

            let state_values = elements.instance(map).iter().map(|elem| {
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






pub fn render_data_of_component<'a>(render_tree: &'a Value, component_name: &'static str) -> &'a serde_json::Map<String, Value> {
    render_tree.as_array().unwrap().iter().find(|render_item| {
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


pub fn child_instructions_for<'a>(render_tree: &'a Value, parent: &'static str, child: &'static str) -> &'a serde_json::Map<String, Value> {
    let children_instructions = render_data_of_component(&render_tree, parent)
        .get("childrenInstructions").unwrap()
        .as_array().unwrap();

    children_instructions.iter().find(|render_item| {
            if let Some(render_obj) = render_item.as_object() {
                if render_obj.get("componentName") == Some(&Value::String(child.to_string())) {
                    true
                } else {
                    false
                }
            } else {
                false
            }

        })
        .expect(
            &format!("none with name {child} in {:?}", children_instructions)
        ).as_object().unwrap()
}




pub fn update_immediate_value_for_text(dc: &DoenetCore, component_name: &'static str, value: &'static str) {
    let type_in_number_input = Action {
        component_name: component_name.to_string(),
        action_name: "updateImmediateValue".to_string(),
        args: HashMap::from([
            ("text".to_string(), vec![StateVarValue::String(value.into())]),
        ]),
    };
    doenet_core::handle_action(&dc, type_in_number_input);
}

pub fn update_immediate_value_for_number(dc: &DoenetCore, component_name: &'static str, value: &'static str) {
    let type_in_number_input = Action {
        component_name: component_name.to_string(),
        action_name: "updateImmediateValue".to_string(),
        args: HashMap::from([
            ("text".to_string(), vec![StateVarValue::String(value.into())]),
        ]),
    };
    doenet_core::handle_action(&dc, type_in_number_input);
}

pub fn update_value_for_number(dc: &DoenetCore, component_name: &'static str) {
    let update_number_input_value = Action {
        component_name: component_name.to_string(),
        action_name: "updateValue".to_string(),
        args: HashMap::new(),
    };
    doenet_core::handle_action(&dc, update_number_input_value);
}


pub fn move_point_2d(dc: &DoenetCore, component_name: &'static str, x: StateVarValue, y: StateVarValue) {
    let move_point = Action {
        component_name: component_name.to_string(),
        action_name: "movePoint".to_string(),
        args: HashMap::from([
            ("x".to_string(), vec![x]),
            ("y".to_string(), vec![y]),
        ]),
    };
    doenet_core::handle_action(&dc, move_point);
}

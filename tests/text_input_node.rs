
mod common_node;

use std::collections::HashMap;

use common_node::*;
use doenet_core::{state_variables::StateVarValue};
use wasm_bindgen_test::wasm_bindgen_test;


#[wasm_bindgen_test]
fn update_immediate_value_and_update_value() {

    let data = r#"
        <textInput />

        <!-- Make sure this change also affects copies -->

        <textInput copySource='/_textInput1' />
        <textInput copySource='/_textInput2' />

        <text copySource='/_textInput3' prop='immediateValue' />
        <text copySource='/_textInput3' prop='value' />
    "#;
    let dc = doenet_core_from(data).unwrap();
    doenet_core::update_renderers(&dc);

    doenet_core::handle_action(&dc, doenet_core::Action {
        component_name: String::from("/_textInput1"),
        action_name: String::from("updateImmediateValue"),
        args: HashMap::from([
            ("text".into(), StateVarValue::String("this is the new immediate value".into()))
        ])
    });
    doenet_core::update_renderers(&dc);

    assert_state_var_basic_is_string(&dc, "/_textInput1", "immediateValue", "this is the new immediate value");
    assert_state_var_basic_is_string(&dc, "/_textInput2", "immediateValue", "this is the new immediate value");
    assert_state_var_basic_is_string(&dc, "/_textInput3", "immediateValue", "this is the new immediate value");
    assert_state_var_basic_is_string(&dc, "/_text1", "value", "this is the new immediate value");


    // Now updateValue
    doenet_core::handle_action(&dc, doenet_core::Action {
        component_name: String::from("/_textInput1"),
        action_name: String::from("updateValue"),
        args: HashMap::new()
    });
    doenet_core::update_renderers(&dc);

    // Note that the other textinput's value sv's are still stale because only the shared essential
    // data has changed
    assert_state_var_basic_is_string(&dc, "/_textInput3", "value", "this is the new immediate value");
    assert_state_var_basic_is_string(&dc, "/_text2", "value", "this is the new immediate value");



    // Make sure that if we change the other textInputs, the essential data will still change
    doenet_core::handle_action(&dc, doenet_core::Action {
        component_name: String::from("/_textInput1"),
        action_name: String::from("updateImmediateValue"),
        args: HashMap::from([
            ("text".into(), StateVarValue::String("the second text input changed this value".into()))
        ])
    });
    doenet_core::update_renderers(&dc);

    assert_state_var_basic_is_string(&dc, "/_textInput1", "immediateValue", "the second text input changed this value");
    assert_state_var_basic_is_string(&dc, "/_textInput2", "immediateValue", "the second text input changed this value");
    assert_state_var_basic_is_string(&dc, "/_textInput3", "immediateValue", "the second text input changed this value");
    assert_state_var_basic_is_string(&dc, "/_text1", "value", "the second text input changed this value");


}

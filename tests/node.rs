// #![cfg(target_arch = "wasm32")]

mod common_node;

use std::collections::HashMap;
use std::panic::set_hook;

use common_node::*;
use doenet_core::{parse_json::DoenetMLError, state_variables::StateVarValue, Action};
use wasm_bindgen_test::{wasm_bindgen_test, console_log};


// ========= DoenetML errrors ============

#[wasm_bindgen_test]
fn doenet_ml_error_cyclic_dependency_through_children_indirectly() {
    static DATA: &str = r#"
        <text name='a_parent'><text name='a' copySource='b'/></text>
        <text name='b'><text name='b_child' copySource='a_parent'/></text>
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let error = doenet_core_from(DATA).unwrap_err();
    assert!(matches!(error, DoenetMLError::CyclicalDependency { component_chain: _ }));
}


#[wasm_bindgen_test]
fn doenet_ml_error_copy_unnamed_component_gives_error() {
    static DATA: &str = r#"
        <text copySource='qwerty' />
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let error = doenet_core_from(DATA).unwrap_err();
    assert!(matches!(error, DoenetMLError::ComponentDoesNotExist { comp_name: _ }));
}


// ========= <text> ==============

#[wasm_bindgen_test]
fn text_preserves_spaces_between_text_tags() {
    static DATA: &str = r#"
        <text name='a'><text>Hello</text> <text>there</text>!</text>
        <text name='b'><text>We <text>could</text> be <text copySource="/_text3" />.</text></text>
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let dc = doenet_core_from(
        DATA
    ).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "a", "value", "Hello there!");
    assert_sv_is_string(&dc, "b", "value", "We could be there.");
}


#[wasm_bindgen_test]
fn text_inside_text() {
    static DATA: &str = r#"
        <text>one<text> two <text name='t2' copySource='t' /> <text name='t'>three</text> again </text><text copySource="t2"/> once more</text>
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "/_text1", "value", "one two three three again three once more");
}


#[wasm_bindgen_test]
fn text_copy_component_of_copy_component() {
    static DATA: &str = r#"
        <text name='a'><text name='one'>one</text></text>
        <text name='b' copySource='a'><text name='two'>two</text></text>
        <text name='c' copySource='b'><text name='three'>three</text></text>
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "a", "text", "one");
    assert_sv_is_string(&dc, "b", "text", "onetwo");
    assert_sv_is_string(&dc, "c", "text", "onetwothree");
}

#[wasm_bindgen_test]
fn text_copy_component_cyclical_gives_error() {
    static DATA: &str = r#"
        <text name='irrelevant' copySource='a' />
        <text name='a' copySource='b' />
        <text name='b' copySource='a' />
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let error = doenet_core_from(DATA).unwrap_err();
    assert!(matches!(error, DoenetMLError::CyclicalDependency { component_chain: _ }));

}

#[wasm_bindgen_test]
fn text_copy_itself_as_child_gives_error() {
    static DATA: &str = r#"
        <text name='t'> $t</text>
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let error = doenet_core_from(DATA).unwrap_err();
    assert!(matches!(error, DoenetMLError::CyclicalDependency { component_chain: _ }));
}


#[wasm_bindgen_test]
fn text_copy_itself_as_grandchild_gives_error() {
    static DATA: &str = r#"
        <text name='t'><text>$t</text></text>
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let error = doenet_core_from(DATA).unwrap_err();
    match error {
        DoenetMLError::CyclicalDependency { component_chain } => assert_eq!(component_chain.len(), 3),
        _ => panic!("Wrong error type")
    };
}



// ========= <textInput> ==============


#[wasm_bindgen_test]
fn text_input_update_immediate_value_and_update_value() {
    static DATA: &str = r#"
        <textInput />

        <!-- Make sure this change also affects copies -->

        <textInput copySource='/_textInput1' />
        <textInput copySource='/_textInput2' />

        <text copySource='/_textInput3' prop='immediateValue' />
        <text copySource='/_textInput3' prop='value' />
    "#;

    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let dc = doenet_core_from(DATA).expect(&format!("DoenetML had an error"));
    doenet_core::update_renderers(&dc);

    doenet_core::handle_action(&dc, doenet_core::Action {
        component_name: String::from("/_textInput1"),
        action_name: String::from("updateImmediateValue"),
        args: HashMap::from([
            ("text".into(), StateVarValue::String("this is the new immediate value".into()))
        ])
    });
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "/_textInput1", "immediateValue", "this is the new immediate value");
    assert_sv_is_string(&dc, "/_textInput2", "immediateValue", "this is the new immediate value");
    assert_sv_is_string(&dc, "/_textInput3", "immediateValue", "this is the new immediate value");
    assert_sv_is_string(&dc, "/_text1", "value", "this is the new immediate value");


    // Now updateValue
    doenet_core::handle_action(&dc, doenet_core::Action {
        component_name: String::from("/_textInput1"),
        action_name: String::from("updateValue"),
        args: HashMap::new()
    });
    doenet_core::update_renderers(&dc);

    // Note that the other textinput's value sv's are still stale because only the shared essential
    // data has changed
    assert_sv_is_string(&dc, "/_textInput3", "value", "this is the new immediate value");
    assert_sv_is_string(&dc, "/_text2", "value", "this is the new immediate value");



    // Make sure that if we change the other textInputs, the essential data will still change
    doenet_core::handle_action(&dc, doenet_core::Action {
        component_name: String::from("/_textInput1"),
        action_name: String::from("updateImmediateValue"),
        args: HashMap::from([
            ("text".into(), StateVarValue::String("the second text input changed this value".into()))
        ])
    });
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "/_textInput1", "immediateValue", "the second text input changed this value");
    assert_sv_is_string(&dc, "/_textInput2", "immediateValue", "the second text input changed this value");
    assert_sv_is_string(&dc, "/_textInput3", "immediateValue", "the second text input changed this value");
    assert_sv_is_string(&dc, "/_text1", "value", "the second text input changed this value");
}




// ========= <sequence> ==============

#[wasm_bindgen_test]
fn sequence_copies_component() {
    static DATA: &str = r#"
        <number name='f'>5</number>
        <number name='t'>11</number>

        <sequence name='s' from="$f" to="$t" />

        <sequence copySource='s' />
        <sequence copySource='s' from='3' to='6' />
        <sequence copySource='s' from='9' />
        <sequence copySource='s' from='300' />
        <sequence copySource='s' to='$f' />
        <sequence copySource='s' from='21' to='22' />

        <!-- This sequence should be empty -->
        <sequence copySource='s' to='-10' />

    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "/_sequence2", "value", vec![5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0]);
    assert_sv_array_is_number_list(&dc, "/_sequence3", "value", vec![3.0, 4.0, 5.0, 6.0]);
    assert_sv_array_is_number_list(&dc, "/_sequence4", "value", vec![9.0, 10.0, 11.0]);
    assert_sv_array_is_number_list(&dc, "/_sequence5", "value", vec![]);
    assert_sv_array_is_number_list(&dc, "/_sequence6", "value", vec![5.0]);
    assert_sv_array_is_number_list(&dc, "/_sequence7", "value", vec![21.0, 22.0]);
    assert_sv_array_is_number_list(&dc, "/_sequence8", "value", vec![]);

}


#[wasm_bindgen_test]
fn sequence_from_and_to_can_be_copied_as_props() {
    static DATA: &str = r#"
        <number name='f'>-1000</number>
        <number name='t'>-993</number>

        <sequence name='s' from="$f" to="$t" />

        <number copySource='s' prop='from' />
        <number copySource='s' prop='to' />
        <number>$s.from</number>
        <number>$s.to</number>
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number3", "value", -1000.0);
    assert_sv_is_number(&dc, "/_number4", "value", -993.0);
    assert_sv_is_number(&dc, "/_number5", "value", -1000.0);
    assert_sv_is_number(&dc, "/_number6", "value", -993.0);
}



// ========= <point> ==============

#[wasm_bindgen_test]
fn point_moves_copy_number() {
    static DATA: &str = r#"
        <number name='num'>2</number>
        <graph name='g'><point name='p' xs='3 $num'/></graph>
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p", "xs", vec![3.0, 2.0]);

    let move_point = Action {
        component_name: "p".to_string(),
        action_name: "movePoint".to_string(),
        args: HashMap::from([
            ("x".to_string(), StateVarValue::Integer(5)),
            ("y".to_string(), StateVarValue::Number(1.0)),
        ]),
    };
    doenet_core::handle_action(&dc, move_point);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p", "xs", vec![5.0, 1.0]);
}



// =========== <number> ============

#[wasm_bindgen_test]
fn number_invalid_prop_index_does_not_crash() {
    static DATA: &str = r#"
    <sequence name='s' from='3' to='5' />   

    <p><number name='num1' copySource='s' prop='value' propIndex = '100' /></p>
    <p><number name='num2' copySource='s' prop='value' propIndex = '-23' /></p>
    <p><number name='num3' copySource='s' prop='value' propIndex = 'asdf' /></p>
    <p><number name='num4' copySource='s' prop='value' propIndex = '2.3' /></p>

    <!-- This one should be valid -->
    <p><number name='num5' copySource='s' prop='value' propIndex = '3.000' /></p>
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "num1", "value", 0.0);
    assert_sv_is_number(&dc, "num2", "value", 0.0);
    assert_sv_is_number(&dc, "num3", "value", 0.0);
    assert_sv_is_number(&dc, "num4", "value", 0.0);
    assert_sv_is_number(&dc, "num5", "value", 5.0);

}


#[wasm_bindgen_test]
fn number_invalid_dynamic_prop_index_does_not_crash() {
    static DATA: &str = r#"
    <sequence name='s' from='3' to='5' />

    <number name='n1'>100</number>
    <number name='n2'>-23</number>
    <number name='n3'>asdf</number>
    <number name='n4'>2.3</number>
    <number name='n5'>3.0000</number>

    <number name='num1' copySource='s' prop='value' propIndex = '$n1' />
    <number name='num2' copySource='s' prop='value' propIndex = '$n2' />
    <number name='num3' copySource='s' prop='value' propIndex = '$n3' />
    <number name='num4' copySource='s' prop='value' propIndex = '$n4' />

    <!-- This one should be valid -->
    <number name='num5' copySource='s' prop='value' propIndex = '$n5' />
    "#;
    set_hook(Box::new(|info| console_log!("{}\n{}", info.to_string(), DATA)));

    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "num1", "value", 0.0);
    assert_sv_is_number(&dc, "num2", "value", 0.0);
    assert_sv_is_number(&dc, "num3", "value", 0.0);
    assert_sv_is_number(&dc, "num4", "value", 0.0);
    assert_sv_is_number(&dc, "num5", "value", 5.0);

}





// Make sure that the $n variable name is not var0
// <number name='n'>3.1</number>
// <math name='m'>var + $n</math>
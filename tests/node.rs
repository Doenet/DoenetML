// #![cfg(target_arch = "wasm32")]

#[macro_use]
mod common_node;

use std::{collections::HashMap, thread};
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
    display_doenet_ml_on_failure!(DATA);

    let error = doenet_core_from(DATA).unwrap_err();
    assert!(matches!(error, DoenetMLError::CyclicalDependency { component_chain: _ }));
}


#[wasm_bindgen_test]
fn doenet_ml_error_copy_unnamed_component_gives_error() {
    static DATA: &str = r#"
        <text copySource='qwerty' />
    "#;
    display_doenet_ml_on_failure!(DATA);


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
    display_doenet_ml_on_failure!(DATA);


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
    display_doenet_ml_on_failure!(DATA);


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
    display_doenet_ml_on_failure!(DATA);


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
    display_doenet_ml_on_failure!(DATA);

    let error = doenet_core_from(DATA).unwrap_err();
    assert!(matches!(error, DoenetMLError::CyclicalDependency { component_chain: _ }));

}

#[wasm_bindgen_test]
fn text_copy_itself_as_child_gives_error() {
    static DATA: &str = r#"
        <text name='t'> $t</text>
    "#;
    display_doenet_ml_on_failure!(DATA);


    let error = doenet_core_from(DATA).unwrap_err();
    assert!(matches!(error, DoenetMLError::CyclicalDependency { component_chain: _ }));
}


#[wasm_bindgen_test]
fn text_copy_itself_as_grandchild_gives_error() {
    static DATA: &str = r#"
        <text name='t'><text>$t</text></text>
    "#;
    display_doenet_ml_on_failure!(DATA);


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

        <text copySource='/_textInput3' copyProp='immediateValue' />
        <text copySource='/_textInput3' copyProp='value' />
    "#;
    display_doenet_ml_on_failure!(DATA);


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

// ========= <numberInput> ==============

#[wasm_bindgen_test]
fn number_input_immediate_value_syncs_with_value_on_update_request() {
    static DATA: &str = r#"
    <numberinput name='the_number_input'/>
    <graph name="g">
        <point name='myPoint' xs='$the_number_input.value 3-2' />
    </graph>
    <number name='myNum' copySource='the_number_input' copyProp='immediateValue' />
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    // assert_sv_array_is_number_list(&dc, "myPoint", "xs", vec![0.0, 1.0]);

    let move_point = Action {
        component_name: "myPoint".to_string(),
        action_name: "movePoint".to_string(),
        args: HashMap::from([
            ("x".to_string(), StateVarValue::Number(-5.11)),
            ("y".to_string(), StateVarValue::Number(27.0)),
        ]),
    };
    doenet_core::handle_action(&dc, move_point);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "myPoint", "xs", vec![-5.11, 27.0]);
    assert_sv_is_number(&dc, "the_number_input", "value", -5.11);
    assert_sv_is_number(&dc, "the_number_input", "immediateValue", -5.11);
    assert_sv_is_number(&dc, "myNum", "value", -5.11);
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
    display_doenet_ml_on_failure!(DATA);

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

        <number copySource='s' copyProp='from' />
        <number copySource='s' copyProp='to' />
        <number>$s.from</number>
        <number>$s.to</number>
    "#;
    display_doenet_ml_on_failure!(DATA);

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
    display_doenet_ml_on_failure!(DATA);
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

#[wasm_bindgen_test]
fn point_copies_coords_of_another_point() {
    static DATA: &str = r#"
    <graph>
        <point name='a' xs='1 2' />
        <point name='b' xs='$a.xs[1]-4 $a.xs[2]+2' />
    </graph>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "a", "xs", vec![1.0, 2.0]);
    assert_sv_array_is_number_list(&dc, "b", "xs", vec![-3.0, 4.0]);

    let move_point = Action {
        component_name: "a".to_string(),
        action_name: "movePoint".to_string(),
        args: HashMap::from([
            ("x".to_string(), StateVarValue::Number(-2.0)),
            ("y".to_string(), StateVarValue::Number(-5.0)),
        ]),
    };
    doenet_core::handle_action(&dc, move_point);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "a", "xs", vec![-2.0, -5.0]);
    assert_sv_array_is_number_list(&dc, "b", "xs", vec![-6.0, -3.0]);
}

#[wasm_bindgen_test]
fn point_copies_another_point_component() {
    static DATA: &str = r#"
    <graph><point name='p1' xs='1 2' /></graph>
    <graph><point name='p2' copySource='p1' /></graph>
    <graph><point name='p3' copySource='p2' /></graph>
    <graph><point name='p4' copySource='p3' /></graph>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p1", "xs", vec![1.0, 2.0]);
    assert_sv_array_is_number_list(&dc, "p2", "xs", vec![1.0, 2.0]);
    assert_sv_array_is_number_list(&dc, "p3", "xs", vec![1.0, 2.0]);
    assert_sv_array_is_number_list(&dc, "p4", "xs", vec![1.0, 2.0]);

    let move_point = Action {
        component_name: "p2".to_string(),
        action_name: "movePoint".to_string(),
        args: HashMap::from([
            ("x".to_string(), StateVarValue::Number(-3.2)),
            ("y".to_string(), StateVarValue::Number(7.1)),
        ]),
    };
    doenet_core::handle_action(&dc, move_point);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p1", "xs", vec![-3.2, 7.1]);
    assert_sv_array_is_number_list(&dc, "p2", "xs", vec![-3.2, 7.1]);
    assert_sv_array_is_number_list(&dc, "p3", "xs", vec![-3.2, 7.1]);
    assert_sv_array_is_number_list(&dc, "p4", "xs", vec![-3.2, 7.1]);
}

// =========== <number> ============

#[wasm_bindgen_test]
fn number_can_do_arithmetic_on_strings_and_number_children() {
    static DATA: &str = r#"
    <p>
    <number>3 + 2 - 4 * 5</number>
    <number copySource='/_number1'/>
    <number copySource='/_number2'/>
    <number copySource='/_number3'/>
    </p>
    
    <!-- Arithmetic in nested number -->
    <p>
    <number name='nested1'><number copySource='/_number1' copyProp='value'/></number>
    <number name='nested2'>$nested1.value - 6</number>
    <number name='nested3'>1.5 * $nested2.value</number>
    <number name='nested4'>$nested3.value + $nested2.value + 1</number>
    </p>
    
    <!-- Arithmetic in nested numbers combined with copyProp value -->
    <p>
    <number name='combined1'>$nested1 + 3 * <number copySource='nested1' copyProp='value'/> + 1</number>
    <number name='combined2'>$combined1 + 1</number>
    <number name='combined3'>$combined2 / $combined2</number>
    </p>
    
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number1", "value", -15.0);
    assert_sv_is_number(&dc, "/_number2", "value", -15.0);
    assert_sv_is_number(&dc, "/_number3", "value", -15.0);
    assert_sv_is_number(&dc, "/_number4", "value", -15.0);

    assert_sv_is_number(&dc, "nested1", "value", -15.0);
    assert_sv_is_number(&dc, "nested2", "value", -21.0);
    assert_sv_is_number(&dc, "nested3", "value", -31.5);
    assert_sv_is_number(&dc, "nested4", "value", -51.5);

    assert_sv_is_number(&dc, "combined1", "value", -59.0);
    assert_sv_is_number(&dc, "combined2", "value", -58.0);
    assert_sv_is_number(&dc, "combined3", "value", 1.0);
}


#[wasm_bindgen_test]
fn number_invalid_prop_index_does_not_crash() {
    static DATA: &str = r#"
    <sequence name='s' from='3' to='5' />   

    <p><number name='num1' copySource='s' copyProp='value' propIndex = '100' /></p>
    <p><number name='num2' copySource='s' copyProp='value' propIndex = '-23' /></p>
    <p><number name='num3' copySource='s' copyProp='value' propIndex = 'asdf' /></p>
    <p><number name='num4' copySource='s' copyProp='value' propIndex = '2.3' /></p>

    <!-- This one should be valid -->
    <p><number name='num5' copySource='s' copyProp='value' propIndex = '3.000' /></p>
    "#;
    display_doenet_ml_on_failure!(DATA);


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

    <number name='num1' copySource='s' copyProp='value' propIndex = '$n1' />
    <number name='num2' copySource='s' copyProp='value' propIndex = '$n2' />
    <number name='num3' copySource='s' copyProp='value' propIndex = '$n3' />
    <number name='num4' copySource='s' copyProp='value' propIndex = '$n4' />

    <!-- This one should be valid -->
    <number name='num5' copySource='s' copyProp='value' propIndex = '$n5' />
    "#;
    display_doenet_ml_on_failure!(DATA);


    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "num1", "value", 0.0);
    assert_sv_is_number(&dc, "num2", "value", 0.0);
    assert_sv_is_number(&dc, "num3", "value", 0.0);
    assert_sv_is_number(&dc, "num4", "value", 0.0);
    assert_sv_is_number(&dc, "num5", "value", 5.0);

}


#[wasm_bindgen_test]
fn number_parses_arithmetic_from_number_input_immediate_value() {
    static DATA: &str = r#"
    <numberInput/>
    <numberInput copySource='/_numberInput1' />
    <numberInput name='myNumInput' copySource='/_numberInput2' />

    <number name='n1'>$myNumInput.immediateValue + 1</number>

    <number name='n2' copySource='n1' />
    <number name='n3' copySource='n2' />
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    let type_in_number_input = Action {
        component_name: "/_numberInput1".to_string(),
        action_name: "updateImmediateValue".to_string(),
        args: HashMap::from([
            ("text".to_string(), StateVarValue::String("5.0".into())),
        ]),
    };

    doenet_core::handle_action(&dc, type_in_number_input);
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "n1", "value", 6.0);
    assert_sv_is_number(&dc, "n2", "value", 6.0);
    assert_sv_is_number(&dc, "n3", "value", 6.0);

}

// ========= Macros ===========

// This test takes a long time to run
#[wasm_bindgen_test]
fn macro_prop_index_inside_prop_index_with_whitespace() {
    static DATA: &str = r#"
    <sequence hide name='s1' from='11' to='30' />
    <sequence hide name='s2' from='51' to='100' />
    <sequence hide name='s3' from='101' to='500' />
    
    <text>$s1.value[1]</text>
    <text>$s2.value[$s1.value[3]]</text>
    <text>$s2.value[   $s1.value[3]    ]</text>
    <text>$s2.value[$s1.value[3]    ]</text>
    <text>$s2.value[ $s1.value[3]]</text>
    <text>$s3.value[ $s2.value[$s1.value[5]] ]</text>
    <number>$s3.value[ $s2.value[$s1.value[ $s1.value[2] ]] ]</number>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_from(DATA).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "/_text1", "value", "11");
    assert_sv_is_string(&dc, "/_text2", "value", "63");
    assert_sv_is_string(&dc, "/_text3", "value", "63");
    assert_sv_is_string(&dc, "/_text4", "value", "63");
    assert_sv_is_string(&dc, "/_text5", "value", "63");
    assert_sv_is_string(&dc, "/_text6", "value", "165");
    assert_sv_is_number(&dc, "/_number1", "value", 172.0);
}


// ========= Reloading essential data ============

#[wasm_bindgen_test]
fn reload_essential_data_after_point_moves() {

    static DATA: &str = r#"
    <number name='num'>2</number>
    <graph name='g'>
        <point name='p' xs='3 $num'/>
    </graph>
    "#;
    display_doenet_ml_on_failure!(DATA);

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


    let dc = doenet_core_with_essential_data(DATA, dc.essential_data).unwrap();
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p", "xs", vec![5.0, 1.0]);
}



// Make sure that the $n variable name is not var0
// <number name='n'>3.1</number>
// <math name='m'>var + $n</math>

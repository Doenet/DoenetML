// #![cfg(target_arch = "wasm32")]

#[macro_use]
mod common_node;
use std::{collections::HashMap, thread};
use std::panic::set_hook;
use doenet_core::parse_json::DoenetMLWarning;
use serde_json;

use common_node::*;
use doenet_core::{parse_json::DoenetMLError, state_variables::StateVarValue};
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
fn doenet_ml_error_copy_nonexistent_component_gives_error() {
    static DATA: &str = r#"
        <text copySource='qwerty' />
    "#;
    display_doenet_ml_on_failure!(DATA);

    let error = doenet_core_from(DATA).unwrap_err();
    assert!(matches!(error, DoenetMLError::ComponentDoesNotExist { comp_name: _ }));
}

#[wasm_bindgen_test]
fn doenet_ml_error_copy_nonexistent_state_var_gives_error() {
    static DATA: &str = r#"
        <text name='a'>hi</text>
        <text copySource='a' copyProp='qwertyqwerty' />
    "#;
    display_doenet_ml_on_failure!(DATA);

    let error = doenet_core_from(DATA).unwrap_err();
    assert_eq!(error, DoenetMLError::StateVarDoesNotExist {
        comp_name: "a".into(),
        sv_name: "qwertyqwerty".into()
    });
}

#[wasm_bindgen_test]
fn doenet_ml_error_cannot_use_copy_info_as_prop() {
    static DATA: &str = r#"
        <sequence name='s' from='0' to='2' />
        <number name='n' copySource='s' copyProp='value' propIndex='2'/>
        <number copySource='n' copyProp='propIndex' />
    "#;
    display_doenet_ml_on_failure!(DATA);

    let error = doenet_core_from(DATA).unwrap_err();
    assert!(matches!(error, DoenetMLError::StateVarDoesNotExist{ .. }));
}


// =========== DoenetML warnings ===========

#[wasm_bindgen_test]
fn doenet_ml_warning_prop_index_not_positive_integer() {
    static DATA: &str = r#"
    <sequence name='s' from='1' to='5' />
    <number copySource='s' copyProp='value' propIndex='1.5' />
    "#;
    display_doenet_ml_on_failure!(DATA);

    let (_, warnings) = doenet_core_from(DATA).unwrap();
    assert_eq!(
        warnings,
        vec![DoenetMLWarning::PropIndexIsNotPositiveInteger {
            comp_name: "/_number1".to_string(),
            invalid_index: "1.5".to_string(),
        }]
    )
}


// ========= <text> ==============

#[wasm_bindgen_test]
fn text_preserves_spaces_between_text_tags() {
    static DATA: &str = r#"
        <text name='a'><text>Hello</text> <text>there</text>!</text>
        <text name='b'><text>We <text>could</text> be <text copySource="/_text3" />.</text></text>
    "#;
    display_doenet_ml_on_failure!(DATA);


    let dc = doenet_core_with_no_warnings(DATA);
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

    let dc = doenet_core_with_no_warnings(DATA);
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


    let dc = doenet_core_with_no_warnings(DATA);
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

#[wasm_bindgen_test]
fn text_copy_prop_and_copy_source_combinations_with_additional_children() {
    static DATA: &str = r#"
    <text name='ti'>hi</text>

    <p>a: <text name='a' copySource='ti' copyProp='value' /></p>
    <p>b: <text name='b' copySource='a' /></p>
    <p>c: <text name='c' copySource='a'> more text</text></p>
    <p>d: <text name='d'>$a more text</text></p>
    <p>e: <text name='e'>$a.value more text</text></p>
    <p>f: <text name='f' copySource='b' /></p>
    <p>g: <text name='g' copySource='ti' copyProp='value'> more text</text></p>
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "a", "value", "hi");
    assert_sv_is_string(&dc, "b", "value", "hi");
    assert_sv_is_string(&dc, "c", "value", "hi more text");
    assert_sv_is_string(&dc, "d", "value", "hi more text");
    assert_sv_is_string(&dc, "e", "value", "hi more text");
    assert_sv_is_string(&dc, "f", "value", "hi");
    assert_sv_is_string(&dc, "g", "value", "hi more text");
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


    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    update_immediate_value_for_text(&dc, "/_textInput1", "this is the new immediate value");
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
    update_immediate_value_for_text(&dc, "/_textInput1", "the second text input changed this value" );
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "/_textInput1", "immediateValue", "the second text input changed this value");
    assert_sv_is_string(&dc, "/_textInput2", "immediateValue", "the second text input changed this value");
    assert_sv_is_string(&dc, "/_textInput3", "immediateValue", "the second text input changed this value");
    assert_sv_is_string(&dc, "/_text1", "value", "the second text input changed this value");
}

#[wasm_bindgen_test]
fn text_input_macro() {
    static DATA: &str = r#"
        <textInput name="t" prefill="Cake"/>
        <text>$t.value is good.</text>
    "#;
    display_doenet_ml_on_failure!(DATA);


    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "t", "value", "Cake");
    assert_sv_is_string(&dc, "t", "immediateValue", "Cake");
    assert_sv_is_string(&dc, "/_text1", "value", "Cake is good.");
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

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    // assert_sv_array_is_number_list(&dc, "myPoint", "xs", vec![0.0, 1.0]);

    move_point_2d(&dc, "myPoint", StateVarValue::Number(-5.11), StateVarValue::Number(27.0));
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "myPoint", "xs", vec![-5.11, 27.0]);
    assert_sv_is_number(&dc, "the_number_input", "value", -5.11);
    assert_sv_is_number(&dc, "the_number_input", "immediateValue", -5.11);
    assert_sv_is_number(&dc, "myNum", "value", -5.11);
}

#[wasm_bindgen_test]
fn number_input_value_remains_nan_until_update_value() {
    static DATA: &str = r#"
    <numberInput name='n'/>
    $n.value
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "n", "rawRendererValue", "");
    assert_sv_is_number(&dc, "n", "immediateValue", f64::NAN);
    assert_sv_is_number(&dc, "n", "value", f64::NAN);

    update_immediate_value_for_number(&dc, "n", "13.0");
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "n", "rawRendererValue", "13.0");
    assert_sv_is_number(&dc, "n", "immediateValue", 13.0);
    assert_sv_is_number(&dc, "n", "value", f64::NAN);

    update_value_for_number(&dc, "n");
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "n", "rawRendererValue", "13.0");
    assert_sv_is_number(&dc, "n", "immediateValue", 13.0);
    assert_sv_is_number(&dc, "n", "value", 13.0);
}

#[wasm_bindgen_test]
fn number_input_raw_renderer_value_not_overriden_on_update_value_action() {
    static DATA: &str = r#"
    <numberInput name='n'/>
    $n.immediateValue $n.value
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);

    update_immediate_value_for_number(&dc, "n", "non numerical value");
    doenet_core::update_renderers(&dc);
    assert_sv_is_string(&dc, "n", "rawRendererValue", "non numerical value");
    assert_sv_is_number(&dc, "n", "immediateValue", f64::NAN);
    assert_sv_is_number(&dc, "n", "value", f64::NAN);

    update_value_for_number(&dc, "n");
    doenet_core::update_renderers(&dc);
    assert_sv_is_string(&dc, "n", "rawRendererValue", "non numerical value");
    assert_sv_is_number(&dc, "n", "immediateValue", f64::NAN);
    assert_sv_is_number(&dc, "n", "value", f64::NAN);
}

#[wasm_bindgen_test]
fn number_input_raw_renderer_value_updates_with_bind() {
    static DATA: &str = r#"
    <numberInput name='n'/>
    <graph>
        <point name='immediatePoint' xs='1 $n.immediateValue' />
        <point name='valuePoint' xs='2 $n.value' />
    </graph>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "n", "rawRendererValue", "");
    assert_sv_is_number(&dc, "n", "immediateValue", f64::NAN);
    assert_sv_is_number(&dc, "n", "value", f64::NAN);
    assert_sv_array_is_number_list(&dc, "immediatePoint", "xs", vec![1.0, f64::NAN]);
    assert_sv_array_is_number_list(&dc, "valuePoint", "xs", vec![2.0, f64::NAN]);

    move_point_2d(&dc, "immediatePoint", StateVarValue::Number(1.0), StateVarValue::Number(4.0));
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "n", "rawRendererValue", "4");
    assert_sv_is_number(&dc, "n", "immediateValue", 4.0);
    assert_sv_array_is_number_list(&dc, "immediatePoint", "xs", vec![1.0, 4.0]);
    // assert_sv_is_number(&dc, "n", "value", f64::NAN);
    // assert_sv_array_is_number_list(&dc, "valuePoint", "xs", vec![2.0, f64::NAN]);

    move_point_2d(&dc, "valuePoint", StateVarValue::Number(2.0), StateVarValue::Number(-7.0));
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "n", "rawRendererValue", "-7");
    assert_sv_is_number(&dc, "n", "immediateValue", -7.0);
    assert_sv_is_number(&dc, "n", "value", -7.0);
    assert_sv_array_is_number_list(&dc, "immediatePoint", "xs", vec![1.0, -7.0]);
    assert_sv_array_is_number_list(&dc, "valuePoint", "xs", vec![2.0, -7.0]);
}


// ========= <collect> =============


#[wasm_bindgen_test]
fn collect_and_copy_number_input_changes_original() {
    static DATA: &str = r#"
        <section name="inputs">
                <textinput name="input1" prefill="yolo"/>
                <textinput name="input2" prefill="3"/>
        </section>

        <collect componentType="textinput" source="inputs"/>

        <section copySource="inputs"/>
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_with_no_warnings(DATA);
    let render_tree_string = doenet_core::update_renderers(&dc);
    let render_tree = serde_json::from_str(&render_tree_string).unwrap();

    let collect1 = child_instructions_for(&render_tree, "/_document1", "__textInput_from_(/_collect1[1])")
        .get("actions").unwrap()
        .as_object().unwrap()
        .get("updateValue").unwrap()
        .as_object().unwrap()
        .get("componentName").unwrap()
        .as_str().unwrap();
    let collect2 = child_instructions_for(&render_tree, "/_document1", "__textInput_from_(/_collect1[2])")
        .get("actions").unwrap()
        .as_object().unwrap()
        .get("updateImmediateValue").unwrap()
        .as_object().unwrap()
        .get("componentName").unwrap()
        .as_str().unwrap();
    let copy1 = child_instructions_for(&render_tree, "/_section2", "__cp:input1(/_section2)")
        .get("actions").unwrap()
        .as_object().unwrap()
        .get("updateImmediateValue").unwrap()
        .as_object().unwrap()
        .get("componentName").unwrap()
        .as_str().unwrap();
    let copy2 = child_instructions_for(&render_tree, "/_section2", "__cp:input2(/_section2)")
        .get("actions").unwrap()
        .as_object().unwrap()
        .get("updateValue").unwrap()
        .as_object().unwrap()
        .get("componentName").unwrap()
        .as_str().unwrap();

    assert_eq!(collect1, "input1");
    assert_eq!(collect2, "input2");
    assert_eq!(copy1, "input1");
    assert_eq!(copy2, "input2");

    assert_sv_is_string(&dc, "input1", "immediateValue", "yolo");
    assert_sv_is_string(&dc, "input2", "immediateValue", "3");
}


#[wasm_bindgen_test]
fn collect_point_into_text() {
    static DATA: &str = r#"
        <graph name="graph">
                <point name="p1" xs="2 3"/>
                <point name="p2" xs="$p1.y $p1.x"/>
        </graph>
        <text name="t"><collect source="graph" componentType="point"/></text>
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p1", "xs", vec![2.0, 3.0]);
    assert_sv_array_is_number_list(&dc, "p2", "xs", vec![3.0, 2.0]);
    assert_sv_is_string(&dc, "t", "value", "(2, 3)(3, 2)");
}

#[wasm_bindgen_test]
fn collect_sequence_changing() {
    static DATA: &str = r#"
        <number name="n" copySource="/_numberInput1" copyProp="value"/>:

        <p name="p1">
        <sequence name="seq" from="$n" to="$n+5"/>
        </p>

        <collect name="c1" source="p1" componentType="number"/>.

        $seq[3].value
        $c1[3].value
        <numberInput prefill="6"/>
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "__mcr:c1:value(/_document1)_1", "value", 8.0);
    assert_sv_is_number(&dc, "__mcr:seq:value(/_document1)_1", "value", 8.0);

    update_immediate_value_for_number(&dc, "/_numberInput1", "30");
    update_value_for_number(&dc, "/_numberInput1");

    // console_log!("the update: {:?}", doenet_core::utils::json_components(&dc.component_nodes, &dc.component_states));
    assert_state_var_stale(&dc, "seq", &vec![], &doenet_core::state_variables::StateRef::ArrayElement("value", 3));
    assert_state_var_stale(&dc, "__mcr:seq:value(/_document1)_1", &vec![], &doenet_core::state_variables::StateRef::Basic("value"));

    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_numberInput1", "value", 30.0);
    assert_sv_array_is_number_list(&dc, "seq", "value", vec![30.0, 31.0, 32.0, 33.0, 34.0, 35.0]);
    assert_sv_is_number(&dc, "__mcr:c1:value(/_document1)_1", "value", 32.0);
    assert_sv_is_number(&dc, "__mcr:seq:value(/_document1)_1", "value", 32.0);
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

    let dc = doenet_core_with_no_warnings(DATA);
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
fn sequence_can_grow_and_shrink() {
    static DATA: &str = r#"
    <numberInput name='ni' />
    <sequence to='$ni.value' />
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    update_immediate_value_for_number(&dc, "ni", "8.0");
    update_value_for_number(&dc, "ni");
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "/_sequence1", "value", vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]);

    update_immediate_value_for_number(&dc, "ni", "9");
    update_value_for_number(&dc, "ni");
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "/_sequence1", "value", vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0]);

    update_immediate_value_for_number(&dc, "ni", "2.0");
    update_value_for_number(&dc, "ni");
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "/_sequence1", "value", vec![1.0, 2.0]);

    update_immediate_value_for_number(&dc, "ni", "asdf");
    update_value_for_number(&dc, "ni");
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "/_sequence1", "value", vec![]);

    update_immediate_value_for_number(&dc, "ni", "-3");
    update_value_for_number(&dc, "ni");
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "/_sequence1", "value", vec![]);
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

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number3", "value", -1000.0);
    assert_sv_is_number(&dc, "/_number4", "value", -993.0);
    assert_sv_is_number(&dc, "/_number5", "value", -1000.0);
    assert_sv_is_number(&dc, "/_number6", "value", -993.0);
}

#[wasm_bindgen_test]
fn sequence_index_copied_based_on_number_input() {
    static DATA: &str = r#"
    <sequence name='s' from='10' to='15' />
    <p><numberInput name='n' /></p>
    <p><number copySource='s' copyProp='value' propIndex='$n.value'/></p>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    update_immediate_value_for_number(&dc, "n", "5.0");
    update_value_for_number(&dc, "n");
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number1", "value", 14.0);

    update_immediate_value_for_number(&dc, "n", "2");
    update_value_for_number(&dc, "n");
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number1", "value", 11.0);
}

#[wasm_bindgen_test]
fn sequence_macro_component_index() {
    static DATA: &str = r#"
        <p>
                <numberInput name="n" prefill="1"/>
                <sequence name="seq" from="$n.value" to="20"/>.

                <text>Fifth:$seq[5].value.</text>
                <text>Fifth:$seq[  5 ].value.</text>
                <text>Fifth: $seq[ 5 ].value</text>
                <text>Fifth: $seq[5  ].value</text>
        </p>
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);
    assert_sv_is_string(&dc, "/_text1", "value", "Fifth:5.");
    assert_sv_is_string(&dc, "/_text2", "value", "Fifth:5.");
    assert_sv_is_string(&dc, "/_text3", "value", "Fifth: 5");
    assert_sv_is_string(&dc, "/_text4", "value", "Fifth: 5");

    update_immediate_value_for_number(&dc, "n", "6");
    update_value_for_number(&dc, "n");
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "/_text1", "value", "Fifth:10.");
    assert_sv_is_string(&dc, "/_text2", "value", "Fifth:10.");
    assert_sv_is_string(&dc, "/_text3", "value", "Fifth: 10");
    assert_sv_is_string(&dc, "/_text4", "value", "Fifth: 10");
}

#[wasm_bindgen_test]
fn sequence_empty() {
    static DATA: &str = r#"
    <sequence />
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "/_sequence1", "value", vec![]);
}


#[wasm_bindgen_test]
fn sequence_dynamic_length() {
    static DATA: &str = r#"
    <numberinput name="n" prefill="4"/>
    <text name="t"><sequence from="1" to="$n.value"/></text>
    "#;
    display_doenet_ml_on_failure!(DATA);


    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "n", "value", 4.0);
    assert_sv_is_string(&dc, "t", "value", "1234");

    update_immediate_value_for_number(&dc, "n", "10.0");
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "n", "immediateValue", 10.0);
    assert_sv_is_number(&dc, "n", "value", 4.0);
    assert_sv_is_string(&dc, "t", "value", "1234");

    update_value_for_number(&dc, "n");
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "n", "immediateValue", 10.0);
    assert_sv_is_number(&dc, "n", "value", 10.0);
    assert_sv_is_string(&dc, "t", "value", "12345678910");

    update_immediate_value_for_number(&dc, "n", "8.0");
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "n", "immediateValue", 8.0);
    assert_sv_is_number(&dc, "n", "value", 10.0);
    assert_sv_is_string(&dc, "t", "value", "12345678910");

    update_value_for_number(&dc, "n");
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "n", "immediateValue", 8.0);
    assert_sv_is_number(&dc, "n", "value", 8.0);
    assert_sv_is_string(&dc, "t", "value", "12345678");
}

// ========= <point> ==============

#[wasm_bindgen_test]
fn point_moves_copy_number() {
    static DATA: &str = r#"
        <number name='num'>2</number>
        <graph name='g'><point name='p' xs='3 $num'/></graph>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p", "xs", vec![3.0, 2.0]);

    move_point_2d(&dc, "p", StateVarValue::Integer(5), StateVarValue::Number(1.0));
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
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "a", "xs", vec![1.0, 2.0]);
    assert_sv_array_is_number_list(&dc, "b", "xs", vec![-3.0, 4.0]);

    move_point_2d(&dc, "a", StateVarValue::Number(-2.0), StateVarValue::Number(-5.0));
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
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p1", "xs", vec![1.0, 2.0]);
    assert_sv_array_is_number_list(&dc, "p2", "xs", vec![1.0, 2.0]);
    assert_sv_array_is_number_list(&dc, "p3", "xs", vec![1.0, 2.0]);
    assert_sv_array_is_number_list(&dc, "p4", "xs", vec![1.0, 2.0]);

    move_point_2d(&dc, "p2", StateVarValue::Number(-3.2), StateVarValue::Number(7.1));
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p1", "xs", vec![-3.2, 7.1]);
    assert_sv_array_is_number_list(&dc, "p2", "xs", vec![-3.2, 7.1]);
    assert_sv_array_is_number_list(&dc, "p3", "xs", vec![-3.2, 7.1]);
    assert_sv_array_is_number_list(&dc, "p4", "xs", vec![-3.2, 7.1]);
}

#[wasm_bindgen_test]
fn point_used_with_prop_index() {
    static DATA: &str = r#"
    <sequence name='s' from='10' to='15' />
    <number name='id'>2</number>
    <number copySource='s' copyProp='value' propIndex='$id.value' />
    
    <graph>
    <point name='p' xs='1 $id.value' />
    </graph>
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number2", "value", 11.0);

    move_point_2d(&dc, "p", StateVarValue::Integer(5), StateVarValue::Number(4.123123));
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number2", "value", f64::NAN);

    move_point_2d(&dc, "p", StateVarValue::Integer(5), StateVarValue::Integer(4));
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number2", "value", 13.0);
}

// ========= Map ===========
#[wasm_bindgen_test]
fn map_complicated_sources() {
    static DATA: &str = r#"
        <number name="n1">4</number>
        <number name="n2">3</number>
        <map>
            <sources componentType="number" alias="i">
                <number name="n3">3</number>
                <number copySource="n1"/>
                <sequence from="1" to="$n2"/>
                <number>$n3 + 5</number>
                <number copySource = "/_sequence1" componentIndex="2" copyProp="value"/>
            </sources>
            <template>
                <text name="t">$i squared is <number>$i^2</number></text>
            </template>
        </map>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_string_with_map(&dc, "t", vec![1] ,"value", "3 squared is 9");
    assert_sv_is_string_with_map(&dc, "t", vec![2] ,"value", "4 squared is 16");
    assert_sv_is_string_with_map(&dc, "t", vec![3] ,"value", "1 squared is 1");
    assert_sv_is_string_with_map(&dc, "t", vec![4] ,"value", "2 squared is 4");
    assert_sv_is_string_with_map(&dc, "t", vec![5] ,"value", "3 squared is 9");
    assert_sv_is_string_with_map(&dc, "t", vec![6] ,"value", "8 squared is 64");
    assert_sv_is_string_with_map(&dc, "t", vec![7] ,"value", "2 squared is 4");
}

#[wasm_bindgen_test]
fn maps_in_maps() {
    static DATA: &str = r#"
    <map>
        <sources componentType="number" alias="x">
            <sequence from="1" to ="3"/>
        </sources>
        <template>
            <map>
                <sources componentType="number" alias="y">
                    <sequence from="1" to="$x"/>
                </sources>
                <template>
                    <map>
                        <sources componentType="text" alias="z">
                            <text>$x is x</text>
                            <text>$y is y</text>
                            <text>rose is red</text>
                        </sources>
                        <template>
                                <text name="t">$z using $x and $y</text>
                        </template>
                    </map>
                </template>
            </map>
        </template>
    </map>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![1], "value", 1);
    assert_sv_is_string_with_map(&dc, "t", vec![1,1,1], "value", "1 is x using 1 and 1");
    assert_sv_is_string_with_map(&dc, "t", vec![1,1,2], "value", "1 is y using 1 and 1");

    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![2], "value", 2);
    assert_sv_is_string_with_map(&dc, "t", vec![2,1,1], "value", "2 is x using 2 and 1");
    assert_sv_is_string_with_map(&dc, "t", vec![2,1,2], "value", "1 is y using 2 and 1");
    assert_sv_is_string_with_map(&dc, "t", vec![2,2,1], "value", "2 is x using 2 and 2");
    assert_sv_is_string_with_map(&dc, "t", vec![2,2,2], "value", "2 is y using 2 and 2");

    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![3], "value", 3);
    assert_sv_is_string_with_map(&dc, "t", vec![3,1,1], "value", "3 is x using 3 and 1");
    assert_sv_is_string_with_map(&dc, "t", vec![3,1,2], "value", "1 is y using 3 and 1");
    assert_sv_is_string_with_map(&dc, "t", vec![3,2,1], "value", "3 is x using 3 and 2");
    assert_sv_is_string_with_map(&dc, "t", vec![3,2,2], "value", "2 is y using 3 and 2");
    assert_sv_is_string_with_map(&dc, "t", vec![3,3,1], "value", "3 is x using 3 and 3");
    assert_sv_is_string_with_map(&dc, "t", vec![3,3,2], "value", "3 is y using 3 and 3");
}


#[wasm_bindgen_test]
fn map_dynamic_size() {
    static DATA: &str = r#"
    <numberinput name="i" prefill="1"/>
    <map>
        <sources componentType="number" alias="one">
            <sequence from="1" to="$i.value"/>
        </sources>
        <template>
            <numberinput name="j" prefill="2"/>
            <map>
                <sources componentType="number" alias="two">
                    <sequence from="1" to="$j.value"/>
                </sources>
                <template>
                    <text name="t">($one, $two) with size ($i.value, $j.value)</text>
                </template>
            </map>
        </template>
    </map>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_array_size_is_with_map(&dc, "/_sequence1", vec![], "value", 1);
    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![1], "value", 2);
    assert_sv_is_string_with_map(&dc, "t", vec![1,1], "value", "(1, 1) with size (1, 2)");
    assert_sv_is_string_with_map(&dc, "t", vec![1,2], "value", "(1, 2) with size (1, 2)");


    update_immediate_value_for_number(&dc, "i", "3.0");
    doenet_core::update_renderers(&dc);
    assert_sv_array_size_is_with_map(&dc, "/_sequence1", vec![], "value", 1);
    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![1], "value", 2);

    update_value_for_number(&dc, "i");
    doenet_core::update_renderers(&dc);
    assert_sv_array_size_is_with_map(&dc, "/_sequence1", vec![], "value", 3);
    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![1], "value", 2);
    assert_sv_is_string_with_map(&dc, "t", vec![1,1], "value", "(1, 1) with size (3, 2)");
    assert_sv_is_string_with_map(&dc, "t", vec![1,2], "value", "(1, 2) with size (3, 2)");
    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![2], "value", 2);
    assert_sv_is_string_with_map(&dc, "t", vec![2,1], "value", "(2, 1) with size (3, 2)");
    assert_sv_is_string_with_map(&dc, "t", vec![2,2], "value", "(2, 2) with size (3, 2)");
    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![3], "value", 2);
    assert_sv_is_string_with_map(&dc, "t", vec![3,1], "value", "(3, 1) with size (3, 2)");
    assert_sv_is_string_with_map(&dc, "t", vec![3,2], "value", "(3, 2) with size (3, 2)");


    let action_name = r#"[2]j"#;
    update_immediate_value_for_number(&dc, action_name, "4.0");
    doenet_core::update_renderers(&dc);
    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![2], "value", 2);

    update_value_for_number(&dc, action_name);
    doenet_core::update_renderers(&dc);
    assert_sv_array_size_is_with_map(&dc, "/_sequence1", vec![], "value", 3);
    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![1], "value", 2);
    assert_sv_is_string_with_map(&dc, "t", vec![1,1], "value", "(1, 1) with size (3, 2)");
    assert_sv_is_string_with_map(&dc, "t", vec![1,2], "value", "(1, 2) with size (3, 2)");
    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![2], "value", 4);
    assert_sv_is_string_with_map(&dc, "t", vec![2,1], "value", "(2, 1) with size (3, 4)");
    assert_sv_is_string_with_map(&dc, "t", vec![2,2], "value", "(2, 2) with size (3, 4)");
    assert_sv_is_string_with_map(&dc, "t", vec![2,3], "value", "(2, 3) with size (3, 4)");
    assert_sv_is_string_with_map(&dc, "t", vec![2,4], "value", "(2, 4) with size (3, 4)");
    assert_sv_array_size_is_with_map(&dc, "/_sequence2", vec![3], "value", 2);
    assert_sv_is_string_with_map(&dc, "t", vec![3,1], "value", "(3, 1) with size (3, 2)");
    assert_sv_is_string_with_map(&dc, "t", vec![3,2], "value", "(3, 2) with size (3, 2)");
}

#[wasm_bindgen_test]
fn map_move_points() {
    static DATA: &str = r#"
    <map>
    <sources componentType="number" alias="x">
        <number>5</number>
        <number>3</number>
    </sources>
    <template>
            <graph>
                    <point name="p" xs="$x 2"/>
            </graph>
    </template>
    </map>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list_with_map(&dc, "p", vec![1] , "numericalXs", vec![5.0, 2.0]);
    assert_sv_array_is_number_list_with_map(&dc, "p", vec![2] , "numericalXs", vec![3.0, 2.0]);

    let first_instance = r#"[1]p"#;
    move_point_2d(&dc, first_instance, StateVarValue::Integer(2), StateVarValue::Integer(4));
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list_with_map(&dc, "p", vec![1] , "numericalXs", vec![5.0, 4.0]);
    assert_sv_array_is_number_list_with_map(&dc, "p", vec![2] , "numericalXs", vec![3.0, 2.0]);

    let second_instance = r#"[2]p"#;
    move_point_2d(&dc, second_instance, StateVarValue::Integer(1), StateVarValue::Integer(6));
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list_with_map(&dc, "p", vec![1] , "numericalXs", vec![5.0, 4.0]);
    assert_sv_array_is_number_list_with_map(&dc, "p", vec![2] , "numericalXs", vec![3.0, 6.0]);
}

#[wasm_bindgen_test]
fn map_inside_text() {
    static DATA: &str = r#"
    <text><map><sources alias="t" componentType="text">
            <text>cow</text>
            <text>horse</text>
    </sources><template>some $t but <map>
    <sources alias="r" componentType="text">
            <text>yes</text>
            <text>no</text>
    </sources><template>then it answers $r </template>
    </map>and </template>
    </map>they left</text>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "/_text1", "value", "some cow but then it answers yes then it answers no and some horse but then it answers yes then it answers no and they left");
}

// ========= <conditionalContent> ===========

#[wasm_bindgen_test]
fn conditional_content_updating() {
    static DATA: &str = r#"
    <numberinput name="n" prefill="2"/>
    <text>Description: <conditionalContent>
        <case condition="$n.value>=0.0">positive, </case>
        <case condition="$n.value<0.0">negative, </case>
        <case condition="$n.value>2.0">greater than 2, </case>
        <case condition="$n.value>1.0">greater than 1, </case>
        <case condition="$n.value<3.0">less than 3, </case>
    </conditionalContent>ok.</text>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "/_text1", "value", "Description: positive, greater than 1, less than 3, ok.");

    update_immediate_value_for_number(&dc, "n", "10");
    update_value_for_number(&dc, "n");
    doenet_core::update_renderers(&dc);
    assert_sv_is_string(&dc, "/_text1", "value", "Description: positive, greater than 2, greater than 1, ok.");

    update_immediate_value_for_number(&dc, "n", "1");
    update_value_for_number(&dc, "n");
    doenet_core::update_renderers(&dc);
    assert_sv_is_string(&dc, "/_text1", "value", "Description: positive, less than 3, ok.");

    update_immediate_value_for_number(&dc, "n", "-1");
    update_value_for_number(&dc, "n");
    doenet_core::update_renderers(&dc);
    assert_sv_is_string(&dc, "/_text1", "value", "Description: negative, less than 3, ok.");
}



// =========== <boolean> ===========

#[wasm_bindgen_test]
fn boolean_operations() {
    static DATA: &str = r#"
        <booleanInput name="bool2"/>
        <text hide="$bool2.value">Yin</text>
        <text hide="!$bool2.value">Yang</text>

        <number name="num">3</number>
        <boolean>$num == 3.0</boolean>
        <boolean>$num != 1.0</boolean>
        <boolean>$num != 3.0</boolean>

    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_boolean(&dc, "/_text1", "hidden", false);
    assert_sv_is_boolean(&dc, "/_text2", "hidden", true);

    assert_sv_is_boolean(&dc, "/_boolean1", "value", true);
    assert_sv_is_boolean(&dc, "/_boolean2", "value", true);
    assert_sv_is_boolean(&dc, "/_boolean3", "value", false);
}

// =========== <line> ============

#[wasm_bindgen_test]
fn line_points_collection() {
    static DATA: &str = r#"
        <graph>
                <line p1="5 2" p2="3 4"/>
	        <point copySource="/_line1" copyCollection="points" componentIndex="1"/>
	        <point copySource="/_line1" copyCollection="points" componentIndex="2"/>
        </graph>
        <number copySource="/_line1" copyCollection="points" componentIndex="1" copyProp="xs" propIndex="2"/>
        <number copySource="/_line1" copyCollection="points" componentIndex="2" copyProp="xs" propIndex="1"/>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number1", "value", 2.0);
    assert_sv_is_number(&dc, "/_number2", "value", 3.0);
    assert_sv_array_is_number_list(&dc, "/_point1", "numericalXs", vec![5.0, 2.0]);
    assert_sv_array_is_number_list(&dc, "/_point2", "numericalXs", vec![3.0, 4.0]);

    move_point_2d(&dc, "/_point1", StateVarValue::Number(3.0), StateVarValue::Number(1.0));
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number1", "value", 1.0);
    assert_sv_is_number(&dc, "/_number2", "value", 3.0);
    assert_sv_array_is_number_list(&dc, "/_point1", "numericalXs", vec![3.0, 1.0]);
    assert_sv_array_is_number_list(&dc, "/_point2", "numericalXs", vec![3.0, 4.0]);

    move_point_2d(&dc, "/_point2", StateVarValue::Number(1.0), StateVarValue::Number(3.0));
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number1", "value", 1.0);
    assert_sv_is_number(&dc, "/_number2", "value", 1.0);
    assert_sv_array_is_number_list(&dc, "/_point1", "numericalXs", vec![3.0, 1.0]);
    assert_sv_array_is_number_list(&dc, "/_point2", "numericalXs", vec![1.0, 3.0]);
}

// =========== <number> ============

#[wasm_bindgen_test]
fn number_with_string_children() {
    static DATA: &str = r#"
    <number />
    <number></number>
    <number>5</number>
    <number>5+1</number>
    <number>5+ 1 </number>
    <number>asfd</number>
    <number> asdft + 5</number>

    <!-- <number>5  1 </number> -->
    "#;
    display_doenet_ml_on_failure!(DATA);
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "/_number1", "value", 0.0);
    assert_sv_is_number(&dc, "/_number2", "value", 0.0);
    assert_sv_is_number(&dc, "/_number3", "value", 5.0);
    assert_sv_is_number(&dc, "/_number4", "value", 6.0);
    assert_sv_is_number(&dc, "/_number5", "value", 6.0);
    assert_sv_is_number(&dc, "/_number6", "value", f64::NAN);
    assert_sv_is_number(&dc, "/_number7", "value", f64::NAN);
}

#[wasm_bindgen_test]
fn number_invalid_children() {
    static DATA: &str = r#"
    <number><text>2</text></number>
    <number><text>3 +</text><text>2</text></number>
    <number>3 <text /></number>
    "#;
    display_doenet_ml_on_failure!(DATA);
    let (_, warnings) = doenet_core_from(DATA).unwrap();

    assert_eq!(warnings.len(), 4);
    assert!(warnings.contains(
        &DoenetMLWarning::InvalidChildType {
            parent_comp_name: "/_number1".into(),
            child_comp_name: "/_text1".into(),
            child_comp_type: "text",
        },
    ));
    assert!(warnings.contains(
        &DoenetMLWarning::InvalidChildType {
            parent_comp_name: "/_number2".into(),
            child_comp_name: "/_text2".into(),
            child_comp_type: "text",
        },
    ));
    assert!(warnings.contains(
        &DoenetMLWarning::InvalidChildType {
            parent_comp_name: "/_number2".into(),
            child_comp_name: "/_text3".into(),
            child_comp_type: "text",
        },
    ));
    assert!(warnings.contains(
        &DoenetMLWarning::InvalidChildType {
            parent_comp_name: "/_number3".into(),
            child_comp_name: "/_text4".into(),
            child_comp_type: "text",
        },
    ));
}


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

    let dc = doenet_core_with_no_warnings(DATA);
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


    let (dc, doenet_ml_warnings) = doenet_core_from(DATA).unwrap();
    assert_eq!(doenet_ml_warnings.len(), 3);
    for warning in doenet_ml_warnings {
        assert!(matches!(warning, DoenetMLWarning::PropIndexIsNotPositiveInteger { .. }));
    }

    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "num1", "value", f64::NAN);
    assert_sv_is_number(&dc, "num2", "value", f64::NAN);
    assert_sv_is_number(&dc, "num3", "value", f64::NAN);
    assert_sv_is_number(&dc, "num4", "value", f64::NAN);
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


    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "num1", "value", f64::NAN);
    assert_sv_is_number(&dc, "num2", "value", f64::NAN);
    assert_sv_is_number(&dc, "num3", "value", f64::NAN);
    assert_sv_is_number(&dc, "num4", "value", f64::NAN);
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

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    update_immediate_value_for_number(&dc, "/_numberInput1", "5.0");
    doenet_core::update_renderers(&dc);

    assert_sv_is_number(&dc, "n1", "value", 6.0);
    assert_sv_is_number(&dc, "n2", "value", 6.0);
    assert_sv_is_number(&dc, "n3", "value", 6.0);

}


// ========= <sources> ===========

#[wasm_bindgen_test]
fn sources_with_no_children() {
    static DATA: &str = r#"
    <sources></sources>
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);
}


// ========= Macros ===========

// // This test takes a long time to run
// #[wasm_bindgen_test]
// fn macro_prop_index_inside_prop_index_with_whitespace() {
//     static DATA: &str = r#"
//     <sequence hide name='s1' from='11' to='30' />
//     <sequence hide name='s2' from='51' to='100' />
//     <sequence hide name='s3' from='101' to='500' />
    
//     <text>$s1[1].value</text>
//     <text>$s2[$s1[3].value].value</text>
//     <text>$s2[   $s1[3].value    ].value</text>
//     <text>$s2[$s1[3].value    ].value</text>
//     <text>$s2[ $s1[3].value].value</text>
//     <text>$s3[ $s2[$s1[5].value].value ].value</text>
//     <number>$s3[ $s2[$s1[ $s1[2].value ].value].value ].value</number>
//     "#;
//     display_doenet_ml_on_failure!(DATA);
//     let dc = doenet_core_with_no_warnings(DATA);
//     doenet_core::update_renderers(&dc);

//     assert_sv_is_string(&dc, "/_text1", "value", "11");
//     assert_sv_is_string(&dc, "/_text2", "value", "63");
//     assert_sv_is_string(&dc, "/_text3", "value", "63");
//     assert_sv_is_string(&dc, "/_text4", "value", "63");
//     assert_sv_is_string(&dc, "/_text5", "value", "63");
//     assert_sv_is_string(&dc, "/_text6", "value", "165");
//     assert_sv_is_number(&dc, "/_number1", "value", 172.0);
// }

// TODO: Do we want to allow this notation?
// This test takes a long time to run
#[wasm_bindgen_test]
fn macro_prop_index_inside_prop_index_with_whitespace_older_notation() {
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
    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "/_text1", "value", "11");
    assert_sv_is_string(&dc, "/_text2", "value", "63");
    assert_sv_is_string(&dc, "/_text3", "value", "63");
    assert_sv_is_string(&dc, "/_text4", "value", "63");
    assert_sv_is_string(&dc, "/_text5", "value", "63");
    assert_sv_is_string(&dc, "/_text6", "value", "165");
    assert_sv_is_number(&dc, "/_number1", "value", 172.0);
}


#[wasm_bindgen_test]
fn macro_invalid_component_or_state_var_or_index_does_not_crash() {
    static DATA: &str = r#"
        <text name='a'>$asdfasdf</text>
        <text name='b'>$a.qwertyqwerty</text>
        <text name='c'>$a.value[5]</text>
        <text name='d'>$a[5].value</text>
    "#;
    display_doenet_ml_on_failure!(DATA);

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_is_string(&dc, "a", "value", "$asdfasdf");
    assert_sv_is_string(&dc, "b", "value", "$a.qwertyqwerty");
    assert_sv_is_string(&dc, "c", "value", "$a.value[5]");
    assert_sv_is_string(&dc, "d", "value", "$a[5].value");
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

    let dc = doenet_core_with_no_warnings(DATA);
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p", "xs", vec![3.0, 2.0]);

    move_point_2d(&dc, "p", StateVarValue::Integer(5), StateVarValue::Number(1.0));
    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p", "xs", vec![5.0, 1.0]);


    let (dc, possible_warnings) = doenet_core_with_essential_data(DATA, dc.essential_data).unwrap();
    assert_eq!(possible_warnings.len(), 0);

    doenet_core::update_renderers(&dc);

    assert_sv_array_is_number_list(&dc, "p", "xs", vec![5.0, 1.0]);
}


// Make sure that the $n variable name is not var0
// <number name='n'>3.1</number>
// <math name='m'>var + $n</math>

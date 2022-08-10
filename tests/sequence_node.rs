
mod common_node;

use common_node::*;
use wasm_bindgen_test::wasm_bindgen_test;



#[wasm_bindgen_test]
fn sequence_copies_component() {
    let data = r#"
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

    let dc = doenet_core_from(data).unwrap();
    doenet_core::update_renderers(&dc);

    assert_state_var_array_size_is(&dc, "/_sequence2", "value", 7);
    assert_state_var_array_element_is_number(&dc, "/_sequence2", "value", 0, 5.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence2", "value", 1, 6.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence2", "value", 2, 7.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence2", "value", 3, 8.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence2", "value", 4, 9.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence2", "value", 5, 10.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence2", "value", 6, 11.0);


    assert_state_var_array_size_is(&dc, "/_sequence3", "value", 4);
    assert_state_var_array_element_is_number(&dc, "/_sequence3", "value", 0, 3.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence3", "value", 1, 4.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence3", "value", 2, 5.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence3", "value", 3, 6.0);

    assert_state_var_array_size_is(&dc, "/_sequence4", "value", 3);
    assert_state_var_array_element_is_number(&dc, "/_sequence4", "value", 0, 9.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence4", "value", 1, 10.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence4", "value", 2, 11.0);

    assert_state_var_array_size_is(&dc, "/_sequence5", "value", 0);

    assert_state_var_array_size_is(&dc, "/_sequence6", "value", 1);
    assert_state_var_array_element_is_number(&dc, "/_sequence6", "value", 0, 5.0);

    assert_state_var_array_size_is(&dc, "/_sequence7", "value", 2);
    assert_state_var_array_element_is_number(&dc, "/_sequence7", "value", 0, 21.0);
    assert_state_var_array_element_is_number(&dc, "/_sequence7", "value", 1, 22.0);

    assert_state_var_array_size_is(&dc, "/_sequence8", "value", 0);
}


#[wasm_bindgen_test]
fn sequence_from_and_to_can_be_copied_as_props() {
    let data = r#"
        <number name='f'>-1000</number>
        <number name='t'>-993</number>

        <sequence name='s' from="$f" to="$t" />

        <number copySource='s' prop='from' />
        <number copySource='s' prop='to' />
        <number>$s.from</number>
        <number>$s.to</number>
    "#;

    let dc = doenet_core_from(data).unwrap();
    doenet_core::update_renderers(&dc);

    assert_state_var_basic_is_number(&dc, "/_number3", "value", -1000.0);
    assert_state_var_basic_is_number(&dc, "/_number4", "value", -993.0);
    assert_state_var_basic_is_number(&dc, "/_number5", "value", -1000.0);
    assert_state_var_basic_is_number(&dc, "/_number6", "value", -993.0);
}


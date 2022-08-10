
mod common_node;

use common_node::*;
use doenet_core::parse_json::DoenetMLError;
use wasm_bindgen_test::wasm_bindgen_test;


#[wasm_bindgen_test]
fn text_preserves_spaces_between_text_tags() {

    let data = r#"
    <document>
        <text name='a'><text>Hello</text> <text>there</text>!</text>
        <text name='b'><text>We <text>could</text> be <text copySource="/_text3" />.</text></text>
    </document>
    "#;
    let dc = doenet_core_from(data).unwrap();
    doenet_core::update_renderers(&dc);

    assert_state_var_basic_is_string(&dc, "a", "value", "Hello there!");
    assert_state_var_basic_is_string(&dc, "b", "value", "We could be there.");
}


#[wasm_bindgen_test]
fn text_inside_text() {
    let data = r#"
    <document>
    <text>one<text> two <text name='t2' copySource='t' /> <text name='t'>three</text> again </text><text copySource="t2"/> once more</text>
    </document>
    "#;

    let dc = doenet_core_from(data).unwrap();
    doenet_core::update_renderers(&dc);

    assert_state_var_basic_is_string(&dc, "/_text1", "value", "one two three three again three once more");
}


#[wasm_bindgen_test]
fn text_copy_component_of_copy_component() {
    let data = r#"
        <text name='a'><text name='one'>one</text></text>
        <text name='b' copySource='a'><text name='two'>two</text></text>
        <text name='c' copySource='b'><text name='three'>three</text></text>
    "#;

    let dc = doenet_core_from(data).unwrap();
    doenet_core::update_renderers(&dc);

    assert_state_var_basic_is_string(&dc, "a", "text", "one");
    assert_state_var_basic_is_string(&dc, "b", "text", "onetwo");
    assert_state_var_basic_is_string(&dc, "c", "text", "onetwothree");
}

#[wasm_bindgen_test]
fn text_copy_component_cyclical_gives_error() {
    let data = r#"
    <text name='irrelevant' copySource='a' />
    <text name='a' copySource='b' />
    <text name='b' copySource='a' />
    "#;

    let error = doenet_core_from(data).unwrap_err();
    assert!(matches!(error, DoenetMLError::CyclicalDependency { component_chain: _ }));

}

#[wasm_bindgen_test]
fn text_copy_itself_as_child_gives_error() {
    let data = r#"
        <text name='t'> $t</text>
    "#;

    let error = doenet_core_from(data).unwrap_err();
    assert!(matches!(error, DoenetMLError::CyclicalDependency { component_chain: _ }));
}


#[wasm_bindgen_test]
fn text_copy_itself_as_grandchild_gives_error() {
    let data = r#"
        <text name='t'><text>$t</text></text>
    "#;

    let error = doenet_core_from(data).unwrap_err();
    match error {
        DoenetMLError::CyclicalDependency { component_chain } => assert_eq!(component_chain.len(), 3),
        _ => panic!("Wrong error type")
    };
}
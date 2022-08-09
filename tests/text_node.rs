
mod common_node;

use common_node::*;
use wasm_bindgen_test::wasm_bindgen_test;


#[wasm_bindgen_test]
fn text_preserves_spaces_between_text_tags() {

    let data = r#"
    <document>
        <text name='a'><text>Hello</text> <text>there</text>!</text>
        <text name='b'><text>We <text>could</text> be <text copySource="/_text3" />.</text></text>
    </document>
    "#;
    let (dc, ml_errs) = doenet_core_from(data);
    assert_eq!(ml_errs.len(), 0);
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

    let (dc, ml_errs) = doenet_core_from(data);
    assert_eq!(ml_errs.len(), 0);
    doenet_core::update_renderers(&dc);

    assert_state_var_basic_is_string(&dc, "/_text1", "value", "one two three three again three once more");
}

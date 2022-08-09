// #![cfg(target_arch = "wasm32")]

mod common_node;

use common_node::*;
use wasm_bindgen_test::wasm_bindgen_test;


// #[wasm_bindgen_test]
// fn p_copies_p_with_grandchildren() {
//     let data = r#"
//         <p><p><p><p>super grandchild</p></p></p></p>
//         <p name='c1' copySource='/_p1' />
//         <p name='c2' copySource="c1" />
//     "#;

//     let (dc, ml_errs) = doenet_core_from(data);
//     assert_eq!(ml_errs.len(), 0);
//     doenet_core::update_renderers(&dc);

//     assert_state_var_basic_is_string(&dc, "c2", "value", "super grandchild");
// }


// #[wasm_bindgen_test]
// fn multi_layered_component_copy() {
//     let data = r#"

//         <p name='a'><p><p>grandchild</p></p></p>
//         <p name='b'>hello <p>there <p copySource='a' /></p></p>
//         <p name='c'><p><p copySource='b' /></p></p>
//     "#;

//     let (dc, ml_errs) = doenet_core_from(data);
//     assert_eq!(ml_errs.len(), 0);
//     doenet_core::update_renderers(&dc);

//     assert_state_var_basic_is_string(&dc, "c", "value", "hello there grandchild");
// }


// #[wasm_bindgen_test]
// fn text_with_child_of_itself_fails_immediately() {
//     let data = r#"
//         <text name='hi'><text>
//             I have myself copied here $hi
//         </text></text>

//         <text name='a' copySource='hi'>
//     "#;

//     let (dc, ml_errs) = doenet_core_from(data);
//     // let relevant_errors = ml_errs.iter().filter()
// }
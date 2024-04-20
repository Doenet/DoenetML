use super::*;

use doenetml_core::components::doenet::math::MathProps;

// Note: we cannot do much with math here, as it requires wasm to call out to math-expressions

const VALUE_LOCAL_IDX: LocalPropIdx = MathProps::Value.local_idx();

#[test]
fn value_prop_from_string_child() {
    let dast_root = dast_root_no_position(r#"<math></math>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the math will be index 1, as the document tag will be index 0.
    let math_idx = 1;

    let math_prop = core.get_prop(math_idx, VALUE_LOCAL_IDX);

    dbg!(math_prop);
}

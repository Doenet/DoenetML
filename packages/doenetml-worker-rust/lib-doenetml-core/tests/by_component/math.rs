use super::*;

use doenetml_core::components::doenet::math::MathProps;

// Note: we cannot do much with math here, as it requires wasm to call out to math-expressions

const VALUE_LOCAL_IDX: LocalPropIdx = MathProps::Value.local_idx();
const HIDDEN_LOCAL_IDX: LocalPropIdx = MathProps::Hidden.local_idx();
const FIXED_LOCAL_IDX: LocalPropIdx = MathProps::Fixed.local_idx();
const SPLIT_SYMBOLS_LOCAL_IDX: LocalPropIdx = MathProps::SplitSymbols.local_idx();

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

#[test]
fn hidden_prop_from_attribute() {
    let dast_root =
        dast_root_no_position(r#"<math></math><math hide></math><math hide="false"></math>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the first math will be index 1, as the document tag will be index 0.
    let math_idx1 = 1;
    let math_idx2 = 2;
    let math_idx3 = 3;

    let hidden_prop1 = core.get_prop(math_idx1, HIDDEN_LOCAL_IDX);
    let hidden_prop2 = core.get_prop(math_idx2, HIDDEN_LOCAL_IDX);
    let hidden_prop3 = core.get_prop(math_idx3, HIDDEN_LOCAL_IDX);

    let hidden1: bool = hidden_prop1.value.try_into().unwrap();
    let hidden2: bool = hidden_prop2.value.try_into().unwrap();
    let hidden3: bool = hidden_prop3.value.try_into().unwrap();

    assert_eq!(hidden1, false);
    assert_eq!(hidden_prop1.came_from_default, true);

    assert_eq!(hidden2, true);
    assert_eq!(hidden_prop2.came_from_default, false);

    assert_eq!(hidden3, false);
    assert_eq!(hidden_prop3.came_from_default, false);
}

#[test]
fn fixed_prop_from_attribute() {
    let dast_root =
        dast_root_no_position(r#"<math></math><math fixed></math><math fixed="false"></math>"#);

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the first math will be index 1, as the document tag will be index 0.
    let math_idx1 = 1;
    let math_idx2 = 2;
    let math_idx3 = 3;

    let fixed_prop1 = core.get_prop(math_idx1, FIXED_LOCAL_IDX);
    let fixed_prop2 = core.get_prop(math_idx2, FIXED_LOCAL_IDX);
    let fixed_prop3 = core.get_prop(math_idx3, FIXED_LOCAL_IDX);

    let fixed1: bool = fixed_prop1.value.try_into().unwrap();
    let fixed2: bool = fixed_prop2.value.try_into().unwrap();
    let fixed3: bool = fixed_prop3.value.try_into().unwrap();

    assert_eq!(fixed1, false);
    assert_eq!(fixed_prop1.came_from_default, true);

    assert_eq!(fixed2, true);
    assert_eq!(fixed_prop2.came_from_default, false);

    assert_eq!(fixed3, false);
    assert_eq!(fixed_prop3.came_from_default, false);
}

#[test]
fn split_symbols_attribute() {
    let dast_root = dast_root_no_position(
        r#"<math></math><math splitSymbols="false"></math><math splitSymbols="true"></math><math splitsymbols="false"></math>"#,
    );

    let mut core = TestCore::new();
    core.init_from_dast_root(&dast_root);

    // the first math will be index 1, as the document tag will be index 0.
    let math_idx1 = 1;
    let math_idx2 = 2;
    let math_idx3 = 3;
    let math_idx4 = 4;

    let split_symbols_prop1 = core.get_prop(math_idx1, SPLIT_SYMBOLS_LOCAL_IDX);
    let split_symbols_prop2 = core.get_prop(math_idx2, SPLIT_SYMBOLS_LOCAL_IDX);
    let split_symbols_prop3 = core.get_prop(math_idx3, SPLIT_SYMBOLS_LOCAL_IDX);
    let split_symbols_prop4 = core.get_prop(math_idx4, SPLIT_SYMBOLS_LOCAL_IDX);

    let split_symbols1: bool = split_symbols_prop1.value.try_into().unwrap();
    let split_symbols2: bool = split_symbols_prop2.value.try_into().unwrap();
    let split_symbols3: bool = split_symbols_prop3.value.try_into().unwrap();
    let split_symbols4: bool = split_symbols_prop4.value.try_into().unwrap();

    assert_eq!(split_symbols1, true);
    assert_eq!(split_symbols_prop1.came_from_default, true);

    assert_eq!(split_symbols2, false);
    assert_eq!(split_symbols_prop2.came_from_default, false);

    assert_eq!(split_symbols3, true);
    assert_eq!(split_symbols_prop3.came_from_default, false);

    assert_eq!(split_symbols4, false);
    assert_eq!(split_symbols_prop4.came_from_default, false);
}

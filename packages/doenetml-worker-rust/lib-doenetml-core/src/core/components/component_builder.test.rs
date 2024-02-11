use super::*;
use crate::{
    dast::{flat_dast::FlatRoot, macro_expand::Expander},
    test_utils::*,
};

#[test]
fn text_input_transmutes_to_text_when_referred_to_by_macro() {
    let dast_root = dast_root_no_position(r#"<textInput name="ti" />$ti"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    // Execute the same steps Core does when initializing.
    Expander::expand(&mut flat_root);
    flat_root.compactify();
    let normalized_root = NormalizedRoot::from_flat_root(&flat_root);
    let builder = ComponentBuilder::from_normalized_root(&normalized_root);

    assert!(matches!(&builder.components[2], ComponentEnum::Text(_)));
}

#[test]
fn text_input_immediate_value_transmutes_to_text_when_referred_to_by_macro() {
    let dast_root = dast_root_no_position(r#"<textInput name="ti" />$ti.immediateValue"#);
    let mut flat_root = FlatRoot::from_dast(&dast_root);
    Expander::expand(&mut flat_root);
    flat_root.compactify();
    let normalized_root = NormalizedRoot::from_flat_root(&flat_root);

    let builder = ComponentBuilder::from_normalized_root(&normalized_root);
    assert!(matches!(&builder.components[2], ComponentEnum::Text(_)));
}

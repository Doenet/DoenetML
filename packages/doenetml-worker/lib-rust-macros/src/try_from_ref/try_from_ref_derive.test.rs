use crate::component_module::utils::pretty_print_result;

use super::*;

#[test]
fn test_can_parse_enum() {
    let input = r#"
        enum Foo {
            Bar(XXX),
            Baz(YYY),
        }
    "#;
    let result = try_from_ref_derive(syn::parse_str(input).unwrap());
    let formatted = pretty_print_result(&result);

    // println!("{}", formatted);
    assert!(formatted.starts_with("impl<'a> TryFrom<&'a Foo> for &'a XXX"))
}

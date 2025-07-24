use crate::component_module::utils::pretty_print_result;

use super::*;

#[test]
fn test_can_parse_enum() {
    let input = r#"
             #[derive(TestDataQueryTypes, TryFromDataQueryResults)]
             #[data_query(query_trait = RequiredDataQueries)]
             #[owning_component(MyComponent)]
             struct RequiredData {
                rendered_children: PropView<component::props::types::RenderedChildren>,
             }
    "#;
    let result = test_data_query_types_derive(syn::parse_str(input).unwrap());
    let formatted = pretty_print_result(&result);

    println!("{formatted}");
}

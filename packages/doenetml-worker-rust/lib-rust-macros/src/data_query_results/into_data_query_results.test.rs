use crate::component_module::utils::pretty_print_result;

use super::*;

#[test]
fn test_can_parse_struct() {
    let input = r#"
        #[data_query(query_trait = MyTrait)]
        struct RequiredData {
            independent_state: PropView<prop_type::Boolean>,
            booleans_and_strings: Vec<PropView<PropValue>>,
        }
    "#;
    let result = generate_into_data_query_results(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print_result(&result));
}

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

#[test]
fn test_can_parse_struct_with_generics() {
    let input = r#"
        #[derive(TryFromDataQueryResults, IntoDataQueryResults)]
        #[data_query(query_trait = DataQueries)]
        struct RequiredData<T>
        where
            T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug,
            PropValue: From<T>,
        {
            independent_state: PropView<T>,
        }
    "#;
    let result = generate_into_data_query_results(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print_result(&result));
}

// TODO: test that pass through generics

use crate::component_module::utils::pretty_print_result;

use super::*;

#[test]
fn test_can_parse_struct() {
    let input = r#"
        #[data_query(query_trait = QueryTrait)]
        struct RequiredData {
            filtered_children: Vec<PropView<Vec<GraphNode>>>,
            title: PropView<ElementRefs>,
        }
    "#;
    let result = generate_from_data_query_results(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print_result(&result));
}

#[test]
fn test_can_parse_struct_with_pass_data() {
    let input = r#"
        #[data_query(query_trait = QueryTrait, pass_data = &std::string::String)]
        struct RequiredData {
            filtered_children: Vec<PropView<Vec<GraphNode>>>,
            title: PropView<ElementRefs>,
        }
    "#;
    let result = generate_from_data_query_results(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print_result(&result));
}

// TODO: test that pass through generics
#[test]
fn test_can_parse_struct_with_generic() {
    let input = r#"
        #[data_query(query_trait = QueryTrait)]
        struct RequiredData<T> where
            T: std::fmt::Debug
        {
            value: PropView<T>,
        }
    "#;
    let result = generate_from_data_query_results(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print_result(&result));
}

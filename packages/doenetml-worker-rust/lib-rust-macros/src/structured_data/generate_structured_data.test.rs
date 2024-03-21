use crate::component_module::utils::pretty_print_result;

use super::*;

#[test]
fn test_can_parse_struct() {
    let input = r#"
        #[structured_data(query_trait = QueryTrait)]
        struct RequiredData {
            filtered_children: Vec<PropView<Vec<GraphNode>>>,
            title: PropView<ElementRefs>,
        }
    "#;
    let result = generate_structured_data(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print_result(&result));
    //dbg!(syn::parse_str::<ItemMod>(input).unwrap());
    // dbg!(result.to_string());
}

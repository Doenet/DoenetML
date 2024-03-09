use crate::component::utils::pretty_print;

use super::*;

#[test]
fn test_can_parse_module() {
    let input = r#"
        #[component(name = Document, ref_transmutes_to = Text)]
        mod component {
            use super::ActionBody;

            enum Props {
                /// Docstring for stuff
                #[prop(value_type = PropValueType::String, is_public, profile = ComponentProfile::String, default)]
                Value,
                
                /// Other docstring
                #[prop(value_type = PropValueType::Boolean, is_public, for_render)]
                ImmediateValue,
            }
            enum Actions {
                /// Do the update and stuff
                UpdateImmediateValue(ActionBody<()>),
                UpdateValue,
            }
            enum Attributes {
                /// Whether the `<textInput>` should be hidden.
                #[attribute(prop = BooleanProp, default = false)]
                Hide,
                /// Whether the `<textInput>` should be editable.
                #[attribute(prop = BooleanProp, default = false)]
                Disabled,
                /// The content that should prefill the `<textInput>`, giving it a default value before a user has interacted with the input.
                #[attribute(prop = StringProp, default = String::new())]
                Prefill,
            }
        }
    "#;
    let result = parse_module(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print(&result));
    //dbg!(syn::parse_str::<ItemMod>(input).unwrap());
    // dbg!(result.to_string());
}

#[test]
fn test_can_parse_empty_module() {
    let input = r#"
        #[component(name = Document, ref_transmutes_to = Text)]
        mod component {}
    "#;
    let result = parse_module(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print(&result));
    //dbg!(syn::parse_str::<ItemMod>(input).unwrap());
    // dbg!(result.to_string());
}

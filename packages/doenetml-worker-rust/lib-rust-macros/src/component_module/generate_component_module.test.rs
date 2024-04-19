use crate::component_module::utils::pretty_print_result;

use super::*;

#[test]
fn test_preserves_name_of_module() {
    let input = r#"
        #[component(name = Document, ref_transmutes_to = Text)]
        mod my_mod {}
    "#;
    let result = generate_component_module(syn::parse_str(input).unwrap());
    let formatted = pretty_print_result(&result);

    // formatted should contain the string `mod my_mod`
    assert!(formatted.contains("mod my_mod"));
}

#[test]
fn test_preserves_pub_decorator_on_module() {
    let input = r#"
        #[component(name = Document, ref_transmutes_to = Text)]
        mod my_mod {}
    "#;
    let result = generate_component_module(syn::parse_str(input).unwrap());
    let formatted = pretty_print_result(&result);
    // formatted should not have a `pub mod`
    assert!(!formatted.contains("pub mod my_mod"));

    let input = r#"
        #[component(name = Document, ref_transmutes_to = Text)]
        pub mod my_mod {}
    "#;
    let result = generate_component_module(syn::parse_str(input).unwrap());
    let formatted = pretty_print_result(&result);
    // formatted should have a `pub mod`
    assert!(formatted.contains("pub mod my_mod"));
}

#[test]
fn test_can_parse_module() {
    let input = r#"
        /// Some Comment
        #[component(name = Document, ref_transmutes_to = Text)]
        mod component {
            use super::ActionBody;

            enum Props {
                /// Docstring for stuff
                #[prop(value_type = PropValueType::String, is_public, profile = PropProfile::String, default)]
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
                #[attribute(prop = crate::BooleanProp, default = false)]
                Hide,
                /// Whether the `<textInput>` should be editable.
                #[attribute(prop = BooleanProp, default = false)]
                Disabled,
                /// The content that should prefill the `<textInput>`, giving it a default value before a user has interacted with the input.
                #[attribute(prop = StringProp, default = String::new())]
                Prefill,
                Foo,
            }
        }
    "#;
    let result = generate_component_module(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print_result(&result));
    //dbg!(syn::parse_str::<ItemMod>(input).unwrap());
    // dbg!(result.to_string());
}

#[test]
fn test_can_parse_empty_module() {
    let input = r#"
        #[component(name = Document, ref_transmutes_to = Text)]
        mod component {}
    "#;
    let result = generate_component_module(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print_result(&result));
    //dbg!(syn::parse_str::<ItemMod>(input).unwrap());
    // dbg!(result.to_string());
}

#[test]
fn test_can_parse_preserve_ref() {
    let input = r#"
        #[component(name = Document, ref_transmutes_to = Text)]
        mod component {
            enum Attributes {
                MyAttr,
                #[attribute(preserve_refs)]
                YourAttr
            }
        }
    "#;
    let result = generate_component_module(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print_result(&result));
    //dbg!(syn::parse_str::<ItemMod>(input).unwrap());
    // dbg!(result.to_string());
}

#[test]
fn test_can_parse_module3() {
    let input = r#"
#[component(name = Text, extend_via_default_prop)]
mod component {
    use crate::general_prop::BooleanProp;

    enum Props {
        /// The value of the `<text>`. This is the content that will be displayed inside
        /// the `<text>` component.
        #[prop(
            value_type = PropValueType::String,
            is_public,
            profile = PropProfile::String,
            default
        )]
        Value,
        #[prop(value_type = PropValueType::Boolean)]
        Hidden,
    }

    enum Attributes {
        /// Whether the `<text>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
    }
}
    "#;
    let result = generate_component_module(syn::parse_str(input).unwrap());
    println!("\n{}\n", pretty_print_result(&result));
    //dbg!(syn::parse_str::<ItemMod>(input).unwrap());
    // dbg!(result.to_string());
}

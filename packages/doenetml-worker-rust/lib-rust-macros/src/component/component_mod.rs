//! Parse the `mod component` module.

use convert_case::{Case, Casing};
use darling::FromAttributes;
use proc_macro2::{Ident, TokenStream};
use quote::quote;

use super::{
    actions::{actions_enum_from_module, ActionsEnum},
    attributes::{attributes_enum_from_module, AttributesEnum},
    props::{props_enum_from_module, PropsEnum},
};

/// This defines the `#[component(name = "...")]` macro
/// that is placed in front of the `component` module.
#[derive(Debug, FromAttributes)]
#[darling(attributes(component))]
pub struct ComponentMacroVariant {
    name: Ident,
    ref_transmutes_to: Option<Ident>,
    #[darling(default)]
    extend_via_default_prop: bool,
}

#[derive(Debug)]
pub struct ComponentModule {
    //
    // The content defined in the `#[component(...)]` macro's arguments
    //
    pub name: String,
    pub ref_transmutes_to: Option<String>,
    pub extend_via_default_prop: bool,
    //
    // The content defined _inside_ the module
    //
    pub actions: Option<ActionsEnum>,
    pub attributes: Option<AttributesEnum>,
    pub props: Option<PropsEnum>,
}

impl ComponentModule {
    pub fn from_module(module: &syn::ItemMod) -> Self {
        //panic!("{}", module.to_token_stream().to_string());
        let component_macro: ComponentMacroVariant =
            ComponentMacroVariant::from_attributes(&module.attrs).unwrap();
        let name = component_macro.name.to_string();

        let props = props_enum_from_module(module);
        let actions = actions_enum_from_module(module);
        let attributes = attributes_enum_from_module(module);

        Self {
            name,
            ref_transmutes_to: component_macro.ref_transmutes_to.map(|x| x.to_string()),
            extend_via_default_prop: component_macro.extend_via_default_prop,
            props,
            actions,
            attributes,
        }
    }

    /// The names of all actions defined on this component
    fn get_action_names(&self) -> Vec<String> {
        self.actions.as_ref().map_or(vec![], |actions| {
            actions
                .variants
                .iter()
                .map(|x| x.ident.to_string().to_case(Case::Snake))
                .collect()
        })
    }

    /// The names of all props defined on this component
    fn get_prop_names(&self) -> Vec<String> {
        self.props.as_ref().map_or(vec![], |props| {
            props
                .variants
                .iter()
                .map(|x| x.ident.to_string().to_case(Case::Camel))
                .collect()
        })
    }

    /// The names of all attributes defined on this component
    fn get_attribute_names(&self) -> Vec<String> {
        self.attributes.as_ref().map_or(vec![], |attributes| {
            attributes
                .variants
                .iter()
                .map(|x| x.ident.to_string().to_case(Case::Camel))
                .collect()
        })
    }

    /// Generate the `struct Component`for this component.
    pub fn struct_component(&self) -> TokenStream {
        quote! { struct Component {} }
    }

    pub fn impl_component(&self) -> TokenStream {
        let component_name = &self.name;
        let name_camel_case = self.name.to_case(Case::Camel);

        let ref_transmutes_to = self
            .ref_transmutes_to
            .as_ref()
            .map(|name| name.to_case(Case::Camel))
            .map_or(quote! {None}, |name| quote! {Some(#name)});

        let extend_via_default_prop = self.extend_via_default_prop;

        let action_names = self.get_action_names();
        let prop_names = self.get_prop_names();
        let attribute_names = self.get_attribute_names();

        let ret = quote! {
            impl Component {
                /// The name of the component. This is used to identify the component in the DoenetML document.
                /// It is in _camelCase_.
                #[allow(unused)]
                const NAME: &'static str = #name_camel_case;

                /// The internal name of the component. This is used in Rust enums, etc. It is in _PascalCase_.
                #[allow(unused)]
                const COMPONENT_NAME: &'static str = #component_name;

                #[allow(unused)]
                const REF_TRANSMUTES_TO: Option<&'static str> = #ref_transmutes_to;

                #[allow(unused)]
                const EXTEND_VIA_DEFAULT_PROP: bool = #extend_via_default_prop;

                #[allow(unused)]
                const ACTION_NAMES: &'static [&'static str] = &[#(#action_names),*];

                #[allow(unused)]
                const PROP_NAMES: &'static [&'static str] = &[#(#prop_names),*];

                #[allow(unused)]
                const ATTRIBUTE_NAMES: &'static [&'static str] = &[#(#attribute_names),*];
            }
        };

        ret.into()
    }

    /// Generate the `impl ComponentNode for ...` trait for the component.
    pub fn impl_component_node_trait(&self) -> TokenStream {
        let ret = quote! {
            impl ComponentNode for Component {
                fn get_component_type(&self) -> &'static str {
                    Component::COMPONENT_NAME
                }

                fn ref_transmutes_to(&self) -> Option<&'static str> {
                    Component::REF_TRANSMUTES_TO
                }

                fn extend_via_default_prop(&self) -> bool {
                    Component::EXTEND_VIA_DEFAULT_PROP
                }
            }
        };

        ret.into()
    }

    /// Implement the `ComponentProps` trait for the component.
    pub fn impl_component_props_trait(&self) -> TokenStream {
        let ret = quote! {
            impl ComponentProps for Component {
                fn generate_props(&self) -> Vec<Prop> {
                    vec![]
                }
                fn get_local_prop_index_from_name(&self, name: &str) -> Option<PropIdx> {
                    Self::PROP_NAMES.iter().position(|prop_name| prop_name == name)
                }
                fn get_public_local_prop_index_from_name_case_insensitive(&self, name: &str) -> Option<PropIdx> {
                    Self::PROP_NAMES.iter().position(|prop_name| prop_name.eq_ignore_ascii_case(name))
                }
                fn get_component_profile_local_prop_indices(&self) -> Vec<PropIdx> {
                    vec![]
                }
                fn get_default_prop_local_index(&self) -> Option<PropIdx> {
                    None
                }
                fn get_for_renderer_local_prop_indices(&self) -> Vec<PropIdx> {
                    vec![]
                }
            }
        };

        ret.into()
    }

    pub fn generate_module(&self) -> TokenStream {
        let struct_component = self.struct_component();
        let impl_component = self.impl_component();
        let impl_component_node_trait = self.impl_component_node_trait();
        let impl_component_props_trait = self.impl_component_props_trait();

        quote! {
            mod generated_component {
                use crate::components::prelude::*;

                #struct_component
                #impl_component
                #impl_component_node_trait
                #impl_component_props_trait
            }
        }
    }
}

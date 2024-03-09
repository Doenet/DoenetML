//! Parse the `mod component` module.

use convert_case::{Case, Casing};
use darling::FromAttributes;
use proc_macro2::{Ident, TokenStream};
use quote::quote;
use syn::Path;

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

    /// The profile of all props defined on this component
    fn get_prop_profiles(&self) -> Vec<Option<Path>> {
        self.props
            .as_ref()
            .map_or(vec![], |props| props.get_prop_profiles())
    }

    /// The `for_render` property of all props defined on this component
    fn get_prop_for_renders(&self) -> Vec<bool> {
        self.props
            .as_ref()
            .map_or(vec![], |props| props.get_prop_for_renders())
    }

    /// The `is_public` property of all props defined on this component
    fn get_prop_is_publics(&self) -> Vec<bool> {
        self.props
            .as_ref()
            .map_or(vec![], |props| props.get_prop_is_publics())
    }

    /// The `is_public` property of all props defined on this component
    fn get_prop_value_types(&self) -> Vec<Path> {
        self.props
            .as_ref()
            .map_or(vec![], |props| props.get_prop_value_types())
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
        // TODO: this Debug should print the name of the component, not `Component`. Implement `Debug` manually.
        quote! {
            #[derive(Debug, Clone, Copy, Default)]
            pub struct Component {}
        }
    }

    fn get_prop_idents(&self) -> Vec<Ident> {
        self.props.as_ref().map_or(vec![], |props| {
            props.variants.iter().map(|x| x.ident.clone()).collect()
        })
    }

    pub fn enum_props(&self) -> TokenStream {
        let prop_idents = self.get_prop_idents();

        quote! {
            #[derive(Debug, Clone, Copy)]
            pub enum Props {
                #(#prop_idents,)*
            }
        }
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
        let attribute_names = self.get_attribute_names();
        let prop_names = self.get_prop_names();
        let prop_profiles = self
            .get_prop_profiles()
            .iter()
            .map(|x| {
                // We want the literal options to be quoted.
                if let Some(profile) = x {
                    quote! {Some(#profile)}
                } else {
                    quote! {None}
                }
            })
            .collect::<Vec<_>>();
        let prop_for_renders = self.get_prop_for_renders();
        let prop_is_publics = self.get_prop_is_publics();
        let prop_value_types = self.get_prop_value_types();
        let default_prop = match self
            .props
            .as_ref()
            .map_or(None, |props| props.get_default_prop_local_index())
        {
            Some(idx) => quote! {Some(#idx)},
            None => quote! {None},
        };
        let props: Vec<TokenStream> = self
            .get_prop_idents()
            .iter()
            .map(|x| quote! {Props::#x})
            .collect();

        let ret = quote! {
            impl Component {
                /// The name of the component. This is used to identify the component in the DoenetML document.
                /// It is in _camelCase_.
                const NAME: &'static str = #name_camel_case;

                /// The internal name of the component. This is used in Rust enums, etc. It is in _PascalCase_.
                const COMPONENT_NAME: &'static str = #component_name;

                const REF_TRANSMUTES_TO: Option<&'static str> = #ref_transmutes_to;

                const ATTRIBUTE_NAMES: &'static [&'static str] = &[#(#attribute_names),*];

                const ACTION_NAMES: &'static [&'static str] = &[#(#action_names),*];

                //
                // Prop information
                //

                const EXTEND_VIA_DEFAULT_PROP: bool = #extend_via_default_prop;

                const PROPS: &'static [Props] = &[#(#props),*];

                const PROP_NAMES: &'static [&'static str] = &[#(#prop_names),*];

                const PROP_PROFILES: &'static [Option<ComponentProfile>] = &[#(#prop_profiles),*];

                const PROP_FOR_RENDERS: &'static [bool] = &[#(#prop_for_renders),*];

                const PROP_IS_PUBLICS: &'static [bool] = &[#(#prop_is_publics),*];

                const PROP_VALUE_TYPES: &'static [PropValueType] = &[#(#prop_value_types),*];

                const DEFAULT_PROP: Option<PropIdx> = #default_prop;
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
    pub fn impl_component_variant_props_trait(&self) -> TokenStream {
        let ret = quote! {
            impl ComponentVariantProps for Component {
                fn get_prop_updater(&self, local_prop_idx: PropIdx) -> Box<dyn PropUpdater> {
                    PropGetUpdater::get_updater(&Component::PROPS[local_prop_idx])
                }
                fn get_num_props(&self) -> usize {
                    Component::PROP_NAMES.len()
                }
                fn get_prop_is_for_render(&self, local_prop_idx: PropIdx) -> bool {
                    Component::PROP_FOR_RENDERS[local_prop_idx]
                }
                fn get_prop_name(&self, local_prop_idx: PropIdx) -> &'static str {
                    Component::PROP_NAMES[local_prop_idx]
                }
                fn get_prop_names(&self) -> &'static [&'static str] {
                    &Component::PROP_NAMES
                }
                fn get_prop_profile(&self, local_prop_idx: PropIdx) -> Option<ComponentProfile> {
                    Component::PROP_PROFILES[local_prop_idx]
                }
                fn get_prop_is_public(&self, local_prop_idx: PropIdx) -> bool {
                    Component::PROP_IS_PUBLICS[local_prop_idx]
                }
                fn get_prop_value_type(&self, local_prop_idx: PropIdx) -> PropValueType {
                    Component::PROP_VALUE_TYPES[local_prop_idx].clone()
                }
                fn get_default_prop_local_index(&self) -> Option<PropIdx> {
                    Component::DEFAULT_PROP
                }
            }
        };

        ret.into()
    }

    pub fn generate_module(&self) -> TokenStream {
        let enum_props = self.enum_props();
        let struct_component = self.struct_component();
        let impl_component = self.impl_component();
        let impl_component_node_trait = self.impl_component_node_trait();
        let impl_component_props_trait = self.impl_component_variant_props_trait();

        quote! {
            // TODO: whether or not component is pub should depend one what was entered.
            // Also, presumably the name should the original name and not be hard-coded as `component`
            pub mod component {
                use crate::components::prelude::*;

                #struct_component
                #impl_component
                #impl_component_node_trait
                #impl_component_props_trait

                #enum_props
            }
        }
    }
}

//! Parse the `mod component` module.

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

    /// Re-export the named structs with generic names `Component`, `Actions`, `Attributes`, and `Props`.
    pub fn get_type_aliases(&self) -> TokenStream {
        let (component_name, actions_name, attributes_name, props_name) =
            self.get_component_idents();

        quote! {
            pub type Component = #component_name;
            pub type Actions = #actions_name;
            pub type Attributes = #attributes_name;
            pub type Props = #props_name;
        }
    }

    pub fn generate_module(&self) -> TokenStream {
        let component = self.generate_component_and_impls();
        let actions = self.generate_actions_and_impls();
        let attributes = self.generate_attributes_and_impls();
        let props = self.generate_props_and_impls();

        let type_aliases = self.get_type_aliases();

        quote! {
            // TODO: whether or not component is pub should depend one what was entered.
            // Also, presumably the name should the original name and not be hard-coded as `component`
            pub mod component {
                use crate::components::prelude::*;

                #component
                #actions
                #attributes
                #props

                #type_aliases
            }
        }
    }
}

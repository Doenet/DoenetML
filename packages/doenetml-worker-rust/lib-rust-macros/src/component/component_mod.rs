//! Parse the `mod component` module.

use darling::{FromAttributes, FromMeta};
use proc_macro2::{Ident, TokenStream};
use quote::quote;
use strum::VariantNames;
use strum_macros::EnumVariantNames;
use syn::Lit;

use super::{
    actions::{actions_enum_from_module, ActionsEnum},
    attributes::{attributes_enum_from_module, AttributesEnum},
    props::{props_enum_from_module, PropsEnum},
};

#[derive(Debug, Default, EnumVariantNames)]
pub enum RenderedChildren {
    Passthrough,
    None,
    #[default]
    Handle,
}
impl FromMeta for RenderedChildren {
    fn from_value(value: &Lit) -> darling::Result<Self> {
        match value {
            Lit::Str(lit_str) => match lit_str.value().to_ascii_lowercase().as_str() {
                "passthrough" => Ok(Self::Passthrough),
                "none" => Ok(Self::None),
                "handle" => Ok(Self::Handle),
                _ => {
                    let variants = RenderedChildren::VARIANTS
                        .iter()
                        .map(|x| format!("`{}`", x.to_string().to_ascii_lowercase()))
                        .collect::<Vec<String>>()
                        .join(", ");
                    Err(darling::Error::custom(format!(
                        "Invalid value for children. Must be one of: {}.",
                        variants
                    )))
                }
            },
            _ => Err(darling::Error::custom(
                "Invalid value for children. Must be a string.",
            )),
        }
    }
}

/// This defines the `#[component(name = "...")]` macro
/// that is placed in front of the `component` module.
#[derive(Debug, FromAttributes)]
#[darling(attributes(component))]
pub struct ComponentMacroVariant {
    name: Ident,
    ref_transmutes_to: Option<Ident>,
    #[darling(default)]
    extend_via_default_prop: bool,
    #[darling(default)]
    rendered_children: RenderedChildren,
}

#[derive(Debug)]
pub struct ComponentModule {
    //
    // The content defined in the `#[component(...)]` macro's arguments
    //
    pub name: String,
    pub ref_transmutes_to: Option<String>,
    pub extend_via_default_prop: bool,
    pub children: RenderedChildren,
    //
    // The content defined _inside_ the module
    //
    pub actions: Option<ActionsEnum>,
    pub attributes: Option<AttributesEnum>,
    pub props: Option<PropsEnum>,
}

impl ComponentModule {
    pub fn from_module(module: &syn::ItemMod) -> syn::Result<Self> {
        //panic!("{}", module.to_token_stream().to_string());
        let component_macro: ComponentMacroVariant =
            ComponentMacroVariant::from_attributes(&module.attrs)?;
        let name = component_macro.name.to_string();
        let children = component_macro.rendered_children;

        let props = props_enum_from_module(module)?;
        let actions = actions_enum_from_module(module);
        let attributes = attributes_enum_from_module(module);

        Ok(Self {
            name,
            ref_transmutes_to: component_macro.ref_transmutes_to.map(|x| x.to_string()),
            extend_via_default_prop: component_macro.extend_via_default_prop,
            children,
            props,
            actions,
            attributes,
        })
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

    pub fn generate_module(&self) -> syn::Result<TokenStream> {
        let component = self.generate_component_and_impls();
        let actions = self.generate_actions_and_impls();
        let attributes = self.generate_attributes_and_impls();
        let props = self.generate_props_and_impls();

        let type_aliases = self.get_type_aliases();
        Ok(quote! {
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
        })
    }
}

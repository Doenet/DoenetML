//! Parse the `enum Actions {...}` in a component module.

use convert_case::{Case, Casing};
use darling::{ast, FromDeriveInput, FromVariant};
use proc_macro2::{Ident, TokenStream};
use quote::quote;

use crate::component_module::utils::{doc_comment_from_attrs, extract_enum_in_module, EnumInBody};

use super::component_module::ComponentModule;

/// Store all the variants for the actions enum.
#[derive(Debug)]
pub struct ActionsEnum {
    pub variants: Option<Vec<ActionsVariant>>,
}

impl ActionsEnum {
    /// Extracts the `enum Actions {...}` from the module and parses it into a `ActionsEnum`.
    pub fn extract_from_module(module: &mut syn::ItemMod) -> syn::Result<Self> {
        let enums = extract_enum_in_module(module, "Actions");
        if enums.is_none() {
            return Ok(Self { variants: None });
        }
        let enums = enums.unwrap();
        let enum_instance = EnumInBody::from_derive_input(&enums.clone().into())?;
        let variants = enum_instance.data.clone().take_enum().unwrap();
        let variants = variants
            .iter()
            .map(ActionsVariant::from_variant)
            .collect::<Result<Vec<_>, _>>()?
            .into_iter()
            .map(|mut variant| {
                // Extract the doc comments.
                variant.doc = doc_comment_from_attrs(&variant.attrs);
                // Now that we have the doc comments, we don't need to keep the attrs around anymore.
                variant.attrs.clear();

                variant
            })
            .collect::<Vec<_>>();

        Ok(ActionsEnum {
            variants: Some(variants),
        })
    }

    /// Whether `enum Actions {...}` was present in the module.
    #[allow(unused)]
    pub fn is_present(&self) -> bool {
        self.variants.is_some()
    }

    pub fn get_variants(&self) -> &[ActionsVariant] {
        self.variants.as_ref().map_or(&[], |v| &v)
    }

    pub fn get_action_idents(&self) -> Vec<Ident> {
        self.get_variants()
            .iter()
            .map(|x| x.ident.clone())
            .collect()
    }

    pub fn get_action_names(&self) -> Vec<String> {
        self.get_action_idents()
            .iter()
            .map(|x| x.to_string().to_case(Case::Snake))
            .collect()
    }
}

/// A variant on the `enum Actions {...}` enum.
#[derive(Debug, FromVariant)]
#[darling(forward_attrs)]
pub struct ActionsVariant {
    /// The name of the attribute (before it is turned into camelCase)
    pub ident: Ident,
    pub fields: ast::Fields<syn::Field>,
    pub attrs: Vec<syn::Attribute>,
    #[darling(default)]
    pub doc: Option<String>,
}

//
// Functions to generate trait impls related to Actions.
//

impl ComponentModule {
    /// Generate the `enum Props` and all the associated impls for required traits.
    pub fn generate_actions_and_impls(&self) -> TokenStream {
        let enum_actions = self.enum_actions();

        quote! {
            #enum_actions
        }
    }

    /// Generate the `enum Props` for this component.
    pub fn enum_actions(&self) -> TokenStream {
        let (_, actions_name, _, _) = self.get_component_idents();
        let action_idents = self.actions.get_action_idents();

        quote! {
            #[derive(Debug, Clone, Copy)]
            pub enum #actions_name {
                #(#action_idents,)*
            }
        }
    }
}

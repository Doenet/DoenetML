//! Parse the `enum Actions {...}` in a component module.

use convert_case::{Case, Casing};
use darling::{FromDeriveInput, FromVariant, ast};
use proc_macro2::{Ident, TokenStream};
use quote::quote;
use syn::{Variant, parse_quote};

use crate::component_module::utils::{EnumInBody, doc_comment_from_attrs, extract_enum_in_module};

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
        self.variants.as_ref().map_or(&[], |v| v)
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

    pub fn generate_enum_doc_comment(&self) -> String {
        if self.get_variants().is_empty() {
            return "No actions are available for this component.".to_string();
        }
        let action_names = self
            .get_action_names()
            .iter()
            .map(|x| format!("`{x}`"))
            .collect::<Vec<_>>();

        format!(
            "The actions that can be dispatched to this component are: {}",
            action_names.join(", ")
        )
    }

    fn generate_variant_doc_comment(&self, variant_idx: usize) -> String {
        let variant = &self.get_variants()[variant_idx];
        let existing_doc = variant.doc.clone().unwrap_or_default();
        let name = &self.get_action_names()[variant_idx];

        format!("{existing_doc}\n- Name: \"{name}\"")
    }

    pub fn generate_idents_with_doc_comments(&self) -> Vec<Variant> {
        self.get_variants()
            .iter()
            .enumerate()
            .map(|(i, variant)| {
                let doc_comment = self.generate_variant_doc_comment(i);
                let ident = &variant.ident;
                let fields = &variant.fields;

                parse_quote! (
                    #[doc = #doc_comment]
                    #ident #fields
                )
            })
            .collect()
    }
}

/// A variant on the `enum Actions {...}` enum.
#[derive(Debug, FromVariant)]
#[darling(forward_attrs)]
pub struct ActionsVariant {
    /// The name of the attribute (before it is turned into camelCase)
    ident: Ident,
    fields: ast::Fields<syn::Field>,
    attrs: Vec<syn::Attribute>,
    #[darling(default)]
    doc: Option<String>,
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
        let action_idents_with_doc_comments = self.actions.generate_idents_with_doc_comments();
        let doc_string = self.actions.generate_enum_doc_comment();

        quote! {
            #[doc = #doc_string]
            #[derive(Debug)]
            #[derive(serde::Serialize, serde::Deserialize)]
            #[serde(tag = "actionName", rename_all = "camelCase")]
            #[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
            #[cfg_attr(feature = "web", tsify(from_wasm_abi))]
            pub enum #actions_name {
                #(#action_idents_with_doc_comments,)*
            }
        }
    }
}

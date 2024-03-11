//! Parse the `enum Actions {...}` in a component module.

//use convert_case::Casing;
use darling::{ast, FromDeriveInput, FromVariant};
use proc_macro2::Ident;

use super::utils::{doc_comment_from_attrs, extract_enum_in_module, EnumInBody};

#[derive(Debug)]
pub struct ActionsEnum {
    pub variants: Vec<ActionsVariant>,
}

impl ActionsEnum {
    //    pub fn action_names_snake(&self) -> Vec<String> {
    //        self.variants
    //            .iter()
    //            .map(|x| x.ident.to_string().to_case(convert_case::Case::Snake))
    //            .collect()
    //    }
    //    pub fn action_names_camel(&self) -> Vec<String> {
    //        self.variants
    //            .iter()
    //            .map(|x| x.ident.to_string().to_case(convert_case::Case::Camel))
    //            .collect()
    //    }
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

/// Extracts the `enum Actions {...}` from the module and parses it into a `ActionsEnum`.
pub fn actions_enum_from_module(module: &mut syn::ItemMod) -> syn::Result<Option<ActionsEnum>> {
    let enums = extract_enum_in_module(module, "Actions");
    if enums.is_none() {
        return Ok(None);
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

    Ok(Some(ActionsEnum { variants }))
}

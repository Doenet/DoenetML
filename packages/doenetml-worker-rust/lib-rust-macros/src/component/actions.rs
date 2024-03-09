//! Parse the `enum Actions {...}` in a component module.

//use convert_case::Casing;
use darling::{ast, FromDeriveInput, FromVariant};
use proc_macro2::Ident;

use super::utils::{doc_comment_from_attrs, find_enums_in_module, EnumInBody};

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
pub fn actions_enum_from_module(module: &syn::ItemMod) -> Option<ActionsEnum> {
    let enums = find_enums_in_module(module);
    let enums = enums
        .iter()
        .map(|enum_instance| EnumInBody::from_derive_input(&enum_instance.clone().into()).unwrap())
        .collect::<Vec<_>>();

    let actions_enum = enums
        .iter()
        .find(|enum_instance| enum_instance.ident == "Actions")
        .map(|enum_instance| {
            let variants = enum_instance.data.clone().take_enum().unwrap();
            variants
                .iter()
                .map(ActionsVariant::from_variant)
                .map(Result::unwrap)
                // .inspect(|x| {
                //     println!("{:?}", x.fields.to_token_stream().to_string());
                // })
                .map(|mut variant| {
                    // Extract the doc comments.
                    variant.doc = doc_comment_from_attrs(&variant.attrs);
                    // Now that we have the doc comments, we don't need to keep the attrs around anymore.
                    variant.attrs.clear();

                    variant
                })
                .collect::<Vec<_>>()
        });

    actions_enum.map(|variants| ActionsEnum { variants })
}

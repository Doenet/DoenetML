//! Parse the `enum Attributes {...}` in a component module.

//use convert_case::Casing;
use darling::{FromDeriveInput, FromVariant};
use proc_macro2::Ident;

use super::utils::{doc_comment_from_attrs, find_enums_in_module, EnumInBody};

#[derive(Debug)]
pub struct AttributesEnum {
    pub variants: Vec<AttributesVariant>,
}

impl AttributesEnum {
    //    pub fn prop_names_snake(&self) -> Vec<String> {
    //        self.variants
    //            .iter()
    //            .map(|x| x.ident.to_string().to_case(convert_case::Case::Snake))
    //            .collect()
    //    }
    //    pub fn prop_names_camel(&self) -> Vec<String> {
    //        self.variants
    //            .iter()
    //            .map(|x| x.ident.to_string().to_case(convert_case::Case::Camel))
    //            .collect()
    //    }
}

/// A variant on the `enum Attributes {...}` enum.
/// This struct will parse what is inside the `#[attribute(...)]` annotations on each
/// enum variant.
#[derive(Debug, FromVariant)]
#[darling(attributes(attribute), forward_attrs)]
pub struct AttributesVariant {
    /// The name of the attribute (before it is turned into camelCase)
    pub ident: Ident,
    /// The prop that should be used to create the data query for this attribute
    pub prop: Option<Ident>,
    /// The default value for the attribute
    pub default: Option<syn::Expr>,
    /// The explicit type for the attribute. This can be auto-computed if using one of the standard
    /// prop types.
    pub explicit_type: Option<Ident>,
    pub attrs: Vec<syn::Attribute>,
    #[darling(default)]
    pub doc: Option<String>,
}

pub fn attributes_enum_from_module(module: &syn::ItemMod) -> Option<AttributesEnum> {
    let enums = find_enums_in_module(module);
    let enums = enums
        .iter()
        .map(|enum_instance| EnumInBody::from_derive_input(&enum_instance.clone().into()).unwrap())
        .collect::<Vec<_>>();

    let attributes_enum = enums
        .iter()
        .find(|enum_instance| enum_instance.ident.to_string() == "Attributes")
        .map(|enum_instance| {
            let variants = enum_instance.data.clone().take_enum().unwrap();
            variants
                .iter()
                .map(AttributesVariant::from_variant)
                .map(Result::unwrap)
                .map(|mut variant| {
                    // Extract the doc comments.
                    variant.doc = doc_comment_from_attrs(&variant.attrs);
                    // Now that we have the doc comments, we don't need to keep the attrs around anymore.
                    variant.attrs.clear();

                    variant
                })
                .collect::<Vec<_>>()
        });

    attributes_enum.map(|variants| AttributesEnum { variants })
}

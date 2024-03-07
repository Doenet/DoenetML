//! Parse the `enum Props {...}` in a component module.

//use convert_case::Casing;
use darling::{FromDeriveInput, FromVariant};
use proc_macro2::Ident;

use super::utils::{doc_comment_from_attrs, find_enums_in_module, EnumInBody};

/// A variant on the `enum Props {...}` enum.
/// This struct will parse what is inside the `#[prop(...)]` annotations on each
/// enum variant.
#[derive(Debug, FromVariant)]
#[darling(attributes(prop), forward_attrs)]
pub struct PropsVariant {
    /// The name of the prop (before it is turned into camelCase)
    pub ident: Ident,
    /// The type of `PropValue` that this prop should have.
    pub value_type: Ident,
    #[darling(default)]
    pub is_public: bool,
    #[darling(default)]
    pub component_profile_prop: bool,
    #[darling(default)]
    pub default: bool,

    pub attrs: Vec<syn::Attribute>,
    #[darling(default)]
    pub doc: Option<String>,
}

/// The `enum Props {...}` in a component module.
#[derive(Debug)]
pub struct PropsEnum {
    pub variants: Vec<PropsVariant>,
}

impl PropsEnum {
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

/// Extract the `enum Props {...}` from the module.
pub fn props_enum_from_module(module: &syn::ItemMod) -> Option<PropsEnum> {
    let enums = find_enums_in_module(module);
    let enums = enums
        .iter()
        .map(|enum_instance| EnumInBody::from_derive_input(&enum_instance.clone().into()).unwrap())
        .collect::<Vec<_>>();

    let props_enum = enums
        .iter()
        .find(|enum_instance| enum_instance.ident.to_string() == "Props")
        .map(|enum_instance| {
            let variants = enum_instance.data.clone().take_enum().unwrap();
            variants
                .iter()
                .map(PropsVariant::from_variant)
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

    props_enum.map(|variants| PropsEnum { variants })
}

//! Parse the `enum Props {...}` in a component module.

//use convert_case::Casing;
use darling::{FromDeriveInput, FromVariant};
use proc_macro2::Ident;
use syn::Path;

use super::utils::{doc_comment_from_attrs, extract_enum_in_module, EnumInBody};

/// A variant on the `enum Props {...}` enum.
/// This struct will parse what is inside the `#[prop(...)]` annotations on each
/// enum variant.
#[derive(Debug, FromVariant)]
#[darling(attributes(prop), forward_attrs)]
pub struct PropsVariant {
    /// The name of the prop (before it is turned into camelCase)
    pub ident: Ident,
    /// The type of `PropValue` that this prop should have.
    pub value_type: Path,
    #[darling(default)]
    pub is_public: bool,
    #[darling(default)]
    pub profile: Option<Path>,
    #[darling(default)]
    pub default: bool,
    #[darling(default)]
    pub for_render: bool,

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
    /// The profile of all props defined on this component
    pub fn get_prop_profiles(&self) -> Vec<Option<Path>> {
        self.variants.iter().map(|x| x.profile.clone()).collect()
    }

    /// The `for_render` property of all props defined on this component
    pub fn get_prop_for_renders(&self) -> Vec<bool> {
        self.variants.iter().map(|x| x.for_render).collect()
    }

    /// The `is_public` property of all props defined on this component
    pub fn get_prop_is_publics(&self) -> Vec<bool> {
        self.variants.iter().map(|x| x.is_public).collect()
    }

    /// The `is_public` property of all props defined on this component
    pub fn get_prop_value_types(&self) -> Vec<Path> {
        self.variants.iter().map(|x| x.value_type.clone()).collect()
    }

    /// Get the index of the prop that has `default = true` set.
    pub fn get_default_prop_local_index(&self) -> Option<usize> {
        self.variants.iter().position(|x| x.default)
    }
}

/// Extract the `enum Props {...}` from the module.
pub fn props_enum_from_module(module: &mut syn::ItemMod) -> syn::Result<Option<PropsEnum>> {
    let enums = extract_enum_in_module(module, "Props");
    if enums.is_none() {
        return Ok(None);
    }
    let enums = enums.unwrap();
    let enums_instance = EnumInBody::from_derive_input(&enums.clone().into())?;
    let variants = enums_instance.data.clone().take_enum().unwrap();
    let variants = variants
        .iter()
        .map(PropsVariant::from_variant)
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

    Ok(Some(PropsEnum { variants }))
}

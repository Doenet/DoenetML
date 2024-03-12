//! Parse the `enum Props {...}` in a component module.

use convert_case::{Case, Casing};
use darling::{FromDeriveInput, FromVariant};
use proc_macro2::{Ident, TokenStream};
use quote::quote;
use syn::{parse_quote, Path, Variant};

use crate::component_module::utils::{doc_comment_from_attrs, extract_enum_in_module, EnumInBody};

use super::component_module::ComponentModule;

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
    pub variants: Option<Vec<PropsVariant>>,
}

impl PropsEnum {
    /// Extract the `enum Props {...}` from the module.
    pub fn extract_from_module(module: &mut syn::ItemMod) -> syn::Result<PropsEnum> {
        let enums = extract_enum_in_module(module, "Props");
        if enums.is_none() {
            return Ok(PropsEnum { variants: None });
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

        Ok(PropsEnum {
            variants: Some(variants),
        })
    }
    /// Whether `enum Props {...}` was present in the module.
    #[allow(unused)]
    pub fn is_present(&self) -> bool {
        self.variants.is_some()
    }

    /// The profile of all props defined on this component
    pub fn get_variants(&self) -> &[PropsVariant] {
        self.variants.as_ref().map_or(&[], |v| v)
    }

    pub fn get_prop_idents(&self) -> Vec<Ident> {
        self.get_variants()
            .iter()
            .map(|x| x.ident.clone())
            .collect()
    }

    /// The names of all props defined on this component (in camelCase)
    pub fn get_prop_names(&self) -> Vec<String> {
        self.get_prop_idents()
            .iter()
            .map(|x| x.to_string().to_case(Case::Camel))
            .collect()
    }

    /// The profile of all props defined on this component
    pub fn get_prop_profiles(&self) -> Vec<Option<Path>> {
        self.get_variants()
            .iter()
            .map(|x| x.profile.clone())
            .collect()
    }

    /// The `for_render` property of all props defined on this component
    pub fn get_prop_for_renders(&self) -> Vec<bool> {
        self.get_variants().iter().map(|x| x.for_render).collect()
    }

    /// The `is_public` property of all props defined on this component
    pub fn get_prop_is_publics(&self) -> Vec<bool> {
        self.get_variants().iter().map(|x| x.is_public).collect()
    }

    /// The `is_public` property of all props defined on this component
    pub fn get_prop_value_types(&self) -> Vec<Path> {
        self.get_variants()
            .iter()
            .map(|x| x.value_type.clone())
            .collect()
    }

    /// Get the index of the prop that has `default = true` set.
    pub fn get_default_prop_local_index(&self) -> Option<usize> {
        self.get_variants().iter().position(|x| x.default)
    }

    pub fn generate_enum_doc_comment(&self) -> String {
        if self.get_variants().is_empty() {
            return "No props are available for this component.".to_string();
        }
        let action_names = self
            .get_prop_names()
            .iter()
            .map(|x| format!("`{}`", x))
            .collect::<Vec<_>>();

        format!(
            "The props for this component are: {}",
            action_names.join(", ")
        )
    }

    fn generate_variant_doc_comment(&self, variant_idx: usize) -> String {
        let variant = &self.get_variants()[variant_idx];
        let existing_doc = variant.doc.clone().unwrap_or_default();
        let name = &self.get_prop_names()[variant_idx];
        let mut descriptions = vec![format!("- Name: \"{}\"", name)];
        match variant.is_public {
            true => descriptions
                .push("- Public: this prop can be accessed from a DoenetML document.".to_string()),
            false => {
                descriptions.push("- Private: this prop can only be used internally.".to_string())
            }
        }
        match variant.for_render {
            true => descriptions.push(
                "- ForRender: this prop is always rendered and available to the UI.".to_string(),
            ),
            false => descriptions.push("- NotForRender: this prop is not rendered.".to_string()),
        }
        match &variant.profile {
            Some(profile) => descriptions.push(format!("- Profile: `{}`", quote! {#profile})),
            None => descriptions.push("- No profile set for this prop".to_string()),
        }
        match variant.default {
            true => descriptions.push(
                "- Default: this prop is the _unique_ default prop for this component.".to_string(),
            ),
            false => {}
        }
        // Add a description of variant.value_type
        let value_type = &variant.value_type;
        descriptions.push(format!("- Type: `{}`", quote! {#value_type}));

        format!("{}\n{}", existing_doc, descriptions.join("\n"))
    }

    pub fn generate_idents_with_doc_comments(&self) -> Vec<Variant> {
        self.get_variants()
            .iter()
            .enumerate()
            .map(|(i, variant)| {
                let doc_comment = self.generate_variant_doc_comment(i);
                let ident = &variant.ident;
                parse_quote! (
                    #[doc = #doc_comment]
                    #ident
                )
            })
            .collect()
    }
}

//
// Trait impls related to Props.
//

impl ComponentModule {
    /// Generate the `enum Props` and all the associated impls for required traits.
    pub fn generate_props_and_impls(&self) -> TokenStream {
        let enum_props = self.enum_props();

        quote! {
            #enum_props
        }
    }

    /// Generate the `enum Props` for this component.
    pub fn enum_props(&self) -> TokenStream {
        let (_, _, _, props_name) = self.get_component_idents();
        let prop_idents_with_doc_comments = self.props.generate_idents_with_doc_comments();
        let doc_string = self.props.generate_enum_doc_comment();

        quote! {
            #[doc = #doc_string]
            #[derive(Debug, Clone, Copy)]
            pub enum #props_name {
                #(#prop_idents_with_doc_comments,)*
            }
        }
    }
}

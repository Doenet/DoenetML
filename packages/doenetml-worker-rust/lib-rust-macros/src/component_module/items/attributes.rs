//! Parse the `enum Attributes {...}` in a component module.

use std::vec;

use convert_case::{Case, Casing};
use darling::{FromDeriveInput, FromVariant};
use proc_macro2::{Ident, TokenStream};
use quote::quote;
use syn::{Path, Variant, parse_quote};

use crate::component_module::utils::{EnumInBody, doc_comment_from_attrs, extract_enum_in_module};

use super::component_module::ComponentModule;

/// Store all the variants for the attributes enum.
#[derive(Debug)]
pub struct AttributesEnum {
    pub variants: Option<Vec<AttributesVariant>>,
}

impl AttributesEnum {
    /// Extracts the `enum Attributes {...}` from the module and parses it into a `AttributesEnum`.
    pub fn extract_from_module(module: &mut syn::ItemMod) -> syn::Result<Self> {
        let enums = extract_enum_in_module(module, "Attributes");
        if enums.is_none() {
            return Ok(Self { variants: None });
        }
        let enums = enums.unwrap();
        let enum_instance = EnumInBody::from_derive_input(&enums.clone().into())?;
        let variants = enum_instance.data.clone().take_enum().unwrap();
        let variants = variants
            .iter()
            .map(AttributesVariant::from_variant)
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

        Ok(AttributesEnum {
            variants: Some(variants),
        })
    }
    /// Whether `enum Attributes {...}` was present in the module.
    pub fn is_present(&self) -> bool {
        self.variants.is_some()
    }
    pub fn get_variants(&self) -> &[AttributesVariant] {
        self.variants.as_ref().map_or(&[], |v| v)
    }
    pub fn get_attribute_idents(&self) -> Vec<Ident> {
        self.variants.as_ref().map_or(vec![], |variants| {
            variants.iter().map(|x| x.ident.clone()).collect()
        })
    }
    /// Attribute names in `camelCase`
    pub fn get_attribute_names(&self) -> Vec<String> {
        self.get_attribute_idents()
            .iter()
            .map(|x| x.to_string().to_case(Case::Camel))
            .collect()
    }

    /// Generate the doc comment for `enum Attributes {...}`.
    pub fn generate_enum_doc_comment(&self) -> String {
        if self.get_variants().is_empty() {
            return "No attributes available on this component.".to_string();
        }
        let attribute_names = self
            .get_attribute_names()
            .iter()
            .map(|x| format!("`{x}`"))
            .collect::<Vec<_>>();
        let attribute_names = attribute_names.join(", ");
        format!("The attributes available on this component are: {attribute_names}")
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

    /// Get a list of indices of attributes annotated with `preserve_refs = true`
    pub fn get_preserve_ref_attribute_indices(&self) -> Vec<usize> {
        self.get_variants()
            .iter()
            .enumerate()
            .filter_map(
                |(i, variant)| {
                    if variant.preserve_refs { Some(i) } else { None }
                },
            )
            .collect()
    }

    fn generate_variant_doc_comment(&self, variant_idx: usize) -> String {
        let variant = &self.get_variants()[variant_idx];
        let existing_doc = variant.doc.clone().unwrap_or_default();
        let default = match variant.default.as_ref() {
            Some(default) => format!("- Default value: `{}`", quote! {#default}),
            None => "- No default value".to_string(),
        };
        let name = &self.get_attribute_names()[variant_idx];

        format!("{existing_doc}\n- Name: \"{name}\"\n{default}")
    }

    /// Generate the `pub mod attrs { ... }` module.
    fn generate_attrs_module(&self) -> TokenStream {
        // For each attribute `Foo` we will create
        // ```
        // pub struct Foo;
        // impl Foo {
        //    pub fn get_prop_updater() -> PropUpdaterType {}
        // }
        // ```
        // We make the impl block only if a `prop` is specified.

        let attributes_name = self.get_attribute_names();

        let attr_structs = self.get_variants().iter().enumerate().map(|(i, variant)| {
            let ident = &variant.ident;
            let general_prop = &variant.prop;
            let default = &variant.default;
            let attribute_name = &attributes_name[i];
            let prop_updater_impl = match (general_prop, default) {
                (None, _) | (_, None) => {
                    quote! {}
                }
                (Some(prop), Some(default)) => {
                    let doc_comment = format!(
                        "Get the prop updater for the `{attribute_name}` attribute."
                    );

                    quote! {
                        #[doc = #doc_comment]
                        pub fn get_prop_updater() -> #prop {
                            #prop::new_from_attribute(#attribute_name, #default)
                        }
                    }
                }
            };

            let doc_comment = format!("Empty struct created as a placeholder for data associated with the `{attribute_name}` attribute.");

            quote! {
                #[doc = #doc_comment]
                pub struct #ident;
                impl #ident {
                    #prop_updater_impl
                }
            }
        });
        quote! {
            pub mod attrs {
                //! # Attributes
                //! This module contains type information and helper functions for implementing attributes.
                use super::*;

                #(#attr_structs)*
            }
        }
    }
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
    pub prop: Option<syn::Path>,
    /// The default value for the attribute
    pub default: Option<syn::Expr>,
    /// The explicit type for the attribute. This can be auto-computed if using one of the standard
    /// prop types.
    #[allow(unused)]
    pub explicit_type: Option<Path>,
    /// Whether or not to preserve/expand references that are children in this attribute.
    #[darling(default)]
    pub preserve_refs: bool,
    pub attrs: Vec<syn::Attribute>,
    #[darling(default)]
    pub doc: Option<String>,
}

//
// Functions to generate trait impls related to Attributes.
//

impl ComponentModule {
    /// Generate the `enum Attributes` and all the associated impls for required traits.
    pub fn generate_attributes_and_impls(&self) -> TokenStream {
        let enum_attributes = self.enum_attributes();
        let impl_prop_from_attribute_variant_trait = self.impl_prop_from_attribute_variant_trait();
        let attrs_module = self.attributes.generate_attrs_module();

        quote! {
            #enum_attributes
            #impl_prop_from_attribute_variant_trait
            #attrs_module
        }
    }

    /// Generate the `enum Attributes` for this component.
    pub fn enum_attributes(&self) -> TokenStream {
        let (_, _, attributes_name, _) = self.get_component_idents();
        let doc_string = self.attributes.generate_enum_doc_comment();
        let idents_with_doc_comments = self.attributes.generate_idents_with_doc_comments();

        quote! {
            #[derive(Debug, Clone, Copy)]
            #[doc = #doc_string]
            pub enum #attributes_name {
                #(#idents_with_doc_comments,)*
            }
        }
    }

    /// Generate the impls for the `PropFromAttributeVariant` trait.
    /// The implementation should look like
    /// ```ignore
    /// impl PropFromAttributeVariant for Attributes {
    ///   fn prop(&self) -> UpdaterObject {
    ///     match self {
    ///       Attributes::Foo => Rc::new(FooProp::new_from_attribute("foo", default_value)),
    ///       Attributes::Bar => Rc::new(BarProp::new_from_attribute("bar", default_value)),
    ///     }
    ///   }
    /// }
    /// ```
    /// This function assumes the `PropFromAttribute` trait is implemented for each `#[attribute(prop = ...)]`
    /// item.
    fn impl_prop_from_attribute_variant_trait(&self) -> TokenStream {
        if !self.attributes.is_present() {
            return quote! {};
        }
        let updater_object_match_arms = self.attributes.get_variants()
            .iter()
            .map(|variant| {
                let variant_ident = &variant.ident;
                let general_prop = &variant.prop;
                let default = &variant.default;
                match (general_prop, default) {
                    (None, _) | (_, None) => {
                        quote!{
                            Self::#variant_ident => panic!("`prop` and `default` must be specified for each attribute"),
                        }
                    }
                    (Some(_prop), Some(_default)) => {
                        quote! {
                            // If we have a prop and a default, the `attrs` module already implements what we need.
                            Self::#variant_ident => std::rc::Rc::new(attrs::#variant_ident::get_prop_updater()),
                        }
                    }
                }
            })
            .collect::<Vec<_>>();

        quote! {
            impl PropFromAttributeVariant for Attributes {
                fn get_prop_updater_object(&self) -> crate::props::UpdaterObject {
                    match self {
                        #(#updater_object_match_arms)*
                    }
                }
            }
        }
    }
}

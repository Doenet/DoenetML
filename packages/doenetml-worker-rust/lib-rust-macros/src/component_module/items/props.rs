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

    /// The `value_type` property of all props defined on this component
    pub fn get_prop_value_types(&self) -> Vec<Path> {
        self.get_variants()
            .iter()
            .map(|x| x.value_type.clone())
            .collect()
    }

    /// Returns the types for each prop. This is different than the `PropValueType`,
    /// which is an actual enum. Instead, a type alias `prop_types::Foo` is exported
    /// for every `PropValueType::Foo`.
    pub fn get_prop_types(&self) -> Vec<Path> {
        self.get_variants()
            .iter()
            .map(|x| {
                // Get the last part of the path.
                let last_segment = x.value_type.segments.last().unwrap();
                // Create a new path `prop_types::#(last_segment)`;
                parse_quote! { prop_type::#last_segment }
            })
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
        let mut descriptions = vec![format!("- Name: `\"{}\"`", name)];
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
            Some(profile) => descriptions.push(format!(
                "- Profile: [`{}`]",
                quote! {#profile}.to_string().replace(' ', "")
            )),
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
        descriptions.push(format!(
            "- Type: [`{}`]",
            quote! {#value_type}.to_string().replace(' ', "")
        ));

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

    /// Generate the `local_idx` method on `Props`
    pub fn impl_props_methods(&self) -> TokenStream {
        let variant_names = self.get_prop_idents();

        let match_arms = variant_names.iter().enumerate().map(|(i, variant_name)| {
            quote! {
                Props::#variant_name => LocalPropIdx::new(#i as usize)
            }
        });

        quote! {
            impl Props {
                /// Get the local index of the prop.
                pub const fn local_idx(&self) -> LocalPropIdx {
                    match self {
                        #( #match_arms, )*
                    }
                }
            }
        }
    }

    /// Generates `pub mod props {...}` which stores
    /// typed traits and types for each prop.
    pub fn generate_props_module(&self) -> TokenStream {
        let name_type_pairs = self
            .get_prop_idents()
            .iter()
            .zip(self.get_prop_types().iter())
            .map(|(name, ty)| (name.clone(), ty.clone()))
            .collect::<Vec<_>>();
        let prop_types: Vec<TokenStream> = name_type_pairs
            .iter()
            .map(|(name, ty)| parse_quote!(pub type #name = #ty;))
            .collect::<Vec<_>>();
        let prop_traits = name_type_pairs
            .iter()
            .map(|(name, ty)| {
                quote! {
                    /// Implementing this trait will automatically implement the `PropUpdater` trait.
                    /// It will also required you to implement `PropUpdaterTyped` for the correct type.
                    ///
                    /// If you need full (untyped) control over `PropUpdater`, you can implement `PropUpdater` directly.
                    /// **Note**: Component authors should always implement `PropUpdaterTyped` instead of `PropUpdater`.
                    pub trait #name: PropUpdater<PropType = #ty> {}
                }
            })
            .collect::<Vec<_>>();

        quote! {
            #[allow(unused)]
            pub mod props {
                //! # Props
                //! This module contains information to be used in the implementation of each prop.
                //! - [`traits`] contains typed traits that should be implemented for each prop.
                //! - [`types`] contains type aliases for each prop.
                //! This information is derived from the annotations on the `Props` enum.
                use super::*;

                #[allow(unused)]
                pub mod traits {
                    //! # Prop Traits
                    //! There is one trait in this module per prop in the `Props` enum. These traits
                    //! are used to ensure type consistency in the definition of each prop. If you
                    //! define a prop yourself, you should `impl traits::PropName for YourPropStruct {}`
                    //! and then make sure to implement `impl PropUpdater<Type> for YourPropStruct` where `Type`
                    //! is the correct type (i.e., the type matching `types::PropName`).
                    use super::*;

                    #(#prop_traits)*
                }

                #[allow(unused)]
                pub mod types {
                    //! The type of each prop is re-exported in this module with a name identical to that of the prop.
                    use super::*;

                    #(#prop_types)*

                }
            }
        }
    }

    /// Generate a typescript type for all the props marked as `for_render`.
    fn generate_for_render_props_typescript(&self, component_name: &str) -> TokenStream {
        let type_name = format!("{}Props", component_name);
        let for_render_props = self
            .get_prop_names()
            .into_iter()
            .zip(self.get_prop_for_renders())
            .zip(self.get_prop_value_types())
            .filter_map(|((prop_name, is_public), value_type)| {
                if !is_public {
                    return None;
                }
                // The type should be specified as a `PropTypeValue::Foo`, where `Foo` is the prop value
                // discriminant. It should be safe (if component authors follow the convention) to use the
                // `Foo` as a literal type name. (The corresponding type definition of `Foo` should be exported elsewhere.)
                let value_type_name = value_type.segments.last().unwrap().ident.to_string();

                Some((prop_name, value_type_name))
            })
            .collect::<Vec<_>>();

        let for_render_props_ts = for_render_props
            .iter()
            .map(|(prop_name, value_type_name)| format!("{}: {}", prop_name, value_type_name))
            .collect::<Vec<_>>()
            .join(", ");

        // This is the actual typescript that we want to end up in the generated file.
        let type_string = format!("export type {} = {{ {} }};", type_name, for_render_props_ts);

        quote! {
            // Generated typescript for all props marked as `for_render`.
            #[cfg(feature = "web")]
            const _: () = {
                pub use wasm_bindgen::prelude::*;

                #[wasm_bindgen(typescript_custom_section)]
                const TS_APPEND_CONTENT: &'static str = #type_string;
            };
        }
    }
}

//
// Trait impls related to Props.
//

impl ComponentModule {
    /// Generate the `enum Props` and all the associated impls for required traits.
    pub fn generate_props_and_impls(&self) -> TokenStream {
        let enum_props = self.enum_props();
        let impl_props_methods = self.props.impl_props_methods();
        let props_module = self.props.generate_props_module();
        let typescript_extras = self.props.generate_for_render_props_typescript(&self.name);

        quote! {
            #enum_props
            #impl_props_methods
            #props_module
            #typescript_extras
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

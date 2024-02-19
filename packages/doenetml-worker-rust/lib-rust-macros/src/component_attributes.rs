use std::collections::HashMap;

use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use proc_macro2::{Ident, TokenStream as TokenStream2};
use quote::{format_ident, quote};
use syn::{self, parse_macro_input, DeriveInput};

use darling::{ast, util, FromDeriveInput, FromVariant};

/// This struct will parse what is inside the `#[attribute(...)]` annotations on each
/// enum variant.
#[derive(Debug, FromVariant)]
#[darling(attributes(attribute))]
struct ComponentAttributeVariant {
    /// The name of the attribute (before it is turned into camelCase)
    ident: Ident,
    /// The prop that should be used to create the data query for this attribute
    prop: Option<Ident>,
    /// The default value for the attribute
    default: Option<syn::Expr>,
    /// The explicit type for the attribute. This can be auto-computed if using one of the standard
    /// prop types.
    explicit_type: Option<Ident>,
}

/// This struct parses the entire enum. It's variants end up in `data`.
#[derive(Debug, FromDeriveInput)]
#[darling(attributes(attribute), supports(enum_any))]
struct ComponentAttribute {
    ident: syn::Ident,
    data: ast::Data<ComponentAttributeVariant, util::Ignored>,
}

/// Derive the `AttributeProp` trait for an enum. This will also derive `VariantNames` from the `strum` crate.
pub fn attribute_prop_derive(input: TokenStream) -> TokenStream {
    // Parse the input tokens into a syntax tree
    let input = parse_macro_input!(input as DeriveInput);
    let parsed = ComponentAttribute::from_derive_input(&input);
    if let Err(e) = parsed {
        // Darling will send nice compiler diagnostics
        return e.write_errors().into();
    }

    let received = parsed.unwrap();
    let enum_name = received.ident;
    let enum_variants = received.data.as_ref().take_enum().unwrap();

    // camelCase versions of the attribute names. These are the "true" names of the attributes.
    let attr_names = enum_variants
        .iter()
        .map(|x| x.ident.to_string().to_case(Case::Camel))
        .collect::<Vec<_>>();

    // We start out implementing `VariantNames` from the `strum` crate.
    let mut ret = quote! {
        impl strum::VariantNames for #enum_name {
            // The names of the attributes of this component
            const VARIANTS: &'static [&'static str] = &[#(#attr_names),*];
        }
    };

    // Implementing `AttributeProp` is complicated because it is a generic trait.
    // We need an implementation for each `Prop<T>` that will be produced.
    // We group all variants of each type together in a HashMap.
    let mut variant_impls: HashMap<String, Vec<VariantImpl>> = HashMap::new();

    for (name, &variant) in attr_names.iter().zip(enum_variants.iter()) {
        match (&variant.prop, &variant.default, &variant.explicit_type) {
            (Some(prop), None, _) => {
                panic!(
                    "You must provide a `default = ...` for the prop `{}`.",
                    prop
                )
            }
            (Some(prop), Some(default), explicit_type) => {
                let explicit_type = lookup_type(prop, explicit_type);
                // This will be something like `bool` or `String`
                let explicit_type_name = explicit_type.to_string();

                let impl_body = variant_impls.entry(explicit_type_name.clone()).or_default();
                impl_body.push(VariantImpl {
                    variant_name: variant.ident.to_string(),
                    attr_name: name.to_string(),
                    default: default.clone(),
                    prop: prop.clone(),
                })
            }
            _ => {}
        }
    }

    // Implement `AttributeProp<T>` for each type `T` that we have.
    for (explicit_type, impls) in &variant_impls {
        let explicit_type = format_ident!("{}", explicit_type);

        let match_arms = impls
            .iter()
            .map(|x| x.match_arm(&enum_name))
            .collect::<TokenStream2>();

        let panic_message = format!(
            "Can only generate `Prop<{}> for this variant.",
            explicit_type
        );

        let doc_string = format!(
            "Generate a `Prop<{}>` for the following variants: {}.\nCalling this function on any other variant will error.",
            explicit_type,
            impls
                .iter()
                .map(|x| format!("`{}`", &x.variant_name))
                .collect::<Vec<_>>()
                .join(", ")
        );

        ret.extend(quote! {
            impl AttributeProp<#explicit_type> for #enum_name {
                #[doc = #doc_string]
                fn prop(&self) -> Prop<#explicit_type> {
                    match self {
                        #match_arms
                        // The only way to end up here is via a component-developer error
                        _ => unreachable!(#panic_message),
                    }
                }
            }
        });
    }

    ret.into()
}

/// Looks up the type based on the `prop` and `explicit_type` attributes. If `explicit_type` is
/// Some, it is always used. Otherwise an attempted lookup is made based on the `prop` attribute.
fn lookup_type(prop: &Ident, explicit_type: &Option<Ident>) -> TokenStream2 {
    let prop_name = prop.to_string();
    explicit_type
        .as_ref()
        .map(|v| {
            quote! {#v}
        })
        .unwrap_or_else(|| match prop_name.as_str() {
            "BooleanProp" => quote! {bool},
            "StringProp" => quote! {String},
            _ => panic!("Cannot automatically infer `default_type` from a prop of `{}`. Please specify `default_type`", prop),
        })
}

/// Struct for saving information about variants of the enum. This contains everything we need to
/// generate code like
/// ```ignore
/// TextInputAttribute::Hide => BooleanProp::new_from_attribute("hide", false, true).into_prop(),
/// ```
#[derive(Debug)]
struct VariantImpl {
    variant_name: String,
    attr_name: String,
    default: syn::Expr,
    prop: Ident,
}

impl VariantImpl {
    /// Create a match arm for this variant that looks like
    /// ```ignore
    /// TextInputAttribute::Hide => BooleanProp::new_from_attribute("hide", false, true).into_prop(),
    /// ```
    fn match_arm(&self, enum_name: &Ident) -> proc_macro2::TokenStream {
        let variant_name = {
            let start = format_ident!("{}", enum_name);
            let end = format_ident!("{}", &self.variant_name);
            quote! { #start::#end }
        };
        let prop = &self.prop;
        let default = &self.default;
        let attr_name = &self.attr_name;

        quote! {
            #variant_name => #prop::new_from_attribute(#attr_name, #default, true).into_prop(),
        }
    }
}

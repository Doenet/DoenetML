use proc_macro2::TokenStream;

use darling::{FromDeriveInput, FromField};
use quote::{format_ident, quote};
use syn::{DeriveInput, Meta, Result, spanned::Spanned};

#[derive(Debug, FromDeriveInput)]
#[darling(forward_attrs(owning_component))]
struct FromDeriveInputStruct {
    ident: syn::Ident,
    data: darling::ast::Data<darling::util::Ignored, Field>,
    // Because we want to allow `#[owning_component(CompName)]` instead of forcing `#[owning_component(name = CompName)]`,
    // we have to grab the raw attrs directly.
    attrs: Vec<syn::Attribute>,
}

#[derive(Debug, FromField)]
#[darling(attributes(from_field))]
struct Field {
    // We don't care about field idents for now (only variant idents)
    ident: Option<syn::Ident>,
    ty: syn::Type,
}

pub fn test_data_query_types_derive(ts: TokenStream) -> Result<TokenStream> {
    let ast: DeriveInput = syn::parse2(ts)?;
    let parsed: FromDeriveInputStruct = FromDeriveInputStruct::from_derive_input(&ast)?;

    let struct_name = parsed.ident.clone();
    let component_name = component_name_from_attrs(&parsed.attrs).ok_or(syn::Error::new(
        parsed.ident.span(),
        "No `owning_component` attribute found. Please add #[owning_component(CompName)]",
    ))?;

    // We build up the vec in a loop so we can propagate errors
    let mut variants = Vec::new();
    for variant in parsed
        .data
        .take_struct()
        .expect("Struct not found. Can only implement on structs")
        .iter()
    {
        let variant_ident = variant.ident.clone().ok_or(syn::Error::new(
            variant.ident.span(),
            "Anonymous struct variants are not supported",
        ))?;
        let ty = variant.ty.clone();
        variants.push((variant_ident, ty));
    }

    let type_entry = variants
        .iter()
        .map(|(variant_ident, ty)| {
            let ident_str = variant_ident.to_string();
            quote! {
                (#ident_str, <#ty>::PROP_VALUE_TYPE)
            }
        })
        .collect::<Vec<_>>();

    let struct_name_str = struct_name.to_string();
    let impls = quote! {
        #[cfg(test)]
        impl TestDataQueryTypes for #struct_name {
            const _DECLARED_DATA_QUERY_TYPES: &'static [(&'static str, Option<PropValueType>)] = &[
                #(#type_entry),*
            ];

            const _STRUCT_NAME: &'static str = #struct_name_str;
        }
    };

    let test = quote! {
        #[cfg(test)]
        mod __types_test_auto_generated {
            use super::*;
            #[test]
            fn test_data_query_and_prop_view_types_are_consistent() {
                #struct_name::_test_data_query_types::<#component_name>().unwrap();
            }
        }
    };

    Ok(quote! {
        #impls
        #test
    })
}

fn component_name_from_attrs(attrs: &[syn::Attribute]) -> Option<syn::Ident> {
    for attr in attrs {
        let meta = &attr.meta;
        if let Meta::List(list) = meta
            && list.path.is_ident("owning_component")
        {
            let tokens = &list.tokens;
            let ident = format_ident!("{}", quote! {#tokens}.to_string());
            return Some(ident);
        }
    }
    None
}

#[cfg(test)]
#[path = "test_data_query_types.test.rs"]
mod test;

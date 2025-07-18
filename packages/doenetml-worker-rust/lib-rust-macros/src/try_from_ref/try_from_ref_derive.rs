use proc_macro2::TokenStream;

use darling::{FromDeriveInput, FromField, FromVariant};
use quote::quote;
use syn::{DeriveInput, Result};

#[derive(Debug, FromDeriveInput)]
#[darling(attributes(from_derive_input))]
struct FromDeriveInputStruct {
    ident: syn::Ident,
    data: darling::ast::Data<Variant, Field>,
}

#[derive(Debug, FromVariant)]
#[darling(attributes(from_variant))]
struct Variant {
    ident: syn::Ident,
    fields: darling::ast::Fields<Field>,
}

#[derive(Debug, FromField)]
#[darling(attributes(from_field))]
struct Field {
    // We don't care about field idents for now (only variant idents)
    //   ident: Option<syn::Ident>,
    ty: syn::Type,
}

pub fn try_from_ref_derive(ts: TokenStream) -> Result<TokenStream> {
    let ast: DeriveInput = syn::parse2(ts)?;
    let parsed: FromDeriveInputStruct = FromDeriveInputStruct::from_derive_input(&ast)?;

    let enum_name = parsed.ident.clone();

    // We build up the vec in a loop so we can propagate errors
    let mut variants = Vec::new();
    for variant in parsed.data.take_enum().unwrap().iter() {
        let variant_ident = variant.ident.clone();
        if variant.fields.len() != 1 {
            // We don't know how to deal with multiple fields
            return Err(syn::Error::new(
                variant_ident.span(),
                "Only single field variants are supported",
            ));
        }
        let field = variant.fields.iter().next().unwrap();
        variants.push((variant_ident, field.ty.clone()));
    }

    let impls = variants
        .iter()
        .map(|(variant_ident, inner)| {
            // The generic implementation. It should look something like
            // ```
            // impl<'a> TryFrom<&'a PropValue> for &'a i64 {
            //     type Error = anyhow::Error;
            //
            //     fn try_from(value: &'a PropValue) -> Result<Self, Self::Error> {
            //         match value {
            //             PropValue::Integer(x) => Ok(x),
            //             _ => Err(anyhow::anyhow!("Expected Integer")),
            //         }
            //     }
            // }
            // ```

            let error_message = format!(
                "Tried to convert into `{enum_name}::??` into `{variant_ident}`, but the inner types didn't match"
            );
            quote! {
                impl<'a> TryFrom<&'a #enum_name> for &'a #inner {
                    type Error = anyhow::Error;

                    fn try_from(v: &'a #enum_name) -> Result<Self, Self::Error> {
                        match v {
                            #enum_name::#variant_ident(v) => Ok(v),
                            _ => Err(anyhow::anyhow!(#error_message)),
                        }
                    }
                }
            }
        })
        .collect::<Vec<_>>();

    Ok(quote! {
        #(#impls)*
    })
}

#[cfg(test)]
#[path = "try_from_ref_derive.test.rs"]
mod test;

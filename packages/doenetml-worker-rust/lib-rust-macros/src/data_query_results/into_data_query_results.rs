use proc_macro2::TokenStream;
use quote::quote;
use syn::{self, DeriveInput};
use syn::{Generics, Type};

use darling::FromDeriveInput;
use darling::ast;
use syn::Ident;

#[derive(Debug, FromDeriveInput)]
#[darling(forward_attrs(all))]
pub struct StructuredData {
    ident: Ident,
    data: ast::Data<(), syn::Field>,
    generics: Generics,
}

/// Parse a
/// ```ignore
/// #[structured_data(query_trait = ...)]
/// struct RequiredData { ... }
/// ```
/// struct and generate a resulting module containing all required structs.
pub fn generate_into_data_query_results(input: TokenStream) -> syn::Result<TokenStream> {
    let struct_source: DeriveInput = syn::parse2(input).unwrap();
    let structured_data = StructuredData::from_derive_input(&struct_source)?;

    let generated_into_data_query_results_impl =
        structured_data.generate_into_data_query_results_impl();

    Ok(quote! {
        #generated_into_data_query_results_impl
    })
}

impl StructuredData {
    /// Generate an implementation of `IntoDataQueryResults` for the struct.
    /// The implementation may look something like
    /// ```ignore
    /// impl IntoDataQueryResults for RequiredData {
    ///     fn into_data_query_results(self) -> DataQueryResults {
    ///         DataQueryResults {
    ///             vec: vec![
    ///                 DataQueryResult {
    ///                     values: self.independent_state.into_prop_with_meta_vec(),
    ///                 },
    ///                 DataQueryResult {
    ///                     values: self.booleans_and_strings.into_prop_with_meta_vec(),
    ///                 },
    ///             ],
    ///         }
    ///     }
    /// }
    /// ```
    fn generate_into_data_query_results_impl(&self) -> TokenStream {
        let struct_ident = &self.ident;
        let fields = self.get_fields();
        let generics = &self.generics;
        let where_clause = &self.generics.where_clause;

        let results_body = fields
            .iter()
            .map(|(ident, _ty)| {
                quote! {
                    DataQueryResult {
                        values: self.#ident.into_prop_with_meta_vec(),
                    }
                }
            })
            .collect::<Vec<_>>();

        quote! {
            impl #generics IntoDataQueryResults for #struct_ident #generics
            #where_clause
            {
                fn into_data_query_results(self) -> DataQueryResults {
                    DataQueryResults {
                        vec: vec![
                            #(#results_body),*
                        ],
                    }
                }
            }
        }
    }

    /// Get the fields of the struct and their types.
    fn get_fields(&self) -> Vec<(Ident, Type)> {
        self.data
            .clone()
            .take_struct()
            .unwrap()
            .fields
            .into_iter()
            .map(|field| {
                let ident = field.ident.unwrap();
                let ty = field.ty;

                (ident, ty)
            })
            .collect()
    }
}

#[cfg(test)]
#[path = "into_data_query_results.test.rs"]
mod test;

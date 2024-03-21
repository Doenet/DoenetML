use proc_macro2::TokenStream;
use quote::{format_ident, quote};
use syn::Type;
use syn::{self, DeriveInput};

use darling::ast;
use darling::FromDeriveInput;
use syn::Ident;

#[derive(Debug, FromDeriveInput)]
#[darling(attributes(data_query), forward_attrs(all))]
pub struct StructuredData {
    ident: Ident,
    data: ast::Data<(), syn::Field>,
    query_trait: syn::Ident,
}

/// Parse a
/// ```ignore
/// #[structured_data(query_trait = ...)]
/// struct RequiredData { ... }
/// ```
/// struct and generate a resulting module containing all required structs.
pub fn generate_structured_data(input: TokenStream) -> syn::Result<TokenStream> {
    let struct_source: DeriveInput = syn::parse2(input).unwrap();
    let structured_data = StructuredData::from_derive_input(&struct_source)?;

    let generated_query_trait = structured_data.generate_query_trait();
    let generated_from_data_query_results_impl =
        structured_data.generate_from_data_query_results_impl();

    Ok(quote! {
        #generated_query_trait
        #generated_from_data_query_results_impl
    })
}

impl StructuredData {
    /// Generates a trait with `*_query()` functions for each field of the struct.
    /// as well as a `data_queries() -> Vec<DataQuery>` function (with a default implementation).
    fn generate_query_trait(&self) -> TokenStream {
        let query_trait = &self.query_trait;
        let fields = self.get_fields();

        let query_fns = fields.iter().map(|(ident, _)| {
            let ident = format_ident!("{}_query", ident);
            let doc_comment = format!(" Get the query for the `{}` field.", ident);
            quote! {
                #[doc = #doc_comment]
                fn #ident() -> DataQuery;
            }
        });

        let data_queries_fn_calls = fields.iter().map(|(ident, _)| {
            let ident = format_ident!("{}_query", ident);
            quote! {
                Self::#ident()
            }
        });

        quote! {
            /// A custom trait to make defining data queries easier. This trait was
            /// created by the `#[derive(FromDataQueryResults)]` macro.
            ///
            /// Every `*_query()` function should be implemented. These are used to
            /// destructure `DataQueryResults` into typed forms in your struct.
            ///
            /// **Note**: This trait must be implemented by a component author. It cannot
            /// be done automatically.
            trait #query_trait {
                #(#query_fns)*

                /// Get data queries for every field in the struct. These are created as a `Vec`
                /// whose order matches the order of the struct.
                fn data_queries_vec() -> Vec<DataQuery> {
                    vec![
                        #(#data_queries_fn_calls),*
                    ]
                }
            }
        }
    }

    /// Generate an implementation of `FromDataQueryResults` for the struct.
    /// The implementation may look something like
    /// ```ignore
    /// impl FromDataQueryResults for RequiredData
    /// where
    ///    Self: CreateDataQueries,
    /// {
    ///    fn to_data_queries() -> Vec<DataQuery> {
    ///       Self::data_queries_vec()
    ///    }
    ///    fn from_data_query_results(data: DataQueryResults) -> Self {
    ///       let data = data.vec;
    ///       if data.len() != 2 {
    ///         panic!("Expected 2 data query results, got {}", data.len());
    ///       }
    ///       let mut iter = data.into_iter();
    ///       Self {
    ///         field1: iter.next().unwrap().into_prop_view(),
    ///         field2: iter.next().unwrap().into_prop_view(),
    ///       }
    ///   }
    /// }
    /// ```
    fn generate_from_data_query_results_impl(&self) -> TokenStream {
        let struct_ident = &self.ident;
        let struct_ident_str = struct_ident.to_string();
        let query_trait = &self.query_trait;
        let fields = self.get_fields();
        let num_fields = fields.len();

        let struct_body = fields
            .iter()
            .map(|(ident, _ty)| {
                quote! {
                    #ident: IntoPropView::into_prop_view(iter.next().unwrap())
                }
            })
            .collect::<Vec<_>>();

        quote! {
            impl FromDataQueryResults for #struct_ident
            where
                Self: #query_trait,
            {
                fn to_data_queries() -> Vec<DataQuery> {
                    // We know this exists because of the `Self: #query_trait` bound
                    // This will cause an error to be thrown if the trait is not implemented,
                    // and importantly, the error will refer to a missing trait impl rather than
                    // a missing method.
                    Self::data_queries_vec()
                }
                fn from_data_query_results(data: DataQueryResults) -> Self {
                    let data = data.vec;
                    if data.len() != #num_fields {
                        panic!(
                            "Can only unpack exactly {} data query results into a `{}` struct, but found {}",
                            #num_fields,
                            #struct_ident_str,
                            data.len()
                        );
                    }
                    // We will use `iter.next().unwrap()` the correct number of times
                    // to unpack the data query results into the struct fields.
                    let mut iter = data.into_iter();
                    Self {
                        #(#struct_body),*
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
#[path = "generate_structured_data.test.rs"]
mod test;

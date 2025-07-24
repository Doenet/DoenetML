use proc_macro2::TokenStream;
use quote::{format_ident, quote};
use syn::Type;
use syn::{self, DeriveInput};

use darling::FromDeriveInput;
use darling::ast;
use syn::Ident;

#[derive(Debug, FromDeriveInput)]
#[darling(attributes(data_query), forward_attrs(all))]
pub struct StructuredData {
    ident: Ident,
    data: ast::Data<(), syn::Field>,
    query_trait: syn::Ident,
    generics: syn::Generics,
    #[darling(default)]
    pass_data: Option<syn::Expr>,
}

/// Parse a
/// ```ignore
/// #[structured_data(query_trait = ...)]
/// struct RequiredData { ... }
/// ```
/// struct and generate a resulting module containing all required structs.
pub fn generate_try_from_data_query_results(input: TokenStream) -> syn::Result<TokenStream> {
    let struct_source: DeriveInput = syn::parse2(input).unwrap();
    let structured_data = StructuredData::from_derive_input(&struct_source)?;

    let generated_query_trait = structured_data.generate_query_trait();
    let generated_try_from_data_query_results_impl =
        structured_data.generate_try_from_data_query_results_impl();

    Ok(quote! {
        #generated_query_trait
        #generated_try_from_data_query_results_impl
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
            let doc_comment = format!(" Get the query for the `{ident}` field.");
            let arg = match self.pass_data {
                Some(ref pass_data) => quote! { arg: #pass_data },
                None => quote! {},
            };

            quote! {
                #[doc = #doc_comment]
                fn #ident(#arg) -> DataQuery;
            }
        });

        let data_queries_fn_calls = fields.iter().map(|(ident, _)| {
            let ident = format_ident!("{}_query", ident);
            let arg = match self.pass_data {
                Some(_) => quote! { arg },
                None => quote! {},
            };
            quote! {
                Self::#ident(#arg)
            }
        });

        let arg = match self.pass_data {
            Some(ref pass_data) => quote! { arg: #pass_data },
            None => quote! {},
        };

        quote! {
            /// A custom trait to make defining data queries easier. This trait was
            /// created by the `#[derive(TryFromDataQueryResults)]` macro.
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
                fn data_queries_vec(#arg) -> Vec<DataQuery> {
                    vec![
                        #(#data_queries_fn_calls),*
                    ]
                }
            }
        }
    }

    /// Generate an implementation of `TryFromDataQueryResults` for the struct.
    /// The implementation may look something like
    /// ```ignore
    /// impl TryFromDataQueryResults for RequiredData
    /// where
    ///    Self: CreateDataQueries,
    /// {
    ///    fn to_data_queries() -> Vec<DataQuery> {
    ///       Self::data_queries_vec()
    ///    }
    ///    fn try_from_data_query_results(data: DataQueryResults) -> anyhow::Result<Self> {
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
    fn generate_try_from_data_query_results_impl(&self) -> TokenStream {
        let struct_ident = &self.ident;
        let struct_ident_str = struct_ident.to_string();
        let query_trait = &self.query_trait;
        let fields = self.get_fields();
        let num_fields = fields.len();
        let generics = &self.generics;
        let where_clause_predicates = self.generics.where_clause.as_ref().map(|wc| &wc.predicates);

        let struct_body = fields
            .iter()
            .map(|(ident, _ty)| {
                let err_str = format!("Missing field `{ident}` while unpacking.");
                quote! {
                    #ident: IntoPropView::try_into_prop_view(iter.next().ok_or_else(|| anyhow::anyhow!(#err_str))?)?
                }
            })
            .collect::<Vec<_>>();

        // We cannot pass arguments to `to_data_queries()`, so if `pass_data` is specified,
        // we throw an error and suggest an alternative.
        let func_body = if self.pass_data.is_none() {
            quote! {
                // We know this exists because of the `Self: #query_trait` bound
                // This will cause an error to be thrown if the trait is not implemented,
                // and importantly, the error will refer to a missing trait impl rather than
                // a missing method.
                Self::data_queries_vec()
            }
        } else {
            quote! {
                panic!(
                   "A `pass_data` type was specified for this object. Since `to_data_queries()` cannot be passed any data, you must instead call `data_queries_vec(arg)` directly."
                )
            }
        };

        quote! {
            impl #generics TryFromDataQueryResults for #struct_ident #generics
            where
                Self: #query_trait, #where_clause_predicates
            {
                fn to_data_queries() -> Vec<DataQuery> {
                    #func_body
                }
                fn try_from_data_query_results(data: DataQueryResults) -> anyhow::Result<Self> {
                    let data = data.vec;
                    if data.len() != #num_fields {
                        return Err(anyhow::anyhow!(
                            "Can only unpack exactly {} data query results into a `{}` struct, but found {}",
                            #num_fields,
                            #struct_ident_str,
                            data.len()
                        ));
                    }
                    // We will use `iter.next().unwrap()` the correct number of times
                    // to unpack the data query results into the struct fields.
                    let mut iter = data.into_iter();
                    Ok(Self {
                        #(#struct_body),*
                    })
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
#[path = "from_data_query_results.test.rs"]
mod test;

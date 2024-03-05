use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use proc_macro2::{Ident, Span};
use quote::quote;
use syn::{self, parse::Parser, FieldsNamed};

use crate::util::{find_type_from_prop_with_generics, has_attribute};

pub fn component_props_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let structure_identity = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { named, .. }) => {
                // eprintln!("named: {:#?}", named);

                let field_identities = named
                    .iter()
                    .map(|f| f.ident.as_ref().unwrap().clone())
                    .collect::<Vec<_>>();

                // Determine if struct represents a component or represents props.
                // If a component, then we implement the trait by calling each function on the props.
                // If props, then determine the trait functions from the fields.
                //
                // TODO: better condition to determine if is component struct.
                // For now, we just check if there are fields named "common" and "props".
                // Could check the type of common to make sure it is CommonData
                // or check if each field is a prop.
                let is_component_struct = field_identities.iter().any(|ident| *ident == "common")
                    && field_identities.iter().any(|ident| *ident == "props");

                quote! {
                    // XXX XXX XXX: temporary and broken
                    impl ComponentProps for #structure_identity {
                        fn generate_props(&self) -> Vec<Prop> {
                            // XXX: make this right
                            vec![]
                        }
                        fn get_local_prop_index_from_name(&self, name: &str) -> Option<PropIdx> {
                            None
                        }
                        fn get_public_local_prop_index_from_name_case_insensitive(&self, name: &str) -> Option<PropIdx> {
                            None
                        }
                        fn get_component_profile_local_prop_indices(&self) -> Vec<PropIdx> {
                            vec![]
                        }
                        fn get_default_prop_local_index(&self) -> Option<PropIdx> {
                            None
                        }
                        fn get_for_renderer_local_prop_indices(&self) -> Vec<PropIdx> {
                            vec![]
                        }


                    }
                }
            }
            _ => panic!("only named fields supported"),
        },
        _ => panic!("only structs supported"),
    };
    output.into()
}

pub fn prop_dependencies_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let structure_identity = &ast.ident;
    let data = &ast.data;
    let generics = &ast.generics;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { named, .. }) => {
                // eprintln!("named: {:#?}", named);

                let field_identities = named
                    .iter()
                    .map(|f| f.ident.as_ref().unwrap().clone())
                    .collect::<Vec<_>>();

                let structure_name = structure_identity.to_string();
                let sn_len = structure_name.len();

                let data_name = if structure_name.ends_with("ies") {
                    format!("{}yData", &structure_name[..(sn_len - 3)])
                } else {
                    format!("{}Data", structure_name)
                };
                let data_identity = Ident::new(&data_name, Span::call_site());

                let mut data_struct_statements = Vec::new();
                let mut initialize_data_struct_statements = Vec::new();
                let mut return_update_requests_statements = Vec::new();
                let mut mark_data_viewed_statements = Vec::new();

                for (data_query_idx, field_identity) in field_identities.iter().enumerate() {
                    if field_identity.to_string().starts_with('_') {
                        continue;
                    }

                    data_struct_statements.push(quote! {
                        #field_identity: Vec<(usize,usize)>,
                    });

                    return_update_requests_statements.push(quote! {

                        let mapping_data = &self._data_query_mapping_data.#field_identity;

                        requests.extend(self.#field_identity.indices_with_queued_updates().into_iter().map(|idx| {
                            let data = &mapping_data[idx];
                            DependencyValueUpdateRequest {
                                data_query_idx: data.0,
                                dependency_idx: data.1,
                            }
                        }));
                        self.#field_identity.clear_queued_updates();
                    });

                    initialize_data_struct_statements.push(quote! {
                        // #data_query_idx is the index of this query in the list of fields
                        // in #structure_identity.
                        for (dep_idx, dep) in dependencies[#data_query_idx].iter().enumerate() {
                            mapping_data.#field_identity.push((#data_query_idx, dep_idx));
                        }
                        data_struct.#field_identity = (&dependencies[#data_query_idx]).try_to_prop().unwrap();

                    });

                    mark_data_viewed_statements.push(quote! {
                        self.#field_identity.mark_data_viewed();
                    });
                }

                // if we have a generic,
                // we also need to restrict to those with a PropView that we can try_into a PropViewEnum
                // with an error that implements Debug
                let where_clause = generics.where_clause.as_ref().map(|wc| {
                    quote!(
                        #wc
                        PropView #generics: TryFromProp<PropViewEnum>,
                        <PropView #generics as TryFromProp<PropViewEnum>>::Error: std::fmt::Debug,
                    )
                });

                quote! {
                    impl #generics FromDependencies for #structure_identity #generics
                        #where_clause
                    {
                        fn from_dependencies(
                            dependencies: &[DependenciesCreatedForDataQuery],
                        ) -> Self {

                            let mut data_struct = #structure_identity::default();
                            let mut mapping_data = #data_identity::default();

                            #(#initialize_data_struct_statements)*

                            data_struct._data_query_mapping_data = mapping_data;

                            data_struct
                        }

                        fn mark_data_viewed(&mut self) {
                            #(#mark_data_viewed_statements)*
                        }

                    }

                    impl #generics #structure_identity #generics
                        #where_clause
                    {
                        /// Return the updates queued during by calls to `queue_update()`
                        /// on the dependencies of this `data` structure.
                        ///
                        /// Returns all queued updates since the last call to `queued_updates()`.
                        ///
                        /// The result of this function is intended to be sent as the return value
                        /// for `invert`.
                        fn queued_updates(&mut self) -> Vec<DependencyValueUpdateRequest> {
                            let mut requests = Vec::new();
                            #(#return_update_requests_statements)*
                            requests
                        }

                    }

                    #[derive(Debug, Default)]
                    struct #data_identity {
                        #(#data_struct_statements)*
                    }

                }
            }
            _ => panic!("only named fields supported"),
        },
        _ => panic!("only structs supported"),
    };
    output.into()
}

pub fn prop_data_queries_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let structure_identity = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { named, .. }) => {
                // eprintln!("named: {:#?}", named);

                let field_identities = named
                    .iter()
                    .map(|f| f.ident.as_ref().unwrap().clone())
                    .collect::<Vec<_>>();

                let num_queries = field_identities.len();

                let structure_name = structure_identity.to_string();

                let structure_is_data_queries = structure_name.ends_with("DataQueries");

                if structure_is_data_queries {
                    let mut from_structure_to_vec_statements = Vec::new();

                    for field_identity in field_identities.iter() {
                        from_structure_to_vec_statements.push(quote! {
                            structure.#field_identity.as_ref().map(|inst| {
                                instruct_vec.push(inst.clone());
                            });
                        });
                    }
                    quote! {
                        impl From<&#structure_identity> for Vec<DataQuery> {
                            fn from(structure: &#structure_identity) -> Self {
                                let mut instruct_vec = Vec::with_capacity(#num_queries);
                                #(#from_structure_to_vec_statements)*
                                instruct_vec
                            }
                        }
                    }
                } else {
                    let mut data_query_struct_statements = Vec::new();

                    let mut from_structure_to_vec_statements = Vec::new();

                    let data_query_name = format!("{}Queries", structure_name);

                    let data_query_identity = Ident::new(&data_query_name, Span::call_site());

                    for field_identity in field_identities.iter() {
                        if field_identity.to_string().starts_with('_') {
                            continue;
                        }

                        data_query_struct_statements.push(quote! {
                            pub #field_identity: DataQuery,
                        });

                        from_structure_to_vec_statements.push(quote! {
                            instruct_vec.push(structure.#field_identity);
                        });
                    }

                    quote! {
                        #[derive(Debug, Default)]
                        struct #data_query_identity {
                            #(#data_query_struct_statements)*
                        }

                        impl From<#data_query_identity> for Vec<DataQuery> {
                            fn from(structure: #data_query_identity) -> Self {
                                let mut instruct_vec = Vec::with_capacity(#num_queries);
                                #(#from_structure_to_vec_statements)*
                                instruct_vec
                            }
                        }

                    }
                }
            }
            _ => panic!("only named fields supported"),
        },
        _ => panic!("only structs supported"),
    };
    output.into()
}

pub fn add_dependency_data_impl(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let mut ast: syn::DeriveInput = syn::parse(item).unwrap();
    let structure_identity = &ast.ident;

    match &mut ast.data {
        syn::Data::Struct(ref mut struct_data) => {
            if let syn::Fields::Named(fields) = &mut struct_data.fields {
                let structure_name = structure_identity.to_string();
                let sn_len = structure_name.len();

                let data_name = if structure_name.ends_with("ies") {
                    format!("{}yData", &structure_name[..(sn_len - 3)])
                } else {
                    format!("{}Data", structure_name)
                };
                let data_identity = Ident::new(&data_name, Span::call_site());

                fields.named.push(
                    syn::Field::parse_named
                        .parse2(quote! {
                            _data_query_mapping_data: #data_identity
                        })
                        .unwrap(),
                );
            }

            quote! {
                #ast
            }
            .into()
        }
        _ => panic!("`add_standard_component_fields` has to be used with structs."),
    }
}

#[cfg(test)]
mod test {}

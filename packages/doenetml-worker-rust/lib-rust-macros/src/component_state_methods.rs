use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use proc_macro2::{Ident, Span};
use quote::quote;
use syn::{self, parse::Parser, FieldsNamed};

use crate::util::{
    check_if_field_has_attribute, check_if_field_has_attribute_return_identities,
    find_type_from_state_var_with_generics,
};

pub fn component_state_derive(input: TokenStream) -> TokenStream {
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

                // Determine if struct represents a component or represents state variables.
                // If a component, then we implement the trait by calling each function on the state.
                // If state variables, then determine the trait functions from the fields.
                //
                // TODO: better condition to determine if is component struct.
                // For now, we just check if there are fields named "common" and "state".
                // Could check the type of common to make sure it is CommonData
                // or check if each field is a state variable.
                let is_component_struct = field_identities.iter().any(|ident| *ident == "common")
                    && field_identities.iter().any(|ident| *ident == "state");

                if is_component_struct {
                    quote! {
                        impl ComponentState for #structure_identity {
                            fn get_num_state_variables(&self) -> StateVarIdx {
                                self.state.get_num_state_variables()
                            }

                            fn get_state_variable(&self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRef> {
                                self.state.get_state_variable(state_var_idx)
                            }

                            fn get_state_variable_mut(&mut self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRefMut> {
                                self.state.get_state_variable_mut(state_var_idx)
                            }

                            fn get_state_variable_index_from_name(&self, name: &str) -> Option<StateVarIdx> {
                                self.state.get_state_variable_index_from_name(name)
                            }

                            // fn get_state_variable_index_from_name_case_insensitive(
                            //     &self,
                            //     name: &str,
                            // ) -> Option<StateVarIdx> {
                            //     self.state.get_state_variable_index_from_name_case_insensitive(name)
                            // }

                            fn get_component_profile_state_variables(&self) -> Vec<ComponentProfileStateVariable> {
                                self.state.get_component_profile_state_variables()


                            }
                            fn get_public_state_variable_index_from_name_case_insensitive(
                                &self,
                                name: &str,
                            ) -> Option<StateVarIdx> {
                                self.state.get_public_state_variable_index_from_name_case_insensitive(name)
                            }

                            fn get_for_renderer_state_variable_indices(&self) -> Vec<StateVarIdx> {
                                self.state.get_for_renderer_state_variable_indices()
                            }

                            fn check_if_state_variable_is_for_renderer(&self, state_var_idx: StateVarIdx) -> bool {
                                self.state.check_if_state_variable_is_for_renderer(state_var_idx)
                            }

                            /// Return object will the values of all the rendered state variables
                            fn return_rendered_state(&mut self) -> Option<RenderedState> {
                                self.state.return_rendered_state()
                            }

                            fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
                                self.state.return_rendered_state_update()
                            }
                        }
                    }
                } else {
                    let field_types = named
                        .iter()
                        .map(|f| find_type_from_state_var_with_generics(&f.ty).unwrap())
                        .collect::<Vec<_>>();

                    let num_state_var = field_identities.len();

                    let mut get_state_variable_arms = Vec::new();
                    let mut get_state_variable_mut_arms = Vec::new();
                    let mut get_state_variable_index_from_name_arms = Vec::new();
                    // let mut get_state_variable_index_from_name_case_insensitive_arms = Vec::new();
                    let mut get_public_state_variable_index_from_name_case_insensitive_arms =
                        Vec::new();
                    let mut get_component_profile_state_variables_items = Vec::new();
                    let mut get_for_renderer_state_variable_indices_items = Vec::new();
                    let mut check_if_state_variable_is_for_renderer_arms = Vec::new();
                    let mut return_rendered_state_items = Vec::new();
                    let mut return_rendered_state_update_statements = Vec::new();
                    let mut rendered_state_variables_struct_statements = Vec::new();

                    let mut get_state_variable_index_functions = Vec::new();
                    let mut get_value_data_queries_functions = Vec::new();
                    let mut update_from_action_functions = Vec::new();

                    let renderer_state_variables_name = format!("Rendered{}", structure_identity);
                    let rendered_state_variables_identity =
                        Ident::new(&renderer_state_variables_name, Span::call_site());

                    for (sv_idx, field_identity) in field_identities.iter().enumerate() {
                        get_state_variable_arms.push(quote! {
                            #sv_idx => Some((&self.#field_identity).into()),
                        });
                        get_state_variable_mut_arms.push(quote! {
                            #sv_idx => Some((&mut self.#field_identity).into()),
                        });

                        let field_camel_case = field_identity.to_string().to_case(Case::Camel);
                        get_state_variable_index_from_name_arms.push(quote! {
                            #field_camel_case => Some(#sv_idx),
                        });

                        // get_state_variable_index_from_name_case_insensitive_arms.push(quote! {
                        //     x if x.eq_ignore_ascii_case(#field_camel_case) => Some(#sv_idx),
                        // });

                        if check_if_field_has_attribute(&named[sv_idx], "is_public") {
                            get_public_state_variable_index_from_name_case_insensitive_arms.push(
                                quote! {
                                    x if x.eq_ignore_ascii_case(#field_camel_case) => Some(#sv_idx),
                                },
                            );
                        }

                        for profile_type in check_if_field_has_attribute_return_identities(
                            &named[sv_idx],
                            "component_profile_state_variable",
                        ) {
                            get_component_profile_state_variables_items.push(quote! {
                                ComponentProfileStateVariable::#profile_type(
                                    self.#field_identity.create_new_read_only_view(),
                                    #sv_idx,
                                )
                            });
                        }

                        if check_if_field_has_attribute(&named[sv_idx], "for_renderer") {
                            get_for_renderer_state_variable_indices_items.push(quote! {
                                #sv_idx,
                            });

                            check_if_state_variable_is_for_renderer_arms.push(quote! {
                                #sv_idx => true,
                            });

                            return_rendered_state_items.push(quote! {
                                #field_identity: Some(self.#field_identity.get_value_record_viewed().clone()),
                            });

                            return_rendered_state_update_statements.push(quote! {
                                if self.#field_identity.check_if_changed_since_last_viewed() {
                                    updated_variables.#field_identity =
                                        Some(self.#field_identity.get_value_record_viewed().clone());
                                }
                            });

                            let sv_type =
                                find_type_from_state_var_with_generics(&named[sv_idx].ty).unwrap();

                            rendered_state_variables_struct_statements.push(quote! {
                                #[serde(skip_serializing_if = "Option::is_none")]
                                pub #field_identity: Option<#sv_type>,
                            })
                        }

                        let get_index_function_name =
                            format!("get_{}_state_variable_index", field_identity);
                        let get_index_function_identity =
                            Ident::new(&get_index_function_name, Span::call_site());

                        get_state_variable_index_functions.push(quote! {
                            /// Get a state variable index
                            /// of the specified state variable
                            pub fn #get_index_function_identity() -> StateVarIdx {
                                #sv_idx
                            }
                        });

                        let get_queries_function_name =
                            format!("get_{}_data_queries", field_identity);
                        let get_queries_function_identity =
                            Ident::new(&get_queries_function_name, Span::call_site());

                        get_value_data_queries_functions.push(quote! {
                            /// Get a `DataQuery` that requests the value
                            /// of the specified state variable
                            pub fn #get_queries_function_identity() -> DataQuery {
                                DataQuery::StateVar {
                                    component_idx: None,
                                    state_var_idx: #sv_idx,
                                }
                            }
                        });

                        let update_from_action_function_name =
                            format!("update_{}_from_action", field_identity);
                        let update_from_action_function_identity =
                            Ident::new(&update_from_action_function_name, Span::call_site());
                        let val_type = &field_types[sv_idx];

                        update_from_action_functions.push(quote! {
                            pub fn #update_from_action_function_identity(val: #val_type) -> UpdateFromAction {
                                UpdateFromAction(#sv_idx, val.clone().try_into().unwrap())
                            }
                        });
                    }

                    quote! {
                        impl ComponentState for #structure_identity {

                            fn get_num_state_variables(&self) -> StateVarIdx {
                                #num_state_var
                            }

                            fn get_state_variable(&self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRef> {
                                match state_var_idx {
                                    #(#get_state_variable_arms)*
                                    _ => None,
                                }
                            }


                            fn get_state_variable_mut(&mut self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRefMut> {
                                match state_var_idx {
                                    #(#get_state_variable_mut_arms)*
                                    _ => None,
                                }
                            }

                            fn get_state_variable_index_from_name(&self, name: &str) -> Option<StateVarIdx> {
                                match name {
                                    #(#get_state_variable_index_from_name_arms)*
                                    _ => None,
                                }
                            }

                            // fn get_state_variable_index_from_name_case_insensitive(
                            //     &self,
                            //     name: &str,
                            // ) -> Option<StateVarIdx> {
                            //     match name {
                            //         #(#get_state_variable_index_from_name_case_insensitive_arms)*
                            //         _ => None,
                            //     }
                            // }

                            fn get_public_state_variable_index_from_name_case_insensitive(
                                &self,
                                name: &str,
                            ) -> Option<StateVarIdx> {
                                match name {
                                    #(#get_public_state_variable_index_from_name_case_insensitive_arms)*
                                    _ => None,
                                }
                            }

                            fn get_component_profile_state_variables(&self) -> Vec<ComponentProfileStateVariable> {
                                vec![
                                    #(#get_component_profile_state_variables_items)*
                                ]
                            }

                            fn get_for_renderer_state_variable_indices(&self) -> Vec<StateVarIdx> {
                                vec![
                                    #(#get_for_renderer_state_variable_indices_items)*
                                ]
                            }

                            fn check_if_state_variable_is_for_renderer(&self, state_var_idx: StateVarIdx) -> bool {
                                match state_var_idx {
                                    #(#check_if_state_variable_is_for_renderer_arms)*
                                    _ => false,
                                }
                            }

                            fn return_rendered_state(&mut self) -> Option<RenderedState> {
                                Some(RenderedState::#structure_identity(#rendered_state_variables_identity {
                                    #(#return_rendered_state_items)*
                                }))
                            }

                            fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
                                let mut updated_variables = #rendered_state_variables_identity::default();

                                #(#return_rendered_state_update_statements)*

                                Some(RenderedState::#structure_identity(updated_variables))
                            }

                        }

                        /// Structure containing the values of a component's state variables
                        /// that were designated `for_renderer`.
                        ///
                        /// Each field is an Option so that partial data can be sent
                        /// when the values of just some variables were updated.
                        #[derive(Debug, Clone, serde::Serialize, serde::Deserialize, Default)]
                        #[serde(rename_all = "camelCase")]
                        pub struct #rendered_state_variables_identity {
                            #(#rendered_state_variables_struct_statements)*
                        }


                        impl #structure_identity {

                            #(#get_state_variable_index_functions)*

                            #(#get_value_data_queries_functions)*

                            #(#update_from_action_functions)*
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

pub fn state_variable_dependencies_derive(input: TokenStream) -> TokenStream {
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

                let structure_name = structure_identity.to_string();
                let sn_len = structure_name.len();

                let data_name = if &structure_name[(sn_len - 3)..] == "ies" {
                    format!("{}yData", &structure_name[..(sn_len - 3)])
                } else {
                    format!("{}Data", structure_name)
                };
                let data_identity = Ident::new(&data_name, Span::call_site());

                let mut try_from_dependencies_vec_statements = Vec::new();
                let mut data_struct_statements = Vec::new();
                let mut initialize_data_struct_statements = Vec::new();
                let mut return_update_requests_statements = Vec::new();

                for (data_query_idx, field_identity) in field_identities.iter().enumerate() {
                    if field_identity.to_string().starts_with('_') {
                        continue;
                    }

                    data_struct_statements.push(quote! {
                        #field_identity: Vec<(usize,usize)>,
                    });

                    return_update_requests_statements.push(quote! {

                        let mapping_data = &self._data_query_mapping_data.#field_identity;

                        requests.extend(self.#field_identity.return_indices_with_queued_updates().into_iter().map(|idx| {
                            let data = &mapping_data[idx];
                            DependencyValueUpdateRequest {
                                data_query_idx: data.0,
                                dependency_idx: data.1,
                            }
                        }));
                        self.#field_identity.reset_queued_updates();
                    });

                    if check_if_field_has_attribute(
                        &named[data_query_idx],
                        "consume_remaining_data_queries",
                    ) {
                        try_from_dependencies_vec_statements.push(quote! {
                            // Note: This algorithm adds an extra layer that needs to be flattened twice.
                            // TODO: understand why this is happening
                            #field_identity: dependencies[#data_query_idx..].iter()
                                .map(|data_query| {
                                    // we first set to temp to make sure that try_into_state_var targets a vector
                                    let temp: Result<Vec<_>,_> = data_query.try_into_state_var();
                                    temp
                                })
                                .flatten().flatten().collect::<Vec<_>>(),
                        });
                        initialize_data_struct_statements.push(quote! {
                            for (inst_idx_offset, inst) in dependencies[#data_query_idx..].iter().enumerate() {
                                for (dep_idx, dep) in inst.iter().enumerate() {
                                    mapping_data.#field_identity.push((#data_query_idx+inst_idx_offset, dep_idx));
                                }
                            }
                        });
                        break;
                    } else {
                        try_from_dependencies_vec_statements.push(quote! {
                            #field_identity: (&dependencies[#data_query_idx]).try_into_state_var()?,
                        });
                        initialize_data_struct_statements.push(quote! {
                            for (dep_idx, dep) in dependencies[#data_query_idx].iter().enumerate() {
                                mapping_data.#field_identity.push((#data_query_idx, dep_idx));
                            }
                        })
                    }
                }

                quote! {
                    impl TryFrom<&Vec<DependenciesCreatedForDataQuery>> for #structure_identity {
                        type Error = &'static str;
                        fn try_from(dependencies: &Vec<DependenciesCreatedForDataQuery>) -> Result<Self, Self::Error> {
                            let mut mapping_data = #data_identity::default();

                            #(#initialize_data_struct_statements)*

                            Ok(#structure_identity {
                                #(#try_from_dependencies_vec_statements)*
                                _data_query_mapping_data: mapping_data
                            })
                        }
                    }

                    impl #structure_identity {
                        /// Return the updates queued during by calls to `queue_update()`
                        /// on the dependencies of this `data` structure.
                        ///
                        /// Returns all queued updates since the last call to `return_queued_updates()`.
                        ///
                        /// The result of this function is intended to be sent as the return value
                        /// for `request_dependency_updates`.
                        fn return_queued_updates(&mut self) -> Vec<DependencyValueUpdateRequest> {
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

pub fn state_variable_data_queries_derive(input: TokenStream) -> TokenStream {
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

                    let data_query_name = format!("{}DataQueries", structure_name);

                    let data_query_identity = Ident::new(&data_query_name, Span::call_site());

                    for field_identity in field_identities.iter() {
                        if field_identity.to_string().starts_with('_') {
                            continue;
                        }

                        data_query_struct_statements.push(quote! {
                            pub #field_identity: Option<DataQuery>,
                        });

                        from_structure_to_vec_statements.push(quote! {
                            structure.#field_identity.as_ref().map(|inst| {
                                instruct_vec.push(inst.clone());
                            });
                        });
                    }

                    quote! {
                        #[derive(Debug, Default)]
                        struct #data_query_identity {
                            #(#data_query_struct_statements)*
                        }

                        impl From<&#data_query_identity> for Vec<DataQuery> {
                            fn from(structure: &#data_query_identity) -> Self {
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

                let data_name = if &structure_name[(sn_len - 3)..] == "ies" {
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

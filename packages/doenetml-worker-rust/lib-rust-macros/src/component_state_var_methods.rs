use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use proc_macro2::{Ident, Span};
use quote::quote;
use syn::{self, FieldsNamed};

use crate::util::{
    check_if_field_has_attribute, check_if_field_has_attribute_return_identities,
    find_type_from_state_var_with_generics,
};

pub fn component_state_variables_derive(input: TokenStream) -> TokenStream {
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
                let is_component_struct = field_identities
                    .iter()
                    .any(|ident| ident.to_string() == "common")
                    && field_identities
                        .iter()
                        .any(|ident| ident.to_string() == "state");

                if is_component_struct {
                    quote! {
                        impl ComponentStateVariables for #structure_identity {
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
                    let mut get_value_dependency_instructions_functions = Vec::new();

                    let renderer_state_variables_name =
                        format!("Rendered{}", structure_identity.to_string());
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
                            "component_profile_state_variables",
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
                            fn #get_index_function_identity() -> StateVarIdx {
                                #sv_idx
                            }
                        });

                        let get_instructions_function_name =
                            format!("get_{}_dependency_instructions", field_identity);
                        let get_instruction_function_identity =
                            Ident::new(&get_instructions_function_name, Span::call_site());

                        get_value_dependency_instructions_functions.push(quote! {
                            /// Get a `DependencyInstruction` that requests the value
                            /// of the specified state variable
                            fn #get_instruction_function_identity() -> DependencyInstruction {
                                DependencyInstruction::StateVar {
                                    component_idx: None,
                                    state_var_idx: #sv_idx,
                                }
                            }
                        });
                    }

                    quote! {
                        impl ComponentStateVariables for #structure_identity {

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

                            #(#get_value_dependency_instructions_functions)*

                        }

                    }
                }
            }
            _ => panic!("only named fields supported"),
        },
        _ => panic!("only structs and enums supported"),
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

                let mut try_from_dependencies_vec_statements = Vec::new();

                for (instruction_idx, field_identity) in field_identities.iter().enumerate() {
                    if check_if_field_has_attribute(
                        &named[instruction_idx],
                        "consume_remaining_instructions",
                    ) {
                        try_from_dependencies_vec_statements.push(quote! {
                        #field_identity: dependencies[#instruction_idx..].iter()
                        .flat_map(|instruction| {
                            instruction.try_into_state_var()
                        })
                        .collect::<Vec<_>>(),
                        });
                        break;
                    } else {
                        try_from_dependencies_vec_statements.push(quote! {
                        #field_identity: (&dependencies[#instruction_idx]).try_into_state_var()?,
                    });
                    }
                }

                quote! {
                    impl TryFrom<&Vec<DependenciesCreatedForInstruction>> for #structure_identity {
                        type Error = &'static str;
                        fn try_from(dependencies: &Vec<DependenciesCreatedForInstruction>) -> Result<Self, Self::Error> {
                            Ok(#structure_identity {
                                #(#try_from_dependencies_vec_statements)*
                            })
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

pub fn state_variable_dependency_instructions_derive(input: TokenStream) -> TokenStream {
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

                let num_instructions = field_identities.len();

                let structure_name = structure_identity.to_string();
                let len = structure_name.len();

                let structure_is_dependency_instructions =
                    len > 22 && &structure_name[(len - 22)..] == "DependencyInstructions";

                if structure_is_dependency_instructions {
                    let mut instructions_as_vec_statements = Vec::new();

                    for field_identity in field_identities.iter() {
                        instructions_as_vec_statements.push(quote! {
                            self.#field_identity.as_ref().map(|inst| {
                                instruct_vec.push(inst.clone());
                            });
                        });
                    }
                    quote! {

                        impl #structure_identity {
                            fn instructions_as_vec(&self) -> Vec<DependencyInstruction> {
                                let mut instruct_vec = Vec::with_capacity(#num_instructions);
                                #(#instructions_as_vec_statements)*
                                instruct_vec
                            }
                        }
                    }
                } else {
                    let mut dependency_instruction_struct_statements = Vec::new();

                    let mut instructions_as_vec_statements = Vec::new();

                    let dependency_instruction_name = if &structure_name[(len - 3)..] == "ies" {
                        format!("{}yInstructions", &structure_name[..(len - 3)])
                    } else {
                        format!("{}Instructions", structure_name)
                    };

                    let dependency_instruction_identity =
                        Ident::new(&dependency_instruction_name, Span::call_site());

                    for field_identity in field_identities.iter() {
                        dependency_instruction_struct_statements.push(quote! {
                            pub #field_identity: Option<DependencyInstruction>,
                        });

                        instructions_as_vec_statements.push(quote! {
                            self.#field_identity.as_ref().map(|inst| {
                                instruct_vec.push(inst.clone());
                            });
                        });
                    }

                    quote! {
                        #[derive(Debug, Default)]
                        pub struct #dependency_instruction_identity {
                            #(#dependency_instruction_struct_statements)*
                        }

                        impl #dependency_instruction_identity {
                            fn instructions_as_vec(&self) -> Vec<DependencyInstruction> {
                                let mut instruct_vec = Vec::with_capacity(#num_instructions);
                                #(#instructions_as_vec_statements)*
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

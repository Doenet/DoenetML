use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use quote::quote;
use syn::{self, FieldsNamed};

pub fn component_state_variables_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { named, .. }) => {
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
                        impl ComponentStateVariables for #name {
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

                            fn get_state_variable_index_from_name_case_insensitive(
                                &self,
                                name: &str,
                            ) -> Option<StateVarIdx> {
                                self.state.get_state_variable_index_from_name_case_insensitive(name)
                            }

                            fn get_component_profile_state_variables(&self) -> Vec<ComponentProfileStateVariable> {
                                self.state.get_component_profile_state_variables()

                            }
                        }
                    }
                } else {
                    let num_state_var = field_identities.len();

                    for f in named.iter() {}

                    let mut get_state_variable_arms = Vec::new();

                    for (sv_ind, field_identity) in named.iter().enumerate() {
                        get_state_variable_arms.push(quote! {
                            #sv_ind => self.#field_identity.try_into().unwrap()
                        })
                    }

                    quote! {
                        impl ComponentStateVariables for #name {

                            fn get_num_state_variables(&self) -> StateVarIdx {
                                #num_state_var
                            }

                            fn get_state_variable(&self, state_var_idx: StateVarIdx) -> &StateVarEnumRef {
                                match state_var_idx {
                                    #(#get_state_variable_arms)*
                                }
                            }

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

use proc_macro::TokenStream;
use quote::quote;
use syn;

// TODO: can we create these with macros?
// StateVarMutableView
// StateVarReadOnlyView
// StateVarValue
// For now, we have separate derive macros for StateVarMutableView and StateVarReadOnlyView,
// and we have directly coded methods for StateVarValue

/// Implement methods on the StateVar enum
pub fn state_var_methods_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Enum(v) => {
            let variants = &v.variants;
            let enum_ident = name;

            let mut state_var_mark_stale_arms = Vec::new();
            let mut state_var_get_freshness_arms = Vec::new();
            let mut state_var_get_restore_previous_value_arms = Vec::new();
            let mut state_var_get_used_default_arms = Vec::new();
            let mut state_var_create_read_only_view_arms = Vec::new();
            let mut state_var_get_fresh_value_arms = Vec::new();
            let mut state_var_request_change_value_to_arms = Vec::new();
            let mut state_var_record_rendered_arms = Vec::new();
            let mut state_var_check_if_changed_since_last_rendered_arms = Vec::new();
            let mut state_var_check_if_any_dependency_changed_since_last_viewed_arms = Vec::new();
            let mut state_var_record_all_dependencies_viewed_arms = Vec::new();
            let mut state_var_return_dependency_instructions_arms = Vec::new();
            let mut state_var_set_dependencies_arms = Vec::new();
            let mut state_var_calculate_state_var_from_dependencies_arms = Vec::new();
            let mut state_var_request_dependencies_to_update_value_arms = Vec::new();
            let mut state_var_get_name_arms = Vec::new();
            let mut state_var_return_for_renderer_arms = Vec::new();
            let mut state_var_return_initial_essential_value_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                // arms for StateVar

                state_var_mark_stale_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.mark_stale()
                    },
                });

                state_var_get_freshness_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.get_freshness()
                    },
                });

                state_var_get_restore_previous_value_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.restore_previous_value()
                    },
                });

                state_var_get_used_default_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.get_used_default()
                    },
                });

                state_var_create_read_only_view_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        StateVarReadOnlyView::#variant_ident(sv_typed.create_new_read_only_view())
                    },
                });

                state_var_get_fresh_value_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        // TODO: need .clone()?
                        StateVarValue::#variant_ident(sv_typed.get_fresh_value().clone())
                    },
                });

                state_var_request_change_value_to_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.request_change_value_to(requested_val.try_into().unwrap())
                    },
                });

                state_var_record_rendered_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.record_rendered()
                    },
                });

                state_var_check_if_changed_since_last_rendered_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.check_if_changed_since_last_rendered()
                    },
                });

                state_var_check_if_any_dependency_changed_since_last_viewed_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.check_if_any_dependency_changed_since_last_viewed()
                    },
                });

                state_var_record_all_dependencies_viewed_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.record_all_dependencies_viewed()
                    },
                });

                state_var_return_dependency_instructions_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.return_dependency_instructions()
                    },
                });

                state_var_set_dependencies_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.set_dependencies(dependencies)
                    },
                });

                state_var_calculate_state_var_from_dependencies_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.calculate_state_var_from_dependencies()
                    },
                });

                state_var_request_dependencies_to_update_value_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.request_dependencies_to_update_value(is_initial_change)
                    },
                });

                state_var_get_name_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.get_name()
                    },
                });

                state_var_return_for_renderer_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.return_for_renderer()
                    },
                });

                state_var_return_initial_essential_value_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        StateVarValue::#variant_ident(sv_typed.return_initial_essential_value())
                    },
                });
            }

            quote! {
                impl #enum_ident {
                    pub fn mark_stale(&mut self) {
                        match self {
                            #(#state_var_mark_stale_arms)*
                        }
                    }

                    pub fn get_freshness(&self) -> Freshness {
                        match self {
                            #(#state_var_get_freshness_arms)*
                        }
                    }

                    pub fn restore_previous_value(&self) {
                        match self {
                            #(#state_var_get_restore_previous_value_arms)*
                        }
                    }

                    pub fn get_used_default(&self) -> bool {
                        match self {
                            #(#state_var_get_used_default_arms)*
                        }
                    }

                    pub fn create_read_only_view(&self) -> StateVarReadOnlyView {
                        match self {
                            #(#state_var_create_read_only_view_arms)*
                        }
                    }

                    pub fn get_fresh_value(&self) -> StateVarValue {
                        match self {
                            #(#state_var_get_fresh_value_arms)*
                        }
                    }

                    pub fn request_change_value_to(&self, requested_val: StateVarValue) {
                        match self {
                            #(#state_var_request_change_value_to_arms)*
                        }
                    }

                    pub fn record_rendered(&mut self) {
                        match self {
                            #(#state_var_record_rendered_arms)*
                        }
                    }

                    pub fn check_if_changed_since_last_rendered(&self) -> bool {
                        match self {
                            #(#state_var_check_if_changed_since_last_rendered_arms)*
                        }
                    }

                    pub fn check_if_any_dependency_changed_since_last_viewed(&self) -> bool {
                        match self {
                            #(#state_var_check_if_any_dependency_changed_since_last_viewed_arms)*
                        }
                    }

                    pub fn record_all_dependencies_viewed(&mut self) {
                        match self {
                            #(#state_var_record_all_dependencies_viewed_arms)*
                        }
                    }

                    pub fn return_dependency_instructions(&self) -> Vec<DependencyInstruction> {
                        match self {
                            #(#state_var_return_dependency_instructions_arms)*
                        }
                    }

                    pub fn set_dependencies(&mut self, dependencies: &Vec<Vec<Dependency>>) {
                        match self {
                            #(#state_var_set_dependencies_arms)*
                        }
                    }

                    pub fn calculate_state_var_from_dependencies(&mut self) {
                        match self {
                            #(#state_var_calculate_state_var_from_dependencies_arms)*
                        }
                    }

                    pub fn request_dependencies_to_update_value(
                        &self,
                        is_initial_change: bool,
                    ) -> Result<Vec<UpdatesRequested>, ()> {
                        match self {
                            #(#state_var_request_dependencies_to_update_value_arms)*
                        }
                    }

                    pub fn get_name(&self) -> &'static str {
                        match self {
                            #(#state_var_get_name_arms)*
                        }
                    }

                    pub fn return_for_renderer(&self) -> bool {
                        match self {
                            #(#state_var_return_for_renderer_arms)*
                        }
                    }

                    pub fn return_initial_essential_value(&self) -> StateVarValue {
                        match self {
                            #(#state_var_return_initial_essential_value_arms)*
                        }
                    }


                }

            }
        }
        _ => panic!("only enums supported"),
    };
    output.into()
}

/// Implement methods on the StateVarMutableView enum
pub fn state_var_mutable_view_methods_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let data = &ast.data;

    // Note: explicitly use StateVarMutableView rather than #enum_ident
    // in hopes that can merge this with state_var_methods_derive
    // (if can create StateVarMutableView itself with the macro)

    let output = match data {
        syn::Data::Enum(v) => {
            let variants = &v.variants;

            let mut state_var_mutable_view_new_with_value_arms = Vec::new();
            let mut state_var_mutable_view_mark_stale_arms = Vec::new();
            let mut state_var_mutable_view_get_freshness_arms = Vec::new();
            let mut state_var_mutable_view_get_used_default_arms = Vec::new();
            let mut state_var_mutable_view_create_read_only_view_arms = Vec::new();
            let mut state_var_mutable_view_get_fresh_value_arms = Vec::new();
            let mut state_var_mutable_view_set_value_to_requested_value_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                state_var_mutable_view_new_with_value_arms.push(quote! {
                    StateVarValue::#variant_ident(val) => {
                        StateVarMutableView::#variant_ident(
                            StateVarMutableViewTyped::new_with_value(val, used_default),
                        )
                    },
                });

                state_var_mutable_view_mark_stale_arms.push(quote! {
                    StateVarMutableView::#variant_ident(sv_typed) => {
                        sv_typed.mark_stale()
                    },
                });

                state_var_mutable_view_get_freshness_arms.push(quote! {
                    StateVarMutableView::#variant_ident(sv_typed) => {
                        sv_typed.get_freshness()
                    },
                });

                state_var_mutable_view_get_used_default_arms.push(quote! {
                    StateVarMutableView::#variant_ident(sv_typed) => {
                        sv_typed.get_used_default()
                    },
                });

                state_var_mutable_view_create_read_only_view_arms.push(quote! {
                    StateVarMutableView::#variant_ident(sv_typed) => {
                        StateVarReadOnlyView::#variant_ident(sv_typed.create_new_read_only_view())
                    },
                });

                state_var_mutable_view_get_fresh_value_arms.push(quote! {
                    StateVarMutableView::#variant_ident(sv_typed) => {
                        // TODO: need .clone()?
                        StateVarValue::#variant_ident(sv_typed.get_fresh_value().clone())
                    },
                });

                state_var_mutable_view_set_value_to_requested_value_arms.push(quote! {
                    StateVarMutableView::#variant_ident(sv_typed) => {
                        sv_typed.set_value_to_requested_value()
                    },
                });
            }

            quote! {

                impl StateVarMutableView {
                    pub fn new_with_value(sv_val: StateVarValue, used_default: bool) -> Self {
                        match sv_val {
                            #(#state_var_mutable_view_new_with_value_arms)*
                        }
                    }

                    pub fn mark_stale(&mut self) {
                        match self {
                            #(#state_var_mutable_view_mark_stale_arms)*
                        };
                    }

                    pub fn get_freshness(&self) -> Freshness {
                        match self {
                            #(#state_var_mutable_view_get_freshness_arms)*
                        }
                    }

                    pub fn get_used_default(&self) -> bool {
                        match self {
                            #(#state_var_mutable_view_get_used_default_arms)*
                        }
                    }
                    pub fn create_read_only_view(&self) -> StateVarReadOnlyView {
                        match self {
                            #(#state_var_mutable_view_create_read_only_view_arms)*
                        }
                    }

                    pub fn get_fresh_value(&self) -> StateVarValue {
                        match self {
                            #(#state_var_mutable_view_get_fresh_value_arms)*
                        }
                    }

                    pub fn set_value_to_requested_value(&self) {
                        match self {
                            #(#state_var_mutable_view_set_value_to_requested_value_arms)*
                        }
                    }

                }


            }
        }
        _ => panic!("only enums supported"),
    };
    output.into()
}

/// Implement methods on the StateVarReadOnlyView enum
pub fn state_var_read_only_view_methods_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let data = &ast.data;

    // Note: explicitly use StateVarReadOnlyView rather than #enum_ident
    // in hopes that can merge this with state_var_methods_derive
    // (if can create StateVarReadOnlyView itself with the macro)

    let output = match data {
        syn::Data::Enum(v) => {
            let variants = &v.variants;

            let mut state_var_read_only_view_get_freshness_arms = Vec::new();
            let mut state_var_read_only_view_get_used_default_arms = Vec::new();
            let mut state_var_read_only_view_get_fresh_value_arms = Vec::new();
            let mut state_var_read_only_view_create_new_read_only_view_arms = Vec::new();
            let mut state_var_read_only_view_check_if_changed_since_last_viewed_arms = Vec::new();
            let mut state_var_read_only_view_record_viewed_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                state_var_read_only_view_get_freshness_arms.push(quote! {
                    StateVarReadOnlyView::#variant_ident(sv_typed) => {
                        sv_typed.get_freshness()
                    },
                });

                state_var_read_only_view_get_used_default_arms.push(quote! {
                    StateVarReadOnlyView::#variant_ident(sv_typed) => {
                        sv_typed.get_used_default()
                    },
                });

                state_var_read_only_view_get_fresh_value_arms.push(quote! {
                    StateVarReadOnlyView::#variant_ident(sv_typed) => {
                        // TODO: need .clone()?
                        StateVarValue::#variant_ident(sv_typed.get_fresh_value().clone())
                    },
                });

                state_var_read_only_view_create_new_read_only_view_arms.push(quote! {
                    StateVarReadOnlyView::#variant_ident(sv_typed) => {
                        StateVarReadOnlyView::#variant_ident(sv_typed.create_new_read_only_view())
                    },
                });

                state_var_read_only_view_check_if_changed_since_last_viewed_arms.push(quote! {
                    StateVarReadOnlyView::#variant_ident(sv_typed) => {
                        sv_typed.check_if_changed_since_last_viewed()
                    },
                });

                state_var_read_only_view_record_viewed_arms.push(quote! {
                    StateVarReadOnlyView::#variant_ident(sv_typed) => {
                        sv_typed.record_viewed()
                    },
                });
            }

            quote! {

                impl StateVarReadOnlyView {
                    pub fn get_freshness(&self) -> Freshness {
                        match self {
                            #(#state_var_read_only_view_get_freshness_arms)*
                        }
                    }

                    pub fn get_used_default(&self) -> bool {
                        match self {
                            #(#state_var_read_only_view_get_used_default_arms)*
                        }
                    }

                    pub fn get_fresh_value(&self) -> StateVarValue {
                        match self {
                            #(#state_var_read_only_view_get_fresh_value_arms)*
                        }
                    }

                    pub fn create_new_read_only_view(&self) -> StateVarReadOnlyView {
                        match self {
                            #(#state_var_read_only_view_create_new_read_only_view_arms)*
                        }
                    }

                    pub fn check_if_changed_since_last_viewed(&self) -> bool {
                        match self {
                            #(#state_var_read_only_view_check_if_changed_since_last_viewed_arms)*
                        }
                    }

                    pub fn record_viewed(&mut self) {
                        match self {
                            #(#state_var_read_only_view_record_viewed_arms)*
                        }
                    }


                }

            }
        }
        _ => panic!("only enums supported"),
    };
    output.into()
}

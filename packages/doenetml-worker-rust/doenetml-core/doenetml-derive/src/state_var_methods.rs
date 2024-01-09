use proc_macro::TokenStream;
use quote::quote;
use syn::{self, Fields, FieldsUnnamed};

use crate::util::find_type_from_state_var_typed;

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

    // eprintln!("save var methods derive {:#?}", ast);

    let output = match data {
        syn::Data::Enum(v) => {
            let variants = &v.variants;
            let enum_ident = name;

            let mut state_var_mark_stale_arms = Vec::new();
            let mut state_var_set_as_resolved_arms = Vec::new();
            let mut state_var_get_freshness_arms = Vec::new();
            let mut state_var_get_restore_previous_value_arms = Vec::new();
            let mut state_var_get_used_default_arms = Vec::new();
            let mut state_var_create_read_only_view_arms = Vec::new();
            let mut state_var_get_fresh_value_arms = Vec::new();
            let mut state_var_request_change_value_to_arms = Vec::new();
            let mut state_var_check_if_any_dependency_changed_since_last_viewed_arms = Vec::new();
            let mut state_var_record_all_dependencies_viewed_arms = Vec::new();
            let mut state_var_return_dependency_instructions_arms = Vec::new();
            let mut state_var_set_dependencies_arms = Vec::new();
            let mut state_var_calculate_state_var_from_dependencies_and_mark_fresh_arms =
                Vec::new();
            let mut state_var_request_dependencies_to_update_value_arms = Vec::new();
            let mut state_var_get_name_arms = Vec::new();
            let mut state_var_get_for_renderer_arms = Vec::new();
            let mut state_var_get_is_public_arms = Vec::new();
            let mut state_var_return_initial_essential_value_arms = Vec::new();

            let mut impl_try_from_state_var_value_to_state_var_typed_variants = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                if let Fields::Unnamed(FieldsUnnamed { unnamed, .. }) = &variant.fields {
                    if let Some(state_var_type) = find_type_from_state_var_typed(&unnamed[0].ty) {
                        let mut try_from_variant_arms = Vec::new();

                        for variant2 in variants {
                            let variant2_ident = &variant2.ident;

                            if variant2_ident == variant_ident {
                                try_from_variant_arms.push(quote! {
                                    StateVarValue::#variant2_ident(x) => Ok(x.clone()),
                                });
                            } else if variant2_ident == "Integer" && variant_ident == "Number" {
                                try_from_variant_arms.push(quote! {
                                    StateVarValue::#variant2_ident(x) => Ok(x as f64),
                                });
                            } else {
                                let err_msg = &format!(
                                    "Cannot convert StateVarValue::{} to {}",
                                    &variant2_ident.to_string(),
                                    &variant_ident.to_string()
                                );
                                try_from_variant_arms.push(quote! {
                                    StateVarValue::#variant2_ident(_) => Err(#err_msg),
                                });
                            }
                        }

                        impl_try_from_state_var_value_to_state_var_typed_variants.push(quote! {
                            impl TryFrom<StateVarValue> for #state_var_type {
                                type Error = &'static str;
                                fn try_from(v: StateVarValue) -> Result<Self, Self::Error> {
                                    match v {
                                        #(#try_from_variant_arms)*
                                    }
                                }
                            }
                        });
                    }
                }

                // arms for StateVar

                state_var_mark_stale_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.mark_stale()
                    },
                });

                state_var_set_as_resolved_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.set_as_resolved()
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
                        sv_typed.return_dependency_instructions(extend_source)
                    },
                });

                state_var_set_dependencies_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.set_dependencies(dependencies)
                    },
                });

                state_var_calculate_state_var_from_dependencies_and_mark_fresh_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.calculate_state_var_from_dependencies_and_mark_fresh()
                    },
                });

                state_var_request_dependencies_to_update_value_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.request_dependencies_to_update_value(is_direct_change_from_renderer)
                    },
                });

                state_var_get_name_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.get_name()
                    },
                });

                state_var_get_for_renderer_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.get_for_renderer()
                    },
                });

                state_var_get_is_public_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        sv_typed.get_is_public()
                    },
                });

                state_var_return_initial_essential_value_arms.push(quote! {
                    #enum_ident::#variant_ident(sv_typed) => {
                        StateVarValue::#variant_ident(sv_typed.return_initial_essential_value())
                    },
                });
            }

            quote! {

                #(#impl_try_from_state_var_value_to_state_var_typed_variants)*

                impl #enum_ident {
                    /// If the state variable is Fresh, set its freshness to Stale.
                    ///
                    /// Panics: if the state variable is Unresolved or Resolved.
                    pub fn mark_stale(&self) {
                        match self {
                            #(#state_var_mark_stale_arms)*
                        }
                    }

                    /// If the state variable is Unresolved, set its freshness to Resolved.
                    ///
                    /// Panics: if the state variable is Fresh or Stale.
                    pub fn set_as_resolved(&self) {
                        match self {
                            #(#state_var_set_as_resolved_arms)*
                        }
                    }

                    /// Return the current freshness of the variable
                    ///
                    /// Possible values
                    /// - Fresh: the state variable value has been calculated and can be accessed with `get_fresh_value()`.
                    ///   Calls to `set_as_resolved()` will panic.
                    /// - Stale: a dependency value has changed so that the state variable value needs to be recalculated.
                    ///   Calls to `get_fresh_value()` and `set_as_resolved()` will panic.
                    /// - Unresolved: the dependencies for the state variable have not yet been calculated.
                    ///   Calls to `get_fresh_value()`, `restore_previous_value()`, or `mark_stale()` will panic.
                    /// - Resolved: the dependencies for the state variable have been created,
                    ///   but the value has never been calculated.
                    ///   Calls to `get_fresh_value()`, `restore_previous_value()`, or `mark_stale()` will panic.
                    pub fn get_freshness(&self) -> Freshness {
                        match self {
                            #(#state_var_get_freshness_arms)*
                        }
                    }

                    /// If the state variable is Stale, mark it as Fresh
                    /// so that the value it had before `mark_stale` was called
                    /// will be its fresh value again.
                    ///
                    /// Panics: if the state variable is Unresolved.
                    pub fn restore_previous_value(&self) {
                        match self {
                            #(#state_var_get_restore_previous_value_arms)*
                        }
                    }

                    /// Returns whether or not the value of this state variable was set using its default value.
                    pub fn get_used_default(&self) -> bool {
                        match self {
                            #(#state_var_get_used_default_arms)*
                        }
                    }

                    /// Create a new read-only view of the value of this state variable.
                    ///
                    /// Each view will access the same value (and freshness)
                    /// but each view separately tracks whether or not it has changed
                    /// since it was last viewed.
                    pub fn create_new_read_only_view(&self) -> StateVarReadOnlyView {
                        match self {
                            #(#state_var_create_read_only_view_arms)*
                        }
                    }

                    /// Get the value of the state variable, assuming it is fresh
                    ///
                    /// Panics if the state variable is not fresh.
                    pub fn get_fresh_value(&self) -> StateVarValue {
                        match self {
                            #(#state_var_get_fresh_value_arms)*
                        }
                    }

                    /// Records on the state variable the requested value of the state variable.
                    /// This requested value will be used in a future call to
                    /// `request_dependencies_to_update_value()`.
                    ///
                    /// Panics if the type of requested_value does not match the type of this StateVar.
                    pub fn request_change_value_to(&self, requested_val: StateVarValue) {
                        match self {
                            #(#state_var_request_change_value_to_arms)*
                        }
                    }

                    /// Check if any of the dependencies of the state variable has changed
                    /// since the last call to `record_all_dependencies_viewed()`.
                    ///
                    /// This function doesn't check if the values of the state variables
                    /// have actually changed to a new value. It only checks if a call
                    /// to `set_value()` has occurred.
                    pub fn check_if_any_dependency_changed_since_last_viewed(&self) -> bool {
                        match self {
                            #(#state_var_check_if_any_dependency_changed_since_last_viewed_arms)*
                        }
                    }

                    /// Record the fact that all dependencies for the state variable have been viewed.
                    /// Future calls to `check_if_any_dependency_changed_since_last_viewed()`
                    /// will then determine if a dependency has changed since that moment.
                    pub fn record_all_dependencies_viewed(&mut self) {
                        match self {
                            #(#state_var_record_all_dependencies_viewed_arms)*
                        }
                    }

                    /// Return a vector dependency instructions, which will be used to
                    /// calculate dependencies from the document structure.
                    pub fn return_dependency_instructions(&self, extend_source: Option<&ExtendSource>) -> Vec<DependencyInstruction> {
                        match self {
                            #(#state_var_return_dependency_instructions_arms)*
                        }
                    }

                    /// Set the dependencies for the state variable based on the `dependencies` argument.
                    ///
                    /// The dependencies passed into this function should be calculated from
                    /// the dependency instructions returned by a previous call to
                    /// `return_dependency_instructions()` as well as the document structure.
                    ///
                    /// The dependencies are saved to the state variable and will be used
                    /// in calls to `calculate_state_var_from_dependencies_and_mark_fresh()`
                    /// and `request_dependencies_to_update_value()`.
                    pub fn set_dependencies(&mut self, dependencies: &Vec<Vec<Dependency>>) {
                        match self {
                            #(#state_var_set_dependencies_arms)*
                        }
                    }

                    /// Calculate the value of the state variable from the fresh values of the dependencies,
                    /// marking the state variable as fresh.
                    ///
                    /// Panics if any of the state variables of the dependencies are not fresh.
                    ///
                    /// Uses the dependencies that were saved to the state variable
                    /// with a call to `set_dependencies()`.
                    ///
                    /// The value is stored in the state variable and can be retrieved by calling
                    /// `get_fresh_value()`.
                    pub fn calculate_state_var_from_dependencies_and_mark_fresh(&self) {
                        match self {
                            #(#state_var_calculate_state_var_from_dependencies_and_mark_fresh_arms)*
                        }
                    }

                    /// Assuming that the requested value for this state variable has already been set,
                    /// calculate the desired values of the dependencies
                    /// that will lead to that requested value being calculated from those dependencies.
                    ///
                    /// These desired dependency values will be stored directly on the state variables
                    /// or essential data of the dependencies.
                    ///
                    /// Returns: a result that is either
                    /// - a vector containing just the identities specifying which dependencies have requested new values, or
                    /// - an Err if the state variable is unable to change to the requested value.
                    ///
                    /// The `is_direct_change_from_renderer` argument is true if the requested value
                    /// came directly from an action of the renderer
                    /// (as opposed to coming from another state variable that depends on this variable).
                    pub fn request_dependencies_to_update_value(
                        &self,
                        is_direct_change_from_renderer: bool,
                    ) -> Result<Vec<DependencyValueUpdateRequest>, ()> {
                        match self {
                            #(#state_var_request_dependencies_to_update_value_arms)*
                        }
                    }

                    /// Returns the value of the `name` parameters that was specified
                    /// when this state variable was defined.
                    pub fn get_name(&self) -> &'static str {
                        match self {
                            #(#state_var_get_name_arms)*
                        }
                    }

                    /// Returns whether or not the `for_renderer` parameter
                    /// was specified to be true when the state variable was defined.
                    ///
                    /// The `for_renderer` parameters determine if this state variable value
                    /// should be sent to the renderer.
                    pub fn get_for_renderer(&self) -> bool {
                        match self {
                            #(#state_var_get_for_renderer_arms)*
                        }
                    }

                    /// Returns whether or not the `is_public` parameter
                    /// was specified to be true when the state variable was defined.
                    ///
                    /// The `is_public` parameters determine if this state variable value
                    /// can be referenced by a macro.
                    pub fn get_is_public(&self) -> bool {
                        match self {
                            #(#state_var_get_is_public_arms)*
                        }
                    }

                    /// Returns the value of the `initial_essential_value` parameters
                    /// specified when the state variable was defined.
                    ///
                    /// If no `initial_essential_value` parameter was specified,
                    /// this function will return the default value for the type of state variable,
                    /// which presumably will be meaningless.
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
            let mut state_var_mutable_view_set_as_resolved_arms = Vec::new();
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

                state_var_mutable_view_set_as_resolved_arms.push(quote! {
                    StateVarMutableView::#variant_ident(sv_typed) => {
                        sv_typed.set_as_resolved()
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
                    /// Creates a new mutable view of a state variable
                    ///
                    /// Intended for creating essential data, as it creates a StateVarMutableView
                    /// that is disconnected from any StateVar.
                    ///
                    /// The type of state variable created is determined by the type of `sv_val`.
                    pub fn new_with_value(sv_val: StateVarValue, used_default: bool) -> Self {
                        match sv_val {
                            #(#state_var_mutable_view_new_with_value_arms)*
                        }
                    }

                    /// If the state variable is Fresh, set its freshness to Stale.
                    ///
                    /// Panics: if the state variable is Unresolved.
                    pub fn mark_stale(&mut self) {
                        match self {
                            #(#state_var_mutable_view_mark_stale_arms)*
                        };
                    }

                    /// If the state variable is Unresolved, set its freshness to Resolved.
                    ///
                    /// Panics: if the state variable is Fresh or Stale.
                    pub fn set_as_resolved(&self) {
                        match self {
                            #(#state_var_mutable_view_set_as_resolved_arms)*
                        }
                    }

                    /// Return the current freshness of the variable
                    ///
                    /// Possible values
                    /// - Fresh: the state variable value has been calculated and can be accessed with `get_fresh_value()`.
                    ///   Calls to `set_as_resolved()` will panic.
                    /// - Stale: a dependency value has changed so that the state variable value needs to be recalculated.
                    ///   Calls to `get_fresh_value()` and `set_as_resolved()` will panic.
                    /// - Unresolved: the dependencies for the state variable have not yet been calculated.
                    ///   Calls to `get_fresh_value()`, `restore_previous_value()`, or `mark_stale()` will panic.
                    /// - Resolved: the dependencies for the state variable have been created,
                    ///   but the value has never been calculated.
                    ///   Calls to `get_fresh_value()`, `restore_previous_value()`, or `mark_stale()` will panic.
                    pub fn get_freshness(&self) -> Freshness {
                        match self {
                            #(#state_var_mutable_view_get_freshness_arms)*
                        }
                    }

                    /// Returns whether or not the value of this state variable was set using its default value.
                    pub fn get_used_default(&self) -> bool {
                        match self {
                            #(#state_var_mutable_view_get_used_default_arms)*
                        }
                    }

                    /// Create a new read-only view of the value of this state variable.
                    ///
                    /// Each view will access the same value (and freshness)
                    /// but each view separately tracks whether or not it has changed
                    /// since it was last viewed.
                    pub fn create_new_read_only_view(&self) -> StateVarReadOnlyView {
                        match self {
                            #(#state_var_mutable_view_create_read_only_view_arms)*
                        }
                    }

                    /// Get the value of the state variable, assuming it is fresh
                    ///
                    /// Panics if the state variable is not fresh.
                    pub fn get_fresh_value(&self) -> StateVarValue {
                        match self {
                            #(#state_var_mutable_view_get_fresh_value_arms)*
                        }
                    }

                    /// Set the value of this state variable to the value of the requested value
                    /// currently set for the variable.
                    ///
                    /// This function should only be called on essential data,
                    /// as other variables should be calculated from their dependencies.
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

                    /// Return the current freshness of the variable
                    ///
                    /// Possible values
                    /// - Fresh: the state variable value has been calculated and can be accessed with `get_fresh_value()`.
                    /// - Stale: a dependency value has changed so that the state variable value needs to be recalculated.
                    ///   Calls to `get_fresh_value()` will panic.
                    /// - Unresolved: the dependencies for the state variable have not yet been calculated.
                    ///   Calls to `get_fresh_value()`, `restore_previous_value()`, or `mark_stale()` will panic.
                    pub fn get_freshness(&self) -> Freshness {
                        match self {
                            #(#state_var_read_only_view_get_freshness_arms)*
                        }
                    }

                    /// Returns whether or not the value of this state variable was set using its default value.
                    pub fn get_used_default(&self) -> bool {
                        match self {
                            #(#state_var_read_only_view_get_used_default_arms)*
                        }
                    }

                    /// Get the value of the state variable, assuming it is fresh
                    ///
                    /// Panics if the state variable is not fresh.
                    pub fn get_fresh_value(&self) -> StateVarValue {
                        match self {
                            #(#state_var_read_only_view_get_fresh_value_arms)*
                        }
                    }

                    /// Create a new read-only view of the value of this state variable.
                    ///
                    /// Each view will access the same value (and freshness)
                    /// but each view separately tracks whether or not it has changed
                    /// since it was last viewed.
                    pub fn create_new_read_only_view(&self) -> StateVarReadOnlyView {
                        match self {
                            #(#state_var_read_only_view_create_new_read_only_view_arms)*
                        }
                    }

                    /// Check if the state variable has changed since `record_viewed()` on this view was last called.
                    ///
                    /// This function doesn't check if the values of the state variables
                    /// have actually changed to a new value. It only checks if a call
                    /// to `set_value()` has occurred.
                    pub fn check_if_changed_since_last_viewed(&self) -> bool {
                        match self {
                            #(#state_var_read_only_view_check_if_changed_since_last_viewed_arms)*
                        }
                    }

                    /// Record the fact that this view of the state variable has been viewed.
                    /// Future calls to `check_if_changed_since_last_viewed()`
                    /// will then determine if the state variable has changed since that moment.
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

use proc_macro::TokenStream;
use quote::quote;
use syn::{self, Fields, FieldsUnnamed};

use crate::util::find_type_from_prop;

/// Implement methods on PropEnum, PropEnumRef, and PropEnumRefMut that don't require mut
pub fn prop_methods_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;
    let generics = &ast.generics;

    // eprintln!("save var methods derive {:#?}", ast);

    let output = match data {
        syn::Data::Enum(v) => {
            let variants = &v.variants;
            let enum_ident = name;

            let mut prop_mark_stale_arms = Vec::new();
            let mut prop_set_as_resolved_arms = Vec::new();
            let mut prop_get_status_arms = Vec::new();
            let mut prop_get_mark_fresh_arms = Vec::new();
            let mut prop_came_from_default_arms = Vec::new();
            let mut prop_create_read_only_view_arms = Vec::new();
            let mut prop_get_arms = Vec::new();
            let mut prop_request_change_value_to_arms = Vec::new();
            let mut prop_check_if_any_dependency_changed_since_last_viewed_arms = Vec::new();
            let mut prop_default_arms = Vec::new();
            let mut get_matching_component_profile_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                prop_mark_stale_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.mark_stale()
                    },
                });

                prop_set_as_resolved_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.set_as_resolved()
                    },
                });

                prop_get_status_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.get_status()
                    },
                });

                prop_get_mark_fresh_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.mark_fresh()
                    },
                });

                prop_came_from_default_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.came_from_default()
                    },
                });

                prop_create_read_only_view_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        PropViewEnum::#variant_ident(prop.create_new_read_only_view())
                    },
                });

                prop_get_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        // TODO: need .clone()?
                        PropValue::#variant_ident(prop.get().clone())
                    },
                });

                prop_request_change_value_to_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.set_requested_value(requested_val.try_into().unwrap())
                    },
                });

                prop_check_if_any_dependency_changed_since_last_viewed_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.check_if_any_dependency_changed_since_last_viewed()
                    },
                });

                prop_default_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        PropValue::#variant_ident(prop.default())
                    },
                });

                get_matching_component_profile_arms.push(quote! {
                    #enum_ident::#variant_ident(_prop) => {
                        ComponentProfile::#variant_ident
                    },
                })
            }

            quote! {

                impl #generics #enum_ident #generics {
                    /// If the prop is Fresh, set its status to Stale.
                    ///
                    /// Panics: if the prop is Unresolved or Resolved.
                    pub fn mark_stale(&self) {
                        match self {
                            #(#prop_mark_stale_arms)*
                        }
                    }

                    /// If the prop is Unresolved, set its status to Resolved.
                    ///
                    /// Panics: if the prop is Fresh or Stale.
                    pub fn set_as_resolved(&self) {
                        match self {
                            #(#prop_set_as_resolved_arms)*
                        }
                    }

                    /// Return the current status of the variable
                    ///
                    /// Possible values
                    /// - Fresh: the prop value has been calculated and can be accessed with `get()`.
                    ///   Calls to `set_as_resolved()` will panic.
                    /// - Stale: a dependency value has changed so that the prop value needs to be recalculated.
                    ///   Calls to `get()` and `set_as_resolved()` will panic.
                    /// - Unresolved: the dependencies for the prop have not yet been calculated.
                    ///   Calls to `get()`, `mark_fresh()`, or `mark_stale()` will panic.
                    /// - Resolved: the dependencies for the prop have been created,
                    ///   but the value has never been calculated.
                    ///   Calls to `get()`, `mark_fresh()`, or `mark_stale()` will panic.
                    pub fn get_status(&self) -> PropStatus {
                        match self {
                            #(#prop_get_status_arms)*
                        }
                    }

                    /// If the prop is Stale, mark it as Fresh
                    /// so that the value it had before `mark_stale` was called
                    /// will be its fresh value again.
                    ///
                    /// Panics: if the prop is Unresolved.
                    pub fn mark_fresh(&self) {
                        match self {
                            #(#prop_get_mark_fresh_arms)*
                        }
                    }

                    /// Returns whether or not the value of this prop was set using its default value.
                    pub fn came_from_default(&self) -> bool {
                        match self {
                            #(#prop_came_from_default_arms)*
                        }
                    }

                    /// Create a new read-only view of the value of this prop.
                    ///
                    /// Each view will access the same value (and status)
                    /// but each view separately tracks whether or not it has changed
                    /// since it was last viewed.
                    pub fn create_new_read_only_view(&self) -> PropViewEnum {
                        match self {
                            #(#prop_create_read_only_view_arms)*
                        }
                    }

                    /// Get the value of the prop, assuming it is fresh
                    ///
                    /// Panics if the prop is not fresh.
                    pub fn get(&self) -> PropValue {
                        match self {
                            #(#prop_get_arms)*
                        }
                    }

                    /// Records on the prop the requested value of the prop.
                    /// This requested value will be used in a future call to
                    /// `invert()`.
                    ///
                    /// Panics if the type of requested_value does not match the type of this PropEnum.
                    pub fn set_requested_value(&self, requested_val: PropValue) {
                        match self {
                            #(#prop_request_change_value_to_arms)*
                        }
                    }

                    /// Check if any of the dependencies of the prop has changed
                    /// since the last call to `mark_all_dependencies_viewed()`.
                    ///
                    /// This function doesn't check if the values of the props
                    /// have actually changed to a new value. It only checks if a call
                    /// to `set_value()` has occurred.
                    pub fn check_if_any_dependency_changed_since_last_viewed(&self) -> bool {
                        match self {
                            #(#prop_check_if_any_dependency_changed_since_last_viewed_arms)*
                        }
                    }

                    /// Returns the value of the `default_value` parameter
                    /// specified when the prop was defined.
                    ///
                    /// If no `default_value` parameter was specified,
                    /// this function will return the default value for the type of prop.
                    pub fn default(&self) -> PropValue {
                        match self {
                            #(#prop_default_arms)*
                        }
                    }

                    pub fn get_matching_component_profile(&self) -> ComponentProfile {
                        match self {
                            #(#get_matching_component_profile_arms)*
                        }
                    }

                }

            }
        }
        _ => panic!("only enums supported"),
    };
    output.into()
}

/// Implement methods on PropEnum and PropEnumRefMut that require mut
pub fn prop_methods_mut_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;
    let generics = &ast.generics;

    // eprintln!("save var methods derive {:#?}", ast);

    let output = match data {
        syn::Data::Enum(v) => {
            let variants = &v.variants;
            let enum_ident = name;

            let mut prop_mark_all_dependencies_viewed_arms = Vec::new();
            let mut prop_return_data_queries_arms = Vec::new();
            let mut prop_save_dependencies_arms = Vec::new();
            let mut prop_calculate_and_mark_fresh_arms = Vec::new();
            let mut prop_invert_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                prop_mark_all_dependencies_viewed_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.mark_all_dependencies_viewed()
                    },
                });

                prop_return_data_queries_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.return_data_queries()
                    },
                });

                prop_save_dependencies_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.save_dependencies(dependencies)
                    },
                });

                prop_calculate_and_mark_fresh_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.calculate_and_mark_fresh()
                    },
                });

                prop_invert_arms.push(quote! {
                    #enum_ident::#variant_ident(prop) => {
                        prop.invert(is_direct_change_from_action)
                    },
                });
            }

            quote! {

                impl #generics #enum_ident #generics {
                    /// Record the fact that all dependencies for the prop have been viewed.
                    /// Future calls to `check_if_any_dependency_changed_since_last_viewed()`
                    /// will then determine if a dependency has changed since that moment.
                    pub fn mark_all_dependencies_viewed(&mut self) {
                        match self {
                            #(#prop_mark_all_dependencies_viewed_arms)*
                        }
                    }

                    /// Return a vector data queries, which will be used to
                    /// calculate dependencies from the document structure.
                    pub fn return_data_queries(&mut self) -> Vec<DataQuery> {
                        match self {
                            #(#prop_return_data_queries_arms)*
                        }
                    }

                    /// Set the dependencies for the prop based on the `dependencies` argument.
                    ///
                    /// The dependencies passed into this function should be calculated from
                    /// the data queries returned by a previous call to
                    /// `return_data_queries()` as well as the document structure.
                    ///
                    /// The dependencies are saved to the prop and will be used
                    /// in calls to `calculate_and_mark_fresh()`
                    /// and `invert()`.
                    pub fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForDataQuery>) {
                        match self {
                            #(#prop_save_dependencies_arms)*
                        }
                    }

                    /// Calculate the value of the prop from the fresh values of the dependencies,
                    /// marking the prop as fresh.
                    ///
                    /// Panics if any of the props of the dependencies are not fresh.
                    ///
                    /// Uses the dependencies that were saved to the prop
                    /// with a call to `save_dependencies()`.
                    ///
                    /// The value is stored in the prop and can be retrieved by calling
                    /// `get()`.
                    ///
                    /// Return whether or not the value changed
                    pub fn calculate_and_mark_fresh(&mut self) -> bool{
                        match self {
                            #(#prop_calculate_and_mark_fresh_arms)*
                        }
                    }

                    /// Assuming that the requested value for this prop has already been set,
                    /// calculate the desired values of the dependencies
                    /// that will lead to that requested value being calculated from those dependencies.
                    ///
                    /// These desired dependency values will be stored directly on the dependent props.
                    ///
                    /// Returns: a result that is either
                    /// - a vector containing just the identities specifying which dependencies have requested new values, or
                    /// - an Err if the prop is unable to change to the requested value.
                    ///
                    /// The `is_direct_change_from_action` argument is true if the requested value
                    /// came directly from an action of the renderer
                    /// (as opposed to coming from another prop that depends on this variable).
                    pub fn invert(
                        &mut self,
                        is_direct_change_from_action: bool,
                    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
                        match self {
                            #(#prop_invert_arms)*
                        }
                    }

                }

            }
        }
        _ => panic!("only enums supported"),
    };
    output.into()
}

/// Implement methods on the PropViewMutEnum enum
pub fn prop_mutable_view_methods_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let data = &ast.data;

    // Note: explicitly use PropViewMutEnum rather than #enum_ident
    // in hopes that can merge this with prop_methods_derive
    // (if can create PropViewMutEnum itself with the macro)

    let output = match data {
        syn::Data::Enum(v) => {
            let variants = &v.variants;

            let mut prop_mutable_view_new_with_value_arms = Vec::new();
            let mut prop_mutable_view_mark_stale_arms = Vec::new();
            let mut prop_mutable_view_set_as_resolved_arms = Vec::new();
            let mut prop_mutable_view_get_status_arms = Vec::new();
            let mut prop_mutable_view_came_from_default_arms = Vec::new();
            let mut prop_mutable_view_create_read_only_view_arms = Vec::new();
            let mut prop_mutable_view_get_arms = Vec::new();
            let mut prop_mutable_view_set_value_to_requested_value_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                prop_mutable_view_new_with_value_arms.push(quote! {
                    PropValue::#variant_ident(val) => {
                        PropViewMutEnum::#variant_ident(
                            PropViewMut::new_with_value(val, came_from_default),
                        )
                    },
                });

                prop_mutable_view_mark_stale_arms.push(quote! {
                    PropViewMutEnum::#variant_ident(prop) => {
                        prop.mark_stale()
                    },
                });

                prop_mutable_view_set_as_resolved_arms.push(quote! {
                    PropViewMutEnum::#variant_ident(prop) => {
                        prop.set_as_resolved()
                    },
                });

                prop_mutable_view_get_status_arms.push(quote! {
                    PropViewMutEnum::#variant_ident(prop) => {
                        prop.get_status()
                    },
                });

                prop_mutable_view_came_from_default_arms.push(quote! {
                    PropViewMutEnum::#variant_ident(prop) => {
                        prop.came_from_default()
                    },
                });

                prop_mutable_view_create_read_only_view_arms.push(quote! {
                    PropViewMutEnum::#variant_ident(prop) => {
                        PropViewEnum::#variant_ident(prop.create_new_read_only_view())
                    },
                });

                prop_mutable_view_get_arms.push(quote! {
                    PropViewMutEnum::#variant_ident(prop) => {
                        // TODO: need .clone()?
                        PropValue::#variant_ident(prop.get().clone())
                    },
                });

                prop_mutable_view_set_value_to_requested_value_arms.push(quote! {
                    PropViewMutEnum::#variant_ident(prop) => {
                        prop.set_value_to_requested_value()
                    },
                });
            }

            quote! {

                impl PropViewMutEnum {
                    /// Creates a new mutable view of a prop
                    ///
                    /// Intended for creating state data, as it creates a PropViewMutEnum
                    /// that is disconnected from any PropEnum.
                    ///
                    /// The type of prop created is determined by the type of `prop_val`.
                    pub fn new_with_value(prop_val: PropValue, came_from_default: bool) -> Self {
                        match prop_val {
                            #(#prop_mutable_view_new_with_value_arms)*
                        }
                    }

                    /// If the prop is Fresh, set its status to Stale.
                    ///
                    /// Panics: if the prop is Unresolved.
                    pub fn mark_stale(&mut self) {
                        match self {
                            #(#prop_mutable_view_mark_stale_arms)*
                        };
                    }

                    /// If the prop is Unresolved, set its status to Resolved.
                    ///
                    /// Panics: if the prop is Fresh or Stale.
                    pub fn set_as_resolved(&self) {
                        match self {
                            #(#prop_mutable_view_set_as_resolved_arms)*
                        }
                    }

                    /// Return the current status of the variable
                    ///
                    /// Possible values
                    /// - Fresh: the prop value has been calculated and can be accessed with `get()`.
                    ///   Calls to `set_as_resolved()` will panic.
                    /// - Stale: a dependency value has changed so that the prop value needs to be recalculated.
                    ///   Calls to `get()` and `set_as_resolved()` will panic.
                    /// - Unresolved: the dependencies for the prop have not yet been calculated.
                    ///   Calls to `get()`, `mark_fresh()`, or `mark_stale()` will panic.
                    /// - Resolved: the dependencies for the prop have been created,
                    ///   but the value has never been calculated.
                    ///   Calls to `get()`, `mark_fresh()`, or `mark_stale()` will panic.
                    pub fn get_status(&self) -> PropStatus {
                        match self {
                            #(#prop_mutable_view_get_status_arms)*
                        }
                    }

                    /// Returns whether or not the value of this prop was set using its default value.
                    pub fn came_from_default(&self) -> bool {
                        match self {
                            #(#prop_mutable_view_came_from_default_arms)*
                        }
                    }

                    /// Create a new read-only view of the value of this prop.
                    ///
                    /// Each view will access the same value (and status)
                    /// but each view separately tracks whether or not it has changed
                    /// since it was last viewed.
                    pub fn create_new_read_only_view(&self) -> PropViewEnum {
                        match self {
                            #(#prop_mutable_view_create_read_only_view_arms)*
                        }
                    }

                    /// Get the value of the prop, assuming it is fresh
                    ///
                    /// Panics if the prop is not fresh.
                    pub fn get(&self) -> PropValue {
                        match self {
                            #(#prop_mutable_view_get_arms)*
                        }
                    }

                    /// Set the value of this prop to the value of the requested value
                    /// currently set for the variable.
                    ///
                    /// This function should only be called on state data,
                    /// as other variables should be calculated from their dependencies.
                    pub fn set_value_to_requested_value(&self) {
                        match self {
                            #(#prop_mutable_view_set_value_to_requested_value_arms)*
                        }
                    }

                }

            }
        }
        _ => panic!("only enums supported"),
    };
    output.into()
}

/// Implement methods on the PropViewEnum enum
pub fn prop_read_only_view_methods_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let data = &ast.data;

    // Note: explicitly use PropViewEnum rather than #enum_ident
    // in hopes that can merge this with prop_methods_derive
    // (if can create PropViewEnum itself with the macro)

    let output = match data {
        syn::Data::Enum(v) => {
            let variants = &v.variants;

            let mut prop_read_only_view_get_status_arms = Vec::new();
            let mut prop_read_only_view_came_from_default_arms = Vec::new();
            let mut prop_read_only_view_get_arms = Vec::new();
            let mut prop_read_only_view_create_new_read_only_view_arms = Vec::new();
            let mut prop_read_only_view_changed_since_last_viewed_arms = Vec::new();
            let mut prop_read_only_view_mark_viewed_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                prop_read_only_view_get_status_arms.push(quote! {
                    PropViewEnum::#variant_ident(prop) => {
                        prop.get_status()
                    },
                });

                prop_read_only_view_came_from_default_arms.push(quote! {
                    PropViewEnum::#variant_ident(prop) => {
                        prop.came_from_default()
                    },
                });

                prop_read_only_view_get_arms.push(quote! {
                    PropViewEnum::#variant_ident(prop) => {
                        // TODO: need .clone()?
                        PropValue::#variant_ident(prop.get().clone())
                    },
                });

                prop_read_only_view_create_new_read_only_view_arms.push(quote! {
                    PropViewEnum::#variant_ident(prop) => {
                        PropViewEnum::#variant_ident(prop.create_new_read_only_view())
                    },
                });

                prop_read_only_view_changed_since_last_viewed_arms.push(quote! {
                    PropViewEnum::#variant_ident(prop) => {
                        prop.changed_since_last_viewed()
                    },
                });

                prop_read_only_view_mark_viewed_arms.push(quote! {
                    PropViewEnum::#variant_ident(prop) => {
                        prop.mark_viewed()
                    },
                });
            }

            quote! {

                impl PropViewEnum {

                    /// Return the current status of the variable
                    ///
                    /// Possible values
                    /// - Fresh: the prop value has been calculated and can be accessed with `get()`.
                    /// - Stale: a dependency value has changed so that the prop value needs to be recalculated.
                    ///   Calls to `get()` will panic.
                    /// - Unresolved: the dependencies for the prop have not yet been calculated.
                    ///   Calls to `get()`, `mark_fresh()`, or `mark_stale()` will panic.
                    pub fn get_status(&self) -> PropStatus {
                        match self {
                            #(#prop_read_only_view_get_status_arms)*
                        }
                    }

                    /// Returns whether or not the value of this prop was set using its default value.
                    pub fn came_from_default(&self) -> bool {
                        match self {
                            #(#prop_read_only_view_came_from_default_arms)*
                        }
                    }

                    /// Get the value of the prop, assuming it is fresh
                    ///
                    /// Panics if the prop is not fresh.
                    pub fn get(&self) -> PropValue {
                        match self {
                            #(#prop_read_only_view_get_arms)*
                        }
                    }

                    /// Create a new read-only view of the value of this prop.
                    ///
                    /// Each view will access the same value (and status)
                    /// but each view separately tracks whether or not it has changed
                    /// since it was last viewed.
                    pub fn create_new_read_only_view(&self) -> PropViewEnum {
                        match self {
                            #(#prop_read_only_view_create_new_read_only_view_arms)*
                        }
                    }

                    /// Check if the prop has changed since `mark_viewed()` on this view was last called.
                    ///
                    /// This function doesn't check if the values of the props
                    /// have actually changed to a new value. It only checks if a call
                    /// to `set_value()` has occurred.
                    pub fn changed_since_last_viewed(&self) -> bool {
                        match self {
                            #(#prop_read_only_view_changed_since_last_viewed_arms)*
                        }
                    }

                    /// Record the fact that this view of the prop has been viewed.
                    /// Future calls to `changed_since_last_viewed()`
                    /// will then determine if the prop has changed since that moment.
                    pub fn mark_viewed(&mut self) {
                        match self {
                            #(#prop_read_only_view_mark_viewed_arms)*
                        }
                    }


                }

            }
        }
        _ => panic!("only enums supported"),
    };
    output.into()
}

/// Implement methods to create PropEnumRef and PropEnumRefMut from Prop<T>
///
/// For simplicity, created this macro so that it needs to be derived
/// from an enum where each variant is just prop type,
/// so we derive it off `PropValue`.
pub fn into_prop_enum_refs_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let data = &ast.data;

    let output = match data {
        syn::Data::Enum(v) => {
            let variants = &v.variants;

            let mut impl_from_prop_to_prop_enum_refs_variants = Vec::new();

            let mut impl_try_from_read_only_enum_to_ready_only_view_variants = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                if let Fields::Unnamed(FieldsUnnamed { unnamed, .. }) = &variant.fields {
                    if let Some(prop_type) = find_type_from_prop(&unnamed[0].ty) {
                        impl_from_prop_to_prop_enum_refs_variants.push(quote! {
                            impl<'a> From<&'a Prop<#prop_type>> for PropEnumRef<'a> {
                                fn from(prop_ref: &'a Prop<#prop_type>) -> Self {
                                    PropEnumRef::#variant_ident(prop_ref)
                                }
                            }
                            impl<'a> From<&'a mut Prop<#prop_type>> for PropEnumRefMut<'a> {
                                fn from(prop_ref: &'a mut Prop<#prop_type>) -> Self {
                                    PropEnumRefMut::#variant_ident(prop_ref)
                                }
                            }
                        });

                        impl_try_from_read_only_enum_to_ready_only_view_variants.push(quote! {

                            impl TryFromProp<PropViewEnum> for PropView<#prop_type> {
                                type Error = &'static str;
                                fn try_from_prop(value: &PropViewEnum) -> Result<Self, Self::Error> {
                                    match value {
                                        PropViewEnum::#variant_ident(ref prop_ref) => {
                                            Result::Ok(prop_ref.create_new_read_only_view())
                                        }
                                        _ => Result::Err(
                                            "Incompatible type to be converted to PropView<T>",
                                        ),
                                    }
                                }
                            }
                        });
                    }
                }
            }

            quote! {
                #(#impl_from_prop_to_prop_enum_refs_variants)*
                #(#impl_try_from_read_only_enum_to_ready_only_view_variants)*
            }
        }
        _ => panic!("only enums supported"),
    };
    output.into()
}

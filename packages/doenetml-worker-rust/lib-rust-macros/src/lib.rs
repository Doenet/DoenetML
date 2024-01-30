extern crate proc_macro2;

use component_node::{
    component_actions_derive, component_attributes_derive, component_node_derive,
    rendered_children_derive, rendered_state_derive,
};
use component_state_methods::{
    add_dependency_data_impl, component_state_derive, state_variable_data_queries_derive,
    state_variable_dependencies_derive,
};
use proc_macro::TokenStream;
use state_var_methods::{
    into_state_var_enum_refs_derive, state_var_methods_derive, state_var_methods_mut_derive,
    state_var_mutable_view_methods_derive, state_var_read_only_view_methods_derive,
};

mod component_node;
mod component_state_methods;
mod state_var_methods;
mod util;

#[proc_macro_derive(ComponentNode)]
pub fn component_node_derive_wrapper(input: TokenStream) -> TokenStream {
    component_node_derive(input)
}

#[proc_macro_derive(RenderedChildren)]
pub fn rendered_children_derive_wrapper(input: TokenStream) -> TokenStream {
    rendered_children_derive(input)
}

#[proc_macro_derive(ComponentAttributes)]
pub fn component_attributes_derive_wrapper(input: TokenStream) -> TokenStream {
    component_attributes_derive(input)
}

#[proc_macro_derive(ComponentActions)]
pub fn component_actions_derive_wrapper(input: TokenStream) -> TokenStream {
    component_actions_derive(input)
}

#[proc_macro_derive(StateVarMethods)]
pub fn state_var_methods_derive_wrapper(input: TokenStream) -> TokenStream {
    state_var_methods_derive(input)
}

#[proc_macro_derive(StateVarMethodsMut)]
pub fn state_var_methods_mut_derive_wrapper(input: TokenStream) -> TokenStream {
    state_var_methods_mut_derive(input)
}

#[proc_macro_derive(StateVarMutableViewMethods)]
pub fn state_var_mutable_view_methods_derive_wrapper(input: TokenStream) -> TokenStream {
    state_var_mutable_view_methods_derive(input)
}

#[proc_macro_derive(StateVarViewMethods)]
pub fn state_var_read_only_view_methods_derive_wrapper(input: TokenStream) -> TokenStream {
    state_var_read_only_view_methods_derive(input)
}

#[proc_macro_derive(FromStateVarIntoStateVarEnumRefs)]
pub fn into_state_var_enum_refs_derive_wrapper(input: TokenStream) -> TokenStream {
    into_state_var_enum_refs_derive(input)
}

/// Derives an implementation of the `ComponentState` trait and auxillary functions.
///
/// The derive macro is designed to be applied to the struct defining the DoenetML component itself
/// as well as the struct defining the component's state variables.
///
/// The macro assumes that the component struct has a field `state` that contains
/// the component state variables struct.
///
/// The macro assumes all fields of the component state variables struct are state variables `StateVar<T>`.
///
/// The following attributes specify properties of state variables in the component state variables structure.
/// - #\[for_renderer\]
///
///   Designate the state variable as one that will be sent to the renderer.
///   If `for_renderer` is set, the value of the state variable will be added to the `RenderedState`
///   structure for the component that is sent to the renderer
///
/// - #\[is_public\]
///
///   Designate that the state variable is public, in the sense that it can be
///   referenced by a macro in the document.
///
/// - #\[component_profile_state_variable(ProfileType)\]
///
///   Designate that the state variable
///   can be used to satisfy the component profile of type `ProfileType`, where `ProfileType`
///   can currently be one of `Text`, `Number`, `Integer`, `Boolean`.
///
///   If a parent has a `Child` or `AttributeChild` data query, it will request
///   a particular profile type, and this state variable could be returned.
///
///   Currently, the `component_profile state_variables` does not have a mechanism for specifying
///   priority in case more than one state variable matches what a parent is requesting.
///   If there is more than one match, the state variable that appears first in the ordering of
///   the fields of the struct will be selected.
#[proc_macro_derive(
    ComponentState,
    attributes(for_renderer, is_public, component_profile_state_variable)
)]
pub fn component_state_derive_wrapper(input: TokenStream) -> TokenStream {
    component_state_derive(input)
}

/// Derives the RenderedState enum
///
/// This derive macro is designed to be applied to the `ComponentEnum` listing all component types.
///
/// It creates a parallel `RenderedState` enum whose variant names and field types
/// are based on the variant names from the `ComponentEnum`.
///
/// The variant names append `State` to the variant from `ComponentEnum`.
///
/// The field types prepend `Rendered` to the variant names. These structures
/// are created by the `ComponentState` macro applied
/// to the components state variable struct.
///
/// For example, the component type `Text` has a `TextState` struct,
/// and the `ComponentState` macro creates the `RenderedTextState` struct.
/// Since the `ComponentEnum` has a `Text` variant, the `RenderedState` macros
/// adds the variant `TextState(RenderedTextState)`
/// to the `RenderedState` enum.
#[proc_macro_derive(RenderedState)]
pub fn rendered_state_derive_wrapper(input: TokenStream) -> TokenStream {
    rendered_state_derive(input)
}

#[proc_macro_derive(StateVariableDependencies, attributes(consume_remaining_data_queries))]
pub fn state_variable_dependencies_derive_wrapper(input: TokenStream) -> TokenStream {
    state_variable_dependencies_derive(input)
}

#[proc_macro_derive(StateVariableDataQueries)]
pub fn state_variable_data_queries_derive_wrapper(input: TokenStream) -> TokenStream {
    state_variable_data_queries_derive(input)
}

#[proc_macro_attribute]
pub fn add_dependency_data(attr: TokenStream, item: TokenStream) -> TokenStream {
    add_dependency_data_impl(attr, item)
}

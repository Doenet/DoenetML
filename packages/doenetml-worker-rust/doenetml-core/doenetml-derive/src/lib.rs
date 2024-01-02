extern crate proc_macro2;

use component_node::{component_node_derive, rendered_component_node_derive};
use component_state_variables::component_state_variables_derive;
use proc_macro::TokenStream;
use state_var_methods::{
    state_var_methods_derive, state_var_mutable_view_methods_derive,
    state_var_read_only_view_methods_derive,
};

mod component_node;
mod component_state_variables;
mod state_var_methods;
mod util;

#[proc_macro_derive(ComponentNode)]
pub fn component_node_derive_wrapper(input: TokenStream) -> TokenStream {
    component_node_derive(input)
}

#[proc_macro_derive(RenderedComponentNode)]
pub fn rendered_component_node_derive_wrapper(input: TokenStream) -> TokenStream {
    rendered_component_node_derive(input)
}

#[proc_macro_derive(ComponentStateVariables, attributes(state_variables_for_component))]
pub fn component_state_variables_derive_wrapper(input: TokenStream) -> TokenStream {
    component_state_variables_derive(input)
}

#[proc_macro_derive(StateVarMethods)]
pub fn state_var_methods_derive_wrapper(input: TokenStream) -> TokenStream {
    state_var_methods_derive(input)
}

#[proc_macro_derive(StateVarMutableViewMethods)]
pub fn state_var_mutable_view_methods_derive_wrapper(input: TokenStream) -> TokenStream {
    state_var_mutable_view_methods_derive(input)
}

#[proc_macro_derive(StateVarReadOnlyViewMethods)]
pub fn state_var_read_only_view_methods_derive_wrapper(input: TokenStream) -> TokenStream {
    state_var_read_only_view_methods_derive(input)
}

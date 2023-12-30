extern crate proc_macro2;

use component_node::component_node_derive;
use proc_macro::TokenStream;
use state_var_methods::{
    state_var_methods_derive, state_var_mutable_view_methods_derive,
    state_var_read_only_view_methods_derive,
};

mod component_node;
mod state_var_methods;

#[proc_macro_derive(ComponentNode)]
pub fn component_node_derive_wrapper(input: TokenStream) -> TokenStream {
    component_node_derive(input)
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

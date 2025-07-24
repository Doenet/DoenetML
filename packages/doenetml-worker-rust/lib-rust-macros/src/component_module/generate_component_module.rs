use proc_macro2::TokenStream;
use syn::{self, ItemMod};

use super::items::component_module::ComponentModule;

/// Parse a
/// ```ignore
/// #[component(name = ...)]
/// mod component { ... }
/// ```
/// module and generate a resulting module containing all required structs.
pub fn generate_component_module(input: TokenStream) -> syn::Result<TokenStream> {
    let module: ItemMod = syn::parse2(input).unwrap();
    let component_module = ComponentModule::from_module(module)?;

    component_module.generate_module()
}

#[cfg(test)]
#[path = "generate_component_module.test.rs"]
mod test;

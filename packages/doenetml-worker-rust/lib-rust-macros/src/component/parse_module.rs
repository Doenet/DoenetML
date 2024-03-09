// use super::utils::pretty_print;
use proc_macro2::TokenStream;
use syn::{self, ItemMod};

use super::component_mod::ComponentModule;

pub fn parse_module(input: TokenStream) -> syn::Result<TokenStream> {
    let module: ItemMod = syn::parse2(input).unwrap();
    let component_module = ComponentModule::from_module(&module)?;
    // dbg!(&component_module);

    // println!("\n{}\n", pretty_print(component_module.generate_module()));

    component_module.generate_module()
}

#[cfg(test)]
#[path = "parse_module.test.rs"]
mod test;

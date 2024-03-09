use proc_macro2::{Ident, TokenStream};
use quote::quote;

use super::super::component_mod::ComponentModule;

impl ComponentModule {
    /// Generate the `enum Props` and all the associated impls for required traits.
    pub fn generate_props_and_impls(&self) -> TokenStream {
        let enum_props = self.enum_props();

        quote! {
            #enum_props
        }
    }

    pub fn get_prop_idents(&self) -> Vec<Ident> {
        self.props.as_ref().map_or(vec![], |props| {
            props.variants.iter().map(|x| x.ident.clone()).collect()
        })
    }

    /// Generate the `enum Props` for this component.
    pub fn enum_props(&self) -> TokenStream {
        let (_, _, _, props_name) = self.get_component_idents();
        let prop_idents = self.get_prop_idents();

        quote! {
            #[derive(Debug, Clone, Copy)]
            pub enum #props_name {
                #(#prop_idents,)*
            }
        }
    }
}

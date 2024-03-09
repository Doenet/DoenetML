use proc_macro2::{Ident, TokenStream};
use quote::quote;

use super::super::component_mod::ComponentModule;

impl ComponentModule {
    /// Generate the `enum Props` and all the associated impls for required traits.
    pub fn generate_actions_and_impls(&self) -> TokenStream {
        let enum_actions = self.enum_actions();

        quote! {
            #enum_actions
        }
    }

    pub fn get_action_idents(&self) -> Vec<Ident> {
        self.actions.as_ref().map_or(vec![], |actions| {
            actions.variants.iter().map(|x| x.ident.clone()).collect()
        })
    }

    /// Generate the `enum Props` for this component.
    pub fn enum_actions(&self) -> TokenStream {
        let (_, actions_name, _, _) = self.get_component_idents();
        let action_idents = self.get_action_idents();

        quote! {
            #[derive(Debug, Clone, Copy)]
            pub enum #actions_name {
                #(#action_idents,)*
            }
        }
    }
}

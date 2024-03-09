use proc_macro2::{Ident, TokenStream};
use quote::quote;

use super::super::component_mod::ComponentModule;

impl ComponentModule {
    /// Generate the `enum Props` and all the associated impls for required traits.
    pub fn generate_attributes_and_impls(&self) -> TokenStream {
        let enum_attributes = self.enum_attributes();

        quote! {
            #enum_attributes
        }
    }

    pub fn get_attribute_idents(&self) -> Vec<Ident> {
        self.attributes.as_ref().map_or(vec![], |attributes| {
            attributes
                .variants
                .iter()
                .map(|x| x.ident.clone())
                .collect()
        })
    }

    /// Generate the `enum Props` for this component.
    pub fn enum_attributes(&self) -> TokenStream {
        let (_, _, attributes_name, _) = self.get_component_idents();
        let attribute_idents = self.get_attribute_idents();

        quote! {
            #[derive(Debug, Clone, Copy)]
            pub enum #attributes_name {
                #(#attribute_idents,)*
            }
        }
    }
}

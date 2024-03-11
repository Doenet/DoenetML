use std::vec;

use proc_macro2::{Ident, TokenStream};
use quote::quote;

use super::super::component_mod::ComponentModule;

impl ComponentModule {
    /// Generate the `enum Props` and all the associated impls for required traits.
    pub fn generate_attributes_and_impls(&self) -> TokenStream {
        let enum_attributes = self.enum_attributes();
        let impl_prop_from_attribute_variant_trait = self.impl_prop_from_attribute_variant_trait();

        quote! {
            #enum_attributes
            #impl_prop_from_attribute_variant_trait
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

    /// Generate the impls for the `PropFromAttributeVariant` trait.
    /// The implementation should look like
    /// ```ignore
    /// impl PropFromAttributeVariant for Attributes {
    ///   fn prop(&self) -> Box<dyn PropUpdater> {
    ///     match self {
    ///       Attributes::Foo => Box::new(FooProp::new_from_attribute("foo", default_value)),
    ///       Attributes::Bar => Box::new(BarProp::new_from_attribute("bar", default_value)),
    ///     }
    ///   }
    /// }
    /// ```
    /// This function assumes the `PropFromAttribute` trait is implemented for each `#[attribute(prop = ...)]`
    /// item.
    fn impl_prop_from_attribute_variant_trait(&self) -> TokenStream {
        if self.attributes.is_none() {
            return quote! {};
        }
        let attributes = self.attributes.as_ref().unwrap();
        let attributes_name = self.get_attribute_names();
        let match_arms = attributes
            .variants
            .iter().enumerate()
            .map(|(i, variant)| {
                let variant_ident = &variant.ident;
                let prop = &variant.prop;
                let default = &variant.default;
                let attribute_name = &attributes_name[i];
                match (prop, default) {
                    (None, _) | (_, None) => {
                        quote!{
                            Self::#variant_ident => panic!("`prop` and `default` must be specified for each attribute"),
                        }
                    }
                    (Some(prop), Some(default)) => {
                        quote! {
                            Self::#variant_ident => Box::new(#prop::new_from_attribute(#attribute_name, #default)),
                        }
                    }
                }
            })
            .collect::<Vec<_>>();

        quote! {
            impl PropFromAttributeVariant for Attributes {
                fn get_prop_updater(&self) -> Box<dyn PropUpdater> {
                    match self {
                        #(#match_arms)*
                    }
                }
            }
        }
    }
}

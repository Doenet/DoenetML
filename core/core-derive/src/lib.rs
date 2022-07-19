extern crate proc_macro2;

use proc_macro::TokenStream;
use proc_macro2::Span;
use quote::quote;
use syn::{self, FieldsNamed, Ident};
use convert_case::{Case, Casing};

#[proc_macro_derive(ComponentLike)]
pub fn component_like_derive(input: TokenStream) -> TokenStream {

    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { named, .. }) => {

                // Get names of fields of type StateVar struct
                let state_var_fields = named
                    .iter()
                    .filter(|f| match &f.ty {
                        syn::Type::Path(type_path) => {
                            let type_name = &type_path.path.segments[0].ident;
                            type_name == "StateVar"
                        },
                        _ => false,
                    })
                    .map(|f| &f.ident);

                // Convert string names to camel case
                let state_var_strings = state_var_fields.clone().map(|x| x.clone().map(ident_camel_case));

                // Convert struct name to camel case
                let component_string = ident_camel_case(name.clone());

                quote! {
                    impl ComponentLike for #name {

                        fn name(&self) -> &str {
                            &self.name
                        }
                        fn children(&self) -> &Vec<ComponentChild> {
                            // Is this really the best way to do this?
                            &self.children
                        }

                        fn parent(&self) -> &Option<String> {
                            &self.parent
                        }

                        fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar> {
                            &self.essential_state_vars
                        }

                        fn get_component_type(&self) -> &'static str {
                            stringify!(#component_string)
                        }

                        fn get_state_var(&self, name: StateVarName) -> Option<&StateVar> {
                            match name {
                                #(
                                    stringify!(#state_var_strings) => Some(&self.#state_var_fields),
                                )*
                                _ => None,
                            }
                        }
                    }
                }

            },
            _ => panic!("only named fields supported"),
        },
        _ => panic!("only structs supported"),
    };
    output.into()
}

fn ident_camel_case(ident: Ident) -> Ident {
    Ident::new(&ident.to_string().to_case(Case::Camel), Span::call_site())
}

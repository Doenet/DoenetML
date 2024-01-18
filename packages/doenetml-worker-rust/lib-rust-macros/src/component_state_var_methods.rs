use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use quote::quote;
use syn::{self, FieldsNamed};

pub fn component_state_variables_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { named, .. }) => {
                let field_identities = named
                    .iter()
                    .map(|f| f.ident.as_ref().unwrap().clone())
                    .collect::<Vec<_>>();

                let num_state_var = field_identities.len();

                for f in named.iter() {}

                let mut get_state_variable_arms = Vec::new();

                for (sv_ind, field_identity) in named.iter().enumerate() {
                    get_state_variable_arms.push(quote! {
                        #sv_ind => self.#field_identity.try_into().unwrap()
                    })
                }

                quote! {
                    impl ComponentStateVariables for #name {

                        fn get_num_state_variables(&self) -> StateVarIdx {
                            #num_state_var
                        }

                        fn get_state_variable(&self, state_var_idx: StateVarIdx) -> &StateVarEnumRef {
                            match state_var_idx {
                                #(#get_state_variable_arms)*
                            }
                        }

                    }
                }
            }
            _ => panic!("only named fields supported"),
        },
        _ => panic!("only structs and enums supported"),
    };
    output.into()
}

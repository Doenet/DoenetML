use proc_macro::TokenStream;
use proc_macro2::TokenTree;
use quote::quote;
use syn::{self, FieldsNamed, Meta};

use crate::util::find_type_from_state_var_typed;

pub fn component_state_variables_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;
    let attrs = &ast.attrs;

    // TODO: presumably this is a bad way to get the value of the
    // state_variables_for_component macro attribute as just hacked
    // until it worked for one case.
    // Create a more idiomatic and robust implementation!

    let mut state_variables_for_component: Vec<_> = attrs
        .iter()
        .filter_map(|attribute| {
            if let Meta::List(meta_list) = &attribute.meta {
                let path = &meta_list.path;
                if path.leading_colon.is_none() && path.segments.len() == 1 {
                    let path_segment = &path.segments[0];
                    if path_segment.ident == "state_variables_for_component" {
                        let token_vec: Vec<_> = meta_list
                            .tokens
                            .clone()
                            .into_iter()
                            .filter_map(|token_tree| {
                                if let TokenTree::Ident(ident) = token_tree {
                                    Some(ident)
                                } else {
                                    None
                                }
                            })
                            .collect();

                        if token_vec.len() == 1 {
                            return Some(token_vec[0].clone());
                        }
                    }
                }
            }

            None
        })
        .collect();

    if state_variables_for_component.len() != 1 {
        panic!("when derive ComponentStateVariables, must specify state_variables_for_component")
    }

    let state_variables_for_component = state_variables_for_component.pop();

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { named, .. }) => {
                let mut state_var_name_to_idx_arms = Vec::new();
                let mut state_var_idx_to_state_var = Vec::new();

                named.iter().enumerate().for_each(|(i, f)| {
                    let f_unwrapped = f.ident.as_ref().unwrap();
                    let field_string = f_unwrapped.to_string();
                    state_var_name_to_idx_arms.push(quote! {
                        #field_string => Some(#i),
                    });

                    if let Some(_state_var_type) = find_type_from_state_var_typed(&f.ty) {
                        state_var_idx_to_state_var.push(quote! {
                            #i => Some(StateVarReference::from(&mut self.state_variables.#f_unwrapped)),
                        });
                    }
                });

                let n_state_vars = state_var_name_to_idx_arms.len();

                quote! {
                    impl ComponentStateVariables for #state_variables_for_component {
                        fn get_num_state_variables(&self) -> usize {
                            #n_state_vars
                        }

                        fn state_var_name_to_idx(&self, var_name: &str) -> Option<usize> {
                            match var_name {
                                #(#state_var_name_to_idx_arms)*
                                _ => None
                            }

                        }

                        fn state_var_idx_to_state_var(&mut self, state_var_idx: usize) -> Option<StateVarReference> {
                            match state_var_idx {
                                #(#state_var_idx_to_state_var)*
                                _ => None
                            }

                        }

                        // fn create_new_read_only_view_from_state_var_idx(
                        //     &self,
                        //     state_var_idx: StateVarIdx,
                        // ) -> StateVarReadOnlyView;
                    }
                }
            }
            _ => panic!("only named fields supported"),
        },
        syn::Data::Enum(v) => {
            let variants = &v.variants;
            let enum_ident = name;

            let mut get_rendered_children_variant_arms = Vec::new();
            let mut to_flat_dast_variant_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                get_rendered_children_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_rendered_children()
                    },
                });

                to_flat_dast_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.to_flat_dast(components)
                    },
                });
            }

            quote! {

                impl RenderedComponentNode for #enum_ident {

                    fn get_rendered_children(&self) -> &Vec<ComponentChild> {
                        match self {
                            #(#get_rendered_children_variant_arms)*
                        }
                    }

                    fn to_flat_dast(&self, components: &Vec<Rc<RefCell<ComponentEnum>>>) -> FlatDastElement {
                        match self {
                            #(#to_flat_dast_variant_arms)*
                        }
                    }

                }
            }
        }
        _ => panic!("only structs and enums supported"),
    };
    output.into()
}

use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use quote::quote;
use syn::{self, FieldsNamed};

/// Implement the ComponentNode trait for enums and structs
/// assuming they have the correct format.
///
/// For structs, assume these fields:
/// - pub idx: ComponentIdx,
/// - pub parent: Option<ComponentIdx>,
/// - pub children: Vec<ComponentChild>,
/// - pub extend: Option<ExtendSource>,
/// - pub descendant_names: HashMap<String, Vec<ComponentIdx>>,
/// - pub position: Option<DastPosition>,
/// - pub component_profile_state_variables: Vec<ComponentProfileStateVariable>,
/// - pub state_variables: (TODO: in the process of determining)
///
/// For enums, assume each variant implements ComponentNode.
/// Implement ComponentNode methods by calling the corresponding method on the matched variant.
pub fn component_node_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { .. }) => {
                // Convert struct name to camel case, preserving any initial '_'
                let mut component_string = name.to_string();
                if component_string.starts_with("_") {
                    component_string = format!("_{}", component_string.to_case(Case::Camel));
                } else {
                    component_string = component_string.to_case(Case::Camel);
                }

                quote! {
                    impl ComponentNode for #name {
                        fn get_idx(&self) -> ComponentIdx {
                            self.idx
                        }
                        fn get_parent(&self) -> Option<ComponentIdx> {
                            self.parent
                        }
                        fn get_children(&self) -> &Vec<ComponentChild> {
                            &self.children
                        }
                        fn set_children(&mut self, children: Vec<ComponentChild>) {
                            self.children = children;
                        }
                        fn replace_children(&mut self, new_children: Vec<ComponentChild>) -> Vec<ComponentChild> {
                            std::mem::replace(&mut self.children, new_children)
                        }

                        fn initialize(
                            &mut self,
                            idx: ComponentIdx,
                            parent: Option<ComponentIdx>,
                            extend_source: Option<ExtendSource>,
                            position: Option<DastPosition>,
                        ) {
                            self.idx = idx;
                            self.parent = parent;
                            self.extend = extend_source;
                            self.position = position;

                            self.initialize_state_variables();

                            self.rendered_state_variable_indices = self
                                .get_state_variables()
                                .iter()
                                .enumerate()
                                .filter_map(|(ind, state_var)| state_var.get_for_renderer().then(|| ind))
                                .collect();

                            self.public_state_variable_indices = self
                                .get_state_variables()
                                .iter()
                                .enumerate()
                                .filter_map(|(ind, state_var)| state_var.get_is_public().then(|| ind))
                                .collect();

                            let name_to_index_pairs: Vec<_> = self
                                .get_state_variables()
                                .iter()
                                .enumerate()
                                .map(|(sv_idx, state_var)| (state_var.get_name().to_string(), sv_idx))
                                .collect();

                            self.state_variable_name_to_index
                                .extend(name_to_index_pairs);

                        }

                        fn get_extend(&self) -> Option<&ExtendSource> {
                            self.extend.as_ref()
                        }

                        fn get_component_type(&self) -> &str {
                            #component_string
                        }
                        fn get_descendant_matches(&self, name: &str) -> Option<&Vec<ComponentIdx>> {
                            self.descendant_names.get(name)
                        }
                        fn set_descendant_names(&mut self, descendant_names: HashMap<String, Vec<ComponentIdx>>) {
                            self.descendant_names = descendant_names;
                        }

                        fn get_position(&self) -> Option<&DastPosition> {
                            self.position.as_ref()
                        }

                        fn set_position(&mut self, position: Option<DastPosition>) {
                            self.position = position;
                        }

                        fn get_num_state_variables(&self) -> usize {
                            self.state_variables.len()
                        }

                        fn get_state_variables(&self) -> &Vec<StateVar> {
                            &self.state_variables
                        }

                        fn get_state_variables_mut(&mut self) -> &mut Vec<StateVar> {
                            &mut self.state_variables
                        }

                        fn get_rendered_state_variable_indices(&self) -> &Vec<usize> {
                            &self.rendered_state_variable_indices
                        }


                        fn get_public_state_variable_indices(&self) -> &Vec<usize> {
                            &self.public_state_variable_indices
                        }

                        fn get_state_variable_index_from_name(&self, name: &String) -> Option<usize> {
                            self.state_variable_name_to_index.get(name).copied()
                        }

                        fn get_state_variable_index_from_name_case_insensitive(&self, name: &String) -> Option<usize> {
                            self.state_variable_name_to_index
                                .get_key_value_ignore_case(name)
                                .map(|(k, v)| *v)
                        }

                        fn get_component_profile_state_variables(&self)  -> &Vec<ComponentProfileStateVariable> {
                            &self.component_profile_state_variables
                        }

                        // fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar> {
                        //     &self.essential_state_vars
                        // }

                    }
                }
            }
            _ => panic!("only named fields supported"),
        },
        _ => panic!("only structs supported"),
    };
    output.into()
}

pub fn rendered_component_node_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { .. }) => {
                quote! {
                    impl RenderedComponentNode for #name {
                        // using default implementations for all traits so no code necessary here
                    }
                }
            }
            _ => panic!("only named fields supported"),
        },
        _ => panic!("only enums supported"),
    };
    output.into()
}

pub fn component_node_state_variables_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { .. }) => {
                quote! {
                    impl ComponentNodeStateVariables for #name {
                        // using default implementations for all traits so no code necessary here
                    }
                }
            }
            _ => panic!("only named fields supported"),
        },
        _ => panic!("only structs and enums supported"),
    };
    output.into()
}

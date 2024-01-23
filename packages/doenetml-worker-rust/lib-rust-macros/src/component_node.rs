use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use proc_macro2::{Ident, Span};
use quote::quote;
use syn::{self, FieldsNamed};

/// Implement the ComponentNode trait for enums and structs
/// assuming they have the correct format.
///
/// For structs, assume these fields:
/// - pub idx: ComponentIdx,
/// - pub parent: Option<ComponentIdx>,
/// - pub children: Vec<ComponentPointerTextOrMacro>,
/// - pub extending: Option<ExtendSource>,
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
                let component_string = match name.to_string() {
                    n if n.starts_with('_') => format!("_{}", n.to_case(Case::Camel)),
                    n => n.to_case(Case::Camel),
                };

                quote! {
                    impl ComponentNode for #name {
                        fn get_idx(&self) -> ComponentIdx {
                            self.common.idx
                        }
                        fn get_parent(&self) -> Option<ComponentIdx> {
                            self.common.parent
                        }
                        fn get_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
                            &self.common.children
                        }
                        fn set_children(&mut self, children: Vec<ComponentPointerTextOrMacro>) {
                            self.common.children = children;
                        }
                        fn replace_children(&mut self, new_children: Vec<ComponentPointerTextOrMacro>) -> Vec<ComponentPointerTextOrMacro> {
                            std::mem::replace(&mut self.common.children, new_children)
                        }

                        fn initialize(
                            &mut self,
                            idx: ComponentIdx,
                            parent: Option<ComponentIdx>,
                            extending: Option<ExtendSource>,
                            attributes: HashMap<String, DastAttribute>,
                            position: Option<DastPosition>,
                        ) {
                            self.common.idx = idx;
                            self.common.parent = parent;
                            self.common.extending = extending;
                            self.common.position = position;
                            self.common.unevaluated_attributes = attributes;
                        }

                        fn get_extending(&self) -> Option<&ExtendSource> {
                            self.common.extending.as_ref()
                        }

                        fn get_component_type(&self) -> &str {
                            #component_string
                        }
                        fn get_descendant_matches(&self, name: &str) -> Option<&Vec<ComponentIdx>> {
                            self.common.descendant_names.get(name)
                        }
                        fn set_descendant_names(&mut self, descendant_names: HashMap<String, Vec<ComponentIdx>>) {
                            self.common.descendant_names = descendant_names;
                        }

                        fn get_position(&self) -> Option<&DastPosition> {
                            self.common.position.as_ref()
                        }

                        fn set_position(&mut self, position: Option<DastPosition>) {
                            self.common.position = position;
                        }

                        fn set_attribute_children(
                            &mut self,
                            attribute_children: HashMap<AttributeName, Vec<ComponentPointerTextOrMacro>>,
                        ) {
                            self.common.attribute_children = attribute_children;
                        }

                        fn get_attribute_children_for_attribute(
                            &self,
                            attribute: AttributeName,
                        ) -> Option<&Vec<ComponentPointerTextOrMacro>> {
                            self.common.attribute_children.get(attribute)
                        }

                        fn get_unevaluated_attributes(&self) -> &HashMap<String, DastAttribute> {
                            &self.common.unevaluated_attributes
                        }

                        fn get_unevaluated_attributes_mut(&mut self) -> &mut HashMap<String, DastAttribute> {
                            &mut self.common.unevaluated_attributes
                        }

                        fn get_is_in_render_tree(&self) -> bool {
                            self.common.is_in_render_tree
                        }

                        fn set_is_in_render_tree(&mut self, is_in_render_tree: bool) {
                            self.common.is_in_render_tree = is_in_render_tree;
                        }

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
        _ => panic!("only structs supported"),
    };
    output.into()
}

pub fn rendered_state_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let data = &ast.data;

    let output = match data {
        syn::Data::Enum(v) => {
            let variants = &v.variants;

            let mut rendered_state_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;
                let state_variables_name = format!("{}StateVariables", variant_ident.to_string());
                let rendered_state_variables_name = format!("Rendered{}", state_variables_name);
                let state_variables_identity = Ident::new(&state_variables_name, Span::call_site());
                let rendered_state_variables_identity =
                    Ident::new(&rendered_state_variables_name, Span::call_site());

                rendered_state_arms.push(quote! {
                    #state_variables_identity(#rendered_state_variables_identity),
                })
            }

            quote! {
                /// A enum listing the renderer data for each component.
                ///
                /// Used for sending state to the renderer
                #[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
                #[serde(untagged)]
                pub enum RenderedState {
                    #(#rendered_state_arms)*
                }

            }
        }
        _ => panic!("only enums supported"),
    };
    output.into()
}

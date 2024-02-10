use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use proc_macro2::{Ident, Span};
use quote::quote;
use syn::{self, FieldsNamed};

use darling::FromDeriveInput;

use crate::util::has_attribute;

/// Extra options a component may pass to the `ComponentNode` derive macro.
#[derive(Debug, Default, FromDeriveInput)]
#[darling(attributes(component))]
pub struct ComponentOptions {
    /// Accessible with `#[component(ref_transmutes_to = "new_name")]`.
    /// Indicates what component a reference should become. For example
    /// `<textInput name="a"/>$a`, one may want `$a` to appear as a `Text` by default,
    /// rather than a `TextInput`. In this case, you would set `ref_transmutes_to = "Text"`.
    pub ref_transmutes_to: Option<String>,
}

/// Implement the ComponentNode trait structs
/// assuming they have have a common field that is `ComponentCommonData`
pub fn component_node_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;
    let options: ComponentOptions = FromDeriveInput::from_derive_input(&ast).unwrap();

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { .. }) => {
                // Convert struct name to camel case, preserving any initial '_'
                let component_string = match name.to_string() {
                    n if n.starts_with('_') => format!("_{}", n.to_case(Case::Camel)),
                    n => n.to_case(Case::Camel),
                };

                let mut component_node_impl_body = quote! {
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
                };
                if let Some(ref_transmute_to) = &options.ref_transmutes_to {
                    component_node_impl_body.extend(quote! {
                        fn ref_transmutes_to(&self) -> Option<&'static str> {
                            Some(#ref_transmute_to)
                        }
                    });
                }

                quote! {
                    impl ComponentNode for #name {
                        #component_node_impl_body
                    }

                    impl #name {
                        fn get_component_type() -> &'static str {
                            #component_string
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

pub fn rendered_children_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;

    let pass_through_children = has_attribute(&ast.attrs, "pass_through_children")
        || !has_attribute(&ast.attrs, "no_rendered_children");

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { .. }) => {
                if pass_through_children {
                    quote! {
                        impl RenderedChildren for #name {
                            fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
                                &self.common.children
                            }
                        }
                    }
                } else {
                    // no_rendered_children
                    quote! {
                        impl RenderedChildren for #name {
                            fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
                                static EMPTY_VECTOR: Vec<ComponentPointerTextOrMacro> = vec![];
                                &EMPTY_VECTOR
                            }
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

pub fn component_attributes_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { .. }) => {
                quote! {
                    impl ComponentAttributes for #name {
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

pub fn component_actions_derive(input: TokenStream) -> TokenStream {
    let ast: syn::DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;
    let data = &ast.data;

    let output = match data {
        syn::Data::Struct(s) => match &s.fields {
            syn::Fields::Named(FieldsNamed { .. }) => {
                quote! {
                    impl ComponentActions for #name {
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
                let state_variables_name = format!("{}State", variant_ident);
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

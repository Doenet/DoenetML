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

    /// Accessible via `#[component(extend_via_default_prop)]`.
    /// Indicates that, when a component is extended into a different component type,
    /// it should use its default prop to create an `Extending::Prop` link
    /// rather than an `Extending::Component` link.
    ///
    /// For example, with `<textInput name="a"/><text extend="$a" />`,
    /// the extension to `<text>` uses the `value` prop of the textInput,
    /// i.e., equivalent `<textInput name="a"/><text extend="$a.value" />`.
    pub extend_via_default_prop: Option<()>,
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
                    fn set_idx(&mut self, idx: ComponentIdx) {
                        self.common.idx = idx
                    }
                    fn get_parent(&self) -> Option<ComponentIdx> {
                        self.common.parent
                    }
                    fn get_children(&self) -> &Vec<UntaggedContent> {
                        &self.common.children
                    }
                    fn set_children(&mut self, children: Vec<UntaggedContent>) {
                        self.common.children = children;
                    }
                    fn take_children(&mut self) -> Vec<UntaggedContent> {
                        std::mem::take(&mut self.common.children)
                    }
                    fn initialize(
                        &mut self,
                        parent: Option<ComponentIdx>,
                        extending: Option<Extending>,
                        unrecognized_attributes: HashMap<String, FlatAttribute>,
                        position: Option<DastPosition>,
                    ) {
                        self.common.parent = parent;
                        self.common.extending = extending;
                        self.common.position = position;
                        self.common.unrecognized_attributes = unrecognized_attributes;
                    }

                    fn get_extending(&self) -> Option<&Extending> {
                        self.common.extending.as_ref()
                    }

                    fn set_extending(&mut self, extending: Option<Extending>) {
                        self.common.extending = extending;
                    }

                    fn get_component_type(&self) -> &str {
                        #component_string
                    }

                    fn get_position(&self) -> Option<&DastPosition> {
                        self.common.position.as_ref()
                    }

                    fn set_position(&mut self, position: Option<DastPosition>) {
                        self.common.position = position;
                    }

                    fn set_attributes(
                        &mut self,
                        attributes: HashMap<AttributeName, Vec<UntaggedContent>>,
                    ) {
                        self.common.attributes = attributes;
                    }

                    fn get_attribute(
                        &self,
                        attribute: AttributeName,
                    ) -> Option<&Vec<UntaggedContent>> {
                        self.common.attributes.get(attribute)
                    }

                    fn get_unrecognized_attributes(&self) -> &HashMap<String, FlatAttribute> {
                        &self.common.unrecognized_attributes
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
                if options.extend_via_default_prop.is_some() {
                    component_node_impl_body.extend(quote! {
                        fn extend_via_default_prop(&self) -> bool {
                            true
                        }
                    })
                }

                quote! {
                    impl ComponentNode for #name {
                        #component_node_impl_body
                    }

                    impl #name {
                        pub const fn get_component_type() -> &'static str {
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

pub fn component_children_derive(input: TokenStream) -> TokenStream {
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
                        impl ComponentChildren for #name {
                            fn render_children_obsolete(&self) -> &Vec<UntaggedContent> {
                                &self.common.children
                            }
                            fn filter_rendered_children(
                                &self,
                                children: Vec<FlatDastElementContent>,
                            ) -> Vec<FlatDastElementContent> {
                                children
                            }
                        }
                    }
                } else {
                    // no_rendered_children
                    quote! {
                        impl ComponentChildren for #name {
                            fn render_children_obsolete(&self) -> &Vec<UntaggedContent> {
                                static EMPTY_VECTOR: Vec<UntaggedContent> = vec![];
                                &EMPTY_VECTOR
                            }
                            fn filter_rendered_children(
                                &self,
                                children: Vec<FlatDastElementContent>,
                            ) -> Vec<FlatDastElementContent> {
                                vec![]
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
                let props_name = format!("{}State", variant_ident);
                let rendered_props_name = format!("Rendered{}", props_name);
                let props_identity = Ident::new(&props_name, Span::call_site());
                let rendered_props_identity = Ident::new(&rendered_props_name, Span::call_site());

                rendered_state_arms.push(quote! {
                    #props_identity(#rendered_props_identity),
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

use convert_case::{Case, Casing};
use proc_macro2::TokenStream;
use quote::quote;

use super::component_module::{ComponentModule, RenderedChildren};

impl ComponentModule {
    /// Generate the `struct Component` and all the associated impls for required traits.
    pub fn generate_component_and_impls(&self) -> TokenStream {
        let component = self.struct_component();
        let impl_component = self.impl_component();
        let impl_component_node_trait = self.impl_component_node_trait();
        let impl_component_variant_props_trait = self.impl_component_variant_props_trait();
        let impl_component_attributes_trait = self.impl_component_attributes_trait();
        let impl_component_actions_trait = self.impl_component_actions_trait();
        let impl_component_on_action_trait = self.impl_component_on_action_trait();
        let impl_component_children_trait = self.impl_component_children_trait();

        quote! {
            #component
            #impl_component
            #impl_component_attributes_trait
            #impl_component_node_trait
            #impl_component_variant_props_trait
            #impl_component_actions_trait
            #impl_component_on_action_trait
            #impl_component_children_trait
        }
    }

    /// Generate the `struct Component`for this component.
    pub fn struct_component(&self) -> TokenStream {
        let (component_name, _, _, _) = self.get_component_idents();
        quote! {
            #[derive(Debug, Clone, Copy, Default)]
            pub struct #component_name {}
        }
    }

    pub fn impl_component(&self) -> TokenStream {
        let component_name = &self.name;
        let name_camel_case = self.name.to_case(Case::Camel);

        let ref_transmutes_to = self
            .ref_transmutes_to
            .as_ref()
            .map(|name| name.to_case(Case::Camel))
            .map_or(quote! {None}, |name| quote! {Some(#name)});

        let extend_via_default_prop = self.extend_via_default_prop;

        let action_names = self.actions.get_action_names();
        let attribute_names = self.attributes.get_attribute_names();
        let prop_names = self.props.get_prop_names();
        let prop_profiles = self
            .props
            .get_prop_profiles()
            .iter()
            .map(|x| {
                // We want the literal options to be quoted.
                if let Some(profile) = x {
                    quote! {Some(#profile)}
                } else {
                    quote! {None}
                }
            })
            .collect::<Vec<_>>();
        let prop_for_renders = self.props.get_prop_for_renders();
        let prop_is_publics = self.props.get_prop_is_publics();
        let prop_value_types = self.props.get_prop_value_types();
        let default_prop = match self.props.get_default_prop_local_index() {
            Some(idx) => quote! {Some(LocalPropIdx(#idx))},
            None => quote! {None},
        };
        let props: Vec<TokenStream> = self
            .props
            .get_prop_idents()
            .iter()
            .map(|x| quote! {Props::#x})
            .collect();

        let ret = quote! {
            impl Component {
                /// The name of the component. This is used to identify the component in the DoenetML document.
                /// It is in _camelCase_.
                pub const NAME: &'static str = #name_camel_case;

                /// The internal name of the component. This is used in Rust enums, etc. It is in _PascalCase_.
                const COMPONENT_NAME: &'static str = #component_name;

                const REF_TRANSMUTES_TO: Option<&'static str> = #ref_transmutes_to;

                const ATTRIBUTE_NAMES: &'static [&'static str] = &[#(#attribute_names),*];

                const ACTION_NAMES: &'static [&'static str] = &[#(#action_names),*];

                //
                // Prop information
                //

                const EXTEND_VIA_DEFAULT_PROP: bool = #extend_via_default_prop;

                const PROPS: &'static [Props] = &[#(#props),*];

                pub const PROP_NAMES: &'static [&'static str] = &[#(#prop_names),*];

                const PROP_PROFILES: &'static [Option<PropProfile>] = &[#(#prop_profiles),*];

                const PROP_FOR_RENDERS: &'static [bool] = &[#(#prop_for_renders),*];

                const PROP_IS_PUBLICS: &'static [bool] = &[#(#prop_is_publics),*];

                const PROP_VALUE_TYPES: &'static [PropValueType] = &[#(#prop_value_types),*];

                const DEFAULT_PROP: Option<LocalPropIdx> = #default_prop;
            }
        };

        ret
    }

    /// Generate the `impl ComponentNode for ...` trait for the component.
    pub fn impl_component_node_trait(&self) -> TokenStream {
        let ret = quote! {
            impl ComponentNode for Component {
                fn get_component_type(&self) -> &'static str {
                    Component::NAME
                }

                fn ref_transmutes_to(&self) -> Option<&'static str> {
                    Component::REF_TRANSMUTES_TO
                }

                fn extend_via_default_prop(&self) -> bool {
                    Component::EXTEND_VIA_DEFAULT_PROP
                }
            }
        };

        ret
    }

    /// Implement the `ComponentProps` trait for the component.
    pub fn impl_component_variant_props_trait(&self) -> TokenStream {
        let ret = quote! {
            impl ComponentVariantProps for Component {
                fn get_prop_updater(&self, local_prop_idx: LocalPropIdx) -> Box<dyn PropUpdater> {
                    PropGetUpdater::get_updater(&Component::PROPS[*local_prop_idx])
                }
                fn get_num_props(&self) -> usize {
                    Component::PROP_NAMES.len()
                }
                fn get_prop_is_for_render(&self, local_prop_idx: LocalPropIdx) -> bool {
                    Component::PROP_FOR_RENDERS[*local_prop_idx]
                }
                fn get_prop_name(&self, local_prop_idx: LocalPropIdx) -> &'static str {
                    Component::PROP_NAMES[*local_prop_idx]
                }
                fn get_prop_names(&self) -> &'static [&'static str] {
                    &Component::PROP_NAMES
                }
                fn get_prop_profile(&self, local_prop_idx: LocalPropIdx) -> Option<PropProfile> {
                    Component::PROP_PROFILES[*local_prop_idx]
                }
                fn get_prop_is_public(&self, local_prop_idx: LocalPropIdx) -> bool {
                    Component::PROP_IS_PUBLICS[*local_prop_idx]
                }
                fn get_prop_value_type(&self, local_prop_idx: LocalPropIdx) -> PropValueType {
                    Component::PROP_VALUE_TYPES[*local_prop_idx].clone()
                }
                fn get_default_prop_local_index(&self) -> Option<LocalPropIdx> {
                    Component::DEFAULT_PROP
                }
            }
        };

        ret
    }

    pub fn impl_component_attributes_trait(&self) -> TokenStream {
        quote! {
            impl ComponentAttributes for Component {
                fn get_attribute_names(&self) -> Vec<AttributeName> {
                    Component::ATTRIBUTE_NAMES.iter().map(|x| *x).collect()
                }
            }
        }
    }

    pub fn impl_component_actions_trait(&self) -> TokenStream {
        quote! {
            impl ComponentActions for Component {
                fn get_action_names(&self) -> &'static [&'static str] {
                    Component::ACTION_NAMES
                }
            }
        }
    }

    /// Generate teh `ComponentOnAction` trait. If there are no actions,
    /// the default implementation is given (which errors on any action).
    /// If there are any actions, no implementation is given because the
    /// component author must implement the trait themselves.
    pub fn impl_component_on_action_trait(&self) -> TokenStream {
        if self.actions.get_action_names().is_empty() {
            quote! {
                impl ComponentOnAction for Component {}
            }
        } else {
            quote! {}
        }
    }

    /// Implement the `ComponentChildren` trait for the component.
    /// The implementation chosen is based on `self.children` which specifies
    /// `Passthrough`, `None`, or `Handle`. If `Handle` is specified, the component
    /// author must implement the trait themselves so an empty token stream is returned.
    pub fn impl_component_children_trait(&self) -> TokenStream {
        match self.rendered_children {
            RenderedChildren::Handle => {
                quote! {}
            }
            RenderedChildren::None => {
                quote! {
                    impl ComponentChildren for Component {
                        fn get_rendered_children(&self, _: ChildQueryObject) -> Vec<GraphNode> {
                            // Return no children
                            Vec::new()
                        }
                    }
                }
            }
            RenderedChildren::Passthrough => {
                quote! {
                    impl ComponentChildren for Component {
                        fn get_rendered_children(&self, child_query_object: ChildQueryObject) -> Vec<GraphNode> {
                            // Return the children passed through without modification
                            child_query_object.child_iter().collect()
                        }
                    }
                }
            }
        }
    }
}

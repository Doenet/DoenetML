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
                        fn set_idx(&mut self, idx: ComponentIdx) {
                            self.idx = idx;
                        }
                        fn get_parent(&self) -> Option<ComponentIdx> {
                            self.parent
                        }
                        fn set_parent(&mut self, parent: Option<ComponentIdx>) {
                            self.parent = parent;
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

                        fn initialize(&mut self, idx: ComponentIdx, parent: Option<ComponentIdx>, position: Option<DastPosition>) {
                            self.idx = idx;
                            self.parent = parent;
                            self.position = position;

                            self.initialize_state_variables();

                            self.rendered_state_variable_indices = self
                                .get_state_variables()
                                .iter()
                                .enumerate()
                                .filter_map(|(ind, state_var)| state_var.return_for_renderer().then(|| ind))
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
                        fn set_extend(&mut self, extend_source: Option<ExtendSource>) {
                            self.extend = extend_source;
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

                        fn get_state_variables(&mut self) -> &mut Vec<StateVar> {
                            &mut self.state_variables
                        }

                        fn get_rendered_state_variable_indices(&self) -> &Vec<usize> {
                            &self.rendered_state_variable_indices
                        }

                        fn get_state_variable_index_from_name(&self, name: &String) -> Option<usize> {
                            self.state_variable_name_to_index.get(name).copied()
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
        syn::Data::Enum(v) => {
            let variants = &v.variants;
            let enum_ident = name;

            let mut create_object_variant_arms = Vec::new();
            let mut get_idx_variant_arms = Vec::new();
            let mut set_idx_variant_arms = Vec::new();
            let mut get_parent_variant_arms = Vec::new();
            let mut set_parent_variant_arms = Vec::new();
            let mut get_children_variant_arms = Vec::new();
            let mut set_children_variant_arms = Vec::new();
            let mut replace_children_variant_arms = Vec::new();
            let mut initialize_variant_arms = Vec::new();
            let mut get_extend_variant_arms = Vec::new();
            let mut set_extend_variant_arms = Vec::new();
            let mut get_component_type_variant_arms = Vec::new();
            let mut set_descendant_names_variant_arms = Vec::new();
            let mut get_descendant_matches_variant_arms = Vec::new();
            let mut get_position_variant_arms = Vec::new();
            let mut set_position_variant_arms = Vec::new();
            let mut get_num_state_variables_variant_arms = Vec::new();
            let mut get_state_variables_variant_arms = Vec::new();
            let mut get_rendered_state_variable_indices_variant_arms = Vec::new();
            let mut get_state_variable_index_from_name_variant_arms = Vec::new();
            let mut get_component_profile_state_variables_variant_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                create_object_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => Box::new(comp),
                });

                get_idx_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_idx()
                    },
                });

                set_idx_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(ref mut comp) => {
                        comp.set_idx(idx);
                    },
                });

                get_parent_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_parent()
                    },
                });

                set_parent_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(ref mut comp) => {
                        comp.set_parent(parent);
                    },
                });

                get_children_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_children()
                    },
                });

                set_children_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(ref mut comp) => {
                        comp.set_children(children);
                    },
                });

                replace_children_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(ref mut comp) => {
                        comp.replace_children(new_children)
                    },
                });

                initialize_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(ref mut comp) => {
                        comp.initialize(idx, parent, position);
                    },
                });

                get_extend_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_extend()
                    },
                });

                set_extend_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(ref mut comp) => {
                        comp.set_extend(extend_source);
                    },
                });

                get_component_type_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_component_type()
                    },
                });

                set_descendant_names_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(ref mut comp) => {
                        comp.set_descendant_names(descendant_names);
                    },
                });

                get_descendant_matches_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_descendant_matches(name)
                    },
                });

                get_position_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_position()
                    },
                });

                set_position_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(ref mut comp) => {
                        comp.set_position(position);
                    },
                });

                get_num_state_variables_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_num_state_variables()
                    },
                });

                get_state_variables_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(ref mut comp) => {
                        comp.get_state_variables()
                    },
                });

                get_rendered_state_variable_indices_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_rendered_state_variable_indices()
                    },
                });

                get_state_variable_index_from_name_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_state_variable_index_from_name(name)
                    },
                });

                get_component_profile_state_variables_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_component_profile_state_variables()
                    },
                });
            }

            quote! {
                impl #enum_ident {
                    // TODO: do we keep this method around?
                    pub fn create_component_node_object_reference(&mut self) -> Box<&mut dyn ComponentNode> {
                        match self {
                            #(#create_object_variant_arms)*
                        }
                    }
                }

                impl ComponentNode for #enum_ident {

                    fn get_idx(&self) -> ComponentIdx {
                        match self {
                            #(#get_idx_variant_arms)*
                        }
                    }

                    fn set_idx(&mut self, idx: ComponentIdx){
                        match self {
                            #(#set_idx_variant_arms)*
                        }
                    }

                    fn get_parent(&self) -> Option<ComponentIdx> {
                        match self {
                            #(#get_parent_variant_arms)*
                        }
                    }

                    fn set_parent(&mut self, parent: Option<ComponentIdx>){
                        match self {
                            #(#set_parent_variant_arms)*
                        }
                    }

                    fn get_children(&self) -> &Vec<ComponentChild> {
                        match self {
                            #(#get_children_variant_arms)*
                        }
                    }

                    fn set_children(&mut self, children: Vec<ComponentChild>) {
                        match self {
                            #(#set_children_variant_arms)*
                        }
                    }

                    fn replace_children(&mut self, new_children: Vec<ComponentChild>) -> Vec<ComponentChild> {
                        match self {
                            #(#replace_children_variant_arms)*
                        }
                    }

                    fn initialize(&mut self, idx: ComponentIdx, parent: Option<ComponentIdx>, position: Option<DastPosition>) {
                        match self {
                            #(#initialize_variant_arms)*
                        }
                    }

                    fn get_extend(&self) -> Option<&ExtendSource> {
                        match self {
                            #(#get_extend_variant_arms)*
                        }
                    }

                    fn set_extend(&mut self, extend_source: Option<ExtendSource>) {
                        match self {
                            #(#set_extend_variant_arms)*
                        }
                    }

                    fn get_component_type(&self) -> &str {
                        match self {
                            #(#get_component_type_variant_arms)*
                        }
                    }

                    fn set_descendant_names(&mut self, descendant_names: HashMap<String, Vec<ComponentIdx>>) {
                        match self {
                            #(#set_descendant_names_variant_arms)*
                        }
                    }

                    fn get_descendant_matches(&self, name: &str) -> Option<&Vec<ComponentIdx>> {
                        match self {
                            #(#get_descendant_matches_variant_arms)*
                        }
                    }

                    fn get_position(&self) -> Option<&DastPosition> {
                        match self {
                            #(#get_position_variant_arms)*
                        }
                    }

                    fn set_position(&mut self, position: Option<DastPosition>){
                        match self {
                            #(#set_position_variant_arms)*
                        }
                    }

                    fn get_num_state_variables(&self) -> usize{
                        match self {
                            #(#get_num_state_variables_variant_arms)*
                        }
                    }

                    fn get_state_variables(&mut self) -> &mut Vec<StateVar>{
                        match self {
                            #(#get_state_variables_variant_arms)*
                        }
                    }

                    fn get_rendered_state_variable_indices(&self) -> &Vec<usize> {
                        match self {
                            #(#get_rendered_state_variable_indices_variant_arms)*
                        }
                    }

                    fn get_state_variable_index_from_name(&self, name: &String) -> Option<usize> {
                        match self {
                            #(#get_state_variable_index_from_name_variant_arms)*
                        }
                    }

                    fn get_component_profile_state_variables(&self) -> &Vec<ComponentProfileStateVariable> {
                        match self {
                            #(#get_component_profile_state_variables_variant_arms)*
                        }
                    }
                }
            }
        }
        _ => panic!("only structs and enums supported"),
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
                    #enum_ident::#variant_ident(ref mut comp) => {
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

                    fn to_flat_dast(&mut self, components: &Vec<Rc<RefCell<ComponentEnum>>>) -> FlatDastElement {
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
        syn::Data::Enum(v) => {
            let variants = &v.variants;
            let enum_ident = name;

            let mut initialize_state_variables_variant_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                initialize_state_variables_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.initialize_state_variables()
                    },
                });
            }

            quote! {

                impl ComponentNodeStateVariables for #enum_ident {

                    fn initialize_state_variables(&mut self) {
                        match self {
                            #(#initialize_state_variables_variant_arms)*
                        }
                    }

                }
            }
        }
        _ => panic!("only structs and enums supported"),
    };
    output.into()
}

extern crate proc_macro2;

use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use proc_macro2::Span;
use quote::quote;
use syn::{self, FieldsNamed, Ident};

#[proc_macro_derive(ComponentNode)]
pub fn component_node_derive(input: TokenStream) -> TokenStream {
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
                        }
                        _ => false,
                    })
                    .map(|f| &f.ident);

                // Convert string names to camel case
                let state_var_strings = state_var_fields
                    .clone()
                    .map(|x| x.clone().map(ident_camel_case));

                // Convert struct name to camel case, preserving any initial '_'
                let mut component_string = name.to_string();
                if component_string.starts_with("_") {
                    component_string = format!("_{}", component_string.to_case(Case::Camel));
                } else {
                    component_string = component_string.to_case(Case::Camel);
                }

                quote! {
                    impl ComponentNode for #name {
                        fn get_ind(&self) -> ComponentInd {
                            self.ind
                        }
                        fn set_ind(&mut self, ind: ComponentInd) {
                            self.ind = ind;
                        }
                        fn get_parent(&self) -> Option<ComponentInd> {
                            self.parent
                        }
                        fn set_parent(&mut self, parent: Option<ComponentInd>) {
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

                        fn initialize(&mut self, ind: ComponentInd, parent: Option<ComponentInd>, position: Option<DastPosition>) {
                            self.ind = ind;
                            self.parent = parent;
                            self.position = position;
                        }

                        fn get_extend(&self) -> &Option<ExtendSource> {
                            &self.extend
                        }
                        fn set_extend(&mut self, extend_source: Option<ExtendSource>) {
                            self.extend = extend_source;
                        }

                        fn get_component_type(&self) -> &str {
                            #component_string
                        }
                        fn get_descendant_matches(&self, name: &str) -> Option<&Vec<ComponentInd>> {
                            self.descendant_names.get(name)
                        }
                        fn set_descendant_names(&mut self, descendant_names: HashMap<String, Vec<ComponentInd>>) {
                            self.descendant_names = descendant_names;
                        }

                        fn get_position(&self) -> &Option<DastPosition> {
                            &self.position
                        }

                        fn set_position(&mut self, position: Option<DastPosition>) {
                            self.position = position;
                        }


                        // fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar> {
                        //     &self.essential_state_vars
                        // }

                        // fn get_state_var(&self, name: StateVarName) -> Option<&StateVar> {
                        //     match name {
                        //         #(
                        //             stringify!(#state_var_strings) => Some(&self.#state_var_fields),
                        //         )*
                        //         _ => None,
                        //     }
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
            let mut get_ind_variant_arms = Vec::new();
            let mut set_ind_variant_arms = Vec::new();
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
            let mut to_flat_dast_variant_arms = Vec::new();

            for variant in variants {
                let variant_ident = &variant.ident;

                create_object_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => Box::new(comp),
                });

                get_ind_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.get_ind()
                    },
                });

                set_ind_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(ref mut comp) => {
                        comp.set_ind(ind);
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
                        comp.initialize(ind, parent, position);
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

                to_flat_dast_variant_arms.push(quote! {
                    #enum_ident::#variant_ident(comp) => {
                        comp.to_flat_dast(components)
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

                    fn get_ind(&self) -> ComponentInd {
                        match self {
                            #(#get_ind_variant_arms)*
                        }
                    }

                    fn set_ind(&mut self, ind: ComponentInd){
                        match self {
                            #(#set_ind_variant_arms)*
                        }
                    }

                    fn get_parent(&self) -> Option<ComponentInd> {
                        match self {
                            #(#get_parent_variant_arms)*
                        }
                    }

                    fn set_parent(&mut self, parent: Option<ComponentInd>){
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

                    fn initialize(&mut self, ind: ComponentInd, parent: Option<ComponentInd>, position: Option<DastPosition>) {
                        match self {
                            #(#initialize_variant_arms)*
                        }
                    }

                    fn get_extend(&self) -> &Option<ExtendSource> {
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

                    fn set_descendant_names(&mut self, descendant_names: HashMap<String, Vec<ComponentInd>>) {
                        match self {
                            #(#set_descendant_names_variant_arms)*
                        }
                    }

                    fn get_descendant_matches(&self, name: &str) -> Option<&Vec<ComponentInd>> {
                        match self {
                            #(#get_descendant_matches_variant_arms)*
                        }
                    }

                    fn get_position(&self) -> &Option<DastPosition> {
                        match self {
                            #(#get_position_variant_arms)*
                        }
                    }

                    fn set_position(&mut self, position: Option<DastPosition>){
                        match self {
                            #(#set_position_variant_arms)*
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

fn ident_camel_case(ident: Ident) -> Ident {
    Ident::new(&ident.to_string().to_case(Case::Camel), Span::call_site())
}

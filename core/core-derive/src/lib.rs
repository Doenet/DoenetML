
use proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_derive(ComponentLike)]
pub fn component_like_derive(input: TokenStream) -> TokenStream {
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = syn::parse(input).unwrap();

    // Build the trait implementation
    impl_component_like(&ast)
}

fn impl_component_like(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {
        impl ComponentLike for #name {


            fn name(&self) -> String {
                self.name.clone()
            }
            fn children(&self) -> RefCell<Vec<ComponentChild>> {
                // Is this really the best way to do this?
                self.children.clone()
            }
            fn parent(&self) -> RefCell<String> {
                // Is this really the best way to do this?
                self.parent.clone()
            }
        
        
            fn parent_name(&self) -> Option<String> {
                let parent_name = self.parent.borrow().to_string();
                if parent_name.is_empty() {
                    Option::None
                } else {
                    Option::Some(parent_name)
                }
            }
        
            fn add_as_child(&self, child: ComponentChild) {
                if let ComponentChild::Component(ref child_component) = child {
                    let child_parent = Rc::clone(&child_component).parent();
                    let mut child_parent_cell = child_parent.borrow_mut();
                    *child_parent_cell = self.name.clone();
                }
        
                self.children.borrow_mut().push(child); 
            }


            
        }
    };
    gen.into()
}

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

            fn name(&self) -> &str {
                &self.name
            }
            fn children(&self) -> &Vec<ComponentChild> {
                // Is this really the best way to do this?
                &self.children
            }

            fn parent(&self) -> &Option<String> {
                &self.parent
            }
        }

        
    };
    gen.into()
}
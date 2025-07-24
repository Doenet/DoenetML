use std::borrow::Borrow;

use proc_macro2::TokenStream;

#[allow(unused)]
pub fn pretty_print<A: Borrow<TokenStream>>(ts: A) -> String {
    let ts = ts.borrow();
    let file = syn::parse_file(&ts.to_string()).unwrap();
    prettyplease::unparse(&file)
}

#[allow(unused)]
pub fn pretty_print_result<A: Borrow<syn::Result<TokenStream>>>(result: A) -> String {
    match result.borrow() {
        Ok(ts) => {
            let source = ts.to_string();
            let file = syn::parse_file(&source).unwrap();
            prettyplease::unparse(&file)
        }
        Err(e) => e.to_compile_error().to_string(),
    }
}

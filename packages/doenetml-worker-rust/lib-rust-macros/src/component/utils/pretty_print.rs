use std::borrow::Borrow;

use proc_macro2::TokenStream;

pub fn pretty_print<A: Borrow<TokenStream>>(ts: A) -> String {
    let ts = ts.borrow();
    let file = syn::parse_file(&ts.to_string()).unwrap();
    prettyplease::unparse(&file)
}

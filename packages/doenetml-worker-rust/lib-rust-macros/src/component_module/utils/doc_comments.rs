/// Extract doc comments from a `syn::Attribute`.
pub fn doc_comment_from_attrs(attrs: &[syn::Attribute]) -> Option<String> {
    let comments = attrs
        .iter()
        .filter_map(|attr| {
            if attr.path().is_ident("doc") {
                let meta = &attr.meta;
                if let syn::Meta::NameValue(nv) = meta
                    && let syn::Expr::Lit(lit) = &nv.value
                        && let syn::Lit::Str(lit) = &lit.lit {
                            return Some(lit.value());
                        }
            }
            None
        })
        .collect::<Vec<_>>();
    match comments.len() {
        0 => None,
        _ => Some(comments.join(" ")),
    }
}

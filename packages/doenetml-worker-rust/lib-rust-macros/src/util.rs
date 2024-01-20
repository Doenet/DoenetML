use syn::{self, Type};

pub fn find_type_from_state_var(ty: &Type) -> Option<&proc_macro2::Ident> {
    if let Type::Path(type_path) = ty {
        let seg: &syn::PathSegment = &type_path.path.segments[0];

        return Some(&seg.ident);
    }
    None
}

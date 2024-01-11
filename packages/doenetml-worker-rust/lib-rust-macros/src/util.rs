use syn::{self, GenericArgument, PathArguments, Type, TypePath};

pub fn find_type_from_state_var_typed(ty: &Type) -> Option<&proc_macro2::Ident> {
    if let Type::Path(type_path) = ty {
        let seg = &type_path.path.segments[0];

        if seg.ident == "StateVarTyped" {
            if let PathArguments::AngleBracketed(path_args) = &seg.arguments {
                if let GenericArgument::Type(Type::Path(TypePath { path, .. })) = &path_args.args[0]
                {
                    return Some(&path.segments[0].ident);
                }
            }
        }
    }
    None
}

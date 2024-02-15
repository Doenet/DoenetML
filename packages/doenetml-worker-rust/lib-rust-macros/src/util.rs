use proc_macro2::Ident;
use syn::{self, Attribute, GenericArgument, Meta, PathArguments, Type, TypePath};

pub fn find_type_from_prop(ty: &Type) -> Option<&Ident> {
    if let Type::Path(type_path) = ty {
        let seg: &syn::PathSegment = &type_path.path.segments[0];

        return Some(&seg.ident);
    }
    None
}

pub fn find_type_from_prop_with_generics(ty: &Type) -> Option<&Ident> {
    if let Type::Path(type_path) = ty {
        let seg = &type_path.path.segments[0];

        if let PathArguments::AngleBracketed(path_args) = &seg.arguments {
            if let GenericArgument::Type(Type::Path(TypePath { path, .. })) = &path_args.args[0] {
                return Some(&path.segments[0].ident);
            }
        }
    }
    None
}

pub fn has_attribute(attrs: &[Attribute], attr_name: &str) -> bool {
    for attr in attrs.iter() {
        if let Meta::Path(path) = &attr.meta {
            if path.segments[0].ident == attr_name {
                return true;
            }
        }
    }
    false
}

// TODO: no longer need this as we've changed component_profile_prop.
// However, we could use this pattern to specify an integer to order these props.

// pub fn return_identities_if_have_attribute(attrs: &[Attribute], attr_name: &str) -> Vec<Ident> {
//     let mut identities = Vec::new();
//     for attr in attrs.iter() {
//         if let Meta::List(meta_list) = &attr.meta {
//             if meta_list.path.segments[0].ident == attr_name {
//                 let parse_result: Result<Ident, _> = syn::parse2(meta_list.tokens.clone());

//                 if let Ok(ident) = parse_result {
//                     identities.push(ident)
//                 }
//             }
//         }
//     }

//     identities
// }

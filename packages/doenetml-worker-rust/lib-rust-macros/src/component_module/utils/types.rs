use darling::{FromDeriveInput, ast, util};
use proc_macro2::Ident;

/// An `enum` that is found inside the module.
/// This is a generic type. Its `data` will be processed further.
#[derive(Debug, FromDeriveInput)]
pub struct EnumInBody {
    #[allow(unused)]
    pub ident: Ident,
    /// The data about variants in the enum. We don't process this yet
    /// because the information associate with the variant depends on whether it is an `Attributes` or `Actions` enum.
    pub data: ast::Data<syn::Variant, util::Ignored>,
}

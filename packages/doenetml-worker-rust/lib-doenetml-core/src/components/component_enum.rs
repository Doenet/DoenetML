use enum_dispatch::enum_dispatch;
use strum_macros::EnumString;

pub use super::_error::_Error;
pub use super::_external::_External;
pub use super::_ref::_Ref;
pub use super::doenet::_fragment::_Fragment;
pub use super::doenet::boolean::Boolean;
pub use super::doenet::document::Document;
//pub use super::doenet::math::Math;
pub use super::doenet::p::P;
pub use super::doenet::section::Section;
pub use super::doenet::text::Text;
pub use super::doenet::text_input::TextInput;
pub use super::doenet::title::Title;
pub use super::doenet::xref::Xref;

/// A enum that can contain a component of any possible component type.
///
/// The component node traits are implemented on the `ComponentEnum`
/// to allow easy access to the methods.
///
/// Each component type added to `ComponentEnum` must implement that component node traits.
#[derive(Debug, EnumString, Clone)]
#[enum_dispatch(
    ComponentNode,
    ComponentVariantProps,
    ComponentAttributes,
    ComponentActions,
    ComponentOnAction
)]
#[strum(ascii_case_insensitive)]
pub enum ComponentEnum {
    Text(Text),
    TextInput(TextInput),
    //    Math(Math),
    Boolean(Boolean),
    Section(Section),
    Title(Title),
    P(P),
    Document(Document),
    Xref(Xref),
    _Error(_Error),
    _External(_External),
    _Fragment(_Fragment),
    _Ref(_Ref),
}

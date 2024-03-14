use enum_dispatch::enum_dispatch;
use strum_macros::EnumString;

pub use super::_error::_Error;
pub use super::_external::_External;
pub use super::doenet::boolean::Boolean;
pub use super::doenet::document::Document;
//pub use super::doenet::math::Math;
pub use super::doenet::p::P;
pub use super::doenet::section::Section;
pub use super::doenet::text::Text;
pub use super::doenet::title::Title;
//pub use super::doenet::text_input::TextInput;

/// A enum that can contain a component of any possible component type.
///
/// The component node traits are implemented on the `ComponentEnum`
/// to allow easy access to the methods.
///
/// Each component type added to `ComponentEnum` must implement that component node traits.
#[derive(Debug, EnumString)]
#[enum_dispatch(
    ComponentNode,
    ComponentVariantProps,
    ComponentAttributes,
    ComponentActions,
    ComponentOnAction,
    ComponentChildren
)]
#[strum(ascii_case_insensitive)]
// Components vary in size. It is unclear if we want to `Box` all of them,
// or accept a size-inefficient data structure for simplicity.
// Revisit when we have more components.
#[allow(clippy::large_enum_variant)]
pub enum ComponentEnum {
    Text(Text),
    //    TextInput(TextInput),
    //    Math(Math),
    Boolean(Boolean),
    Section(Section),
    Title(Title),
    P(P),
    Document(Document),
    _Error(_Error),
    _External(_External),
}

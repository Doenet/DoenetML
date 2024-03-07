use enum_dispatch::enum_dispatch;
use strum_macros::EnumString;

use super::_error::*;
use super::_external::*;
//use super::doenet::boolean::*;
use super::doenet::document::*;
//use super::doenet::math::*;
//use super::doenet::p::*;
//use super::doenet::section::*;
//use super::doenet::text::*;
//use super::doenet::text_input::*;

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
    ComponentChildren
)]
#[strum(ascii_case_insensitive)]
// Components vary in size. It is unclear if we want to `Box` all of them,
// or accept a size-inefficient data structure for simplicity.
// Revisit when we have more components.
#[allow(clippy::large_enum_variant)]
pub enum ComponentEnum {
    //    Text(Text),
    //    TextInput(TextInput),
    //    Math(Math),
    //    Boolean(Boolean),
    //    Section(Section),
    //    P(P),
    Document(Document),
    _Error(_Error),
    _External(_External),
}

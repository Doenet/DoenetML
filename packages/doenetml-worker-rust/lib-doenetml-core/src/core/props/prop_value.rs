#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use crate::state::types::{element_refs::ElementRefs, math_expr::MathExpr};

///////////////////////////////////////////////////////////////////////
// prop enum views that allow one to refer to props
// without specifying type.
// Particularly useful for having vectors of mixed type
///////////////////////////////////////////////////////////////////////

/// The value of a prop tagged with its type.
#[derive(
    Debug,
    Clone,
    PartialEq, // TODO: this might be too much to require on all value types if we have complex types
    serde::Serialize,
    serde::Deserialize,
    derive_more::TryInto,
    derive_more::From,
    strum_macros::EnumDiscriminants,
)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub enum PropValue {
    String(String),
    Number(f64),
    Integer(i64),
    Boolean(bool),
    Math(MathExpr),
    // TODO: when create array props, convert this to use the general array mechanism
    // Created a vector type for now.
    ElementRefs(ElementRefs),
}

/// The discriminating type of a `PropValue`.
pub type PropValueType = PropValueDiscriminants;

pub mod prop_type {
    //! This module provides a type for each discriminant of `PropValue`.
    pub struct String;
    pub struct Number;
    pub struct Integer;
    pub struct Boolean;
    pub struct Math;
    pub struct ElementRefs;
}

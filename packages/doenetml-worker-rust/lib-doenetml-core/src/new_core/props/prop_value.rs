#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use crate::state::types::math_expr::MathExpr;

///////////////////////////////////////////////////////////////////////
// prop enum views that allow one to refer to props
// without specifying type.
// Particularly useful for having vectors of mixed type
///////////////////////////////////////////////////////////////////////

/// The value of a prop tagged with its type.
#[derive(
    Debug,
    Clone,
    PartialEq,
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
}

pub mod prop_type {
    //! This module provides a type for each discriminant of `PropValue`.
    pub struct String;
    pub struct Number;
    pub struct Integer;
    pub struct Boolean;
    pub struct Math;
}

#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use crate::{
    graph_node::GraphNode,
    state::types::{element_refs::ElementRefs, math_expr::MathExpr},
};

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
    // TODO: when create array props, convert this to use the general array mechanism
    // Created a vector type for now.
    GraphNodes(Vec<GraphNode>),
}

/// The discriminating type of a `PropValue`.
pub type PropValueType = PropValueDiscriminants;

pub mod prop_type {
    //! This module provides a type for each discriminant of `PropValue`.
    //! Along with each of these types is also a tuple of the created type and the inner value of the type.
    //! E.g., if there is a `PropValue::Foo(usize)`, then there will be a `Foo` struct and a `FooInner = (Foo, usize)` type.
    //! These are used for typing tricks with macros and the API.

    #[derive(Debug, Copy, Clone, PartialEq, Eq)]
    pub struct String;
    #[derive(Debug, Copy, Clone, PartialEq, Eq)]
    pub struct Number;
    #[derive(Debug, Copy, Clone, PartialEq, Eq)]
    pub struct Integer;
    #[derive(Debug, Copy, Clone, PartialEq, Eq)]
    pub struct Boolean;
    #[derive(Debug, Copy, Clone, PartialEq, Eq)]
    pub struct Math;
    #[derive(Debug, Copy, Clone, PartialEq, Eq)]
    pub struct ElementRefs;
    pub struct GraphNodes;
}

impl<'a> TryFrom<&'a PropValue> for &'a String {
    type Error = anyhow::Error;

    fn try_from(value: &'a PropValue) -> Result<Self, Self::Error> {
        match value {
            PropValue::String(x) => Ok(x),
            _ => Err(anyhow::anyhow!("Expected String")),
        }
    }
}
impl<'a> TryFrom<&'a PropValue> for &'a i64 {
    type Error = anyhow::Error;

    fn try_from(value: &'a PropValue) -> Result<Self, Self::Error> {
        match value {
            PropValue::Integer(x) => Ok(x),
            _ => Err(anyhow::anyhow!("Expected Integer")),
        }
    }
}

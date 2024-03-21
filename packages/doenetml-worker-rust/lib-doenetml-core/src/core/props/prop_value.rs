use std::rc::Rc;

#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use crate::utils::rc_serde;
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
    doenetml_macros::TryFromRef,
    strum_macros::EnumDiscriminants,
)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub enum PropValue {
    #[serde(with = "rc_serde")]
    String(Rc<String>),
    Number(f64),
    Integer(i64),
    Boolean(bool),
    #[serde(with = "rc_serde")]
    Math(Rc<MathExpr>),
    // TODO: when create array props, convert this to use the general array mechanism
    // Created a vector type for now.
    #[serde(with = "rc_serde")]
    ElementRefs(Rc<ElementRefs>),
    // TODO: when create array props, convert this to use the general array mechanism
    // Created a vector type for now.
    #[serde(with = "rc_serde")]
    GraphNodes(Rc<Vec<GraphNode>>),
}

/// The discriminating type of a `PropValue`.
pub type PropValueType = PropValueDiscriminants;

mod conversions {
    //! Implementation of `From` traits for `PropValue`.

    use super::*;

    impl From<String> for PropValue {
        fn from(v: String) -> Self {
            PropValue::String(Rc::new(v))
        }
    }

    impl From<&str> for PropValue {
        fn from(v: &str) -> Self {
            PropValue::String(Rc::new(v.to_string()))
        }
    }
}

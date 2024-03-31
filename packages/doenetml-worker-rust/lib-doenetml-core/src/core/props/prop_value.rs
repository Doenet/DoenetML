use std::rc::Rc;

#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use crate::utils::rc_serde;
use crate::{graph_node::GraphNode, state::types::math_expr::MathExpr};

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
    String(prop_type::String),
    Number(prop_type::Number),
    Integer(prop_type::Integer),
    Boolean(prop_type::Boolean),
    #[serde(with = "rc_serde")]
    Math(prop_type::Math),
    // TODO: when create array props, convert this to use the general array mechanism
    // Created a vector type for now.
    #[serde(with = "rc_serde")]
    ElementRefs(prop_type::ElementRefs),
    // TODO: when create array props, convert this to use the general array mechanism
    // Created a vector type for now.
    #[serde(with = "rc_serde")]
    GraphNodes(prop_type::GraphNodes),
}

/// The discriminating type of a `PropValue`.
pub type PropValueType = PropValueDiscriminants;

pub mod prop_type {
    //! Type aliases for the inner type of `PropValue`.
    //! These are are named exactly the same as the discriminants of `PropValue`
    //! so that they can be used in macros.

    use super::*;
    use crate::state::types::element_refs;

    pub type String = Rc<std::string::String>;
    pub type Number = f64;
    pub type Integer = i64;
    pub type Boolean = bool;
    pub type Math = Rc<MathExpr>;
    pub type ElementRefs = Rc<element_refs::ElementRefs>;
    pub type GraphNodes = Rc<Vec<GraphNode>>;
}

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

    impl TryFrom<PropValue> for String {
        type Error = &'static str;
        fn try_from(value: PropValue) -> Result<Self, Self::Error> {
            TryInto::<prop_type::String>::try_into(value).map(|s| (*s).clone())
        }
    }
}

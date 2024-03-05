use crate::state::types::math_expr::MathExpr;

use super::prelude::PropValue;

/// A `ComponentProfile` is used in a `DataQuery` specifying children or attribute children.
/// A component profile will match children that have a prop of the corresponding type
/// that has been designated with `#[component_profile_prop]`.
/// When a prop from a child is matched, the value of that prop is returned.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ComponentProfile {
    /// Matches String props as well as literal string children
    String,
    /// Matches literal string children. Use if wish to exclude String props.
    /// Use the `String` variant to also match string props.
    LiteralString,
    /// Matches Number props
    Number,
    /// Matches Math props
    Math,
    /// Matches Integer props
    Integer,
    /// Matches Boolean props
    Boolean,
}

// TODO: implement with macro?
impl ComponentProfile {
    /// Return the default value that is associated with the type of prop
    /// represented by the component profile.
    pub fn default(&self) -> PropValue {
        match self {
            ComponentProfile::Boolean => PropValue::Boolean(bool::default()),
            ComponentProfile::Integer => PropValue::Integer(i64::default()),
            ComponentProfile::Number => PropValue::Number(f64::default()),
            ComponentProfile::Math => PropValue::Math(MathExpr::default()),
            ComponentProfile::LiteralString | ComponentProfile::String => {
                PropValue::String(String::default())
            }
        }
    }
}

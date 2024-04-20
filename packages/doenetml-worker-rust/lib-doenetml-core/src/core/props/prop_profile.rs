use std::rc::Rc;

use crate::state::types::{
    component_refs::ComponentRefs, math_expr::MathExpr, xref_label::XrefLabel,
};

use super::PropValue;

/// A `PropProfile` is used in a `DataQuery` to match a particular type of prop.
/// It can be used to filter components based on the presence of a prop with the `PropProfile`
/// or to return the value of the prop that matches the `PropProfile`.
///
/// A `PropProfile` is assigned to a prop by the `profile` attribute.
/// A prop can have only one `PropProfile`.
///
/// A prop with a particular `PropProfile` must be of a particular type.
/// TODO - this is currently not implemented.
/// Where do we specify this and how do we enforce it? Presumably in this `enum`.
/// (Right now, the type can be inferred from the `default()` function.)
/// If you specify the `profile` of a prop, should you no longer be able to specify the `value_type` attribute
/// as it is inferred from the `profile`?
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PropProfile {
    /// Matches String props as well as literal string children
    String,
    /// Matches literal string children. Use if wish to exclude String props.
    /// Use the `String` variant to also match string props.
    /// TODO - how do we prevent props from being given the `PropProfile`?
    /// We haven't yet used `LiteralString` without also including `String`,
    /// but there are probably going to be cases where we want to restrict to literal strings?
    LiteralString,
    /// Matches Number props
    Number,
    /// Matches Math props
    Math,
    /// Matches Integer props
    Integer,
    /// Matches Boolean props
    Boolean,
    /// Matches the hidden prop
    Hidden,
    /// Matches the SerialNumber prop
    SerialNumber,
    /// Matches the CodeNumber prop
    CodeNumber,
    /// Matches a prop that indicates the depth of a division in a hierarchy of divisions. E.g.,
    /// how many levels deep a `<section>` is nested.
    DivisionDepth,
    /// Matches a prop that can be rendered (e.g., contains `ComponentRefs` but is not `RenderedChildren`.
    /// This is used on props like `<section>.title` which contain references to content but are not themselves used for
    /// rendering children.)
    Renderable,
    /// Matches the RenderedChildren prop
    RenderedChildren,
    /// Matches a prop that stores a reference to another component.
    _Ref,
    /// Matches a prop that stores a label suitable for a text-only reference to the component.
    XrefLabel,
}

// TODO: implement with macro?
impl PropProfile {
    /// Return the default value that is associated with the type of prop
    /// represented by the component profile.
    pub fn default(&self) -> PropValue {
        match self {
            PropProfile::Boolean => PropValue::Boolean(bool::default()),
            PropProfile::Integer => PropValue::Integer(i64::default()),
            PropProfile::Number => PropValue::Number(f64::default()),
            PropProfile::Math => PropValue::Math(Rc::new(MathExpr::default())),
            PropProfile::LiteralString | PropProfile::String | PropProfile::CodeNumber => {
                PropValue::String(Rc::new(String::default()))
            }
            PropProfile::Hidden => PropValue::Boolean(bool::default()),
            PropProfile::RenderedChildren | PropProfile::Renderable => {
                PropValue::ComponentRefs(Rc::new(ComponentRefs::default()))
            }
            PropProfile::SerialNumber => PropValue::Integer(i64::default()),
            PropProfile::DivisionDepth => PropValue::Integer(i64::default()),
            PropProfile::_Ref => PropValue::ComponentRef(None),
            PropProfile::XrefLabel => PropValue::XrefLabel(Rc::new(XrefLabel::default())),
        }
    }
}

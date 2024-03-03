use std::fmt;

#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use doenetml_derive::{
    FromPropIntoPropEnumRefs, PropMethods, PropMethodsMut, PropViewMethods, PropViewMutMethods,
};

use crate::{
    components::doenet::{boolean::Boolean, math::Math, text::Text},
    components::ComponentProfile,
    dependency::{DataQuery, DependenciesCreatedForDataQuery, DependencyValueUpdateRequest},
    state::types::math_expr::MathExpr,
};

use super::{InvertError, Prop, PropStatus, PropView, PropViewMut, TryFromProp};

///////////////////////////////////////////////////////////////////////
// prop enum views that allow one to refer to props
// without specifying type.
// Particularly useful for having vectors of mixed type
///////////////////////////////////////////////////////////////////////

#[derive(PropMethods)]
pub enum PropEnumRef<'a> {
    Number(&'a Prop<f64>),
    Integer(&'a Prop<i64>),
    String(&'a Prop<String>),
    Boolean(&'a Prop<bool>),
    Math(&'a Prop<MathExpr>),
}

#[derive(PropMethods, PropMethodsMut)]
pub enum PropEnumRefMut<'a> {
    Number(&'a mut Prop<f64>),
    Integer(&'a mut Prop<i64>),
    String(&'a mut Prop<String>),
    Boolean(&'a mut Prop<bool>),
    Math(&'a mut Prop<MathExpr>),
}

/// An mutable enum view of the value of the prop.
/// It includes methods that allow one to view and change the variable.
#[derive(PropViewMutMethods, derive_more::From)]
pub enum PropViewMutEnum {
    Number(PropViewMut<f64>),
    Integer(PropViewMut<i64>),
    String(PropViewMut<String>),
    Boolean(PropViewMut<bool>),
    Math(PropViewMut<MathExpr>),
}

/// An read-only enum view of the value of the prop.
/// It includes methods that allow one to view the variable.
#[derive(Clone, PropViewMethods, derive_more::From)]
pub enum PropViewEnum {
    Number(PropView<f64>),
    Integer(PropView<i64>),
    String(PropView<String>),
    Boolean(PropView<bool>),
    Math(PropView<MathExpr>),
}

/// This can contain the value of a prop of any type,
/// which is useful for function parameters.
#[derive(
    Debug,
    Clone,
    PartialEq,
    serde::Serialize,
    serde::Deserialize,
    derive_more::TryInto,
    derive_more::From,
    FromPropIntoPropEnumRefs,
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

impl<'a> PropEnumRef<'a> {
    /// If creating a component from a reference to this prop
    /// then create a component of the given type with the given prop
    /// shadowing the original prop.
    ///
    /// TODO: presumably, there should be a way to override this default.
    ///
    /// Returns: a tuple of (component type, prop name)
    pub fn preferred_component_type(&self) -> &'static str {
        match self {
            PropEnumRef::Number(_) => unimplemented!("Have not yet created number component"),
            PropEnumRef::Integer(_) => unimplemented!("Have not yet created number component"),
            PropEnumRef::String(_) => Text::get_component_type(),
            PropEnumRef::Boolean(_) => Boolean::get_component_type(),
            PropEnumRef::Math(_) => Math::get_component_type(),
        }
    }
}

impl fmt::Debug for PropViewMutEnum {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_status() {
            PropStatus::Fresh => self.get().fmt(f),
            PropStatus::Stale => f.write_str("Stale"),
            PropStatus::Unresolved => f.write_str("Unresolved"),
            PropStatus::Resolved => f.write_str("Resolved"),
        }
    }
}

impl fmt::Debug for PropViewEnum {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_status() {
            PropStatus::Fresh => self.get().fmt(f),
            PropStatus::Stale => f.write_str("Stale"),
            PropStatus::Unresolved => f.write_str("Unresolved"),
            PropStatus::Resolved => f.write_str("Resolved"),
        }
    }
}

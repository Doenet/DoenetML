use std::fmt;

#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use doenetml_derive::{
    FromStateVarIntoStateVarEnumRefs, StateVarMethods, StateVarMethodsMut,
    StateVarMutableViewMethods, StateVarViewMethods,
};

use crate::{
    components::doenet::{boolean::Boolean, text::Text},
    components::ComponentProfile,
    dependency::{DataQuery, DependenciesCreatedForDataQuery, DependencyValueUpdateRequest},
};

use super::{
    Freshness, InvertError, StateVar, StateVarIdx, StateVarMutableView, StateVarView, TryFromState,
};

///////////////////////////////////////////////////////////////////////
// State variable enum views that allow one to refer to state variables
// without specifying type.
// Particularly useful for having vectors of mixed type
///////////////////////////////////////////////////////////////////////

#[derive(StateVarMethods)]
pub enum StateVarEnumRef<'a> {
    Number(&'a StateVar<f64>),
    Integer(&'a StateVar<i64>),
    String(&'a StateVar<String>),
    Boolean(&'a StateVar<bool>),
}

#[derive(StateVarMethods, StateVarMethodsMut)]
pub enum StateVarEnumRefMut<'a> {
    Number(&'a mut StateVar<f64>),
    Integer(&'a mut StateVar<i64>),
    String(&'a mut StateVar<String>),
    Boolean(&'a mut StateVar<bool>),
}

/// An mutable enum view of the value of the state variable.
/// It includes methods that allow one to view and change the variable.
#[derive(StateVarMutableViewMethods, derive_more::From)]
pub enum StateVarMutableViewEnum {
    Number(StateVarMutableView<f64>),
    Integer(StateVarMutableView<i64>),
    String(StateVarMutableView<String>),
    Boolean(StateVarMutableView<bool>),
}

/// An read-only enum view of the value of the state variable.
/// It includes methods that allow one to view the variable.
#[derive(Clone, StateVarViewMethods, derive_more::From)]
pub enum StateVarViewEnum {
    Number(StateVarView<f64>),
    Integer(StateVarView<i64>),
    String(StateVarView<String>),
    Boolean(StateVarView<bool>),
}

/// This can contain the value of a state variable of any type,
/// which is useful for function parameters.
#[derive(
    Debug,
    Clone,
    PartialEq,
    serde::Serialize,
    serde::Deserialize,
    derive_more::TryInto,
    derive_more::From,
    FromStateVarIntoStateVarEnumRefs,
)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub enum StateVarValue {
    String(String),
    Number(f64),
    Integer(i64),
    Boolean(bool),
}

impl<'a> StateVarEnumRef<'a> {
    /// If creating a component from a reference to this state variable
    /// then create a component of the given type with the given state variable
    /// shadowing the original state variable.
    ///
    /// TODO: presumably, there should be a way to override this default.
    ///
    /// Returns: a tuple of (component type, state variable name)
    pub fn get_default_shadowing_component(&self) -> (&'static str, StateVarIdx) {
        match self {
            StateVarEnumRef::Number(_) => unimplemented!("Have not yet created number component"),
            StateVarEnumRef::Integer(_) => unimplemented!("Have not yet created number component"),
            StateVarEnumRef::String(_) => Text::get_state_variable_that_shadows_when_extending(),
            StateVarEnumRef::Boolean(_) => {
                Boolean::get_state_variable_that_shadows_when_extending()
            }
        }
    }
}

impl fmt::Debug for StateVarMutableViewEnum {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_freshness() {
            Freshness::Fresh => self.get().fmt(f),
            Freshness::Stale => f.write_str("Stale"),
            Freshness::Unresolved => f.write_str("Unresolved"),
            Freshness::Resolved => f.write_str("Resolved"),
        }
    }
}

impl fmt::Debug for StateVarViewEnum {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.get_freshness() {
            Freshness::Fresh => self.get().fmt(f),
            Freshness::Stale => f.write_str("Stale"),
            Freshness::Unresolved => f.write_str("Unresolved"),
            Freshness::Resolved => f.write_str("Resolved"),
        }
    }
}

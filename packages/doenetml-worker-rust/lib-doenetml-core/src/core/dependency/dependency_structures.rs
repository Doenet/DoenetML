use std::ops::Deref;

use crate::{
    attribute::AttributeName,
    components::{
        prelude::{StateVarIdx, TryFromState, TryToState},
        ComponentProfile,
    },
    state::{essential_state::EssentialDataOrigin, StateVarPointer},
    state::{StateVarName, StateVarViewEnum},
    ComponentIdx,
};

/// A DataQuery is used to make a Dependency based on the input document structure
#[derive(Debug, Clone, Default, PartialEq)]
pub enum DataQuery {
    /// Query for all children that match the prescribed `ComponentProfile`s.
    ///
    /// TODO: add parameter whether or not to return something even if no match.
    ///
    /// What type should it return? Right now based on source type, which could be an error.
    /// What to use for the default value?
    /// This also applies to attribute children.
    Child {
        /// The data query will match child components that have at least one of these profiles
        /// unless the child component has one of the profiles in `exclude_if_prefer_profiles`
        /// ranked higher
        match_profiles: Vec<ComponentProfile>,

        // TODO: can we remove exclude_if_prefer_profiles?
        /// If a child component has one of these profiles ranked higher
        /// than any in *match_profiles*, then the child is not matched.
        exclude_if_prefer_profiles: Vec<ComponentProfile>,

        /// If true, then the data query will return a single variable if no matching children found.
        ///
        /// If the type of the requesting state variable matches a `ComponentProfile` from `match_profiles`,
        /// then this single variable returned will match the type of the requesting state variable
        /// and will be initialized with the state variable's default value.
        ///
        /// If the type of the requesting state variable does not match
        /// a `ComponentProfile` from `match_profiles`,
        /// then this single variable returned will be of the type of the first entry in `match_profiles`
        /// and will be initialized to the default value of that type.
        always_return_value: bool,
    },
    StateVar {
        /// If None, state variable is from the component making the query.
        component_idx: Option<ComponentIdx>,

        /// The state variable from component_idx or component making the query.
        state_var_idx: StateVarIdx,
    },
    Parent {
        state_var_name: StateVarName,
    },
    AttributeChild {
        /// The name of the attribute whose children will be matched.
        attribute_name: AttributeName,

        /// The data query will match child components that have at least one of these profiles.
        // TODO: do we need to add exclude_if_prefer_profiles?
        match_profiles: Vec<ComponentProfile>,

        /// If true, then the data query will return a single variable if no matching children found.
        ///
        /// If the type of the requesting state variable matches a `ComponentProfile` from `match_profiles`,
        /// then this single variable returned will match the type of the requesting state variable
        /// and will be initialized with the state variable's default value.
        ///
        /// If the type of the requesting state variable does not match
        /// a `ComponentProfile` from `match_profiles`,
        /// then this single variable returned will be of the type of the first entry in `match_profiles`
        /// and will be initialized to the default value of that type.
        always_return_value: bool,
    },
    #[default]
    /// Will be initialized with the default value of this state variable
    /// and will accept any change when inverting.
    PreliminaryValue,
}

// TODO: determine what the structure of DependencySource should be
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DependencySource {
    StateVar {
        // component_type: ComponentType,
        component_idx: ComponentIdx,
        state_var_idx: StateVarIdx,
    },
    Essential {
        component_idx: ComponentIdx,
        origin: EssentialDataOrigin,
        // value_type: &'static str,
    },
}

impl TryFrom<&DependencySource> for StateVarPointer {
    type Error = &'static str;

    fn try_from(ds: &DependencySource) -> Result<Self, Self::Error> {
        match ds {
            DependencySource::StateVar {
                component_idx,
                state_var_idx,
            } => Ok(StateVarPointer {
                component_idx: *component_idx,
                state_var_idx: *state_var_idx,
            }),
            DependencySource::Essential { .. } => {
                Err("Cannot convert essential dependency source to a state variable pointer.")
            }
        }
    }
}

/// Gives both the source of the dependency and the current value of the dependency
#[derive(Debug, Clone)]
pub struct Dependency {
    pub source: DependencySource,
    pub value: StateVarViewEnum,
}

/// The vector of dependencies that were created for a `DataQuery`
#[derive(Debug, Clone)]
pub struct DependenciesCreatedForDataQuery(pub Vec<Dependency>);

impl Deref for DependenciesCreatedForDataQuery {
    type Target = Vec<Dependency>;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// Information on which update were requested so that we can recurse
/// and call *invert*
/// on the state variables of those dependencies.
///
/// The actual requested values for those dependencies were stored
/// in the *requested_value* field of their state variables.
#[derive(Debug, PartialEq)]
pub struct DependencyValueUpdateRequest {
    pub data_query_idx: usize,
    pub dependency_idx: usize,
}

impl<T> TryFromState<DependenciesCreatedForDataQuery> for T
where
    T: TryFromState<StateVarViewEnum>,
{
    type Error = T::Error;

    fn try_from_state(value: &DependenciesCreatedForDataQuery) -> Result<Self, Self::Error> {
        if value.len() != 1 {
            panic!("Must have a single dependency. Got `{:?}`", &value);
            // return Err("Must have a single dependency");
        }
        value[0].value.try_to_state()
    }
}

impl<T> TryFromState<DependenciesCreatedForDataQuery> for Option<T>
where
    T: TryFromState<StateVarViewEnum>,
{
    type Error = T::Error;

    fn try_from_state(value: &DependenciesCreatedForDataQuery) -> Result<Self, Self::Error> {
        if value.is_empty() {
            Ok(None)
        } else if value.len() > 1 {
            panic!("Must have a single dependency. Got `{:?}`", &value);
            // return Err("Must have a single dependency");
        } else {
            Ok(Some(value[0].value.try_to_state()?))
        }
    }
}

impl<T> TryFromState<DependenciesCreatedForDataQuery> for Vec<T>
where
    T: TryFromState<StateVarViewEnum>,
{
    type Error = T::Error;

    fn try_from_state(value: &DependenciesCreatedForDataQuery) -> Result<Self, Self::Error> {
        value.iter().map(|dep| dep.value.try_to_state()).collect()
    }
}

use std::ops::Deref;

use crate::{
    attribute::AttributeName,
    components::{
        prelude::{PropIdx, TryFromState, TryToState},
        ComponentProfile,
    },
    state::{prop_state::StatePropDataOrigin, PropPointer},
    state::{PropName, PropViewEnum},
    ComponentIdx,
};

/// A DataQuery is used to make a Dependency based on the input document structure
#[derive(Debug, Clone, Default, PartialEq)]
pub enum DataQuery {
    /// Query for all children that match the prescribed `ComponentProfile`s.
    ChildPropProfile {
        /// The data query will match child components that have at least one of these profiles
        match_profiles: Vec<ComponentProfile>,
    },
    /// Query for a particular prop of a component
    Prop {
        /// If None, prop is from the component making the query.
        component_idx: Option<ComponentIdx>,

        /// The prop from component_idx or component making the query.
        prop_idx: PropIdx,
    },
    /// Query for a prop from a parent
    ParentProp { prop_name: PropName },
    /// Query for all children of an attribute that match the prescribed `ComponentProfile`
    Attribute {
        /// The name of the attribute whose children will be matched.
        attribute_name: AttributeName,

        /// The data query will match child components that have at least one of these profiles.
        match_profiles: Vec<ComponentProfile>,
    },
    #[default]
    /// Will be initialized with the default value of this prop
    /// and will accept any change when inverting.
    State,
}

// TODO: determine what the structure of DependencySource should be
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DependencySource {
    Prop {
        // component_type: ComponentType,
        component_idx: ComponentIdx,
        prop_idx: PropIdx,
    },
    State {
        component_idx: ComponentIdx,
        origin: StatePropDataOrigin,
        // value_type: &'static str,
    },
}

impl From<PropPointer> for DependencySource {
    fn from(prop_pointer: PropPointer) -> Self {
        DependencySource::Prop {
            component_idx: prop_pointer.component_idx,
            prop_idx: prop_pointer.local_prop_idx,
        }
    }
}

impl TryFrom<&DependencySource> for PropPointer {
    type Error = &'static str;

    fn try_from(ds: &DependencySource) -> Result<Self, Self::Error> {
        match ds {
            DependencySource::Prop {
                component_idx,
                prop_idx,
            } => Ok(PropPointer {
                component_idx: *component_idx,
                local_prop_idx: *prop_idx,
            }),
            DependencySource::State { .. } => {
                Err("Cannot convert state dependency source to a prop pointer.")
            }
        }
    }
}

/// Gives both the source of the dependency and the current value of the dependency
#[derive(Debug, Clone)]
pub struct Dependency {
    pub source: DependencySource,
    pub value: PropViewEnum,
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
/// on the props of those dependencies.
///
/// The actual requested values for those dependencies were stored
/// in the *requested_value* field of their props.
#[derive(Debug, PartialEq)]
pub struct DependencyValueUpdateRequest {
    pub data_query_idx: usize,
    pub dependency_idx: usize,
}

impl<T> TryFromState<DependenciesCreatedForDataQuery> for T
where
    T: TryFromState<PropViewEnum>,
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
    T: TryFromState<PropViewEnum>,
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
    T: TryFromState<PropViewEnum>,
{
    type Error = T::Error;

    fn try_from_state(value: &DependenciesCreatedForDataQuery) -> Result<Self, Self::Error> {
        value.iter().map(|dep| dep.value.try_to_state()).collect()
    }
}

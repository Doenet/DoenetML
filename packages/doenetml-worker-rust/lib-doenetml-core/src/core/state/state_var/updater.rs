use enum_dispatch::enum_dispatch;

use state::StateVar;
use thiserror::Error;

use crate::{
    dependency::{DataQuery, DependenciesCreatedForDataQuery, DependencyValueUpdateRequest},
    state,
};

use super::StateVarView;

/// The possible results of a call to `calculate`:
/// - Calculated(T): the value was calculated to be T
/// - FromDefault(T): the value T was determined from the default value
/// - From(&StateVarView<T>): set both `value` and `came_from_default` from `StateVarView<T>`
#[derive(Debug)]
pub enum StateVarCalcResult<'a, T: Default + Clone> {
    Calculated(T),
    FromDefault(T),
    From(&'a StateVarView<T>),
}

#[derive(Debug, Error)]
pub enum InvertError {
    #[error("invert is not implemented")]
    NotImplemented,
    #[error("could not invert")]
    CouldNotUpdate,
}

/// Methods used when updating a state variable's dependencies, including querying for its
/// dependencies and calculating the value from its dependencies.
pub trait StateVarUpdater<T: Default + Clone, RequiredData>: std::fmt::Debug {
    /// The default value that core will use to assign the value of this state variable.
    ///
    /// Used only when the state variable doesn't depend on other values
    fn default_value(&self) -> T {
        T::default()
    }

    /// Returns the data queries needed to calculate the dependencies
    /// for this state variable. These queries may be based on structure of the document,
    /// e.g., the children, attributes, or other state variables
    /// of the component of this state variable.
    fn return_data_queries(&self) -> Vec<Option<DataQuery>>;

    /// Calculate the value of the state variable from the passed in `data`.
    /// Results of this function will be cached, so local caching is not needed.
    fn calculate<'a>(&self, data: &'a RequiredData) -> StateVarCalcResult<'a, T>;

    /// All state variables know how to calculate their value given their dependencies.
    /// Sometimes a state variable is requested to take on a particular value. If the
    /// state variable has dependencies, these dependencies must change in order for the
    /// state variable to take on the target value.
    ///
    /// This function returns a list of update requests for the state variable's dependencies
    /// that, if set on the dependencies, will cause the state variable to take on the
    /// desired value.
    ///
    /// An `Err` is returned if an effective combination of updates cannot be found.
    ///
    /// The `is_direct_change_from_action` argument is true if the requested value
    /// came directly from an action of the renderer
    /// (as opposed to coming from another state variable that depends on this variable).
    #[allow(unused)]
    fn invert(
        &self,
        data: &mut RequiredData,
        state_var: &StateVarView<T>,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        Err(InvertError::NotImplemented)
    }
}

/// Methods used when updating a state variable's dependencies, including querying for its
/// dependencies and calculating the value from its dependencies.
pub trait StateVarUpdaterWithCache<T: Default + Clone>: std::fmt::Debug {
    /// Returns the data queries needed to calculate the dependencies
    /// for this state variable. These queries may be based on structure of the document,
    /// e.g., the children, attributes, or other state variables
    /// of the component of this state variable.
    fn return_data_queries(&mut self) -> Vec<DataQuery>;

    /// Called when data queries for the state variable have been completed.
    /// State variables cache the results of their queries
    /// for efficient future computations.
    #[allow(clippy::ptr_arg)]
    fn save_data(&mut self, dependencies: &Vec<DependenciesCreatedForDataQuery>);

    /// Calculate the value of the state variable from the currently cached query results.
    /// Results of this function will be cached, so local caching is not needed.
    fn calculate(&self) -> StateVarCalcResult<T>;

    /// All state variables know how to calculate their value given their dependencies.
    /// Sometimes a state variable is requested to take on a particular value. If the
    /// state variable has dependencies, these dependencies must change in order for the
    /// state variable to take on the target value.
    ///
    /// This function returns a list of update requests for the state variable's dependencies
    /// that, if set on the dependencies, will cause the state variable to take on the
    /// desired value.
    ///
    /// An `Err` is returned if an effective combination of updates cannot be found.
    ///
    /// The `is_direct_change_from_action` argument is true if the requested value
    /// came directly from an action of the renderer
    /// (as opposed to coming from another state variable that depends on this variable).
    #[allow(unused)]
    fn invert(
        &mut self,
        state_var: &StateVarView<T>,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        Err(InvertError::NotImplemented)
    }
}

/// The structure we will use to create `StateVarUpdaterWithCache<T>` trait objects
/// for the `updater` field of a `StateVar<T>`.
///
/// To create a `StateVarUpdaterWithCacheStruct` one needs:
/// - `SvUpdater`: an object that implements `StateVarUpdater<T, RequiredData>`
/// - `RequiredData`: a structure that stores all the required data to calculate the state variable.
///   It must implement `FromDependencies` so that it can be from the dependencies
///   returned from a data query.
#[derive(Debug)]
pub struct StateVarUpdaterWithCacheStruct<SvUpdater, RequiredData: Default> {
    state_var_updater: SvUpdater,
    cache: RequiredData,
    queries_used: Vec<usize>,
}

/// An implementation of `StateVarUpdaterWithCache<T>`
/// requires that we specify:
/// - `T`: the type of `StateVar<T>`
/// - `SvUpdater`: an object that implements `StateVarUpdater<T, RequiredData>`
/// - `RequiredData`: a structure that stores all the required data to calculate the state variable.
///   It must implement `FromDependencies` so that it can be from the dependencies
///   returned from a data query.
impl<T, SvUpdater, RequiredData> StateVarUpdaterWithCache<T>
    for StateVarUpdaterWithCacheStruct<SvUpdater, RequiredData>
where
    SvUpdater: StateVarUpdater<T, RequiredData>,
    T: Default + Clone,
    RequiredData: std::fmt::Debug + Default + FromDependencies,
{
    fn return_data_queries(&mut self) -> Vec<DataQuery> {
        self.queries_used = Vec::new();

        self.state_var_updater
            .return_data_queries()
            .into_iter()
            .enumerate()
            .filter_map(|(dep_idx, data_query_option)| {
                if data_query_option.is_some() {
                    self.queries_used.push(dep_idx);
                }
                data_query_option
            })
            .collect()
    }

    fn save_data(&mut self, dependencies: &Vec<DependenciesCreatedForDataQuery>) {
        self.cache = dependencies.to_data(&self.queries_used);
    }

    fn calculate(&self) -> StateVarCalcResult<T> {
        self.state_var_updater.calculate(&self.cache)
    }

    fn invert(
        &mut self,
        state_var: &StateVarView<T>,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        self.state_var_updater
            .invert(&mut self.cache, state_var, is_direct_change_from_action)
    }
}

pub trait IntoStateVar<T: Default + Clone, RequiredData: Default> {
    fn into_state_var(self) -> StateVar<T>;
}

impl<T, RequiredData, SvUpdater> IntoStateVar<T, RequiredData> for SvUpdater
where
    T: Default + Clone,
    RequiredData: 'static + std::fmt::Debug + Default + FromDependencies,
    SvUpdater: 'static + StateVarUpdater<T, RequiredData>,
{
    /// Convert an object that implements `StateVarUpdater<T, RequiredData>` into a `StateVar<T>`
    fn into_state_var(self) -> StateVar<T> {
        let default_value = self.default_value();

        let updater_with_cache = StateVarUpdaterWithCacheStruct {
            state_var_updater: self,
            cache: Default::default(),
            queries_used: Default::default(),
        };
        StateVar::new(Box::new(updater_with_cache), default_value)
    }
}

pub trait DependenciesToData<RequiredData> {
    fn to_data(&self, queries_used: &[usize]) -> RequiredData;
}

pub trait FromDependencies {
    fn from_dependencies(
        dependencies: &[DependenciesCreatedForDataQuery],
        queries_used: &[usize],
    ) -> Self;
}

impl<RequiredData> DependenciesToData<RequiredData> for Vec<DependenciesCreatedForDataQuery>
where
    RequiredData: FromDependencies,
{
    /// Convert a vector of `DependenciesCreatedForDataQuery` into an object of type `RequiredData`,
    /// where `RequiredData` is a type that has implemented `FromDependencies`
    fn to_data(&self, queries_used: &[usize]) -> RequiredData {
        RequiredData::from_dependencies(self, queries_used)
    }
}

#[enum_dispatch]
pub trait QueryUpdateRequests {
    /// Clear variable that tracks whether or not an update has been requested
    fn clear_queued_updates(&mut self);

    fn indices_with_queued_updates(&self) -> Vec<usize>;
}

impl<T> QueryUpdateRequests for Option<T>
where
    T: QueryUpdateRequests,
{
    fn clear_queued_updates(&mut self) {
        self.as_mut().map(|val| {
            val.clear_queued_updates();
            val
        });
    }

    fn indices_with_queued_updates(&self) -> Vec<usize> {
        self.as_ref()
            .map(|val| val.indices_with_queued_updates())
            .unwrap_or_default()
    }
}

impl<T> QueryUpdateRequests for Vec<T>
where
    T: QueryUpdateRequests,
{
    fn clear_queued_updates(&mut self) {
        for val in self.iter_mut() {
            val.clear_queued_updates();
        }
    }

    fn indices_with_queued_updates(&self) -> Vec<usize> {
        // Note: this algorithm does not correctly handle Vec<Vec<T: QueryUpdateRequests>>
        self.iter()
            .enumerate()
            .filter_map(|(idx, val)| {
                if val.indices_with_queued_updates().is_empty() {
                    None
                } else {
                    Some(idx)
                }
            })
            .collect()
    }
}

use enum_dispatch::enum_dispatch;

use state::StateVar;
use thiserror::Error;

use crate::{
    dependency::{DataQuery, DependenciesCreatedForDataQuery, DependencyValueUpdateRequest},
    state, ExtendSource,
};

use super::{StateVarIdx, StateVarView};

/// The possible results of a call to `calculate`:
/// - Calculated(T): the value was calculated to be T
/// - FromDefault(T): the value T was determined from the default value
#[derive(Debug, PartialEq)]
pub enum StateVarCalcResult<T> {
    Calculated(T),
    FromDefault(T),
}

#[derive(Debug, Error)]
pub enum RequestDependencyUpdateError {
    #[error("invert is not implemented")]
    NotImplemented,
    #[error("could not update")]
    CouldNotUpdate,
}

/// Methods used when updating a state variable's dependencies, including querying for its
/// dependencies and calculating the value from its dependencies.
pub trait StateVarUpdater<T: Default + Clone, D>: std::fmt::Debug {
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
    fn return_data_queries(
        &self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<Option<DataQuery>>;

    /// Calculate the value of the state variable from the passed in `data`.
    /// Results of this function will be cached, so local caching is not needed.
    fn calculate(data: &D) -> StateVarCalcResult<T>;

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
    /// The `is_direct_change_from_renderer` argument is true if the requested value
    /// came directly from an action of the renderer
    /// (as opposed to coming from another state variable that depends on this variable).
    #[allow(unused)]
    fn invert(
        data: &mut D,
        state_var: &StateVarView<T>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        Err(RequestDependencyUpdateError::NotImplemented)
    }
}

/// Methods used when updating a state variable's dependencies, including querying for its
/// dependencies and calculating the value from its dependencies.
pub trait StateVarUpdaterWithCache<T: Default + Clone>: std::fmt::Debug {
    /// Returns the data queries needed to calculate the dependencies
    /// for this state variable. These queries may be based on structure of the document,
    /// e.g., the children, attributes, or other state variables
    /// of the component of this state variable.
    fn return_data_queries(
        &mut self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<DataQuery>;

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
    /// The `is_direct_change_from_renderer` argument is true if the requested value
    /// came directly from an action of the renderer
    /// (as opposed to coming from another state variable that depends on this variable).
    #[allow(unused)]
    fn invert(
        &mut self,
        state_var: &StateVarView<T>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        Err(RequestDependencyUpdateError::NotImplemented)
    }
}

#[derive(Debug)]
pub struct StateVarUpdaterWithCacheStruct<S, D: Default> {
    state_var_updater: S,
    cache: D,
    queries_used: Vec<usize>,
}

impl<S, T, D> StateVarUpdaterWithCache<T> for StateVarUpdaterWithCacheStruct<S, D>
where
    S: StateVarUpdater<T, D>,
    T: Default + Clone,
    D: std::fmt::Debug + Default + FromDependencies,
{
    fn return_data_queries(
        &mut self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<DataQuery> {
        self.queries_used = Vec::new();

        self.state_var_updater
            .return_data_queries(extending, state_var_idx)
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
        S::calculate(&self.cache)
    }

    fn invert(
        &mut self,
        state_var: &StateVarView<T>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        S::invert(&mut self.cache, state_var, is_direct_change_from_renderer)
    }
}

pub trait IntoStateVar<T: Default + Clone, D: Default> {
    fn into_state_var(self) -> StateVar<T>;
}

impl<T, D, S> IntoStateVar<T, D> for S
where
    T: Default + Clone,
    D: 'static + std::fmt::Debug + Default + FromDependencies,
    S: 'static + StateVarUpdater<T, D>,
{
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

pub trait DependenciesToData<D> {
    fn to_data(&self, queries_used: &[usize]) -> D;
}

pub trait FromDependencies {
    fn from_dependencies(
        dependencies: &[DependenciesCreatedForDataQuery],
        queries_used: &[usize],
    ) -> Self;
}

impl<D> DependenciesToData<D> for Vec<DependenciesCreatedForDataQuery>
where
    D: FromDependencies,
{
    fn to_data(&self, queries_used: &[usize]) -> D {
        D::from_dependencies(self, queries_used)
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

use enum_dispatch::enum_dispatch;

use state::Prop;
use thiserror::Error;

use crate::{
    dependency::{DataQuery, DependenciesCreatedForDataQuery, DependencyValueUpdateRequest},
    state,
};

use super::PropView;

/// The possible results of a call to `calculate`:
/// - Calculated(T): the value was calculated to be T
/// - FromDefault(T): the value T was determined from the default value
/// - From(&PropView<T>): set both `value` and `came_from_default` from `PropView<T>`
#[derive(Debug)]
pub enum PropCalcResult<'a, T: Default + Clone> {
    Calculated(T),
    FromDefault(T),
    From(&'a PropView<T>),
}

#[derive(Debug, Error)]
pub enum InvertError {
    #[error("invert is not implemented")]
    NotImplemented,
    #[error("could not invert")]
    CouldNotUpdate,
}

/// Methods used when updating a prop's dependencies, including querying for its
/// dependencies and calculating the value from its dependencies.
pub trait PropUpdater<T: Default + Clone, RequiredData>: std::fmt::Debug {
    /// The default value that core will use to assign the value of this prop.
    ///
    /// Used only when the prop doesn't depend on other values
    fn default_value(&self) -> T {
        T::default()
    }

    /// Returns the data queries needed to calculate the dependencies
    /// for this prop. These queries may be based on structure of the document,
    /// e.g., the children, attributes, or other props
    /// of the component of this prop.
    fn return_data_queries(&self) -> Vec<Option<DataQuery>>;

    /// Calculate the value of the prop from the passed in `data`.
    /// Results of this function will be cached, so local caching is not needed.
    fn calculate<'a>(&self, data: &'a RequiredData) -> PropCalcResult<'a, T>;

    /// All props know how to calculate their value given their dependencies.
    /// Sometimes a prop is requested to take on a particular value. If the
    /// prop has dependencies, these dependencies must change in order for the
    /// prop to take on the target value.
    ///
    /// This function returns a list of update requests for the prop's dependencies
    /// that, if set on the dependencies, will cause the prop to take on the
    /// desired value.
    ///
    /// An `Err` is returned if an effective combination of updates cannot be found.
    ///
    /// The `is_direct_change_from_action` argument is true if the requested value
    /// came directly from an action of the renderer
    /// (as opposed to coming from another prop that depends on this variable).
    #[allow(unused)]
    fn invert(
        &self,
        data: &mut RequiredData,
        prop: &PropView<T>,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        Err(InvertError::NotImplemented)
    }
}

/// Methods used when updating a prop's dependencies, including querying for its
/// dependencies and calculating the value from its dependencies.
pub trait PropUpdaterWithCache<T: Default + Clone>: std::fmt::Debug {
    /// Returns the data queries needed to calculate the dependencies
    /// for this prop. These queries may be based on structure of the document,
    /// e.g., the children, attributes, or other props
    /// of the component of this prop.
    fn return_data_queries(&mut self) -> Vec<DataQuery>;

    /// Called when data queries for the prop have been completed.
    /// props cache the results of their queries
    /// for efficient future computations.
    #[allow(clippy::ptr_arg)]
    fn save_data(&mut self, dependencies: &Vec<DependenciesCreatedForDataQuery>);

    /// Calculate the value of the prop from the currently cached query results.
    /// Results of this function will be cached, so local caching is not needed.
    fn calculate(&self) -> PropCalcResult<T>;

    /// All props know how to calculate their value given their dependencies.
    /// Sometimes a prop is requested to take on a particular value. If the
    /// prop has dependencies, these dependencies must change in order for the
    /// prop to take on the target value.
    ///
    /// This function returns a list of update requests for the prop's dependencies
    /// that, if set on the dependencies, will cause the prop to take on the
    /// desired value.
    ///
    /// An `Err` is returned if an effective combination of updates cannot be found.
    ///
    /// The `is_direct_change_from_action` argument is true if the requested value
    /// came directly from an action of the renderer
    /// (as opposed to coming from another prop that depends on this variable).
    #[allow(unused)]
    fn invert(
        &mut self,
        prop: &PropView<T>,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        Err(InvertError::NotImplemented)
    }
}

/// The structure we will use to create `PropUpdaterWithCache<T>` trait objects
/// for the `updater` field of a `Prop<T>`.
///
/// To create a `PropUpdaterWithCacheStruct` one needs:
/// - `Updater`: an object that implements `PropUpdater<T, RequiredData>`
/// - `RequiredData`: a structure that stores all the required data to calculate the prop.
///   It must implement `FromDependencies` so that it can be from the dependencies
///   returned from a data query.
#[derive(Debug)]
pub struct PropUpdaterWithCacheStruct<PropUpdater, RequiredData: Default> {
    prop_updater: PropUpdater,
    cache: RequiredData,
    queries_used: Vec<usize>,
}

/// An implementation of `PropUpdaterWithCache<T>`
/// requires that we specify:
/// - `T`: the type of `Prop<T>`
/// - `Updater`: an object that implements `PropUpdater<T, RequiredData>`
/// - `RequiredData`: a structure that stores all the required data to calculate the prop.
///   It must implement `FromDependencies` so that it can be from the dependencies
///   returned from a data query.
impl<T, Updater, RequiredData> PropUpdaterWithCache<T>
    for PropUpdaterWithCacheStruct<Updater, RequiredData>
where
    Updater: PropUpdater<T, RequiredData>,
    T: Default + Clone,
    RequiredData: std::fmt::Debug + Default + FromDependencies,
{
    fn return_data_queries(&mut self) -> Vec<DataQuery> {
        self.queries_used = Vec::new();

        self.prop_updater
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

    fn calculate(&self) -> PropCalcResult<T> {
        self.prop_updater.calculate(&self.cache)
    }

    fn invert(
        &mut self,
        prop: &PropView<T>,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        self.prop_updater
            .invert(&mut self.cache, prop, is_direct_change_from_action)
    }
}

pub trait IntoProp<T: Default + Clone, RequiredData: Default> {
    fn into_prop(self) -> Prop<T>;
}

impl<T, RequiredData, Updater> IntoProp<T, RequiredData> for Updater
where
    T: Default + Clone,
    RequiredData: 'static + std::fmt::Debug + Default + FromDependencies,
    Updater: 'static + PropUpdater<T, RequiredData>,
{
    /// Convert an object that implements `PropUpdater<T, RequiredData>` into a `Prop<T>`
    fn into_prop(self) -> Prop<T> {
        let default_value = self.default_value();

        let updater_with_cache = PropUpdaterWithCacheStruct {
            prop_updater: self,
            cache: Default::default(),
            queries_used: Default::default(),
        };
        Prop::new(Box::new(updater_with_cache), default_value)
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

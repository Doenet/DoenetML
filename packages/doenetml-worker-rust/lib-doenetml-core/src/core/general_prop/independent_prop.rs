use std::{fmt::Debug, rc::Rc};

use crate::{components::prelude::*, props::UpdaterObject};

/// A prop that doesn't depend on outside data.
///
/// The prop will be initialized to its `default_value`,
/// and when inverting, will change to match the requested value.
///
/// Constructor:
/// - `new(default_value)`: create an independent prop with the given default value.
#[derive(Debug, Default)]
pub struct IndependentProp<T: Default + Clone> {
    default: T,
}

impl<T: Default + Clone> IndependentProp<T> {
    /// Create an independent prop with the given default value.
    pub fn new(default: T) -> Self {
        IndependentProp { default }
    }
}

impl<T> From<IndependentProp<T>> for UpdaterObject
where
    T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug + 'static,
    PropValue: From<T>,
    <T as TryFrom<PropValue>>::Error: std::fmt::Debug,
{
    fn from(prop: IndependentProp<T>) -> UpdaterObject {
        Rc::new(prop)
    }
}

#[derive(FromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries)]
struct RequiredData<T>
where
    T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug,
    PropValue: From<T>,
{
    independent_state: PropView<T>,
}

impl<T> DataQueries for RequiredData<T>
where
    T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug,
    PropValue: From<T>,
{
    fn independent_state_query() -> DataQuery {
        DataQuery::State
    }
}

impl<T> PropUpdater for IndependentProp<T>
where
    T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug,
    PropValue: From<T>,
{
    type PropType = T;

    fn default(&self) -> Self::PropType {
        self.default.clone()
    }

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::to_data_queries()
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::from_data_query_results(data);
        let independent_state = required_data.independent_state;

        if independent_state.came_from_default {
            PropCalcResult::FromDefault(independent_state.value.clone())
        } else {
            PropCalcResult::Calculated(independent_state.value.clone())
        }
    }

    fn invert(
        &self,
        data: DataQueryResults,
        requested_value: Self::PropType,
        _is_direct_change_from_action: bool,
    ) -> Result<DataQueryResults, InvertError> {
        let mut desired = RequiredData::new_desired(&data);

        desired.independent_state.change_to(requested_value);

        Ok(desired.into_data_query_results())
    }
}

// #[cfg(test)]
// #[path = "independent_prop.test.rs"]
// mod tests;

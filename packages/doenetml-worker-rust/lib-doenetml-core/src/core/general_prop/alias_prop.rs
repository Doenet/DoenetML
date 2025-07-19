use std::{marker::PhantomData, rc::Rc};

use crate::{components::prelude::*, props::UpdaterObject};

/// A prop that aliases another prop from the same component.
///
/// The prop takes on the value of this other prop,
/// and when inverting, requests that the value of this other variable be changed.
///
/// Constructor:
/// - `new(aliased_prop_idx)`: create a prop that aliases
///   the variable with the index `aliased_prop_idx`.
#[derive(Debug)]
pub struct PropAlias<T: Default + Clone> {
    aliased_local_prop_idx: LocalPropIdx,
    phantom: PhantomData<T>,
}

impl<T: Default + Clone> PropAlias<T> {
    /// Create a prop that aliases
    /// the variable with the index `aliased_prop_idx`.
    pub fn new(aliased_local_prop_idx: LocalPropIdx) -> Self {
        PropAlias {
            aliased_local_prop_idx,
            phantom: PhantomData,
        }
    }
}

impl<T> From<PropAlias<T>> for UpdaterObject
where
    T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug + 'static,
    PropValue: From<T>,
    <T as TryFrom<PropValue>>::Error: std::fmt::Debug + std::fmt::Display,
{
    fn from(prop: PropAlias<T>) -> UpdaterObject {
        Rc::new(prop)
    }
}

/// A struct of all data required to compute the value of this prop.
#[derive(TryFromDataQueryResults, IntoDataQueryResults)]
#[data_query(query_trait = DataQueries, pass_data = LocalPropIdx)]
pub struct RequiredData<T>
where
    T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug,
    PropValue: From<T>,
    <T as TryFrom<PropValue>>::Error: std::fmt::Display + std::fmt::Debug,
{
    aliased_value: PropView<T>,
}

impl<T> DataQueries for RequiredData<T>
where
    T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug,
    PropValue: From<T>,
    <T as TryFrom<PropValue>>::Error: std::fmt::Display + std::fmt::Debug,
{
    fn aliased_value_query(aliased_local_prop_idx: LocalPropIdx) -> DataQuery {
        DataQuery::Prop {
            source: PropSource::Me,
            prop_specifier: aliased_local_prop_idx.into(),
        }
    }
}

impl<T> PropUpdater for PropAlias<T>
where
    T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug,
    PropValue: From<T>,
    <T as TryFrom<PropValue>>::Error: std::fmt::Display + std::fmt::Debug,
{
    type PropType = T;
    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(self.aliased_local_prop_idx)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        let aliased_value = required_data.aliased_value;

        // take on the value from `aliased_value`, propagating `came_from_default`.
        if aliased_value.came_from_default {
            PropCalcResult::FromDefault(aliased_value.value.clone())
        } else {
            PropCalcResult::Calculated(aliased_value.value.clone())
        }
    }

    fn invert(
        &self,
        data: DataQueryResults,
        requested_value: Self::PropType,
        _is_direct_change_from_action: bool,
    ) -> Result<DataQueryResults, InvertError> {
        let mut desired = RequiredData::try_new_desired(&data).unwrap();

        desired.aliased_value.change_to(requested_value);

        Ok(desired.into_data_query_results())
    }
}

#[cfg(test)]
#[path = "alias_prop.test.rs"]
mod tests;

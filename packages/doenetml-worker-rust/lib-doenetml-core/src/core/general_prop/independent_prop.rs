use crate::components::prelude::*;

/// A struct of all data required to compute the value of this prop.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData<T>
where
    T: Default + Clone,
{
    /// An independent piece of data (a [`StateProp`](crate::state::prop_state::StateProp) whose value gets saved)
    /// that will be used to store the value of the independent prop.
    independent_state: PropView<T>,
}

/// A prop that doesn't depend on outside data.
///
/// The prop will be initialized to its `default_value`,
/// and when inverting, will change to match the requested value.
///
/// Constructor:
/// - `new(default_value)`: create an independent prop with the given default value.
#[derive(Debug, Default)]
pub struct IndependentProp<T: Default + Clone> {
    default_value: T,
}

impl<T: Default + Clone> IndependentProp<T> {
    /// Create an independent prop with the given default value.
    pub fn new(default_value: T) -> Self {
        IndependentProp { default_value }
    }
}

impl<T> PropUpdater<T, RequiredData<T>> for IndependentProp<T>
where
    T: Default + Clone + std::fmt::Debug,
    PropView<T>: TryFromProp<PropViewEnum>,
    <PropView<T> as TryFromProp<PropViewEnum>>::Error: std::fmt::Debug,
{
    fn default_value(&self) -> T {
        self.default_value.clone()
    }

    fn return_data_queries(&self) -> Vec<DataQuery> {
        RequiredDataQueries {
            independent_state: DataQuery::State,
        }
        .into()
    }

    fn calculate_old(&mut self, data: &RequiredData<T>) -> PropCalcResult<T> {
        // take on the value from `independent_state`, propagating `came_from_default`.
        if data.independent_state.came_from_default() {
            PropCalcResult::FromDefault(data.independent_state.get().clone())
        } else {
            PropCalcResult::Calculated(data.independent_state.get().clone())
        }
    }

    fn invert(
        &self,
        data: &mut RequiredData<T>,
        prop: &PropView<T>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        data.independent_state
            .queue_update(prop.get_requested_value().clone());

        Ok(data.queued_updates())
    }
}

#[cfg(test)]
#[path = "independent_prop.test.rs"]
mod tests;

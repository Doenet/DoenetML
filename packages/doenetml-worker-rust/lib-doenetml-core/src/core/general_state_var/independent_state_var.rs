use crate::components::prelude::*;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct IndependentRequiredData<T>
where
    T: Default + Clone,
{
    preliminary_value: StateVarView<T>,
}

/// A state variable that doesn't depend on outside data.
///
/// The state variable will be initialized to its `default_value`,
/// and when inverting, will change to match the requested value.
#[derive(Debug, Default)]
pub struct IndependentStateVar<T: Default + Clone> {
    default_value: T,
}

impl<T: Default + Clone> IndependentStateVar<T> {
    pub fn new(default_value: T) -> Self {
        IndependentStateVar { default_value }
    }
}

impl<T> StateVarUpdater<T, IndependentRequiredData<T>> for IndependentStateVar<T>
where
    T: Default + Clone + std::fmt::Debug,
    StateVarView<T>: TryFromState<StateVarViewEnum>,
    <StateVarView<T> as TryFromState<StateVarViewEnum>>::Error: std::fmt::Debug,
{
    fn default_value(&self) -> T {
        self.default_value.clone()
    }

    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        IndependentRequiredDataQueries {
            preliminary_value: Some(DataQuery::PreliminaryValue),
        }
        .into()
    }

    fn calculate<'a>(&self, data: &'a IndependentRequiredData<T>) -> StateVarCalcResult<'a, T> {
        // take on the value from `preliminary_value`, propagating `came_from_default`.
        StateVarCalcResult::From(&data.preliminary_value)
    }

    fn invert(
        &self,
        data: &mut IndependentRequiredData<T>,
        state_var: &StateVarView<T>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        data.preliminary_value
            .queue_update(state_var.get_requested_value().clone());

        Ok(data.queued_updates())
    }
}

#[cfg(test)]
#[path = "independent_state_var.test.rs"]
mod tests;

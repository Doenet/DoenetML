use crate::components::prelude::*;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct RequiredData<T>
where
    T: Default + Clone,
{
    aliased_value: StateVarView<T>,
}

/// A state variable that aliases another state variable from the same component.
///
/// The state variable has a single data query, which is for the value of another state variable.
/// It takes on the value of this other state variable,
/// and when inverting, requests that the value of this other variable be changed.
#[derive(Debug, Default)]
pub struct StateVarAlias {
    aliased_state_var_idx: StateVarIdx,
}

impl StateVarAlias {
    pub fn new(aliased_state_var_idx: StateVarIdx) -> Self {
        StateVarAlias {
            aliased_state_var_idx,
        }
    }
}

impl<T> StateVarUpdater<T, RequiredData<T>> for StateVarAlias
where
    T: Default + Clone + std::fmt::Debug,
    StateVarView<T>: TryFromState<StateVarViewEnum>,
    <StateVarView<T> as TryFromState<StateVarViewEnum>>::Error: std::fmt::Debug,
{
    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        RequiredDataQueries {
            aliased_value: Some(DataQuery::StateVar {
                component_idx: None,
                state_var_idx: self.aliased_state_var_idx,
            }),
        }
        .into()
    }

    fn calculate<'a>(&self, data: &'a RequiredData<T>) -> StateVarCalcResult<'a, T> {
        // take on the value from `aliased_value`, propagating `came_from_default`.
        StateVarCalcResult::From(&data.aliased_value)
    }

    fn invert(
        &self,
        data: &mut RequiredData<T>,
        state_var: &StateVarView<T>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        data.aliased_value
            .queue_update(state_var.get_requested_value().clone());

        Ok(data.queued_updates())
    }
}

#[cfg(test)]
#[path = "alias_state_var.test.rs"]
mod tests;

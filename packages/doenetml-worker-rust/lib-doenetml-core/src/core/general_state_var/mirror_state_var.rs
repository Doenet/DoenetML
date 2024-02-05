#[cfg(test)]
#[path = "mirror_state_var.test.rs"]
mod tests;

use crate::components::prelude::*;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct MirrorRequiredData<T>
where
    T: Default + Clone,
{
    mirrored_value: StateVarView<T>,
}

/// A state variable that mirrors another state variable from the same component.
///
/// The state variable has a single data query, which is for the value of another state variable.
/// It takes on the value of this other state variable,
/// and when inverting, requests that the value of this other variable be changed.
#[derive(Debug, Default)]
pub struct MirrorStateVar {
    mirrored_state_var_idx: StateVarIdx,
}

impl MirrorStateVar {
    pub fn new(mirrored_state_var_idx: StateVarIdx) -> Self {
        MirrorStateVar {
            mirrored_state_var_idx,
        }
    }
}

impl<T> StateVarUpdater<T, MirrorRequiredData<T>> for MirrorStateVar
where
    T: Default + Clone + std::fmt::Debug,
    StateVarView<T>: TryFromState<StateVarViewEnum>,
    <StateVarView<T> as TryFromState<StateVarViewEnum>>::Error: std::fmt::Debug,
{
    fn return_data_queries(&self) -> Vec<Option<DataQuery>> {
        MirrorRequiredDataQueries {
            mirrored_value: Some(DataQuery::StateVar {
                component_idx: None,
                state_var_idx: self.mirrored_state_var_idx,
            }),
        }
        .into()
    }

    fn calculate(&self, data: &MirrorRequiredData<T>) -> StateVarCalcResult<T> {
        // take on the value from `mirrored_value`, propagating `came_from_default`.
        if data.mirrored_value.came_from_default() {
            StateVarCalcResult::FromDefault(data.mirrored_value.get().clone())
        } else {
            StateVarCalcResult::Calculated(data.mirrored_value.get().clone())
        }
    }

    fn invert(
        &self,
        data: &mut MirrorRequiredData<T>,
        state_var: &StateVarView<T>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        data.mirrored_value
            .queue_update(state_var.get_requested_value().clone());

        Ok(data.queued_updates())
    }
}

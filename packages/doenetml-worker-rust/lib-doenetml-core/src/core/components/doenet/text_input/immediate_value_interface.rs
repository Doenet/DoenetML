use crate::components::prelude::*;

use super::TextInputState;

/// The dependencies of the immediate_value state variable of the text input component
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDependencyInstructions)]
struct ImmediateValueDependencies {
    essential: StateVarReadOnlyView<String>,
    sync_immediate_value: StateVarReadOnlyView<bool>,
    bind_value_to: StateVarReadOnlyView<String>,
    prefill: StateVarReadOnlyView<String>,
}

/// The interface for the immediate_value state variable of a text input
#[derive(Debug, Default)]
pub struct ImmediateValueStateVarInterface {
    /// The dependency instructions that indicate how the dependencies of this state variable will be created.
    dependency_instructions: ImmediateValueDependencyInstructions,

    /// The values of the dependencies created from the dependency instructions
    dependency_values: ImmediateValueDependencies,
}

impl ImmediateValueStateVarInterface {
    pub fn new() -> Self {
        ImmediateValueStateVarInterface {
            ..Default::default()
        }
    }
}

impl From<ImmediateValueStateVarInterface> for StateVar<String> {
    fn from(interface: ImmediateValueStateVarInterface) -> Self {
        StateVar::new(Box::new(interface), Default::default())
    }
}

impl StateVarInterface<String> for ImmediateValueStateVarInterface {
    fn return_dependency_instructions(
        &mut self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        self.dependency_instructions = ImmediateValueDependencyInstructions {
            essential: Some(DependencyInstruction::Essential),
            sync_immediate_value: Some(
                TextInputState::get_sync_immediate_value_dependency_instructions(),
            ),
            bind_value_to: Some(TextInputState::get_bind_value_to_dependency_instructions()),
            prefill: Some(TextInputState::get_prefill_dependency_instructions()),
        };

        (&self.dependency_instructions).into()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();
    }

    fn calculate_state_var_from_dependencies(&self) -> StateVarCalcResult<String> {
        let immediate_value = if !self.dependency_values.bind_value_to.came_from_default()
            && *self.dependency_values.sync_immediate_value.get()
        {
            self.dependency_values.bind_value_to.get().clone()
        } else if self.dependency_values.essential.came_from_default() {
            self.dependency_values.prefill.get().clone()
        } else {
            self.dependency_values.essential.get().clone()
        };
        StateVarCalcResult::Calculated(immediate_value)
    }

    fn request_dependency_updates(
        &mut self,
        state_var: &StateVarReadOnlyView<String>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let requested_value = state_var.get_requested_value();

        let bind_value_to_came_from_default =
            self.dependency_values.bind_value_to.came_from_default();

        self.dependency_values
            .essential
            .queue_update(requested_value.clone());

        if !is_direct_change_from_renderer && !bind_value_to_came_from_default {
            self.dependency_values
                .bind_value_to
                .queue_update(requested_value.clone());
        }

        Ok(self.dependency_values.return_queued_updates())
    }
}

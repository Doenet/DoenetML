use crate::components::prelude::*;

/// The dependencies of the sync_immediate_value state variable of the text input component
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDependencyInstructions)]
struct SyncImmediateValueDependencies {
    essential: StateVarReadOnlyView<bool>,
}

/// The interface for the sync_immediate_value state variable of a text input
#[derive(Debug, Default)]
pub struct SyncImmediateValueStateVarInterface {
    /// The dependency instructions that indicate how the dependencies of this state variable will be created.
    dependency_instructions: SyncImmediateValueDependencyInstructions,

    /// The values of the dependencies created from the dependency instructions
    dependency_values: SyncImmediateValueDependencies,
}

impl SyncImmediateValueStateVarInterface {
    pub fn new() -> Self {
        SyncImmediateValueStateVarInterface {
            ..Default::default()
        }
    }
}

impl From<SyncImmediateValueStateVarInterface> for StateVar<bool> {
    fn from(interface: SyncImmediateValueStateVarInterface) -> Self {
        StateVar::new(Box::new(interface), true)
    }
}

impl StateVarInterface<bool> for SyncImmediateValueStateVarInterface {
    fn return_dependency_instructions(
        &mut self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        self.dependency_instructions = SyncImmediateValueDependencyInstructions {
            essential: Some(DependencyInstruction::Essential),
        };

        (&self.dependency_instructions).into()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();
    }

    fn calculate_state_var_from_dependencies(&self) -> StateVarCalcResult<bool> {
        StateVarCalcResult::Calculated(*self.dependency_values.essential.get())
    }

    fn request_dependency_updates(
        &mut self,
        state_var: &StateVarReadOnlyView<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let requested_value = state_var.get_requested_value();

        self.dependency_values
            .essential
            .queue_update(*requested_value);

        Ok(self.dependency_values.return_queued_updates())
    }
}

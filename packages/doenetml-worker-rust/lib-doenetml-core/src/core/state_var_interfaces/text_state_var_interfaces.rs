use doenetml_derive::{StateVariableDependencies, StateVariableDependencyInstructions};

use crate::{
    components::prelude::{
        DependenciesCreatedForInstruction, DependencyInstruction, DependencyValueUpdateRequest,
        RequestDependencyUpdateError, StateVarIdx, StateVarInterface, StateVarMutableView,
        StateVarReadOnlyView, TryIntoStateVar,
    },
    dependency::DependencySource,
    ExtendSource,
};

use super::util::create_dependency_instruction_if_match_extend_source;

/// A string state variable interface that concatenates all string dependencies.
///
/// If `should_create_dependency_from_extend_source` is true and has an extend source extending this variable,
/// then prepend the shadowed state variable.
///
/// If the state variable has a single dependency that is an essential state variable,
/// then propagate the `used_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct GeneralStringStateVarInterface {
    is_primary_state_variable: bool,
    base_dependency_instruction: DependencyInstruction,

    dependency_instructions: GeneralStringStateVarDependencyInstructions,
    dependency_values: GeneralStringStateVarDependencies,

    from_single_essential: bool,
}

#[derive(Debug, Default, StateVariableDependencies)]
struct GeneralStringStateVarDependencies {
    #[consume_remaining_instructions]
    strings: Vec<StateVarReadOnlyView<String>>,
}

#[derive(Debug, Default, StateVariableDependencyInstructions)]
struct GeneralStringStateVarDependencyInstructions {
    extending: Option<DependencyInstruction>,
    other: Option<DependencyInstruction>,
}

impl GeneralStringStateVarInterface {
    pub fn new(base_dependency_instruction: DependencyInstruction) -> Self {
        GeneralStringStateVarInterface {
            base_dependency_instruction,
            ..Default::default()
        }
    }

    /// Set parameter `is_primary_state_variable` to true
    pub fn is_primary_state_variable(mut self) -> Self {
        self.is_primary_state_variable = true;
        self
    }
}

impl StateVarInterface<String> for GeneralStringStateVarInterface {
    fn return_dependency_instructions(
        &mut self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        self.dependency_instructions = GeneralStringStateVarDependencyInstructions {
            extending: create_dependency_instruction_if_match_extend_source(
                extending,
                self.is_primary_state_variable,
                state_var_idx,
            ),
            other: Some(self.base_dependency_instruction.clone()),
        };

        self.dependency_instructions.instructions_as_vec()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();

        if self.dependency_values.strings.len() == 1 {
            match dependencies[0][0].source {
                DependencySource::Essential { .. } => {
                    self.from_single_essential = true;
                }
                _ => {}
            }
        }
    }

    fn calculate_state_var_from_dependencies(&self, state_var: &StateVarMutableView<String>) {
        if self.from_single_essential {
            // if we are basing it on a single essential variable,
            // then we propagate used_default as well as the value.
            state_var.set_value_and_set_used_default(
                self.dependency_values.strings[0].get().clone(),
                self.dependency_values.strings[0].get_used_default(),
            );
        } else {
            // TODO: can we implement this without cloning the inner value?
            let value: String = self
                .dependency_values
                .strings
                .iter()
                .map(|v| v.get().clone())
                .collect();

            state_var.set_value(value);
        }
    }

    fn request_updated_dependency_values(
        &self,
        state_var: &StateVarReadOnlyView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        if self.dependency_values.strings.len() != 1 {
            // TODO: implement for no dependencies where saves to essential value?
            Err(RequestDependencyUpdateError::CouldNotUpdate)
        } else {
            let requested_value = state_var.get_requested_value();

            self.dependency_values.strings[0].request_change_value_to(requested_value.clone());

            Ok(vec![DependencyValueUpdateRequest {
                instruction_idx: 0,
                dependency_idx: 0,
            }])
        }
    }
}

/// A simplified version of GeneralStringStateVarInterface
/// that is based on a single dependency.
#[derive(Debug, Default)]
pub struct SingleDependencyStringStateVarInterface {
    dependency_instruction: DependencyInstruction,

    dependency_instructions: SingleDependencyStringDependencyInstructions,
    dependency_values: SingleDependencyStringDependencies,
}

#[derive(Debug, Default, StateVariableDependencies, StateVariableDependencyInstructions)]
struct SingleDependencyStringDependencies {
    string: StateVarReadOnlyView<String>,
}

impl SingleDependencyStringStateVarInterface {
    pub fn new(dependency_instruction: DependencyInstruction) -> Self {
        SingleDependencyStringStateVarInterface {
            dependency_instruction,
            ..Default::default()
        }
    }
}

impl StateVarInterface<String> for SingleDependencyStringStateVarInterface {
    fn return_dependency_instructions(
        &mut self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        self.dependency_instructions = SingleDependencyStringDependencyInstructions {
            string: Some(self.dependency_instruction.clone()),
        };
        self.dependency_instructions.instructions_as_vec()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();
    }

    fn calculate_state_var_from_dependencies(&self, state_var: &StateVarMutableView<String>) {
        state_var.set_value(self.dependency_values.string.get().clone());
    }

    fn request_updated_dependency_values(
        &self,
        state_var: &StateVarReadOnlyView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let requested_value = state_var.get_requested_value();

        self.dependency_values
            .string
            .request_change_value_to(requested_value.clone());

        Ok(vec![DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        }])
    }
}

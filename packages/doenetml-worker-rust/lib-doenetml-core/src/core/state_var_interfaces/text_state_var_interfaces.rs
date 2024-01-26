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
/// If the component has an extend source so that this variable is shadowing another variable,
/// then prepend the shadowed state variable to the list of dependencies.
///
/// If the state variable has a single dependency that is an essential state variable,
/// then propagate the `used_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct GeneralStringStateVarInterface {
    /// The base dependency instruction that indicates how the dependencies of this state variable will be created.
    base_dependency_instruction: DependencyInstruction,

    /// The base dependency instruction, potentially augmented by a dependency instruction
    /// for shadowing another variable
    dependency_instructions: GeneralStringStateVarDependencyInstructions,

    /// The values of the dependencies created from the dependency instructions
    dependency_values: GeneralStringStateVarDependencies,

    /// If true, there is just a single dependency that is an essential state variable.
    /// In this case, we'll propagate the `used_default` attribute of the essential state variable.
    from_single_essential: bool,
}

/// The values of the dependencies that were created from the dependency instructions
#[derive(Debug, Default, StateVariableDependencies)]
struct GeneralStringStateVarDependencies {
    /// A vector of the string values of the dependencies
    #[consume_remaining_instructions]
    strings: Vec<StateVarReadOnlyView<String>>,

    // TODO: add via attribute macro?
    _instruction_mapping_data: GeneralStringStateVarDependencyData,
}

/// The dependency instructions that indicate how the dependencies of this state variable will be created.
/// They consist of the base dependency instruction specified, potentially augmented by a dependency instruction
/// for shadowing another variable
#[derive(Debug, Default, StateVariableDependencyInstructions)]
struct GeneralStringStateVarDependencyInstructions {
    /// If present, `extending` contains an instruction requesting the value of another text variable.
    /// It was created from the extend source for this component.
    extending: Option<DependencyInstruction>,

    /// The base dependency instruction specified for this variable.
    ///
    /// (It is always present. It is an option only to satisfy the API for
    /// the `StateVariableDependencyInstructions` derive macro.)
    other: Option<DependencyInstruction>,
}

impl GeneralStringStateVarInterface {
    pub fn new(base_dependency_instruction: DependencyInstruction) -> Self {
        GeneralStringStateVarInterface {
            base_dependency_instruction,
            ..Default::default()
        }
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
    // the dependency instruction that was specified as a parameter
    dependency_instruction: DependencyInstruction,

    /// The dependency instruction structure created by the
    /// `StateVariableDependencyInstructions` macro
    /// based on `SingleDependencyStringDependencies`
    dependency_instructions: SingleDependencyStringDependencyInstructions,

    /// The values of the dependencies created from the dependency instructions
    dependency_values: SingleDependencyStringDependencies,
}

/// The values of the dependencies that were created from the dependency instructions.
#[derive(Debug, Default, StateVariableDependencies, StateVariableDependencyInstructions)]
struct SingleDependencyStringDependencies {
    string: StateVarReadOnlyView<String>,

    // TODO: add via attribute macro?
    _instruction_mapping_data: SingleDependencyStringDependencyData,
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

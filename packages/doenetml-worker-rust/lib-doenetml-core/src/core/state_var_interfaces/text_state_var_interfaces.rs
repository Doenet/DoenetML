use crate::{components::prelude::*, dependency::DependencySource, ExtendSource};

use super::util::create_dependency_instruction_if_match_extend_source;

/// A string state variable interface that concatenates all string dependencies.
///
/// If the component has an extend source so that this variable is shadowing another variable,
/// then prepend the shadowed state variable to the list of dependencies.
///
/// If the state variable has a single dependency that is an essential state variable,
/// then propagate the `came_from_default` attribute of the essential state variable.
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
    /// In this case, we'll propagate the `came_from_default` attribute of the essential state variable.
    from_single_essential: bool,
}

/// The values of the dependencies that were created from the dependency instructions
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies)]
struct GeneralStringStateVarDependencies {
    /// A vector of the string values of the dependencies
    #[consume_remaining_instructions]
    strings: Vec<StateVarReadOnlyView<String>>,
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

    pub fn new_from_children() -> Self {
        GeneralStringStateVarInterface {
            base_dependency_instruction: DependencyInstruction::Child {
                match_profiles: vec![ComponentProfile::Text],
                exclude_if_prefer_profiles: vec![],
            },
            ..Default::default()
        }
    }

    pub fn new_from_attribute(attr_name: AttributeName) -> Self {
        GeneralStringStateVarInterface {
            base_dependency_instruction: DependencyInstruction::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::Text],
            },
            ..Default::default()
        }
    }
}

impl From<GeneralStringStateVarInterface> for StateVar<String> {
    fn from(interface: GeneralStringStateVarInterface) -> Self {
        StateVar::new(Box::new(interface), Default::default())
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

        (&self.dependency_instructions).into()
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

    fn calculate_state_var_from_dependencies(&self) -> StateVarCalcResult<String> {
        if self.from_single_essential {
            if self.dependency_values.strings[0].came_from_default() {
                // if we are basing it on a single essential variable that came from default,
                // then we propagate came_from_default as well as the value.
                return StateVarCalcResult::FromDefault(
                    self.dependency_values.strings[0].get().clone(),
                );
            } else {
                return StateVarCalcResult::Calculated(
                    self.dependency_values.strings[0].get().clone(),
                );
            }
        } else {
            // TODO: can we implement this without cloning the inner value?
            let value: String = self
                .dependency_values
                .strings
                .iter()
                .map(|v| v.get().clone())
                .collect();

            StateVarCalcResult::Calculated(value)
        }
    }

    fn request_dependency_updates(
        &mut self,
        state_var: &StateVarReadOnlyView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        if self.dependency_values.strings.len() != 1 {
            // TODO: implement for no dependencies where saves to essential value?
            Err(RequestDependencyUpdateError::CouldNotUpdate)
        } else {
            let requested_value = state_var.get_requested_value();

            self.dependency_values.strings[0].queue_update(requested_value.clone());

            Ok(self.dependency_values.return_queued_updates())
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
#[add_dependency_data]
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

impl From<SingleDependencyStringStateVarInterface> for StateVar<String> {
    fn from(interface: SingleDependencyStringStateVarInterface) -> Self {
        StateVar::new(Box::new(interface), Default::default())
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
        (&self.dependency_instructions).into()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();
    }

    fn calculate_state_var_from_dependencies(&self) -> StateVarCalcResult<String> {
        StateVarCalcResult::Calculated(self.dependency_values.string.get().clone())
    }

    fn request_dependency_updates(
        &mut self,
        state_var: &StateVarReadOnlyView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let requested_value = state_var.get_requested_value();

        self.dependency_values
            .string
            .queue_update(requested_value.clone());

        Ok(self.dependency_values.return_queued_updates())
    }
}

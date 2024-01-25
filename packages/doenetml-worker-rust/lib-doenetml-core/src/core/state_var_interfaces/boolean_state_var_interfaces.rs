use doenetml_derive::{StateVariableDependencies, StateVariableDependencyInstructions};

use crate::{
    components::prelude::{
        DependenciesCreatedForInstruction, DependencyInstruction, DependencyValueUpdateRequest,
        RequestDependencyUpdateError, StateVarIdx, StateVarInterface, StateVarMutableView,
        StateVarReadOnlyView, StateVarReadOnlyViewEnum, TryIntoStateVar,
    },
    dependency::DependencySource,
    ExtendSource,
};

use super::util::{create_dependency_instruction_from_extend_source, string_to_boolean};

/// A boolean state variable interface that concatenates all string dependencies.
///
/// If `should_create_dependency_from_extend_source` is true and has an extend source extending this variable,
/// then prepend the shadowed state variable.
///
/// If the state variable has a single boolean dependency that is an essential state variable,
/// then propagate the `used_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct GeneralBooleanStateVarInterface {
    should_create_dependency_from_extend_source: bool,
    is_primary_state_variable_for_shadowing_extend_source: bool,
    base_dependency_instruction: DependencyInstruction,

    dependency_instructions: GeneralBooleanStateVarDependencyInstructions,
    dependency_values: GeneralBooleanStateVarDependencies,

    from_single_essential: bool,
    have_invalid_combination: bool,
}

#[derive(Debug, Default, StateVariableDependencies)]
struct GeneralBooleanStateVarDependencies {
    #[consume_remaining_instructions]
    booleans_or_strings: Vec<BooleanOrString>,
}

#[derive(Debug, Default, StateVariableDependencyInstructions)]
struct GeneralBooleanStateVarDependencyInstructions {
    essential: Option<DependencyInstruction>,
    base: Option<DependencyInstruction>,
}

#[derive(Debug)]
enum BooleanOrString {
    Boolean(StateVarReadOnlyView<bool>),
    String(StateVarReadOnlyView<String>),
}

impl TryFrom<&StateVarReadOnlyViewEnum> for BooleanOrString {
    type Error = &'static str;

    fn try_from(value: &StateVarReadOnlyViewEnum) -> Result<Self, Self::Error> {
        match value {
            StateVarReadOnlyViewEnum::Boolean(boolean_sv) => Ok(BooleanOrString::Boolean(
                boolean_sv.create_new_read_only_view(),
            )),
            StateVarReadOnlyViewEnum::String(string_sv) => Ok(BooleanOrString::String(
                string_sv.create_new_read_only_view(),
            )),
            _ => Err("BooleanOrString can only be a boolean or string state variable"),
        }
    }
}

impl GeneralBooleanStateVarInterface {
    pub fn new(
        should_create_dependency_from_extend_source: bool,
        is_primary_state_variable_for_shadowing_extend_source: bool,
        base_dependency_instruction: DependencyInstruction,
    ) -> Self {
        GeneralBooleanStateVarInterface {
            should_create_dependency_from_extend_source,
            is_primary_state_variable_for_shadowing_extend_source,
            base_dependency_instruction,
            ..Default::default()
        }
    }
}

impl StateVarInterface<bool> for GeneralBooleanStateVarInterface {
    fn return_dependency_instructions(
        &mut self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        self.dependency_instructions = GeneralBooleanStateVarDependencyInstructions {
            essential: if self.should_create_dependency_from_extend_source {
                create_dependency_instruction_from_extend_source(
                    extending,
                    self.is_primary_state_variable_for_shadowing_extend_source,
                    state_var_idx,
                )
            } else {
                None
            },
            base: Some(self.base_dependency_instruction.clone()),
        };

        self.dependency_instructions.instructions_as_vec()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();

        if self.dependency_values.booleans_or_strings.len() == 1 {
            match dependencies[0][0].source {
                DependencySource::Essential { .. } => {
                    self.from_single_essential = true;
                }
                _ => {}
            }
        } else if self
            .dependency_values
            .booleans_or_strings
            .iter()
            .any(|dep_value| matches!(dep_value, BooleanOrString::Boolean(_)))
        {
            // have more than one dependency and at least one boolean dependency
            self.have_invalid_combination = true;
        }
    }

    fn calculate_state_var_from_dependencies(&self, state_var: &StateVarMutableView<bool>) {
        if self.have_invalid_combination {
            state_var.set_value(false);
        } else if self.dependency_values.booleans_or_strings.len() == 1 {
            match &self.dependency_values.booleans_or_strings[0] {
                BooleanOrString::Boolean(boolean_value) => {
                    if self.from_single_essential {
                        // if we are basing it on a single essential variable,
                        // then we propagate used_default as well as the value.
                        state_var.set_value_and_set_used_default(
                            *boolean_value.get(),
                            boolean_value.get_used_default(),
                        );
                    } else {
                        state_var.set_value(*boolean_value.get());
                    }
                }
                BooleanOrString::String(string_value) => {
                    state_var.set_value(string_to_boolean(&string_value.get()))
                }
            }
        } else {
            // concatenate the string values into a single string
            // TODO: can we do this without cloning
            let value: String = self
                .dependency_values
                .booleans_or_strings
                .iter()
                .map(|v| match v {
                    BooleanOrString::Boolean(boolean_val) => boolean_val.get().to_string(),
                    BooleanOrString::String(string_value) => string_value.get().to_string(),
                })
                .collect();

            state_var.set_value(string_to_boolean(&value));
        }
    }

    fn request_updated_dependency_values(
        &self,
        state_var: &StateVarReadOnlyView<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        if self.dependency_values.booleans_or_strings.len() == 1 {
            match &self.dependency_values.booleans_or_strings[0] {
                BooleanOrString::Boolean(boolean_value) => {
                    boolean_value.request_change_value_to(*state_var.get_requested_value());
                    Ok(vec![DependencyValueUpdateRequest {
                        instruction_idx: 0,
                        dependency_idx: 0,
                    }])
                }
                BooleanOrString::String(string_value) => {
                    let requested_value = state_var.get_requested_value();

                    string_value.request_change_value_to(requested_value.to_string());

                    Ok(vec![DependencyValueUpdateRequest {
                        instruction_idx: 0,
                        dependency_idx: 0,
                    }])
                }
            }
        } else {
            Err(RequestDependencyUpdateError::CouldNotUpdate)
        }
    }
}

/// A simplified version of GeneralBooleanStateVarInterface
/// that is based on a single dependency.
/// Requires a `dependency_instruction_hint`.
#[derive(Debug, Default)]
pub struct SingleDependencyBooleanStateVarInterface {
    dependency_instruction: DependencyInstruction,

    dependency_instructions: SingleDependencyBooleanDependencyInstructions,
    dependency_values: SingleDependencyBooleanDependencies,
}

#[derive(Debug, Default, StateVariableDependencies, StateVariableDependencyInstructions)]
struct SingleDependencyBooleanDependencies {
    boolean: StateVarReadOnlyView<bool>,
}

impl SingleDependencyBooleanStateVarInterface {
    pub fn new(dependency_instruction: DependencyInstruction) -> Self {
        SingleDependencyBooleanStateVarInterface {
            dependency_instruction,
            ..Default::default()
        }
    }
}

impl StateVarInterface<bool> for SingleDependencyBooleanStateVarInterface {
    fn return_dependency_instructions(
        &mut self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        self.dependency_instructions = SingleDependencyBooleanDependencyInstructions {
            boolean: Some(self.dependency_instruction.clone()),
        };
        self.dependency_instructions.instructions_as_vec()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();
    }

    fn calculate_state_var_from_dependencies(&self, state_var: &StateVarMutableView<bool>) {
        state_var.set_value(*self.dependency_values.boolean.get());
    }

    fn request_updated_dependency_values(
        &self,
        state_var: &StateVarReadOnlyView<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        self.dependency_values
            .boolean
            .request_change_value_to(*state_var.get_requested_value());

        Ok(vec![DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        }])
    }
}

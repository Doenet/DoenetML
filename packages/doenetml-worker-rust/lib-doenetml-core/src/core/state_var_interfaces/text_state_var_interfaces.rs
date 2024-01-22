use crate::{
    components::prelude::{
        Dependency, DependencyInstruction, DependencyValueUpdateRequest,
        RequestDependencyUpdateError, StateVarIdx, StateVarInterface, StateVarMutableView,
        StateVarParameters, StateVarReadOnlyView, StateVarReadOnlyViewEnum,
    },
    dependency::DependencySource,
    ExtendSource,
};

use super::util::create_dependency_instruction_from_extend_source;

/// A string state variable interface that concatenates all string dependencies.
///
/// If `should_create_dependency_from_extend_source` is true and has an extend source extending this variable,
/// then prepend the shadowed state variable.
///
/// If the state variable has a single dependency that is an essential state variable,
/// then propagate the `used_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct GeneralStringStateVarInterface {
    string_dependency_values: Vec<StateVarReadOnlyView<String>>,
    from_single_essential: bool,
}

impl StateVarInterface<String> for GeneralStringStateVarInterface {
    fn return_dependency_instructions(
        &self,
        extending: Option<&ExtendSource>,
        parameters: &StateVarParameters,
        state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        let mut dep_instructs: Vec<DependencyInstruction> = Vec::with_capacity(2);

        if parameters.should_create_dependency_from_extend_source {
            if let Some(dep_inst) = create_dependency_instruction_from_extend_source(
                extending,
                parameters,
                state_var_idx,
            ) {
                dep_instructs.push(dep_inst)
            }
        }

        if let Some(dependency_instruction) = &parameters.dependency_instruction_hint {
            dep_instructs.push(dependency_instruction.clone());
        }

        dep_instructs
    }

    fn save_dependencies(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        self.string_dependency_values = dependencies
            .iter()
            .flat_map(|instruction| {
                instruction
                    .iter()
                    .map(|dependency| (&dependency.value).try_into().unwrap())
            })
            .collect();

        if self.string_dependency_values.len() == 1 {
            match dependencies[0][0].source {
                DependencySource::Essential { .. } => {
                    self.from_single_essential = true;
                }
                _ => {}
            }
        }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableView<String>,
    ) {
        if self.from_single_essential {
            // if we are basing it on a single essential variable,
            // then we propagate used_default as well as the value.
            state_var.set_value_and_used_default(
                self.string_dependency_values[0].get_fresh_value().clone(),
                self.string_dependency_values[0].get_used_default(),
            );
        } else {
            // TODO: can we implement this without cloning the inner value?
            let value: String = self
                .string_dependency_values
                .iter()
                .map(|v| v.get_fresh_value().clone())
                .collect();

            state_var.set_value(value);
        }
    }

    fn request_updated_dependency_values(
        &self,
        state_var: &StateVarReadOnlyView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        if self.string_dependency_values.len() != 1 {
            // TODO: implement for no dependencies where saves to essential value?
            Err(RequestDependencyUpdateError::CouldNotUpdate)
        } else {
            let requested_value = state_var.get_requested_value();

            self.string_dependency_values[0].request_change_value_to(requested_value.clone());

            Ok(vec![DependencyValueUpdateRequest {
                instruction_idx: 0,
                dependency_idx: 0,
            }])
        }
    }
}

/// A simplified version of GeneralStringStateVarInterface
/// that is based on a single dependency.
/// Requires a `dependency_instruction_hint`.
///
/// Panics if `should_create_dependency_from_extend_source` is true,
/// if not given a `dependency_instruction_hint`,
/// or if given a `dependency_instruction_hint`
/// that doesn't result in at least one string dependency.
#[derive(Debug, Default)]
pub struct SingleDependencyStringStateVarInterface {
    string_dependency_value: StateVarReadOnlyView<String>,
}

impl StateVarInterface<String> for SingleDependencyStringStateVarInterface {
    fn return_dependency_instructions(
        &self,
        _extending: Option<&ExtendSource>,
        parameters: &StateVarParameters,
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        if parameters.should_create_dependency_from_extend_source {
            panic!("Cannot create dependency from extend source for SingleDependencyStringStateVarInterface");
        }

        if let Some(dependency_instruction) = &parameters.dependency_instruction_hint {
            vec![dependency_instruction.clone()]
        } else {
            panic!(
                "SingleDependencyStringStateVarInterface requires a dependency_instruction_hint"
            );
        }
    }

    fn save_dependencies(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        if dependencies.is_empty() {
            panic!("SingleDependencyStringStateVarInterface requires a dependency");
        }

        let dep_val = &dependencies[0][0].value;

        if let StateVarReadOnlyViewEnum::String(string_val) = dep_val {
            self.string_dependency_value = string_val.create_new_read_only_view();
        } else {
            panic!("Got a non-string value for a dependency for a SingleDependencyStringStateVarInterface");
        }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableView<String>,
    ) {
        state_var.set_value(self.string_dependency_value.get_fresh_value().clone());
    }

    fn request_updated_dependency_values(
        &self,
        state_var: &StateVarReadOnlyView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let requested_value = state_var.get_requested_value();

        self.string_dependency_value
            .request_change_value_to(requested_value.clone());

        Ok(vec![DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        }])
    }
}

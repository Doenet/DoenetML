use crate::{
    components::prelude::{
        Dependency, DependencyInstruction, DependencyValueUpdateRequest,
        RequestDependencyUpdateError, StateVarInterface, StateVarMutableViewTyped,
        StateVarParameters, StateVarReadOnlyView, StateVarReadOnlyViewTyped,
    },
    dependency::DependencySource,
    ExtendSource,
};

use super::common::create_dependency_instruction_from_extend_source;

// use super::{
//     StateVarInterface, StateVarMutableViewTyped, StateVarParameters, StateVarReadOnlyView,
//     StateVarReadOnlyViewTyped,
// };

/// A string state variable interface that concatenates all string dependencies.
///
/// If `create_dependency_from_extend_source` is true and have an extend source extending this variable,
/// then prepend the shadowed state variable.
///
/// If the state variable has a single dependency that is an essential state variable,
/// then propagate the `used_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct GeneralStringStateVarInterface {
    string_dependency_values: Vec<StateVarReadOnlyViewTyped<String>>,
    from_single_essential: bool,
}

impl StateVarInterface<String> for GeneralStringStateVarInterface {
    fn return_dependency_instructions(
        &self,
        extend_source: Option<&ExtendSource>,
        parameters: &StateVarParameters,
    ) -> Vec<DependencyInstruction> {
        let mut dep_instructs: Vec<DependencyInstruction> = Vec::with_capacity(2);

        if parameters.create_dependency_from_extend_source {
            if let Some(dep_inst) =
                create_dependency_instruction_from_extend_source(extend_source, parameters)
            {
                dep_instructs.push(dep_inst)
            }
        }

        if let Some(dependency_instruction) = &parameters.dependency_instruction_hint {
            dep_instructs.push(dependency_instruction.clone());
        }

        dep_instructs
    }

    fn save_dependencies_for_value_calculation(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        let num_dependencies = dependencies.iter().fold(0, |a, c| a + c.len());

        let mut string_vals = Vec::with_capacity(num_dependencies);

        for instruction in dependencies.iter() {
            for Dependency {
                value: dep_value, ..
            } in instruction.iter()
            {
                if let StateVarReadOnlyView::String(dep_string_value) = dep_value {
                    string_vals.push(dep_string_value.create_new_read_only_view())
                } else {
                    panic!("Got a non-string value for a dependency for a GeneralStringStateVarInterface");
                }
            }
        }

        self.string_dependency_values = string_vals;

        if num_dependencies == 1 {
            if let DependencySource::Essential { .. } = dependencies[0][0].source {
                self.from_single_essential = true;
            }
        }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableViewTyped<String>,
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

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        if self.string_dependency_values.len() != 1 {
            // TODO: implement for no dependencies where saves to essential value?
            Err(RequestDependencyUpdateError::CouldNotUpdate)
        } else {
            let desired_value = state_var.get_requested_value();

            self.string_dependency_values[0].request_change_value_to(desired_value.clone());

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
/// Panics if `create_dependency_from_extend_source` is true,
/// if not given a `dependency_instruction_hint`,
/// or if given a `dependency_instruction_hint`
/// that doesn't result in at least one string dependency.
#[derive(Debug, Default)]
pub struct SingleDependencyStringStateVarInterface {
    string_dependency_value: StateVarReadOnlyViewTyped<String>,
}

impl StateVarInterface<String> for SingleDependencyStringStateVarInterface {
    fn return_dependency_instructions(
        &self,
        _extend_source: Option<&ExtendSource>,
        parameters: &StateVarParameters,
    ) -> Vec<DependencyInstruction> {
        if parameters.create_dependency_from_extend_source {
            panic!("Cannot create dependency from extend source for SingleDependencyStringStateVarInterface");
        }

        let mut dep_instructs: Vec<DependencyInstruction> = Vec::with_capacity(1);

        if let Some(dependency_instruction) = &parameters.dependency_instruction_hint {
            dep_instructs.push(dependency_instruction.clone());
        } else {
            panic!(
                "SingleDependencyStringStateVarInterface requires a dependency_instruction_hint"
            );
        }

        dep_instructs
    }

    fn save_dependencies_for_value_calculation(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        if dependencies.is_empty() {
            panic!("SingleDependencyStringStateVarInterface requires a dependency");
        }

        let dep_val = &dependencies[0][0].value;

        if let StateVarReadOnlyView::String(string_val) = dep_val {
            self.string_dependency_value = string_val.create_new_read_only_view();
        } else {
            panic!("Got a non-string value for a dependency for a SingleDependencyStringStateVarInterface");
        }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableViewTyped<String>,
    ) {
        state_var.set_value(self.string_dependency_value.get_fresh_value().clone());
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let desired_value = state_var.get_requested_value();

        self.string_dependency_value
            .request_change_value_to(desired_value.clone());

        Ok(vec![DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        }])
    }
}

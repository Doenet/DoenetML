use crate::{
    components::prelude::{Dependency, DependencyInstruction, DependencyValueUpdateRequest},
    ExtendSource,
};

use super::{
    StateVarInterface, StateVarMutableViewTyped, StateVarParameters, StateVarReadOnlyView,
    StateVarReadOnlyViewTyped,
};

/// A string state variable interface that concatenates all string dependencies.
///
/// If `create_dependency_from_extend_source` is true and have an extend source extending this variable,
/// then prepend the shadowed state variable.
#[derive(Debug, Default)]
pub struct GeneralStringStateVarInterface {
    string_dependency_values: Vec<StateVarReadOnlyViewTyped<String>>,
}

impl StateVarInterface<String> for GeneralStringStateVarInterface {
    fn return_dependency_instructions(
        &self,
        extend_source: Option<&ExtendSource>,
        parameters: &StateVarParameters,
    ) -> Vec<DependencyInstruction> {
        let mut dep_instructs: Vec<DependencyInstruction> = Vec::with_capacity(2);

        if parameters.create_dependency_from_extend_source {
            if let Some(ExtendSource::StateVar(extend_state_var_description)) = extend_source {
                for state_var_match in extend_state_var_description.state_variable_matching.iter() {
                    if state_var_match
                        .shadowing_name
                        .and_then(|name| Some(name == parameters.name))
                        .or_else(|| {
                            Some(parameters.is_primary_state_variable_for_shadowing_extend_source)
                        })
                        .unwrap()
                    {
                        // Either
                        // 1. shadowing name was supplied and it matches the name of the state variable, or
                        // 2. shadowing name was not supplied and this variable is the primary state variable
                        //    for use when shadowing extend sources.
                        // Therefore, we shadow the extend source.

                        dep_instructs.push(DependencyInstruction::StateVar {
                            component_idx: Some(extend_state_var_description.component_idx),
                            state_var_name: state_var_match.shadowed_name,
                        });

                        break;
                    }
                }
            }
        }

        if let Some(dependency_instruction) = &parameters.dependency_instruction_hint {
            dep_instructs.push(dependency_instruction.clone());
        }

        dep_instructs
    }

    fn save_dependencies_for_value_calculation(
        &mut self,
        dependencies: &Vec<Vec<Dependency>>,
    ) -> () {
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
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableViewTyped<String>,
    ) -> () {
        // TODO: can we implement this without cloning the inner value?
        let value: String = self
            .string_dependency_values
            .iter()
            .map(|v| v.get_fresh_value().clone())
            .collect();

        state_var.set_value(value);
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, ()> {
        if self.string_dependency_values.len() != 1 {
            // TODO: implement for no dependencies where saves to essential value?
            Err(())
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

        let mut dep_instructs: Vec<DependencyInstruction> = Vec::with_capacity(2);

        if let Some(dependency_instruction) = &parameters.dependency_instruction_hint {
            dep_instructs.push(dependency_instruction.clone());
        } else {
            panic!(
                "SingleDependencyStringStateVarInterface requires a dependency_instruction_hint"
            );
        }

        dep_instructs
    }

    fn save_dependencies_for_value_calculation(
        &mut self,
        dependencies: &Vec<Vec<Dependency>>,
    ) -> () {
        if dependencies.len() == 0 {
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
    ) -> () {
        state_var.set_value(self.string_dependency_value.get_fresh_value().clone());
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, ()> {
        let desired_value = state_var.get_requested_value();

        self.string_dependency_value
            .request_change_value_to(desired_value.clone());

        Ok(vec![DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        }])
    }
}

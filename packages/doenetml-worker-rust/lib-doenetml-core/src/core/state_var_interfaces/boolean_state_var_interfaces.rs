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
/// If the state variable has a single boolean dependency that is an essential state variable,
/// then propagate the `used_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct GeneralBooleanStateVarInterface {
    boolean_or_strings_dependency_values: BooleanOrStrings,
    from_single_essential: bool,
}

#[derive(Debug)]
enum BooleanOrStrings {
    Boolean(StateVarReadOnlyViewTyped<bool>),
    Strings(Vec<StateVarReadOnlyViewTyped<String>>),
}

impl Default for BooleanOrStrings {
    fn default() -> Self {
        BooleanOrStrings::Boolean(StateVarReadOnlyViewTyped::default())
    }
}

impl StateVarInterface<bool> for GeneralBooleanStateVarInterface {
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
        let mut boolean_val_option: Option<StateVarReadOnlyViewTyped<bool>> = None;

        for instruction in dependencies.iter() {
            for Dependency {
                value: dep_value, ..
            } in instruction.iter()
            {
                match dep_value {
                    StateVarReadOnlyView::String(dep_string_value) => {
                        string_vals.push(dep_string_value.create_new_read_only_view())
                    }
                    StateVarReadOnlyView::Boolean(dep_bool_value) => {
                        if boolean_val_option.is_some() {
                            // TODO: emit warning rather than panic
                            panic!("Got more than one boolean dependency for a GeneralBooleanStateVarInterface");
                        }
                        boolean_val_option = Some(dep_bool_value.create_new_read_only_view())
                    }
                    _ => {
                        panic!("Got a non-string or boolean value for a dependency for a GeneralBooleanStateVarInterface");
                    }
                }
            }
        }

        if let Some(bool_val) = boolean_val_option {
            if !string_vals.is_empty() {
                // TODO: emit warning rather than panic
                // Eventually want to handle this case
                panic!("Got a boolean and string dependency for a GeneralBooleanStateVarInterface");
            }

            self.boolean_or_strings_dependency_values = BooleanOrStrings::Boolean(bool_val);

            if let DependencySource::Essential { .. } = dependencies[0][0].source {
                self.from_single_essential = true;
            }
        } else {
            self.boolean_or_strings_dependency_values = BooleanOrStrings::Strings(string_vals);
        }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableViewTyped<bool>,
    ) {
        match &self.boolean_or_strings_dependency_values {
            BooleanOrStrings::Boolean(boolean_value) => {
                if self.from_single_essential {
                    // if we are basing it on a single essential variable,
                    // then we propagate used_default as well as the value.
                    state_var.set_value_and_used_default(
                        *boolean_value.get_fresh_value(),
                        boolean_value.get_used_default(),
                    );
                } else {
                    state_var.set_value(*boolean_value.get_fresh_value());
                }
            }
            BooleanOrStrings::Strings(string_values) => {
                let value: String = string_values
                    .iter()
                    .map(|v| v.get_fresh_value().clone())
                    .collect();

                if value.eq_ignore_ascii_case("true") || value.is_empty() {
                    state_var.set_value(true);
                } else {
                    state_var.set_value(false);
                }
            }
        }
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        match &self.boolean_or_strings_dependency_values {
            BooleanOrStrings::Boolean(boolean_value) => {
                boolean_value.request_change_value_to(*state_var.get_requested_value());
                Ok(vec![DependencyValueUpdateRequest {
                    instruction_idx: 0,
                    dependency_idx: 0,
                }])
            }
            BooleanOrStrings::Strings(string_values) => {
                if string_values.len() != 1 {
                    // TODO: implement for no dependencies where saves to essential value?
                    Err(RequestDependencyUpdateError::CouldNotUpdate)
                } else {
                    let desired_value = state_var.get_requested_value();

                    string_values[0].request_change_value_to(desired_value.to_string());

                    Ok(vec![DependencyValueUpdateRequest {
                        instruction_idx: 0,
                        dependency_idx: 0,
                    }])
                }
            }
        }
    }
}

/// A simplified version of GeneralBooleanStateVarInterface
/// that is based on a single dependency.
/// Requires a `dependency_instruction_hint`.
///
/// Panics if `create_dependency_from_extend_source` is true,
/// if not given a `dependency_instruction_hint`,
/// or if given a `dependency_instruction_hint`
/// that doesn't result in at least one string dependency.
#[derive(Debug, Default)]
pub struct SingleDependencyBooleanStateVarInterface {
    boolean_dependency_value: StateVarReadOnlyViewTyped<bool>,
}

impl StateVarInterface<bool> for SingleDependencyBooleanStateVarInterface {
    fn return_dependency_instructions(
        &self,
        _extend_source: Option<&ExtendSource>,
        parameters: &StateVarParameters,
    ) -> Vec<DependencyInstruction> {
        if parameters.create_dependency_from_extend_source {
            panic!("Cannot create dependency from extend source for SingleDependencyBooleanStateVarInterface");
        }

        let mut dep_instructs: Vec<DependencyInstruction> = Vec::with_capacity(1);

        if let Some(dependency_instruction) = &parameters.dependency_instruction_hint {
            dep_instructs.push(dependency_instruction.clone());
        } else {
            panic!(
                "SingleDependencyBooleanStateVarInterface requires a dependency_instruction_hint"
            );
        }

        dep_instructs
    }

    fn save_dependencies_for_value_calculation(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        if dependencies.is_empty() {
            panic!("SingleDependencyBooleanStateVarInterface requires a dependency");
        }

        let dep_val = &dependencies[0][0].value;

        if let StateVarReadOnlyView::Boolean(boolean_val) = dep_val {
            self.boolean_dependency_value = boolean_val.create_new_read_only_view();
        } else {
            panic!("Got a non-boolean value for a dependency for a SingleDependencyBooleanStateVarInterface");
        }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableViewTyped<bool>,
    ) {
        state_var.set_value(*self.boolean_dependency_value.get_fresh_value());
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyViewTyped<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        self.boolean_dependency_value
            .request_change_value_to(*state_var.get_requested_value());

        Ok(vec![DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        }])
    }
}

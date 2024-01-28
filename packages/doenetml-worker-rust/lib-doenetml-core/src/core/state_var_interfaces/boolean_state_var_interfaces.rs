use enum_dispatch::enum_dispatch;

use crate::{components::prelude::*, dependency::DependencySource, ExtendSource};

use super::util::{create_dependency_instruction_if_match_extend_source, string_to_boolean};

/// A boolean state variable interface for calculating the value of a boolean variable from dependencies.
///
/// The current version is in a preliminary form, where the only valid options are
/// - a single boolean dependency
/// - string dependencies (that are concatenated to see if they spell out "true")
///
/// If the component has an extend source so that this variable is shadowing another variable,
/// then prepend the shadowed state variable to the list of dependencies.
///
/// If the state variable has a single boolean dependency that is an essential state variable,
/// then propagate the `came_from_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct GeneralBooleanStateVarInterface {
    /// The base dependency instruction that indicates how the dependencies of this state variable will be created.
    base_dependency_instruction: DependencyInstruction,

    /// The base dependency instruction, potentially augmented by a dependency instruction
    /// for shadowing another variable
    dependency_instructions: GeneralBooleanStateVarDependencyInstructions,

    /// The values of the dependencies created from the dependency instructions
    dependency_values: GeneralBooleanStateVarDependencies,

    /// If true, there is just a single dependency that is an essential state variable.
    /// In this case, we'll propagate the `came_from_default` attribute of the essential state variable.
    from_single_essential: bool,

    /// We have currently implemented only a few possible combinations of dependencies (single boolean or multiple string).
    /// If `have_invalid_combination` is true, then we haven't implemented an algorithm
    /// to handle to combinations, and the state variable will just have the value false.
    have_invalid_combination: bool,
}

/// The values of the dependencies created from the dependency instructions
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies)]
struct GeneralBooleanStateVarDependencies {
    /// A vector of the boolean or string values of the dependencies
    #[consume_remaining_instructions]
    booleans_or_strings: Vec<BooleanOrString>,
}

/// The dependency instructions that indicate how the dependencies of this state variable will be created.
/// They consist of the base dependency instruction specified, potentially augmented by a dependency instruction
/// for shadowing another variable
#[derive(Debug, Default, StateVariableDependencyInstructions)]
struct GeneralBooleanStateVarDependencyInstructions {
    /// If present, `extending` contains an instruction requesting the value of another boolean variable.
    /// It was created from the extend source for this component.
    extending: Option<DependencyInstruction>,

    /// The base dependency instruction specified for this variable.
    ///
    /// (It is always present. It is an option only to satisfy the API for
    /// the `StateVariableDependencyInstructions` derive macro.)
    base: Option<DependencyInstruction>,
}

/// Since the state variable is based on booleans or strings,
/// the `BooleanOrString` enum is used to store
/// the values of dependencies created.
#[derive(Debug)]
#[enum_dispatch(QueryUpdateRequests)]
enum BooleanOrString {
    Boolean(StateVarReadOnlyView<bool>),
    String(StateVarReadOnlyView<String>),
}

// We implement TryFrom `StateVarReadOnlyViewEnum`
// so that we can `try_into` `GeneralBooleanStateVarDependencies`
// from the vector of dependencies.
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
    pub fn new(base_dependency_instruction: DependencyInstruction) -> Self {
        GeneralBooleanStateVarInterface {
            base_dependency_instruction,
            ..Default::default()
        }
    }

    pub fn new_from_children() -> Self {
        GeneralBooleanStateVarInterface {
            base_dependency_instruction: DependencyInstruction::Child {
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                exclude_if_prefer_profiles: vec![],
            },
            ..Default::default()
        }
    }

    pub fn new_from_attribute(attr_name: AttributeName) -> Self {
        GeneralBooleanStateVarInterface {
            base_dependency_instruction: DependencyInstruction::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
            },
            ..Default::default()
        }
    }
}

impl From<GeneralBooleanStateVarInterface> for StateVar<bool> {
    fn from(interface: GeneralBooleanStateVarInterface) -> Self {
        StateVar::new(Box::new(interface), Default::default())
    }
}

impl StateVarInterface<bool> for GeneralBooleanStateVarInterface {
    fn return_dependency_instructions(
        &mut self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        self.dependency_instructions = GeneralBooleanStateVarDependencyInstructions {
            extending: create_dependency_instruction_if_match_extend_source(
                extending,
                state_var_idx,
            ),
            base: Some(self.base_dependency_instruction.clone()),
        };

        (&self.dependency_instructions).into()
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

    fn calculate_state_var_from_dependencies(&self) -> StateVarCalcResult<bool> {
        if self.have_invalid_combination {
            StateVarCalcResult::Calculated(false)
        } else if self.dependency_values.booleans_or_strings.len() == 1 {
            match &self.dependency_values.booleans_or_strings[0] {
                BooleanOrString::Boolean(boolean_value) => {
                    if self.from_single_essential {
                        if boolean_value.came_from_default() {
                            // If we are basing it on a single essential variable that came from default,
                            // then we propagate came_from_default as well as the value.
                            return StateVarCalcResult::FromDefault(*boolean_value.get());
                        } else {
                            return StateVarCalcResult::Calculated(*boolean_value.get());
                        }
                    } else {
                        return StateVarCalcResult::Calculated(*boolean_value.get());
                    }
                }
                BooleanOrString::String(string_value) => {
                    return StateVarCalcResult::Calculated(string_to_boolean(&string_value.get()));
                }
            }
        } else {
            // concatenate the string values into a single string
            // TODO: can we do this without cloning?
            let value: String = self
                .dependency_values
                .booleans_or_strings
                .iter()
                .map(|v| match v {
                    BooleanOrString::Boolean(boolean_val) => boolean_val.get().to_string(),
                    BooleanOrString::String(string_value) => string_value.get().to_string(),
                })
                .collect();
            return StateVarCalcResult::Calculated(string_to_boolean(&value));
        }
    }

    fn request_dependency_updates(
        &mut self,
        state_var: &StateVarReadOnlyView<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        if self.dependency_values.booleans_or_strings.len() == 1 {
            match &mut self.dependency_values.booleans_or_strings[0] {
                BooleanOrString::Boolean(boolean_value) => {
                    boolean_value.queue_update(*state_var.get_requested_value());
                }
                BooleanOrString::String(string_value) => {
                    let requested_value = state_var.get_requested_value();

                    string_value.queue_update(requested_value.to_string());
                }
            }
            Ok(self.dependency_values.return_queued_updates())
        } else {
            Err(RequestDependencyUpdateError::CouldNotUpdate)
        }
    }
}

/// A simplified version of GeneralBooleanStateVarInterface
/// that is based on a single dependency.
#[derive(Debug, Default)]
pub struct SingleDependencyBooleanStateVarInterface {
    // the dependency instruction that was specified as a parameter
    dependency_instruction: DependencyInstruction,

    /// The dependency instruction structure created by the
    /// `StateVariableDependencyInstructions` macro
    /// based on `SingleDependencyBooleanDependencies`
    dependency_instructions: SingleDependencyBooleanDependencyInstructions,

    /// The values of the dependencies created from the dependency instructions
    dependency_values: SingleDependencyBooleanDependencies,
}

/// The values of the dependencies that were created from the dependency instructions.
#[add_dependency_data]
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

impl From<SingleDependencyBooleanStateVarInterface> for StateVar<bool> {
    fn from(interface: SingleDependencyBooleanStateVarInterface) -> Self {
        StateVar::new(Box::new(interface), Default::default())
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
        (&self.dependency_instructions).into()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();
    }

    fn calculate_state_var_from_dependencies(&self) -> StateVarCalcResult<bool> {
        StateVarCalcResult::Calculated(*self.dependency_values.boolean.get())
    }

    fn request_dependency_updates(
        &mut self,
        state_var: &StateVarReadOnlyView<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        self.dependency_values
            .boolean
            .queue_update(*state_var.get_requested_value());

        Ok(self.dependency_values.return_queued_updates())
    }
}

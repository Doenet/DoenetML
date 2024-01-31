use enum_dispatch::enum_dispatch;

use crate::{components::prelude::*, ExtendSource};

use super::util::{create_data_query_if_match_extend_source, string_to_boolean};

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
pub struct BooleanStateVar {
    /// The base data query that indicates how the dependencies of this state variable will be created.
    base_data_query: DataQuery,

    default_value: bool,
}

/// The values of the dependencies created from the data queries
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
pub struct BooleanRequiredData {
    /// If this state variable is extending another state variable,
    /// the value that is being extended
    extending: Option<StateVarView<bool>>,

    /// A vector of the boolean or string values of the dependencies coming from the base_data_query
    base: Vec<BooleanOrString>,
}

/// Since the state variable is based on booleans or strings,
/// the `BooleanOrString` enum is used to store
/// the values of dependencies created.
#[derive(Debug)]
#[enum_dispatch(QueryUpdateRequests)]
enum BooleanOrString {
    Boolean(StateVarView<bool>),
    String(StateVarView<String>),
}

// We implement TryFromState
// because all RequiredData must implement this trait.
// (Needed to create the create the RequiredData from the information sent the state variable)
impl TryFromState<StateVarViewEnum> for BooleanOrString {
    type Error = &'static str;

    fn try_from_state(value: &StateVarViewEnum) -> Result<Self, Self::Error> {
        match value {
            StateVarViewEnum::Boolean(boolean_sv) => Ok(BooleanOrString::Boolean(
                boolean_sv.create_new_read_only_view(),
            )),
            StateVarViewEnum::String(string_sv) => Ok(BooleanOrString::String(
                string_sv.create_new_read_only_view(),
            )),
            _ => Err("BooleanOrString can only be a boolean or string state variable"),
        }
    }
}

impl BooleanStateVar {
    /// Creates a state var that queries its value from the given data query.
    pub fn new(base_data_query: DataQuery) -> Self {
        BooleanStateVar {
            base_data_query,
            ..Default::default()
        }
    }

    /// Creates a state var that queries its value from children matching the `Text` or `Boolean` profile.
    pub fn new_from_children() -> Self {
        BooleanStateVar {
            base_data_query: DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                exclude_if_prefer_profiles: vec![],
            },
            ..Default::default()
        }
    }

    /// Creates a state var that queries its value from attributes matching the `Text` or `Boolean` profile.
    pub fn new_from_attribute(attr_name: AttributeName, default_value: bool) -> Self {
        BooleanStateVar {
            base_data_query: DataQuery::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
            },
            default_value,
            ..Default::default()
        }
    }
}

impl StateVarUpdater<bool, BooleanRequiredData> for BooleanStateVar {
    fn default_value(&self) -> bool {
        self.default_value
    }

    fn return_data_queries(
        &self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<Option<DataQuery>> {
        BooleanRequiredDataQueries {
            extending: create_data_query_if_match_extend_source(extending, state_var_idx),
            base: Some(self.base_data_query.clone()),
        }
        .into()
    }

    #[allow(clippy::needless_return)]
    fn calculate(data: &BooleanRequiredData) -> StateVarCalcResult<bool> {
        if let Some(extending) = data.extending.as_ref() {
            if data.base.is_empty() {
                if extending.came_from_default() {
                    return StateVarCalcResult::FromDefault(*extending.get());
                } else {
                    return StateVarCalcResult::Calculated(*extending.get());
                }
            } else {
                // invalid combination. Haven't implemented extending plus other data
                return StateVarCalcResult::Calculated(false);
            }
        } else if data.base.len() == 1 {
            match &data.base[0] {
                BooleanOrString::Boolean(boolean_value) => {
                    if boolean_value.came_from_default() {
                        // If we are basing it on a single variable that came from default,
                        // then we propagate came_from_default as well as the value.
                        return StateVarCalcResult::FromDefault(*boolean_value.get());
                    } else {
                        return StateVarCalcResult::Calculated(*boolean_value.get());
                    }
                }
                BooleanOrString::String(string_value) => {
                    return StateVarCalcResult::Calculated(string_to_boolean(&string_value.get()));
                }
            }
        } else if data
            .base
            .iter()
            .any(|dep_value| matches!(dep_value, BooleanOrString::Boolean(_)))
        {
            // invalid combination. Haven't implemented boolean dependency with other
            return StateVarCalcResult::Calculated(false);
        } else {
            // concatenate the string values into a single string
            // TODO: can we do this without cloning?
            let value: String = data
                .base
                .iter()
                .map(|v| match v {
                    BooleanOrString::Boolean(boolean_val) => boolean_val.get().to_string(),
                    BooleanOrString::String(string_value) => string_value.get().to_string(),
                })
                .collect();
            return StateVarCalcResult::Calculated(string_to_boolean(&value));
        }
    }

    #[allow(clippy::needless_return)]
    fn invert(
        data: &mut BooleanRequiredData,
        state_var: &StateVarView<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        if let Some(extending) = data.extending.as_mut() {
            if data.base.is_empty() {
                extending.queue_update(*state_var.get_requested_value());
                return Ok(data.queued_updates());
            } else {
                // Invalid combination. Haven't implemented extending plus other data.
                return Err(RequestDependencyUpdateError::CouldNotUpdate);
            }
        } else if data.base.len() == 1 {
            match &mut data.base[0] {
                BooleanOrString::Boolean(boolean_value) => {
                    boolean_value.queue_update(*state_var.get_requested_value());
                }
                BooleanOrString::String(string_value) => {
                    let requested_value = state_var.get_requested_value();

                    string_value.queue_update(requested_value.to_string());
                }
            }
            return Ok(data.queued_updates());
        } else {
            return Err(RequestDependencyUpdateError::CouldNotUpdate);
        }
    }
}

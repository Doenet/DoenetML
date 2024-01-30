use crate::{components::prelude::*, dependency::DependencySource, ExtendSource};

use super::util::create_data_query_if_match_extend_source;

/// A string state variable interface that concatenates all string dependencies.
///
/// If the component has an extend source so that this variable is shadowing another variable,
/// then prepend the shadowed state variable to the list of dependencies.
///
/// If the state variable has a single dependency that is an essential state variable,
/// then propagate the `came_from_default` attribute of the essential state variable.
#[derive(Debug, Default)]
pub struct StringStateVar {
    /// The base data query that indicates how the dependencies of this state variable will be created.
    base_data_query: DataQuery,

    /// The base data query, potentially augmented by a data query
    /// for shadowing another variable
    data_queries: StringStateVarDataQueries,

    /// The values of the dependencies created from the data queries
    data: RequiredData,

    /// If true, there is just a single dependency that is an essential state variable.
    /// In this case, we'll propagate the `came_from_default` attribute of the essential state variable.
    from_single_essential: bool,
}

/// The data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies)]
struct RequiredData {
    /// A vector of the string values of the dependencies
    #[consume_remaining_data_queries]
    strings: Vec<StateVarView<String>>,
}

/// The data queries that indicate how the dependencies of this state variable will be created.
/// They consist of the base data query specified, potentially augmented by a data query
/// for shadowing another variable
#[derive(Debug, Default, StateVariableDataQueries)]
struct StringStateVarDataQueries {
    /// If present, `extending` contains a data query requesting the value of another text variable.
    /// It was created from the extend source for this component.
    extending: Option<DataQuery>,

    /// The base data query specified for this variable.
    ///
    /// (It is always present. It is an option only to satisfy the API for
    /// the `StateVariableDataQueries` derive macro.)
    other: Option<DataQuery>,
}

impl StringStateVar {
    /// Creates a state var that queries its value from the given data query.
    pub fn new(base_data_query: DataQuery) -> Self {
        StringStateVar {
            base_data_query,
            ..Default::default()
        }
    }

    /// Creates a state var that queries its value from children matching the `Text` profile.
    pub fn new_from_children() -> Self {
        StringStateVar {
            base_data_query: DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text],
                exclude_if_prefer_profiles: vec![],
            },
            ..Default::default()
        }
    }

    /// Creates a state var that queries its value from attributes matching the `Text` profile.
    pub fn new_from_attribute(attr_name: AttributeName) -> Self {
        StringStateVar {
            base_data_query: DataQuery::AttributeChild {
                attribute_name: attr_name,
                match_profiles: vec![ComponentProfile::Text],
            },
            ..Default::default()
        }
    }
}

impl From<StringStateVar> for StateVar<String> {
    fn from(updater: StringStateVar) -> Self {
        StateVar::new(Box::new(updater), Default::default())
    }
}

impl StateVarUpdater<String> for StringStateVar {
    fn return_data_queries(
        &mut self,
        extending: Option<ExtendSource>,
        state_var_idx: StateVarIdx,
    ) -> Vec<DataQuery> {
        self.data_queries = StringStateVarDataQueries {
            extending: create_data_query_if_match_extend_source(extending, state_var_idx),
            other: Some(self.base_data_query.clone()),
        };

        (&self.data_queries).into()
    }

    fn save_data(&mut self, dependencies: &Vec<DependenciesCreatedForDataQuery>) {
        self.data = dependencies.try_into().unwrap();

        if self.data.strings.len() == 1 {
            match dependencies[0][0].source {
                DependencySource::Essential { .. } => {
                    self.from_single_essential = true;
                }
                _ => {}
            }
        }
    }

    fn calculate(&self) -> StateVarCalcResult<String> {
        if self.from_single_essential {
            if self.data.strings[0].came_from_default() {
                // if we are basing it on a single essential variable that came from default,
                // then we propagate came_from_default as well as the value.
                return StateVarCalcResult::FromDefault(self.data.strings[0].get().clone());
            } else {
                return StateVarCalcResult::Calculated(self.data.strings[0].get().clone());
            }
        } else {
            // TODO: can we implement this without cloning the inner value?
            let value: String = self.data.strings.iter().map(|v| v.get().clone()).collect();

            StateVarCalcResult::Calculated(value)
        }
    }

    fn invert(
        &mut self,
        state_var: &StateVarView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        if self.data.strings.len() != 1 {
            // TODO: implement for no dependencies where saves to essential value?
            Err(RequestDependencyUpdateError::CouldNotUpdate)
        } else {
            let requested_value = state_var.get_requested_value();

            self.data.strings[0].queue_update(requested_value.clone());

            Ok(self.data.return_queued_updates())
        }
    }
}

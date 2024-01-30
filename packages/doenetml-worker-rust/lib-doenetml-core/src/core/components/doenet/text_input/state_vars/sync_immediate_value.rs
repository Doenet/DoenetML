use crate::components::prelude::*;

/// A struct of all data required to compute the value of this state variable.
#[add_dependency_data]
#[derive(Debug, Default, StateVariableDependencies, StateVariableDataQueries)]
struct RequiredData {
    essential: StateVarView<bool>,
}

#[derive(Debug, Default)]
pub struct SyncImmediateValueStateVar {
    /// The data queries that indicate how the dependencies of this state variable will be created.
    data_queries: RequiredDataDataQueries,

    /// The values of the dependencies created from the data queries
    data: RequiredData,
}

impl SyncImmediateValueStateVar {
    pub fn new() -> Self {
        SyncImmediateValueStateVar {
            ..Default::default()
        }
    }
}

impl From<SyncImmediateValueStateVar> for StateVar<bool> {
    fn from(updater: SyncImmediateValueStateVar) -> Self {
        StateVar::new(Box::new(updater), true)
    }
}

impl StateVarUpdater<bool> for SyncImmediateValueStateVar {
    fn return_data_queries(
        &mut self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<DataQuery> {
        self.data_queries = RequiredDataDataQueries {
            essential: Some(DataQuery::Essential),
        };

        (&self.data_queries).into()
    }

    fn save_data(&mut self, dependencies: &Vec<DependenciesCreatedForDataQuery>) {
        self.data = dependencies.try_into().unwrap();
    }

    fn calculate(&self) -> StateVarCalcResult<bool> {
        StateVarCalcResult::Calculated(*self.data.essential.get())
    }

    fn invert(
        &mut self,
        state_var: &StateVarView<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let requested_value = state_var.get_requested_value();

        self.data.essential.queue_update(*requested_value);

        Ok(self.data.return_queued_updates())
    }
}

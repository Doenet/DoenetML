use super::*;
use setup_functions::*;

/// check that a boolean-to_string state variable
/// gives the correct data query that requests original value
#[test]
fn boolean_to_string_state_var_gives_correct_data_queries() {
    let mut state_var: StateVar<String> = BooleanToStringStateVar::new(3).into_state_var();
    let queries = state_var.return_data_queries();
    assert_eq!(
        queries,
        vec![DataQuery::StateVar {
            component_idx: None,
            state_var_idx: 3
        },]
    );
}

#[test]
fn boolean_to_string_state_var_calculated_() {
    let (state_var, _state_var_view, boolean_var) = set_up_boolean_to_string_state_var(false, true);

    // we initialize original value to be false, so should get "false"
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "false");
    assert_eq!(state_var.came_from_default(), false);

    // changing original value to be true, results in state variable being "true"
    boolean_var.set_value(true);
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "true");
    assert_eq!(state_var.came_from_default(), false);
}

#[test]
fn invert_boolean_to_string_state_var() {
    let (mut state_var, mut state_var_view, boolean_var) =
        set_up_boolean_to_string_state_var(true, false);

    // on the state variable view, record that we request the value be "true"
    state_var_view.queue_update("true".into());
    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );

    // the original variable has recorded that it has been requested to be true
    assert_eq!(*boolean_var.get_requested_value(), true);

    // on the state variable view, record that we request the value be "false"
    state_var_view.queue_update("false".into());
    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );

    // the original variable has recorded that it has been requested to be false
    assert_eq!(*boolean_var.get_requested_value(), false);
}

#[test]
fn inverting_boolean_to_string_is_case_insensitive() {
    let (mut state_var, mut state_var_view, boolean_var) =
        set_up_boolean_to_string_state_var(true, false);

    // on the state variable view, record that we request the value be "TrUE"
    state_var_view.queue_update("TrUE".into());
    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );

    // the original variable has recorded that it has been requested to be true
    assert_eq!(*boolean_var.get_requested_value(), true);

    // on the state variable view, record that we request the value be "FalSe"
    state_var_view.queue_update("FalSe".into());
    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );

    // the original variable has recorded that it has been requested to be false
    assert_eq!(*boolean_var.get_requested_value(), false);
}

mod setup_functions {

    use crate::utils::test_utils::create_state_var_dependency;

    use super::*;

    /// Utility function to set up a boolean-to-string state variable and its original dependency
    pub fn set_up_boolean_to_string_state_var(
        initial_value: bool,
        came_from_default: bool,
    ) -> (
        StateVar<String>,
        StateVarView<String>,
        StateVarMutableView<bool>,
    ) {
        let mut state_var: StateVar<String> = BooleanToStringStateVar::new(0).into_state_var();
        let state_var_view = state_var.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        state_var.return_data_queries();

        let (original_dependency, boolean_var) =
            create_state_var_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries =
            vec![DependenciesCreatedForDataQuery(vec![original_dependency])];

        state_var.save_dependencies(&dependencies_created_for_data_queries);

        (state_var, state_var_view, boolean_var)
    }
}

use crate::utils::test_utils::create_state_var_dependency;

use super::*;
use setup_functions::*;

/// check that a state variable alias
/// gives the correct data query that requests original value
#[test]
fn state_var_alias_gives_correct_data_queries() {
    // boolean
    let mut state_var: StateVar<bool> = StateVarAlias::new(3).into_state_var();
    let queries = state_var.return_data_queries();
    assert_eq!(
        queries,
        vec![DataQuery::StateVar {
            component_idx: None,
            state_var_idx: 3
        },]
    );

    // String
    let mut state_var: StateVar<String> = StateVarAlias::new(4).into_state_var();
    let queries = state_var.return_data_queries();
    assert_eq!(
        queries,
        vec![DataQuery::StateVar {
            component_idx: None,
            state_var_idx: 4
        },]
    );
}

/// For a boolean state variable alias,
/// its value should be the same as the original value,
/// and its came_from_default should be the same as the original value's came_from_default
#[test]
fn calculate_boolean_state_var_alias() {
    let (state_var, _state_var_view, alias_var) = set_up_boolean_state_var_alias(false, true);

    // we initialize original value to be false, so should get false
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
    assert_eq!(state_var.came_from_default(), true);

    // changing original value to be true, results in state variable being true
    alias_var.set_value(true);
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);
}

/// Calling invert on a boolean state variable alias
/// causes the original value to receive that requested value
#[test]
fn invert_boolean_state_var_alias() {
    let (mut state_var, mut state_var_view, alias_var) =
        set_up_boolean_state_var_alias(true, false);

    // on the state variable view, record that we request the value be false
    state_var_view.queue_update(false);

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
    assert_eq!(*alias_var.get_requested_value(), false);
}

/// For a string state variable alias,
/// its value should be the same as its original value,
/// and its came_from_default should be the same as the original value's came_from_default
#[test]
fn calculate_string_state_var_alias() {
    let (state_var, _state_var_view, alias_var) =
        set_up_string_state_var_alias(String::from("hello"), true);

    // we initialize original value to be true, so should get true
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "hello");
    assert_eq!(state_var.came_from_default(), true);

    // changing original value to be false, results in state variable being false
    alias_var.set_value(String::from("bye"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "bye");
    assert_eq!(state_var.came_from_default(), false);
}

/// Calling invert on a string state variable alias
/// causes the original value to receive that requested value
#[test]
fn invert_string_state_var_alias() {
    let (mut state_var, mut state_var_view, alias_var) =
        set_up_string_state_var_alias(String::from("hello"), false);

    // on the state variable view, record that we request the value be "bye"
    state_var_view.queue_update(String::from("bye"));

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
    assert_eq!(*alias_var.get_requested_value(), "bye");
}

mod setup_functions {

    use super::*;

    /// Utility function to set up a boolean state variable alias and its original dependency
    pub fn set_up_boolean_state_var_alias(
        initial_value: bool,
        came_from_default: bool,
    ) -> (
        StateVar<bool>,
        StateVarView<bool>,
        StateVarMutableView<bool>,
    ) {
        let mut state_var: StateVar<bool> = StateVarAlias::new(0).into_state_var();
        let state_var_view = state_var.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        state_var.return_data_queries();

        let (original_dependency, alias_var) =
            create_state_var_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries =
            vec![DependenciesCreatedForDataQuery(vec![original_dependency])];

        state_var.save_dependencies(&dependencies_created_for_data_queries);

        (state_var, state_var_view, alias_var)
    }

    /// Utility function to set up a string state variable alias and its original dependency
    pub fn set_up_string_state_var_alias(
        initial_value: String,
        came_from_default: bool,
    ) -> (
        StateVar<String>,
        StateVarView<String>,
        StateVarMutableView<String>,
    ) {
        let mut state_var: StateVar<String> = StateVarAlias::new(0).into_state_var();
        let state_var_view = state_var.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        state_var.return_data_queries();

        let (original_dependency, alias_var) =
            create_state_var_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries =
            vec![DependenciesCreatedForDataQuery(vec![original_dependency])];

        state_var.save_dependencies(&dependencies_created_for_data_queries);

        (state_var, state_var_view, alias_var)
    }
}

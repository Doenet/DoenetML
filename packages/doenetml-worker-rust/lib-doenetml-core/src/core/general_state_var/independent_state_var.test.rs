use crate::utils::test_utils::create_state_var_dependency;

use super::*;
use setup_functions::*;

/// check that an independent state variable
/// gives the correct data query that requests preliminary value
#[test]
fn independent_state_var_gives_correct_data_queries() {
    // boolean
    let mut state_var: StateVar<bool> = IndependentStateVar::new(false).into_state_var();
    let queries = state_var.return_data_queries();
    assert_eq!(queries, vec![DataQuery::PreliminaryValue,]);

    // String
    let mut state_var: StateVar<String> =
        IndependentStateVar::new(String::from("")).into_state_var();
    let queries = state_var.return_data_queries();
    assert_eq!(queries, vec![DataQuery::PreliminaryValue,]);
}

/// For an independent boolean state variable,
/// its value should be the same as its preliminary value,
/// and its came_from_default should be the same as the preliminary value's came_from_default
#[test]
fn independent_boolean_state_var_calculated_() {
    let (state_var, _state_var_view, preliminary_value_var) =
        set_up_boolean_independent_state_var(false, true);

    // we initialize preliminary value to be false, so should get false
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
    assert_eq!(state_var.came_from_default(), true);

    // changing preliminary value to be true, results in state variable being true
    preliminary_value_var.set_value(true);
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);
}

/// Calling invert on a boolean independent state variable
/// causes the preliminary value to receive that requested value
#[test]
fn invert_independent_boolean_state_var() {
    let (mut state_var, mut state_var_view, preliminary_value_var) =
        set_up_boolean_independent_state_var(true, false);

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

    // the preliminary value variable has recorded that it has been requested to be false
    assert_eq!(*preliminary_value_var.get_requested_value(), false);
}

/// For an independent string state variable,
/// its value should be the same as its preliminary value
/// and its came_from_default should be the same as the preliminary value's came_from_default
#[test]
fn independent_string_state_var_calculated_() {
    let (state_var, _state_var_view, preliminary_value_var) =
        set_up_string_independent_state_var(String::from("hello"), true);

    // we initialize preliminary value to be true, so should get true
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "hello");
    assert_eq!(state_var.came_from_default(), true);

    // changing preliminary value to be false, results in state variable being false
    preliminary_value_var.set_value(String::from("bye"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "bye");
    assert_eq!(state_var.came_from_default(), false);
}

/// Calling invert on a string independent state variable
/// causes the preliminary value to receive that requested value
#[test]
fn invert_independent_string_state_var() {
    let (mut state_var, mut state_var_view, preliminary_value_var) =
        set_up_string_independent_state_var(String::from("hello"), false);

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

    // the preliminary value variable has recorded that it has been requested to be false
    assert_eq!(*preliminary_value_var.get_requested_value(), "bye");
}

mod setup_functions {

    use super::*;

    /// Utility function to set up independent boolean state variable and its preliminary value dependency
    pub fn set_up_boolean_independent_state_var(
        initial_value: bool,
        came_from_default: bool,
    ) -> (
        StateVar<bool>,
        StateVarView<bool>,
        StateVarMutableView<bool>,
    ) {
        let mut state_var: StateVar<bool> =
            IndependentStateVar::new(initial_value).into_state_var();
        let state_var_view = state_var.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        state_var.return_data_queries();

        // Note: the default_value specified in the creation of state_var above
        // isn't used at this level of testing, so we supply it directly here to match
        let (preliminary_value_dependency, preliminary_value_var) =
            create_state_var_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries = vec![DependenciesCreatedForDataQuery(vec![
            preliminary_value_dependency,
        ])];

        state_var.save_dependencies(&dependencies_created_for_data_queries);

        (state_var, state_var_view, preliminary_value_var)
    }

    /// Utility function to set up independent string state variable and its preliminary value dependency
    pub fn set_up_string_independent_state_var(
        initial_value: String,
        came_from_default: bool,
    ) -> (
        StateVar<String>,
        StateVarView<String>,
        StateVarMutableView<String>,
    ) {
        let mut state_var: StateVar<String> =
            IndependentStateVar::new(initial_value.clone()).into_state_var();
        let state_var_view = state_var.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        state_var.return_data_queries();

        // Note: the default_value specified in the creation of state_var above
        // isn't used at this level of testing, so we supply it directly here to match
        let (preliminary_value_dependency, preliminary_value_var) =
            create_state_var_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries = vec![DependenciesCreatedForDataQuery(vec![
            preliminary_value_dependency,
        ])];

        state_var.save_dependencies(&dependencies_created_for_data_queries);

        (state_var, state_var_view, preliminary_value_var)
    }
}

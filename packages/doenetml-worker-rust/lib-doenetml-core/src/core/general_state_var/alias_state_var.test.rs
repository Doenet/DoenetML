use crate::utils::test_utils::create_state_var_dependency;

use super::*;

/// Utility function to set up mirror boolean state variable and its mirrored dependency
fn set_up_boolean_mirror_state_var(
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

    let (mirrored_dependency, mirrored_var) =
        create_state_var_dependency(initial_value, came_from_default);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![mirrored_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    (state_var, state_var_view, mirrored_var)
}

/// Utility function to set up mirror string state variable and its mirrored dependency
fn set_up_string_mirror_state_var(
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

    let (mirrored_dependency, mirrored_var) =
        create_state_var_dependency(initial_value, came_from_default);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![mirrored_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    (state_var, state_var_view, mirrored_var)
}

/// check that an mirror state variable
/// gives the correct data query that requests mirrored value
#[test]
fn mirror_state_var_gives_correct_data_queries() {
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

/// For an mirror boolean state variable,
/// its value should be the same as its mirrored value
#[test]
fn mirror_boolean_state_var_calculated_() {
    let (state_var, _state_var_view, mirrored_var) = set_up_boolean_mirror_state_var(true, false);

    // we initialize mirrored value to be true, so should get true
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);

    // changing mirrored value to be false, results in state variable being false
    mirrored_var.set_value(false);
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
}

/// For an mirror boolean state variable,
/// its came_from_default should be the same as the mirrored value's came_from_default
#[test]
fn mirror_boolean_state_var_passes_through_came_from_default() {
    let (state_var, _state_var_view, mirrored_var) = set_up_boolean_mirror_state_var(false, true);

    // we initialized with default value, so we should start with came_from_default being true
    state_var.calculate_and_mark_fresh();
    assert_eq!(state_var.came_from_default(), true);

    // setting the mirrored value sets came_from_default to false
    mirrored_var.set_value(true);
    state_var.calculate_and_mark_fresh();
    assert_eq!(state_var.came_from_default(), false);
}

/// Calling invert on a boolean mirror state variable
/// causes the mirrored value to receive that requested value
#[test]
fn invert_mirror_boolean_state_var() {
    let (mut state_var, mut state_var_view, mirrored_var) =
        set_up_boolean_mirror_state_var(true, false);

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

    // the mirrored variable has recorded that it has been requested to be false
    assert_eq!(*mirrored_var.get_requested_value(), false);
}

/// For an mirror string state variable,
/// its value should be the same as its mirrored value
#[test]
fn mirror_string_state_var_calculated_() {
    let (state_var, _state_var_view, mirrored_var) =
        set_up_string_mirror_state_var(String::from("hello"), false);

    // we initialize mirrored value to be true, so should get true
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "hello");

    // changing mirrored value to be false, results in state variable being false
    mirrored_var.set_value(String::from("bye"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "bye");
}

/// For an mirror string state variable,
/// its came_from_default should be the same as the mirrored value's came_from_default
#[test]
fn mirror_string_state_var_passes_through_came_from_default() {
    let (state_var, _state_var_view, mirrored_var) =
        set_up_string_mirror_state_var(String::from(""), true);

    // we initialized with default value, so we should start with came_from_default being true
    state_var.calculate_and_mark_fresh();
    assert_eq!(state_var.came_from_default(), true);

    // setting the mirrored value sets came_from_default to false
    mirrored_var.set_value(String::from("hi"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(state_var.came_from_default(), false);
}

/// Calling invert on a string mirror state variable
/// causes the mirrored value to receive that requested value
#[test]
fn invert_mirror_string_state_var() {
    let (mut state_var, mut state_var_view, mirrored_var) =
        set_up_string_mirror_state_var(String::from("hello"), false);

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

    // the mirrored variable has recorded that it has been requested to be false
    assert_eq!(*mirrored_var.get_requested_value(), "bye");
}

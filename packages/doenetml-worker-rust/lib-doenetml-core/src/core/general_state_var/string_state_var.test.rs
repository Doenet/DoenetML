use crate::utils::test_utils::create_state_var_dependency;

use super::*;

/// Utility function to set up string state variable that depends on one string child variable
fn set_up_string_state_var_with_string_child(
    initial_value: String,
    came_from_default: bool,
) -> (
    StateVar<String>,
    StateVarView<String>,
    StateVarMutableView<String>,
) {
    let mut state_var: StateVar<String> =
        StringStateVar::new_from_children(String::from("")).into_state_var();
    let state_var_view = state_var.create_new_read_only_view();

    // need to return data queries since side effect is saving the required data
    state_var.return_data_queries();

    // fulfill data query with one child of type T
    let (child_dependency, child_var) =
        create_state_var_dependency(initial_value, came_from_default);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![child_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    (state_var, state_var_view, child_var)
}

/// Utility function to set up string state variable that depends on two string child variables
fn set_up_string_state_var_with_two_string_children(
    initial_value_1: String,
    initial_value_2: String,
    came_from_default: bool,
) -> (
    StateVar<String>,
    StateVarView<String>,
    StateVarMutableView<String>,
    StateVarMutableView<String>,
) {
    let mut state_var: StateVar<String> =
        StringStateVar::new_from_children(String::from("")).into_state_var();
    let state_var_view = state_var.create_new_read_only_view();

    // need to return data queries since side effect is saving the required data
    state_var.return_data_queries();

    // fulfill data query with two children of type T
    let (child_dependency_1, child_var_1) =
        create_state_var_dependency(initial_value_1, came_from_default);

    // fulfill data query with two children of type T
    let (child_dependency_2, child_var_2) =
        create_state_var_dependency(initial_value_2, came_from_default);

    let dependencies_created_for_data_queries = vec![DependenciesCreatedForDataQuery(vec![
        child_dependency_1,
        child_dependency_2,
    ])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    (state_var, state_var_view, child_var_1, child_var_2)
}

/// check that a string state variable created from children
/// gives the correct data query that requests text children
#[test]
fn string_state_var_from_children_gives_correct_data_queries() {
    // create a string state variable requesting children
    let mut state_var = StringStateVar::new_from_children(String::from("")).into_state_var();

    let queries = state_var.return_data_queries();

    assert_eq!(
        queries,
        vec![DataQuery::Child {
            match_profiles: vec![ComponentProfile::Text],
            exclude_if_prefer_profiles: vec![],
            always_return_value: true,
        },]
    );
}

/// If a string state variable is based on a single string child,
/// its value should be the same as the string child's value
#[test]
fn string_state_var_calculated_from_single_string_child() {
    // create a string state variable with one string child
    let (state_var, _state_var_view, child_var) =
        set_up_string_state_var_with_string_child(String::from("hello"), false);

    // we initialize child to be "hello", so should get "hello"
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "hello");

    // changing child to be "bye", results in state variable being "bye"
    child_var.set_value(String::from("bye"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "bye");
}

/// If a string state variable is based on a single string child,
/// its came_from_default should be the same as the string child's came_from_default
#[test]
fn string_state_var_from_single_string_child_passes_through_came_from_default() {
    // create a string state variable with one string child
    let (state_var, _state_var_view, child_var) =
        set_up_string_state_var_with_string_child(String::from(""), true);

    // we initialized with default value, so we should start with came_from_default being true
    state_var.calculate_and_mark_fresh();
    assert_eq!(state_var.came_from_default(), true);

    // setting the child sets came_from_default to false
    child_var.set_value(String::from("hi"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(state_var.came_from_default(), false);
}

/// Calling invert on a string state variable with a single string child
/// causes the child to receive that requested value
#[test]
fn invert_string_state_var_from_single_string_child() {
    // create a string state variable with one string child
    let (mut state_var, mut state_var_view, child_var) =
        set_up_string_state_var_with_string_child(String::from("hello"), false);

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

    // the child variable has recorded that it has been requested to be "bye"
    assert_eq!(*child_var.get_requested_value(), "bye");
}

/// If a string state variable is based on a two string children,
/// its value should is based on concatenating those strings
#[test]
fn string_state_var_calculated_from_two_string_children() {
    // create a string state variable with two string children
    let (state_var, _state_var_view, child_var_1, child_var_2) =
        set_up_string_state_var_with_two_string_children(
            String::from("Hello"),
            String::from(" World"),
            false,
        );

    // the initial value of "Hello World"
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "Hello World");

    // change to "Bye Earth"
    child_var_1.set_value(String::from("Bye"));
    child_var_2.set_value(String::from(" Earth"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), "Bye Earth");
}

/// Cannot invert a string state variable with a two string children
#[test]
fn cannot_invert_string_state_var_from_two_string_children() {
    // create a string state variable with two string children
    let (mut state_var, mut state_var_view, _child_var_1, _child_var_2) =
        set_up_string_state_var_with_two_string_children(
            String::from("Hello"),
            String::from(" World"),
            false,
        );

    // on the state variable view, record that we request the value be false
    state_var_view.queue_update(String::from("Bye Earth"));

    let invert_result = state_var.invert(false);

    assert!(invert_result.is_err());
}

/// check that a string state variable created from an attribute
/// gives the correct data query that requests text children from that attribute
#[test]
fn string_state_var_from_attribute_gives_correct_data_queries() {
    // create a string state variable from attribute
    let mut state_var =
        StringStateVar::new_from_attribute("my_attr", String::from("")).into_state_var();

    let queries = state_var.return_data_queries();

    assert_eq!(
        queries,
        vec![DataQuery::AttributeChild {
            attribute_name: "my_attr",
            match_profiles: vec![ComponentProfile::Text],
            always_return_value: true
        },]
    );
}

use crate::utils::test_utils::create_state_var_dependency;

use super::*;

/// Testing the case of an independent boolean state variable,
/// i.e., a state variable that doesn't depend on others.
#[test]
fn independent_boolean() {
    // create an independent boolean state variable with initial value of false
    let mut state_var: StateVar<bool> = IndependentStateVar::new(false).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries();

    // should return a query just for a preliminary value
    assert_eq!(queries, vec![DataQuery::PreliminaryValue,]);

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with one boolean variable
    ////////////////////////////////////////////////////////////////

    // Note: the default_value specified in the creation of state_var above
    // isn't used at this level of testing, so we supply it directly here to match
    let (preliminary_value_dependency, preliminary_value_var) =
        create_state_var_dependency(false, true);

    let dependencies_created_for_data_queries = vec![DependenciesCreatedForDataQuery(vec![
        preliminary_value_dependency,
    ])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    ////////////////////////////////////////////////////////////////
    // Step 3: check if get the correct calculated value
    ////////////////////////////////////////////////////////////////
    state_var.calculate_and_mark_fresh();

    // we expect a value of false and came_from_default to be true,
    // given how we created the preliminary value
    assert_eq!(*state_var.get(), false);
    assert_eq!(state_var.came_from_default(), true);

    ////////////////////////////////////////////////////////////////
    // Step 4: invert to make the value true
    ////////////////////////////////////////////////////////////////

    // on the state variable view, record that we request the value be true
    state_var_view.queue_update(true);

    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );
    // the child variable has recorded that it has been requested to be true
    assert_eq!(*preliminary_value_var.get_requested_value(), true);

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value true
    ////////////////////////////////////////////////////////////////

    preliminary_value_var.set_value(true);

    state_var.calculate_and_mark_fresh();

    // now the value should be true
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);
}

/// Testing the case of an independent string state variable,
/// i.e., a state variable that doesn't depend on others.
#[test]
fn mirror_string() {
    // create an independent string state variable with initial value of ""
    let mut state_var: StateVar<String> =
        IndependentStateVar::new(String::from("")).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries();

    // should return a query just for a preliminary value
    assert_eq!(queries, vec![DataQuery::PreliminaryValue,]);

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with one string variable
    ////////////////////////////////////////////////////////////////

    // Note: the default_value specified in the creation of state_var above
    // isn't used at this level of testing, so we supply it directly here to match
    let (preliminary_value_dependency, preliminary_value_var) =
        create_state_var_dependency(String::from(""), true);

    let dependencies_created_for_data_queries = vec![DependenciesCreatedForDataQuery(vec![
        preliminary_value_dependency,
    ])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    ////////////////////////////////////////////////////////////////
    // Step 3: check if get the correct calculated value
    ////////////////////////////////////////////////////////////////
    state_var.calculate_and_mark_fresh();

    // we expect a value of "" and came_from_default to be true,
    // mirroring the dependency
    assert_eq!(state_var.get().clone(), "");
    assert_eq!(state_var.came_from_default(), true);

    ////////////////////////////////////////////////////////////////
    // Step 4: invert to make the value "hello"
    ////////////////////////////////////////////////////////////////

    // on the state variable view, record that we request the value be "hello"
    state_var_view.queue_update(String::from("hello"));

    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );
    // the child variable has recorded that it has been requested to be "hello"
    assert_eq!(preliminary_value_var.get_requested_value().clone(), "hello");

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value true
    ////////////////////////////////////////////////////////////////

    preliminary_value_var.set_value(String::from("hello"));

    state_var.calculate_and_mark_fresh();

    // now the value should be "hello"
    assert_eq!(state_var.get().clone(), "hello");
    assert_eq!(state_var.came_from_default(), false);
}

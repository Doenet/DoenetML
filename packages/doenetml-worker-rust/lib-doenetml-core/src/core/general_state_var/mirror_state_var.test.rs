use crate::{general_state_var::MirrorStateVar, utils::test_utils::create_state_var_dependency};

// use self::state::{essential_state::EssentialDataOrigin, StateVarMutableView};

use super::*;

/// Testing the case of boolean state variable mirroring another variable.
/// For example, the `<boolean>`` state variable `boolean`
/// mirrors the state variable `value`.
#[test]
fn mirror_boolean() {
    // create a boolean state variable mirroring another variable
    let mut state_var: StateVar<bool> = MirrorStateVar::new(0).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries();

    // should return a query for text or boolean children and an essential state variable
    assert_eq!(
        queries,
        vec![DataQuery::StateVar {
            component_idx: None,
            state_var_idx: 0
        },]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with one boolean variable
    ////////////////////////////////////////////////////////////////
    let (mirrored_dependency, mirrored_var) = create_state_var_dependency(false, true);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![mirrored_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    ////////////////////////////////////////////////////////////////
    // Step 3: check if get the correct calculated value
    ////////////////////////////////////////////////////////////////
    state_var.calculate_and_mark_fresh();

    // we expect a value of false and came_from_default to be true,
    // mirroring the dependency
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
    assert_eq!(*mirrored_var.get_requested_value(), true);

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value true
    ////////////////////////////////////////////////////////////////

    mirrored_var.set_value(true);

    state_var.calculate_and_mark_fresh();

    // now the value should be true
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);
}

/// Testing the case of string state variable mirroring another variable.
/// For example, the `<text>`` state variable `text`
/// mirrors the state variable `value`.
#[test]
fn mirror_string() {
    // create a string state variable mirroring another variable
    let mut state_var: StateVar<String> = MirrorStateVar::new(0).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries();

    // should return a query for text or boolean children and an essential state variable
    assert_eq!(
        queries,
        vec![DataQuery::StateVar {
            component_idx: None,
            state_var_idx: 0
        },]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with one string variable
    ////////////////////////////////////////////////////////////////
    let (mirrored_dependency, mirrored_var) = create_state_var_dependency(String::from(""), true);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![mirrored_dependency])];

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
    assert_eq!(mirrored_var.get_requested_value().clone(), "hello");

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value true
    ////////////////////////////////////////////////////////////////

    mirrored_var.set_value(String::from("hello"));

    state_var.calculate_and_mark_fresh();

    // now the value should be "hello"
    assert_eq!(state_var.get().clone(), "hello");
    assert_eq!(state_var.came_from_default(), false);
}

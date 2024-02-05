use crate::utils::test_utils::create_state_var_dependency;

use super::*;

/// Testing the case of boolean state variable requesting children
/// and receiving a single boolean child dependency.
/// For example, if we have a `<boolean><boolean>true</boolean></boolean>`,
/// the `value` state variable of the outer <boolean> would follow this pattern.
#[test]
fn boolean_state_var_with_boolean_child() {
    // create a boolean state variable requesting children
    let mut state_var = BooleanStateVar::new_from_children(false).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries();

    // should return a query for text or boolean children
    assert_eq!(
        queries,
        vec![DataQuery::Child {
            match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
            exclude_if_prefer_profiles: vec![],
            always_return_value: true,
        },]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with one boolean child
    ////////////////////////////////////////////////////////////////
    let (child_dependency, child_var) = create_state_var_dependency(true, false);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![child_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    ////////////////////////////////////////////////////////////////
    // Step 3: check if get the correct calculated value
    ////////////////////////////////////////////////////////////////
    state_var.calculate_and_mark_fresh();

    // we expect a value of true and came_from_default to be false,
    // since that the variable is coming from the child dependency, which we initialized to true.
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);

    ////////////////////////////////////////////////////////////////
    // Step 4: invert to make the value false
    ////////////////////////////////////////////////////////////////

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
    // the child variable has recorded that it has been requested to be false
    assert_eq!(*child_var.get_requested_value(), false);

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value false
    ////////////////////////////////////////////////////////////////

    child_var.set_value(false);

    state_var.calculate_and_mark_fresh();

    // now the value should be false
    assert_eq!(*state_var.get(), false);
}

/// Testing the case of boolean state variable requesting children
/// and receiving a single string child dependency.
/// For example, if we have a `<boolean>true</boolean>`,
/// its `value` state variable would follow this pattern.
#[test]
fn boolean_state_var_with_string_child() {
    // create a boolean state variable requesting children
    let mut state_var = BooleanStateVar::new_from_children(false).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries();

    // should return a query for text or boolean children
    assert_eq!(
        queries,
        vec![DataQuery::Child {
            match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
            exclude_if_prefer_profiles: vec![],
            always_return_value: true,
        },]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with one string child
    ////////////////////////////////////////////////////////////////
    let (child_dependency, child_var) = create_state_var_dependency(String::from("true"), false);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![child_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    ////////////////////////////////////////////////////////////////
    // Step 3: check if get the correct calculated value
    ////////////////////////////////////////////////////////////////
    state_var.calculate_and_mark_fresh();

    // we expect a value of true and came_from_default to be false,
    // since that the variable is coming from the child dependency, which we initialized to true.
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);

    ////////////////////////////////////////////////////////////////
    // Step 4: invert to make the value false
    ////////////////////////////////////////////////////////////////

    // on the state variable view, record that we request the value be false
    state_var_view.queue_update(false);

    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the child variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            // data_query_idx is 0 because child is the first data query
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );
    // the child variable has recorded that it has been requested to be false
    assert_eq!(child_var.get_requested_value().to_string(), "false");

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value false
    ////////////////////////////////////////////////////////////////

    child_var.set_value(String::from("false"));

    state_var.calculate_and_mark_fresh();

    // now the value should be false
    assert_eq!(*state_var.get(), false);
}

/// Testing the case of boolean state variable requesting children
/// and receiving a single string child dependency that is an empty string.
/// For example, if we have a `<boolean><text></text></boolean>`,
/// its `value` state variable would follow this pattern.
#[test]
fn empty_child_string_is_false() {
    let mut state_var = BooleanStateVar::new_from_children(false).into_state_var();

    // need to return data queries since side effect is saving the required data
    state_var.return_data_queries();

    let (child_dependency, _child_var) = create_state_var_dependency(String::from(""), false);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![child_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    state_var.calculate_and_mark_fresh();

    assert_eq!(*state_var.get(), false);
}

/// Testing the case of boolean state variable is case insensitive when has string children.
#[test]
fn case_insensitive() {
    let mut state_var = BooleanStateVar::new_from_children(false).into_state_var();

    // need to return data queries since side effect is saving the required data
    state_var.return_data_queries();

    let (child_dependency, child_var) = create_state_var_dependency(String::from("TruE"), false);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![child_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);

    // both "t" and "T" are false
    child_var.set_value(String::from("T"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);

    child_var.set_value(String::from("t"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
}

/// Testing the case of boolean state variable requesting children
/// and receiving two string child dependencies.
/// For example, if we have a `<boolean>Tr<text>Ue</text></boolean>`,
/// the boolean's `value` state variable would follow this pattern.
#[test]
fn boolean_state_var_with_two_string_children() {
    // create a boolean state variable requesting children
    let mut state_var = BooleanStateVar::new_from_children(false).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    // need to return data queries since side effect is saving the required data
    state_var.return_data_queries();

    let (child1_dependency, child1_var) = create_state_var_dependency(String::from("Tr"), false);
    let (child2_dependency, child2_var) = create_state_var_dependency(String::from("Ue"), false);

    let dependencies_created_for_data_queries = vec![DependenciesCreatedForDataQuery(vec![
        child1_dependency,
        child2_dependency,
    ])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    // correctly get true
    state_var.calculate_and_mark_fresh();

    // we expect a value of true and came_from_default to be false,
    // since that the variable is coming from the child dependency, which we initialized to true.
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);

    // cannot invert, since have two children

    // on the state variable view, record that we request the value be false
    state_var_view.queue_update(false);

    let invert_result = state_var.invert(false);

    assert!(invert_result.is_err());

    // can still change by altering the children directly
    child1_var.set_value(String::from("ue"));
    child2_var.set_value(String::from("tr"));

    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);

    // try another combination that spells out "true"
    child1_var.set_value(String::from("tru"));
    child2_var.set_value(String::from("e"));

    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);
}

/// Testing the case of boolean state variable based on an attribute
/// For example, if we have a `<textInput disabled/>`
/// its `disabled` state variable would follow this pattern.
#[test]
fn boolean_state_var_with_attribute() {
    let mut state_var = BooleanStateVar::new_from_attribute("my_attr", true).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries();

    // should return a query for "my_attr" with text or boolean children
    assert_eq!(
        queries,
        vec![DataQuery::AttributeChild {
            attribute_name: "my_attr",
            match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
            always_return_value: true
        },]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with one string child
    ////////////////////////////////////////////////////////////////
    let (child_dependency, child_var) = create_state_var_dependency(String::from("tRue"), false);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![child_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    ////////////////////////////////////////////////////////////////
    // Step 3: check if get the correct calculated value
    ////////////////////////////////////////////////////////////////
    state_var.calculate_and_mark_fresh();

    // we expect a value of true and came_from_default to be false,
    // since that the variable is coming from the child dependency, which we initialized to true.
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);

    ////////////////////////////////////////////////////////////////
    // Step 4: invert to make the value false
    ////////////////////////////////////////////////////////////////

    // on the state variable view, record that we request the value be false
    state_var_view.queue_update(false);

    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the child variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            // data_query_idx is 0 because child is the first data query
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );
    // the child variable has recorded that it has been requested to be false
    assert_eq!(child_var.get_requested_value().to_string(), "false");

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value false
    ////////////////////////////////////////////////////////////////

    child_var.set_value(String::from("false"));

    state_var.calculate_and_mark_fresh();

    // now the value should be false
    assert_eq!(*state_var.get(), false);

    ////////////////////////////////////////////////////////////////
    // Step 6: change the text child to make it true
    ////////////////////////////////////////////////////////////////

    child_var.set_value(String::from("TruE"));

    state_var.calculate_and_mark_fresh();

    // now the value should be true
    assert_eq!(*state_var.get(), true);

    ////////////////////////////////////////////////////////////////
    // Step 7: an empty string is true, as is an attribute
    ////////////////////////////////////////////////////////////////

    child_var.set_value(String::from(""));

    state_var.calculate_and_mark_fresh();

    // now the value should be true
    assert_eq!(*state_var.get(), true);

    ////////////////////////////////////////////////////////////////
    // Step 8: change the text child to make it false
    ////////////////////////////////////////////////////////////////

    child_var.set_value(String::from("T"));

    state_var.calculate_and_mark_fresh();

    // now the value should be false
    assert_eq!(*state_var.get(), false);
}

/// Testing the case of boolean state variable requesting children
/// and receiving a single string child dependency that is an empty string.
/// For example, if we have a `<boolean><text></text></boolean>`,
/// its `value` state variable would follow this pattern.
#[test]
fn empty_attribute_string_is_true() {
    let mut state_var = BooleanStateVar::new_from_attribute("my_attr", false).into_state_var();

    // need to return data queries since side effect is saving the required data
    state_var.return_data_queries();

    let (child_dependency, _child_var) = create_state_var_dependency(String::from(""), false);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![child_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    state_var.calculate_and_mark_fresh();

    assert_eq!(*state_var.get(), true);
}

/// If the variable is based on a single variable using its default value,
/// the variable should also be designated as coming from default.
/// For example, if we have a `<boolean></boolean>`,
/// its `value` state variable should be the default
#[test]
fn propagate_came_from_default() {
    // create a string state variable requesting children
    let mut state_var = BooleanStateVar::new_from_children(false).into_state_var();

    // need to return data queries since side effect is saving the required data
    state_var.return_data_queries();

    let (child_dependency, _child_var) = create_state_var_dependency(false, true);

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![child_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    state_var.calculate_and_mark_fresh();

    // we expect a value of "hello" and came_from_default to be false,
    // since that the variable is coming from the child dependency, which we initialized to "hello".
    assert_eq!(*state_var.get(), false);
    assert_eq!(state_var.came_from_default(), true);
}

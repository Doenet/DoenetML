use crate::utils::test_utils::create_state_var_dependency;

use super::*;

/// Testing the case of string state variable requesting children
/// and receiving a single string child dependency.
/// For example, if we have a `<text>hello</text>`,
/// its `value` state variable would follow this pattern.
#[test]
fn string_state_var_with_string_child() {
    // create a string state variable requesting children
    let mut state_var = StringStateVar::new_from_children(String::from("")).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries();

    // should return a query for text children and an essential state variable
    assert_eq!(
        queries,
        vec![DataQuery::Child {
            match_profiles: vec![ComponentProfile::Text],
            exclude_if_prefer_profiles: vec![],
            always_return_value: true,
        },]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with one string child
    ////////////////////////////////////////////////////////////////
    let (child_dependency, child_var) = create_state_var_dependency(String::from("hello"));

    let dependencies_created_for_data_queries =
        vec![DependenciesCreatedForDataQuery(vec![child_dependency])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    ////////////////////////////////////////////////////////////////
    // Step 3: check if get the correct calculated value
    ////////////////////////////////////////////////////////////////
    state_var.calculate_and_mark_fresh();

    // we expect a value of "hello" and came_from_default to be false,
    // since that the variable is coming from the child dependency, which we initialized to "hello".
    assert_eq!(state_var.get().clone(), "hello");
    assert_eq!(state_var.came_from_default(), false);

    ////////////////////////////////////////////////////////////////
    // Step 4: invert to make the value "bye"
    ////////////////////////////////////////////////////////////////

    // on the state variable view, record that we request the value be false
    state_var_view.queue_update(String::from("bye"));

    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the essential variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            // data_query_idx is 0 because child is the first data query
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );
    // the child variable has recorded that it has been requested to be false
    assert_eq!(child_var.get_requested_value().to_string(), "bye");

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value "bye"
    ////////////////////////////////////////////////////////////////

    child_var.set_value(String::from("bye"));

    state_var.calculate_and_mark_fresh();

    // now the value should be "bye"
    assert_eq!(state_var.get().clone(), "bye");
    assert_eq!(state_var.get().clone(), "bye");
}

/// Testing the case of a string state variable requesting children
/// and receiving two string child dependencies.
/// For example, if we have a `<text>Hello <text>World</text></text>`,
/// the outer text's `value` state variable would follow this pattern.
#[test]
fn string_state_var_with_two_string_children() {
    // create a text state variable requesting children
    let mut state_var = StringStateVar::new_from_children(String::from("")).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries();

    // should return a query for text children
    assert_eq!(
        queries,
        vec![DataQuery::Child {
            match_profiles: vec![ComponentProfile::Text],
            exclude_if_prefer_profiles: vec![],
            always_return_value: true,
        },]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with two string children
    ////////////////////////////////////////////////////////////////
    let (child1_dependency, child1_var) = create_state_var_dependency(String::from("Hello "));
    let (child2_dependency, child2_var) = create_state_var_dependency(String::from("World"));

    let dependencies_created_for_data_queries = vec![DependenciesCreatedForDataQuery(vec![
        child1_dependency,
        child2_dependency,
    ])];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    ////////////////////////////////////////////////////////////////
    // Step 3: check if get the correct calculated value
    ////////////////////////////////////////////////////////////////
    state_var.calculate_and_mark_fresh();

    // we expect a value of "Hello World" and came_from_default to be false,
    // since that the variable is coming from the child dependency, which we initialized to true.
    assert_eq!(state_var.get().clone(), "Hello World");
    assert_eq!(state_var.came_from_default(), false);

    ////////////////////////////////////////////////////////////////
    // Step 4: cannot invert to make the value "Bye World"
    ////////////////////////////////////////////////////////////////

    // on the state variable view, record that we request the value be false
    state_var_view.queue_update(String::from("Bye World"));

    let invert_result = state_var.invert(false);

    assert!(invert_result.is_err());

    ////////////////////////////////////////////////////////////////
    // Step 5: change the text children to make it "Bye Earth"
    ////////////////////////////////////////////////////////////////

    child1_var.set_value(String::from("Bye "));
    child2_var.set_value(String::from("Earth"));

    state_var.calculate_and_mark_fresh();

    // now the value should be "Bye Earth"
    assert_eq!(state_var.get().clone(), "Bye Earth");
}

/// Testing the case of string state variable based on an attribute
/// For example, if we have a `<textInput prefill/>`
/// its `prefill` state variable would follow this pattern.
#[test]
fn string_state_var_with_attribute() {
    let mut state_var =
        StringStateVar::new_from_attribute("my_attr", String::from("")).into_state_var();

    //////////////////////////////////////////////////
    // check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries();

    // should return a query for "my_attr" with text children and an essential state variable
    assert_eq!(
        queries,
        vec![DataQuery::AttributeChild {
            attribute_name: "my_attr",
            match_profiles: vec![ComponentProfile::Text],
            always_return_value: true,
        },]
    );

    // Note: from this point on, at the level of these tests where dependencies are specified manually,
    // there is no difference in this state variable as the above ones with children,
    // so we don't repeat the same steps
}

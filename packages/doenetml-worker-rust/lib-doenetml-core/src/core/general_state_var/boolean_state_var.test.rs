use crate::{
    components::{prelude::Dependency, ComponentProfile},
    dependency::DependencySource,
    general_state_var::BooleanStateVar,
    state::essential_state::EssentialDataOrigin,
    ExtendStateVariableDescription, StateVariableShadowingMatch,
};

// use self::state::{essential_state::EssentialDataOrigin, StateVarMutableView};

use super::*;

/// Create a mutual view of a state variable along with a read only view
fn create_view_pair<T: Default + Clone>(
    value: T,
    came_from_default: bool,
) -> (StateVarMutableView<T>, StateVarView<T>) {
    let mutable_view = StateVarMutableView::new_with_value(value, came_from_default);
    let view = mutable_view.create_new_read_only_view();
    (mutable_view, view)
}

fn create_essential_dependency<T: Default + Clone>() -> (Dependency, StateVarMutableView<T>)
where
    // make sure T is one of the types that we can convert from StateVarView<T> into StateVarViewEnum
    StateVarViewEnum: From<StateVarView<T>>,
{
    let (essential, essential_view) = create_view_pair(T::default(), true);

    let dependency_source = DependencySource::Essential {
        component_idx: 0,
        origin: EssentialDataOrigin::StateVar(0),
    };

    let dependency = Dependency {
        source: dependency_source,
        value: essential_view.into(),
    };

    (dependency, essential)
}

fn create_state_var_dependency<T: Default + Clone>(
    initial_value: T,
) -> (Dependency, StateVarMutableView<T>)
where
    // make sure T is one of the types that we can convert from StateVarView<T> into StateVarViewEnum
    StateVarViewEnum: From<StateVarView<T>>,
{
    let (state_var, state_var_view) = create_view_pair(initial_value, false);

    let dependency_source = DependencySource::StateVar {
        component_idx: 0,
        state_var_idx: 0,
    };

    let dependency = Dependency {
        source: dependency_source,
        value: state_var_view.into(),
    };

    (dependency, state_var)
}

/// Testing the case of boolean state variable requesting children but receiving no children dependencies
/// so that the only dependency is the implicit essential data.
/// For example, if we have a `<boolean></boolean>` with no children,
/// its `value` state variable would follow this pattern.
#[test]
fn boolean_state_var_with_no_children() {
    // create a boolean state variable requesting children
    let mut state_var = BooleanStateVar::new_from_children(false).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries(None, 3);

    // should return a query for text or boolean children and an essential state variable
    assert_eq!(
        queries,
        vec![
            DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                exclude_if_prefer_profiles: vec![]
            },
            DataQuery::Essential
        ]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with no children and the essential
    ////////////////////////////////////////////////////////////////
    let (essential_dependency, essential_var) = create_essential_dependency();

    let dependencies_created_for_data_queries = vec![
        DependenciesCreatedForDataQuery(vec![]),
        DependenciesCreatedForDataQuery(vec![essential_dependency]),
    ];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    ////////////////////////////////////////////////////////////////
    // Step 3: check if get the correct calculated value
    ////////////////////////////////////////////////////////////////
    state_var.calculate_and_mark_fresh();

    // we expect a value of false and came_from_default to be true,
    // since that the variable is coming from the essential dependency,
    // and we made the create_essential_dependency() function, above, to return those values.
    assert_eq!(*state_var.get(), false);
    assert_eq!(state_var.came_from_default(), true);

    ////////////////////////////////////////////////////////////////
    // Step 4: invert to make the value true
    ////////////////////////////////////////////////////////////////

    // on the state variable view, record that we request the value be true
    state_var_view.queue_update(true);

    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the essential variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            // data_query_idx is 1 because essential is the second data query
            data_query_idx: 1,
            dependency_idx: 0
        }]
    );
    // the essential variable has recorded that it has been requested to be true
    assert_eq!(*essential_var.get_requested_value(), true);

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value true
    ////////////////////////////////////////////////////////////////

    essential_var.set_value(true);

    state_var.calculate_and_mark_fresh();

    // now the value should true and it is no longer marked as coming from default
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);
}

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
    let queries = state_var.return_data_queries(None, 3);

    // should return a query for text or boolean children and an essential state variable
    assert_eq!(
        queries,
        vec![
            DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                exclude_if_prefer_profiles: vec![]
            },
            DataQuery::Essential
        ]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with one boolean child and the essential
    ////////////////////////////////////////////////////////////////
    let (essential_dependency, _essential_var) = create_essential_dependency::<bool>();
    let (child_dependency, child_var) = create_state_var_dependency(true);

    let dependencies_created_for_data_queries = vec![
        DependenciesCreatedForDataQuery(vec![child_dependency]),
        DependenciesCreatedForDataQuery(vec![essential_dependency]),
    ];

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
    assert_eq!(*child_var.get_requested_value(), false);

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value false
    ////////////////////////////////////////////////////////////////

    child_var.set_value(false);

    state_var.calculate_and_mark_fresh();

    // now the value should false
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
    let queries = state_var.return_data_queries(None, 3);

    // should return a query for text or boolean children and an essential state variable
    assert_eq!(
        queries,
        vec![
            DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                exclude_if_prefer_profiles: vec![]
            },
            DataQuery::Essential
        ]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with one string child and the essential
    ////////////////////////////////////////////////////////////////
    let (essential_dependency, _essential_var) = create_essential_dependency::<bool>();
    let (child_dependency, child_var) = create_state_var_dependency(String::from("true"));

    let dependencies_created_for_data_queries = vec![
        DependenciesCreatedForDataQuery(vec![child_dependency]),
        DependenciesCreatedForDataQuery(vec![essential_dependency]),
    ];

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
    assert_eq!(child_var.get_requested_value().to_string(), "false");

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value false
    ////////////////////////////////////////////////////////////////

    child_var.set_value(String::from("false"));

    state_var.calculate_and_mark_fresh();

    // now the value should false
    assert_eq!(*state_var.get(), false);
}

/// Testing the case of boolean state variable requesting children
/// and receiving two string child dependencies.
/// For example, if we have a `<boolean>Tr<text>Ue</text></boolean>`,
/// its `value` state variable would follow this pattern.
#[test]
fn boolean_state_var_with_two_string_children() {
    // create a boolean state variable requesting children
    let mut state_var = BooleanStateVar::new_from_children(false).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries(None, 3);

    // should return a query for text or boolean children and an essential state variable
    assert_eq!(
        queries,
        vec![
            DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                exclude_if_prefer_profiles: vec![]
            },
            DataQuery::Essential
        ]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with two string children and the essential
    ////////////////////////////////////////////////////////////////
    let (essential_dependency, _essential_var) = create_essential_dependency::<bool>();
    let (child1_dependency, _child1_var) = create_state_var_dependency(String::from("Tr"));
    let (child2_dependency, _child2_var) = create_state_var_dependency(String::from("Ue"));

    let dependencies_created_for_data_queries = vec![
        DependenciesCreatedForDataQuery(vec![child1_dependency, child2_dependency]),
        DependenciesCreatedForDataQuery(vec![essential_dependency]),
    ];

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
    // Step 4: cannot invert to make the value false
    ////////////////////////////////////////////////////////////////

    // on the state variable view, record that we request the value be false
    state_var_view.queue_update(false);

    let invert_result = state_var.invert(false);

    assert!(invert_result.is_err());
}

/// Testing the case of boolean state variable based on an attribute
/// For example, if we have a `<textInput disabled/>`
/// its `disabled` state variable would follow this pattern.
#[test]
fn boolean_state_var_with_attribute() {
    // create a boolean state variable requesting children
    let mut state_var = BooleanStateVar::new_from_attribute("my_attr", true).into_state_var();

    //////////////////////////////////////////////////
    // check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries(None, 3);

    // should return a query for "my_attr" with text or boolean children and an essential state variable
    assert_eq!(
        queries,
        vec![
            DataQuery::AttributeChild {
                attribute_name: "my_attr",
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean]
            },
            DataQuery::Essential
        ]
    );

    // Note: from this point on, at the level of these tests where dependencies are specified manually,
    // there is no difference in this state variable as the above ones with children,
    // so we don't repeat the same steps
}

/// Testing the case of boolean state variable
/// is extending another boolean state variable
/// For example, if we have `<boolean name="t">true</boolean> <boolean extends="$t" />`
/// the `value` state variable of the second <boolean> would follow this pattern.
#[test]
fn boolean_state_var_with_just_extending() {
    // create a boolean state variable requesting children
    let mut state_var = BooleanStateVar::new_from_children(false).into_state_var();
    let mut state_var_view = state_var.create_new_read_only_view();

    let extend_source = ExtendSource::StateVar(ExtendStateVariableDescription {
        component_idx: 5,
        state_variable_matching: vec![StateVariableShadowingMatch {
            shadowing_state_var_idx: 3, // we are making this state variable be index 3, below
            shadowed_state_var_idx: 7,
        }],
    });

    //////////////////////////////////////////////////
    // Step 1: check that get the correct data queries
    //////////////////////////////////////////////////
    let queries = state_var.return_data_queries(Some(extend_source), 3);

    // should return a query for text or boolean children and an essential state variable
    assert_eq!(
        queries,
        vec![
            // these numbers match what we entered in the extend_source, above
            DataQuery::StateVar {
                component_idx: Some(5),
                state_var_idx: 7
            },
            DataQuery::Child {
                match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                exclude_if_prefer_profiles: vec![]
            },
            DataQuery::Essential
        ]
    );

    ////////////////////////////////////////////////////////////////
    // Step 2: fulfill data query with a boolean extend source, no children and the essential
    ////////////////////////////////////////////////////////////////
    let (essential_dependency, _essential_var) = create_essential_dependency::<bool>();
    let (extend_dependency, extend_var) = create_state_var_dependency(true);

    let dependencies_created_for_data_queries = vec![
        DependenciesCreatedForDataQuery(vec![extend_dependency]),
        DependenciesCreatedForDataQuery(vec![]),
        DependenciesCreatedForDataQuery(vec![essential_dependency]),
    ];

    state_var.save_dependencies(&dependencies_created_for_data_queries);

    ////////////////////////////////////////////////////////////////
    // Step 3: check if get the correct calculated value
    ////////////////////////////////////////////////////////////////
    state_var.calculate_and_mark_fresh();

    // we expect a value of true and came_from_default to be false,
    // since that the variable is coming from the extend dependency, which we initialized to true.
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);

    ////////////////////////////////////////////////////////////////
    // Step 4: invert to make the value false
    ////////////////////////////////////////////////////////////////

    // on the state variable view, record that we request the value be false
    state_var_view.queue_update(false);

    let invert_result = state_var.invert(false).unwrap();

    // we should get a request informing core that we need to change the essential variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            // data_query_idx is 0 because extend is the first data query
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );
    // the extend variable has recorded that it has been requested to be false
    assert_eq!(*extend_var.get_requested_value(), false);

    ////////////////////////////////////////////////////////////////
    // Step 5: make the changes to actually make the value false
    ////////////////////////////////////////////////////////////////

    extend_var.set_value(false);

    state_var.calculate_and_mark_fresh();

    // now the value should false
    assert_eq!(*state_var.get(), false);
}

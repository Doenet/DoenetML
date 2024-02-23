use crate::utils::test_utils::create_prop_dependency;

use super::*;
use setup_functions::*;

/// check that an independent prop
/// gives the correct data query that requests a state prop
#[test]
fn independent_prop_gives_correct_data_queries() {
    // boolean
    let mut prop: Prop<bool> = IndependentProp::new(false).into_prop();
    let queries = prop.return_data_queries();
    assert_eq!(queries, vec![DataQuery::State,]);

    // String
    let mut prop: Prop<String> = IndependentProp::new(String::from("")).into_prop();
    let queries = prop.return_data_queries();
    assert_eq!(queries, vec![DataQuery::State,]);
}

/// For an independent boolean prop,
/// its value should be the same as its independent state,
/// and its came_from_default should be the same as the independent state's came_from_default
#[test]
fn calculate_independent_boolean_prop() {
    let (mut prop, _prop_view, independent_state) = set_up_boolean_independent_prop(false, true);

    // we initialize independent state to be false, so should get false
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), false);
    assert_eq!(prop.came_from_default(), true);

    // changing independent state to be true, results in prop being true
    independent_state.set_value(true);
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), true);
    assert_eq!(prop.came_from_default(), false);
}

/// Calling invert on a boolean independent prop
/// causes the independent state to receive that requested value
#[test]
fn invert_independent_boolean_prop() {
    let (mut prop, mut prop_view, independent_state) = set_up_boolean_independent_prop(true, false);

    // on the prop view, record that we request the value be false
    prop_view.queue_update(false);

    let invert_result = prop.invert(false).unwrap();

    // we should get a request informing core that we need to change the state
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );

    // the independent state has recorded that it has been requested to be false
    assert_eq!(*independent_state.get_requested_value(), false);
}

/// For an independent string prop,
/// its value should be the same as its independent state
/// and its came_from_default should be the same as the independent state's came_from_default
#[test]
fn calculate_independent_string_prop() {
    let (mut prop, _prop_view, independent_state) =
        set_up_string_independent_prop(String::from("hello"), true);

    // we initialize independent state to be true, so should get true
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), "hello");
    assert_eq!(prop.came_from_default(), true);

    // changing independent state to be false, results in prop being false
    independent_state.set_value(String::from("bye"));
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), "bye");
    assert_eq!(prop.came_from_default(), false);
}

/// Calling invert on a string independent prop
/// causes the independent state to receive that requested value
#[test]
fn invert_independent_string_prop() {
    let (mut prop, mut prop_view, independent_state) =
        set_up_string_independent_prop(String::from("hello"), false);

    // on the prop view, record that we request the value be "bye"
    prop_view.queue_update(String::from("bye"));

    let invert_result = prop.invert(false).unwrap();

    // we should get a request informing core that we need to change the state
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );

    // the independent state has recorded that it has been requested to be false
    assert_eq!(*independent_state.get_requested_value(), "bye");
}

mod setup_functions {

    use super::*;

    /// Utility function to set up independent boolean prop and its independent state dependency
    pub fn set_up_boolean_independent_prop(
        initial_value: bool,
        came_from_default: bool,
    ) -> (Prop<bool>, PropView<bool>, PropViewMut<bool>) {
        let mut prop: Prop<bool> = IndependentProp::new(initial_value).into_prop();
        let prop_view = prop.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        prop.return_data_queries();

        // Note: the default_value specified in the creation of prop above
        // isn't used at this level of testing, so we supply it directly here to match
        let (independent_state_dependency, independent_state) =
            create_prop_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries = vec![DependenciesCreatedForDataQuery(vec![
            independent_state_dependency,
        ])];

        prop.save_dependencies(&dependencies_created_for_data_queries);

        (prop, prop_view, independent_state)
    }

    /// Utility function to set up independent string prop and its independent state dependency
    pub fn set_up_string_independent_prop(
        initial_value: String,
        came_from_default: bool,
    ) -> (Prop<String>, PropView<String>, PropViewMut<String>) {
        let mut prop: Prop<String> = IndependentProp::new(initial_value.clone()).into_prop();
        let prop_view = prop.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        prop.return_data_queries();

        // Note: the default_value specified in the creation of prop above
        // isn't used at this level of testing, so we supply it directly here to match
        let (independent_state_dependency, independent_state) =
            create_prop_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries = vec![DependenciesCreatedForDataQuery(vec![
            independent_state_dependency,
        ])];

        prop.save_dependencies(&dependencies_created_for_data_queries);

        (prop, prop_view, independent_state)
    }
}

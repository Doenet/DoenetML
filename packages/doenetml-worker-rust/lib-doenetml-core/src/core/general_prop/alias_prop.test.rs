use crate::utils::test_utils::create_prop_dependency;

use super::*;
use setup_functions::*;

/// check that a prop alias
/// gives the correct data query that requests original value
#[test]
fn prop_alias_gives_correct_data_queries() {
    // boolean
    let mut prop: Prop<bool> = PropAlias::new(3).into_prop();
    let queries = prop.return_data_queries();
    assert_eq!(
        queries,
        vec![DataQuery::Prop {
            component_idx: None,
            prop_idx: 3
        },]
    );

    // String
    let mut prop: Prop<String> = PropAlias::new(4).into_prop();
    let queries = prop.return_data_queries();
    assert_eq!(
        queries,
        vec![DataQuery::Prop {
            component_idx: None,
            prop_idx: 4
        },]
    );
}

/// For a boolean prop alias,
/// its value should be the same as the original value,
/// and its came_from_default should be the same as the original value's came_from_default
#[test]
fn calculate_boolean_prop_alias() {
    let (prop, _prop_view, alias_var) = set_up_boolean_prop_alias(false, true);

    // we initialize original value to be false, so should get false
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), false);
    assert_eq!(prop.came_from_default(), true);

    // changing original value to be true, results in prop being true
    alias_var.set_value(true);
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), true);
    assert_eq!(prop.came_from_default(), false);
}

/// Calling invert on a boolean prop alias
/// causes the original value to receive that requested value
#[test]
fn invert_boolean_prop_alias() {
    let (mut prop, mut prop_view, alias_var) = set_up_boolean_prop_alias(true, false);

    // on the prop view, record that we request the value be false
    prop_view.queue_update(false);

    let invert_result = prop.invert(false).unwrap();

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

/// For a string prop alias,
/// its value should be the same as its original value,
/// and its came_from_default should be the same as the original value's came_from_default
#[test]
fn calculate_string_prop_alias() {
    let (prop, _prop_view, alias_var) = set_up_string_prop_alias(String::from("hello"), true);

    // we initialize original value to be true, so should get true
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), "hello");
    assert_eq!(prop.came_from_default(), true);

    // changing original value to be false, results in prop being false
    alias_var.set_value(String::from("bye"));
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), "bye");
    assert_eq!(prop.came_from_default(), false);
}

/// Calling invert on a string prop alias
/// causes the original value to receive that requested value
#[test]
fn invert_string_prop_alias() {
    let (mut prop, mut prop_view, alias_var) =
        set_up_string_prop_alias(String::from("hello"), false);

    // on the prop view, record that we request the value be "bye"
    prop_view.queue_update(String::from("bye"));

    let invert_result = prop.invert(false).unwrap();

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

    /// Utility function to set up a boolean prop alias and its original dependency
    pub fn set_up_boolean_prop_alias(
        initial_value: bool,
        came_from_default: bool,
    ) -> (Prop<bool>, PropView<bool>, PropViewMut<bool>) {
        let mut prop: Prop<bool> = PropAlias::new(0).into_prop();
        let prop_view = prop.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        prop.return_data_queries();

        let (original_dependency, alias_var) =
            create_prop_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries =
            vec![DependenciesCreatedForDataQuery(vec![original_dependency])];

        prop.save_dependencies(&dependencies_created_for_data_queries);

        (prop, prop_view, alias_var)
    }

    /// Utility function to set up a string prop alias and its original dependency
    pub fn set_up_string_prop_alias(
        initial_value: String,
        came_from_default: bool,
    ) -> (Prop<String>, PropView<String>, PropViewMut<String>) {
        let mut prop: Prop<String> = PropAlias::new(0).into_prop();
        let prop_view = prop.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        prop.return_data_queries();

        let (original_dependency, alias_var) =
            create_prop_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries =
            vec![DependenciesCreatedForDataQuery(vec![original_dependency])];

        prop.save_dependencies(&dependencies_created_for_data_queries);

        (prop, prop_view, alias_var)
    }
}

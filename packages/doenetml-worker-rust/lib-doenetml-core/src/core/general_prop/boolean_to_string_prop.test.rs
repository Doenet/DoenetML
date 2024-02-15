use super::*;
use setup_functions::*;

/// check that a boolean-to_string prop
/// gives the correct data query that requests original value
#[test]
fn boolean_to_string_prop_gives_correct_data_queries() {
    let mut prop: Prop<String> = BooleanToStringProp::new(3).into_prop();
    let queries = prop.return_data_queries();
    assert_eq!(
        queries,
        vec![DataQuery::Prop {
            component_idx: None,
            prop_idx: 3
        },]
    );
}

#[test]
fn calculate_boolean_to_string_prop() {
    let (prop, _prop_view, boolean_var) = set_up_boolean_to_string_prop(false, true);

    // we initialize original value to be false, so should get "false"
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), "false");
    assert_eq!(prop.came_from_default(), false);

    // changing original value to be true, results in prop being "true"
    boolean_var.set_value(true);
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), "true");
    assert_eq!(prop.came_from_default(), false);
}

#[test]
fn invert_boolean_to_string_prop() {
    let (mut prop, mut prop_view, boolean_var) = set_up_boolean_to_string_prop(true, false);

    // on the prop view, record that we request the value be "true"
    prop_view.queue_update("true".into());
    let invert_result = prop.invert(false).unwrap();

    // we should get a request informing core that we need to change the variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );

    // the original variable has recorded that it has been requested to be true
    assert_eq!(*boolean_var.get_requested_value(), true);

    // on the prop view, record that we request the value be "false"
    prop_view.queue_update("false".into());
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
    assert_eq!(*boolean_var.get_requested_value(), false);
}

#[test]
fn inverting_boolean_to_string_is_case_insensitive() {
    let (mut prop, mut prop_view, boolean_var) = set_up_boolean_to_string_prop(true, false);

    // on the prop view, record that we request the value be "TrUE"
    prop_view.queue_update("TrUE".into());
    let invert_result = prop.invert(false).unwrap();

    // we should get a request informing core that we need to change the variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 0,
            dependency_idx: 0
        }]
    );

    // the original variable has recorded that it has been requested to be true
    assert_eq!(*boolean_var.get_requested_value(), true);

    // on the prop view, record that we request the value be "FalSe"
    prop_view.queue_update("FalSe".into());
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
    assert_eq!(*boolean_var.get_requested_value(), false);
}

mod setup_functions {

    use crate::utils::test_utils::create_prop_dependency;

    use super::*;

    /// Utility function to set up a boolean-to-string prop and its original dependency
    pub fn set_up_boolean_to_string_prop(
        initial_value: bool,
        came_from_default: bool,
    ) -> (Prop<String>, PropView<String>, PropViewMut<bool>) {
        let mut prop: Prop<String> = BooleanToStringProp::new(0).into_prop();
        let prop_view = prop.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        prop.return_data_queries();

        let (original_dependency, boolean_var) =
            create_prop_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries =
            vec![DependenciesCreatedForDataQuery(vec![original_dependency])];

        prop.save_dependencies(&dependencies_created_for_data_queries);

        (prop, prop_view, boolean_var)
    }
}

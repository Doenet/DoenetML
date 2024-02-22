use crate::utils::test_utils::create_prop_dependency;

use super::*;
use setup_functions::*;

/// check that a boolean prop created from children
/// gives the correct data query that requests string and boolean children
#[test]
fn boolean_prop_from_children_gives_correct_data_queries() {
    // create a boolean prop requesting children
    let mut prop = BooleanProp::new_from_children(false).into_prop();

    let queries = prop.return_data_queries();

    assert_eq!(
        queries,
        vec![
            DataQuery::State,
            DataQuery::ChildPropProfile {
                match_profiles: vec![ComponentProfile::String, ComponentProfile::Boolean],
                always_return_value: true,
            },
        ]
    );
}

/// If a boolean prop is based on a single boolean child,
/// its value should be the same as the boolean child's value,
/// and its came_from_default should be the same as the boolean child's came_from_default
#[test]
fn boolean_prop_calculated_from_single_boolean_child() {
    // create a boolean prop with one boolean child
    let (mut prop, _prop_view, _state_var, child_var) = set_up_boolean_prop_with_child(false, true);

    // we initialize child to be false, so should get false
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), false);
    assert_eq!(prop.came_from_default(), true);

    // changing child to be true, results in prop being true
    child_var.set_value(true);
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), true);
    assert_eq!(prop.came_from_default(), false);
}

/// Calling invert on a boolean prop with a single boolean child
/// causes the child to receive that requested value
#[test]
fn invert_boolean_prop_that_has_a_single_boolean_child() {
    // create a boolean prop with one boolean child
    let (mut prop, mut prop_view, _state_var, child_var) =
        set_up_boolean_prop_with_child(true, false);

    // on the prop view, record that we request the value be false
    prop_view.queue_update(false);

    let invert_result = prop.invert(false).unwrap();

    // we should get a request informing core that we need to change the variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 1,
            dependency_idx: 0
        }]
    );

    // the child variable has recorded that it has been requested to be false
    assert_eq!(*child_var.get_requested_value(), false);
}

/// If a boolean prop is based on a single string child,
/// its value should is based on converting that string to a boolean
/// and its `came_from_default` should be `false`.
#[test]
fn boolean_prop_calculated_from_single_string_child() {
    // create a boolean prop with one string child
    let (mut prop, _prop_view, _state_var, child_var) =
        set_up_boolean_prop_with_child(String::from("true"), true);

    // the initial value of "true" leads to true
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), true);
    assert_eq!(prop.came_from_default(), false);

    // the value of "false" leads to false
    child_var.set_value(String::from("false"));
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), false);
    assert_eq!(prop.came_from_default(), false);

    // the value of "t" still leads to false
    child_var.set_value(String::from("t"));
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), false);
    assert_eq!(prop.came_from_default(), false);
}

/// A boolean prop based on a single blank string child is false
#[test]
fn boolean_prop_calculated_from_a_blank_string_child_is_false() {
    // create a boolean prop with one string child
    let (mut prop, _prop_view, _state_var, _child_var) =
        set_up_boolean_prop_with_child(String::from(""), false);

    // the initial value of "" leads to false
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), false);
}

/// A boolean prop based on a string child is calculated
/// in a case-insensitive manner
#[test]
fn boolean_prop_calculated_from_string_child_in_case_insensitive_way() {
    // create a boolean prop with one string child
    let (mut prop, _prop_view, _state_var, child_var) =
        set_up_boolean_prop_with_child(String::from("TruE"), false);

    // the initial value of "TruE" leads to true
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), true);

    // the value of "T" leads to false
    child_var.set_value(String::from("T"));
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), false);
}

/// Calling invert on a boolean prop with a single boolean child
/// causes the child to receive that requested value
#[test]
fn invert_boolean_prop_that_has_a_single_string_child() {
    // create a boolean prop with one string child
    let (mut prop, mut prop_view, _state_var, child_var) =
        set_up_boolean_prop_with_child(String::from("true"), false);

    // on the prop view, record that we request the value be false
    prop_view.queue_update(false);

    let invert_result = prop.invert(false).unwrap();

    // we should get a request informing core that we need to change the variable
    assert_eq!(
        invert_result,
        vec![DependencyValueUpdateRequest {
            data_query_idx: 1,
            dependency_idx: 0
        }]
    );

    // the child variable has recorded that it has been requested to be "false"
    assert_eq!(*child_var.get_requested_value(), "false");
}

/// If a boolean prop is based on a two string children,
/// its value should is based on concatenating those strings and then converting to a boolean
#[test]
fn boolean_prop_calculated_from_two_string_children() {
    // create a boolean prop with two string children
    let (mut prop, _prop_view, _state_var, child_var_1, child_var_2) =
        set_up_boolean_prop_with_two_children(String::from("Tr"), String::from("Ue"), false);

    // the initial value of "TrUe" leads to true
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), true);

    // switching order leads to false
    child_var_1.set_value(String::from("ue"));
    child_var_2.set_value(String::from("tr"));
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), false);

    // another combination that spells out "true"
    child_var_1.set_value(String::from("tru"));
    child_var_2.set_value(String::from("e"));
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), true);
}

/// Cannot invert a boolean prop with a two boolean children
#[test]
fn cannot_invert_boolean_prop_that_has_two_string_children() {
    // create a boolean prop with two string children
    let (mut prop, mut prop_view, _state_var, _child_var_1, _child_var_2) =
        set_up_boolean_prop_with_two_children(String::from("tr"), String::from("ue"), false);

    // on the prop view, record that we request the value be false
    prop_view.queue_update(false);

    let invert_result = prop.invert(false);

    assert!(invert_result.is_err());
}

/// check that a boolean prop created from an attribute
/// gives the correct data query that requests string and boolean children from that attribute
#[test]
fn boolean_prop_from_attribute_gives_correct_data_queries() {
    // create a boolean prop from attribute
    let mut prop = BooleanProp::new_from_attribute("my_attr", true).into_prop();

    let queries = prop.return_data_queries();

    assert_eq!(
        queries,
        vec![
            DataQuery::State,
            DataQuery::Attribute {
                attribute_name: "my_attr",
                match_profiles: vec![ComponentProfile::String, ComponentProfile::Boolean],
                always_return_value: true
            },
        ]
    );
}

/// If a boolean prop is based on a single boolean attribute child,
/// its value should be the same as the boolean child's value
/// and its came_from_default should be the same as the boolean child's came_from_default
#[test]
fn boolean_prop_calculated_from_single_boolean_attribute_child() {
    // create a boolean prop with one boolean attribute child
    let (mut prop, _prop_view, _state_var, child_var) =
        set_up_boolean_prop_with_attribute_child("my_attr", false, true);

    // we initialize child to be false, so should get false
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), false);
    assert_eq!(prop.came_from_default(), true);

    // changing child to be true, results in prop being true
    child_var.set_value(true);
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), true);
    assert_eq!(prop.came_from_default(), false);
}

/// A boolean prop based on a single blank string attribute child is true
#[test]
fn boolean_prop_calculated_from_a_blank_string_attribute_child_is_true() {
    // create a boolean prop with one string attribute child
    let (mut prop, _prop_view, _state_var, child_var) =
        set_up_boolean_prop_with_attribute_child("my_attr", String::from(""), false);

    // the initial value of "" leads to false
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), true);

    // changing child to be " ", results in prop being false
    child_var.set_value(String::from(" "));
    prop.calculate_and_mark_fresh();
    assert_eq!(*prop.get(), false);
}

mod setup_functions {

    use super::*;

    /// Utility function to set up boolean prop that depends on one child variable
    pub fn set_up_boolean_prop_with_child<T>(
        initial_value: T,
        came_from_default: bool,
    ) -> (
        Prop<bool>,
        PropView<bool>,
        PropViewMut<bool>,
        PropViewMut<T>,
    )
    where
        T: Default + Clone,
        PropView<T>: TryFromState<PropViewEnum>,
        PropViewEnum: From<PropView<T>>,
    {
        let mut prop: Prop<bool> = BooleanProp::new_from_children(false).into_prop();
        let prop_view = prop.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        prop.return_data_queries();

        let (state_dependency, state_var) =
            create_prop_dependency::<bool>(false, came_from_default);

        // fulfill data query with one child of type T
        let (child_dependency, child_var) =
            create_prop_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries = vec![
            DependenciesCreatedForDataQuery(vec![state_dependency]),
            DependenciesCreatedForDataQuery(vec![child_dependency]),
        ];

        prop.save_dependencies(&dependencies_created_for_data_queries);

        (prop, prop_view, state_var, child_var)
    }

    /// Utility function to set up boolean prop that depends on two child variables
    pub fn set_up_boolean_prop_with_two_children<T>(
        initial_value_1: T,
        initial_value_2: T,
        came_from_default: bool,
    ) -> (
        Prop<bool>,
        PropView<bool>,
        PropViewMut<bool>,
        PropViewMut<T>,
        PropViewMut<T>,
    )
    where
        T: Default + Clone,
        PropView<T>: TryFromState<PropViewEnum>,
        PropViewEnum: From<PropView<T>>,
    {
        let mut prop: Prop<bool> = BooleanProp::new_from_children(false).into_prop();
        let prop_view = prop.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        prop.return_data_queries();

        let (state_dependency, state_var) =
            create_prop_dependency::<bool>(false, came_from_default);

        // fulfill data query with two children of type T
        let (child_dependency_1, child_var_1) =
            create_prop_dependency(initial_value_1, came_from_default);

        // fulfill data query with two children of type T
        let (child_dependency_2, child_var_2) =
            create_prop_dependency(initial_value_2, came_from_default);

        let dependencies_created_for_data_queries = vec![
            DependenciesCreatedForDataQuery(vec![state_dependency]),
            DependenciesCreatedForDataQuery(vec![child_dependency_1, child_dependency_2]),
        ];

        prop.save_dependencies(&dependencies_created_for_data_queries);

        (prop, prop_view, state_var, child_var_1, child_var_2)
    }

    /// Utility function to set up boolean prop that depends on one attribute child variable
    pub fn set_up_boolean_prop_with_attribute_child<T>(
        attr_name: AttributeName,
        initial_value: T,
        came_from_default: bool,
    ) -> (
        Prop<bool>,
        PropView<bool>,
        PropViewMut<bool>,
        PropViewMut<T>,
    )
    where
        T: Default + Clone,
        PropView<T>: TryFromState<PropViewEnum>,
        PropViewEnum: From<PropView<T>>,
    {
        let mut prop: Prop<bool> = BooleanProp::new_from_attribute(attr_name, false).into_prop();
        let prop_view = prop.create_new_read_only_view();

        // need to return data queries since side effect is saving the required data
        prop.return_data_queries();

        let (state_dependency, state_var) =
            create_prop_dependency::<bool>(false, came_from_default);

        // fulfill data query with one child of type T
        let (child_dependency, child_var) =
            create_prop_dependency(initial_value, came_from_default);

        let dependencies_created_for_data_queries = vec![
            DependenciesCreatedForDataQuery(vec![state_dependency]),
            DependenciesCreatedForDataQuery(vec![child_dependency]),
        ];

        prop.save_dependencies(&dependencies_created_for_data_queries);

        (prop, prop_view, state_var, child_var)
    }
}

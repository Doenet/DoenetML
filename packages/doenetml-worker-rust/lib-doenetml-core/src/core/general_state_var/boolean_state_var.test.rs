use crate::utils::test_utils::create_state_var_dependency;

use super::*;
use setup_functions::*;

/// check that a boolean state variable created from children
/// gives the correct data query that requests text and boolean children
#[test]
fn boolean_state_var_from_children_gives_correct_data_queries() {
    // create a boolean state variable requesting children
    let mut state_var = BooleanStateVar::new_from_children(false).into_state_var();

    let queries = state_var.return_data_queries();

    assert_eq!(
        queries,
        vec![DataQuery::Child {
            match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
            exclude_if_prefer_profiles: vec![],
            always_return_value: true,
        },]
    );
}

/// If a boolean state variable is based on a single boolean child,
/// its value should be the same as the boolean child's value,
/// and its came_from_default should be the same as the boolean child's came_from_default
#[test]
fn boolean_state_var_calculated_from_single_boolean_child() {
    // create a boolean state variable with one boolean child
    let (state_var, _state_var_view, child_var) = set_up_boolean_state_var_with_child(false, true);

    // we initialize child to be false, so should get false
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
    assert_eq!(state_var.came_from_default(), true);

    // changing child to be true, results in state variable being true
    child_var.set_value(true);
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);
}

/// Calling invert on a boolean state variable with a single boolean child
/// causes the child to receive that requested value
#[test]
fn invert_boolean_state_var_that_has_a_single_boolean_child() {
    // create a boolean state variable with one boolean child
    let (mut state_var, mut state_var_view, child_var) =
        set_up_boolean_state_var_with_child(true, false);

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
}

/// If a boolean state variable is based on a single string child,
/// its value should is based on converting that string to a boolean
/// and its `came_from_default` should be `false`.
#[test]
fn boolean_state_var_calculated_from_single_string_child() {
    // create a boolean state variable with one string child
    let (state_var, _state_var_view, child_var) =
        set_up_boolean_state_var_with_child(String::from("true"), true);

    // the initial value of "true" leads to true
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);

    // the value of "false" leads to false
    child_var.set_value(String::from("false"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
    assert_eq!(state_var.came_from_default(), false);

    // the value of "t" still leads to false
    child_var.set_value(String::from("t"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
    assert_eq!(state_var.came_from_default(), false);
}

/// A boolean state variable based on a single blank string child is false
#[test]
fn boolean_state_var_calculated_from_a_blank_string_child_is_false() {
    // create a boolean state variable with one string child
    let (state_var, _state_var_view, _child_var) =
        set_up_boolean_state_var_with_child(String::from(""), false);

    // the initial value of "" leads to false
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
}

/// A boolean state variable based on a string child is calculated
/// in a case-insensitive manner
#[test]
fn boolean_state_var_calculated_from_string_child_in_case_insensitive_way() {
    // create a boolean state variable with one string child
    let (state_var, _state_var_view, child_var) =
        set_up_boolean_state_var_with_child(String::from("TruE"), false);

    // the initial value of "TruE" leads to true
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);

    // the value of "T" leads to false
    child_var.set_value(String::from("T"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
}

/// Calling invert on a boolean state variable with a single boolean child
/// causes the child to receive that requested value
#[test]
fn invert_boolean_state_var_that_has_a_single_string_child() {
    // create a boolean state variable with one string child
    let (mut state_var, mut state_var_view, child_var) =
        set_up_boolean_state_var_with_child(String::from("true"), false);

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

    // the child variable has recorded that it has been requested to be "false"
    assert_eq!(*child_var.get_requested_value(), "false");
}

/// If a boolean state variable is based on a two string children,
/// its value should is based on concatenating those strings and then converting to a boolean
#[test]
fn boolean_state_var_calculated_from_two_string_children() {
    // create a boolean state variable with two string children
    let (state_var, _state_var_view, child_var_1, child_var_2) =
        set_up_boolean_state_var_with_two_children(String::from("Tr"), String::from("Ue"), false);

    // the initial value of "TrUe" leads to true
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);

    // switching order leads to false
    child_var_1.set_value(String::from("ue"));
    child_var_2.set_value(String::from("tr"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);

    // another combination that spells out "true"
    child_var_1.set_value(String::from("tru"));
    child_var_2.set_value(String::from("e"));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);
}

/// Cannot invert a boolean state variable with a two boolean children
#[test]
fn cannot_invert_boolean_state_var_that_has_two_string_children() {
    // create a boolean state variable with two string children
    let (mut state_var, mut state_var_view, _child_var_1, _child_var_2) =
        set_up_boolean_state_var_with_two_children(String::from("tr"), String::from("ue"), false);

    // on the state variable view, record that we request the value be false
    state_var_view.queue_update(false);

    let invert_result = state_var.invert(false);

    assert!(invert_result.is_err());
}

/// check that a boolean state variable created from an attribute
/// gives the correct data query that requests text and boolean children from that attribute
#[test]
fn boolean_state_var_from_attribute_gives_correct_data_queries() {
    // create a boolean state variable from attribute
    let mut state_var = BooleanStateVar::new_from_attribute("my_attr", true).into_state_var();

    let queries = state_var.return_data_queries();

    assert_eq!(
        queries,
        vec![DataQuery::AttributeChild {
            attribute_name: "my_attr",
            match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
            always_return_value: true
        },]
    );
}

/// If a boolean state variable is based on a single boolean attribute child,
/// its value should be the same as the boolean child's value
/// and its came_from_default should be the same as the boolean child's came_from_default
#[test]
fn boolean_state_var_calculated_from_single_boolean_attribute_child() {
    // create a boolean state variable with one boolean attribute child
    let (state_var, _state_var_view, child_var) =
        set_up_boolean_state_var_with_attribute_child("my_attr", false, true);

    // we initialize child to be false, so should get false
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
    assert_eq!(state_var.came_from_default(), true);

    // changing child to be true, results in state variable being true
    child_var.set_value(true);
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);
    assert_eq!(state_var.came_from_default(), false);
}

/// A boolean state variable based on a single blank string attribute child is true
#[test]
fn boolean_state_var_calculated_from_a_blank_string_attribute_child_is_true() {
    // create a boolean state variable with one string attribute child
    let (state_var, _state_var_view, child_var) =
        set_up_boolean_state_var_with_attribute_child("my_attr", String::from(""), false);

    // the initial value of "" leads to false
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), true);

    // changing child to be " ", results in state variable being false
    child_var.set_value(String::from(" "));
    state_var.calculate_and_mark_fresh();
    assert_eq!(*state_var.get(), false);
}

mod setup_functions {

    use super::*;

    /// Utility function to set up boolean state variable that depends on one child variable
    pub fn set_up_boolean_state_var_with_child<T>(
        initial_value: T,
        came_from_default: bool,
    ) -> (StateVar<bool>, StateVarView<bool>, StateVarMutableView<T>)
    where
        T: Default + Clone,
        StateVarView<T>: TryFromState<StateVarViewEnum>,
        StateVarViewEnum: From<StateVarView<T>>,
    {
        let mut state_var: StateVar<bool> =
            BooleanStateVar::new_from_children(false).into_state_var();
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

    /// Utility function to set up boolean state variable that depends on two child variables
    pub fn set_up_boolean_state_var_with_two_children<T>(
        initial_value_1: T,
        initial_value_2: T,
        came_from_default: bool,
    ) -> (
        StateVar<bool>,
        StateVarView<bool>,
        StateVarMutableView<T>,
        StateVarMutableView<T>,
    )
    where
        T: Default + Clone,
        StateVarView<T>: TryFromState<StateVarViewEnum>,
        StateVarViewEnum: From<StateVarView<T>>,
    {
        let mut state_var: StateVar<bool> =
            BooleanStateVar::new_from_children(false).into_state_var();
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

    /// Utility function to set up boolean state variable that depends on one attribute child variable
    pub fn set_up_boolean_state_var_with_attribute_child<T>(
        attr_name: AttributeName,
        initial_value: T,
        came_from_default: bool,
    ) -> (StateVar<bool>, StateVarView<bool>, StateVarMutableView<T>)
    where
        T: Default + Clone,
        StateVarView<T>: TryFromState<StateVarViewEnum>,
        StateVarViewEnum: From<StateVarView<T>>,
    {
        let mut state_var: StateVar<bool> =
            BooleanStateVar::new_from_attribute(attr_name, false).into_state_var();
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
}

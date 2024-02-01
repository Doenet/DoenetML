use super::*;

/// Create a mutual view of a state variable along with a read only view
fn create_view_pair(
    value: &str,
    came_from_default: bool,
) -> (StateVarMutableView<String>, StateVarView<String>) {
    let mutable_view = StateVarMutableView::new_with_value(value.to_string(), came_from_default);
    let view = mutable_view.create_new_read_only_view();
    (mutable_view, view)
}

/// Testing the case of string state variable without any dependencies (other than the implicit essential data).
/// For example, where we have a `<text></text>` with no children,
/// its `value` state variable would have no dependencies.
#[test]
fn string_state_var_with_no_dependencies() {
    // set up data that consists of just the essential variable
    let mut string_data = StringRequiredData::default();

    let (essential, essential_view) = create_view_pair("", true);

    string_data.essential = essential_view;

    // a call to calculate gives the default "", as that is what essential contains
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::FromDefault("".to_string())
    );

    // if change the value of essential, get calculated value with new value
    essential.set_value("hello".to_string());
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("hello".to_string())
    );

    // if change the value of essential as though it were the default,
    // get the new default value
    essential.set_value_from_default("bye".to_string());
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::FromDefault("bye".to_string())
    );

    // set up a view of the state variable itself, as needed for invert
    let (state_var, state_var_view) = create_view_pair("", false);
    state_var.set_requested_value("new".to_string());

    // add meta data needed for invert to work. Use arbitrary values just to test.
    string_data._data_query_mapping_data.essential.push((5, 7));

    // we get an Ok result from invert
    let invert_result = StringStateVar::invert(&mut string_data, &state_var_view, false).unwrap();

    // the request is to change corresponds to the mapping data we made for essential
    assert_eq!(invert_result.len(), 1);
    assert_eq!(
        invert_result[0],
        DependencyValueUpdateRequest {
            data_query_idx: 5,
            dependency_idx: 7
        }
    );

    // the essential value was requested to change to the new value
    assert_eq!(
        essential.get_requested_value().to_string(),
        "new".to_string()
    );
}

/// Testing the case of string state variable with a single string base dependency.
/// For example, where we have a `<text>hello</text>` with one string child,
/// its `value` state variable would just depend on the string "hello".
#[test]
fn string_state_var_with_one_base_dependency() {
    // set up data that consists of the essential variable and one base variable
    let mut string_data = StringRequiredData::default();

    let (essential, essential_view) = create_view_pair("", true);
    string_data.essential = essential_view;

    let (base, base_view) = create_view_pair("the", false);

    string_data.base = vec![base_view];

    // a call to calculate matches the base variable
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("the".to_string())
    );

    // the essential variable is being ignored, so changes to it do not alter the calculation
    essential.set_value("hello".to_string());
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("the".to_string())
    );

    base.set_value("other".to_string());
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("other".to_string())
    );

    // set up a view of the state variable itself, as needed for invert
    let (state_var, state_var_view) = create_view_pair("", false);
    state_var.set_requested_value("new".to_string());

    // add meta data needed for invert to work. Use arbitrary values just to test.
    string_data._data_query_mapping_data.base.push((3, 2));

    // we get an Ok result from invert
    let invert_result = StringStateVar::invert(&mut string_data, &state_var_view, false).unwrap();

    // the request is to change corresponds to the mapping data we made for essential
    assert_eq!(invert_result.len(), 1);
    assert_eq!(
        invert_result[0],
        DependencyValueUpdateRequest {
            data_query_idx: 3,
            dependency_idx: 2
        }
    );

    // the base value was requested to change to the new value
    assert_eq!(base.get_requested_value().to_string(), "new".to_string());
}

/// Testing the case of string state variable with two string base dependencies.
/// For example, for `<text>hello <text>there</text></text>`,
/// where the outer `<text>` has one string children and on text child,
/// its `value` state variable would depend on two string base dependencies.
#[test]
fn string_state_var_with_two_base_dependencies() {
    // set up data that consists of the essential variable and two base variables
    let mut string_data = StringRequiredData::default();
    let (essential, essential_view) = create_view_pair("", true);
    string_data.essential = essential_view;

    let (_base1, base1_view) = create_view_pair("Hello", false);
    let (base2, base2_view) = create_view_pair("World", false);

    string_data.base = vec![base1_view, base2_view];

    // a call to calculate matches the concatenation of the base variables
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("HelloWorld".to_string())
    );

    // the essential variable is being ignored, so changes to it do not alter the calculation
    essential.set_value("bye".to_string());
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("HelloWorld".to_string())
    );

    base2.set_value("Earth".to_string());
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("HelloEarth".to_string())
    );

    // set up a view of the state variable itself, as needed for invert
    let (state_var, state_var_view) = create_view_pair("", false);
    state_var.set_requested_value("new".to_string());

    // we get an Err result from invert
    let invert_result = StringStateVar::invert(&mut string_data, &state_var_view, false);

    assert!(invert_result.is_err());
}

/// Testing the case of string state variable with an extending dependency.
/// For example, for `<text name="h">hello</text> <text extends="$h" />`,
/// where the second `<text>` extends the first,
/// its `value` state variable would depend an extending dependency.
#[test]
fn string_state_var_just_extending() {
    // set up data that consists of the essential variable and an extending variable
    let mut string_data = StringRequiredData::default();
    let (essential, essential_view) = create_view_pair("", true);
    string_data.essential = essential_view;

    let (extending, extending_view) = create_view_pair("the", false);
    string_data.extending = Some(extending_view);

    // a call to calculate matches the extending variable
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("the".to_string())
    );

    // the essential variable is being ignored, so changes to it do not alter the calculation
    essential.set_value("hello".to_string());
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("the".to_string())
    );

    extending.set_value("other".to_string());
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("other".to_string())
    );

    // set up a view of the state variable itself, as needed for invert
    let (state_var, state_var_view) = create_view_pair("", false);
    state_var.set_requested_value("new".to_string());

    // add meta data needed for invert to work. Use arbitrary values just to test.
    string_data._data_query_mapping_data.extending.push((3, 2));

    // we get an Ok result from invert
    let invert_result = StringStateVar::invert(&mut string_data, &state_var_view, false).unwrap();

    // the request is to change corresponds to the mapping data we made for essential
    assert_eq!(invert_result.len(), 1);
    assert_eq!(
        invert_result[0],
        DependencyValueUpdateRequest {
            data_query_idx: 3,
            dependency_idx: 2
        }
    );

    // the extending value was requested to change to the new value
    assert_eq!(
        extending.get_requested_value().to_string(),
        "new".to_string()
    );
}

/// Testing the case of string state variable with an extending dependency and a base dependency.
/// For example, for `<text name="h">hello</text> <text extends="$h">there</text>`,
/// where the second `<text>` extends the first and has an additional child,
/// its `value` state variable would depend an extending dependency plus a base dependency.
#[test]
fn string_state_var_extending_and_with_one_base_dependency() {
    // set up data that consists of the essential variable, and extending, and one base variable
    let mut string_data = StringRequiredData::default();
    let (essential, essential_view) = create_view_pair("", true);
    string_data.essential = essential_view;

    let (_extending, extending_view) = create_view_pair("Hello", false);
    string_data.extending = Some(extending_view);

    let (base, base_view) = create_view_pair("World", false);
    string_data.base = vec![base_view];

    // a call to calculate matches the concatenation of the base variables
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("HelloWorld".to_string())
    );

    // the essential variable is being ignored, so changes to it do not alter the calculation
    essential.set_value("bye".to_string());
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("HelloWorld".to_string())
    );

    base.set_value("Earth".to_string());
    assert_eq!(
        StringStateVar::calculate(&string_data),
        StateVarCalcResult::Calculated("HelloEarth".to_string())
    );

    // set up a view of the state variable itself, as needed for invert
    let (state_var, state_var_view) = create_view_pair("", false);
    state_var.set_requested_value("new".to_string());

    // we get an Err result from invert
    let invert_result = StringStateVar::invert(&mut string_data, &state_var_view, false);

    assert!(invert_result.is_err());
}

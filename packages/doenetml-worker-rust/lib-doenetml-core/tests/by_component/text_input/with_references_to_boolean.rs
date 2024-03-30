use super::*;

/// A boolean component referenced as a child of a text input
/// will be changed with `UpdateValue`
#[test]
fn text_input_referencing_boolean() {
    let dast_root =
        dast_root_no_position(r#"<textInput>$b</textInput><boolean name="b">true</boolean>"#);

    let mut core = Core::new();
    core.init_from_dast_root(&dast_root);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = ComponentIdx::new(1);

    // the original text will be right after the text input, so index 2
    let boolean_idx = ComponentIdx::new(2);

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "true");
    assert_eq!(get_value(text_input_idx, &mut core), "true");
    assert_eq!(get_boolean_value(boolean_idx, &mut core), true);

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value prop
    let type_word_action = update_immediate_value_action(String::from("bye"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "true");
    assert_eq!(get_boolean_value(boolean_idx, &mut core), true);

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    // "bye" is converted to boolean as false
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "false");
    assert_eq!(get_value(text_input_idx, &mut core), "false");
    assert_eq!(get_boolean_value(boolean_idx, &mut core), false);

    // convert back to true
    let _ = core.dispatch_action(update_immediate_value_action(
        String::from("trUe"),
        text_input_idx,
    ));
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "trUe");
    assert_eq!(get_value(text_input_idx, &mut core), "false");
    assert_eq!(get_boolean_value(boolean_idx, &mut core), false);

    let _ = core.dispatch_action(update_value_action(text_input_idx));

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "true");
    assert_eq!(get_value(text_input_idx, &mut core), "true");
    assert_eq!(get_boolean_value(boolean_idx, &mut core), true);
}

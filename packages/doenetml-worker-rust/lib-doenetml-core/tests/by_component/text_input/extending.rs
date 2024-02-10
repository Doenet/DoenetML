use super::*;

/// A text input extending a text input mirrors both value and immediate value
#[ignore = "extend not yet implemented"]
#[test]
fn text_input_extending_text_input() {
    let dast_root = dast_root_no_position(r#"<textInput name="ti"/> <textInput extend="$ti" />"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    let extending_idx = 2;

    // confirm that the extending component is still a text input
    assert_eq!(
        core.components[extending_idx].borrow().get_component_type(),
        "textInput"
    );

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "");
    assert_eq!(get_value(text_input_idx, &mut core), "");
    assert_eq!(get_immediate_value(extending_idx, &mut core), "");
    assert_eq!(get_value(extending_idx, &mut core), "");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value state variable
    let type_word_action = update_immediate_value_action(String::from("hello"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "");

    assert_eq!(get_immediate_value(extending_idx, &mut core), "hello");
    assert_eq!(get_value(extending_idx, &mut core), "");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_immediate_value(extending_idx, &mut core), "hello");
    assert_eq!(get_value(extending_idx, &mut core), "hello");
}

/// A text extending a text input mirrors `value`
#[ignore = "extend not yet implemented"]
#[test]
fn references_to_value_and_immediate_value_respond_to_actions() {
    let dast_root = dast_root_no_position(r#"<textInput name="ti"/> <text extend="$t" />"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    let extending_text_idx = 2;

    // confirm that the extending component is still a text
    assert_eq!(
        core.components[extending_text_idx]
            .borrow()
            .get_component_type(),
        "text"
    );

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "");
    assert_eq!(get_value(text_input_idx, &mut core), "");
    assert_eq!(get_text_value(extending_text_idx, &mut core), "");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value state variable
    let type_word_action = update_immediate_value_action(String::from("hello"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "");
    assert_eq!(get_text_value(extending_text_idx, &mut core), "");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_text_value(extending_text_idx, &mut core), "hello");
}

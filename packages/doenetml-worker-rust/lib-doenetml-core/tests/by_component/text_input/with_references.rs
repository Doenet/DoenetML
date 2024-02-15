use super::*;

/// A text component referenced as a child of a text input
/// will be changed with `UpdateValue`
#[test]
fn text_input_reference_child_is_changed_when_update_value() {
    let dast_root =
        dast_root_no_position(r#"<textInput>$t</textInput><text name="t">hello</text>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // the original text will be right after the text input, so index 2
    let text_idx = 2;

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_text_value(text_idx, &mut core), "hello");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value prop
    let type_word_action = update_immediate_value_action(String::from("bye"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_text_value(text_idx, &mut core), "hello");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_text_value(text_idx, &mut core), "bye");
}

/// A text component referenced as a prefill of a text input
/// will not be changed with `UpdateValue`
#[test]
fn text_input_reference_prefill_is_not_changed_when_update_value() {
    let dast_root =
        dast_root_no_position(r#"<textInput prefill="$t" /><text name="t">hello</text>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // the original text will be right after the text input, so index 2
    let text_idx = 2;

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_text_value(text_idx, &mut core), "hello");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value prop
    let type_word_action = update_immediate_value_action(String::from("bye"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_text_value(text_idx, &mut core), "hello");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_text_value(text_idx, &mut core), "hello");
}

/// References to `value` and `immediate_value` update with actions
#[test]
fn references_to_value_and_immediate_value_respond_to_actions() {
    let dast_root = dast_root_no_position(r#"$ti.immediateValue $ti.value <textInput name="ti"/>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the document tag will be index 0, so other indices are shifted by one.
    let text_input_idx = 3;

    // referencing components will be created right after the text input
    let immediate_value_reference_idx = 1;
    let value_reference_idx = 2;

    // confirm that the references were expanded into texts
    assert_eq!(
        core.components[immediate_value_reference_idx]
            .borrow()
            .get_component_type(),
        "text"
    );
    assert_eq!(
        core.components[value_reference_idx]
            .borrow()
            .get_component_type(),
        "text"
    );

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "");
    assert_eq!(get_value(text_input_idx, &mut core), "");
    assert_eq!(get_text_value(immediate_value_reference_idx, &mut core), "");
    assert_eq!(get_text_value(value_reference_idx, &mut core), "");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value prop
    let type_word_action = update_immediate_value_action(String::from("hello"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "");
    assert_eq!(
        get_text_value(immediate_value_reference_idx, &mut core),
        "hello"
    );
    assert_eq!(get_text_value(value_reference_idx, &mut core), "");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");
    assert_eq!(
        get_text_value(immediate_value_reference_idx, &mut core),
        "hello"
    );
    assert_eq!(get_text_value(value_reference_idx, &mut core), "hello");
}

/// A plain reference to a text input expands into a text mirroring `value`
#[test]
fn plain_reference_to_text_input_expands_into_text() {
    let dast_root = dast_root_no_position(r#"<textInput name="ti"/> $ti"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    let reference_idx = 2;

    // confirm that the reference was expanded into text
    assert_eq!(
        core.components[reference_idx].borrow().get_component_type(),
        "text"
    );

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "");
    assert_eq!(get_value(text_input_idx, &mut core), "");
    assert_eq!(get_text_value(reference_idx, &mut core), "");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value prop
    let type_word_action = update_immediate_value_action(String::from("hello"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "");
    assert_eq!(get_text_value(reference_idx, &mut core), "");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_text_value(reference_idx, &mut core), "hello");
}

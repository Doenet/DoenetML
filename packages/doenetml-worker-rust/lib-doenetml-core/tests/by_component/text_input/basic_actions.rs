use super::*;

/// The `UpdateImmediateValue` action updates `immediate_value` but not `value`.
///
/// The `UpdateValue` action updates the `value` to match `immediate_value`.
#[test]
fn value_and_immediate_value_respond_to_actions() {
    let dast_root = dast_root_no_position(r#"<textInput/>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "");
    assert_eq!(get_value(text_input_idx, &mut core), "");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value state variable
    let type_word_action = update_immediate_value_action(String::from("hello"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");
}

/// The UpdateImmediateValue and UpdateValue actions work the same with a prefill,
/// only their initial values are from prefill.
#[test]
fn value_and_immediate_value_with_prefill_respond_to_actions() {
    let dast_root = dast_root_no_position(r#"<textInput prefill="hello" />"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value state variable
    let type_word_action = update_immediate_value_action(String::from("bye"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "bye");
}

/// The UpdateImmediateValue and UpdateValue actions work the same when have a string child,
/// only their initial values are from the child.
#[test]
fn value_and_immediate_value_with_string_child_respond_to_actions() {
    let dast_root = dast_root_no_position(r#"<textInput>hello</textInput>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value state variable
    let type_word_action = update_immediate_value_action(String::from("bye"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "bye");
}

/// The UpdateImmediateValue and UpdateValue actions work the same when have a text child,
/// only their initial values are from the child.
#[test]
fn value_and_immediate_value_with_text_child_respond_to_actions() {
    let dast_root = dast_root_no_position(r#"<textInput><text>hello</text></textInput>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value state variable
    let type_word_action = update_immediate_value_action(String::from("bye"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "bye");
}

/// When have two children, `UpdateImmediateValue` still works,
/// but `UpdateValue` reverts both to their original value
#[test]
fn value_and_immediate_value_with_two_children_respond_to_actions() {
    let dast_root = dast_root_no_position(r#"<textInput><text>hello</text> there</textInput>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // both variables are initialized to blank strings
    assert_eq!(
        get_immediate_value(text_input_idx, &mut core),
        "hello there"
    );
    assert_eq!(get_value(text_input_idx, &mut core), "hello there");

    // Since immediate_value isn't directly tied to the children, it can be updated
    let type_word_action = update_immediate_value_action(String::from("bye"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "hello there");

    // However, attempting to update value fails and both value and immediate value revert
    // to the values prescribed from the children
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(
        get_immediate_value(text_input_idx, &mut core),
        "hello there"
    );
    assert_eq!(get_value(text_input_idx, &mut core), "hello there");
}

/// When have two grand children, `UpdateImmediateValue` still works,
/// but `UpdateValue` reverts both to their original value
#[test]
fn value_and_immediate_value_with_two_grandchildren_respond_to_actions() {
    let dast_root =
        dast_root_no_position(r#"<textInput><text><text>hello</text> there</text></textInput>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // both variables are initialized to blank strings
    assert_eq!(
        get_immediate_value(text_input_idx, &mut core),
        "hello there"
    );
    assert_eq!(get_value(text_input_idx, &mut core), "hello there");

    // Since immediate_value isn't directly tied to the children, it can be updated
    let type_word_action = update_immediate_value_action(String::from("bye"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "hello there");

    // However, attempting to update value fails and both value and immediate value revert
    // to the values prescribed from the children
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(
        get_immediate_value(text_input_idx, &mut core),
        "hello there"
    );
    assert_eq!(get_value(text_input_idx, &mut core), "hello there");
}

/// Children of text input will be used rather than prefill
#[test]
fn text_input_child_supersedes_prefill() {
    let dast_root = dast_root_no_position(r#"<textInput prefill="ignored">hello</textInput>"#);
    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    // the text input will be index 1, as the document tag will be index 0.
    let text_input_idx = 1;

    // both variables are initialized to blank strings
    assert_eq!(get_immediate_value(text_input_idx, &mut core), "hello");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");

    // The UpdateImmediateValue action (which should be in response to typing characters)
    // should only update the immediate_value state variable
    let type_word_action = update_immediate_value_action(String::from("bye"), text_input_idx);

    let _ = core.dispatch_action(type_word_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "hello");

    // The UpdateValue action (which should corresponds to pressing enter or blurring)
    // should update value to match immediate value
    let press_enter_action = update_value_action(text_input_idx);

    let _ = core.dispatch_action(press_enter_action);

    assert_eq!(get_immediate_value(text_input_idx, &mut core), "bye");
    assert_eq!(get_value(text_input_idx, &mut core), "bye");
}

//! An evaluation inside math (`<math>$$f(x) + 1</math>`, an `<evaluate>`
//! in math text) is its function's formula with the inputs substituted,
//! inlined when compiled, when the function is a plain formula; any other
//! function is refused where the evaluation is written (ADR 0088).

mod common;
use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

fn refusal(src: &str) -> String {
    let doc = load(src).unwrap();
    doc.diagnostics()
        .iter()
        .find(|d| d.message.contains("evaluat"))
        .unwrap_or_else(|| panic!("{src}: not refused: {:?}", doc.diagnostics()))
        .message
        .clone()
}

#[test]
fn an_evaluation_in_math_is_the_formula_at_its_input() {
    let doc = load(
        r#"<function name="f">x^2</function>
           <math name="m">$$f(2) + 1</math>
           <math name="s">$$f(y + 1)</math>
           <math name="n">$$f($$f(2))</math>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(v(&doc, "m", "value"), 5.0);
    assert_eq!(text(&doc, "s"), "(y + 1)^2");
    assert_eq!(v(&doc, "n", "value"), 16.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn an_inlined_evaluation_follows_its_inputs_and_the_numbers_its_formula_reads() {
    let mut doc = load(
        r#"<numberInput name="a" value="2"><label>a</label></numberInput>
           <numberInput name="n" value="3"><label>n</label></numberInput>
           <function name="g">$a x + 1</function>
           <math name="m">$$g($n) + 1</math>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(v(&doc, "m", "value"), 8.0);
    set(&mut doc, "n", "value", 5.0);
    assert_eq!(v(&doc, "m", "value"), 12.0);
    set(&mut doc, "a", "value", -1.0);
    assert_eq!(v(&doc, "m", "value"), -3.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_function_of_several_variables_takes_its_inputs_in_order() {
    let doc = load(
        r#"<function name="h" variables="s t">s - t</function>
           <math name="m">$$h(5, 3)</math>
           <math name="spread">$$h((5, 3))</math>
           <math name="sym">$$h(q, 3)</math>
           <function name="k" variables="u v"><evaluate function="$h" input="u v"/> + 1</function>
           <evaluate name="k1" function="$k" input="7 2"/>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(v(&doc, "m", "value"), 2.0);
    assert_eq!(v(&doc, "spread", "value"), 2.0);
    assert_eq!(text(&doc, "sym"), "q - 3");
    assert_eq!(v(&doc, "k1", "value"), 6.0);
}

#[test]
fn a_function_defined_by_an_evaluation_is_one_formula() {
    let doc = load(
        r#"<function name="f">x^2</function>
           <function name="g">$$f(x + 1) + 1</function>
           <evaluate name="g2" function="$g" input="2"/>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(v(&doc, "g2", "value"), 10.0);
}

#[test]
fn an_evaluation_in_a_repeat_reads_a_function_outside_it() {
    let doc = load(
        r#"<number name="c">10</number>
           <function name="f">x^2 + $c</function>
           <p name="p"><repeatForSequence from="1" to="3" valueName="v"><math>$$f($v)</math></repeatForSequence></p>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(text(&doc, "p"), "11, 14, 19");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn an_evaluation_of_any_other_function_stays_refused() {
    for (src, why) in [
        (
            r#"<function name="f" domain="(0, 2]">x^2</function><math>$$f(1)</math>"#,
            "'domain'",
        ),
        (
            r#"<function name="f" symbolic="false">x^2</function><math>$$f(1)</math>"#,
            "not symbolic",
        ),
        (
            r#"<function name="f" through="(1,2) (3,4)"/><math>$$f(1)</math>"#,
            "'through'",
        ),
        (
            r#"<math name="g">x^2</math><function name="f">$g + 1</function><math>$$f(1)</math>"#,
            "which is no number",
        ),
        (
            r#"<function name="g">x^2</function><function name="f">$g</function><math>$$f(1)</math>"#,
            "which is no number",
        ),
        (
            r#"<function name="f">x^2</function><derivative name="d">$f</derivative><math>$$d(1)</math>"#,
            "no <function>",
        ),
        (
            r#"<function name="f" variables="s t">s t</function><math>$$f(1)</math>"#,
            "at 1 inputs, where it takes 2",
        ),
        (
            r#"<function name="f">$$f(x)</function><math>$$f(1)</math>"#,
            "evaluates itself",
        ),
        (
            r#"<function name="f">ax</function><math>$$f(1)</math>"#,
            "'ax'",
        ),
    ] {
        let m = refusal(src);
        assert!(m.contains(why), "{src}: {m}");
    }
    // A condition reads no element (COMP-1, on hold).
    for src in [
        r#"<function name="f">x^2</function><boolean>$$f(2) > 3</boolean>"#,
        r#"<function name="f">x^2</function><answer><award><when>$$f(2) > 3</when></award></answer>"#,
    ] {
        let m = refusal(src);
        assert!(m.contains("inside a"), "{src}: {m}");
    }
}

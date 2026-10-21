//! `<answer>` and its `<mathInput>`, drawn by shapes (ADR 0016).

use cells_core::spec;

spec! {
    answer;

    case "an answer draws its input, a Submit button and its credit" {
        doenet r#"<p name="q"><answer name="a"><mathInput name="mi"/><award>5x^4</award></answer></p>"#;
        expect { "a.credit" = 0, "a.numSubmissions" = 0 }
        shape { "a" = "answer", "mi" = "mathInput" }
        // The button and the credit have no print form.
        export { "q" = r#"<p><m><fillin characters="8" /></m></p>"# }
    }
}

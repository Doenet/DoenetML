//! `<fractionInput>`: its owned numerator and denominator inputs and the
//! fraction they make, as the current core's `fractioninput.test.ts`
//! ("prefill numerator and denominator"). Typing into a box is in
//! `tests/fraction_input.rs`.

use crate::spec;

const NAN: f64 = f64::NAN;

spec! {
    fraction_input;

    case "the prefills make the fraction" {
        doenet r#"<fractionInput name="fi" prefillNumerator="6" prefillDenominator="4"/>
                  <number name="n">$fi + 1</number>"#;
        expect { "fi.value" = 1.5, "n.value" = 2.5 }
    }

    case "with no prefill the fraction is blank" {
        doenet r#"<fractionInput name="fi"/>"#;
        expect { "fi.value" = NAN }
    }
}

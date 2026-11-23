//! `<fractionInput>`: its owned numerator and denominator inputs and the
//! fraction they make, as the current core's `fractioninput.test.ts`
//! ("prefill numerator and denominator"). Typing into a box is in
//! `tests/fraction_input.rs`.

use crate::spec;

spec! {
    fraction_input;

    case "the prefills make the fraction" {
        doenet r#"<fractionInput name="fi" prefillNumerator="6" prefillDenominator="4"/>
                  <number name="n">$fi + 1</number>"#;
        expect { "fi.value" = 1.5, "n.value" = 2.5 }
    }

    // Blank inputs make a blank fraction, whose value is missing: a number
    // cannot hold a blank (D40, ADR 0046).
    case "with no prefill the fraction is blank" {
        doenet r#"<fractionInput name="fi"/>"#;
        expect { "fi.value" = crate::program::MISSING }
    }
}

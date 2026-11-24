//! `<sampleRandomNumbers>`: `numSamples` numbers drawn at load from the
//! document seed (`selectsamplerandomnumbers.test.ts`).

use crate::spec;

spec! {
    sample_random_numbers;

    case "samples of a discrete uniform" {
        doenet r#"<sampleRandomNumbers name="s" type="discreteUniform" from="10" step="10" to="30" numSamples="5"/>"#;
        expect { "s.numComponents" = 5, "s.numbers" = [30, 30, 20, 30, 30] }
    }

    case "one sample by default" {
        doenet r#"<sampleRandomNumbers name="s" from="-1" to="1"/>
                  <isBetween name="in" limits="-1 1">$s</isBetween>"#;
        expect { "s.numComponents" = 1, "in.value" = 1 }
    }

    case "a sample count that is no whole number is refused" {
        doenet r#"<sampleRandomNumbers name="s" numSamples="2.5"/>"#;
        diagnostics["cells-bad-attribute-value"]
    }

    case "the distribution's moments" {
        doenet r#"<sampleRandomNumbers name="s" type="discreteUniform" from="2" to="8" step="2" numSamples="3"/>"#;
        expect { "s.mean" = 5, "s.variance" = 5, "s.numComponents" = 3 }
    }
}

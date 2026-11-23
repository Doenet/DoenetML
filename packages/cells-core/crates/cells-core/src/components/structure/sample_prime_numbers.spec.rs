//! `<samplePrimeNumbers>`: `numSamples` primes drawn independently at load
//! from the document seed (`sampleprimenumbers.test.ts`).

use crate::spec;

spec! {
    sample_prime_numbers;

    case "samples may repeat a prime" {
        doenet r#"<samplePrimeNumbers name="s" from="2" to="5" numSamples="6"/>"#;
        expect { "s.numComponents" = 6, "s.numbers" = [5, 5, 3, 5, 5, 3] }
    }

    case "one sample from 2 to 100 by default" {
        doenet r#"<samplePrimeNumbers name="s"/>"#;
        expect { "s.numComponents" = 1, "s.number1" = 83 }
    }

    case "an empty range is refused" {
        doenet r#"<samplePrimeNumbers name="s" from="24" to="28"/>"#;
        diagnostics["cells-choice-domain"]
    }
}

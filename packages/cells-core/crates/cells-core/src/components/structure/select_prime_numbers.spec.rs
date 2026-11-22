//! `<selectPrimeNumbers>`: primes drawn at load from the document seed
//! (`selectprimenumbers.test.ts`), and the ranges the check refuses (ADR
//! 0037).

use crate::spec;

spec! {
    select_prime_numbers;

    case "one prime from 2 to 6" {
        doenet r#"<selectPrimeNumbers name="s" from="2" to="6"/>"#;
        expect { "s.numComponents" = 1, "s.number1" = 5 }
    }

    case "every prime up to 5, sorted" {
        doenet r#"<selectPrimeNumbers name="s" to="5" numToSelect="3" sort/>"#;
        expect { "s.numbers" = [2, 3, 5] }
    }

    case "the first ten primes, without replacement, decreasing" {
        doenet r#"<selectPrimeNumbers name="s" to="29" numToSelect="10" sort="decreasing"/>"#;
        expect { "s.numbers" = [29, 23, 19, 17, 13, 11, 7, 5, 3, 2] }
    }

    case "excluded primes are never drawn" {
        doenet r#"<selectPrimeNumbers name="s" from="1020" to="1050" exclude="1031 1049" numToSelect="3" sort/>"#;
        expect { "s.numbers" = [1021, 1033, 1039] }
    }

    case "with replacement, in the order drawn" {
        doenet r#"<selectPrimeNumbers name="s" from="2" to="3" numToSelect="5" withReplacement/>"#;
        expect { "s.numbers" = [3, 3, 2, 3, 3] }
    }

    case "more primes than the range holds is refused" {
        doenet r#"<selectPrimeNumbers name="s" from="8" to="12" numToSelect="2"/>"#;
        diagnostics["cells-choice-domain"]
    }

    case "a range from a constant" {
        doenet r#"<number name="n">7</number>
                  <selectPrimeNumbers name="s" from="$n" to="$n" />"#;
        expect { "s.numbers" = 7 }
    }

    case "excludeCombinations is refused" {
        doenet r#"<selectPrimeNumbers name="s" numToSelect="2" excludeCombinations="(2, 3)"/>"#;
        diagnostics["cells-unsupported"]
    }
}

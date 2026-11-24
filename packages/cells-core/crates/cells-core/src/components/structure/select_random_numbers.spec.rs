//! `<selectRandomNumbers>`: numbers drawn at load from the document seed,
//! within what the distribution allows (`selectsamplerandomnumbers.test.ts`),
//! and the parameters the check refuses (ADR 0037).

use crate::spec;

spec! {
    select_random_numbers;

    case "one uniform number, between from and to" {
        doenet r#"<selectRandomNumbers name="s" from="3" to="5"/>
                  <isBetween name="in" limits="3 5">$s</isBetween>"#;
        expect { "s.numComponents" = 1, "in.value" = 1 }
    }

    case "uniform by default, from 0 to 1" {
        doenet r#"<selectRandomNumbers name="s" numToSelect="3"/>
                  <isBetween name="a" limits="0 1">$s[1]</isBetween>
                  <isBetween name="b" limits="0 1">$s[2]</isBetween>
                  <isBetween name="c" limits="0 1">$s[3]</isBetween>"#;
        expect { "s.numComponents" = 3, "a.value" = 1, "b.value" = 1, "c.value" = 1 }
    }

    case "discrete uniform: values of the sequence, less what it excludes" {
        doenet r#"<selectRandomNumbers name="s" type="discreteUniform" from="1" to="3" exclude="2" numToSelect="4"/>"#;
        expect { "s.numbers" = [3, 3, 1, 3] }
    }

    case "gaussian, about its mean" {
        doenet r#"<selectRandomNumbers name="s" type="gaussian" mean="100" standardDeviation="0.001"/>
                  <isBetween name="near" limits="99.9 100.1">$s</isBetween>"#;
        expect { "near.value" = 1 }
    }

    case "a parameter from a constant" {
        doenet r#"<number name="n">10</number>
                  <selectRandomNumbers name="s" type="discreteUniform" from="$n" to="$n + 2"/>
                  <isBetween name="in" limits="10 12">$s</isBetween>"#;
        expect { "in.value" = 1 }
    }

    case "a parameter a student can change is refused" {
        doenet r#"<numberInput name="n" value="10"><label>n</label></numberInput>
                  <selectRandomNumbers name="s" to="$n"/>"#;
        diagnostics["cells-choice-not-constant"]
    }

    case "a discrete sequence that excludes every value is refused" {
        doenet r#"<selectRandomNumbers name="s" type="discreteUniform" from="1" to="2" exclude="1 2"/>"#;
        diagnostics["cells-choice-domain"]
    }

    case "an unknown type is refused" {
        doenet r#"<selectRandomNumbers name="s" type="poisson"/>"#;
        diagnostics["cells-unsupported"]
    }

    case "the distribution's moments: uniform" {
        doenet r#"<selectRandomNumbers name="s" from="0" to="6"/>"#;
        expect { "s.mean" = 3, "s.variance" = 3, "s.standardDeviation" = 3f64.sqrt() }
    }

    case "the distribution's moments: discrete, less what it excludes" {
        doenet r#"<selectRandomNumbers name="s" type="discreteUniform" from="1" to="5" exclude="2" numToSelect="0"/>"#;
        expect { "s.mean" = 3.25, "s.variance" = 2.1875, "s.standardDeviation" = 2.1875f64.sqrt(), "s.numComponents" = 0 }
    }

    case "a gaussian by its variance" {
        doenet r#"<selectRandomNumbers name="s" type="gaussian" mean="100" variance="4"/>"#;
        expect { "s.mean" = 100, "s.variance" = 4, "s.standardDeviation" = 2 }
    }

    case "discrete defaults: two values from from, past what it excludes" {
        doenet r#"<selectRandomNumbers name="a" type="discreteUniform" exclude="0 2"/>
                  <selectRandomNumbers name="b" type="discreteUniform" from="6.5" exclude="6.5 8.5"/>"#;
        expect { "a.mean" = 2, "a.variance" = 1, "b.mean" = 8.5 }
    }

    case "discrete defaults: down from to, toward 0" {
        doenet r#"<selectRandomNumbers name="s" type="discreteUniform" to="5.5"/>
                  <isBetween name="in" limits="0.5 5.5">$s</isBetween>"#;
        expect { "s.mean" = 3, "in.value" = 1 }
    }
}

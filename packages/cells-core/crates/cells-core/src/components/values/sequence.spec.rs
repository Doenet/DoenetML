//! `<sequence>`: numbers from whichever of `from`, `to`, `step` and
//! `length` are given, as the current core counts them
//! (`sequence.test.ts`).

use crate::spec;

spec! {
    sequence;

    case "from and to, by every name and by index" {
        doenet r#"<sequence name="s" from="1" to="5"/>
                  <number name="third">$s[3]</number>"#;
        expect {
            "s.numbers" = [1, 2, 3, 4, 5], "s.values" = [1, 2, 3, 4, 5],
            "s.number2" = 2, "s.numComponents" = 5, "third.value" = 3,
        }
    }

    case "nothing given: one to ten" {
        doenet r#"<sequence name="s"/>"#;
        expect { "s.numbers" = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }

    case "from, step and length" {
        doenet r#"<sequence name="s" from="2" step="3" length="3"/>"#;
        expect { "s.numbers" = [2, 5, 8] }
    }

    case "to alone counts from 1" {
        doenet r#"<sequence name="s" to="4"/>"#;
        expect { "s.numbers" = [1, 2, 3, 4] }
    }

    case "to and length end at to" {
        doenet r#"<sequence name="s" to="10" step="2" length="3"/>"#;
        expect { "s.numbers" = [6, 8, 10] }
    }

    case "from, to and length give the step" {
        doenet r#"<sequence name="s" from="0" to="1" length="5"/>"#;
        expect { "s.numbers" = [0.0, 0.25, 0.5, 0.75, 1.0] }
    }

    case "a negative step, stopping before to" {
        doenet r#"<sequence name="s" from="10" to="3" step="-3"/>"#;
        expect { "s.numbers" = [10, 7, 4] }
    }

    case "excluded values are left out" {
        doenet r#"<sequence name="s" from="1" to="6" exclude="2 5"/>"#;
        expect { "s.numbers" = [1, 3, 4, 6], "s.numComponents" = 4 }
    }

    case "an empty sequence" {
        doenet r#"<sequence name="s" from="5" to="1"/>"#;
        expect { "s.numComponents" = 0 }
    }

    case "a count that follows a reference is a structural sequence" {
        doenet r#"<number name="n">4</number>
                  <sequence name="s" to="$n"/>"#;
        expect { "s.numComponents" = 4 }
    }

    case "its entries among a list's and an operator's children" {
        doenet r#"<sequence name="s" from="2" to="4"/>
                  <numberList name="l">$s 7</numberList>
                  <sum name="t">$s</sum>"#;
        expect { "l.numbers" = [2, 3, 4, 7], "t.value" = 9 }
    }
}

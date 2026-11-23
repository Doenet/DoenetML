//! `<abs>`: the absolute value of its children, and a request through it.

use crate::spec;

spec! {
    abs;

    case "a literal, a reference and math over one" {
        doenet r#"<number name="n">-3</number>
                  <abs name="a">-5.3</abs>
                  <abs name="b">$n</abs>
                  <abs name="c">$n - 5</abs>"#;
        expect { "a.value" = 5.3, "b.value" = 3, "c.value" = 8 }
    }

    case "nothing: no value; over math, its absolute value (ADR 0043)" {
        doenet r#"<abs name="a"/><abs name="b">-x</abs><abs name="c">-log(31)</abs>"#;
        expect {
            "a.value" = f64::NAN, "a.expr" = "", "b.expr" = "|-x|", "b.value" = f64::NAN,
            "c.expr" = "3.4339872044851463", "c.value" = 31f64.ln(),
        }
    }

    case "over a math input: an expression, a number when it is one" {
        doenet r#"<mathInput name="mi" prefill="x"><label>m</label></mathInput>
                  <abs name="a">$mi</abs>"#;
        expect { "a.expr" = "|x|" }
        request { "mi.value" = -3 }
        expect { "a.expr" = "3", "a.value" = 3 }
    }

    case "a request writes the asked value, and 0 for a negative one" {
        doenet r#"<abs name="a">-9</abs>
                  <mathInput name="mi" bindValueTo="$a"><label>m</label></mathInput>"#;
        expect { "a.value" = 9, "mi.value" = 9 }
        request { "mi.value" = -3 }
        expect { "a.value" = 0, "a.operand" = 0 }
        request { "mi.value" = 7 }
        expect { "a.value" = 7, "a.operand" = 7 }
    }

    case "a request through a reference writes its source" {
        doenet r#"<number name="n">-2</number>
                  <abs name="a">$n</abs>
                  <mathInput name="mi" bindValueTo="$a"><label>m</label></mathInput>"#;
        request { "mi.value" = 4 }
        expect { "n.value" = 4, "a.value" = 4 }
    }

    case "a copy shares its value" {
        doenet r#"<abs name="a">-2</abs><abs name="b" extend="$a"/>
                  <number name="n">$a</number>"#;
        expect { "b.value" = 2, "n.value" = 2 }
    }
}

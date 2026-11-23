//! `<variance>` and `<standardDeviation>`: a sample's or a population's
//! spread of their operands.

use crate::spec;

spec! {
    variance;

    case "a sample's, by default" {
        doenet r#"<variance name="v">1 2 3 4</variance>
                  <standardDeviation name="s">1 2 3 4</standardDeviation>"#;
        expect {
            "v.value" = 5.0 / 3.0, "s.value" = (5.0f64 / 3.0).sqrt(), "v.population" = 0,
        }
    }

    case "a population's" {
        doenet r#"<variance name="v" population>1 2 3 4</variance>
                  <standardDeviation name="s" population="true">1 2 3 4</standardDeviation>"#;
        expect { "v.value" = 1.25, "s.value" = 1.25f64.sqrt(), "v.population" = 1 }
    }

    case "of references, a population's while a box is checked" {
        doenet r#"<booleanInput name="pop"><label>p</label></booleanInput>
                  <number name="a">2</number>
                  <variance name="v" population="$pop">$a 4</variance>"#;
        expect { "v.value" = 2 }
        request { "pop.value" = 1 }
        expect { "v.value" = 1 }
    }

    case "one operand: a sample's has no value; none: no value" {
        doenet r#"<variance name="v">5</variance><variance name="p" population>5</variance>
                  <standardDeviation name="s"/>"#;
        expect { "v.value" = f64::NAN, "p.value" = 0, "s.value" = f64::NAN }
    }

    case "over math: its expression, when population is written" {
        doenet r#"<variance name="v">x y</variance>
                  <variance name="p" population>x y</variance>
                  <standardDeviation name="s" population>x 1</standardDeviation>"#;
        expect {
            "v.expr" = "(x^2 + y^2 - (x + y)^2/2)/1",
            "p.expr" = "(x^2 + y^2 - (x + y)^2/2)/2",
            "s.expr" = "sqrt((x^2 + 1^2 - (x + 1)^2/2)/2)",
        }
    }
}

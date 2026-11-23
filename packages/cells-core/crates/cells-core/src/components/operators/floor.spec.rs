//! `<floor>`: its children rounded down, within roundoff, and a request
//! through it.

use crate::spec;

spec! {
    floor;

    case "rounded down, and math over references" {
        doenet r#"<floor name="f1">55.3252326</floor>
                  <number name="c">4</number>
                  <floor name="f2">$f1/$c</floor>
                  <floor name="f3">-2.5</floor>"#;
        expect { "f1.value" = 55, "f2.value" = 13, "f3.value" = -3 }
    }

    case "a value within roundoff of an integer is that integer" {
        doenet r#"<floor name="f">3.999999999999999</floor>"#;
        expect { "f.value" = 4 }
    }

    case "a copy has its value" {
        doenet r#"<floor name="f">7.5</floor><floor name="g" extend="$f"/>"#;
        expect { "g.value" = 7 }
    }

    case "a request writes the asked value rounded down" {
        doenet r#"<number name="n">6.1</number><floor name="f">$n</floor>
                  <mathInput name="mi" bindValueTo="$f"><label>m</label></mathInput>"#;
        expect { "f.value" = 6 }
        request { "mi.value" = 3.7 }
        expect { "n.value" = 3, "f.value" = 3 }
    }

    case "over math: floor(..), a number when it evaluates to one" {
        doenet r#"<floor name="a">2.1x</floor><floor name="b">log(31)</floor>"#;
        expect { "a.expr" = "floor(2.1 x)", "a.value" = f64::NAN, "b.expr" = "3", "b.value" = 3 }
    }
}

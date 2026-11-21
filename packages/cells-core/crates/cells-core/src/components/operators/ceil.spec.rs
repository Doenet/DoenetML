//! `<ceil>`: its children rounded up, within roundoff, and a request
//! through it.

use crate::spec;

spec! {
    ceil;

    case "rounded up, and math over references" {
        doenet r#"<ceil name="c1">3.43</ceil>
                  <number name="f">55</number>
                  <ceil name="c2">$c1/$f</ceil>
                  <ceil name="c3">-2.5</ceil>"#;
        expect { "c1.value" = 4, "c2.value" = 1, "c3.value" = -2 }
    }

    case "a value within roundoff of an integer is that integer" {
        doenet r#"<ceil name="c">-6999.999999999999</ceil>"#;
        expect { "c.value" = -7000 }
    }

    case "a request writes the asked value rounded up" {
        doenet r#"<number name="n">6.1</number><ceil name="c">$n</ceil>
                  <mathInput name="mi" bindValueTo="$c"><label>m</label></mathInput>"#;
        expect { "c.value" = 7 }
        request { "mi.value" = 3.2 }
        expect { "n.value" = 4, "c.value" = 4 }
    }
}

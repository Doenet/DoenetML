//! `<wrapNumberPeriodic>`: its children wrapped into the interval between
//! the bounds, and a request through it.

use crate::spec;

spec! {
    wrap_number_periodic;

    case "into [0, 1) by default" {
        doenet r#"<wrapNumberPeriodic name="a">55.25</wrapNumberPeriodic>
                  <wrapNumberPeriodic name="b">-55.25</wrapNumberPeriodic>
                  <wrapNumberPeriodic name="c">0.5</wrapNumberPeriodic>"#;
        expect { "a.value" = 0.25, "b.value" = 0.75, "c.value" = 0.5 }
    }

    case "between bounds of its own (either order), and math over a reference" {
        doenet r#"<number name="n">4</number>
                  <wrapNumberPeriodic name="a" lowerValue="10" upperValue="40">55.5</wrapNumberPeriodic>
                  <wrapNumberPeriodic name="b" lowerValue="10" upperValue="40">12</wrapNumberPeriodic>
                  <wrapNumberPeriodic name="c" lowerValue="10" upperValue="40">-12$n</wrapNumberPeriodic>
                  <wrapNumberPeriodic name="d" lowerValue="40" upperValue="10">55.5</wrapNumberPeriodic>
                  <wrapNumberPeriodic name="e" lowerValue="5" upperValue="5">55.5</wrapNumberPeriodic>"#;
        expect {
            "a.value" = 25.5, "b.value" = 12, "c.value" = 12, "d.value" = 25.5, "e.value" = 5,
            "a.lowerValue" = 10, "a.upperValue" = 40,
        }
    }

    case "a request writes the asked value wrapped" {
        doenet r#"<number name="n">12</number>
                  <wrapNumberPeriodic name="w" lowerValue="10" upperValue="40">$n</wrapNumberPeriodic>
                  <mathInput name="mi" bindValueTo="$w"><label>m</label></mathInput>"#;
        request { "mi.value" = 45 }
        expect { "n.value" = 15, "w.value" = 15 }
    }
}

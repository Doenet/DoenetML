//! `<round>`: to decimal places or significant digits, halves away from
//! zero, and a request through it.

use crate::spec;

spec! {
    round;

    case "to an integer by default, halves away from zero" {
        doenet r#"<round name="a">55.3252326</round>
                  <round name="b">0.5</round>
                  <round name="c">-2.5</round>"#;
        expect { "a.value" = 55, "b.value" = 1, "c.value" = -3, "a.numDecimals" = 0 }
    }

    case "to decimal places, through the shortest decimal spelling" {
        doenet r#"<round name="a" numDecimals="1">55.3252326</round>
                  <round name="b" numDecimals="3">0.5555</round>
                  <round name="c" numDecimals="3">1/3</round>
                  <round name="d" numDecimals="-6">1524031234</round>"#;
        expect { "a.value" = 55.3, "b.value" = 0.556, "c.value" = 0.333, "d.value" = 1524000000 }
    }

    case "to significant digits" {
        doenet r#"<round name="a" numDigits="3">55.3252326</round>
                  <round name="b" numDigits="5">0.555555</round>
                  <round name="c" numDigits="4">2/7</round>"#;
        expect { "a.value" = 55.3, "b.value" = 0.55556, "c.value" = 0.2857, "a.numDigits" = 3 }
    }

    case "places from a reference, and a copy" {
        doenet r#"<number name="k">2</number>
                  <round name="a" numDecimals="$k">2.71828</round>
                  <round name="b" extend="$a"/>"#;
        expect { "a.value" = 2.72, "b.value" = 2.72 }
    }

    case "a request writes the asked value rounded" {
        doenet r#"<number name="n">1.04</number>
                  <round name="r" numDecimals="1">$n</round>
                  <mathInput name="mi" bindValueTo="$r"><label>m</label></mathInput>"#;
        expect { "r.value" = 1 }
        request { "mi.value" = 2.47 }
        expect { "n.value" = 2.5, "r.value" = 2.5 }
    }

    case "over math: every number in it rounded, constants floated" {
        doenet r#"<round name="a">log(31)</round>
                  <round name="b" numDecimals="2">log(31)</round>
                  <round name="c" numDigits="3">sin(55.3252326 x)</round>
                  <round name="d" numDecimals="-6">exp(20) pi</round>"#;
        expect {
            "a.expr" = "3", "a.value" = 3, "b.value" = 3.43, "c.expr" = "sin(55.3 x)",
            "d.value" = 1524000000,
        }
    }
}

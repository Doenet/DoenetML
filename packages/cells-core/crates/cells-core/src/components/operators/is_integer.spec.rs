//! `<isInteger>`: whether its children are an integer.

use crate::spec;

spec! {
    is_integer;

    case "integers, within roundoff, and not" {
        doenet r#"<number name="n">7</number>
                  <isInteger name="a">3</isInteger>
                  <isInteger name="b">3.5</isInteger>
                  <isInteger name="c">$n/7</isInteger>
                  <isInteger name="d">-4</isInteger>
                  <isInteger name="e"/>
                  <isInteger name="f">x</isInteger>"#;
        expect {
            "a.value" = 1, "b.value" = 0, "c.value" = 1, "d.value" = 1, "e.value" = 0,
            "f.value" = 0,
        }
    }

    case "follows an input" {
        doenet r#"<mathInput name="mi" prefill="2"><label>m</label></mathInput>
                  <isInteger name="a">$mi/2</isInteger>"#;
        expect { "a.value" = 1 }
        request { "mi.value" = 3 }
        expect { "a.value" = 0 }
    }
}

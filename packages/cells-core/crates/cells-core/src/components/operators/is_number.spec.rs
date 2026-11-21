//! `<isNumber>`: whether its children are a finite number.

use crate::spec;

spec! {
    is_number;

    case "numbers, and what is not one" {
        doenet r#"<number name="n">7</number>
                  <isNumber name="a">3</isNumber>
                  <isNumber name="b">$n/2</isNumber>
                  <isNumber name="c">1/0</isNumber>
                  <isNumber name="d"/>
                  <isNumber name="e">x</isNumber>"#;
        expect { "a.value" = 1, "b.value" = 1, "c.value" = 0, "d.value" = 0, "e.value" = 0 }
    }
}

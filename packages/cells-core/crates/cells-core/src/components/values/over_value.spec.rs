//! A list over a math value (ADR 0063): its count follows the value, a
//! change of it a rebuild, and each entry is entry `k` of the value read as
//! a list's (`mathlist.test.ts`, `functionTag.test.ts`).

use crate::spec;

spec! {
    over_value;

    case "a math list over a math input's typed list" {
        doenet r#"<mathInput name="mi" prefill="1, x, 3"/>
                  <mathList name="l">$mi</mathList>
                  <math name="second">$l[2]</math>"#;
        expect { "l.numComponents" = 3, "second.expr" = "x" }
    }

    case "a math list over a math's value" {
        doenet r#"<math name="lm">1, 2, 3</math>
                  <mathList name="merged">$lm</mathList>
                  <mathList name="one">$lm[2]</mathList>"#;
        expect { "merged.numComponents" = 3, "one.numComponents" = 1 }
    }

    case "a number list over a math input evaluates each entry" {
        doenet r#"<mathInput name="mi" prefill="1, 2.5, 3"/>
                  <numberList name="l">$mi</numberList>
                  <number name="second">$l[2]</number>"#;
        expect { "l.numComponents" = 3, "second.value" = 2.5 }
    }

    case "a point list over a function's minima" {
        doenet r#"<function name="f">x^4-8x^2+8</function>
                  <pointList name="mn" extend="$f.minima"/>
                  <pointList name="gmin" extend="$f.globalMinimum"/>
                  <pointList name="gmax" extend="$f.globalMaximum"/>
                  <number name="x2" extend="$mn[2].x"/>"#;
        expect {
            "mn.numComponents" = 2, "x2.value" = 2,
            "gmin.numComponents" = 1, "gmax.numComponents" = 0,
        }
    }

    case "a list over another list stays a static list" {
        doenet r#"<mathList name="ml2">1 2 3</mathList>
                  <mathList name="l">$ml2</mathList>"#;
        expect { "l.numComponents" = 3 }
    }
}

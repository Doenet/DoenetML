//! `<isBetween>`: whether its children lie between two limits.

use crate::spec;

spec! {
    is_between;

    case "inside, on a limit, and outside, either order of limits" {
        doenet r#"<isBetween name="a" limits="1 5">3</isBetween>
                  <isBetween name="b" limits="5 1">5</isBetween>
                  <isBetween name="c" limits="1 5" strict>5</isBetween>
                  <isBetween name="d" limits="1 5">7</isBetween>
                  <isBetween name="e" limits="2 2">2</isBetween>
                  <isBetween name="f" limits="2 2" strict>2</isBetween>"#;
        expect {
            "a.value" = 1, "b.value" = 1, "c.value" = 0, "d.value" = 0, "e.value" = 1,
            "f.value" = 0, "c.strict" = 1,
        }
    }

    case "without both limits, nothing, or math with free symbols: false" {
        doenet r#"<isBetween name="a" limits="1">3</isBetween>
                  <isBetween name="b">3</isBetween>
                  <isBetween name="c" limits="1 5"/>
                  <isBetween name="d" limits="-1 5">x</isBetween>"#;
        expect { "a.value" = 0, "b.value" = 0, "c.value" = 0, "d.value" = 0 }
    }

    case "limits and strictness from references" {
        doenet r#"<mathInput name="x" prefill="2"><label>x</label></mathInput>
                  <number name="lo">2</number>
                  <booleanInput name="s"><label>s</label></booleanInput>
                  <isBetween name="ib" limits="$lo 4" strict="$s">$x</isBetween>"#;
        expect { "ib.value" = 1 }
        request { "s.value" = 1 }
        expect { "ib.value" = 0 }
        request { "x.value" = 3 }
        expect { "ib.value" = 1 }
    }
}

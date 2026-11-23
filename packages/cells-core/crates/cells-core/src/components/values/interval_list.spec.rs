//! `<intervalList>`: intervals from text pieces, references and element
//! children (ADR 0041). What the entries hold is checked in
//! `tests/shapes.rs`.

use crate::spec;

spec! {
    interval_list;

    case "a piece of text per interval" {
        doenet r#"<intervalList name="l">(1, 2) [3, 4] (5, 6]</intervalList>
                  <boolean name="b1">$l[1] = (1, 2)</boolean>
                  <boolean name="b2">$l[2] = [3, 4]</boolean>
                  <boolean name="b3">$l[1] = [1, 2]</boolean>"#;
        expect { "l.numComponents" = 3, "b1.value" = 1, "b2.value" = 1, "b3.value" = 0 }
    }

    case "a reference and an element child are entries" {
        doenet r#"<interval name="i">[0, 1)</interval>
                  <intervalList name="l">$i <interval>(2, 3)</interval></intervalList>
                  <boolean name="b">$l[2] = (2, 3)</boolean>"#;
        expect { "l.numComponents" = 2, "b.value" = 1 }
    }
}

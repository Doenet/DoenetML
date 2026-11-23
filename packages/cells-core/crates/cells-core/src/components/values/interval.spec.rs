//! `<interval>`: a math whose tuples and arrays of two are intervals (ADR
//! 0041, decision 8). What it holds is checked in `tests/shapes.rs`.

use crate::spec;

spec! {
    interval;

    case "(a, b) is the open interval, [a, b] the closed one" {
        doenet r#"<interval name="o">(1, 2)</interval>
                  <interval name="c">[1, 2]</interval>
                  <boolean name="b1">$o = (1, 2)</boolean>
                  <boolean name="b2">$c = [1, 2]</boolean>
                  <boolean name="b3">$o = $c</boolean>"#;
        expect { "b1.value" = 1, "b2.value" = 1, "b3.value" = 0 }
    }

    case "an end may be a reference" {
        doenet r#"<number name="n">3</number>
                  <interval name="i">($n, 5]</interval>
                  <boolean name="b">$i = (3, 5]</boolean>"#;
        expect { "b.value" = 1 }
    }
}

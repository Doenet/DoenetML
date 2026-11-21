//! `<setSmallToZero>`: a magnitude below the threshold is 0.

use crate::spec;

spec! {
    set_small_to_zero;

    case "below the default threshold, and above it" {
        doenet r#"<setSmallToZero name="a">1e-15</setSmallToZero>
                  <setSmallToZero name="b">1e-13</setSmallToZero>
                  <setSmallToZero name="c">-3</setSmallToZero>"#;
        expect { "a.value" = 0, "b.value" = 1e-13, "c.value" = -3, "a.threshold" = 1e-14 }
    }

    case "a threshold of its own" {
        doenet r#"<setSmallToZero name="a" threshold="0.1">-0.05</setSmallToZero>
                  <setSmallToZero name="b" threshold="0.1">0.2</setSmallToZero>"#;
        expect { "a.value" = 0, "b.value" = 0.2 }
    }

    case "a request writes the asked value, a small one as 0" {
        doenet r#"<number name="n">5</number>
                  <setSmallToZero name="s" threshold="0.01">$n</setSmallToZero>
                  <mathInput name="mi" bindValueTo="$s"><label>m</label></mathInput>"#;
        request { "mi.value" = 2 }
        expect { "n.value" = 2, "s.value" = 2 }
        request { "mi.value" = 0.001 }
        expect { "n.value" = 0, "s.value" = 0 }
    }
}

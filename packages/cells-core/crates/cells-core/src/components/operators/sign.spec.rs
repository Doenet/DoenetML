//! `<sign>`: -1, 0 or 1, and a request it drops.

use crate::spec;

spec! {
    sign;

    case "negative, positive and zero" {
        doenet r#"<sign name="a">-5.3</sign><sign name="b">63</sign><sign name="c">0</sign>"#;
        expect { "a.value" = -1, "b.value" = 1, "c.value" = 0 }
    }

    case "of a reference, and of nothing" {
        doenet r#"<number name="n">-0.5</number><sign name="a">$n</sign><sign name="b"/>"#;
        expect { "a.value" = -1, "b.value" = f64::NAN }
    }

    case "a request cannot change it" {
        doenet r#"<number name="n">4</number><sign name="s">$n</sign>
                  <mathInput name="mi" bindValueTo="$s"><label>m</label></mathInput>"#;
        // The lint sees, at load, that the input bound to it cannot write.
        diagnostics["cells-request-meets-no-inverse"]
        request { "mi.value" = -1 }
        dropped(1)
        expect { "s.value" = 1, "n.value" = 4 }
    }

    case "over math: sign(..), a number when it evaluates to one" {
        doenet r#"<sign name="a">-2y</sign><sign name="b">-log(3)</sign>"#;
        expect { "a.expr" = "sign(-2 y)", "a.value" = f64::NAN, "b.expr" = "-1", "b.value" = -1 }
    }
}

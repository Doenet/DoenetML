//! `<not>`: the negation of its content read as a `<boolean>`'s.

use crate::spec;

spec! {
    not;

    case "of literals" {
        doenet r#"<not name="t">true</not><not name="f">false</not><not name="b"/>"#;
        expect { "t.value" = 0, "f.value" = 1, "b.value" = 1 }
    }

    case "of a boolean input, which a request on it cannot change" {
        doenet r#"<booleanInput name="bi"><label>b</label></booleanInput>
                  <not name="n">$bi</not>
                  <booleanInput name="bn" bindValueTo="$n"><label>n</label></booleanInput>"#;
        // The lint sees, at load, that the input bound to it cannot write.
        diagnostics["cells-request-meets-no-inverse"]
        expect { "n.value" = 1 }
        request { "bi.value" = 1 }
        expect { "n.value" = 0 }
        request { "bn.value" = 1 }
        dropped(1)
        expect { "n.value" = 0, "bi.value" = 1 }
    }

    case "of a condition" {
        doenet r#"<mathInput name="mi" prefill="0"><label>m</label></mathInput>
                  <not name="n">$mi > 1</not>"#;
        expect { "n.value" = 1 }
        request { "mi.value" = 3 }
        expect { "n.value" = 0 }
    }
}

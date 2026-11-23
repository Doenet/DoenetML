//! A `<sequence>` whose count follows a value (ADR 0041, a structural
//! sequence): its numbers are counted when the document is built, and a
//! change of the count is a rebuild (`sequence.test.ts`).

use crate::spec;

spec! {
    structural_sequence;

    case "to follows a number input" {
        doenet r#"<numberInput name="n" value="3"/>
                  <sequence name="s" from="2" to="$n"/>
                  <number name="second">$s[2]</number>"#;
        expect { "s.numComponents" = 2, "second.value" = 3 }
        request { "n.value" = 5 }
        expect { "s.numComponents" = 4, "second.value" = 3 }
        request { "n.value" = 1 }
        expect { "s.numComponents" = 0 }
    }

    case "length, step and from follow inputs" {
        doenet r#"<numberInput name="f" value="1"/><numberInput name="st" value="2"/>
                  <numberInput name="l" value="3"/>
                  <sequence name="s" from="$f" step="$st" length="$l"/>
                  <number name="third">$s[3]</number>"#;
        expect { "s.numComponents" = 3, "third.value" = 5 }
        request { "st.value" = 3 }
        expect { "third.value" = 7 }
        request { "f.value" = 0 }
        expect { "third.value" = 6 }
    }

    case "excludes that are references" {
        doenet r#"<numberInput name="x" value="2"/>
                  <sequence name="s" from="1" to="5" exclude="$x 4"/>
                  <number name="first">$s[1]</number><number name="second">$s[2]</number>"#;
        expect { "s.numComponents" = 3, "first.value" = 1, "second.value" = 3 }
        request { "x.value" = 1 }
        expect { "s.numComponents" = 3, "first.value" = 2, "second.value" = 3 }
    }

    case "math in a parameter" {
        doenet r#"<sequence name="s" from="1" to="2+3"/>"#;
        expect { "s.numComponents" = 5 }
    }

    case "all four given is refused" {
        doenet r#"<number name="n">4</number>
                  <sequence name="s" from="1" to="$n" step="1" length="4"/>"#;
        diagnostics["cells-unsupported"]
    }
}

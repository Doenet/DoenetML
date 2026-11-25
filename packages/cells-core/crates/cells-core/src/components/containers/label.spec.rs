//! `<label>`: its children as a group's, and its text as a value (ADR
//! 0075; `tests/label_references.rs` reads the text through `$P.label`,
//! as the specs read no strings).

use crate::spec;

spec! {
    label;

    case "a label holds its children, as a group does" {
        doenet r#"<numberInput name="n" value="3"><label>count</label></numberInput>
                  <label name="l">Q is <number name="k">$n + 1</number></label>"#;
        expect { "k.value" = 4 }
        request { "n.value" = 4 }
        expect { "k.value" = 5 }
    }
}

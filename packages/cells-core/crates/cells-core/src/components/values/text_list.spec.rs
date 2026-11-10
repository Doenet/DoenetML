//! `<textList>`: entries from text pieces and references (ADR 0041). Its
//! entries hold string ids, so what they read as text is checked in
//! `tests/sequence.rs`; here, their count and their index.

use crate::spec;

spec! {
    text_list;

    case "a piece of text per entry, brackets kept together" {
        doenet r#"<textList name="l">a (b c) d</textList>"#;
        expect { "l.numComponents" = 3, "l.numValues" = 3 }
    }

    case "a reference is an entry" {
        doenet r#"<text name="t">x</text><textList name="l">$t y</textList>
                  <text name="first">$l[1]</text>"#;
        expect { "l.numComponents" = 2 }
    }
}

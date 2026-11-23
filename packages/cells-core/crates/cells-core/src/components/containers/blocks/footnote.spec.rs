//! `<footnote>`: a marker in the text whose content is built like any
//! other's; its document-wide number is counted when read (ADR 0044,
//! `tests/counters.rs`).

use crate::spec;

spec! {
    footnote;

    case "a value in a footnote follows its source" {
        doenet r#"<numberInput name="n" value="1"/>
                  <p>A claim.<footnote>See page <number name="page">$n + 10</number>.</footnote></p>"#;
        expect { "page.value" = 11 }
        request { "n.value" = 4 }
        expect { "page.value" = 14 }
    }
}

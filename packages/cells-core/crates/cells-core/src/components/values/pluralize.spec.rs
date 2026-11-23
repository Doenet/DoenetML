//! `<pluralize>` (`pluralize.test.ts`): its value is a string id, so what
//! it shows is checked by the tests in `pluralize.rs`; here, that each
//! shape of text loads, its `basedOnNumber`, and what is refused.

use crate::spec;

spec! {
    pluralize;

    case "one word, and a number and a word, load" {
        doenet r#"<p><pluralize name="a">dog</pluralize>
                     <pluralize name="b">two mouse</pluralize>
                     <pluralize name="c" pluralForm="cheetahs">one thousand bus</pluralize></p>"#;
        expect { "a.basedOnNumber" = f64::NAN, "b.basedOnNumber" = f64::NAN }
    }

    case "basedOnNumber, literal or referred to" {
        doenet r#"<numberInput name="k" value="1"><label>k</label></numberInput>
                  <pluralize name="a" basedOnNumber="3">dog</pluralize>
                  <pluralize name="b" basedOnNumber="$k">goose</pluralize>"#;
        expect { "a.basedOnNumber" = 3, "b.basedOnNumber" = 1 }
        request { "k.value" = 2 }
        expect { "b.basedOnNumber" = 2 }
    }

    case "text whose nouns only a part-of-speech model finds is refused" {
        doenet r#"<pluralize>one big dog</pluralize>"#;
        diagnostics["cells-unsupported"]
    }

    case "text that is not literal is refused" {
        doenet r#"<text name="t">dog</text><pluralize>$t</pluralize>"#;
        diagnostics["cells-unsupported"]
    }
}

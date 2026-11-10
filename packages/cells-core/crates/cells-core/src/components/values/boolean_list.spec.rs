//! `<booleanList>`: entries from text pieces and references (ADR 0041).

use crate::spec;

spec! {
    boolean_list;

    case "true is 1 whatever its case, and anything else false" {
        doenet r#"<booleanList name="l">true False TRUE no</booleanList>"#;
        expect { "l.booleans" = [1, 0, 1, 0], "l.numComponents" = 4 }
    }

    case "an entry by a cell, and a reference as an entry" {
        doenet r#"<numberInput name="k" value="1"><label>k</label></numberInput>
                  <booleanInput name="b"><label>b</label></booleanInput>
                  <booleanList name="l">true $b</booleanList>
                  <boolean name="e">$l[$k]</boolean>"#;
        expect { "e.value" = 1, "l.booleans" = [1, 0] }
        request { "k.value" = 2 }
        expect { "e.value" = 0 }
        request { "b.value" = 1 }
        expect { "e.value" = 1 }
    }
}

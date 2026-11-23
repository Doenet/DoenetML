//! `<mathList>`: expressions from text pieces, references and element
//! children (ADR 0041). What the entries show is checked in
//! `tests/value_lists.rs`.

use crate::spec;

spec! {
    math_list;

    case "a piece of text per entry" {
        doenet r#"<mathList name="l">x y+1 3</mathList>"#;
        expect { "l.numComponents" = 3, "l.numValues" = 3 }
    }

    case "references and element children are entries, a list's spliced" {
        doenet r#"<math name="m">2z</math>
                  <number name="n">5</number>
                  <mathList name="a">a b</mathList>
                  <mathList name="l">$m $n <math>q</math> $a</mathList>"#;
        expect { "l.numComponents" = 5 }
    }

    case "maxNumber keeps the first entries" {
        doenet r#"<mathList name="l" maxNumber="2">x y z</mathList>"#;
        expect { "l.numComponents" = 2 }
    }
}

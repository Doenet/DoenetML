//! `<argMin>`, `<argMax>`, `<indexOf>` and `<searchSorted>`: a position
//! among their operands, as the current core's index operators give it
//! (`listoperators.test.ts`).

use crate::spec;

spec! {
    index_of;

    case "the least and the greatest, the first of equal ones" {
        doenet r#"<argMin name="lo">3 1 4 1 5 9 2 6</argMin>
                  <argMax name="hi">3 1 4 1 5 9 2 9</argMax>
                  <argMin name="none"></argMin>"#;
        expect { "lo.value" = 2, "hi.value" = 6, "none.value" = 0 }
    }

    case "the first equal to the target, or 0" {
        doenet r#"<indexOf name="i" target="20">10 20 30 20</indexOf>
                  <indexOf name="j" target="99">10 20 30</indexOf>"#;
        expect { "i.value" = 2, "j.value" = 0 }
    }

    case "a target from an input follows it" {
        doenet r#"<numberInput name="t" value="1"><label>t</label></numberInput>
                  <indexOf name="i" target="$t">10 20 30</indexOf>"#;
        expect { "i.value" = 0 }
        request { "t.value" = 30 }
        expect { "i.value" = 3 }
    }

    case "where the target goes among sorted values, before or after equal ones" {
        doenet r#"<searchSorted name="mid" target="25">10 20 30</searchSorted>
                  <searchSorted name="left" target="20">10 20 20 30</searchSorted>
                  <searchSorted name="right" target="20" side="right">10 20 20 30</searchSorted>
                  <searchSorted name="past" target="99">10 20 30</searchSorted>
                  <searchSorted name="empty" target="5"></searchSorted>"#;
        expect {
            "mid.value" = 3, "left.value" = 2, "right.value" = 4,
            "past.value" = 4, "empty.value" = 0,
        }
    }

    case "unsorted values get 0, unless allowUnsorted" {
        doenet r#"<searchSorted name="no" target="25">30 10 20</searchSorted>
                  <searchSorted name="yes" target="25" allowUnsorted>30 10 20</searchSorted>"#;
        expect { "no.value" = 0, "yes.value" = 3 }
    }

    // No position, as the current core's `listoperators.test.ts` has it.
    case "no target is a warning, and no position" {
        doenet r#"<indexOf name="i">10 20 30</indexOf>
                  <searchSorted name="s">10 20 30</searchSorted>"#;
        diagnostics["cells-index-no-target", "cells-index-no-target"]
        expect { "i.value" = 0, "s.value" = 0 }
    }

    // A text is a string id, which no number comparison orders.
    case "a text operand is refused" {
        doenet r#"<textList name="tl">pear apple</textList>
                  <argMin name="a">$tl</argMin>"#;
        diagnostics["cells-unsupported"]
    }

    case "a target on argMin is refused" {
        doenet r#"<argMin name="a" target="2">1 2</argMin>"#;
        diagnostics["cells-unsupported"]
    }
}

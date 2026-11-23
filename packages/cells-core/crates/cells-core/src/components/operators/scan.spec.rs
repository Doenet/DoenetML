//! `<cumulativeSum>`, `<cumulativeProduct>`, `<cumulativeMin>`,
//! `<cumulativeMax>` and `<differences>`: a list of numbers over the
//! prefixes of their operands, as the current core's list operators give
//! them (`listoperators.test.ts`).

use crate::spec;

spec! {
    scan;

    case "running sums, by every name and by index" {
        doenet r#"<cumulativeSum name="c">30 45 12 60</cumulativeSum>
                  <number name="last">$c[4]</number>"#;
        expect {
            "c.numbers" = [30, 75, 87, 147], "c.values" = [30, 75, 87, 147],
            "c.number2" = 75, "c.numComponents" = 4, "c.numValues" = 4,
            "last.value" = 147,
        }
    }

    case "running products" {
        doenet r#"<cumulativeProduct name="c">1 2 3 4 5</cumulativeProduct>"#;
        expect { "c.numbers" = [1, 2, 6, 24, 120] }
    }

    case "running minima and maxima" {
        doenet r#"<cumulativeMin name="lo">3 1 4 1 5 9 2 6</cumulativeMin>
                  <cumulativeMax name="hi">3 1 4 1 5 9 2 6</cumulativeMax>"#;
        expect {
            "lo.numbers" = [3, 1, 1, 1, 1, 1, 1, 1],
            "hi.numbers" = [3, 3, 4, 4, 5, 9, 9, 9],
        }
    }

    case "differences are one fewer than the operands" {
        doenet r#"<differences name="d">30 75 87 147</differences>"#;
        expect { "d.numbers" = [45, 12, 60], "d.numComponents" = 3 }
    }

    case "one operand, and none" {
        doenet r#"<cumulativeSum name="one">7</cumulativeSum>
                  <differences name="diffOne">7</differences>
                  <cumulativeSum name="none"></cumulativeSum>"#;
        expect {
            "one.numbers" = 7, "diffOne.numComponents" = 0,
            "none.numComponents" = 0,
        }
    }

    case "an operand from an input follows it" {
        doenet r#"<numberInput name="a" value="5"><label>a</label></numberInput>
                  <cumulativeSum name="c">1 $a 2</cumulativeSum>"#;
        expect { "c.numbers" = [1, 6, 8] }
        request { "a.value" = 10 }
        expect { "c.numbers" = [1, 11, 13] }
    }

    case "a request on an entry cannot change it" {
        doenet r#"<cumulativeSum name="c">1 2 3</cumulativeSum>
                  <mathInput name="mi" bindValueTo="$c[2]"><label>m</label></mathInput>"#;
        expect { "mi.value" = 3 }
        request { "mi.value" = 9 }
        dropped(1)
        expect { "c.numbers" = [1, 3, 6] }
    }

    case "a copy has the referent's entries" {
        doenet r#"<cumulativeSum name="c">1 2 3</cumulativeSum>
                  <cumulativeSum name="d" extend="$c"/>"#;
        expect { "d.numbers" = [1, 3, 6] }
    }

    case "a piece that is no number is refused" {
        doenet r#"<cumulativeSum name="c">x 1</cumulativeSum>"#;
        diagnostics["cells-unsupported"]
    }
}

//! `<sortIndices>`: the positions of its operands in sorted order
//! (`listoperators.test.ts`).

use crate::spec;

spec! {
    sort_indices;

    case "the positions of numbers in increasing order" {
        doenet r#"<numberList name="nl">30 10 20</numberList>
                  <sortIndices name="s">$nl</sortIndices>"#;
        expect { "s.numbers" = [2, 3, 1], "s.numComponents" = 3, "s.number1" = 2 }
    }

    case "texts are ordered alphabetically" {
        doenet r#"<textList name="tl">pear apple fig</textList>
                  <sortIndices name="s">$tl</sortIndices>"#;
        expect { "s.numbers" = [2, 3, 1] }
    }

    case "booleans order false before true" {
        doenet r#"<sortIndices name="s" type="boolean">true false true</sortIndices>"#;
        expect { "s.numbers" = [2, 1, 3] }
    }

    case "points order by a prop" {
        doenet r#"<point name="A">(5,1)</point><point name="B">(2,7)</point>
                  <point name="C">(9,3)</point>
                  <sortIndices name="s" sortByProp="x">$A $B $C</sortIndices>"#;
        expect { "s.numbers" = [2, 1, 3] }
    }

    case "an operand from an input moves the positions" {
        doenet r#"<numberInput name="a" value="15"><label>a</label></numberInput>
                  <sortIndices name="s" type="number">$a 10 20</sortIndices>"#;
        expect { "s.numbers" = [2, 1, 3] }
        request { "a.value" = 25 }
        expect { "s.numbers" = [2, 3, 1] }
    }

    case "an index from it picks an entry of another list" {
        doenet r#"<numberList name="scores">72 91 65 88</numberList>
                  <numberList name="ids">11 12 13 14</numberList>
                  <sortIndices name="perm">$scores</sortIndices>
                  <number name="first">$ids[$perm[1]]</number>"#;
        expect { "perm.numbers" = [3, 1, 4, 2], "first.value" = 13 }
    }

    case "an invalid type is reported and dropped" {
        doenet r#"<sortIndices name="s" type="bad">d a b</sortIndices>"#;
        expect { "s.numbers" = [2, 3, 1] }
        diagnostics["cells-invalid-type"]
    }
}

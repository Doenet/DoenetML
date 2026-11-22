//! `<sort>` and `<shuffle>` of numbers: their operands in increasing
//! order, or in an order drawn at load (`sort.test.ts`,
//! `shuffle.test.ts`).

use crate::spec;

spec! {
    sort;

    case "numbers in increasing order" {
        doenet r#"<sort name="s" type="number">101 542 817 527 51 234 801</sort>"#;
        expect {
            "s.numbers" = [51, 101, 234, 527, 542, 801, 817],
            "s.numComponents" = 7, "s.number1" = 51,
        }
    }

    case "an operand from an input moves in the order" {
        doenet r#"<numberInput name="a" value="4"><label>a</label></numberInput>
                  <sort name="s">5 3 $a 1</sort>
                  <number name="first">$s[1]</number>"#;
        expect { "s.numbers" = [1, 3, 4, 5], "first.value" = 1 }
        request { "a.value" = 0 }
        expect { "s.numbers" = [0, 1, 3, 5], "first.value" = 0 }
    }

    case "a shuffle holds every operand once, in the order the seed drew" {
        doenet r#"<shuffle name="s">1 2 3 4 5</shuffle>
                  <sort name="back">$s[1] $s[2] $s[3] $s[4] $s[5]</sort>"#;
        expect {
            "s.numbers" = [1, 3, 2, 4, 5], "s.numComponents" = 5,
            "back.numbers" = [1, 2, 3, 4, 5],
        }
    }

    case "a shuffled value follows its operand, in the place drawn" {
        doenet r#"<numberInput name="a" value="7"><label>a</label></numberInput>
                  <shuffle name="s">$a 8 9</shuffle>
                  <sort name="back">$s[1] $s[2] $s[3]</sort>"#;
        expect { "back.numbers" = [7, 8, 9] }
        request { "a.value" = 10 }
        expect { "back.numbers" = [8, 9, 10] }
    }

    case "text is refused" {
        doenet r#"<sort name="s" type="text">b a</sort>"#;
        diagnostics["cells-unsupported"]
    }
}

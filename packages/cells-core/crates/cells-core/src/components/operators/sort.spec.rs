//! `<sort>` and `<shuffle>`: their operands in increasing order, or in an
//! order drawn at load (`sort.test.ts`, `shuffle.test.ts`). What the
//! entries show as text is checked in `tests/text_in_tick.rs`.

use crate::spec;

spec! {
    sort;

    case "numbers in increasing order" {
        doenet r#"<sort name="s" type="number">101 542 817 527 51 234 801</sort>"#;
        expect {
            "s.values" = [51, 101, 234, 527, 542, 801, 817],
            "s.numComponents" = 7, "s.value1" = 51,
        }
    }

    case "an operand from an input moves in the order" {
        doenet r#"<numberInput name="a" value="4"><label>a</label></numberInput>
                  <sort name="s">5 3 $a 1</sort>
                  <number name="first">$s[1]</number>"#;
        expect { "s.values" = [1, 3, 4, 5], "first.value" = 1 }
        request { "a.value" = 0 }
        expect { "s.values" = [0, 1, 3, 5], "first.value" = 0 }
    }

    case "a write to a sorted entry is dropped: it would move the entry" {
        doenet r#"<sort name="s">5 3 1</sort>
                  <mathInput name="n" bindValueTo="$s[1]"><label>n</label></mathInput>"#;
        expect { "s.values" = [1, 3, 5] }
        request { "n.value" = 7 }
        dropped(1)
        expect { "s.values" = [1, 3, 5] }
        diagnostics["cells-request-meets-no-inverse"]
    }

    case "a write to a shuffled entry lands on the operand it shows" {
        doenet r#"<shuffle name="s">5 3 1</shuffle>
                  <sort name="back">$s[1] $s[2] $s[3]</sort>
                  <mathInput name="n" bindValueTo="$s[1]"><label>n</label></mathInput>"#;
        expect { "back.values" = [1, 3, 5] }
        request { "n.value" = 7 }
        expect { "back.values" = [1, 3, 7] }
    }

    case "a shuffle holds every operand once, in the order the seed drew" {
        doenet r#"<shuffle name="s">1 2 3 4 5</shuffle>
                  <sort name="back">$s[1] $s[2] $s[3] $s[4] $s[5]</sort>"#;
        expect {
            "s.values" = [1, 3, 2, 4, 5], "s.numComponents" = 5,
            "back.values" = [1, 2, 3, 4, 5],
        }
    }

    case "a shuffled value follows its operand, in the place drawn" {
        doenet r#"<numberInput name="a" value="7"><label>a</label></numberInput>
                  <shuffle name="s">$a 8 9</shuffle>
                  <sort name="back">$s[1] $s[2] $s[3]</sort>"#;
        expect { "back.values" = [7, 8, 9] }
        request { "a.value" = 10 }
        expect { "back.values" = [8, 9, 10] }
    }

    case "an invalid type is reported and dropped" {
        doenet r#"<sort name="s" type="bad">3 1 2</sort>"#;
        expect { "s.values" = [1, 2, 3] }
        diagnostics["cells-invalid-type"]
    }

    case "points are not sorted yet" {
        doenet r#"<point name="A">(1,2)</point><sort name="s">$A</sort>"#;
        diagnostics["cells-unsupported"]
    }
}

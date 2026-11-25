//! `<binCounts>`: how many operands fall in each bin between its cut
//! points (`countoperators.test.ts`).

use crate::spec;

spec! {
    bin_counts;

    case "left-closed bins, the last closed at its upper cut point" {
        doenet r#"<numberList name="edges">0 1 2</numberList>
                  <numberList name="v">0 0.5 1 1.5 2</numberList>
                  <binCounts name="b" bins="$edges">$v</binCounts>"#;
        expect { "b.numbers" = [2, 3], "b.numComponents" = 2, "b.number2" = 3 }
    }

    case "the result is an ordinary list" {
        doenet r#"<numberList name="edges">0 1 2 3</numberList>
                  <numberList name="v">0.5 0.5 1.5 2.5 2.5 2.5</numberList>
                  <binCounts name="b" bins="$edges">$v</binCounts>
                  <sum name="sum">$b</sum>
                  <numberList name="all">$b</numberList>"#;
        expect { "sum.value" = 6, "all.numbers" = [2, 1, 3] }
    }

    case "right-closed bins, the first closed at its lower cut point" {
        doenet r#"<binCounts name="b" bins="0 1 2" closed="right">0 0.5 1 1.5 2</binCounts>"#;
        expect { "b.numbers" = [3, 2] }
    }

    case "bare math is read as numbers, and values outside every bin are not counted" {
        doenet r#"<binCounts name="b" bins="0 1 2">-1 0 1/2 1 3/2 2 5</binCounts>"#;
        expect { "b.numbers" = [2, 3] }
    }

    case "zero-width bins" {
        doenet r#"<binCounts name="l" bins="0 1 1"><number>1</number></binCounts>
                  <binCounts name="r" bins="0 0 1" closed="right"><number>0</number></binCounts>
                  <binCounts name="m" bins="0 1 1 2"><number>1</number></binCounts>"#;
        expect { "l.numbers" = [0, 1], "r.numbers" = [1, 0], "m.numbers" = [0, 0, 1] }
    }

    case "a value that is no number lands in no bin" {
        doenet r#"<binCounts name="b" bins="0 1 2"><number>x</number><number>1.5</number></binCounts>"#;
        expect { "b.numbers" = [0, 1] }
    }

    case "recounts when a value changes" {
        doenet r#"<numberInput name="a" value="0.5"><label>a</label></numberInput>
                  <binCounts name="b" bins="0 1 2">$a 1.5</binCounts>"#;
        expect { "b.numbers" = [1, 1] }
        request { "a.value" = 1.25 }
        expect { "b.numbers" = [0, 2] }
    }

    case "cut points that come not to ascend make every count missing" {
        doenet r#"<numberInput name="c" value="1"><label>c</label></numberInput>
                  <binCounts name="b" bins="0 $c 2">0.5 1.5</binCounts>
                  <isNumber name="first">$b[1]</isNumber>"#;
        expect { "b.numbers" = [1, 1], "first.value" = 1 }
        request { "c.value" = 3 }
        expect { "b.numComponents" = 2, "first.value" = 0 }
    }

    case "omitting bins gives no counts" {
        doenet r#"<binCounts name="b">1 2</binCounts>"#;
        expect { "b.numComponents" = 0 }
        diagnostics["doenet-w0138"]
    }

    case "fewer than two cut points gives no counts" {
        doenet r#"<numberList name="edges">5</numberList>
                  <binCounts name="b" bins="$edges">1 2</binCounts>"#;
        expect { "b.numComponents" = 0 }
        diagnostics["doenet-w0139"]
    }

    case "written cut points that decrease, or are no number, give no counts" {
        doenet r#"<binCounts name="d" bins="0 5 2">1 3</binCounts>
                  <binCounts name="x" bins="1 x 5">1 3</binCounts>"#;
        expect { "d.numComponents" = 0, "x.numComponents" = 0 }
        diagnostics["doenet-w0141", "doenet-w0141"]
    }

    case "texts are no numbers to count: every count is 0" {
        doenet r#"<textList name="w">apple fig</textList>
                  <binCounts name="b" bins="0 1 2">$w</binCounts>"#;
        expect { "b.numbers" = [0, 0] }
        diagnostics["doenet-w0140"]
    }
}

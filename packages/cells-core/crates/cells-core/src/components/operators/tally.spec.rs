//! `<tally>`: how many operands equal each declared category
//! (`countoperators.test.ts`).

use crate::program::MISSING as M;
use crate::spec;

spec! {
    tally;

    case "counts declared categories, in the order declared" {
        doenet r#"<numberList name="which">1 4 1 2 2 2 4</numberList>
                  <tally name="t" categories="4 3 2 1">$which</tally>
                  <number name="second">$t[2]</number>"#;
        expect {
            "t.numbers" = [2, 0, 3, 2], "t.numComponents" = 4, "t.number3" = 3,
            "second.value" = 0,
        }
    }

    case "the result is an ordinary list" {
        doenet r#"<numberList name="which">1 4 1 2 2 2 4</numberList>
                  <tally name="t" categories="1 2 3 4">$which</tally>
                  <sum name="sum">$t</sum>
                  <numberList name="asNumbers">$t</numberList>
                  <max name="max">$t</max>"#;
        expect { "sum.value" = 7, "asNumbers.numbers" = [2, 3, 0, 2], "max.value" = 3 }
    }

    case "a category written as an expression names its number" {
        doenet r#"<numberList name="v">0.5 1 0.5</numberList>
                  <tally name="t" categories="1/2 1">$v</tally>"#;
        expect { "t.numbers" = [2, 1] }
    }

    case "texts compare as text" {
        doenet r#"<textList name="fruit">apple fig apple</textList>
                  <tally name="t" categories="apple fig pear">$fruit</tally>"#;
        expect { "t.numbers" = [2, 1, 0] }
    }

    case "booleans compare as true and false" {
        doenet r#"<booleanList name="b">true false true</booleanList>
                  <tally name="t" categories="true false">$b</tally>"#;
        expect { "t.numbers" = [2, 1] }
    }

    case "math compares by value when it is a number, else by its text" {
        doenet r#"<mathList name="m">x y x 2/2</mathList>
                  <tally name="t" type="math" categories="x y 1">$m</tally>"#;
        expect { "t.numbers" = [2, 1, 1] }
    }

    case "a value that is no number equals no category" {
        doenet r#"<tally name="t" categories="1 2"><number>1</number><number>x</number><number>2</number></tally>
                  <tally name="n" type="text" categories="NaN fig"><number>x</number><text>fig</text></tally>"#;
        expect { "t.numbers" = [1, 1], "n.numbers" = [0, 1] }
    }

    case "categories given as components" {
        doenet r#"<numberList name="cats"><number>1/3</number><number>2/3</number></numberList>
                  <numberList name="v"><number>1/3</number><number>1/3</number><number>2/3</number></numberList>
                  <tally name="t" categories="$cats">$v</tally>"#;
        expect { "t.numbers" = [2, 1] }
    }

    case "recounts when a value changes" {
        doenet r#"<numberInput name="a" value="0"><label>a</label></numberInput>
                  <tally name="t" categories="0 1">$a 1 1</tally>"#;
        expect { "t.numbers" = [1, 2] }
        request { "a.value" = 1 }
        expect { "t.numbers" = [0, 3] }
    }

    case "a repeated category counts in each slot, with a warning" {
        doenet r#"<numberList name="n">1 1 2</numberList>
                  <tally name="t" categories="1 1 2">$n</tally>"#;
        expect { "t.numbers" = [2, 2, 1] }
        diagnostics["doenet-w0142"]
    }

    case "an empty list has nothing to count" {
        doenet r#"<numberList name="none" />
                  <tally name="t">$none</tally>
                  <tally name="d" categories="1 2">$none</tally>"#;
        expect { "t.numComponents" = 0, "d.numbers" = [0, 0] }
    }

    case "with no categories, the distinct values in order, a capped list" {
        doenet r#"<numberList name="v">1 4 1 2</numberList>
                  <tally name="t">$v</tally>
                  <number name="second">$t[2]</number>"#;
        expect {
            "t.numComponents" = 3, "t.numbers" = [2.0, 1.0, 1.0, M],
            "t.categories" = [1.0, 2.0, 4.0, M], "second.value" = 1,
            "t[1].hide" = 0, "t[3].hide" = 0,
        }
    }

    case "with no categories, words and booleans" {
        doenet r#"<tally name="w">apple fig apple</tally>
                  <booleanList name="b">true false true true</booleanList>
                  <tally name="t" type="boolean">$b</tally>"#;
        expect {
            "w.numComponents" = 2, "w.numbers" = [2.0, 1.0, M],
            "t.numComponents" = 2, "t.numbers" = [1.0, 3.0, M, M], "t.categories" = [0.0, 1.0, M, M],
        }
    }

    case "with no categories, a value that is no number is none" {
        doenet r#"<tally name="t"><number>x</number><number>y</number><number>1</number></tally>"#;
        expect { "t.numComponents" = 1, "t.numbers" = [1.0, M, M], "t.categories" = [1.0, M, M] }
    }

    case "with no categories, the categories follow the values" {
        doenet r#"<numberInput name="a" value="0"><label>a</label></numberInput>
                  <tally name="t">$a 1 1</tally>"#;
        expect { "t.numComponents" = 2, "t.numbers" = [1.0, 2.0, M], "t.categories" = [0.0, 1.0, M] }
        request { "a.value" = 1 }
        expect { "t.numComponents" = 1, "t.numbers" = [3.0, M, M], "t.categories" = [1.0, M, M] }
        request { "a.value" = 5 }
        expect { "t.numComponents" = 2, "t.numbers" = [2.0, 1.0, M], "t.categories" = [1.0, 5.0, M] }
    }
}

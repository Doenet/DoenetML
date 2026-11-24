//! `<numberList>`: entries from text pieces and references, read by index,
//! and written through an entry to where it came from (ADR 0041).

use crate::spec;

spec! {
    number_list;

    case "text pieces are the entries, by every name" {
        doenet r#"<numberList name="l">1 2.5 3</numberList>"#;
        expect {
            "l.numbers" = [1.0, 2.5, 3.0], "l.values" = [1.0, 2.5, 3.0],
            "l.number2" = 2.5, "l.numComponents" = 3, "l.numValues" = 3,
        }
    }

    case "no children: no entries" {
        doenet r#"<numberList name="l"/>"#;
        expect { "l.numComponents" = 0 }
    }

    case "a piece that is no number is the missing value" {
        doenet r#"<numberList name="l">1 x 3</numberList>"#;
        expect { "l.numbers" = [1.0, f64::NAN, 3.0] }
    }

    case "an entry by a literal, past the end, between two, and by a cell" {
        doenet r#"<numberInput name="k" value="2"><label>k</label></numberInput>
                  <numberList name="l">1 2.5 3</numberList>
                  <number name="two">$l[2]</number>
                  <number name="past">$l[4]</number>
                  <number name="half">$l[1.5]</number>
                  <number name="byName">$l.numbers[3]</number>
                  <number name="byK">$l[$k]</number>"#;
        expect {
            "two.value" = 2.5, "past.value" = crate::program::MISSING, "half.value" = crate::program::MISSING,
            "byName.value" = 3, "byK.value" = 2.5,
        }
        request { "k.value" = 3 }
        expect { "byK.value" = 3 }
        request { "k.value" = 0 }
        expect { "byK.value" = crate::program::MISSING }
    }

    case "a write through an entry lands on the list's own text piece" {
        doenet r#"<numberList name="l">1 2 3</numberList>
                  <mathInput name="mi" bindValueTo="$l[2]"><label>m</label></mathInput>"#;
        expect { "mi.value" = 2 }
        request { "mi.value" = 9 }
        expect { "l.numbers" = [1, 9, 3] }
    }

    case "a reference is an entry, and a write through it goes to its source" {
        doenet r#"<numberInput name="a" value="5"><label>a</label></numberInput>
                  <numberList name="l">$a 3</numberList>
                  <mathInput name="mi" bindValueTo="$l[1]"><label>m</label></mathInput>"#;
        expect { "l.numbers" = [5, 3], "l.numComponents" = 2 }
        request { "mi.value" = 8 }
        expect { "a.value" = 8, "l.numbers" = [8, 3] }
    }

    case "a list of one reads as its entry" {
        doenet r#"<numberList name="one">7</numberList>
                  <number name="n">$one</number>
                  <math name="m">2 $one</math>"#;
        expect { "n.value" = 7, "m.value" = 14 }
    }

    case "a bare copy has the referent's entries" {
        doenet r#"<numberList name="l">1 2 3</numberList>
                  <numberList name="c" extend="$l"/>
                  <number name="x">$c[3]</number>"#;
        expect { "c.numbers" = [1, 2, 3], "x.value" = 3 }
    }

    case "a piece that is math reads as the number it is" {
        doenet r#"<numberList name="l">5 1+1 8/2 pi @</numberList>"#;
        expect { "l.numbers" = [5.0, 2.0, 4.0, std::f64::consts::PI, f64::NAN] }
    }

    case "an element child is an entry" {
        doenet r#"<numberList name="l">-1 <number>5</number> 9 <math>1+1</math></numberList>"#;
        expect { "l.numbers" = [-1, 5, 9, 2], "l.numComponents" = 4 }
    }

    case "a nested list's entries are spliced, and a write through one goes to its source" {
        doenet r#"<numberList name="a">1 2</numberList>
                  <numberList name="l">$a 3 <numberList>4 5</numberList></numberList>
                  <mathInput name="mi" bindValueTo="$l[2]"><label>m</label></mathInput>"#;
        expect { "l.numbers" = [1, 2, 3, 4, 5], "l.numComponents" = 5 }
        request { "mi.value" = 7 }
        expect { "a.numbers" = [1, 7], "l.numbers" = [1, 7, 3, 4, 5] }
    }

    case "maxNumber keeps the whole entries below it" {
        doenet r#"<numberList name="l" maxNumber="2.5">1 2 3</numberList>
                  <numberList name="z" maxNumber="-1">1 2</numberList>
                  <numberList name="m" maxNumber="3">$l 7 8</numberList>"#;
        expect {
            "l.numbers" = [1, 2], "z.numComponents" = 0, "m.numbers" = [1, 2, 7],
        }
    }

    // In a list a missing entry is a blank entry (VAL-5, D40; ADR 0046).
    case "an entry past the end of a list is a blank entry" {
        doenet r#"<numberList name="a">7 8</numberList>
                  <numberList name="l">$a[1] $a[5] 9</numberList>"#;
        expect { "l.numbers" = [7.0, crate::program::MISSING, 9.0] }
    }

    case "a reference inside brackets is part of its piece's math" {
        doenet r#"<number name="a">2</number>
                  <numberList name="l">($a+1) 5</numberList>"#;
        expect { "l.numbers" = [3, 5] }
    }

    case "an extend of a prop is the list of that prop's entries" {
        // ADR 0068: the value is the list's one child.
        doenet r#"<matrix name="A" numRows="2" numColumns="3"/>
                  <numberList name="s" extend="$A.matrixSize"/>
                  <numberList name="l">4 5 6</numberList>
                  <numberList name="n" extend="$l.numbers"/>
                  <numberList name="own" extend="$l.numbers">7</numberList>
                  <mathInput name="mi" bindValueTo="$n[2]"><label>m</label></mathInput>"#;
        expect {
            "s.numbers" = [2, 3], "s.numComponents" = 2,
            "n.numbers" = [4, 5, 6], "own.numComponents" = 1, "own.number1" = 7,
        }
        request { "mi.value" = 9 }
        expect { "l.numbers" = [4, 9, 6] }
    }
}

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
            "two.value" = 2.5, "past.value" = f64::NAN, "half.value" = f64::NAN,
            "byName.value" = 3, "byK.value" = 2.5,
        }
        request { "k.value" = 3 }
        expect { "byK.value" = 3 }
        request { "k.value" = 0 }
        expect { "byK.value" = f64::NAN }
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
}

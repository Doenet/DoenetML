//! `<integer>` and `<intComma>` (`integer.test.ts`, `mathdisplay.test.ts`
//! "add commas to large integers"): an integer rounds its value, half
//! toward positive infinity, and writes a request rounded; an intComma
//! holds its number, grouped only in how it shows (the tests in
//! `formatted.rs`).

use crate::spec;

spec! {
    formatted;

    case "an integer rounds its children, and a copy has its value" {
        doenet r#"<integer extend="$int1" name="int2"/>
                  <integer name="int1">1.2+1.1</integer>
                  <integer name="half">-6.5</integer>"#;
        expect { "int1.value" = 2, "int2.value" = 2, "half.value" = -6 }
    }

    case "an integer of something that is no number is NaN" {
        doenet r#"<integer name="int1">x+1</integer>"#;
        expect { "int1.value" = f64::NAN }
    }

    case "an integer follows what it refers to, rounded" {
        doenet r#"<numberInput name="k" value="9.5"><label>k</label></numberInput>
                  <integer name="n">$k</integer>"#;
        expect { "n.value" = 10 }
        request { "k.value" = -6.5 }
        expect { "n.value" = -6 }
    }

    case "a request on an integer writes the asked value rounded" {
        doenet r#"<integer name="n">5</integer>
                  <mathInput name="mi" bindValueTo="$n"><label>m</label></mathInput>"#;
        expect { "n.value" = 5 }
        request { "mi.value" = -6.5 }
        expect { "n.value" = -6 }
        request { "mi.value" = 9.5 }
        expect { "n.value" = 10 }
    }

    case "an intComma holds its number, literal or referred to" {
        doenet r#"<intComma name="a">25236501.35</intComma>
                  <number name="n">1234567</number>
                  <intComma name="b">$n</intComma>
                  <intComma name="c" extend="$b"/>"#;
        expect { "a.value" = 25236501.35, "b.value" = 1234567, "c.value" = 1234567 }
    }
}

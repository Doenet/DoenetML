//! `<sum>`, `<product>`, `<mean>`, `<median>`, `<min>`, `<max>`, `<mod>`,
//! `<gcd>`, `<lcm>` and `<count>`: a number over their operands, text
//! pieces and references (ADR 0041).

use crate::spec;

spec! {
    fold;

    case "text pieces" {
        doenet r#"<sum name="s">3 17 1</sum>
                  <product name="p">3 17 1</product>
                  <mean name="mean">2 3 5 7</mean>
                  <median name="m1">3 17 1</median>
                  <median name="m2">1 4 5 10000</median>
                  <min name="lo">3 17 1</min>
                  <max name="hi">3 17 1</max>
                  <count name="c">3 17 1</count>"#;
        expect {
            "s.value" = 21, "p.value" = 51, "mean.value" = 4.25, "m1.value" = 3,
            "m2.value" = 4.5, "lo.value" = 1, "hi.value" = 17, "c.value" = 3,
        }
    }

    case "references, written apart or together, follow their sources" {
        doenet r#"<number name="a">3</number><number name="b">17</number>
                  <mathInput name="mi" prefill="1"><label>c</label></mathInput>
                  <sum name="s">$a$b$mi</sum>
                  <sum name="t">$a $b $mi</sum>
                  <max name="m">$a $b $mi</max>"#;
        expect { "s.value" = 21, "t.value" = 21, "m.value" = 17 }
        request { "mi.value" = 30 }
        expect { "s.value" = 50, "m.value" = 30 }
    }

    case "mod, gcd and lcm" {
        doenet r#"<mod name="m">17 3</mod>
                  <mod name="neg">-7 3</mod>
                  <mod name="three">17 3 2</mod>
                  <gcd name="g">135 81 63</gcd>
                  <gcd name="gneg">-135 81</gcd>
                  <gcd name="frac">4 2.5</gcd>
                  <lcm name="l">135 81 63</lcm>
                  <lcm name="lneg">-135 -81</lcm>"#;
        expect {
            "m.value" = 2, "neg.value" = 2, "three.value" = f64::NAN, "g.value" = 9,
            "gneg.value" = 27, "frac.value" = f64::NAN, "l.value" = 2835, "lneg.value" = 405,
        }
    }

    case "no operands: no value, and a count of none" {
        doenet r#"<sum name="s"/><count name="c"/><min name="m"></min>"#;
        expect { "s.value" = f64::NAN, "c.value" = f64::NAN, "m.value" = f64::NAN }
    }

    case "a count counts any piece" {
        doenet r#"<count name="c">x y 2</count>"#;
        expect { "c.value" = 3 }
    }

    case "a min or max of one operand writes it" {
        doenet r#"<number name="n">4</number>
                  <max name="m">$n</max>
                  <mathInput name="mi" bindValueTo="$m"><label>m</label></mathInput>"#;
        expect { "m.value" = 4 }
        request { "mi.value" = 9 }
        expect { "n.value" = 9, "m.value" = 9 }
    }

    case "of several operands, and a sum, a request cannot change it" {
        doenet r#"<number name="n">4</number>
                  <max name="m">$n 3</max>
                  <sum name="s">$n</sum>
                  <mathInput name="mi" bindValueTo="$m"><label>m</label></mathInput>
                  <mathInput name="mj" bindValueTo="$s"><label>s</label></mathInput>"#;
        request { "mi.value" = 9 }
        dropped(1)
        request { "mj.value" = 9 }
        dropped(1)
        expect { "n.value" = 4, "m.value" = 4, "s.value" = 4 }
    }

    case "a copy has its value" {
        doenet r#"<mean name="m">1 2</mean><mean name="c" extend="$m"/>
                  <number name="n">$m</number>"#;
        expect { "c.value" = 1.5, "n.value" = 1.5 }
    }

    case "over math, the engine's operator over the operands (ADR 0043)" {
        doenet r#"<sum name="s">x 2x</sum>
                  <sum name="simp" simplify>x 2x y</sum>
                  <mean name="m">x y</mean>
                  <max name="hi">x y 3</max>
                  <mod name="md">x 3</mod>
                  <mod name="three">x 3 4</mod>
                  <median name="med">x 3</median>"#;
        expect {
            "s.expr" = "x + 2 x", "s.value" = f64::NAN, "simp.expr" = "3 x + y",
            "m.expr" = "(x + y)/2", "hi.expr" = "max(x, y, 3)", "md.expr" = "mod(x, 3)",
            "three.expr" = "", "three.value" = f64::NAN, "med.expr" = "", "med.value" = f64::NAN,
        }
    }

    case "an operand that is an expression makes it symbolic, and it follows" {
        doenet r#"<mathInput name="mi" prefill="x"><label>m</label></mathInput>
                  <number name="n">2</number>
                  <sum name="s" simplify>$mi $mi $n</sum>
                  <product name="p">$n 3</product>"#;
        expect { "s.expr" = "2 x + 2", "p.expr" = "", "p.value" = 6 }
        request { "mi.value" = 4 }
        expect { "s.expr" = "10", "s.value" = 10 }
    }

    case "forced: symbolic over numbers, numeric over math; math text as written" {
        doenet r#"<sum name="sym" forceSymbolic>3 17 1</sum>
                  <sum name="simp" forceSymbolic simplify>3 17 1</sum>
                  <sum name="num" forceNumeric>x 1</sum>
                  <sum name="math">6/2 17 1</sum>"#;
        expect {
            "sym.expr" = "3 + 17 + 1", "sym.value" = 21, "simp.expr" = "21",
            "num.expr" = "", "num.value" = f64::NAN, "math.expr" = "6/2 + 17 + 1", "math.value" = 21,
        }
    }

    case "one operand per entry of a list, and per element child" {
        doenet r#"<numberList name="l">1 2.5 3</numberList>
                  <sum name="s">$l 4</sum>
                  <mean name="m">$l</mean>
                  <count name="c">$l $l</count>
                  <sum name="e"><number>3</number><number>17</number><number>5-4</number></sum>
                  <max name="past">$l[9] 5</max>"#;
        expect {
            "s.value" = 10.5, "m.value" = 6.5 / 3.0, "c.value" = 6, "e.value" = 21,
            // A number made from a missing operand is missing, whatever
            // the others are (D40; ADR 0046).
            "past.value" = crate::program::MISSING,
        }
    }

    case "an element child or a list's entry that is math makes it symbolic (ADR 0043)" {
        doenet r#"<mathList name="ml">x y</mathList>
                  <sum name="s"><math>x</math><number>3</number> 2x</sum>
                  <sum name="simp" simplify><math>x</math> $ml 2</sum>
                  <sum name="num"><math>3</math><number>17</number></sum>"#;
        expect {
            "s.expr" = "x + 3 + 2 x", "simp.expr" = "2 x + y + 2",
            "num.expr" = "", "num.value" = 20,
        }
    }
}

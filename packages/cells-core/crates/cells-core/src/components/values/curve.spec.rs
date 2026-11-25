//! `<function>` and `<derivative>`: a function's variable and domain
//! (ADR 0049), as the current core evaluates, samples and constrains to
//! them (`functionTag.test.ts`).

use crate::spec;

spec! {
    function;

    case "a closed domain: missing outside it, given at its ends" {
        doenet r#"<function name="f" domain="[-4, 7]">x^2</function>
                  <evaluate forceNumeric name="a" function="$f" input="-4"/>
                  <evaluate forceNumeric name="b" function="$f" input="7"/>
                  <evaluate forceNumeric name="c" function="$f" input="7.5"/>
                  <evaluate forceNumeric name="d" function="$f" input="2"/>"#;
        expect {
            "f.domainMin" = -4, "f.domainMax" = 7,
            "f.domainMinClosed" = 1, "f.domainMaxClosed" = 1,
            "a.value" = 16, "b.value" = 49, "c.value" = f64::NAN, "d.value" = 4,
        }
    }

    case "an open domain: missing at its ends" {
        doenet r#"<function name="f" domain="(-4, 7)">x^2</function>
                  <evaluate forceNumeric name="a" function="$f" input="-4"/>
                  <evaluate forceNumeric name="b" function="$f" input="6.5"/>"#;
        expect { "f.domainMinClosed" = 0, "a.value" = f64::NAN, "b.value" = 42.25 }
    }

    case "an infinite end, written as a word" {
        doenet r#"<function name="f" domain="(-Infinity, 0]">x+1</function>
                  <evaluate forceNumeric name="a" function="$f" input="-1000"/>
                  <evaluate forceNumeric name="b" function="$f" input="0.5"/>"#;
        expect { "f.domainMin" = f64::NEG_INFINITY, "a.value" = -999, "b.value" = f64::NAN }
    }

    case "an endpoint that is no number is no bound" {
        doenet r#"<function name="f" domain="[a, 3]">x</function>
                  <evaluate forceNumeric name="a" function="$f" input="-100"/>
                  <evaluate forceNumeric name="b" function="$f" input="4"/>"#;
        expect { "a.value" = -100, "b.value" = f64::NAN }
    }

    case "an endpoint written as constant math is its value" {
        doenet r#"<function name="f" domain="(-sqrt(2), sqrt(10))">x</function>
                  <evaluate forceNumeric name="a" function="$f" input="3"/>
                  <evaluate forceNumeric name="b" function="$f" input="3.2"/>"#;
        expect {
            "f.domainMin" = -std::f64::consts::SQRT_2, "f.domainMax" = 10f64.sqrt(),
            "a.value" = 3, "b.value" = f64::NAN,
        }
    }

    case "an endpoint that follows an input" {
        doenet r#"<numberInput name="n" value="1"/>
                  <function name="f" domain="[0, $n]">x</function>
                  <evaluate forceNumeric name="a" function="$f" input="2"/>"#;
        expect { "f.domainMax" = 1, "a.value" = f64::NAN }
        request { "n.value" = 3 }
        expect { "f.domainMax" = 3, "a.value" = 2 }
    }

    case "no domain: the whole line, open at its infinite ends" {
        doenet r#"<function name="f">x^2</function>
                  <evaluate forceNumeric name="a" function="$f" input="-1000"/>"#;
        expect {
            "f.domainMin" = f64::NEG_INFINITY, "f.domainMax" = f64::INFINITY,
            "f.domainMinClosed" = 0, "a.value" = 1000000,
        }
    }

    case "a domain that is not one interval is warned about and ignored" {
        doenet r#"<function name="f" domain="(-1,2) (0,3)">x</function>
                  <evaluate forceNumeric name="a" function="$f" input="5"/>"#;
        diagnostics["cells-bad-domain"]
        expect { "f.domainMin" = f64::NEG_INFINITY, "a.value" = 5 }
    }

    case "a variable of its own" {
        doenet r#"<function name="f" variables="q">q^2 + 1</function>
                  <evaluate forceNumeric name="a" function="$f" input="3"/>
                  <derivative name="df">$f</derivative>
                  <evaluate forceNumeric name="b" function="$df" input="3"/>"#;
        expect { "a.value" = 10, "b.value" = 6 }
    }

    case "a derivative keeps its function's domain" {
        doenet r#"<function name="f" domain="[0, 2]">x^3</function>
                  <derivative name="df">$f</derivative>
                  <evaluate forceNumeric name="a" function="$df" input="1"/>
                  <evaluate forceNumeric name="b" function="$df" input="3"/>"#;
        expect { "df.domainMax" = 2, "a.value" = 3, "b.value" = f64::NAN }
    }

    case "the curve is cut to the domain" {
        doenet r#"<graph xmin="-10" xmax="10">
                    <function name="f" domain="[-4, 7)">x</function>
                    <function name="g" domain="(20, 30)">x</function>
                  </graph>"#;
        expect { "f.xmin" = -4, "f.xmax" = 7, "f.samples" = -4, "g.samples" = f64::NAN }
    }

    case "a point constrained to it is held in a closed domain" {
        doenet r#"<graph>
                    <function name="f" domain="[-4, 7]">x^2/10</function>
                    <point name="P" x="1" y="2"><constrainTo>$f</constrainTo></point>
                  </graph>"#;
        expect { "P.coords" = (1, 0.1) }
        request { "P.coords" = (-8, 8) }
        dropped(1)
        expect { "P.coords" = (-4, 1.6) }
        request { "P.coords" = (9, 0) }
        dropped(1)
        expect { "P.coords" = (7, 4.9) }
    }

    case "a point constrained to it stays a step inside an open domain" {
        doenet r#"<graph>
                    <function name="f" domain="(-4, 7)">x</function>
                    <point name="P" x="1" y="2"><constrainTo>$f</constrainTo></point>
                  </graph>"#;
        request { "P.coords" = (-8, 8) }
        dropped(1)
        expect { "P.coords" = (-3.999996, -3.999996) }
    }

    case "its extrema, searched as the current core searches them (ADR 0061)" {
        doenet r#"<function name="f">x^4-8x^2+8</function>
                  <number name="nmin" extend="$f.numMinima"/>
                  <number name="nmax" extend="$f.numMaxima"/>
                  <number name="next" extend="$f.numExtrema"/>
                  <math name="m2" extend="$f.minima[2][1]"/>
                  <math name="mv" extend="$f.maxima[1][2]"/>
                  <math name="gl" extend="$f.globalMinimum[1]"/>
                  <math name="gm" extend="$f.globalMaximum[1]"/>"#;
        expect {
            "f.minima" = "(-2, -8), (2, -8)",
            "f.maxima" = "(0, 8)",
            "f.extrema" = "(-2, -8), (0, 8), (2, -8)",
            "f.globalMinimum" = "(-2, -8)",
            "f.globalSupremum" = "(-100, 99920008)",
            "nmin.value" = 2, "nmax.value" = 1, "next.value" = 3,
            "m2.expr" = "2", "mv.expr" = "8", "gl.expr" = "-2", "gm.expr" = "＿",
        }
    }

    case "extrema that follow an input, on a domain" {
        doenet r#"<numberInput name="p" value="10"/>
                  <function name="f" domain="[0, 20]">sin(2 pi x/$p)</function>"#;
        expect { "f.numMaxima" = 2, "f.numMinima" = 2 }
        request { "p.value" = 5 }
        expect { "f.numMaxima" = 4, "f.numMinima" = 4 }
    }

    case "an evaluation is symbolic: its input substituted, then simplified (ADR 0081)" {
        doenet r#"<function name="f">x^2</function>
                  <evaluate name="a" function="$f" input="y"/>
                  <evaluate name="b" function="$f" input="3"/>
                  <evaluate name="c" function="$f" input="(1, 2)"/>"#;
        expect {
            "f.symbolic" = 1, "f.numInputs" = 1, "f.numOutputs" = 1,
            "a.expr" = "y^2", "b.expr" = "9", "c.expr" = "＿",
        }
    }

    case "a symbolic evaluation: the blank outside the domain, a symbol substituted" {
        doenet r#"<function name="f" domain="(-4, 4)" simplify="none">2x</function>
                  <evaluate name="a" function="$f" input="4"/>
                  <evaluate name="b" function="$f" input="10y"/>
                  <evaluate name="c" function="$f" input="3"/>"#;
        expect { "a.expr" = "＿", "b.expr" = "2 * 10 y", "c.expr" = "2 * 3" }
    }

    case "symbolic false: numeric, a symbol no number; forced either way" {
        doenet r#"<function name="f" symbolic="false">x^2</function>
                  <evaluate name="a" function="$f" input="y"/>
                  <evaluate name="b" function="$f" input="3"/>
                  <evaluate name="c" function="$f" input="y" forceSymbolic/>
                  <function name="g">x^2</function>
                  <evaluate name="d" function="$g" input="3" forceNumeric/>"#;
        expect {
            "f.symbolic" = 0, "a.value" = f64::NAN, "b.value" = 9,
            "c.expr" = "y^2", "d.value" = 9,
        }
    }

    case "a variable a reference names" {
        doenet r#"<math name="v">q</math>
                  <function name="f" variables="$v">q^2+1</function>
                  <evaluate name="a" function="$f" input="3"/>"#;
        expect { "a.expr" = "10" }
    }

    case "a variable that is no name is warned about and the default used" {
        doenet r#"<function name="f" variables="sin(x)">x+1</function>
                  <evaluate name="a" function="$f" input="1"/>"#;
        diagnostics["cells-bad-variable"]
        expect { "a.expr" = "2" }
    }

    case "a function of a function: in its variable, on its domain" {
        doenet r#"<function name="f0" variable="q" domain="[0, 5]">q^2</function>
                  <function name="f">$f0</function>
                  <evaluate name="a" function="$f" input="3"/>
                  <evaluate name="b" function="$f" input="6"/>"#;
        expect { "a.expr" = "9", "b.expr" = "＿" }
    }

    case "an interpolated function evaluates numerically, through its pieces" {
        doenet r#"<function name="f" through="(1,2) (3,4)"/>
                  <evaluate name="a" function="$f" input="3"/>
                  <evaluate name="b" function="$f" input="y"/>"#;
        expect { "f.symbolic" = 0, "a.value" = 4, "b.value" = f64::NAN }
    }

    case "a function of two variables: inputs a list, a vector or one by one (ADR 0081)" {
        doenet r#"<function name="f" variables="x y">x^2/y^3</function>
                  <evaluate name="a" function="$f" input="2 3"/>
                  <evaluate name="b" function="$f" input="(2, 3)"/>
                  <evaluate name="c" function="$f" input="2, z"/>
                  <evaluate name="d" function="$f" input="2"/>
                  <function name="g" variables="x y" symbolic="false">x+y</function>
                  <evaluate name="e" function="$g" input="2 3"/>
                  <evaluate name="h" function="$g" input="2 z"/>
                  <evaluate name="i" function="$f" input="2 3" forceNumeric/>"#;
        expect {
            "f.numInputs" = 2, "f.variablesExpr" = "(x, y)",
            "a.expr" = "4/27", "b.expr" = "4/27", "c.expr" = "4/z^3", "d.expr" = "＿",
            "e.expr" = "5", "h.expr" = "NaN", "i.expr" = "0.14814814814814814",
        }
    }

    case "a function returning a tuple returns a vector" {
        doenet r#"<function name="f">(x, x^2)</function>
                  <evaluate name="a" function="$f" input="3"/>
                  <evaluate name="b" function="$f" input="t" forceNumeric/>"#;
        expect { "f.numOutputs" = 2, "a.expr" = "(3, 9)", "b.expr" = "(NaN, NaN)" }
    }

    case "a function of two variables on a domain in each" {
        doenet r#"<function name="f" variables="x y" domain="(-4, 2] [1, 3)">x+y</function>
                  <evaluate name="a" function="$f" input="2 1"/>
                  <evaluate name="b" function="$f" input="-4 1"/>
                  <evaluate name="c" function="$f" input="0 z"/>
                  <evaluate name="d" function="$f" input="0 3" forceNumeric/>"#;
        expect { "a.expr" = "3", "b.expr" = "＿", "c.expr" = "z", "d.expr" = "NaN" }
    }

    case "a function of four variables: x_1 to x_4 by default" {
        doenet r#"<function name="f" numInputs="4">x_3/x_2+x_1 x_4</function>
                  <evaluate name="a" function="$f" input="1 2 3 4"/>
                  <evaluate name="b" function="$f" input="1 2 3 4" forceNumeric/>"#;
        expect { "f.variablesExpr" = "(x_1, x_2, x_3, x_4)", "a.expr" = "11/2", "b.expr" = "5.5" }
    }
}

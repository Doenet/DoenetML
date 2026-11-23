//! `<function>` and `<derivative>`: a function's variable and domain
//! (ADR 0046), as the current core evaluates, samples and constrains to
//! them (`functionTag.test.ts`).

use crate::spec;

spec! {
    function;

    case "a closed domain: missing outside it, given at its ends" {
        doenet r#"<function name="f" domain="[-4, 7]">x^2</function>
                  <evaluate name="a" function="$f" input="-4"/>
                  <evaluate name="b" function="$f" input="7"/>
                  <evaluate name="c" function="$f" input="7.5"/>
                  <evaluate name="d" function="$f" input="2"/>"#;
        expect {
            "f.domainMin" = -4, "f.domainMax" = 7,
            "f.domainMinClosed" = 1, "f.domainMaxClosed" = 1,
            "a.value" = 16, "b.value" = 49, "c.value" = f64::NAN, "d.value" = 4,
        }
    }

    case "an open domain: missing at its ends" {
        doenet r#"<function name="f" domain="(-4, 7)">x^2</function>
                  <evaluate name="a" function="$f" input="-4"/>
                  <evaluate name="b" function="$f" input="6.5"/>"#;
        expect { "f.domainMinClosed" = 0, "a.value" = f64::NAN, "b.value" = 42.25 }
    }

    case "an infinite end, written as a word" {
        doenet r#"<function name="f" domain="(-Infinity, 0]">x+1</function>
                  <evaluate name="a" function="$f" input="-1000"/>
                  <evaluate name="b" function="$f" input="0.5"/>"#;
        expect { "f.domainMin" = f64::NEG_INFINITY, "a.value" = -999, "b.value" = f64::NAN }
    }

    case "an endpoint that is no number is no bound" {
        doenet r#"<function name="f" domain="[a, 3]">x</function>
                  <evaluate name="a" function="$f" input="-100"/>
                  <evaluate name="b" function="$f" input="4"/>"#;
        expect { "a.value" = -100, "b.value" = f64::NAN }
    }

    case "an endpoint that follows an input" {
        doenet r#"<numberInput name="n" value="1"/>
                  <function name="f" domain="[0, $n]">x</function>
                  <evaluate name="a" function="$f" input="2"/>"#;
        expect { "f.domainMax" = 1, "a.value" = f64::NAN }
        request { "n.value" = 3 }
        expect { "f.domainMax" = 3, "a.value" = 2 }
    }

    case "no domain: the whole line, open at its infinite ends" {
        doenet r#"<function name="f">x^2</function>
                  <evaluate name="a" function="$f" input="-1000"/>"#;
        expect {
            "f.domainMin" = f64::NEG_INFINITY, "f.domainMax" = f64::INFINITY,
            "f.domainMinClosed" = 0, "a.value" = 1000000,
        }
    }

    case "a domain that is not one interval is warned about and ignored" {
        doenet r#"<function name="f" domain="(-1,2) (0,3)">x</function>
                  <evaluate name="a" function="$f" input="5"/>"#;
        diagnostics["cells-bad-domain"]
        expect { "f.domainMin" = f64::NEG_INFINITY, "a.value" = 5 }
    }

    case "a variable of its own" {
        doenet r#"<function name="f" variables="q">q^2 + 1</function>
                  <evaluate name="a" function="$f" input="3"/>
                  <derivative name="df">$f</derivative>
                  <evaluate name="b" function="$df" input="3"/>"#;
        expect { "a.value" = 10, "b.value" = 6 }
    }

    case "a derivative keeps its function's domain" {
        doenet r#"<function name="f" domain="[0, 2]">x^3</function>
                  <derivative name="df">$f</derivative>
                  <evaluate name="a" function="$df" input="1"/>
                  <evaluate name="b" function="$df" input="3"/>"#;
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
}

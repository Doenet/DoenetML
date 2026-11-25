//! `<clampFunction>` and `<wrapFunctionPeriodic>`: a function's values held
//! between, or wrapped into, two bounds, as the current core computes them
//! (`functionoperators.test.ts`).

use crate::spec;

spec! {
    function_operators;

    case "clamp: between 0 and 1 by default" {
        doenet r#"<function name="f">x^3</function>
                  <clampFunction name="c">$f</clampFunction>
                  <evaluate forceNumeric name="a" function="$c" input="-2"/>
                  <evaluate forceNumeric name="b" function="$c" input="0.5"/>
                  <evaluate forceNumeric name="d" function="$c" input="2"/>"#;
        expect {
            "c.lowerValue" = 0, "c.upperValue" = 1,
            "a.value" = 0, "b.value" = 0.125, "d.value" = 1,
        }
    }

    case "clamp: given bounds, and bounds that follow an input" {
        doenet r#"<function name="f">x^3</function>
                  <numberInput name="lo" value="-3"/>
                  <clampFunction name="c" lowerValue="$lo" upperValue="5">$f</clampFunction>
                  <evaluate forceNumeric name="a" function="$c" input="-2"/>
                  <evaluate forceNumeric name="b" function="$c" input="1.5"/>
                  <evaluate forceNumeric name="d" function="$c" input="2"/>"#;
        expect { "a.value" = -3, "b.value" = 3.375, "d.value" = 5 }
        request { "lo.value" = -10 }
        expect { "c.lowerValue" = -10, "a.value" = -8, "d.value" = 5 }
    }

    case "clamp: of math in x, not a function" {
        doenet r#"<clampFunction name="c" lowerValue="-1" upperValue="1">2 sin(x)</clampFunction>
                  <evaluate forceNumeric name="a" function="$c" input="0.25"/>
                  <evaluate forceNumeric name="b" function="$c" input="1"/>"#;
        expect { "a.value" = 0.4948079185090459, "b.value" = 1 }
    }

    case "clamp: its derivative, where the clamp lets the function through" {
        doenet r#"<function name="f">x^3</function>
                  <clampFunction name="c">$f</clampFunction>
                  <derivative name="dc">$c</derivative>
                  <evaluate forceNumeric name="a" function="$dc" input="0.5"/>"#;
        expect { "a.value" = 0.75 }
    }

    case "clamp: a point constrained to it rides its graph" {
        doenet r#"<graph>
                    <function name="f">x^3</function>
                    <clampFunction name="c">$f</clampFunction>
                    <point name="P" x="2" y="0"><constrainTo>$c</constrainTo></point>
                  </graph>"#;
        expect { "P.coords" = (2, 1) }
        // A drag's y is f(x), which no request writes.
        request { "P.coords" = (0.5, 7) }
        dropped(1)
        expect { "P.coords" = (0.5, 0.125) }
    }

    case "wrap: into [0, 1) by default" {
        doenet r#"<function name="f">x^3</function>
                  <wrapFunctionPeriodic name="w">$f</wrapFunctionPeriodic>
                  <evaluate forceNumeric name="a" function="$w" input="1.2"/>
                  <evaluate forceNumeric name="b" function="$w" input="-1"/>"#;
        expect { "a.value" = 0.7279999999999998, "b.value" = 0 }
    }

    case "wrap: into given bounds, in either order" {
        doenet r#"<function name="f">x^3</function>
                  <wrapFunctionPeriodic name="w" lowerValue="-2" upperValue="3">$f</wrapFunctionPeriodic>
                  <wrapFunctionPeriodic name="v" lowerValue="3" upperValue="-2">$f</wrapFunctionPeriodic>
                  <evaluate forceNumeric name="a" function="$w" input="1.6"/>
                  <evaluate forceNumeric name="b" function="$w" input="-1.2"/>
                  <evaluate forceNumeric name="d" function="$w" input="2"/>
                  <evaluate forceNumeric name="e" function="$v" input="1.6"/>"#;
        expect {
            "a.value" = -0.903999999999999, "b.value" = -1.728, "d.value" = -2,
            "e.value" = -0.903999999999999,
        }
    }

    case "wrap: equal bounds hold every value there" {
        doenet r#"<wrapFunctionPeriodic name="w" lowerValue="2" upperValue="2">x</wrapFunctionPeriodic>
                  <evaluate forceNumeric name="a" function="$w" input="7"/>"#;
        expect { "a.value" = 2 }
    }
}

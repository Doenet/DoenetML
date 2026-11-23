//! `<piecewiseFunction>`: the first piece whose domain holds `x`, as the
//! current core evaluates and draws it (`piecewisefunction.test.ts`).

use crate::spec;

spec! {
    piecewise_function;

    case "a step: each piece on its domain, the last everywhere else" {
        doenet r#"<graph xmin="-2" xmax="2">
                    <piecewiseFunction name="f">
                      <function domain="(0, Infinity)">1</function>
                      <function>0</function>
                    </piecewiseFunction>
                  </graph>"#;
        expect {
            "f.domainMin" = f64::NEG_INFINITY, "f.domainMax" = f64::INFINITY,
            "f.xmin" = -2, "f.xmax" = 2, "f.samples" = 0,
        }
    }

    case "its domain is its pieces' hull, closed where one closes it" {
        doenet r#"<graph>
                    <piecewiseFunction name="f">
                      <function domain="(0, 1]">x</function>
                      <function domain="[-3, 0]">x^2</function>
                      <function domain="(1, 4)">2</function>
                    </piecewiseFunction>
                  </graph>"#;
        expect {
            "f.domainMin" = -3, "f.domainMax" = 4,
            "f.domainMinClosed" = 1, "f.domainMaxClosed" = 0,
            "f.xmin" = -3, "f.xmax" = 4, "f.samples" = 9,
        }
    }

    case "a piece whose domain is no number is left out" {
        doenet r#"<graph xmin="8" xmax="12">
                    <piecewiseFunction name="f">
                      <function domain="(s, t)">x</function>
                      <function domain="[8, 10]">x^2</function>
                    </piecewiseFunction>
                  </graph>"#;
        expect { "f.domainMin" = 8, "f.domainMax" = 10, "f.samples" = 64 }
    }

    case "its own domain cuts its pieces" {
        doenet r#"<graph xmin="-5" xmax="5">
                    <piecewiseFunction name="f" domain="[1, 3]">
                      <function>x</function>
                    </piecewiseFunction>
                  </graph>"#;
        expect { "f.xmin" = 1, "f.xmax" = 3, "f.samples" = 1 }
    }

    case "pieces in variables of their own" {
        doenet r#"<graph xmin="-1" xmax="1">
                    <piecewiseFunction name="f">
                      <function variables="t" domain="[-1, 0)">t + 5</function>
                      <function variables="u">u^2</function>
                    </piecewiseFunction>
                  </graph>"#;
        expect { "f.samples" = 4 }
    }
}

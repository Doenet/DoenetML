//! `<curve>` and `<equilibriumCurve>` (ADR 0049): a function's graph, a
//! parametric curve and a Bézier spline, as the current core draws them
//! (`curve.function.test.ts`, `curve.parametrized.test.ts`,
//! `curve.bezier.test.ts`, `equilibriumcurve.test.ts`).

use crate::spec;

spec! {
    curve;

    case "a function's graph, cut to its domain" {
        doenet r#"<graph xmin="-2" xmax="2">
                    <curve name="c"><function domain="[-1, 5]">x^2</function></curve>
                  </graph>"#;
        expect {
            "c.curveType" = 0, "c.xmin" = -1, "c.xmax" = 2, "c.parMin" = -1,
            "c.samples" = 1, "c.parametric" = 0,
        }
    }

    case "a parametric curve written as a tuple in its variable" {
        doenet r#"<graph>
                    <curve name="c" variable="t" parMin="-1" parMax="0.5">(5t^3, 3t^5)</curve>
                  </graph>"#;
        expect {
            "c.curveType" = 1, "c.parMin" = -1, "c.parMax" = 0.5,
            "c.samplesX" = -5, "c.samples" = -3, "c.parametric" = 1,
        }
    }

    case "a parametric curve of two functions, each in its own variable" {
        doenet r#"<graph>
                    <curve name="c">
                      <function variables="q">5q^3</function>
                      <function variables="u">3u^5</function>
                    </curve>
                  </graph>"#;
        expect { "c.curveType" = 1, "c.parMin" = -10, "c.samplesX" = -5000, "c.samples" = -300000 }
    }

    case "a parametric curve of a function returning a tuple" {
        doenet r#"<graph>
                    <curve name="c" parMin="1" parMax="2">
                      <function variables="q">(q + 1, 2q)</function>
                    </curve>
                  </graph>"#;
        expect { "c.samplesX" = 2, "c.samples" = 2 }
    }

    case "a parameter range that follows an input" {
        doenet r#"<numberInput name="n" value="2"/>
                  <graph><curve name="c" parMin="$n" parMax="3">(x, x^2)</curve></graph>"#;
        expect { "c.samplesX" = 2, "c.samples" = 4 }
        request { "n.value" = -1 }
        expect { "c.samplesX" = -1, "c.samples" = 1 }
    }

    case "a spline through points, which a drag moves" {
        doenet r#"<graph>
                    <curve name="c" through="(1, 2) (3, 4) (-5, 6) (2, 1)"/>
                  </graph>"#;
        expect {
            "c.curveType" = 2, "c.parMin" = 0, "c.parMax" = 3,
            "c.samplesX" = 1, "c.samples" = 2,
            "c.throughPoints" = [1, 2, 3, 4, -5, 6, 2, 1],
        }
        request { "c.throughPoint1" = (0, -1) }
        expect { "c.samplesX" = 0, "c.samples" = -1 }
    }

    case "control vectors written as vectors" {
        doenet r#"<graph>
                    <curve name="c" through="(1, 2) (3, 4)">
                      <bezierControls>(3,1) (-1,5)</bezierControls>
                    </curve>
                    <curve name="d" through="(1, 2) (3, 4)">
                      <bezierControls>
                        <controlVectors direction="both">(0,0) (2,0)</controlVectors>
                        <controlVectors pointNumber="2"><vector>(-1,5)</vector></controlVectors>
                      </bezierControls>
                    </curve>
                  </graph>"#;
        expect { "c.samplesX" = 1, "c.samples" = 2, "d.samplesX" = 1 }
    }

    case "a control vector direction it does not know is refused" {
        doenet r#"<graph>
                    <curve name="c" through="(1, 2) (3, 4)">
                      <bezierControls>
                        <controlVectors direction="sideways">(0,0)</controlVectors>
                      </bezierControls>
                    </curve>
                  </graph>"#;
        diagnostics["cells-unsupported"]
    }
}

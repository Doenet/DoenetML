//! `<line>`: by two points, by a point and a slope or direction, or by an
//! equation; what it shows, and where a drag of a point or the whole line
//! lands.

use cells_core::spec;

const NAN: f64 = f64::NAN;

spec! {
    line;

    case "no attributes: through (1, 0) and (0, 0), both free" {
        doenet r#"<graph><line name="l"/></graph>"#;
        expect {
            "l.point1" = (1, 0), "l.point2" = (0, 0), "l.slope" = 0,
            "l.basedOnDirection" = 0,
        }
        request { "l.point2" = (0, 2) }
        expect { "l.point1" = (1, 0), "l.point2" = (0, 2), "l.slope" = -2 }
    }

    case "two points: slope, intercepts and coefficients follow" {
        doenet r#"<graph><line name="l" through="(1, 3) (3, 7)"/></graph>"#;
        expect {
            "l.points" = [1, 3, 3, 7], "l.slope" = 2,
            "l.xintercept" = -0.5, "l.yintercept" = 1,
            "l.coeffvar1" = 4, "l.coeffvar2" = -2, "l.coeff0" = 2,
        }
        // The whole line dragged: both points by the same shift.
        request { "l.point1" = (2, 3), "l.point2" = (4, 7) }
        expect { "l.points" = [2, 3, 4, 7], "l.yintercept" = -1 }
    }

    case "one point: the other at the origin" {
        doenet r#"<graph><line name="l" through="(2, 4)"/></graph>"#;
        expect { "l.point1" = (2, 4), "l.point2" = (0, 0), "l.slope" = 2 }
    }

    case "points from points: a drag moves them" {
        doenet r#"<graph>
                    <point name="a">(0, 0)</point><point name="b">(2, 2)</point>
                    <line name="l" through="$a $b"/>
                  </graph>"#;
        expect { "l.slope" = 1 }
        request { "l.point2" = (2, 6) }
        expect { "b.coords" = (2, 6), "a.coords" = (0, 0), "l.slope" = 3 }
    }

    case "a point and a slope: the second point a unit along it" {
        doenet r#"<graph><line name="l" through="(1, 2)" slope="0"/></graph>"#;
        expect {
            "l.point1" = (1, 2), "l.point2" = (2, 2), "l.slope" = 0,
            "l.basedOnDirection" = 1,
        }
        // Dragging the first point carries the second.
        request { "l.point1" = (3, 3) }
        expect { "l.point2" = (4, 3), "l.slope" = 0 }
    }

    case "a slope alone: through the origin" {
        doenet r#"<graph><line name="l" slope="1"/></graph>"#;
        expect { "l.point1" = (0, 0), "l.slope" = 1, "l.yintercept" = 0 }
    }

    case "a slope from a number" {
        doenet r#"<number name="m">-2</number>
                  <graph><line name="l" through="(0, 1)" slope="$m"/></graph>"#;
        expect { "l.slope" = -2, "l.yintercept" = 1 }
    }

    case "parallel to another line, following it" {
        doenet r#"<graph>
                    <line name="m" through="(0, 0) (1, 1)"/>
                    <line name="l" through="(2, 0)" parallelTo="$m"/>
                  </graph>"#;
        expect { "l.slope" = 1, "l.point1" = (2, 0), "l.basedOnDirection" = 1 }
        request { "m.point2" = (1, 3) }
        expect { "l.slope" = 3, "l.point1" = (2, 0) }
    }

    case "parallel to a segment" {
        doenet r#"<graph>
                    <lineSegment name="s" endpoints="(0, 0) (2, -2)"/>
                    <line name="l" through="(0, 5)" parallelTo="$s"/>
                  </graph>"#;
        expect { "l.slope" = -1, "l.yintercept" = 5 }
    }

    case "perpendicular to a vector" {
        doenet r#"<graph><line name="l" through="(1, 1)" perpendicularTo="(1, 1)"/></graph>"#;
        expect { "l.slope" = -1, "l.point1" = (1, 1) }
    }

    case "perpendicular to a point's coordinates" {
        doenet r#"<graph>
                    <point name="v">(0, 1)</point>
                    <line name="l" through="(0, 3)" perpendicularTo="$v"/>
                  </graph>"#;
        expect { "l.slope" = 0, "l.yintercept" = 3 }
        request { "v.coords" = (1, 1) }
        expect { "l.slope" = -1 }
    }

    case "an equation attribute: coefficients are the state" {
        doenet r#"<graph><line name="l" equation="y = 2x + 1"/></graph>
                  <mathInput name="c0" bindValueTo="$l.coeff0"/>"#;
        expect {
            "l.slope" = 2, "l.yintercept" = 1, "l.xintercept" = -0.5,
            "l.coeffvar1" = -2, "l.coeffvar2" = 1, "l.coeff0" = -1,
            "l.basedOnDirection" = 0,
        }
        request { "c0.value" = -3 }
        expect { "l.yintercept" = 3, "l.slope" = 2 }
    }

    case "an equation as the line's text" {
        doenet r#"<graph><line name="l">y = 2x + 1</line></graph>"#;
        expect { "l.slope" = 2, "l.yintercept" = 1 }
    }

    case "an equation in other variables" {
        doenet r#"<graph><line name="l" variables="s t">t = 3s - 6</line></graph>"#;
        expect { "l.slope" = 3, "l.xintercept" = 2, "l.yintercept" = -6 }
    }

    case "variables that are not two are x and y" {
        doenet r#"<graph><line name="l" variables="s">y = -x</line></graph>"#;
        expect { "l.slope" = -1 }
    }

    case "an equation over a number" {
        doenet r#"<number name="k">4</number>
                  <graph><line name="l">y = $k x</line></graph>"#;
        expect { "l.slope" = 4, "l.yintercept" = 0 }
    }

    case "a nonlinear equation is not a line" {
        doenet r#"<graph><line name="l">y = x^2</line></graph>"#;
        diagnostics["doenet-w0004"]
        expect {
            "l.slope" = NAN, "l.coeffvar1" = NAN, "l.coeffvar2" = NAN,
            "l.coeff0" = NAN,
        }
    }

    case "an equation without one '=' is refused" {
        doenet r#"<graph><line name="l">y + x</line></graph>"#;
        diagnostics["cells-bad-math"]
    }

    case "more than two points are refused" {
        doenet r#"<graph><line name="l" through="(0,0) (1,1) (2,2)"/></graph>"#;
        diagnostics["cells-unsupported"]
    }

    case "a bare copy shares the line" {
        doenet r#"<graph>
                    <line name="l" through="(0, 0) (1, 2)"/>
                    <line name="c" extend="$l"/>
                  </graph>"#;
        expect { "c.slope" = 2 }
        request { "c.point2" = (1, 5) }
        expect { "l.point2" = (1, 5), "c.slope" = 5 }
    }

    case "a copy of an equation line takes its equation" {
        doenet r#"<graph>
                    <line name="l">y = 2x + 1</line>
                    <line name="c" extend="$l" fixed="false"/>
                  </graph>"#;
        expect { "c.slope" = 2, "c.yintercept" = 1 }
    }

    case "a copy given points is a two-point line" {
        doenet r#"<graph>
                    <line name="l">y = 2x + 1</line>
                    <line name="c" extend="$l" through="(0, 0) (1, 3)"/>
                  </graph>"#;
        expect { "c.slope" = 3, "l.slope" = 2 }
    }

    case "a copy overriding the slope shares the point" {
        doenet r#"<graph>
                    <line name="l" through="(1, 2)" slope="3"/>
                    <line name="c" extend="$l" slope="-1"/>
                  </graph>"#;
        expect { "c.point1" = (1, 2), "c.slope" = -1, "l.slope" = 3 }
        request { "c.point1" = (4, 4) }
        expect { "l.point1" = (4, 4), "c.slope" = -1, "l.slope" = 3 }
    }

    case "a copy of a defaulted line shares both points" {
        doenet r#"<graph>
                    <line name="l"/>
                    <line name="c" extend="$l" fixed="false"/>
                  </graph>"#;
        request { "c.point1" = (5, 5) }
        expect { "l.point1" = (5, 5) }
        request { "c.point2" = (6, 7) }
        expect { "l.point2" = (6, 7) }
    }

    case "fixed: drags are refused" {
        doenet r#"<graph><line name="l" through="(1, 2) (3, 4)" fixed/></graph>"#;
        request { "l.point1" = (0, 0) }
        dropped(2)
        expect { "l.point1" = (1, 2) }
    }
}

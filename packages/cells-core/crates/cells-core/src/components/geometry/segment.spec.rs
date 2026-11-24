//! `<lineSegment>`: its endpoints, given or defaulted, and where a drag of
//! an endpoint or of the whole segment lands.

use crate::spec;

spec! {
    segment;

    case "no endpoints: from (1, 0) to (0, 0), both free" {
        doenet r#"<graph><lineSegment name="s"/></graph>"#;
        expect { "s.point1" = (1, 0), "s.point2" = (0, 0) }
        request { "s.point1" = (2, 3) }
        expect { "s.point1" = (2, 3), "s.point2" = (0, 0) }
    }

    case "one endpoint: the other at the origin" {
        doenet r#"<graph><lineSegment name="s" endpoints="(4, 5)"/></graph>"#;
        expect { "s.point1" = (4, 5), "s.point2" = (0, 0) }
        request { "s.point2" = (-1, 2) }
        expect { "s.point1" = (4, 5), "s.point2" = (-1, 2) }
    }

    case "literal endpoints, by every name" {
        doenet r#"<graph><lineSegment name="s" endpoints="(1, 2) (3, 4)"/></graph>"#;
        expect {
            "s.x1" = 1, "s.y1" = 2, "s.x2" = 3, "s.y2" = 4,
            "s.endpoints" = [1, 2, 3, 4], "s.points" = [1, 2, 3, 4],
        }
        // The whole segment dragged: both endpoints by the same shift.
        request { "s.point1" = (2, 2), "s.point2" = (4, 4) }
        expect { "s.endpoints" = [2, 2, 4, 4] }
    }

    case "endpoints from points: a drag moves the points" {
        doenet r#"<graph>
                    <point name="a">(1, 1)</point><point name="b">(5, 3)</point>
                    <lineSegment name="s" endpoints="$a $b"/>
                  </graph>"#;
        expect { "s.point1" = (1, 1), "s.point2" = (5, 3) }
        request { "s.point2" = (6, 6) }
        expect { "b.coords" = (6, 6), "a.coords" = (1, 1) }
        request { "a.coords" = (0, -1) }
        expect { "s.point1" = (0, -1) }
    }

    case "an endpoint from math over a point" {
        doenet r#"<graph>
                    <point name="a">(1, 1)</point>
                    <lineSegment name="s" endpoints="$a (2$a.x, 0)"/>
                  </graph>"#;
        expect { "s.point2" = (2, 0) }
        request { "s.x2" = 6 }
        expect { "a.x" = 3, "s.point1" = (3, 1), "s.point2" = (6, 0) }
    }

    case "a bare copy shares both endpoints" {
        doenet r#"<graph>
                    <lineSegment name="s" endpoints="(1, 2) (3, 4)"/>
                    <lineSegment name="t" extend="$s"/>
                  </graph>"#;
        expect { "t.endpoints" = [1, 2, 3, 4] }
        request { "t.point1" = (0, 0) }
        expect { "s.point1" = (0, 0), "t.point1" = (0, 0) }
    }

    case "a copy that overrides the endpoints has its own" {
        doenet r#"<graph>
                    <lineSegment name="s" endpoints="(1, 2) (3, 4)"/>
                    <lineSegment name="t" extend="$s" endpoints="(5, 6)"/>
                  </graph>"#;
        expect { "t.point1" = (5, 6), "t.point2" = (0, 0) }
        request { "t.point1" = (7, 7) }
        expect { "s.point1" = (1, 2), "t.point1" = (7, 7) }
    }

    case "a copy that overrides another attribute shares the endpoints" {
        doenet r#"<graph>
                    <lineSegment name="s" endpoints="(1, 2) (3, 4)"/>
                    <lineSegment name="t" extend="$s" fixed="false"/>
                  </graph>"#;
        expect { "t.endpoints" = [1, 2, 3, 4] }
        request { "t.point1" = (8, 8) }
        expect { "s.point1" = (8, 8) }
        request { "t.point2" = (9, 9) }
        expect { "s.point2" = (9, 9) }
    }

    case "fixed: drags are refused" {
        doenet r#"<graph><lineSegment name="s" endpoints="(1, 2) (3, 4)" fixed/></graph>"#;
        request { "s.point1" = (0, 0) }
        dropped(2)
        expect { "s.point1" = (1, 2) }
    }

    case "its midpoint, slope and length, each a request may set" {
        doenet r#"<graph><lineSegment name="s" endpoints="(0, 0) (4, 0)"/>
                  <point name="c" extend="$s.midpoint"/></graph>
                  <mathInput name="m" bindValueTo="$s.slope"/>
                  <mathInput name="l" bindValueTo="$s.length"/>"#;
        expect { "s.midpoint" = (2, 0), "s.slope" = 0, "s.length" = 4 }
        // The midpoint translates it.
        request { "c.coords" = (3, 1) }
        expect { "s.endpoints" = [1, 1, 5, 1] }
        // The slope turns it about its midpoint, the length kept.
        request { "m.value" = -1 }
        expect { "s.point1" = (3.0 - 2f64.sqrt(), 1.0 + 2f64.sqrt()), "s.slope" = -1, "s.length" = 4 }
        // The length scales it about its midpoint.
        request { "l.value" = 2 }
        expect { "s.midpoint" = (3, 1), "s.length" = 2, "s.slope" = -1 }
    }

    case "one endpoint and a slope: the second a length along it" {
        doenet r#"<graph><lineSegment name="s" endpoints="(1, 1)" slope="1" length="$n"/></graph>
                  <number name="n">2</number>"#;
        expect { "s.point1" = (1, 1), "s.point2" = (1.0 + 2f64.sqrt(), 1.0 + 2f64.sqrt()) }
        // The first end alone translates it.
        request { "s.point1" = (0, 0) }
        expect { "s.point2" = (2f64.sqrt(), 2f64.sqrt()), "n.value" = 2 }
        // The second sets the slope and length.
        request { "s.point2" = (0, -3) }
        expect { "s.point1" = (0, 0), "s.point2" = (0, -3), "s.slope" = f64::NEG_INFINITY, "n.value" = 3 }
    }

    case "a midpoint alone: a unit horizontal segment about it" {
        doenet r#"<graph><lineSegment name="s" midpoint="(2, 2)"/></graph>"#;
        expect { "s.point1" = (1.5, 2), "s.point2" = (2.5, 2), "s.midpoint" = (2, 2) }
        // Its second end dragged: the first held, the midpoint follows.
        request { "s.point2" = (1.5, 4) }
        expect { "s.point1" = (1.5, 2), "s.point2" = (1.5, 4), "s.midpoint" = (1.5, 3) }
        // Its first end dragged alone: it translates.
        request { "s.point1" = (0, 0) }
        expect { "s.point2" = (0, 2) }
    }

    case "one endpoint and a midpoint, offset along it" {
        doenet r#"<graph><lineSegment name="s" endpoints="(0, 0)" midpoint="(1, 1)"/>
                  <lineSegment name="o" endpoints="(0, 0)" midpoint="(1, 1)" midpointOffset="0.5"/></graph>"#;
        expect { "s.point2" = (2, 2), "o.point2" = (4.0 / 3.0, 4.0 / 3.0) }
        // An end dragged alone: the other held.
        request { "s.point1" = (2, 0) }
        expect { "s.point1" = (2, 0), "s.point2" = (2, 2), "s.midpoint" = (2, 1) }
    }

    case "a slope alone from the origin; the whole drag keeps its shape" {
        doenet r#"<graph><lineSegment name="s" slope="-1"/></graph>"#;
        expect { "s.point1" = (0, 0), "s.point2" = (0.5f64.sqrt(), -(0.5f64.sqrt())) }
        request { "s.point1" = (1, 1), "s.point2" = (1.0 + 0.5f64.sqrt(), 1.0 - 0.5f64.sqrt()) }
        expect { "s.point1" = (1, 1), "s.slope" = -1, "s.length" = 1 }
    }

    case "draggable flags" {
        doenet r#"<graph><lineSegment name="s" draggable="false"/></graph>"#;
        expect { "s.draggable" = 0, "s.endpointsDraggable" = 0 }
    }
}

//! `<intersection>`: where two figures meet, as the current core's tests
//! (`intersection.test.ts`) find it, a capped list whose live length is
//! `numPoints`; more than two items, or what is no figure, is a warning.

use crate::spec;

spec! {
    intersection;

    case "two lines: none when they coincide or are parallel" {
        doenet r#"<graph>
                    <point name="P1">(1,2)</point><point name="P2">(2,2)</point>
                    <point name="P3">(3,2)</point><point name="P4">(4,2)</point>
                    <line name="l1" through="$P1 $P2"/>
                    <line name="l2" through="$P3 $P4"/>
                    <intersection name="int">$l1$l2</intersection>
                  </graph>"#;
        expect { "int.numPoints" = 0 }
        // The first line vertical.
        request { "P1.coords" = (3, 5) }
        request { "P2.coords" = (3, -5) }
        expect { "int.point1" = (3, 2), "int.numPoints" = 1, "int[1].hide" = 0 }
        // Both vertical.
        request { "P3.coords" = (-4, 5) }
        request { "P4.coords" = (-4, -5) }
        expect { "int.numPoints" = 0 }
        request { "P1.coords" = (-8, -7) }
        request { "P2.coords" = (8, 9) }
        request { "P3.coords" = (4, 6) }
        request { "P4.coords" = (-4, -6) }
        expect { "int.point1" = (2, 3), "int.numPoints" = 1 }
    }

    case "segments: none when one stops short" {
        doenet r#"<graph>
                    <point name="A">(-8,-7)</point><point name="B">(0,1)</point>
                    <lineSegment name="s" endpoints="$A $B"/>
                    <line name="l" through="(4,6) (-4,-6)"/>
                    <intersection name="int">$s $l</intersection>
                  </graph>"#;
        expect { "int.numPoints" = 0 }
        request { "B.coords" = (8, 9) }
        expect { "int.point1" = (2, 3), "int.numPoints" = 1 }
    }

    case "hidden by the author" {
        doenet r#"<graph>
                    <line name="l1" through="(0,0) (1,1)"/>
                    <line name="l2" through="(0,2) (1,1)"/>
                    <intersection name="int" hide="$h">$l1 $l2</intersection>
                  </graph>
                  <booleanInput name="h"/>"#;
        expect { "int.point1" = (1, 1), "int.hide" = 0, "int[1].hide" = 0 }
        request { "h.value" = 1 }
        expect { "int.hide" = 1, "int[1].hide" = 1, "int.point1" = (1, 1) }
    }

    case "hidden by the author, in text" {
        doenet r#"<graph>
                    <line name="l1" through="(0,0) (1,1)"/>
                    <line name="l2" through="(0,2) (1,1)"/>
                  </graph>
                  <booleanInput name="h"/>
                  <p>Intersection: <intersection name="int" hide="$h">$l1 $l2</intersection></p>"#;
        expect { "int.hide" = 0, "int[1].hide" = 0 }
        request { "h.value" = 1 }
        expect { "int.hide" = 1, "int[1].hide" = 1 }
    }

    case "a line and a circle: two points, one where tangent" {
        doenet r#"<mathInput name="r" prefill="1"/>
                  <graph>
                    <point name="P">(3,4)</point>
                    <circle name="c" center="$P" radius="$r"/>
                    <point name="A">(4,1)</point><point name="B">(4,-4)</point>
                    <line name="l" through="$A $B"/>
                    <intersection name="int">$l $c</intersection>
                  </graph>"#;
        expect { "int.numPoints" = 1, "int.point1" = (4, 4), "int[1].hide" = 0 }
        request { "P.coords" = (4, 5) }
        expect { "int.numPoints" = 2, "int.points" = [4, 6, 4, 4], "int[1].hide" = 0, "int[2].hide" = 0 }
        request { "r.value" = 2 }
        expect { "int.points" = [4, 7, 4, 3] }
        request { "A.coords" = (-2, 2) }
        expect { "int.numPoints" = 0 }
    }

    case "two circles: none when they share a center" {
        doenet r#"<graph>
                    <point name="P1">(3,4)</point>
                    <circle name="c1" center="$P1" radius="1"/>
                    <point name="P2">(3,6)</point>
                    <circle name="c2" center="$P2" radius="1"/>
                    <intersection name="int">$c1 $c2</intersection>
                  </graph>"#;
        expect { "int.numPoints" = 1, "int.point1" = (3, 5) }
        request { "P1.coords" = (3, 6) }
        expect { "int.numPoints" = 0 }
    }

    case "two polygons: the edges' crossings, each once" {
        doenet r#"<graph>
                    <triangle name="p1"/>
                    <rectangle name="p2"/>
                    <intersection name="int">$p1$p2</intersection>
                  </graph>"#;
        expect { "int.numPoints" = 3, "int.point1" = (1, 0), "int.point2" = (0, 1), "int.point3" = (0, 0) }
    }

    case "a polygon and a circle" {
        doenet r#"<graph>
                    <circle name="c"/>
                    <triangle name="p"/>
                    <intersection name="int">$p$c</intersection>
                  </graph>"#;
        expect { "int.numPoints" = 2, "int.point1" = (0, 1), "int.point2" = (1, 0) }
    }

    case "one item or none: nothing" {
        doenet r#"<graph>
                    <line name="l" through="(0,0) (1,1)"/>
                    <intersection name="int1">$l</intersection>
                    <intersection name="int2"/>
                  </graph>"#;
        expect { "int1.numPoints" = 0, "int2.numPoints" = 0 }
    }

    case "three lines: a warning" {
        doenet r#"<graph>
                    <line name="l1" through="(0,0) (1,1)"/>
                    <line name="l2" through="(0,2) (1,1)"/>
                    <line name="l3" through="(0,3) (1,1)"/>
                    <intersection name="int">$l1 $l2 $l3</intersection>
                  </graph>"#;
        diagnostics["doenet-w0055"]
        expect { "int.numPoints" = 0 }
    }

    case "a point: a warning" {
        doenet r#"<graph>
                    <line name="l" through="(0,0) (1,1)"/>
                    <point name="P"/>
                    <intersection name="int">$l $P</intersection>
                  </graph>"#;
        diagnostics["cells-intersection-unsupported"]
        expect { "int.numPoints" = 0 }
    }
}

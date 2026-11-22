//! `<intersection>`: where two lines or segments cross, as the current
//! core's tests (`intersection.test.ts`) find it, hidden when they do not;
//! more than two items, or a circle, is a warning.

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
        expect { "int.hide" = 1, "int.x" = f64::NAN }
        // The first line vertical.
        request { "P1.coords" = (3, 5) }
        request { "P2.coords" = (3, -5) }
        expect { "int.coords" = (3, 2), "int.hide" = 0 }
        // Both vertical.
        request { "P3.coords" = (-4, 5) }
        request { "P4.coords" = (-4, -5) }
        expect { "int.hide" = 1 }
        request { "P1.coords" = (-8, -7) }
        request { "P2.coords" = (8, 9) }
        request { "P3.coords" = (4, 6) }
        request { "P4.coords" = (-4, -6) }
        expect { "int.coords" = (2, 3), "int.hide" = 0 }
    }

    case "segments: none when one stops short" {
        doenet r#"<graph>
                    <point name="A">(-8,-7)</point><point name="B">(0,1)</point>
                    <lineSegment name="s" endpoints="$A $B"/>
                    <line name="l" through="(4,6) (-4,-6)"/>
                    <intersection name="int">$s $l</intersection>
                  </graph>"#;
        expect { "int.hide" = 1 }
        request { "B.coords" = (8, 9) }
        expect { "int.coords" = (2, 3), "int.hide" = 0 }
    }

    case "hidden by the author" {
        doenet r#"<graph>
                    <line name="l1" through="(0,0) (1,1)"/>
                    <line name="l2" through="(0,2) (1,1)"/>
                    <intersection name="int" hide="$h">$l1 $l2</intersection>
                  </graph>
                  <booleanInput name="h"/>"#;
        expect { "int.coords" = (1, 1), "int.hide" = 0 }
        request { "h.value" = 1 }
        expect { "int.hide" = 1, "int.coords" = (1, 1) }
    }

    case "one item or none: nothing" {
        doenet r#"<graph>
                    <line name="l" through="(0,0) (1,1)"/>
                    <intersection name="int1">$l</intersection>
                    <intersection name="int2"/>
                  </graph>"#;
        expect { "int1.hide" = 1, "int2.hide" = 1 }
    }

    case "three lines: a warning" {
        doenet r#"<graph>
                    <line name="l1" through="(0,0) (1,1)"/>
                    <line name="l2" through="(0,2) (1,1)"/>
                    <line name="l3" through="(0,3) (1,1)"/>
                    <intersection name="int">$l1 $l2 $l3</intersection>
                  </graph>"#;
        diagnostics["doenet-w0055"]
        expect { "int.hide" = 1 }
    }

    case "a circle: a warning" {
        doenet r#"<graph>
                    <line name="l" through="(0,0) (1,1)"/>
                    <circle name="c"/>
                    <intersection name="int">$l $c</intersection>
                  </graph>"#;
        diagnostics["cells-intersection-unsupported"]
        expect { "int.hide" = 1 }
    }
}

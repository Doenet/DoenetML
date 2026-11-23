//! `<angle>`: its measure from radians, degrees, its children or three
//! points, and which of the two angles at the vertex it is.

use crate::spec;
use std::f64::consts::PI;

spec! {
    angle;

    case "three points: the angle at the second, following them" {
        doenet r#"<graph>
                    <point name="p1">(2,2)</point><point name="p2">(2,4)</point><point name="p3">(4,2)</point>
                    <angle name="a" through="$p1 $p2 $p3" chooseReflexAngle="allowed"/>
                  </graph>
                  <number name="d">$a.degrees</number>"#;
        expect { "a.radians" = PI / 4.0, "a.value" = PI / 4.0, "d.value" = 45 }
        request { "p1.coords" = (0, 2) }
        expect { "a.angle" = PI / 2.0 }
        // Counterclockwise from the first ray past a half turn.
        request { "p1.coords" = (4, 4) }
        expect { "a.radians" = 1.75 * PI }
    }

    case "the reflex choice" {
        doenet r#"<angle name="never" through="(-6,5) (0,0) (4,2)"/>
                  <angle name="always" through="(4,2) (0,0) (-6,5)" chooseReflexAngle="always"/>
                  <angle name="allowed" through="(-6,5) (0,0) (4,2)" chooseReflexAngle="allowed"/>"#;
        expect {
            "never.radians" = (5f64).atan2(-6.0) - (0.5f64).atan(),
            "always.radians" = 2.0 * PI - ((5f64).atan2(-6.0) - (0.5f64).atan()),
            "allowed.radians" = 2.0 * PI - ((5f64).atan2(-6.0) - (0.5f64).atan()),
        }
    }

    case "a measure in radians, in degrees, or as children" {
        doenet r#"<angle name="r" radians="pi/2"/><angle name="d" degrees="90"/><angle name="c">pi/2</angle>"#;
        expect {
            "r.radians" = PI / 2.0, "r.degrees" = 90,
            "d.radians" = PI / 2.0, "d.degrees" = 90,
            "c.radians" = PI / 2.0, "c.degrees" = 90,
        }
    }

    case "degrees from a number follow it, and an input on them writes it" {
        doenet r#"<number name="n">30</number><angle name="a" degrees="$n"/>
                  <mathInput name="m" bindValueTo="$a.radians"/>"#;
        expect { "a.radians" = PI / 6.0 }
        request { "m.value" = PI / 3.0 }
        expect { "n.value" = 60 }
    }

    case "fewer than three points and no measure: a right angle" {
        doenet r#"<angle name="a"/><angle name="b" through="(1,1) (2,2)"/>"#;
        expect { "a.radians" = PI / 2.0, "a.degrees" = 90, "b.radians" = PI / 2.0 }
    }

    case "between lines is not supported" {
        doenet r#"<line name="l1"/><line name="l2" through="(0,0) (0,1)"/><angle name="a" betweenLines="$l1 $l2"/>"#;
        diagnostics["cells-unsupported"]
    }
}

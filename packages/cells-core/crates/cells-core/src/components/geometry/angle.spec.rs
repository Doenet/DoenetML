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

    case "a measure written as math is an expression, kept as written (ADR 0043)" {
        doenet r#"<angle name="r" radians="pi/2"/><angle name="a">alpha</angle>
                  <angle name="d" degrees="alpha"/>
                  <math name="m1" simplify>2$r</math><math name="m2" simplify>2$a.degrees</math>"#;
        expect {
            "r.radiansExpr" = "π/2", "r.degreesExpr" = "90", "r.radians" = PI / 2.0,
            "r.degrees" = 90, "a.radiansExpr" = "α", "a.degreesExpr" = "180 α/π",
            "a.radians" = f64::NAN, "d.degreesExpr" = "α", "d.radiansExpr" = "α π/180",
            "m1.expr" = "π", "m2.expr" = "360 α/π",
        }
    }

    case "a number, or points: no expression" {
        doenet r#"<angle name="n" radians="2"/><angle name="t" through="(1,0) (0,0) (0,1)"/>"#;
        expect {
            "n.radiansExpr" = "", "n.radians" = 2, "t.radiansExpr" = "",
            "t.degreesExpr" = "", "t.degrees" = 90,
        }
    }

    case "a reference to an expression: one, following it" {
        doenet r#"<mathInput name="mi" prefill="theta"><label>m</label></mathInput>
                  <angle name="a" radians="$mi"/>"#;
        expect { "a.radiansExpr" = "θ", "a.degreesExpr" = "180 θ/π" }
        request { "mi.value" = 1 }
        expect { "a.radians" = 1, "a.degrees" = 180.0 / PI }
    }
}

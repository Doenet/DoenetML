//! `<circle>`, from every combination of `center`, `radius` and
//! `through`: what it shows, and where a drag of its center or a change of
//! its radius lands. No renderer requests a radius: a change of it comes
//! through an input bound to it, as in a document (ADR 0018).

use cells_core::spec;
use std::f64::consts::{PI, TAU};

spec! {
    circle;

    case "no attributes: the unit circle, its center and radius free" {
        doenet r#"<graph><circle name="c"/></graph><mathInput name="ri" bindValueTo="$c.radius"/>"#;
        expect {
            "c.cx" = 0, "c.cy" = 0, "c.radius" = 1,
            "c.diameter" = 2, "c.circumference" = TAU, "c.area" = PI,
        }
        request { "c.cx" = 2, "c.cy" = 3 }
        expect { "c.cx" = 2, "c.cy" = 3, "c.radius" = 1 }
        // A negative radius is clamped to zero (projection, ADR 0003).
        request { "ri.value" = -4 }
        expect { "c.radius" = 0, "c.diameter" = 0, "c.area" = 0 }
    }

    case "center only: radius 1" {
        doenet r#"<graph><circle name="c" center="(1,2)"/></graph><mathInput name="ri" bindValueTo="$c.radius"/>"#;
        expect { "c.center" = (1, 2), "c.numericalCenter" = (1, 2), "c.radius" = 1 }
        request { "ri.value" = 3 }
        expect { "c.radius" = 3, "c.center" = (1, 2) }
    }

    case "radius only: centered at the origin" {
        doenet r#"<graph><circle name="c" radius="3"/></graph>"#;
        expect { "c.numericalCenter" = (0, 0), "c.radius" = 3, "c.area" = 9.0 * PI }
        request { "c.cx" = -1, "c.cy" = 1 }
        expect { "c.numericalCenter" = (-1, 1), "c.radius" = 3 }
    }

    case "center and radius" {
        doenet r#"<graph><circle name="c" center="(1,2)" radius="3"/></graph><mathInput name="ri" bindValueTo="$c.radius"/>"#;
        expect { "c.center" = (1, 2), "c.radius" = 3, "c.diameter" = 6 }
        request { "c.cx" = 4, "c.cy" = 5 }
        expect { "c.center" = (4, 5), "c.radius" = 3 }
        request { "ri.value" = 0.5 }
        expect { "c.radius" = 0.5, "c.center" = (4, 5) }
    }

    case "center from a point, radius from an input" {
        doenet r#"<mathInput name="r" prefill="3"/>
                  <graph>
                    <point name="p">(-3,5)</point>
                    <circle name="c" center="$p" radius="$r"/>
                  </graph>
                  <point name="cc" extend="$c.center"/><mathInput name="ri" bindValueTo="$c.radius"/>"#;
        expect { "c.cx" = -3, "c.cy" = 5, "c.radius" = 3 }
        // Dragging the circle moves the point that defines its center.
        request { "c.cx" = 2, "c.cy" = 3 }
        expect { "p.x" = 2, "p.y" = 3 }
        // A negative radius reaches the input as zero.
        request { "ri.value" = -4 }
        expect { "r.value" = 0 }
        // A negative value typed into the input stays; the circle shows zero.
        request { "r.value" = -3 }
        expect { "r.value" = -3, "c.radius" = 0 }
        // A point made from the center moves the defining point.
        request { "cc.x" = -6, "cc.y" = -2 }
        expect { "p.x" = -6, "p.y" = -2, "c.cx" = -6, "c.cy" = -2 }
    }

    case "center and a through point" {
        doenet r#"<graph>
                    <point name="c">(0,0)</point><point name="p">(3,4)</point>
                    <circle name="circ" center="$c" through="$p"/>
                  </graph><mathInput name="ri" bindValueTo="$circ.radius"/>"#;
        expect { "circ.radius" = 5 }
        // A radius moves the through point along its ray from the center.
        request { "ri.value" = 10 }
        expect { "p.x" = 6, "p.y" = 8 }
        // Moving the center translates both points.
        request { "circ.cx" = 1, "circ.cy" = 1 }
        expect { "c.x" = 1, "c.y" = 1, "p.x" = 7, "p.y" = 9, "circ.radius" = 10 }
    }

    case "one through point: the circle sits on it" {
        doenet r#"<graph><circle name="c" through="(2,3)"/></graph><mathInput name="ri" bindValueTo="$c.radius"/>"#;
        expect { "c.numericalCenter" = (2, 2), "c.radius" = 1 }
        request { "ri.value" = 2 }
        expect { "c.numericalCenter" = (2, 1), "c.radius" = 2 }
    }

    case "one through point and a radius" {
        doenet r#"<graph><circle name="c" through="(2,3)" radius="2"/></graph>"#;
        expect { "c.numericalCenter" = (2, 1), "c.radius" = 2 }
    }

    case "two through points" {
        doenet r#"<graph>
                    <point name="p1">(0,0)</point><point name="p2">(4,0)</point>
                    <circle name="c" through="$p1 $p2"/>
                  </graph>"#;
        expect { "c.numericalCenter" = (2, 0), "c.radius" = 2 }
        request { "c.cx" = 3, "c.cy" = 1 }
        expect { "p1.coords" = (1, 1), "p2.coords" = (5, 1), "c.radius" = 2 }
    }

    case "two through points and a radius: the center on the left of p1 to p2" {
        doenet r#"<graph>
                    <point name="p1">(0,0)</point><point name="p2">(2,0)</point>
                    <circle name="c" radius="2" through="$p1 $p2"/>
                  </graph>"#;
        expect { "c.cx" = 1, "c.cy" = 3f64.sqrt() }
        request { "c.cx" = 11, "c.cy" = 10.0 + 3f64.sqrt() }
        expect { "p1.coords" = (10, 10), "p2.coords" = (12, 10) }
    }

    case "three through points: dragged rigidly, scaled about the center" {
        // The circumcenter of (2,-3), (3,4), (-3,4) is (0, 6/7).
        doenet r#"<graph>
                    <point name="p1">(2,-3)</point><point name="p2">(3,4)</point>
                    <point name="p3">(-3,4)</point>
                    <circle name="c" through="$p1 $p2 $p3"/>
                  </graph><mathInput name="ri" bindValueTo="$c.radius"/>"#;
        expect {
            "c.numericalCenter" = (0.0, 6.0 / 7.0),
            "c.radius" = 925f64.sqrt() / 7.0,
        }
        request { "c.cx" = 3, "c.cy" = 6.0 / 7.0 + 4.0 }
        expect { "p1.coords" = (5, 1), "p2.coords" = (6, 8), "p3.coords" = (0, 8) }
        // Doubling the radius keeps each point on its ray from the center.
        request { "ri.value" = 2.0 * 925f64.sqrt() / 7.0 }
        expect {
            "c.numericalCenter" = (3.0, 6.0 / 7.0 + 4.0),
            "p1.coords" = (7.0, 2.0 * (1.0 - 34.0 / 7.0) + 34.0 / 7.0),
        }
    }

    case "three through points, one on a grid: the shape moves with the snap" {
        doenet r#"<graph>
                    <point name="p1">(0,0)<constraints><constrainToGrid dx="3" dy="2"/></constraints></point>
                    <point name="p2">(4,0)</point><point name="p3">(0,4)</point>
                    <circle name="c" through="$p1 $p2 $p3"/>
                  </graph>"#;
        // The center is (2,2); a request of (3,3) asks for a shift of (1,1),
        // p1 snaps to (0,2), and every point takes that shift (0,2).
        request { "c.cx" = 3, "c.cy" = 3 }
        expect { "p1.coords" = (0, 2), "p2.coords" = (4, 2), "p3.coords" = (0, 6) }
    }

    case "a center on a grid carries the through point" {
        doenet r#"<graph>
                    <point name="c">(0,0)<constraints><constrainToGrid dx="3" dy="2"/></constraints></point>
                    <point name="p">(1,0)</point>
                    <circle name="circ" center="$c" through="$p"/>
                  </graph>"#;
        request { "circ.cx" = 4, "circ.cy" = 2.7 }
        expect { "c.coords" = (3, 2), "p.coords" = (4, 2), "circ.radius" = 1 }
    }

    case "through a triangle's vertices" {
        // The circumcenter of (1,2), (3,5), (-5,2) is (-2, 37/6).
        doenet r#"<graph>
                    <triangle name="t" vertices="(1,2) (3,5) (-5,2)"/>
                    <circle name="c" through="$t.vertex1 $t.vertex2 $t.vertex3"/>
                  </graph>"#;
        expect {
            "c.numericalCenter" = (-2.0, 37.0 / 6.0),
            "c.radius" = 949f64.sqrt() / 6.0,
        }
    }

    case "a point on a fixed number: half its drag is refused" {
        doenet r#"<number hide name="fixedZero" fixed>0</number>
                  <graph>
                    <triangle name="t" vertices="(1,2) (3,5) (-5,2)"/>
                    <circle name="c" through="$t.vertex1 $t.vertex2 $t.vertex3"/>
                    <point name="x">($c.center.x, $fixedZero)</point>
                  </graph>"#;
        request { "fixedZero.value" = 5 }
        dropped(1)
        // The y request lands on the fixed zero; x moves the circle.
        request { "x.x" = -3, "x.y" = 0 }
        dropped(1)
        expect {
            "c.numericalCenter" = (-3.0, 37.0 / 6.0),
            "c.radius" = 949f64.sqrt() / 6.0,
            "t.vertex1" = (0, 2),
        }
    }

    case "a copy that overrides the radius shares the center" {
        doenet r#"<graph>
                    <circle name="c" center="(1,2)" radius="3"/>
                    <circle name="d" extend="$c" radius="5"/>
                  </graph>"#;
        expect { "d.center" = (1, 2), "d.radius" = 5, "c.radius" = 3 }
        request { "d.cx" = 4, "d.cy" = 0 }
        expect { "c.center" = (4, 0), "d.center" = (4, 0), "c.radius" = 3, "d.radius" = 5 }
    }

    // The through points are a list as long as the author gave (ADR 0016).
    case "a through point by name, in the current core's spellings, and past the end" {
        doenet r#"<graph>
                    <point name="p1">(0,0)</point><point name="p2">(4,0)</point>
                    <circle name="c" through="$p1 $p2"/>
                    <point name="q" extend="$c.throughPoint2"/>
                  </graph>
                  <number name="alternate">$c.throughPointX2_1</number>
                  <number name="past">$c.throughX3</number>"#;
        expect {
            "c.throughPoint2" = (4, 0), "c.throughX1" = 0, "q.coords" = (4, 0),
            "alternate.value" = 4, "past.value" = f64::NAN,
        }
        request { "q.x" = 6 }
        expect { "p2.x" = 6, "c.throughX2" = 6, "c.radius" = 3 }
    }

    case "a bare copy holds its referent's through points" {
        doenet r#"<graph>
                    <circle name="c" through="(0,0) (4,0)"/>
                    <circle name="d" extend="$c"/>
                  </graph>"#;
        expect { "d.throughPoint2" = (4, 0), "d.radius" = 2, "d.numThroughPoints" = 2 }
        request { "d.cx" = 3, "d.cy" = 1 }
        expect { "c.throughPoint1" = (1, 1), "c.throughPoint2" = (5, 1) }
    }

    case "through another circle's through points" {
        doenet r#"<graph>
                    <circle name="c" through="(0,0) (4,0)"/>
                    <circle name="d" through="$c.throughPoints"/>
                  </graph>"#;
        expect { "d.numericalCenter" = (2, 0), "d.radius" = 2, "d.throughPoint2" = (4, 0) }
        request { "d.cx" = 2, "d.cy" = 5 }
        expect { "c.throughPoint1" = (0, 5), "c.throughPoint2" = (4, 5) }
    }

    case "an interface circle as long as its longest branch" {
        doenet r#"<booleanInput name="b"/>
                  <graph>
                    <conditionalContent name="cc">
                      <case condition="$b"><circle name="c" through="(0,0) (2,0)"/></case>
                      <else><circle name="c" through="(0,0) (0,2) (2,0)"/></else>
                    </conditionalContent>
                  </graph>
                  <number name="x3">$cc.c.throughX3</number>"#;
        expect { "x3.value" = 2 }
        request { "b.value" = 1 }
        expect { "x3.value" = f64::NAN }
    }

    // A circle its attributes over-determine has no center or radius, and
    // says why, with the current core's warning (ADR 0016: no silent NaN).
    case "center, radius and a through point: over-determined" {
        doenet r#"<graph><circle name="c" center="(0,0)" radius="1" through="(3,0)"/></graph>"#;
        diagnostics["doenet-w0029"]
        expect { "c.cx" = f64::NAN, "c.cy" = f64::NAN, "c.radius" = f64::NAN }
    }

    case "four through points: over-determined" {
        doenet r#"<graph><circle name="c" through="(0,0) (1,0) (0,1) (1,1)"/></graph>"#;
        diagnostics["doenet-w0028"]
        expect { "c.cx" = f64::NAN, "c.cy" = f64::NAN, "c.radius" = f64::NAN }
    }

    case "a center and two through points: over-determined" {
        doenet r#"<graph><circle name="c" center="(0,0)" through="(1,0) (0,1)"/></graph>"#;
        diagnostics["doenet-w0030"]
        expect { "c.cx" = f64::NAN, "c.radius" = f64::NAN }
    }

    case "a radius and three through points: over-determined" {
        doenet r#"<graph><circle name="c" radius="2" through="(1,0) (0,1) (-1,0)"/></graph>"#;
        diagnostics["doenet-w0032"]
        expect { "c.cx" = f64::NAN, "c.radius" = f64::NAN }
    }

    case "a center that is not a point" {
        doenet r#"<graph><circle name="c" center="A"/></graph>"#;
        diagnostics["doenet-w0033"]
        expect { "c.center" = (f64::NAN, f64::NAN), "c.cx" = f64::NAN, "c.radius" = 1 }
    }

    case "a copy of an over-determined circle says so too" {
        doenet r#"<graph>
                    <circle name="c" center="(0,0)" radius="1" through="(3,0)"/>
                    <circle name="d" extend="$c" radius="2"/>
                  </graph>"#;
        diagnostics["doenet-w0029", "doenet-w0029"]
        expect { "d.radius" = f64::NAN }
    }
}

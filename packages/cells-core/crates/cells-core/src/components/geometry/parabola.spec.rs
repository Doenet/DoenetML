//! `<parabola>`: its coefficients and vertex from its points or vertex, as
//! the current core's tests (`parabola.test.ts`) find them, and where a
//! request on a coefficient or the vertex moves the points: vertically
//! onto the parabola asked for, a lone point to its vertex.

use crate::spec;

spec! {
    parabola;

    case "nothing given: y = x², each coefficient its own" {
        doenet r#"<graph><parabola name="p"/></graph>
                  <mathInput name="na" bindValueTo="$p.a"/>
                  <mathInput name="nb" bindValueTo="$p.b"/>"#;
        expect { "p.a" = 1, "p.b" = 0, "p.c" = 0, "p.vertex" = (0, 0) }
        request { "na.value" = 2 }
        request { "nb.value" = -4 }
        expect { "p.a" = 2, "p.b" = -4, "p.c" = 0, "p.vertex" = (1, -2) }
    }

    case "through one point: its vertex" {
        doenet r#"<graph><point name="P1">(1,2)</point><parabola name="p" through="$P1"/></graph>
                  <mathInput name="na" bindValueTo="$p.a"/>"#;
        expect { "p.a" = 1, "p.b" = -2, "p.c" = 3, "p.vertex" = (1, 2) }
        // A new `a` keeps `b` and `c`, as the current core's does: the
        // point moves to the new vertex.
        request { "na.value" = -1 }
        expect { "p.a" = -1, "p.b" = -2, "p.c" = 3, "p.vertex" = (-1, 4), "P1.coords" = (-1, 4) }
        request { "P1.coords" = (-2, 0) }
        expect { "p.vertex" = (-2, 0), "p.b" = -4 }
    }

    case "through two points, with `a` free" {
        doenet r#"<graph>
                    <point name="P1">(1,2)</point><point name="P2">(3,4)</point>
                    <parabola name="p" through="$P1 $P2"/>
                  </graph>
                  <mathInput name="na" bindValueTo="$p.a"/>
                  <mathInput name="nc" bindValueTo="$p.c"/>"#;
        expect { "p.a" = 1, "p.b" = -3, "p.c" = 4 }
        // The points move vertically onto the parabola asked for.
        request { "na.value" = 2 }
        expect { "p.a" = 2, "p.b" = -3, "p.c" = 4, "P1.coords" = (1, 3), "P2.coords" = (3, 13) }
        request { "nc.value" = 0 }
        expect { "P1.coords" = (1, -1), "P2.coords" = (3, 9), "p.c" = 0 }
    }

    case "through three points" {
        doenet r#"<graph>
                    <point name="P1">(1,2)</point><point name="P2">(3,4)</point>
                    <point name="P3">(5,10)</point>
                    <parabola name="p" through="$P1 $P2 $P3"/>
                  </graph>
                  <mathInput name="nb" bindValueTo="$p.b"/>"#;
        expect { "p.a" = 0.5, "p.b" = -1, "p.c" = 2.5, "p.vertex" = (1, 2) }
        request { "nb.value" = 1 }
        expect { "p.b" = 1, "P1.coords" = (1, 4), "P2.coords" = (3, 10), "P3.coords" = (5, 20) }
        // Collinear points: a line.
        request { "P3.coords" = (5, 16) }
        request { "P1.coords" = (1, 4) }
        expect { "p.a" = 0, "p.b" = 3, "p.c" = 1 }
    }

    case "a vertex, and a point dragged onto it" {
        doenet r#"<graph><point name="V">(1,2)</point><parabola name="p" vertex="$V"/>
                  <point name="v" extend="$p.vertex"/></graph>"#;
        expect { "p.a" = 1, "p.b" = -2, "p.c" = 3, "v.coords" = (1, 2) }
        // Dragging the vertex keeps `a` and moves the vertex given.
        request { "v.coords" = (3, -1) }
        expect { "V.coords" = (3, -1), "p.a" = 1, "p.vertex" = (3, -1) }
    }

    case "a vertex and a point" {
        doenet r#"<graph>
                    <point name="V">(1,2)</point><point name="P">(3,4)</point>
                    <parabola name="p" vertex="$V" through="$P"/>
                  </graph>
                  <mathInput name="nb" bindValueTo="$p.b"/>"#;
        expect { "p.a" = 0.5, "p.b" = -1, "p.c" = 2.5, "p.vertex" = (1, 2) }
        // The point moves sideways with the vertex, onto the new parabola.
        request { "nb.value" = -3 }
        expect { "V.coords" = (3, -2), "P.coords" = (5, 0), "p.a" = 0.5, "p.b" = -3 }
    }

    case "a copy overwrites what it gives" {
        doenet r#"<graph>
                    <parabola name="p0"/>
                    <parabola extend="$p0" vertex="(3,4)" name="p1"/>
                    <parabola extend="$p0" through="(-5,-2)" name="p3"/>
                  </graph>"#;
        expect { "p0.a" = 1, "p0.c" = 0, "p1.vertex" = (3, 4), "p1.b" = -6, "p3.vertex" = (-5, -2) }
    }

    case "too many points: a warning" {
        doenet r#"<graph><parabola name="p" through="(1,2) (3,4) (5,6) (7,8)"/></graph>"#;
        diagnostics["doenet-w0050"]
        expect { "p.a" = f64::NAN }
    }

    case "a vertex and two points: a warning" {
        doenet r#"<graph><parabola name="p" vertex="(1,2)" through="(3,4) (5,6)"/></graph>"#;
        diagnostics["doenet-w0049"]
        expect { "p.b" = f64::NAN }
    }

    case "its curve spans the graph" {
        doenet r#"<graph xmin="-4" xmax="6"><parabola name="p"/></graph>"#;
        expect { "p.xmin" = -4, "p.xmax" = 6, "p.curve" = 1, "p.samples" = 16 }
    }
}

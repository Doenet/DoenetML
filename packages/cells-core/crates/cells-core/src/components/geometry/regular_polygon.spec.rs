//! `<regularPolygon>`: its vertices from a center, a vertex or two and a
//! size, its sizes, and where a drag lands: one vertex turns and scales it
//! about its center, all of them move it.

use crate::spec;
use std::f64::consts::PI;

spec! {
    regular_polygon;

    case "no attributes: a triangle about the origin, a vertex at (1, 0)" {
        doenet r#"<graph><regularPolygon name="p"/></graph>"#;
        expect {
            "p.numVertices" = 3, "p.numSides" = 3, "p.vertex1" = (1, 0),
            "p.vertex2" = (-0.5, 3f64.sqrt() / 2.0), "p.center" = (0, 0),
            "p.circumradius" = 1, "p.radius" = 1, "p.inradius" = 0.5,
        }
        // One vertex turns and scales it about the center.
        request { "p.vertex2" = (0, 2) }
        expect { "p.vertex1" = (3f64.sqrt(), -1), "p.center" = (0, 0), "p.circumradius" = 2 }
        // All of them move it.
        request {
            "p.vertex1" = (3f64.sqrt() + 1.0, 0), "p.vertex2" = (1, 3),
            "p.vertex3" = (1.0 - 3f64.sqrt(), 0),
        }
        expect { "p.center" = (1, 1), "p.vertex2" = (1, 3) }
    }

    case "a square of a given area, and its sizes" {
        doenet r#"<graph><regularPolygon name="p" numVertices="4" area="100"/></graph>"#;
        expect {
            "p.vertex1" = (50f64.sqrt(), 0), "p.inradius" = 5, "p.apothem" = 5,
            "p.sideLength" = 10, "p.perimeter" = 40, "p.area" = 100,
        }
    }

    case "an area from a number, which a vertex drag writes" {
        doenet r#"<number name="a">2</number>
                  <graph><regularPolygon name="p" numVertices="4" area="$a"/></graph>"#;
        expect { "p.vertex1" = (1, 0) }
        request { "p.vertex1" = (0, 3) }
        expect { "a.value" = 18, "p.vertex2" = (-3, 0) }
    }

    case "a pentagon of a given side about a center" {
        doenet r#"<graph><regularPolygon name="p" numSides="5" sideLength="2" center="(4,2)"/></graph>"#;
        expect { "p.vertex1" = (4.0 + 1.0 / (PI / 5.0).sin(), 2), "p.sideLength" = 2 }
    }

    case "a hexagon of a given inradius" {
        doenet r#"<graph><regularPolygon name="p" numVertices="6" inRadius="3" center="(-2,5)"/></graph>"#;
        expect { "p.vertex1" = (-2.0 + 3.0 / (PI / 6.0).cos(), 5), "p.inradius" = 3 }
    }

    case "a center and a vertex; the sizes are not used" {
        doenet r#"<graph>
                    <point name="c">(1, 1)</point>
                    <regularPolygon name="p" center="$c" vertices="(3,1)" circumradius="7"/>
                  </graph>"#;
        expect { "p.vertex2" = (0, 1.0 + 3f64.sqrt()), "p.circumradius" = 2 }
        // A whole drag moves the center's point.
        request {
            "p.vertex1" = (4, 2), "p.vertex2" = (1, 2.0 + 3f64.sqrt()),
            "p.vertex3" = (1, 2.0 - 3f64.sqrt()),
        }
        expect { "c.coords" = (2, 2), "p.vertex1" = (4, 2) }
    }

    case "one vertex: the center a circumradius to its left" {
        doenet r#"<graph><regularPolygon name="p" numVertices="4" vertices="(2,3)"/></graph>"#;
        expect { "p.center" = (1, 3), "p.vertices" = [2, 3, 1, 4, 0, 3, 1, 2] }
        request { "p.vertex3" = (-1, 3) }
        expect { "p.center" = (1, 3), "p.vertex1" = (3, 3) }
    }

    case "two adjacent vertices, counterclockwise" {
        doenet r#"<graph><regularPolygon name="p" numVertices="4" vertices="(0,0) (1,0)"/></graph>"#;
        expect { "p.center" = (0.5, 0.5), "p.vertices" = [0, 0, 1, 0, 1, 1, 0, 1] }
        request { "p.vertex3" = (2, 2) }
        expect { "p.vertices" = [-1, -1, 2, -1, 2, 2, -1, 2] }
    }

    case "the circumradius, bound to an input, scales it" {
        doenet r#"<graph><regularPolygon name="p"/></graph>
                  <mathInput name="r" bindValueTo="$p.circumradius"/>"#;
        request { "r.value" = 2 }
        expect { "p.vertex1" = (2, 0), "p.center" = (0, 0) }
    }

    case "a circumradius from a number, which a vertex drag writes" {
        doenet r#"<number name="n">2</number>
                  <graph><regularPolygon name="p" numVertices="4" circumradius="$n"/></graph>"#;
        expect { "p.vertex2" = (0, 2) }
        request { "p.vertex1" = (3, 0) }
        expect { "n.value" = 3, "p.vertex3" = (-3, 0) }
    }

    case "a number of vertices that is no literal is not supported" {
        doenet r#"<number name="k">5</number><graph><regularPolygon name="p" numVertices="$k"/></graph>"#;
        diagnostics["cells-banned"]
    }
}

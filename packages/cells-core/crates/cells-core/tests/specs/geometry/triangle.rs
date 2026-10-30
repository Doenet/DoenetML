//! `<triangle>`: a polygon of three vertices, each the current core's
//! default when not given.

use cells_core::spec;

spec! {
    triangle;

    case "with no vertices, the current core's three" {
        doenet r#"<graph><triangle name="t"/></graph>"#;
        expect { "t.numVertices" = 3, "t.vertices" = [0, 1, 1, 0, 0, 0] }
        request { "t.vertex3" = (5, -2) }
        expect { "t.vertices" = [0, 1, 1, 0, 5, -2] }
    }

    case "a vertex not given is its default, and drags" {
        doenet r#"<graph><triangle name="t" vertices="(-8,5) (6,2)"/></graph>"#;
        expect { "t.vertices" = [-8, 5, 6, 2, 0, 0] }
        request { "t.vertex1" = (-7, 6), "t.vertex2" = (7, 3), "t.vertex3" = (1, 1) }
        expect { "t.vertices" = [-7, 6, 7, 3, 1, 1] }
    }

    case "three vertices, and nothing past them" {
        doenet r#"<graph><triangle name="t" vertices="(1,2) (3,5) (-5,2) (7,7)"/></graph>
                  <number name="past">$t.x4</number>"#;
        expect {
            "t.numVertices" = 3, "t.vertex2" = (3, 5), "t.x3" = -5, "t.y1" = 2,
            "past.value" = f64::NAN,
        }
        request { "t.x2" = 4, "t.y2" = 6 }
        expect { "t.vertex2" = (4, 6), "t.vertex1" = (1, 2) }
    }

    case "a copy giving one vertex shares the others its referent defaulted" {
        doenet r#"<graph>
                    <triangle name="t1"/>
                    <triangle name="t2" extend="$t1" vertices="(3,-2)"/>
                  </graph>"#;
        expect { "t2.vertices" = [3, -2, 1, 0, 0, 0] }
        request { "t2.vertex1" = (-1, -1), "t2.vertex2" = (-3, 1), "t2.vertex3" = (-4, 1) }
        expect { "t2.vertices" = [-1, -1, -3, 1, -4, 1], "t1.vertices" = [0, 1, -3, 1, -4, 1] }
        request { "t1.vertex1" = (2, 2) }
        expect { "t1.vertex1" = (2, 2), "t2.vertex1" = (-1, -1) }
    }

    case "a rigid triangle with a vertex defaulted drags as one shape" {
        doenet r#"<graph><triangle name="t" rigid vertices="(0,6) (3,0)"/></graph>"#;
        expect { "t.vertices" = [0, 6, 3, 0, 0, 0] }
        request { "t.vertex1" = (1, 7), "t.vertex2" = (4, 1), "t.vertex3" = (1, 1) }
        expect { "t.vertices" = [1, 7, 4, 1, 1, 1] }
    }

    case "its center translates it, defaulted vertices too" {
        doenet r#"<graph><triangle name="t" vertices="(3,3)"/></graph>"#;
        expect { "t.center" = (4.0 / 3.0, 1) }
        request { "t.center" = (7.0 / 3.0, 0) }
        expect { "t.vertices" = [4, 2, 2, -1, 1, -1] }
    }
}

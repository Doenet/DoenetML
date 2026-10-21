//! `<polygon>`: its vertices are a list as long as the author gave
//! (ADR 0016).

use cells_core::spec;

spec! {
    polygon;

    case "a triangle holds three vertices, and nothing past them" {
        doenet r#"<graph><triangle name="t" vertices="(1,2) (3,5) (-5,2)"/></graph>
                  <number name="past">$t.x4</number>"#;
        expect {
            "t.numVertices" = 3, "t.vertex2" = (3, 5), "t.x3" = -5, "t.y1" = 2,
            "t.vertices" = [1, 2, 3, 5, -5, 2], "past.value" = f64::NAN,
        }
        request { "t.x2" = 4, "t.y2" = 6 }
        expect { "t.vertex2" = (4, 6), "t.vertex1" = (1, 2) }
        // Drawn by a primitive bound to its list, as long as it is.
        shape { "t" = "polygon" }
        export { "t" = r#"<polygon at="polygon_0" points="((1,2),(4,6),(-5,2))" closed="yes" />"# }
    }

    case "a whole-shape drag moves every vertex by the same shift" {
        doenet r#"<graph><polygon name="p" vertices="(0,0) (2,0) (2,2) (0,2)"/></graph>"#;
        request { "p.vertex1" = (1, 1), "p.vertex2" = (3, 1), "p.vertex3" = (3, 3), "p.vertex4" = (1, 3) }
        expect { "p.vertices" = [1, 1, 3, 1, 3, 3, 1, 3] }
    }

    case "twenty vertices, past the old cap of sixteen" {
        doenet r#"<graph><polygon name="p" vertices="(1,1) (2,4) (3,2) (4,2) (5,4) (6,1) (7,0) (8,1) (9,4) (10,2) (11,2) (12,4) (13,1) (14,0) (15,1) (16,4) (17,2) (18,2) (19,4) (20,1)"/></graph>"#;
        expect { "p.numVertices" = 20, "p.vertex20" = (20, 1), "p.x17" = 17 }
        request { "p.x20" = 30 }
        expect { "p.vertex20" = (30, 1), "p.x19" = 19 }
    }

    case "a vertex from the others, by index and by coordinate name" {
        // A parallelogram's fourth vertex from its first three.
        doenet r#"<graph>
                    <polygon name="pg" vertices="(1,2) (3,4) (-5,6) ($pg.vertex3[1]+$pg.vertex2[1]-$pg.vertex1[1], $pg.vertex3.y+$pg.vertex2.y-$pg.vertex1.y)"/>
                  </graph>"#;
        expect { "pg.vertex4" = (-3, 8) }
        request { "pg.x1" = 0, "pg.y1" = 0 }
        expect { "pg.vertex4" = (-2, 10) }
    }

    case "a bare copy holds its referent's vertices" {
        doenet r#"<graph>
                    <polygon name="p" vertices="(0,0) (2,0) (1,1)"/>
                    <polygon name="q" extend="$p"/>
                  </graph>"#;
        expect { "q.numVertices" = 3, "q.vertex3" = (1, 1) }
        request { "q.x3" = 5 }
        expect { "p.vertex3" = (5, 1) }
    }

    case "a rigid polygon drags as one shape" {
        doenet r#"<graph><polygon name="p" rigid vertices="(0,0) (2,0) (0,2)"/></graph>"#;
        request { "p.vertex1" = (1, 1), "p.vertex2" = (3, 1), "p.vertex3" = (1, 3) }
        expect { "p.vertices" = [1, 1, 3, 1, 1, 3] }
    }

    case "a rigid polygon has at most 31 vertices" {
        doenet r#"<graph><polygon name="p" rigid vertices="(1,0) (2,0) (3,0) (4,0) (5,0) (6,0) (7,0) (8,0) (9,0) (10,0) (11,0) (12,0) (13,0) (14,0) (15,0) (16,0) (17,0) (18,0) (19,0) (20,0) (21,0) (22,0) (23,0) (24,0) (25,0) (26,0) (27,0) (28,0) (29,0) (30,0) (31,0) (32,0)"/></graph>"#;
        diagnostics["cells-unsupported"]
    }
}

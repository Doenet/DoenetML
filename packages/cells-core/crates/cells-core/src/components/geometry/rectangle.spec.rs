//! `<rectangle>`: its corners from vertices, a center or a size, and where
//! a drag lands. A renderer's vertex drag asks for the opposite vertex
//! where it is, as the current core's `movePolygon` holds it; a point
//! bound to a vertex asks for that vertex alone.

use crate::spec;

spec! {
    rectangle;

    case "no attributes: the unit square" {
        doenet r#"<graph><rectangle name="r"/></graph>"#;
        expect {
            "r.numVertices" = 4, "r.vertices" = [0, 0, 1, 0, 1, 1, 0, 1],
            "r.center" = (0.5, 0.5), "r.width" = 1, "r.height" = 1,
            "r.area" = 1, "r.perimeter" = 4,
        }
        // A vertex dragged, its opposite held.
        request { "r.vertex2" = (9, -3), "r.vertex4" = (0, 1) }
        expect { "r.vertices" = [0, -3, 9, -3, 9, 1, 0, 1], "r.area" = 36, "r.perimeter" = 26 }
    }

    case "a corner and a size: a point on a vertex keeps the size or the anchor" {
        doenet r#"<graph><rectangle name="r" width="3" height="-3"/>
                  <point name="v1" extend="$r.vertex1"/><point name="v2" extend="$r.vertex2"/>
                  <point name="v4" extend="$r.vertex4"/></graph>"#;
        expect { "r.vertex3" = (3, -3), "r.height" = 3 }
        // The first vertex alone: the size is kept.
        request { "v1.coords" = (1, 1) }
        expect { "r.vertex1" = (1, 1), "r.vertex3" = (4, -2) }
        // The second: its x is the far corner's, its y the anchor's.
        request { "v2.coords" = (2, 0) }
        expect { "r.vertex1" = (1, 0), "r.vertex3" = (2, -3) }
        request { "v4.coords" = (-1, -5) }
        expect { "r.vertex1" = (-1, 0), "r.vertex3" = (0, -5) }
    }

    case "a center and a size" {
        doenet r#"<graph><rectangle name="r" center="(-1,5)" width="4" height="2"/>
                  <point name="v1" extend="$r.vertex1"/></graph>"#;
        expect { "r.vertices" = [-3, 4, 1, 4, 1, 6, -3, 6] }
        // A vertex alone moves, its opposite holds.
        request { "v1.coords" = (-5, 2) }
        expect { "r.vertex1" = (-5, 2), "r.vertex3" = (1, 6), "r.center" = (-2, 4), "r.width" = 6 }
    }

    case "a center alone: a unit square about it" {
        doenet r#"<graph><rectangle name="r" center="(2,2)"/></graph>"#;
        expect { "r.vertex1" = (1.5, 1.5), "r.vertex3" = (2.5, 2.5) }
    }

    case "a vertex and a center: a point on the vertex holds the center" {
        doenet r#"<graph><rectangle name="r" vertices="(1,2)" center="(3,3)"/>
                  <point name="v1" extend="$r.vertex1"/><point name="v3" extend="$r.vertex3"/></graph>"#;
        expect { "r.vertex3" = (5, 4), "r.width" = 4, "r.height" = 2 }
        request { "v1.coords" = (0, 0) }
        expect { "r.vertex3" = (6, 6), "r.center" = (3, 3) }
        request { "v3.coords" = (2, 4) }
        expect { "r.vertex1" = (0, 0), "r.center" = (1, 2) }
    }

    case "two vertices, from points" {
        doenet r#"<graph>
                    <point name="a">(1, 1)</point><point name="b">(4, 3)</point>
                    <rectangle name="r" vertices="$a $b"/>
                  </graph>"#;
        expect { "r.vertices" = [1, 1, 4, 1, 4, 3, 1, 3] }
        request { "r.vertex2" = (5, 0), "r.vertex4" = (1, 3) }
        expect { "a.coords" = (1, 0), "b.coords" = (5, 3) }
    }

    case "a whole-rectangle drag and a center request translate it" {
        doenet r#"<graph><rectangle name="r" vertices="(0,0)" width="2" height="1"/>
                  <point name="c" extend="$r.center"/></graph>"#;
        request { "r.vertex1" = (1, 1), "r.vertex2" = (3, 1), "r.vertex3" = (3, 2), "r.vertex4" = (1, 2) }
        expect { "r.vertices" = [1, 1, 3, 1, 3, 2, 1, 2] }
        request { "c.coords" = (0, 0) }
        expect { "r.vertices" = [-1.0, -0.5, 1.0, -0.5, 1.0, 0.5, -1.0, 0.5] }
    }

    case "the width and height, bound to inputs, keep the center" {
        doenet r#"<graph><rectangle name="r" vertices="(0,0) (4,-2)"/></graph>
                  <mathInput name="w" bindValueTo="$r.width"/><mathInput name="h" bindValueTo="$r.height"/>"#;
        expect { "r.width" = 4, "r.height" = 2 }
        request { "w.value" = 2 }
        expect { "r.vertex1" = (1, 0), "r.vertex3" = (3, -2) }
        request { "h.value" = 4 }
        expect { "r.vertex1" = (1, 1), "r.vertex3" = (3, -3) }
    }

    case "a width given by a number moves with it" {
        doenet r#"<number name="n">2</number>
                  <graph><rectangle name="r" width="$n"/></graph>"#;
        expect { "r.vertex3" = (2, 1) }
        request { "r.vertex3" = (5, 1), "r.vertex1" = (0, 0) }
        expect { "n.value" = 5 }
    }

    case "what a drag may move: flags the core computes and holds nothing by" {
        doenet r#"<booleanInput name="d"/>
                  <graph><rectangle name="r" draggable="$d"/>
                  <rectangle name="s" verticesDraggable="false"/></graph>
                  <mathInput name="w" bindValueTo="$r.width"/>"#;
        // `verticesDraggable` follows `draggable` unless given.
        expect { "r.draggable" = 0, "r.verticesDraggable" = 0, "s.draggable" = 1, "s.verticesDraggable" = 0 }
        request { "d.value" = 1 }
        expect { "r.draggable" = 1, "r.verticesDraggable" = 1 }
        // An input bound to the rectangle still writes it when not draggable:
        // only a drag reads the flags (ADR 0064).
        request { "d.value" = 0 }
        request { "w.value" = 3 }
        expect { "r.width" = 3 }
    }
}

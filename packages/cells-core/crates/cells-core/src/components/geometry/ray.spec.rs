//! `<ray>`: its endpoint, through point and direction from any two of
//! them, and where a drag of one point or both lands. A drag of one point
//! asks for the other where it is, as the renderer's `moveRay` does.

use crate::spec;

spec! {
    ray;

    case "no attributes: from the origin through (1, 0)" {
        doenet r#"<graph><ray name="r"/></graph>"#;
        expect { "r.endpoint" = (0, 0), "r.through" = (1, 0), "r.direction" = (1, 0) }
        request { "r.endpoint" = (2, 3), "r.through" = (4, 5) }
        expect { "r.endpoint" = (2, 3), "r.through" = (4, 5), "r.direction" = (2, 2) }
        // The endpoint alone keeps the direction, as the current core's
        // endpoint does.
        request { "r.endpoint" = (1, 1) }
        expect { "r.through" = (3, 3), "r.direction" = (2, 2) }
    }

    case "by every name" {
        doenet r#"<graph><ray name="r" endpoint="(1,2)" through="(4,6)"/></graph>"#;
        expect {
            "r.endpointX" = 1, "r.endpointX2" = 2, "r.throughX1" = 4, "r.throughY" = 6,
            "r.directionX1" = 3, "r.directionY" = 4,
        }
    }

    case "a direction alone: from the origin" {
        doenet r#"<graph><ray name="r" direction="(-8,1)"/></graph>"#;
        expect { "r.endpoint" = (0, 0), "r.through" = (-8, 1) }
        // The endpoint dragged, the through point asked where it is.
        request { "r.endpoint" = (-3, 7), "r.through" = (-8, 1) }
        expect { "r.endpoint" = (-3, 7), "r.through" = (-8, 1), "r.direction" = (-5, -6) }
    }

    case "a direction and an endpoint: the through point follows" {
        doenet r#"<graph><ray name="r" direction="(-8,1)" endpoint="(4,1)"/></graph>"#;
        expect { "r.through" = (-4, 2) }
        request { "r.endpoint" = (-3, 7), "r.through" = (-4, 2) }
        expect { "r.endpoint" = (-3, 7), "r.through" = (-4, 2), "r.direction" = (-1, -5) }
        request { "r.endpoint" = (0, 0), "r.through" = (1, 1) }
        expect { "r.direction" = (1, 1) }
    }

    case "a direction and a through point: the endpoint follows" {
        doenet r#"<graph><ray name="r" direction="(-8,1)" through="(-4,2)"/></graph>"#;
        expect { "r.endpoint" = (4, 1) }
        request { "r.endpoint" = (4, 1), "r.through" = (3, 5) }
        expect { "r.endpoint" = (4, 1), "r.through" = (3, 5), "r.direction" = (-1, 4) }
        // The through point alone keeps the direction.
        request { "r.through" = (0, 0) }
        expect { "r.endpoint" = (1, -4), "r.direction" = (-1, 4) }
    }

    case "a through point alone: from the origin, the direction follows" {
        doenet r#"<graph><ray name="r" through="(3,4)"/></graph>"#;
        expect { "r.endpoint" = (0, 0), "r.direction" = (3, 4) }
        request { "r.endpoint" = (1, 1), "r.through" = (3, 4) }
        expect { "r.direction" = (2, 3) }
    }

    case "an endpoint alone: through a unit to its right" {
        doenet r#"<graph><ray name="r" endpoint="(2,-1)"/></graph>"#;
        expect { "r.through" = (3, -1), "r.direction" = (1, 0) }
    }

    case "points from points: a drag moves them" {
        doenet r#"<graph>
                    <point name="a">(1, 2)</point><point name="b">(3, 5)</point>
                    <ray name="r" endpoint="$a" through="$b"/>
                  </graph>"#;
        expect { "r.direction" = (2, 3) }
        request { "r.endpoint" = (2, 2), "r.through" = (4, 5) }
        expect { "a.coords" = (2, 2), "b.coords" = (4, 5) }
        request { "b.coords" = (0, 0) }
        expect { "r.direction" = (-2, -2) }
    }

    case "a point bound to the direction moves the through point" {
        doenet r#"<graph>
                    <ray name="r" endpoint="(1,1)" through="(2,3)"/>
                    <point name="d" extend="$r.direction"/>
                  </graph>"#;
        expect { "d.coords" = (1, 2) }
        request { "d.coords" = (-2, 0) }
        expect { "r.endpoint" = (1, 1), "r.through" = (-1, 1) }
    }

    case "all three: the through point is ignored" {
        doenet r#"<graph><ray name="r" endpoint="(1,1)" direction="(1,2)" through="(9,9)"/></graph>"#;
        diagnostics["doenet-w0005"]
        expect { "r.through" = (2, 3) }
    }

    case "a bare copy shares the points" {
        doenet r#"<graph>
                    <ray name="r" direction="(-8,1)" through="(-4,2)"/>
                    <ray name="s" extend="$r"/>
                  </graph>"#;
        expect { "s.endpoint" = (4, 1) }
        request { "s.endpoint" = (4, 1), "s.through" = (3, 5) }
        expect { "r.through" = (3, 5), "r.endpoint" = (4, 1) }
    }

    case "fixed: drags are refused" {
        doenet r#"<graph><ray name="r" through="(3,4)" fixed/></graph>"#;
        request { "r.endpoint" = (1, 1), "r.through" = (2, 2) }
        dropped(4)
        expect { "r.through" = (3, 4) }
    }
}

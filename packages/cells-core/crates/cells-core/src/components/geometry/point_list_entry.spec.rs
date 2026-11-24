//! A `<pointList>` of one entry chosen by an index (ADR 0074): one point
//! while the index names an entry, none otherwise, rebuilt as the index
//! moves in or out of range (`line.test.ts`, `polygon.test.ts`, "copy
//! propIndex").

use crate::spec;

spec! {
    point_list_entry;

    case "the entry the index names, or none" {
        doenet r#"<numberInput name="n" value="2"/>
                  <line name="l" through="(2,-3) (3,4)"/>
                  <pointList extend="$l.points[$n]" name="Ps"/>"#;
        expect { "Ps.numPoints" = 1, "Ps.x" = 3, "Ps.y" = 4 }
        request { "n.value" = 1 }
        expect { "Ps.numPoints" = 1, "Ps.x" = 2, "Ps.y" = -3 }
        request { "n.value" = 3 }
        expect { "Ps.numPoints" = 0 }
        request { "n.value" = 2 }
        expect { "Ps.numPoints" = 1, "Ps.x" = 3 }
    }

    case "an entry of a polygon's vertices" {
        doenet r#"<numberInput name="n" value="3"/>
                  <polygon name="pg" vertices="(1,2) (3,4) (5,6)"/>
                  <pointList extend="$pg.vertices[$n]" name="Ps"/>"#;
        expect { "Ps.numPoints" = 1, "Ps.x" = 5, "Ps.y" = 6 }
        request { "n.value" = 0 }
        expect { "Ps.numPoints" = 0 }
    }
}

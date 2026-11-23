//! `<equilibriumLine>`: a line with a `stable` flag, as the current core's
//! tests (`equilibriumline.test.ts`) set and switch it; otherwise a line.

use crate::spec;

spec! {
    equilibrium_line;

    case "stable by default; a line through two points" {
        doenet r#"<graph><equilibriumLine name="A" through="(1,2) (3,4)"/></graph>"#;
        expect { "A.point1" = (1, 2), "A.point2" = (3, 4), "A.slope" = 1, "A.stable" = 1 }
        // A whole-line drag moves both points.
        request { "A.point1" = (2, 2), "A.point2" = (4, 4) }
        expect { "A.yintercept" = 0, "A.stable" = 1 }
        request { "A.stable" = 0 }
        expect { "A.stable" = 0, "A.point1" = (2, 2) }
    }

    case "not stable, from an equation" {
        doenet r#"<graph><equilibriumLine name="B" stable="false">y = 2x + 1</equilibriumLine></graph>"#;
        expect { "B.stable" = 0, "B.slope" = 2, "B.yintercept" = 1 }
    }

    case "stable from an input, which the switch writes" {
        doenet r#"<graph><equilibriumLine name="C" stable="$b1" through="(-3,2) (-5,4)"/></graph>
                  <booleanInput name="b1"/>"#;
        expect { "C.stable" = 0 }
        request { "b1.value" = 1 }
        expect { "C.stable" = 1 }
        request { "C.stable" = 0 }
        expect { "b1.value" = 0 }
    }

    case "points from points move with them" {
        doenet r#"<graph>
                    <point name="p">(0,0)</point><point name="q">(1,3)</point>
                    <equilibriumLine name="l" through="$p $q"/>
                  </graph>"#;
        expect { "l.slope" = 3 }
        request { "q.coords" = (2, 2) }
        expect { "l.slope" = 1 }
    }
}

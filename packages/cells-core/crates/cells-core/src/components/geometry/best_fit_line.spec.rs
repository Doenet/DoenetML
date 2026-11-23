//! `<bestFitLine>`: the least-squares line through its data, as the
//! current core's tests (`bestfitline.test.ts`) find it, following the
//! data as its points move.

use crate::spec;

spec! {
    best_fit_line;

    case "four points, then moved" {
        doenet r#"<graph>
                    <point name="P1">(1,2)</point><point name="P2">(1,6)</point>
                    <point name="P3">(7,3)</point><point name="P4">(7,-1)</point>
                    <bestFitLine name="l" data="$P1 $P2 $P3 $P4"/>
                  </graph>"#;
        expect { "l.slope" = -0.5, "l.yintercept" = 4.5, "l.xintercept" = 9 }
        expect { "l.coeffvar1" = -0.5, "l.coeffvar2" = -1, "l.coeff0" = 4.5 }
        request { "P1.coords" = (-5, -8) }
        request { "P2.coords" = (3, 5) }
        request { "P3.coords" = (-5, -10) }
        request { "P4.coords" = (3, 9) }
        expect { "l.slope" = 2, "l.yintercept" = 1 }
    }

    case "one point: the horizontal line through it" {
        doenet r#"<graph><point name="P1">(3,4)</point><bestFitLine name="l" data="$P1"/></graph>"#;
        expect { "l.slope" = 0, "l.yintercept" = 4 }
        request { "P1.coords" = (-5, -8) }
        expect { "l.yintercept" = -8 }
    }

    case "points at one x: the horizontal line through their mean" {
        doenet r#"<graph>
                    <point name="P1">(3,4)</point><point name="P2">(-5,0)</point>
                    <bestFitLine name="l" data="$P1 $P2"/>
                  </graph>"#;
        expect { "l.slope" = 0.5, "l.yintercept" = 2.5 }
        request { "P1.coords" = (-5, -8) }
        expect { "l.slope" = 0, "l.yintercept" = -4 }
    }

    case "a polygon's vertices, and the line's points" {
        doenet r#"<graph>
                    <polygon name="pg" vertices="(0,1) (2,3) (4,5)"/>
                    <bestFitLine name="l" data="$pg.vertices"/>
                  </graph>"#;
        expect { "l.slope" = 1, "l.yintercept" = 1 }
        // Two points on y = x + 1, as a line's from its equation.
        expect { "l.point1" = (-1.5, -0.5), "l.point2" = (-1, 0) }
    }

    case "no data: no line" {
        doenet r#"<graph><bestFitLine name="l"/></graph>"#;
        expect { "l.slope" = f64::NAN, "l.x1" = f64::NAN }
    }
}

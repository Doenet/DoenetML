//! `<vector>`: its tail, head and displacement from any two of them (or
//! `(a, b)` children for the displacement), and where a drag of one end or
//! both lands. A drag of one end asks for the other where it is, as the
//! renderer's `moveVector` does.

use crate::spec;

spec! {
    vector;

    case "no attributes: from the origin to (1, 0)" {
        doenet r#"<graph><vector name="v"/></graph>"#;
        expect { "v.tail" = (0, 0), "v.head" = (1, 0), "v.displacement" = (1, 0), "v.magnitude" = 1 }
        request { "v.tail" = (1, 1), "v.head" = (4, 5) }
        expect { "v.displacement" = (3, 4), "v.magnitude" = 5 }
    }

    case "children are the displacement" {
        doenet r#"<graph><vector name="v">(3, -4)</vector></graph>"#;
        expect { "v.tail" = (0, 0), "v.head" = (3, -4), "v.x" = 3, "v.x2" = -4 }
        // The head dragged, the tail asked where it is.
        request { "v.tail" = (0, 0), "v.head" = (1, 2) }
        expect { "v.displacement" = (1, 2) }
    }

    case "a displacement and a tail: the head follows" {
        doenet r#"<graph><vector name="v" displacement="(-8,1)" tail="(4,1)"/></graph>"#;
        expect { "v.head" = (-4, 2) }
        // The tail dragged; the head stays.
        request { "v.tail" = (-3, 7), "v.head" = (-4, 2) }
        expect { "v.tail" = (-3, 7), "v.head" = (-4, 2), "v.displacement" = (-1, -5) }
    }

    case "a displacement and a head: the tail follows" {
        doenet r#"<graph><vector name="v" displacement="(-8,1)" head="(-4,2)"/></graph>"#;
        expect { "v.tail" = (4, 1) }
        // The head dragged; the tail stays.
        request { "v.tail" = (4, 1), "v.head" = (3, 5) }
        expect { "v.tail" = (4, 1), "v.displacement" = (-1, 4) }
    }

    case "a head and a tail: the displacement follows, and moves the head" {
        doenet r#"<graph><vector name="v" tail="(1,1)" head="(4,5)"/>
                  <point name="d" extend="$v.displacement"/></graph>"#;
        expect { "v.displacement" = (3, 4) }
        request { "d.coords" = (-1, 0) }
        expect { "v.tail" = (1, 1), "v.head" = (0, 1) }
    }

    case "a head alone: from the origin" {
        doenet r#"<graph><vector name="v" head="(2,3)"/></graph>"#;
        expect { "v.tail" = (0, 0), "v.displacement" = (2, 3) }
    }

    case "the magnitude scales the vector from its tail" {
        doenet r#"<graph><vector name="v" head="(5,4)" tail="(-2,1)"/></graph>
                  <mathInput name="m" bindValueTo="$v.magnitude"/>"#;
        expect { "v.magnitude" = 58f64.sqrt() }
        request { "v.tail" = (2, 1), "v.head" = (5, 5) }
        expect { "v.magnitude" = 5 }
        request { "m.value" = 10 }
        expect { "v.tail" = (2, 1), "v.head" = (8, 9) }
    }

    case "points from points: a drag moves them" {
        doenet r#"<graph>
                    <point name="a">(1, 2)</point><point name="b">(3, 5)</point>
                    <vector name="v" tail="$a" head="$b"/>
                  </graph>"#;
        request { "v.tail" = (2, 2), "v.head" = (4, 5) }
        expect { "a.coords" = (2, 2), "b.coords" = (4, 5) }
    }

    case "all three: the head is ignored" {
        doenet r#"<graph><vector name="v" tail="(1,1)" displacement="(1,2)" head="(9,9)"/></graph>"#;
        diagnostics["doenet-w0007"]
        expect { "v.head" = (2, 3) }
    }

    case "a copy that gives a tail shares the displacement" {
        doenet r#"<graph>
                    <vector name="v">(1, 2)</vector>
                    <vector name="w" extend="$v" tail="(5,5)"/>
                  </graph>"#;
        expect { "w.head" = (6, 7) }
        request { "w.tail" = (5, 5), "w.head" = (5, 8) }
        expect { "v.displacement" = (0, 3), "v.head" = (0, 3) }
    }
}

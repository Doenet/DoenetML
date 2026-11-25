//! `<polyline>`: a polygon that is not closed, its vertices a list as long
//! as the author gave, or as a repeat it names has iterations.

use crate::spec;

spec! {
    polyline;

    case "a polyline holds the vertices given, and its length is its edges'" {
        doenet r#"<graph><polyline name="p" vertices="(0,0) (3,4) (3,0)"/></graph>"#;
        expect {
            "p.numVertices" = 3, "p.vertex2" = (3, 4), "p.x3" = 3,
            "p.vertices" = [0, 0, 3, 4, 3, 0], "p.length" = 9,
        }
        request { "p.x2" = 0 }
        expect { "p.vertex2" = (0, 4), "p.length" = 9 }
    }

    case "vertices that are points move the points" {
        doenet r#"<graph>
                    <point name="a">(1,1)</point>
                    <polyline name="p" vertices="$a (3,1) (2,4)"/>
                    <polyline name="q" extend="$p"/>
                  </graph>"#;
        expect { "q.numVertices" = 3, "q.vertex1" = (1, 1) }
        request { "q.x1" = 5, "q.y1" = 6 }
        expect { "a.coords" = (5, 6), "p.vertex1" = (5, 6) }
    }

    case "over a repeat's points: one vertex per iteration, rebuilt with the count (ADR 0075)" {
        doenet r#"<numberInput name="n" value="3"/>
                  <graph>
                    <setup><sequence name="s" from="1" to="$n"/></setup>
                    <repeat name="r" for="$s" valueName="v"><point x="$v" y="0"/></repeat>
                    <polyline name="p" vertices="$r"/>
                  </graph>"#;
        expect { "p.numVertices" = 3, "p[2].x" = 2, "p[3].y" = 0 }
        // A vertex's request writes the point it is.
        request { "p[2].y" = 5 }
        expect { "r[2][1].y" = 5, "p[2].y" = 5 }
        request { "n.value" = 4 }
        expect { "p.numVertices" = 4, "p[4].x" = 4, "p[2].y" = 5 }
    }

    case "an extend of one, and a clone in a copied graph, follow it (ADR 0075)" {
        doenet r#"<numberInput name="n" value="2"/>
                  <graph name="g1">
                    <setup><sequence name="s" from="1" to="$n"/></setup>
                    <repeat name="r" hide for="$s" valueName="v"><point x="$v" y="1"/></repeat>
                    <polyline name="p" vertices="$r"/>
                  </graph>
                  <graph name="g2"><polyline name="p" extend="$g1.p"/></graph>
                  <graph name="g3" extend="$g2"/>"#;
        expect { "g2.p.numVertices" = 2, "g3.p.numVertices" = 2, "g3.p[2].x" = 2, "r.hide" = 1 }
        request { "g3.p[1].y" = 7 }
        expect { "g1.p[1].y" = 7, "g2.p[1].y" = 7 }
        request { "n.value" = 3 }
        expect { "g3.p.numVertices" = 3, "g3.p[3].x" = 3, "g3.p[1].y" = 7 }
    }

    case "a repeat of anything but one point per iteration is no structural sequence of points" {
        doenet r#"<graph>
                    <repeat name="r" for="1 2" valueName="v"><point>($v, 0)</point><point>(0, $v)</point></repeat>
                    <polyline name="p" vertices="$r"/>
                  </graph>"#;
        diagnostics["cells-no-default-prop"]
    }

    case "a whole drag moves every vertex" {
        doenet r#"<graph><polyline name="p" vertices="(0,0) (2,0) (2,2)"/></graph>"#;
        request { "p.vertex1" = (1, 1), "p.vertex2" = (3, 1), "p.vertex3" = (3, 3) }
        expect { "p.vertices" = [1, 1, 3, 1, 3, 3], "p.center" = (7.0 / 3.0, 5.0 / 3.0) }
    }
}

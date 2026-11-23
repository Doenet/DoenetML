//! `<pointList>`: a static sequence of points, each entry a row (ADR 0041,
//! decision 4).

use crate::spec;

spec! {
    point_list;

    case "pieces of text are the points, by every name" {
        doenet r#"<graph><pointList name="pl">(1,2) (3,4) (5, 6)</pointList></graph>"#;
        expect {
            "pl.numPoints" = 3, "pl.points" = [1, 2, 3, 4, 5, 6], "pl.point2" = (3, 4),
            "pl.x3" = 5, "pl.y1" = 2, "pl[2].coords" = (3, 4), "pl[3].x" = 5,
        }
    }

    case "a drag of an entry lands on the list's own piece" {
        doenet r#"<graph><pointList name="pl">(1,2) (3,4)</pointList></graph>"#;
        request { "pl[2].x" = -3, "pl[2].y" = -4 }
        expect { "pl.points" = [1, 2, -3, -4], "pl.point1" = (1, 2) }
    }

    case "an authored point is its own entry, and a reference's entry is its source's" {
        doenet r#"<point name="P">(9,10)</point>
                  <graph><pointList name="pl"><point name="A">(1,2)</point>(3,4) $P</pointList></graph>"#;
        expect { "pl.points" = [1, 2, 3, 4, 9, 10], "pl[1].x" = 1, "A.x" = 1 }
        request { "pl[1].x" = -1, "pl[1].y" = -2 }
        expect { "A.coords" = (-1, -2), "pl.point1" = (-1, -2) }
        request { "pl[3].x" = -9, "pl[3].y" = -10 }
        expect { "P.coords" = (-9, -10), "pl.point3" = (-9, -10) }
    }

    case "a point list among the children gives its points" {
        doenet r#"<graph><pointList name="pl">(1,2) (3,4)</pointList>
                  <pointList name="pl2">$pl (7,8)</pointList></graph>"#;
        expect { "pl2.numPoints" = 3, "pl2.points" = [1, 2, 3, 4, 7, 8] }
        request { "pl2[2].x" = 0, "pl2[2].y" = 0 }
        expect { "pl.points" = [1, 2, 0, 0], "pl2.point2" = (0, 0) }
    }

    case "maxNumber keeps the first points" {
        doenet r#"<graph><pointList name="pl" maxNumber="2">(1,2) (3,4) (5,6)</pointList></graph>"#;
        expect { "pl.numPoints" = 2, "pl.points" = [1, 2, 3, 4] }
    }

    case "a copy has the referent's points, and a drag of its entry moves them" {
        doenet r#"<graph><pointList name="pl">(1,2) (3,4)</pointList></graph>
                  <graph><pointList name="c" extend="$pl"/></graph>"#;
        expect { "c.points" = [1, 2, 3, 4], "c.numPoints" = 2 }
        request { "c[1].x" = 5, "c[1].y" = 6 }
        expect { "pl.point1" = (5, 6), "c.point1" = (5, 6) }
    }

    case "a click on an entry presses what names it, the authored point and the list" {
        doenet r#"<graph><pointList name="pl"><point name="A">(1,2)</point> (3,4)</pointList></graph>
                  <number name="nA">0</number><number name="nAp">$nA + 1</number>
                  <number name="n2">0</number><number name="n2p">$n2 + 1</number>
                  <number name="nl">0</number><number name="nlp">$nl + 1</number>
                  <updateValue name="ua" target="$nA" newValue="$nAp" triggerWhenObjectsClicked="$A"/>
                  <updateValue name="u2" target="$n2" newValue="$n2p" triggerWhenObjectsClicked="$pl[2]"/>
                  <updateValue name="ul" target="$nl" newValue="$nlp" triggerWhenObjectsClicked="$pl[1] $pl[5]"/>
                  <number name="nw">0</number><number name="nwp">$nw + 1</number>
                  <updateValue name="uw" target="$nw" newValue="$nwp" triggerWhenObjectsClicked="$pl"/>"#;
        act("pl[2]", "pointClicked")
        expect { "nA.value" = 0, "n2.value" = 1, "nl.value" = 0, "nw.value" = 1 }
        act("pl[1]", "pointClicked")
        expect { "nA.value" = 1, "n2.value" = 1, "nl.value" = 1, "nw.value" = 2 }
    }

    case "a click on one made entry is not a click on another" {
        doenet r#"<point name="P">(9,10)</point>
                  <graph><pointList name="pl">(1,2) $P</pointList></graph>
                  <number name="n">0</number><number name="np">$n + 1</number>
                  <updateValue name="u" target="$n" newValue="$np" triggerWhenObjectsClicked="$pl[1]"/>"#;
        act("pl[2]", "pointClicked")
        expect { "n.value" = 0 }
        act("pl[1]", "pointClicked")
        expect { "n.value" = 1 }
    }

    case "a callAction on an entry calls the row's action; one past the end does nothing" {
        doenet r#"<graph><pointList name="pl">(1,2) (3,4)</pointList></graph>
                  <number name="n">0</number><number name="np">$n + 1</number>
                  <updateValue name="u" target="$n" newValue="$np" triggerWhenObjectsClicked="$pl[2]"/>
                  <callAction name="ca" target="$pl[2]" actionName="pointClicked"><label>a</label></callAction>
                  <callAction name="cb" target="$pl[5]" actionName="pointClicked"><label>b</label></callAction>"#;
        act("cb", "trigger")
        expect { "n.value" = 0 }
        act("ca", "trigger")
        expect { "n.value" = 1 }
    }
}

//! `<section>` and the other divisions: one counter among sibling
//! divisions of every tag, the parent's number by tag, the label that names
//! the title, and which divisions aggregate scores, as the current core's
//! `sectioning.test.ts`.

use crate::spec;

spec! {
    section;

    case "sections show their parent's number" {
        doenet r#"<section name="a"/><section name="b"><subsection name="c"/><subsection name="d" includeParentNumber="false"/></section>"#;
        expect {
            "a.number" = 1, "b.number" = 2, "c.number" = 1, "d.number" = 2,
            "c.includeParentNumber" = 1, "d.includeParentNumber" = 0,
            "a.label" = 0, "c.label" = 1,
        }
    }

    case "the divisions of every tag share one counter" {
        doenet r#"<section name="a"/><example name="b"/><problem name="c"/><theorem name="d"/>
                  <definition name="e"/><note name="f"/><question name="g"/><activity name="h"/>"#;
        expect {
            "a.number" = 1, "b.number" = 2, "c.number" = 3, "d.number" = 4,
            "e.number" = 5, "f.number" = 6, "g.number" = 7, "h.number" = 8,
        }
    }

    case "each tag's label names its title" {
        doenet r#"<question name="q"/><activity name="a"/><definition name="d"/><note name="n"/>
                  <theorem name="t"/><paragraphs name="pa"/><objectives name="o"/>
                  <problem name="pr"><part name="p"/><task name="ta"/></problem>
                  <problems name="ps"/><exercises name="es"/>"#;
        expect {
            "q.label" = 6, "a.label" = 7, "d.label" = 8, "n.label" = 9,
            "t.label" = 10, "pa.label" = 11, "o.label" = 12, "p.label" = 13,
            "ta.label" = 14, "ps.label" = 15, "es.label" = 16,
        }
    }

    case "boxed is the renderer's" {
        doenet r#"<section name="s" boxed><title>Boxed</title></section><objectives name="o" boxed="false"/>"#;
        expect { "s.number" = 1, "o.number" = 2 }
    }

    case "a division given by its type" {
        doenet r#"<division name="t" type="theorem"/><division name="s" type="section"/>"#;
        expect { "t.label" = 10, "s.label" = 0, "t.number" = 1, "s.number" = 2 }
    }

    case "only a section shows its parent's number by default" {
        doenet r#"<section name="s">
                    <theorem name="t"/><definition name="d"/><note name="n"/>
                    <paragraphs name="pa"/><objectives name="o"/><question name="q"/>
                    <theorem name="t2" includeParentNumber/>
                  </section>"#;
        expect {
            "t.includeParentNumber" = 0, "d.includeParentNumber" = 0,
            "n.includeParentNumber" = 0, "pa.includeParentNumber" = 0,
            "o.includeParentNumber" = 0, "q.includeParentNumber" = 0,
            "t2.includeParentNumber" = 1,
            "t.number" = 1, "d.number" = 2, "n.number" = 3, "pa.number" = 4,
            "o.number" = 5, "q.number" = 6, "t2.number" = 7,
        }
    }

    case "questions and activities aggregate scores; theorems do not" {
        doenet r#"<question name="q"><answer>x</answer></question>
                  <activity name="a"><answer>y</answer></activity>
                  <theorem name="t"/><definition name="d"/>
                  <question name="q2" aggregateScores="false"/>"#;
        expect {
            "q.aggregateScores" = 1, "a.aggregateScores" = 1,
            "t.aggregateScores" = 0, "d.aggregateScores" = 0,
            "q2.aggregateScores" = 0,
            "q.creditAchieved" = 0, "q.percentCreditAchieved" = 0,
        }
    }

    case "problems and exercises are numbered among the divisions, their problems among themselves" {
        doenet r#"<section name="intro"/>
                  <problems name="set"><problem name="first"/><problem name="second"/></problems>
                  <exercises name="more"/>
                  <section name="outro"/>"#;
        expect {
            "intro.number" = 1, "set.number" = 2, "more.number" = 3, "outro.number" = 4,
            "first.number" = 1, "second.number" = 2,
        }
    }

    case "problems and exercises take includeParentNumber" {
        doenet r#"<section name="first"/>
                  <section name="second">
                    <problems name="drill" includeParentNumber><problem/></problems>
                    <exercises name="more" includeParentNumber><exercise/></exercises>
                    <subsection name="after"/>
                  </section>"#;
        expect {
            "drill.number" = 1, "drill.includeParentNumber" = 1,
            "more.number" = 2, "more.includeParentNumber" = 1,
            "after.number" = 3,
        }
    }

    case "the parts of a problem count from 1" {
        doenet r#"<problem name="p1"><part name="a"/><part name="b"/></problem>
                  <problem name="p2"><task name="c"/><task name="d"/><task name="e"/></problem>"#;
        expect {
            "p1.number" = 1, "p2.number" = 2,
            "a.number" = 1, "b.number" = 2,
            "c.number" = 1, "d.number" = 2, "e.number" = 3,
            "a.includeParentNumber" = 0,
        }
    }

    case "a part is a list item, and a problems' problems are its list's" {
        doenet r#"<problem name="p"><part name="a"/><proof><p>Clear.</p></proof><part name="b"/></problem>
                  <problems name="ps"><problem name="q"/></problems>
                  <exercises name="es" asList="false"/>"#;
        expect {
            "a.listItem" = 1, "p.listItem" = 0, "q.listItem" = 0,
            "ps.asList" = 1, "es.asList" = 0, "p.asList" = 0,
            "a.number" = 1, "b.number" = 3, "q.number" = 1,
        }
    }

    case "a section inside a div is numbered among the sections around it" {
        doenet r#"<section name="a"/><div><section name="b"/></div><section name="c"/>"#;
        expect { "a.number" = 1, "b.number" = 2, "c.number" = 3 }
    }
}

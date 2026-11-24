//! `<cascade>`: steps revealed as the ones before them are complete (ADR
//! 0062), in the scenarios of the current core's `cascade.test.ts`.

use crate::spec;

spec! {
    cascade;

    case "a step holding nothing scored is complete once reached" {
        doenet r#"<cascade name="c">
                    <section name="a"><p>a</p></section>
                    <section name="b"><p>b</p></section>
                  </cascade>"#;
        expect { "c.numCompleted" = 2 }
    }

    case "a step is complete when its answers are right" {
        doenet r#"<cascade name="c">
                    <section name="a"><mathInput name="m1"/><answer name="x" response="$m1">1</answer></section>
                    <section name="b"><mathInput name="m2"/><answer name="y" response="$m2">2</answer></section>
                  </cascade>"#;
        expect { "c.numCompleted" = 0, "a.creditAchievedForProgress" = 0 }
        request { "m1.value" = 1 }
        act("x", "submitAnswer")
        expect { "c.numCompleted" = 1, "a.creditAchievedForProgress" = 1 }
        request { "m2.value" = 2 }
        act("y", "submitAnswer")
        expect { "c.numCompleted" = 2 }
        request { "m1.value" = 3 }
        act("x", "submitAnswer")
        expect { "c.numCompleted" = 0 }
    }

    case "a step whose answers weigh nothing does not hold the next back" {
        doenet r#"<cascade name="c">
                    <problem name="p1"><mathInput name="m1"/><answer name="a1" response="$m1" weight="0">1</answer></problem>
                    <problem name="p2"><mathInput name="m2"/><answer name="a2" response="$m2">2</answer></problem>
                  </cascade>"#;
        expect { "c.numCompleted" = 1, "p1.creditAchievedForProgress" = 1 }
    }

    case "a held-back step is not scored" {
        doenet r#"<section name="s" aggregateScores>
                    <cascade name="c">
                      <section name="a"><mathInput name="m1"/><answer name="x" response="$m1">1</answer></section>
                      <section name="b"><mathInput name="m2"/><answer name="y" response="$m2">2</answer></section>
                    </cascade>
                  </section>"#;
        expect { "s.creditAchieved" = 0, "c.numCompleted" = 0 }
        request { "m2.value" = 2 }
        act("y", "submitAnswer")
        expect { "s.creditAchieved" = 0, "b.creditAchieved" = 1 }
        request { "m1.value" = 1 }
        act("x", "submitAnswer")
        expect { "s.creditAchieved" = 1, "c.numCompleted" = 2 }
    }

    case "revealAll shows every step" {
        doenet r#"<section name="s" aggregateScores>
                    <cascade name="c" revealAll>
                      <section name="a"><mathInput name="m1"/><answer name="x" response="$m1">1</answer></section>
                      <section name="b"><mathInput name="m2"/><answer name="y" response="$m2">2</answer></section>
                    </cascade>
                  </section>"#;
        expect { "c.revealAll" = 1 }
        request { "m2.value" = 2 }
        act("y", "submitAnswer")
        expect { "s.creditAchieved" = 0.5, "c.numCompleted" = 0 }
    }

    case "sections are numbered through a cascade" {
        doenet r#"<section name="a"/>
                  <cascade><section name="b"/><cascadeMessage>Next</cascadeMessage><section name="c"/></cascade>
                  <section name="d"/>"#;
        expect { "a.number" = 1, "b.number" = 2, "c.number" = 3, "d.number" = 4 }
    }
}

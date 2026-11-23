//! `<statement>`: looked through, as a `<div>` is in the current core
//! (`sectioning.test.ts`, "a <statement> is a container like <div>").

use crate::spec;

spec! {
    statement;

    case "a section inside a statement continues the sequence" {
        doenet r#"<problem name="p">
                    <statement><subsection name="a"/></statement>
                    <subsection name="b"/>
                  </problem>"#;
        expect { "p.number" = 1, "a.number" = 1, "b.number" = 2 }
    }

    case "an answer in a statement counts toward its problem" {
        doenet r#"<problem name="p"><statement><p>Type x: <answer>x</answer></p></statement></problem>"#;
        expect { "p.aggregateScores" = 1, "p.creditAchieved" = 0 }
    }
}

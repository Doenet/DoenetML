//! `<introduction>`: a `<div>` to the numbering, so a section inside it is numbered
//! among the sections around it (`sectioning.test.ts`, "<introduction> and
//! <conclusion> are containers like <div>").

use crate::spec;

spec! {
    introduction;

    case "a section inside an introduction continues the sequence" {
        doenet r#"<section name="s">
                    <introduction><p>First,</p><subsection name="a"/></introduction>
                    <subsection name="b"/>
                  </section>"#;
        expect { "s.number" = 1, "a.number" = 1, "b.number" = 2 }
    }

    case "its content is built" {
        doenet r#"<section><introduction><p><number name="n">2+3</number></p></introduction></section>"#;
        expect { "n.value" = 5 }
    }
}

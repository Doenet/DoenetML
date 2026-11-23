//! `<conclusion>`: looked through, as an `<introduction>` is
//! (`sectioning.test.ts`, "<introduction> and <conclusion> are containers
//! like <div>").

use crate::spec;

spec! {
    conclusion;

    case "a section inside a conclusion continues the sequence" {
        doenet r#"<section name="s">
                    <introduction><subsection name="a"/></introduction>
                    <subsection name="b"/>
                    <conclusion><subsection name="c"/></conclusion>
                  </section>"#;
        expect { "a.number" = 1, "b.number" = 2, "c.number" = 3 }
    }

    case "its content is built" {
        doenet r#"<section><conclusion><p><number name="n">2*3</number></p></conclusion></section>"#;
        expect { "n.value" = 6 }
    }
}

//! `<aside>`: numbered among the divisions around it, as the current core's
//! `sectioning.test.ts` ("the types of division share one sequence").

use crate::spec;

spec! {
    aside;

    case "an aside is numbered among the divisions around it" {
        doenet r#"<section name="a"/><aside name="b" startOpen><title>More</title></aside><section name="c"/>"#;
        expect { "a.number" = 1, "b.number" = 2, "c.number" = 3, "b.includeParentNumber" = 0 }
    }

    case "the sections inside an aside count from 1" {
        doenet r#"<section name="a"/><aside name="b"><subsection name="c"/></aside>"#;
        expect { "b.number" = 2, "c.number" = 1 }
    }

    case "includeParentNumber is a literal" {
        doenet r#"<section><aside name="b" includeParentNumber/></section>"#;
        expect { "b.includeParentNumber" = 1, "b.number" = 1 }
    }
}

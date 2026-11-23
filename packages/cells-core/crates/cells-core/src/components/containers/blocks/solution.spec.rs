//! `<solution>`: revealed by the reader, and its sections numbered among
//! themselves (`solution.test.ts`, `sectioning.test.ts`).

use crate::spec;

spec! {
    solution;

    case "closed until revealed, and closed again" {
        doenet r#"<exercise><p>What is 1+1?</p><solution name="sol"><p>2</p></solution></exercise>"#;
        expect { "sol.open" = 0 }
        request { "sol.open" = 1 }
        expect { "sol.open" = 1 }
        request { "sol.open" = 0 }
        expect { "sol.open" = 0 }
    }

    case "a solution numbers its divisions from 1" {
        doenet r#"<section name="s">
                    <subsection name="a"/>
                    <solution><subsection name="x"/><subsection name="y"/></solution>
                    <subsection name="b"/>
                  </section>"#;
        expect { "a.number" = 1, "x.number" = 1, "y.number" = 2, "b.number" = 2 }
    }
}

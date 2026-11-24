//! `<page>`: both numbering sequences pass through it (`page.test.ts`).

use crate::spec;

spec! {
    page;

    case "sections on pages are numbered as if written beside each other" {
        doenet r#"<page><section name="a"/></page>
                  <page><section name="b"/></page>
                  <section name="c"/>"#;
        expect { "a.number" = 1, "b.number" = 2, "c.number" = 3 }
    }

    case "the parts of a problem are numbered through a page" {
        doenet r#"<problem name="p"><part name="a"/><page><part name="b"/></page><part name="c"/></problem>"#;
        expect { "a.number" = 1, "b.number" = 2, "c.number" = 3 }
    }

    case "an answer on a page counts toward its problem" {
        doenet r#"<problem name="p"><page><p>Type x: <answer>x</answer></p></page></problem>"#;
        expect { "p.aggregateScores" = 1, "p.creditAchieved" = 0 }
    }
}

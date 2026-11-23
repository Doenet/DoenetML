//! `<figure>`: its content and caption. It takes no place among the
//! divisions (`sectioning.test.ts`, "figures and tables are numbered in
//! their own sequence"); its own number, shared with the tables, is counted
//! when read (ADR 0044, `tests/counters.rs`), unless `number` is off.

use crate::spec;

spec! {
    figure;

    case "a figure takes no place among the divisions" {
        doenet r#"<section name="a"/>
                  <figure><caption>A graph</caption><graph name="g" xmin="-2"/></figure>
                  <section name="b"/>"#;
        expect { "a.number" = 1, "b.number" = 2, "g.xmin" = -2 }
    }

    case "a figure with no caption" {
        doenet r#"<figure suppressFigureNameInCaption><p><number name="n">7</number></p></figure>"#;
        expect { "n.value" = 7 }
    }

    case "number is a flag, on unless given" {
        doenet r#"<figure name="a"/><figure name="b" number="false"/>"#;
        expect { "a.number" = 1, "b.number" = 0 }
    }
}

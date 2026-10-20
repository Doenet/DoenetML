//! `<number>`: its value, computed from its children.

use cells_core::spec;

spec! {
    number;

    case "a number from another, drawn as a number" {
        doenet r#"<number name="a">2</number><number name="b">$a + 1</number>"#;
        expect { "a.value" = 2, "b.value" = 3 }
        shape { "a" = "number", "b" = "number" }
    }

    // The viewer formats `displayDecimals` itself until the formatter is
    // the core's (ADR 0016, step 6), so that number has no shape.
    case "with displayDecimals, drawn by the viewer's own way" {
        doenet r#"<number name="n" displayDecimals="2">1.23456</number>"#;
        expect { "n.value" = 1.23456 }
        shape { "n" = "none" }
    }
}

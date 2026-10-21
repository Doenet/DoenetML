//! `<number>`: its value, computed from its children.

use cells_core::spec;

spec! {
    number;

    case "a number from another, drawn as a number" {
        doenet r#"<number name="a">2</number><number name="b">$a + 1</number>"#;
        expect { "a.value" = 2, "b.value" = 3 }
        shape { "a" = "number", "b" = "number" }
        export { "a" = "2", "b" = "3" }
    }

    case "four significant digits unless an integer" {
        doenet r#"<number name="a">2/3</number><number name="b">-1234567</number><number name="c">1/0</number>"#;
        export { "a" = "0.6667", "b" = "-1234567", "c" = "Infinity" }
    }

    case "in a paragraph, with text around it" {
        doenet r#"<p name="p">a &lt; <number>1/3</number> &amp; more</p>"#;
        export { "p" = "<p>a &lt; 0.3333 &amp; more</p>" }
    }

    // `displayDecimals` is the number's format, which the viewer and the
    // export both format through.
    case "with displayDecimals" {
        doenet r#"<number name="n" displayDecimals="2">1.235</number><number name="m" displayDecimals="0">2.5</number>"#;
        expect { "n.value" = 1.235 }
        shape { "n" = "number" }
        export { "n" = "1.24", "m" = "3" }
    }
}

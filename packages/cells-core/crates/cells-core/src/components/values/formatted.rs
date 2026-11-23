//! Numbers shown a particular way: `<integer>`, a number rounded to the
//! nearest integer, and `<intComma>`, a number shown with its digits in
//! groups of three (`25,236,501.35`), as the current core's `Integer.js`
//! and `IntComma.js`.
//!
//! The current core's `<intComma>` is a text: it groups the decimal number
//! its text begins with and keeps the rest as written, so `1000.50` shows
//! `1,000.50` and `not a number` itself. Here it is a number, read from its
//! children as a `<number>` is, so that a computed value can be grouped:
//! the grouping is how it shows
//! ([`TextKind::Grouped`](crate::components::TextKind::Grouped)), and text that is
//! no number is NaN. The separator is English's comma; the current core
//! takes the document's language's.

use crate::components::ComponentDef;

/// The definition of `<integer>`.
mod integer {
    use crate::components::define::*;

    component! {
        /// `<integer>`: its children, a value as a `<number>`'s, rounded
        /// half toward positive infinity, as `Math.round`. A request
        /// writes the asked value so rounded to them.
        tags: ["integer"],
        flags: [copyable],
        value: Number,
        props {
            valuePreRound: children,
            value: computed(OpSpec::Round, [valuePreRound]) { rendered },
            ..anchor
        }
        children: Value,
        planner: Props,
    }
}

/// The definition of `<intComma>`.
mod int_comma {
    use crate::components::define::*;

    component! {
        /// `<intComma>`: its children, a value as a `<number>`'s, shown
        /// with its integer digits in groups of three.
        tags: ["intComma"],
        flags: [copyable],
        value: Grouped,
        props {
            value: children { rendered },
            ..anchor
        }
        children: Value,
        planner: Props,
    }
}

/// `<integer>`.
pub(crate) const INTEGER: ComponentDef = integer::DEFINITION;
/// `<intComma>`.
pub(crate) const INT_COMMA: ComponentDef = int_comma::DEFINITION;

#[cfg(all(test, feature = "testing"))]
#[path = "formatted.spec.rs"]
mod spec;

#[cfg(all(test, feature = "testing"))]
mod tests {
    use crate::testing::test_utils::load;

    /// The text the component named `name` shows.
    fn text(source: &str, name: &str) -> String {
        let doc = load(source).unwrap();
        doc.rendered_text(doc.resolve_path(name).unwrap())
    }

    #[test]
    fn an_integer_shows_without_a_decimal_point() {
        assert_eq!(text(r#"<p name="p"><integer>2.6</integer></p>"#, "p"), "3");
    }

    #[test]
    fn an_int_comma_groups_its_integer_digits_by_three() {
        assert_eq!(
            text(r#"<p name="p"><intComma>25236501.35</intComma></p>"#, "p"),
            "25,236,501.35"
        );
        assert_eq!(
            text(r#"<p name="p"><intComma>999</intComma></p>"#, "p"),
            "999"
        );
        assert_eq!(
            text(r#"<p name="p"><intComma>-1234567</intComma></p>"#, "p"),
            "-1,234,567"
        );
        assert_eq!(
            text(
                r#"<number name="n">1000000</number><p name="p"><intComma>$n</intComma></p>"#,
                "p"
            ),
            "1,000,000"
        );
    }
}

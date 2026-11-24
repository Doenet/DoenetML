//! A number's and a math's display settings (ADR 0058, ADR 0071), as a
//! reader resolves them: the nearest of the component and its referents
//! that writes a setting gives it, digits and decimals together, as the
//! current core's `utils/numberDisplay.js` does and the bridge's
//! `displaySettings` (`contracts.ts`) does for a math's LaTeX. The text
//! the core composes (`rendered_text`) rounds by them.

use super::*;
use crate::sym::Display;

/// The props a type declares for its display settings (ADR 0058), in the
/// order of the six numbers a reader passes as settings.
const SETTINGS: [&str; 6] = [
    "displayDigits",
    "displayDecimals",
    "displaySmallAsZero",
    "padZeros",
    "avoidScientificNotation",
    "displayBlanks",
];

/// Display settings, as a reader resolves them.
impl Document {
    /// Whether components of `c`'s type round what they show by their
    /// display settings: the types that declare them (ADR 0058).
    pub fn has_display_settings(&self, c: CompIdx) -> bool {
        self.component_type(c).prop_index(SETTINGS[0]).is_some()
    }

    /// The display settings of `c`: from the nearest of `c` and its
    /// referents that writes digits or decimals, both (the one it does
    /// not write off: digits 0, decimals none), else 3 digits and at
    /// least 2 decimals; each other setting from the nearest that writes
    /// it, else its default. Also the cells read, for a reader that
    /// recomputes when one changes.
    pub fn display_settings(&self, c: CompIdx) -> (Display, Vec<CellIdx>) {
        let mut reads = Vec::new();
        let mut d = Display::default();
        let mut k = Some(c);
        while let Some(at) = k {
            let digits = self.own_setting(at, SETTINGS[0], 1.0, &mut reads);
            let decimals = self.own_setting(at, SETTINGS[1], 1.0, &mut reads);
            if digits.is_some() || decimals.is_some() {
                d.digits = digits.unwrap_or(0.0);
                d.decimals = decimals.unwrap_or(f64::NEG_INFINITY);
                break;
            }
            k = self.components.referent(at);
        }
        let through = |name: &str, if_true: f64, reads: &mut Vec<CellIdx>| {
            let mut k = Some(c);
            while let Some(at) = k {
                if let Some(v) = self.own_setting(at, name, if_true, reads) {
                    return Some(v);
                }
                k = self.components.referent(at);
            }
            None
        };
        if let Some(v) = through(SETTINGS[2], d.small_as_zero, &mut reads) {
            d.small_as_zero = v;
        }
        if let Some(v) = through(SETTINGS[3], 1.0, &mut reads) {
            d.pad_zeros = v != 0.0;
        }
        if let Some(v) = through(SETTINGS[4], 1.0, &mut reads) {
            d.avoid_scientific_notation = v != 0.0;
        }
        if let Some(v) = through(SETTINGS[5], 1.0, &mut reads) {
            d.show_blanks = v != 0.0;
        }
        (d, reads)
    }

    /// Whether value `c` is hidden by a `hide` planned as a display setting
    /// is (ADR 0071): the nearest of it and its referents that writes
    /// `hide` gives it, so an extend keeps its referent's unless it says
    /// `hide="false"`. A type whose `hide` is its planner's (a point's)
    /// holds 0 or 1 and gives it alike.
    pub fn hidden_value(&self, c: CompIdx) -> bool {
        let mut k = Some(c);
        while let Some(at) = k {
            match self.own_setting(at, "hide", 1.0, &mut Vec::new()) {
                Some(v) => return v != 0.0,
                None if self.component_type(at).prop_index("hide").is_none() => return false,
                None => k = self.components.referent(at),
            }
        }
        false
    }

    /// Setting `name` as `k` writes it, or none. When `k`'s type has a
    /// cell for it (ADR 0058), that cell, not given while NaN (a
    /// reference is no literal attribute, so the cell is what says `k`
    /// writes it); else its literal attribute, a bare or `true` flag
    /// reading as `if_true`, `false` as 0.
    fn own_setting(
        &self,
        k: CompIdx,
        name: &str,
        if_true: f64,
        reads: &mut Vec<CellIdx>,
    ) -> Option<f64> {
        if let Some(pi) = self.component_type(k).prop_index(name)
            && let Some(&cell) = self.comp_cells(k).get(pi)
        {
            reads.push(cell);
            let v = self.cells[cell.index()];
            return (!v.is_nan()).then_some(v);
        }
        let text = self.attr_text(k, name)?;
        let t = text.trim().to_ascii_lowercase();
        match t.as_str() {
            "" | "true" => Some(if_true),
            "false" => Some(0.0),
            _ => t.parse::<f64>().ok().filter(|v| !v.is_nan()),
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::document::CompIdx;
    use crate::testing::test_utils::load;

    fn text(src: &str, name: &str) -> String {
        let doc = load(src).unwrap();
        let c = doc.resolve_path(name).unwrap_or_else(|| {
            let all: Vec<_> = (0..doc.n_components())
                .map(|i| {
                    let c = CompIdx::new(i as u32);
                    (doc.component_type(c).tag(), doc.name(c).map(str::to_string))
                })
                .collect();
            panic!("{name}: {all:?}")
        });
        doc.rendered_text(c)
    }

    #[test]
    fn a_number_and_a_math_show_rounded_by_their_settings() {
        let src = r#"<number name="a">5.123456</number>
<number name="b" displayDigits="5">5.123456</number>
<math name="c">5.123456 x</math>
<number name="d" displayDecimals="1">5.123456</number>
<math name="e" padZeros displayDecimals="3">2</math>
<p name="p"><number>5.123456</number> $b $c</p>"#;
        assert_eq!(text(src, "a"), "5.12");
        assert_eq!(text(src, "b"), "5.1235");
        assert_eq!(text(src, "c"), "5.12 x");
        assert_eq!(text(src, "d"), "5.1");
        assert_eq!(text(src, "e"), "2.000");
        // A reference shows by its referent's settings.
        assert_eq!(text(src, "p"), "5.12 5.1235 5.12 x");
    }

    #[test]
    fn an_extend_s_own_setting_wins_and_turns_the_other_off() {
        let src = r#"<number name="n" displayDigits="5">1.23456789</number>
<number name="c" extend="$n" />
<number name="e" extend="$n" displayDecimals="1" />"#;
        assert_eq!(text(src, "c"), "1.2346");
        assert_eq!(text(src, "e"), "1.2");
    }

    #[test]
    fn a_setting_given_by_a_reference_follows_it() {
        let src = r#"<number name="k">2</number>
<number name="n" displayDigits="$k">1.23456789</number>"#;
        assert_eq!(text(src, "n"), "1.2");
    }

    #[test]
    fn a_sole_child_reference_gives_its_settings_but_an_operand_does_not() {
        // value_references.test.ts, "display settings follow a direct
        // reference, not an operand, and yield to the parent's own".
        let src = r#"<number name="n" displayDigits="5">5.123456</number>
<number name="m1">$n</number>
<number name="m2">$n+1</number>
<math name="m3">$n</math>
<number name="m5">2$n</number>
<number name="m6" displayDigits="2">$n</number>
<number name="m7" displayDecimals="1">$n</number>"#;
        assert_eq!(text(src, "m1"), "5.1235");
        assert_eq!(text(src, "m2"), "6.12");
        assert_eq!(text(src, "m3"), "5.1235");
        assert_eq!(text(src, "m5"), "10.25");
        assert_eq!(text(src, "m6"), "5.1");
        assert_eq!(text(src, "m7"), "5.1");
    }

    #[test]
    fn a_hidden_value_is_not_in_its_parent_s_text_nor_is_a_copy_of_it() {
        // extend_references.test.ts, "copy does not ignore hide by
        // default, with copySource".
        let src = r#"<p name="p1">Hidden text: <text name="hidden" hide>secret</text></p>
<p name="p2">Hidden by default: <text extend="$hidden" /></p>
<p name="p3">Hidden by default 2: $hidden</p>
<p name="p4">Force to reveal: <text extend="$hidden" hide="false" /></p>
<boolean name="b">true</boolean>
<p name="p5"><math hide="$b">x</math><number hide="false">2</number></p>"#;
        assert_eq!(text(src, "p1"), "Hidden text: ");
        assert_eq!(text(src, "p2"), "Hidden by default: ");
        assert_eq!(text(src, "p3"), "Hidden by default 2: ");
        assert_eq!(text(src, "p4"), "Force to reveal: secret");
        assert_eq!(text(src, "p5"), "2");
        // A `<p>` and an `<m>` hide alike.
        let src2 = r#"<p name="p">a <m hide>x</m> b</p><p name="h" hide>gone</p>"#;
        assert_eq!(text(src2, "p"), "a  b");
        let doc = load(src2).unwrap();
        assert!(doc.hidden_value(doc.resolve_path("h").unwrap()));
        assert!(!doc.hidden_value(doc.resolve_path("p").unwrap()));
        // Its own text is still its text.
        assert_eq!(text(src, "hidden"), "secret");
    }

    #[test]
    fn a_missing_value_still_shows_the_blank() {
        let src = r#"<number name="n">$nothing</number>"#;
        assert_eq!(text(src, "n"), "\u{ff3f}");
    }
}

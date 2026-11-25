//! A component's style (ADR 0084): its style number, and the style that
//! number names in its scope's table with its own override attributes
//! over it, as the JavaScript core's `styleNumber` and `selectedStyle`.

use super::*;
use crate::style::{Key, Scope, Style, StyleTables, parse_value};

/// The style keys a component may set on itself (`STYLE_OVERRIDE_CATEGORIES`
/// in `style.ts`): its marker, line and fill keys that are neither a
/// color nor an opacity a contrast check reads. A type takes those of its
/// categories as presentation attributes.
const OVERRIDES: [Key; 8] = [
    Key::MarkerStyle,
    Key::MarkerSize,
    Key::MarkerFilled,
    Key::LineStyle,
    Key::LineWidth,
    Key::FillOpacity,
    Key::FillPatternOpacity,
    Key::FillStyle,
];

/// The values a keyword override takes, lowercased; another is ignored.
fn valid(key: Key, value: &str) -> bool {
    match key {
        Key::MarkerStyle => matches!(
            value,
            "circle"
                | "square"
                | "triangle"
                | "triangleup"
                | "triangledown"
                | "triangleleft"
                | "triangleright"
                | "diamond"
                | "cross"
                | "plus"
        ),
        Key::LineStyle => matches!(value, "solid" | "dashed" | "dotted"),
        Key::FillStyle => matches!(
            value,
            "solid" | "horizontal" | "vertical" | "diagonal" | "backdiagonal" | "dots" | "diamonds"
        ),
        _ => true,
    }
}

/// Styles, as a reader resolves them.
impl Document {
    /// The style number of `c`: the nearest of it and its referents that
    /// writes `styleNumber` (a literal, or a cell when its type has one),
    /// else its parent's, else 1, as the current core falls back to the
    /// parent and the source composite. Also the cells read.
    pub fn style_number(&self, c: CompIdx) -> (f64, Vec<CellIdx>) {
        let mut reads = Vec::new();
        let mut at = Some(c);
        while let Some(p) = at {
            let mut k = Some(p);
            while let Some(r) = k {
                if let Some(v) = self.own_style_number(r, &mut reads) {
                    return (v, reads);
                }
                k = self.components.referent(r);
            }
            at = self.parent(p);
        }
        (1.0, reads)
    }

    /// `styleNumber` as `k` writes it, rounded as an integer attribute is.
    fn own_style_number(&self, k: CompIdx, reads: &mut Vec<CellIdx>) -> Option<f64> {
        if let Some(pi) = self.component_type(k).prop_index("styleNumber")
            && let Some(&cell) = self.comp_cells(k).get(pi)
        {
            reads.push(cell);
            let v = self.cells[cell.index()];
            return (!v.is_nan()).then_some(v.round());
        }
        let text = self.attr_text(k, "styleNumber")?;
        text.trim()
            .parse::<f64>()
            .ok()
            .filter(|v| !v.is_nan())
            .map(f64::round)
    }

    /// The scope whose table styles `c`: that of its nearest ancestor that
    /// is one.
    fn style_scope(&self, c: CompIdx) -> Scope {
        let tables: &StyleTables = &self.loaded.styles;
        let mut at = self.parent(c);
        while let Some(p) = at {
            let node = self.components.dast_node[p.index()];
            if node != crate::dast::NodeId::NONE
                && let Some(scope) = tables.scope(node)
            {
                return scope.clone();
            }
            at = self.parent(p);
        }
        tables
            .scope(crate::dast::Dast::ROOT)
            .cloned()
            .unwrap_or_else(StyleTables::fallback)
    }

    /// The heading colors of section `c` (ADR 0084), as JSON: `light`
    /// and `dark`, each the colors of its completed, in-progress and
    /// not-started states; none for a component that is no section.
    pub fn heading_colors(&self, c: CompIdx) -> Option<String> {
        let mut k = Some(c);
        // A copy of a section has its referent's colors.
        while let Some(r) = k {
            let n = self.components.dast_node[r.index()];
            if n != crate::dast::NodeId::NONE
                && let Some(h) = self.loaded.styles.heading_colors(n)
            {
                return Some(h.to_string());
            }
            k = self.components.referent(r);
        }
        None
    }

    /// The style of `c` (`selectedStyle`), every key, as JSON: the style
    /// its style number names in its scope, with the override attributes
    /// it, or the nearest of its referents, writes over it. Also the cells
    /// read.
    pub fn selected_style(&self, c: CompIdx) -> (String, Vec<CellIdx>) {
        let (n, reads) = self.style_number(c);
        let mut style: Style = self.style_scope(c).style(n);
        let mut over = Style::default();
        for key in OVERRIDES {
            let mut k = Some(c);
            while let Some(r) = k {
                if let Some(text) = self.attr_text(r, key.name()) {
                    let val = parse_value(key, &text, false);
                    let ok = match &val {
                        crate::style::Val::Str(s) => valid(key, s),
                        _ => true,
                    };
                    if ok {
                        over.set(key, val, None);
                    }
                    break;
                }
                k = self.components.referent(r);
            }
        }
        over.derive_missing_words();
        style.assign(&over);
        (style.resolved_json().to_string(), reads)
    }
}

#[cfg(test)]
#[path = "styles.test.rs"]
mod tests;

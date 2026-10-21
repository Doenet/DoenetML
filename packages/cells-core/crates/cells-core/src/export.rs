//! PreTeXt export (ADR 0016): the document as PreTeXt XML, written from the
//! same view shapes the viewer draws, one arm per primitive, so a component
//! with a shape exports with no code of its own. Numbers go through the one
//! formatter (`crate::format`): as the component shows them in text, as
//! `String(n)` in a PreFigure diagram, which is what the current core's
//! export writes. Components without a shape export their text, or pass
//! their children through, until they have one.

use crate::components::view::{LIST, Prim, PrimUse};
use crate::components::{ComponentType, prop};
use crate::document::{Child, CompIdx, Document, NO_SHAPE};
use crate::format::js_string;

/// The width and height of a diagram, the current core's default.
const DIAGRAM_SIZE: &str = "(425,425)";

impl Document {
    /// The document as PreTeXt XML.
    pub fn pretext(&self) -> String {
        let mut out = Export {
            doc: self,
            out: String::new(),
            board: None,
        };
        if self.n_components() > 0 {
            out.component(0);
        }
        out.out
    }

    /// One component as PreTeXt XML, as it stands in the document's.
    pub fn pretext_of(&self, c: CompIdx) -> String {
        let in_graph = std::iter::successors(self.parent(c), |&p| self.parent(p))
            .any(|p| self.component_type(p) == ComponentType::Graph);
        let mut out = Export {
            doc: self,
            out: String::new(),
            board: in_graph.then(Vec::new),
        };
        out.component(c);
        out.out
    }
}

struct Export<'a> {
    doc: &'a Document,
    out: String,
    /// Inside a board: the handles used so far, by component type, which
    /// name its elements as the current core's export does (`point_0`).
    board: Option<Vec<(ComponentType, u32)>>,
}

impl Export<'_> {
    fn component(&mut self, c: CompIdx) {
        let doc = self.doc;
        let shape = doc.components.shape[c as usize];
        if shape != NO_SHAPE {
            let shape = &doc.component_type(c).shapes()[shape as usize];
            // What holds a shape in the page holds it in PreTeXt: a title,
            // or a division, which a heading names.
            let wrap = if shape.tag == Some("h2") {
                Some("title")
            } else {
                shape
                    .nodes
                    .iter()
                    .find(|u| u.prim == Prim::Heading)
                    .map(|u| division(doc.cells[doc.comp_cells(c)[u.props()[0] as usize] as usize]))
            };
            if let Some(w) = wrap {
                self.out.push_str(&format!("<{w}>"));
            }
            for use_ in shape.nodes {
                self.prim(c, use_);
            }
            if let Some(w) = wrap {
                self.out.push_str(&format!("</{w}>"));
            }
            return;
        }
        if self.board.is_some() {
            // Only primitives draw on a board.
            return self.children(c);
        }
        let hidden = |prop: &str| {
            doc.prop_cells(c, prop)
                .is_some_and(|cells| shown_hidden(doc.cells[cells[0] as usize]))
        };
        match doc.component_type(c) {
            ComponentType::P => {
                self.out.push_str("<p>");
                self.children(c);
                self.out.push_str("</p>");
            }
            ComponentType::Setup | ComponentType::ShortDescription => {}
            ComponentType::Case
                if doc.cells[doc.comp_cells(c)[prop::case::ACTIVE] as usize] != 1.0 => {}
            ComponentType::ConditionalContent | ComponentType::Select if hidden("hide") => {}
            ComponentType::Text
            | ComponentType::TextInput
            | ComponentType::Boolean
            | ComponentType::Math
            | ComponentType::MathInput
            | ComponentType::NumberInput => escape_into(&mut self.out, &doc.rendered_text(c)),
            _ => self.children(c),
        }
    }

    fn children(&mut self, c: CompIdx) {
        for ch in self.doc.children(c) {
            match ch {
                Child::Text(t) if self.board.is_none() => escape_into(&mut self.out, t),
                Child::Text(_) => {}
                Child::Component(k) => self.component(k),
            }
        }
    }

    fn prim(&mut self, c: CompIdx, use_: &PrimUse) {
        let doc = self.doc;
        let cells = doc.comp_cells(c);
        // A list slot reads as NaN here; its points are `list`.
        let v: Vec<f64> = use_
            .props()
            .iter()
            .map(|&i| match i {
                LIST => f64::NAN,
                i => doc.cells[cells[i as usize] as usize],
            })
            .collect();
        let list: Vec<f64> = if use_.binds_list() {
            let fixed = doc.component_type(c).prop_defs().len();
            cells[fixed..]
                .iter()
                .map(|&x| doc.cells[x as usize])
                .collect()
        } else {
            Vec::new()
        };
        let format = doc.components.format[c as usize];
        match (use_.prim, self.board.is_some()) {
            (Prim::Number, false) => escape_into(&mut self.out, &format.apply(v[0])),
            (Prim::Coords, false) if !shown_hidden(v[2]) => {
                let text = format!("({}, {})", format.apply(v[0]), format.apply(v[1]));
                self.out.push_str("<m>");
                escape_into(&mut self.out, &text);
                self.out.push_str("</m>");
            }
            // A control has no print form; its value is a number beside it.
            (Prim::Range, _) => {}
            (Prim::Board, false) => self.board(c, &v),
            (Prim::Point, true) if !shown_hidden(v[2]) && finite(&v[..2]) => {
                let at = self.handle(c);
                self.out.push_str(&format!(
                    r#"<point at="{at}" p="({},{})" />"#,
                    js_string(v[0]),
                    js_string(v[1])
                ));
            }
            (Prim::Circle, true) if finite(&v) => {
                let at = self.handle(c);
                self.out.push_str(&format!(
                    r#"<circle at="{at}" center="({},{})" radius="{}" />"#,
                    js_string(v[0]),
                    js_string(v[1]),
                    js_string(v[2])
                ));
            }
            (Prim::Polygon, true) => {
                let n = if v[0].is_finite() { v[0] as usize } else { 0 };
                let pts = &list[..(2 * n).min(list.len())];
                if pts.len() >= 4 && finite(pts) {
                    let at = self.handle(c);
                    let points: Vec<String> = pts
                        .chunks(2)
                        .map(|p| format!("({},{})", js_string(p[0]), js_string(p[1])))
                        .collect();
                    self.out.push_str(&format!(
                        r#"<polygon at="{at}" points="({})" closed="yes" />"#,
                        points.join(",")
                    ));
                }
            }
            (Prim::MathField, false) => self.out.push_str(r#"<m><fillin characters="8" /></m>"#),
            (Prim::Contents, _) => self.children(c),
            // A button, a score and a section's number have no print form;
            // PreTeXt numbers its divisions itself.
            (Prim::Submit | Prim::Credit | Prim::Heading, _) => {}
            _ => {}
        }
    }

    /// A graph's diagram, its bounding box from `xmin, ymax, xmax, ymin`.
    fn board(&mut self, c: CompIdx, b: &[f64]) {
        let doc = self.doc;
        let label = match doc.name(c) {
            Some(n) => format!("prefigure-{}", handle_text(n)),
            None => format!("prefigure-graph{c}"),
        };
        self.out.push_str(&format!(
            r#"<image><prefigure label="{label}" xmlns="https://prefigure.org"><diagram dimensions="{DIAGRAM_SIZE}"><coordinates bbox="({},{},{},{})"><axes axes="all" />"#,
            js_string(b[0]),
            js_string(b[3]),
            js_string(b[2]),
            js_string(b[1]),
        ));
        let outer = self.board.replace(Vec::new());
        self.children(c);
        self.board = outer;
        self.out
            .push_str("</coordinates></diagram></prefigure></image>");
    }

    /// The next handle for a board element of `c`'s type: its tag and how
    /// many of its type came before it on this board.
    fn handle(&mut self, c: CompIdx) -> String {
        let t = self.doc.component_type(c);
        let used = self.board.as_mut().expect("on a board");
        let n = match used.iter_mut().find(|(k, _)| *k == t) {
            Some((_, n)) => {
                *n += 1;
                *n
            }
            None => {
                used.push((t, 0));
                0
            }
        };
        format!("{}_{n}", handle_text(t.tag()))
    }
}

/// The PreTeXt division a section's `label` makes: its tag.
fn division(label: f64) -> &'static str {
    let i = if label.is_finite() { label as usize } else { 0 };
    crate::components::SECTION_TAGS
        .get(i)
        .map_or("section", |t| t.0)
}

/// A `hide` value that hides: anything but 0 and NaN.
fn shown_hidden(h: f64) -> bool {
    h != 0.0 && !h.is_nan()
}

fn finite(v: &[f64]) -> bool {
    v.iter().all(|x| x.is_finite())
}

/// Lowercase letters, digits, `_` and `-`, the rest as `-`.
fn handle_text(s: &str) -> String {
    s.chars()
        .map(|ch| {
            let ch = ch.to_ascii_lowercase();
            if ch.is_ascii_alphanumeric() || ch == '_' || ch == '-' {
                ch
            } else {
                '-'
            }
        })
        .collect()
}

fn escape_into(out: &mut String, text: &str) {
    for ch in text.chars() {
        match ch {
            '&' => out.push_str("&amp;"),
            '<' => out.push_str("&lt;"),
            '>' => out.push_str("&gt;"),
            '"' => out.push_str("&quot;"),
            _ => out.push(ch),
        }
    }
}

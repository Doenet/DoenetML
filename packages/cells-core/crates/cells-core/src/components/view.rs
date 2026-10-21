//! View shapes (ADR 0016): how a component is drawn, as primitives bound to
//! its props. The primitives are the viewer's (`packages/cells-viewer/src/
//! renderers/prims.tsx`), owned by the core team; a component type declares
//! its shapes beside its prop table, and the build picks one per component
//! (`ComponentTable::shape`), so the viewer never branches on a component's
//! attributes or context. A shape binds props by position, resolved from
//! their names when the crate compiles: a name not in the table does not
//! compile. `tests/view_shapes.rs` writes the shapes out for the viewer
//! (`src/generated/shapes.ts`) and fails when that file is stale.
//!
//! ```ignore
//! const SLIDER_VIEW: &[PrimUse] =
//!     &bind(SLIDER_PROPS, [range("from", "to", "step", "value"), number("value")]);
//! ...info(&["slider"], SLIDER_PROPS).shapes(&[shape("slider", When::Always, SLIDER_VIEW)])
//! ```

use super::PropDef;
use super::define::at;

/// A primitive of the viewer. Each binds a fixed list of slots
/// (`Prim::slots`), filled by props of the component it draws.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Prim {
    /// A number as text, updated in place.
    Number,
    /// A range control writing its value.
    Range,
    /// A draggable point on the board.
    Point,
    /// A point's coordinates as text, `(x, y)`, updated in place.
    Coords,
    /// A circle on the board, dragged by its center.
    Circle,
    /// A graph's board: its bounding box (`xmin`, `ymax`, `xmax`, `ymin`,
    /// JSXGraph's order), which a pan or zoom requests; it draws the
    /// component's children on itself.
    Board,
    /// A polygon on the board: its vertex count and its list, the vertices,
    /// each dragged on its own and the whole by its interior.
    Polygon,
    /// A field a student types math into, showing the expression its
    /// `expr` holds and requesting what they type, parsed, on commit.
    MathField,
    /// A button that submits the component's answer.
    Submit,
    /// The credit an answer earned, once it has been submitted.
    Credit,
    /// A section's heading: its label's word and its number, after its
    /// enclosing section's when it includes it.
    Heading,
    /// The component's children, drawn where the shape puts them.
    Contents,
}

/// The most slots a primitive binds.
pub const MAX_PRIM_SLOTS: usize = 4;

impl Prim {
    pub const ALL: &[Prim] = &[
        Prim::Number,
        Prim::Range,
        Prim::Point,
        Prim::Coords,
        Prim::Circle,
        Prim::Board,
        Prim::Polygon,
        Prim::MathField,
        Prim::Submit,
        Prim::Credit,
        Prim::Heading,
        Prim::Contents,
    ];

    pub const fn name(self) -> &'static str {
        match self {
            Prim::Number => "number",
            Prim::Range => "range",
            Prim::Point => "point",
            Prim::Coords => "coords",
            Prim::Circle => "circle",
            Prim::Board => "board",
            Prim::Polygon => "polygon",
            Prim::MathField => "mathField",
            Prim::Submit => "submit",
            Prim::Credit => "credit",
            Prim::Heading => "heading",
            Prim::Contents => "contents",
        }
    }

    /// The slots it binds, in order.
    pub const fn slots(self) -> &'static [&'static str] {
        match self {
            Prim::Number => &["value"],
            Prim::Range => &["min", "max", "step", "value"],
            Prim::Point | Prim::Coords => &["x", "y", "hide"],
            Prim::Circle => &["cx", "cy", "radius"],
            Prim::Board => &["xmin", "ymax", "xmax", "ymin"],
            Prim::Polygon => &["count", "vertices[]"],
            Prim::MathField => &["expr"],
            Prim::Submit | Prim::Contents => &[],
            Prim::Credit => &["credit", "submissions"],
            Prim::Heading => &["label", "number", "includeParentNumber"],
        }
    }
}

/// A primitive with each slot's prop named, before the names are resolved.
#[derive(Clone, Copy)]
pub struct Bind {
    prim: Prim,
    props: [&'static str; MAX_PRIM_SLOTS],
}

/// A primitive with each slot's prop position in the component's props.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PrimUse {
    pub prim: Prim,
    at: [u8; MAX_PRIM_SLOTS],
}

/// A slot's position for the component's list (`Prim::Polygon`'s
/// vertices): every coordinate of every point it has, not one prop.
pub const LIST: u8 = 254;

/// The name a shape binds a list slot with.
const LIST_NAME: &str = "[list]";

impl PrimUse {
    /// The position of each slot's prop, or `LIST`.
    pub fn props(&self) -> &[u8] {
        &self.at[..self.prim.slots().len()]
    }

    /// Whether a slot binds the component's list.
    pub const fn binds_list(&self) -> bool {
        let mut i = 0;
        while i < self.prim.slots().len() {
            if self.at[i] == LIST {
                return true;
            }
            i += 1;
        }
        false
    }
}

/// When a shape is the one a component is drawn with; the first of its
/// type's shapes that applies is.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum When {
    Always,
    /// Inside a `<graph>`.
    InGraph,
    /// Its element does not give the attribute (a `<number>` without
    /// `displayDecimals`).
    WithoutAttr(&'static str),
}

/// A way to draw a component type.
#[derive(Debug, Clone, Copy)]
pub struct ViewShape {
    pub name: &'static str,
    pub when: When,
    pub nodes: &'static [PrimUse],
    /// The element that holds its primitives in the page (`h2`,
    /// `section`), when not a `span` or, for a block, a `div`.
    pub tag: Option<&'static str>,
}

pub const fn shape(name: &'static str, when: When, nodes: &'static [PrimUse]) -> ViewShape {
    ViewShape {
        name,
        when,
        nodes,
        tag: None,
    }
}

impl ViewShape {
    /// Held in the page by a `tag` element.
    pub const fn tag(mut self, tag: &'static str) -> ViewShape {
        self.tag = Some(tag);
        self
    }
}

const fn bind_of(prim: Prim, names: &[&'static str]) -> Bind {
    assert!(
        names.len() == prim.slots().len(),
        "a primitive binds as many props as it has slots"
    );
    let mut props = [""; MAX_PRIM_SLOTS];
    let mut i = 0;
    while i < names.len() {
        props[i] = names[i];
        i += 1;
    }
    Bind { prim, props }
}

/// `number(value)`.
pub const fn number(value: &'static str) -> Bind {
    bind_of(Prim::Number, &[value])
}

/// `range(min, max, step, value)`.
pub const fn range(
    min: &'static str,
    max: &'static str,
    step: &'static str,
    value: &'static str,
) -> Bind {
    bind_of(Prim::Range, &[min, max, step, value])
}

/// `point(x, y, hide)`.
pub const fn point(x: &'static str, y: &'static str, hide: &'static str) -> Bind {
    bind_of(Prim::Point, &[x, y, hide])
}

/// `coords(x, y, hide)`.
pub const fn coords(x: &'static str, y: &'static str, hide: &'static str) -> Bind {
    bind_of(Prim::Coords, &[x, y, hide])
}

/// `circle(cx, cy, radius)`.
pub const fn circle(cx: &'static str, cy: &'static str, radius: &'static str) -> Bind {
    bind_of(Prim::Circle, &[cx, cy, radius])
}

/// `board(xmin, ymax, xmax, ymin)`.
pub const fn board(
    xmin: &'static str,
    ymax: &'static str,
    xmax: &'static str,
    ymin: &'static str,
) -> Bind {
    bind_of(Prim::Board, &[xmin, ymax, xmax, ymin])
}

/// `polygon(count)`: the count and the component's list.
pub const fn polygon(count: &'static str) -> Bind {
    bind_of(Prim::Polygon, &[count, LIST_NAME])
}

/// `mathField(expr)`.
pub const fn math_field(expr: &'static str) -> Bind {
    bind_of(Prim::MathField, &[expr])
}

/// `submit()`.
pub const fn submit() -> Bind {
    bind_of(Prim::Submit, &[])
}

/// `credit(credit, submissions)`.
pub const fn credit(credit: &'static str, submissions: &'static str) -> Bind {
    bind_of(Prim::Credit, &[credit, submissions])
}

/// `heading(label, number, includeParentNumber)`.
pub const fn heading(
    label: &'static str,
    number: &'static str,
    include_parent: &'static str,
) -> Bind {
    bind_of(Prim::Heading, &[label, number, include_parent])
}

/// `contents()`.
pub const fn contents() -> Bind {
    bind_of(Prim::Contents, &[])
}

const fn str_eq(a: &str, b: &str) -> bool {
    let (a, b) = (a.as_bytes(), b.as_bytes());
    if a.len() != b.len() {
        return false;
    }
    let mut i = 0;
    while i < a.len() {
        if a[i] != b[i] {
            return false;
        }
        i += 1;
    }
    true
}

/// The binds of a shape with their props resolved in `table`. A name not
/// in the table fails to compile.
pub const fn bind<const N: usize>(table: &[PropDef], binds: [Bind; N]) -> [PrimUse; N] {
    let blank = PrimUse {
        prim: Prim::Number,
        at: [0; MAX_PRIM_SLOTS],
    };
    let mut out = [blank; N];
    let mut i = 0;
    while i < N {
        let b = binds[i];
        let mut at_ = [0u8; MAX_PRIM_SLOTS];
        let mut j = 0;
        while j < b.prim.slots().len() {
            at_[j] = if str_eq(b.props[j], LIST_NAME) {
                LIST
            } else {
                at(table, b.props[j]) as u8
            };
            j += 1;
        }
        out[i] = PrimUse {
            prim: b.prim,
            at: at_,
        };
        i += 1;
    }
    out
}

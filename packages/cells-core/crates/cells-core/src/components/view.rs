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
    ];

    pub const fn name(self) -> &'static str {
        match self {
            Prim::Number => "number",
            Prim::Range => "range",
            Prim::Point => "point",
            Prim::Coords => "coords",
            Prim::Circle => "circle",
        }
    }

    /// The slots it binds, in order.
    pub const fn slots(self) -> &'static [&'static str] {
        match self {
            Prim::Number => &["value"],
            Prim::Range => &["min", "max", "step", "value"],
            Prim::Point | Prim::Coords => &["x", "y", "hide"],
            Prim::Circle => &["cx", "cy", "radius"],
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

impl PrimUse {
    /// The position of each slot's prop.
    pub fn props(&self) -> &[u8] {
        &self.at[..self.prim.slots().len()]
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
}

pub const fn shape(name: &'static str, when: When, nodes: &'static [PrimUse]) -> ViewShape {
    ViewShape { name, when, nodes }
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
            at_[j] = at(table, b.props[j]) as u8;
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

//! Document, graph, p, setup, group, sticky group, section, and the text
//! and layout containers: types that hold other components. Document and section also hold credit.

use super::define::*;

pub mod section;

pub use section::SECTION_TAGS;

/// `<document>`: the root, and the credit of everything scored in it.
pub mod document {
    use super::*;

    component! {
        /// The root. `creditAchieved` and `percentCreditAchieved` are
        /// aggregates over the scored items.
        tags: ["document"],
        roles: [Root],
        props {
            creditAchieved: aggregate(Credit, ScoredItems) { score },
            percentCreditAchieved: aggregate(PercentCredit, ScoredItems),
        }
        planner: Props,
    }

    /// The position of `creditAchieved`: the weighted credit of the document's scored items.
    pub const CREDIT: usize = Props::AT.creditAchieved;
    /// The position of `percentCreditAchieved`: that credit as a percentage.
    pub const PERCENT_CREDIT: usize = Props::AT.percentCreditAchieved;
}

/// `<graph>`: the container shapes are drawn in, and its visible ranges.
pub mod graph {
    use super::*;

    component! {
        /// `<graph>`: its x and y range.
        tags: ["graph"],
        flags: [container],
        props {
            // Pan and zoom request all four.
            xmin: attr(-10.0) { interactive, rendered },
            xmax: attr(10.0) { interactive, rendered },
            ymin: attr(-10.0) { interactive, rendered },
            ymax: attr(10.0) { interactive, rendered },
        }
        planner: Props,
    }

    /// The position of `xmin`: the left edge of the visible x-range.
    pub const XMIN: usize = Props::AT.xmin;
    /// The position of `xmax`: the right edge of the visible x-range.
    pub const XMAX: usize = Props::AT.xmax;
    /// The position of `ymin`: the bottom of the visible y-range.
    pub const YMIN: usize = Props::AT.ymin;
    /// The position of `ymax`: the top of the visible y-range.
    pub const YMAX: usize = Props::AT.ymax;
}

pub(crate) mod p {
    use super::*;

    component! {
        /// `<p>`: a rendered container with no props of its own.
        tags: ["p"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod short_description {
    use super::*;

    component! {
        /// `<shortDescription>`: the accessible description of its parent (a
        /// graph, an input); text, not rendered in place.
        tags: ["shortDescription"],
        flags: [container],
        renders: Never,
        planner: Props,
    }
}

pub(crate) mod error {
    use super::*;

    component! {
        /// `_error`: what an element that could not be built stands as in the
        /// document: no props; its DAST node names its diagnostic. Made by
        /// the build, never by a tag.
        tags: ["_error"],
        flags: [internal, owned],
        roles: [Refused],
    }
}

pub(crate) mod hint {
    use super::*;

    component! {
        /// `<hint>`: a container the reader opens; `open` is its own state (0
        /// or 1).
        tags: ["hint"],
        flags: [container],
        props {
            open: attr(0.0) { interactive, rendered },
        }
        planner: Props,
    }
}

pub(crate) mod setup {
    use super::*;

    component! {
        /// `<setup>`: an unrendered container.
        tags: ["setup"],
        flags: [container],
        renders: Never,
        planner: Props,
    }
}

pub(crate) mod group {
    use super::*;

    component! {
        /// `<group>`: a rendered container with no props of its own. The
        /// prototype renders `<label>` the same way.
        tags: ["group", "label"],
        flags: [container],
        structure: Transparent,
        presentation { asList }
        planner: Props,
    }
}

/// `<stickyGroup>`: members that snap to one another when dragged.
pub mod sticky_group {
    use super::*;

    component! {
        /// `<stickyGroup>`: a container whose members snap to one another when
        /// dragged. `threshold` NaN means the default.
        tags: ["stickyGroup"],
        flags: [container],
        props {
            threshold: attr(NO_VALUE),
            relativeToGraphScales: attr(0.0),
        }
        planner: Props,
    }

    /// The position of `threshold`: how near a dragged member must come to snap; NaN for
    /// the default.
    pub const THRESHOLD: usize = Props::AT.threshold;
    /// The position of `relativeToGraphScales`: 1 when `threshold` is measured in the
    /// enclosing graph's scales.
    pub const RELATIVE: usize = Props::AT.relativeToGraphScales;
}

// Text and layout containers: rendered, with no props of their own. What
// they look like (a list's bullets, a side-by-side's widths, a
// spreadsheet's height) is presentation, read by the renderer from the
// element's attributes (`Document::attr_text`), not state.

pub(crate) mod title {
    use super::*;

    component! {
        /// `<title>`: the heading of the document or of the section it sits in.
        tags: ["title"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod reference {
    use super::*;

    component! {
        /// `<ref to="...">`: a link around its content. The renderer reads
        /// `to`.
        tags: ["ref"],
        flags: [container],
        presentation { to }
        planner: Props,
    }
}

pub(crate) mod list {
    use super::*;

    component! {
        /// `<ul>`.
        tags: ["ul"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod list_item {
    use super::*;

    component! {
        /// `<li>`.
        tags: ["li"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod inline_math {
    use super::*;

    component! {
        /// `<m>`: inline math notation. Its text is LaTeX; a `$ref` inside
        /// shows the referent's value.
        tags: ["m"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod display_math {
    use super::*;

    component! {
        /// `<md>` and `<me>`: displayed math notation, one line per `<mrow>`.
        tags: ["md", "me"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod math_row {
    use super::*;

    component! {
        /// `<mrow>`: one line of an `<md>`, LaTeX like an `<m>`.
        tags: ["mrow"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod aside {
    use super::*;

    component! {
        /// `<aside>`: a collapsible block whose `<title>` is the summary.
        tags: ["aside"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod side_by_side {
    use super::*;

    component! {
        /// `<sideBySide>`: its children in columns, `widths` wide.
        tags: ["sideBySide"],
        flags: [container],
        presentation { widths }
        planner: Props,
    }
}

pub(crate) mod stack {
    use super::*;

    component! {
        /// `<stack>`: its children one above the other.
        tags: ["stack"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod tabular {
    use super::*;

    component! {
        /// `<tabular>`: a table of `<row>`s.
        tags: ["tabular"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod spreadsheet {
    use super::*;

    component! {
        /// `<spreadsheet>`: a grid of `<row>`s. The prototype shows the cells'
        /// values and does not edit them.
        tags: ["spreadsheet"],
        flags: [container],
        presentation { height }
        planner: Props,
    }
}

pub(crate) mod row {
    use super::*;

    component! {
        /// `<row>` of a tabular or spreadsheet.
        tags: ["row"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod cell {
    use super::*;

    component! {
        /// `<cell>` of a row.
        tags: ["cell"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod legend {
    use super::*;

    component! {
        /// `<legend>` of a graph: one `<label>` per curve, in the order the
        /// graph's curves appear.
        tags: ["legend"],
        flags: [container],
        renders: InGraph,
        planner: Props,
    }
}

pub(crate) mod trigger_set {
    use super::*;

    component! {
        /// `<triggerSet>`: a button that, when pressed, performs every
        /// `<updateValue>` inside it at once. Its `<label>` is the button's
        /// text.
        tags: ["triggerSet"],
        flags: [container],
        planner: Props,
    }
}

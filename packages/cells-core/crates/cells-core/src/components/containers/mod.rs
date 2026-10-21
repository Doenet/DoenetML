//! Document, graph, p, setup, group, sticky group and section: types that
//! hold other components. Document and section also hold credit.

use super::define::*;
use crate::compile::api::PlanCtx;
use crate::error::Result;

pub mod section;

pub use section::SECTION_TAGS;

pub mod document {
    use super::*;

    component! {
        /// The root. `creditAchieved` and `percentCreditAchieved` are planned
        /// deferred and wired after expansion (`Deferred`,
        /// `build/expand/scoring.rs`).
        tags: ["document"],
        props {
            creditAchieved: by_planner,
            percentCreditAchieved: by_planner,
        }
        planner: Props,
    }

    pub const CREDIT: usize = Props::AT.creditAchieved;
    pub const PERCENT_CREDIT: usize = Props::AT.percentCreditAchieved;
}

pub mod graph {
    use super::*;

    component! {
        /// `<graph>`: its x and y range.
        tags: ["graph"],
        flags: [container],
        props {
            xmin: attr(-10.0),
            xmax: attr(10.0),
            ymin: attr(-10.0),
            ymax: attr(10.0),
        }
        planner: Props,
    }

    pub const XMIN: usize = Props::AT.xmin;
    pub const XMAX: usize = Props::AT.xmax;
    pub const YMIN: usize = Props::AT.ymin;
    pub const YMAX: usize = Props::AT.ymax;
}

pub mod p {
    use super::*;

    component! {
        /// `<p>`: a rendered container with no props of its own.
        tags: ["p"],
        flags: [container],
        planner: Props,
    }
}

pub mod short_description {
    use super::*;

    component! {
        /// `<shortDescription>`: the accessible description of its parent (a
        /// graph, an input); text, not rendered in place.
        tags: ["shortDescription"],
        flags: [container],
        planner: Props,
    }
}

pub mod error {
    use super::*;

    component! {
        /// `_error`: what an element that could not be built stands as in the
        /// document (ADR 0013): no props; its DAST node names its diagnostic in
        /// the document's list. Made by the build, never by a tag.
        tags: ["_error"],
        flags: [internal],
        planner: Whole(plan),
    }

    /// An error element is made planned by the build (`add_elem`).
    pub(crate) fn plan(_: &mut PlanCtx<'_, '_>) -> Result<()> {
        Ok(())
    }
}

pub mod hint {
    use super::*;

    component! {
        /// `<hint>`: a container the reader opens; `open` is its own state (0
        /// or 1).
        tags: ["hint"],
        flags: [container],
        props {
            open: attr(0.0),
        }
        planner: Props,
    }
}

pub mod setup {
    use super::*;

    component! {
        /// `<setup>`: an unrendered container.
        tags: ["setup"],
        flags: [container],
        planner: Props,
    }
}

pub mod group {
    use super::*;

    component! {
        /// `<group>`: a rendered container with no props of its own. The
        /// prototype renders `<label>` the same way.
        tags: ["group", "label"],
        flags: [container],
        planner: Props,
    }
}

pub mod sticky_group {
    use super::*;

    component! {
        /// `<stickyGroup>`: a container whose members snap to one another when
        /// dragged (ADR 0007). `threshold` NaN means the default.
        tags: ["stickyGroup"],
        flags: [container],
        props {
            threshold: attr(f64::NAN),
            relativeToGraphScales: attr(0.0),
        }
        planner: Props,
    }

    pub const THRESHOLD: usize = Props::AT.threshold;
    pub const RELATIVE: usize = Props::AT.relativeToGraphScales;
}

// Text and layout containers: rendered, with no props of their own. What
// they look like (a list's bullets, a side-by-side's widths, a
// spreadsheet's height) is presentation, read by the renderer from the
// element's attributes (`Document::attr_text`), not state.

pub mod title {
    use super::*;

    component! {
        /// `<title>`: the heading of the document or of the section it sits in.
        tags: ["title"],
        flags: [container],
        planner: Props,
    }
}

pub mod reference {
    use super::*;

    component! {
        /// `<ref to="...">`: a link around its content.
        tags: ["ref"],
        flags: [container],
        planner: Props,
    }
}

pub mod list {
    use super::*;

    component! {
        /// `<ul>`.
        tags: ["ul"],
        flags: [container],
        planner: Props,
    }
}

pub mod list_item {
    use super::*;

    component! {
        /// `<li>`.
        tags: ["li"],
        flags: [container],
        planner: Props,
    }
}

pub mod inline_math {
    use super::*;

    component! {
        /// `<m>`: inline math notation. Its text is LaTeX; a `$ref` inside
        /// shows the referent's value.
        tags: ["m"],
        flags: [container],
        planner: Props,
    }
}

pub mod display_math {
    use super::*;

    component! {
        /// `<md>` and `<me>`: displayed math notation, one line per `<mrow>`.
        tags: ["md", "me"],
        flags: [container],
        planner: Props,
    }
}

pub mod math_row {
    use super::*;

    component! {
        /// `<mrow>`: one line of an `<md>`, LaTeX like an `<m>`.
        tags: ["mrow"],
        flags: [container],
        planner: Props,
    }
}

pub mod aside {
    use super::*;

    component! {
        /// `<aside>`: a collapsible block whose `<title>` is the summary.
        tags: ["aside"],
        flags: [container],
        planner: Props,
    }
}

pub mod side_by_side {
    use super::*;

    component! {
        /// `<sideBySide>`: its children in columns.
        tags: ["sideBySide"],
        flags: [container],
        planner: Props,
    }
}

pub mod stack {
    use super::*;

    component! {
        /// `<stack>`: its children one above the other.
        tags: ["stack"],
        flags: [container],
        planner: Props,
    }
}

pub mod tabular {
    use super::*;

    component! {
        /// `<tabular>`: a table of `<row>`s.
        tags: ["tabular"],
        flags: [container],
        planner: Props,
    }
}

pub mod spreadsheet {
    use super::*;

    component! {
        /// `<spreadsheet>`: a grid of `<row>`s. The prototype shows the cells'
        /// values and does not edit them.
        tags: ["spreadsheet"],
        flags: [container],
        planner: Props,
    }
}

pub mod row {
    use super::*;

    component! {
        /// `<row>` of a tabular or spreadsheet.
        tags: ["row"],
        flags: [container],
        planner: Props,
    }
}

pub mod cell {
    use super::*;

    component! {
        /// `<cell>` of a row.
        tags: ["cell"],
        flags: [container],
        planner: Props,
    }
}

pub mod legend {
    use super::*;

    component! {
        /// `<legend>` of a graph: one `<label>` per curve, in the order the
        /// graph's curves appear.
        tags: ["legend"],
        flags: [container],
        planner: Props,
    }
}

pub mod trigger_set {
    use super::*;

    component! {
        /// `<triggerSet>`: a button that, when pressed, performs every
        /// `<updateValue>` inside it at once (`Document::trigger`). Its
        /// `<label>` is the button's text.
        tags: ["triggerSet"],
        flags: [container],
        planner: Props,
    }
}

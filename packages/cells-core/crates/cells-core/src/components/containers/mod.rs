//! Document, graph, p, setup, group, sticky group, section, the text
//! and layout containers, and the text markup: types that hold other components. Document and section also hold credit.

use super::define::*;

/// Containers that are only that, as a list: each entry a type in a module
/// of its own, `name: ["tag", ..];`, a rendered container planned from its
/// table, with what else its block says between braces (`{ structure:
/// Transparent, presentation { widths } }`, the sections of
/// [`component!`](crate::components::define::component) that come after
/// `flags`, in its order). The entry's doc comment is its definition's.
macro_rules! containers {
    ($(
        $(#[$doc:meta])*
        $module:ident: [$($tag:literal),+ $(,)?] $({ $($more:tt)* })?;
    )*) => {$(
        pub(crate) mod $module {
            use $crate::components::define::*;

            component! {
                $(#[$doc])*
                tags: [$($tag),+],
                flags: [container],
                $($($more)*)?
                planner: Props,
            }
        }
    )*};
}

pub(crate) mod layout;
pub(crate) mod markup;
pub mod section;

pub(crate) mod blocks;

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
        encloses: Graph(xmin, xmax, ymin, ymax),
        needs: Description,
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

containers! {
    /// `<p>`: a rendered container with no props of its own.
    p: ["p"];

    /// `<shortDescription>`: the accessible description of its parent (a
    /// graph, an input); text, not rendered in place.
    short_description: ["shortDescription"] {
        renders: Never,
    };
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

containers! {
    /// `<hint>`: a container the reader opens; `open` is its own state (0
    /// or 1).
    hint: ["hint"] {
        props {
            open: attr(0.0) { interactive, rendered },
        }
    };

    /// `<setup>`: an unrendered container.
    setup: ["setup"] {
        renders: Never,
        scored: Skip,
    };

    /// `<group>`: a rendered container with no props of its own. The
    /// prototype renders `<label>` the same way.
    group: ["group", "label"] {
        structure: Transparent,
        // `<group rendered="c">` is a conditional content with one case.
        rewrite { rendered: ConditionalContent }
        presentation { asList }
    };
}

/// `<stickyGroup>`: members that snap to one another when dragged.
pub mod sticky_group {
    use super::*;

    component! {
        /// `<stickyGroup>`: a container whose members snap to one another when
        /// dragged. `threshold` NaN means the default.
        tags: ["stickyGroup"],
        flags: [container],
        encloses: Sticky(threshold, relativeToGraphScales),
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

containers! {
    /// `<title>`: the heading of the document or of the section it sits in.
    title: ["title"];

    /// `<ref to="...">`: a link around its content. The renderer reads
    /// `to`.
    reference: ["ref"] {
        presentation { to }
    };

    /// `<ul>`.
    list: ["ul"];

    /// `<li>`.
    list_item: ["li"];

    /// `<m>`: inline math notation. Its text is LaTeX; a `$ref` inside
    /// shows the referent's value.
    inline_math: ["m"] {
        props {
            ..anchor
        }
    };

    /// `<md>` and `<me>`: displayed math notation, one line per `<mrow>`.
    display_math: ["md", "me"] {
        props {
            ..anchor
        }
    };

    /// `<mrow>`: one line of an `<md>`, LaTeX like an `<m>`.
    math_row: ["mrow"];
}

pub(crate) mod aside;

containers! {
    /// `<sideBySide>`: its children in columns, `widths` wide.
    side_by_side: ["sideBySide"] {
        presentation { widths }
    };

    /// `<stack>`: its children one above the other.
    stack: ["stack"];

    /// `<tabular>`: a table of `<row>`s.
    tabular: ["tabular"];

    /// `<spreadsheet>`: a grid of `<row>`s. The prototype shows the cells'
    /// values and does not edit them.
    spreadsheet: ["spreadsheet"] {
        presentation { height }
    };

    /// `<row>` of a tabular or spreadsheet.
    row: ["row"];

    /// `<cell>` of a row.
    cell: ["cell"];

    /// `<legend>` of a graph: one `<label>` per curve, in the order the
    /// graph's curves appear.
    legend: ["legend"] {
        renders: InGraph,
    };
}

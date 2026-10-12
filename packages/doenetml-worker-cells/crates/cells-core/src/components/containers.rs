//! Document, graph, p, setup, group, sticky group and section: types that
//! hold other components. Document and section also hold credit.

use super::define::*;
use super::{ComponentTypeInfo, PropDef};

/// The root. `creditAchieved` is wired after expansion
/// (`build/expand/scoring.rs`).
pub(super) const DOCUMENT: ComponentTypeInfo = info(&["document"], DOCUMENT_PROPS);

const DOCUMENT_PROPS: &[PropDef] = &props([
    planned("creditAchieved"),
    computed(
        "percentCreditAchieved",
        OpSpec::Scale { k: 100.0 },
        &["creditAchieved"],
    ),
]);

pub mod document {
    use super::*;
    pub const CREDIT: usize = at(DOCUMENT_PROPS, "creditAchieved");
    pub const PERCENT_CREDIT: usize = at(DOCUMENT_PROPS, "percentCreditAchieved");
}

/// `<graph>`: its x and y range.
pub(super) const GRAPH: ComponentTypeInfo = info(&["graph"], GRAPH_PROPS).container();

const GRAPH_PROPS: &[PropDef] = &props([
    attr("xmin", -10.0),
    attr("xmax", 10.0),
    attr("ymin", -10.0),
    attr("ymax", 10.0),
]);

pub mod graph {
    use super::*;
    pub const XMIN: usize = at(GRAPH_PROPS, "xmin");
    pub const XMAX: usize = at(GRAPH_PROPS, "xmax");
    pub const YMIN: usize = at(GRAPH_PROPS, "ymin");
    pub const YMAX: usize = at(GRAPH_PROPS, "ymax");
}

/// `<p>`: a rendered container with no props of its own.
pub(super) const P: ComponentTypeInfo = info(&["p"], &[]).container();

/// `<setup>`: an unrendered container.
pub(super) const SETUP: ComponentTypeInfo = info(&["setup"], &[]).container();

/// `<group>`: a rendered container with no props of its own. The
/// prototype renders `<label>` the same way.
pub(super) const GROUP: ComponentTypeInfo = info(&["group", "label"], &[]).container();

/// `<stickyGroup>`: a container whose members snap to one another when
/// dragged (ADR 0007). `threshold` NaN means the default.
pub(super) const STICKY_GROUP: ComponentTypeInfo =
    info(&["stickyGroup"], STICKY_GROUP_PROPS).container();

const STICKY_GROUP_PROPS: &[PropDef] = &props([
    attr("threshold", f64::NAN),
    attr("relativeToGraphScales", 0.0),
]);

pub mod sticky_group {
    use super::*;
    pub const THRESHOLD: usize = at(STICKY_GROUP_PROPS, "threshold");
    pub const RELATIVE: usize = at(STICKY_GROUP_PROPS, "relativeToGraphScales");
}

/// `<section>`, `<subsection>`, `<subsubsection>`, `<problem>`,
/// `<exercise>`, `<example>`: a rendered container that is numbered
/// among its sibling sections and, when it aggregates scores, holds the
/// weighted credit of the answers and sections inside it. Both are
/// wired after expansion (`build/expand/scoring.rs`). The parser writes
/// `<section>` as `<division type="section">`.
pub(super) const SECTION: ComponentTypeInfo = info(
    &[
        "section",
        "division",
        "subsection",
        "subsubsection",
        "problem",
        "exercise",
        "example",
    ],
    SECTION_PROPS,
)
.container();

/// The tags that make a `Section`, in the order of its `label` cell, with
/// the word a title shows and whether the tag aggregates scores and
/// includes its parent section's number by default (the current core's
/// `Sectioning.js`).
pub const SECTION_TAGS: [(&str, &str, bool, bool); 6] = [
    ("section", "Section", false, true),
    ("subsection", "Section", false, true),
    ("subsubsection", "Section", false, true),
    ("problem", "Problem", true, false),
    ("exercise", "Exercise", true, false),
    ("example", "Example", false, false),
];

// `creditAchieved` and `number` are wired after expansion; the
// flags are literals the builder reads, since they decide the wiring.
const SECTION_PROPS: &[PropDef] = &props([
    planned("creditAchieved"),
    computed(
        "percentCreditAchieved",
        OpSpec::Scale { k: 100.0 },
        &["creditAchieved"],
    ),
    attr("weight", 1.0),
    planned("aggregateScores"),
    planned("number"),
    planned("includeParentNumber"),
    planned("label"),
]);

pub mod section {
    use super::*;
    pub const CREDIT: usize = at(SECTION_PROPS, "creditAchieved");
    pub const PERCENT_CREDIT: usize = at(SECTION_PROPS, "percentCreditAchieved");
    pub const WEIGHT: usize = at(SECTION_PROPS, "weight");
    pub const AGGREGATE: usize = at(SECTION_PROPS, "aggregateScores");
    pub const NUMBER: usize = at(SECTION_PROPS, "number");
    pub const INCLUDE_PARENT_NUMBER: usize = at(SECTION_PROPS, "includeParentNumber");
    pub const LABEL: usize = at(SECTION_PROPS, "label");
}

// Text and layout containers: rendered, with no props of their own. What
// they look like (a list's bullets, a side-by-side's widths, a
// spreadsheet's height) is presentation, read by the renderer from the
// element's attributes (`Document::attr_text`), not state.

/// `<title>`: the heading of the document or of the section it sits in.
pub(super) const TITLE: ComponentTypeInfo = info(&["title"], &[]).container();

/// `<ref to="...">`: a link around its content.
pub(super) const REF: ComponentTypeInfo = info(&["ref"], &[]).container();

/// `<ul>`.
pub(super) const LIST: ComponentTypeInfo = info(&["ul"], &[]).container();

/// `<li>`.
pub(super) const LIST_ITEM: ComponentTypeInfo = info(&["li"], &[]).container();

/// `<m>`: inline math notation. Its text is LaTeX; a `$ref` inside shows
/// the referent's value.
pub(super) const INLINE_MATH: ComponentTypeInfo = info(&["m"], &[]).container();

/// `<md>` and `<me>`: displayed math notation, one line per `<mrow>`.
pub(super) const DISPLAY_MATH: ComponentTypeInfo = info(&["md", "me"], &[]).container();

/// `<mrow>`: one line of an `<md>`, LaTeX like an `<m>`.
pub(super) const MATH_ROW: ComponentTypeInfo = info(&["mrow"], &[]).container();

/// `<aside>`: a collapsible block whose `<title>` is the summary.
pub(super) const ASIDE: ComponentTypeInfo = info(&["aside"], &[]).container();

/// `<sideBySide>`: its children in columns.
pub(super) const SIDE_BY_SIDE: ComponentTypeInfo = info(&["sideBySide"], &[]).container();

/// `<stack>`: its children one above the other.
pub(super) const STACK: ComponentTypeInfo = info(&["stack"], &[]).container();

/// `<tabular>`: a table of `<row>`s.
pub(super) const TABULAR: ComponentTypeInfo = info(&["tabular"], &[]).container();

/// `<spreadsheet>`: a grid of `<row>`s. The prototype shows the cells'
/// values and does not edit them.
pub(super) const SPREADSHEET: ComponentTypeInfo = info(&["spreadsheet"], &[]).container();

/// `<row>` of a tabular or spreadsheet.
pub(super) const ROW: ComponentTypeInfo = info(&["row"], &[]).container();

/// `<cell>` of a row.
pub(super) const CELL: ComponentTypeInfo = info(&["cell"], &[]).container();

/// `<legend>` of a graph: one `<label>` per curve, in the order the
/// graph's curves appear.
pub(super) const LEGEND: ComponentTypeInfo = info(&["legend"], &[]).container();

/// `<triggerSet>`: a button that, when pressed, performs every
/// `<updateValue>` inside it at once (`Document::trigger`). Its `<label>`
/// is the button's text.
pub(super) const TRIGGER_SET: ComponentTypeInfo = info(&["triggerSet"], &[]).container();

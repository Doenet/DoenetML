//! Document, graph, p, setup, group, sticky group and section: types that
//! hold other components. Document and section also hold credit.

use super::define::*;
use super::{ComponentTypeInfo, PropDef};
use crate::compile::api::PlanCtx;
use crate::error::Result;

pub mod section;

pub use section::SECTION_TAGS;

/// The root. `creditAchieved` and `percentCreditAchieved` are planned
/// deferred and wired after expansion (`Deferred`,
/// `build/expand/scoring.rs`).
pub(super) const DOCUMENT: ComponentTypeInfo = info(&["document"], DOCUMENT_PROPS);

const DOCUMENT_PROPS: &[PropDef] =
    &props([planned("creditAchieved"), planned("percentCreditAchieved")]);

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

/// `<shortDescription>`: the accessible description of its parent (a
/// graph, an input); text, not rendered in place.
pub(super) const SHORT_DESCRIPTION: ComponentTypeInfo =
    info(&["shortDescription"], &[]).container();

/// `_error`: what an element that could not be built stands as in the
/// document (ADR 0013): no props; its DAST node names its diagnostic in
/// the document's list. Made by the build, never by a tag.
pub(super) const ERROR: ComponentTypeInfo = info(&["_error"], &[]).internal();

/// An error element is made planned by the build (`add_elem`).
pub(crate) fn plan_error(_: &mut PlanCtx<'_, '_>) -> Result<()> {
    Ok(())
}

/// `<hint>`: a container the reader opens; `open` is its own state (0 or 1).
pub(super) const HINT: ComponentTypeInfo = info(&["hint"], HINT_PROPS).container();

const HINT_PROPS: &[PropDef] = &props([attr("open", 0.0)]);

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

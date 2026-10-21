//! `<section>` and the tags that make one: its definition and its planner
//! (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentTypeInfo, PropDef};
use crate::error::{Error, Result};

/// `<section>`, `<subsection>`, `<subsubsection>`, `<problem>`,
/// `<exercise>`, `<example>`: a rendered container that is numbered
/// among its sibling sections and, when it aggregates scores, holds the
/// weighted credit of the answers and sections inside it. Both are
/// wired after expansion (`build/expand/scoring.rs`). The parser writes
/// `<section>` as `<division type="section">`.
pub(in crate::components) const SECTION: ComponentTypeInfo = info(
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

// `creditAchieved`, `percentCreditAchieved` and `number` are planned
// deferred and wired after expansion (`Deferred`); the flags are literals
// the builder reads, since they decide the wiring.
const SECTION_PROPS: &[PropDef] = &props([
    planned("creditAchieved"),
    planned("percentCreditAchieved"),
    attr("weight", 1.0),
    planned("aggregateScores"),
    planned("number"),
    planned("includeParentNumber"),
    planned("label"),
]);

pub const CREDIT: usize = at(SECTION_PROPS, "creditAchieved");
pub const PERCENT_CREDIT: usize = at(SECTION_PROPS, "percentCreditAchieved");
pub const WEIGHT: usize = at(SECTION_PROPS, "weight");
pub const AGGREGATE: usize = at(SECTION_PROPS, "aggregateScores");
pub const NUMBER: usize = at(SECTION_PROPS, "number");
pub const INCLUDE_PARENT_NUMBER: usize = at(SECTION_PROPS, "includeParentNumber");
pub const LABEL: usize = at(SECTION_PROPS, "label");

/// A section's `aggregateScores`, `includeParentNumber` and `label`:
/// literals, defaulted by tag as in the current core, since they decide
/// how credit and numbers are wired.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>, props: &mut [Option<SourcePlan>]) -> Result<()> {
    let d = ctx.dast();
    let el = ctx.node();
    let tag = match d.str(el) {
        "division" => d
            .attr(el, "type")
            .and_then(|a| ctx.attr_text(a))
            .map(|t| t.trim().to_string())
            .unwrap_or_default(),
        tag => tag.to_string(),
    };
    let (label, &(_, _, aggregate, parent_number)) = SECTION_TAGS
        .iter()
        .enumerate()
        .find(|(_, s)| s.0 == tag)
        .ok_or_else(|| Error::UnsupportedTag(format!("division type=\"{tag}\"")))?;
    let flag = |name: &str, default: bool| -> Result<f64> {
        match d.attr(el, name) {
            None => Ok(if default { 1.0 } else { 0.0 }),
            Some(a) if ctx.attr_text(a).is_some() => {
                Ok(if ctx.attr_flag(el, name) { 1.0 } else { 0.0 })
            }
            Some(_) => Err(Error::Unsupported(format!(
                "'{name}' on a <{tag}> must be a literal: it decides how the section is wired"
            ))),
        }
    };
    props[AGGREGATE] = Some(SourcePlan::Fixed(flag("aggregateScores", aggregate)?));
    props[INCLUDE_PARENT_NUMBER] = Some(SourcePlan::Fixed(flag(
        "includeParentNumber",
        parent_number,
    )?));
    props[LABEL] = Some(SourcePlan::Fixed(label as f64));
    Ok(())
}

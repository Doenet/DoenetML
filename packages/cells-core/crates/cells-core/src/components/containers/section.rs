//! `<section>` and the tags that make one: its definition and its planner
//! (ADR 0016).

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<section>`, `<subsection>`, `<subsubsection>`, `<problem>`,
    /// `<exercise>`, `<example>`: a rendered container that is numbered among
    /// its sibling sections and, when it aggregates scores, holds the weighted
    /// credit of the answers and sections inside it. Both are wired after
    /// expansion (`build/expand/scoring.rs`). The parser writes `<section>` as
    /// `<division type="section">`.
    tags: [
        "section",
        "division",
        "subsection",
        "subsubsection",
        "problem",
        "exercise",
        "example",
    ],
    flags: [container],
    props {
        // `creditAchieved`, `percentCreditAchieved` and `number` are planned
        // deferred and wired after expansion (`Deferred`); the flags are literals
        // the builder reads, since they decide the wiring.
        creditAchieved: by_planner { score },
        percentCreditAchieved: by_planner,
        weight: attr(1.0),
        aggregateScores: by_planner,
        number: by_planner { rendered },
        includeParentNumber: by_planner { rendered },
        label: by_planner { rendered },
    }
    planner: PropsThen(plan),
}

/// A tag that makes a `Section`, and its defaults (the current core's
/// `Sectioning.js`).
pub struct SectionTag {
    pub tag: &'static str,
    /// The word its automatic title shows: "Problem 3".
    pub title: &'static str,
    /// Whether it holds the weighted credit of what is inside it, unless
    /// `aggregateScores` says otherwise.
    pub aggregates_scores: bool,
    /// Whether its number includes its parent section's ("2.1"), unless
    /// `includeParentNumber` says otherwise.
    pub includes_parent_number: bool,
}

/// The tags that make a `Section`, in the order of its `label` cell.
pub const SECTION_TAGS: [SectionTag; 6] = [
    SectionTag {
        tag: "section",
        title: "Section",
        aggregates_scores: false,
        includes_parent_number: true,
    },
    SectionTag {
        tag: "subsection",
        title: "Section",
        aggregates_scores: false,
        includes_parent_number: true,
    },
    SectionTag {
        tag: "subsubsection",
        title: "Section",
        aggregates_scores: false,
        includes_parent_number: true,
    },
    SectionTag {
        tag: "problem",
        title: "Problem",
        aggregates_scores: true,
        includes_parent_number: false,
    },
    SectionTag {
        tag: "exercise",
        title: "Exercise",
        aggregates_scores: true,
        includes_parent_number: false,
    },
    SectionTag {
        tag: "example",
        title: "Example",
        aggregates_scores: false,
        includes_parent_number: false,
    },
];

pub const CREDIT: usize = Props::AT.creditAchieved;
pub const PERCENT_CREDIT: usize = Props::AT.percentCreditAchieved;
pub const WEIGHT: usize = Props::AT.weight;
pub const AGGREGATE: usize = Props::AT.aggregateScores;
pub const NUMBER: usize = Props::AT.number;
pub const INCLUDE_PARENT_NUMBER: usize = Props::AT.includeParentNumber;
pub const LABEL: usize = Props::AT.label;

/// A section's `aggregateScores`, `includeParentNumber` and `label`:
/// literals, defaulted by tag as in the current core, since they decide
/// how credit and numbers are wired.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>, props: &mut [Option<Source>]) -> Result<()> {
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
    let (label, section_tag) = SECTION_TAGS
        .iter()
        .enumerate()
        .find(|(_, s)| s.tag == tag)
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
    let at = Props::AT;
    props[at.aggregateScores] = Some(Source::Const(flag(
        "aggregateScores",
        section_tag.aggregates_scores,
    )?));
    props[at.includeParentNumber] = Some(Source::Const(flag(
        "includeParentNumber",
        section_tag.includes_parent_number,
    )?));
    props[at.label] = Some(Source::Const(label as f64));
    Ok(())
}

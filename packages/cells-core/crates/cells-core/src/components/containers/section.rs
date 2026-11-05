//! `<section>` and the tags that make one: its definition and its planner
//! (ADR 0016).

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<section>`, `<subsection>`, `<subsubsection>`, `<problem>`,
    /// `<exercise>`, `<example>`: a rendered container that is numbered among
    /// its sibling sections and, when it aggregates scores, holds the weighted
    /// credit of the answers and sections inside it. Both are aggregates
    /// (ADR 0032), materialized by the build (`build/expand/aggregate.rs`).
    /// The parser writes `<section>` as `<division type="section">`.
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
        // `creditAchieved`, `percentCreditAchieved` and `number` are
        // aggregates over the tree; the flags are literals the builder
        // reads, since they decide the wiring.
        creditAchieved: aggregate(Credit, ScoredItems) { score },
        percentCreditAchieved: aggregate(PercentCredit, ScoredItems),
        weight: attr(1.0),
        aggregateScores: by_planner,
        number: aggregate(Count, SectionsThrough) { rendered },
        includeParentNumber: by_planner { rendered },
        label: by_planner { rendered },
    }
    attributes {
        weight: Value,
        r#type: Text,
        aggregateScores: LiteralFlag,
        includeParentNumber: LiteralFlag,
    }
    planner: Plan(plan),
}

/// A tag that makes a `Section`, and its defaults.
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
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let tag = match ctx.record().tag() {
        "division" => attrs
            .r#type
            .as_deref()
            .unwrap_or_default()
            .trim()
            .to_string(),
        tag => tag.to_string(),
    };
    let (label, section_tag) = SECTION_TAGS
        .iter()
        .enumerate()
        .find(|(_, s)| s.tag == tag)
        .ok_or_else(|| Error::UnsupportedTag(format!("division type=\"{tag}\"")))?;
    let flag = |name: &str, value: Option<Option<bool>>, default: bool| -> Result<f64> {
        match value {
            None => Ok(f64::from(default)),
            Some(Some(on)) => Ok(f64::from(on)),
            Some(None) => Err(Error::Unsupported(format!(
                "'{name}' on a <{tag}> must be a literal: it decides how the section is wired"
            ))),
        }
    };
    let aggregate = flag(
        "aggregateScores",
        attrs.aggregateScores,
        section_tag.aggregates_scores,
    )?;
    let include = flag(
        "includeParentNumber",
        attrs.includeParentNumber,
        section_tag.includes_parent_number,
    )?;
    let mut wiring = ElemWiring::of(ComponentType::Section);
    let table = |port: Port| Wire::from_table(ComponentType::Section, port);
    let at = Props::PORTS;
    wiring.set_public(Props {
        creditAchieved: table(at.creditAchieved),
        percentCreditAchieved: table(at.percentCreditAchieved),
        weight: attrs.weight.unwrap_or(Source::given(1.0)).into(),
        aggregateScores: Wire::constant(aggregate),
        number: table(at.number),
        includeParentNumber: Wire::constant(include),
        label: Wire::constant(label as f64),
    });
    Ok(wiring)
}

//! `<section>` and the tags that make one: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<section>`, `<subsection>`, `<subsubsection>`, `<problem>`,
    /// `<exercise>`, `<example>` and the other divisions [`SECTION_TAGS`]
    /// lists (`<theorem>`, `<part>`, `<problems>`, ...): a rendered container
    /// that is numbered among its sibling sections, whatever their tag, and,
    /// when it aggregates scores, holds the weighted credit of the answers
    /// and sections inside it, both aggregates. The parser writes
    /// `<section>` as `<division type="section">` (and `<part>` and
    /// `<paragraphs>` the same way).
    tags: [
        "section",
        "division",
        "subsection",
        "subsubsection",
        "problem",
        "exercise",
        "example",
        "question",
        "activity",
        "definition",
        "note",
        "theorem",
        "paragraphs",
        "objectives",
        "part",
        "task",
        "problems",
        "exercises",
    ],
    flags: [container],
    scored: Aggregates(weight, aggregateScores),
    numbered: Titled(includeParentNumber, label, title_word, listItem, asList),
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
        // Whether it is an item of its parent's list, always (a part), and
        // whether its sectioning children are the items of its list (ADR
        // 0054): literals, since they decide how it is numbered.
        listItem: by_planner { rendered },
        asList: by_planner { rendered },
    }
    // How its heading reads: the renderer's, from its number and title.
    presentation {
        boxed,
        includeAutoName,
        includeAutoNumber,
        includeAutoNameIfNoTitle,
        includeAutoNumberIfNoTitle,
        noAutoTitle,
    }
    attributes {
        weight: Value,
        r#type: Text,
        aggregateScores: LiteralFlag,
        includeParentNumber: LiteralFlag,
        asList: LiteralFlag,
        renameTo: Text,
    }
    planner: Plan(plan),
}

/// The word a section's title shows for its `label` ("Problem").
fn title_word(label: usize) -> &'static str {
    SECTION_TAGS[label].title
}

/// A tag that makes a `Section`, and its defaults.
pub struct SectionTag {
    /// The tag, or a `<division>`'s `type`: `problem`.
    pub tag: &'static str,
    /// The word its automatic title shows: "Problem 3".
    pub title: &'static str,
    /// Whether it holds the weighted credit of what is inside it, unless
    /// `aggregateScores` says otherwise.
    pub aggregates_scores: bool,
    /// Whether its number includes its parent section's ("2.1"), unless
    /// `includeParentNumber` says otherwise.
    pub includes_parent_number: bool,
    /// Whether it is always an item of its parent's list, numbered among
    /// the list items (ADR 0054).
    pub list_item: bool,
    /// Whether its sectioning children are the items of its list, unless
    /// `asList` says otherwise; such a tag also takes `renameTo`.
    pub as_list: bool,
}

/// The tags that make a `Section`, in the order of its `label` cell, which
/// renderers read by position, so a new tag goes at the end. The defaults
/// are the current core's (`Sectioning.js`): a section at any depth shows
/// its parent's number, and the scored divisions aggregate scores.
pub const SECTION_TAGS: [SectionTag; 17] = [
    SectionTag {
        tag: "section",
        title: "Section",
        aggregates_scores: false,
        includes_parent_number: true,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "subsection",
        title: "Section",
        aggregates_scores: false,
        includes_parent_number: true,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "subsubsection",
        title: "Section",
        aggregates_scores: false,
        includes_parent_number: true,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "problem",
        title: "Problem",
        aggregates_scores: true,
        includes_parent_number: false,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "exercise",
        title: "Exercise",
        aggregates_scores: true,
        includes_parent_number: false,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "example",
        title: "Example",
        aggregates_scores: false,
        includes_parent_number: false,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "question",
        title: "Question",
        aggregates_scores: true,
        includes_parent_number: false,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "activity",
        title: "Activity",
        aggregates_scores: true,
        includes_parent_number: false,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "definition",
        title: "Definition",
        aggregates_scores: false,
        includes_parent_number: false,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "note",
        title: "Note",
        aggregates_scores: false,
        includes_parent_number: false,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "theorem",
        title: "Theorem",
        aggregates_scores: false,
        includes_parent_number: false,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "paragraphs",
        title: "Paragraphs",
        aggregates_scores: false,
        includes_parent_number: false,
        list_item: false,
        as_list: false,
    },
    SectionTag {
        tag: "objectives",
        title: "Objectives",
        aggregates_scores: false,
        includes_parent_number: false,
        list_item: false,
        as_list: false,
    },
    // A part or a task is numbered among its parent's list items, apart
    // from the divisions, as the current core numbers it (ADR 0054).
    SectionTag {
        tag: "part",
        title: "Part",
        aggregates_scores: false,
        includes_parent_number: false,
        list_item: true,
        as_list: false,
    },
    SectionTag {
        tag: "task",
        title: "Task",
        aggregates_scores: false,
        includes_parent_number: false,
        list_item: true,
        as_list: false,
    },
    SectionTag {
        tag: "problems",
        title: "Problems",
        aggregates_scores: false,
        includes_parent_number: false,
        list_item: false,
        as_list: true,
    },
    SectionTag {
        tag: "exercises",
        title: "Exercises",
        aggregates_scores: false,
        includes_parent_number: false,
        list_item: false,
        as_list: true,
    },
];

/// The position of `creditAchieved`: the weighted credit of the answers and sections
/// inside it, when it aggregates scores.
pub const CREDIT: usize = Props::AT.creditAchieved;
/// The position of `percentCreditAchieved`: that credit as a percentage.
pub const PERCENT_CREDIT: usize = Props::AT.percentCreditAchieved;
/// The position of `weight`: how much its credit counts in an enclosing aggregate.
pub const WEIGHT: usize = Props::AT.weight;
/// The position of `aggregateScores`: 1 when it holds the credit of what is inside it.
pub const AGGREGATE: usize = Props::AT.aggregateScores;
/// The position of `number`: its 1-based count among its sibling sections.
pub const NUMBER: usize = Props::AT.number;
/// The position of `includeParentNumber`: 1 when its number shows its parent's ("2.1").
pub const INCLUDE_PARENT_NUMBER: usize = Props::AT.includeParentNumber;
/// The position of `label`: its tag's index in [`SECTION_TAGS`], which names its title.
pub const LABEL: usize = Props::AT.label;
/// The position of `listItem`: 1 when it is always an item of its parent's list.
pub const LIST_ITEM: usize = Props::AT.listItem;
/// The position of `asList`: 1 when its sectioning children are its list's items.
pub const AS_LIST: usize = Props::AT.asList;

/// A section's `aggregateScores`, `includeParentNumber` and `label`:
/// literals, defaulted by tag.
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
    let as_list = flag("asList", attrs.asList, section_tag.as_list)?;
    // Only a tag that groups divisions names itself by a word the author
    // may replace, as in the current core.
    if attrs.renameTo.is_some() && !section_tag.as_list {
        return Err(Error::Unsupported(format!(
            "'renameTo' on a <{tag}>: only a <problems> or an <exercises> takes it"
        )));
    }
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
        listItem: Wire::constant(f64::from(section_tag.list_item)),
        asList: Wire::constant(as_list),
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "section.spec.rs"]
mod spec;

//! `<section>` and the tags that make one: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::{OpSpec, SymKind, VecOp, texts::Sep};

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
        // Its full number ("2.1") and its title, as text a reference
        // reads (`$sec.title`), made as a join is when a count changes
        // (ADR 0058). The renderer composes the heading itself.
        sectionNumber: by_planner { text },
        title: by_planner { text },
    }
    // How its heading reads: the renderer's, from its number and title.
    presentation {
        boxed,
    }
    attributes {
        weight: Value,
        r#type: Text,
        aggregateScores: LiteralFlag,
        includeParentNumber: LiteralFlag,
        asList: LiteralFlag,
        renameTo: Text,
        // Which words its title shows (ADR 0058); the renderer reads them
        // for its heading too.
        includeAutoName: LiteralFlag,
        includeAutoNumber: LiteralFlag,
        includeAutoNameIfNoTitle: LiteralFlag,
        includeAutoNumberIfNoTitle: LiteralFlag,
        noAutoTitle: LiteralFlag,
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
/// The position of `sectionNumber`: the string id of its full number ("2.1").
pub const SECTION_NUMBER: usize = Props::AT.sectionNumber;
/// The position of `title`: the string id of its title.
pub const TITLE: usize = Props::AT.title;

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
    let section_number = section_number(ctx, &mut wiring, include != 0.0 && !section_tag.list_item);
    let word = match &attrs.renameTo {
        Some(word) => word.trim().to_string(),
        None => section_tag.title.to_string(),
    };
    let title = title(ctx, &mut wiring, &attrs, &word);
    wiring.set_planned(Planned {
        weight: attrs.weight.unwrap_or(Source::given(1.0)).into(),
        aggregateScores: Wire::constant(aggregate),
        includeParentNumber: Wire::constant(include),
        label: Wire::constant(label as f64),
        listItem: Wire::constant(f64::from(section_tag.list_item)),
        asList: Wire::constant(as_list),
        sectionNumber: section_number.into(),
        title: title.into(),
    });
    Ok(wiring)
}

/// A text-valued join of `n` inputs with `sep` between them (ADR 0058).
fn join_with(n: usize, sep: Sep) -> OpSpec {
    OpSpec::Sym(SymKind::JoinWith {
        n: crate::limits::byte(n),
        kinds: 0,
        sep,
    })
}

/// A section's full number as text, as `Document::section_number` composes
/// it: its `number`, after its nearest numbered ancestor's full number when
/// it includes it and is no item of its parent's list (`include`, from its
/// own literals, and its parent's `asList`, ADR 0054). Each part is a cell
/// a tick may change, so the text is made as a join is (ADR 0058).
fn section_number(ctx: &mut PlanCtx<'_, '_>, wiring: &mut ElemWiring, include: bool) -> Source {
    let at = Props::PORTS;
    let own = Source::computed(join_with(1, Sep::Dot), vec![at.number]);
    if !include {
        return own;
    }
    let parent = match ctx.ancestor_prop(|ty| ty.def().numbered.is_some(), "sectionNumber") {
        None => return own,
        Some(Some(parent)) => wiring.hidden(parent),
        // A numbered ancestor that keeps no full number of its own (an
        // `<aside>`): the number is not one this core composes.
        Some(None) => return Source::absent(),
    };
    let with_parent = Source::computed(join_with(2, Sep::Dot), vec![parent, at.number]);
    // Its parent (the nearest ancestor the list items do not pass through)
    // may make it a list item, which shows no parent's number.
    match ctx.ancestor_prop(|ty| !ty.passes_list_items(), "asList") {
        Some(Some(as_list)) => {
            let as_list = wiring.hidden(as_list);
            let pick = wiring.hidden(Source::computed_k(OpSpec::Add, as_list, 1.0));
            let with_parent = wiring.hidden(with_parent);
            let own = wiring.hidden(own);
            Source::vector(VecOp::Choose { n: 2 }, vec![pick, with_parent, own])
        }
        _ => with_parent,
    }
}

/// A section's title as the current core's `title` reads it: its last
/// `<title>` child's text, else its automatic title, `word` and its number
/// as its heading flags ask ("Section 2.1"), in English. A title child
/// that holds more than literal text, or a flag given by a reference,
/// makes no text here (the missing value), which ADR 0058 leaves open.
fn title(ctx: &mut PlanCtx<'_, '_>, wiring: &mut ElemWiring, attrs: &Attrs, word: &str) -> Source {
    let at = Props::PORTS;
    let text =
        |ctx: &mut PlanCtx<'_, '_>, s: &str| Source::Leaf(Leaf::GivenText(Some(ctx.intern(s))));
    match ctx.last_child_text(ComponentType::Title) {
        Some(Some(child)) => return text(ctx, &child),
        Some(None) => return Source::absent(),
        None => {}
    }
    let flags = [
        attrs.includeAutoName,
        attrs.includeAutoNumber,
        attrs.includeAutoNameIfNoTitle,
        attrs.includeAutoNumberIfNoTitle,
        attrs.noAutoTitle,
    ];
    if flags.contains(&Some(None)) {
        return Source::absent();
    }
    let flag = |f: Option<Option<bool>>, default: bool| f.flatten().unwrap_or(default);
    let no_auto = flag(attrs.noAutoTitle, false);
    let with_name = (flag(attrs.includeAutoName, false)
        || (flag(attrs.includeAutoNameIfNoTitle, true) && !no_auto))
        && !word.is_empty();
    let with_number = flag(attrs.includeAutoNumber, false)
        || (flag(attrs.includeAutoNumberIfNoTitle, true) && !no_auto);
    match (with_name, with_number) {
        (false, false) => text(ctx, ""),
        (true, false) => text(ctx, word),
        (false, true) => Source::own(at.sectionNumber),
        (true, true) => {
            let word = wiring.hidden(text(ctx, word));
            Source::computed(join_with(2, Sep::Space), vec![word, at.sectionNumber])
        }
    }
}

#[cfg(all(test, feature = "testing"))]
#[path = "section.spec.rs"]
mod spec;

//! What outlining hands on: what it settled, which every later stage
//! reads and none changes ([`Settled`]), and the work it found for them
//! ([`Outline`]).

use crate::compile::*;

/// What outlining hands to the stages after it: the work it found for
/// them, in the order the walk made it.
#[derive(Default)]
pub(in crate::compile) struct Outline {
    /// Every element to plan.
    pub(in crate::compile) to_plan: Vec<(TemplateId, ElemId)>,
    /// Every `$ref` child to plan.
    pub(in crate::compile) macros: Vec<(TemplateId, RefChildId)>,
    /// Each `<math>`'s text, tokenized where its type was settled.
    pub(in crate::compile) math_texts: Vec<((TemplateId, ElemId), Result<MathText>)>,
    /// Every read outlining recorded: a container copy's of its referent's
    /// type, and each clone's of its original.
    pub(in crate::compile) reads: Vec<Read>,
}

/// What outlining settles that the stages after it read and never change,
/// beside what it settles of each element in the templates.
#[derive(Default)]
pub(in crate::compile) struct Settled {
    /// Outlining's part of every template: its elements' rows, its children
    /// and its `$ref` children, by [`TemplateId`].
    pub(in crate::compile) templates: Vec<Outlined>,
    /// Every choice as outlining made it, by [`ChoiceId`].
    pub(in crate::compile) choices: Vec<ChoiceDef>,
    /// The name table.
    pub(in crate::compile) names: NameTable,
    /// The references in an answer's whens, by macro node.
    pub(in crate::compile) when_refs: HashMap<NodeId, RefId>,
    /// Each `$mi` in an answer's `<when>` that names an input, with the
    /// answer's `response` for that input, which it stands for.
    pub(in crate::compile) submitted: HashMap<NodeId, ElemId>,
    /// By (template, answer), the `response` outlining made for each input
    /// its whens read.
    pub(in crate::compile) answer_responses: HashMap<(TemplateId, ElemId), Vec<(InputKey, ElemId)>>,
}

/// A recorded cross-element read: the reader, and the reference to what it
/// read.
pub(in crate::compile) type Read = (TemplateId, ElemId, RefId);

/// An input an answer's when reads, as `input_named` keys it: how many
/// templates up, and which element.
pub(in crate::compile) type InputKey = (u32, ElemId);

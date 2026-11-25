//! What the readers several stages run read and write: [`Reader`], the
//! source and what outlining settled, read-only; and [`Arenas`], what they
//! append to (ADR 0031, "Code more than one stage runs").

use crate::compile::*;

/// The readers every stage runs: the DAST and what outlining settled (the
/// choices, the name table), read-only. The readers in `refs`, `source`,
/// `values`, `maths`, `points`, `rebase`, `answer` and `names` are its
/// methods; one that also writes takes the [`Arenas`] it writes.
///
/// It hands out no row of outlining's tables: the readers reach a row
/// among themselves, and a stage reaches one through [`Reader`], which
/// every stage but planning holds. Planning holds this, and reaches a row
/// by the relation the read is (`stages/plan/rows.rs`, ADR 0050).
#[derive(Clone, Copy)]
pub(in crate::compile) struct SourceReader<'a> {
    /// The source being compiled.
    pub(in crate::compile) dast: &'a Dast,
    /// What outlining settled, or has settled so far.
    settled: &'a Settled,
}

/// What every stage reads and none changes once outlining is done: the
/// readers ([`SourceReader`], which it derefs to) and outlining's rows.
/// Outlining, which is still making what it settles, makes one from its
/// own state between its writes.
#[derive(Clone, Copy)]
pub(in crate::compile) struct Reader<'a>(SourceReader<'a>);

impl<'a> std::ops::Deref for Reader<'a> {
    type Target = SourceReader<'a>;

    fn deref(&self) -> &SourceReader<'a> {
        &self.0
    }
}

/// What the stages append to, which only grows while the compile runs: the
/// reference and expression arenas, the math text the symbolic engine reads,
/// the strings the build needs beyond the DAST's, and the planners'
/// warnings. Handed `&mut` to the stages and readers that write it.
#[derive(Default)]
pub(in crate::compile) struct Arenas {
    /// The reference arena: every reference's plan, by [`RefId`].
    pub(in crate::compile) refs: Vec<RefPlan>,
    /// The expression arena: cell leaves hold plan ids.
    pub(in crate::compile) arena: Arena<RefId>,
    /// The math text of expressions that may be symbolic.
    pub(in crate::compile) sym_text: HashMap<ExprId, SymText>,
    /// Text the build needs that is not a DAST string, appended after the
    /// DAST's table (`intern_literal`).
    pub(in crate::compile) extra_strings: Vec<String>,
    /// The planners' warnings about the source, which the compile reports
    /// with the boxes' errors.
    pub(in crate::compile) warnings: Vec<Diagnostic>,
    /// Whether a boolean may be read inside the math being planned: in a
    /// condition, where it is one, and in a `<number convertBoolean>`,
    /// where the author asked for 1 or 0 (D47). Elsewhere it is a type mix
    /// (ADR 0064, decision 4).
    pub(in crate::compile) booleans_in_math: bool,
    /// Every string's canonical id, over the DAST table and then
    /// `extra_strings`; built when first needed. A cache.
    string_ids: Option<HashMap<String, StrId>>,
    /// By DAST string, the prop a reference spelled with it last named,
    /// with the type it named it on: a spelling is nearly always used on
    /// one type, so this is an array read. A cache.
    prop_sels: Vec<Option<(ComponentType, Option<PropSel>)>>,
}

/// The rows of outlining's tables, as every stage but planning reads them.
impl<'a> Reader<'a> {
    /// A reader of `dast` and of what outlining settled of it.
    pub(in crate::compile) fn new(dast: &'a Dast, settled: &'a Settled) -> Self {
        Reader(SourceReader { dast, settled })
    }

    /// What outlining settled.
    pub(in crate::compile) fn settled(&self) -> &'a Settled {
        self.0.settled
    }

    /// Outlining's part of template `t`.
    pub(in crate::compile) fn outlined(&self, t: TemplateId) -> &'a Outlined {
        self.0.outlined(t)
    }

    /// Element `e` of template `t` as outlining made it.
    pub(in crate::compile) fn elem(&self, t: TemplateId, e: ElemId) -> &'a Elem {
        self.0.elem(t, e)
    }
}

/// The rows, for the readers alone; and what outlining settled beside
/// them, as every reader and every stage reads it.
impl<'a> SourceReader<'a> {
    /// Outlining's part of template `t`: for the readers. A stage reads it
    /// through [`Reader::outlined`].
    pub(in crate::compile::read) fn outlined(&self, t: TemplateId) -> &'a Outlined {
        &self.settled.templates[t.index()]
    }

    /// Element `e` of template `t` as outlining made it: for the readers.
    /// A stage reads it through [`Reader::elem`].
    pub(in crate::compile::read) fn elem(&self, t: TemplateId, e: ElemId) -> &'a Elem {
        &self.outlined(t).elems[e.index()]
    }

    /// The name table.
    pub(in crate::compile) fn names(&self) -> &'a NameTable {
        &self.settled.names
    }

    /// The answer's `response` a `$mi` in a `<when>` stands for.
    pub(in crate::compile) fn submitted(&self, m: NodeId) -> Option<ElemId> {
        self.settled.submitted.get(&m).copied()
    }

    /// The reference outlining planned for `$ref` `m` in an answer's when.
    pub(in crate::compile) fn when_ref(&self, m: NodeId) -> Option<RefId> {
        self.settled.when_refs.get(&m).copied()
    }

    /// The `response` outlining made in answer `e` of template `t` for
    /// the input `key` names.
    pub(in crate::compile) fn answer_response(
        &self,
        t: TemplateId,
        e: ElemId,
        key: InputKey,
    ) -> Option<ElemId> {
        let responses = self.settled.answer_responses.get(&(t, e))?;
        responses.iter().find(|(k, _)| *k == key).map(|&(_, r)| r)
    }

    /// Choice `cid` as outlining made it.
    pub(in crate::compile) fn choice(&self, cid: ChoiceId) -> &'a ChoiceDef {
        &self.settled.choices[cid.index()]
    }

    /// How element `e` is named in a diagnostic.
    pub(in crate::compile) fn elem_label(&self, t: TemplateId, e: ElemId) -> String {
        elem_label(self.dast, self.elem(t, e))
    }
}

/// What the stages append to: a reference plan, a canonical string, a
/// warning; and the cache of prop spellings references read.
impl Arenas {
    /// Adds `plan` to the reference arena, as the reference it is the plan
    /// of.
    pub(in crate::compile) fn push_ref(&mut self, plan: RefPlan) -> RefId {
        self.refs.push(plan);
        RefId::from_index(self.refs.len() - 1)
    }

    /// A type mix at `node` (D47, D68; ADR 0064, decision 4): warned where
    /// it is written, and planned as the missing value in its place.
    pub(in crate::compile) fn type_mix(&mut self, node: NodeId, message: &str) -> Source {
        self.warn(node, "cells-type-mix", message);
        Source::constant(crate::program::MISSING)
    }

    /// Reference `p`, replaced by one that names nothing: a type mix in
    /// math text, read as the missing value wherever it stands.
    pub(in crate::compile) fn mix_ref(&mut self, p: RefId, message: &str) -> RefId {
        let node = self.refs[p.index()].node;
        self.warn(node, "cells-type-mix", message);
        self.push_ref(RefPlan {
            hops: 0,
            steps: vec![Step::Nothing],
            prop: None,
            entries: Vec::new(),
            display: RefDisplay::Written,
            node,
        })
    }

    /// Plan `p`, to change: a prop named on it after it was planned.
    pub(in crate::compile) fn ref_mut(&mut self, p: RefId) -> &mut RefPlan {
        &mut self.refs[p.index()]
    }

    /// Drops the plans made since the arena held `n`: what an attempt
    /// planned before it found a copy's clones unmade (`with_clones`).
    pub(in crate::compile) fn truncate_refs(&mut self, n: usize) {
        self.refs.truncate(n);
    }

    /// How plan `p` is shown in an error, spelled from `dast`.
    pub(in crate::compile) fn ref_display(&self, dast: &Dast, p: RefId) -> String {
        display_of(dast, &self.refs[p.index()])
    }

    /// Prop `name` (a DAST string) of type `ty`, found once per type and
    /// spelling: a reference reads it with no name to compare.
    pub(in crate::compile) fn prop_sel(
        &mut self,
        dast: &Dast,
        ty: ComponentType,
        name: StrId,
    ) -> Option<PropSel> {
        let i = name.index();
        if let Some(Some((of, sel))) = self.prop_sels.get(i)
            && *of == ty
        {
            return *sel;
        }
        let sel = ty.resolve_prop(ty.canonical_prop(dast.strings.get(name)));
        if self.prop_sels.len() <= i {
            self.prop_sels.resize(dast.strings.len().max(i + 1), None);
        }
        self.prop_sels[i] = Some((ty, sel));
        sel
    }

    /// The canonical string id of `text`: the DAST's if it has one, else
    /// from `extra_strings`. Equal text has equal ids.
    pub(in crate::compile) fn intern_literal(&mut self, dast: &Dast, text: &str) -> StrId {
        let ids = self.string_ids.get_or_insert_with(|| {
            let mut ids = HashMap::new();
            for i in StrId::below(dast.strings.len()).rev() {
                ids.insert(dast.strings.get(i).to_string(), i);
            }
            ids
        });
        if let Some(&id) = ids.get(text) {
            return id;
        }
        let id = StrId::from_index(dast.strings.len() + self.extra_strings.len());
        self.extra_strings.push(text.to_string());
        ids.insert(text.to_string(), id);
        id
    }

    /// A warning about the element at `node`, which the compile reports.
    pub(in crate::compile) fn warn(
        &mut self,
        node: NodeId,
        code: &'static str,
        message: &str,
    ) -> Warned {
        // A node planned twice (an extend's attribute, read again by its
        // planner) warns once.
        // A code of the current core's infos (`doenet-i…`) is reported as
        // one (an angle between three lines, ADR 0080).
        let d = if code.starts_with("doenet-i") {
            Diagnostic::info(code, Some(node), message.into())
        } else {
            Diagnostic::warning(code, Some(node), message.into())
        };
        if !self
            .warnings
            .iter()
            .any(|w| w.node == d.node && w.code == d.code && w.message == d.message)
        {
            self.warnings.push(d);
        }
        Warned::raised()
    }
}

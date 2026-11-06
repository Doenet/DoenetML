//! What the readers several stages run read and write: [`Reader`], the
//! source and what outlining settled, read-only; and [`Arenas`], what they
//! append to (ADR 0031, "Code more than one stage runs").

use crate::compile::*;

/// What every stage reads and none changes once outlining is done: the
/// DAST and what outlining settled (its rows, the choices, the name
/// table). The readers in `refs`, `source`, `values`, `maths`, `points`,
/// `rebase`, `answer`, `record` and `names` are its methods; one that also
/// writes takes the [`Arenas`] it writes. Outlining, which is still making
/// what it settles, makes one from its own state between its writes.
#[derive(Clone, Copy)]
pub(in crate::compile) struct Reader<'a> {
    /// The source being compiled.
    pub(in crate::compile) dast: &'a Dast,
    /// What outlining settled, or has settled so far.
    settled: &'a Settled,
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
    /// Every string's canonical id, over the DAST table and then
    /// `extra_strings`; built when first needed. A cache.
    string_ids: Option<HashMap<String, StrId>>,
    /// By DAST string, the prop a reference spelled with it last named,
    /// with the type it named it on: a spelling is nearly always used on
    /// one type, so this is an array read. A cache.
    prop_sels: Vec<Option<(ComponentType, Option<PropSel>)>>,
}

/// The read-only context: what outlining settled, as every reader reads it.
impl<'a> Reader<'a> {
    /// A reader of `dast` and of what outlining settled of it.
    pub(in crate::compile) fn new(dast: &'a Dast, settled: &'a Settled) -> Self {
        Reader { dast, settled }
    }

    /// The name table.
    pub(in crate::compile) fn names(&self) -> &'a NameTable {
        &self.settled.names
    }

    /// The answer's `response` a `$mi` in a `<when>` stands for.
    pub(in crate::compile) fn submitted(&self, m: NodeId) -> Option<ElemId> {
        self.settled.submitted.get(&m).copied()
    }

    /// Outlining's part of template `t`.
    pub(in crate::compile) fn outlined(&self, t: TemplateId) -> &'a Outlined {
        &self.settled.templates[t.index()]
    }

    /// Element `e` of template `t` as outlining made it.
    pub(in crate::compile) fn elem(&self, t: TemplateId, e: ElemId) -> &'a Elem {
        &self.outlined(t).elems[e.index()]
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
        self.warnings
            .push(Diagnostic::warning(code, Some(node), message.into()));
        Warned::raised()
    }
}

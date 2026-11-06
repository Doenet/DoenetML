//! The compile's output, which every build stamps: [`Compiled`], the
//! source and its [`Plans`], and [`CompiledRef`], the two borrowed as a
//! build reads them.

use crate::compile::*;

/// A document as compiled, kept: its source and the plans made from it,
/// once. What a load keeps to rebuild from, and what a test builds again.
#[derive(Debug)]
pub struct Compiled {
    pub(crate) dast: Dast,
    pub(crate) plans: Plans,
    /// The source's diagnostics, in node order: a fact about the source
    /// (ADR 0014), which the document shares ([`Loaded::diagnostics`](crate::document::Loaded::diagnostics)).
    pub(crate) diagnostics: Arc<Vec<crate::diagnostics::Diagnostic>>,
}

/// What a build reads: a source and the plans made from it, borrowed.
/// Made only from a [`Compiled`] or by the compile's loop from the source
/// it planned, so the plans always index into the source beside them.
#[derive(Debug, Clone, Copy)]
pub(crate) struct CompiledRef<'a> {
    pub(crate) dast: &'a Dast,
    pub(crate) plans: &'a Plans,
}

/// What the compile makes from a source: its templates and plans. A stage
/// that reads the source is given it; the plans never hold it.
#[derive(Debug)]
pub(crate) struct Plans {
    pub(crate) templates: Vec<Template>,
    pub(crate) refs: Vec<RefPlan>,
    /// Expression templates: cell leaves hold plan ids.
    pub(crate) arena: Arena<RefId>,
    /// The math text of templates that may be symbolic.
    pub(crate) sym_text: HashMap<ExprId, SymText>,
    /// In a document with repeats, each symbolic math text's parse, made
    /// once. Empty in a document without repeats.
    pub(crate) sym_trees: HashMap<ExprId, OnceLock<std::result::Result<Tree<RefId>, String>>>,
    pub(crate) choices: Vec<ChoiceDef>,
    /// The source's version hash.
    pub(crate) version: u64,
    /// Every element's stable key.
    pub(crate) keys: Arc<crate::compile::keys::Keys>,
    /// Text the build needs that is not a DAST string (a textInput's
    /// `prefill`), appended after the DAST's table, so their ids are the
    /// same in every build.
    pub(crate) extra_strings: Vec<String>,
    /// The document's structural depth, which bounds every build's: 0
    /// without a repeat, and 0 when a test load skips the count check.
    pub(crate) structural_depth: u32,
    /// Whether a build gives a dead slot no cell.
    pub(crate) prune: bool,
    /// Whether a build folds instructions over constants.
    pub(crate) fold: bool,
    /// For each node of `arena`, the first node structurally equal to it.
    /// Empty when the load does not share.
    pub(crate) expr_class: Vec<ExprId>,
}

impl Compiled {
    /// The source it was compiled from.
    pub fn dast(&self) -> &Dast {
        &self.dast
    }

    /// The type of template slot `slot` of `template`, as the type pass
    /// settled it.
    pub fn port_type(&self, template: usize, slot: TemplateSlot) -> PortType {
        self.plans.port_type(template, slot)
    }

    /// The source and the plans, borrowed, as a build reads them.
    pub(crate) fn view(&self) -> CompiledRef<'_> {
        CompiledRef {
            dast: &self.dast,
            plans: &self.plans,
        }
    }
}

impl<'a> CompiledRef<'a> {
    /// How plan `p` is shown in an error.
    pub(crate) fn ref_display(self, p: RefId) -> String {
        self.plans.ref_display(self.dast, p)
    }

    /// How `plan` is shown in an error.
    pub(crate) fn display_of(self, plan: &RefPlan) -> String {
        display_of(self.dast, plan)
    }
}

impl Plans {
    /// How plan `p` is shown in an error, spelled from `dast`.
    pub(crate) fn ref_display(&self, dast: &Dast, p: RefId) -> String {
        display_of(dast, &self.refs[p.index()])
    }

    /// The type of template slot `slot` of `template`, as the type pass
    /// settled it.
    pub(crate) fn port_type(&self, template: usize, slot: TemplateSlot) -> PortType {
        self.templates[template].sealed.types[slot.index()]
    }

    /// What the check found of template slot `slot` of `template`: nothing
    /// before it has run.
    /// How many options select `cid` picks, as the check evaluated its
    /// `numToSelect` (ADR 0037); 0 for a select the check never saw.
    pub(crate) fn num_to_select(&self, cid: ChoiceId) -> u32 {
        let (t, e) = self.choices[cid.index()].at;
        self.templates[t.index()]
            .checked
            .picks
            .iter()
            .find(|p| p.0 == e)
            .map_or(0, |p| p.1)
    }

    pub(crate) fn port_attrs(&self, template: TemplateId, slot: TemplateSlot) -> PortAttrs {
        let attrs = &self.templates[template.index()].checked.attrs;
        attrs.get(slot.index()).copied().unwrap_or_default()
    }

    /// Drop the plans' spare capacity once planning is done.
    pub(crate) fn shrink_to_fit(&mut self) {
        self.templates.shrink_to_fit();
        for tpl in &mut self.templates {
            let o = &mut tpl.outlined;
            o.elems.shrink_to_fit();
            o.children.shrink_to_fit();
            for el in &mut o.elems {
                el.children.shrink_to_fit();
            }
            for plan in &mut tpl.tables.plans {
                plan.props.shrink_to_fit();
            }
        }
        self.refs.shrink_to_fit();
        self.arena.nodes.shrink_to_fit();
        self.sym_text.shrink_to_fit();
        self.choices.shrink_to_fit();
    }

    /// How many build passes a load or a rebuild may take before the
    /// structure must have settled: the structural depth plus one, and
    /// never fewer than `floor`.
    pub(crate) fn passes(&self, floor: usize) -> usize {
        (self.structural_depth as usize + 1).max(floor)
    }

    /// Whether any template is a repeat body: without one the structure
    /// never changes, the schedule's own check is complete, and no later
    /// build stamps the compile.
    pub(crate) fn has_repeats(&self) -> bool {
        self.templates.iter().any(|t| {
            t.elems
                .iter()
                .any(|e| matches!(e.body, Body::Repeat { .. }))
        })
    }
}

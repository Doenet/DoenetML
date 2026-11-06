//! What no tick changes, and what it can be (ADR 0037): over the template
//! graph as define made it, which nodes are constants, read only through
//! stable references, and the range of each, exact for a document
//! constant; then the check of every load-time choice that reads them.
//!
//! A node is a constant when its definition is a constant leaf, a scope
//! leaf, a given value the writable walk does not reach, or an operator,
//! alias or vector output whose every input is a constant; when it is no
//! counted value; when, computed, every flag that holds it is a constant
//! (a value nothing computes no tick changes, held or not); and when
//! every read it makes through an index is stable: the index lands inside
//! what it indexes in every build (`Need`). This is a build's fold rule
//! (`Builder::folded_slots`) lifted to the check and stripped of its scope
//! rule, which the graph needs not, every referent existing in it.
//!
//! A constant's range (`Range`) is computed as the walks read a node,
//! through its definition (ADR 0035): a constant leaf is its value; an
//! iteration index ranges over its repeat's count; a draw over `[0, 1)`;
//! a select's stand-in over its members; an operator over all-exact
//! inputs is evaluated, and otherwise applies its range rule. Nothing
//! reads a seed, a count or state, and no cell is computed: the graph
//! holds no value a seed decides.

use super::define::Defined;
use super::*;
use crate::document::CellIdx;
use crate::error::Error;
use crate::program::{Range, fewest_in_sequence, sequence_count, sequence_index};

/// What a stable-reference need comes to.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum Verdict {
    /// The referent exists in every build.
    Stable,
    /// The referent exists in no build: the missing value, a constant NaN.
    Missing,
    /// The referent may exist in one build and not in another.
    Unstable,
}

/// Why a node is not a constant: what its reads first reach.
enum Why {
    /// A given value a student's action can write, from the input at a
    /// position in the graph's components.
    Writable(GraphNode, Option<u32>),
    /// A counted value.
    Counted(GraphNode),
    /// A read through an index that may land past what it indexes.
    Unstable(GraphNode),
}

/// The constants of a template graph, and their ranges.
pub(crate) struct Constants<'a, 'c> {
    g: &'a TemplateGraph,
    d: &'a Defined,
    c: CompiledRef<'c>,
    /// Per node, whether it is not a constant.
    nonconst: Vec<bool>,
    /// Per need of `g.needs`, what it comes to.
    verdicts: Vec<Verdict>,
    /// Each node's range, once computed.
    memo: Vec<Option<Range>>,
    /// Each node's later definitions, by position in `g.later`.
    later: FxMap<GraphNode, Vec<usize>>,
    /// Who reads each node, through a definition or as a hold's flag:
    /// node `v`'s from `reader_start[v]` to `reader_start[v + 1]`.
    reader_start: Vec<u32>,
    readers: Vec<GraphNode>,
    /// The flags that hold each node.
    flags: FxMap<GraphNode, Vec<GraphNode>>,
    /// An engine of the evaluator's own, for a math constant's value;
    /// made when first needed.
    engine: std::cell::RefCell<Option<crate::sym::Engine>>,
}

impl<'a, 'c> Constants<'a, 'c> {
    /// The constants of `g`, defined as `d`: a fixpoint, each need judged
    /// over the constants of the round before until none changes.
    pub(crate) fn new(g: &'a TemplateGraph, d: &'a Defined, c: CompiledRef<'c>) -> Self {
        let n = g.nodes.len();
        let mut later: FxMap<GraphNode, Vec<usize>> = FxMap::default();
        for (i, (s, _)) in g.later.iter().enumerate() {
            later.entry(*s).or_default().push(i);
        }
        // A flag holds what is computed: a value nothing computes no tick
        // changes, held or not, as a build's fold rule has it.
        let computed = |s: GraphNode| !matches!(g.defs[s.index()], Def::Given(_) | Def::Const(_));
        let holds: Vec<(GraphNode, GraphNode)> = g
            .holds
            .iter()
            .copied()
            .filter(|&(s, _)| computed(s))
            .collect();
        let mut flags: FxMap<GraphNode, Vec<GraphNode>> = FxMap::default();
        for &(s, f) in &holds {
            flags.entry(s).or_default().push(f);
        }
        // Readers, counted then placed.
        let mut count = vec![0u32; n + 1];
        for u in GraphNode::below(n) {
            for &v in g.reads(u) {
                count[v.index()] += 1;
            }
        }
        for &(_, f) in &holds {
            count[f.index()] += 1;
        }
        let mut reader_start = vec![0u32; n + 1];
        for v in 0..n {
            reader_start[v + 1] = reader_start[v] + count[v];
        }
        let mut fill = reader_start.clone();
        let mut readers = vec![GraphNode::NONE; reader_start[n] as usize];
        let mut place = |v: GraphNode, u: GraphNode| {
            readers[fill[v.index()] as usize] = u;
            fill[v.index()] += 1;
        };
        for u in GraphNode::below(n) {
            for &v in g.reads(u) {
                place(v, u);
            }
        }
        for &(s, f) in &holds {
            place(f, s);
        }
        let verdicts = g
            .needs
            .iter()
            .map(|need| match need {
                Need::Unstable => Verdict::Unstable,
                Need::All(_) => Verdict::Stable,
            })
            .collect();
        let mut k = Constants {
            g,
            d,
            c,
            nonconst: vec![false; n],
            verdicts,
            memo: vec![None; n],
            later,
            reader_start,
            readers,
            flags,
            engine: std::cell::RefCell::new(None),
        };
        k.settle();
        k
    }

    /// Judge every need over the constants, and mark the constants again,
    /// until no verdict changes. A verdict only ever gets worse, as the
    /// constants only ever shrink, so this ends.
    fn settle(&mut self) {
        loop {
            self.mark();
            self.memo.iter_mut().for_each(|m| *m = None);
            let mut changed = false;
            for k in 0..self.g.needs.len() {
                if self.verdicts[k] == Verdict::Unstable {
                    continue;
                }
                let v = self.judge(k).max(self.verdicts[k]);
                if v != self.verdicts[k] {
                    self.verdicts[k] = v;
                    changed = true;
                }
            }
            if !changed {
                return;
            }
        }
    }

    /// Whether node `n` is the seed of no constant: a given value a
    /// student can write, a counted value.
    fn is_seed(&self, n: GraphNode) -> bool {
        matches!(self.g.defs[n.index()], Def::Given(_)) && self.d.essential[n.index()]
    }

    /// The verdict of the read `u -> v`: stable unless a walk through an
    /// index made it.
    fn edge(&self, u: GraphNode, v: GraphNode) -> Verdict {
        self.g
            .read_needs
            .get(&(u, v))
            .map_or(Verdict::Stable, |&k| self.verdicts[k as usize])
    }

    /// Mark every node that is not a constant: the seeds, the readers of a
    /// read that is unstable, and everything that reads one of those.
    fn mark(&mut self) {
        let g = self.g;
        let n = g.nodes.len();
        let mut nonconst = vec![false; n];
        let mut stack: Vec<GraphNode> = Vec::new();
        let seed = |s: GraphNode, nonconst: &mut Vec<bool>, stack: &mut Vec<GraphNode>| {
            if !std::mem::replace(&mut nonconst[s.index()], true) {
                stack.push(s);
            }
        };
        for s in GraphNode::below(n) {
            if self.is_seed(s) {
                seed(s, &mut nonconst, &mut stack);
            }
        }
        for &s in &g.counted {
            seed(s, &mut nonconst, &mut stack);
        }
        for (&(u, v), &k) in &g.read_needs {
            // A flag's read, of a value nothing computes, is no read.
            let read =
                g.reads(u).contains(&v) || self.flags.get(&u).is_some_and(|f| f.contains(&v));
            if read && self.verdicts[k as usize] == Verdict::Unstable {
                seed(u, &mut nonconst, &mut stack);
            }
        }
        while let Some(v) = stack.pop() {
            let (a, b) = (
                self.reader_start[v.index()] as usize,
                self.reader_start[v.index() + 1] as usize,
            );
            for &u in &self.readers[a..b] {
                seed(u, &mut nonconst, &mut stack);
            }
        }
        self.nonconst = nonconst;
    }

    /// Whether node `n` is a constant.
    pub(crate) fn is_constant(&self, n: GraphNode) -> bool {
        !self.nonconst[n.index()]
    }

    /// Per node, whether it is a constant: what `PortAttrs::CONSTANT`
    /// marks.
    pub(crate) fn constants(&self) -> Vec<bool> {
        self.nonconst.iter().map(|&x| !x).collect()
    }

    /// Each constant port's range, by template and template slot: what
    /// the tests hold every build's constants to.
    #[cfg(feature = "testing")]
    pub(crate) fn port_ranges(&mut self) -> Vec<(TemplateId, TemplateSlot, Range)> {
        let (g, c) = (self.g, self.c);
        let mut out = Vec::new();
        for (s, node) in g.nodes.iter().enumerate() {
            let NodeKind::Port { elem, port } = node.kind else {
                continue;
            };
            let n = GraphNode::from_index(s);
            if self.nonconst[s] {
                continue;
            }
            let tpl = &c.plans.templates[node.template.index()];
            let reserved = tpl
                .plan(elem)
                .props
                .len()
                .max(tpl.row(elem).component_type.prop_defs().len());
            if port as usize >= reserved {
                continue;
            }
            let slot = tpl.sealed.elems[elem.index()]
                .slot_off
                .offset(port as usize);
            out.push((node.template, slot, self.range(n)));
        }
        out
    }

    // ---- stable references -------------------------------------------------

    /// What need `k` comes to over the current constants.
    fn judge(&mut self, k: usize) -> Verdict {
        let Need::All(conds) = &self.g.needs[k] else {
            return Verdict::Unstable;
        };
        let mut worst = Verdict::Stable;
        for cond in conds.clone() {
            worst = worst.max(self.judge_cond(&cond));
        }
        worst
    }

    /// Whether `cond`'s index lands inside what it indexes in every build
    /// (stable), in none (missing), or may in some and not others.
    fn judge_cond(&mut self, cond: &Cond) -> Verdict {
        let count = match cond.count {
            Count::Fixed(n) => Range::point(n as f64),
            Count::Node(c) => {
                if self.nonconst[c.index()] {
                    return Verdict::Unstable;
                }
                self.range(c)
            }
            Count::Picks(cid) => match self.num_to_select(cid) {
                Some(n) => Range::point(n as f64),
                None => return Verdict::Unstable,
            },
        };
        let mut index = Range::point(0.0);
        for term in &cond.terms {
            let r = match *term {
                IndexTerm::Const(k) => Range::point(k as f64),
                IndexTerm::Iter(hops) => {
                    let mut s = cond.from;
                    for _ in 0..hops {
                        s = self.g.parent[s.index()].expect("an index's hops stay in the document");
                    }
                    self.iteration(s)
                }
                IndexTerm::Cell(_) => return Verdict::Unstable,
            };
            index = index.corners(r, |a, b| a + b);
        }
        match (index, count) {
            (Range::Span(ilo, ihi), Range::Span(clo, chi)) => {
                if ilo >= 1.0 && ihi <= clo {
                    Verdict::Stable
                } else if ihi < 1.0 || ilo > chi {
                    Verdict::Missing
                } else {
                    Verdict::Unstable
                }
            }
            _ => Verdict::Unstable,
        }
    }

    /// The count node of the repeat whose body is template `t`, if it is
    /// one.
    fn repeat_count(&self, t: TemplateId) -> Option<GraphNode> {
        let (pt, pe) = self.c.plans.templates[t.index()].parent?;
        let row = self.c.plans.templates[pt.index()].row(pe);
        if !matches!(row.body, Body::Repeat { .. }) {
            return None;
        }
        let pi = row.component_type.count_prop()?;
        Some(self.g.port(pt, pe, pi))
    }

    /// What the position of an iteration of template `t` ranges over: from
    /// 1 to its repeat's count, unbounded when the count is no constant.
    fn iteration(&mut self, t: TemplateId) -> Range {
        let count = self.repeat_count(t).map(|n| self.range(n));
        self.iteration_of(count)
    }

    fn iteration_of(&self, count: Option<Range>) -> Range {
        match count {
            Some(Range::Span(_, hi)) => Range::Span(1.0, hi.max(1.0)),
            _ => Range::Span(1.0, f64::INFINITY),
        }
    }

    /// The `numToSelect` of select `cid`: the value of its port when that
    /// is the same in every scope; None otherwise. Not checked here (a
    /// select's own check is `check_choices`).
    pub(crate) fn num_to_select(&mut self, cid: ChoiceId) -> Option<u32> {
        let def = &self.c.plans.choices[cid.index()];
        let (t, e) = def.at;
        let pi = prop::select::NUM_TO_SELECT;
        if (self.g.n_ports[t.index()][e.index()] as usize) <= pi {
            return None;
        }
        let n = self.g.port(t, e, pi);
        if self.nonconst[n.index()] {
            return None;
        }
        let v = self.range(n).as_point()?;
        (v >= 0.0 && v.fract() == 0.0 && v <= u32::MAX as f64).then_some(v as u32)
    }

    // ---- ranges ------------------------------------------------------------

    /// The range of node `n`: ⊤ when it is no constant.
    pub(crate) fn range(&mut self, n: GraphNode) -> Range {
        if let Some(r) = self.memo[n.index()] {
            return r;
        }
        // Depth first, each node after what it reads; a node met again
        // while open closes a loop the cycle check let pass (a recurrence
        // folded onto itself): ⊤.
        let mut open = FxMap::default();
        let mut stack = vec![(n, false)];
        while let Some((u, ready)) = stack.pop() {
            if self.memo[u.index()].is_some() {
                continue;
            }
            if self.nonconst[u.index()] {
                self.memo[u.index()] = Some(Range::Top);
                continue;
            }
            if ready {
                open.remove(&u);
                let r = self.compute(u);
                self.memo[u.index()] = Some(r);
                continue;
            }
            if open.insert(u, ()).is_some() {
                self.memo[u.index()] = Some(Range::Top);
                continue;
            }
            stack.push((u, true));
            for v in self.deps(u) {
                if self.memo[v.index()].is_none() {
                    stack.push((v, false));
                }
            }
        }
        self.memo[n.index()].unwrap_or(Range::Top)
    }

    /// What node `u`'s range is computed from.
    fn deps(&self, u: GraphNode) -> Vec<GraphNode> {
        let g = self.g;
        let mut out = Vec::new();
        match g.scope_leaves.get(&u) {
            Some(ScopeLeaf::IterIndex(t)) => {
                out.extend(self.repeat_count(*t));
                return out;
            }
            Some(ScopeLeaf::Draw | ScopeLeaf::Varies) => return out,
            None => {}
        }
        if let Some(members) = g.select_reads.get(&u) {
            return members.clone();
        }
        let defs = std::iter::once(&g.defs[u.index()]).chain(
            self.later
                .get(&u)
                .into_iter()
                .flatten()
                .map(|&i| &g.later[i].1),
        );
        for def in defs {
            match def {
                Def::VecOut(head, _) => out.extend_from_slice(g.defs[head.index()].reads()),
                def => out.extend_from_slice(def.reads()),
            }
        }
        out
    }

    /// The range of what has computed: ⊤ for what has not.
    fn known(&self, v: GraphNode) -> Range {
        self.memo[v.index()].unwrap_or(Range::Top)
    }

    /// The range of the read `u -> v`: ⊤ for a read of the missing value.
    fn read(&self, u: GraphNode, v: GraphNode) -> Range {
        match self.edge(u, v) {
            Verdict::Missing => Range::Top,
            _ => self.known(v),
        }
    }

    /// Node `u`'s range, from its definitions, once what they read is
    /// computed.
    fn compute(&self, u: GraphNode) -> Range {
        let g = self.g;
        match g.scope_leaves.get(&u) {
            Some(ScopeLeaf::IterIndex(t)) => {
                let count = self.repeat_count(*t).map(|n| self.known(n));
                return self.iteration_of(count);
            }
            Some(ScopeLeaf::Draw) => return Range::Span(0.0, 1.0),
            Some(ScopeLeaf::Varies) => return Range::Top,
            None => {}
        }
        if let Some(members) = g.select_reads.get(&u) {
            return members
                .iter()
                .map(|&m| self.read(u, m))
                .reduce(Range::hull)
                .unwrap_or(Range::Top);
        }
        let mut r = self.def_range(u, &g.defs[u.index()]);
        for &i in self.later.get(&u).into_iter().flatten() {
            r = r.hull(self.def_range(u, &g.later[i].1));
        }
        r
    }

    /// The range definition `def` gives node `u`.
    fn def_range(&self, u: GraphNode, def: &Def) -> Range {
        match def {
            Def::Given(Some(v)) | Def::Const(Some(v)) => Range::point(*v),
            // A math handle, the engine's.
            Def::Given(None) | Def::Const(None) | Def::Unset => Range::Top,
            Def::Alias(v) => self.read(u, *v),
            // A math constant's number, as the engine evaluates it.
            Def::Op(GraphOp::Spec(OpSpec::Sym(SymKind::Evaluate)), inputs) => match inputs[..] {
                [x] if self.edge(u, x) != Verdict::Missing => self.math_value(x),
                _ => Range::Top,
            },
            Def::Op(GraphOp::Spec(spec), inputs) => {
                let rs: Vec<Range> = inputs.iter().map(|&v| self.read(u, v)).collect();
                apply(*spec, &rs, 0)
            }
            // A symbolic template: its value is the engine's.
            Def::Op(GraphOp::Template(_), _) => Range::Top,
            Def::VecOut(head, k) => match &self.g.defs[head.index()] {
                Def::Op(GraphOp::Spec(spec), inputs) => {
                    let rs: Vec<Range> = inputs.iter().map(|&v| self.read(*head, v)).collect();
                    apply(*spec, &rs, *k as usize)
                }
                _ => Range::Top,
            },
        }
    }

    /// The number math node `x` evaluates to, when its cell is a math
    /// value the graph knows the text of (a constant, or a given math no
    /// student can write); ⊤ otherwise.
    fn math_value(&self, x: GraphNode) -> Range {
        if self.nonconst[x.index()] {
            return Range::Top;
        }
        let def = self.d.def(self.d.cell_of(x));
        if !matches!(
            self.g.defs[def.index()],
            Def::Const(None) | Def::Given(None)
        ) {
            return Range::Top;
        }
        let Some(origin) = self.g.math.get(&def) else {
            return Range::Top;
        };
        let mut engine = self.engine.borrow_mut();
        let engine = engine.get_or_insert_with(crate::sym::Engine::new);
        let h = math_handle(engine, self.c, origin);
        Range::point(engine.evaluate(h, None))
    }

    // ---- explanations ------------------------------------------------------

    /// Why node `n`, no constant, is not one: the first seed its reads
    /// reach, breadth first.
    fn why(&self, n: GraphNode) -> Option<Why> {
        let g = self.g;
        let mut seen = FxMap::default();
        let mut queue = std::collections::VecDeque::from([n]);
        seen.insert(n, ());
        while let Some(u) = queue.pop_front() {
            if self.is_seed(u) {
                return Some(Why::Writable(u, self.d.written_by.get(&u).copied()));
            }
            if g.counted.contains(&u) {
                return Some(Why::Counted(u));
            }
            let flags = self.flags.get(&u).map_or(&[][..], Vec::as_slice);
            for &v in g.reads(u).iter().chain(flags) {
                if self.edge(u, v) == Verdict::Unstable {
                    return Some(Why::Unstable(v));
                }
            }
            for &v in g.reads(u).iter().chain(flags) {
                if self.nonconst[v.index()] && seen.insert(v, ()).is_none() {
                    queue.push_back(v);
                }
            }
        }
        None
    }

    /// The reason a parameter reading node `n` is refused, as a clause.
    fn explain(&self, n: GraphNode) -> String {
        let label = |n| refuse::slot_label(self.g, self.c, n);
        match self.why(n) {
            Some(Why::Writable(leaf, by)) => {
                let by = by
                    .and_then(|ci| {
                        let comp = &self.g.comps[ci as usize];
                        (!comp.base.is_none()).then(|| label(comp.base))
                    })
                    .map(|l| {
                        let owner = l.split('.').next().unwrap_or(&l).to_string();
                        format!(" through '{owner}'")
                    })
                    .unwrap_or_default();
                format!("'{}' can be changed by a student{by}", label(leaf))
            }
            Some(Why::Counted(c)) => format!(
                "'{}' is a count, which follows what a student does",
                label(c)
            ),
            Some(Why::Unstable(v)) => format!(
                "'{}' is read through an index that may name nothing in some build",
                label(v)
            ),
            None => "it can change while a student works".into(),
        }
    }
}

/// What operator `spec` gives, output `k`, over inputs in `rs`: evaluated
/// when every input is one value, else its range rule (`OpSpec::range`),
/// which speaks for its first output only.
fn apply(spec: OpSpec, rs: &[Range], k: usize) -> Range {
    let points: Option<Vec<f64>> = rs.iter().map(|r| r.as_point()).collect();
    if let Some(vals) = points {
        return match spec {
            OpSpec::Sym(_) => Range::Top,
            OpSpec::Vec(v) => {
                if vals.len() != v.n_in() || k >= v.n_out() {
                    return Range::Top;
                }
                let mut out = vec![0.0; v.n_out()];
                v.eval(&vals, &mut out);
                Range::point(out[k])
            }
            spec => match spec.scalar_arity() {
                Some(n) if n == vals.len() => {
                    let op = spec.bind_scalar(&CellIdx::below(n).collect::<Vec<_>>());
                    Range::point(op.eval(&vals))
                }
                _ => Range::Top,
            },
        };
    }
    if k == 0 { spec.range(rs) } else { Range::Top }
}

/// How a range reads in a message.
fn show(r: Range) -> String {
    match r {
        Range::Top => "anything".into(),
        Range::Span(lo, hi) if lo == hi => format!("{lo}"),
        Range::Span(lo, hi) => format!("from {lo} to {hi}"),
    }
}

/// Check every load-time choice of `g` (ADR 0037): each parameter a
/// constant, and every draw of every select possible for every value its
/// parameters can take. Returns each select's `numToSelect`, by choice; a
/// select that fails names its element to box.
pub(crate) fn check_choices(
    g: &TemplateGraph,
    k: &mut Constants<'_, '_>,
    c: CompiledRef<'_>,
) -> std::result::Result<Vec<(ChoiceId, u32)>, Failure> {
    let mut picks = Vec::new();
    for comp in &g.comps {
        let Some((t, e)) = comp.elem else { continue };
        let tpl = &c.plans.templates[t.index()];
        let row = tpl.row(e);
        let node = (!row.node.is_none()).then_some(row.node);
        let fail = |error| Failure { error, node };
        match row.component_type {
            ComponentType::SelectFromSequence => check_sequence(g, k, c, t, e).map_err(fail)?,
            ComponentType::Select => {
                let Body::Choice(cid) = row.body else {
                    continue;
                };
                picks.push((cid, check_select(g, k, c, t, e, cid).map_err(fail)?));
            }
            _ => {}
        }
    }
    picks.sort_by_key(|p| p.0);
    picks.dedup_by_key(|p| p.0);
    Ok(picks)
}

/// The attribute text of `name` on the element at `node`, as written.
fn attr_text(c: CompiledRef<'_>, node: NodeId, name: &str) -> String {
    let d = c.dast;
    if node.is_none() {
        return String::new();
    }
    let Some(a) = d.attr(node, name) else {
        return String::new();
    };
    d.attr_children(a)
        .iter()
        .map(|&n| match d.kind(n) {
            crate::dast::NodeKind::Macro => format!("${}", d.macro_display(n)),
            _ => d.str(n).to_string(),
        })
        .collect::<String>()
        .trim()
        .to_string()
}

/// Node `n`, a parameter `attr` of a load-time choice of `tag` at `node`,
/// must be a constant.
fn constant_param(
    k: &Constants<'_, '_>,
    c: CompiledRef<'_>,
    tag: &str,
    node: NodeId,
    attr: &str,
    n: GraphNode,
) -> std::result::Result<(), Error> {
    if k.is_constant(n) {
        return Ok(());
    }
    Err(Error::ChoiceNotConstant {
        tag: tag.into(),
        attr: attr.into(),
        text: attr_text(c, node, attr),
        reason: k.explain(n),
    })
}

/// A `<selectFromSequence>`, element `e` of template `t`: its parameters
/// constants, its step never 0, and its sequence, less what it excludes,
/// never empty.
fn check_sequence(
    g: &TemplateGraph,
    k: &mut Constants<'_, '_>,
    c: CompiledRef<'_>,
    t: TemplateId,
    e: ElemId,
) -> std::result::Result<(), Error> {
    use crate::components::structure::select_from_sequence as sfs;
    let tpl = &c.plans.templates[t.index()];
    let node = tpl.row(e).node;
    let Some(Source::Flow(Flow::Op(OpSpec::Vec(VecOp::SequencePick { .. }), args))) =
        tpl.plan(e).props.get(sfs::VALUE)
    else {
        return Ok(());
    };
    let ports: Vec<GraphNode> = args
        .iter()
        .map(|a| match a {
            Arg::Own(p) => g.port(t, e, p.index()),
            _ => unreachable!("a pick reads its own ports"),
        })
        .collect();
    let tag = "selectFromSequence";
    // Draw, from, step, to, then the excludes.
    let names = ["from", "step", "to"];
    for (i, &n) in ports[1..].iter().enumerate() {
        constant_param(
            k,
            c,
            tag,
            node,
            names.get(i).copied().unwrap_or("exclude"),
            n,
        )?;
    }
    let r: Vec<Range> = ports[1..].iter().map(|&n| k.range(n)).collect();
    let (from, step, to, excludes) = (r[0], r[1], r[2], &r[3..]);
    let domain = |reason: String| Error::ChoiceDomain {
        tag: tag.into(),
        reason,
    };
    for (name, r) in names.iter().zip([from, step, to]) {
        if r == Range::Top {
            return Err(domain(format!(
                "its {name} (\"{}\") cannot be bounded, so it cannot be known to make a sequence",
                attr_text(c, node, name)
            )));
        }
    }
    if excludes.contains(&Range::Top) {
        return Err(domain(format!(
            "an exclude (\"{}\") cannot be bounded",
            attr_text(c, node, "exclude")
        )));
    }
    let where_ = || {
        format!(
            "from is {}, step is {}, to is {}",
            show(from),
            show(step),
            show(to)
        )
    };
    if step.may_be_zero() {
        return Err(domain(format!("its step can be 0 ({})", where_())));
    }
    if let (Some(f), Some(s), Some(to)) = (from.as_point(), step.as_point(), to.as_point()) {
        // Exact: the values the sequence holds, less those excluded.
        let count = sequence_count(f, s, to);
        if count < 1.0 {
            return Err(domain(format!("its sequence is empty ({})", where_())));
        }
        let mut hit: Vec<u64> = Vec::new();
        let mut unsure = 0.0;
        let (a, b) = (f.min(to), f.max(to));
        for x in excludes {
            match *x {
                Range::Span(lo, hi) if lo == hi => {
                    if let Some(i) = sequence_index(f, s, count, lo)
                        && !hit.contains(&i)
                    {
                        hit.push(i);
                    }
                }
                // One of several values: it may fall in the sequence.
                Range::Span(lo, hi) => {
                    if hi >= a && lo <= b {
                        unsure += 1.0;
                    }
                }
                Range::Top => unsure += 1.0,
            }
        }
        if count - hit.len() as f64 - unsure < 1.0 {
            return Err(domain(format!(
                "its exclude can leave nothing to pick ({})",
                where_()
            )));
        }
        return Ok(());
    }
    // Over ranges: the fewest values at a corner of the parameters' box,
    // each exclude that may fall in the sequence taken off.
    let fewest = fewest_in_sequence(from, step, to);
    if fewest < 1.0 {
        return Err(domain(format!("its sequence can be empty ({})", where_())));
    }
    let hull = from.hull(to);
    let hits = excludes
        .iter()
        .filter(|x| match (x, hull) {
            (Range::Span(lo, hi), Range::Span(a, b)) => *hi >= a && *lo <= b,
            _ => true,
        })
        .count();
    if fewest - (hits as f64) < 1.0 {
        return Err(domain(format!(
            "its exclude can leave nothing to pick ({})",
            where_()
        )));
    }
    Ok(())
}

/// A `<select>`, element `e` of template `t`, choice `cid`: its
/// `numToSelect` the same whole number in every scope, and drawable from
/// its options (ADR 0014). Returns the number.
fn check_select(
    g: &TemplateGraph,
    k: &mut Constants<'_, '_>,
    c: CompiledRef<'_>,
    t: TemplateId,
    e: ElemId,
    cid: ChoiceId,
) -> std::result::Result<u32, Error> {
    let node = c.plans.templates[t.index()].row(e).node;
    let pi = prop::select::NUM_TO_SELECT;
    if (g.n_ports[t.index()][e.index()] as usize) <= pi {
        return Ok(0);
    }
    let port = g.port(t, e, pi);
    constant_param(k, c, "select", node, "numToSelect", port)?;
    let r = k.range(port);
    let Some(v) = r.as_point() else {
        return Err(Error::ChoiceDomain {
            tag: "select".into(),
            reason: format!(
                "its numToSelect (\"{}\") must be the same in every scope, and is {}",
                attr_text(c, node, "numToSelect"),
                show(r)
            ),
        });
    };
    if v < 0.0 || v.fract() != 0.0 || v > u32::MAX as f64 {
        return Err(Error::BadValue {
            attr: "numToSelect".into(),
            text: v.to_string(),
        });
    }
    let num = v as u32;
    let def = &c.plans.choices[cid.index()];
    // Whether the select can draw its picks is a fact about the source,
    // checked here and not when drawing, which a select in a repeat does
    // for every iteration a student adds (ADR 0014).
    let n = def.branches.len();
    if n > 0 && num > 0 {
        if !def.with_replacement && num as usize > n {
            return Err(Error::Unsupported(format!(
                "numToSelect={num} is more than the {n} options of a <select> without replacement"
            )));
        }
        let drawable = def.weights.iter().filter(|&&w| w > 0.0).count();
        if drawable == 0 || !def.with_replacement && num as usize > drawable {
            return Err(Error::Unsupported(
                "a <select> whose remaining options all have weight 0".into(),
            ));
        }
    }
    Ok(num)
}

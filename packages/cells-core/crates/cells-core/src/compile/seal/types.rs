//! The type pass: every port's type, inferred once when sealing from its
//! source and the ports it reads. It is a worklist fixpoint from `Num` up
//! over every template at once; through a choice a port's type is the join
//! of the branches'. A reference is followed to the ports it names as far
//! as the templates tell, and where the abstract build is sure to land on a
//! component, the reference's shape (one cell, a point's coordinates, no
//! text inside math, one kind of value per interface name) is checked
//! here.

use super::Seal;
use crate::compile::*;
use crate::components::{PropAt, PropSel};

/// Where a reference path stands while it is walked.
#[derive(Clone, Debug)]
enum Walk {
    /// At the root of templates: after an index into a repeat or a select,
    /// before a name picks an element of the iteration or the option.
    Scope(Vec<TemplateId>),
    /// At elements, one per branch or candidate.
    Elems(Vec<(TemplateId, ElemId)>),
    /// At the points a point list synthesizes: a `<point>` with every port
    /// numeric.
    Points,
    /// Nothing the compile can see: a box, an index on nothing indexable.
    /// The build reads it as the missing value.
    Missing,
}

/// What a reference names: where it stands, and whether the abstract
/// build is sure to land on a component there (an index into a collect
/// that gathers from no repeat, or into a point list, may be past the end
/// at every count, which the build reads as the missing value and checks
/// nothing of).
struct Target {
    at: Walk,
    lands: bool,
}

impl Seal<'_> {
    /// Every port's type, by template and template slot (`offs` are the
    /// elements' slot offsets), and the checks that need them.
    pub(in crate::compile) fn infer_types(
        &self,
        offs: &[(Vec<TemplateSlot>, u32)],
    ) -> std::result::Result<Vec<Vec<PortType>>, Failure> {
        let mut types: Vec<Vec<PortType>> = offs
            .iter()
            .map(|(_, n)| vec![PortType::Num; *n as usize])
            .collect();
        let mut pass = Types {
            seal: self,
            offs,
            types: &mut types,
            walks: Default::default(),
            collects: Default::default(),
            has_symbol: Default::default(),
            reads: Default::default(),
        };
        // Which element and port each template slot is, and who reads it.
        let mut owner: Vec<Vec<(ElemId, usize)>> = offs
            .iter()
            .map(|(_, n)| vec![(ElemId::NONE, 0); *n as usize])
            .collect();
        let mut readers: Vec<Vec<Vec<(TemplateId, TemplateSlot)>>> = offs
            .iter()
            .map(|(_, n)| vec![Vec::new(); *n as usize])
            .collect();
        // Every port once, from `Num` up, recording what it read; then
        // every reader of a port that rose, until none rises. Every rule
        // only raises a type, so this ends.
        let mut work: Vec<(TemplateId, TemplateSlot)> = Vec::new();
        for t in self.template_ids() {
            let tpl = self.view(t);
            for e in ElemId::below(tpl.elems.len()) {
                let plan = tpl.plan(e);
                for (pi, src) in plan.props.iter().enumerate() {
                    let slot = pass.offs[t.index()].0[e.index()].offset(pi);
                    owner[t.index()][slot.index()] = (e, pi);
                    pass.reads.clear();
                    let ty = pass.source_type(t, e, pi, src, false)?;
                    for &(rt, rs) in &pass.reads {
                        readers[rt.index()][rs.index()].push((t, slot));
                    }
                    if pass.raise(t, slot, ty) {
                        work.push((t, slot));
                    }
                }
            }
        }
        while let Some((rt, rs)) = work.pop() {
            for &(t, slot) in &readers[rt.index()][rs.index()] {
                let (e, pi) = owner[t.index()][slot.index()];
                let src = &self.view(t).plan(e).props[pi];
                // Its reads were recorded the first time; they do not
                // change.
                pass.reads.clear();
                let ty = pass.source_type(t, e, pi, src, false)?;
                if pass.raise(t, slot, ty) {
                    work.push((t, slot));
                }
            }
        }
        // The checks, once every type is settled: what a reference's shape
        // must be, read where the types are final.
        for t in self.template_ids() {
            let tpl = self.view(t);
            for e in ElemId::below(tpl.elems.len()) {
                for (pi, src) in tpl.plan(e).props.iter().enumerate() {
                    pass.source_type(t, e, pi, src, true)?;
                }
            }
        }
        pass.check_interfaces()?;
        Ok(types)
    }
}

/// The pass's state: the seal it reads, the slot offsets, the types so
/// far, and what the walks found, which is found once. What it reads of
/// the seal is borrowed for the seal's lifetimes (`'s`, `'a`), never for a
/// borrow of the pass, so a method holds a row or a plan while it records
/// a read or fills a cache through `&mut self`.
struct Types<'s, 'a> {
    seal: &'s Seal<'a>,
    offs: &'s [(Vec<TemplateSlot>, u32)],
    types: &'s mut Vec<Vec<PortType>>,
    /// Where each reference lands, by (template, plan).
    walks: HashMap<(TemplateId, RefId), (Walk, bool)>,
    /// What each collect gathers, by (template, element).
    collects: HashMap<(TemplateId, ElemId), Collected>,
    /// Whether each math text has a free symbol, by expression.
    has_symbol: HashMap<ExprId, bool>,
    /// The ports read while typing one port, as (template, template
    /// slot): its dependencies, which the worklist follows.
    reads: Vec<(TemplateId, TemplateSlot)>,
}

impl<'s, 'a> Types<'s, 'a> {
    /// The type of port `pi` of element `e` of template `t`, as settled so
    /// far; recorded as a read of the port being typed.
    fn port(&mut self, t: TemplateId, e: ElemId, pi: usize) -> PortType {
        let slot = self.offs[t.index()].0[e.index()].offset(pi);
        self.reads.push((t, slot));
        self.types[t.index()]
            .get(slot.index())
            .copied()
            .unwrap_or_default()
    }

    /// Raise template slot `slot` of `t` to `ty` if that is above it;
    /// whether it rose.
    fn raise(&mut self, t: TemplateId, slot: TemplateSlot, ty: PortType) -> bool {
        let old = self.types[t.index()][slot.index()];
        let new = old.join(ty);
        if new != old {
            self.types[t.index()][slot.index()] = new;
            true
        } else {
            false
        }
    }

    /// The row of element `e` of template `t`.
    fn row(&self, t: TemplateId, e: ElemId) -> &'a Elem {
        self.seal.view(t).row(e)
    }

    /// A failure on element `e` of template `t`.
    fn fail(&self, t: TemplateId, e: ElemId, error: Error) -> Failure {
        let node = if e == ElemId::NONE {
            NodeId::NONE
        } else {
            self.row(t, e).node
        };
        Failure {
            error,
            node: (node != NodeId::NONE).then_some(node),
        }
    }

    /// What `src`, port `pi` of element `e` of template `t`, holds; with
    /// `check`, the shape checks too, which raise what the build would.
    fn source_type(
        &mut self,
        t: TemplateId,
        e: ElemId,
        pi: usize,
        src: &Source,
        check: bool,
    ) -> std::result::Result<PortType, Failure> {
        Ok(match src {
            Source::Leaf(leaf) => match leaf {
                Leaf::Given(_) | Leaf::Const(_) => PortType::Num,
                Leaf::GivenText(_) => PortType::Text,
                Leaf::GivenMath(_) => PortType::Math,
                Leaf::Scope(ScopeConst::IterIndex | ScopeConst::SequencePick { .. }) => {
                    PortType::Num
                }
                Leaf::Scope(ScopeConst::Seed(p)) => {
                    if check {
                        self.one_cell(t, e, *p, ArityOf::Prop(pi))?;
                    }
                    PortType::Math
                }
            },
            Source::Flow(flow) => match flow {
                // Credit, a number, a count.
                Flow::Aggregate(_) | Flow::VecOut(..) => PortType::Num,
                // Lowered to operators, or NaN: a number either way.
                Flow::Math(id) | Flow::MathValue(id) => {
                    if check {
                        self.check_leaves(t, e, *id)?;
                    }
                    PortType::Num
                }
                Flow::MathHandle(id, _) => {
                    if check {
                        self.check_leaves(t, e, *id)?;
                    }
                    if self.symbolic(t, *id)? {
                        PortType::Math
                    } else {
                        PortType::Num
                    }
                }
                Flow::SymExpr(id, _) => {
                    if check {
                        self.check_leaves(t, e, *id)?;
                    }
                    PortType::Math
                }
                Flow::Op(spec, args) => {
                    for a in args {
                        let ty = self.arg_type(t, e, pi, *a, check)?;
                        // A reference read by an operator is a number: text
                        // compares only through the planned `Eq` of own ports.
                        if check
                            && ty == PortType::Text
                            && let Arg::Ref(p, _) = a
                        {
                            return Err(self.fail(
                                t,
                                e,
                                Error::Unsupported(format!(
                                    "a text value (${}) used as a number",
                                    self.seal.plans.ref_display(self.seal.dast, *p)
                                )),
                            ));
                        }
                    }
                    match spec {
                        OpSpec::Sym(kind) if kind.makes_math() => PortType::Math,
                        _ => PortType::Num,
                    }
                }
                Flow::Alias(arg) => self.arg_type(t, e, pi, *arg, check)?,
            },
            Source::Specialize(_, first, rest) => self
                .source_type(t, e, pi, first, check)?
                .join(self.source_type(t, e, pi, rest, check)?),
        })
    }

    /// What an argument of port `pi` of element `e`'s plan reads; `pi`
    /// names the prop an arity error is about.
    fn arg_type(
        &mut self,
        t: TemplateId,
        e: ElemId,
        pi: usize,
        arg: Arg,
        check: bool,
    ) -> std::result::Result<PortType, Failure> {
        Ok(match arg {
            Arg::Const(_) => PortType::Num,
            Arg::Own(p) => self.port(t, e, p.index()),
            Arg::Elem(x, p) => self.port(t, x, p.index()),
            Arg::Ref(p, Sel::Whole) => {
                let cells = self.ref_cells(t, e, p, check)?;
                if check {
                    self.arity(t, e, &cells, 1, ArityOf::Prop(pi))?;
                }
                cells.types.first().copied().unwrap_or_default()
            }
            Arg::Ref(p, Sel::Coord(j)) => {
                let cells = self.ref_cells(t, e, p, check)?;
                if check {
                    self.arity(t, e, &cells, 2, ArityOf::Coords)?;
                }
                cells.types.get(j as usize).copied().unwrap_or_default()
            }
            // A list's points are numbers.
            Arg::Ref(_, Sel::Item(..)) => PortType::Num,
            // Port `k` of the element the path names: its type there.
            Arg::Ref(p, Sel::Port(k)) => {
                let Target { at, .. } = self.walk(t, p);
                let cands = match at {
                    Walk::Elems(cands) => cands,
                    Walk::Scope(templates) => self.single_components(&templates),
                    Walk::Points | Walk::Missing => Vec::new(),
                };
                cands.into_iter().fold(PortType::Num, |ty, (ct, ce)| {
                    ty.join(self.port(ct, ce, k as usize))
                })
            }
        })
    }

    /// Whether the handle of a `<math>` of template `t` with expression
    /// `id` is a math cell: its text has a free symbol, or a leaf that
    /// stands for an expression (`stands_for_expression`).
    fn symbolic(&mut self, t: TemplateId, id: ExprId) -> std::result::Result<bool, Failure> {
        let arena = &self.seal.plans.arena;
        let has_symbol = *self.has_symbol.entry(id).or_insert_with(|| {
            let mut syms = Vec::new();
            arena.symbols(id, &mut syms);
            !syms.is_empty()
        });
        if has_symbol {
            return Ok(true);
        }
        let mut leaves = Vec::new();
        arena.cell_leaves(id, &mut leaves);
        Ok(leaves.into_iter().any(|p| self.math_leaf(t, p)))
    }

    /// Whether the one cell reference `p` names inside math stands for an
    /// expression, so the leaf is a math leaf bound to that expression: a
    /// symbolic math's, math input's or
    /// function's `expr` or `value`, or an answer's or response's
    /// expression props when what it submits is one.
    fn math_leaf(&mut self, t: TemplateId, p: RefId) -> bool {
        let Ok(cells) = self.ref_cells(t, ElemId::NONE, p, false) else {
            return false;
        };
        if cells.types.len() != 1 {
            return false;
        }
        cells.at.iter().any(|&(ct, ce, pi)| {
            let ty = self.row(ct, ce).component_type;
            let Some(def) = ty.prop_defs().get(pi) else {
                return false;
            };
            let mut port_named = |name: &str| ty.prop_index(name).map(|i| self.port(ct, ce, i));
            let mut is_math = |name: &str| port_named(name) == Some(PortType::Math);
            match (ty, def.name) {
                (ComponentType::Answer, "response" | "correct" | "submitted") => {
                    is_math("submitted")
                }
                (ComponentType::Response, "submitted" | "value") => is_math("submitted"),
                (
                    ComponentType::Math
                    | ComponentType::MathInput
                    | ComponentType::Function
                    | ComponentType::Derivative,
                    "expr" | "value",
                ) => is_math("expr"),
                _ => false,
            }
        })
    }

    /// The leaves of math text `id` of element `e`, checked as the build
    /// binds them: each names one cell, and none is text.
    fn check_leaves(
        &mut self,
        t: TemplateId,
        e: ElemId,
        id: ExprId,
    ) -> std::result::Result<(), Failure> {
        let mut leaves = Vec::new();
        self.seal.plans.arena.cell_leaves(id, &mut leaves);
        for p in leaves {
            let ty = self.one_cell(t, e, p, ArityOf::MathLeaf)?;
            if ty == PortType::Text {
                return Err(self.fail(
                    t,
                    e,
                    Error::Unsupported(format!(
                        "a text value (${}) inside math",
                        self.seal.plans.ref_display(self.seal.dast, p)
                    )),
                ));
            }
        }
        Ok(())
    }

    /// The type of the one cell `p` names, checked to be one where the
    /// abstract build is sure to land.
    fn one_cell(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
        of: ArityOf,
    ) -> std::result::Result<PortType, Failure> {
        let cells = self.ref_cells(t, e, p, true)?;
        self.arity(t, e, &cells, 1, of)?;
        Ok(cells.types.first().copied().unwrap_or_default())
    }

    /// The build's arity check, where it is sure to apply: `cells` must
    /// hold `expected` cells (at least, for coordinates) of what element
    /// `e` reads.
    fn arity(
        &self,
        t: TemplateId,
        e: ElemId,
        cells: &Cells,
        expected: usize,
        of: ArityOf,
    ) -> std::result::Result<(), Failure> {
        let got = cells.types.len();
        let ok = match of {
            ArityOf::Coords => got >= 2,
            _ => got == expected,
        };
        if ok || !cells.lands || !cells.known {
            return Ok(());
        }
        let component_type = self.row(t, e).component_type;
        let error = match of {
            ArityOf::MathLeaf => Error::BadMath {
                text: self.seal.plans.ref_display(self.seal.dast, cells.plan),
                reason: "a reference inside math must name one cell".into(),
            },
            ArityOf::Coords => Error::ArityMismatch {
                component_type: component_type.tag().into(),
                prop: "coords".into(),
                expected: 2,
                got,
            },
            ArityOf::Prop(pi) => Error::ArityMismatch {
                component_type: component_type.tag().into(),
                prop: component_type
                    .prop_defs()
                    .get(pi)
                    .map(|d| d.name)
                    .unwrap_or("args")
                    .into(),
                expected,
                got,
            },
        };
        Err(self.fail(t, e, error))
    }

    /// The cells reference `p`, planned from template `t` and read by
    /// element `e`, names: their types (the join over the branches or
    /// candidates it may land on), and the ports they are when they are
    /// table props. With `check`, a whole pick's components are checked to
    /// hold one kind of value.
    fn ref_cells(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
        check: bool,
    ) -> std::result::Result<Cells, Failure> {
        let plan = &self.seal.plans.refs[p.index()];
        let Target { at, lands } = self.walk(t, p);
        let mut cells = Cells {
            plan: p,
            types: Vec::new(),
            at: Vec::new(),
            lands,
            known: true,
        };
        let cands: Vec<(TemplateId, ElemId)> = match at {
            Walk::Elems(cands) => cands,
            Walk::Scope(templates) => {
                let singles = self.single_components(&templates);
                // A whole pick of a select stands for every option's one
                // component, which must hold one kind of value.
                if check
                    && singles.len() > 1
                    && let Some(&(ct, ce)) = singles.first()
                {
                    let component_type = self.row(ct, ce).component_type;
                    if singles
                        .iter()
                        .all(|&(mt, me)| self.row(mt, me).component_type == component_type)
                    {
                        let what = format!("<{}>", component_type.tag());
                        self.members_agree(t, e, component_type, &singles, &what)?;
                    }
                }
                singles
            }
            Walk::Points => {
                // A synthesized point: numbers, as many as the prop has.
                let n = match plan.prop {
                    Some(rp) => rp.sel_on(ComponentType::Point),
                    None => ComponentType::Point.default_sel(),
                }
                .map_or(0, |sel| sel_len(sel, Some(0)).unwrap_or(0));
                cells.types = vec![PortType::Num; n];
                return Ok(cells);
            }
            Walk::Missing => {
                cells.lands = false;
                return Ok(cells);
            }
        };
        for (ct, ce) in cands {
            let ty = self.row(ct, ce).component_type;
            let sel = match plan.prop {
                Some(rp) => rp.sel_on(ty),
                None => ty.default_sel(),
            };
            let Some(sel) = sel else {
                // No such prop, or a table list as a whole: the build
                // refuses it by name; nothing here to type.
                cells.known = false;
                continue;
            };
            let n_points = self
                .seal
                .view(ct)
                .plan(ce)
                .n_public(ty)
                .map(|n| (n - ty.prop_defs().len()) / 2);
            let Some(len) = sel_len(sel, n_points) else {
                // As many as the referent has: known only when built.
                cells.known = false;
                continue;
            };
            if cells.types.len() < len {
                cells.types.resize(len, PortType::Num);
            }
            match sel {
                PropSel::At(PropAt::Position(i)) => {
                    cells.types[0] = cells.types[0].join(self.port(ct, ce, i));
                    cells.at.push((ct, ce, i));
                }
                PropSel::Parts { .. } => {
                    for (k, &i) in sel.parts().iter().enumerate() {
                        cells.types[k] = cells.types[k].join(self.port(ct, ce, i as usize));
                    }
                }
                // A list's points are numbers, which `Num` already says.
                PropSel::At(_) | PropSel::TableList => {}
            }
        }
        Ok(cells)
    }

    /// The one component each of `templates` holds at its root: what
    /// `$r[k]` or `$s[k]` names as a whole; none where a template holds
    /// several, which the build refuses as ambiguous.
    fn single_components(&self, templates: &[TemplateId]) -> Vec<(TemplateId, ElemId)> {
        let mut out = Vec::new();
        for &bt in templates {
            let roots: Vec<ElemId> = self
                .seal
                .view(bt)
                .children
                .iter()
                .filter_map(|c| match c {
                    Child::Elem(e) => Some(*e),
                    _ => None,
                })
                .collect();
            if let [one] = roots[..] {
                out.push((bt, one));
            }
        }
        out
    }

    /// Where reference `p`, planned from template `t`, lands, as far as
    /// the templates tell, over every iteration, item and branch at once.
    fn walk(&mut self, t: TemplateId, p: RefId) -> Target {
        let key = (t, p);
        if let Some((at, lands)) = self.walks.get(&key) {
            return Target {
                at: at.clone(),
                lands: *lands,
            };
        }
        let target = self.walk_uncached(t, p);
        self.walks.insert(key, (target.at.clone(), target.lands));
        target
    }

    fn walk_uncached(&mut self, t: TemplateId, p: RefId) -> Target {
        let plan = &self.seal.plans.refs[p.index()];
        let mut t = t;
        for _ in 0..plan.hops {
            let Some((pt, _)) = self.seal.templates[t.index()].parent else {
                return Target {
                    at: Walk::Missing,
                    lands: false,
                };
            };
            t = pt;
        }
        let mut cur = Walk::Scope(vec![t]);
        let mut lands = true;
        for step in &plan.steps {
            cur = match step {
                Step::Elem(e) => {
                    let cands: Vec<(TemplateId, ElemId)> = match cur {
                        Walk::Scope(ts) => ts.into_iter().map(|t| (t, *e)).collect(),
                        Walk::Elems(es) => es.into_iter().map(|(t, _)| (t, *e)).collect(),
                        Walk::Points | Walk::Missing => Vec::new(),
                    };
                    // A box, and what is under one, reads as undefined.
                    let cands: Vec<_> = cands
                        .into_iter()
                        .filter(|&(ct, ce)| {
                            let tpl = self.seal.view(ct);
                            !tpl.is_box(ce) && tpl.row(ce).component_type != ComponentType::Error
                        })
                        .collect();
                    if cands.is_empty() {
                        Walk::Missing
                    } else {
                        Walk::Elems(cands)
                    }
                }
                Step::Iter(_) | Step::Item(..) => {
                    let Walk::Elems(es) = cur else {
                        return Target {
                            at: Walk::Missing,
                            lands: false,
                        };
                    };
                    let mut scopes = Vec::new();
                    let mut elems = Vec::new();
                    let mut points = false;
                    // The step's kind says what the index walks (ADR
                    // 0032, decision 5); planning made it from the row.
                    for (ct, ce) in es {
                        let row = self.row(ct, ce);
                        match (step, &row.body) {
                            (Step::Iter(_), Body::Repeat { template }) => scopes.push(*template),
                            (Step::Item(Collection::Picks, _), Body::Choice(cid)) => {
                                scopes.extend(
                                    self.seal.choices[cid.index()].branches.iter().copied(),
                                );
                            }
                            (
                                Step::Item(Collection::Gathered, _),
                                Body::Collect { component_type },
                            ) => {
                                let (items, varies) = self.collected(ct, ce, *component_type);
                                lands &= varies;
                                elems.extend(items);
                            }
                            (Step::Item(Collection::ListPoints, _), _) => {
                                points = true;
                                lands = false;
                            }
                            _ => {}
                        }
                    }
                    if !scopes.is_empty() {
                        Walk::Scope(scopes)
                    } else if !elems.is_empty() {
                        Walk::Elems(elems)
                    } else if points {
                        Walk::Points
                    } else {
                        Walk::Missing
                    }
                }
                Step::Iface(cid, id) => {
                    let name = self.seal.names.text(*id);
                    let iface = &self.seal.choice_seals[cid.index()].iface;
                    let def = &self.seal.choices[cid.index()];
                    match iface.get(name) {
                        Some((_, elems)) => Walk::Elems(
                            def.branches
                                .iter()
                                .copied()
                                .zip(elems.iter().copied())
                                .collect(),
                        ),
                        None => Walk::Missing,
                    }
                }
            };
        }
        Target { at: cur, lands }
    }

    /// The elements collect `e` of template `t` gathers, as far as the
    /// templates tell: the elements of `component_type` under what it
    /// gathers from, not recursing into a match; and whether any sits in a
    /// repeat's body.
    fn collected(&mut self, t: TemplateId, e: ElemId, component_type: ComponentType) -> Collected {
        let key = (t, e);
        if let Some(found) = self.collects.get(&key) {
            return found.clone();
        }
        let found = self.collected_uncached(t, e, component_type);
        self.collects.insert(key, found.clone());
        found
    }

    fn collected_uncached(
        &mut self,
        t: TemplateId,
        e: ElemId,
        component_type: ComponentType,
    ) -> Collected {
        let mut out = Vec::new();
        let mut varies = false;
        let Some(from) = self.seal.view(t).plan(e).from else {
            return (out, varies);
        };
        let Target { at, .. } = self.walk(t, from);
        let mut seen = HashSet::new();
        let roots: Vec<(TemplateId, Option<ElemId>, bool)> = match at {
            Walk::Elems(es) => es.into_iter().map(|(t, e)| (t, Some(e), false)).collect(),
            Walk::Scope(ts) => ts.into_iter().map(|t| (t, None, true)).collect(),
            Walk::Points | Walk::Missing => Vec::new(),
        };
        for (rt, re, in_repeat) in roots {
            self.gather(
                rt,
                re,
                component_type,
                in_repeat,
                &mut out,
                &mut varies,
                &mut seen,
            );
        }
        (out, varies)
    }

    /// `collected`'s walk under element `e` of template `t` (the template's
    /// own children when `e` is None).
    #[allow(clippy::too_many_arguments)]
    fn gather(
        &mut self,
        t: TemplateId,
        e: Option<ElemId>,
        component_type: ComponentType,
        in_repeat: bool,
        out: &mut Vec<(TemplateId, ElemId)>,
        varies: &mut bool,
        seen: &mut HashSet<(TemplateId, ElemId)>,
    ) {
        if let Some(e) = e
            && !seen.insert((t, e))
        {
            return;
        }
        let tpl = self.seal.view(t);
        let children = match e {
            Some(e) => &tpl.row(e).children,
            None => &tpl.children,
        };
        for child in children {
            match child {
                Child::Elem(k) => {
                    let k = *k;
                    if tpl.is_box(k) {
                        continue;
                    }
                    let row = tpl.row(k);
                    if row.component_type == component_type {
                        out.push((t, k));
                        *varies |= in_repeat;
                        continue;
                    }
                    match row.body {
                        Body::Repeat { template } => {
                            self.gather(template, None, component_type, true, out, varies, seen);
                        }
                        Body::Choice(cid) => {
                            for &b in &self.seal.choices[cid.index()].branches {
                                self.gather(b, None, component_type, in_repeat, out, varies, seen);
                            }
                        }
                        Body::Collect { component_type: ct } => {
                            // Its children are copies of what it gathered.
                            if ct == component_type && seen.insert((t, k)) {
                                let (items, v) = self.collected(t, k, ct);
                                *varies |= v;
                                out.extend(items);
                            }
                        }
                        Body::Plain => {
                            self.gather(t, Some(k), component_type, in_repeat, out, varies, seen);
                        }
                    }
                }
                // A `$ref` child is a copy of what it names when that is a
                // component of the type, with the original's ports.
                Child::Macro(id) => {
                    if let RefChildPlan::Ref(p) = tpl.tables.ref_child_plans[id.index()]
                        && self.seal.plans.refs[p.index()].prop.is_none()
                        && let Walk::Elems(es) = self.walk(t, p).at
                    {
                        for (ct, ce) in es {
                            if self.row(ct, ce).component_type == component_type {
                                out.push((ct, ce));
                                *varies |= in_repeat;
                            }
                        }
                    }
                }
                Child::Text(_) => {}
            }
        }
    }

    /// Every interface name a reference uses holds one kind of value per
    /// prop in every branch, and so does the one component of every option
    /// a whole pick names.
    fn check_interfaces(&mut self) -> std::result::Result<(), Failure> {
        for (ci, def) in self.seal.choices.iter().enumerate() {
            let (t, e) = def.at;
            if self.seal.view(t).is_box(e) {
                continue;
            }
            let seal = &self.seal.choice_seals[ci];
            for name in &seal.used {
                let Some((component_type, elems)) = seal.iface.get(name) else {
                    continue;
                };
                let members: Vec<(TemplateId, ElemId)> = def
                    .branches
                    .iter()
                    .copied()
                    .zip(elems.iter().copied())
                    .collect();
                self.members_agree(t, e, *component_type, &members, &format!("'{name}'"))?;
            }
        }
        Ok(())
    }

    /// `members`, the components an interface name or a whole pick stands
    /// for, hold one kind of value per prop: text in every branch or in
    /// none. A math cell and a number join to a math cell.
    fn members_agree(
        &mut self,
        t: TemplateId,
        e: ElemId,
        component_type: ComponentType,
        members: &[(TemplateId, ElemId)],
        what: &str,
    ) -> std::result::Result<(), Failure> {
        let n_public = |&(mt, me): &(TemplateId, ElemId)| {
            self.seal
                .view(mt)
                .plan(me)
                .n_public(component_type)
                .unwrap_or(component_type.prop_defs().len())
        };
        let n = members.iter().map(n_public).max().unwrap_or(0);
        for pi in 0..n {
            let kinds: Vec<PortType> = members
                .iter()
                .map(|m| {
                    if pi < n_public(m) {
                        self.port(m.0, m.1, pi)
                    } else {
                        PortType::Num
                    }
                })
                .collect();
            let text = kinds.iter().filter(|&&k| k == PortType::Text).count();
            if text != 0 && text != kinds.len() {
                return Err(self.fail(
                    t,
                    e,
                    Error::Unsupported(format!(
                        "{what} holds a different kind of value (number, text or math) in different branches: its '{}' must be the same kind in each",
                        component_type.prop_name(n, pi).unwrap_or_default()
                    )),
                ));
            }
        }
        Ok(())
    }
}

/// What a collect gathers (`Types::collected`): the elements, and whether
/// any sits in a repeat's body.
type Collected = (Vec<(TemplateId, ElemId)>, bool);

/// What a reference's shape is checked for.
#[derive(Clone, Copy)]
enum ArityOf {
    /// The prop at this port of the element reads it as one cell.
    Prop(usize),
    /// A point's coordinates.
    Coords,
    /// A leaf inside math.
    MathLeaf,
}

/// The cells a reference names.
struct Cells {
    plan: RefId,
    /// Their types, in order; as many as the most candidate has.
    types: Vec<PortType>,
    /// Each candidate's table port when the reference names one.
    at: Vec<(TemplateId, ElemId, usize)>,
    /// Whether the abstract build is sure to land on a component.
    lands: bool,
    /// Whether every candidate's cell count is known to the compile.
    known: bool,
}

/// How many cells `sel` is, given how many points the element's list holds
/// (`None` when only a build knows).
fn sel_len(sel: PropSel, n_points: Option<usize>) -> Option<usize> {
    Some(match sel {
        PropSel::At(PropAt::Position(_)) | PropSel::At(PropAt::Coord(..)) => 1,
        PropSel::At(PropAt::Item(_)) => 2,
        PropSel::At(PropAt::List) => 2 * n_points?,
        PropSel::Parts { len, .. } => len as usize,
        // Not slots: the build refuses it by name.
        PropSel::TableList => 0,
    })
}

//! Reading a record from another template: an extend whose referent sits
//! in another template (`<point extend="$r[2].P" y="5"/>`) rebases each of
//! the referent's references through the path the extend names, so a `$v`
//! in the referent's attribute means what it means at the referent, in the
//! iteration the path names.

use crate::compile::*;

/// Rewrites a record read through an extend's `path`: each reference in
/// it composed with the path (`rebase_ref`), each math text's references
/// too (`rebase_expr`).
pub(in crate::compile) struct Rebaser<'r, 'a> {
    rd: Reader<'a>,
    ar: &'r mut Arenas,
    path: RefId,
    /// How many templates the path enters.
    down: u32,
}

impl Rebaser<'_, '_> {
    pub(in crate::compile) fn reference(&mut self, p: &mut RefId) {
        *p = self.rd.rebase_ref(self.ar, self.path, self.down, *p);
    }

    pub(in crate::compile) fn expr(&mut self, id: &mut ExprId) {
        *id = self.rd.rebase_expr(self.ar, self.path, self.down, *id);
    }
}

/// Reading the source, a record from another template: the referent's
/// references rebased through the path an extend names. Run by planning, for an
/// extend whose referent is in another template.
impl<'a> Reader<'a> {
    /// Record `record`, the referent's, as read from the template the
    /// extend `path` is planned from: every reference in it composed with
    /// `path` (`rebase_ref`), every math text's references too.
    pub(in crate::compile) fn rebase_record(
        &self,
        ar: &mut Arenas,
        path: RefId,
        mut record: record::Record,
    ) -> record::Record {
        let down = self.levels_entered(ar, path);
        let mut rw = Rebaser {
            rd: *self,
            ar,
            path,
            down,
        };
        record.rebase(&mut rw);
        record
    }

    /// How many templates the steps of `path` enter: an index into a
    /// repeat or a select, an interface name into a branch.
    fn levels_entered(&self, ar: &Arenas, path: RefId) -> u32 {
        let plan = &ar.refs[path.index()];
        plan.steps.iter().filter(|s| enters_template(s)).count() as u32
    }

    /// Plan `inner`, planned from the referent's template `down` levels
    /// below the template `path` reaches after its hops, as a plan from
    /// the template `path` is planned from: the path to the template
    /// `inner`'s hops reach, then `inner`'s steps, with an iteration index
    /// `inner` names by hops named as the path names it.
    pub(in crate::compile) fn rebase_ref(
        &self,
        ar: &mut Arenas,
        path: RefId,
        down: u32,
        inner: RefId,
    ) -> RefId {
        let path_plan = ar.refs[path.index()].clone();
        let inner_plan = ar.refs[inner.index()].clone();
        let (hops, mut steps) = if inner_plan.hops >= down {
            (path_plan.hops + inner_plan.hops - down, Vec::new())
        } else {
            // The path's steps up to the one entering the level `inner`
            // is rooted at.
            let want = down - inner_plan.hops;
            let mut entered = 0;
            let mut prefix = Vec::new();
            for step in &path_plan.steps {
                prefix.push(step.clone());
                if enters_template(step) {
                    entered += 1;
                    if entered == want {
                        break;
                    }
                }
            }
            (path_plan.hops, prefix)
        };
        // An iteration index in `inner`'s own indices: `k` templates up
        // from the referent is a level the path entered, whose index the
        // path's step gives, or above the path's start.
        let index_at_level = |level: u32| -> Option<IndexPlan> {
            let mut entered = 0;
            for step in &path_plan.steps {
                if let Step::Iter(ip) | Step::Item(Collection::Picks, ip) = step {
                    entered += 1;
                    if entered == level {
                        return Some(ip.clone());
                    }
                } else if let Step::Iface(..) = step {
                    entered += 1;
                }
            }
            None
        };
        for step in &inner_plan.steps {
            steps.push(match step {
                Step::Iter(ip) | Step::Item(_, ip) => {
                    let mut terms = Vec::new();
                    for term in &ip.terms {
                        match term {
                            IndexTerm::Const(k) => terms.push(IndexTerm::Const(*k)),
                            IndexTerm::Iter(k) if *k < down => {
                                match index_at_level(down - *k) {
                                    Some(at) => terms.extend(at.terms),
                                    // A level entered by a branch has no
                                    // iteration: the index names nothing.
                                    None => terms.push(IndexTerm::Const(0)),
                                }
                            }
                            IndexTerm::Iter(k) => {
                                terms.push(IndexTerm::Iter(path_plan.hops + *k - down))
                            }
                            // The cell is read from where the referent sits.
                            IndexTerm::Cell(p) => {
                                terms.push(IndexTerm::Cell(self.rebase_ref(ar, path, down, *p)))
                            }
                        }
                    }
                    let ip = IndexPlan { terms };
                    match step {
                        Step::Iter(_) => Step::Iter(ip),
                        Step::Item(c, _) => Step::Item(*c, ip),
                        _ => unreachable!(),
                    }
                }
                other => other.clone(),
            });
        }
        let plan = RefPlan {
            hops,
            steps,
            prop: inner_plan.prop,
            display: RefDisplay::Spelled(
                format!(
                    "{} (of {})",
                    display_of(self.dast, &inner_plan),
                    display_of(self.dast, &path_plan)
                )
                .into(),
            ),
            node: inner_plan.node,
        };
        ar.push_ref(plan)
    }

    /// Expression `id`, its cell leaves rebased (`rebase_ref`), as a new
    /// expression; its symbolic text, when it has one, rebased with it.
    fn rebase_expr(&self, ar: &mut Arenas, path: RefId, down: u32, id: ExprId) -> ExprId {
        let e = ar.arena.get(id).clone();
        let out = match e {
            Expr::Num(v) => Expr::Num(v),
            Expr::Sym(s) => Expr::Sym(s),
            Expr::Cell(p) => Expr::Cell(self.rebase_ref(ar, path, down, p)),
            Expr::Neg(a) => {
                let a = self.rebase_expr(ar, path, down, a);
                Expr::Neg(a)
            }
            Expr::Call(f, args) => {
                let args = args
                    .into_iter()
                    .map(|a| self.rebase_expr(ar, path, down, a))
                    .collect();
                Expr::Call(f, args)
            }
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => {
                let (na, nb) = (
                    self.rebase_expr(ar, path, down, a),
                    self.rebase_expr(ar, path, down, b),
                );
                e.with_operands(na, nb)
            }
        };
        let new = ar.arena.push(out);
        if let Some(text) = ar.sym_text.get(&id).cloned() {
            let text = match text {
                SymText::Nodes { nodes, plans } => SymText::Nodes {
                    nodes,
                    plans: plans
                        .iter()
                        .map(|&p| self.rebase_ref(ar, path, down, p))
                        .collect(),
                },
                SymText::Leaf(p) => SymText::Leaf(self.rebase_ref(ar, path, down, p)),
                SymText::Spelled(s) => SymText::Spelled(s),
            };
            ar.sym_text.insert(new, text);
        }
        new
    }
}

/// Whether a step enters another template: an index into a repeat or a
/// select's picks, an interface name into a branch. A gathered item or a
/// list's point stays in the template.
fn enters_template(step: &Step) -> bool {
    matches!(
        step,
        Step::Iter(_) | Step::Item(Collection::Picks, _) | Step::Iface(..)
    )
}

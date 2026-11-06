//! Math in the template graph, as the abstract build stamps it
//! (`build/expand/math.rs`): an expression instantiated per template, its
//! leaves the nodes they name, shared by class within a template for an
//! element no hold makes its own (ADR 0033); numeric math lowered to
//! operator nodes, once per node of the instantiated expression; symbolic
//! math a template over its leaves.

use super::*;
use crate::compile::expr::Func;

impl<'c> Stamp<'c> {
    /// Instantiate expression `id` of the plans in template `t`: each
    /// reference leaf a leaf node reading what it names.
    pub(super) fn instantiate(&mut self, id: ExprId, t: TemplateId) -> ExprId {
        let class = self
            .share_math
            .then(|| (self.c.plans.expr_class[id.index()], t));
        if let Some(key) = class
            && let Some(&done) = self.instantiated.get(&key)
        {
            return done;
        }
        let e = self.c.plans.arena.get(id).clone();
        let out = match e {
            Expr::Num(v) => Expr::Num(v),
            Expr::Sym(s) => Expr::Sym(s),
            Expr::Cell(plan) => {
                let (target, label) = self.math_ref(plan, t);
                Expr::Cell(self.leaf(target, t, &label))
            }
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => {
                let (a, b) = (self.instantiate(a, t), self.instantiate(b, t));
                e.with_operands(a, b)
            }
            Expr::Neg(a) => Expr::Neg(self.instantiate(a, t)),
            Expr::Call(f, args) => Expr::Call(
                f,
                args.into_iter().map(|a| self.instantiate(a, t)).collect(),
            ),
        };
        let done = self.x.push(out);
        if let Some(key) = class {
            self.instantiated.insert(key, done);
        }
        done
    }

    /// The node a reference inside math names, and the reference's label:
    /// one cell, and not text, else a failure (the missing value stands
    /// in).
    fn math_ref(&mut self, p: RefId, t: TemplateId) -> (GraphNode, Label) {
        let (nodes, label) = self.resolve_ref(p, t, Some(1));
        let target = match nodes[..] {
            [one] => self.or_missing(one),
            _ => {
                self.fail(Error::BadMath {
                    text: self.c.ref_display(p),
                    reason: "a reference inside math must name one cell".into(),
                });
                self.or_missing(None)
            }
        };
        if self.value_type(target) == PortType::Text {
            self.fail(Error::Unsupported(format!(
                "a text value (${}) inside math",
                self.c.ref_display(p)
            )));
        }
        (target, label)
    }

    /// The node standing for a reference leaf inside math, made in
    /// template `t`: an alias of `target`, so the read can carry the
    /// reference's label.
    fn leaf(&mut self, target: GraphNode, t: TemplateId, label: &[Coord]) -> GraphNode {
        let leaf = self.value(t, Def::Alias(target));
        self.label(leaf, target, label);
        leaf
    }

    /// Lower numeric expression `id` of `x` to operator nodes in template
    /// `t`. A literal is a shared constant, and goes second where the
    /// operator allows; `k - b` is `-b + k`, so a request reaches `b`.
    pub(super) fn lower(&mut self, id: ExprId, t: TemplateId) -> GraphNode {
        let num = |x: &Arena<GraphNode>, e: ExprId| match x.get(e) {
            Expr::Num(v) => Some(*v),
            _ => None,
        };
        let e = self.x.get(id).clone();
        match e {
            Expr::Num(v) => self.constant(v),
            Expr::Cell(n) => n,
            Expr::Sym(_) => unreachable!("lowering a symbolic expression"),
            Expr::Neg(a) => {
                let a = self.lower_shared(a, t);
                self.math_op(OpSpec::Negate, vec![a], t)
            }
            Expr::Add(a, b) | Expr::Mul(a, b) => {
                let spec = match e {
                    Expr::Add(..) => OpSpec::Add,
                    _ => OpSpec::Mul,
                };
                let (a, b) = match num(&self.x, a) {
                    Some(_) if num(&self.x, b).is_none() => (b, a),
                    _ => (a, b),
                };
                let (a, b) = (self.lower_shared(a, t), self.lower_shared(b, t));
                self.math_op(spec, vec![a, b], t)
            }
            Expr::Sub(a, b) if num(&self.x, a).is_some() && num(&self.x, b).is_none() => {
                let (k, b) = (self.lower_shared(a, t), self.lower_shared(b, t));
                let nb = self.math_op(OpSpec::Negate, vec![b], t);
                self.math_op(OpSpec::Add, vec![nb, k], t)
            }
            Expr::Sub(a, b) | Expr::Div(a, b) | Expr::Pow(a, b) => {
                let spec = match e {
                    Expr::Sub(..) => OpSpec::Sub,
                    Expr::Div(..) => OpSpec::Div,
                    _ => OpSpec::Pow,
                };
                let (a, b) = (self.lower_shared(a, t), self.lower_shared(b, t));
                self.math_op(spec, vec![a, b], t)
            }
            Expr::Call(f, args) => {
                let mut xs: Vec<GraphNode> =
                    args.iter().map(|&a| self.lower_shared(a, t)).collect();
                match f {
                    Func::Round => self.math_op(OpSpec::Round, xs, t),
                    Func::Floor => self.math_op(OpSpec::Floor, xs, t),
                    Func::Clamp => self.math_op(OpSpec::Vec(VecOp::Clamp), xs, t),
                    // More than two arguments fold from the left.
                    Func::Min | Func::Max => {
                        let spec = if f == Func::Min {
                            OpSpec::Min
                        } else {
                            OpSpec::Max
                        };
                        let first = xs.remove(0);
                        xs.into_iter()
                            .fold(first, |acc, x| self.math_op(spec, vec![acc, x], t))
                    }
                }
            }
        }
    }

    /// `lower`, once per node of `x`.
    fn lower_shared(&mut self, id: ExprId, t: TemplateId) -> GraphNode {
        if let Some(&n) = self.lowered.get(id.index())
            && !n.is_none()
        {
            return n;
        }
        let n = self.lower(id, t);
        if self.lowered.len() <= id.index() {
            self.lowered.resize(id.index() + 1, GraphNode::NONE);
        }
        self.lowered[id.index()] = n;
        n
    }

    /// An operator node lowered from the author's math: a binary one is
    /// listed for orientation.
    fn math_op(&mut self, spec: OpSpec, inputs: Vec<GraphNode>, t: TemplateId) -> GraphNode {
        let binary = inputs.len() == 2;
        let n = self.op(t, spec, inputs);
        if binary {
            self.g.author_ops.push(n);
        }
        n
    }

    /// A math cell from math text `id`, read from template `t`: a constant
    /// handle without cell leaves, an alias of the leaf when the text is
    /// one math leaf and nothing else, else a template over its leaves, a
    /// leaf node per occurrence, each reading what it names or the
    /// expression it stands for.
    pub(super) fn sym_source(&mut self, id: ExprId, post: Post, t: TemplateId) -> Def {
        self.check_sym_text(id);
        let mut plans = Vec::new();
        occurrences(&self.c.plans.arena, id, &mut plans);
        if plans.is_empty() {
            self.origin = Some(MathOrigin::Constant(id, post));
            return Def::Const(None);
        }
        let mut leaves = Vec::with_capacity(plans.len());
        let mut math = Vec::with_capacity(plans.len());
        for &p in &plans {
            let (target, label) = self.math_ref(p, t);
            let (target, is_math) = match self.math_target(target) {
                Some(m) => (m, true),
                None => (target, false),
            };
            math.push(is_math);
            leaves.push(self.leaf(target, t, &label));
        }
        if let (Expr::Cell(_), Post::None, [true]) = (self.c.plans.arena.get(id), post, &math[..]) {
            return Def::Alias(leaves[0]);
        }
        if leaves.len() > crate::limits::MAX_REFERENCES {
            self.fail(Error::BadMath {
                text: self.sym_text(id),
                reason: format!("more than {} references", crate::limits::MAX_REFERENCES),
            });
        }
        let template = self.g.templates.len() as u32;
        self.g.templates.push(TemplateOp {
            expr: id,
            post,
            math,
        });
        Def::Op(GraphOp::Template(template), leaves)
    }
}

impl Stamp<'_> {
    /// Math text `id` as spelled.
    fn sym_text(&self, id: ExprId) -> String {
        self.c.plans.sym_text[&id].spell(self.c.dast)
    }

    /// Whether math text `id` is math a build can make, as every build
    /// checks it: recorded, with no numeric-only function, and parsed (or
    /// a constant all the same).
    fn check_sym_text(&mut self, id: ExprId) {
        let c = self.c;
        let Some(sym) = c.plans.sym_text.get(&id) else {
            self.fail(Error::BadMath {
                text: format!("{:?}", c.plans.arena.get(id)),
                reason: "no math text recorded".into(),
            });
            return;
        };
        if self.failure.is_some() {
            return;
        }
        let text = sym.spell(c.dast);
        if c.plans.arena.has_call(id) {
            self.fail(Error::BadMath {
                text,
                reason: "round, floor, min, max and clamp are for numeric math only".into(),
            });
            return;
        }
        let engine = self.engine.get_or_insert_with(crate::sym::Engine::new);
        let parsed;
        let tree = if let Some(cached) = c.plans.sym_trees.get(&id) {
            cached.get_or_init(|| engine.parse_tree(&text))
        } else {
            parsed = engine.parse_tree::<RefId>(&text);
            &parsed
        };
        if let Err(reason) = tree
            && engine.parse_constant(&text).is_err()
        {
            let reason = reason.clone();
            self.fail(Error::BadMath { text, reason });
        }
    }
}

/// Every reference leaf of expression `id`, in order, once per occurrence.
fn occurrences(arena: &Arena<RefId>, id: ExprId, out: &mut Vec<RefId>) {
    match arena.get(id) {
        Expr::Cell(p) => out.push(*p),
        Expr::Num(_) | Expr::Sym(_) => {}
        Expr::Add(a, b) | Expr::Sub(a, b) | Expr::Mul(a, b) | Expr::Div(a, b) | Expr::Pow(a, b) => {
            occurrences(arena, *a, out);
            occurrences(arena, *b, out);
        }
        Expr::Neg(a) => occurrences(arena, *a, out),
        Expr::Call(_, args) => {
            for &a in args {
                occurrences(arena, a, out);
            }
        }
    }
}

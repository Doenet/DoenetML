//! Math at expansion: a math's source per instance, numeric (lowered to
//! operators over slots) or symbolic (an `Instantiate` over its leaves),
//! and whether a component's `expr` is a math cell at all.

use super::*;

/// Expand, math: a math's source per instance, numeric (lowered to operators
/// over slots) or symbolic (an `Instantiate` over its leaves).
impl<'c> Builder<'c> {
    /// A math cell from a template's math text: a constant handle when it has
    /// no cell leaves, an alias when it is one math leaf and nothing else,
    /// else an `Instantiate` over its leaves (each a number or a math cell).
    pub(in crate::build) fn sym_source(
        &mut self,
        expr: ExprId,
        post: Post,
        scope: ScopeId,
    ) -> Result<BuiltSource> {
        let compiled = self.compiled;
        let sym = compiled
            .plans
            .sym_text
            .get(&expr)
            .ok_or_else(|| Error::BadMath {
                text: format!("{:?}", self.compiled.plans.arena.get(expr)),
                reason: "no math text recorded".into(),
            })?;
        // Spelled only to parse once, or for an error.
        let text = || sym.spell(compiled.dast);
        if compiled.plans.arena.has_call(expr) {
            return Err(Error::BadMath {
                text: text(),
                reason: "round, floor, min, max and clamp are for numeric math only".into(),
            });
        }
        // A constant expression is the same in every instance and every
        // build: made once per load (ADR 0028).
        let constant = (expr, post);
        if let Some(&h) = self.math_constants.get(&constant) {
            return Ok(BuiltSource::Const(h.to_value()));
        }
        let parsed;
        let tree = if let Some(cached) = compiled.plans.sym_trees.get(&expr) {
            cached.get_or_init(|| self.engine.parse_tree(&text()))
        } else {
            parsed = self.engine.parse_tree(&text());
            &parsed
        };
        let tree = match tree {
            Ok(tree) => tree,
            // A relation, tuple or multi-argument function with no cell
            // leaves is a constant expression all the same (a `<boolean>`
            // comparing `(a, b)` with `(a, b)`).
            Err(reason) => match self.engine.parse_constant(&text()) {
                Ok(h) => return Ok(self.math_constant(constant, h)),
                Err(_) => {
                    return Err(Error::BadMath {
                        text: text(),
                        reason: reason.clone(),
                    });
                }
            },
        };
        let mut leaves = Vec::new();
        let tree = self.bind_leaves(tree, scope, &mut leaves)?;
        if leaves.is_empty() {
            let h = self.engine.import(&tree);
            return Ok(self.math_constant(constant, h));
        }
        if let (Tree::Cell { cell, math: true }, Post::None) = (&tree, post) {
            return Ok(BuiltSource::Alias(*cell));
        }
        let template = SymTemplateId::from_index(self.sym_templates.len());
        self.sym_templates.push(tree);
        if leaves.len() > crate::limits::MAX_REFERENCES {
            return Err(Error::BadMath {
                text: text(),
                reason: format!("more than {} references", crate::limits::MAX_REFERENCES),
            });
        }
        Ok(self.planned_source(PlannedOp::Template { template, post }, &leaves))
    }

    /// Constant expression `constant` as imported (`h`), its post applied
    /// and kept for every later instance and build.
    fn math_constant(&mut self, constant: (ExprId, Post), h: crate::sym::Handle) -> BuiltSource {
        let h = self.post(h, constant.1);
        self.math_constants.insert(constant, h);
        BuiltSource::Const(h.to_value())
    }

    /// `post` applied to a constant expression at build time.
    fn post(&mut self, h: crate::sym::Handle, post: Post) -> crate::sym::Handle {
        match post {
            Post::None => h,
            Post::Simplify => self.engine.simplify(h),
            Post::Expand => self.engine.expand(h),
            Post::SimplifyExpand => {
                let h = self.engine.simplify(h);
                self.engine.expand(h)
            }
        }
    }

    /// Rebind a parsed template's `cellN<plan>` leaves to slots: a math leaf
    /// where the reference names an expression, else a numeric leaf.
    /// Distinct leaf slots are appended to `leaves`.
    fn bind_leaves(
        &mut self,
        t: &Tree<RefId>,
        scope: ScopeId,
        leaves: &mut Vec<SlotId>,
    ) -> Result<Tree<SlotId>> {
        t.try_map_leaves(&mut |plan, _| {
            let (slot, math) = self.leaf_slot(plan, scope)?;
            if !leaves.contains(&slot) {
                leaves.push(slot);
            }
            Ok((slot, math))
        })
    }

    /// The slot a `$ref` inside math names, and whether it holds an
    /// expression (then the slot is the referent's math cell).
    fn leaf_slot(&mut self, plan: RefId, scope: ScopeId) -> Result<(SlotId, bool)> {
        let slot = self.math_ref(plan, scope)?;
        Ok(match self.math_target(slot) {
            Some(m) => (m, true),
            None => (slot, false),
        })
    }

    /// The slot a `$ref` inside math names (one cell, and not a string id).
    fn math_ref(&mut self, plan: RefId, scope: ScopeId) -> Result<SlotId> {
        let slot = self.resolve_one(plan, scope).map_err(|e| match e {
            Error::ArityMismatch { .. } => Error::BadMath {
                text: self.compiled.ref_display(plan),
                reason: "a reference inside math must name one cell".into(),
            },
            other => other,
        })?;
        if self.value_type(slot) == ValueType::Text {
            let display = self.compiled.ref_display(plan);
            return Err(Error::Unsupported(format!(
                "a text value (${display}) inside math"
            )));
        }
        Ok(slot)
    }

    /// When `slot` is a prop that stands for an expression (a symbolic
    /// math's `expr` or `value`, a function, a math answer's props), the
    /// slot of that expression: where its type says ([`ExprOf`](crate::components::ExprOf)), when the
    /// slot it names holds math. An answer's response is one only when
    /// what it submits is (not for a choice or a text answer); a response's
    /// `submitted` unless its input is a boolean input (`add_response`).
    fn math_target(&mut self, slot: SlotId) -> Option<SlotId> {
        let comp = self.slot_comp[slot.index()];
        if comp == CompIdx::NONE {
            return None;
        }
        let pi = slot.index() - self.slot_base[comp.index()].index();
        let crate::components::ExprOf { at, when } =
            self.components.component_type[comp.index()].expr_of(pi)?;
        let when = usize::from(when);
        (when < self.slots().n_public(comp)
            && self.value_type(self.slot(comp, when)) == ValueType::Math)
            .then(|| self.slot(comp, usize::from(at)))
    }

    /// What the cell of `slot` will hold: its template port's type, read
    /// through the aliases of a component the build made; an interface's
    /// stand-in holds what its branches' components hold.
    pub(in crate::build) fn value_type(&self, slot: SlotId) -> ValueType {
        self.value_type_within(slot, 32)
    }

    fn value_type_within(&self, slot: SlotId, depth: u32) -> ValueType {
        if depth == 0 {
            return ValueType::Number;
        }
        if let Some((t, ts)) = self.slots().template_slot(slot) {
            return self.compiled.plans.port_type(t.index(), ts).value_type();
        }
        if let BuiltSource::Alias(t) = self.sources[slot.index()] {
            return self.value_type_within(t, depth - 1);
        }
        // A choose holds what its branches hold: text or math when one
        // does (`$tl[$k]`, `$r[$k].t`; ADR 0041).
        if let BuiltSource::Op(PlannedOp::Spec(OpSpec::Vec(VecOp::Choose { n })), start, _) =
            &self.sources[slot.index()]
        {
            let start = start.index() + 1;
            let mut kind = ValueType::Number;
            for &t in &self.op_inputs[start..start + *n as usize] {
                match self.value_type_within(t, depth - 1) {
                    ValueType::Number => {}
                    k => kind = k,
                }
            }
            return kind;
        }
        let comp = self.slot_comp[slot.index()];
        if comp == CompIdx::NONE {
            return ValueType::Number;
        }
        // A stand-in holds what any branch may: text or math when one
        // does (their kinds agree, checked when compiled).
        let Some(members) = self.stand_ins.get(&comp) else {
            return ValueType::Number;
        };
        let pi = slot.get() - self.slot_base[comp.index()].get();
        let mut kind = ValueType::Number;
        for &m in members {
            if (pi as usize) < self.slots().n_public(m) {
                let t = self.slot_base[m.index()].offset(pi as usize);
                match self.value_type_within(t, depth - 1) {
                    ValueType::Number => {}
                    k => kind = k,
                }
            }
        }
        kind
    }

    /// Whether a component's `expr` is a math cell: its port's type is
    /// `Math`, for a function, an unbound mathInput, a math with a free
    /// symbol or a reference to an expression, and for a copy or a stand-in
    /// of one.
    pub(in crate::build) fn is_symbolic(&self, comp: CompIdx) -> bool {
        let component_type = self.components.component_type[comp.index()];
        match component_type.prop_index("expr") {
            Some(pi) if pi < self.slots().n_public(comp) => {
                self.value_type(self.slot(comp, pi)) == ValueType::Math
            }
            _ => false,
        }
    }

    /// Copy an expression template into the document's arena with its plan
    /// leaves resolved to slots in `scope`.
    pub(in crate::build) fn instantiate_expr(
        &mut self,
        id: ExprId,
        scope: ScopeId,
    ) -> Result<ExprId> {
        // Equal math is one class (ADR 0033, `Plans::expr_class`): a
        // class is instantiated once per scope, for an element no hold
        // makes its own (`share_math`).
        let class = self
            .share_math
            .then(|| (self.compiled.plans.expr_class[id.index()], scope));
        if let Some(key) = class
            && let Some(&done) = self.instantiated.get(&key)
        {
            return Ok(done);
        }
        let e = self.compiled.plans.arena.get(id).clone();
        let out = match e {
            Expr::Num(v) => Expr::Num(v),
            Expr::Sym(s) => Expr::Sym(s),
            Expr::Cell(plan) => Expr::Cell(self.math_ref(plan, scope)?),
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => e.with_operands(
                self.instantiate_expr(a, scope)?,
                self.instantiate_expr(b, scope)?,
            ),
            Expr::Neg(a) => Expr::Neg(self.instantiate_expr(a, scope)?),
            Expr::Call(f, args) => Expr::Call(
                f,
                args.into_iter()
                    .map(|a| self.instantiate_expr(a, scope))
                    .collect::<Result<_>>()?,
            ),
        };
        let done = self.arena.push(out);
        if let Some(key) = class {
            self.instantiated.insert(key, done);
        }
        Ok(done)
    }

    /// Lower a numeric expression to operator slots. A literal is read from
    /// the build's shared constants, so a bare literal gives a slot no prop
    /// may alias. A literal goes second where the operator allows it. The
    /// expression's own operator is a new slot; what it reads is lowered
    /// once per node.
    pub(in crate::build) fn lower(&mut self, id: ExprId, scope: ScopeId) -> SlotId {
        let num = |a: &Arena<SlotId>, e: ExprId| match a.get(e) {
            Expr::Num(v) => Some(*v),
            _ => None,
        };
        let e = self.arena.get(id).clone();
        match e {
            Expr::Num(v) => self.const_slot(v),
            Expr::Cell(slot) => slot,
            Expr::Sym(_) => unreachable!("lowering a symbolic expression"),
            Expr::Neg(a) => {
                let a = self.lower_shared(a, scope);
                self.math_op(OpSpec::Negate, &[a], scope)
            }
            // Commutative: a literal on the left goes second.
            Expr::Add(a, b) | Expr::Mul(a, b) => {
                let spec = match e {
                    Expr::Add(..) => OpSpec::Add,
                    _ => OpSpec::Mul,
                };
                let (a, b) = match num(&self.arena, a) {
                    Some(_) if num(&self.arena, b).is_none() => (b, a),
                    _ => (a, b),
                };
                let (a, b) = (self.lower_shared(a, scope), self.lower_shared(b, scope));
                self.math_op(spec, &[a, b], scope)
            }
            // `k - b` as `-b + k`, so a request reaches `b`.
            Expr::Sub(a, b) if num(&self.arena, a).is_some() && num(&self.arena, b).is_none() => {
                let (k, b) = (self.lower_shared(a, scope), self.lower_shared(b, scope));
                let nb = self.math_op(OpSpec::Negate, &[b], scope);
                self.math_op(OpSpec::Add, &[nb, k], scope)
            }
            Expr::Sub(a, b) => {
                let (a, b) = (self.lower_shared(a, scope), self.lower_shared(b, scope));
                self.math_op(OpSpec::Sub, &[a, b], scope)
            }
            Expr::Div(a, b) => {
                let (a, b) = (self.lower_shared(a, scope), self.lower_shared(b, scope));
                self.math_op(OpSpec::Div, &[a, b], scope)
            }
            Expr::Pow(a, b) => {
                let (a, b) = (self.lower_shared(a, scope), self.lower_shared(b, scope));
                self.math_op(OpSpec::Pow, &[a, b], scope)
            }
            Expr::Call(f, args) => {
                let mut xs = args
                    .iter()
                    .map(|&a| self.lower_shared(a, scope))
                    .collect::<Vec<_>>();
                match f {
                    Func::Round => self.math_op(OpSpec::Round, &xs, scope),
                    Func::Floor => self.math_op(OpSpec::Floor, &xs, scope),
                    Func::Clamp => self.math_op(OpSpec::Vec(VecOp::Clamp), &xs, scope),
                    // More than two arguments fold from the left.
                    Func::Min | Func::Max => {
                        let spec = if f == Func::Min {
                            OpSpec::Min
                        } else {
                            OpSpec::Max
                        };
                        let first = xs.remove(0);
                        xs.into_iter()
                            .fold(first, |acc, x| self.math_op(spec, &[acc, x], scope))
                    }
                }
            }
        }
    }

    /// `lower`, once per node of the build's arena: a shared node gives one
    /// slot.
    fn lower_shared(&mut self, id: ExprId, scope: ScopeId) -> SlotId {
        if let Some(&s) = self.lowered.get(&id) {
            return s;
        }
        let s = self.lower(id, scope);
        self.lowered.insert(id, s);
        s
    }

    /// `op_slot` for an operator lowered from the author's math: a binary
    /// one is recorded for orientation.
    fn math_op(&mut self, spec: OpSpec, inputs: &[SlotId], scope: ScopeId) -> SlotId {
        let slot = self.op_slot(spec, inputs, scope);
        if inputs.len() == 2 {
            self.author_ops.push(slot);
        }
        slot
    }
}

//! Math at expansion: a math's source per instance, numeric (lowered to
//! operators over slots) or symbolic (an `Instantiate` over its leaves),
//! and whether a component's `expr` is a math cell at all.

use super::*;

impl<'c> Builder<'c> {
    /// A math cell from a template's math text: a fixed handle when it has
    /// no cell leaves, an alias when it is one math leaf and nothing else,
    /// else an `Instantiate` over its leaves (each a number or a math cell).
    pub(in crate::build) fn sym_source(
        &mut self,
        expr: ExprId,
        post: Post,
        scope: ScopeId,
    ) -> Result<BuiltSource> {
        let compiled = self.compiled;
        let text = compiled.sym_text.get(&expr).ok_or_else(|| Error::BadMath {
            text: format!("{:?}", self.compiled.arena.get(expr)),
            reason: "no math text recorded".into(),
        })?;
        if compiled.arena.has_call(expr) {
            return Err(Error::BadMath {
                text: text.clone(),
                reason: "round, floor, min, max and clamp are for numeric math only".into(),
            });
        }
        // A constant expression is the same in every instance and every
        // build: made once per load (ADR 0026).
        let constant = (expr, post);
        if let Some(&h) = self.session.math_constants.borrow().get(&constant) {
            return Ok(BuiltSource::Fixed(h.to_value()));
        }
        let parsed;
        let tree = if let Some(cached) = compiled.sym_trees.get(&expr) {
            cached.get_or_init(|| self.engine.parse_tree(text))
        } else {
            parsed = self.engine.parse_tree(text);
            &parsed
        };
        let tree = match tree {
            Ok(tree) => tree,
            // A relation, tuple or multi-argument function with no cell
            // leaves is a fixed expression all the same (a `<boolean>`
            // comparing `(a, b)` with `(a, b)`).
            Err(reason) => match self.engine.parse_fixed(text) {
                Ok(h) => return Ok(self.math_constant(constant, h)),
                Err(_) => {
                    return Err(Error::BadMath {
                        text: text.clone(),
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
                text: text.clone(),
                reason: format!("more than {} references", crate::limits::MAX_REFERENCES),
            });
        }
        Ok(self.planned_source(PlannedOp::Template { template, post }, &leaves))
    }

    /// Constant expression `constant` as imported (`h`), its post applied
    /// and kept for every later instance and build (ADR 0026).
    fn math_constant(&mut self, constant: (ExprId, Post), h: crate::sym::Handle) -> BuiltSource {
        let h = self.post(h, constant.1);
        self.session.math_constants.borrow_mut().insert(constant, h);
        BuiltSource::Fixed(h.to_value())
    }

    /// `post` applied to a fixed expression at build time.
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

    /// Rebind a parsed template's `cellN<plan>` leaves to slots: a math leaf where
    /// the reference names an expression, else a numeric leaf. Distinct leaf
    /// slots are appended to `leaves`.
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
        let (slot, math) = match self.math_target(slot) {
            Some(m) => (m, true),
            None => (slot, false),
        };
        Ok((self.leaf(slot, scope), math))
    }

    /// The slot a `$ref` inside math names: one cell, and not a string id.
    fn math_ref(&mut self, plan: RefId, scope: ScopeId) -> Result<SlotId> {
        let display = &self.compiled.refs[plan.index()].display;
        let slot = self.resolve_one(plan, scope).map_err(|e| match e {
            Error::ArityMismatch { .. } => Error::BadMath {
                text: display.clone(),
                reason: "a reference inside math must name one cell".into(),
            },
            other => other,
        })?;
        if self.value_type(slot) == ValueType::Text {
            let display = &self.compiled.refs[plan.index()].display;
            return Err(Error::Unsupported(format!(
                "a text value (${display}) inside math"
            )));
        }
        Ok(slot)
    }

    /// When `slot` is a prop that stands for an expression (a symbolic
    /// math's `expr` or `value`, a function, a math answer's props), the
    /// slot of that expression.
    fn math_target(&mut self, slot: SlotId) -> Option<SlotId> {
        let comp = self.slot_comp[slot.index()];
        if comp == CompIdx::NONE {
            return None;
        }
        let component_type = self.components.component_type[comp.index()];
        let pi = slot.index() - self.slot_base[comp.index()].index();
        let name = component_type.prop_defs().get(pi)?.name;
        match (component_type, name) {
            // An answer's response and correct value are expressions when
            // what it submits is one: not for a choice or a text answer.
            (ComponentType::Answer, "response" | "correct" | "submitted") => {
                let submitted = self.slot(comp, prop::answer::SUBMITTED);
                (self.value_type(submitted) == ValueType::Math).then_some(slot)
            }
            // A submitted response is a math cell unless its input is a
            // boolean input (`add_response`).
            (ComponentType::Response, "submitted" | "value") => {
                let submitted = self.slot(comp, prop::response::SUBMITTED);
                (self.value_type(submitted) == ValueType::Math).then_some(submitted)
            }
            (
                ComponentType::Math
                | ComponentType::MathInput
                | ComponentType::Function
                | ComponentType::Derivative,
                "expr" | "value",
            ) => self
                .is_symbolic(comp)
                .then(|| self.slot(comp, component_type.prop_index("expr").unwrap())),
            _ => None,
        }
    }

    /// What the cell of `slot` will hold, read from the plans before every
    /// source is set: the type of the plan that defines it, through
    /// aliases. A symbolic math's `expr` is decided by `is_symbolic`
    /// instead; this answers for essential cells and what aliases them.
    pub(in crate::build) fn value_type(&mut self, slot: SlotId) -> ValueType {
        self.value_type_within(slot, 32)
    }

    fn value_type_within(&mut self, slot: SlotId, depth: u32) -> ValueType {
        let comp = self.slot_comp[slot.index()];
        if depth == 0 || comp == CompIdx::NONE {
            return ValueType::Number;
        }
        let inst = self.comp_instance[comp.index()];
        if inst == NONE {
            // A copy or a placed reference aliases what it copies; an
            // interface name holds what its branches' components hold.
            let pi = slot.get() - self.slot_base[comp.index()].get();
            if let BuiltSource::Alias(t) = self.sources[slot.index()] {
                return self.value_type_within(t, depth - 1);
            }
            // A stand-in holds what any branch may: text or math when one
            // does (their kinds must agree, `stand_in_sources`).
            let Some(members) = self.stand_ins.get(&comp).cloned() else {
                return ValueType::Number;
            };
            let mut kind = ValueType::Number;
            for m in members {
                let t = self.slot_base[m.index()].offset(pi as usize);
                match self.value_type_within(t, depth - 1) {
                    ValueType::Number => {}
                    k => kind = k,
                }
            }
            return kind;
        }
        let i = self.instances[inst as usize];
        let pi = slot.index() - self.slot_base[comp.index()].index();
        let c: &'c Compiled = self.compiled;
        let next = match c.templates[i.template.index()].elems[i.elem.index()]
            .props
            .get(pi)
        {
            Some(Source::MathEssential(_) | Source::MathEssentialFrom(_)) => {
                return ValueType::Math;
            }
            Some(Source::TextLiteral(_)) => return ValueType::Text,
            Some(Source::Alias(Arg::Own(k))) => self.slot(comp, *k as usize),
            // The extend referent's slot, as `instance_sources` resolves it.
            Some(Source::Inherit) => {
                let Some(p) = c.templates[i.template.index()].elems[i.elem.index()].extend else {
                    return ValueType::Number;
                };
                let referent = match self.resolve(p, i.scope) {
                    Ok((target, _)) => match self.single_component(target, p) {
                        Ok(r) => r,
                        Err(_) => return ValueType::Number,
                    },
                    Err(_) => return ValueType::Number,
                };
                self.slot(referent, pi)
            }
            Some(Source::Alias(Arg::Elem(e, k))) => {
                let other = self.scope_comps[i.scope.index()][e.index()];
                if other == CompIdx::NONE {
                    return ValueType::Number;
                }
                self.slot(other, *k as usize)
            }
            Some(Source::Alias(Arg::Ref(p, Sel::Whole))) => match self.resolve_one(*p, i.scope) {
                Ok(t) => t,
                Err(_) => return ValueType::Number,
            },
            _ => return ValueType::Number,
        };
        self.value_type_within(next, depth - 1)
    }

    /// Whether a component's `expr` is a math cell: a function, an unbound
    /// mathInput, a math with a free symbol or a reference to an
    /// expression. A copy is symbolic when its referent is. A reference
    /// cycle counts as numeric (the cycle is reported later).
    pub(in crate::build) fn is_symbolic(&mut self, comp: CompIdx) -> bool {
        if self.math_mode.len() < self.components.len() {
            self.math_mode
                .resize(self.components.len(), MathMode::Unknown);
        }
        match self.math_mode[comp.index()] {
            MathMode::Numeric | MathMode::Deciding => return false,
            MathMode::Symbolic => return true,
            MathMode::Unknown => {}
        }
        self.math_mode[comp.index()] = MathMode::Deciding;
        let component_type = self.components.component_type[comp.index()];
        let inst = self.comp_instance[comp.index()];
        let yes = match component_type {
            ComponentType::Function | ComponentType::Derivative => true,
            // A copy of a math (its `expr`) or a bound mathInput (its `value`).
            ComponentType::Math | ComponentType::MathInput if inst == NONE => {
                match self.sources.get(
                    self.slot(
                        comp,
                        if component_type == ComponentType::Math {
                            prop::math::EXPR
                        } else {
                            prop::math_input::VALUE
                        },
                    )
                    .index(),
                ) {
                    Some(BuiltSource::Alias(t)) => {
                        let referent = self.slot_comp[t.index()];
                        referent != CompIdx::NONE && self.is_symbolic(referent)
                    }
                    _ => false,
                }
            }
            ComponentType::MathInput => {
                let i = self.instances[inst as usize];
                matches!(
                    self.compiled.templates[i.template.index()].elems[i.elem.index()]
                        .props
                        .get(prop::math_input::EXPR),
                    Some(Source::MathEssential(_))
                )
            }
            ComponentType::Math => {
                let i = self.instances[inst as usize];
                match self.compiled.templates[i.template.index()].elems[i.elem.index()]
                    .props
                    .get(prop::math::EXPR)
                {
                    Some(Source::MathHandle(id, _)) => {
                        let id = *id;
                        let mut syms = Vec::new();
                        self.compiled.arena.symbols(id, &mut syms);
                        let mut leaves = Vec::new();
                        self.compiled.arena.cell_leaves(id, &mut leaves);
                        !syms.is_empty()
                            || leaves.into_iter().any(|p| {
                                self.resolve_one(p, i.scope)
                                    .is_ok_and(|s| self.math_target(s).is_some())
                            })
                    }
                    _ => false,
                }
            }
            _ => false,
        };
        self.math_mode[comp.index()] = if yes {
            MathMode::Symbolic
        } else {
            MathMode::Numeric
        };
        yes
    }

    /// Copy an expression template into the document's arena with its plan
    /// leaves resolved to slots in `scope`.
    pub(in crate::build) fn instantiate_expr(
        &mut self,
        id: ExprId,
        scope: ScopeId,
    ) -> Result<ExprId> {
        let e = self.compiled.arena.get(id).clone();
        let out = match e {
            Expr::Num(v) => Expr::Num(v),
            Expr::Sym(s) => Expr::Sym(s),
            Expr::Cell(plan) => {
                let slot = self.math_ref(plan, scope)?;
                Expr::Cell(self.leaf(slot, scope))
            }
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
        Ok(self.arena.push(out))
    }

    /// Lower a numeric expression to operator slots. A literal is read from
    /// the build's shared constants (`const_slot`), so a bare literal gives
    /// a slot no prop may alias. A binary operator's inverse writes its
    /// first input, so a literal goes second where the operator allows it.
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
                let a = self.lower(a, scope);
                self.op_slot(OpSpec::Negate, &[a], scope)
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
                let (a, b) = (self.lower(a, scope), self.lower(b, scope));
                self.op_slot(spec, &[a, b], scope)
            }
            // `k - b` as `-b + k`, so a request reaches `b`.
            Expr::Sub(a, b) if num(&self.arena, a).is_some() && num(&self.arena, b).is_none() => {
                let (k, b) = (self.lower(a, scope), self.lower(b, scope));
                let nb = self.op_slot(OpSpec::Negate, &[b], scope);
                self.op_slot(OpSpec::Add, &[nb, k], scope)
            }
            Expr::Sub(a, b) => {
                let (a, b) = (self.lower(a, scope), self.lower(b, scope));
                self.op_slot(OpSpec::Sub, &[a, b], scope)
            }
            Expr::Div(a, b) => {
                let (a, b) = (self.lower(a, scope), self.lower(b, scope));
                self.op_slot(OpSpec::Div, &[a, b], scope)
            }
            Expr::Pow(a, b) => {
                let (a, b) = (self.lower(a, scope), self.lower(b, scope));
                self.op_slot(OpSpec::Pow, &[a, b], scope)
            }
            Expr::Call(f, args) => {
                let mut xs = args
                    .iter()
                    .map(|&a| self.lower(a, scope))
                    .collect::<Vec<_>>();
                match f {
                    Func::Round => self.op_slot(OpSpec::Round, &xs, scope),
                    Func::Floor => self.op_slot(OpSpec::Floor, &xs, scope),
                    Func::Clamp => self.op_slot(OpSpec::Vec(VecOp::Clamp), &xs, scope),
                    // More than two arguments fold from the left.
                    Func::Min | Func::Max => {
                        let spec = if f == Func::Min {
                            OpSpec::Min
                        } else {
                            OpSpec::Max
                        };
                        let first = xs.remove(0);
                        xs.into_iter()
                            .fold(first, |acc, x| self.op_slot(spec, &[acc, x], scope))
                    }
                }
            }
        }
    }
}

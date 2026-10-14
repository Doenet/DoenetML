//! Emit: merge aliases into cells with a union-find, number cells
//! (essential, fixed, derived), bind operators to instructions, and measure
//! structural depth.

use super::*;

impl<'c, 'a> Builder<'c, 'a> {
    pub(in crate::build) fn finish(mut self) -> Result<BuildOutput> {
        let profile = profile_enabled();
        let clock = web_time::Instant::now();
        let lap = |what: &str| {
            if profile {
                eprintln!("    cd/{what}: {:.2?}", clock.elapsed());
            }
        };
        let n = self.sources.len();
        let mut uf = UnionFind::new(n);
        for (s, src) in self.sources.iter().enumerate() {
            if let Source::Alias(t) = src {
                uf.union(s as SlotId, *t);
            }
        }
        // The one non-alias slot in each class defines its cell.
        let mut class_def: Vec<u32> = vec![NONE; n];
        for (s, src) in self.sources.iter().enumerate() {
            match src {
                Source::Alias(_) => {}
                Source::Unset => unreachable!(
                    "slot {} never received a source",
                    self.slot_label(s as SlotId)
                ),
                _ => {
                    let root = uf.find(s as SlotId) as usize;
                    debug_assert!(class_def[root] == NONE, "two sources in one alias class");
                    class_def[root] = s as u32;
                }
            }
        }
        lap("union-find");

        // Number cells: essential classes first, then fixed, then derived.
        // Essential values come from the previous build when the slot existed.
        let roots: Vec<u32> = (0..n as SlotId).map(|s| uf.find(s)).collect();
        if let Some(s) = (0..n).find(|&s| class_def[roots[s] as usize] == NONE) {
            return Err(Error::Cycle(self.slot_label(s as SlotId)));
        }
        let mut slot_cell: Vec<CellIdx> = vec![NONE; n];
        let mut cells = Vec::with_capacity(n);
        let mut cell_def_slot: Vec<SlotId> = Vec::with_capacity(n);
        let mut essential_slots: Vec<(ScopeId, u32)> = Vec::new();
        let mut fixed_defs = Vec::new();
        let mut derived_defs = Vec::new();
        let mut outputs = Vec::new();
        for (s, &root) in roots.iter().enumerate() {
            let root = root as usize;
            if class_def[root] as usize != s {
                continue; // not the defining slot of its class
            }
            match &self.sources[s] {
                Source::Literal(v) | Source::Default(v) => {
                    let (scope, tslot) = self.template_slot(s as SlotId);
                    let value = self
                        .carryover
                        .structure
                        .essential_values
                        .get(scope as usize)
                        .and_then(|row| row.get(tslot as usize).copied().flatten())
                        .unwrap_or(*v);
                    slot_cell[root] = cells.len() as CellIdx;
                    cells.push(value);
                    cell_def_slot.push(s as SlotId);
                    essential_slots.push((scope, tslot));
                }
                Source::Fixed(_) => fixed_defs.push(s),
                Source::Op(..) => derived_defs.push(s),
                Source::VecOut(..) => outputs.push(s),
                _ => unreachable!(),
            }
        }
        let n_essential = cells.len();
        for &s in &fixed_defs {
            let Source::Fixed(v) = self.sources[s] else {
                unreachable!()
            };
            let root = roots[s] as usize;
            slot_cell[root] = cells.len() as CellIdx;
            cells.push(v);
            cell_def_slot.push(s as SlotId);
        }
        let n_fixed = fixed_defs.len();
        // A vector instruction's outputs are consecutive cells after its head.
        for &s in &derived_defs {
            let root = roots[s] as usize;
            slot_cell[root] = cells.len() as CellIdx;
            let n_out = match self.sources[s] {
                Source::Op(spec, ..) => spec.n_out(),
                _ => 1,
            };
            for _ in 0..n_out {
                cells.push(f64::NAN);
                cell_def_slot.push(s as SlotId);
            }
        }
        for &s in &outputs {
            let Source::VecOut(head, k) = self.sources[s] else {
                unreachable!()
            };
            let head_cell = slot_cell[roots[head as usize] as usize];
            debug_assert!(head_cell != NONE, "vector output before its head");
            slot_cell[roots[s] as usize] = head_cell + k as CellIdx;
            cell_def_slot[(head_cell + k as CellIdx) as usize] = s as SlotId;
        }
        let slot_to_cell: Vec<CellIdx> = roots.iter().map(|&r| slot_cell[r as usize]).collect();
        self.seed_cells(&mut cells, &slot_to_cell, n_essential + n_fixed)?;
        lap("number cells");

        let mut instrs = Vec::with_capacity(derived_defs.len());
        let mut operands = Vec::new();
        let mut bound: Vec<CellIdx> = Vec::with_capacity(8);
        let mut is_math = vec![false; cells.len()];
        let mut tapes = Vec::new();
        // Compile curves whose expression has a fixed shape into tapes, unless
        // the load asked for engine sampling.
        let compile = !self.carryover.structure.sample_with_engine;
        let mut fixed_shape: HashMap<SlotId, Option<Handle>> = HashMap::new();
        for &s in &derived_defs {
            let (mut spec, start, count) = match &self.sources[s] {
                Source::Op(spec, start, count) => (*spec, *start, *count),
                _ => unreachable!(),
            };
            bound.clear();
            bound.extend(
                self.op_inputs[start as usize..start as usize + count as usize]
                    .iter()
                    .map(|&i| slot_to_cell[i as usize]),
            );
            if let OpSpec::Sym(kind) = spec {
                if kind.makes_math() {
                    is_math[slot_to_cell[s] as usize] = true;
                }
                // The template's leaves were slots; they are cells now.
                if let SymKind::Instantiate { template, post } = kind {
                    let tree = rebind(&self.sym_templates[template as usize], &slot_to_cell);
                    spec = OpSpec::Sym(SymKind::Instantiate {
                        template: self.engine.import(&tree),
                        post,
                    });
                }
                let input = self.op_inputs[start as usize];
                // A derivative of a fixed shape is taken once, here; the tick
                // only fills in the parameters.
                if compile
                    && kind == SymKind::Derivative
                    && let Some(d) = self.fixed_shape(s as SlotId, &slot_to_cell, &mut fixed_shape)
                    && let Some(tree) = self.engine.export(d)
                {
                    bound.clear();
                    cell_leaves(&tree, &mut bound);
                    spec = OpSpec::Sym(SymKind::Instantiate {
                        template: d,
                        post: Post::Simplify,
                    });
                }
                // A curve of a fixed shape samples a compiled tape.
                if compile
                    && kind == SymKind::Sample
                    && let Some(h) = self.fixed_shape(input, &slot_to_cell, &mut fixed_shape)
                    && let Some(tape) = self
                        .engine
                        .export(h)
                        .and_then(|t| crate::sym::tape::Tape::compile(&t, "x"))
                {
                    let (lo, hi) = (bound[1], bound[2]);
                    bound.clear();
                    bound.extend([lo, hi]);
                    bound.extend_from_slice(&tape.params);
                    spec = OpSpec::Sym(SymKind::SampleTape {
                        tape: tapes.len() as u32,
                    });
                    tapes.push(tape);
                }
            }
            instrs.push(Instr {
                out: slot_to_cell[s],
                op: spec.bind(&bound, &mut operands),
            });
        }
        for &s in &self.math_slots {
            is_math[slot_to_cell[s as usize] as usize] = true;
        }
        lap("bind instructions");

        // Prop cells: contiguous per component, in slot order.
        let n_comps = self.components.len();
        self.components.prop_base = Vec::with_capacity(n_comps);
        self.components.prop_cells = Vec::with_capacity(n);
        for c in 0..n_comps {
            let np = self.components.component_type[c].prop_defs().len();
            self.components
                .prop_base
                .push(self.components.prop_cells.len() as u32);
            let base = self.slot_base[c] as usize;
            self.components
                .prop_cells
                .extend_from_slice(&slot_to_cell[base..base + np]);
        }
        lap("prop cells");

        let (depths, cross_reads) = self.structural_depths();
        lap("structural depth");

        // The value store grows with the scope table; rows fill lazily.
        let mut values = self.carryover.structure.essential_values.clone();
        values.resize(self.scopes.len(), Vec::new());

        let structure = Structure {
            scopes: self.scopes,
            essential_slots,
            essential_values: values,
            structural_depth: depths.iter().copied().max().unwrap_or(0),
            repeat_depths: depths,
            repeat_cross_reads: cross_reads,
            repeats: self.repeats,
            seed: self.carryover.structure.seed,
            sample_with_engine: self.carryover.structure.sample_with_engine,
        };

        // Lazy labels for cycle errors.
        let slot_comp = self.slot_comp;
        let slot_base = self.slot_base;
        let component_types = self.components.component_type.clone();
        let names: Vec<Option<String>> = self
            .components
            .name
            .iter()
            .map(|&s| (s != NONE).then(|| self.compiled.dast.strings.get(s).trim().to_string()))
            .collect();
        let cell_label = Box::new(move |cell: CellIdx| {
            let slot = cell_def_slot[cell as usize];
            let comp = slot_comp[slot as usize];
            if comp == NONE {
                return "(anonymous cell)".to_string();
            }
            let pi = (slot - slot_base[comp as usize]) as usize;
            let owner = names[comp as usize]
                .clone()
                .unwrap_or_else(|| format!("<{}>#{}", component_types[comp as usize].tag(), comp));
            match component_types[comp as usize].prop_defs().get(pi) {
                Some(def) => format!("{owner}.{}", def.name),
                None => format!("{owner}.(hidden slot {pi})"),
            }
        });

        let mut components = self.components;
        components.component_type.shrink_to_fit();
        components.name.shrink_to_fit();
        components.parent.shrink_to_fit();
        components.child_start.shrink_to_fit();
        components.child_count.shrink_to_fit();
        components.child_list.shrink_to_fit();
        components.prop_cells.shrink_to_fit();
        components.dast_node.shrink_to_fit();
        components.scope.shrink_to_fit();
        Ok(BuildOutput {
            cells,
            n_essential,
            n_fixed,
            instrs,
            components,
            strings: self.compiled.dast.strings.clone(),
            root: self.root,
            structure,
            operands,
            is_math,
            tapes,
            cell_label,
        })
    }

    /// The expression a slot will hold as a template over numeric cell
    /// leaves, when its shape is fixed at build time: a fixed handle, an
    /// instantiated template, or the derivative of one (taken here, once).
    /// `None` when it depends on a math cell whose shape can change.
    fn fixed_shape(
        &mut self,
        slot: SlotId,
        slot_to_cell: &[CellIdx],
        memo: &mut HashMap<SlotId, Option<Handle>>,
    ) -> Option<Handle> {
        let mut root = slot;
        while let Source::Alias(t) = self.sources[root as usize] {
            root = t;
        }
        if let Some(&h) = memo.get(&root) {
            return h;
        }
        let h = match self.sources[root as usize] {
            Source::Fixed(h) if !h.is_nan() => Some(h as Handle),
            Source::Op(OpSpec::Sym(SymKind::Instantiate { template, .. }), _, _) => {
                let tree = rebind(&self.sym_templates[template as usize], slot_to_cell);
                if has_math_leaf(&tree) {
                    None
                } else {
                    Some(self.engine.import(&tree))
                }
            }
            Source::Op(OpSpec::Sym(SymKind::Derivative), start, _) => {
                let input = self.op_inputs[start as usize];
                self.fixed_shape(input, slot_to_cell, memo)
                    .map(|h| self.engine.derivative(h, "x"))
            }
            _ => None,
        };
        memo.insert(root, h);
        h
    }

    /// Give each seeded essential math cell (`SourcePlan::MathEssentialFrom`)
    /// its first expression: the source cell's value, unless the cell
    /// carried a value over from an earlier build. The source must be
    /// essential or fixed, so its value is known before anything computes.
    fn seed_cells(
        &mut self,
        cells: &mut [f64],
        slot_to_cell: &[CellIdx],
        n_known: usize,
    ) -> Result<()> {
        let math_cells: std::collections::HashSet<CellIdx> = self
            .math_slots
            .iter()
            .map(|&s| slot_to_cell[s as usize])
            .collect();
        for &(s, from) in &self.seeds {
            let (scope, tslot) = self.template_slot(s);
            let carried = self
                .carryover
                .structure
                .essential_values
                .get(scope as usize)
                .and_then(|row| row.get(tslot as usize).copied().flatten())
                .is_some();
            if carried {
                continue;
            }
            let src = slot_to_cell[from as usize];
            if src as usize >= n_known {
                return Err(Error::Unsupported(format!(
                    "prefill=\"${}\": a prefill reference must name a value that is not computed",
                    self.slot_label(from)
                )));
            }
            let v = cells[src as usize];
            cells[slot_to_cell[s as usize] as usize] = if math_cells.contains(&src) || v.is_nan() {
                v
            } else {
                self.engine.import(&Tree::Num(v)) as f64
            };
        }
        Ok(())
    }

    /// The (scope, template slot) an essential slot's value is saved under.
    /// Only template elements have essential slots; copies alias theirs.
    pub(in crate::build) fn template_slot(&self, slot: SlotId) -> (ScopeId, u32) {
        let comp = self.slot_comp[slot as usize];
        let inst = self.instances[self.comp_instance[comp as usize] as usize];
        let pi = slot - self.slot_base[comp as usize];
        (
            inst.scope,
            self.compiled.templates[inst.template].elems[inst.elem].slot_off + pi,
        )
    }

    /// Structural depth per repeat: how many repeats must be expanded, in
    /// sequence, before its count can be computed, plus one. Nesting adds
    /// one; a count that reads a cell inside another repeat's iterations adds
    /// one, and is flagged (`cross`) since authors can avoid it.
    pub(in crate::build) fn structural_depths(&self) -> (Vec<u32>, Vec<bool>) {
        let mut owner: HashMap<ScopeId, usize> = HashMap::new();
        for (ri, r) in self.repeats.iter().enumerate() {
            for &s in &r.iter_scopes {
                owner.insert(s, ri);
            }
        }
        let is_ancestor_or_self = |s: ScopeId, of: ScopeId| -> bool {
            let mut cur = of;
            loop {
                if cur == s {
                    return true;
                }
                if cur == 0 {
                    return false;
                }
                cur = self.scopes[cur].0;
            }
        };
        let mut reads: Vec<Vec<usize>> = vec![Vec::new(); self.repeats.len()];
        let mut cross = vec![false; self.repeats.len()];
        let mut seen = vec![false; self.sources.len()];
        let mut stack = Vec::new();
        let mut touched = Vec::new();
        for (ri, r) in self.repeats.iter().enumerate() {
            if let Some(&o) = owner.get(&r.scope) {
                reads[ri].push(o);
            }
            stack.clear();
            let count_pi = self.components.component_type[r.comp as usize]
                .count_prop()
                .expect("a repeat has a count");
            stack.push(self.slot(r.comp, count_pi));
            touched.clear();
            while let Some(sl) = stack.pop() {
                if seen[sl as usize] {
                    continue;
                }
                seen[sl as usize] = true;
                touched.push(sl);
                let comp = self.slot_comp[sl as usize];
                if comp != NONE {
                    let scope = self.components.scope[comp as usize];
                    if scope != 0
                        && !is_ancestor_or_self(scope, r.scope)
                        && let Some(&o) = owner.get(&scope)
                        && o != ri
                    {
                        cross[ri] = true;
                        if !reads[ri].contains(&o) {
                            reads[ri].push(o);
                        }
                    }
                }
                match &self.sources[sl as usize] {
                    Source::Alias(t) => stack.push(*t),
                    Source::Op(_, start, n) => stack.extend_from_slice(
                        &self.op_inputs[*start as usize..*start as usize + *n as usize],
                    ),
                    Source::VecOut(head, _) => stack.push(*head),
                    _ => {}
                }
            }
            for &sl in &touched {
                seen[sl as usize] = false;
            }
        }
        fn depth(ri: usize, reads: &[Vec<usize>], memo: &mut [u32], visiting: &mut [bool]) -> u32 {
            if memo[ri] != 0 {
                return memo[ri];
            }
            if visiting[ri] {
                return 1;
            }
            visiting[ri] = true;
            let d = 1 + reads[ri]
                .iter()
                .map(|&o| depth(o, reads, memo, visiting))
                .max()
                .unwrap_or(0);
            visiting[ri] = false;
            memo[ri] = d;
            d
        }
        let mut memo = vec![0u32; self.repeats.len()];
        let mut visiting = vec![false; self.repeats.len()];
        let depths = (0..self.repeats.len())
            .map(|ri| depth(ri, &reads, &mut memo, &mut visiting))
            .collect();
        (depths, cross)
    }
}

/// A template with its slot leaves replaced by cells.
fn rebind(t: &Tree, slot_to_cell: &[CellIdx]) -> Tree {
    let all = |ts: &[Tree]| ts.iter().map(|k| rebind(k, slot_to_cell)).collect();
    let one = |k: &Tree| Box::new(rebind(k, slot_to_cell));
    match t {
        Tree::Cell { cell, math } => Tree::Cell {
            cell: slot_to_cell[*cell as usize],
            math: *math,
        },
        Tree::Num(_) | Tree::Sym(_) => t.clone(),
        Tree::Add(ts) => Tree::Add(all(ts)),
        Tree::Mul(ts) => Tree::Mul(all(ts)),
        Tree::Sub(a, b) => Tree::Sub(one(a), one(b)),
        Tree::Div(a, b) => Tree::Div(one(a), one(b)),
        Tree::Pow(a, b) => Tree::Pow(one(a), one(b)),
        Tree::Neg(a) => Tree::Neg(one(a)),
        Tree::Apply(f, a) => Tree::Apply(f.clone(), one(a)),
    }
}

fn has_math_leaf(t: &Tree) -> bool {
    match t {
        Tree::Cell { math, .. } => *math,
        Tree::Num(_) | Tree::Sym(_) => false,
        Tree::Add(ts) | Tree::Mul(ts) => ts.iter().any(has_math_leaf),
        Tree::Sub(a, b) | Tree::Div(a, b) | Tree::Pow(a, b) => has_math_leaf(a) || has_math_leaf(b),
        Tree::Neg(a) | Tree::Apply(_, a) => has_math_leaf(a),
    }
}

/// Distinct cell leaves of a tree, in first-seen order.
fn cell_leaves(t: &Tree, out: &mut Vec<CellIdx>) {
    match t {
        Tree::Cell { cell, .. } => {
            if !out.contains(cell) {
                out.push(*cell);
            }
        }
        Tree::Num(_) | Tree::Sym(_) => {}
        Tree::Add(ts) | Tree::Mul(ts) => ts.iter().for_each(|k| cell_leaves(k, out)),
        Tree::Sub(a, b) | Tree::Div(a, b) | Tree::Pow(a, b) => {
            cell_leaves(a, out);
            cell_leaves(b, out);
        }
        Tree::Neg(a) | Tree::Apply(_, a) => cell_leaves(a, out),
    }
}

struct UnionFind {
    parent: Vec<u32>,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        UnionFind {
            parent: (0..n as u32).collect(),
        }
    }
    fn find(&mut self, mut x: u32) -> u32 {
        while self.parent[x as usize] != x {
            let p = self.parent[x as usize];
            self.parent[x as usize] = self.parent[p as usize];
            x = p;
        }
        x
    }
    fn union(&mut self, a: u32, b: u32) {
        let (ra, rb) = (self.find(a), self.find(b));
        if ra != rb {
            self.parent[ra as usize] = rb;
        }
    }
}

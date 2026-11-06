//! Emit: number the cells (constants, the pooled ones first, then
//! essential, then derived), bind operators to instructions, seed values
//! and make the build, from the definitions (`define.rs`). Emit reads no
//! structure (ADR 0035): what it makes follows from the definitions.

use super::*;

/// Emit: cells numbered, operators bound to instructions, values seeded, from
/// the definitions alone (ADR 0035). Reads [`Defined`]; reads no structure.
impl<'c> Builder<'c> {
    /// Emit: number the cells, bind the operators, seed the values, and
    /// make the build, from the definitions.
    pub(in crate::build) fn emit(
        mut self,
        defined: Defined,
    ) -> std::result::Result<BuildOutput, Failure> {
        let n = self.sources.len();
        let Defined {
            slot_cells,
            essential,
            live: live_slot,
        } = defined;
        // What this build's own walks find, whatever the record says: what
        // the record is checked against (`tests/live.rs`, `every_count.rs`).
        #[cfg(feature = "testing")]
        let walked_slot = self.live_slots(&slot_cells);
        #[cfg(feature = "testing")]
        let walked_writable = self.writable_slots(&slot_cells);
        // A dead class gets no cell (ADR 0019): its slots name the one dead
        // cell, unless the load asked for every cell (`LoadOptions::prune`).
        // An essential slot is always live; were one not, it would be kept.
        // A vector output goes with its head, whose instruction writes it.
        let prune = self.compiled.plans.prune;
        let pruned = |s: usize| {
            let s = match self.sources[s] {
                BuiltSource::VecOut(head, _) => head.index(),
                _ => s,
            };
            prune
                && !live_slot[s]
                && !(matches!(self.sources[s], BuiltSource::Given(_)) && essential[s])
        };
        let fold = self.folded_slots(&slot_cells, &essential, &pruned);
        let mut slot_cell: Vec<CellIdx> = vec![CellIdx::NONE; n];
        // Count each kind of defining slot first: the essential tables are
        // kept, and none of these should reserve more than it fills. The
        // cells are counted once the pool is known.
        let mut counts = [0usize; 4];
        for slot in SlotId::below(n) {
            let s = slot.index();
            if slot_cells.defines(slot) && !pruned(s) {
                let kind = match &self.sources[s] {
                    BuiltSource::Given(_) if essential[s] => 0,
                    BuiltSource::Given(_) | BuiltSource::Const(_) => 1,
                    BuiltSource::Op(..) if fold[s] => 1,
                    BuiltSource::Op(..) => 2,
                    _ => 3,
                };
                counts[kind] += 1;
            }
        }
        // The document constants go to the pool (ADR 0028): a template
        // slot whose port is one, an operator's constant, the
        // missing-referent cell. An operator's constants are marked once,
        // so the test is constant time per slot, not a scan of them all.
        let mut op_const = vec![false; self.sources.len()];
        for k in self.consts.values() {
            op_const[k.index()] = true;
        }
        let pooled = |s: usize| {
            (match self.sources[s] {
                BuiltSource::Const(_) => true,
                BuiltSource::Given(_) => !essential[s],
                _ => false,
            }) && (Some(SlotId::from_index(s)) == self.missing
                || op_const[s]
                || self
                    .port_attrs(SlotId::from_index(s))
                    .has(PortAttrs::DOCUMENT_CONSTANT))
        };
        let mut pool = self.session.pool.clone();
        let mut essential_slots: Vec<(ScopeId, TemplateSlot)> = Vec::with_capacity(counts[0]);
        let mut essential_keys: Vec<(ElemKey, u32)> = Vec::with_capacity(counts[0]);
        let mut parked = self.session.parked.clone();
        // Restored values the build takes from `parked`: (cell, what was
        // parked, its key).
        let mut unparked: Vec<(CellIdx, crate::session::Parked, (ScopeId, TemplateSlot))> =
            Vec::new();
        let mut essential_defaults: Vec<f64> = Vec::with_capacity(counts[0]);
        // Each essential slot, with the value it starts at and what it took
        // from `parked`.
        let mut essential_defs = Vec::with_capacity(counts[0]);
        let mut pool_defs = Vec::new();
        let mut const_defs = Vec::with_capacity(counts[1]);
        let mut derived_defs = Vec::with_capacity(counts[2]);
        let mut fold_defs = Vec::new();
        let mut outputs = Vec::with_capacity(counts[3]);
        let mut dead_defs = Vec::new();
        #[cfg(feature = "testing")]
        let mut walked_essential_slots = Vec::new();
        for slot in SlotId::below(n) {
            let s = slot.index();
            if !slot_cells.defines(slot) {
                continue; // not the defining slot of its cell
            }
            if pruned(s) {
                dead_defs.push(s);
                continue;
            }
            #[cfg(feature = "testing")]
            if walked_writable[s] && matches!(self.sources[s], BuiltSource::Given(_)) {
                let (scope, tslot, _) = self.essential_key(SlotId::from_index(s));
                walked_essential_slots.push((scope, tslot));
            }
            match &self.sources[s] {
                _ if pooled(s) => pool_defs.push(s),
                BuiltSource::Given(_) if !essential[s] => const_defs.push(s),
                BuiltSource::Given(v) => {
                    let (scope, tslot, key) = self.essential_key(SlotId::from_index(s));
                    let mut value = self.session.carried(scope, tslot).unwrap_or(*v);
                    let mut restored = None;
                    if !parked.is_empty()
                        && let Some(p) = parked.remove(&(scope, key.0, key.1))
                    {
                        value = p.value;
                        restored = Some(p);
                    }
                    essential_defs.push((s, value, restored));
                    essential_slots.push((scope, tslot));
                    essential_keys.push(key);
                    essential_defaults.push(*v);
                }
                BuiltSource::Const(_) => const_defs.push(s),
                BuiltSource::Op(..) if fold[s] => fold_defs.push(s),
                BuiltSource::Op(..) => derived_defs.push(s),
                BuiltSource::VecOut(..) => outputs.push(s),
                _ => unreachable!(),
            }
        }
        // Each pooled slot's position in the pool, appending the document
        // constants no build of this session has made yet.
        let mut pooled_at = Vec::with_capacity(pool_defs.len());
        if !pool_defs.is_empty() {
            let types: HashMap<SlotId, ValueType> = self.typed_slots.iter().copied().collect();
            for &s in &pool_defs {
                let (BuiltSource::Const(v) | BuiltSource::Given(v)) = self.sources[s] else {
                    unreachable!()
                };
                let slot = SlotId::from_index(s);
                let ty = types.get(&slot).copied().unwrap_or(ValueType::Number);
                let at = match pool.find(v, ty) {
                    Some(at) => at,
                    None => std::sync::Arc::make_mut(&mut pool).insert(v, ty),
                };
                pooled_at.push((slot, at));
            }
        }
        let n_out = |s: usize| match self.sources[s] {
            BuiltSource::Op(spec, ..) => spec.n_out(),
            _ => 1,
        };
        let n_cells = pool.len()
            + !dead_defs.is_empty() as usize
            + const_defs.len()
            + fold_defs.iter().map(|&s| n_out(s)).sum::<usize>()
            + essential_defs.len()
            + derived_defs.iter().map(|&s| n_out(s)).sum::<usize>();
        let mut cells = Vec::with_capacity(n_cells);
        let mut cell_def_slot: Vec<SlotId> = Vec::with_capacity(n_cells);
        // The pool first: every document constant a build of this session
        // has made, at the cell it has had since (ADR 0028). A pooled cell
        // this build does not use has no defining slot here.
        for &(v, _) in pool.values() {
            cells.push(v);
            cell_def_slot.push(SlotId::NONE);
        }
        // A pooled cell's defining slot is one of the slots that share it,
        // a live one if any is (its liveness is all of theirs, below).
        for &(slot, at) in &pooled_at {
            slot_cell[slot_cells.cell_of(slot).index()] = CellIdx::from_index(at);
            let rep = cell_def_slot[at];
            if rep == SlotId::NONE || (!live_slot[rep.index()] && live_slot[slot.index()]) {
                cell_def_slot[at] = slot;
            }
        }
        // The dead cell: NaN, never computed, and what every dead slot
        // names. Not pooled, since it is not live and a pooled NaN is.
        let dead_cell = (!dead_defs.is_empty()).then(|| {
            let dead = CellIdx::from_index(cells.len());
            cells.push(f64::NAN);
            cell_def_slot.push(SlotId::from_index(dead_defs[0]));
            for &s in &dead_defs {
                slot_cell[slot_cells.cell_of(SlotId::from_index(s)).index()] = dead;
            }
            dead
        });
        for &s in &const_defs {
            // A scope constant, or a constant the record cannot name.
            let (BuiltSource::Const(v) | BuiltSource::Given(v)) = self.sources[s] else {
                unreachable!()
            };
            let root = slot_cells.cell_of(SlotId::from_index(s)).index();
            slot_cell[root] = CellIdx::from_index(cells.len());
            cells.push(v);
            cell_def_slot.push(SlotId::from_index(s));
        }
        // A folded instruction's outputs are constants, computed once the
        // instructions are bound; a vector instruction's outputs are
        // consecutive cells after its head.
        for &s in &fold_defs {
            let root = slot_cells.cell_of(SlotId::from_index(s)).index();
            slot_cell[root] = CellIdx::from_index(cells.len());
            for _ in 0..n_out(s) {
                cells.push(f64::NAN);
                cell_def_slot.push(SlotId::from_index(s));
            }
        }
        let n_const = cells.len();
        // The essential cells follow the constants.
        for (s, value, restored) in essential_defs {
            let cell = CellIdx::from_index(cells.len());
            if let Some(p) = restored {
                let (scope, tslot, _) = self.essential_key(SlotId::from_index(s));
                unparked.push((cell, p, (scope, tslot)));
            }
            slot_cell[slot_cells.cell_of(SlotId::from_index(s)).index()] = cell;
            cells.push(value);
            cell_def_slot.push(SlotId::from_index(s));
        }
        let n_essential = cells.len() - n_const;
        for &s in &derived_defs {
            let root = slot_cells.cell_of(SlotId::from_index(s)).index();
            slot_cell[root] = CellIdx::from_index(cells.len());
            for _ in 0..n_out(s) {
                cells.push(f64::NAN);
                cell_def_slot.push(SlotId::from_index(s));
            }
        }
        for &s in &outputs {
            let BuiltSource::VecOut(head, k) = self.sources[s] else {
                unreachable!()
            };
            let head_cell = slot_cell[slot_cells.cell_of(head).index()];
            debug_assert!(head_cell != CellIdx::NONE, "vector output before its head");
            slot_cell[slot_cells.cell_of(SlotId::from_index(s)).index()] =
                head_cell.offset(k as usize);
            cell_def_slot[(head_cell.offset(k as usize)).index()] = SlotId::from_index(s);
        }
        let live_bits = |live: &[bool]| {
            let mut bits = vec![0u64; cells.len().div_ceil(64)];
            for (cell, &s) in cell_def_slot.iter().enumerate() {
                // A pooled cell this build does not use is not live.
                if s != SlotId::NONE && live[s.index()] {
                    bits[cell / 64] |= 1 << (cell % 64);
                }
            }
            // A pooled cell is live when any slot that shares it is.
            for &(s, cell) in &pooled_at {
                if live[s.index()] {
                    bits[cell / 64] |= 1 << (cell % 64);
                }
            }
            bits
        };
        let live = crate::build::Live {
            cells: live_bits(&live_slot),
            #[cfg(feature = "testing")]
            walked: live_bits(&walked_slot),
        };
        let slot_to_cell: Vec<CellIdx> = SlotId::below(n)
            .map(|s| slot_cell[slot_cells.cell_of(s).index()])
            .collect();
        // The live walk follows what a cell needs, so a live cell needs no
        // dead one; the record, made from the template graph's walk, keeps
        // that in every build (`tests/live.rs`). A build that breaks it
        // would compute from NaN, or hold a cell by a flag never computed,
        // so it fails instead.
        if let Some(dead) = dead_cell {
            for s in SlotId::below(n) {
                if !slot_cells.defines(s) || pruned(s.index()) {
                    continue;
                }
                let def = slot_cells.def_of(&self, s, &self.sources[s.index()]);
                if let Some(needed) = def.needs().find(|n| slot_to_cell[n.index()] == dead) {
                    return Err(Failure {
                        error: Error::Unchecked(format!(
                            "{} needs {}, which has no cell: the live slots are not closed under what they need",
                            self.slot_label(s),
                            self.slot_label(needed)
                        )),
                        node: None,
                    });
                }
            }
        }
        // The cells a `fixed` holds, by their flags' cells; a dead cell
        // takes no request.
        let mut holds = crate::program::Holds::default();
        for &(s, f) in &self.holds {
            let cell = slot_to_cell[s.index()];
            if Some(cell) != dead_cell {
                holds.insert(cell, slot_to_cell[f.index()]);
            }
        }
        self.seed_cells(
            &mut cells,
            &mut essential_defaults,
            n_const,
            &slot_to_cell,
            &slot_cells,
            dead_cell,
        );

        let mut instrs = Vec::with_capacity(derived_defs.len());
        let mut operands = Operands::default();
        let mut bound: Vec<CellIdx> = Vec::with_capacity(8);
        let mut value_types = vec![ValueType::Number; cells.len()];
        for &(s, ty) in &self.typed_slots {
            if Some(slot_to_cell[s.index()]) != dead_cell {
                value_types[slot_to_cell[s.index()].index()] = ty;
            }
        }
        // A restored value stays only in a cell of the type it was saved
        // as, and view state only while its default is the one it had
        // (ADR 0017); it wins over a seed, as a carried value does, and
        // counts as touched.
        let mut touched = self.session.touched.clone();
        for &(cell, p, at) in &unparked {
            let c = cell.index();
            let default = essential_defaults[c - n_const];
            cells[c] = if p.fits(value_types[c], default) {
                std::sync::Arc::make_mut(&mut touched).insert(at);
                p.value
            } else {
                default
            };
        }
        let mut tapes = Vec::new();
        // Compile curves whose expression has a constant shape into tapes,
        // and take a constant shape's derivative once, unless the load asked
        // for engine sampling.
        #[cfg(feature = "testing")]
        let compile = !self.session.sample_with_engine;
        #[cfg(not(feature = "testing"))]
        let compile = true;
        let mut constant_shape: HashMap<SlotId, Option<Handle>> = HashMap::new();
        // The folded instructions, bound as any other and run once below.
        let mut folded = Vec::with_capacity(fold_defs.len());
        for &s in derived_defs.iter().chain(&fold_defs) {
            let (planned, start, count) = match &self.sources[s] {
                BuiltSource::Op(op, start, count) => (*op, *start, *count),
                _ => unreachable!(),
            };
            bound.clear();
            bound.extend(
                self.op_inputs[start.index()..start.index() + count as usize]
                    .iter()
                    .map(|&i| slot_to_cell[i.index()]),
            );
            // A planned template's leaves were slots; they are cells now.
            let mut spec = match planned {
                PlannedOp::Spec(spec) => spec,
                PlannedOp::Template { template, post } => {
                    let tree = rebind(&self.sym_templates[template.index()], &slot_to_cell);
                    OpSpec::Sym(SymKind::Instantiate {
                        template: self.engine.import(&tree),
                        post,
                    })
                }
            };
            if let OpSpec::Sym(kind) = spec {
                if kind.makes_math() {
                    value_types[slot_to_cell[s].index()] = ValueType::Math;
                }
                let input = self.op_inputs[start.index()];
                // A derivative of a constant shape is taken once, here; the tick
                // only fills in the parameters.
                if compile
                    && kind == SymKind::Derivative
                    && let Some(d) = self.constant_shape(
                        SlotId::from_index(s),
                        &slot_to_cell,
                        &mut constant_shape,
                    )
                    && let Some(tree) = self.engine.export(d)
                {
                    bound.clear();
                    cell_leaves(&tree, &mut bound);
                    spec = OpSpec::Sym(SymKind::Instantiate {
                        template: d,
                        post: Post::Simplify,
                    });
                }
                // A curve of a constant shape samples a compiled tape.
                if compile
                    && kind == SymKind::Sample
                    && let Some(h) = self.constant_shape(input, &slot_to_cell, &mut constant_shape)
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
                        tape: crate::program::TapeIdx::from_index(tapes.len()),
                    });
                    tapes.push(tape);
                }
            }
            let instr = Instr {
                out: slot_to_cell[s],
                op: spec.bind(&bound, &mut operands),
            };
            if fold[s] {
                folded.push(instr);
            } else {
                instrs.push(instr);
            }
        }
        // Run the folded instructions once, in an order of their own: each
        // reads only constants and the folds before it, so their outputs
        // are constants from here on (ADR 0028).
        if !folded.is_empty() {
            let mut once =
                Program::schedule(folded, cells.len(), operands.clone()).map_err(|cell| {
                    Failure {
                        error: Error::Unchecked(format!(
                            "the folded instructions form a cycle at cell {cell}"
                        )),
                        node: None,
                    }
                })?;
            once.tapes = tapes.clone();
            let mut state = crate::program::SymState::new(&once);
            once.run_all(
                &mut crate::program::SymRun {
                    state: &mut state,
                    engine: self.engine,
                },
                &mut cells,
            );
        }
        #[cfg(feature = "testing")]
        // What each template slot's cell is (`Structure::slot_classes`).
        let slot_classes: Vec<_> = {
            use crate::build::structure::SlotClass;
            SlotId::below(n)
                .filter(|&s| Some(slot_to_cell[s.index()]) != dead_cell)
                .filter(|&s| self.template_slot(s).is_some())
                .map(|s| {
                    let (scope, tslot, _) = self.essential_key(s);
                    let (template, _) = self.template_slot(s).expect("a template slot");
                    let class = match self.sources[s.index()] {
                        BuiltSource::Alias(_) => SlotClass::Alias,
                        BuiltSource::Given(_) if essential[s.index()] => SlotClass::Essential,
                        BuiltSource::Op(..) if !fold[s.index()] => SlotClass::Derived,
                        BuiltSource::VecOut(head, _) if !fold[head.index()] => SlotClass::Derived,
                        BuiltSource::Given(_)
                        | BuiltSource::Const(_)
                        | BuiltSource::Op(..)
                        | BuiltSource::VecOut(..) => SlotClass::Constant {
                            value: cells[slot_to_cell[s.index()].index()],
                            document: self
                                .compiled
                                .plans
                                .port_attrs(template, tslot)
                                .has(PortAttrs::DOCUMENT_CONSTANT),
                            marked: self
                                .compiled
                                .plans
                                .port_attrs(template, tslot)
                                .has(PortAttrs::CONSTANT),
                        },
                        _ => SlotClass::Derived,
                    };
                    ((scope, template.get(), tslot), class)
                })
                .collect()
        };
        #[cfg(feature = "testing")]
        // What each template slot's cell holds (`Structure::slot_types`).
        let slot_types: Vec<_> = SlotId::below(n)
            .filter(|&s| Some(slot_to_cell[s.index()]) != dead_cell)
            .filter(|&s| self.template_slot(s).is_some())
            .map(|s| {
                let (scope, tslot, _) = self.essential_key(s);
                let (template, _) = self.template_slot(s).expect("a template slot");
                let ty = value_types[slot_to_cell[s.index()].index()];
                ((scope, template.get(), tslot), ty)
            })
            .collect();

        // Each component's prop cell indices, one component after another,
        // in slot order; the cells themselves are not contiguous.
        let n_comps = self.components.len();
        self.components.prop_base = Vec::with_capacity(n_comps);
        self.components.prop_cells = Vec::with_capacity(n);
        for c in 0..n_comps {
            let np = self.n_public(CompIdx::from_index(c));
            self.components
                .prop_base
                .push(self.components.prop_cells.len() as u32);
            let base = self.slot_base[c].index();
            self.components
                .prop_cells
                .extend_from_slice(&slot_to_cell[base..base + np]);
        }
        // The next session: this build's scopes and what is still parked;
        // the value store is shared, since the build only read it.
        let session = Session {
            seed: self.session.seed,
            #[cfg(feature = "testing")]
            sample_with_engine: self.session.sample_with_engine,
            scopes: self.scopes,
            values: self.session.values.clone(),
            counts: self.session.counts.clone(),
            parked,
            touched,
            runtime_strings: self.session.runtime_strings.clone(),
            pool,
            last_build: (self.components.component_type.len(), self.sources.len()),
        };
        let structure = Structure {
            essential_slots,
            essential_keys,
            essential_defaults,
            repeats: self.repeats,
            #[cfg(feature = "testing")]
            walked_essential_slots,
            #[cfg(feature = "testing")]
            slot_classes,
            #[cfg(feature = "testing")]
            slot_types,
        };

        // What a cycle's error names its cell by.
        let owners = super::CellOwners {
            cell_def_slot,
            slot_comp: self.slot_comp,
            slot_base: self.slot_base,
        };

        let mut strings = self.compiled.dast.strings.clone();
        for s in &self.compiled.plans.extra_strings {
            strings.push(s);
        }
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
        components.referent.shrink_to_fit();
        Ok(BuildOutput {
            cells,
            n_essential,
            n_const,
            instrs,
            components,
            strings,
            root: self.root,
            structure,
            session,
            operands,
            value_types,
            tapes,
            holds,
            owners,
            live,
        })
    }

    /// The expression a slot will hold as a template over numeric cell
    /// leaves, when its shape is constant at build time: a constant handle, an
    /// instantiated template, or the derivative of one (taken here, once).
    /// `None` when it depends on a math cell whose shape can change.
    fn constant_shape(
        &mut self,
        slot: SlotId,
        slot_to_cell: &[CellIdx],
        memo: &mut HashMap<SlotId, Option<Handle>>,
    ) -> Option<Handle> {
        let mut root = slot;
        while let BuiltSource::Alias(t) = self.sources[root.index()] {
            root = t;
        }
        if let Some(&h) = memo.get(&root) {
            return h;
        }
        let h = match self.sources[root.index()] {
            BuiltSource::Const(h) if !h.is_nan() => Some(Handle::from_value(h)),
            BuiltSource::Op(PlannedOp::Template { template, .. }, _, _) => {
                let tree = rebind(&self.sym_templates[template.index()], slot_to_cell);
                if has_math_leaf(&tree) {
                    None
                } else {
                    Some(self.engine.import(&tree))
                }
            }
            BuiltSource::Op(PlannedOp::Spec(OpSpec::Sym(SymKind::Derivative)), start, _) => {
                let input = self.op_inputs[start.index()];
                self.constant_shape(input, slot_to_cell, memo)
                    .map(|h| self.engine.derivative(h, "x"))
            }
            _ => None,
        };
        memo.insert(root, h);
        h
    }

    /// Give each seeded essential math cell its first expression: the
    /// source cell's value, unless the cell carried a value over from an
    /// earlier build. That the source is not computed, define checked
    /// (`prefill_rule`).
    fn seed_cells(
        &mut self,
        cells: &mut [f64],
        defaults: &mut [f64],
        n_const: usize,
        slot_to_cell: &[CellIdx],
        slot_cells: &SlotCells,
        dead_cell: Option<CellIdx>,
    ) {
        if self.seeds.is_empty() {
            return;
        }
        // Which seed sources hold math, from the few cells that are sources.
        let sources: HashSet<CellIdx> = self
            .seeds
            .iter()
            .map(|&(_, from)| slot_to_cell[from.index()])
            .collect();
        let math_cells: HashSet<CellIdx> = self
            .typed_slots
            .iter()
            .filter(|&&(_, ty)| ty == ValueType::Math)
            .map(|&(s, _)| slot_to_cell[s.index()])
            .filter(|c| sources.contains(c))
            .collect();
        for &(s, from) in &self.seeds {
            let (scope, tslot, _) = self.essential_key(s);
            let carried = !self.reseed && self.session.carried(scope, tslot).is_some();
            let src = slot_to_cell[self.seed_source(slot_cells, from).index()];
            if dead_cell == Some(slot_to_cell[s.index()]) {
                continue;
            }
            let v = cells[src.index()];
            let seed = if math_cells.contains(&src) || v.is_nan() {
                v
            } else {
                self.engine.import(&Tree::<CellIdx>::Num(v)).to_value()
            };
            // The seed is an essential cell's default whether or not a
            // carried value replaces it (`Structure::essential_defaults`);
            // a seeded cell no student can write (ADR 0018) is a constant, at it.
            // `defaults` holds the essential cells', which follow the
            // `n_const` constants.
            let cell = slot_to_cell[s.index()].index();
            let essential = (n_const..n_const + defaults.len()).contains(&cell);
            if essential {
                defaults[cell - n_const] = seed;
            }
            if !carried || !essential {
                cells[cell] = seed;
            }
        }
    }

    /// The instructions this build folds, by defining slot: an operator
    /// whose every input, and every flag that holds it, is a constant made
    /// in the slot's own scope or one around it, so it is evaluated once as
    /// the build ends and its outputs are constants. A counted value is never
    /// folded. Nothing folds where the load asked for every instruction.
    fn folded_slots(
        &self,
        slot_cells: &SlotCells,
        essential: &[bool],
        pruned: &dyn Fn(usize) -> bool,
    ) -> Vec<bool> {
        let n = self.sources.len();
        let mut fold = vec![false; n];
        if !self.compiled.plans.fold {
            return fold;
        }
        let counted = |s: SlotId| self.port_attrs(s).has(PortAttrs::COUNTED);
        let candidates: Vec<SlotId> = SlotId::below(n)
            .filter(|&s| {
                slot_cells.defines(s)
                    && matches!(self.sources[s.index()], BuiltSource::Op(..))
                    && !pruned(s.index())
                    && !counted(s)
            })
            .collect();
        loop {
            let mut changed = false;
            for &s in &candidates {
                if fold[s.index()] {
                    continue;
                }
                let scope = self.slot_scope[s.index()];
                let def = slot_cells.def_of(self, s, &self.sources[s.index()]);
                let constant = def.needs().all(|input| {
                    let d = slot_cells.def(slot_cells.cell_of(input));
                    let made = match self.sources[d.index()] {
                        BuiltSource::Const(_) => Some(d) != self.missing,
                        BuiltSource::Given(_) => !essential[d.index()],
                        BuiltSource::Op(..) => fold[d.index()],
                        BuiltSource::VecOut(head, _) => fold[head.index()],
                        _ => false,
                    };
                    made && self.encloses(self.slot_scope[d.index()], scope)
                });
                if constant {
                    fold[s.index()] = true;
                    changed = true;
                }
            }
            if !changed {
                return fold;
            }
        }
    }

    /// Whether scope `outer` is `inner` or one around it.
    fn encloses(&self, outer: ScopeId, mut inner: ScopeId) -> bool {
        loop {
            if inner == outer {
                return true;
            }
            if inner == ScopeId::DOCUMENT {
                return false;
            }
            inner = self.scopes[inner].0;
        }
    }

    /// A component slot's template and template slot (the element's slot
    /// offset plus the prop's position), what a port's attributes are
    /// indexed by; None
    /// for a slot of no element, or past the slots its element reserves.
    pub(in crate::build) fn template_slot(
        &self,
        slot: SlotId,
    ) -> Option<(TemplateId, TemplateSlot)> {
        let comp = self.slot_comp[slot.index()];
        if comp == CompIdx::NONE {
            return None;
        }
        let i = self.comp_instance[comp.index()];
        if i.is_none() {
            return None;
        }
        let inst = self.instances[i.index()];
        let tpl = &self.compiled.plans.templates[inst.template.index()];
        let (el, plan) = (tpl.row(inst.elem), tpl.plan(inst.elem));
        let pi = slot.get() - self.slot_base[comp.index()].get();
        if pi as usize >= plan.props.len().max(el.component_type.prop_defs().len()) {
            return None;
        }
        let sealed = self.compiled.plans.templates[inst.template.index()]
            .sealed
            .elems[inst.elem.index()];
        Some((inst.template, sealed.slot_off.offset(pi as usize)))
    }

    /// What the check found of slot `slot`'s port: nothing for a slot with
    /// no template slot.
    pub(in crate::build) fn port_attrs(&self, slot: SlotId) -> PortAttrs {
        self.template_slot(slot)
            .map(|(t, ts)| self.compiled.plans.port_attrs(t, ts))
            .unwrap_or_default()
    }

    /// An essential slot's key: its scope, its template slot (the element's
    /// slot offset plus the port's position), and its element's key and
    /// port.
    #[inline]
    pub(in crate::build) fn essential_key(
        &self,
        slot: SlotId,
    ) -> (ScopeId, TemplateSlot, (ElemKey, u32)) {
        let comp = self.slot_comp[slot.index()];
        let inst = self.instances[self.comp_instance[comp.index()].index()];
        let pi = slot.get() - self.slot_base[comp.index()].get();
        let sealed = self.compiled.plans.templates[inst.template.index()]
            .sealed
            .elems[inst.elem.index()];
        (
            inst.scope,
            sealed.slot_off.offset(pi as usize),
            (sealed.key, pi),
        )
    }
}

/// A template with its slot leaves replaced by cells.
fn rebind(t: &Tree<SlotId>, slot_to_cell: &[CellIdx]) -> Tree<CellIdx> {
    t.map_leaves(|s| slot_to_cell[s.index()])
}

fn has_math_leaf<L>(t: &Tree<L>) -> bool {
    match t {
        Tree::Cell { math, .. } => *math,
        Tree::Num(_) | Tree::Sym(_) => false,
        Tree::Add(ts) | Tree::Mul(ts) => ts.iter().any(has_math_leaf),
        Tree::Sub(a, b) | Tree::Div(a, b) | Tree::Pow(a, b) => has_math_leaf(a) || has_math_leaf(b),
        Tree::Neg(a) | Tree::Apply(_, a) => has_math_leaf(a),
    }
}

/// Distinct cell leaves of a tree, in first-seen order.
fn cell_leaves(t: &Tree<CellIdx>, out: &mut Vec<CellIdx>) {
    t.for_each_leaf(&mut |cell, _| {
        if !out.contains(&cell) {
            out.push(cell);
        }
    });
}

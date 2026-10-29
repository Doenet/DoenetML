//! Emit: merge aliases into cells with a union-find, number cells
//! (essential, fixed, derived), bind operators to instructions, and measure
//! structural depth.

use super::*;

impl<'c> Builder<'c> {
    pub(in crate::build) fn finish(mut self) -> std::result::Result<BuildOutput, Failure> {
        let profile = crate::profile::enabled();
        let clock = web_time::Instant::now();
        let lap = |what: &str| {
            if profile {
                eprintln!("    emit/{what}: {:.2?}", clock.elapsed());
            }
        };
        let n = self.sources.len();
        let mut uf = UnionFind::new(n);
        for (s, src) in self.sources.iter().enumerate() {
            if let BuiltSource::Alias(t) = src {
                uf.union(SlotId::from_index(s), *t);
            }
        }
        // The one non-alias slot in each class defines its cell.
        let mut class_def: Vec<SlotId> = vec![SlotId::NONE; n];
        for (s, src) in self.sources.iter().enumerate() {
            match src {
                BuiltSource::Alias(_) => {}
                BuiltSource::Unset => unreachable!(
                    "slot {} never received a source",
                    self.slot_label(SlotId::from_index(s))
                ),
                _ => {
                    let root = uf.find(SlotId::from_index(s)).index();
                    debug_assert!(class_def[root].is_none(), "two sources in one alias class");
                    class_def[root] = SlotId::from_index(s);
                }
            }
        }
        lap("union-find");

        // Number cells: essential classes first, then fixed, then derived.
        // Essential values come from the previous build when the slot existed.
        let roots: Vec<SlotId> = SlotId::below(n).map(|s| uf.find(s)).collect();
        // A class of aliases with no definer is a loop of aliases. When the
        // view folds iterations it may be a recurrence folded onto itself,
        // which the cycle check has judged; it becomes a constant here.
        for (s, &root) in roots.iter().enumerate() {
            let root = root.index();
            if class_def[root] == SlotId::NONE {
                if !self.view.folds_iterations() {
                    return Err(Failure {
                        error: Error::Cycle(self.slot_label(SlotId::from_index(s))),
                        node: None,
                    });
                }
                self.sources[s] = BuiltSource::Fixed(f64::NAN);
                class_def[root] = SlotId::from_index(s);
            }
        }
        // A value slot is essential when a student's action can write it,
        // and fixed otherwise (ADR 0018): by this build's own walk, by the
        // probe's record of the template slots it found writable, or, with
        // the classing off, always essential.
        let mut record = None;
        let essential: Vec<bool> = match &self.compiled.classes {
            Classes::Off => vec![true; n],
            Classes::Record(r) if !self.view.folds_iterations() => SlotId::below(n)
                .map(|s| {
                    self.template_slot(s)
                        .is_none_or(|(t, ts)| Classes::recorded(r, t, ts))
                })
                .collect(),
            Classes::Walk | Classes::Record(_) => {
                let writable = self.writable_slots(&roots, &class_def);
                if self.view.folds_iterations() {
                    record = Some(self.record_of(&writable));
                }
                writable
            }
        };
        // Which classes the document computes (ADR 0019): by the probe's
        // record of the template slots it found live, by this build's own
        // walk, or, with no record to read, all of them. Measured only:
        // nothing is pruned yet.
        let mut live_record = None;
        let live_slot: Vec<bool> = match &self.compiled.live {
            Classes::Off => vec![true; n],
            Classes::Record(r) if !self.view.folds_iterations() => self.live_by_record(r, &roots),
            Classes::Walk | Classes::Record(_) => {
                let live = self.live_slots(&roots, &class_def);
                if self.view.folds_iterations() {
                    live_record = Some(self.record_of(&live));
                }
                live
            }
        };
        #[cfg(feature = "testing")]
        let walked_slot = self.live_slots(&roots, &class_def);
        // A dead class gets no cell (ADR 0019): its slots name the one dead
        // cell. Not in the probe, whose build is not kept, nor where the
        // load asked for every cell (`LoadOptions::prune`). An essential
        // slot is always live; were one not, it would be kept. A vector
        // output goes with its head, whose instruction writes it.
        let prune = self.compiled.prune && !self.view.folds_iterations();
        let pruned = |s: usize| {
            let s = match self.sources[s] {
                BuiltSource::VecOut(head, _) => head.index(),
                _ => s,
            };
            prune
                && !live_slot[s]
                && !(matches!(
                    self.sources[s],
                    BuiltSource::Literal(_) | BuiltSource::Default(_)
                ) && essential[s])
        };
        let mut slot_cell: Vec<CellIdx> = vec![CellIdx::NONE; n];
        // Count each kind of defining slot first: the essential tables are
        // kept, and none of these should reserve more than it fills.
        let mut counts = [0usize; 4];
        let mut n_cells = 0;
        let mut any_dead = false;
        for (s, &root) in roots.iter().enumerate() {
            if class_def[root.index()].index() == s && pruned(s) {
                any_dead = true;
            } else if class_def[root.index()].index() == s {
                let (kind, n_out) = match &self.sources[s] {
                    BuiltSource::Literal(_) | BuiltSource::Default(_) if essential[s] => (0, 1),
                    BuiltSource::Literal(_) | BuiltSource::Default(_) => (1, 1),
                    BuiltSource::Fixed(_) => (1, 1),
                    BuiltSource::Op(spec, ..) => (2, spec.n_out()),
                    _ => (3, 0),
                };
                counts[kind] += 1;
                n_cells += n_out;
            }
        }
        // The dead cell, when there is one: counted here, so the arrays
        // below hold it without growing.
        n_cells += any_dead as usize;
        let mut cells = Vec::with_capacity(n_cells);
        let mut cell_def_slot: Vec<SlotId> = Vec::with_capacity(n_cells);
        let mut essential_slots: Vec<(ScopeId, u32)> = Vec::with_capacity(counts[0]);
        let mut essential_keys: Vec<(ElemKey, u32)> = Vec::with_capacity(counts[0]);
        let mut parked = self.session.parked.clone();
        // Restored values the build takes from `parked`: (cell, what was
        // parked, its key).
        let mut unparked: Vec<(CellIdx, crate::session::Parked, (ScopeId, u32))> = Vec::new();
        let mut essential_defaults: Vec<f64> = Vec::with_capacity(counts[0]);
        let mut fixed_defs = Vec::with_capacity(counts[1]);
        let mut derived_defs = Vec::with_capacity(counts[2]);
        let mut outputs = Vec::with_capacity(counts[3]);
        let mut dead_defs = Vec::new();
        for (s, &root) in roots.iter().enumerate() {
            let root = root.index();
            if class_def[root].index() != s {
                continue; // not the defining slot of its class
            }
            if pruned(s) {
                dead_defs.push(s);
                continue;
            }
            match &self.sources[s] {
                BuiltSource::Literal(_) | BuiltSource::Default(_) if !essential[s] => {
                    fixed_defs.push(s)
                }
                BuiltSource::Literal(v) | BuiltSource::Default(v) => {
                    let (scope, tslot, key) = self.essential_key(SlotId::from_index(s));
                    let mut value = self.session.carried(scope, tslot).unwrap_or(*v);
                    if !parked.is_empty()
                        && let Some(p) = parked.remove(&(scope, key.0, key.1))
                    {
                        value = p.value;
                        unparked.push((CellIdx::from_index(cells.len()), p, (scope, tslot)));
                    }
                    slot_cell[root] = CellIdx::from_index(cells.len());
                    cells.push(value);
                    cell_def_slot.push(SlotId::from_index(s));
                    essential_slots.push((scope, tslot));
                    essential_keys.push(key);
                    essential_defaults.push(*v);
                }
                BuiltSource::Fixed(_) => fixed_defs.push(s),
                BuiltSource::Op(..) => derived_defs.push(s),
                BuiltSource::VecOut(..) => outputs.push(s),
                _ => unreachable!(),
            }
        }
        let n_essential = cells.len();
        // The dead cell, first of the fixed cells: NaN, never computed,
        // and what every dead slot names.
        let dead_cell = (!dead_defs.is_empty()).then(|| {
            let dead = CellIdx::from_index(cells.len());
            cells.push(f64::NAN);
            cell_def_slot.push(SlotId::from_index(dead_defs[0]));
            for &s in &dead_defs {
                slot_cell[roots[s].index()] = dead;
            }
            dead
        });
        for &s in &fixed_defs {
            // A constant, or an author's value no student can change.
            let (BuiltSource::Fixed(v) | BuiltSource::Literal(v) | BuiltSource::Default(v)) =
                self.sources[s]
            else {
                unreachable!()
            };
            let root = roots[s].index();
            slot_cell[root] = CellIdx::from_index(cells.len());
            cells.push(v);
            cell_def_slot.push(SlotId::from_index(s));
        }
        let n_fixed = fixed_defs.len() + dead_cell.is_some() as usize;
        // A vector instruction's outputs are consecutive cells after its head.
        for &s in &derived_defs {
            let root = roots[s].index();
            slot_cell[root] = CellIdx::from_index(cells.len());
            let n_out = match self.sources[s] {
                BuiltSource::Op(spec, ..) => spec.n_out(),
                _ => 1,
            };
            for _ in 0..n_out {
                cells.push(f64::NAN);
                cell_def_slot.push(SlotId::from_index(s));
            }
        }
        for &s in &outputs {
            let BuiltSource::VecOut(head, k) = self.sources[s] else {
                unreachable!()
            };
            let head_cell = slot_cell[roots[head.index()].index()];
            debug_assert!(head_cell != CellIdx::NONE, "vector output before its head");
            slot_cell[roots[s].index()] = head_cell.offset(k as usize);
            cell_def_slot[(head_cell.offset(k as usize)).index()] = SlotId::from_index(s);
        }
        debug_assert_eq!(cells.len(), n_cells);
        let live_bits = |live: &[bool]| {
            let mut bits = vec![0u64; cells.len().div_ceil(64)];
            for (cell, &s) in cell_def_slot.iter().enumerate() {
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
        let slot_to_cell: Vec<CellIdx> = roots.iter().map(|&r| slot_cell[r.index()]).collect();
        self.seed_cells(
            &mut cells,
            &mut essential_defaults,
            &slot_to_cell,
            |s| class_def[roots[s.index()].index()],
            dead_cell,
        )
        .map_err(|error| Failure {
            error,
            node: self.failed_node,
        })?;
        lap("number cells");

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
            cells[c] = if p.fits(value_types[c], essential_defaults[c]) {
                std::sync::Arc::make_mut(&mut touched).insert(at);
                p.value
            } else {
                essential_defaults[c]
            };
        }
        let mut tapes = Vec::new();
        // Compile curves whose expression has a fixed shape into tapes, unless
        // the load asked for engine sampling.
        let compile = !self.session.sample_with_engine;
        let mut fixed_shape: HashMap<SlotId, Option<Handle>> = HashMap::new();
        for &s in &derived_defs {
            let (planned, start, count) = match &self.sources[s] {
                BuiltSource::Op(op, start, count) => (*op, *start, *count),
                _ => unreachable!(),
            };
            bound.clear();
            bound.extend(
                self.op_inputs[start as usize..start as usize + count as usize]
                    .iter()
                    .map(|&i| slot_to_cell[i.index()]),
            );
            // The walk follows every input, so a live instruction reads no
            // dead cell; the record, made from the probe's walk, keeps one
            // in every build (`tests/live.rs`). A build that breaks that
            // would compute from NaN, so it fails instead.
            if let Some(dead) = dead_cell
                && let Some(k) = bound.iter().position(|&c| c == dead)
            {
                let input = self.op_inputs[start as usize + k];
                return Err(Failure {
                    error: Error::Unchecked(format!(
                        "{} reads {}, which has no cell: the live slots are not closed under what reads them (ADR 0019)",
                        self.slot_label(SlotId::from_index(s)),
                        self.slot_label(input)
                    )),
                    node: None,
                });
            }
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
                let input = self.op_inputs[start as usize];
                // A derivative of a fixed shape is taken once, here; the tick
                // only fills in the parameters.
                if compile
                    && kind == SymKind::Derivative
                    && let Some(d) =
                        self.fixed_shape(SlotId::from_index(s), &slot_to_cell, &mut fixed_shape)
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
        lap("bind instructions");

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
        lap("prop cells");
        // Each component's public prop count, for the cycle labels below.
        let n_public: Vec<usize> = (CompIdx::below(n_comps))
            .map(|c| self.n_public(c))
            .collect();

        // The next session: this build's scopes and what is still parked;
        // the value store is shared, since the build only read it.
        let session = Session {
            seed: self.session.seed,
            sample_with_engine: self.session.sample_with_engine,
            scopes: self.scopes,
            values: self.session.values.clone(),
            counts: self.session.counts.clone(),
            parked,
            touched,
            runtime_strings: self.session.runtime_strings.clone(),
            engine: self.session.engine.clone(),
            last_build: (self.components.component_type.len(), self.sources.len()),
        };
        let comp_keys: Vec<ElemKey> = self
            .comp_instance
            .iter()
            .map(|&i| {
                if i == NONE {
                    return ElemKey::NONE;
                }
                let inst = self.instances[i as usize];
                self.compiled.templates[inst.template.index()].elems[inst.elem.index()].key
            })
            .collect();
        let structure = Structure {
            essential_slots,
            essential_keys,
            essential_defaults,
            repeats: self.repeats,
        };

        // Lazy labels for cycle errors.
        let slot_comp = self.slot_comp;
        let slot_base = self.slot_base;
        let component_types = self.components.component_type.clone();
        let names = self.components.name.clone();
        let dast = self.compiled.dast.clone();
        let cell_label = Box::new(move |cell: CellIdx| {
            let slot = cell_def_slot[cell.index()];
            let comp = slot_comp[slot.index()];
            if comp == CompIdx::NONE {
                return "(anonymous cell)".to_string();
            }
            let pi = slot.index() - slot_base[comp.index()].index();
            let owner = match names[comp.index()] {
                StrId::NONE => format!("<{}>#{}", component_types[comp.index()].tag(), comp),
                s => dast.strings.get(s).trim().to_string(),
            };
            match component_types[comp.index()].prop_name(n_public[comp.index()], pi) {
                Some(name) => format!("{owner}.{name}"),
                None => format!("{owner}.(hidden slot {pi})"),
            }
        });

        let mut strings = self.compiled.dast.strings.clone();
        for s in &self.compiled.extra_strings {
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
        Ok(BuildOutput {
            cells,
            n_essential,
            n_fixed,
            instrs,
            components,
            strings,
            root: self.root,
            structure,
            session,
            operands,
            value_types,
            tapes,
            comp_keys,
            cell_label,
            record,
            live,
            live_record,
            structural_depth: self.structural_depth,
            warnings: self.diagnostics,
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
        while let BuiltSource::Alias(t) = self.sources[root.index()] {
            root = t;
        }
        if let Some(&h) = memo.get(&root) {
            return h;
        }
        let h = match self.sources[root.index()] {
            BuiltSource::Fixed(h) if !h.is_nan() => Some(Handle::from_value(h)),
            BuiltSource::Op(PlannedOp::Template { template, .. }, _, _) => {
                let tree = rebind(&self.sym_templates[template.index()], slot_to_cell);
                if has_math_leaf(&tree) {
                    None
                } else {
                    Some(self.engine.import(&tree))
                }
            }
            BuiltSource::Op(PlannedOp::Spec(OpSpec::Sym(SymKind::Derivative)), start, _) => {
                let input = self.op_inputs[start as usize];
                self.fixed_shape(input, slot_to_cell, memo)
                    .map(|h| self.engine.derivative(h, "x"))
            }
            _ => None,
        };
        memo.insert(root, h);
        h
    }

    /// Give each seeded essential math cell (`Source::MathEssentialFrom`)
    /// its first expression: the source cell's value, unless the cell
    /// carried a value over from an earlier build. The source must be
    /// essential or fixed, so its value is known before anything computes;
    /// that is checked by the source's kind (`def` gives a slot's class's
    /// defining slot), so a seed no output reads, which has no cell
    /// (`dead_cell`, ADR 0019), is checked all the same.
    fn seed_cells(
        &mut self,
        cells: &mut [f64],
        defaults: &mut [f64],
        slot_to_cell: &[CellIdx],
        def: impl Fn(SlotId) -> SlotId,
        dead_cell: Option<CellIdx>,
    ) -> Result<()> {
        if self.seeds.is_empty() {
            return Ok(());
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
            let src = slot_to_cell[from.index()];
            // A collect's count is a constant in every real build; the probe
            // only stands it in by an operator over the repeats' counts.
            let stand_in = || {
                self.follows_counts
                    .iter()
                    .any(|&c| slot_to_cell[self.slot(c, prop::collect::COUNT).index()] == src)
            };
            let computed = matches!(
                self.sources[def(from).index()],
                BuiltSource::Op(..) | BuiltSource::VecOut(..)
            );
            if computed && !stand_in() {
                // The seeded element is boxed (ADR 0013).
                let node = self.components.dast_node[self.slot_comp[s.index()].index()];
                self.failed_node = (node != NodeId::NONE).then_some(node);
                return Err(Error::Unsupported(format!(
                    "prefill=\"${}\": a prefill reference must name a value that is not computed",
                    self.slot_label(from)
                )));
            }
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
            // a seeded cell no student can write (ADR 0018) is fixed at it.
            let cell = slot_to_cell[s.index()].index();
            let essential = cell < defaults.len();
            if essential {
                defaults[cell] = seed;
            }
            if !carried || !essential {
                cells[cell] = seed;
            }
        }
        Ok(())
    }

    /// A component slot's template and template slot (the element's slot
    /// offset plus the prop's position), what `Classes::Record` is indexed
    /// by; None for a slot of no element, or past the slots its element
    /// reserves: a copy that takes its referent's list has as many points
    /// as the referent (`place_list_copies`), and no template slot names
    /// them.
    pub(in crate::build) fn template_slot(&self, slot: SlotId) -> Option<(usize, u32)> {
        let comp = self.slot_comp[slot.index()];
        if comp == CompIdx::NONE {
            return None;
        }
        let i = self.comp_instance[comp.index()];
        if i == NONE {
            return None;
        }
        let inst = self.instances[i as usize];
        let el = &self.compiled.templates[inst.template.index()].elems[inst.elem.index()];
        let pi = slot.get() - self.slot_base[comp.index()].get();
        if pi as usize >= el.props.len().max(el.component_type.prop_defs().len()) {
            return None;
        }
        Some((inst.template.index(), el.slot_off + pi))
    }

    /// The template slots of the slots `marked`, per template: the record
    /// every later build classes by (`Classes::Record`), of the writable
    /// slots (ADR 0018) or the live ones (ADR 0019).
    fn record_of(&self, marked: &[bool]) -> Vec<Vec<u64>> {
        let mut record: Vec<Vec<u64>> = self
            .compiled
            .templates
            .iter()
            .map(|t| vec![0; (t.n_slots as usize).div_ceil(64)])
            .collect();
        for (s, _) in marked.iter().enumerate().filter(|(_, w)| **w) {
            if let Some((t, ts)) = self.template_slot(SlotId::from_index(s)) {
                record[t][ts as usize / 64] |= 1 << (ts % 64);
            }
        }
        record
    }

    /// Per slot, whether the probe's record makes its class live: when a
    /// slot of it has a template slot the record marks, or when none of
    /// its slots has a template slot to name it by, so the record cannot
    /// say, and the class is kept.
    fn live_by_record(&self, record: &[Vec<u64>], roots: &[SlotId]) -> Vec<bool> {
        let n = roots.len();
        let (mut live, mut named) = (vec![false; n], vec![false; n]);
        for (s, &root) in roots.iter().enumerate() {
            if let Some((t, ts)) = self.template_slot(SlotId::from_index(s)) {
                named[root.index()] = true;
                if Classes::recorded(record, t, ts) {
                    live[root.index()] = true;
                }
            }
        }
        roots
            .iter()
            .map(|&r| live[r.index()] || !named[r.index()])
            .collect()
    }

    /// An essential slot's key: its scope, its template slot (the element's
    /// slot offset plus the prop's position; a document's boxes are fixed
    /// at load, ADR 0014, so the offsets are the same in every build), and
    /// its element's key and position, `HIDDEN` marking a hidden slot.
    #[inline]
    pub(in crate::build) fn essential_key(&self, slot: SlotId) -> (ScopeId, u32, (ElemKey, u32)) {
        let comp = self.slot_comp[slot.index()];
        let inst = self.instances[self.comp_instance[comp.index()] as usize];
        let pi = slot.get() - self.slot_base[comp.index()].get();
        let el = &self.compiled.templates[inst.template.index()].elems[inst.elem.index()];
        let prop = if (pi as usize) < self.n_public(comp) {
            pi
        } else {
            pi | HIDDEN
        };
        (inst.scope, el.slot_off + pi, (el.key, prop))
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

/// Distinct cell leaves of a tree, rebound to cells (`rebind`), in
/// first-seen order.
fn cell_leaves(t: &Tree<CellIdx>, out: &mut Vec<CellIdx>) {
    t.for_each_leaf(&mut |cell, _| {
        if !out.contains(&cell) {
            out.push(cell);
        }
    });
}

/// Alias classes of slots.
struct UnionFind {
    parent: Vec<SlotId>,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        UnionFind {
            parent: SlotId::below(n).collect(),
        }
    }
    fn find(&mut self, mut x: SlotId) -> SlotId {
        while self.parent[x.index()] != x {
            let p = self.parent[x.index()];
            self.parent[x.index()] = self.parent[p.index()];
            x = p;
        }
        x
    }
    fn union(&mut self, a: SlotId, b: SlotId) {
        let (ra, rb) = (self.find(a), self.find(b));
        if ra != rb {
            self.parent[ra.index()] = rb;
        }
    }
}

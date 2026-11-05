//! The request entry points: one tick, from a renderer's requests to the
//! cells that changed. A renderer may request only an input's cell; a submit
//! and a trigger are actions, each carried out as one tick of its own. A
//! tick runs the sticky pre-pass, inversion and recompute, then a rebuild if
//! a structural cell changed.

use std::sync::Arc;

use super::{CellIdx, Document};
use crate::program::SymRun;
use crate::tick::eval::{DirtyClosure, Recompute};
use crate::tick::invert::{PointRequest, invert_requests};
use crate::tick::{Request, TickOutcome};

impl Document {
    /// Apply requests: invert each to an essential cell (later requests win
    /// when two land on one cell), recompute, and report what changed. A
    /// request on a cell that is not interactive is refused, in `dropped`.
    pub fn request(&mut self, requests: &[Request]) -> TickOutcome {
        self.request_with_groups(requests, &[])
    }

    /// Apply a point group: points dragged together, which keep their shape
    /// when one of them is constrained.
    pub fn request_points(&mut self, points: &[PointRequest]) -> TickOutcome {
        self.request_with_groups(&[], &[points.to_vec()])
    }

    /// Scalar requests and point groups in one tick, recomputed as
    /// `set_evaluator` chose.
    pub fn request_with_groups(
        &mut self,
        requests: &[Request],
        groups: &[Vec<PointRequest>],
    ) -> TickOutcome {
        self.tick(requests, groups, true)
    }

    /// A tick on any cell, without the check that it is an input's.
    pub(crate) fn tick_unchecked(
        &mut self,
        requests: &[Request],
        groups: &[Vec<PointRequest>],
    ) -> TickOutcome {
        self.tick(requests, groups, false)
    }

    /// Choose how ticks recompute: "full" or "dirty-closure" (the
    /// default). False for any other name.
    pub fn set_evaluator(&mut self, name: &str) -> bool {
        match Recompute::named(name) {
            Some(r) => {
                self.recompute = r;
                true
            }
            None => false,
        }
    }

    /// The name of how ticks recompute.
    pub fn evaluator(&self) -> &'static str {
        self.recompute.name()
    }

    fn tick(
        &mut self,
        requests: &[Request],
        groups: &[Vec<PointRequest>],
        checked: bool,
    ) -> TickOutcome {
        let mut tick = TickOutcome::default();
        // A request on a cell that is not an input's is refused (ADR 0018),
        // and one whose inverse would write a value reaching its cell along
        // more than one path, where it cannot land (ADR 0026).
        // An infinite ask is never meaningful state (NaN is: an emptied
        // input), and the current core rejects it; drop it before inverting,
        // with any value the cell cannot hold (a number asked of a math cell).
        let (mut accepted, refused): (Vec<Request>, Vec<Request>) =
            requests.iter().partition(|r| {
                (!checked || self.is_interactive(r.cell))
                    && !self.is_refused(r.cell)
                    && (!r.value.is_infinite() || self.accepts_infinity(r.cell))
                    && self.can_hold(r.cell, r.value)
            });
        tick.dropped.extend(refused);
        let mut finite_groups: Vec<Vec<PointRequest>> = Vec::with_capacity(groups.len());
        for g in groups {
            let refused = |p: &PointRequest| {
                p.values.iter().any(|v| v.is_infinite())
                    || (checked && !p.cells.iter().all(|&c| self.is_interactive(c)))
                    || p.cells.iter().any(|&c| self.is_refused(c))
            };
            if g.iter().any(refused) {
                tick.dropped.extend(g.iter().map(|p| Request {
                    cell: p.cells[0],
                    value: p.values[0],
                }));
            } else {
                finite_groups.push(g.clone());
            }
        }
        self.snap_sticky(&mut accepted, &mut finite_groups);
        let essentials = self.essentials();
        // The build's symbolic state and the document's engine, which are
        // separate fields, so both are lent at once.
        let mut sym = SymRun {
            state: &mut self.built.sym,
            engine: &mut self.math.engine,
        };
        let inv = invert_requests(
            &self.built.program,
            &mut sym,
            &self.built.cells,
            essentials.clone(),
            &accepted,
            &finite_groups,
        );
        tick.dropped.extend(inv.dropped);
        // The values the tick overwrites, so a failed rebuild can undo it.
        let mut before: Vec<(CellIdx, f64)> = Vec::new();
        // Every essential cell a request writes is touched (ADR 0017), even
        // with the value it had: a student who puts a point back where it
        // started put it there.
        let mut newly_touched = Vec::new();
        for &(cell, _) in &inv.writes {
            if essentials.contains(&cell.index()) {
                let at = self.built.structure.essential_slots[cell.index() - essentials.start];
                if Arc::make_mut(&mut self.session.touched).insert(at) {
                    newly_touched.push(at);
                }
            }
        }
        for (cell, value) in inv.writes {
            let old = self.built.cells[cell.index()];
            if value != old && !(value.is_nan() && old.is_nan()) {
                self.built.cells[cell.index()] = value;
                before.push((cell, old));
                tick.changed.push(cell);
            }
        }
        if !tick.changed.is_empty() {
            match self.recompute {
                Recompute::Full => self.built.program.run_all_tracking(
                    &mut sym,
                    &mut self.built.cells,
                    &mut tick.changed,
                ),
                Recompute::DirtyClosure => self
                    .built
                    .dirty
                    .get_or_insert_with(|| {
                        DirtyClosure::new(&self.built.program, self.built.cells.len())
                    })
                    .recompute(
                        &self.built.program,
                        &mut sym,
                        &mut self.built.cells,
                        &mut tick.changed,
                    ),
            }
            if !self.structure_settled() {
                match self.rebuild() {
                    Ok(passes) => {
                        tick.rebuilt = true;
                        tick.rebuild_passes = passes;
                        tick.changed.clear();
                    }
                    Err(e) => {
                        // The document could not take the structure the
                        // writes ask for. Undo them, so an input never
                        // shows a count its iterations do not match, and
                        // report every request of the tick as dropped.
                        for &(cell, old) in &before {
                            self.built.cells[cell.index()] = old;
                        }
                        let touched = Arc::make_mut(&mut self.session.touched);
                        for at in &newly_touched {
                            touched.remove(at);
                        }
                        self.recompute();
                        tick.changed.clear();
                        tick.dropped.extend(accepted);
                        tick.dropped
                            .extend(finite_groups.iter().flatten().map(|p| Request {
                                cell: p.cells[0],
                                value: p.values[0],
                            }));
                        tick.rebuild_error = Some(e.to_string());
                    }
                }
            }
        }
        tick
    }
}

impl Document {
    /// Press a `<triggerSet>` (or a lone `<updateValue>`), an action: every
    /// `<updateValue>` under it requests its `newValue`'s
    /// current value on its target's cell, all in one tick, in document
    /// order. A target is not interactive: only the press writes it.
    pub fn trigger(&mut self, comp: crate::document::CompIdx) -> TickOutcome {
        use crate::components::{ComponentType, prop::update_value};
        let mut requests = Vec::new();
        let mut stack = vec![comp];
        while let Some(c) = stack.pop() {
            if self.component_type(c) == ComponentType::UpdateValue {
                let cells = self.comp_cells(c);
                requests.push(Request {
                    cell: cells[update_value::TARGET],
                    value: self.cells[cells[update_value::NEW_VALUE].index()],
                });
            }
            let kids: Vec<_> = self
                .children(c)
                .filter_map(|k| match k {
                    crate::document::Child::Component(k) => Some(k),
                    _ => None,
                })
                .collect();
            stack.extend(kids.into_iter().rev());
        }
        self.tick_unchecked(&requests, &[])
    }

    /// The text of a literal attribute of the element a component was made
    /// from: presentation the core does not keep as state (a style number,
    /// decimals to display, a width). None for a copy, which has no
    /// element, and for an attribute holding a reference.
    pub fn attr_text(&self, comp: crate::document::CompIdx, name: &str) -> Option<String> {
        let node = self.components.dast_node[comp.index()];
        if node == crate::dast::NodeId::NONE {
            return None;
        }
        let attrs = &self.loaded.literal_attrs;
        let &(_, value) = attrs
            .of(node)
            .iter()
            .find(|&&(n, _)| self.strings.get(n).eq_ignore_ascii_case(name))?;
        Some(attrs.text(&self.strings, value).to_string())
    }

    /// Every literal attribute of every element (`name` aside), keyed by
    /// DAST node.
    pub fn literal_attrs(&self) -> Vec<(crate::dast::NodeId, Vec<(&str, String)>)> {
        let literal = &self.loaded.literal_attrs;
        literal
            .iter()
            .filter_map(|(n, attrs)| {
                let attrs: Vec<(&str, String)> = attrs
                    .iter()
                    .map(|&(k, v)| (self.strings.get(k), v))
                    .filter(|(k, _)| !k.eq_ignore_ascii_case("name"))
                    .map(|(k, v)| (k, literal.text(&self.strings, v).to_string()))
                    .collect();
                (!attrs.is_empty()).then_some((n, attrs))
            })
            .collect()
    }
}

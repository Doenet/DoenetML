//! The request entry points: one tick, from a renderer's requests to the
//! cells that changed. A renderer may request only an input's cell (ADR
//! 0018, `interactive.rs`); a submit and a trigger are actions, which the
//! core carries out as one tick of its own. The stages themselves are in `tick/`: the sticky
//! pre-pass (`sticky.rs`, here because it reads the component table), then
//! inversion (`tick/invert.rs`) and recompute (`tick/eval.rs`), then a
//! rebuild if a structural cell changed (`load.rs`).

use std::sync::Arc;

use super::{CellIdx, Document};
use crate::tick::eval::{Evaluator, Recompute};
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
    /// when one of them is constrained (ADR 0006).
    pub fn request_points(&mut self, points: &[PointRequest]) -> TickOutcome {
        self.request_with_groups(&[], &[points.to_vec()])
    }

    /// Scalar requests and point groups in one tick, recomputed by the
    /// document's evaluator (`set_evaluator`).
    pub fn request_with_groups(
        &mut self,
        requests: &[Request],
        groups: &[Vec<PointRequest>],
    ) -> TickOutcome {
        self.tick(None, requests, groups, true)
    }

    /// One tick recomputed by `evaluator` instead of the document's: a
    /// strategy under test.
    pub fn request_with(
        &mut self,
        evaluator: &mut dyn Evaluator,
        requests: &[Request],
        groups: &[Vec<PointRequest>],
    ) -> TickOutcome {
        self.tick(Some(evaluator), requests, groups, true)
    }

    /// A tick on any cell, without the check that it is an input's: an
    /// action's own writes, and `testing::request_unchecked`.
    pub(crate) fn tick_unchecked(
        &mut self,
        requests: &[Request],
        groups: &[Vec<PointRequest>],
    ) -> TickOutcome {
        self.tick(None, requests, groups, false)
    }

    /// Choose how ticks recompute: "full" or "dirty-closure" (the
    /// default). False for any other name.
    pub fn set_evaluator(&mut self, name: &str) -> bool {
        match Recompute::named(name) {
            Some(e) => {
                self.evaluator = e;
                true
            }
            None => false,
        }
    }

    /// The name of how ticks recompute.
    pub fn evaluator(&self) -> &'static str {
        self.evaluator.name()
    }

    fn tick(
        &mut self,
        evaluator: Option<&mut dyn Evaluator>,
        requests: &[Request],
        groups: &[Vec<PointRequest>],
        checked: bool,
    ) -> TickOutcome {
        let mut tick = TickOutcome::default();
        // A request on a cell that is not an input's is refused (ADR 0018).
        // An infinite ask is never meaningful state (NaN is: an emptied
        // input), and the current core rejects it; drop it before inverting,
        // with any value the cell cannot hold (a number asked of a math cell).
        let (mut accepted, refused): (Vec<Request>, Vec<Request>) =
            requests.iter().partition(|r| {
                (!checked || self.is_interactive(r.cell))
                    && (!r.value.is_infinite() || self.accepts_infinity(r.cell))
                    && self.can_hold(r.cell, r.value)
            });
        tick.dropped.extend(refused);
        let mut finite_groups: Vec<Vec<PointRequest>> = Vec::with_capacity(groups.len());
        for g in groups {
            let refused = |p: &PointRequest| {
                p.values.iter().any(|v| v.is_infinite())
                    || (checked && !p.cells.iter().all(|&c| self.is_interactive(c)))
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
        let inv = invert_requests(
            &self.program,
            &self.cells,
            self.n_essential,
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
            if (cell as usize) < self.n_essential {
                let at = self.structure.essential_slots[cell as usize];
                if Arc::make_mut(&mut self.session.touched).insert(at) {
                    newly_touched.push(at);
                }
            }
        }
        for (cell, value) in inv.writes {
            let old = self.cells[cell as usize];
            if value != old && !(value.is_nan() && old.is_nan()) {
                self.cells[cell as usize] = value;
                before.push((cell, old));
                tick.changed.push(cell);
            }
        }
        if !tick.changed.is_empty() {
            let evaluator = match evaluator {
                Some(e) => e,
                None => &mut self.evaluator,
            };
            evaluator.recompute(&self.program, &mut self.cells, &mut tick.changed);
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
                            self.cells[cell as usize] = old;
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
    /// Press a `<triggerSet>` (or a lone `<updateValue>`), an action (ADR
    /// 0018): every `<updateValue>` under it requests its `newValue`'s
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
                    value: self.cells[cells[update_value::NEW_VALUE] as usize],
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
        let node = self.components.dast_node[comp as usize];
        if node == crate::document::NONE {
            return None;
        }
        let &(_, value) = self
            .literal_attrs
            .of(node)
            .iter()
            .find(|&&(n, _)| self.strings.get(n).eq_ignore_ascii_case(name))?;
        Some(self.literal_attrs.text(&self.strings, value).to_string())
    }

    /// Every literal attribute of every element (`name` aside), keyed by
    /// DAST node, for a renderer that reads presentation once per build
    /// instead of asking per component (`attr_text`).
    pub fn literal_attrs(&self) -> Vec<(crate::dast::NodeId, Vec<(&str, String)>)> {
        self.literal_attrs
            .iter()
            .filter_map(|(n, attrs)| {
                let attrs: Vec<(&str, String)> = attrs
                    .iter()
                    .map(|&(k, v)| (self.strings.get(k), v))
                    .filter(|(k, _)| !k.eq_ignore_ascii_case("name"))
                    .map(|(k, v)| (k, self.literal_attrs.text(&self.strings, v).to_string()))
                    .collect();
                (!attrs.is_empty()).then_some((n, attrs))
            })
            .collect()
    }
}

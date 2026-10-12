//! The request entry points: one tick, from a renderer's requests to the
//! cells that changed. The stages themselves are in `tick/`: the sticky
//! pre-pass (`sticky.rs`, here because it reads the component table), then
//! inversion (`tick/invert.rs`) and recompute (`tick/eval.rs`), then a
//! rebuild if a structural cell changed (`load.rs`).

use super::Document;
use crate::tick::eval::{Evaluator, FullRecompute};
use crate::tick::invert::{PointRequest, invert_requests};
use crate::tick::{Request, TickOutcome};

impl Document {
    /// Apply requests: invert each to an essential cell (later requests win
    /// when two land on one cell), recompute, and report what changed.
    pub fn request(&mut self, requests: &[Request]) -> TickOutcome {
        self.request_with_groups(&mut FullRecompute, requests, &[])
    }

    /// Apply a point group: points dragged together, which keep their shape
    /// when one of them is constrained (ADR 0006).
    pub fn request_points(&mut self, points: &[PointRequest]) -> TickOutcome {
        self.request_with_groups(&mut FullRecompute, &[], &[points.to_vec()])
    }

    /// Scalar requests and point groups in one tick.
    pub fn request_with_groups(
        &mut self,
        evaluator: &mut (impl Evaluator + ?Sized),
        requests: &[Request],
        groups: &[Vec<PointRequest>],
    ) -> TickOutcome {
        let mut tick = TickOutcome::default();
        // An infinite ask is never meaningful state (NaN is: an emptied
        // input), and the current core rejects it; drop it before inverting.
        let (mut finite, infinite): (Vec<Request>, Vec<Request>) = requests
            .iter()
            .partition(|r| !r.value.is_infinite() || self.accepts_infinity(r.cell));
        tick.dropped.extend(infinite);
        let mut finite_groups: Vec<Vec<PointRequest>> = Vec::with_capacity(groups.len());
        for g in groups {
            if g.iter().any(|p| p.values.iter().any(|v| v.is_infinite())) {
                tick.dropped.extend(g.iter().map(|p| Request {
                    cell: p.cells[0],
                    value: p.values[0],
                }));
            } else {
                finite_groups.push(g.clone());
            }
        }
        self.snap_sticky(&mut finite, &mut finite_groups);
        let inv = invert_requests(
            &self.program,
            &self.cells,
            self.n_essential,
            &finite,
            &finite_groups,
        );
        tick.dropped.extend(inv.dropped);
        for (cell, value) in inv.writes {
            let old = self.cells[cell as usize];
            if value != old && !(value.is_nan() && old.is_nan()) {
                self.cells[cell as usize] = value;
                tick.changed.push(cell);
            }
        }
        if !tick.changed.is_empty() {
            evaluator.recompute(&self.program, &mut self.cells, &mut tick.changed);
            if !self.structure_settled() {
                match self.rebuild() {
                    Ok(()) => {
                        tick.rebuilt = true;
                        tick.changed.clear();
                    }
                    Err(e) => tick.rebuild_error = Some(e.to_string()),
                }
            }
        }
        tick
    }
}

impl Document {
    /// Press a `<triggerSet>` (or a lone `<updateValue>`): every
    /// `<updateValue>` under it requests its `newValue`'s current value on
    /// its target's cell, all in one tick, in document order.
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
        self.request(&requests)
    }

    /// The text of a literal attribute of the element a component was made
    /// from: presentation the core does not keep as state (a style number,
    /// decimals to display, a width). None for a copy, which has no
    /// element, and for an attribute holding a reference.
    pub fn attr_text(&self, comp: crate::document::CompIdx, name: &str) -> Option<String> {
        use crate::dast::NodeKind;
        let node = self.components.dast_node[comp as usize];
        if node == crate::document::NONE {
            return None;
        }
        let a = self.dast.attr(node, name)?;
        let mut s = String::new();
        for &n in self.dast.attr_children(a) {
            match self.dast.kind(n) {
                NodeKind::Text => s.push_str(self.dast.str(n)),
                NodeKind::Macro => return None,
                _ => {}
            }
        }
        Some(s)
    }

    /// Every literal attribute of every element (`name` aside), keyed by
    /// DAST node, for a renderer that reads presentation once per build
    /// instead of asking per component (`attr_text`).
    pub fn literal_attrs(&self) -> Vec<(crate::dast::NodeId, Vec<(&str, String)>)> {
        use crate::dast::NodeKind;
        let d = &self.dast;
        let mut out = Vec::new();
        for n in 0..d.len() as crate::dast::NodeId {
            if d.kind(n) != NodeKind::Element || d.attrs(n).is_empty() {
                continue;
            }
            let attrs: Vec<(&str, String)> = d
                .attrs(n)
                .filter(|&a| !d.attr_name(a).eq_ignore_ascii_case("name"))
                .filter_map(|a| {
                    let mut s = String::new();
                    for &c in d.attr_children(a) {
                        match d.kind(c) {
                            NodeKind::Text => s.push_str(d.str(c)),
                            NodeKind::Macro => return None,
                            _ => {}
                        }
                    }
                    Some((d.attr_name(a), s))
                })
                .collect();
            if !attrs.is_empty() {
                out.push((n, attrs));
            }
        }
        out
    }
}

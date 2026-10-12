//! Sticky groups as a pre-pass on the requests a tick receives
//! (ADR 0007). After every build the document records each group's members
//! as cells; a request that names a member's cell is snapped before it is
//! inverted. Requests that reach a member's cells only through inversion
//! (from a cell derived from a member) are not snapped: snapping is a
//! response to a drag, and the pre-pass sees drags as the renderer sends
//! them.

use std::borrow::Cow;
use std::collections::HashSet;

use super::*;
use crate::program::Op;
use crate::program::VecOp;
use crate::tick::invert::PointRequest;
use crate::tick::snap::{Member, Params, Pt, snap_group};

/// One group as cells.
#[derive(Debug, Clone)]
pub struct StickyTable {
    threshold: CellIdx,
    relative: CellIdx,
    /// The enclosing graph's xmin, xmax, ymin, ymax.
    bounds: Option<[CellIdx; 4]>,
    members: Vec<Member>,
    /// Each distinct point's x and y cells; members that share a point
    /// share its index.
    points: Vec<[CellIdx; 2]>,
    /// Member cell -> (point, coordinate).
    index: HashMap<CellIdx, (u32, u8)>,
    /// Per member, the `active` cells of the cases it sits in.
    gates: Vec<Vec<CellIdx>>,
}

impl Document {
    /// The sticky groups of a freshly built document. A group whose points
    /// are exactly an earlier group's (a copy of the group) is left out:
    /// snapping twice is not snapping once.
    pub(crate) fn sticky_tables(&self) -> Vec<StickyTable> {
        let mut seen: HashSet<Vec<CellIdx>> = HashSet::new();
        let mut out = Vec::new();
        for g in 0..self.components.len() as CompIdx {
            if self.component_type(g) != ComponentType::StickyGroup {
                continue;
            }
            let mut t = StickyTable {
                threshold: self.comp_cells(g)[prop::sticky_group::THRESHOLD],
                relative: self.comp_cells(g)[prop::sticky_group::RELATIVE],
                bounds: None,
                members: Vec::new(),
                points: Vec::new(),
                index: HashMap::new(),
                gates: Vec::new(),
            };
            if let Some(p) = self
                .parent(g)
                .filter(|&p| self.component_type(p) == ComponentType::Graph)
            {
                let c = self.comp_cells(p);
                t.bounds = Some([
                    c[prop::graph::XMIN],
                    c[prop::graph::XMAX],
                    c[prop::graph::YMIN],
                    c[prop::graph::YMAX],
                ]);
            }
            for (m, gates) in self.components.sticky_members(g) {
                let component_type = self.component_type(m);
                let (shape, first, max) = component_type.sticky_layout().unwrap();
                let cells = self.comp_cells(m);
                let n = if component_type == ComponentType::Polygon {
                    (self.cells[cells[prop::polygon::NUM_VERTICES] as usize].max(0.0) as usize)
                        .min(max)
                } else {
                    max
                };
                let rigid = n > 0 && self.is_shape_output(cells[first]);
                let mut ids = Vec::with_capacity(n);
                for i in 0..n {
                    let (x, y) = (cells[first + 2 * i], cells[first + 2 * i + 1]);
                    let id = match t.index.get(&x) {
                        Some(&(id, _)) => id,
                        None => {
                            let id = t.points.len() as u32;
                            t.points.push([x, y]);
                            t.index.insert(x, (id, 0));
                            t.index.insert(y, (id, 1));
                            id
                        }
                    };
                    ids.push(id);
                }
                t.members.push(Member {
                    shape,
                    rigid,
                    points: ids,
                });
                t.gates.push(gates);
            }
            let mut key: Vec<CellIdx> = t.points.iter().map(|p| p[0]).collect();
            key.sort_unstable();
            if !t.points.is_empty() && seen.insert(key) {
                out.push(t);
            }
        }
        out
    }

    /// A rigid polygon's vertices are outputs of its `Shape` instruction.
    fn is_shape_output(&self, cell: CellIdx) -> bool {
        let p = self.program.producer[cell as usize];
        p != u32::MAX
            && matches!(
                self.program.instrs[p as usize].op,
                Op::Vec(VecOp::Shape { .. }, ..)
            )
    }

    /// Snap the requests on member cells, in place. Points a snap moves
    /// that were not requested are appended as scalar requests.
    pub(crate) fn snap_sticky(
        &self,
        requests: &mut Vec<Request>,
        groups: &mut [Vec<PointRequest>],
    ) {
        for t in &self.sticky {
            let cur = |c: CellIdx| self.cells[c as usize];
            let mut requested: Vec<Option<Pt>> = vec![None; t.points.len()];
            let mut ask = |cell: CellIdx, value: f64| {
                if let Some(&(id, k)) = t.index.get(&cell) {
                    let [x, y] = t.points[id as usize];
                    let p = requested[id as usize].get_or_insert([cur(x), cur(y)]);
                    p[k as usize] = value;
                }
            };
            for (cell, value) in asked(requests, groups) {
                ask(cell, *value);
            }
            if requested.iter().all(Option::is_none) {
                continue;
            }
            let current: Vec<Pt> = t.points.iter().map(|&[x, y]| [cur(x), cur(y)]).collect();
            let bounds = t.bounds.map(|b| b.map(cur)).unwrap_or([f64::NAN; 4]);
            let params = Params::new(cur(t.threshold), cur(t.relative) != 0.0, bounds);
            let mut snapped: HashMap<CellIdx, f64> = HashMap::new();
            // Members in an inactive case are not there, in the current core.
            let members: Cow<[Member]> = if t.gates.iter().all(Vec::is_empty) {
                Cow::Borrowed(&t.members)
            } else {
                Cow::Owned(
                    t.members
                        .iter()
                        .zip(&t.gates)
                        .filter(|(_, g)| g.iter().all(|&c| cur(c) == 1.0))
                        .map(|(m, _)| m.clone())
                        .collect(),
                )
            };
            for (id, [x, y]) in snap_group(&members, &current, &requested, &params)
                .into_iter()
                .flatten()
            {
                let [cx, cy] = t.points[id as usize];
                snapped.insert(cx, x);
                snapped.insert(cy, y);
            }
            for (cell, value) in asked(requests, groups) {
                if let Some(v) = snapped.remove(&cell) {
                    *value = v;
                }
            }
            requests.extend(
                snapped
                    .into_iter()
                    .map(|(cell, value)| Request { cell, value }),
            );
        }
    }
}

/// Every (cell, requested value) of a tick: the scalar requests, then each
/// point group's coordinates.
fn asked<'r>(
    requests: &'r mut [Request],
    groups: &'r mut [Vec<PointRequest>],
) -> impl Iterator<Item = (CellIdx, &'r mut f64)> {
    let scalar = requests.iter_mut().map(|r| (r.cell, &mut r.value));
    let points = groups
        .iter_mut()
        .flatten()
        .flat_map(|p| p.cells.into_iter().zip(p.values.iter_mut()));
    scalar.chain(points)
}

//! The refuse analysis over the definitions (ADR 0035): the abstract build
//! warns of each interactive prop whose request would be refused or
//! dropped, once per template element, by the rule the tick applies to the
//! program (`program::refuse`).

use super::*;
use crate::program::refuse::{self, Finding, Graph, NodeKind};

/// The cells a build's slots will make, as the refuse analysis reads
/// them: a cell is named by the slot its aliases merged under, a node by
/// the defining slot of an operator.
struct Definitions<'a, 'c> {
    b: &'a Builder<'c>,
    cells: &'a SlotCells,
    /// Per slot, whether a student's action can write it: a given value
    /// whose defining slot it marks is essential (ADR 0018).
    essential: &'a [bool],
    /// The cells after the head that a vector operator's defining slot
    /// writes, by that slot.
    vec_outs: HashMap<SlotId, Vec<SlotId>>,
}

impl<'a, 'c> Definitions<'a, 'c> {
    fn new(b: &'a Builder<'c>, cells: &'a SlotCells, essential: &'a [bool]) -> Self {
        let mut vec_outs: HashMap<SlotId, Vec<(u8, SlotId)>> = HashMap::new();
        for s in SlotId::below(b.sources.len()) {
            if let BuiltSource::VecOut(head, k) = b.sources[s.index()]
                && cells.defines(s)
            {
                let op = cells.def(cells.cell_of(head));
                vec_outs.entry(op).or_default().push((k, cells.cell_of(s)));
            }
        }
        let vec_outs = vec_outs
            .into_iter()
            .map(|(op, mut outs)| {
                outs.sort_unstable();
                (op, outs.into_iter().map(|(_, c)| c).collect())
            })
            .collect();
        Definitions {
            b,
            cells,
            essential,
            vec_outs,
        }
    }

    /// Whether `cell` is a constant, as the program will have it: a
    /// constant, or a given value no student's action can write.
    fn constant(&self, cell: SlotId) -> Option<f64> {
        let d = self.cells.def(cell);
        match self.b.sources[d.index()] {
            BuiltSource::Const(v) => Some(v),
            BuiltSource::Given(v) if !self.essential[d.index()] => Some(v),
            _ => None,
        }
    }
}

impl Graph for Definitions<'_, '_> {
    type Cell = SlotId;
    type Node = SlotId;

    fn n_cells(&self) -> usize {
        self.b.sources.len()
    }

    fn n_nodes(&self) -> usize {
        self.b.sources.len()
    }

    fn producer(&self, cell: SlotId) -> Option<SlotId> {
        let d = self.cells.def(cell);
        match self.b.sources[d.index()] {
            BuiltSource::Op(..) => Some(d),
            BuiltSource::VecOut(head, _) => Some(self.cells.def(self.cells.cell_of(head))),
            _ => None,
        }
    }

    fn inputs(&self, node: SlotId) -> impl Iterator<Item = SlotId> + '_ {
        let (start, n) = match self.b.sources[node.index()] {
            BuiltSource::Op(_, start, n) => (start.index(), n as usize),
            _ => (0, 0),
        };
        self.b.op_inputs[start..start + n]
            .iter()
            .map(|&s| self.cells.cell_of(s))
    }

    fn outputs(&self, node: SlotId) -> impl Iterator<Item = SlotId> + '_ {
        std::iter::once(self.cells.cell_of(node))
            .chain(self.vec_outs.get(&node).into_iter().flatten().copied())
    }

    fn writes(&self, node: SlotId) -> u64 {
        match self.b.sources[node.index()] {
            BuiltSource::Op(planned, ..) => planned.writes(),
            _ => 0,
        }
    }

    fn kind(&self, node: SlotId) -> NodeKind {
        match self.b.sources[node.index()] {
            BuiltSource::Op(PlannedOp::Spec(OpSpec::Vec(_)), ..) => NodeKind::Vector,
            BuiltSource::Op(PlannedOp::Spec(OpSpec::Sym(_)), ..)
            | BuiltSource::Op(PlannedOp::Template { .. }, ..) => NodeKind::Symbolic,
            _ => NodeKind::Scalar,
        }
    }

    fn is_essential(&self, cell: SlotId) -> bool {
        let d = self.cells.def(cell);
        matches!(self.b.sources[d.index()], BuiltSource::Given(_)) && self.essential[d.index()]
    }

    /// A flag that is a constant and set holds the cell for good. The
    /// program sees every constant cell, a given value no input writes
    /// among them, where the walks' `Def::held_always` sees a `Const`
    /// alone: this reads the program's rule, so the warning and the
    /// refusal agree.
    fn held_always(&self, cell: SlotId) -> bool {
        self.cells.flags(cell).iter().any(|&f| {
            self.constant(self.cells.cell_of(f))
                .is_some_and(|v| v != 0.0)
        })
    }
}

impl<'c> Builder<'c> {
    /// Requests the program cannot land (ADR 0026): a warning for each
    /// interactive prop whose request would be refused and a note for each
    /// whose request would be dropped, once per template element, so a
    /// repeat's props are named once, not per iteration. Read off the
    /// definitions, with `essential` the writable walk's classes.
    pub(in crate::build) fn refuse_warnings(
        &self,
        slot_cells: &SlotCells,
        essential: &[bool],
    ) -> Vec<Diagnostic> {
        // Each asked cell once, with the first component and prop that
        // names it.
        let mut asked = Vec::new();
        let mut owner: Vec<(CompIdx, usize, usize)> = Vec::new();
        let mut is_asked = vec![false; self.sources.len()];
        for c in CompIdx::below(self.components.len()) {
            let ty = self.components.component_type[c.index()];
            let np = self.n_public(c);
            for pi in 0..np {
                let cell = slot_cells.cell_of(self.slot_base[c.index()].offset(pi));
                if !is_asked[cell.index()] && ty.is_interactive_prop(np, pi) {
                    is_asked[cell.index()] = true;
                    asked.push(cell);
                    owner.push((c, pi, np));
                }
            }
        }
        let findings = refuse::analyze(&Definitions::new(self, slot_cells, essential), &asked);
        // The findings come in the order of `asked`.
        let mut at = 0;
        let mut warnings = Vec::with_capacity(findings.len());
        for (cell, finding) in findings {
            while asked[at] != cell {
                at += 1;
            }
            let (c, pi, np) = owner[at];
            let node = Some(self.components.dast_node[c.index()]).filter(|n| !n.is_none());
            let ty = self.components.component_type[c.index()];
            let who = match self.components.name[c.index()] {
                StrId::NONE => format!("<{}>", ty.tag()),
                s => self.compiled.dast.strings.get(s).trim().to_string(),
            };
            let prop = match ty.prop_name(np, pi) {
                Some(name) => format!("{who}.{name}"),
                None => who,
            };
            warnings.push(match finding {
                Finding::Twice { source } => Diagnostic::warning(
                    "cells-request-reaches-its-source-twice",
                    node,
                    format!(
                        "a request on '{prop}' is refused: the value it would write, '{}', reaches it along more than one path, so the request could not land where it asks",
                        self.slot_label(slot_cells.def(source))
                    ),
                ),
                Finding::Drops => Diagnostic::info(
                    "cells-request-meets-no-inverse",
                    node,
                    format!(
                        "a request on '{prop}' is dropped: it reaches an operator with no inverse (a power or a comparison)"
                    ),
                ),
            });
        }
        warnings
    }
}

//! Which cells a renderer may request: the cells of the props each
//! component's definition marks `interactive` (ADR 0017's inputs). The core
//! accepts a request only on one of these (ADR 0018); a submit and a
//! trigger are actions, which write the cells they write themselves.

use super::*;

impl Document {
    /// One bit per cell, set for an interactive one; made once per build,
    /// so a tick checks a request without reading components. A cell
    /// several components share (a copy and its original) is interactive
    /// when any of them marks it.
    pub(crate) fn interactive_bits(&self) -> Vec<u64> {
        let mut bits = vec![0u64; self.cells.len().div_ceil(64)];
        for c in CompIdx::below(self.components.len()) {
            let component_type = self.component_type(c);
            let cells = self.comp_cells(c);
            for (pi, &cell) in cells.iter().enumerate() {
                if component_type.is_interactive_prop(cells.len(), pi) {
                    bits[cell.index() / 64] |= 1 << (cell.index() % 64);
                }
            }
        }
        bits
    }

    /// Every interactive cell, ascending, each once.
    pub fn interactive_cells(&self) -> Vec<CellIdx> {
        (CellIdx::below(self.cells.len()))
            .filter(|&c| self.is_interactive(c))
            .collect()
    }

    /// One bit per interactive cell whose inverse would write a value that
    /// reaches it along more than one path, where a request is refused
    /// (ADR 0026, `program::refuse`). Made once per build, after
    /// `interactive_bits`.
    pub(crate) fn refused_bits(&self) -> Vec<u64> {
        let mut bits = vec![0u64; self.cells.len().div_ceil(64)];
        let found = crate::program::refuse::analyze(
            &self.program.instrs,
            &self.program.operands,
            &self.program.vecs,
            &self.program.syms,
            self.n_essential,
            &self.interactive_cells(),
            &self.program.holds.held_always(
                &self.cells,
                self.n_essential..self.n_essential + self.n_fixed,
            ),
        );
        for (cell, finding) in found {
            if let crate::program::refuse::Finding::Twice { .. } = finding {
                bits[cell.index() / 64] |= 1 << (cell.index() % 64);
            }
        }
        bits
    }

    /// Whether a request on `cell` is refused: its inverse would write a
    /// value that reaches it along more than one path (ADR 0026).
    #[inline]
    pub fn is_refused(&self, cell: CellIdx) -> bool {
        self.refused
            .get(cell.index() / 64)
            .is_some_and(|w| w & (1 << (cell.index() % 64)) != 0)
    }

    /// Whether a renderer may request `cell`; see `interactive_cells`.
    #[inline]
    pub fn is_interactive(&self, cell: CellIdx) -> bool {
        self.interactive
            .get(cell.index() / 64)
            .is_some_and(|w| w & (1 << (cell.index() % 64)) != 0)
    }
}

//! Which cells a renderer may request: the cells of the props each
//! component's definition marks `interactive` (ADR 0017's inputs). The core
//! accepts a request on any cell; this is what a renderer is checked
//! against.

use super::*;

impl Document {
    /// Every interactive cell, ascending, each once. A cell several
    /// components share (a copy and its original, an `<updateValue>`'s
    /// target) is interactive when any of them marks it.
    pub fn interactive_cells(&self) -> Vec<CellIdx> {
        let mut out: Vec<CellIdx> = (0..self.components.len() as CompIdx)
            .flat_map(|c| {
                let component_type = self.component_type(c);
                let cells = self.comp_cells(c);
                (0..cells.len())
                    .filter(move |&pi| component_type.is_interactive_prop(cells.len(), pi))
                    .map(move |pi| cells[pi])
            })
            .collect();
        out.sort_unstable();
        out.dedup();
        out
    }

    /// Whether a renderer may request `cell`; see `interactive_cells`.
    pub fn is_interactive(&self, cell: CellIdx) -> bool {
        (0..self.components.len() as CompIdx).any(|c| {
            let component_type = self.component_type(c);
            let cells = self.comp_cells(c);
            cells
                .iter()
                .enumerate()
                .any(|(pi, &x)| x == cell && component_type.is_interactive_prop(cells.len(), pi))
        })
    }
}

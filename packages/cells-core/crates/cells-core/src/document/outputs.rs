//! Which cells leave the core (ADR 0019): the props a renderer reads, of
//! the components that are rendered, and the scores a grader reads. Each
//! component type marks its props `rendered` or `score` and says where it
//! is drawn (`Renders`); the viewer's test fails on a renderer's read of
//! any other cell. And which cells the document computes: the live ones,
//! which those outputs and the core itself read (`build/live.rs`).

use super::*;

impl Document {
    /// Per component, whether it is rendered: the document is, and a
    /// component is when its parent is and its type's rule allows it
    /// where it is, `InGraph` only with a `<graph>` above it.
    pub fn rendered_components(&self) -> Vec<bool> {
        self.components.placement(self.root).0
    }

    /// One bit per cell, set for an output: a rendered prop of a rendered
    /// component, or a score of any component. A cell several components
    /// share (a copy and its original) is an output when any of them
    /// makes it one.
    fn output_bits(&self) -> Vec<u64> {
        let rendered = self.rendered_components();
        let mut bits = vec![0u64; self.cells.len().div_ceil(64)];
        for c in CompIdx::below(self.components.len()) {
            let component_type = self.component_type(c);
            let cells = self.comp_cells(c);
            for (pi, &cell) in cells.iter().enumerate() {
                if component_type.is_score_prop(pi)
                    || (rendered[c.index()] && component_type.is_rendered_prop(cells.len(), pi))
                {
                    bits[cell.index() / 64] |= 1 << (cell.index() % 64);
                }
            }
        }
        bits
    }

    /// Every output cell, ascending, each once; see `output_bits`.
    pub fn output_cells(&self) -> Vec<CellIdx> {
        let bits = self.output_bits();
        (CellIdx::below(self.cells.len()))
            .filter(|&c| bits[c.index() / 64] & (1 << (c.index() % 64)) != 0)
            .collect()
    }

    /// Whether the document computes `cell`: some output, or the core
    /// itself, reads it (`build/live.rs`). With `LoadOptions::prune`, the
    /// default, every cell is but the dead cell, which every slot nothing
    /// reads names; without it, every cell is computed and this says
    /// which are needed.
    #[inline]
    pub fn is_live(&self, cell: CellIdx) -> bool {
        bit(&self.live.cells, cell)
    }

    /// Every live cell, ascending; see `is_live`.
    pub fn live_cells(&self) -> Vec<CellIdx> {
        (CellIdx::below(self.cells.len()))
            .filter(|&c| self.is_live(c))
            .collect()
    }
}

fn bit(bits: &[u64], cell: CellIdx) -> bool {
    bits.get(cell.index() / 64)
        .is_some_and(|w| w & (1 << (cell.index() % 64)) != 0)
}

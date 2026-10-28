//! Which cells leave the core (ADR 0019): the props a renderer reads, of
//! the components that are rendered, and the scores a grader reads. Each
//! component type marks its props `rendered` or `score` and says where it
//! is drawn (`Renders`); the viewer's test fails on a renderer's read of
//! any other cell.

use super::*;
use crate::components::Renders;

impl Document {
    /// Per component, whether it is rendered: the document is, and a
    /// component is when its parent is and its type's rule allows it
    /// where it is, `InGraph` only with a `<graph>` above it.
    pub fn rendered_components(&self) -> Vec<bool> {
        let mut rendered = vec![false; self.components.len()];
        let mut stack = vec![(self.root, false)];
        while let Some((c, in_graph)) = stack.pop() {
            match self.component_type(c).renders() {
                Renders::Never => continue,
                Renders::InGraph if !in_graph => continue,
                _ => {}
            }
            rendered[c as usize] = true;
            let in_graph = in_graph || self.component_type(c) == ComponentType::Graph;
            for child in self.children(c) {
                if let Child::Component(k) = child {
                    stack.push((k, in_graph));
                }
            }
        }
        rendered
    }

    /// One bit per cell, set for an output: a rendered prop of a rendered
    /// component, or a score of any component. A cell several components
    /// share (a copy and its original) is an output when any of them
    /// makes it one.
    fn output_bits(&self) -> Vec<u64> {
        let rendered = self.rendered_components();
        let mut bits = vec![0u64; self.cells.len().div_ceil(64)];
        for c in 0..self.components.len() as CompIdx {
            let component_type = self.component_type(c);
            let cells = self.comp_cells(c);
            for (pi, &cell) in cells.iter().enumerate() {
                if component_type.is_score_prop(pi)
                    || (rendered[c as usize] && component_type.is_rendered_prop(cells.len(), pi))
                {
                    bits[cell as usize / 64] |= 1 << (cell % 64);
                }
            }
        }
        bits
    }

    /// Every output cell, ascending, each once; see `output_bits`.
    pub fn output_cells(&self) -> Vec<CellIdx> {
        let bits = self.output_bits();
        (0..self.cells.len() as CellIdx)
            .filter(|&c| bits[c as usize / 64] & (1 << (c % 64)) != 0)
            .collect()
    }
}

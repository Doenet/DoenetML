//! The loaded document: the cell array, the program that derives cells, and
//! the columnar component layer that names cells for references and the
//! renderer.

use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use cells_sym::SymEngine;

use crate::build::{Repeat, ScopeId, Structure};

use crate::components::{ComponentType, prop};
use crate::dast::{Dast, StrId, StringTable};
use crate::program::Program;
use crate::tick::{Request, TickOutcome};

mod load;
mod paths;
mod request;
mod sections;
mod sticky;
mod table;

pub use load::{LoadOptions, LoadTimings};
pub use table::{Child, ComponentTable};

pub type CellIdx = u32;
pub type CompIdx = u32;
/// Upper bound on build passes before the structure must have settled.
const MAX_PASSES: usize = 8;

pub const NONE: u32 = u32::MAX;
/// Set on a `child_list` entry whose low bits are a string id, not a component.
pub const TEXT_BIT: u32 = 1 << 31;

#[derive(Debug, Clone)]
pub struct Document {
    /// All cells. Essential cells come first, then fixed, then derived.
    pub cells: Vec<f64>,
    /// Number of essential cells; `cells[..n_essential]` are essential.
    pub n_essential: usize,
    /// Fixed cells follow the essential ones: constants that are not state
    /// (iteration indices, collect counts, the missing-referent NaN).
    pub n_fixed: usize,
    pub program: Program,
    pub components: ComponentTable,
    /// Names and text, shared with the DAST they came from.
    pub strings: StringTable,
    /// Index of the root `<document>` component.
    pub root: CompIdx,
    pub structure: Structure,
    /// The document as loaded, kept for rebuilds.
    pub dast: Arc<Dast>,
    /// Sticky groups as cells, for the request pre-pass (ADR 0007).
    sticky: Vec<sticky::StickyTable>,
}

impl Document {
    #[allow(clippy::too_many_arguments)]
    pub(crate) fn new(
        cells: Vec<f64>,
        n_essential: usize,
        n_fixed: usize,
        program: Program,
        components: ComponentTable,
        strings: StringTable,
        root: CompIdx,
        structure: Structure,
        dast: Arc<Dast>,
    ) -> Self {
        let mut doc = Document {
            cells,
            n_essential,
            n_fixed,
            program,
            components,
            strings,
            root,
            structure,
            dast,
            sticky: Vec::new(),
        };
        doc.sticky = doc.sticky_tables();
        doc
    }

    /// Name of the symbolic engine ("A" or "R").
    pub fn engine_name(&self) -> &'static str {
        self.program.sym.engine.borrow().name()
    }

    /// Parse math text (what a student typed) into the engine: the value to
    /// request on a mathInput's `expr` cell.
    pub fn parse_math(&self, text: &str) -> std::result::Result<f64, String> {
        Ok(self.program.sym.engine.borrow_mut().parse(text)? as f64)
    }

    /// The expression a math cell holds, as text; empty when blank.
    pub fn math_text(&self, cell: CellIdx) -> String {
        let h = self.cells[cell as usize];
        if h.is_nan() {
            String::new()
        } else {
            self.program
                .sym
                .engine
                .borrow()
                .text(h as cells_sym::Handle)
        }
    }

    /// A `<mathInput>` holds any math value, infinity included; every other
    /// request site rejects an infinite ask as the current core does.
    fn accepts_infinity(&self, cell: CellIdx) -> bool {
        (0..self.components.len() as CompIdx).any(|c| {
            self.component_type(c) == ComponentType::MathInput
                && self.comp_cells(c)[prop::math_input::VALUE] == cell
        })
    }

    pub fn is_essential(&self, cell: CellIdx) -> bool {
        (cell as usize) < self.n_essential
    }

    /// A constant that is not state (an iteration index, a math handle, a
    /// `fixed` value): fixed cells follow the essential ones.
    pub fn is_fixed(&self, cell: CellIdx) -> bool {
        (self.n_essential..self.n_essential + self.n_fixed).contains(&(cell as usize))
    }

    /// Recompute all derived cells from the essential cells.
    pub fn recompute(&mut self) {
        self.program.run_all(&mut self.cells);
    }

    /// Write an essential cell and recompute. Panics if `cell` is derived.
    pub fn set_essential(&mut self, cell: CellIdx, value: f64) {
        assert!(self.is_essential(cell), "cell {cell} is derived");
        self.cells[cell as usize] = value;
        self.recompute();
    }
}

/// Heap footprint of a loaded document, by part.
#[derive(Debug, Clone, Copy, Default)]
pub struct MemoryEstimate {
    pub cells: usize,
    pub program: usize,
    pub components: usize,
    pub strings: usize,
    /// Scope table and essential keys kept for rebuilds.
    pub structure: usize,
    /// The retained DAST, kept for rebuilds (its string table is shared
    /// with `strings` and counted there only once by `total`).
    pub dast: usize,
}

impl MemoryEstimate {
    pub fn total(&self) -> usize {
        self.cells + self.program + self.components + self.strings + self.structure + self.dast
    }
}

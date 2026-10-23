//! The loaded document: the cell array, the program that derives cells, and
//! the columnar component layer that names cells for references and the
//! renderer.

use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use crate::sym::Handle;

use crate::build::{Repeat, ScopeId, Structure};
use crate::session::{Counts, Session};

use crate::components::{ComponentType, prop};
use crate::dast::{Dast, StrId, StringTable};
use crate::program::{Program, ValueType};
use crate::tick::eval::Recompute;
use crate::tick::{Request, TickOutcome};

mod interactive;
mod load;
mod paths;
mod request;
mod sections;
mod state;
mod sticky;
mod table;

pub use load::{LoadOptions, LoadTimings};
pub use table::{Child, ComponentTable};

pub type CellIdx = u32;
pub type CompIdx = u32;
/// Build passes allowed before the structure must have settled, at least:
/// a checked document is allowed its structural depth plus one too
/// (`Compiled::passes`), and only a test load without the check is held
/// to this alone.
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
    /// Names and text: the DAST's table, then the strings the build added
    /// (`Compiled::extra_strings`), then those interned since load.
    pub strings: StringTable,
    /// How many of `strings` every build of this document produces (the
    /// DAST's and the build's): ids from here on were interned at runtime
    /// and are carried across rebuilds (`Session::runtime_strings`).
    pub n_static_strings: usize,
    /// Each string's canonical id, built on first `intern`.
    interned: Option<HashMap<String, StrId>>,
    /// Index of the root `<document>` component.
    pub root: CompIdx,
    pub structure: Structure,
    /// What the session has accumulated (ADR 0015): carried values, scopes,
    /// strings interned at runtime. Every build reads it.
    pub session: crate::session::Session,
    /// The source's literal attributes, for a renderer (`attr_text`): all
    /// a document keeps of its DAST, unless it keeps its compile. Gathered
    /// once a load settles, off the load's peak, and shared by rebuilds.
    pub literal_attrs: Arc<crate::dast::LiteralAttrs>,
    /// The document as compiled at load, which every rebuild stamps
    /// (ADR 0015). Kept only by a document with a repeat: one without
    /// never rebuilds, and its compile, several times the size of the
    /// built document, is dropped after load.
    pub compiled: Option<Arc<crate::compile::Compiled>>,
    /// The elements' stable keys (ADR 0017), what saved state names cells
    /// by: kept by every document, with its compile or without.
    pub(crate) keys: Arc<crate::compile::keys::Keys>,
    /// The source's `Dast::version_hash`: the version saved state was made
    /// in.
    pub(crate) version: u64,
    /// Sticky groups as cells, for the request pre-pass (ADR 0007).
    sticky: Vec<sticky::StickyTable>,
    /// How a tick recomputes (`request`): a dirty closure unless set
    /// otherwise (`set_evaluator`), kept across rebuilds.
    evaluator: Recompute,
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
        session: crate::session::Session,
        compiled: Arc<crate::compile::Compiled>,
    ) -> Self {
        let mut strings = strings;
        let n_static_strings = strings.len();
        // Strings interned before this build keep their ids.
        for s in &session.runtime_strings {
            strings.push(s);
        }
        let mut doc = Document {
            cells,
            n_essential,
            n_fixed,
            program,
            components,
            strings,
            n_static_strings,
            interned: None,
            root,
            structure,
            session,
            literal_attrs: Arc::default(),
            keys: compiled.keys.clone(),
            version: compiled.version,
            compiled: compiled.rebuilds().then_some(compiled),
            sticky: Vec::new(),
            evaluator: Recompute::default(),
        };
        doc.sticky = doc.sticky_tables();
        doc
    }

    /// Parse math text (what a student typed) into the engine: the value to
    /// request on a mathInput's `expr` cell.
    pub fn parse_math(&self, text: &str) -> std::result::Result<f64, String> {
        Ok(self.session.engine.borrow_mut().parse(text)? as f64)
    }

    /// The id of `text` in the string table, as a cell value: the value to
    /// request on a text cell (a `<textInput>`'s). Interns the text if the
    /// table does not have it yet; equal text gets equal ids.
    pub fn intern(&mut self, text: &str) -> f64 {
        let strings = &mut self.strings;
        let ids = self.interned.get_or_insert_with(|| {
            let mut ids = HashMap::new();
            for i in (0..strings.len() as StrId).rev() {
                ids.insert(strings.get(i).to_string(), i);
            }
            ids
        });
        let id = match ids.get(text) {
            Some(&id) => id,
            None => {
                let id = strings.push(text);
                ids.insert(text.to_string(), id);
                self.session.runtime_strings.push(text.to_string());
                id
            }
        };
        id as f64
    }

    /// The expression a math cell holds, as text; empty when blank.
    pub fn math_text(&self, cell: CellIdx) -> String {
        let h = self.cells[cell as usize];
        if h.is_nan() {
            String::new()
        } else {
            self.session.engine.borrow().text(h as Handle)
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

    /// Whether `cell` can hold `value`: any number for a number cell, NaN
    /// or a string id in the table for a text cell, NaN or a handle in the
    /// engine for a math cell. Checked once per request, never in the tick.
    pub(super) fn can_hold(&self, cell: CellIdx, value: f64) -> bool {
        let index_below = |n: usize| value >= 0.0 && value.fract() == 0.0 && value < n as f64;
        match self.program.value_types[cell as usize] {
            ValueType::Number => true,
            ValueType::Text => value.is_nan() || index_below(self.strings.len()),
            ValueType::Math => value.is_nan() || index_below(self.session.engine.borrow().len()),
        }
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
    /// The literal attributes kept for a renderer.
    pub attrs: usize,
}

impl MemoryEstimate {
    pub fn total(&self) -> usize {
        self.cells + self.program + self.components + self.strings + self.structure + self.attrs
    }
}

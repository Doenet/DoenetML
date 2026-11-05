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
use crate::dast::{Dast, NodeId, StrId, StringTable};
use crate::program::{Program, SymRun, SymState, ValueType};
use crate::tick::eval::{DirtyClosure, Recompute};
use crate::tick::{Request, TickOutcome};

mod interactive;
mod load;
mod outputs;
mod paths;
mod request;
mod sections;
mod state;
mod sticky;
mod table;

pub use load::{LoadOptions, LoadTimings};
pub use table::{Child, ChildEntry, ComponentTable};

crate::index::index_type! {
    /// A position in `Document::cells`, and in every list kept per cell.
    pub struct CellIdx;
}

crate::index::index_type! {
    /// A component: a position in the `ComponentTable`'s columns.
    pub struct CompIdx;
}

/// Build passes allowed before the structure must have settled, at least:
/// a document is allowed its structural depth plus one too
/// (`Compiled::passes`).
const MAX_PASSES: usize = 8;

pub const NONE: u32 = u32::MAX;
/// Set on a `child_list` entry whose low bits are a string id, not a component.
pub const TEXT_BIT: u32 = 1 << 31;

/// A loaded document. Its fields fall in two groups: what one build made,
/// which a rebuild replaces, and what outlives every build.
#[derive(Debug, Clone)]
pub struct Document {
    // What one build made.
    /// All cells: the constants, then the essential cells, then the
    /// derived ones.
    pub cells: Vec<f64>,
    /// Number of essential cells, which follow the constants.
    pub n_essential: usize,
    /// Number of constants, `cells[..n_const]`: values no tick changes.
    /// The first `n_pool` of them are the session's constant pool.
    pub n_const: usize,
    /// Number of pooled constants, `cells[..n_pool]`, the same in every
    /// build.
    pub n_pool: usize,
    /// What each cell's value means.
    pub value_types: Vec<ValueType>,
    /// The scheduled instructions, which a tick only reads.
    pub program: Program,
    /// What the program's symbolic instructions keep between runs.
    pub sym: SymState,
    /// The dirty closure's tables for `program`, built on first use.
    dirty: Option<DirtyClosure>,
    pub components: ComponentTable,
    /// Names and text: the DAST's table, then the strings the build added,
    /// then those interned since load.
    pub strings: StringTable,
    /// Each string's canonical id, built on first `intern`.
    interned: Option<HashMap<String, StrId>>,
    /// Index of the root `<document>` component.
    pub root: CompIdx,
    pub structure: Structure,
    /// Sticky groups as cells.
    sticky: Vec<sticky::StickyTable>,
    /// One bit per cell a renderer may request.
    interactive: Vec<u64>,
    /// One bit per interactive cell whose requests are refused.
    refused: Vec<u64>,
    /// Which cells the document computes.
    live: crate::build::Live,

    // What outlives every build.
    /// What the session has accumulated: carried values, scopes, strings
    /// interned at runtime, the math engine.
    pub session: Session,
    /// What the load settled.
    pub loaded: Loaded,
    /// How a tick recomputes.
    recompute: Recompute,
}

/// What a document's load settled, which every rebuild carries.
#[derive(Debug, Clone)]
pub struct Loaded {
    /// The source's literal attributes, for a renderer.
    pub literal_attrs: Arc<crate::dast::LiteralAttrs>,
    /// The document as compiled at load, which every rebuild stamps. Kept
    /// only by a document with a repeat, since one without never rebuilds.
    pub compiled: Option<Arc<crate::compile::Compiled>>,
    /// The elements' stable keys, by which saved state names cells.
    pub(crate) keys: Arc<crate::compile::keys::Keys>,
    /// The document's structural depth: zero without repeats.
    pub structural_depth: u32,
    /// The source's version hash, the version saved state was made in.
    pub(crate) version: u64,
    /// The compile's diagnostics.
    pub(crate) diagnostics: Arc<Vec<crate::diagnostics::Diagnostic>>,
}

impl Document {
    #[allow(clippy::too_many_arguments)]
    pub(crate) fn new(
        cells: Vec<f64>,
        n_essential: usize,
        n_const: usize,
        value_types: Vec<ValueType>,
        program: Program,
        components: ComponentTable,
        strings: StringTable,
        root: CompIdx,
        structure: Structure,
        session: Session,
        compiled: Arc<crate::compile::Compiled>,
        live: crate::build::Live,
    ) -> Self {
        let mut strings = strings;
        // Strings interned before this build keep their ids.
        for s in &session.runtime_strings {
            strings.push(s);
        }
        let mut doc = Document {
            cells,
            n_essential,
            n_const,
            // The pool the build returned is the front of its cells.
            n_pool: session.pool.len(),
            value_types,
            sym: SymState::new(&program),
            program,
            dirty: None,
            components,
            strings,
            interned: None,
            root,
            structure,
            sticky: Vec::new(),
            interactive: Vec::new(),
            refused: Vec::new(),
            live,
            session,
            loaded: Loaded {
                literal_attrs: Arc::default(),
                keys: compiled.keys.clone(),
                structural_depth: compiled.structural_depth,
                version: compiled.version,
                diagnostics: compiled.diagnostics.clone(),
                compiled: compiled.has_repeats().then_some(compiled),
            },
            recompute: Recompute::default(),
        };
        doc.sticky = doc.sticky_tables();
        doc.interactive = doc.interactive_bits();
        doc.refused = doc.refused_bits();
        doc
    }

    /// Parse math text (what a student typed) into the engine: the value to
    /// request on a mathInput's `expr` cell.
    pub fn parse_math(&self, text: &str) -> std::result::Result<f64, String> {
        Ok(self.session.engine.borrow_mut().parse(text)?.to_value())
    }

    /// The id of `text` in the string table, as a cell value: the value to
    /// request on a text cell (a `<textInput>`'s). Interns the text if the
    /// table does not have it yet; equal text gets equal ids.
    pub fn intern(&mut self, text: &str) -> f64 {
        let strings = &mut self.strings;
        let ids = self.interned.get_or_insert_with(|| {
            let mut ids = HashMap::new();
            for i in StrId::below(strings.len()).rev() {
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
        id.to_value()
    }

    /// The expression a math cell holds, as text; empty when blank.
    pub fn math_text(&self, cell: CellIdx) -> String {
        let h = self.cells[cell.index()];
        if h.is_nan() {
            String::new()
        } else {
            self.session.engine.borrow().text(Handle::from_value(h))
        }
    }

    /// LaTeX of the expression a math cell holds, empty for a NaN handle:
    /// what a renderer that draws math shows (ADR 0020).
    pub fn math_latex(&self, cell: CellIdx) -> String {
        let h = self.cells[cell.index()];
        if h.is_nan() {
            String::new()
        } else {
            self.session.engine.borrow().latex(Handle::from_value(h))
        }
    }

    /// A `<mathInput>` holds any math value, infinity included; every other
    /// request site rejects an infinite ask as the current core does.
    fn accepts_infinity(&self, cell: CellIdx) -> bool {
        (CompIdx::below(self.components.len())).any(|c| {
            self.component_type(c) == ComponentType::MathInput
                && self.comp_cells(c)[prop::math_input::VALUE] == cell
        })
    }

    /// Whether `cell` can hold `value`: any number for a number cell, NaN
    /// or a string id in the table for a text cell, NaN or a handle in the
    /// engine for a math cell. Checked once per request, never in the tick.
    pub(super) fn can_hold(&self, cell: CellIdx, value: f64) -> bool {
        let index_below = |n: usize| value >= 0.0 && value.fract() == 0.0 && value < n as f64;
        match self.value_types[cell.index()] {
            ValueType::Number => true,
            ValueType::Text => value.is_nan() || index_below(self.strings.len()),
            ValueType::Math => value.is_nan() || index_below(self.session.engine.borrow().len()),
        }
    }

    /// The essential cells' indices: after the constants.
    pub fn essentials(&self) -> std::ops::Range<usize> {
        self.n_const..self.n_const + self.n_essential
    }

    pub fn is_essential(&self, cell: CellIdx) -> bool {
        self.essentials().contains(&cell.index())
    }

    /// A constant (ADR 0028): a value no tick changes, such as an
    /// iteration index, a math handle or a `fixed` value. The constants
    /// come first, the pooled ones before the rest.
    pub fn is_const(&self, cell: CellIdx) -> bool {
        cell.index() < self.n_const
    }

    /// Recompute all derived cells from the essential cells.
    pub fn recompute(&mut self) {
        let mut engine = self.session.engine.borrow_mut();
        let mut sym = SymRun {
            state: &mut self.sym,
            engine: &mut engine,
        };
        self.program.run_all(&mut sym, &mut self.cells);
    }

    /// Write an essential cell and recompute. Panics if `cell` is derived.
    pub fn set_essential(&mut self, cell: CellIdx, value: f64) {
        assert!(self.is_essential(cell), "cell {cell} is derived");
        self.cells[cell.index()] = value;
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

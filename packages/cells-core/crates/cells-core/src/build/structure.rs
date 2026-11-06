//! What a build made of the document's shape: the repeats it expanded and
//! the keys of its essential cells ([`Structure`]), stored on the
//! [`Document`](crate::Document), and the scope table, which the
//! [`Session`](super::Session) keeps across builds.

use std::collections::HashMap;

use crate::compile::ir::ElemKey;
use crate::dast::NodeId;
use crate::index::CompIdx;

crate::index::index_type! {
    /// A name scope: 0 is the document, every other scope is one iteration
    /// of a repeat; a position in the session's [`ScopeTable`].
    pub struct ScopeId;
}

crate::index::index_type! {
    /// A position in a template's slot space: an element's slot offset
    /// ([`Sealed::slot_off`](crate::compile::ir::Sealed::slot_off)) plus the port's position among its slots. With
    /// its scope it names an essential value across builds (see
    /// `CONTEXT.md`, essential key).
    pub struct TemplateSlot;
}

impl ScopeId {
    /// The document's own scope.
    pub const DOCUMENT: ScopeId = ScopeId::new(0);
}

/// One expanded `<repeatForSequence>`.
#[derive(Debug, Clone)]
pub struct Repeat {
    /// The repeat's component.
    pub comp: CompIdx,
    /// The repeat's element in the source.
    pub node: NodeId,
    /// Scope the repeat element sits in.
    pub scope: ScopeId,
    /// One scope per iteration, in order.
    pub iter_scopes: Vec<ScopeId>,
    /// Iterations the build used; a differing `count` cell triggers a rebuild.
    pub iterations: u32,
}

/// Every scope a build has made: (parent scope, repeat or choice element,
/// 1-based position) per scope, indexed by [`ScopeId`]; entry 0 is the
/// document. Ids are stable across rebuilds: the table only grows.
#[derive(Debug, Clone)]
pub struct ScopeTable {
    entries: Vec<(ScopeId, NodeId, u32)>,
    index: HashMap<(ScopeId, NodeId, u32), ScopeId>,
}

impl Default for ScopeTable {
    fn default() -> Self {
        ScopeTable {
            entries: vec![(ScopeId::NONE, NodeId::NONE, 0)],
            index: HashMap::new(),
        }
    }
}

impl ScopeTable {
    /// The id of position `k` of element `node` under `parent`, created on
    /// first use.
    pub fn get_or_insert(&mut self, parent: ScopeId, node: NodeId, k: u32) -> ScopeId {
        if let Some(&s) = self.index.get(&(parent, node, k)) {
            return s;
        }
        self.entries.push((parent, node, k));
        let s = ScopeId::from_index(self.entries.len() - 1);
        self.index.insert((parent, node, k), s);
        s
    }

    /// How many scopes the table holds, the document's included.
    pub fn len(&self) -> usize {
        self.entries.len()
    }

    /// Whether the table holds no scope (never: it starts with the document's).
    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }

    /// An estimate of the table's heap use, in bytes.
    pub fn heap_bytes(&self) -> usize {
        self.entries.capacity() * 12 + self.index.capacity() * 16
    }
}

impl std::ops::Index<ScopeId> for ScopeTable {
    type Output = (ScopeId, NodeId, u32);
    fn index(&self, s: ScopeId) -> &Self::Output {
        &self.entries[s.index()]
    }
}

/// What one build made of the document's shape: its repeats and its
/// essential cells' keys and defaults.
#[derive(Debug, Clone, Default)]
pub struct Structure {
    /// Per essential cell, in cell order: its essential key as (scope,
    /// template slot). The template slot identifies the element and prop
    /// within the scope's template.
    pub essential_slots: Vec<(ScopeId, TemplateSlot)>,
    /// Per essential cell, in cell order: its element's key and the slot's
    /// position among the element's, by which saved state names it.
    pub essential_keys: Vec<(ElemKey, u32)>,
    /// Per essential cell, in cell order: the value the build gives it when
    /// nothing was carried over; saved state holds only the cells that differ.
    pub essential_defaults: Vec<f64>,
    /// Every repeat it expanded.
    pub repeats: Vec<Repeat>,
    /// Per value slot this build's own walk finds writable, in slot order:
    /// its essential key, whatever the record says.
    #[cfg(feature = "testing")]
    pub walked_essential_slots: Vec<(ScopeId, TemplateSlot)>,
    /// What each live template slot's own source makes it in this build,
    /// by its (scope, template, template slot).
    #[cfg(feature = "testing")]
    pub slot_classes: Vec<((ScopeId, u32, TemplateSlot), SlotClass)>,
    /// What each template slot's cell holds in this build, by its (scope,
    /// template, template slot).
    #[cfg(feature = "testing")]
    pub slot_types: Vec<((ScopeId, u32, TemplateSlot), crate::program::ValueType)>,
}

/// What a template slot's cell is in one build.
#[cfg(feature = "testing")]
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SlotClass {
    /// An essential cell: a stored value that requests set and builds carry over.
    Essential,
    /// A constant, with its value, and whether the compile's record makes
    /// it a document constant.
    Constant {
        /// The constant's value.
        value: f64,
        /// Whether the compile's record makes it a document constant.
        document: bool,
        /// Whether the check's attribute marks its port a constant
        /// ([`PortAttrs::CONSTANT`](crate::compile::ir::PortAttrs::CONSTANT), ADR 0037), which every constant a build
        /// makes, a fold included, must be.
        marked: bool,
    },
    /// A derived cell, computed by an operator over other cells.
    Derived,
    /// Another slot's cell.
    Alias,
}

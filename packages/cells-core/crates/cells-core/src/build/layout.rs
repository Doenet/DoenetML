//! Stable slots: where each element's props sit in its scope's row of
//! essential values, the same in every build of a document. A compile
//! numbers slots by a running sum over a template's elements
//! (`Elem::slot_off`), so an element boxed in one build (ADR 0013) and
//! not the other would shift every later element's values. The layout
//! keeps each element's slots, by its key, from build to build.
//!
//! A compile depends on the DAST and the boxed nodes alone. The first
//! build's slot offsets are the stable slots, and a build with the same
//! boxes reads them as they are: a load or a rebuild does no work here.
//! Only a build with other boxes, an element boxed mid-session, looks
//! elements up, compiling the document with the first build's boxes to
//! learn where its elements were.

use std::collections::{HashMap, HashSet};
use std::sync::Arc;

use super::compile::Compiler;
use super::compile::plan::Compiled;
use crate::dast::NodeId;

/// An element's identity across builds of one document: its DAST node and
/// 0; for an element the build makes (an answer's implicit input, a
/// container copy's clones, a repeat's hidden iteration components), the
/// node of the nearest element it belongs to and its 1-based position
/// among the elements made for that node.
pub type ElemKey = (NodeId, u32);

/// A template's identity: the node of the element that owns it (0 for the
/// document) and, for a choice, the branch's 1-based position.
pub type TemplateKey = (NodeId, u32);

/// One element's slots: key, template, first stable slot, slot count.
type Entry = (ElemKey, TemplateKey, u32, u32);

/// Every element's stable slots, carried from build to build (`Structure`).
#[derive(Debug, Clone, Default)]
pub struct Layout {
    /// The boxes of the first build, whose slot offsets are the stable
    /// slots; `None` before it.
    identity: Option<Vec<NodeId>>,
    /// Every element's slots, once a build with other boxes needed them:
    /// the first build's, and those later builds gave new elements.
    entries: Option<Arc<Vec<Entry>>>,
    /// The last build with other boxes than the first: its boxes, and each
    /// element's first stable slot by template and element.
    remap: Option<(Vec<NodeId>, SlotBases)>,
}

/// Each element's first stable slot, by template and element.
type SlotBases = Arc<Vec<Vec<u32>>>;

/// A build's [`SlotBases`]; `None` when they are the slot offsets.
pub(in crate::build) type Bases = Option<SlotBases>;

impl Layout {
    /// The layout after a build of `c`, and that build's bases.
    pub(in crate::build) fn update(&self, c: &Compiled) -> (Layout, Bases) {
        match &self.identity {
            None => {
                let first = Layout {
                    identity: Some(c.boxed.clone()),
                    ..Layout::default()
                };
                return (first, None);
            }
            Some(boxed) if *boxed == c.boxed => return (self.clone(), None),
            _ => {}
        }
        if let Some((boxed, bases)) = &self.remap
            && *boxed == c.boxed
        {
            return (self.clone(), Some(bases.clone()));
        }
        // Other boxes: each element keeps the slots it was given, and an
        // element new to the document (or grown) gets fresh ones after the
        // last its template has used.
        let mut entries = match &self.entries {
            Some(entries) => entries.as_ref().clone(),
            None => self.first_entries(c),
        };
        let mut index: HashMap<ElemKey, usize> = HashMap::with_capacity(entries.len());
        let mut next: HashMap<TemplateKey, u32> = HashMap::new();
        for (i, &(key, t, base, len)) in entries.iter().enumerate() {
            index.insert(key, i);
            let n = next.entry(t).or_insert(0);
            *n = (*n).max(base + len);
        }
        let mut bases = Vec::with_capacity(c.templates.len());
        for tpl in &c.templates {
            let mut row = Vec::with_capacity(tpl.elems.len());
            for el in &tpl.elems {
                let len = slot_count(el);
                let found = index.get(&el.key).copied();
                row.push(match found {
                    Some(i) if entries[i].1 == tpl.key && entries[i].3 >= len => entries[i].2,
                    _ => {
                        let n = next.entry(tpl.key).or_insert(0);
                        let base = *n;
                        *n += len;
                        let entry = (el.key, tpl.key, base, len);
                        match found {
                            Some(i) => entries[i] = entry,
                            None => entries.push(entry),
                        }
                        base
                    }
                });
            }
            bases.push(row);
        }
        let bases = Arc::new(bases);
        let layout = Layout {
            identity: self.identity.clone(),
            entries: Some(Arc::new(entries)),
            remap: Some((c.boxed.clone(), bases.clone())),
        };
        (layout, Some(bases))
    }

    /// The first build's slots, from compiling the document again with its
    /// boxes.
    fn first_entries(&self, c: &Compiled) -> Vec<Entry> {
        let boxed: HashSet<NodeId> = self.identity.iter().flatten().copied().collect();
        let first = Compiler::compile(c.dast, &boxed)
            .unwrap_or_else(|_| unreachable!("the document compiled with these boxes"));
        first
            .templates
            .iter()
            .flat_map(|tpl| {
                tpl.elems
                    .iter()
                    .map(|el| (el.key, tpl.key, el.slot_off, slot_count(el)))
            })
            .collect()
    }

    pub fn heap_bytes(&self) -> usize {
        self.entries
            .as_ref()
            .map_or(0, |e| e.capacity() * std::mem::size_of::<Entry>())
    }
}

/// The slots an element takes, hidden ones included.
fn slot_count(el: &super::compile::plan::Elem) -> u32 {
    el.props.len().max(el.component_type.prop_defs().len()) as u32
}

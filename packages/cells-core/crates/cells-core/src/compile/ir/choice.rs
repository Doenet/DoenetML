//! Choices, a `<select>`'s or a `<conditionalContent>`'s branches and
//! interface: as outlining makes it ([`ChoiceDef`]), and what sealing finds
//! of it ([`ChoiceSeal`]).

use crate::compile::*;

crate::index::index_type! {
    /// An interface name of a choice, as a position in its `used`.
    pub(crate) struct IfaceIdx;
}

crate::index::index_type! {
    /// A choice (a select or conditional content), indexing the compile's
    /// choices.
    pub(crate) struct ChoiceId;
}

/// A choice as compiled: one template per branch, its
/// branch interface, and how it chooses.
#[derive(Debug, Clone)]
pub(crate) struct ChoiceDef {
    /// The choice element: (template, element).
    pub(crate) at: (TemplateId, ElemId),
    /// `<conditionalContent>` (reactive) or `<select>` (load-time).
    pub(crate) reactive: bool,
    /// One template per case or option, in document order.
    pub(crate) branches: Vec<TemplateId>,
    /// Each branch's stable key: the case's or option's name,
    /// else its tag and its position among the choice's branches with that
    /// tag (`option#2`); `body` for a choice that is its own one branch.
    pub(crate) branch_keys: Vec<Box<str>>,
    /// Reactive: each case's `condition` attribute (None: an else).
    pub(crate) conditions: Vec<Option<AttrId>>,
    /// Load-time: picks, with replacement or not, and a weight per option.
    /// How many picks is known while outlining only when `numToSelect`
    /// is a literal; every build reads the number the check found
    /// ([`Plans::num_to_select`], ADR 0037).
    pub(crate) num_to_select: Option<u32>,
    pub(crate) with_replacement: bool,
    pub(crate) weights: Vec<f64>,
    /// The branch interface: name -> type and the element carrying it in
    /// each branch. Filled once every element is planned.
    pub(crate) iface: HashMap<String, (ComponentType, Vec<ElemId>)>,
    /// Interface names that references use, in the order the reference
    /// plans first name them.
    pub(crate) used: Vec<String>,
    /// Each used name's position in `used`, by name-table id.
    pub(crate) used_at: HashMap<NameId, IfaceIdx>,
}

/// What sealing finds of a choice: its branch interface and the interface
/// names references use.
#[derive(Debug, Clone, Default)]
pub(crate) struct ChoiceSeal {
    pub(crate) iface: HashMap<String, (ComponentType, Vec<ElemId>)>,
    pub(crate) used: Vec<String>,
    pub(crate) used_at: HashMap<NameId, IfaceIdx>,
}

impl ChoiceSeal {
    /// `def`, as outlining made it, with what sealing found.
    pub(crate) fn into_def(self, def: ChoiceDef) -> ChoiceDef {
        ChoiceDef {
            iface: self.iface,
            used: self.used,
            used_at: self.used_at,
            ..def
        }
    }
}

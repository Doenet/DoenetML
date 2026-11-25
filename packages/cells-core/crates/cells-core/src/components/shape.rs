//! How an element lays out its given list: its type's layout, with the
//! kind of entry the element holds when its type leaves that to the
//! element (ADR 0053): a `<sort>` or `<shuffle>` of points has entries
//! of two cells, which its rows draw and drag as points, though its type
//! declares entries of one ([`EntryKind::Any`]).
//!
//! Every reader of a list's cells (a reference's slots, the rows, the
//! text) reads them through an element's shape: `n_props` public props
//! are the table's, then `width` cells an entry, then each named
//! sequence's one cell an entry, then, for a capped list, its hide
//! sequence's one cell an entry (ADR 0086).

use super::{ComponentType, EntryKind, Role};
use std::borrow::Cow;

/// An element's list layout: its type, and the kind of its entries when
/// the element decides it (`entry`), else the type's.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ListShape {
    /// The element's type.
    pub ty: ComponentType,
    /// The kind of its entries, when the element decides it: only for a
    /// type whose entries are its operands' ([`EntryKind::Any`]).
    pub own: Option<EntryKind>,
}

impl EntryKind {
    /// How many cells an entry of this kind is: two for a point, one for
    /// a value.
    pub fn width(self) -> usize {
        match self {
            EntryKind::Point => 2,
            _ => 1,
        }
    }
}

impl ListShape {
    /// The shape of an element of type `ty` whose entries are `own` when
    /// it decides them; None for the type's.
    pub fn new(ty: ComponentType, own: Option<EntryKind>) -> ListShape {
        debug_assert!(
            own.is_none() || ty.list_entry() == Some(EntryKind::Any) || ty.entries_by_type(),
            "only an element of a type whose entries are its operands', or follow its `type`, \
             decides its entries"
        );
        ListShape { ty, own }
    }

    /// What an entry is: the element's own kind, else the type's.
    pub fn entry(self) -> Option<EntryKind> {
        self.own.or_else(|| self.ty.list_entry())
    }

    /// How many cells an entry is: the element's own kind's width, else
    /// the type's (two for a point, one for a value); 0 without a given
    /// list.
    pub fn width(self) -> usize {
        match self.own {
            Some(entry) => entry.width(),
            None => self.ty.given_coords().map_or(0, <[_]>::len),
        }
    }

    /// Whether an entry is a point, two cells.
    pub fn lists_points(self) -> bool {
        self.width() == 2
    }

    /// The list's named sequences ([`super::ListProp::sequences`]).
    pub fn sequences(self) -> &'static [&'static str] {
        self.ty.list().map_or(&[], |l| l.sequences)
    }

    /// Whether the list is capped, and so has a hide sequence
    /// ([`super::ListProp::live`]).
    fn capped(self) -> bool {
        self.ty.list().is_some_and(|l| l.live.is_some())
    }

    /// How many cells an entry has beyond its own: one per named sequence,
    /// and one of the hide sequence for a capped list.
    fn beside(self) -> usize {
        self.sequences().len() + usize::from(self.capped())
    }

    /// How many entries the list of an element with `n_props` props holds:
    /// a list of no cells an entry (`sequence: name`) has its named
    /// sequence's.
    pub fn list_len(self, n_props: usize) -> usize {
        match self.width() + self.beside() {
            0 => 0,
            w => n_props.saturating_sub(self.ty.prop_defs().len()) / w,
        }
    }

    /// How many public props an element with `n` list entries has after
    /// its table's: the entries' cells, then the named sequences', then
    /// the hide sequence's.
    pub fn list_props(self, n: usize) -> usize {
        (self.width() + self.beside()) * n
    }

    /// The position of cell `j` of entry `k` (1-based) in an element with
    /// `n_props` props, if the element has that entry.
    pub fn list_slot(self, n_props: usize, k: usize, j: usize) -> Option<usize> {
        let (n_table, w) = (self.ty.prop_defs().len(), self.width());
        (w > 0 && j < w && k >= 1 && k <= self.list_len(n_props)).then(|| n_table + w * (k - 1) + j)
    }

    /// The positions of named sequence `i` (its position among the
    /// list's [`sequences`](Self::sequences)) of an element with
    /// `n_props` props; none for a sequence the list does not name.
    pub fn sequence_slots(self, n_props: usize, i: usize) -> std::ops::Range<usize> {
        if i >= self.sequences().len() {
            return 0..0;
        }
        let n = self.list_len(n_props);
        let start = self.ty.prop_defs().len() + (self.width() + i) * n;
        start..start + n
    }

    /// The positions of the hide sequence of an element with `n_props`
    /// props: a capped list's, one cell an entry after its named
    /// sequences (ADR 0086); none for a list that is not capped.
    pub fn hide_slots(self, n_props: usize) -> std::ops::Range<usize> {
        if !self.capped() {
            return 0..0;
        }
        let n = self.list_len(n_props);
        let start = self.ty.prop_defs().len() + (self.width() + self.sequences().len()) * n;
        start..start + n
    }

    /// The position of the cell a made row of entry `k` (1-based) hides
    /// by, in an element with `n_props` props: a capped list's hide
    /// sequence's entry (ADR 0041, decision 2: 1 past the live length);
    /// None where a row is never hidden by its list.
    pub fn row_hide_slot(self, n_props: usize, k: usize) -> Option<usize> {
        let slots = self.hide_slots(n_props);
        (k >= 1 && k <= slots.len()).then(|| slots.start + k - 1)
    }

    /// The name of prop `pi` of an element with `n_props` public props:
    /// the table's, a list cell (`throughX2`; a point entry of a list
    /// whose type names one cell an entry, `value2_1` and `value2_2`), or
    /// a named sequence's (`componentOrder2`); None for a hidden slot and
    /// for the hide sequence's.
    pub fn prop_name(self, n_props: usize, pi: usize) -> Option<Cow<'static, str>> {
        let ty = self.ty;
        let n_table = ty.prop_defs().len();
        if pi < n_table {
            return Some(ty.prop_defs()[pi].name.into());
        }
        let coords = ty.given_coords().filter(|_| pi < n_props)?;
        for (i, name) in self.sequences().iter().enumerate() {
            let slots = self.sequence_slots(n_props, i);
            if slots.contains(&pi) {
                return Some(format!("{name}{}", pi - slots.start + 1).into());
            }
        }
        if self.hide_slots(n_props).contains(&pi) {
            return None;
        }
        let w = self.width().max(1);
        let (k, j) = ((pi - n_table) / w + 1, (pi - n_table) % w);
        if coords.is_empty() {
            return None;
        }
        Some(match coords.get(j) {
            Some(c) if coords.len() == w => format!("{c}{k}").into(),
            _ => format!("{}{k}_{}", coords[0], j + 1).into(),
        })
    }

    /// The type of a row of an entry (ADR 0041, decision 4), when the
    /// entries are the element's own: a number, a text, a boolean, a math
    /// value or a point, as the entry is.
    pub fn entry_row(self) -> Option<ComponentType> {
        let row = self.ty.entry_row()?;
        if self.width() == 0 {
            return None;
        }

        Some(match self.own {
            None => row,
            Some(entry) => entry_row_type(entry),
        })
    }
}

/// The row type of an entry of kind `entry`: a number, a text, a boolean,
/// a math value (what the cell holds, read as it holds it) or a point.
pub(super) fn entry_row_type(entry: EntryKind) -> ComponentType {
    match entry {
        EntryKind::Number => Role::Value,
        EntryKind::Text => Role::TextValue,
        EntryKind::Boolean => Role::BooleanValue,
        EntryKind::Math | EntryKind::Any => Role::MathValue,
        EntryKind::Point => Role::ListPoint,
    }
    .ty()
}

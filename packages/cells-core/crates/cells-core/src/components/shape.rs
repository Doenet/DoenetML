//! How an element lays out its given list: its type's layout, with the
//! kind of entry the element holds when its type leaves that to the
//! element (ADR 0053): a `<sort>` or `<shuffle>` of points has entries
//! of two cells, which its rows draw and drag as points, though its type
//! declares entries of one ([`EntryKind::Any`]).
//!
//! Every reader of a list's cells (a reference's slots, the rows, the
//! text) reads them through an element's shape: `n_props` public props
//! are the table's, then `width` cells an entry, then the companion
//! sequence's one cell an entry.

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
            own.is_none() || ty.list_entry() == Some(EntryKind::Any),
            "only an element of a type whose entries are its operands' decides its entries"
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

    /// How many entries the list of an element with `n_props` props holds.
    pub fn list_len(self, n_props: usize) -> usize {
        match self.width() {
            0 => 0,
            w => {
                n_props.saturating_sub(self.ty.prop_defs().len()) / (w + self.ty.companion_width())
            }
        }
    }

    /// How many public props an element with `n` list entries has after
    /// its table's: the entries' cells, then the companion sequence's.
    pub fn list_props(self, n: usize) -> usize {
        (self.width() + self.ty.companion_width()) * n
    }

    /// The position of cell `j` of entry `k` (1-based) in an element with
    /// `n_props` props, if the element has that entry.
    pub fn list_slot(self, n_props: usize, k: usize, j: usize) -> Option<usize> {
        let (n_table, w) = (self.ty.prop_defs().len(), self.width());
        (w > 0 && j < w && k >= 1 && k <= self.list_len(n_props)).then(|| n_table + w * (k - 1) + j)
    }

    /// The positions of the companion sequence of an element with
    /// `n_props` props.
    pub fn companion_slots(self, n_props: usize) -> std::ops::Range<usize> {
        if self.ty.companion_width() == 0 {
            return 0..0;
        }
        let n = self.list_len(n_props);
        let start = self.ty.prop_defs().len() + self.width() * n;
        start..start + n
    }

    /// The name of prop `pi` of an element with `n_props` public props:
    /// the table's, a list cell (`throughX2`; a point entry of a list
    /// whose type names one cell an entry, `value2_1` and `value2_2`), or
    /// the companion sequence's (`componentOrder2`); None for a hidden
    /// slot.
    pub fn prop_name(self, n_props: usize, pi: usize) -> Option<Cow<'static, str>> {
        let ty = self.ty;
        let n_table = ty.prop_defs().len();
        if pi < n_table {
            return Some(ty.prop_defs()[pi].name.into());
        }
        let coords = ty.given_coords().filter(|_| pi < n_props)?;
        if let Some(companion) = ty.list().and_then(|l| l.companion)
            && self.companion_slots(n_props).contains(&pi)
        {
            let k = pi - self.companion_slots(n_props).start + 1;
            return Some(format!("{companion}{k}").into());
        }
        let w = self.width().max(1);
        let (k, j) = ((pi - n_table) / w + 1, (pi - n_table) % w);
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

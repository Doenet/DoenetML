//! Text in the tick (ADR 0053): what an instruction reads of the document's
//! strings, and the one place one adds a string while the program runs.
//!
//! An operator may read any string a text cell names: a sort compares
//! texts, a join writes them out. Only a text-valued operator (the join of
//! a sequence's entries, a value's text, [`SymKind::Join`](super::SymKind::Join))
//! adds a string, and it interns it: equal text gets the id it already
//! has, so a text cell's id changes exactly when its text does, which the
//! recompute's change test and `Eq` on string ids both rely on. A string
//! added is appended to the session's runtime strings and never removed, so
//! the table grows by the distinct strings the document has made, never by
//! the ticks.

use std::collections::HashMap;

use crate::dast::{StrId, StringTable};
use crate::program::ValueType;
use crate::sym::{Engine, Handle};

/// The document's strings as a running program reads and adds to them:
/// the table, its index from text to canonical id, and the session's list
/// of strings added since load, which every later build appends to its own
/// table so each keeps its id.
pub struct Texts<'a> {
    /// Every string, by id.
    pub strings: &'a mut StringTable,
    /// Each string's canonical id, built on first `intern`.
    pub interned: &'a mut Option<HashMap<String, StrId>>,
    /// The strings added since load, in the order they were added.
    pub added: &'a mut Vec<String>,
}

impl Texts<'_> {
    /// The same view, reborrowed for a call.
    pub fn reborrow(&mut self) -> Texts<'_> {
        Texts {
            strings: self.strings,
            interned: self.interned,
            added: self.added,
        }
    }

    /// The string text cell value `v` names; None for no string (NaN,
    /// missing, or no id of the table).
    pub fn get(&self, v: f64) -> Option<&str> {
        (v >= 0.0 && v.fract() == 0.0 && (v as usize) < self.strings.len())
            .then(|| self.strings.get(StrId::from_value(v)))
    }

    /// The id of `text`, as a text cell's value: the one it has, else a
    /// new one, appended to the table and to the strings added.
    pub fn intern(&mut self, text: &str) -> f64 {
        let strings = &mut *self.strings;
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
                self.added.push(text.to_string());
                id
            }
        };
        id.to_value()
    }
}

/// What a cell an operator reads holds, as two bits of a kinds mask
/// ([`kinds_of`]).
pub(crate) const KIND_NUMBER: u128 = 0;
/// A string id.
pub(crate) const KIND_TEXT: u128 = 1;
/// An expression handle.
pub(crate) const KIND_MATH: u128 = 2;

/// The kinds mask of cells of `types`, two bits each, in order: what a
/// text-reading operator ([`SymKind::Join`](super::SymKind::Join),
/// [`SymKind::Order`](super::SymKind::Order)) is told of its inputs when
/// it is bound, since a cell's value does not say what it is.
pub(crate) fn kinds_of(types: impl Iterator<Item = ValueType>) -> u128 {
    types.enumerate().fold(0, |mask, (i, ty)| {
        let k = match ty {
            ValueType::Number => KIND_NUMBER,
            ValueType::Text => KIND_TEXT,
            ValueType::Math => KIND_MATH,
        };
        mask | (k << (2 * i))
    })
}

/// The kind of input `i` in mask `kinds`.
pub(crate) fn kind_at(kinds: u128, i: usize) -> u128 {
    (kinds >> (2 * i)) & 3
}

/// A number as JavaScript's `String` writes it (`3`, `0.5`, `Infinity`):
/// what the current core compares a number by among texts.
pub(crate) fn js_number_text(v: f64) -> String {
    if v.is_nan() {
        "NaN".into()
    } else if v.is_infinite() {
        if v > 0.0 { "Infinity" } else { "-Infinity" }.into()
    } else if v == 0.0 {
        "0".into()
    } else {
        format!("{v}")
    }
}

/// The text of input value `v` of kind `kind`, as a sort compares it: a
/// number as JavaScript writes it, a string as it is, an expression as the
/// engine prints it (empty for blank).
pub(crate) fn compare_text(engine: &Engine, texts: Option<&Texts>, kind: u128, v: f64) -> String {
    match kind {
        KIND_TEXT => texts.and_then(|t| t.get(v)).unwrap_or("").to_string(),
        KIND_MATH if v.is_nan() => String::new(),
        KIND_MATH => engine.text(Handle::from_value(v)),
        _ => js_number_text(v),
    }
}

/// `text` as an answer compares it
/// ([`SymKind::TextEquals`](super::SymKind::TextEquals)), as the current
/// core's `trim().replace(/\s+/, " ")`: trimmed, and its first run of
/// white space (only the first) made one space; lower-cased when
/// `case_insensitive`.
pub(crate) fn answer_text(text: &str, case_insensitive: bool) -> String {
    let text = text.trim();
    let mut out = match text.find(char::is_whitespace) {
        Some(start) => {
            let rest = &text[start..];
            let end = rest
                .find(|c: char| !c.is_whitespace())
                .map_or(text.len(), |k| start + k);
            format!("{} {}", &text[..start], &text[end..])
        }
        None => text.to_string(),
    };
    if case_insensitive {
        out = out.to_lowercase();
    }
    out
}

/// What a [`SymKind::JoinWith`](super::SymKind::JoinWith) puts between its
/// inputs' texts (ADR 0058).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Sep {
    /// `.`: a section's full number, "2.1".
    Dot,
    /// A space: a section's automatic title, "Section 2.1".
    Space,
    /// Nothing: the texts written one after the other, as a text answer's
    /// content of text and references is (ADR 0067).
    Empty,
}

impl Sep {
    /// The text it puts between two inputs.
    pub fn as_str(self) -> &'static str {
        match self {
            Sep::Dot => ".",
            Sep::Space => " ",
            Sep::Empty => "",
        }
    }
}

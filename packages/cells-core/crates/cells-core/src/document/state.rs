//! Saved state: the essential cells a session changed, as JSON, so a
//! document can be reloaded where the student left it.
//!
//! The form is `{"v": 1, "state": [[scope, slot, kind, value], ...]}` with
//! one entry per essential cell whose value differs from the build's
//! default. `scope` and `slot` are the cell's essential key (see
//! `CONTEXT.md`); `kind` is `"n"` (a number; `null` is NaN, an emptied
//! input), `"t"` (a `<textInput>`'s text) or `"m"` (an expression as text).
//! Keys are the same across loads of the same document and seed, including
//! for iterations that exist only after a count changes: an entry whose key
//! is not live is parked in the value store the next build reads.
use std::collections::HashMap;

use serde_json::{Value, json};

use super::{CellIdx, Document};
use crate::Error;
use crate::build::EssentialKind;

impl Document {
    /// The essential cells that differ from their defaults, as JSON.
    pub fn save_state(&self) -> String {
        let st = &self.structure;
        let mut out = Vec::new();
        for (i, &(scope, slot)) in st.essential_slots.iter().enumerate() {
            let cell = i as CellIdx;
            let v = self.cells[i];
            let d = st.essential_defaults[i];
            let entry = match st.essential_kinds[i] {
                EssentialKind::Number => {
                    if v == d || (v.is_nan() && d.is_nan()) {
                        continue;
                    }
                    json!([
                        scope,
                        slot,
                        "n",
                        if v.is_nan() { Value::Null } else { json!(v) }
                    ])
                }
                EssentialKind::Text => {
                    if v == d || self.text_value(cell) == self.text_of(d) {
                        continue;
                    }
                    json!([
                        scope,
                        slot,
                        "t",
                        if v.is_nan() {
                            Value::Null
                        } else {
                            json!(self.text_value(cell))
                        }
                    ])
                }
                EssentialKind::Math => {
                    if v == d || self.math_text(cell) == self.math_of(d) {
                        continue;
                    }
                    json!([
                        scope,
                        slot,
                        "m",
                        if v.is_nan() {
                            Value::Null
                        } else {
                            json!(self.math_text(cell))
                        }
                    ])
                }
            };
            out.push(entry);
        }
        json!({ "v": 1, "state": out }).to_string()
    }

    /// Apply saved state to a freshly loaded document and recompute,
    /// rebuilding if a count changed. Entries whose key is not live go to
    /// the value store, so an iteration that comes back finds them.
    pub fn restore_state(&mut self, state: &str) -> crate::Result<()> {
        let saved: Value = serde_json::from_str(state)?;
        let entries = saved
            .get("state")
            .and_then(Value::as_array)
            .ok_or_else(|| Error::Unsupported("saved state without a `state` array".into()))?;
        let live: HashMap<(u32, u32), CellIdx> = self
            .structure
            .essential_slots
            .iter()
            .enumerate()
            .map(|(i, &k)| (k, i as CellIdx))
            .collect();
        for e in entries {
            let bad = || Error::Unsupported(format!("malformed saved state entry {e}"));
            let scope = e.get(0).and_then(Value::as_u64).ok_or_else(bad)? as u32;
            let slot = e.get(1).and_then(Value::as_u64).ok_or_else(bad)? as u32;
            let kind = e.get(2).and_then(Value::as_str).ok_or_else(bad)?;
            let raw = e.get(3).ok_or_else(bad)?;
            // `null` is NaN for every kind: an emptied input.
            let value = match kind {
                _ if raw.is_null() => f64::NAN,
                "n" => raw.as_f64().unwrap_or(f64::NAN),
                "t" => self.intern(raw.as_str().ok_or_else(bad)?),
                "m" => self
                    .parse_math(raw.as_str().ok_or_else(bad)?)
                    .map_err(Error::Unsupported)?,
                _ => return Err(bad()),
            };
            match live.get(&(scope, slot)) {
                Some(&cell) => self.cells[cell as usize] = value,
                None => {
                    let rows = &mut self.structure.essential_values;
                    if rows.len() <= scope as usize {
                        rows.resize(scope as usize + 1, Vec::new());
                    }
                    let row = &mut rows[scope as usize];
                    if row.len() <= slot as usize {
                        row.resize(slot as usize + 1, None);
                    }
                    row[slot as usize] = Some(value);
                }
            }
        }
        self.recompute();
        if !self.structure_settled() {
            self.rebuild()?;
        }
        Ok(())
    }

    fn text_of(&self, id: f64) -> String {
        if id.is_nan() || id < 0.0 || id as usize >= self.strings.len() {
            String::new()
        } else {
            self.strings.get(id as u32).to_string()
        }
    }

    fn math_of(&self, handle: f64) -> String {
        if handle.is_nan() {
            String::new()
        } else {
            self.program
                .sym
                .engine
                .borrow()
                .text(handle as crate::sym::Handle)
        }
    }
}

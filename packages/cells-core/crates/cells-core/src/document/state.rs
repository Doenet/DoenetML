//! Saved state: the essential cells a session changed, as JSON, so a
//! document can be reloaded where the student left it.
//!
//! The form is `{"v": 2, "state": [[path, element, prop, kind, value], ...]}`
//! with one entry per essential cell whose value differs from the build's
//! default. `path` names the cell's scope from the document down, one
//! `[node, position]` per repeat iteration or choice branch; `element` is
//! the element's key, `[node, k]` (`ElemKey`), and `prop` the
//! position among its slots. None depends on the order a session made
//! scopes or on which elements were boxed, so the keys are the same across
//! loads of the same document and seed, including for iterations that
//! exist only after a count changes: an entry whose scope is not live is
//! parked for the build that stamps it. `kind` is `"n"` (a number; `null`
//! is NaN, an emptied input), `"t"` (text) or `"m"` (an expression as
//! text).
//!
//! Version 1 keyed an entry by the raw scope id and slot offset; it is
//! still read, as before.
use std::collections::HashMap;

use serde_json::{Value, json};

use super::{CellIdx, Document};
use crate::Error;
use crate::build::{ElemKey, ScopeId};
use crate::document::NONE;
use crate::program::ValueType;

/// Where a saved entry goes: an essential key of version 1, or a scope and
/// an element's slot.
enum Key {
    Slot(ScopeId, u32),
    Element(ScopeId, ElemKey, u32),
}

impl Document {
    /// The essential cells that differ from their defaults, as JSON.
    pub fn save_state(&self) -> String {
        let st = &self.structure;
        let mut out = Vec::new();
        for (i, &(scope, _)) in st.essential_slots.iter().enumerate() {
            let cell = i as CellIdx;
            let v = self.cells[i];
            let d = st.essential_defaults[i];
            let (kind, value) = match self.program.value_types[i] {
                ValueType::Number => {
                    if v == d || (v.is_nan() && d.is_nan()) {
                        continue;
                    }
                    ("n", if v.is_nan() { Value::Null } else { json!(v) })
                }
                ValueType::Text => {
                    if v == d || self.text_value(cell) == self.text_of(d) {
                        continue;
                    }
                    let text = self.text_value(cell);
                    ("t", if v.is_nan() { Value::Null } else { json!(text) })
                }
                ValueType::Math => {
                    if v == d || self.math_text(cell) == self.math_of(d) {
                        continue;
                    }
                    let text = self.math_text(cell);
                    ("m", if v.is_nan() { Value::Null } else { json!(text) })
                }
            };
            let ((node, k), prop) = st.essential_keys[i];
            out.push(json!([
                self.scope_path(scope),
                [node, k],
                prop,
                kind,
                value
            ]));
        }
        json!({ "v": 2, "state": out }).to_string()
    }

    /// Apply saved state to a freshly loaded document and recompute,
    /// rebuilding if a count changed. Entries whose scope is not live wait
    /// for the build that stamps it, so an iteration that comes back finds
    /// them.
    pub fn restore_state(&mut self, state: &str) -> crate::Result<()> {
        let saved: Value = serde_json::from_str(state)?;
        let version = saved.get("v").and_then(Value::as_u64).unwrap_or(1);
        let entries = saved
            .get("state")
            .and_then(Value::as_array)
            .ok_or_else(|| Error::Unsupported("saved state without a `state` array".into()))?;
        // The live cells by the key this version names them with.
        let st = &self.structure;
        let mut by_slot: HashMap<(ScopeId, u32), CellIdx> = HashMap::new();
        let mut by_element: HashMap<(ScopeId, ElemKey, u32), CellIdx> = HashMap::new();
        if version >= 2 {
            by_element.extend(
                st.essential_slots
                    .iter()
                    .zip(&st.essential_keys)
                    .enumerate()
                    .map(|(i, (&(scope, _), &(key, prop)))| ((scope, key, prop), i as CellIdx)),
            );
        } else {
            by_slot.extend(
                st.essential_slots
                    .iter()
                    .enumerate()
                    .map(|(i, &k)| (k, i as CellIdx)),
            );
        }
        for e in entries {
            let bad = || Error::Unsupported(format!("malformed saved state entry {e}"));
            let (key, rest) = if version >= 2 {
                let path = e.get(0).and_then(Value::as_array).ok_or_else(bad)?;
                let element = e.get(1).and_then(Value::as_array).ok_or_else(bad)?;
                let node = element.first().and_then(Value::as_u64).ok_or_else(bad)? as u32;
                let k = element.get(1).and_then(Value::as_u64).ok_or_else(bad)? as u32;
                let prop = e.get(2).and_then(Value::as_u64).ok_or_else(bad)? as u32;
                let scope = self.scope_at(path).ok_or_else(bad)?;
                (Key::Element(scope, (node, k), prop), 3)
            } else {
                let scope = e.get(0).and_then(Value::as_u64).ok_or_else(bad)? as u32;
                let slot = e.get(1).and_then(Value::as_u64).ok_or_else(bad)? as u32;
                (Key::Slot(scope, slot), 2)
            };
            let kind = e.get(rest).and_then(Value::as_str).ok_or_else(bad)?;
            let raw = e.get(rest + 1).ok_or_else(bad)?;
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
            match key {
                Key::Element(scope, key, prop) => match by_element.get(&(scope, key, prop)) {
                    Some(&cell) => self.cells[cell as usize] = value,
                    None => {
                        self.structure.parked.insert((scope, key, prop), value);
                    }
                },
                Key::Slot(scope, slot) => match by_slot.get(&(scope, slot)) {
                    Some(&cell) => self.cells[cell as usize] = value,
                    None => {
                        let rows = std::sync::Arc::make_mut(&mut self.structure.essential_values);
                        if rows.len() <= scope as usize {
                            rows.resize(scope as usize + 1, Vec::new());
                        }
                        let row = &mut rows[scope as usize];
                        if row.len() <= slot as usize {
                            row.resize(slot as usize + 1, None);
                        }
                        row[slot as usize] = Some(value);
                    }
                },
            }
        }
        self.recompute();
        if !self.structure_settled() {
            self.rebuild()?;
        }
        Ok(())
    }

    /// `scope`'s path from the document: `[node, position]` per level.
    fn scope_path(&self, mut scope: ScopeId) -> Value {
        let mut path = Vec::new();
        while scope != 0 {
            let (parent, node, k) = self.structure.scopes[scope];
            path.push(json!([node, k]));
            scope = parent;
        }
        path.reverse();
        Value::Array(path)
    }

    /// The scope a saved path names, made in the scope table if no build
    /// has stamped it yet (its values wait for the iteration).
    fn scope_at(&mut self, path: &[Value]) -> Option<ScopeId> {
        let mut scope = 0;
        for level in path {
            let node = level.get(0)?.as_u64()? as u32;
            let k = level.get(1)?.as_u64()? as u32;
            if node == NONE {
                return None;
            }
            scope = self.structure.scopes.get_or_insert(scope, node, k);
        }
        Some(scope)
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

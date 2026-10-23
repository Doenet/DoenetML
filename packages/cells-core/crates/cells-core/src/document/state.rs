//! Saved state: the essential cells a session changed, as JSON, so a
//! document can be reloaded where the student left it.
//!
//! The form is `{"v": 3, "core": release, "doc": signature, "state":
//! [[path, element, prop, kind, value], ...]}` with one entry per essential
//! cell whose value differs from the build's default. `core` is the release
//! that saved it (`crate::RELEASE`), and only that release restores it
//! (ADR 0017, step 6); `doc` names the document version, and is empty until
//! the compile computes its input signature.
//!
//! An entry names its cell by keys an ordinary edit does not move (ADR
//! 0017, step 1; `compile/keys.rs`): `path` is the cell's scope from the
//! document down, one level per repeat iteration (`[repeat, k]`),
//! conditional branch (`[choice, branch]`) or select pick (`[select,
//! option, m]`); `element` is the element's stable key and `prop` the
//! prop's name, or for a hidden slot the shared state it holds. None
//! depends on the order a session made scopes or on which elements were
//! boxed, including for iterations that exist only after a count changes:
//! an entry whose scope is not live is parked for the build that stamps
//! it. An entry this version has no cell for is dropped. `kind` is `"n"` (a
//! number; `null` is NaN, an emptied input), `"t"` (text) or `"m"` (an
//! expression as text), and a value is restored only into a cell of its
//! kind.

use std::collections::HashMap;

use serde_json::{Value, json};

use super::{CellIdx, Document};
use crate::Error;
use crate::build::ScopeId;
use crate::compile::plan::ElemKey;
use crate::program::ValueType;

/// The saved state format `save_state` writes and `restore_state` reads.
const FORMAT: u64 = 3;

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
            let (key, prop) = st.essential_keys[i];
            // A hidden slot that holds no shared state has no name to save
            // it by.
            let Some(prop) = self.keys.prop_key(key, prop) else {
                continue;
            };
            out.push(json!([
                self.scope_path(scope),
                self.keys.key_text(key),
                prop,
                kind,
                value
            ]));
        }
        json!({ "v": FORMAT, "core": crate::RELEASE, "doc": Value::Null, "state": out }).to_string()
    }

    /// Apply saved state to a freshly loaded document and recompute,
    /// rebuilding if a count changed. Entries whose scope is not live wait
    /// for the build that stamps it, so an iteration that comes back finds
    /// them.
    pub fn restore_state(&mut self, state: &str) -> crate::Result<()> {
        let saved: Value = serde_json::from_str(state)?;
        // Nothing is read from state another format or release wrote.
        let version = saved.get("v").and_then(Value::as_u64);
        if version != Some(FORMAT) {
            return Err(Error::Unsupported(format!(
                "saved state of format {}, not {FORMAT}",
                version.map_or("none".to_string(), |v| v.to_string())
            )));
        }
        let core = saved.get("core").and_then(Value::as_str).unwrap_or("");
        if core != crate::RELEASE {
            return Err(Error::OtherRelease {
                saved: core.to_string(),
                core: crate::RELEASE.to_string(),
            });
        }
        let entries = saved
            .get("state")
            .and_then(Value::as_array)
            .ok_or_else(|| Error::Unsupported("saved state without a `state` array".into()))?;
        // The live cells by the key they are saved under.
        let st = &self.structure;
        let by_element: HashMap<(ScopeId, ElemKey, u32), CellIdx> = st
            .essential_slots
            .iter()
            .zip(&st.essential_keys)
            .enumerate()
            .map(|(i, (&(scope, _), &(key, prop)))| ((scope, key, prop), i as CellIdx))
            .collect();
        let keys = self.keys.clone();
        let by_text = keys.by_text();
        for e in entries {
            let bad = || Error::Unsupported(format!("malformed saved state entry {e}"));
            let path = e.get(0).and_then(Value::as_array).ok_or_else(bad)?;
            let element = e.get(1).and_then(Value::as_str).ok_or_else(bad)?;
            let prop = e.get(2).and_then(Value::as_str).ok_or_else(bad)?;
            let kind = e.get(3).and_then(Value::as_str).ok_or_else(bad)?;
            let raw = e.get(4).ok_or_else(bad)?;
            let ty = match kind {
                "n" => ValueType::Number,
                "t" => ValueType::Text,
                "m" => ValueType::Math,
                _ => return Err(bad()),
            };
            // An element, prop or scope this version does not have holds
            // nothing to restore.
            let Some(&key) = by_text.get(element) else {
                continue;
            };
            let Some(prop) = keys.prop_named(key, prop) else {
                continue;
            };
            let Some(scope) = self.scope_at(path) else {
                continue;
            };
            let live = by_element.get(&(scope, key, prop)).copied();
            // A value goes only into a cell of the type it was saved as.
            if live.is_some_and(|cell| self.program.value_types[cell as usize] != ty) {
                continue;
            }
            // `null` is NaN for every kind: an emptied input.
            let value = match ty {
                _ if raw.is_null() => f64::NAN,
                ValueType::Number => raw.as_f64().unwrap_or(f64::NAN),
                ValueType::Text => self.intern(raw.as_str().ok_or_else(bad)?),
                ValueType::Math => self
                    .parse_math(raw.as_str().ok_or_else(bad)?)
                    .map_err(Error::Unsupported)?,
            };
            match live {
                Some(cell) => self.cells[cell as usize] = value,
                None => {
                    self.session.parked.insert((scope, key, prop), (value, ty));
                }
            }
        }
        self.recompute();
        if !self.structure_settled() {
            self.rebuild()?;
        }
        Ok(())
    }

    /// `scope`'s path from the document, one stable level per repeat
    /// iteration or choice branch (`Keys::scope_level`).
    fn scope_path(&self, mut scope: ScopeId) -> Value {
        let mut path = Vec::new();
        while scope != 0 {
            let (parent, node, k) = self.session.scopes[scope];
            path.push(self.keys.scope_level(node, k));
            scope = parent;
        }
        path.reverse();
        Value::Array(path)
    }

    /// The scope a saved path names, made in the scope table if no build
    /// has stamped it yet (its values wait for the iteration); None when
    /// this version has no such repeat, choice or branch.
    fn scope_at(&mut self, path: &[Value]) -> Option<ScopeId> {
        let mut scope = 0;
        for level in path {
            let (node, k) = self.keys.level_at(level)?;
            scope = self.session.scopes.get_or_insert(scope, node, k);
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
            self.session
                .engine
                .borrow()
                .text(handle as crate::sym::Handle)
        }
    }
}

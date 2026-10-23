//! Saved state: the essential cells a session changed, as JSON, so a
//! document can be reloaded where the student left it.
//!
//! The form is `{"v": 3, "core": release, "doc": signature, "state":
//! [[path, element, prop, kind, value], ...]}` with one entry per essential
//! cell whose value differs from the build's default. `core` is the release
//! that saved it (`crate::RELEASE`), and only that release restores it
//! (ADR 0017, step 6); `doc` names the document version, and is empty until
//! the compile computes its input signature. `path` names the cell's scope from the document down, one
//! `[node, position]` per repeat iteration or choice branch; `element` is
//! the element's key, `[node, k]` (`ElemKey`), and `prop` the
//! position among its slots. None depends on the order a session made
//! scopes or on which elements were boxed, so the keys are the same across
//! loads of the same document and seed, including for iterations that
//! exist only after a count changes: an entry whose scope is not live is
//! parked for the build that stamps it. `kind` is `"n"` (a number; `null`
//! is NaN, an emptied input), `"t"` (text) or `"m"` (an expression as
//! text).
use std::collections::HashMap;

use serde_json::{Value, json};

use super::{CellIdx, Document};
use crate::Error;
use crate::build::ScopeId;
use crate::compile::plan::ElemKey;
use crate::document::NONE;
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
            let ((node, k), prop) = st.essential_keys[i];
            out.push(json!([
                self.scope_path(scope),
                [node, k],
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
        for e in entries {
            let bad = || Error::Unsupported(format!("malformed saved state entry {e}"));
            let path = e.get(0).and_then(Value::as_array).ok_or_else(bad)?;
            let element = e.get(1).and_then(Value::as_array).ok_or_else(bad)?;
            let node = element.first().and_then(Value::as_u64).ok_or_else(bad)? as u32;
            let k = element.get(1).and_then(Value::as_u64).ok_or_else(bad)? as u32;
            let prop = e.get(2).and_then(Value::as_u64).ok_or_else(bad)? as u32;
            let scope = self.scope_at(path).ok_or_else(bad)?;
            let kind = e.get(3).and_then(Value::as_str).ok_or_else(bad)?;
            let raw = e.get(4).ok_or_else(bad)?;
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
            match by_element.get(&(scope, (node, k), prop)) {
                Some(&cell) => self.cells[cell as usize] = value,
                None => {
                    self.session.parked.insert((scope, (node, k), prop), value);
                }
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
            let (parent, node, k) = self.session.scopes[scope];
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

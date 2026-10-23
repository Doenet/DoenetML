//! Saved state: the essential cells a session changed, as JSON, so a
//! document can be reloaded where the student left it.
//!
//! The form is `{"v": 3, "core": release, "doc": signature, "state":
//! [[path, element, prop, kind, value, view default?], ...]}` with one entry
//! per essential cell a student touched (ADR 0017, step 2): one a request
//! wrote, or one restored from a save that held it, whether or not it
//! equals its default. An untouched cell takes the version's default. A
//! graph's own bounds are view state, saved with the default they had and
//! dropped on restore when the default changed, so an author's new bounds
//! win over a student's old pan. `core` is the release
//! that saved it (`crate::RELEASE`), and only that release restores it
//! (ADR 0017, step 6); `doc` names the document version it was made in, by
//! a hash of its source, for a platform that must not let a tab still open
//! on an older version overwrite state moved to a newer one.
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
use std::sync::Arc;

use serde_json::{Value, json};

use super::{CellIdx, Document};
use crate::Error;
use crate::build::ScopeId;
use crate::compile::plan::ElemKey;
use crate::program::ValueType;
use crate::session::Parked;

/// The saved state format `save_state` writes and `restore_state` reads.
const FORMAT: u64 = 3;

impl Document {
    /// The essential values a student touched (ADR 0017, step 2), as JSON,
    /// whether or not they equal their defaults; view state with the
    /// default it had.
    pub fn save_state(&self) -> String {
        let st = &self.structure;
        let mut out = Vec::new();
        for (i, &(scope, tslot)) in st.essential_slots.iter().enumerate() {
            if !self.session.touched.contains(&(scope, tslot)) {
                continue;
            }
            let (key, prop) = st.essential_keys[i];
            // A hidden slot that holds no shared state has no name to save
            // it by.
            let Some(prop) = self.keys.prop_key(key, prop) else {
                continue;
            };
            let cell = i as CellIdx;
            let v = self.cells[i];
            let (kind, value) = match self.program.value_types[i] {
                _ if v.is_nan() => (kind_of(self.program.value_types[i]), Value::Null),
                ValueType::Number => ("n", json!(v)),
                ValueType::Text => ("t", json!(self.text_value(cell))),
                ValueType::Math => ("m", json!(self.math_text(cell))),
            };
            let mut entry = vec![
                self.scope_path(scope),
                json!(self.keys.key_text(key)),
                json!(prop),
                json!(kind),
                value,
            ];
            if self.keys.is_view(key, &prop) {
                entry.push(number(st.essential_defaults[i]));
            }
            out.push(Value::Array(entry));
        }
        let doc = format!("{:016x}", self.version);
        json!({ "v": FORMAT, "core": crate::RELEASE, "doc": doc, "state": out }).to_string()
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
            // View state carries the default it had (ADR 0017, step 2).
            let view_default = match e.get(5) {
                None => None,
                Some(d) if d.is_null() => Some(f64::NAN),
                Some(d) => Some(d.as_f64().ok_or_else(bad)?),
            };
            let parked_kind = Parked {
                value: f64::NAN,
                ty,
                view_default,
            };
            let live = by_element.get(&(scope, key, prop)).copied();
            // A value goes only into a cell of the type it was saved as, and
            // view state only while its default is the one it had.
            if let Some(cell) = live {
                let c = cell as usize;
                let default = self.structure.essential_defaults[c];
                if !parked_kind.fits(self.program.value_types[c], default) {
                    continue;
                }
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
                Some(cell) => {
                    self.cells[cell as usize] = value;
                    // What was saved was touched, and stays so.
                    let at = self.structure.essential_slots[cell as usize];
                    Arc::make_mut(&mut self.session.touched).insert(at);
                }
                None => {
                    let parked = Parked {
                        value,
                        ..parked_kind
                    };
                    self.session.parked.insert((scope, key, prop), parked);
                }
            }
        }
        self.recompute();
        if !self.structure_settled() {
            self.rebuild()?;
        }
        Ok(())
    }

    /// `scope_path` as text, for a test naming a cell across versions.
    pub(crate) fn scope_path_text(&self, scope: ScopeId) -> String {
        match self.scope_path(scope) {
            Value::Array(levels) if levels.is_empty() => String::new(),
            path => format!("{path} "),
        }
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
}

/// The kind saved state writes a value of type `ty` as.
fn kind_of(ty: ValueType) -> &'static str {
    match ty {
        ValueType::Number => "n",
        ValueType::Text => "t",
        ValueType::Math => "m",
    }
}

/// A number as JSON, `null` for NaN.
fn number(v: f64) -> Value {
    if v.is_nan() { Value::Null } else { json!(v) }
}

//! Stable keys (ADR 0017, step 1): what saved state names an element, a
//! slot and a scope by, chosen so that an ordinary edit does not move them.
//!
//! A key is text. A named element is its name path from its template's
//! prefix through its named ancestors (`s.a`); an unnamed one is its
//! nearest named ancestor's key, its tag and its position among that
//! ancestor's unnamed elements of the tag (`s.mathInput#2`); an element the
//! compile makes is the element it is made for and its position among
//! those (`a+1`). A repeat body's prefix is the repeat's key and `[*]`
//! (`r[*].q`), a choice branch's the choice's key and the branch's
//! (`sel[option#2].x`). Names are letters, digits, `-` and `_`, so no key
//! of one form is a key of another. A name that two elements under one
//! named ancestor carry names neither: both are keyed as unnamed.
//!
//! The keys outlive the compile: a document without repeats drops its
//! compile after load, and saves by its keys.

use std::collections::HashMap;

use serde_json::{Value, json};

use super::*;

/// Every element's key, by `ElemKey`, and what saved state needs besides.
#[derive(Debug, Default)]
pub(crate) struct Keys {
    /// Every key's text, one after the other; key `i` ends at `ends[i]`.
    text: String,
    ends: Vec<u32>,
    /// The type of the element each key names.
    types: Vec<ComponentType>,
    /// The elements that own templates (repeats, choices), by node: their
    /// key, and a choice's branches.
    owners: HashMap<NodeId, (ElemKey, Option<Branches>)>,
    /// A hidden slot's name, by (element, position), when it holds shared
    /// state or the source of a slot a `fixed` holds; one without is not
    /// saved.
    hidden: HashMap<(ElemKey, u32), Box<str>>,
    /// The hidden slot holding the source of each slot a `fixed` holds, by
    /// (element, held slot): what the held slot's name restores into.
    held: HashMap<(ElemKey, u32), u32>,
}

/// A choice's branches, as a scope level names them.
#[derive(Debug, Clone)]
struct Branches {
    reactive: bool,
    keys: Vec<Box<str>>,
}

/// A select's pick scope holds its option and which pick of that option it
/// is (a select with replacement may pick one option twice), not the
/// pick's position: `option << PICK_SHIFT | m`, `m` from 1.
pub(crate) const PICK_SHIFT: u32 = 16;

/// The scope position of the `m`-th pick (from 1) of option `b`.
pub(crate) fn pick_position(b: usize, m: u32) -> u32 {
    assert!(
        b < 1 << (32 - PICK_SHIFT) && m < 1 << PICK_SHIFT,
        "a select picks fewer than 65536 times from fewer than 65536 options"
    );
    (b as u32) << PICK_SHIFT | m
}

/// How many public props an element has, as far as the compile knows: a
/// bare copy's list is its referent's, which only a build knows.
fn n_public(el: &Elem) -> usize {
    match el.n_public {
        NPublic::Planned(n) => n as usize,
        NPublic::Table | NPublic::AsReferent => el.component_type.prop_defs().len(),
    }
}

fn join(base: &str, part: &str) -> String {
    let mut out = String::with_capacity(base.len() + part.len() + 5);
    if !base.is_empty() {
        out.push_str(base);
        out.push('.');
    }
    out.push_str(part);
    out
}

/// Append `k` in decimal.
fn push_number(out: &mut String, k: u32) {
    use std::fmt::Write;
    let _ = write!(out, "{k}");
}

impl Compiler<'_> {
    /// Give every element its key, once every element is planned.
    pub(in crate::compile) fn assign_keys(&mut self) {
        let c = &mut self.compiled;
        let mut keys = Keys::default();
        // The branch each choice template is: (choice, branch).
        let mut branch_of: HashMap<TemplateId, (ChoiceId, usize)> = HashMap::new();
        for (ci, ch) in c.choices.iter().enumerate() {
            for (b, &tpl) in ch.branches.iter().enumerate() {
                branch_of.insert(tpl, (ci, b));
            }
        }
        // Per base key: how many unnamed elements of each type, and how
        // many made elements, it has so far.
        // A base is (template, the element whose key it is, or ROOT_SCOPE
        // for the template's prefix).
        let mut unnamed: HashMap<(TemplateId, ElemId, ComponentType), u32> = HashMap::new();
        let mut made: HashMap<(TemplateId, ElemId), u32> = HashMap::new();
        let mut elem_keys: Vec<Vec<ElemKey>> = Vec::with_capacity(c.templates.len());
        // Templates are made after the template of the element that owns
        // them, so the owner's key is known first.
        for t in 0..c.templates.len() {
            let prefix = match c.templates[t].parent {
                None => String::new(),
                Some((pt, pe)) => {
                    let owner = keys.text_of(elem_keys[pt][pe]);
                    match branch_of.get(&t) {
                        Some(&(ci, b)) => format!("{owner}[{}]", c.choices[ci].branch_keys[b]),
                        None => format!("{owner}[*]"),
                    }
                }
            };
            let tpl = &c.templates[t];
            let mut ids: Vec<ElemKey> = Vec::with_capacity(tpl.elems.len());
            // Whether each element is keyed by its name.
            let mut named: Vec<bool> = Vec::with_capacity(tpl.elems.len());
            for (e, el) in tpl.elems.iter().enumerate() {
                // The nearest ancestor keyed by its name.
                let mut a = el.name_scope;
                let anchor = loop {
                    if a == ROOT_SCOPE || named[a] {
                        break a;
                    }
                    a = tpl.elems[a].name_scope;
                };
                let base = if anchor == ROOT_SCOPE {
                    prefix.as_str()
                } else {
                    keys.text_of(ids[anchor])
                };
                let text = if el.node == NONE {
                    // Made for the nearest element that has a node.
                    let mut a = el.name_scope;
                    while a != ROOT_SCOPE && tpl.elems[a].node == NONE {
                        a = tpl.elems[a].name_scope;
                    }
                    let owner = if a == ROOT_SCOPE {
                        prefix.as_str()
                    } else {
                        keys.text_of(ids[a])
                    };
                    let k = made.entry((t, a)).or_insert(0);
                    *k += 1;
                    named.push(false);
                    let mut text = String::with_capacity(owner.len() + 4);
                    text.push_str(owner);
                    text.push('+');
                    push_number(&mut text, *k);
                    text
                } else {
                    // Named only when no other element under the anchor
                    // carries the name.
                    let name = (el.name != NONE)
                        .then(|| self.dast.strings.get(el.name).trim())
                        .filter(|s| {
                            self.name_ids.get(*s).is_some_and(|&id| {
                                self.names.get(&(t as u32, anchor as u32, id)) == Some(&(e as u32))
                            })
                        });
                    named.push(name.is_some());
                    match name {
                        Some(name) => join(base, name),
                        None => {
                            let k = unnamed.entry((t, anchor, el.component_type)).or_insert(0);
                            *k += 1;
                            let mut text = join(base, el.component_type.tag());
                            text.push('#');
                            push_number(&mut text, *k);
                            text
                        }
                    }
                };
                let id = keys.push(&text, el.component_type);
                if el.node != NONE {
                    match el.body {
                        Body::Repeat { .. } => {
                            keys.owners.insert(el.node, (id, None));
                        }
                        Body::Choice(ci) => {
                            let branches = Branches {
                                reactive: c.choices[ci].reactive,
                                keys: c.choices[ci].branch_keys.clone(),
                            };
                            keys.owners.insert(el.node, (id, Some(branches)));
                        }
                        _ => {}
                    }
                }
                ids.push(id);
            }
            elem_keys.push(ids);
        }
        debug_assert!(
            {
                let mut seen = HashSet::new();
                (0..keys.ends.len()).all(|k| seen.insert(keys.text_of(k as ElemKey)))
            },
            "two elements share a key"
        );
        // A hidden slot holding shared state is saved by its name; a
        // public one by the prop's.
        for (&(t, e), state) in &self.shared_state {
            let id = elem_keys[t as usize][e as usize];
            let n_public = n_public(&c.templates[t as usize].elems[e as usize]);
            for (s, &slot) in state {
                if slot as usize >= n_public {
                    keys.hidden.insert((id, slot as u32), s.key().into());
                }
            }
        }
        // A `fixed` moves a slot's source to a hidden slot, which holds the
        // state saved under the held slot's name.
        for (&(t, e), held) in &self.held {
            let id = elem_keys[t as usize][e as usize];
            let n_public = n_public(&c.templates[t as usize].elems[e as usize]);
            for &(from, to) in held {
                let (from, to) = (from as u32, to as u32);
                let name = keys
                    .hidden
                    .get(&(id, from))
                    .map(|n| n.to_string())
                    .or_else(|| {
                        ((from as usize) < n_public)
                            .then(|| keys.prop_key(id, from))
                            .flatten()
                    });
                if let Some(name) = name {
                    keys.hidden.insert((id, to), name.into());
                    keys.held.insert((id, from), to);
                }
            }
        }
        for (t, ids) in elem_keys.into_iter().enumerate() {
            for (el, id) in c.templates[t].elems.iter_mut().zip(ids) {
                el.key = id;
            }
        }
        keys.text.shrink_to_fit();
        keys.ends.shrink_to_fit();
        keys.types.shrink_to_fit();
        c.keys = Arc::new(keys);
    }
}

impl Keys {
    fn push(&mut self, text: &str, component_type: ComponentType) -> ElemKey {
        self.text.push_str(text);
        self.ends.push(self.text.len() as u32);
        self.types.push(component_type);
        (self.ends.len() - 1) as ElemKey
    }

    fn text_of(&self, key: ElemKey) -> &str {
        let k = key as usize;
        let start = if k == 0 { 0 } else { self.ends[k - 1] as usize };
        &self.text[start..self.ends[k] as usize]
    }

    /// The text of key `key`.
    pub(crate) fn key_text(&self, key: ElemKey) -> &str {
        self.text_of(key)
    }

    /// The type of the element `key` names.
    pub(crate) fn key_type(&self, key: ElemKey) -> ComponentType {
        self.types[key as usize]
    }

    /// Every key by its text, for looking many up.
    pub(crate) fn by_text(&self) -> HashMap<&str, ElemKey> {
        (0..self.ends.len() as ElemKey)
            .map(|k| (self.text_of(k), k))
            .collect()
    }

    /// What saved state names a slot of `key` by: a public prop's name, or
    /// the shared state a hidden slot holds; None for a hidden slot without
    /// any, which is not saved.
    pub(crate) fn prop_key(&self, key: ElemKey, prop: u32) -> Option<String> {
        if prop & HIDDEN != 0 {
            return self
                .hidden
                .get(&(key, prop & !HIDDEN))
                .map(|s| s.to_string());
        }
        self.types[key as usize]
            .prop_name(usize::MAX, prop as usize)
            .map(|n| n.into_owned())
    }

    /// Whether the slot of `key` saved as `prop` is view state (ADR 0017,
    /// step 2): a graph's own bounds, which only pan and zoom write.
    pub(crate) fn is_view(&self, key: ElemKey, prop: &str) -> bool {
        self.types[key as usize] == ComponentType::Graph
            && matches!(prop, "xmin" | "xmax" | "ymin" | "ymax")
    }

    /// The slot of `key` that saved state names `name`, as `prop_key` names
    /// it.
    pub(crate) fn prop_named(&self, key: ElemKey, name: &str) -> Option<u32> {
        let component_type = self.types[key as usize];
        let fixed = component_type.prop_defs().len();
        let public = match component_type.prop_at(name) {
            Some(PropAt::Fixed(i)) => Some(i as u32),
            Some(PropAt::Coord(k, j)) => Some((fixed + 2 * (k - 1) + j) as u32),
            _ => None,
        };
        if let Some(pi) = public {
            // A held slot's state is in the slot its source moved to.
            return Some(self.held.get(&(key, pi)).map_or(pi, |&h| h | HIDDEN));
        }
        self.hidden
            .iter()
            .find(|(at, n)| at.0 == key && &***n == name)
            .map(|(at, _)| at.1 | HIDDEN)
    }

    /// A scope level's stable form, the level of position `k` of the
    /// repeat or choice at `node`: `[key, iteration]` for a repeat's
    /// iteration, `[key, branch]` for a conditional's branch, and `[key,
    /// option, m]` for a select's `m`-th pick of an option.
    pub(crate) fn scope_level(&self, node: NodeId, k: u32) -> Value {
        let Some((key, branches)) = self.owners.get(&node) else {
            return json!([Value::Null, k]);
        };
        let text = self.text_of(*key);
        match branches {
            Some(b) if b.reactive => json!([text, b.keys[k as usize - 1]]),
            Some(b) => json!([
                text,
                b.keys[(k >> PICK_SHIFT) as usize],
                k & ((1 << PICK_SHIFT) - 1)
            ]),
            None => json!([text, k]),
        }
    }

    /// The (node, position) a level in `scope_level`'s form names, if this
    /// version has it.
    pub(crate) fn level_at(&self, level: &Value) -> Option<(NodeId, u32)> {
        let text = level.get(0)?.as_str()?;
        let (&node, (_, branches)) = self
            .owners
            .iter()
            .find(|(_, (key, _))| self.text_of(*key) == text)?;
        let branch = |name: &Value, b: &Branches| {
            let name = name.as_str()?;
            b.keys.iter().position(|k| &**k == name)
        };
        let k = match (branches, level.get(1)?, level.get(2)) {
            (Some(b), name, None) if b.reactive => branch(name, b)? as u32 + 1,
            (Some(b), name, Some(m)) if !b.reactive => {
                pick_position(branch(name, b)?, u32::try_from(m.as_u64()?).ok()?)
            }
            (None, k, None) => u32::try_from(k.as_u64()?).ok()?,
            _ => return None,
        };
        Some((node, k))
    }

    /// The keys as text that is equal exactly when two compiles' are.
    pub(crate) fn fingerprint(&self) -> String {
        let mut hidden: Vec<_> = self.hidden.iter().collect();
        hidden.sort();
        let mut held: Vec<_> = self.held.iter().collect();
        held.sort();
        let mut owners: Vec<_> = self.owners.iter().collect();
        owners.sort_by_key(|(n, _)| **n);
        format!(
            "{:?} {:?} {owners:?} {hidden:?} {held:?}",
            self.text, self.ends
        )
    }

    /// Heap bytes, for the memory estimate.
    pub(crate) fn heap_bytes(&self) -> usize {
        self.text.capacity()
            + self.ends.capacity() * 4
            + self.types.capacity() * std::mem::size_of::<ComponentType>()
            + self.owners.capacity() * 48
            + self.hidden.capacity() * 32
            + self.held.capacity() * 12
    }
}

#[cfg(test)]
mod tests {
    use crate::testing::test_utils::load;

    fn keys(src: &str) -> Vec<String> {
        let doc = load(src).unwrap();
        (0..doc.keys.ends.len() as u32)
            .map(|k| doc.keys.key_text(k).to_string())
            .collect()
    }

    #[test]
    fn keys_follow_names_and_count_unnamed_elements_per_named_ancestor() {
        let k = keys(
            r#"<section name="s"><p><mathInput/></p><mathInput name="m"/><mathInput/></section>
<repeatForSequence name="r" length="2"><point name="q"/><point/></repeatForSequence>
<select name="sel"><option name="one"><number name="x">1</number></option><option><number name="x">2</number></option></select>"#,
        );
        for want in [
            "s",
            "s.p#1",
            "s.mathInput#1",
            "s.m",
            "s.mathInput#2",
            "r",
            "r[*].q",
            "r[*].point#1",
            "sel",
            "sel[one].x",
            "sel[option#1].x",
        ] {
            assert!(k.iter().any(|x| x == want), "no {want} in {k:?}");
        }
    }

    // A name two elements under one named ancestor carry names neither.
    #[test]
    fn an_ambiguous_name_keys_its_elements_as_unnamed() {
        let k = keys(r#"<p><point name="a"/></p><p><point name="a"/></p>"#);
        assert!(!k.iter().any(|x| x == "a"), "{k:?}");
        assert!(k.iter().any(|x| x == "point#2"), "{k:?}");
    }

    // An element the compile makes is the element it is made for and its
    // position among those.
    #[test]
    fn a_made_element_is_keyed_by_the_element_it_is_made_for() {
        let k = keys(r#"<answer name="ans"><award><math>x</math></award></answer>"#);
        assert!(k.iter().any(|x| x == "ans+1"), "{k:?}");
    }
}

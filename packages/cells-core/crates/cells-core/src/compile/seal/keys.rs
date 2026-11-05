//! Stable keys: what saved state names an element, a slot and a scope by,
//! chosen so that an ordinary edit does not move them.
//!
//! A named element's key is its name path (`s.a`); an unnamed one's is its
//! nearest named ancestor's key, its tag and its position (`s.mathInput#2`);
//! a compile-made element's is the element it is made for and a position
//! (`a+1`). Repeat bodies add `[*]` (`r[*].q`), choice branches the
//! branch's key (`sel[option#2].x`). A name two elements under one named
//! ancestor share keys neither.

use std::collections::HashMap;

use serde_json::{Value, json};

use crate::compile::*;

/// Every element's key, by `ElemKey`, and what saved state needs besides.
#[derive(Debug, Default)]
pub(crate) struct Keys {
    /// Every key's text, one after the other; key `i` ends at `ends[i]`.
    text: String,
    ends: Vec<u32>,
    /// The type of the element each key names.
    types: Vec<ComponentType>,
    /// How many of each element's ports are public: its table's props and
    /// its list's points, as far as the compile knows. A port past them is
    /// hidden.
    n_public: Vec<u32>,
    /// The elements that own templates (repeats, choices), by node: their
    /// key, and a choice's branches.
    owners: HashMap<NodeId, (ElemKey, Option<Branches>)>,
    /// A hidden port's name, by (element, port), when it holds shared
    /// state; one without is not saved.
    hidden: HashMap<(ElemKey, u32), Box<str>>,
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

/// How many of an element's ports are public, as far as the compile
/// knows: a bare copy's list is its referent's, which only a build knows,
/// and such a copy has no hidden port, so every port of its is public.
fn n_public(el: &Elem, plan: &ElemPlan) -> u32 {
    match plan.n_public(el.component_type) {
        Some(n) => n as u32,
        None => u32::MAX,
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

impl super::Seal<'_> {
    /// Every element's key, once every element is planned, by template.
    pub(in crate::compile) fn assign_keys(&mut self) -> Vec<Vec<ElemKey>> {
        let mut keys = Keys::default();
        // The branch each choice template is: (choice, branch).
        let mut branch_of: HashMap<TemplateId, (ChoiceId, usize)> = HashMap::new();
        for (ci, ch) in self.choices.iter().enumerate() {
            for (b, &tpl) in ch.branches.iter().enumerate() {
                branch_of.insert(tpl, (ChoiceId::from_index(ci), b));
            }
        }
        // Per base key: how many unnamed elements of each type, and how
        // many made elements, it has so far.
        // A base is (template, the element whose key it is, or ROOT_SCOPE
        // for the template's prefix).
        let mut unnamed: HashMap<(TemplateId, ElemId, ComponentType), u32> = HashMap::new();
        let mut made: HashMap<(TemplateId, ElemId), u32> = HashMap::new();
        let mut elem_keys: Vec<Vec<ElemKey>> = Vec::with_capacity(self.templates.len());
        // Templates are made after the template of the element that owns
        // them, so the owner's key is known first.
        for t in self.template_ids() {
            let prefix = match self.templates[t.index()].parent {
                None => String::new(),
                Some((pt, pe)) => {
                    let owner = keys.text_of(elem_keys[pt.index()][pe.index()]);
                    match branch_of.get(&t) {
                        Some(&(ci, b)) => {
                            format!("{owner}[{}]", self.choices[ci.index()].branch_keys[b])
                        }
                        None => format!("{owner}[*]"),
                    }
                }
            };
            let tpl = self.view(t);
            let mut ids: Vec<ElemKey> = Vec::with_capacity(tpl.elems.len());
            // Whether each element is keyed by its name.
            let mut named: Vec<bool> = Vec::with_capacity(tpl.elems.len());
            for (e, el) in tpl.rows().enumerate() {
                // The nearest ancestor keyed by its name.
                let mut a = el.name_scope;
                let anchor = loop {
                    if a == ROOT_SCOPE || named[a.index()] {
                        break a;
                    }
                    a = tpl.elems[a.index()].name_scope;
                };
                let base = if anchor == ROOT_SCOPE {
                    prefix.as_str()
                } else {
                    keys.text_of(ids[anchor.index()])
                };
                let text = if el.node == NodeId::NONE {
                    // Made for the nearest element that has a node.
                    let mut a = el.name_scope;
                    while a != ROOT_SCOPE && tpl.elems[a.index()].node == NodeId::NONE {
                        a = tpl.elems[a.index()].name_scope;
                    }
                    let owner = if a == ROOT_SCOPE {
                        prefix.as_str()
                    } else {
                        keys.text_of(ids[a.index()])
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
                    let name = (el.name != StrId::NONE)
                        .then(|| self.dast.strings.get(el.name).trim())
                        .filter(|s| {
                            self.names
                                .id(s)
                                .and_then(|id| self.names.entry(t, anchor, id))
                                == Some(ElemId::from_index(e))
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
                let n_public = n_public(el, tpl.plan(ElemId::from_index(e)));
                let id = keys.push(&text, el.component_type, n_public);
                if el.node != NodeId::NONE {
                    match el.body {
                        Body::Repeat { .. } => {
                            keys.owners.insert(el.node, (id, None));
                        }
                        Body::Choice(ci) => {
                            let branches = Branches {
                                reactive: self.choices[ci.index()].reactive,
                                keys: self.choices[ci.index()].branch_keys.clone(),
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
                ElemKey::below(keys.ends.len()).all(|k| seen.insert(keys.text_of(k)))
            },
            "two elements share a key"
        );
        // A hidden port holding a given leaf is saved by what gave it; a
        // public one by the prop's name.
        for (&(t, e), given) in self.given {
            let id = elem_keys[t.index()][e.index()];
            let n_public = keys.n_public[id.index()];
            for (g, &port) in given {
                if port.index() as u32 >= n_public {
                    keys.hidden
                        .insert((id, port.index() as u32), g.key().into());
                }
            }
        }
        keys.text.shrink_to_fit();
        keys.ends.shrink_to_fit();
        keys.types.shrink_to_fit();
        keys.n_public.shrink_to_fit();
        self.plans.keys = Arc::new(keys);
        elem_keys
    }
}

impl Keys {
    fn push(&mut self, text: &str, component_type: ComponentType, n_public: u32) -> ElemKey {
        self.text.push_str(text);
        self.ends.push(self.text.len() as u32);
        self.types.push(component_type);
        self.n_public.push(n_public);
        ElemKey::from_index(self.ends.len() - 1)
    }

    fn text_of(&self, key: ElemKey) -> &str {
        let k = key.index();
        let start = if k == 0 { 0 } else { self.ends[k - 1] as usize };
        &self.text[start..self.ends[k] as usize]
    }

    /// The text of key `key`.
    pub(crate) fn key_text(&self, key: ElemKey) -> &str {
        self.text_of(key)
    }

    /// The type of the element `key` names.
    #[cfg(feature = "testing")]
    pub(crate) fn key_type(&self, key: ElemKey) -> ComponentType {
        self.types[key.index()]
    }

    /// Every key by its text, for looking many up.
    pub(crate) fn by_text(&self) -> HashMap<&str, ElemKey> {
        ElemKey::below(self.ends.len())
            .map(|k| (self.text_of(k), k))
            .collect()
    }

    /// What saved state names port `port` of `key` by: a public
    /// prop's name, or the shared state a hidden port holds; None for a
    /// hidden port without any, which is not saved.
    pub(crate) fn prop_key(&self, key: ElemKey, port: u32) -> Option<String> {
        let n_public = self.n_public[key.index()];
        if port >= n_public {
            return self.hidden.get(&(key, port)).map(|s| s.to_string());
        }
        self.types[key.index()]
            .prop_name(n_public as usize, port as usize)
            .map(|n| n.into_owned())
    }

    /// Whether the slot of `key` saved as `prop` is view state: a graph's
    /// own bounds, which only pan and zoom write.
    pub(crate) fn is_view(&self, key: ElemKey, prop: &str) -> bool {
        self.types[key.index()] == ComponentType::Graph
            && matches!(prop, "xmin" | "xmax" | "ymin" | "ymax")
    }

    /// The port of `key` that saved state names `name`, as `prop_key` names
    /// it.
    pub(crate) fn prop_named(&self, key: ElemKey, name: &str) -> Option<u32> {
        let component_type = self.types[key.index()];
        let n_table = component_type.prop_defs().len();
        let public = match component_type.prop_at(name) {
            Some(PropAt::Position(i)) => Some(i as u32),
            Some(PropAt::Coord(k, j)) => Some((n_table + 2 * (k - 1) + j) as u32),
            _ => None,
        };
        if let Some(port) = public.filter(|&p| p < self.n_public[key.index()]) {
            return Some(port);
        }
        self.hidden
            .iter()
            .find(|(at, n)| at.0 == key && &***n == name)
            .map(|(at, _)| at.1)
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

    /// Heap bytes, for the memory estimate.
    pub(crate) fn heap_bytes(&self) -> usize {
        self.text.capacity()
            + self.ends.capacity() * 4
            + self.types.capacity() * std::mem::size_of::<ComponentType>()
            + self.n_public.capacity() * 4
            + self.owners.capacity() * 48
            + self.hidden.capacity() * 32
    }
}

#[cfg(test)]
mod tests {
    use crate::testing::test_utils::load;

    fn keys(src: &str) -> Vec<String> {
        let doc = load(src).unwrap();
        super::ElemKey::below(doc.loaded.keys.ends.len())
            .map(|k| doc.loaded.keys.key_text(k).to_string())
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

    // A port is saved by its name (ADR 0032): a table prop by the prop's,
    // a list point's coordinate by the coordinate's, a hidden port by the
    // shared state it holds, and the name finds the port again. A hidden
    // port's number is past the public ports, with no bit to mark it.
    #[test]
    fn a_ports_key_is_its_name_and_names_it_again() {
        // One through point: the radius is the circle's own state.
        let doc = load(r#"<graph><circle name="c" through="(1,2)"/></graph>"#).unwrap();
        let keys = &doc.loaded.keys;
        let c = keys.by_text()["c"];
        let n_table = crate::components::ComponentType::Circle.prop_defs().len() as u32;
        for (port, name) in [
            (0, "cx"),
            (n_table, "throughX1"),
            (n_table + 1, "throughY1"),
        ] {
            assert_eq!(keys.prop_key(c, port).as_deref(), Some(name));
            assert_eq!(keys.prop_named(c, name), Some(port));
        }
        // The given radius is in a hidden port, past the public ones,
        // named by the attribute that gives it, apart from the `radius`
        // prop (ADR 0032).
        let r = keys
            .prop_named(c, "_radius")
            .expect("a hidden port holding the given radius");
        assert!(r >= n_table + 2, "hidden ports follow the public ones: {r}");
        assert_eq!(keys.prop_key(c, r).as_deref(), Some("_radius"));
        // A name no port has, and a list point past the list's end, name
        // nothing.
        assert_eq!(keys.prop_named(c, "nothing"), None);
        assert_eq!(keys.prop_named(c, "throughX2"), None);
    }
}

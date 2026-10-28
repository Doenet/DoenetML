//! The input signature (ADR 0017, step 3): what students can act on in a
//! document, and what decides what each input shows and whether it exists
//! or can be acted on, named by stable keys and literals only. It is a
//! function of the source, read off the build the check makes (the probe),
//! whose graph holds every edge any count or pick can create, so an input
//! in any iteration or branch is covered by its template's.
//!
//! An input's *derivation* is a hash over the backward closure of its
//! interactive props and of what decides whether it exists or can be acted
//! on: the `hide` of it and its ancestors, the cases and conditionals
//! around it, the repeats around it. Each cell of the closure hashes as
//! what it is: an essential cell by its key and prop, a fixed cell by its
//! value, a derived cell by its operator and literal parameters over its
//! inputs' hashes; never by a cell index. The defaults of the essential
//! cells in the closure are kept beside it, with whether each is the
//! input's starting value, which an author may change: a cell that is one
//! of the input's props itself, that no operator around the input mixes
//! into anything else, and that no other input's closure reaches.

use std::collections::{BTreeMap, BTreeSet, HashMap};
use std::hash::{DefaultHasher, Hash, Hasher};

use super::*;
use crate::components::prop::{case, conditional_content};
use crate::program::Op;

/// A document's inputs, by their element's stable key.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct Signature {
    pub inputs: BTreeMap<String, Input>,
}

/// One input: an element with props a renderer may request, an answer, or
/// a select.
#[derive(Debug, Clone, PartialEq)]
pub struct Input {
    /// The element it was made from, for a report.
    pub node: NodeId,
    pub tag: &'static str,
    /// Its interactive props, by name, with their value types.
    pub props: Vec<(String, ValueType)>,
    /// The values a request on it can take.
    pub domain: Domain,
    /// What decides what it shows and whether it exists or can be acted on,
    /// but for the defaults of the essential cells it reads. It names each
    /// essential cell by the (element key, prop) that defines it and its
    /// type, so it also fixes which cells a request on the input writes and
    /// which elements share them: a copy sharing its original's state reads
    /// the original's cell, one with its own reads its own.
    pub derivation: u64,
    /// The defaults of every essential cell its closure reads, by the
    /// cell's key: the default's hash, and whether it is the input's
    /// starting value (see the module's comment), which may change.
    pub defaults: BTreeMap<(String, String), (u64, bool)>,
}

/// The values a request on an input can take.
#[derive(Debug, Clone, PartialEq)]
pub enum Domain {
    /// Any value of its type: a number, math or text input, a slider, a
    /// graph's bounds.
    Any,
    /// Inside a graph whose bounds the author set as literals, as
    /// `[xmin, xmax, ymin, ymax]`: whether or not the student can pan, a
    /// point they do not know to pan to is lost.
    Bounds([f64; 4]),
    /// Inside a graph whose bounds are given by cells: their derivation.
    BoundsBy(u64),
    /// A choice input's choices, by key and content, in order: it stores a
    /// position.
    Choices(Vec<(String, u64)>),
    /// A select's options by key, in order, with how it picks.
    Options {
        keys: Vec<String>,
        weights: Vec<u64>,
        num_to_select: u32,
        with_replacement: bool,
    },
}

impl Domain {
    /// Whether every value this domain allows, `new` allows too.
    pub fn within(&self, new: &Domain) -> bool {
        match (self, new) {
            (_, Domain::Any) => true,
            (Domain::Bounds([a0, a1, b0, b1]), Domain::Bounds([c0, c1, d0, d1])) => {
                c0 <= a0 && a1 <= c1 && d0 <= b0 && b1 <= d1
            }
            (Domain::Choices(old), Domain::Choices(new)) => new.starts_with(old),
            (old, new) => old == new,
        }
    }
}

impl BuildOutput {
    /// The input signature of the document this build is the check of,
    /// with every key passed through `rename` (an editor's renames, applied
    /// to the version before them).
    pub(crate) fn signature(
        &self,
        compiled: &Compiled,
        rename: &dyn Fn(&str) -> String,
    ) -> Signature {
        Signer::new(self, compiled, rename).sign()
    }
}

/// An input as found: its component, the labelled cells its derivation
/// starts from, and how many of them (the first) are its interactive props.
type Found = (CompIdx, Vec<(String, CellIdx)>, usize);

/// What the signature is read off: the build and the compile, and the
/// hashes found so far.
struct Signer<'a> {
    out: &'a BuildOutput,
    compiled: &'a Compiled,
    rename: &'a dyn Fn(&str) -> String,
    /// The instruction writing each derived cell, and which of its outputs
    /// the cell is.
    producer: Vec<(u32, u8)>,
    /// Each cell's hash, once found.
    hashes: Vec<Option<u64>>,
    /// Each essential cell's (element key, prop).
    named: HashMap<CellIdx, (String, String)>,
}

fn hash_of(x: impl Hash) -> u64 {
    let mut h = DefaultHasher::new();
    x.hash(&mut h);
    h.finish()
}

/// A number's bits, every NaN one.
fn bits(v: f64) -> u64 {
    if v.is_nan() {
        f64::NAN.to_bits()
    } else {
        v.to_bits()
    }
}

impl<'a> Signer<'a> {
    fn new(
        out: &'a BuildOutput,
        compiled: &'a Compiled,
        rename: &'a dyn Fn(&str) -> String,
    ) -> Self {
        let n = out.cells.len();
        let mut producer = vec![(u32::MAX, 0u8); n];
        for (i, instr) in out.instrs.iter().enumerate() {
            let n_out = match instr.op {
                Op::Vec(_, _, _, n_out) => n_out as usize,
                Op::Sym(kind, ..) => kind.n_out(),
                _ => 1,
            };
            for k in 0..n_out {
                producer[instr.out.index() + k] = (i as u32, k as u8);
            }
        }
        let keys = &compiled.keys;
        let mut named = HashMap::new();
        for (i, &(key, prop)) in out.structure.essential_keys.iter().enumerate() {
            let prop = keys
                .prop_key(key, prop)
                .unwrap_or_else(|| format!("(hidden {})", prop & !HIDDEN));
            named.insert(CellIdx::from_index(i), (rename(keys.key_text(key)), prop));
        }
        Signer {
            out,
            compiled,
            rename,
            producer,
            hashes: vec![None; n],
            named,
        }
    }

    fn sign(mut self) -> Signature {
        let out = self.out;
        let t = &out.components;
        // Each input with the cells its derivation starts from, labelled.
        let mut found: Vec<Found> = Vec::new();
        for c in CompIdx::below(t.component_type.len()) {
            let ty = t.component_type[c.index()];
            let cells = comp_cells(t, c);
            let interactive: Vec<usize> = (0..cells.len())
                .filter(|&pi| ty.is_input_prop(cells.len(), pi))
                .collect();
            if (interactive.is_empty() && ty != ComponentType::Select)
                || out.comp_keys[c.index()] == NONE
            {
                continue;
            }
            let mut seeds: Vec<(String, CellIdx)> = interactive
                .iter()
                .map(|&pi| (prop_label(ty, cells.len(), pi), cells[pi]))
                .collect();
            // What an answer submits and what an updateValue sets.
            for (pi, &cell) in cells.iter().enumerate() {
                let name = prop_label(ty, cells.len(), pi);
                let reads = match ty {
                    ComponentType::Answer | ComponentType::Response => name == "response",
                    ComponentType::UpdateValue => true,
                    _ => false,
                };
                if reads && !interactive.contains(&pi) {
                    seeds.push((name, cell));
                }
            }
            // Whether it exists or can be acted on: the hide of it and
            // its ancestors, the cases, conditionals and repeats around it.
            let mut a = c;
            loop {
                let aty = t.component_type[a.index()];
                let acells = comp_cells(t, a);
                let label = |p: &str| format!("{p}@{}", self.ancestor_label(a));
                if let Some(h) = aty.prop_index("hide") {
                    seeds.push((label("hide"), acells[h]));
                }
                match aty {
                    ComponentType::Case => seeds.push((label("active"), acells[case::ACTIVE])),
                    ComponentType::ConditionalContent => {
                        seeds.push((label("choice"), acells[conditional_content::CHOICE]))
                    }
                    ComponentType::RepeatForSequence
                    | ComponentType::RepeatFor
                    | ComponentType::FunctionIterates => {
                        for (pi, &cell) in acells.iter().enumerate() {
                            seeds.push((label(&prop_label(aty, acells.len(), pi)), cell));
                        }
                    }
                    _ => {}
                }
                let p = t.parent[a.index()];
                if p == CompIdx::NONE {
                    break;
                }
                a = p;
            }
            found.push((c, seeds, interactive.len()));
        }
        // The essential cells each input's closure reads.
        let closures: Vec<BTreeSet<CellIdx>> = found
            .iter()
            .map(|(_, seeds, _)| self.essential_leaves(seeds.iter().map(|s| s.1)))
            .collect();
        let mut reached: HashMap<CellIdx, u32> = HashMap::new();
        for leaves in &closures {
            for &l in leaves {
                *reached.entry(l).or_default() += 1;
            }
        }
        let mut sig = Signature::default();
        for ((c, seeds, n_interactive), leaves) in found.iter().zip(&closures) {
            let c = *c;
            // A default is the input's starting value only when it is one
            // of the input's props itself, no operator around the input
            // mixes it into anything else, and no other input reaches it.
            let own: BTreeSet<CellIdx> = seeds[..*n_interactive].iter().map(|s| s.1).collect();
            let mixed = self.read_by_ops(seeds.iter().map(|s| s.1));
            let starting = |l: CellIdx| reached[&l] == 1 && own.contains(&l) && !mixed.contains(&l);
            let ty = t.component_type[c.index()];
            let cells = comp_cells(t, c);
            let mut h = DefaultHasher::new();
            for (label, cell) in seeds {
                label.hash(&mut h);
                self.hash(*cell).hash(&mut h);
            }

            let input = Input {
                node: t.dast_node[c.index()],
                tag: ty.tag(),
                props: (0..cells.len())
                    .filter(|&pi| ty.is_input_prop(cells.len(), pi))
                    .map(|pi| {
                        (
                            prop_label(ty, cells.len(), pi),
                            out.value_types[cells[pi].index()],
                        )
                    })
                    .collect(),
                domain: self.domain(c),
                derivation: h.finish(),
                defaults: leaves
                    .iter()
                    .map(|&l| (self.named[&l].clone(), (self.default_hash(l), starting(l))))
                    .collect(),
            };
            let key = self.key(out.comp_keys[c.index()]);
            sig.inputs.entry(key).or_insert(input);
        }
        sig
    }

    /// How a seed names ancestor `a`: its key, or its type for one no
    /// element makes.
    fn ancestor_label(&self, a: CompIdx) -> String {
        match self.out.comp_keys[a.index()] {
            NONE => self.out.components.component_type[a.index()]
                .tag()
                .to_string(),
            key => self.key(key),
        }
    }

    /// A key's text, renamed.
    fn key(&self, key: ElemKey) -> String {
        (self.rename)(self.compiled.keys.key_text(key))
    }

    /// The essential cells the closure of `seeds` reads.
    fn essential_leaves(&self, seeds: impl Iterator<Item = CellIdx>) -> BTreeSet<CellIdx> {
        let mut leaves = BTreeSet::new();
        let mut seen: std::collections::HashSet<CellIdx> = std::collections::HashSet::new();
        let mut stack: Vec<CellIdx> = seeds.collect();
        while let Some(cell) = stack.pop() {
            if !seen.insert(cell) {
                continue;
            }
            if cell.index() < self.out.n_essential {
                leaves.insert(cell);
            } else if let Some(instr) = self.instr_of(cell) {
                stack.extend(instr.op.inputs(&self.out.operands.cells));
            }
        }
        leaves
    }

    /// The essential cells an instruction in the closure of `seeds`
    /// reads: those whose default reaches a seed only through an operator.
    fn read_by_ops(&self, seeds: impl Iterator<Item = CellIdx>) -> BTreeSet<CellIdx> {
        let mut read = BTreeSet::new();
        let mut seen: std::collections::HashSet<CellIdx> = std::collections::HashSet::new();
        let mut stack: Vec<CellIdx> = seeds.collect();
        while let Some(cell) = stack.pop() {
            if !seen.insert(cell) || cell.index() < self.out.n_essential {
                continue;
            }
            if let Some(instr) = self.instr_of(cell) {
                for i in instr.op.inputs(&self.out.operands.cells) {
                    if i.index() < self.out.n_essential {
                        read.insert(i);
                    }
                    stack.push(i);
                }
            }
        }
        read
    }

    fn instr_of(&self, cell: CellIdx) -> Option<&Instr> {
        let (i, _) = self.producer[cell.index()];
        (i != u32::MAX).then(|| &self.out.instrs[i as usize])
    }

    /// A cell's hash: what it is, never where it is.
    fn hash(&mut self, cell: CellIdx) -> u64 {
        // Post-order without recursion: a chain of cells may be long.
        let mut stack = vec![(cell, false)];
        while let Some((c, ready)) = stack.pop() {
            if self.hashes[c.index()].is_some() {
                continue;
            }
            let ci = c.index();
            let out = self.out;
            let h = if ci < out.n_essential {
                hash_of(("e", &self.named[&c], out.value_types[ci] as u8))
            } else if ci < out.n_essential + out.n_fixed {
                hash_of(("f", self.value_hash(c, out.cells[ci])))
            } else {
                let Some(instr) = self.instr_of(c) else {
                    self.hashes[ci] = Some(hash_of("unwritten"));
                    continue;
                };
                let inputs: Vec<CellIdx> = instr.op.inputs(&out.operands.cells).collect();
                if !ready {
                    stack.push((c, true));
                    stack.extend(inputs.iter().map(|&i| (i, false)));
                    continue;
                }
                let k = self.producer[ci].1;
                let op = self.op_hash(instr, &inputs);
                let ins: Vec<u64> = inputs
                    .iter()
                    .map(|&i| self.hashes[i.index()].unwrap())
                    .collect();
                hash_of(("d", op, k, ins))
            };
            self.hashes[ci] = Some(h);
        }
        self.hashes[cell.index()].unwrap()
    }

    /// An operator as what it computes: its kind and literal parameters,
    /// and for a symbolic one its expression with leaves numbered by input.
    fn op_hash(&self, instr: &Instr, inputs: &[CellIdx]) -> u64 {
        match instr.op {
            Op::Sym(SymKind::Instantiate { template, post }, ..) => {
                let text = self.out.session.engine.borrow().text(template);
                hash_of(("instantiate", canonical_leaves(&text, inputs), post as u8))
            }
            Op::Sym(SymKind::SampleTape { tape }, ..) => {
                hash_of(("tape", format!("{:?}", self.out.tapes[tape as usize])))
            }
            op => hash_of(format!("{:?}", op.unbound())),
        }
    }

    /// A value as what it means: a number's bits, a string's text, an
    /// expression's text.
    fn value_hash(&self, cell: CellIdx, v: f64) -> u64 {
        if v.is_nan() {
            return hash_of(bits(v));
        }
        match self.out.value_types[cell.index()] {
            ValueType::Number => hash_of(bits(v)),
            ValueType::Text => hash_of(("t", self.out.strings.get(StrId::from_value(v)))),
            ValueType::Math => hash_of((
                "m",
                self.out.session.engine.borrow().text(Handle::from_value(v)),
            )),
        }
    }

    fn default_hash(&self, cell: CellIdx) -> u64 {
        self.value_hash(cell, self.out.structure.essential_defaults[cell.index()])
    }

    /// The values a request on input `c` can take.
    fn domain(&mut self, c: CompIdx) -> Domain {
        let out = self.out;
        let t = &out.components;
        let ty = t.component_type[c.index()];
        match ty {
            ComponentType::Select => {
                let key = out.comp_keys[c.index()];
                let templates = &self.compiled.templates;
                let def = self
                    .compiled
                    .choices
                    .iter()
                    .find(|d| templates[d.at.0.index()].elems[d.at.1.index()].key == key);
                if let Some(def) = def {
                    return Domain::Options {
                        keys: def.branch_keys.iter().map(|k| k.to_string()).collect(),
                        weights: def.weights.iter().map(|&w| bits(w)).collect(),
                        num_to_select: def.num_to_select,
                        with_replacement: def.with_replacement,
                    };
                }
                return Domain::Any;
            }
            ComponentType::ChoiceInput => {
                let d = &self.compiled.dast;
                let kids = children(t, c);
                return Domain::Choices(
                    kids.into_iter()
                        .map(|k| {
                            let key = match out.comp_keys[k.index()] {
                                NONE => String::new(),
                                key => self.key(key),
                            };
                            let node = t.dast_node[k.index()];
                            let content = if node == NodeId::NONE {
                                0
                            } else {
                                hash_of(dast_text(d, node))
                            };
                            (key, content)
                        })
                        .collect(),
                );
            }
            ComponentType::Graph => return Domain::Any,
            _ => {}
        }
        // Inside a graph: its bounds as the author set them.
        let mut a = t.parent[c.index()];
        while a != CompIdx::NONE && t.component_type[a.index()] != ComponentType::Graph {
            a = t.parent[a.index()];
        }
        if a == CompIdx::NONE {
            return Domain::Any;
        }
        let gcells = comp_cells(t, a);
        let bounds: Vec<CellIdx> = ["xmin", "xmax", "ymin", "ymax"]
            .iter()
            .map(|p| {
                gcells[ComponentType::Graph
                    .prop_index(p)
                    .expect("a graph has bounds")]
            })
            .collect();
        // A graph's own bounds, given as literals, are essential (a pan
        // writes them) or fixed: their value as the author set it.
        let literal: Option<Vec<f64>> = bounds
            .iter()
            .map(|&b| {
                let bi = b.index();
                if bi < out.n_essential && self.named[&b].0 == self.key(out.comp_keys[a.index()]) {
                    Some(out.structure.essential_defaults[bi])
                } else if bi >= out.n_essential && bi < out.n_essential + out.n_fixed {
                    Some(out.cells[bi])
                } else {
                    None
                }
            })
            .collect();
        if let Some(v) = literal {
            return Domain::Bounds([v[0], v[1], v[2], v[3]]);
        }
        let mut h = DefaultHasher::new();
        for &b in &bounds {
            self.hash(b).hash(&mut h);
        }
        for l in self.essential_leaves(bounds.into_iter()) {
            self.named[&l].hash(&mut h);
            self.default_hash(l).hash(&mut h);
        }
        Domain::BoundsBy(h.finish())
    }
}

/// The cells of component `c`'s props.
fn comp_cells(t: &ComponentTable, c: CompIdx) -> &[CellIdx] {
    let base = t.prop_base[c.index()] as usize;
    let end = t
        .prop_base
        .get(c.index() + 1)
        .map_or(t.prop_cells.len(), |&e| e as usize);
    &t.prop_cells[base..end]
}

/// Component `c`'s component children.
fn children(t: &ComponentTable, c: CompIdx) -> Vec<CompIdx> {
    let (s, n) = (
        t.child_start[c.index()] as usize,
        t.child_count[c.index()] as usize,
    );
    t.child_list[s..s + n]
        .iter()
        .filter_map(|k| k.as_comp())
        .collect()
}

/// A prop's name, or its position for a hidden slot.
fn prop_label(ty: ComponentType, n_props: usize, pi: usize) -> String {
    ty.prop_name(n_props, pi)
        .map_or_else(|| format!("(hidden {pi})"), |n| n.into_owned())
}

/// Expression text with each cell leaf (`cellN12`) renamed by its position
/// among the instruction's inputs (`#0`).
fn canonical_leaves(text: &str, inputs: &[CellIdx]) -> String {
    let mut out = String::with_capacity(text.len());
    let mut rest = text;
    while let Some(i) = rest.find("cell") {
        out.push_str(&rest[..i]);
        let after = &rest[i + 4..];
        let kind = after.chars().next();
        let digits = after
            .get(1..)
            .map_or(0, |s| s.bytes().take_while(u8::is_ascii_digit).count());
        match (kind, digits) {
            (Some(k @ ('N' | 'M')), n) if n > 0 => {
                let cell = after[1..1 + n].parse().map_or(CellIdx::NONE, CellIdx::new);
                match inputs.iter().position(|&x| x == cell) {
                    Some(p) => out.push_str(&format!("{k}#{p}")),
                    None => out.push_str(&rest[i..i + 5 + n]),
                }
                rest = &after[1 + n..];
            }
            _ => {
                out.push_str("cell");
                rest = after;
            }
        }
    }
    out.push_str(rest);
    out
}

/// A DAST subtree as text: tags, attributes and text, without positions.
fn dast_text(d: &crate::dast::Dast, n: NodeId) -> String {
    use crate::dast::NodeKind;
    let mut out = String::new();
    let mut stack = vec![(n, false)];
    while let Some((n, close)) = stack.pop() {
        match d.kind(n) {
            NodeKind::Element if close => {
                out.push_str("</>");
            }
            NodeKind::Element => {
                out.push('<');
                out.push_str(d.str(n));
                for a in d.attrs(n) {
                    out.push(' ');
                    out.push_str(d.attr_name(a));
                    out.push_str("=\"");
                    for &k in d.attr_children(a) {
                        out.push_str(&dast_text(d, k));
                    }
                    out.push('"');
                }
                out.push('>');
                stack.push((n, true));
                stack.extend(d.children(n).iter().rev().map(|&k| (k, false)));
            }
            _ => out.push_str(d.str(n)),
        }
    }
    out
}

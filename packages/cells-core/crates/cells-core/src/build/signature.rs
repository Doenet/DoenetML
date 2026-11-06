//! The input signature: what students can act on in a document, and what
//! decides what each input shows and whether it exists or can be acted on,
//! named by stable keys and literals only. It is read off the abstract
//! build's definitions (ADR 0035), so an input in any iteration or branch
//! is covered by its template's.
//!
//! An input's *derivation* is a hash over the backward closure of its
//! interactive props and of what decides whether it exists or can be acted
//! on (the `hide` of it and its ancestors, the cases, conditionals and
//! repeats around it). Each cell hashes as what it is, never by its index:
//! an essential cell by its key and prop, a constant by its value, a
//! derived cell by its operator over its inputs' hashes. The defaults of
//! the essential cells in the closure are kept beside it, with whether each
//! is the input's starting value.

use std::collections::BTreeMap;
#[cfg(feature = "testing")]
use std::collections::{BTreeSet, HashMap, HashSet};
use std::hash::{DefaultHasher, Hash, Hasher};

use super::*;
#[cfg(feature = "testing")]
use crate::components::prop::{case, conditional_content};
#[cfg(feature = "testing")]
use crate::sym::engine::template_text;

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
    /// which elements share them.
    pub derivation: u64,
    /// The defaults of every essential cell its closure reads, by the
    /// cell's key: the default's hash, and whether it is the input's
    /// starting value.
    pub defaults: BTreeMap<(String, String), (u64, bool)>,
}

/// The values a request on an input can take.
#[derive(Debug, Clone, PartialEq)]
pub enum Domain {
    /// Any value of its type: a number, math or text input, a slider, a
    /// graph's bounds.
    Any,
    /// Inside a graph whose bounds the author set as literals, as
    /// `[xmin, xmax, ymin, ymax]`.
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

#[cfg(feature = "testing")]
/// The input signature of the document `b` built, read off its
/// definitions, with every key passed through `rename` (an editor's
/// renames, applied to the version before them).
pub(in crate::build) fn sign(
    b: &Builder<'_>,
    defined: &Defined,
    rename: &dyn Fn(&str) -> String,
) -> Signature {
    Signer::new(b, defined, rename).sign()
}

#[cfg(feature = "testing")]
/// An input as found: its component, the labelled cells its derivation
/// starts from, and how many of them (the first) are its interactive props.
type Found = (CompIdx, Vec<(String, SlotId)>, usize);

#[cfg(feature = "testing")]
/// A cell's value as emit will set it: as its source gives it, or the
/// expression a seed imports from a number, by its text.
#[derive(Clone)]
enum Value {
    Raw(f64),
    Expr(String),
}

#[cfg(feature = "testing")]
/// What the signature is read off: the builder and its definitions, with
/// what emit will make of each cell that the signature hashes (its class,
/// its type, its value) and the hashes found so far. A cell is named here
/// by the slot its aliases merged under (`SlotCells::cell_of`).
struct Signer<'a, 'c> {
    b: &'a Builder<'c>,
    cells: &'a SlotCells,
    rename: &'a dyn Fn(&str) -> String,
    /// Per slot, whether a student's action can write it: a given value
    /// whose defining slot it marks is essential, any other a constant
    /// (ADR 0018).
    writable: &'a [bool],
    /// Each cell's value type.
    types: Vec<ValueType>,
    /// The value each seed gives its cell.
    seeded: HashMap<SlotId, Value>,
    /// Each cell's hash, once found.
    hashes: Vec<Option<u64>>,
    /// Each essential cell's (element key, prop).
    named: HashMap<SlotId, (String, String)>,
}

pub(crate) fn hash_of(x: impl Hash) -> u64 {
    let mut h = DefaultHasher::new();
    x.hash(&mut h);
    h.finish()
}

/// A number's bits, every NaN one.
pub(crate) fn bits(v: f64) -> u64 {
    if v.is_nan() {
        f64::NAN.to_bits()
    } else {
        v.to_bits()
    }
}

#[cfg(feature = "testing")]
impl<'a, 'c> Signer<'a, 'c> {
    fn new(b: &'a Builder<'c>, defined: &'a Defined, rename: &'a dyn Fn(&str) -> String) -> Self {
        let n = b.sources.len();
        let (cells, writable) = (&defined.slot_cells, defined.essential.as_slice());
        // A typed slot's cell is of its type; a symbolic operator that
        // makes math makes a math cell.
        let mut types = vec![ValueType::Number; n];
        for &(s, ty) in &b.typed_slots {
            types[cells.cell_of(s).index()] = ty;
        }
        let mut signer = Signer {
            b,
            cells,
            rename,
            writable,
            types,
            seeded: HashMap::new(),
            hashes: vec![None; n],
            named: HashMap::new(),
        };
        // Seeds read the types the slots declare, before an operator's
        // output is typed by what it makes.
        signer.seed();
        for s in SlotId::below(n) {
            let makes_math = match b.sources[s.index()] {
                BuiltSource::Op(PlannedOp::Template { .. }, ..) => true,
                BuiltSource::Op(PlannedOp::Spec(OpSpec::Sym(kind)), ..) => kind.makes_math(),
                _ => false,
            };
            if makes_math && cells.defines(s) {
                signer.types[cells.cell_of(s).index()] = ValueType::Math;
            }
        }
        for s in SlotId::below(n) {
            if !signer.is_essential_def(s) {
                continue;
            }
            let (_, _, (key, prop)) = b.essential_key(s);
            let keys = &b.compiled.plans.keys;
            let prop = keys
                .prop_key(key, prop)
                .unwrap_or_else(|| format!("(hidden {prop})"));
            signer
                .named
                .insert(cells.cell_of(s), (rename(keys.key_text(key)), prop));
        }
        signer
    }

    /// What the seeds give (`Builder::seed_cells`): each seeded cell takes
    /// its source cell's value, a number as the expression emit imports it
    /// as.
    fn seed(&mut self) {
        let b = self.b;
        for &(s, from) in &b.seeds {
            let src = b.seed_source(self.cells, from);
            let seed = match self.value(src) {
                Value::Raw(v) if self.types[src.index()] == ValueType::Math || v.is_nan() => {
                    Value::Raw(v)
                }
                Value::Raw(v) => Value::Expr(template_text(&Tree::<u32>::Num(v))),
                expr => expr,
            };
            self.seeded.insert(self.cells.cell_of(s), seed);
        }
    }

    fn sign(mut self) -> Signature {
        let b = self.b;
        let t = &b.components;
        // Each input with the cells its derivation starts from, labelled.
        let mut found: Vec<Found> = Vec::new();
        for c in CompIdx::below(t.component_type.len()) {
            let ty = t.component_type[c.index()];
            let np = b.n_public(c);
            let interactive: Vec<usize> = (0..np).filter(|&pi| ty.is_input_prop(np, pi)).collect();
            if (interactive.is_empty() && ty != ComponentType::Select)
                || b.comp_key(c) == ElemKey::NONE
            {
                continue;
            }
            let mut seeds: Vec<(String, SlotId)> = interactive
                .iter()
                .map(|&pi| (prop_label(ty, np, pi), self.prop_cell(c, pi)))
                .collect();
            // What an answer submits and what an updateValue sets.
            for pi in 0..np {
                let name = prop_label(ty, np, pi);
                let reads = match ty {
                    ComponentType::Answer | ComponentType::Response => name == "response",
                    ComponentType::UpdateValue => true,
                    _ => false,
                };
                if reads && !interactive.contains(&pi) {
                    seeds.push((name, self.prop_cell(c, pi)));
                }
            }
            // Whether it exists or can be acted on: the hide of it and
            // its ancestors, the cases, conditionals and repeats around it.
            let mut a = c;
            loop {
                let aty = t.component_type[a.index()];
                let anp = b.n_public(a);
                let label = |p: &str| format!("{p}@{}", self.ancestor_label(a));
                if let Some(h) = aty.prop_index("hide") {
                    seeds.push((label("hide"), self.prop_cell(a, h)));
                }
                match aty {
                    ComponentType::Case => {
                        seeds.push((label("active"), self.prop_cell(a, case::ACTIVE)))
                    }
                    ComponentType::ConditionalContent => seeds.push((
                        label("choice"),
                        self.prop_cell(a, conditional_content::CHOICE),
                    )),
                    ComponentType::RepeatForSequence
                    | ComponentType::RepeatFor
                    | ComponentType::FunctionIterates => {
                        for pi in 0..anp {
                            seeds.push((label(&prop_label(aty, anp, pi)), self.prop_cell(a, pi)));
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
        let closures: Vec<BTreeSet<SlotId>> = found
            .iter()
            .map(|(_, seeds, _)| self.essential_leaves(seeds.iter().map(|s| s.1)))
            .collect();
        let mut reached: HashMap<SlotId, u32> = HashMap::new();
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
            let own: BTreeSet<SlotId> = seeds[..*n_interactive].iter().map(|s| s.1).collect();
            let mixed = self.read_by_ops(seeds.iter().map(|s| s.1));
            let starting = |l: SlotId| reached[&l] == 1 && own.contains(&l) && !mixed.contains(&l);
            let ty = t.component_type[c.index()];
            let np = b.n_public(c);
            let mut h = DefaultHasher::new();
            for (label, cell) in seeds {
                label.hash(&mut h);
                self.hash(*cell).hash(&mut h);
            }

            let input = Input {
                node: t.dast_node[c.index()],
                tag: ty.tag(),
                props: (0..np)
                    .filter(|&pi| ty.is_input_prop(np, pi))
                    .map(|pi| {
                        (
                            prop_label(ty, np, pi),
                            self.types[self.prop_cell(c, pi).index()],
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
            let key = self.key(b.comp_key(c));
            sig.inputs.entry(key).or_insert(input);
        }
        sig
    }

    /// The cell of prop `pi` of component `c`.
    fn prop_cell(&self, c: CompIdx, pi: usize) -> SlotId {
        self.cells.cell_of(self.b.slot_base[c.index()].offset(pi))
    }

    /// Whether slot `s` defines an essential cell: a given value a
    /// student's action can write.
    fn is_essential_def(&self, s: SlotId) -> bool {
        self.cells.defines(s)
            && matches!(self.b.sources[s.index()], BuiltSource::Given(_))
            && self.writable[s.index()]
    }

    /// Whether `cell` is essential: a given value a student's action can
    /// write.
    fn is_essential(&self, cell: SlotId) -> bool {
        self.is_essential_def(self.cells.def(cell))
    }

    /// Whether `cell` is a constant: a constant, or a given value no
    /// student's action can write.
    fn is_const(&self, cell: SlotId) -> bool {
        let d = self.cells.def(cell);
        match self.b.sources[d.index()] {
            BuiltSource::Const(_) => true,
            BuiltSource::Given(_) => !self.writable[d.index()],
            _ => false,
        }
    }

    /// The operator slot that computes `cell`, and which of its outputs
    /// the cell is; none for an essential cell or a constant.
    fn producer(&self, cell: SlotId) -> Option<(SlotId, u8)> {
        let d = self.cells.def(cell);
        match self.b.sources[d.index()] {
            BuiltSource::Op(..) => Some((d, 0)),
            BuiltSource::VecOut(head, k) => Some((self.cells.def(self.cells.cell_of(head)), k)),
            _ => None,
        }
    }

    /// The cells operator slot `op` reads, in its order.
    fn op_inputs(&self, op: SlotId) -> Vec<SlotId> {
        let BuiltSource::Op(_, start, n) = self.b.sources[op.index()] else {
            unreachable!("an operator slot")
        };
        self.b.op_inputs[start.index()..start.index() + n as usize]
            .iter()
            .map(|&s| self.cells.cell_of(s))
            .collect()
    }

    /// The cells of the flags that hold `cell`, each once, in the order
    /// the build made them.
    fn flags(&self, cell: SlotId) -> Vec<SlotId> {
        let mut flags = Vec::new();
        for &f in self.cells.flags(cell) {
            let f = self.cells.cell_of(f);
            if !flags.contains(&f) {
                flags.push(f);
            }
        }
        flags
    }

    /// What `cell` needs: its operator's inputs, then the flags that hold
    /// it. The one relation the closure and the hash follow.
    fn needs(&self, cell: SlotId) -> Vec<SlotId> {
        let mut all = match self.producer(cell) {
            Some((op, _)) => self.op_inputs(op),
            None => Vec::new(),
        };
        all.extend(self.flags(cell));
        all
    }

    /// A cell's value as emit sets it, for a cell no operator computes:
    /// its source's, unless a seed replaced it.
    fn value(&self, cell: SlotId) -> Value {
        if let Some(v) = self.seeded.get(&cell) {
            return v.clone();
        }
        match self.b.sources[self.cells.def(cell).index()] {
            BuiltSource::Given(v) | BuiltSource::Const(v) => Value::Raw(v),
            _ => Value::Raw(f64::NAN),
        }
    }

    /// How a seed names ancestor `a`: its key, or its type for one no
    /// element makes.
    fn ancestor_label(&self, a: CompIdx) -> String {
        match self.b.comp_key(a) {
            ElemKey::NONE => self.b.components.component_type[a.index()]
                .tag()
                .to_string(),
            key => self.key(key),
        }
    }

    /// A key's text, renamed.
    fn key(&self, key: ElemKey) -> String {
        (self.rename)(self.b.compiled.plans.keys.key_text(key))
    }

    /// A string by its id: the source's, or one the compile added.
    fn string(&self, id: StrId) -> &str {
        let strings = &self.b.compiled.dast.strings;
        match id.index().checked_sub(strings.len()) {
            None => strings.get(id),
            Some(extra) => &self.b.compiled.plans.extra_strings[extra],
        }
    }

    /// The essential cells the closure of `seeds` reads.
    fn essential_leaves(&self, seeds: impl Iterator<Item = SlotId>) -> BTreeSet<SlotId> {
        let mut leaves = BTreeSet::new();
        let mut seen: HashSet<SlotId> = HashSet::new();
        let mut stack: Vec<SlotId> = seeds.collect();
        while let Some(cell) = stack.pop() {
            if !seen.insert(cell) {
                continue;
            }
            if self.is_essential(cell) {
                leaves.insert(cell);
            }
            stack.extend(self.needs(cell));
        }
        leaves
    }

    /// The essential cells an operator in the closure of `seeds` reads:
    /// those whose default reaches a seed only through an operator.
    fn read_by_ops(&self, seeds: impl Iterator<Item = SlotId>) -> BTreeSet<SlotId> {
        let mut read = BTreeSet::new();
        let mut seen: HashSet<SlotId> = HashSet::new();
        let mut stack: Vec<SlotId> = seeds.collect();
        while let Some(cell) = stack.pop() {
            if !seen.insert(cell) {
                continue;
            }
            for i in self.needs(cell) {
                if self.is_essential(i) {
                    read.insert(i);
                }
                stack.push(i);
            }
        }
        read
    }

    /// A cell's hash: what it is, never where it is, and what holds it.
    fn hash(&mut self, cell: SlotId) -> u64 {
        // Post-order without recursion: a chain of cells may be long.
        let mut stack = vec![(cell, false)];
        while let Some((c, ready)) = stack.pop() {
            if self.hashes[c.index()].is_some() {
                continue;
            }
            let ci = c.index();
            let producer = self.producer(c);
            let inputs = producer.map_or_else(Vec::new, |(op, _)| self.op_inputs(op));
            let flags = self.flags(c);
            if !ready {
                stack.push((c, true));
                stack.extend(inputs.iter().chain(&flags).map(|&i| (i, false)));
                continue;
            }
            let hash = |cells: &[SlotId]| -> Vec<u64> {
                cells
                    .iter()
                    .map(|&i| self.hashes[i.index()].unwrap())
                    .collect()
            };
            let (ins, holds) = (hash(&inputs), hash(&flags));
            let what = if self.is_essential(c) {
                hash_of(("e", &self.named[&c], self.types[ci] as u8))
            } else if self.is_const(c) {
                hash_of(("f", self.value_hash(c, &self.value(c))))
            } else if let Some((op, k)) = producer {
                // A `ChoiceIndex`'s count of choices (its second input) is
                // the input's domain, which condition 1 compares: appending
                // a choice keeps every index a student could have chosen.
                let ins = match self.b.sources[op.index()] {
                    BuiltSource::Op(PlannedOp::Spec(OpSpec::ChoiceIndex), ..) => &ins[..1],
                    _ => &ins[..],
                };
                hash_of(("d", self.op_hash(op, &inputs), k, ins))
            } else {
                hash_of("unwritten")
            };
            self.hashes[ci] = Some(if holds.is_empty() {
                what
            } else {
                hash_of((what, "held", holds))
            });
        }
        self.hashes[cell.index()].unwrap()
    }

    /// An operator as what it computes: its kind (a vector one's options),
    /// and for a symbolic one its planned template with leaves numbered by
    /// input. A sampled curve hashes as `Sample` over the shape it reads.
    fn op_hash(&self, op: SlotId, inputs: &[SlotId]) -> u64 {
        let BuiltSource::Op(planned, ..) = self.b.sources[op.index()] else {
            unreachable!("an operator slot")
        };
        match planned {
            PlannedOp::Template { template, post } => {
                // The template over its inputs' positions, printed as the
                // engine prints it: what the signature has always hashed a
                // template as, which a cell leaf's number does not change.
                let tree = self.b.sym_templates[template.index()].map_leaves(|s| {
                    let cell = self.cells.cell_of(s);
                    inputs
                        .iter()
                        .position(|&x| x == cell)
                        .map_or(u32::MAX, |p| p as u32)
                });
                hash_of((
                    "instantiate",
                    canonical_leaves(&template_text(&tree)),
                    post as u8,
                ))
            }
            PlannedOp::Spec(OpSpec::Sym(kind)) => hash_of(format!("{kind:?}")),
            PlannedOp::Spec(OpSpec::Vec(v)) => hash_of(format!("{v:?}")),
            PlannedOp::Spec(spec) => hash_of(format!("{spec:?}")),
        }
    }

    /// A value as what it means: a number's bits, a string's text, an
    /// expression's text.
    fn value_hash(&self, cell: SlotId, v: &Value) -> u64 {
        let v = match v {
            Value::Expr(text) => return hash_of(("m", text)),
            Value::Raw(v) => *v,
        };
        if v.is_nan() {
            return hash_of(bits(v));
        }
        match self.types[cell.index()] {
            ValueType::Number => hash_of(bits(v)),
            ValueType::Text => hash_of(("t", self.string(StrId::from_value(v)))),
            ValueType::Math => hash_of(("m", self.b.engine.text(Handle::from_value(v)))),
        }
    }

    /// The hash of essential `cell`'s default: its value as the build
    /// starts it.
    fn default_hash(&self, cell: SlotId) -> u64 {
        self.value_hash(cell, &self.value(cell))
    }

    /// The values a request on input `c` can take.
    fn domain(&mut self, c: CompIdx) -> Domain {
        let b = self.b;
        let t = &b.components;
        let ty = t.component_type[c.index()];
        match ty {
            ComponentType::Select => {
                let key = b.comp_key(c);
                let templates = &b.compiled.plans.templates;
                let def =
                    b.compiled.plans.choices.iter().find(|d| {
                        templates[d.at.0.index()].sealed.elems[d.at.1.index()].key == key
                    });
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
                let d = b.compiled.dast;
                let kids = children(t, c);
                return Domain::Choices(
                    kids.into_iter()
                        .map(|k| {
                            let key = match b.comp_key(k) {
                                ElemKey::NONE => String::new(),
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
        let bounds: Vec<SlotId> = ["xmin", "xmax", "ymin", "ymax"]
            .iter()
            .map(|p| {
                self.prop_cell(
                    a,
                    ComponentType::Graph
                        .prop_index(p)
                        .expect("a graph has bounds"),
                )
            })
            .collect();
        // A graph's own bounds, given as literals, are essential (a pan
        // writes them) or constants: their value as the author set it,
        // which is an essential cell's default.
        let number = |v: Value| match v {
            Value::Raw(v) => v,
            Value::Expr(_) => f64::NAN,
        };
        let literal: Option<Vec<f64>> = bounds
            .iter()
            .map(|&bound| {
                let own =
                    self.is_essential(bound) && self.named[&bound].0 == self.key(b.comp_key(a));
                (own || self.is_const(bound)).then(|| number(self.value(bound)))
            })
            .collect();
        if let Some(v) = literal {
            return Domain::Bounds([v[0], v[1], v[2], v[3]]);
        }
        let mut h = DefaultHasher::new();
        for &bound in &bounds {
            self.hash(bound).hash(&mut h);
        }
        for l in self.essential_leaves(bounds.into_iter()) {
            self.named[&l].hash(&mut h);
            self.default_hash(l).hash(&mut h);
        }
        Domain::BoundsBy(h.finish())
    }
}

#[cfg(feature = "testing")]
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
pub(crate) fn prop_label(ty: ComponentType, n_props: usize, pi: usize) -> String {
    ty.prop_name(n_props, pi)
        .map_or_else(|| format!("(hidden {pi})"), |n| n.into_owned())
}

/// Expression text with each cell leaf, numbered by its position among the
/// operator's inputs (`cellN0`), as `N#0`.
pub(crate) fn canonical_leaves(text: &str) -> String {
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
                out.push(k);
                out.push('#');
                out.push_str(&after[1..1 + n]);
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
pub(crate) fn dast_text(d: &crate::dast::Dast, n: NodeId) -> String {
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

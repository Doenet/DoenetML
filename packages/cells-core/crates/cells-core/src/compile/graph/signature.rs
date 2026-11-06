//! The input signature (ADR 0017) read off the template graph's
//! definitions (ADR 0032 step 8, ADR 0035), as `build/signature.rs` reads
//! it off the abstract build's: what students can act on, and what decides
//! what each input shows and whether it exists or can be acted on, named
//! by stable keys and literals only. An input in any iteration or branch is
//! covered by its template's.
//!
//! The compile has no math engine; the signature makes one of its own, as
//! the abstract build did, for what a math value or a symbolic template
//! hashes as: its text.

use std::collections::{BTreeSet, HashMap, HashSet};
use std::hash::{DefaultHasher, Hash, Hasher};

use super::define::Defined;
use super::*;
use crate::build::signature::{
    Domain, Input, Signature, bits, canonical_leaves, dast_text, hash_of, prop_label,
};
use crate::components::prop::{case, conditional_content};
use crate::program::ValueType;
use crate::sym::Engine;
use crate::sym::engine::template_text;

/// The input signature of `g`, the template graph of `c` as define made
/// it, every key passed through `rename`.
pub(crate) fn sign(
    g: &TemplateGraph,
    d: &Defined,
    c: CompiledRef<'_>,
    rename: &dyn Fn(&str) -> String,
) -> Signature {
    Signer::new(g, d, c, rename).sign()
}

/// An input as found: its component's position, the labelled cells its
/// derivation starts from, and how many of them (the first) are its
/// interactive props.
type Found = (usize, Vec<(String, GraphNode)>, usize);

/// A cell's value as emit will set it: a number (or a string's or a
/// handle's id), or an expression by its text.
#[derive(Clone)]
enum Value {
    Raw(f64),
    Expr(String),
}

/// What the signature is read off: the graph and its definitions, with
/// what emit will make of each cell the signature hashes (its type, its
/// value) and the hashes found so far. A cell is named by the node its
/// aliases merged under.
struct Signer<'a, 'c> {
    g: &'a TemplateGraph,
    d: &'a Defined,
    c: CompiledRef<'c>,
    rename: &'a dyn Fn(&str) -> String,
    engine: Engine,
    types: Vec<ValueType>,
    seeded: HashMap<GraphNode, Value>,
    hashes: Vec<Option<u64>>,
    named: HashMap<GraphNode, (String, String)>,
}

impl<'a, 'c> Signer<'a, 'c> {
    fn new(
        g: &'a TemplateGraph,
        d: &'a Defined,
        c: CompiledRef<'c>,
        rename: &'a dyn Fn(&str) -> String,
    ) -> Self {
        let n = g.nodes.len();
        let mut types = vec![ValueType::Number; n];
        for &(s, ty) in &g.typed {
            types[d.cell_of(s).index()] = ty;
        }
        let mut signer = Signer {
            g,
            d,
            c,
            rename,
            engine: Engine::new(),
            types,
            seeded: HashMap::new(),
            hashes: vec![None; n],
            named: HashMap::new(),
        };
        // Seeds read the types the nodes declare, before an operator's
        // output is typed by what it makes.
        signer.seed();
        for s in GraphNode::below(n) {
            let makes_math = match g.defs[s.index()] {
                Def::Op(GraphOp::Template(_), _) => true,
                Def::Op(GraphOp::Spec(OpSpec::Sym(kind)), _) => kind.makes_math(),
                _ => false,
            };
            if makes_math && d.defines(s) {
                signer.types[d.cell_of(s).index()] = ValueType::Math;
            }
        }
        let keys = &c.plans.keys;
        for s in GraphNode::below(n) {
            if !signer.is_essential_def(s) {
                continue;
            }
            let NodeKind::Port { elem, port } = g.nodes[s.index()].kind else {
                unreachable!("an essential value is an element's port")
            };
            let t = g.nodes[s.index()].template;
            let key = c.plans.templates[t.index()].sealed.elems[elem.index()].key;
            let prop = keys
                .prop_key(key, port)
                .unwrap_or_else(|| format!("(hidden {port})"));
            signer
                .named
                .insert(d.cell_of(s), (rename(keys.key_text(key)), prop));
        }
        signer
    }

    /// The cell a seed takes its value from: `from`'s, or for a counted
    /// value (a copy of the number the build counted) the number itself.
    fn seed_source(&self, from: GraphNode) -> GraphNode {
        let cell = self.d.cell_of(from);
        if let Def::Op(GraphOp::Spec(OpSpec::Copy), inputs) = &self.g.defs[self.d.def(cell).index()]
            && inputs.len() == 1
            && self.g.counted.iter().any(|&s| self.d.cell_of(s) == cell)
        {
            return self.d.cell_of(inputs[0]);
        }
        cell
    }

    /// What the seeds give: each seeded cell takes its source cell's value,
    /// a number as the expression emit imports it as.
    fn seed(&mut self) {
        for &(s, from) in &self.g.seeds {
            let src = self.seed_source(from);
            let seed = match self.value(src) {
                Value::Raw(v) if self.types[src.index()] == ValueType::Math || v.is_nan() => {
                    Value::Raw(v)
                }
                Value::Raw(v) => Value::Expr(template_text(&Tree::<u32>::Num(v))),
                expr => expr,
            };
            self.seeded.insert(self.d.cell_of(s), seed);
        }
    }

    fn sign(mut self) -> Signature {
        let g = self.g;
        let mut found: Vec<Found> = Vec::new();
        for (ci, comp) in g.comps.iter().enumerate() {
            let (ty, np) = (comp.component_type, comp.n_public as usize);
            let interactive: Vec<usize> = (0..np).filter(|&pi| ty.is_input_prop(np, pi)).collect();
            if (interactive.is_empty() && ty != ComponentType::Select)
                || self.comp_key(ci) == ElemKey::NONE
            {
                continue;
            }
            let mut seeds: Vec<(String, GraphNode)> = interactive
                .iter()
                .map(|&pi| (prop_label(ty, np, pi), self.prop_cell(ci, pi)))
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
                    seeds.push((name, self.prop_cell(ci, pi)));
                }
            }
            // Whether it exists or can be acted on: the hide of it and its
            // ancestors, the cases, conditionals and repeats around it.
            let mut a = ci;
            loop {
                let ac = g.comps[a];
                let (aty, anp) = (ac.component_type, ac.n_public as usize);
                let label = |s: &Self, p: &str| format!("{p}@{}", s.ancestor_label(a));
                if let Some(h) = aty.prop_index("hide") {
                    seeds.push((label(&self, "hide"), self.prop_cell(a, h)));
                }
                match aty {
                    ComponentType::Case => {
                        seeds.push((label(&self, "active"), self.prop_cell(a, case::ACTIVE)))
                    }
                    ComponentType::ConditionalContent => seeds.push((
                        label(&self, "choice"),
                        self.prop_cell(a, conditional_content::CHOICE),
                    )),
                    ComponentType::RepeatForSequence
                    | ComponentType::RepeatFor
                    | ComponentType::FunctionIterates => {
                        for pi in 0..anp {
                            seeds.push((
                                label(&self, &prop_label(aty, anp, pi)),
                                self.prop_cell(a, pi),
                            ));
                        }
                    }
                    _ => {}
                }
                if ac.parent == u32::MAX {
                    break;
                }
                a = ac.parent as usize;
            }
            found.push((ci, seeds, interactive.len()));
        }
        let closures: Vec<BTreeSet<GraphNode>> = found
            .iter()
            .map(|(_, seeds, _)| self.essential_leaves(seeds.iter().map(|s| s.1)))
            .collect();
        let mut reached: HashMap<GraphNode, u32> = HashMap::new();
        for leaves in &closures {
            for &l in leaves {
                *reached.entry(l).or_default() += 1;
            }
        }
        let mut sig = Signature::default();
        for ((ci, seeds, n_interactive), leaves) in found.iter().zip(&closures) {
            let ci = *ci;
            // A default is the input's starting value only when it is one
            // of the input's props itself, no operator around the input
            // mixes it into anything else, and no other input reaches it.
            let own: BTreeSet<GraphNode> = seeds[..*n_interactive].iter().map(|s| s.1).collect();
            let mixed = self.read_by_ops(seeds.iter().map(|s| s.1));
            let starting =
                |l: GraphNode| reached[&l] == 1 && own.contains(&l) && !mixed.contains(&l);
            let comp = g.comps[ci];
            let (ty, np) = (comp.component_type, comp.n_public as usize);
            let mut h = DefaultHasher::new();
            for (label, cell) in seeds {
                label.hash(&mut h);
                self.hash(*cell).hash(&mut h);
            }
            let node = comp.elem.map_or(NodeId::NONE, |(t, e)| {
                self.c.plans.templates[t.index()].row(e).node
            });
            let input = Input {
                node,
                tag: ty.tag(),
                props: (0..np)
                    .filter(|&pi| ty.is_input_prop(np, pi))
                    .map(|pi| {
                        (
                            prop_label(ty, np, pi),
                            self.types[self.prop_cell(ci, pi).index()],
                        )
                    })
                    .collect(),
                domain: self.domain(ci),
                derivation: h.finish(),
                defaults: leaves
                    .iter()
                    .map(|&l| (self.named[&l].clone(), (self.default_hash(l), starting(l))))
                    .collect(),
            };
            let key = self.key(self.comp_key(ci));
            sig.inputs.entry(key).or_insert(input);
        }
        sig
    }

    /// The stable key of the component at `ci`; NONE for one no element
    /// makes.
    fn comp_key(&self, ci: usize) -> ElemKey {
        self.g.comps[ci].elem.map_or(ElemKey::NONE, |(t, e)| {
            self.c.plans.templates[t.index()].sealed.elems[e.index()].key
        })
    }

    /// The cell of prop `pi` of the component at `ci`.
    fn prop_cell(&self, ci: usize, pi: usize) -> GraphNode {
        self.d.cell_of(self.g.comps[ci].base.offset(pi))
    }

    /// Whether node `s` defines an essential cell: a given value a
    /// student's action can write.
    fn is_essential_def(&self, s: GraphNode) -> bool {
        self.d.defines(s)
            && matches!(self.g.defs[s.index()], Def::Given(_))
            && self.d.essential[s.index()]
    }

    fn is_essential(&self, cell: GraphNode) -> bool {
        self.is_essential_def(self.d.def(cell))
    }

    /// Whether `cell` is a constant: a constant, or a given value no
    /// student's action can write.
    fn is_const(&self, cell: GraphNode) -> bool {
        let def = self.d.def(cell);
        match self.g.defs[def.index()] {
            Def::Const(_) => true,
            Def::Given(_) => !self.d.essential[def.index()],
            _ => false,
        }
    }

    /// The operator node computing `cell`, and which of its outputs the
    /// cell is; none for an essential cell or a constant.
    fn producer(&self, cell: GraphNode) -> Option<(GraphNode, u8)> {
        let def = self.d.def(cell);
        match self.g.defs[def.index()] {
            Def::Op(..) => Some((def, 0)),
            Def::VecOut(head, k) => Some((self.d.def(self.d.cell_of(head)), k)),
            _ => None,
        }
    }

    /// The cells operator node `op` reads, in its order.
    fn op_inputs(&self, op: GraphNode) -> Vec<GraphNode> {
        let Def::Op(_, inputs) = &self.g.defs[op.index()] else {
            unreachable!("an operator node")
        };
        inputs.iter().map(|&s| self.d.cell_of(s)).collect()
    }

    /// The cells of the flags that hold `cell`, each once.
    fn flags(&self, cell: GraphNode) -> Vec<GraphNode> {
        let mut flags = Vec::new();
        for &f in self.d.flags(cell) {
            let f = self.d.cell_of(f);
            if !flags.contains(&f) {
                flags.push(f);
            }
        }
        flags
    }

    /// What `cell` needs: its operator's inputs, then its flags.
    fn needs(&self, cell: GraphNode) -> Vec<GraphNode> {
        let mut all = match self.producer(cell) {
            Some((op, _)) => self.op_inputs(op),
            None => Vec::new(),
        };
        all.extend(self.flags(cell));
        all
    }

    /// A cell's value as emit sets it, for a cell no operator computes:
    /// its definition's, a math one by its text, unless a seed replaced
    /// it.
    fn value(&mut self, cell: GraphNode) -> Value {
        if let Some(v) = self.seeded.get(&cell) {
            return v.clone();
        }
        let def = self.d.def(cell);
        match self.g.defs[def.index()] {
            Def::Given(Some(v)) | Def::Const(Some(v)) => Value::Raw(v),
            Def::Given(None) | Def::Const(None) => match self.g.math.get(&def) {
                Some(origin) => Value::Expr(self.math_text(origin)),
                None => Value::Raw(f64::NAN),
            },
            _ => Value::Raw(f64::NAN),
        }
    }

    /// The text of a math value, as the engine prints the handle the
    /// abstract build made of it.
    fn math_text(&mut self, origin: &MathOrigin) -> String {
        let h = match origin {
            MathOrigin::Tree(tree) => self.engine.import(tree),
            MathOrigin::Constant(expr, post) => {
                let text = self.c.plans.sym_text[expr].spell(self.c.dast);
                let h = match self.engine.parse_tree::<RefId>(&text) {
                    Ok(tree) => self.engine.import(&tree),
                    Err(_) => self
                        .engine
                        .parse_constant(&text)
                        .expect("a constant math text parses"),
                };
                match post {
                    Post::None => h,
                    Post::Simplify => self.engine.simplify(h),
                    Post::Expand => self.engine.expand(h),
                    Post::SimplifyExpand => {
                        let h = self.engine.simplify(h);
                        self.engine.expand(h)
                    }
                }
            }
        };
        self.engine.text(h)
    }

    /// How a seed names ancestor `a`: its key, or its type for one no
    /// element makes.
    fn ancestor_label(&self, a: usize) -> String {
        match self.comp_key(a) {
            ElemKey::NONE => self.g.comps[a].component_type.tag().to_string(),
            key => self.key(key),
        }
    }

    /// A key's text, renamed.
    fn key(&self, key: ElemKey) -> String {
        (self.rename)(self.c.plans.keys.key_text(key))
    }

    /// A string by its id: the source's, or one the compile added.
    fn string(&self, id: StrId) -> &str {
        let strings = &self.c.dast.strings;
        match id.index().checked_sub(strings.len()) {
            None => strings.get(id),
            Some(extra) => &self.c.plans.extra_strings[extra],
        }
    }

    /// The essential cells the closure of `seeds` reads.
    fn essential_leaves(&self, seeds: impl Iterator<Item = GraphNode>) -> BTreeSet<GraphNode> {
        let mut leaves = BTreeSet::new();
        let mut seen: HashSet<GraphNode> = HashSet::new();
        let mut stack: Vec<GraphNode> = seeds.collect();
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

    /// The essential cells an operator in the closure of `seeds` reads.
    fn read_by_ops(&self, seeds: impl Iterator<Item = GraphNode>) -> BTreeSet<GraphNode> {
        let mut read = BTreeSet::new();
        let mut seen: HashSet<GraphNode> = HashSet::new();
        let mut stack: Vec<GraphNode> = seeds.collect();
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
    fn hash(&mut self, cell: GraphNode) -> u64 {
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
            let hash = |s: &Self, cells: &[GraphNode]| -> Vec<u64> {
                cells
                    .iter()
                    .map(|&i| s.hashes[i.index()].unwrap())
                    .collect()
            };
            let (ins, holds) = (hash(self, &inputs), hash(self, &flags));
            let what = if self.is_essential(c) {
                hash_of(("e", &self.named[&c], self.types[ci] as u8))
            } else if self.is_const(c) {
                let v = self.value(c);
                hash_of(("f", self.value_hash(c, &v)))
            } else if let Some((op, k)) = producer {
                // A `ChoiceIndex`'s count of choices (its second input) is
                // the input's domain, which condition 1 compares.
                let ins = match self.g.defs[op.index()] {
                    Def::Op(GraphOp::Spec(OpSpec::ChoiceIndex), _) => &ins[..1],
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

    /// An operator as what it computes: its kind, and for a symbolic
    /// template its text with leaves numbered by input, as the engine
    /// prints it.
    fn op_hash(&mut self, op: GraphNode, inputs: &[GraphNode]) -> u64 {
        let Def::Op(planned, _) = &self.g.defs[op.index()] else {
            unreachable!("an operator node")
        };
        match *planned {
            GraphOp::Template(i) => {
                let TemplateOp { expr, post, math } = &self.g.templates[i as usize];
                let text = self.c.plans.sym_text[expr].spell(self.c.dast);
                let tree = self
                    .engine
                    .parse_tree::<RefId>(&text)
                    .expect("a symbolic template parses");
                // Leaf k is input k: numbered by the first input of its
                // cell.
                let mut k = 0;
                let tree: Tree<u32> = tree
                    .try_map_leaves(&mut |_, _| {
                        let pos = inputs
                            .iter()
                            .position(|&x| x == inputs[k])
                            .map_or(u32::MAX, |p| p as u32);
                        let leaf = (pos, math[k]);
                        k += 1;
                        Ok::<_, std::convert::Infallible>(leaf)
                    })
                    .unwrap_or_else(|never| match never {});
                hash_of((
                    "instantiate",
                    canonical_leaves(&template_text(&tree)),
                    *post as u8,
                ))
            }
            GraphOp::Spec(OpSpec::Sym(kind)) => hash_of(format!("{kind:?}")),
            GraphOp::Spec(OpSpec::Vec(v)) => hash_of(format!("{v:?}")),
            GraphOp::Spec(spec) => hash_of(format!("{spec:?}")),
        }
    }

    /// A value as what it means: a number's bits, a string's text, an
    /// expression's text.
    fn value_hash(&self, cell: GraphNode, v: &Value) -> u64 {
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
            // A math value with a known number is no handle the compile
            // made: as a number.
            ValueType::Math => hash_of(bits(v)),
        }
    }

    /// The hash of essential `cell`'s default.
    fn default_hash(&mut self, cell: GraphNode) -> u64 {
        let v = self.value(cell);
        self.value_hash(cell, &v)
    }

    /// The values a request on the input at `ci` can take.
    fn domain(&mut self, ci: usize) -> Domain {
        let g = self.g;
        let ty = g.comps[ci].component_type;
        match ty {
            ComponentType::Select => {
                let key = self.comp_key(ci);
                let templates = &self.c.plans.templates;
                let def =
                    self.c.plans.choices.iter().find(|d| {
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
                let d = self.c.dast;
                return Domain::Choices(
                    (0..g.comps.len())
                        .filter(|&k| g.comps[k].parent as usize == ci)
                        .map(|k| {
                            let key = match self.comp_key(k) {
                                ElemKey::NONE => String::new(),
                                key => self.key(key),
                            };
                            let content = g.comps[k].elem.map_or(0, |(t, e)| {
                                let node = self.c.plans.templates[t.index()].row(e).node;
                                if node == NodeId::NONE {
                                    0
                                } else {
                                    hash_of(dast_text(d, node))
                                }
                            });
                            (key, content)
                        })
                        .collect(),
                );
            }
            ComponentType::Graph => return Domain::Any,
            _ => {}
        }
        // Inside a graph: its bounds as the author set them.
        let mut a = g.comps[ci].parent;
        while a != u32::MAX && g.comps[a as usize].component_type != ComponentType::Graph {
            a = g.comps[a as usize].parent;
        }
        if a == u32::MAX {
            return Domain::Any;
        }
        let a = a as usize;
        let bounds: Vec<GraphNode> = ["xmin", "xmax", "ymin", "ymax"]
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
        let graph_key = self.key(self.comp_key(a));
        let mut literal = Some(Vec::with_capacity(4));
        for &bound in &bounds {
            let own = self.is_essential(bound) && self.named[&bound].0 == graph_key;
            if own || self.is_const(bound) {
                let v = match self.value(bound) {
                    Value::Raw(v) => v,
                    Value::Expr(_) => f64::NAN,
                };
                if let Some(l) = literal.as_mut() {
                    l.push(v);
                }
            } else {
                literal = None;
            }
        }
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

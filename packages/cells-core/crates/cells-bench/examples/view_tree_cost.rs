//! What a build-time view tree would add to a load (renderer design B):
//! the build emits a flat, columnar tree of primitive view nodes whose
//! leaves are bound to cells, and the renderer walks that instead of the
//! component table.
//!
//! This emits the tree as a pass over a loaded document, which is an upper
//! bound on doing it inside the build: every component becomes one node,
//! every text child a text leaf, and every node is bound to every one of
//! its component's prop cells (a real view binds only what it shows). Each
//! node carries its identity across rebuilds (DAST node, scope) for the
//! renderer to key on.
//!
//! `cargo run --release -p cells-bench --example view_tree_cost`
//! (`CELLS_FIXTURES=a,b` to restrict the set).

use cells_core::Document;
use std::time::Instant;

const NONE: u32 = u32::MAX;
const TEXT_BIT: u32 = 1 << 31;
/// The view-node kind of a text leaf; component kinds use their type byte.
const TEXT_LEAF: u8 = u8::MAX;

#[derive(Default)]
struct ViewTree {
    kind: Vec<u8>,
    parent: Vec<u32>,
    /// One past the last node of this node's subtree (preorder).
    end: Vec<u32>,
    /// Start of this node's cells in `binds`; a node's run ends where the
    /// next node's starts.
    bind_start: Vec<u32>,
    /// A text leaf's string id, else NONE.
    arg: Vec<u32>,
    key_node: Vec<u32>,
    key_scope: Vec<u32>,
    binds: Vec<u32>,
}

impl ViewTree {
    fn bytes(&self) -> usize {
        self.kind.capacity()
            + 4 * (self.parent.capacity()
                + self.end.capacity()
                + self.bind_start.capacity()
                + self.arg.capacity()
                + self.key_node.capacity()
                + self.key_scope.capacity()
                + self.binds.capacity())
    }
    fn len(&self) -> usize {
        self.kind.len()
    }
    fn push(&mut self, kind: u8, parent: u32, arg: u32, key: (u32, u32)) -> usize {
        let i = self.kind.len();
        self.kind.push(kind);
        self.parent.push(parent);
        self.end.push(0);
        self.bind_start.push(self.binds.len() as u32);
        self.arg.push(arg);
        self.key_node.push(key.0);
        self.key_scope.push(key.1);
        i
    }
}

fn emit(doc: &Document) -> ViewTree {
    let t = &doc.components;
    let n_text = t.child_list.iter().filter(|&&e| e & TEXT_BIT != 0).count();
    let n = t.len() + n_text;
    let mut v = ViewTree {
        kind: Vec::with_capacity(n),
        parent: Vec::with_capacity(n),
        end: Vec::with_capacity(n),
        bind_start: Vec::with_capacity(n),
        arg: Vec::with_capacity(n),
        key_node: Vec::with_capacity(n),
        key_scope: Vec::with_capacity(n),
        binds: Vec::with_capacity(t.prop_cells.len()),
    };
    let roots: Vec<u32> = (0..t.len() as u32)
        .filter(|&c| t.parent[c as usize] == NONE)
        .collect();
    // Explicit stack: (component, view parent), with a marker to close
    // a subtree once its children are emitted.
    enum Step {
        Open(u32, u32),
        Close(usize),
    }
    let mut stack: Vec<Step> = roots.iter().rev().map(|&r| Step::Open(r, NONE)).collect();
    while let Some(step) = stack.pop() {
        match step {
            Step::Close(i) => v.end[i] = v.len() as u32,
            Step::Open(e, parent) if e & TEXT_BIT != 0 => {
                let j = v.push(TEXT_LEAF, parent, e & !TEXT_BIT, (NONE, NONE));
                v.end[j] = v.len() as u32;
            }
            Step::Open(c, parent) => {
                let cu = c as usize;
                let i = v.push(
                    t.component_type[cu] as u8,
                    parent,
                    NONE,
                    (t.dast_node[cu], t.scope[cu]),
                );
                v.binds.extend_from_slice(doc.comp_cells(c));
                stack.push(Step::Close(i));
                let (s, k) = (t.child_start[cu] as usize, t.child_count[cu] as usize);
                for &e in t.child_list[s..s + k].iter().rev() {
                    stack.push(Step::Open(e, i as u32));
                }
            }
        }
    }
    v
}

/// The same tree with nothing the component table already holds: a kind
/// byte, the subtree end, and one word that is the component index (its
/// identity and its prop cells, through the table) or, with the text bit,
/// a text leaf's string id. No parent column (a preorder walk with `end`
/// recovers it) and no separate bindings.
fn lean_bytes(v: &ViewTree) -> usize {
    v.len() * (1 + 4 + 4)
}

fn best_of<T>(n: usize, mut f: impl FnMut() -> T) -> (T, f64) {
    let mut best = f64::INFINITY;
    let mut out = None;
    for _ in 0..n {
        let t = Instant::now();
        let r = f();
        best = best.min(t.elapsed().as_secs_f64() * 1e3);
        out = Some(r);
    }
    (out.unwrap(), best)
}

fn main() {
    println!(
        "{:<18} {:>8} {:>8} {:>8} {:>10} {:>10} {:>9} {:>9} {:>9} {:>7} {:>7} {:>7}",
        "fixture",
        "comps",
        "nodes",
        "binds",
        "doc KB",
        "view KB",
        "lean KB",
        "load ms",
        "view ms",
        "mem %",
        "lean %",
        "time %"
    );
    for (spec, _) in cells_bench::fixtures() {
        let bytes = cells_bench::fixture_bytes(&spec);
        let reps = if bytes.len() > 5_000_000 { 3 } else { 9 };
        let (doc, load_ms) = best_of(reps, || {
            Document::load(&bytes, Default::default()).unwrap().0
        });
        let (view, view_ms) = best_of(reps, || emit(&doc));
        assert!(view.end.iter().all(|&e| e != 0));
        let doc_bytes = doc.memory_estimate().total();
        println!(
            "{:<18} {:>8} {:>8} {:>8} {:>10.0} {:>10.0} {:>9.0} {:>9.2} {:>9.3} {:>6.1}% {:>6.1}% {:>6.1}%",
            spec,
            doc.n_components(),
            view.len(),
            view.binds.len(),
            doc_bytes as f64 / 1024.0,
            view.bytes() as f64 / 1024.0,
            lean_bytes(&view) as f64 / 1024.0,
            load_ms,
            view_ms,
            100.0 * view.bytes() as f64 / doc_bytes as f64,
            100.0 * lean_bytes(&view) as f64 / doc_bytes as f64,
            100.0 * view_ms / load_ms,
        );
    }
}

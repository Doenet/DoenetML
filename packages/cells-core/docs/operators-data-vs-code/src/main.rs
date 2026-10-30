//! Operators as data against operators as code, on the core's programs
//! (docs/operators-data-vs-code.md).
//!
//!   opbench [progs] [sizes]                 time every evaluator
//!   opbench --emit-rust progs sizes file    the programs as Rust (`aot`)
//!   opbench --dump prog size file           a program as JSON (node/)
//!   opbench --kinds                         the golden documents' operator mix
//!
//! A prog is a shape of `cells_bench::shapes` (`depth`, `breadth`, ...),
//! `randomK` (K operator kinds drawn at random; `randomK-wW` reads from the
//! W cells before), `file:path.doenet` or `json:path` (a `--dump`). Every
//! evaluator must leave the same cells as the first, bit for bit.
//!
//! - `OPBENCH_REPS` (default 41): timed ticks, after 3 warm-up ticks, each
//!   evaluator on its own copy, interleaved tick by tick; the median.
//! - `OPBENCH_ONLY=data,jit/`: evaluators whose names start so.
//! - `--features aot` includes `gen/aot.rs`, which `--emit-rust` writes.

mod codegen;
mod evals;
#[cfg(feature = "jit")]
mod jit;
mod prog;

#[cfg(feature = "aot")]
#[allow(clippy::all, unused_unsafe)]
mod aot {
    include!("../gen/aot.rs");
}

use std::time::{Duration, Instant};

use cells_core::{CellIdx, DirtyClosure, Evaluator, FullRecompute};
use evals::{Closures, Code, Data, Dirty, Eval, differs, full};
use prog::Prog;

pub fn build(name: &str, n: usize) -> Prog {
    if let Some(path) = name.strip_prefix("json:") {
        return prog::json(path);
    }
    if let Some(path) = name.strip_prefix("file:") {
        return prog::file(path);
    }
    if let Some(rest) = name.strip_prefix("random") {
        let mut parts = rest.split("-w");
        let kinds = parts.next().unwrap().parse().unwrap();
        let window = parts.next().map_or(16, |w| w.parse().unwrap());
        prog::random(n, kinds, window)
    } else {
        prog::shape(name, n)
    }
}

trait Variant {
    fn name(&self) -> String;
    /// Write `x` to the seed and recompute; the time to recompute and how
    /// many cells changed.
    fn tick(&mut self, seed: usize, x: f64) -> (Duration, usize);
    fn cells(&self) -> &[f64];
}

struct Full<E> {
    name: &'static str,
    e: E,
    cells: Vec<f64>,
    changed: Vec<u32>,
}

impl<E: Eval> Variant for Full<E> {
    fn name(&self) -> String {
        format!("{}/full", self.name)
    }
    fn tick(&mut self, seed: usize, x: f64) -> (Duration, usize) {
        self.cells[seed] = x;
        self.changed.clear();
        self.changed.push(seed as u32);
        let t = Instant::now();
        full(&self.e, &mut self.cells, &mut self.changed);
        (t.elapsed(), self.changed.len() - 1)
    }
    fn cells(&self) -> &[f64] {
        &self.cells
    }
}

struct DirtyV<E> {
    name: &'static str,
    e: E,
    d: Dirty,
    cells: Vec<f64>,
    changed: Vec<u32>,
}

impl<E: Eval> Variant for DirtyV<E> {
    fn name(&self) -> String {
        format!("{}/dirty", self.name)
    }
    fn tick(&mut self, seed: usize, x: f64) -> (Duration, usize) {
        self.cells[seed] = x;
        self.changed.clear();
        self.changed.push(seed as u32);
        let t = Instant::now();
        self.d.run(&self.e, &mut self.cells, &mut self.changed);
        (t.elapsed(), self.changed.len() - 1)
    }
    fn cells(&self) -> &[f64] {
        &self.cells
    }
}

/// The core's own evaluators, through `Program::step`.
struct Core {
    full: bool,
    doc: cells_core::Document,
    ev: Box<dyn Evaluator>,
    changed: Vec<CellIdx>,
}

impl Variant for Core {
    fn name(&self) -> String {
        format!("core/{}", if self.full { "full" } else { "dirty" })
    }
    fn tick(&mut self, seed: usize, x: f64) -> (Duration, usize) {
        let doc = &mut self.doc;
        doc.cells[seed] = x;
        self.changed.clear();
        self.changed.push(CellIdx::from_index(seed));
        let engine = doc.session.engine.clone();
        let mut engine = engine.borrow_mut();
        let mut sym = cells_core::program::SymRun {
            state: &mut doc.sym,
            engine: &mut engine,
        };
        let t = Instant::now();
        self.ev
            .recompute(&doc.program, &mut sym, &mut doc.cells, &mut self.changed);
        (t.elapsed(), self.changed.len() - 1)
    }
    fn cells(&self) -> &[f64] {
        &self.doc.cells
    }
}

#[cfg(feature = "jit")]
struct JitV {
    jit: jit::Jit,
    seed_readers: Vec<u32>,
    cells: Vec<f64>,
    changed: Vec<u32>,
    flags: Vec<u8>,
}

#[cfg(feature = "jit")]
impl Variant for JitV {
    fn name(&self) -> String {
        format!(
            "jit{}/{}",
            if self.jit.branchless { "-bl" } else { "" },
            if self.jit.guarded { "dirty" } else { "full" }
        )
    }
    fn tick(&mut self, seed: usize, x: f64) -> (Duration, usize) {
        self.cells[seed] = x;
        self.changed.clear();
        self.changed.push(seed as u32);
        let t = Instant::now();
        for &r in &self.seed_readers {
            self.flags[r as usize] = 1;
        }
        self.jit
            .run(&mut self.cells, &mut self.changed, &mut self.flags);
        (t.elapsed(), self.changed.len() - 1)
    }
    fn cells(&self) -> &[f64] {
        &self.cells
    }
}

#[cfg(feature = "aot")]
struct AotV {
    f: aot::Full,
    branchless: bool,
    cells: Vec<f64>,
    changed: Vec<u32>,
}

#[cfg(feature = "aot")]
impl Variant for AotV {
    fn name(&self) -> String {
        format!("aot{}/full", if self.branchless { "-bl" } else { "" })
    }
    fn tick(&mut self, seed: usize, x: f64) -> (Duration, usize) {
        self.cells[seed] = x;
        self.changed.clear();
        self.changed.reserve(self.cells.len() + 1);
        self.changed.push(seed as u32);
        let t = Instant::now();
        let n = unsafe { (self.f)(self.cells.as_mut_ptr(), self.changed.as_mut_ptr(), 1) };
        let dt = t.elapsed();
        unsafe { self.changed.set_len(n) };
        (dt, n - 1)
    }
    fn cells(&self) -> &[f64] {
        &self.cells
    }
}

fn wanted(name: &str) -> bool {
    std::env::var("OPBENCH_ONLY").map_or(true, |s| s.split(',').any(|w| name.starts_with(w)))
}

fn variants(p: &Prog) -> Vec<Box<dyn Variant>> {
    let n_cells = p.cells.len();
    let mut v: Vec<Box<dyn Variant>> = Vec::new();
    let cells = || p.cells.clone();
    let ch = || Vec::with_capacity(n_cells + 1);
    v.push(Box::new(Full {
        name: "data",
        e: Data(p.instrs.clone()),
        cells: cells(),
        changed: ch(),
    }));
    if let Some(doc) = &p.doc {
        v.push(Box::new(Core {
            full: true,
            doc: doc.clone(),
            ev: Box::new(FullRecompute),
            changed: Vec::new(),
        }));
    }
    v.push(Box::new(Full {
        name: "fnptr",
        e: Code::new(&p.instrs),
        cells: cells(),
        changed: ch(),
    }));
    v.push(Box::new(Full {
        name: "closure",
        e: Closures::new(&p.instrs),
        cells: cells(),
        changed: ch(),
    }));
    #[cfg(feature = "jit")]
    {
        for bl in [false, true] {
            if !wanted(if bl { "jit-bl/full" } else { "jit/full" }) {
                continue;
            }
            let jit = jit::Jit::new(&p.instrs, None, bl);
            eprintln!(
                "  jit/full (branchless {bl}) compile: {:.1} ms",
                jit.compile_s * 1e3
            );
            v.push(Box::new(JitV {
                jit,
                seed_readers: vec![],
                cells: cells(),
                changed: ch(),
                flags: vec![0; p.instrs.len()],
            }));
        }
    }
    #[cfg(feature = "aot")]
    if let Some(&(_, f, bl)) = aot::PROGS.iter().find(|q| q.0 == p.name) {
        v.push(Box::new(AotV {
            f,
            branchless: false,
            cells: cells(),
            changed: ch(),
        }));
        v.push(Box::new(AotV {
            f: bl,
            branchless: true,
            cells: cells(),
            changed: ch(),
        }));
    }
    let d = || Dirty::new(&p.instrs, n_cells);
    v.push(Box::new(DirtyV {
        name: "data",
        e: Data(p.instrs.clone()),
        d: d(),
        cells: cells(),
        changed: ch(),
    }));
    if let Some(doc) = &p.doc {
        v.push(Box::new(Core {
            full: false,
            doc: doc.clone(),
            ev: Box::new(DirtyClosure::new(&doc.program, doc.cells.len())),
            changed: Vec::new(),
        }));
    }
    v.push(Box::new(DirtyV {
        name: "fnptr",
        e: Code::new(&p.instrs),
        d: d(),
        cells: cells(),
        changed: ch(),
    }));
    v.push(Box::new(DirtyV {
        name: "closure",
        e: Closures::new(&p.instrs),
        d: d(),
        cells: cells(),
        changed: ch(),
    }));
    #[cfg(feature = "jit")]
    {
        let dd = d();
        if wanted("jit/dirty") {
            let jit = jit::Jit::new(&p.instrs, Some(&dd), false);
            eprintln!("  jit/dirty compile: {:.1} ms", jit.compile_s * 1e3);
            let seed_readers = dd.readers(p.seed).to_vec();
            v.push(Box::new(JitV {
                jit,
                seed_readers,
                cells: cells(),
                changed: ch(),
                flags: vec![0; p.instrs.len()],
            }));
        }
    }
    v.retain(|x| wanted(&x.name()));
    v
}

fn same(a: &[f64], b: &[f64]) -> Option<usize> {
    a.iter()
        .zip(b)
        .position(|(&x, &y)| x.to_bits() != y.to_bits() && differs(x, y))
}

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    if args.first().map(|s| s.as_str()) == Some("--emit-rust") {
        // --emit-rust progs sizes file
        let mut ps = Vec::new();
        for name in args[1].split(',') {
            for n in args[2].split(',') {
                ps.push(build(name, n.parse().unwrap()));
            }
        }
        std::fs::write(&args[3], codegen::rust(&ps)).unwrap();
        return;
    }
    if args.first().map(|s| s.as_str()) == Some("--kinds") {
        kinds();
        return;
    }
    if args.first().map(|s| s.as_str()) == Some("--dump") {
        let p = build(&args[1], args[2].parse().unwrap());
        std::fs::write(&args[3], codegen::json(&p)).unwrap();
        return;
    }
    let progs: Vec<String> = args
        .first()
        .map_or("depth,breadth,mixed,poly,random1,random12".into(), |s| {
            s.clone()
        })
        .split(',')
        .map(String::from)
        .collect();
    let sizes: Vec<usize> = args
        .get(1)
        .map_or("10000,100000".into(), |s| s.clone())
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect();
    let reps: usize = std::env::var("OPBENCH_REPS")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(41);
    println!("| program | evaluator | µs | ns / instr run | changed |");
    println!("|---|---|---:|---:|---:|");
    for name in &progs {
        for &n in &sizes {
            let p = build(name, n);
            eprintln!("{}: {} instructions", p.name, p.instrs.len());
            let mut vs = variants(&p);
            let mut times = vec![Vec::new(); vs.len()];
            let mut runs = vec![0usize; vs.len()];
            let mut x = 2.0;
            for rep in 0..reps + 3 {
                for (k, v) in vs.iter_mut().enumerate() {
                    let (dt, ch) = v.tick(p.seed, x);
                    if rep >= 3 {
                        times[k].push(dt);
                    }
                    runs[k] = ch;
                }
                x = if x == 2.0 { 3.0 } else { 2.0 };
            }
            for v in &vs[1..] {
                if let Some(c) = same(vs[0].cells(), v.cells()) {
                    panic!(
                        "{}: {} and {} disagree at cell {c}: {} against {}",
                        p.name,
                        vs[0].name(),
                        v.name(),
                        vs[0].cells()[c],
                        v.cells()[c]
                    );
                }
            }
            for (k, v) in vs.iter().enumerate() {
                times[k].sort();
                let med = times[k][times[k].len() / 2];
                // Instructions run: full runs all; dirty runs at least the
                // changed ones. Report per instruction of the program for
                // full, per changed cell for dirty.
                let per = if v.name().ends_with("full") {
                    p.instrs.len()
                } else {
                    runs[k].max(1)
                };
                println!(
                    "| {} | {} | {:.1} | {:.2} | {} |",
                    p.name,
                    v.name(),
                    med.as_secs_f64() * 1e6,
                    med.as_secs_f64() * 1e9 / per as f64,
                    runs[k]
                );
            }
        }
    }
}

/// How mixed each golden document's operators are, in schedule order: the
/// number of instructions, of distinct kinds, the share that are vector or
/// symbolic, and how often an instruction's kind differs from the one
/// before it (what makes the interpreter's dispatch hard to predict).
fn kinds() {
    use cells_core::program::Op;
    use cells_core::testing::test_utils::{load, repo_root};
    let kind = |op: &Op| -> String {
        match op {
            Op::Vec(v, ..) => format!("Vec:{v:?}")
                .split(['(', ' ', '{'])
                .next()
                .unwrap()
                .to_string(),
            Op::Sym(k, ..) => format!("Sym:{k:?}")
                .split(['(', ' ', '{'])
                .next()
                .unwrap()
                .to_string(),
            op => format!("{op:?}").split('(').next().unwrap().to_string(),
        }
    };
    println!("| document | instructions | kinds | vector or symbolic | kind changes |");
    println!("|---|---:|---:|---:|---:|");
    let (mut all, mut sw, mut vs) = (0usize, 0usize, 0usize);
    let mut total = std::collections::BTreeMap::new();
    for (name, path) in cells_bench::script::sources(&repo_root()) {
        let Ok(doc) = load(&std::fs::read_to_string(&path).unwrap()) else {
            continue;
        };
        let ks: Vec<String> = doc.program.instrs.iter().map(|i| kind(&i.op)).collect();
        if ks.is_empty() {
            continue;
        }
        let distinct: std::collections::BTreeSet<_> = ks.iter().collect();
        let changes = ks.windows(2).filter(|w| w[0] != w[1]).count();
        let v = doc
            .program
            .instrs
            .iter()
            .filter(|i| matches!(i.op, Op::Vec(..) | Op::Sym(..)))
            .count();
        for k in &ks {
            *total.entry(k.clone()).or_insert(0usize) += 1;
        }
        all += ks.len();
        sw += changes;
        vs += v;
        println!(
            "| {name} | {} | {} | {:.0}% | {:.0}% |",
            ks.len(),
            distinct.len(),
            100.0 * v as f64 / ks.len() as f64,
            100.0 * changes as f64 / (ks.len() - 1).max(1) as f64
        );
    }
    println!(
        "| all | {all} | {} | {:.0}% | {:.0}% |",
        total.len(),
        100.0 * vs as f64 / all as f64,
        100.0 * sw as f64 / all as f64
    );
    let mut t: Vec<_> = total.into_iter().collect();
    t.sort_by(|a, b| b.1.cmp(&a.1));
    eprintln!("{t:?}");
}

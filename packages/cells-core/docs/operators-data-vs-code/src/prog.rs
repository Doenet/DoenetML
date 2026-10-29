//! Programs to evaluate: the core's own, built from `cells_bench::shapes`,
//! and random ones that mix operator kinds.

use cells_core::CellIdx;
use cells_core::program::{Instr, Op};

pub struct Prog {
    pub name: String,
    pub instrs: Vec<Instr>,
    pub cells: Vec<f64>,
    /// The essential cell a tick writes.
    pub seed: usize,
    /// The core's document, for shapes, to time the core's own evaluators.
    pub doc: Option<cells_core::Document>,
}

pub fn shape(name: &str, n: usize) -> Prog {
    let s = cells_bench::shapes::shape(name, n).expect("shape");
    let doc = cells_bench::shapes::load(s.elements);
    let seed = cells_bench::shapes::cell(&doc, s.drag).index();
    for ins in &doc.program.instrs {
        assert!(!matches!(ins.op, Op::Vec(..) | Op::Sym(..)), "scalar only");
    }
    Prog {
        name: format!("{name}-{n}"),
        instrs: doc.program.instrs.clone(),
        cells: doc.cells.clone(),
        seed,
        doc: Some(doc),
    }
}

struct Lcg(u64);
impl Lcg {
    fn next(&mut self) -> u64 {
        self.0 = self
            .0
            .wrapping_mul(6364136223846793005)
            .wrapping_add(1442695040888963407);
        self.0 >> 33
    }
    fn below(&mut self, n: usize) -> usize {
        (self.next() % n as u64) as usize
    }
    fn unit(&mut self) -> f64 {
        (self.next() % 1_000_000) as f64 / 1_000_000.0
    }
}

/// `n` instructions, each reading one or two of the 16 cells before it, so
/// that everything is downstream of cell 0, the seed. `kinds` operator kinds
/// are drawn at random: 1 gives only `Offset`, as the shapes; 12 mixes them,
/// as a real document's math does. Products and quotients may run off to
/// infinity or NaN; every evaluator must still agree bit for bit.
pub fn random(n: usize, kinds: usize, window: usize) -> Prog {
    let mut r = Lcg(0x5eed ^ (kinds as u64) << 32 ^ window as u64);
    let c = |i: usize| CellIdx::new(i as u32);
    let mut instrs = Vec::with_capacity(n);
    for i in 0..n {
        let out = i + 1;
        let lo = out.saturating_sub(window);
        let a = c(lo + r.below(out - lo));
        let b = c(lo + r.below(out - lo));
        let k = r.unit() * 2.0 - 1.0;
        let op = match r.below(kinds) {
            0 => Op::Offset(a, k),
            1 => Op::Add(a, b),
            2 => Op::Sub(a, b),
            3 => Op::Scale(a, k),
            4 => Op::Negate(a),
            5 => Op::Min(a, b),
            6 => Op::Max(a, b),
            7 => Op::Mul(a, b),
            8 => Op::Div(a, b),
            // These three cut a change off, so fewer kinds than 10 keep
            // every change moving.
            9 => Op::Clamp(a, -50.0, 50.0),
            10 => Op::Round(a),
            _ => Op::Floor(a),
        };
        instrs.push(Instr { out: c(out), op });
    }
    let mut cells = vec![0.0; n + 1];
    cells[0] = 1.0;
    // Start consistent, as a loaded document does.
    for ins in &instrs {
        cells[ins.out.index()] = ins.op.eval(&cells);
    }
    Prog {
        name: format!("random{kinds}-w{window}-{n}"),
        instrs,
        cells,
        seed: 0,
        doc: None,
    }
}

/// Inputs of a scalar instruction.
pub fn inputs(ins: &Instr) -> (usize, Option<usize>) {
    let (a, b) = ins.op.input_pair();
    (a.index(), b.map(|b| b.index()))
}

/// A document from a file, seeded at the essential cell whose change
/// reaches the most instructions without reaching a vector or symbolic one.
/// Those are dropped (their outputs keep their loaded values), so every
/// evaluator runs the same scalar program; the core's own evaluators are
/// left out when any was dropped.
pub fn file(path: &str) -> Prog {
    let src = std::fs::read_to_string(path).expect("read");
    let doc = cells_core::testing::test_utils::load(&src).expect("load");
    let scalar = |op: &Op| !matches!(op, Op::Vec(..) | Op::Sym(..));
    let instrs: Vec<Instr> = doc
        .program
        .instrs
        .iter()
        .filter(|i| scalar(&i.op))
        .copied()
        .collect();
    let dropped = doc.program.len() - instrs.len();
    let n = doc.cells.len();
    let mut best = (0, 0);
    for e in 0..doc.n_essential {
        let mut hit = vec![false; n];
        hit[e] = true;
        let mut count = 0;
        let mut clean = true;
        for ins in &doc.program.instrs {
            if ins.op.inputs(&doc.program.operands).any(|c| hit[c.index()]) {
                if !scalar(&ins.op) {
                    clean = false;
                    break;
                }
                hit[ins.out.index()] = true;
                count += 1;
            }
        }
        if clean && count > best.1 {
            best = (e, count);
        }
    }
    let name = std::path::Path::new(path)
        .file_stem()
        .unwrap()
        .to_string_lossy()
        .to_string();
    eprintln!(
        "{name}: seed cell {} reaches {} of {} instructions; {dropped} dropped",
        best.0,
        best.1,
        doc.program.len()
    );
    let mut kinds = std::collections::BTreeMap::new();
    for ins in &instrs {
        *kinds
            .entry(
                format!("{:?}", ins.op)
                    .split('(')
                    .next()
                    .unwrap()
                    .to_string(),
            )
            .or_insert(0) += 1;
    }
    eprintln!("{name}: {kinds:?}");
    let cells = doc.cells.clone();
    Prog {
        name,
        instrs,
        cells,
        seed: best.0,
        doc: (dropped == 0).then_some(doc),
    }
}

/// A program `opbench --dump` wrote (see `codegen::json`), for builds that
/// cannot load a document (wasm).
pub fn json(path: &str) -> Prog {
    let v: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(path).unwrap()).unwrap();
    let f = |x: &serde_json::Value| {
        f64::from_bits(u64::from_str_radix(x.as_str().unwrap(), 16).unwrap())
    };
    let c = |x: &serde_json::Value| CellIdx::new(x.as_u64().unwrap() as u32);
    let instrs = v["instrs"]
        .as_array()
        .unwrap()
        .iter()
        .map(|r| {
            let (a, b, k, k2) = (c(&r[2]), c(&r[3]), f(&r[4]), f(&r[5]));
            let op = match r[0].as_str().unwrap() {
                "add" => Op::Add(a, b),
                "sub" => Op::Sub(a, b),
                "mul" => Op::Mul(a, b),
                "div" => Op::Div(a, b),
                "min" => Op::Min(a, b),
                "max" => Op::Max(a, b),
                "neg" => Op::Negate(a),
                "round" => Op::Round(a),
                "floor" => Op::Floor(a),
                "scale" => Op::Scale(a, k),
                "offset" => Op::Offset(a, k),
                "clamp" => Op::Clamp(a, k, k2),
                "nanto" => Op::NanTo(a, k),
                other => panic!("no kind {other}"),
            };
            Instr { out: c(&r[1]), op }
        })
        .collect();
    Prog {
        name: v["name"].as_str().unwrap().to_string(),
        instrs,
        cells: v["cells"].as_array().unwrap().iter().map(f).collect(),
        seed: v["seed"].as_u64().unwrap() as usize,
        doc: None,
    }
}

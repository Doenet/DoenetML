//! The inversion engine: requests are gathered per producing instruction,
//! highest schedule position first, and inverted once; point groups are
//! kept together through lookahead (ADR 0006).

use std::collections::BinaryHeap;
use std::hash::{BuildHasherDefault, Hasher};

/// Keys here are cell and instruction indices: a multiply-shift hash is
/// enough, and SipHash was most of the cost of a long inversion.
#[derive(Default)]
struct IndexHasher(u64);

impl Hasher for IndexHasher {
    fn finish(&self) -> u64 {
        self.0
    }
    fn write(&mut self, bytes: &[u8]) {
        for &b in bytes {
            self.0 = (self.0.rotate_left(5) ^ b as u64).wrapping_mul(0x517c_c1b7_2722_0a95);
        }
    }
    fn write_u32(&mut self, n: u32) {
        self.0 = (self.0.rotate_left(5) ^ n as u64).wrapping_mul(0x517c_c1b7_2722_0a95);
    }
}

type HashMap<K, V> = std::collections::HashMap<K, V, BuildHasherDefault<IndexHasher>>;
type HashSet<K> = std::collections::HashSet<K, BuildHasherDefault<IndexHasher>>;

use crate::document::CellIdx;
use crate::program::Produced;
use crate::program::{Op, SymKind};
use crate::program::{Program, SymRun};
use crate::tick::Request;

/// A request on both cells of a point, issued together with others as a
/// point group: the renderer's whole-shape drag, or the points one inverse
/// moves at once.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct PointRequest {
    pub cells: [CellIdx; 2],
    pub values: [f64; 2],
}

/// Tolerance for "this point landed where it was asked to".
const REALIZED_TOL: f64 = 1e-6;

/// The essential writes a set of requests resolves to.
#[derive(Debug, Clone, Default)]
pub struct Inversion {
    /// (essential cell, value), in resolution order, one entry per cell
    /// (a later write to the same cell replaces the earlier one in place).
    pub writes: Vec<(CellIdx, f64)>,
    /// Requests that could not be inverted or landed on a constant.
    pub dropped: Vec<Request>,
}

/// Resolve requests to essential writes. Requests are gathered per
/// producing instruction, highest schedule position first, so every
/// request on an instruction's outputs is known before it is inverted
/// once; the input requests an inverse produces join the queue. Cells
/// in `essentials` are essential; a request landing on another
/// producer-less cell (a constant), or on a cell a `fixed` holds
/// (`Program::holds`), is dropped.
///
/// `groups` are points requested together (ADR 0006): before such a
/// group is queued the engine asks what each point would actually
/// become, and if a strict subset is held back, all by the same shift,
/// the shift is applied to the rest, so a shape dragged against a
/// constrained point keeps its shape. The same happens to the point
/// groups an inverse produces.
pub fn invert_requests(
    program: &Program,
    sym: &mut SymRun,
    cells: &[f64],
    essentials: std::ops::Range<usize>,
    requests: &[Request],
    groups: &[Vec<PointRequest>],
) -> Inversion {
    let mut engine = RequestEngine {
        program,
        sym: sym.reborrow(),
        cells,
        essentials,
        pending: HashMap::default(),
        heap: BinaryHeap::new(),
        queued: HashSet::default(),
        write_index: HashMap::default(),
        inversion: Inversion::default(),
        origin: HashMap::default(),
    };
    if let ([r], []) = (requests, groups) {
        engine.walk(r.cell, r.value, *r);
    } else {
        for &r in requests {
            engine.push(r.cell, r.value, r);
        }
    }
    for g in groups {
        let origin = g
            .first()
            .map(|p| Request {
                cell: p.cells[0],
                value: p.values[0],
            })
            .unwrap_or(Request {
                cell: CellIdx::new(0),
                value: f64::NAN,
            });
        engine.push_group(g.clone(), origin);
    }
    engine.run();
    engine.inversion
}

/// What `cells` would hold for each requested cell if the requests were
/// applied: invert, overlay the essential writes on a copy, and evaluate
/// forward the instructions that read a changed value, up to the last
/// requested cell. The cells are not written. A symbolic instruction's
/// memo and the session's engine are, as any step writes them, and may
/// keep what the lookahead found: the memo is keyed by the values it last
/// ran on, so it answers the next real step right whatever it holds, and
/// the engine only grows and finds an expression it already has (ADR
/// 0006, amended).
pub fn realize(
    program: &Program,
    sym: &mut SymRun,
    cells: &[f64],
    essentials: std::ops::Range<usize>,
    requests: &[(CellIdx, f64)],
    out: &mut Vec<f64>,
) {
    let reqs: Vec<Request> = requests
        .iter()
        .map(|&(cell, value)| Request { cell, value })
        .collect();
    let inv = invert_requests(program, sym, cells, essentials, &reqs, &[]);
    let mut scratch = cells.to_vec();
    for &(c, v) in &inv.writes {
        scratch[c.index()] = v;
    }
    let hi = requests
        .iter()
        .map(|&(c, _)| program.producer[c.index()])
        .filter(|&p| p != u32::MAX)
        .max();
    if let Some(hi) = hi {
        for ins in &program.instrs[..=hi as usize] {
            if program.any_input_differs(ins, &scratch, cells) {
                program.step(ins, sym, &mut scratch, None);
            }
        }
    }
    out.extend(requests.iter().map(|&(c, _)| scratch[c.index()]));
}

/// One run of the inversion engine.
struct RequestEngine<'a> {
    program: &'a Program,
    sym: SymRun<'a>,
    cells: &'a [f64],
    essentials: std::ops::Range<usize>,
    /// Requested value per derived cell awaiting its producer's inverse.
    pending: HashMap<CellIdx, f64>,
    /// Producers with pending requests, highest schedule position first.
    heap: BinaryHeap<u32>,
    queued: HashSet<u32>,
    /// Position in `inversion.writes` of each essential cell written.
    write_index: HashMap<CellIdx, usize>,
    inversion: Inversion,
    /// The renderer's request each pending cell descends from, for the
    /// dropped list.
    origin: HashMap<CellIdx, Request>,
}

impl RequestEngine<'_> {
    fn push(&mut self, cell: CellIdx, value: f64, origin: Request) {
        if self.program.holds.holds(cell, self.cells) {
            self.inversion.dropped.push(origin);
            return;
        }
        let p = self.program.producer[cell.index()];
        if p == u32::MAX {
            if self.essentials.contains(&cell.index()) {
                match self.write_index.get(&cell) {
                    Some(&i) => self.inversion.writes[i].1 = value,
                    None => {
                        self.write_index.insert(cell, self.inversion.writes.len());
                        self.inversion.writes.push((cell, value));
                    }
                }
            } else {
                self.inversion.dropped.push(origin);
            }
            return;
        }
        self.pending.insert(cell, value);
        self.origin.insert(cell, origin);
        if self.queued.insert(p) {
            self.heap.push(p);
        }
    }

    /// A lone request: nothing else is pending (an empty heap means an
    /// empty `pending`), so no other request can reach the instructions it
    /// passes through and there is nothing to gather. Invert straight down
    /// through scalar operators, as the queue would one step at a time, and
    /// hand back to the queue at a vector or symbolic operator.
    fn walk(&mut self, mut cell: CellIdx, mut value: f64, origin: Request) {
        loop {
            let p = self.program.producer[cell.index()];
            if p == u32::MAX || self.program.holds.holds(cell, self.cells) {
                self.push(cell, value, origin);
                return;
            }
            let op = self.program.instrs[p as usize].op;
            if matches!(op, Op::Vec(..) | Op::Sym(..)) {
                self.push(cell, value, origin);
                return;
            }
            match op.invert(self.cells, value) {
                Some((c, v)) => (cell, value) = (c, v),
                None => {
                    self.inversion.dropped.push(origin);
                    return;
                }
            }
        }
    }

    /// Queue a point group after the equal-shift rule (see `invert_requests`).
    fn push_group(&mut self, mut pts: Vec<PointRequest>, origin: Request) {
        if pts.len() >= 2 {
            let reqs: Vec<(CellIdx, f64)> = pts
                .iter()
                .flat_map(|p| p.cells.into_iter().zip(p.values))
                .collect();
            let mut realized = Vec::with_capacity(reqs.len());
            realize(
                self.program,
                &mut self.sym,
                self.cells,
                self.essentials.clone(),
                &reqs,
                &mut realized,
            );
            let mut shift: Option<(f64, f64)> = None;
            let mut n_held = 0;
            let mut consistent = true;
            for (i, p) in pts.iter().enumerate() {
                let (sx, sy) = (
                    realized[2 * i] - p.values[0],
                    realized[2 * i + 1] - p.values[1],
                );
                if sx.abs() > REALIZED_TOL || sy.abs() > REALIZED_TOL {
                    n_held += 1;
                    match shift {
                        None => shift = Some((sx, sy)),
                        Some((px, py))
                            if (px - sx).abs() <= REALIZED_TOL
                                && (py - sy).abs() <= REALIZED_TOL => {}
                        Some(_) => consistent = false,
                    }
                }
            }
            if let Some((sx, sy)) = shift
                && consistent
                && n_held < pts.len()
                && sx.is_finite()
                && sy.is_finite()
            {
                for p in &mut pts {
                    p.values[0] += sx;
                    p.values[1] += sy;
                }
            }
        }
        for p in pts {
            self.push(p.cells[0], p.values[0], origin);
            self.push(p.cells[1], p.values[1], origin);
        }
    }

    fn run(&mut self) {
        let mut desired: Vec<Option<f64>> = Vec::with_capacity(16);
        let mut produced = Produced::default();
        while let Some(p) = self.heap.pop() {
            self.queued.remove(&p);
            let ins = &self.program.instrs[p as usize];
            let n_out = ins.op.n_out();
            desired.clear();
            let mut origin = None;
            for k in 0..n_out {
                let c = ins.out.offset(k);
                let d = self.pending.remove(&c);
                if d.is_some() {
                    origin = origin.or_else(|| self.origin.remove(&c));
                }
                desired.push(d);
            }
            let origin = origin.unwrap_or(Request {
                cell: ins.out,
                value: f64::NAN,
            });
            produced.clear();
            let ok = match ins.op {
                Op::Vec(n_in, _, v, start) => {
                    let v = self.program.vecs[v.index()];
                    let inputs = self.program.operands_at(start, n_in as usize);
                    let inp: Vec<f64> = inputs.iter().map(|&c| self.cells[c.index()]).collect();
                    let cur: Vec<f64> = (0..n_out)
                        .map(|k| self.cells[ins.out.index() + k])
                        .collect();
                    v.invert(inputs, &inp, &cur, &desired, &mut produced)
                }
                // A math input's value: write the constant expression.
                Op::Sym(_, _, s, start)
                    if self.program.syms[s.index()].kind == SymKind::Evaluate =>
                {
                    let expr = self.program.operands_at(start, 1)[0];
                    let d = desired[0].unwrap();
                    let h = if d.is_nan() {
                        f64::NAN
                    } else {
                        self.sym.engine.num(d).to_value()
                    };
                    produced.write(expr, h);
                    true
                }
                _ => match ins.op.invert(self.cells, desired[0].unwrap()) {
                    Some((c, v)) => {
                        produced.write(c, v);
                        true
                    }
                    None => false,
                },
            };
            if !ok {
                self.inversion.dropped.push(origin);
                continue;
            }
            if produced.writes.len() == 1 && produced.groups.is_empty() && self.heap.is_empty() {
                let (c, v) = produced.writes[0];
                self.walk(c, v, origin);
                continue;
            }
            for &(c, v) in &produced.writes {
                self.push(c, v, origin);
            }
            let groups = std::mem::take(&mut produced.groups);
            for g in groups {
                self.push_group(g, origin);
            }
        }
    }
}

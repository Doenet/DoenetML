//! Evaluators over one program, each as data or as code, under the core's
//! two ways of recomputing: everything in order (`full`) and the dirty
//! closure (`dirty`), both with early cutoff and both reporting the cells
//! that changed, as the core's do.

use cells_core::program::{Instr, Op};

use crate::prog::inputs;

#[inline(always)]
pub fn differs(new: f64, old: f64) -> bool {
    new != old && !(new.is_nan() && old.is_nan())
}

/// One way of evaluating instruction `i`.
pub trait Eval {
    fn len(&self) -> usize;
    fn out(&self, i: usize) -> usize;
    fn eval(&self, i: usize, cells: &[f64]) -> f64;
}

/// The core's: a `match` over the operator enum (`Op::eval`), what
/// `Program::step` does for a scalar instruction.
pub struct Data(pub Vec<Instr>);

impl Eval for Data {
    #[inline(always)]
    fn len(&self) -> usize {
        self.0.len()
    }
    #[inline(always)]
    fn out(&self, i: usize) -> usize {
        self.0[i].out.index()
    }
    #[inline(always)]
    fn eval(&self, i: usize, cells: &[f64]) -> f64 {
        self.0[i].op.eval(cells)
    }
}

/// Operators as code: each instruction carries a function specialized to its
/// operator kind and the operands that function reads. The same 40 bytes as
/// the core's `Instr`; the call goes through a pointer.
#[derive(Clone, Copy)]
pub struct CodeInstr {
    pub f: fn(&CodeInstr, &[f64]) -> f64,
    pub a: u32,
    pub b: u32,
    pub k: f64,
    pub k2: f64,
    pub out: u32,
}

pub struct Code(pub Vec<CodeInstr>);

macro_rules! code_fns {
    ($($name:ident |$c:ident, $s:ident| $e:expr;)*) => {
        $(fn $name($s: &CodeInstr, $c: &[f64]) -> f64 { $e })*
    };
}

fn nan_min(a: f64, b: f64) -> f64 {
    if a.is_nan() || b.is_nan() {
        f64::NAN
    } else {
        a.min(b)
    }
}
fn nan_max(a: f64, b: f64) -> f64 {
    if a.is_nan() || b.is_nan() {
        f64::NAN
    } else {
        a.max(b)
    }
}

code_fns! {
    f_add |c, s| c[s.a as usize] + c[s.b as usize];
    f_sub |c, s| c[s.a as usize] - c[s.b as usize];
    f_mul |c, s| c[s.a as usize] * c[s.b as usize];
    f_div |c, s| c[s.a as usize] / c[s.b as usize];
    f_min |c, s| nan_min(c[s.a as usize], c[s.b as usize]);
    f_max |c, s| nan_max(c[s.a as usize], c[s.b as usize]);
    f_neg |c, s| -c[s.a as usize];
    f_round |c, s| (c[s.a as usize] + 0.5).floor();
    f_floor |c, s| c[s.a as usize].floor();
    f_scale |c, s| c[s.a as usize] * s.k;
    f_offset |c, s| c[s.a as usize] + s.k;
    f_clamp |c, s| c[s.a as usize].clamp(s.k, s.k2);
    f_nanto |c, s| { let a = c[s.a as usize]; if a.is_nan() { s.k } else { a } };
}

impl Code {
    pub fn new(instrs: &[Instr]) -> Code {
        Code(
            instrs
                .iter()
                .map(|ins| {
                    let (a, b) = inputs(ins);
                    let (f, k, k2): (fn(&CodeInstr, &[f64]) -> f64, f64, f64) = match ins.op {
                        Op::Add(..) => (f_add, 0.0, 0.0),
                        Op::Sub(..) => (f_sub, 0.0, 0.0),
                        Op::Mul(..) => (f_mul, 0.0, 0.0),
                        Op::Div(..) => (f_div, 0.0, 0.0),
                        Op::Min(..) => (f_min, 0.0, 0.0),
                        Op::Max(..) => (f_max, 0.0, 0.0),
                        Op::Negate(..) => (f_neg, 0.0, 0.0),
                        Op::Round(..) => (f_round, 0.0, 0.0),
                        Op::Floor(..) => (f_floor, 0.0, 0.0),
                        Op::Scale(_, k) => (f_scale, k, 0.0),
                        Op::Offset(_, k) => (f_offset, k, 0.0),
                        Op::Clamp(_, lo, hi) => (f_clamp, lo, hi),
                        Op::NanTo(_, k) => (f_nanto, k, 0.0),
                        op => panic!("no code for {op:?}"),
                    };
                    CodeInstr {
                        f,
                        a: a as u32,
                        b: b.unwrap_or(0) as u32,
                        k,
                        k2,
                        out: ins.out.get(),
                    }
                })
                .collect(),
        )
    }
}

impl Eval for Code {
    #[inline(always)]
    fn len(&self) -> usize {
        self.0.len()
    }
    #[inline(always)]
    fn out(&self, i: usize) -> usize {
        self.0[i].out as usize
    }
    #[inline(always)]
    fn eval(&self, i: usize, cells: &[f64]) -> f64 {
        let ci = &self.0[i];
        (ci.f)(ci, cells)
    }
}

/// Operators as closures: one heap allocation per instruction, capturing
/// its operands.
pub struct Closures(pub Vec<(Box<dyn Fn(&[f64]) -> f64>, u32)>);

impl Closures {
    pub fn new(instrs: &[Instr]) -> Closures {
        Closures(
            instrs
                .iter()
                .map(|ins| {
                    let (a, b) = inputs(ins);
                    let b = b.unwrap_or(0);
                    let f: Box<dyn Fn(&[f64]) -> f64> = match ins.op {
                        Op::Add(..) => Box::new(move |c| c[a] + c[b]),
                        Op::Sub(..) => Box::new(move |c| c[a] - c[b]),
                        Op::Mul(..) => Box::new(move |c| c[a] * c[b]),
                        Op::Div(..) => Box::new(move |c| c[a] / c[b]),
                        Op::Min(..) => Box::new(move |c| nan_min(c[a], c[b])),
                        Op::Max(..) => Box::new(move |c| nan_max(c[a], c[b])),
                        Op::Negate(..) => Box::new(move |c| -c[a]),
                        Op::Round(..) => Box::new(move |c| (c[a] + 0.5).floor()),
                        Op::Floor(..) => Box::new(move |c| c[a].floor()),
                        Op::Scale(_, k) => Box::new(move |c| c[a] * k),
                        Op::Offset(_, k) => Box::new(move |c| c[a] + k),
                        Op::Clamp(_, lo, hi) => Box::new(move |c| c[a].clamp(lo, hi)),
                        Op::NanTo(_, k) => Box::new(move |c| if c[a].is_nan() { k } else { c[a] }),
                        op => panic!("no closure for {op:?}"),
                    };
                    (f, ins.out.get())
                })
                .collect(),
        )
    }
}

impl Eval for Closures {
    #[inline(always)]
    fn len(&self) -> usize {
        self.0.len()
    }
    #[inline(always)]
    fn out(&self, i: usize) -> usize {
        self.0[i].1 as usize
    }
    #[inline(always)]
    fn eval(&self, i: usize, cells: &[f64]) -> f64 {
        (self.0[i].0)(cells)
    }
}

/// Every instruction in order, as `Program::run_all_tracking`.
#[inline(never)]
pub fn full<E: Eval>(e: &E, cells: &mut [f64], changed: &mut Vec<u32>) {
    for i in 0..e.len() {
        let new = e.eval(i, cells);
        let out = e.out(i);
        if differs(new, cells[out]) {
            cells[out] = new;
            changed.push(out as u32);
        }
    }
}

/// The dirty closure's tables, as `DirtyClosure`.
pub struct Dirty {
    dep_start: Vec<u32>,
    dependents: Vec<u32>,
    dirty: Vec<u64>,
}

impl Dirty {
    pub fn new(instrs: &[Instr], n_cells: usize) -> Dirty {
        let mut dep_start = vec![0u32; n_cells + 1];
        let each = |f: &mut dyn FnMut(usize, usize)| {
            for (i, ins) in instrs.iter().enumerate() {
                let (a, b) = inputs(ins);
                f(i, a);
                if let Some(b) = b {
                    f(i, b);
                }
            }
        };
        each(&mut |_, c| dep_start[c + 1] += 1);
        for c in 0..n_cells {
            dep_start[c + 1] += dep_start[c];
        }
        let mut fill = dep_start.clone();
        let mut dependents = vec![0u32; dep_start[n_cells] as usize];
        each(&mut |i, c| {
            dependents[fill[c] as usize] = i as u32;
            fill[c] += 1;
        });
        Dirty {
            dep_start,
            dependents,
            dirty: vec![0; instrs.len().div_ceil(64)],
        }
    }

    pub fn readers(&self, cell: usize) -> &[u32] {
        &self.dependents[self.dep_start[cell] as usize..self.dep_start[cell + 1] as usize]
    }

    #[inline(always)]
    fn mark(&mut self, cell: usize, w: usize, bits: &mut u64, hi: &mut usize) {
        let (s, e) = (
            self.dep_start[cell] as usize,
            self.dep_start[cell + 1] as usize,
        );
        for &i in &self.dependents[s..e] {
            let dw = i as usize / 64;
            let bit = 1u64 << (i % 64);
            if dw == w {
                *bits |= bit;
            } else {
                self.dirty[dw] |= bit;
                *hi = (*hi).max(dw);
            }
        }
    }

    /// `DirtyClosure::recompute` with `e` in place of `Program::step`.
    #[inline(never)]
    pub fn run<E: Eval>(&mut self, e: &E, cells: &mut [f64], changed: &mut Vec<u32>) {
        let mut lo = usize::MAX;
        let mut hi = 0;
        for k in 0..changed.len() {
            let c = changed[k] as usize;
            if let Some(&first) = self.readers(c).first() {
                lo = lo.min(first as usize / 64);
            }
            self.mark(c, usize::MAX, &mut 0, &mut hi);
        }
        if lo == usize::MAX {
            return;
        }
        let mut w = lo;
        while w <= hi {
            let mut bits = std::mem::take(&mut self.dirty[w]);
            while bits != 0 {
                let b = bits.trailing_zeros() as usize;
                bits &= bits - 1;
                let i = w * 64 + b;
                let new = e.eval(i, cells);
                let out = e.out(i);
                if differs(new, cells[out]) {
                    cells[out] = new;
                    changed.push(out as u32);
                    self.mark(out, w, &mut bits, &mut hi);
                }
            }
            w += 1;
        }
    }
}

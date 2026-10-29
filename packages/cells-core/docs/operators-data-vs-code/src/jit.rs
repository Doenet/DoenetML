//! Operators compiled to machine code when the document is built, with
//! Cranelift: what a JIT for the core would do natively. Two forms:
//!
//! - full: straight-line code running every instruction in order, with
//!   early cutoff's comparison and the list of changed cells, as `full`;
//!   branchless, it selects the value to store and always writes the
//!   changed slot instead of branching on the comparison.
//! - guarded: the same, each instruction behind a dirty flag; an
//!   instruction whose output changed sets its readers' flags. The dirty
//!   closure compiled, without the bitset scan: it tests every flag.
//!
//! The program is cut into chunks of `CHUNK` instructions, one function
//! each, as a JIT would, to keep each function small for the register
//! allocator.

use cranelift_codegen::ir::condcodes::FloatCC;
use cranelift_codegen::ir::{AbiParam, InstBuilder, MemFlagsData, Value, types};
use cranelift_codegen::settings::{self, Configurable};
use cranelift_frontend::{FunctionBuilder, FunctionBuilderContext, Variable};
use cranelift_jit::{JITBuilder, JITModule};
use cranelift_module::{Linkage, Module, default_libcall_names};

use cells_core::program::{Instr, Op};

use crate::evals::Dirty;
use crate::prog::inputs;

pub const CHUNK: usize = 2048;

/// `(cells, changed, n_changed, flags) -> n_changed`.
type ChunkFn = unsafe extern "C" fn(*mut f64, *mut u32, u64, *mut u8) -> u64;

pub struct Jit {
    _module: JITModule,
    chunks: Vec<ChunkFn>,
    /// Seconds to compile.
    pub compile_s: f64,
    pub guarded: bool,
    pub branchless: bool,
}

impl Jit {
    pub fn new(instrs: &[Instr], dirty: Option<&Dirty>, branchless: bool) -> Jit {
        let t = std::time::Instant::now();
        let mut flags = settings::builder();
        flags.set("opt_level", "speed").unwrap();
        flags.set("is_pic", "false").unwrap();
        let isa = cranelift_native::builder()
            .unwrap()
            .finish(settings::Flags::new(flags))
            .unwrap();
        let mut module = JITModule::new(JITBuilder::with_isa(isa, default_libcall_names()));
        let ptr = module.target_config().pointer_type();
        let mut ctx = module.make_context();
        let mut fbc = FunctionBuilderContext::new();
        let mut ids = Vec::new();
        for (ci, chunk) in instrs.chunks(CHUNK).enumerate() {
            let base = ci * CHUNK;
            ctx.func.signature.params.push(AbiParam::new(ptr));
            ctx.func.signature.params.push(AbiParam::new(ptr));
            ctx.func.signature.params.push(AbiParam::new(types::I64));
            ctx.func.signature.params.push(AbiParam::new(ptr));
            ctx.func.signature.returns.push(AbiParam::new(types::I64));
            {
                let mut b = FunctionBuilder::new(&mut ctx.func, &mut fbc);
                let entry = b.create_block();
                b.append_block_params_for_function_params(entry);
                b.switch_to_block(entry);
                b.seal_block(entry);
                let p = b.block_params(entry).to_vec();
                let (cells, changed, flags_p) = (p[0], p[1], p[3]);
                let count: Variable = b.declare_var(types::I64);
                b.def_var(count, p[2]);
                let mf = MemFlagsData::trusted();
                for (j, ins) in chunk.iter().enumerate() {
                    let i = base + j;
                    let next = b.create_block();
                    if dirty.is_some() {
                        // if flags[i] == 0, skip; else clear it.
                        let f = b.ins().load(types::I8, mf, flags_p, i as i32);
                        let body = b.create_block();
                        b.ins().brif(f, body, &[], next, &[]);
                        b.seal_block(body);
                        b.switch_to_block(body);
                        let z = b.ins().iconst(types::I8, 0);
                        b.ins().store(mf, z, flags_p, i as i32);
                    }
                    let (a, bb) = inputs(ins);
                    let ld = |b: &mut FunctionBuilder, c: usize| {
                        b.ins().load(types::F64, mf, cells, (c * 8) as i32)
                    };
                    let x = ld(&mut b, a);
                    let y = bb.map(|c| ld(&mut b, c));
                    let new = emit_op(&mut b, ins.op, x, y);
                    let out = ins.out.index();
                    let old = ld(&mut b, out);
                    // differs: new != old (true when unordered) and not both NaN.
                    let ne = b.ins().fcmp(FloatCC::NotEqual, new, old);
                    let nn = b.ins().fcmp(FloatCC::Unordered, new, new);
                    let on = b.ins().fcmp(FloatCC::Unordered, old, old);
                    let both = b.ins().band(nn, on);
                    let d = b.ins().band_not(ne, both);
                    if branchless {
                        // Store the new value or the old; always write the
                        // changed slot; advance the count by the comparison.
                        let v = b.ins().select(d, new, old);
                        b.ins().store(mf, v, cells, (out * 8) as i32);
                        let n = b.use_var(count);
                        let off = b.ins().ishl_imm_u(n, 2);
                        let addr = b.ins().iadd(changed, off);
                        let o = b.ins().iconst(types::I32, out as i64);
                        b.ins().store(mf, o, addr, 0);
                        let inc = b.ins().uextend(types::I64, d);
                        let n1 = b.ins().iadd(n, inc);
                        b.def_var(count, n1);
                        b.ins().jump(next, &[]);
                        b.seal_block(next);
                        b.switch_to_block(next);
                        continue;
                    }
                    let write = b.create_block();
                    b.ins().brif(d, write, &[], next, &[]);
                    b.seal_block(write);
                    b.switch_to_block(write);
                    b.ins().store(mf, new, cells, (out * 8) as i32);
                    let n = b.use_var(count);
                    let off = b.ins().ishl_imm_u(n, 2);
                    let addr = b.ins().iadd(changed, off);
                    let o = b.ins().iconst(types::I32, out as i64);
                    b.ins().store(mf, o, addr, 0);
                    let n1 = b.ins().iadd_imm_u(n, 1);
                    b.def_var(count, n1);
                    if let Some(dirty) = dirty {
                        let one = b.ins().iconst(types::I8, 1);
                        for &r in dirty.readers(out) {
                            b.ins().store(mf, one, flags_p, r as i32);
                        }
                    }
                    b.ins().jump(next, &[]);
                    b.seal_block(next);
                    b.switch_to_block(next);
                }
                let n = b.use_var(count);
                b.ins().return_(&[n]);
                let tfc = module.target_config();
                b.finalize(tfc);
            }
            let id = module
                .declare_function(&format!("chunk{ci}"), Linkage::Local, &ctx.func.signature)
                .unwrap();
            module.define_function(id, &mut ctx).unwrap();
            module.clear_context(&mut ctx);
            ids.push(id);
        }
        module.finalize_definitions().unwrap();
        let chunks = ids
            .iter()
            .map(|&id| unsafe {
                std::mem::transmute::<*const u8, ChunkFn>(module.get_finalized_function(id))
            })
            .collect();
        Jit {
            _module: module,
            chunks,
            compile_s: t.elapsed().as_secs_f64(),
            guarded: dirty.is_some(),
            branchless,
        }
    }

    /// Run every chunk. `changed` must have room for every instruction's
    /// output past its length; `flags` one byte per instruction (guarded).
    #[inline(never)]
    pub fn run(&self, cells: &mut [f64], changed: &mut Vec<u32>, flags: &mut [u8]) {
        let mut n = changed.len() as u64;
        let need = n as usize + cells.len();
        if changed.capacity() < need {
            changed.reserve(need - changed.len());
        }
        for f in &self.chunks {
            n = unsafe {
                f(
                    cells.as_mut_ptr(),
                    changed.as_mut_ptr(),
                    n,
                    flags.as_mut_ptr(),
                )
            };
        }
        unsafe { changed.set_len(n as usize) };
    }
}

fn emit_op(b: &mut FunctionBuilder, op: Op, x: Value, y: Option<Value>) -> Value {
    let nan_pick = |b: &mut FunctionBuilder, x: Value, y: Value, r: Value| {
        // NaN if either is NaN, as `nan_min`; else r.
        let un = b.ins().fcmp(FloatCC::Unordered, x, y);
        let nan = b.ins().f64const(f64::NAN);
        b.ins().select(un, nan, r)
    };
    match op {
        Op::Add(..) => b.ins().fadd(x, y.unwrap()),
        Op::Sub(..) => b.ins().fsub(x, y.unwrap()),
        Op::Mul(..) => b.ins().fmul(x, y.unwrap()),
        Op::Div(..) => b.ins().fdiv(x, y.unwrap()),
        Op::Min(..) => {
            // f64::min without NaNs: x < y ? x : y.
            let y = y.unwrap();
            let lt = b.ins().fcmp(FloatCC::LessThan, x, y);
            let m = b.ins().select(lt, x, y);
            nan_pick(b, x, y, m)
        }
        Op::Max(..) => {
            let y = y.unwrap();
            let gt = b.ins().fcmp(FloatCC::GreaterThan, x, y);
            let m = b.ins().select(gt, x, y);
            nan_pick(b, x, y, m)
        }
        Op::Negate(..) => b.ins().fneg(x),
        Op::Round(..) => {
            let h = b.ins().f64const(0.5);
            let s = b.ins().fadd(x, h);
            b.ins().floor(s)
        }
        Op::Floor(..) => b.ins().floor(x),
        Op::Scale(_, k) => {
            let k = b.ins().f64const(k);
            b.ins().fmul(x, k)
        }
        Op::Offset(_, k) => {
            let k = b.ins().f64const(k);
            b.ins().fadd(x, k)
        }
        Op::Clamp(_, lo, hi) => {
            let lo = b.ins().f64const(lo);
            let hi = b.ins().f64const(hi);
            let l = b.ins().fcmp(FloatCC::LessThan, x, lo);
            let x = b.ins().select(l, lo, x);
            let g = b.ins().fcmp(FloatCC::GreaterThan, x, hi);
            b.ins().select(g, hi, x)
        }
        Op::NanTo(_, k) => {
            let k = b.ins().f64const(k);
            let un = b.ins().fcmp(FloatCC::Unordered, x, x);
            b.ins().select(un, k, x)
        }
        op => panic!("no JIT for {op:?}"),
    }
}

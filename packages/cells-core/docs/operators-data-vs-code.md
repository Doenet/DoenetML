# Operators as data or as code

The tick report ([`tick-design-decisions.md`](tick-design-decisions.md),
decision #2) concluded that interpreting operators as data is 1.2 to 5
times faster than calling them as code. That is surprising: an
interpreter usually loses to the code a compiler writes. This report
revisits the question. It separates the meanings "operators as code" can
have, times each one against the core's interpreter at Rust's
optimization levels, natively, in wasm under V8, and with and without a
JIT. It also asks which situation real documents are in.

**In short.**

- **The interpreter is native code.** `Op::eval` is a `match` whose arms
  compile to the arithmetic you would write by hand; the interpreter
  pays one indirect jump to reach an arm and a few loads for the
  operands. "Data or code" is only about that dispatch, and about whether
  code may be specialized to the document.
- **Calling code instead of matching costs little natively, and more in
  wasm.** Natively, where dispatch is predicted, a clean function pointer
  per instruction costs 1.03–1.17 times the interpreter and a closure
  1.0–1.28 times. Where operator kinds are mixed at random, the pointer
  wins by 15–25%. In wasm, which is what the browser runs, a call through
  a pointer costs 1.33–1.40 times everywhere. The report's 1.2–5 times
  came mostly from extra work its alternatives did per instruction, not
  from the call (see
  [What the tick report measured](#what-the-tick-report-measured)).
- **Code specialized to the document can be up to 5 times faster, but
  only while it is small.** Compiled ahead of time by rustc or at load
  time by Cranelift, a 1,000-instruction program with randomly mixed
  operators runs in 1.8–2.1 ns per instruction against the interpreter's
  10–11. With one operator kind, as in every synthetic shape, it gains
  nothing on a chain and at most 1.5 times on a fan. Past about 2,000
  instructions every tick must fetch the whole program's machine code
  again. Where dispatch is predicted, native code then falls 1.6–6 times
  behind the interpreter. With random mixes it keeps a shrinking lead to
  about 3,000 instructions and loses by 10,000. Its code grows with the
  document; the interpreter's does not.
- **Real documents sit on the interpreter's side.** Their operator kinds
  change from one instruction to the next 36–100% of the time, yet on
  `fixtures/sir.doenet`, the largest (2,621 scalar instructions), the
  interpreter runs at 2.2–2.4 ns per instruction. The document repeats
  one template 200 times, so the processor learns the order of kinds.
  Code compiled for that document runs at 3.9–5.8 ns (Cranelift) and
  6–11 ns (rustc).
- **In the browser a JIT pays twice.** Generated code starts in V8's
  baseline tiers: generated JS runs 10–35 times slower than the
  interpreter, and generated wasm 1.7–14 times. V8 may take hundreds of
  ticks to optimize code that runs once per tick; the generated JS was
  never optimized in 201 ticks. Forced to its optimized steady state,
  generated wasm beats the interpreter 2.5–3.3 times on 1,000 randomly
  mixed instructions. It ties or loses everywhere else, including on
  `sir`.
- **The optimization level changes little above 0, and never the
  ranking.** At opt-level 1 and 2, every evaluator runs within 10% of its
  opt-level-3 time, except the core's own `FullRecompute`, which is 30%
  slower at 1. At 0, everything is 3–6 times slower.

**What this means for the design.** Operators as data is the right
choice for the core. That is not because data is faster than native code
in general, which it is not, but for three reasons. The interpreter's
code is fixed in size, so it stays in the processor's caches whatever
the document. Real documents' dispatch is predictable. And the wasm the
browser runs makes calls dearer than jumps. A JIT could win only on
small documents with irregular operator mixes under full recompute, and
it would cost milliseconds of compilation, a second evaluator to keep
bit for bit identical, and recompilation on every rebuild. See
[Implications](#implications) for what would capture most of native
code's advantage without its cost.

## What "operators as code" can mean

The core's documents are written by authors and loaded at run time, so
no Rust code can be specialized to a document when the core is compiled.
Rust code can only be specialized to each *operator kind*, and the
core's interpreter already is. Three designs differ in where dispatch
happens and what the code is specialized to:

| Design | Code specialized to | Dispatch per instruction | Code size grows with |
|---|---|---|---|
| **data** (the core): a `match` over `Op` | each operator kind | an indirect jump inside one function (a jump table) | the number of kinds |
| **fnptr** / **closure**: a function per kind, or a closure per instruction | each kind (fnptr), or each instruction's operands (closure) | an indirect call and return | the number of kinds |
| **jit** / **aot**: the whole program as straight-line machine code | the document: cell indices and literals are immediates | none | the document |

The core's interpreter is a jump table:

```
movzbl 0x0(%r13),%eax          ; the operator's tag
movslq (%rcx,%rax,4),%rax      ; its arm in the table
add    %rcx,%rax
jmp    *%rax
...                            ; Offset's arm:
mov    0x4(%r13),%edi          ; input cell index
cmp    %rdi,%rbx               ; bounds check
movsd  0x8(%r13),%xmm0         ; literal k
addsd  (%r15,%rdi,8),%xmm0     ; cells[a] + k
```

against the straight-line code rustc writes for a known `Offset`:

```
movsd  0x20(%rdi),%xmm1        ; cells[4]
addsd  CONST(%rip),%xmm1       ; + 1.0
```

So the interpreter's cost over specialized code is the tag load, the jump
and the operand loads. That is at most about 1 ns per instruction when
the jump is predicted, and about 8 ns when it is not.

## Results

All times are recompute only (not the request or inversion around it),
in ns per instruction run, the median of the timed ticks. Native times
are on a shared 4-core Intel Xeon @ 2.10 GHz (32 KB L1i, 2 MB L2 per
core), the kind of machine the tick report used. "Full" runs every
instruction in schedule order with early cutoff's comparison, as
`FullRecompute`; "dirty" is the dirty closure, as `DirtyClosure`. Each
evaluator ran on its own copy of the cells, and all had to leave every
cell identical, bit for bit.

### Dispatch: a jump, a call, a closure

Natively, full recompute, programs of the shapes and of random operator
kinds (`randomK`: each instruction reads one or two of the 16 cells
before it, with K kinds drawn at random):

| Program | Instructions | data | fnptr | closure |
|---|---:|---:|---:|---:|
| depth | 10,000 | 3.13 | 3.24 | 3.13 |
| breadth | 10,000 | 2.54 | 2.76 | 3.25 |
| poly | 50,000 | 2.83 | 3.32 | 3.04 |
| mixed | 100,000 | 2.27 | 2.40 | 2.50 |
| sir | 2,621 | 2.36 | 2.56 | 2.62 |
| random9 | 10,000 | 11.09 | 8.39 | 9.94 |
| random12 | 10,000 | 12.55 | 10.00 | 11.67 |

In wasm under node's V8, the same harness built for `wasm32-wasip1` at
opt-level 3 (the shipped build adds `wasm-opt`), median of three
processes:

| Program | Instructions | data | fnptr | closure |
|---|---:|---:|---:|---:|
| depth | 10,000 | 3.17 | 4.22 | 4.61 |
| breadth | 10,000 | 2.92 | 4.10 | 4.42 |
| sir | 2,621 | 3.00 | 4.10 | 4.39 |
| random9 | 10,000 | 11.95 | 16.27 | 17.32 |
| random12 | 10,000 | 11.25 | 15.78 | 17.15 |

Under the dirty closure, whose bookkeeping costs 3–8 ns per instruction
on top of evaluating it, the three agree within 20% natively and in wasm
(depth at 10,000: 10.4, 9.9 and 10.3 natively; 11.5, 11.5 and 12.2 in
wasm).

**What it shows.**

- Where dispatch is predicted, with one operator kind as in every
  synthetic shape, or in `sir`'s repeating order, calling a function
  instead costs 3–17% natively, and a closure 0–28%.
- With kinds mixed at random, every evaluator mispredicts its dispatch
  about once per instruction and costs 8–12 ns. Natively the call
  through a pointer is then 15–25% *faster* than the jump table. In wasm
  it is 1.33–1.40 times slower, as it is everywhere in wasm:
  `call_indirect` also checks the table bound and the function's
  signature, and V8 cannot inline it. The browser runs wasm, so in the
  browser the `match` is the faster dispatch either way.
- The interpreter's code fits the instruction cache whether the document
  has 100 instructions or 100,000; what grows is the data, which streams
  (depth costs 3.1 ns per instruction at 10,000 and 4.6 at 100,000,
  whose 4 MB of instructions no longer fit the L2 cache).

### Code for the whole document

Natively, full recompute. "jit" is Cranelift 0.137 at `opt_level=speed`,
one function per 2,048 instructions; "aot" is the program written as
Rust and compiled by rustc at opt-level 3 with fat LTO. Both keep early
cutoff's comparison and the list of changed cells, so they do the same
work as the interpreter minus dispatch. The branchless forms, which
select the value to store instead of branching on the comparison, were
within 15% of these and are left out.

| Program | Instructions | data | jit | aot |
|---|---:|---:|---:|---:|
| breadth | 100 | 2.60 | 2.23 | 1.77 |
| random12 | 100 | 2.82 | 2.07 | 2.00 |
| depth | 1,000 | 2.77 | 2.83 | 2.69 |
| breadth | 1,000 | 2.48 | 2.27 | 2.52 |
| random9 | 1,000 | 10.89 | 2.04 | 2.08 |
| random12 | 1,000 | 9.79 | 1.89 | 1.76 |
| sir | 2,621 | 2.2–2.4 | 3.9–5.8 | 6.1–10.7 |
| depth | 3,000 | 2.86 | 9.48 | 15.70 |
| random12 | 3,000 | 10.55 | 6.81 | 7.71 |
| depth | 10,000 | 3.13 | 8.94 | 19.8 |
| random12 | 10,000 | 12.55 | 15.95 | — |
| depth | 100,000 | 4.58 | 11.07 | — |
| poly | 500,000 | 6.81 | 27.94 | — |

What compiling costs, against a tick of 3–30 µs at 1,000–10,000
instructions:

| Compiler | Cost |
|---|---|
| Cranelift (this harness's code generator) | 45–70 µs per instruction: 0.6 s for 10,000, 6 s for 100,000 |
| rustc, ahead of time | 3.5–4.5 minutes per build of the harness, most of it link-time optimization; not an option for documents that arrive at run time |
| V8, from generated wasm (eager TurboFan) | 5–16 µs per instruction, after 19–28 µs per instruction to generate it in JS |

A better code generator would cut Cranelift's time several times over,
but it would remain thousands of ticks' worth of work per document, paid
again whenever a rebuild changes the program.

**What it shows.**

- **Native code removes dispatch, and wins where dispatch was the
  cost.** On 1,000 instructions of randomly mixed kinds, compiled code
  is 5 times faster than the interpreter. With one kind, the
  interpreter's dispatch was already predicted. Native code then gains
  nothing on a chain (depth), where each instruction waits about 6
  cycles for the one before through memory whichever runs it, and at
  most 1.5 times on a fan of 100.
- **Past about 2,000 instructions, native code loses its lead.** Each
  instruction is about 60 bytes of machine code (rustc's, for `Offset`),
  so 1,000 instructions are about 60 KB, and 3,000 about 190 KB. The run
  is straight-line, so every tick fetches all of it again. The processor
  streams the interpreter's 40-byte instructions as *data*, which its
  prefetchers fetch well ahead. It fetches machine code far more slowly
  once it leaves the L1 instruction cache and the branch target buffer.
  The cliff appears with and without branches, so it is the supply of
  instructions, not branch prediction. (No performance counters were
  available on the machine; this is inferred from the size sweep.) Where
  the interpreter mispredicts its dispatch (random12), native code keeps
  a lead to about 3,000 instructions (6.8 against 10.6 ns), because both
  are then slow, and loses by 10,000 (16.0 against 12.6).
- **sir is past the cliff.** At 2,621 instructions, code for the
  document is 1.6–5 times slower than the interpreter.

### In the browser: V8

The browser can JIT only by generating JS or wasm and letting V8
compile it. Measured in node 22 (V8 12.4) on each program from
`opbench --dump`, in 256-instruction functions:

- **js-switch**: operators as data in JS, a `switch` over typed arrays;
- **js-codegen**: the program as JS source (`new Function`);
- **wasm-codegen**: the program as a wasm module;
- **Rust→wasm data**: the core's interpreter, as above.

At V8's own pace, after 201 ticks, generated code was still in a
baseline tier. Generated JS ran in V8's interpreter (Ignition) at 82–125
ns per instruction, 10–35 times the core's; after 3,000 ticks of a
1,000-instruction program, V8 had marked 4 of its 16 functions for
optimization. Generated wasm ran in Liftoff at 14–40 ns per
instruction, 1.7–14 times the core's. The first tick, which includes
lazy compilation, took 1–12 ms. Each generated function runs once per
tick, so V8's counters warm slowly; the interpreter is one function
that runs every instruction, so it is optimized within a few ticks.

Forced to V8's optimizing compiler (generated JS optimized after four
ticks with `%OptimizeFunctionOnNextCall`; generated wasm with
`--no-liftoff`), median of three processes:

| Program | Instructions | Rust→wasm data | js-switch | js-codegen | wasm-codegen |
|---|---:|---:|---:|---:|---:|
| breadth | 1,000 | 3.04 | 2.96 | 3.92 | 2.55 |
| random9 | 1,000 | 12.47 | 12.20 | 5.13 | 3.78 |
| random12 | 1,000 | 10.83 | 12.61 | 5.20 | 4.26 |
| sir | 2,621 | 3.00 | 9.45 | 3.99 | 3.47 |
| depth | 10,000 | 3.17 | 7.82 | 11.29 | 12.64 |
| breadth | 10,000 | 2.92 | 7.69 | 11.73 | 9.58 |
| random12 | 10,000 | 11.25 | 20.53 | 36.30 | 18.30 |

(Rust→wasm at depth 1,000 varied from 7 to 13 ns between processes and
is left out.)

**What it shows.**

- The same shape as natively: generated wasm wins 2.5–3.3 times on 1,000
  randomly mixed instructions, ties or loses at 1,000 of one kind and on
  `sir`, and loses 1.6–4 times at 10,000.
- Operators as data in JS (js-switch) run as fast as the core's wasm at
  1,000 instructions, and 1.8–3 times slower on `sir` and at 10,000.
  What makes the JavaScript core slow is not that its operators are
  code. It is what
  the tick report's "state-variable functions" row measured: dependencies
  found by name, and values gathered into fresh maps on every
  evaluation.

### Optimization levels

Natively, full recompute, at 10,000 instructions, with the core's own
`FullRecompute` alongside (`core`):

| Profile | depth: data | fnptr | closure | core | random12: data | fnptr | closure |
|---|---:|---:|---:|---:|---:|---:|---:|
| opt-level 0 | 16.93 | 13.96 | 16.97 | 9.22 | 24.28 | 21.65 | 24.47 |
| opt-level 1 | 3.00 | 3.09 | 3.08 | 3.61 | 12.12 | 9.69 | 11.34 |
| opt-level 2 | 3.00 | 3.26 | 3.13 | 2.99 | 11.27 | 9.76 | 10.77 |
| opt-level 3 | 2.81 | 2.98 | 2.89 | 2.79 | 11.33 | 9.01 | 10.53 |

At opt-level 0 nothing is inlined, so every evaluator is 3–6 times
slower. The harness's generic evaluators then pay a call for every trait
method, so the core's own `FullRecompute` comes out fastest; at this
level the comparison says more about inlining than about dispatch. From
opt-level 1 the loop is a few dozen instructions that LLVM compiles
nearly as well as it can, and levels 2 and 3 add at most 10%, or 30% to
the core's `FullRecompute`. No level changes which dispatch wins.
Cranelift's and V8's generated code does not depend on Rust's
optimization level; only their compile time does.

The release profile (`Cargo.toml`) builds at opt-level 3 with fat LTO.
`wasm-pack` adds `wasm-opt -O`, and V8 then compiles the wasm again,
first with Liftoff and then with TurboFan.

### Real documents' operator mix

`opbench --kinds` counts, for each golden document and fixture, its
instructions, their kinds, the share that are vector or symbolic, and
how often an instruction's kind differs from the one before it in the
schedule:

| Document | Instructions | Kinds | Vector or symbolic | Kind changes |
|---|---:|---:|---:|---:|
| choices | 38 | 8 | 18% | 73% |
| circles | 15 | 7 | 40% | 79% |
| fixed | 15 | 3 | 0% | 36% |
| lines | 3 | 3 | 100% | 100% |
| ops | 17 | 13 | 0% | 100% |
| polygons | 5 | 3 | 20% | 100% |
| repeats | 24 | 7 | 0% | 91% |
| scoring | 25 | 8 | 64% | 100% |
| slider | 26 | 11 | 0% | 100% |
| sticky | 1 | 1 | 100% | — |
| symbolic | 10 | 3 | 100% | 89% |
| fixtures/sir | 2,628 | 11 | 0.3% | 54% |

Every synthetic shape has one kind (`Offset`) and 0% changes, the
interpreter's best case. Real documents mix kinds; the random programs
are their worst case, with no order the processor can learn. `sir`, the
one real document large enough to time, sits between: 54% changes, in an
order that repeats with each of the 200 iterations of its
`functionIterates`. There the interpreter runs at the one-kind speed
(2.2–2.4 ns natively, 3.0 ns in wasm), so its dispatch is predicted.

## What the tick report measured

The tick report's two "operators as code" patches kept the core's `step`
and added, for every instruction:

- the instruction's position, from a pointer subtraction and a division;
- a bounds-checked lookup in a parallel `Vec<Code>` of 16-byte entries;
- a test of the `Option`;
- a second bounds-checked load and a `ptr::eq` check against the
  instruction;
- and only then the call. In the closure patch, each closure was a
  separate `Rc` allocation, so the calls went to scattered memory.

Rebuilt at the report's commit (`8daf609`) on the same machine, the
pointer patch still costs 1.19–1.78 times under full recompute (median
of three processes each; the report gave 1.22–2.03):

| Shape | n | core (µs) | pointer patch (µs) | patch / core |
|---|---:|---:|---:|---:|
| depth | 10,000 | 29.4 | 34.9 | 1.19 |
| depth | 100,000 | 330 | 410 | 1.24 |
| breadth | 10,000 | 28.0 | 36.1 | 1.29 |
| breadth | 100,000 | 283 | 379 | 1.34 |
| mixed | 10,000 | 16.9 | 30.1 | 1.78 |
| mixed | 100,000 | 190 | 300 | 1.58 |

A clean pointer design, in which each instruction carries its function
next to its operands, costs 1.01–1.09 times on the same shapes. So most
of the measured cost was the patches' lookup. The report's explanation,
that "the processor can overlap independent steps written as data but
cannot see through a call", is not borne out: on breadth, where the
steps are independent, the clean call costs 9%. Its conclusion, that the
`match` is the right dispatch, still holds in wasm, for the reasons
above.

## Implications

- **Keep operators as data.** In the wasm the browser runs, the `match`
  beats a call per instruction by 1.33–1.40 times. It keeps the code
  the same size for every document. It keeps one evaluator, which the
  inverses, the lookahead and the reference evaluator share.
- **A per-document JIT is not worth it now.** It would win only on small
  documents (up to about 3,000 instructions) whose operator kinds change
  in an order the processor cannot learn, and only under full
  recompute. It would cost 5–70 µs per instruction to compile, more than
  a thousand ticks, at load and after every structural rebuild. In the
  browser it would also wait on V8's tiering. And it would have to stay
  bit for bit identical to the interpreter.
- **The dirty closure is the bigger cost.** Its bookkeeping costs 3–8
  ns per instruction on top of the 2–3 for evaluating one, whatever the
  dispatch. A compiled dirty closure (`jit/dirty` in the harness: each
  instruction behind a flag, its readers' flags set inline) was 1.3–1.5
  times faster on `sir` and random1, where most of the program changes
  (`sir`: 6.3 against 9.4 ns). It was 1.2–2.2 times slower on depth,
  breadth and poly, whose code no longer fits, and 22 times slower on
  `mixed`, where 5% changes, because it tests every flag. Skipping
  instructions needs an entry point per instruction, which brings back
  the call.
- **Native code's advantage can be had with code that does not grow with
  the document**:
  - *code per template, not per instance*: `sir`'s 2,600 instructions
    are one template's 13 run 200 times. A function per template,
    run over each instance's operands, is a few hundred bytes for any
    number of instances.
  - *superinstructions*: fusing a common sequence (a lowered `<math>`)
    into one operator removes dispatch inside it, as #3's coarse units
    did, and it stays in the `match`.
  - *grouping independent instructions by kind* where the schedule
    allows it, so that a fan's dispatch is predicted.

  None of these was built.

## What was not measured

- **Other engines and processors.** V8 in node 22 only, not
  SpiderMonkey or JavaScriptCore, whose tiering differs. Only one Intel
  server processor: a phone's smaller caches would move the
  code-size cliff to smaller documents, and its weaker branch prediction
  would raise the cost of mixed dispatch.
- **Performance counters.** `perf` was not available, so instruction
  supply as the cause of the cliff is inferred from the size sweep and
  the branchless variants, not counted.
- **Real documents beyond `sir`.** The golden documents have 1–38
  instructions, too few to time; their mix was counted, not timed.
  `sir`'s 7 vector or symbolic instructions were dropped, and its seed
  is the essential cell whose change reaches the most scalar
  instructions without reaching them (2,003 of 2,621).
- **Vector and symbolic operators.** Only scalar operators were
  compiled. The core runs vector and symbolic operators through the same
  `match`, and their work per instruction dwarfs dispatch.
- **A tuned code generator.** The Cranelift and wasm generators are
  straightforward: they write one block per instruction, with
  the cells in memory, and they keep no value in a register across
  instructions.

## How it was measured

The harness is
[`operators-data-vs-code/`](operators-data-vs-code/), a crate outside
the cells-core workspace so that its Cranelift dependency stays out of
the core's build. It reads the core's own instructions (`Op`, `Instr`)
from `cells_bench::shapes`, from a `.doenet` file, or makes random
programs. It times each evaluator on its own copy of the cells,
interleaved tick by tick, with the dragged cell alternating between 2
and 3: 3 warm-up ticks, then 41–401 timed, the median reported. It
checks that every evaluator leaves the same cells as the first, bit for
bit.

```bash
cd packages/cells-core/docs/operators-data-vs-code
# Native: data, the core's own evaluators, fnptr, closure, jit.
cargo run --release -- depth,breadth,mixed,poly,random1,random9,random12 10000,100000
cargo run --release -- file:../../fixtures/sir.doenet 1
# Optimization levels (without the JIT).
cargo run --profile opt0 --no-default-features -- depth,breadth,random12 10000
# Ahead of time: write the programs as Rust, then build with them.
cargo run --release -- --emit-rust depth,breadth,random1,random9,random12 100,1000,3000 gen/aot.rs
cargo run --release --features aot -- depth,breadth,random1,random9,random12 100,1000,3000
# wasm under node; JS and generated wasm.
cargo build --release --target wasm32-wasip1 --no-default-features
node node/wasi.mjs target/wasm32-wasip1/release/opbench.wasm depth,random12 10000
cargo run --release -- --dump random12 1000 random12.json
node node/bench.mjs random12.json 201
FORCE_OPT=1 node --allow-natives-syntax --no-liftoff --no-wasm-lazy-compilation node/bench.mjs random12.json 201
# The golden documents' operator mix (needs the parser, as cargo test does).
cargo run --release -- --kinds
```

**Noise.** On the shared machine a whole process sometimes runs 10–30%
fast or slow; rows marked as ranges, and the wasm and V8 tables, are
over three processes. Rows of the same table come from the same process,
so their ratios are steadier than their absolute times. Native rows
above 2,000 instructions moved by up to 50% for `jit` and `aot` between
processes (sir: jit 3.9–5.8, aot 6.1–10.7), never enough to change which
evaluator won.

//! An instruction ([`Instr`]): an operator bound to its input cells and the
//! cell it writes. [`OpSpec`] is the operator before its inputs are bound, as
//! the build plans it; [`SymKind`] the symbolic instructions.

use crate::index::CellIdx;
use crate::program::{Op, OpSpec, VecOp};
use crate::sym::Handle;

/// Samples a function curve owns: `Sample` writes this many y-values over
/// evenly spaced x-values from the graph's `xmin` to `xmax`.
pub const SAMPLES: usize = 200;
const _: () = assert!(
    SAMPLES <= u8::MAX as usize,
    "`Op::Sym` keeps its outputs in a byte"
);

/// A symbolic instruction: it calls the document's symbolic engine. Inputs are
/// cells holding numbers or expression handles; every input is in
/// [`Program::operands`](crate::program::Program::operands). Each one keeps the input values it last ran on and its
/// outputs, and reruns only when an input changed.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SymKind {
    /// The template with each cell leaf replaced by its cell's value (a number,
    /// or the expression a math cell holds), then `post`. Inputs are the
    /// template's leaf cells; `template` is an engine expression whose leaves
    /// are those cells.
    Instantiate {
        /// The engine expression whose leaves are the input cells.
        template: Handle,
        /// What to do to the result.
        post: Post,
    },
    /// A lowered math's expression, shown while its value is missing (ADR
    /// 0046): with input 0, the value, missing, the template instantiated
    /// as [`SymKind::Instantiate`] does (its leaves are inputs 1 on), so a
    /// missing operand shows as the blank in it (`＿ + 1`); otherwise NaN,
    /// the numeric math's expression (ADR 0005), at the cost of one check.
    /// Its cell keeps its port's type, a number: the handle is for the
    /// math's display alone, which reads it only while the value is
    /// missing.
    InstantiateBlank {
        /// The engine expression whose leaves are inputs 1 on.
        template: Handle,
        /// What to do to the result.
        post: Post,
    },
    /// The expression in input 0 as a number; NaN with free symbols.
    Evaluate,
    /// Input 0 with `x` set to input 1.
    EvalAt,
    /// d/dx of input 0.
    Derivative,
    /// 1 if inputs 0 and 1 are mathematically equal (by sampling), else 0.
    Equals,
    /// 1 if inputs 0 and 1 are the same expression as written, else 0.
    EqualsSyntax,
    /// Input 0 at `SAMPLES` evenly spaced x from input 1 to input 2.
    Sample,
    /// `Program::tapes[tape]` at `SAMPLES` evenly spaced x from input 0 to
    /// input 1; inputs 2.. are the tape's parameter cells. What `Sample`
    /// becomes when the expression's shape is constant at build time.
    SampleTape {
        /// The compiled curve it runs.
        tape: TapeIdx,
    },
    /// Input 0, an expression in `x`, with its values held between inputs 1
    /// and 2 (`<clampFunction>`): an expression again.
    ClampFunction,
    /// Input 0, an expression in `x`, with its values wrapped periodically
    /// into the range from input 1 to input 2 (`<wrapFunctionPeriodic>`): an
    /// expression again.
    WrapFunctionPeriodic,
    /// `a x² + b x + c` (inputs 0 to 2) at `SAMPLES` evenly spaced x from
    /// input 3 to input 4: a `<parabola>`'s curve. Numeric, but a run of
    /// `SAMPLES` outputs, more than a vector instruction holds.
    SampleQuadratic,
    /// The text of each of `n` inputs, joined with `, `, interned (ADR
    /// 0053): a text reading a sequence (`<text>$tl</text>`, ADR 0041
    /// decision 5) or a value's text (`n` 1). An input reads as its kind
    /// in `kinds` (two bits each, `program::texts`): a string as it is, a
    /// number as it is shown (`true` or `false` when `booleans`), an
    /// expression as the engine prints it, the missing value as `＿`. No
    /// input is the missing value. A string id; it makes the one string a
    /// tick may make.
    Join {
        /// How many inputs.
        n: u8,
        /// What each input holds, filled in when it is bound.
        kinds: u128,
        /// Whether the numbers are booleans.
        booleans: bool,
    },
    /// The text of each of `n` inputs, as `Join` writes each, joined with
    /// `sep` (ADR 0058): a section's full number ("2.1") and its automatic
    /// title ("Section 2.1"), which a count that changes in a tick changes.
    /// A string id; it makes a string as a join does.
    JoinWith {
        /// How many inputs.
        n: u8,
        /// What each input holds, filled in when it is bound.
        kinds: u128,
        /// What goes between two inputs' texts.
        sep: crate::program::texts::Sep,
    },
    /// The order of `n` inputs, as the current core's `<sort>` compares
    /// them (ADR 0041 decision 7): output `k` the 1-based position of the
    /// input that comes `k`-th. By value when every input is a number or
    /// an expression that evaluates to one, a NaN last; else by text (a
    /// number as JavaScript writes it, an expression as the engine prints
    /// it). Equal inputs keep their order. `kinds` as for `Join`.
    Order {
        /// How many inputs, and outputs.
        n: u8,
        /// What each input holds, filled in when it is bound.
        kinds: u128,
    },
    // Functions of one variable with domains (ADR 0049). A function is
    // given as its domain and its pieces: `D` is four cells, an
    // interval's lower and upper endpoints and whether each is closed
    // (1) or open (0); a piece is six, its expression, the variable it is
    // in (a math cell holding a symbol) and its own domain. Its value at
    // `x` is NaN outside `D`, else the first piece whose domain holds `x`,
    // evaluated there, else NaN ([`in_domain`]). An endpoint of `D` that
    // is no number is no bound; a piece with one is left out, as the
    // current core's `<function>` and `<piecewiseFunction>` read them. A
    // `<function>` is one piece on the whole line, its domain `D`.
    /// Input 1.. a function (`D`, then pieces) at input 0.
    EvalFunction,
    /// Inputs 2.. a function (`D`, then pieces) at `SAMPLES` evenly spaced
    /// x from input 0 to input 1: its curve.
    SampleFunction,
    /// d/dv of input 0, where input 1 is a math cell holding the symbol
    /// `v`: a derivative in a function's own variable.
    DerivativeBy,
    /// Coordinate `coord` of a `<curve>`'s Bézier spline through `n`
    /// points (ADR 0049) at `SAMPLES` evenly spaced parameters from 0 to
    /// `n - 1`: input 0 is the spline's tension, then [`BEZIER_POINT_CELLS`]
    /// per point, its coordinates, its two control vectors (toward the
    /// previous point and toward the next) and how they are given
    /// ([`bezier_controls`](crate::program::bezier_controls)). Numeric, but
    /// a run of `SAMPLES` outputs.
    SampleBezier {
        /// 0 for x, 1 for y.
        coord: u8,
        /// The uniform spline instead of the centripetal one.
        uniform: bool,
    },
    /// Part `part` of the subset of the reals input 0 names, in the
    /// variable input 1 holds (`x` when it holds none), written as
    /// intervals or as inequalities (`<subsetOfReals>`). The inverse of
    /// its `Value` writes the desired subset to input 0, as it would be
    /// written.
    Subset {
        /// Which part.
        part: crate::sym::SubsetPart,
        /// As inequalities in the variable.
        inequalities: bool,
    },
    /// How equal inputs 0 and 1 are, from 0 to 1, as `opts` compares them
    /// (an answer's `matchPartial`, `unorderedCompare`,
    /// `matchByExactPositions`; ADR 0041, decision 7): 1 when equal, a
    /// fraction only with `partial`.
    Compare {
        /// How they compare.
        opts: crate::sym::CompareOpts,
    },
    /// Entry `k` (input 1) of the value input 0 holds, inside the math
    /// handle (ADR 0041, decision 2: a dynamic sequence with no cap): a
    /// list's, tuple's or vector's entry, a scalar's one entry its own;
    /// the missing value for an index that is no integer from 1 to the
    /// count. Its inverse writes input 0 with that entry replaced, its
    /// head kept.
    Entry,
    /// How many entries the value input 0 holds (`numDimensions`): a
    /// list's, tuple's or vector's, 1 for a scalar, a number (no handle)
    /// or the blank expression.
    Count,
    /// The local minima, the global minimum and the infimum of a function
    /// of one variable (input 0 its `xscale`, then its domain and pieces as
    /// [`SymKind::EvalFunction`] reads them), or its maxima, maximum and
    /// supremum when `max` (ADR 0061): the tuple of a list of points `(x,
    /// f(x))` and two points, each the empty list when there is none, as
    /// the current core's `utils/extrema.js` searches. A `piecewise` one's
    /// pieces are searched each on what of the domain is theirs.
    Extrema {
        /// The maxima.
        max: bool,
        /// What the pieces are.
        of: crate::sym::extrema::Pieces,
    },
    /// The points of the lists in inputs 0 and 1 in order of their
    /// locations: a function's minima and maxima as its extrema (ADR 0061).
    MergeExtrema,
    /// The pieces of the spline through `n` given points (ADR 0061): input
    /// 0 the `xscale`, 1 the `yscale`, 2 the variable's math cell, then
    /// [`INTERPOLATE_POINT_CELLS`] per point (its kind and which of its
    /// coordinates and slope are given, then its `x`, `y` and slope).
    /// Writes the pieces as one value (a list of tuples, for a reader),
    /// then five cells per piece, as many as `3 n + 1`: its expression and
    /// its domain, the rest left out.
    Interpolate {
        /// How many points are given.
        n: u8,
    },
    // A matrix input's grid (ADR 0045, ADR 0041 decision 8).
    /// The matrix of input 0 rows by input 1 columns whose entries, by
    /// row, are inputs 2.. (a math cell each, NaN the blank): a matrix
    /// input's value, made by the build over the boxes it stamped. The
    /// blank expression when they do not fill it.
    Grid,
    /// How many rows (or, with `cols`, columns) input 0 has, read as a
    /// matrix input reads a value: a matrix's, a tuple's or vector's as a
    /// column, a transposed one's as a row, else 1 by 1. Its inverse
    /// writes input 0 resized ([`Engine::resize_matrix`](crate::sym::Engine::resize_matrix)).
    MatrixSize {
        /// Columns rather than rows.
        cols: bool,
    },
    // A list over a math value (ADR 0063).
    /// Entry `k` (input 1) of the value input 0 holds, read as a list's
    /// entries: a list's item, else the value itself as entry 1 (a tuple
    /// is one point, one math); the missing value for an index that is no
    /// integer from 1 to the count. Its inverse writes input 0 with that
    /// entry replaced.
    ListItem,
    /// How many entries the value input 0 holds, read as a list's: a
    /// list's items, else 1; 0 for the missing value.
    ListCount,
    // A text answer (ADR 0067).
    /// 1 when the texts of inputs 0 and 1 (string ids) are equal as the
    /// current core compares an answer's texts, else 0: each trimmed and
    /// its first run of white space made one space, then, when
    /// `case_insensitive`, lower-cased. A missing or NaN input reads as
    /// the empty text. Reads the strings and makes none.
    TextEquals {
        /// Compare without regard to case.
        case_insensitive: bool,
    },
    /// The number the text of input 0 (a string id) writes, trimmed (`88`
    /// is 88), else NaN: a text among a `<summaryStatistics>`' operands,
    /// data only when it reads as a number (ADR 0067). Reads the strings
    /// and makes none.
    TextNumber,
}

/// How many cells a given point takes in [`SymKind::Interpolate`]'s inputs.
pub const INTERPOLATE_POINT_CELLS: usize = 4;

/// How many cells a point takes in [`SymKind::SampleBezier`]'s inputs.
pub const BEZIER_POINT_CELLS: usize = 7;

/// How many cells a domain takes in [`SymKind::EvalFunction`]'s inputs.
pub const DOMAIN_CELLS: usize = 4;
/// How many cells a piece takes in [`SymKind::EvalFunction`]'s inputs.
pub const PIECE_CELLS: usize = 6;

/// Whether `x` lies in the domain `d` (lower, upper, lower closed, upper
/// closed), as the JavaScript core's `find_effective_domain` reads one: an
/// endpoint that is no number is no bound, and an infinite end holds
/// every number on its side. A `piece`'s domain with an endpoint that is
/// no number holds nothing, as the current core leaves such a piece out
/// of a `<piecewiseFunction>`.
pub fn in_domain(x: f64, d: &[f64], piece: bool) -> bool {
    let (lo, hi, lo_closed, hi_closed) = (d[0], d[1], d[2], d[3]);
    if piece && (lo.is_nan() || hi.is_nan()) {
        return false;
    }
    let above = lo.is_nan() || x > lo || (x == lo && (lo_closed != 0.0 || lo == f64::NEG_INFINITY));
    let below = hi.is_nan() || x < hi || (x == hi && (hi_closed != 0.0 || hi == f64::INFINITY));
    !x.is_nan() && above && below
}

/// What a `<math>`, or an operator over math (ADR 0043), does to its
/// expression after instantiating it.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Post {
    /// Nothing: the expression as instantiated.
    None,
    /// The engine's simplify.
    Simplify,
    /// The engine's expand.
    Expand,
    /// Simplified, then expanded (a `<boolean simplifyOnCompare
    /// expandOnCompare>`): the engine's expand does not simplify first.
    SimplifyExpand,
    /// Its absolute value: a number when it evaluates to one, else
    /// `abs(..)` (`<abs>`).
    Abs,
    /// Its sign, likewise (`<sign>`).
    Sign,
    /// Rounded down, likewise, a value within roundoff of an integer
    /// taken as it (`<floor>`).
    Floor,
    /// Rounded up, likewise (`<ceil>`).
    Ceil,
    /// Every number in it rounded to this many decimal places (`<round>`).
    RoundDecimals(i32),
    /// Every number in it rounded to this many significant digits.
    RoundDigits(i32),
    /// Every number in it of magnitude below the threshold, these bits of
    /// an `f64`, made 0 (`<setSmallToZero>`).
    SmallToZero(u64),
    /// The reduction `op` of its entries, read as a list's (ADR 0063): an
    /// operator reading one math value whose entries are its operands
    /// (`<sum>$mi</sum>`), reduced inside the value; a variance's or a
    /// standard deviation's a `population`'s when the flag says, then
    /// simplified and expanded as the flags say.
    Reduce {
        /// The reduction.
        op: crate::program::Reduction,
        /// A population's variance, not a sample's.
        population: bool,
        /// Simplified after.
        simplify: bool,
        /// Expanded after.
        expand: bool,
    },
    /// How equal the two entries of the pair it is are, as the engine
    /// compares them with these options, as a number from 0 to 1: a
    /// comparison of two references the type pass found may be math
    /// (`$a = $b` in a condition; ADR 0041, decision 7).
    ComparePair(crate::sym::CompareOpts),
    /// Its tuples made vectors (`createVectors`), then its tuples and
    /// arrays of two made intervals (`createIntervals`; ADR 0041, decision
    /// 8), then simplified, then expanded, as the flags say: a `<math>`'s
    /// post when it creates vectors or intervals.
    Shapes {
        /// Tuples made vectors.
        vectors: bool,
        /// Tuples and arrays of two made intervals.
        intervals: bool,
        /// Simplified after.
        simplify: bool,
        /// Expanded after.
        expand: bool,
    },
    /// Its entries, a list by row, made a matrix of `rows` by `cols`
    /// (ADR 0041, decision 8), then simplified as the flag says: a
    /// `<matrix>`'s post.
    Matrix {
        /// How many rows.
        rows: u32,
        /// How many columns.
        cols: u32,
        /// Simplified after.
        simplify: bool,
    },
}

impl Post {
    /// `h` with this applied, by `engine`.
    pub fn apply(self, engine: &mut crate::sym::Engine, h: Handle) -> Handle {
        match self {
            Post::None => h,
            Post::Simplify => engine.simplify(h),
            Post::Expand => engine.expand(h),
            Post::SimplifyExpand => {
                let h = engine.simplify(h);
                engine.expand(h)
            }
            Post::Abs => engine.apply_numeric(h, "abs", f64::abs),
            Post::Sign => engine.apply_numeric(h, "sign", sign),
            Post::Floor => {
                engine.apply_numeric(h, "floor", |v| near_integer(v).unwrap_or(v.floor()))
            }
            Post::Ceil => engine.apply_numeric(h, "ceil", |v| near_integer(v).unwrap_or(v.ceil())),
            Post::RoundDecimals(n) => engine.round_decimals(h, n),
            Post::RoundDigits(n) => engine.round_digits(h, n),
            Post::SmallToZero(bits) => engine.small_to_zero(h, f64::from_bits(bits)),
            Post::ComparePair(opts) => engine.compare_pair(h, opts),
            Post::Shapes {
                vectors,
                intervals,
                simplify,
                expand,
            } => {
                let mut h = engine.normalize_shapes(h, vectors, intervals);
                if simplify {
                    h = engine.simplify(h);
                }
                if expand {
                    h = engine.expand(h);
                }
                h
            }
            Post::Matrix {
                rows,
                cols,
                simplify,
            } => {
                let h = engine.matrix(h, rows, cols);
                if simplify { engine.simplify(h) } else { h }
            }
            Post::Reduce {
                op,
                population,
                simplify,
                expand,
            } => {
                let mut h = engine.reduce_entries(h, op, population);
                if simplify {
                    h = engine.simplify(h);
                }
                if expand {
                    h = engine.expand(h);
                }
                h
            }
        }
    }

    /// A math's post with its tuples made vectors and its pairs made
    /// intervals first, as asked (`createVectors`, `createIntervals`); the
    /// same when neither is.
    pub fn with_shapes(self, vectors: bool, intervals: bool) -> Post {
        if !vectors && !intervals {
            return self;
        }
        let (simplify, expand) = match self {
            Post::Simplify => (true, false),
            Post::Expand => (false, true),
            Post::SimplifyExpand => (true, true),
            _ => (false, false),
        };
        Post::Shapes {
            vectors,
            intervals,
            simplify,
            expand,
        }
    }
}

/// -1, 0 or 1 by the sign of `v`, as JavaScript's `Math.sign`.
fn sign(v: f64) -> f64 {
    if v == 0.0 { 0.0 } else { v.signum() }
}

/// The integer `v` is within roundoff of (relative 1e-15), as the current
/// core's `<floor>` and `<ceil>` take one.
fn near_integer(v: f64) -> Option<f64> {
    let r = v.round();
    ((r - v).abs() < 1e-15 * v.abs()).then_some(r)
}

impl SymKind {
    /// How many cells it writes: [`SAMPLES`] for a sampler, else 1.
    pub fn n_out(self) -> usize {
        match self {
            SymKind::Sample
            | SymKind::SampleTape { .. }
            | SymKind::SampleQuadratic
            | SymKind::SampleFunction
            | SymKind::SampleBezier { .. } => SAMPLES,
            SymKind::Order { n, .. } => n as usize,
            SymKind::Interpolate { n } => {
                1 + crate::sym::interpolate::PIECE_OUT
                    * crate::sym::interpolate::max_pieces(n as usize)
            }
            _ => 1,
        }
    }

    /// The input positions its inverse may write: `Evaluate`'s expression;
    /// no other symbolic operator inverts.
    pub fn writes(self) -> u64 {
        match self {
            SymKind::Evaluate => 1,
            SymKind::Subset {
                part: crate::sym::SubsetPart::Value,
                ..
            } => 1,
            SymKind::Entry | SymKind::ListItem => 1,
            SymKind::MatrixSize { .. } => 1,
            // A `<matrix>` of its entries writes each (ADR 0060).
            SymKind::Instantiate {
                post: Post::Matrix { .. },
                ..
            } => u64::MAX,
            _ => 0,
        }
    }

    /// Whether the output is a string id (a text cell): a join's.
    pub fn makes_text(self) -> bool {
        matches!(self, SymKind::Join { .. } | SymKind::JoinWith { .. })
    }

    /// Whether it reads text inputs: a join, an order, a text equality.
    pub fn reads_text(self) -> bool {
        matches!(
            self,
            SymKind::Join { .. }
                | SymKind::JoinWith { .. }
                | SymKind::Order { .. }
                | SymKind::TextEquals { .. }
                | SymKind::TextNumber
        )
    }

    /// This kind told what its inputs hold (`types`, in order), when it
    /// reads text ([`SymKind::reads_text`]); else itself.
    pub fn typed(self, types: impl Iterator<Item = crate::program::ValueType>) -> SymKind {
        match self {
            SymKind::Join { n, booleans, .. } => SymKind::Join {
                n,
                kinds: crate::program::texts::kinds_of(types),
                booleans,
            },
            SymKind::Order { n, .. } => SymKind::Order {
                n,
                kinds: crate::program::texts::kinds_of(types),
            },
            SymKind::JoinWith { n, sep, .. } => SymKind::JoinWith {
                n,
                kinds: crate::program::texts::kinds_of(types),
                sep,
            },
            k => k,
        }
    }

    /// Whether the output is an expression handle (a math cell).
    pub fn makes_math(self) -> bool {
        matches!(
            self,
            SymKind::Instantiate { .. }
                | SymKind::Derivative
                | SymKind::ClampFunction
                | SymKind::WrapFunctionPeriodic
                | SymKind::DerivativeBy
                | SymKind::Subset { .. }
                | SymKind::Entry
                | SymKind::ListItem
                | SymKind::Extrema { .. }
                | SymKind::MergeExtrema
                | SymKind::Grid
        )
    }
}

crate::index::index_type! {
    /// A position in [`Program::tapes`](crate::program::Program::tapes): a compiled curve.
    pub struct TapeIdx;
}

crate::index::index_type! {
    /// A position in [`Program::instrs`](crate::program::Program::instrs): an instruction, by where it stands
    /// in the schedule. `NONE` is "no instruction" (an essential cell or a
    /// constant has no producer).
    pub struct InstrIdx;
}

crate::index::index_type! {
    /// A position in [`Program::operands`](crate::program::Program::operands), where a vector or symbolic
    /// instruction's input cells are parked: an index into that list, never
    /// into the cells.
    pub struct OperandIdx;
}

crate::index::index_type! {
    /// A position in a program's symbolic memo ([`SymState`](crate::program::SymState)), where a
    /// symbolic instruction keeps the input values it last ran on and its
    /// outputs.
    pub struct MemoIdx;
}

crate::index::index_type! {
    /// A position in [`Program::syms`](crate::program::Program::syms): a symbolic instruction's kind and
    /// memo.
    pub struct SymIdx;
}

/// A position in [`Program::vecs`](crate::program::Program::vecs), the program's distinct vector operators. A
/// `u16`, so that [`Op::Vec`] fits an instruction of 16 bytes.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct VecIdx(u16);

impl VecIdx {
    /// The position, as a `usize`.
    pub fn index(self) -> usize {
        self.0 as usize
    }
}

/// What a symbolic instruction runs: its kind, and where its memo starts
/// (the `n + n_out` entries it keeps in [`SymState`](crate::program::SymState)).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct SymEntry {
    /// What it computes.
    pub kind: SymKind,
    /// Where its memo entries start.
    pub memo: MemoIdx,
}

/// What a build parks for the operators it binds: the operand list a program
/// keeps, the symbolic instructions' kinds and the distinct vector operators,
/// which an [`Op`] names by index, and how much of the symbolic memo its
/// instructions take.
#[derive(Debug, Clone, Default)]
pub struct Operands {
    /// The input cells of every vector and symbolic instruction, each run
    /// contiguous; an [`OperandIdx`] points into it.
    pub cells: Vec<CellIdx>,
    /// The symbolic instructions, by [`SymIdx`].
    pub syms: Vec<SymEntry>,
    /// The distinct vector operators, by [`VecIdx`].
    pub vecs: Vec<VecOp>,
    vec_ids: std::collections::HashMap<VecOp, VecIdx>,
    /// How many memo entries the symbolic instructions take in all.
    pub memo_len: usize,
}

impl Operands {
    /// `op`'s position in `vecs`, added if new.
    fn intern(&mut self, op: VecOp) -> VecIdx {
        let n = self.vecs.len();
        *self.vec_ids.entry(op).or_insert_with(|| {
            self.vecs.push(op);
            VecIdx(u16::try_from(n).expect("more distinct vector operators than a u16 holds"))
        })
    }
}

/// One instruction: the cell it writes and the operator that computes it.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Instr {
    /// The cell it writes; with several outputs, the first of their run.
    pub out: CellIdx,
    /// The operator, bound to its inputs.
    pub op: Op,
}

// Four instructions to a cache line: what the tick walks. A variant that
// needs more goes in a program table (`Operands`), as `Vec` and `Sym` do.
const _: () = assert!(std::mem::size_of::<Instr>() == 16);

impl OpSpec {
    /// How many inputs the operator reads; `usize::MAX` for one that takes
    /// any number (`accepts`).
    pub const fn arity(&self) -> usize {
        if let Some(n) = self.scalar_arity() {
            return n;
        }
        match self {
            OpSpec::Vec(v) => v.n_in(),
            OpSpec::Sym(
                SymKind::Instantiate { .. }
                | SymKind::InstantiateBlank { .. }
                | SymKind::SampleTape { .. },
            ) => usize::MAX,
            OpSpec::Sym(
                SymKind::Evaluate | SymKind::Derivative | SymKind::Count | SymKind::ListCount,
            ) => 1,
            OpSpec::Sym(SymKind::EvalAt | SymKind::Equals | SymKind::EqualsSyntax) => 2,
            OpSpec::Sym(
                SymKind::Sample | SymKind::ClampFunction | SymKind::WrapFunctionPeriodic,
            ) => 3,
            OpSpec::Sym(SymKind::SampleQuadratic) => 5,
            OpSpec::Sym(
                SymKind::Join { n, .. } | SymKind::JoinWith { n, .. } | SymKind::Order { n, .. },
            ) => *n as usize,
            OpSpec::Sym(
                SymKind::EvalFunction | SymKind::SampleFunction | SymKind::SampleBezier { .. },
            ) => usize::MAX,
            OpSpec::Sym(
                SymKind::DerivativeBy
                | SymKind::Subset { .. }
                | SymKind::Compare { .. }
                | SymKind::Entry
                | SymKind::ListItem,
            ) => 2,
            OpSpec::Sym(SymKind::Extrema { .. }) => usize::MAX,
            OpSpec::Sym(SymKind::MergeExtrema) => 2,
            OpSpec::Sym(SymKind::Interpolate { n }) => 3 + INTERPOLATE_POINT_CELLS * *n as usize,
            OpSpec::Sym(SymKind::Grid) => usize::MAX,
            OpSpec::Sym(SymKind::MatrixSize { .. }) => 1,
            OpSpec::Sym(SymKind::TextEquals { .. }) => 2,
            OpSpec::Sym(SymKind::TextNumber) => 1,
            _ => unreachable!(),
        }
    }

    /// Whether the operator can read `n` inputs: its arity, or any number
    /// for a template's leaves.
    pub const fn accepts(&self, n: usize) -> bool {
        match self {
            OpSpec::Sym(
                SymKind::Instantiate { .. }
                | SymKind::InstantiateBlank { .. }
                | SymKind::SampleTape { .. },
            ) => true,
            // A domain and at least one piece, after the input or range.
            OpSpec::Sym(SymKind::EvalFunction) => {
                n > 1 + DOMAIN_CELLS && (n - 1 - DOMAIN_CELLS).is_multiple_of(PIECE_CELLS)
            }
            OpSpec::Sym(SymKind::SampleFunction) => {
                n > 2 + DOMAIN_CELLS && (n - 2 - DOMAIN_CELLS).is_multiple_of(PIECE_CELLS)
            }
            OpSpec::Sym(SymKind::SampleBezier { .. }) => {
                n > 1 && (n - 1).is_multiple_of(BEZIER_POINT_CELLS)
            }
            // The `xscale`, the domain and any number of pieces.
            OpSpec::Sym(SymKind::Extrema { .. }) => {
                n > DOMAIN_CELLS && (n - 1 - DOMAIN_CELLS).is_multiple_of(PIECE_CELLS)
            }
            // Its size, then any number of entries.
            OpSpec::Sym(SymKind::Grid) => n >= 2,
            _ => self.arity() == n,
        }
    }

    /// How many cells the operator writes.
    pub fn n_out(&self) -> usize {
        match self {
            OpSpec::Vec(v) => v.n_out(),
            OpSpec::Sym(k) => k.n_out(),
            _ => 1,
        }
    }

    /// Bind to input cells. Vector and symbolic operators park their inputs
    /// in `operands`; a symbolic one also reserves a memo entry for each
    /// input and each output.
    pub fn bind(&self, inputs: &[CellIdx], operands: &mut Operands) -> Op {
        // The compile checks every planned operator (`compile::check_arity`);
        // one the build makes with the wrong count is a core bug, stopped
        // here with its name rather than at an index out of bounds.
        assert!(
            self.accepts(inputs.len()),
            "{self:?} bound to {} inputs",
            inputs.len()
        );
        let park = |operands: &mut Operands, leaves: &[CellIdx]| {
            let start = OperandIdx::new(operands.cells.len() as u32);
            operands.cells.extend_from_slice(leaves);
            (start, leaves.len() as u8)
        };
        match *self {
            OpSpec::Sym(kind) => {
                let (start, n) = park(operands, inputs);
                let memo = MemoIdx::new(operands.memo_len as u32);
                operands.memo_len += n as usize + kind.n_out();
                let sym = SymIdx::from_index(operands.syms.len());
                operands.syms.push(SymEntry { kind, memo });
                Op::Sym(n, kind.n_out() as u8, sym, start)
            }
            OpSpec::Vec(v) => {
                let (start, n) = park(operands, inputs);
                Op::Vec(n, v.n_out() as u8, operands.intern(v), start)
            }
            _ => self.bind_scalar(inputs),
        }
    }
}

#[cfg(test)]
mod arity {
    use super::*;
    use crate::program::vector::{PairBy, Reflex, RegularBy, RigidOpts, VecOp};

    /// Every operator: the scalar ones, then every vector and symbolic one.
    fn every() -> Vec<OpSpec> {
        let mut ops = OpSpec::scalars();
        ops.extend([
            OpSpec::Vec(VecOp::Shape {
                n: 3,
                opts: RigidOpts::RIGID,
            }),
            OpSpec::Vec(VecOp::CircleCenterPoint),
            OpSpec::Vec(VecOp::CirclePoints { n: 3 }),
            OpSpec::Vec(VecOp::CircleTwoPointsRadius),
            OpSpec::Vec(VecOp::PolarSlope),
            OpSpec::Vec(VecOp::PolarDirection {
                perpendicular: true,
            }),
            OpSpec::Vec(VecOp::LinePointsFromCoeffs),
            OpSpec::Vec(VecOp::ProjectCircle),
            OpSpec::Vec(VecOp::ProjectLine),
            OpSpec::Vec(VecOp::First { n: 3 }),
            OpSpec::Vec(VecOp::Choose { n: 3 }),
            OpSpec::Vec(VecOp::WeightedMean { n: 3 }),
            OpSpec::Vec(VecOp::Clamp),
            OpSpec::Vec(VecOp::Centroid { n: 3 }),
            OpSpec::Vec(VecOp::SequencePick { n_exclude: 1 }),
            OpSpec::Vec(VecOp::Reduce {
                op: crate::program::Reduction::Sum,
                n: 3,
            }),
            OpSpec::Vec(VecOp::Wrap),
            OpSpec::Vec(VecOp::Pair { by: PairBy::Offset }),
            OpSpec::Vec(VecOp::Extent),
            OpSpec::Vec(VecOp::AngleAt {
                reflex: Reflex::Allowed,
            }),
            OpSpec::Vec(VecOp::RegularPolygon {
                n: 3,
                by: RegularBy::CenterVertex,
            }),
            OpSpec::Vec(VecOp::Scan {
                op: crate::program::Scan::Sum,
                n: 3,
            }),
            OpSpec::Vec(VecOp::Sort {
                n: 3,
                decreasing: true,
            }),
            OpSpec::Vec(VecOp::Shuffle { n: 3 }),
            OpSpec::Vec(VecOp::Draws {
                dist: crate::program::Dist::Uniform,
                n: 2,
                n_exclude: 0,
            }),
            OpSpec::Vec(VecOp::BestFitLine { n: 3 }),
            OpSpec::Vec(VecOp::Intersect {
                a: crate::program::Figure::Line { segment: true },
                b: crate::program::Figure::Circle,
            }),
            OpSpec::Vec(VecOp::Parabola {
                through: 2,
                vertex: false,
            }),
            OpSpec::Sym(SymKind::Instantiate {
                template: Handle::new(0),
                post: Post::None,
            }),
            OpSpec::Sym(SymKind::InstantiateBlank {
                template: Handle::new(0),
                post: Post::None,
            }),
            OpSpec::Sym(SymKind::Evaluate),
            OpSpec::Sym(SymKind::EvalAt),
            OpSpec::Sym(SymKind::Derivative),
            OpSpec::Sym(SymKind::Equals),
            OpSpec::Sym(SymKind::EqualsSyntax),
            OpSpec::Sym(SymKind::Sample),
            OpSpec::Sym(SymKind::SampleTape {
                tape: TapeIdx::new(0),
            }),
            OpSpec::Sym(SymKind::ClampFunction),
            OpSpec::Sym(SymKind::WrapFunctionPeriodic),
            OpSpec::Sym(SymKind::SampleQuadratic),
            OpSpec::Sym(SymKind::Join {
                n: 3,
                kinds: 0,
                booleans: false,
            }),
            OpSpec::Sym(SymKind::Order { n: 3, kinds: 0 }),
            OpSpec::Sym(SymKind::EvalFunction),
            OpSpec::Sym(SymKind::SampleFunction),
            OpSpec::Sym(SymKind::DerivativeBy),
            OpSpec::Sym(SymKind::SampleBezier {
                coord: 1,
                uniform: false,
            }),
            OpSpec::Vec(VecOp::IntoDomain),
            OpSpec::Vec(VecOp::DomainRange),
            OpSpec::Vec(VecOp::DomainHull { n: 2 }),
            OpSpec::Sym(SymKind::Subset {
                part: crate::sym::SubsetPart::Value,
                inequalities: false,
            }),
            OpSpec::Sym(SymKind::Compare {
                opts: crate::sym::CompareOpts::default(),
            }),
            OpSpec::Vec(VecOp::SequenceParams { given: 0b0110 }),
            OpSpec::Vec(VecOp::SequenceCount { n_exclude: 1 }),
            OpSpec::Vec(VecOp::SequenceEntry { n_exclude: 1 }),
            OpSpec::Sym(SymKind::Entry),
            OpSpec::Sym(SymKind::Count),
            OpSpec::Sym(SymKind::JoinWith {
                n: 3,
                kinds: 0,
                sep: crate::program::texts::Sep::Dot,
            }),
            OpSpec::Vec(VecOp::Moments {
                dist: crate::program::Dist::Uniform,
                n_exclude: 0,
            }),
            OpSpec::Sym(SymKind::Extrema {
                max: true,
                of: crate::sym::extrema::Pieces::One,
            }),
            OpSpec::Sym(SymKind::MergeExtrema),
            OpSpec::Sym(SymKind::Interpolate { n: 2 }),
            OpSpec::Sym(SymKind::Grid),
            OpSpec::Sym(SymKind::MatrixSize { cols: true }),
            OpSpec::Sym(SymKind::ListItem),
            OpSpec::Sym(SymKind::ListCount),
            OpSpec::Sym(SymKind::TextEquals {
                case_insensitive: false,
            }),
            OpSpec::Sym(SymKind::TextNumber),
        ]);
        ops
    }

    /// A number per vector and symbolic operator.
    fn tag(op: &OpSpec) -> Option<usize> {
        Some(match op {
            OpSpec::Vec(v) => match v {
                VecOp::Shape { .. } => 0,
                VecOp::CircleCenterPoint => 1,
                VecOp::CirclePoints { .. } => 2,
                VecOp::CircleTwoPointsRadius => 3,
                VecOp::PolarSlope => 4,
                VecOp::PolarDirection { .. } => 5,
                VecOp::LinePointsFromCoeffs => 6,
                VecOp::ProjectCircle => 7,
                VecOp::ProjectLine => 8,
                VecOp::First { .. } => 9,
                VecOp::Choose { .. } => 10,
                VecOp::WeightedMean { .. } => 11,
                VecOp::Clamp => 12,
                VecOp::Centroid { .. } => 13,
                VecOp::SequencePick { .. } => 14,
                VecOp::Reduce { .. } => 15,
                VecOp::Wrap => 16,
                VecOp::Pair { .. } => 17,
                VecOp::Extent => 18,
                VecOp::AngleAt { .. } => 19,
                VecOp::RegularPolygon { .. } => 20,
                VecOp::Scan { .. } => 21,
                VecOp::Sort { .. } => 22,
                VecOp::Shuffle { .. } => 23,
                VecOp::Draws { .. } => 24,
                VecOp::BestFitLine { .. } => 25,
                VecOp::Intersect { .. } => 26,
                VecOp::Parabola { .. } => 27,
                VecOp::IntoDomain => 44,
                VecOp::DomainRange => 45,
                VecOp::DomainHull { .. } => 46,
                // After the symbolic operators 47 to 50.
                VecOp::SequenceParams { .. } => 51,
                VecOp::SequenceCount { .. } => 52,
                VecOp::SequenceEntry { .. } => 53,
                // After the symbolic operators 54 and 55.
                VecOp::Moments { .. } => 57,
            },
            OpSpec::Sym(k) => {
                28 + match k {
                    SymKind::Instantiate { .. } => 0,
                    SymKind::Evaluate => 1,
                    SymKind::EvalAt => 2,
                    SymKind::Derivative => 3,
                    SymKind::Equals => 4,
                    SymKind::EqualsSyntax => 5,
                    SymKind::Sample => 6,
                    SymKind::SampleTape { .. } => 7,
                    SymKind::ClampFunction => 8,
                    SymKind::WrapFunctionPeriodic => 9,
                    SymKind::SampleQuadratic => 10,
                    SymKind::InstantiateBlank { .. } => 11,
                    SymKind::EvalFunction => 12,
                    SymKind::SampleFunction => 13,
                    SymKind::DerivativeBy => 14,
                    SymKind::SampleBezier { .. } => 15,
                    // After the vector operators 44 to 46.
                    SymKind::Join { .. } => 19,
                    SymKind::Order { .. } => 20,
                    SymKind::Subset { .. } => 21,
                    SymKind::Compare { .. } => 22,
                    // After the vector operators 51 to 53.
                    SymKind::Entry => 26,
                    SymKind::Count => 27,
                    SymKind::JoinWith { .. } => 28,
                    // 29 would be vector tag 57 (Moments).
                    SymKind::Extrema { .. } => 30,
                    SymKind::MergeExtrema => 31,
                    SymKind::Interpolate { .. } => 32,
                    SymKind::Grid => 33,
                    SymKind::MatrixSize { .. } => 34,
                    SymKind::ListItem => 35,
                    SymKind::ListCount => 36,
                    SymKind::TextEquals { .. } => 37,
                    SymKind::TextNumber => 38,
                }
            }
            _ => return None,
        })
    }
    const N_TAGS: usize = 67;

    // Each operator binds, evaluates and inverts at the arity it declares,
    // so an arity group that disagrees with the operator's arms (an input
    // read past the declared count) fails here, not in a document.
    #[test]
    fn every_operator_works_at_its_arity() {
        let ops = every();
        let mut tags: Vec<usize> = ops.iter().filter_map(tag).collect();
        tags.sort();
        tags.dedup();
        assert_eq!(
            tags,
            (0..N_TAGS).collect::<Vec<_>>(),
            "`every` misses an operator"
        );
        for spec in ops {
            let n = match spec {
                OpSpec::Sym(SymKind::EvalFunction) => 1 + DOMAIN_CELLS + PIECE_CELLS,
                OpSpec::Sym(SymKind::SampleFunction) => 2 + DOMAIN_CELLS + PIECE_CELLS,
                OpSpec::Sym(SymKind::SampleBezier { .. }) => 1 + 2 * BEZIER_POINT_CELLS,
                OpSpec::Sym(SymKind::Extrema { .. }) => 1 + DOMAIN_CELLS + PIECE_CELLS,
                _ if spec.arity() == usize::MAX => 2,
                _ => spec.arity(),
            };
            assert!(spec.accepts(n));
            let inputs: Vec<CellIdx> = CellIdx::below(n).collect();
            let mut operands = Operands::default();
            let op = spec.bind(&inputs, &mut operands);
            let cells: Vec<f64> = (0..n).map(|i| 1.0 + i as f64).collect();
            match spec {
                OpSpec::Vec(v) => {
                    let mut out = vec![0.0; v.n_out()];
                    v.eval(&cells, &mut out);
                }
                // Evaluated through the engine (`tests/symbolic.rs`).
                OpSpec::Sym(_) => {}
                _ => {
                    op.eval(&cells);
                    op.invert(&cells, 1.5);
                }
            }
            if spec.arity() != usize::MAX {
                assert!(!spec.accepts(n + 1), "{spec:?}");
            }
        }
    }
}

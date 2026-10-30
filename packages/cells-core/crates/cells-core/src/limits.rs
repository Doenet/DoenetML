//! Every size the core caps, in one place. Counts of an operator's inputs
//! and outputs are stored in a byte (`Op::Vec`, `Op::Sym`, `BuiltSource::Op`),
//! and a vector operator's inputs are copied into a fixed array
//! (`MAX_VEC_IN`), so each cap that feeds one is asserted below to fit:
//! raising a cap past what a byte or that array holds fails to compile.
//! Each cap is checked against the source where it is written (a polygon's
//! vertices, a choice's cases); the build counts within them, through
//! `byte`, which names a broken invariant instead of wrapping.

/// The most inputs one vector operator reads.
pub const MAX_VEC_IN: usize = 64;

/// The most vertices of a polygon: two slots each, and an element's slots
/// are numbered by a byte (`Arg::Own`), with room left for its hidden
/// slots.
pub const MAX_VERTICES: usize = 100;

/// The most vertices of a rigid polygon (`VecOp::Shape` reads two per
/// vertex, a pivot point and the least it may shrink).
pub const MAX_RIGID_VERTICES: usize = (MAX_VEC_IN - 3) / 2;

/// The most entries of a tuple.
pub const MAX_TUPLE: usize = 8;

/// The most choices of a `<choiceInput>` an answer chooses among
/// (`VecOp::Choose` reads the index and one credit per choice).
pub const MAX_CHOICES: usize = MAX_VEC_IN - 1;

/// The most cases of a `<conditionalContent>` (`VecOp::First` reads one
/// condition per case, `VecOp::Choose` the choice and one cell per case).
pub const MAX_CASES: usize = MAX_VEC_IN - 1;

/// How many (credit, weight) pairs one `VecOp::WeightedMean` averages; a
/// longer list is averaged in chunks.
pub const SCORE_CHUNK: usize = MAX_VEC_IN / 2;

/// The most distinct references in one math template (its leaves).
pub const MAX_REFERENCES: usize = u8::MAX as usize;

const _: () = {
    let byte = u8::MAX as usize;
    assert!(MAX_VEC_IN <= byte);
    assert!(
        2 * MAX_RIGID_VERTICES + 2 <= MAX_VEC_IN,
        "a polygon's shape"
    );
    assert!(1 + 2 * MAX_VERTICES + 16 <= byte, "a polygon's slots");
    // `Choose` reads one cell more than it chooses among.
    assert!(MAX_CHOICES < MAX_VEC_IN, "an answer's choices");
    assert!(MAX_CASES < MAX_VEC_IN, "a conditionalContent's cases");
    assert!(2 * SCORE_CHUNK <= MAX_VEC_IN, "a chunk of scores");
    assert!(MAX_REFERENCES <= byte);
};

/// `n` as the byte the core stores a count in. Every count the build makes
/// is within a cap above; one that is not is a core bug, named here.
#[track_caller]
pub(crate) fn byte(n: usize) -> u8 {
    u8::try_from(n).unwrap_or_else(|_| panic!("a count of {n} where the core holds at most 255"))
}

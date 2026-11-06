//! Every size the core caps, in one place. Operator input and output counts
//! are stored in a byte and a vector operator's inputs in a fixed array of
//! [`MAX_VEC_IN`], so each cap that feeds one is asserted at compile time
//! to fit.

/// The most inputs one vector operator reads.
pub const MAX_VEC_IN: usize = 64;

/// The most vertices of a polygon.
pub const MAX_VERTICES: usize = 100;

/// The most vertices of a rigid polygon.
pub const MAX_RIGID_VERTICES: usize = (MAX_VEC_IN - 3) / 2;

/// The most entries of a tuple.
pub const MAX_TUPLE: usize = 8;

/// The most choices of a `<choiceInput>` an answer chooses among.
pub(crate) const MAX_CHOICES: usize = MAX_VEC_IN - 1;

/// The most cases of a `<conditionalContent>`.
pub(crate) const MAX_CASES: usize = MAX_VEC_IN - 1;

/// How many (credit, weight) pairs one weighted-mean operator averages; a
/// longer list is averaged in chunks.
pub(crate) const SCORE_CHUNK: usize = MAX_VEC_IN / 2;

/// The most distinct references in one math template (its leaves).
pub(crate) const MAX_REFERENCES: usize = u8::MAX as usize;

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

/// `n` as the byte the core stores a count in. Panics if `n` exceeds a
/// byte, which is a core bug.
#[track_caller]
pub(crate) fn byte(n: usize) -> u8 {
    u8::try_from(n).unwrap_or_else(|_| panic!("a count of {n} where the core holds at most 255"))
}

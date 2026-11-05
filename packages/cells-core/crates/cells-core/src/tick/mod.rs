//! A tick at run time: requests are snapped for sticky groups, inverted down
//! to essential cells, and the derived cells downstream recomputed. A tick
//! only reads the scheduled [`Program`](crate::program::Program) and writes
//! cells.

use crate::document::CellIdx;

pub mod eval;
pub mod invert;
pub mod snap;

/// A renderer's ask to change one cell to a value.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Request {
    pub cell: CellIdx,
    pub value: f64,
}

/// What one tick changed.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct TickOutcome {
    /// Cells whose value changed, essential ones first in request order,
    /// then derived ones in schedule order. No duplicates within each part.
    pub changed: Vec<CellIdx>,
    /// Requests that were dropped because an inverse was undefined or the
    /// request landed on a constant.
    pub dropped: Vec<Request>,
    /// The tick changed a structural cell and the document was rebuilt:
    /// cell indices and the component table are new, `changed` is empty.
    pub rebuilt: bool,
    /// The rebuild failed: the tick's writes were undone, so the document
    /// is as it was before the tick, `changed` is empty and `dropped`
    /// holds every request of the tick.
    pub rebuild_error: Option<String>,
    /// How many build passes the rebuild took to settle; 0 without one.
    pub rebuild_passes: u32,
}

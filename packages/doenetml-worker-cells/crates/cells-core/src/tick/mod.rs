//! A tick at run time: requests are snapped (`snap.rs`, for sticky groups),
//! inverted down to essential cells (`invert.rs`), and the derived cells
//! downstream recomputed (`eval.rs`). The build is not involved; a tick only
//! reads the scheduled [`Program`](crate::program::Program) and writes cells.
//!
//! The entry point is [`Document::request`](crate::Document::request) and
//! its variants (`document/request.rs`), which run these stages in order and
//! return a [`TickOutcome`]. The sticky pre-pass lives beside them in
//! `document/sticky.rs` because it reads the component table.

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
    /// request landed on a fixed cell.
    pub dropped: Vec<Request>,
    /// The tick changed a structural cell and the document was rebuilt:
    /// cell indices and the component table are new, `changed` is empty.
    pub rebuilt: bool,
    /// The rebuild failed and the document is unchanged from before it.
    pub rebuild_error: Option<String>,
}

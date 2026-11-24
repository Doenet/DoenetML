//! What a drag of a shape may move (ADR 0064): its `draggable`, and the
//! flag of its parts (`verticesDraggable`, `endpointsDraggable`), each a
//! 0/1 cell the renderer reads and the bridge checks before it turns a
//! drag into requests. Nothing in the core holds by them: an input bound
//! to a shape still writes it, as in the current core, where only the
//! move actions read them.

use crate::compile::api::*;

/// The two flags' wires: `draggable` as given, true by default; the
/// parts' flag as given, else an alias of `draggable_port`, so the parts
/// follow the shape, as the current core defaults them.
pub(super) fn flags(
    draggable: Source,
    draggable_attr: Attr,
    parts: Option<Source>,
    parts_attr: Attr,
    draggable_port: Port,
) -> [Wire; 2] {
    [
        Wire::scalar(draggable, GivenId::Attr(draggable_attr, 0)),
        Wire::attr(parts_attr, parts).unwrap_or_else(|| Wire::own(draggable_port)),
    ]
}

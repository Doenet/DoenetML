//! Component specs (ADR 0016, `testing::spec`): one module per component,
//! each a `spec!` of what an author sees, laid out as `src/components/` is
//! (`geometry/circle.rs` is the spec of `components/geometry/circle.rs`; a
//! type defined in its family's `mod.rs`, such as the slider, has a file of
//! its own here). Their cost snapshots are in `snapshots/`, by component.

mod geometry {
    mod circle;
    mod line;
    mod polygon;
    mod segment;
}

mod inputs {
    mod slider;
}

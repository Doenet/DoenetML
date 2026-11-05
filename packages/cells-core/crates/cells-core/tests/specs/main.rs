//! Component specs: one module per component, each a `spec!` of what an
//! author sees, laid out as `src/components/` is. Cost snapshots are in
//! `snapshots/`, by component.

mod geometry {
    mod circle;
    mod line;
    mod polygon;
    mod segment;
    mod triangle;
}

mod inputs {
    mod slider;
}

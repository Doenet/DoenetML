//! The compile's stages, one module each (ADR 0027). Each is a function of
//! what the stages before it made (ADR 0030) and writes a table of its own
//! (ADR 0031); each module exposes one entry function to the driver, and
//! what its view of the tables is stays inside it. In the order they run:
//!
//! - [`lint`]: findings from the DAST alone, before anything is compiled;
//! - [`outline`]: every element, template and name; plans nothing;
//! - [`parse`]: every `<math>`'s text parsed once, and every element's
//!   record;
//! - [`plan`]: every element's plans, each by its type's planner;
//! - [`link`]: readers of boxes boxed to a fixpoint, shared state tied;
//! - [`seal`]: choice interfaces, arity, keys, slot offsets and port types;
//! - [`share`]: equal derived ports made one;
//! - [`check`]: the template graph stamped, checked, defined and walked.

pub(super) mod check;
pub(super) mod link;
pub mod lint;
pub(super) mod outline;
pub(super) mod parse;
pub(super) mod plan;
pub(super) mod seal;
pub(super) mod share;

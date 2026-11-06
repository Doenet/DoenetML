//! Reading the source, which several stages run (ADR 0031, "Code more than
//! one stage runs"): the methods of [`Reader`], the source and what
//! outlining settled, read-only, writing only the [`Arenas`] they are
//! handed. In reading order:
//!
//! - [`reader`]: [`Reader`] and [`Arenas`] themselves;
//! - [`source`]: an element's literal attributes and its children;
//! - [`values`]: a value planned from its source text;
//! - [`maths`]: math text, tokenized, its `$ref`s planned, parsed;
//! - [`points`]: a point-list attribute's points;
//! - [`refs`]: reference plans, a name looked up through the template
//!   scopes and a `$a.b[k].c` path;
//! - [`rebase`]: a record read from another template, through a path;
//! - [`answer`]: what outlining and planning read of an `<answer>`.
//!
//! An element's record, which parsing reads with them, is
//! [`record`](super::ir::record), beside the type it makes.

mod answer;
mod maths;
mod points;
mod reader;
mod rebase;
mod refs;
mod source;
mod values;

pub(in crate::compile) use answer::AwardForm;
pub(in crate::compile) use reader::{Arenas, Reader};
pub(in crate::compile) use rebase::Rebaser;
pub(in crate::compile) use refs::record_read;
pub(in crate::compile) use values::literal_value;

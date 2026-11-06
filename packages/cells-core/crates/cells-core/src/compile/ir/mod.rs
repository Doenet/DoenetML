//! The compile's IR (ADR 0032, "the closed IR"): what its stages write and
//! the stages after them and the build read. In reading order:
//!
//! - [`template`]: a template, one per document, repeat body and choice
//!   branch, and each stage's table of its elements;
//! - [`source`]: where a port's value comes from, and what holds an element;
//! - [`refs`]: reference plans, paths through the template nesting;
//! - [`choice`]: a choice's branches and interface;
//! - [`port`]: ports, their types and what the check finds of each;
//! - [`wiring`]: how a planner wires an element's ports;
//! - [`math`]: math text, tokenized, parsed, and kept for the symbolic
//!   engine;
//! - [`settled`]: what outlining hands the stages after it;
//! - [`planned`]: what planning hands linking, sealing and sharing;
//! - [`compiled`]: the compile's output, which every build stamps;
//! - [`record`]: an element's record, which its planner reads;
//! - [`expr`]: the parse arena, math as expressions over plan ids;
//! - [`names`]: the name table;
//! - [`boxes`]: boxing's table.

pub(in crate::compile) mod boxes;
mod choice;
mod compiled;
pub(crate) mod expr;
mod math;
pub(in crate::compile) mod names;
mod planned;
mod port;
pub(crate) mod record;
mod refs;
mod settled;
mod source;
mod template;
mod wiring;

pub(crate) use crate::build::TemplateSlot;
pub(crate) use choice::*;
pub use compiled::Compiled;
pub(crate) use compiled::*;
pub(crate) use math::*;
pub(crate) use names::NameId;
pub(in crate::compile) use planned::*;
pub(crate) use port::*;
pub(crate) use refs::*;
pub(in crate::compile) use settled::*;
pub(crate) use source::*;
pub(crate) use template::*;
pub(crate) use wiring::*;

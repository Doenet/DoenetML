//! # DocumentStructure
//!
//! This module holds information about the structure of the document: the components, props,
//! and the (structural) relations to each other.

mod ancestor_iterator;
#[allow(clippy::module_inception)]
mod document_structure;

pub use document_structure::*;

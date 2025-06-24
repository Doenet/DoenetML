//! # DAST (Doenet Abstract Syntax Tree)
//!
//! The Doenet Abstract Syntax Tree (DAST) is a representation of a DoenetML document as a tree of nodes.
//! It represents a document structure similar to XML but with additional types for `Ref`s and `FunctionRef`s
//! (e.g., supporting the `$foo` and `$$f(x)` syntaxes).
//!
//! ## DAST vs. FlatDast
//!
//! `DAST` is what is produced by the JavaScript parser. It is a tree of nodes with each node having children,
//! which are themselves nodes. In contrast `FlatDast` stores all information in a flat structure. Instead of nodes
//! having other nodes as children, a FlatDast node's children list contain pointers to the location in a flat array
//! where the node is stored.

pub mod dast_structure;
pub mod flat_dast;
pub mod ref_expand;
pub mod ref_resolve;

pub use dast_structure::*;

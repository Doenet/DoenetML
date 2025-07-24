//! # DoenetML Core
//!
//! The backbone of _DoenetML_. This crate is architecture-agnostic. It can be compiled to WebAssembly
//! or as a native binary.
//!
//! ## Features
//!  - [`Components`](components) are the building blocks of _DoenetML_. They are the smallest unit of a
//!    _DoenetML_ document, and (most of the time) correspond to XML tags that the user has typed
//!    in their _DoenetML_ source code. Examples include `<p />` and `<textInput />`
//!  - [`Core`](core) computes properties and relationships between DoenetML components. It enables
//!    interactivity via `Action`s, allowing components to respond and re-render based on user input.
//!  - [`Graph`](graph) provides an abstract implementation of a directed graph which is used
//!    to track dependencies among _DoenetML_ components and their properties.

#![allow(clippy::single_match)]
#![allow(clippy::let_and_return)]

pub mod components;
pub mod core;
pub mod dast;
pub mod graph;
pub mod utils;

pub use crate::core::*;

#[cfg(any(test, feature = "testing"))]
pub mod test_utils;

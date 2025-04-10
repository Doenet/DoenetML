//! # Core
//!
//! The backbone of _DoenetML_. `Core` tracks the state of all components in a _DoenetML_ document. It computes
//! props as appropriate and delivers updates to the UI when values change. It is responsible for maintaining (and
//! updating) relationships between _DoenetML_ components and their props.

pub mod component_builder;
pub mod dispatch_action;
mod document_model;
mod document_renderer;
mod document_structure;
pub mod graph_node;
mod graph_node_lookup;
pub mod math_via_wasm;
pub mod props;

pub use document_model::DocumentModel;

// Because of the use of #[enum_dispatch], the `state` module must be declared before the `general_prop` module.
pub mod state;

// Because of the use of #[enum_dispatch], the `state` module must be declared before the `general_prop` module.
// This comment prevents rustfmt from reordering the modules.
pub mod general_prop;

#[allow(clippy::module_inception)]
pub mod core;
pub use core::*;

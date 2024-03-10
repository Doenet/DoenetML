//! # Core
//!
//! The backbone of _DoenetML_. `Core` tracks the state of all components in a _DoenetML_ document. It computes
//! props as appropriate and delivers updates to the UI when values change. It is responsible for maintaining (and
//! updating) relationships between _DoenetML_ components and their props.

pub mod component_builder;
pub mod core;
pub mod dependency_creation;
pub mod graph_node;
pub mod math_via_wasm;
pub mod prop_calculation;
pub mod prop_updates;
pub mod props;
pub mod render;

#[cfg(test)]
pub mod mermaid;
// Because of the use of #[enum_dispatch], the `state` module must be declared before the `general_prop` module.
pub mod state;

// Because of the use of #[enum_dispatch], the `state` module must be declared before the `general_prop` module.
// This comment prevents rustfmt from reordering the modules.
pub mod general_prop;

//pub use self::doenet_ml_core::*;

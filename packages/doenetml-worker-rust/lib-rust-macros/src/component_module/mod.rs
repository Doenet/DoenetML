//! # Component Module
//!
//! When defining a DoenetML component, there are many pieces of data that need to be defined and referenced
//! in multiple places. This can be a tedious processes. The [`generate_component_module`] allows for a
//! declarative way to define a component. The function takes care of repeating what is necessary to define
//! a component.

mod generate_component_module;
mod items;
pub mod utils;

pub use generate_component_module::generate_component_module;

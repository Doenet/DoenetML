pub mod attribute;
pub mod components;
pub mod dast;
pub mod dependency;
mod doenet_ml_core;
pub mod math_via_wasm;

// Because of the use of #[enum_dispatch], the `state` module must be declared before the `general_prop` module.
pub mod state;

// Because of the use of #[enum_dispatch], the `state` module must be declared before the `general_prop` module.
// This comment prevents rustfmt from reordering the modules.
pub mod general_prop;

pub use self::doenet_ml_core::*;

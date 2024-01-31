pub mod attribute;
pub mod components;
pub mod dast;
pub mod dependency;
mod doenet_ml_core;

// Because of the use of #[enum_dispatch], the `state` module must be declared before the `general_state_var` module.
pub mod state;

// Because of the use of #[enum_dispatch], the `state` module must be declared before the `general_state_var` module.
// This comment prevents rustfmt from reordering the modules.
pub mod general_state_var;

pub use self::doenet_ml_core::*;

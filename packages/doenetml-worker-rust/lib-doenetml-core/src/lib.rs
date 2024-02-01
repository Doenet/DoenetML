#![allow(clippy::single_match)]

pub mod core;
pub mod utils;

pub use crate::core::*;

#[cfg(any(test, feature = "testing"))]
pub mod test_utils;

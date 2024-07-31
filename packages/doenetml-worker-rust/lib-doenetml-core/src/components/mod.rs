//! # Components
//!
//! A DoenetML _component_ controls what happens when an XML tag is written in DoenetML source code.
//! For example, the `P` component controls how a `<p>...</p>` tag is rendered, what its children are,
//! what its props are, etc..
//!
//! Authored components are defined in the in the [`doenet`] module.
//!
//! ## Features
//! - [`component`] contains the [`Component`] struct,
//!   which abstracts over all DoenetML components. It is what is used by [`Core`](crate::core) and
//!   should not be used directly by component authors.
//! - [`special`] contains implementations of the special [`_Error`] and
//!   [`_External`] components. These are treated differently from other
//!   _DoenetML_ components during the render process.

pub mod component;
pub mod component_enum;
pub mod doenet;
pub mod prelude;
pub mod special;
pub mod traits;
pub mod types;

pub use component::*;
pub use component_enum::*;
pub use special::*;
pub use traits::*;

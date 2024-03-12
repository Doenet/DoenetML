//! # Components
//!
//! A DoenetML _component_ controls what happens when an XML tag is written in DoenetML source code.
//! For example, the `P` component controls how a `<p>...</p>` tag is rendered, what its children are,
//! what its props are, etc..
//!
//! Authored components are defined in the in the [`doenet`](doenet) module.
//!
//! ## Features
//! - [`component`](component) contains the [`Component`](component::Component) struct,
//! which abstracts over all DoenetML components. It is what is used by [`Core`](crate::core) and
//! should not be used directly by component authors.
//! - [`special`](special) contains implementations of the special [`_Error`](special::_error::_Error) and
//! [`_External`](special::_external::_External) components. These are treated differently from other
//! _DoenetML_ components during the render process.

pub mod component;
pub mod component_enum;
pub mod doenet;
pub mod prelude;
pub mod prop_profile;
pub mod special;
pub mod traits;
pub mod types;

pub use component::*;
pub use component_enum::*;
pub use prop_profile::*;
pub use special::*;
pub use traits::*;

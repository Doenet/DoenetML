//! Functions and objects related to _rendering_ the component tree. A _rendered_ tree is one
//! that will be sent to the UI for display.

#[allow(clippy::module_inception)]
mod document_renderer;
mod to_flat_dast;

pub use document_renderer::*;

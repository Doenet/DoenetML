//! Positions of props in their type's table, for code that sets or reads a
//! prop by position. Each is defined next to its table and looked up by
//! name when compiled, so renaming or reordering a table cannot silently
//! break a reader.

pub use super::containers::{document, graph, section, sticky_group};
pub use super::geometry::{circle, line, point, polygon, segment};
pub use super::inputs::math_input;
pub use super::structure::{case, conditional_content, function_iterates};
pub use super::values::{answer, math, text, tuple, update_value};

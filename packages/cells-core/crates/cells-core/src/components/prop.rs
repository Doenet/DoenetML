//! Positions of props in their type's table, for code that sets or reads a
//! prop by position. Each is defined next to its table and looked up by
//! name when compiled, so renaming or reordering a table cannot silently
//! break a reader.

pub use super::containers::{document, graph, section, sticky_group};
pub use super::geometry::{circle, line, point, polygon, polyline, segment};
pub use super::inputs::{boolean_input, choice, choice_input, math_input, text_input};
pub use super::structure::{
    case, collect, conditional_content, function_iterates, repeat_for, select,
    select_from_sequence, sequence_value,
};
pub use super::values::{
    answer, award, boolean, curve, math, number, response, text, tuple, update_value, when,
};

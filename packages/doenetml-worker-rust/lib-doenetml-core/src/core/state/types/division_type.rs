use std::fmt::{Display, Formatter};

use strum_macros::EnumString;

/// A `<division>` is a stand in for multiple other elements, e.g. `<section>`, `<chapter>`, etc.
/// This enum distinguishes between different types of divisions.
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, EnumString)]
#[strum(ascii_case_insensitive)]
#[serde(rename_all = "camelCase")]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub enum DivisionType {
    /// A part of a book.
    Part,
    /// A chapter in a book.
    Chapter,
    /// A section in a book or article.
    Section,
    /// A subsection in a book or article.
    Subsection,
    /// A subsubsection in a book or article.
    Subsubsection,
    /// A set of paragraphs in a book or article that can be referenced.
    Paragraphs,
}

impl DivisionType {
    /// Get the division in a sequence of divisions.
    pub fn next_division(&self) -> Self {
        match self {
            DivisionType::Part => Self::Chapter,
            DivisionType::Chapter => Self::Section,
            DivisionType::Section => Self::Subsection,
            DivisionType::Subsection => Self::Subsubsection,
            DivisionType::Subsubsection => Self::Paragraphs,
            DivisionType::Paragraphs => Self::Paragraphs,
        }
    }
}

impl Display for DivisionType {
    fn fmt(&self, f: &mut Formatter) -> std::fmt::Result {
        let display_name = match self {
            DivisionType::Part => "Part".to_string(),
            DivisionType::Chapter => "Chapter".to_string(),
            DivisionType::Section => "Section".to_string(),
            DivisionType::Subsection => "Subsection".to_string(),
            DivisionType::Subsubsection => "Subsubsection".to_string(),
            DivisionType::Paragraphs => "Paragraphs".to_string(),
        };
        write!(f, "{display_name}")
    }
}

impl Default for DivisionType {
    fn default() -> Self {
        Self::Section
    }
}

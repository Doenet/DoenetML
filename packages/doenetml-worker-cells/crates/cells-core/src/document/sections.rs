//! Answers and sections as a reader sees them: submitting an answer, and a
//! section's number and automatic title.

use super::*;

impl Document {
    /// Submit an answer: an ordinary request copying the live response
    /// handle into its `submitted` cell.
    pub fn submit(&mut self, answer: CompIdx) -> TickOutcome {
        let cells = self.comp_cells(answer);
        let (response, submitted) = (
            cells[prop::answer::RESPONSE],
            cells[prop::answer::SUBMITTED],
        );
        let value = self.cells[response as usize];
        self.request(&[Request {
            cell: submitted,
            value,
        }])
    }

    /// A section's full number, such as "2.1": its own `number` cell,
    /// after its nearest section ancestor's full number when it includes
    /// its parent's (`build/expand/scoring.rs`). None for other components.
    pub fn section_number(&self, c: CompIdx) -> Option<String> {
        if self.component_type(c) != ComponentType::Section {
            return None;
        }
        let cells = self.comp_cells(c);
        let own = self.cells[cells[prop::section::NUMBER] as usize].to_string();
        if self.cells[cells[prop::section::INCLUDE_PARENT_NUMBER] as usize] == 0.0 {
            return Some(own);
        }
        let mut p = self.parent(c);
        while let Some(x) = p {
            if self.component_type(x) == ComponentType::Section {
                return Some(format!("{}.{own}", self.section_number(x)?));
            }
            p = self.parent(x);
        }
        Some(own)
    }

    /// A section's automatic title, such as "Section 2.1" or "Problem 3".
    pub fn section_title(&self, c: CompIdx) -> Option<String> {
        let number = self.section_number(c)?;
        let label = self.cells[self.comp_cells(c)[prop::section::LABEL] as usize] as usize;
        Some(format!(
            "{} {number}",
            crate::components::SECTION_TAGS[label].1
        ))
    }
}

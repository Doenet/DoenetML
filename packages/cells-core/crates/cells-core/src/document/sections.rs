//! Answers and sections as a reader sees them: submitting an answer, its
//! responses and inputs, and a section's number and automatic title.

use super::*;

impl Document {
    /// Submit an answer: an ordinary request copying each live response
    /// handle into its `submitted` cell and counting the submission.
    pub fn submit(&mut self, answer: CompIdx) -> TickOutcome {
        let requests = self.submit_requests(answer);
        self.request(&requests)
    }

    /// The requests a submit makes (`submit`), for a caller with its own
    /// evaluator.
    pub fn submit_requests(&self, answer: CompIdx) -> Vec<Request> {
        let mut requests: Vec<Request> = self
            .answer_responses(answer)
            .into_iter()
            .map(|(response, submitted)| Request {
                cell: submitted,
                value: self.cells[response as usize],
            })
            .collect();
        let n = self.comp_cells(answer)[prop::answer::NUM_SUBMISSIONS];
        requests.push(Request {
            cell: n,
            value: self.cells[n as usize] + 1.0,
        });
        requests
    }

    /// An answer's responses as (live cell, submitted cell): its own pair,
    /// then one per `response` child its awards reference, each once.
    pub fn answer_responses(&self, answer: CompIdx) -> Vec<(CellIdx, CellIdx)> {
        let cells = self.comp_cells(answer);
        let mut out = vec![(
            cells[prop::answer::RESPONSE],
            cells[prop::answer::SUBMITTED],
        )];
        for child in self.children(answer) {
            if let Child::Component(r) = child
                && self.component_type(r) == ComponentType::Response
            {
                let c = self.comp_cells(r);
                let pair = (c[prop::response::RESPONSE], c[prop::response::SUBMITTED]);
                if !out.contains(&pair) {
                    out.push(pair);
                }
            }
        }
        out
    }

    /// The inputs an answer's responses read, one per response: the input
    /// named by `response=`, its input child (explicit or implicit), or
    /// the inputs its awards reference. A response that reads no input
    /// (a blank `response=`) is left out.
    pub fn answer_inputs(&self, answer: CompIdx) -> Vec<CompIdx> {
        let reads = |c: CompIdx, cell: CellIdx| match self.component_type(c) {
            ComponentType::MathInput => self.comp_cells(c)[prop::math_input::EXPR] == cell,
            ComponentType::BooleanInput => self.comp_cells(c)[prop::boolean_input::VALUE] == cell,
            ComponentType::TextInput => self.comp_cells(c)[prop::text_input::VALUE] == cell,
            ComponentType::ChoiceInput => {
                self.comp_cells(c)[prop::choice_input::SELECTED_INDEX] == cell
            }
            _ => false,
        };
        self.answer_responses(answer)
            .into_iter()
            .filter_map(|(response, _)| {
                let found: Vec<CompIdx> = (0..self.components.len() as CompIdx)
                    .filter(|&c| reads(c, response))
                    .collect();
                // The input itself over its copies: the answer's own child,
                // else the one made from an element.
                found
                    .iter()
                    .copied()
                    .find(|&c| self.parent(c) == Some(answer))
                    .or_else(|| {
                        found
                            .iter()
                            .copied()
                            .find(|&c| self.components.dast_node[c as usize] != NONE)
                    })
                    .or_else(|| found.first().copied())
            })
            .collect()
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

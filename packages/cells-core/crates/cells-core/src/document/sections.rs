//! Answers and sections as a reader sees them: submitting an answer, its
//! responses and inputs, and a section's number and automatic title.

use super::*;
use crate::components::{AggOp, Collection};

/// Answers and sections, as a reader sees them: submitting an answer, its
/// responses and inputs, a section's number and title.
impl Document {
    /// Submit an answer, an action: one tick copying each live
    /// response handle into its `submitted` cell and counting the
    /// submission. Those cells are not interactive: no renderer sets them.
    pub fn submit(&mut self, answer: CompIdx) -> TickOutcome {
        let requests = self.submit_requests(answer);
        self.tick_unchecked(&requests, &[])
    }

    /// The writes a submit makes, as requests.
    pub(crate) fn submit_requests(&self, answer: CompIdx) -> Vec<Request> {
        let mut requests: Vec<Request> = self
            .answer_responses(answer)
            .into_iter()
            .map(|(response, submitted)| Request {
                cell: submitted,
                value: self.cells[response.index()],
            })
            .collect();
        if let Some(count) = self
            .component_type(answer)
            .def()
            .submit
            .and_then(|s| s.count)
        {
            let n = self.comp_cells(answer)[count];
            requests.push(Request {
                cell: n,
                value: self.cells[n.index()] + 1.0,
            });
        }
        requests
    }

    /// An answer's responses as (live cell, submitted cell): its own pair,
    /// then one per `response` child its awards reference, each once.
    pub fn answer_responses(&self, answer: CompIdx) -> Vec<(CellIdx, CellIdx)> {
        // What a submit copies of `c`: its response, and where it goes.
        let pair = |c: CompIdx| {
            let submit = self.component_type(c).def().submit?;
            let cells = self.comp_cells(c);
            Some((cells[submit.response], cells[submit.submitted]))
        };
        let mut out: Vec<(CellIdx, CellIdx)> = pair(answer).into_iter().collect();
        for child in self.children(answer) {
            if let Child::Component(r) = child
                && self.component_type(r).plays(Role::Response)
            {
                let Some(pair) = pair(r) else { continue };
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
        let reads = |c: CompIdx, cell: CellIdx| {
            self.component_type(c)
                .response()
                .is_some_and(|r| self.comp_cells(c)[r.prop()] == cell)
        };
        self.answer_responses(answer)
            .into_iter()
            .filter_map(|(response, _)| {
                let found: Vec<CompIdx> = (CompIdx::below(self.components.len()))
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
                            .find(|&c| self.components.dast_node[c.index()] != NodeId::NONE)
                    })
                    .or_else(|| found.first().copied())
            })
            .collect()
    }

    /// A section's full number, such as "2.1": its own `number` cell,
    /// after its nearest section ancestor's full number when it includes
    /// its parent's. None for other components.
    pub fn section_number(&self, c: CompIdx) -> Option<String> {
        let ty = self.component_type(c);
        let numbered = ty.def().numbered?;
        let number = ty.aggregate_prop(AggOp::Count, Collection::SectionsThrough)?;
        let cells = self.comp_cells(c);
        let own = self.cells[cells[number].index()].to_string();
        if self.cells[cells[numbered.include_parent].index()] == 0.0 {
            return Some(own);
        }
        let mut p = self.parent(c);
        while let Some(x) = p {
            if self.component_type(x).def().numbered.is_some() {
                return Some(format!("{}.{own}", self.section_number(x)?));
            }
            p = self.parent(x);
        }
        Some(own)
    }

    /// A section's automatic title, such as "Section 2.1" or "Problem 3".
    pub fn section_title(&self, c: CompIdx) -> Option<String> {
        let number = self.section_number(c)?;
        let numbered = self.component_type(c).def().numbered?;
        let label = self.cells[self.comp_cells(c)[numbered.label].index()] as usize;
        Some(format!("{} {number}", (numbered.title)(label)))
    }
}

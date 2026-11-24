//! What a type with a step gate shows of its children (ADR 0062): a
//! `<cascade>`'s steps and messages, as a reader sees them. Read when
//! asked, from the cells the build computed (the gated type's `completed`,
//! `all` and `future`, the `active` cell of each case passed), by walking
//! the built document, as a section's full number and a document-wide
//! counter are (`document/sections.rs`, `document/counters.rs`). Scoring
//! reads the same gates as cells the build made (`build/expand/aggregate.rs`).

use super::*;
use crate::components::StepGate;

/// How a type with a step gate shows one of its children (ADR 0062).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Revealed {
    /// Shown, as any component is.
    Shown,
    /// A held-back step that keeps its heading: what it holds is hidden
    /// (the current core's `hideChildren`), but a message of its own that
    /// is chosen.
    Heading,
    /// Not shown: a step not reached, a message not chosen.
    Hidden,
}

/// A gated component's steps as they stand: each step in order, the steps
/// and messages together in document order, and its three settings.
struct Steps {
    gate: StepGate,
    steps: Vec<CompIdx>,
    order: Vec<CompIdx>,
    completed: usize,
    all: bool,
    future: bool,
}

/// A step gate's children, as a reader sees them.
impl Built {
    /// How the gate above `c` shows it (ADR 0062): a step of a type with
    /// a step gate is shown while its place is at most the type's
    /// `completed` (or the type's `all` is on), else keeps its heading
    /// when its type is `headed` and nothing hides it, else is hidden;
    /// every step of a held-back gated type is hidden. A message is shown
    /// only while it is the one chosen for the gap: a gated type's own,
    /// the next after the last step shown, or a held-back step's own,
    /// when that step is the next held back. Anything else is shown.
    pub fn revealed(&self, c: CompIdx) -> Revealed {
        self.revealed_in(c, &mut Vec::new())
    }

    /// The cells [`revealed`](Self::revealed) of `c` reads: each gated
    /// type's settings and the `active` cell of each case walked. A reader
    /// that shows `c` recomputes it when one of them changes.
    pub fn reveal_reads(&self, c: CompIdx) -> Vec<CellIdx> {
        let mut reads = Vec::new();
        self.revealed_in(c, &mut reads);
        reads
    }

    fn revealed_in(&self, c: CompIdx, reads: &mut Vec<CellIdx>) -> Revealed {
        let Some(owner) = self.owner(c) else {
            return Revealed::Shown;
        };
        let ty = self.component_type(c);
        if let Some(gate) = self.component_type(owner).step_gate() {
            if gate.skip.contains(&ty) {
                return Revealed::Shown;
            }
            let v = self.steps(owner, gate, reads);
            if ty == gate.message {
                return if self.own_message(owner, &v, reads) == Some(c) {
                    Revealed::Shown
                } else {
                    Revealed::Hidden
                };
            }
            if v.all {
                return Revealed::Shown;
            }
            let Some(k) = v.steps.iter().position(|&s| s == c) else {
                return Revealed::Shown;
            };
            let held = self.revealed_in(owner, reads) == Revealed::Heading;
            return if k <= v.completed {
                if held {
                    Revealed::Hidden
                } else {
                    Revealed::Shown
                }
            } else if !held && !v.future && gate.headed.contains(&ty) {
                Revealed::Heading
            } else {
                Revealed::Hidden
            };
        }
        // A message inside a step that keeps its heading: shown while that
        // step is the one its gated type chooses for the gap.
        let Some(gate) = ty.message_of() else {
            return Revealed::Shown;
        };
        if !gate.headed.contains(&self.component_type(owner)) {
            return Revealed::Shown;
        }
        let chosen = self.owner(owner).is_some_and(|around| {
            self.component_type(around).step_gate().is_some_and(|g| {
                let v = self.steps(around, g, reads);
                self.chosen_step(around, &v, reads) == Some(owner)
            })
        });
        if chosen {
            Revealed::Shown
        } else {
            Revealed::Hidden
        }
    }

    /// The nearest ancestor of `c` that is no structure (a group, a case,
    /// a repeat), whose child `c` is, looked through it.
    fn owner(&self, c: CompIdx) -> Option<CompIdx> {
        let mut p = self.parent(c)?;
        while self.component_type(p).structure_kind().is_some() {
            p = self.parent(p)?;
        }
        Some(p)
    }

    /// The steps and messages of `g`, gated by `gate`, through the
    /// structure and the active cases, and its settings.
    fn steps(&self, g: CompIdx, gate: StepGate, reads: &mut Vec<CellIdx>) -> Steps {
        let cells = self.comp_cells(g);
        let mut value = |pi: usize| {
            let cell = cells[pi];
            reads.push(cell);
            self.cells[cell.index()]
        };
        let completed = value(gate.completed);
        let all = value(gate.all);
        let future = value(gate.future);
        let mut v = Steps {
            gate,
            steps: Vec::new(),
            order: Vec::new(),
            completed: if completed >= 0.0 {
                completed as usize
            } else {
                0
            },
            all: all != 0.0 && !all.is_nan(),
            future: future != 0.0 && !future.is_nan(),
        };
        self.collect_steps(g, &mut v, reads);
        v
    }

    fn collect_steps(&self, c: CompIdx, v: &mut Steps, reads: &mut Vec<CellIdx>) {
        for child in self.children(c) {
            let Child::Component(k) = child else { continue };
            let ty = self.component_type(k);
            if v.gate.skip.contains(&ty) {
                continue;
            }
            if ty == v.gate.message {
                v.order.push(k);
                continue;
            }
            match ty.structure_kind() {
                Some(StructureKind::Gate { active }) => {
                    let cell = self.comp_cells(k)[active];
                    reads.push(cell);
                    if self.cells[cell.index()] == 1.0 {
                        self.collect_steps(k, v, reads);
                    }
                }
                Some(_) => self.collect_steps(k, v, reads),
                None => {
                    v.steps.push(k);
                    v.order.push(k);
                }
            }
        }
    }

    /// The held-back step of `g` whose own message speaks for the gap: the
    /// next step after the last one shown, when it keeps its heading and
    /// has a message to show.
    fn chosen_step(&self, g: CompIdx, v: &Steps, reads: &mut Vec<CellIdx>) -> Option<CompIdx> {
        if v.all {
            return None;
        }
        let next = *v.steps.get(v.completed + 1)?;
        let held = self.revealed_in(g, reads) == Revealed::Heading;
        if held || v.future || !v.gate.headed.contains(&self.component_type(next)) {
            return None;
        }
        let has_message = match self.component_type(next).step_gate() {
            Some(gate) => {
                let w = self.steps(next, gate, reads);
                self.next_message(&w).is_some()
            }
            None => self.has_message(next, v.gate.message),
        };
        has_message.then_some(next)
    }

    /// Whether `c` has a child of type `message`, looked through the
    /// structure.
    fn has_message(&self, c: CompIdx, message: ComponentType) -> bool {
        self.children(c).any(|child| match child {
            Child::Component(k) => {
                let ty = self.component_type(k);
                ty == message || (ty.structure_kind().is_some() && self.has_message(k, message))
            }
            Child::Text(_) => false,
        })
    }

    /// The message of `g`'s own it shows: the next after the last step
    /// shown, unless a held-back step speaks for the gap, or `g` is itself
    /// held back and not the step its gated type chose.
    fn own_message(&self, g: CompIdx, v: &Steps, reads: &mut Vec<CellIdx>) -> Option<CompIdx> {
        if self.chosen_step(g, v, reads).is_some() {
            return None;
        }
        if self.revealed_in(g, reads) == Revealed::Heading {
            let chosen = self.owner(g).is_some_and(|around| {
                self.component_type(around).step_gate().is_some_and(|gate| {
                    let w = self.steps(around, gate, reads);
                    self.chosen_step(around, &w, reads) == Some(g)
                })
            });
            if !chosen {
                return None;
            }
        }
        self.next_message(v)
    }

    /// The first message after the last step shown, when a step is held
    /// back.
    fn next_message(&self, v: &Steps) -> Option<CompIdx> {
        if v.all || v.completed + 2 > v.steps.len() {
            return None;
        }
        let last = v.steps[v.completed];
        let at = v.order.iter().position(|&k| k == last)?;
        v.order[at + 1..]
            .iter()
            .copied()
            .find(|&k| self.component_type(k) == v.gate.message)
    }
}

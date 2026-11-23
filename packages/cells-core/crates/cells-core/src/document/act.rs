//! Actions (ADR 0040): a type lists its actions, each a function over a
//! read-only [`ActionView`] of the built document that returns requests,
//! and [`Document::act`] carries one out as a tick. A submit and a press
//! are actions of a fixed name.

use std::cell::RefCell;

use super::{Child, CompIdx, Document};
use crate::components::{ActionDecl, Event};
use crate::tick::{Request, TickOutcome};

/// How deep one action may call another's (`<callAction>` naming a
/// `<triggerSet>` naming a `<callAction>`...): a chain that deep is a
/// cycle, and stops.
pub(crate) const MAX_ACTION_DEPTH: u32 = 16;

/// What an action function reads of the built document: one component's
/// props, children and target, and another component's action. It writes
/// nothing; what it returns is the requests it makes.
pub struct ActionView<'d> {
    doc: &'d Document,
    comp: CompIdx,
    depth: u32,
    /// Every action carried out in this call, its own and those it called,
    /// with what each is to a component waiting on it.
    fired: &'d RefCell<Vec<(CompIdx, Event)>>,
}

impl ActionView<'_> {
    /// The current value of prop `prop` (a position in the type's table).
    pub fn value(&self, prop: usize) -> f64 {
        self.doc.cells[self.doc.comp_cells(self.comp)[prop].index()]
    }

    /// The text a text prop holds, or "" when it holds none.
    pub fn text(&self, prop: usize) -> String {
        self.doc.text_value(self.doc.comp_cells(self.comp)[prop])
    }

    /// A request for `value` on prop `prop` of the component, which must be
    /// one an action may write: marked `written_by_action` or
    /// `interactive` (ADR 0018).
    pub fn request(&self, prop: usize, value: f64) -> Request {
        let cells = self.doc.comp_cells(self.comp);
        debug_assert!(
            self.doc
                .component_type(self.comp)
                .is_input_prop(cells.len(), prop),
            "an action requests only what an action or a renderer may write"
        );
        Request {
            cell: cells[prop],
            value,
        }
    }

    /// The component's children, in order.
    pub fn children(&self) -> impl Iterator<Item = CompIdx> + '_ {
        self.doc.children(self.comp).filter_map(|k| match k {
            Child::Component(k) => Some(k),
            Child::Text(_) => None,
        })
    }

    /// The component its `target` names (a `Component` attribute), when
    /// that resolved to one.
    pub fn target(&self) -> Option<CompIdx> {
        self.doc.components.target(self.comp)
    }

    /// The requests `comp`'s action `name` makes, with no arguments: none
    /// when its type lists no such action.
    pub fn act(&self, comp: CompIdx, name: &str) -> Vec<Request> {
        self.doc
            .run_action(comp, name, &[], self.depth + 1, self.fired)
            .unwrap_or_default()
    }

    /// The literal text of an attribute of the component's element (an
    /// `actionName`); none for a copy, or one holding a reference.
    pub fn attr_text(&self, name: &str) -> Option<String> {
        self.doc.attr_text(self.comp, name)
    }
}

/// Actions: what a type lists, carried out as one tick.
impl Document {
    /// The action of `comp`'s type called `name`, matched without regard
    /// to case.
    pub fn action(&self, comp: CompIdx, name: &str) -> Option<&'static ActionDecl> {
        self.component_type(comp)
            .def()
            .actions
            .iter()
            .find(|a| a.name.eq_ignore_ascii_case(name))
    }

    /// Carry out `comp`'s action `name` with `args`, as one tick: the
    /// requests it makes are inverted and applied as a request's are, on
    /// any cell an action may write. Nothing happens when its type lists
    /// no such action.
    pub fn act(&mut self, comp: CompIdx, name: &str, args: &[f64]) -> TickOutcome {
        if comp.index() >= self.n_components() {
            return TickOutcome::default();
        }
        let fired = RefCell::new(Vec::new());
        let Some(requests) = self.run_action(comp, name, args, 0, &fired) else {
            return TickOutcome::default();
        };
        self.tick_unchecked(&requests, &[])
    }

    /// The requests `comp`'s action `name` makes, recording it and every
    /// action it calls in `fired`; none when its type lists no such
    /// action, or the chain of calls is too deep.
    fn run_action(
        &self,
        comp: CompIdx,
        name: &str,
        args: &[f64],
        depth: u32,
        fired: &RefCell<Vec<(CompIdx, Event)>>,
    ) -> Option<Vec<Request>> {
        if depth > MAX_ACTION_DEPTH || comp.index() >= self.n_components() {
            return None;
        }
        let action = self.action(comp, name)?;
        fired.borrow_mut().push((comp, action.event));
        let view = ActionView {
            doc: self,
            comp,
            depth,
            fired,
        };
        Some((action.run)(&view, args))
    }
}

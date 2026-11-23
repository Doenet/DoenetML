//! Actions (ADR 0040): a type lists its actions, each a function over a
//! read-only [`ActionView`] of the built document that returns requests,
//! and [`Document::act`] carries one out as a tick. A submit and a press
//! are actions of a fixed name.
//!
//! Follow-ups (ADR 0042): when a tick settles, each button whose
//! `triggerWhen` went from false to true, and each whose `triggerWith`
//! (or `triggerWhenObjectsClicked`, `...Focused`) names a component that
//! acted in the tick, is pressed as a tick of its own, in document order,
//! and so on from those, at most [`MAX_FOLLOW_UPS`] in all.

use std::cell::RefCell;
use std::collections::{HashMap, HashSet, VecDeque};

use super::{Built, Child, CompIdx, Document};
use crate::build::ScopeId;
use crate::components::{ActionDecl, AttrKind, Event};
use crate::dast::NodeId;
use crate::limits::MAX_FOLLOW_UPS;
use crate::tick::invert::PointRequest;
use crate::tick::{Request, TickOutcome};

/// A component as it is known across a rebuild, which numbers the
/// components anew: its element and the scope it was made in, and for one
/// the compile made (a list's row, ADR 0041; a `$ref` child), its place
/// under the nearest component that has an element (0 for one that has).
type Key = (NodeId, ScopeId, u64);

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
        let fired = fired.into_inner();
        self.tick_and_follow(&requests, &[], false, &fired)
    }

    /// A tick, and its follow-ups (ADR 0042): each button the tick
    /// pressed, by a condition's rise or by acting on what it waits on
    /// (`fired`, the actions the tick carried out), pressed as a tick of
    /// its own in document order, then theirs, at most `MAX_FOLLOW_UPS`.
    /// Their outcomes fold into the first's.
    pub(super) fn tick_and_follow(
        &mut self,
        requests: &[Request],
        groups: &[Vec<PointRequest>],
        checked: bool,
        fired: &[(CompIdx, Event)],
    ) -> TickOutcome {
        if self.pressed.is_empty() {
            return self.tick(requests, groups, checked);
        }
        let before = self.conditions();
        let fired = self.keyed(fired);
        let mut out = self.tick(requests, groups, checked);
        let mut queue: VecDeque<Key> = self.follow_ups(&before, &fired).into();
        while let Some(key) = queue.pop_front() {
            if out.follow_ups == MAX_FOLLOW_UPS {
                break;
            }
            let Some(c) = self.pressed.iter().copied().find(|&c| self.key(c) == key) else {
                continue;
            };
            let before = self.conditions();
            let acted = RefCell::new(Vec::new());
            let Some(requests) = self.run_action(c, "trigger", &[], 0, &acted) else {
                continue;
            };
            let acted = self.keyed(&acted.into_inner());
            let tick = self.tick(&requests, &[], false);
            out.follow_ups += 1;
            fold(&mut out, tick);
            queue.extend(self.follow_ups(&before, &acted));
        }
        out
    }

    /// A component's key across rebuilds.
    fn key(&self, c: CompIdx) -> Key {
        let scope = self.components.scope[c.index()];
        let (mut k, mut place, mut width) = (c, 0u64, 1u64);
        while self.components.dast_node[k.index()] == NodeId::NONE {
            let Some(parent) = self.parent(k) else { break };
            let at = self
                .children(parent)
                .position(|ch| matches!(ch, Child::Component(x) if x == k))
                .map_or(0, |i| i as u64 + 1);
            place = place.wrapping_add(at.wrapping_mul(width));
            width = width.wrapping_mul(1 << 16);
            k = parent;
        }
        (self.components.dast_node[k.index()], scope, place)
    }

    /// The events `fired`, by key. An event on a list's row (ADR 0041,
    /// decision 4) is one on the list too: a click on an entry is a click
    /// on the list.
    fn keyed(&self, fired: &[(CompIdx, Event)]) -> HashSet<(Key, Event)> {
        let mut out = HashSet::new();
        for &(c, e) in fired {
            out.insert((self.key(c), e));
            if let Some(list) = self.parent(c)
                && self.component_type(list).entry_row().is_some()
            {
                out.insert((self.key(list), e));
            }
        }
        out
    }

    /// Whether each pressed component's condition holds now.
    fn conditions(&self) -> HashMap<Key, bool> {
        self.pressed
            .iter()
            .filter_map(|&c| {
                let when = self.component_type(c).def().triggers?.when;
                let held = self.cells[self.comp_cells(c)[when].index()] == 1.0;
                Some((self.key(c), held))
            })
            .collect()
    }

    /// The components a tick presses, in document order: those whose
    /// condition was false `before` it and holds now (one not there before
    /// it, a new iteration's, was not false), and those waiting on an
    /// event in `fired`.
    fn follow_ups(&self, before: &HashMap<Key, bool>, fired: &HashSet<(Key, Event)>) -> Vec<Key> {
        let now = self.conditions();
        let mut out: Vec<CompIdx> = self
            .pressed
            .iter()
            .copied()
            .filter(|&c| {
                let k = self.key(c);
                now.get(&k) == Some(&true) && before.get(&k) == Some(&false)
            })
            .collect();
        if !fired.is_empty() {
            let pressed: HashSet<CompIdx> = self.pressed.iter().copied().collect();
            for &(c, attr, named) in &self.components.links {
                if !pressed.contains(&c) {
                    continue;
                }
                let kind = self.component_type(c).def().attributes[attr as usize].kind;
                if let AttrKind::After(event) = kind
                    && fired.contains(&(self.key(named), event))
                {
                    out.push(c);
                }
            }
        }
        out.sort_unstable();
        out.dedup();
        out.into_iter().map(|c| self.key(c)).collect()
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

/// A follow-up's outcome folded into the first tick's: after a rebuild the
/// cells are numbered anew, so the outcome says it rebuilt and lists no
/// changed cell.
fn fold(out: &mut TickOutcome, tick: TickOutcome) {
    out.dropped.extend(tick.dropped);
    out.rebuild_passes += tick.rebuild_passes;
    if tick.rebuild_error.is_some() {
        out.rebuild_error = tick.rebuild_error;
    }
    if out.rebuilt || tick.rebuilt {
        out.rebuilt = true;
        out.changed.clear();
        return;
    }
    let seen: HashSet<_> = out.changed.iter().copied().collect();
    out.changed
        .extend(tick.changed.into_iter().filter(|c| !seen.contains(c)));
}

impl Built {
    /// The components something other than a student presses (ADR 0042),
    /// in document order: those of a type with `triggers`, but not one
    /// inside another such (a `<triggerSet>`'s buttons), which only it
    /// presses.
    pub(super) fn pressed_components(&self) -> Vec<CompIdx> {
        let presses = |c: CompIdx| self.component_type(c).def().triggers.is_some();
        CompIdx::below(self.n_components())
            .filter(|&c| presses(c) && !self.parent(c).is_some_and(presses))
            .collect()
    }
}

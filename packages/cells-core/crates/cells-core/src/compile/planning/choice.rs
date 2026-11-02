//! Choices (ADR 0009): `<conditionalContent>` and `<select>`, as planned.
//! Their branches are made when outlining (`outline/choice.rs`) and their
//! interfaces finished when sealing (`seal/choice.rs`).
//!
//! Each branch (a case or an option) is its own template, so the names
//! inside it are private, as a repeat's are. What the rest of the document
//! may reach is the branch interface: the names every branch declares, each
//! with the same type in every branch, checked once every element is
//! planned.
//!
//! A select picks its options while the document is built, from the
//! document seed: unchosen options are never expanded. A conditional
//! content's `choice` cell is the first case whose condition holds. Every
//! case is built, inside a `Case` component whose `active` cell says
//! whether it is shown, and an interface name is a `Choose` over the
//! branches' cells, so a flip is an ordinary tick. (Rebuilding with only
//! the active case lost on every tick; see ADR 0009.)

use crate::compile::*;
use crate::components::prop::conditional_content;
use crate::limits::MAX_CASES;

impl<'a> Compiler<'a> {
    /// A choice's props: a select's `hide`; for a reactive choice also a
    /// hidden slot per case condition (an else is a constant 1) and
    /// `choice`, the first of them that holds.
    pub(in crate::compile) fn plan_choice(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let Body::Choice(cid) = self.compiled.templates[t.index()].elems[e.index()].body else {
            unreachable!()
        };
        let d = self.dast;
        let Elem {
            node,
            name_scope: scope,
            ..
        } = self.compiled.templates[t.index()].elems[e.index()];
        let hide = match d.attr(node, "hide") {
            Some(a) if self.attr_text(a).is_some() => {
                Source::Const(if self.attr_flag(node, "hide") {
                    1.0
                } else {
                    0.0
                })
            }
            Some(a) => self.plan_value(t, scope, "hide", d.attr_children(a), None)?,
            None => Source::Const(0.0),
        };
        if !self.compiled.choices[cid.index()].reactive {
            self.compiled.templates[t.index()].elems[e.index()].props =
                prop::select::Props { hide }.into_vec();
            return Ok(());
        }
        let mut wiring = ElemWiring::of(ComponentType::ConditionalContent);
        let mut conds = Vec::new();
        for c in self.compiled.choices[cid.index()].conditions.clone() {
            conds.push(match c {
                Some(a) => self.plan_condition(t, e, &mut wiring, d.attr_children(a))?,
                None => wiring.hidden(Source::Const(1.0)),
            });
        }
        if conds.len() > MAX_CASES {
            return Err(Error::Unsupported(format!(
                "a <conditionalContent> with more than {MAX_CASES} cases"
            )));
        }
        // After the conditions, so creation order stays an evaluation order.
        let first = wiring.hidden(Source::vector(
            VecOp::First {
                n: byte(conds.len()),
            },
            conds,
        ));
        wiring.set_public_sources(conditional_content::Props {
            choice: Source::own(first),
            hide,
        });
        self.compiled.templates[t.index()].elems[e.index()].props = wiring.finish();
        Ok(())
    }
}

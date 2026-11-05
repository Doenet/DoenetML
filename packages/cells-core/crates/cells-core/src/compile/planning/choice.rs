//! Choices: `<conditionalContent>` and `<select>`, as planned.
//!
//! Each branch (a case or an option) is its own template, so the names
//! inside it are private. The rest of the document may reach the branch
//! interface: the names every branch declares, each with the same type in
//! every branch. A select picks its options at build time from the
//! document seed; a conditional content's `choice` cell is the first case
//! whose condition holds, and every case is built.

use crate::compile::*;
use crate::components::prop::conditional_content;
use crate::limits::MAX_CASES;

impl<'a> Compiler<'a> {
    /// A choice's props: a select's `hide`; for a reactive choice also a
    /// hidden port per case condition (an else is a constant 1) and
    /// `choice`, the first of them that holds.
    pub(in crate::compile) fn plan_choice(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let Body::Choice(cid) = self.outlined(t).elems[e.index()].body else {
            unreachable!()
        };
        let d = self.dast;
        let Elem {
            node,
            name_scope: scope,
            ..
        } = self.outlined(t).elems[e.index()];
        let hide = match d.attr(node, "hide") {
            Some(a) if self.attr_text(a).is_some() => {
                Source::constant(if self.attr_flag(node, "hide") {
                    1.0
                } else {
                    0.0
                })
            }
            Some(a) => self.plan_value(t, scope, "hide", d.attr_children(a), None)?,
            None => Source::constant(0.0),
        };
        if !self.choice(cid).reactive {
            self.tables[t.index()].plans[e.index()].props = prop::select::Props { hide }.into_vec();
            return Ok(());
        }
        let mut wiring = ElemWiring::of(ComponentType::ConditionalContent);
        let mut conds = Vec::new();
        for c in self.choice(cid).conditions.clone() {
            conds.push(match c {
                Some(a) => self.plan_condition(t, e, &mut wiring, d.attr_children(a))?,
                None => wiring.hidden(Source::constant(1.0)),
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
        self.tables[t.index()].plans[e.index()].props = wiring.finish().0;
        Ok(())
    }
}

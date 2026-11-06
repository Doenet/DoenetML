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

/// Planning, choices: a `<conditionalContent>`'s or `<select>`'s own plans; its
/// branches are templates of their own. Never reads another element's plan (ADR
/// 0029).
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
            Some(a) if self.rd().attr_text(a).is_some() => {
                Source::constant(if self.rd().attr_flag(node, "hide") {
                    1.0
                } else {
                    0.0
                })
            }
            Some(a) => Reader::new(self.dast, &self.settled).plan_value(
                &mut self.ar,
                t,
                scope,
                "hide",
                d.attr_children(a),
                None,
            )?,
            None => Source::constant(0.0),
        };
        if !self.choice(cid).reactive {
            // `numToSelect` after `hide`: a document constant the check
            // evaluates (ADR 0037).
            // A literal is a constant, as a literal `hide` is: never state.
            let num = match d.attr(node, "numToSelect") {
                Some(a) => match Reader::new(self.dast, &self.settled).plan_scalar(
                    &mut self.ar,
                    t,
                    scope,
                    d.attr_children(a),
                )? {
                    Source::Leaf(Leaf::Given(v)) => Source::constant(v),
                    num => num,
                },
                None => Source::constant(1.0),
            };
            let mut props = prop::select::Props { hide }.into_vec();
            debug_assert_eq!(props.len(), prop::select::NUM_TO_SELECT);
            props.push(num);
            self.tables[t.index()].plans[e.index()].props = props;
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

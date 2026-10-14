//! `<boolean>`: its `value` from its content. Literal content (`true`,
//! `false`, a number, nothing) is an essential 0/1 cell, since DoenetML's
//! boolean value is state (`<updateValue>` writes it). A lone `$ref`
//! aliases the referent. Anything else is a condition (`condition.rs`):
//! comparisons and connectives over numeric math, with `=` between
//! expressions compared in the engine under the compare attributes.

use super::*;

impl<'a> Compiler<'a> {
    /// A `<boolean>` that extends another component aliases its value;
    /// otherwise its content is planned (`plan_boolean`).
    pub(super) fn plan_boolean_elem(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        match self.compiled.templates[t].elems[e].extend {
            Some(p) => {
                // `<boolean extend="$bi"/>` shares the referent's value
                // whatever its type, so it is an alias, not an `Inherit`
                // (which expand would type-check).
                if self.compiled.refs[p].prop.is_none() {
                    self.compiled.refs[p].prop = Some("value".into());
                }
                let el = &mut self.compiled.templates[t].elems[e];
                el.extend = None;
                el.props = vec![SourcePlan::reference(p)];
                Ok(())
            }
            None => self.plan_boolean(t, e),
        }
    }

    fn plan_boolean(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.compiled.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let nodes: Vec<NodeId> = d
            .children(el)
            .iter()
            .copied()
            .filter(|&n| !self.is_blank(n))
            .collect();
        if let Some(&n) = nodes.iter().find(|&&n| d.kind(n) == NodeKind::Element) {
            return Err(Error::Unsupported(format!(
                "a <{}> inside a <boolean>",
                d.str(n)
            )));
        }
        let macros = nodes
            .iter()
            .filter(|&&n| d.kind(n) == NodeKind::Macro)
            .count();
        let text: String = nodes
            .iter()
            .filter(|&&n| d.kind(n) == NodeKind::Text)
            .map(|&n| d.str(n))
            .collect();
        let text = text.trim();
        let mut plan = ElemPlan::new(1);
        // Literal content is state: `<boolean>false</boolean>` can be set.
        let literal = match (macros, text.to_ascii_lowercase().as_str()) {
            (0, "") => Some(0.0),
            (0, "true") => Some(1.0),
            (0, "false") => Some(0.0),
            // A number is true only when it is 1, as in the current core.
            (0, s) => s.parse::<f64>().ok().map(|v| f64::from(v == 1.0)),
            _ => None,
        };
        if let Some(v) = literal {
            plan.set_essential(0, "value", v);
            self.compiled.templates[t].elems[e].props = plan.finish();
            return Ok(());
        }
        if macros == 1 && text.is_empty() {
            let p = self.plan_ref(t, scope, nodes[0])?;
            self.compiled.templates[t].elems[e].props = vec![SourcePlan::reference(p)];
            return Ok(());
        }
        let compare = self.compare_attrs(&[el]);
        let slot = self.plan_condition_content(t, scope, &nodes, compare, &mut plan)?;
        plan.set(0, SourcePlan::own(slot));
        self.compiled.templates[t].elems[e].props = plan.finish();
        Ok(())
    }
}

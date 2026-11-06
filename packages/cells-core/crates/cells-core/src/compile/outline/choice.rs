//! A choice's branches made when outlining: one template per case or
//! option, its content outlined like any other.

use super::Outlining;
use crate::compile::*;

/// Outlining, choices: one template per case or option, its content outlined
/// like any other. Plans nothing (ADR 0030).
impl Compiler<'_> {
    /// Give a choice element its branch templates. `<group rendered="c">`
    /// is a conditional content with one case.
    pub(in crate::compile) fn add_choice(
        &mut self,
        o: &mut Outlining<'_>,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
    ) -> Result<()> {
        let d = self.dast;
        let reactive =
            self.outlined(t).elems[e.index()].component_type == ComponentType::ConditionalContent;
        let tag = d.str(el).to_string();
        if d.attr(el, "extend").is_some() || d.attr(el, "copySource").is_some() {
            return Err(Error::Banned(format!(
                "extend on a <{tag}>: reference its interface names instead"
            )));
        }
        // (condition attribute, body nodes, weight) per branch, and its key.
        let mut branches: Vec<(Option<AttrId>, Vec<NodeId>, f64)> = Vec::new();
        let mut branch_keys: Vec<Box<str>> = Vec::new();
        // A case's or option's key (ADR 0017): its name, else its tag and
        // its position among the branches with that tag.
        let mut tag_counts: HashMap<&str, u32> = HashMap::new();
        let mut branch_key = |n: NodeId| -> Box<str> {
            if let Some(name) = self.rd().attr_name_str(n, "name") {
                return d.strings.get(name).trim().into();
            }
            let k = tag_counts.entry(d.str(n)).or_insert(0);
            *k += 1;
            format!("{}#{k}", d.str(n)).into()
        };
        let is_branch = |n: NodeId| {
            d.kind(n) == NodeKind::Element && matches!(d.str(n), "case" | "else" | "option")
        };
        if tag == "group" {
            branches.push((d.attr(el, "rendered"), d.children(el).to_vec(), 1.0));
            branch_keys.push("body".into());
        } else if reactive
            && d.attr(el, "condition").is_some()
            && !d.children(el).iter().any(|&n| is_branch(n))
        {
            branches.push((d.attr(el, "condition"), d.children(el).to_vec(), 1.0));
            branch_keys.push("body".into());
        } else {
            let want = if reactive {
                "<case> or <else>"
            } else {
                "<option>"
            };
            for &n in d.children(el) {
                match d.kind(n) {
                    NodeKind::Text if d.str(n).trim().is_empty() => {}
                    NodeKind::Other => {}
                    NodeKind::Element if reactive && matches!(d.str(n), "case" | "else") => {
                        branches.push((d.attr(n, "condition"), self.branch_body(n), 1.0));
                        branch_keys.push(branch_key(n));
                    }
                    NodeKind::Element if !reactive && d.str(n) == "option" => {
                        let weight = match d.attr(n, "selectWeight") {
                            Some(a) => self.rd().literal_attr(a, "selectWeight")?,
                            None => 1.0,
                        };
                        branches.push((None, self.branch_body(n), weight));
                        branch_keys.push(branch_key(n));
                    }
                    _ => {
                        return Err(Error::Unsupported(format!(
                            "the children of <{tag}> must be {want} elements"
                        )));
                    }
                }
            }
        }
        if branches.is_empty() && reactive {
            return Err(Error::Unsupported(format!("<{tag}> with no branches")));
        }
        // A literal `numToSelect` is known here, for a reference to the
        // one option a select picks (`$s.x`); any other is planned with
        // the choice and evaluated by the check, which also checks the
        // select can draw its picks (ADR 0037).
        let (num_to_select, with_replacement) = if reactive {
            (Some(1), false)
        } else {
            let num = match d.attr(el, "numToSelect") {
                Some(a) if self.rd().attr_text(a).is_some() => {
                    Some(self.rd().literal_attr(a, "numToSelect")?)
                }
                Some(_) => None,
                None => Some(1.0),
            };
            if let Some(num) = num
                && (num < 0.0 || num.fract() != 0.0)
            {
                return Err(Error::BadValue {
                    attr: "numToSelect".into(),
                    text: num.to_string(),
                });
            }
            (
                num.map(|n| n as u32),
                self.rd().attr_flag(el, "withReplacement"),
            )
        };
        let mut templates = Vec::with_capacity(branches.len());
        for (_, nodes, _) in &branches {
            let sub = self.push_template(Some((t, e)));
            let kids = self.add_children(o, sub, None, ROOT_SCOPE, nodes);
            self.outlined_mut(sub).children = kids;
            templates.push(sub);
        }
        let id = self.settled.choices.len();
        self.settled_mut().choices.push(ChoiceDef {
            at: (t, e),
            reactive,
            branches: templates,
            branch_keys,
            conditions: branches.iter().map(|b| b.0).collect(),
            num_to_select,
            with_replacement,
            weights: branches.iter().map(|b| b.2).collect(),
            iface: HashMap::new(),
            used: Vec::new(),
            used_at: HashMap::new(),
        });
        self.outlined_mut(t).elems[e.index()].body = Body::Choice(ChoiceId::from_index(id));
        Ok(())
    }

    /// A case's or option's content. The normalizer wraps a case's children
    /// in a `<group>`; that group is the branch itself, not content.
    fn branch_body(&self, n: NodeId) -> Vec<NodeId> {
        let d = self.dast;
        let content: Vec<NodeId> = d
            .children(n)
            .iter()
            .copied()
            .filter(|&c| !self.rd().is_blank(c))
            .collect();
        match content.as_slice() {
            [g] if d.kind(*g) == NodeKind::Element
                && d.str(*g) == "group"
                && d.attrs(*g).len() == 0 =>
            {
                d.children(*g).to_vec()
            }
            _ => d.children(n).to_vec(),
        }
    }
}

//! Choices (ADR 0009): `<conditionalContent>` and `<select>`.
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

use super::*;
use crate::components::prop::conditional_content;
use crate::limits::MAX_CASES;

impl<'a> Compiler<'a> {
    /// Give a choice element its branch templates. `<group rendered="c">`
    /// is a conditional content with one case.
    pub(in crate::compile) fn add_choice(
        &mut self,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
    ) -> Result<()> {
        let d = self.dast;
        let reactive =
            self.compiled.templates[t].elems[e].component_type == ComponentType::ConditionalContent;
        let tag = d.str(el).to_string();
        if d.attr(el, "extend").is_some() || d.attr(el, "copySource").is_some() {
            return Err(Error::Banned(format!(
                "extend on a <{tag}>: reference its interface names instead"
            )));
        }
        // (condition attribute, body nodes, weight) per branch.
        let mut branches: Vec<(Option<u32>, Vec<NodeId>, f64)> = Vec::new();
        let is_branch = |n: NodeId| {
            d.kind(n) == NodeKind::Element && matches!(d.str(n), "case" | "else" | "option")
        };
        if tag == "group" {
            branches.push((d.attr(el, "rendered"), d.children(el).to_vec(), 1.0));
        } else if reactive
            && d.attr(el, "condition").is_some()
            && !d.children(el).iter().any(|&n| is_branch(n))
        {
            branches.push((d.attr(el, "condition"), d.children(el).to_vec(), 1.0));
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
                    }
                    NodeKind::Element if !reactive && d.str(n) == "option" => {
                        let weight = match d.attr(n, "selectWeight") {
                            Some(a) => self.literal_attr(a, "selectWeight")?,
                            None => 1.0,
                        };
                        branches.push((None, self.branch_body(n), weight));
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
        let (num_to_select, with_replacement) = if reactive {
            (1, false)
        } else {
            let num = match d.attr(el, "numToSelect") {
                Some(a) => self.literal_attr(a, "numToSelect")?,
                None => 1.0,
            };
            if num < 0.0 || num.fract() != 0.0 {
                return Err(Error::BadValue {
                    attr: "numToSelect".into(),
                    text: num.to_string(),
                });
            }
            (num as u32, self.attr_flag(el, "withReplacement"))
        };
        // Whether the select can draw its picks is a fact about the source,
        // checked here and not when drawing, which a select in a repeat does
        // for every iteration a student adds (ADR 0014).
        let n = branches.len();
        if !reactive && n > 0 && num_to_select > 0 {
            if !with_replacement && num_to_select as usize > n {
                return Err(Error::Unsupported(format!(
                    "numToSelect={num_to_select} is more than the {n} options of a <select> without replacement"
                )));
            }
            let drawable = branches.iter().filter(|b| b.2 > 0.0).count();
            if drawable == 0 || !with_replacement && num_to_select as usize > drawable {
                return Err(Error::Unsupported(
                    "a <select> whose remaining options all have weight 0".into(),
                ));
            }
        }
        let mut templates = Vec::with_capacity(branches.len());
        for (_, nodes, _) in &branches {
            let sub = self.compiled.templates.len();
            self.compiled.templates.push(Template {
                parent: Some((t, e)),
                owner: self.compiled.templates[t].elems[e].node,
                ..Default::default()
            });
            let kids = self.add_children(sub, None, ROOT_SCOPE, nodes)?;
            self.compiled.templates[sub].children = kids;
            templates.push(sub);
        }
        let id = self.compiled.choices.len();
        self.compiled.choices.push(ChoiceDef {
            at: (t, e),
            reactive,
            branches: templates,
            conditions: branches.iter().map(|b| b.0).collect(),
            num_to_select,
            with_replacement,
            weights: branches.iter().map(|b| b.2).collect(),
            iface: HashMap::new(),
            used: Vec::new(),
        });
        self.compiled.templates[t].elems[e].body = Body::Choice(id);
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
            .filter(|&c| !self.is_blank(c))
            .collect();
        match content.as_slice() {
            [g] if d.kind(*g) == NodeKind::Element
                && d.str(*g) == "group"
                && d.attrs(*g).is_empty() =>
            {
                d.children(*g).to_vec()
            }
            _ => d.children(n).to_vec(),
        }
    }

    pub(in crate::compile) fn literal_attr(&self, a: u32, name: &str) -> Result<f64> {
        let text = self.attr_text(a).ok_or_else(|| Error::Banned(format!("'{name}' must be a literal number: a load-time choice depends only on the document seed and literals")))?;
        text.trim().parse::<f64>().map_err(|_| Error::BadValue {
            attr: name.into(),
            text,
        })
    }

    /// A choice's props: a select's `hide`; for a reactive choice also a
    /// hidden slot per case condition (an else is a constant 1) and
    /// `choice`, the first of them that holds.
    pub(in crate::compile) fn plan_choice(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let Body::Choice(cid) = self.compiled.templates[t].elems[e].body else {
            unreachable!()
        };
        let d = self.dast;
        let Elem {
            node,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let hide = match d.attr(node, "hide") {
            Some(a) if self.attr_text(a).is_some() => {
                Source::Fixed(if self.attr_flag(node, "hide") {
                    1.0
                } else {
                    0.0
                })
            }
            Some(a) => self.plan_value(t, scope, "hide", d.attr_children(a), None)?,
            None => Source::Fixed(0.0),
        };
        if !self.compiled.choices[cid].reactive {
            self.compiled.templates[t].elems[e].props = prop::select::Props { hide }.into_vec();
            return Ok(());
        }
        let mut wiring = ElemWiring::of(ComponentType::ConditionalContent);
        let mut conds = Vec::new();
        for c in self.compiled.choices[cid].conditions.clone() {
            conds.push(match c {
                Some(a) => self.plan_condition(t, e, &mut wiring, d.attr_children(a))?,
                None => wiring.hidden(Source::Fixed(1.0)),
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
        self.compiled.templates[t].elems[e].props = wiring.finish();
        Ok(())
    }

    /// The branch interface of every choice, once every element is planned
    /// (a tuple-valued `<math>` only becomes a point when planned), then the
    /// check that every interface name a reference uses is in it.
    pub(in crate::compile) fn finish_choices(&mut self) -> Result<()> {
        for cid in 0..self.compiled.choices.len() {
            let def = &self.compiled.choices[cid];
            // A conditional content without an else has an implicit empty
            // branch, so nothing in it is reachable from outside.
            let empty_branch = def.reactive && def.conditions.last().is_some_and(|c| c.is_some());
            let mut iface = HashMap::new();
            if !empty_branch && !def.branches.is_empty() {
                let b0 = def.branches[0];
                let first = &self.compiled.templates[b0];
                // The names visible from the first branch's root that name
                // one element each.
                for (e0, el) in first.elems.iter().enumerate() {
                    if el.name == NONE {
                        continue;
                    }
                    let name = self.dast.strings.get(el.name).trim();
                    if !matches!(self.name_at(b0, ROOT_SCOPE, name), NameHit::One(e) if e == e0) {
                        continue;
                    }
                    let component_type = el.component_type;
                    let per_branch: Option<Vec<ElemId>> = def
                        .branches
                        .iter()
                        .map(|&b| match self.name_at(b, ROOT_SCOPE, name) {
                            NameHit::One(x)
                                if self.compiled.templates[b].elems[x].component_type
                                    == component_type =>
                            {
                                Some(x)
                            }
                            _ => None,
                        })
                        .collect();
                    if let Some(per_branch) = per_branch {
                        iface.insert(name.to_string(), (component_type, per_branch));
                    }
                }
            }
            let mut failure = None;
            for name in &def.used {
                match iface.get(name) {
                    Some((component_type, _))
                        if !component_type.copyable() || component_type.symbolic() =>
                    {
                        failure = Some(Error::Unsupported(format!(
                            "a <{}> in a branch interface ('{name}')",
                            component_type.tag()
                        )));
                        break;
                    }
                    Some(_) => {}
                    None => {
                        failure = Some(self.not_in_interface(cid, name, empty_branch));
                        break;
                    }
                }
            }
            if let Some(e) = failure {
                self.fail_at_choice(cid);
                return Err(e);
            }
            self.compiled.choices[cid].iface = iface;
        }
        Ok(())
    }

    /// A failure of the interface check is reported on the choice element.
    fn fail_at_choice(&mut self, cid: ChoiceId) {
        let (t, e) = self.compiled.choices[cid].at;
        self.fail_at(self.compiled.templates[t].elems[e].node);
    }

    /// Why `name` is not in a choice's branch interface.
    fn not_in_interface(&self, cid: ChoiceId, name: &str, empty_branch: bool) -> Error {
        let def = &self.compiled.choices[cid];
        let choice = self.elem_label(def.at.0, def.at.1);
        let what = if def.reactive { "case" } else { "option" };
        let reason = if empty_branch {
            "it has no <else>, so no branch is active when every condition fails".to_string()
        } else {
            let mut first: Option<(usize, ComponentType)> = None;
            let mut reason = String::new();
            for (b, &tpl) in def.branches.iter().enumerate() {
                match self.name_at(tpl, ROOT_SCOPE, name) {
                    NameHit::One(x) => {
                        let component_type = self.compiled.templates[tpl].elems[x].component_type;
                        match first {
                            None => first = Some((b, component_type)),
                            Some((b0, type0)) if type0 != component_type => {
                                reason = format!(
                                    "'{name}' is a <{}> in {what} {} but a <{}> in {what} {}",
                                    type0.tag(),
                                    b0 + 1,
                                    component_type.tag(),
                                    b + 1
                                );
                                break;
                            }
                            _ => {}
                        }
                    }
                    NameHit::Ambiguous => {
                        reason = format!("{what} {} has several components named '{name}'", b + 1);
                        break;
                    }
                    NameHit::None => {
                        reason = format!("{what} {} has no '{name}'", b + 1);
                        break;
                    }
                }
            }
            reason
        };
        Error::NotInInterface {
            choice,
            name: name.to_string(),
            reason,
        }
    }

    /// The step for interface name `name` of choice `cid`, and the element
    /// of the first branch that has it, which stands for every branch while
    /// the rest of the path is planned (the interface check makes their
    /// types equal).
    pub(in crate::compile) fn iface_step(
        &mut self,
        cid: ChoiceId,
        name: &str,
        display: &str,
    ) -> Result<(Step, TemplateId, ElemId)> {
        let name = name.trim();
        let def = &self.compiled.choices[cid];
        let found = def
            .branches
            .iter()
            .find_map(|&b| match self.name_at(b, ROOT_SCOPE, name) {
                NameHit::One(x) => Some((b, x)),
                _ => None,
            });
        let Some((tpl, elem)) = found else {
            return Err(Error::UnknownName(display.to_string()));
        };
        let def = &mut self.compiled.choices[cid];
        let u = match def.used.iter().position(|n| n == name) {
            Some(u) => u,
            None => {
                def.used.push(name.to_string());
                def.used.len() - 1
            }
        };
        Ok((Step::Iface(cid, u as u32), tpl, elem))
    }
}

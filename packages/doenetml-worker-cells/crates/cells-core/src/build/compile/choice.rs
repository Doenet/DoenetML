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
//! branches' cells, so a flip is an ordinary tick. (An earlier version also
//! built the other mechanism, rebuilding with only the active case; it lost on every
//! tick and was removed. See ADR 0009.)

use super::*;

/// `Choose` reads the choice cell and one cell per branch; `First` one
/// condition per case. Vector operators read at most `MAX_VEC_IN`.
const MAX_CASES: usize = crate::program::MAX_VEC_IN - 1;

impl<'a> Compiler<'a> {
    /// Give a choice element its branch templates. `<group rendered="c">`
    /// is a conditional content with one case.
    pub(in crate::build) fn add_choice(
        &mut self,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
    ) -> Result<()> {
        let d = self.compiled.dast;
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
        let mut templates = Vec::with_capacity(branches.len());
        for (_, nodes, _) in &branches {
            let sub = self.compiled.templates.len();
            self.compiled.templates.push(Template {
                parent: Some((t, e)),
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
        let d = self.compiled.dast;
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

    /// A literal number attribute of a choice; a reference is banned, since
    /// a load-time choice depends only on the seed and literals (ADR 0009).
    fn literal_attr(&self, a: u32, name: &str) -> Result<f64> {
        let text = self.attr_text(a).ok_or_else(|| Error::Banned(format!("'{name}' must be a literal number: a load-time choice depends only on the document seed and literals")))?;
        text.trim().parse::<f64>().map_err(|_| Error::BadValue {
            attr: name.into(),
            text,
        })
    }

    /// A reactive choice's props: a hidden slot per case condition (an else
    /// is a constant 1) and `choice`, the first of them that holds.
    pub(in crate::build) fn plan_choice(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let Body::Choice(cid) = self.compiled.templates[t].elems[e].body else {
            unreachable!()
        };
        let d = self.compiled.dast;
        let Elem {
            node,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let hide = match d.attr(node, "hide") {
            Some(a) if self.attr_text(a).is_some() => {
                SourcePlan::Fixed(if self.attr_flag(node, "hide") {
                    1.0
                } else {
                    0.0
                })
            }
            Some(a) => self.plan_value(t, scope, "hide", d.attr_children(a), None)?,
            None => SourcePlan::Fixed(0.0),
        };
        if !self.compiled.choices[cid].reactive {
            self.compiled.templates[t].elems[e].props = vec![hide];
            return Ok(());
        }
        let mut plan = ElemPlan::new(2);
        plan.set(1, hide);
        let mut conds = Vec::new();
        for c in self.compiled.choices[cid].conditions.clone() {
            conds.push(match c {
                Some(a) => self.plan_condition(t, e, &mut plan, d.attr_children(a))?,
                None => plan.hidden(SourcePlan::Fixed(1.0)),
            });
        }
        if conds.len() > MAX_CASES {
            return Err(Error::Unsupported(format!(
                "a <conditionalContent> with more than {MAX_CASES} cases"
            )));
        }
        // After the conditions, so creation order stays an evaluation order.
        let first = plan.hidden(SourcePlan::vector(
            VecOp::First {
                n: conds.len() as u8,
            },
            conds,
        ));
        plan.set(0, SourcePlan::own(first));
        self.compiled.templates[t].elems[e].props = plan.finish();
        Ok(())
    }

    /// The branch interface of every choice, once every element is planned
    /// (a tuple-valued `<math>` only becomes a point when planned), then the
    /// check that every interface name a reference uses is in it.
    pub(in crate::build) fn finish_choices(&mut self) -> Result<()> {
        for cid in 0..self.compiled.choices.len() {
            let def = &self.compiled.choices[cid];
            // A conditional content without an else has an implicit empty
            // branch, so nothing in it is reachable from outside.
            let empty_branch = def.reactive && def.conditions.last().is_some_and(|c| c.is_some());
            let mut iface = HashMap::new();
            if !empty_branch && !def.branches.is_empty() {
                let first = &self.compiled.templates[def.branches[0]];
                for ((at, name), elems) in &first.names {
                    let [e0] = elems.as_slice() else { continue };
                    if *at != ROOT_SCOPE {
                        continue;
                    }
                    let component_type = first.elems[*e0].component_type;
                    let per_branch: Option<Vec<ElemId>> = def
                        .branches
                        .iter()
                        .map(|&b| {
                            match self.compiled.templates[b]
                                .names
                                .get(&(ROOT_SCOPE, name.clone()))
                                .map(Vec::as_slice)
                            {
                                Some([x])
                                    if self.compiled.templates[b].elems[*x].component_type
                                        == component_type =>
                                {
                                    Some(*x)
                                }
                                _ => None,
                            }
                        })
                        .collect();
                    if let Some(per_branch) = per_branch {
                        iface.insert(name.clone(), (component_type, per_branch));
                    }
                }
            }
            for name in &def.used {
                match iface.get(name) {
                    Some((component_type, _))
                        if !component_type.copyable() || component_type.symbolic() =>
                    {
                        return Err(Error::Unsupported(format!(
                            "a <{}> in a branch interface ('{name}')",
                            component_type.tag()
                        )));
                    }
                    Some(_) => {}
                    None => return Err(self.not_in_interface(cid, name, empty_branch)),
                }
            }
            self.compiled.choices[cid].iface = iface;
        }
        Ok(())
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
                match self.compiled.templates[tpl]
                    .names
                    .get(&(ROOT_SCOPE, name.to_string()))
                    .map(Vec::as_slice)
                {
                    Some([x]) => {
                        let component_type = self.compiled.templates[tpl].elems[*x].component_type;
                        match first {
                            None => first = Some((b, component_type)),
                            Some((b0, k0)) if k0 != component_type => {
                                reason = format!(
                                    "'{name}' is a <{}> in {what} {} but a <{}> in {what} {}",
                                    k0.tag(),
                                    b0 + 1,
                                    component_type.tag(),
                                    b + 1
                                );
                                break;
                            }
                            _ => {}
                        }
                    }
                    Some(_) => {
                        reason = format!("{what} {} has several components named '{name}'", b + 1);
                        break;
                    }
                    None => {
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
    pub(in crate::build) fn iface_step(
        &mut self,
        cid: ChoiceId,
        name: &str,
        display: &str,
    ) -> Result<(Step, TemplateId, ElemId)> {
        let name = name.trim();
        let def = &self.compiled.choices[cid];
        let found = def.branches.iter().find_map(|&b| {
            match self.compiled.templates[b]
                .names
                .get(&(ROOT_SCOPE, name.to_string()))
                .map(Vec::as_slice)
            {
                Some([x]) => Some((b, *x)),
                _ => None,
            }
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

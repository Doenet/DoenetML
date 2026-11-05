//! Choices finished when sealing: every choice's branch interface, which
//! reads every branch's plans.

use super::Seal;
use crate::compile::*;

impl Seal<'_> {
    /// Every choice's `used`: the interface names reference plans step
    /// into, in the order the plans first name them, and where each is.
    pub(in crate::compile) fn gather_used_names(&mut self) {
        for r in &self.compiled.refs {
            for step in &r.steps {
                if let Step::Iface(cid, id) = *step {
                    let def = &mut self.choice_seals[cid.index()];
                    if let std::collections::hash_map::Entry::Vacant(v) = def.used_at.entry(id) {
                        v.insert(def.used.len() as u32);
                        def.used.push(self.names.text(id).to_string());
                    }
                }
            }
        }
    }

    /// The branch interface of every choice, once every element is planned
    /// (a tuple-valued `<math>` only becomes a point when planned), then the
    /// check that every interface name a reference uses is in it.
    pub(in crate::compile) fn finish_choices(&mut self) -> std::result::Result<(), Failure> {
        for cid in 0..self.choices.len() {
            let def = &self.choices[cid];
            // A boxed choice has no branches to read.
            if self.view(def.at.0).is_box(def.at.1) {
                continue;
            }
            // A conditional content without an else has an implicit empty
            // branch, so nothing in it is reachable from outside.
            let empty_branch = def.reactive && def.conditions.last().is_some_and(|c| c.is_some());
            let mut iface = HashMap::new();
            if !empty_branch && !def.branches.is_empty() {
                let b0 = def.branches[0];
                let first = self.view(b0);
                // The names visible from the first branch's root that name
                // one element each.
                for (e0, el) in first.rows().enumerate() {
                    if el.name == StrId::NONE {
                        continue;
                    }
                    let name = self.dast.strings.get(el.name).trim();
                    if !matches!(self.names.at(b0, ROOT_SCOPE, name), NameHit::One(e) if e == ElemId::from_index(e0))
                    {
                        continue;
                    }
                    let component_type = el.component_type;
                    let per_branch: Option<Vec<ElemId>> = def
                        .branches
                        .iter()
                        .map(|&b| match self.names.at(b, ROOT_SCOPE, name) {
                            NameHit::One(x)
                                if self.view(b).row(x).component_type == component_type =>
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
            for name in &self.choice_seals[cid].used {
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
                        failure = Some(self.not_in_interface(
                            ChoiceId::from_index(cid),
                            name,
                            empty_branch,
                        ));
                        break;
                    }
                }
            }
            if let Some(error) = failure {
                // Reported on the choice element.
                let (t, e) = self.choices[cid].at;
                let node = self.view(t).row(e).node;
                return Err(Failure {
                    error,
                    node: (node != NodeId::NONE).then_some(node),
                });
            }
            self.choice_seals[cid].iface = iface;
        }
        Ok(())
    }

    /// Why `name` is not in a choice's branch interface.
    fn not_in_interface(&self, cid: ChoiceId, name: &str, empty_branch: bool) -> Error {
        let def = &self.choices[cid.index()];
        let choice = elem_label(
            self.dast,
            &self.templates[def.at.0.index()].elems[def.at.1.index()],
        );
        let what = if def.reactive { "case" } else { "option" };
        let reason = if empty_branch {
            "it has no <else>, so no branch is active when every condition fails".to_string()
        } else {
            let mut first: Option<(usize, ComponentType)> = None;
            let mut reason = String::new();
            for (b, &tpl) in def.branches.iter().enumerate() {
                match self.names.at(tpl, ROOT_SCOPE, name) {
                    NameHit::One(x) => {
                        let component_type = self.view(tpl).row(x).component_type;
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
}

//! References: name lookup through template scopes, and `$a.b[k].c` paths
//! turned into reference plans (`RefPlan`) that expansion resolves per
//! instance.

use super::*;

impl<'a> Compiler<'a> {
    /// A copy of plan `p` naming `prop` instead of its own (`$l` -> `$l.x2`).
    pub(in crate::build) fn plan_with_prop(&mut self, p: RefId, prop: &str) -> RefId {
        let mut plan = self.compiled.refs[p].clone();
        plan.prop = Some(prop.to_string());
        plan.display = format!("{}.{prop}", plan.display);
        self.compiled.refs.push(plan);
        self.compiled.refs.len() - 1
    }

    /// The element a plan names, if it is in template `t` itself (a path of
    /// names without indices, no prop).
    pub(in crate::build) fn plan_elem_target(&self, _t: TemplateId, p: RefId) -> Option<ElemId> {
        let plan = &self.compiled.refs[p];
        if plan.hops != 0 || plan.prop.is_some() {
            return None;
        }
        let mut last = None;
        for step in &plan.steps {
            match step {
                Step::Elem(e) => last = Some(*e),
                Step::Index(_) | Step::Iface(..) => return None,
            }
        }
        last
    }

    /// Find a name as the current core's resolver does: from the
    /// referencing element `from` (or `ROOT_SCOPE`) walk up the ancestors;
    /// at each, the ancestor's own name wins, then a unique descendant with
    /// the name; several descendants are an ambiguity. Then continue in the
    /// enclosing template from the repeat element. Returns (hops, element).
    pub(in crate::build) fn lookup(
        &self,
        mut t: TemplateId,
        mut from: ElemId,
        name: &str,
    ) -> Result<Option<(u32, ElemId)>> {
        let name = name.trim();
        let mut hops = 0;
        loop {
            let tpl = &self.compiled.templates[t];
            let mut a = from;
            loop {
                if a != ROOT_SCOPE
                    && tpl.elems[a].name != NONE
                    && self.compiled.dast.strings.get(tpl.elems[a].name).trim() == name
                {
                    return Ok(Some((hops, a)));
                }
                match tpl.names.get(&(a, name.to_string())).map(Vec::as_slice) {
                    Some([e]) => return Ok(Some((hops, *e))),
                    Some([_, _, ..]) => return Err(Error::AmbiguousName(name.to_string())),
                    _ => {}
                }
                if a == ROOT_SCOPE {
                    break;
                }
                a = tpl.elems[a].name_scope;
            }
            let Some((pt, pe)) = tpl.parent else {
                return Ok(None);
            };
            from = pe;
            t = pt;
            hops += 1;
        }
    }

    /// A unique descendant of `e` with `name`, for a dotted path.
    pub(in crate::build) fn child_named(
        &self,
        t: TemplateId,
        e: ElemId,
        name: &str,
    ) -> Result<Option<ElemId>> {
        match self.compiled.templates[t]
            .names
            .get(&(e, name.trim().to_string()))
            .map(Vec::as_slice)
        {
            Some([c]) => Ok(Some(*c)),
            Some([_, _, ..]) => Err(Error::AmbiguousName(name.trim().to_string())),
            _ => Ok(None),
        }
    }

    pub(in crate::build) fn plan_ref(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        m: NodeId,
    ) -> Result<RefId> {
        let d = self.compiled.dast;
        let display = d.macro_display(m);
        let names = d.macro_path(m);
        let parts: Vec<_> = d.macro_parts(m).collect();
        let first = d.strings.get(names[0]);
        let (hops, e0) = self
            .lookup(t, scope, first)?
            .ok_or_else(|| Error::UnknownName(first.into()))?;
        let mut cur_t = t;
        for _ in 0..hops {
            cur_t = self.compiled.templates[cur_t].parent.unwrap().0;
        }
        let mut steps = vec![Step::Elem(e0)];
        let mut at = At::Elem(e0);
        let mut prop = None;
        // Past an interface name only props may follow.
        let mut after_iface = false;
        for (i, &part) in parts.iter().enumerate() {
            if i > 0 {
                let name = d.strings.get(names[i]);
                let choice_here = match at {
                    At::Elem(e) if !after_iface => {
                        match self.compiled.templates[cur_t].elems[e].body {
                            Body::Choice(cid)
                                if self.compiled.templates[cur_t].elems[e]
                                    .component_type
                                    .prop_index(name)
                                    .is_none() =>
                            {
                                Some(cid)
                            }
                            _ => None,
                        }
                    }
                    At::SelectPick(cid) => Some(cid),
                    _ => None,
                };
                if let Some(cid) = choice_here {
                    if matches!(at, At::Elem(_)) && !self.compiled.choices[cid].reactive {
                        // `$s.x` is `$s[1].x` when the select picks one option.
                        if self.compiled.choices[cid].num_to_select != 1 {
                            return Err(Error::Banned(format!(
                                "'${display}' needs an index: the select picks {} options",
                                self.compiled.choices[cid].num_to_select
                            )));
                        }
                        steps.push(Step::Index(IndexPlan {
                            terms: vec![IndexTerm::Const(1)],
                        }));
                    }
                    let (step, tpl, x) = self.iface_step(cid, name, &display)?;
                    steps.push(step);
                    cur_t = tpl;
                    at = At::Elem(x);
                    after_iface = true;
                    if d.part_indices(part).next().is_some() {
                        return Err(Error::Banned(format!(
                            "'${display}': an index after an interface name"
                        )));
                    }
                    continue;
                }
                match at {
                    // A select's pick always takes the choice branch above.
                    At::Iteration | At::SelectPick(_) => {
                        let e = self
                            .child_named(cur_t, ROOT_SCOPE, name)?
                            .ok_or_else(|| Error::UnknownName(display.clone()))?;
                        steps.push(Step::Elem(e));
                        at = At::Elem(e);
                    }
                    // A descendant of the component: `$g.p`.
                    At::Elem(e) if !after_iface && self.child_named(cur_t, e, name)?.is_some() => {
                        let child = self.child_named(cur_t, e, name)?.unwrap();
                        steps.push(Step::Elem(child));
                        at = At::Elem(child);
                    }
                    At::Elem(e) => {
                        let component_type = self.compiled.templates[cur_t].elems[e].component_type;
                        let component_type = match self.compiled.templates[cur_t].elems[e].body {
                            // After `$c[k]` the component is a collected copy.
                            Body::Collect {
                                component_type: ck, ..
                            } if steps.len() > 1 => ck,
                            _ => component_type,
                        };
                        // `$l.points[1]`, `$l.points[1][2]`, `$l.points[2].y`:
                        // items of an array prop, by literal index.
                        let name = component_type.canonical_prop(name);
                        if let Some(items) = component_type.array_prop(name) {
                            let idx: Vec<i64> = d
                                .part_indices(part)
                                .map(|expr| self.literal_index(expr, &display))
                                .collect::<Result<_>>()?;
                            let (Some(&k), rest) = (idx.first(), &idx[1.min(idx.len())..]) else {
                                if i + 1 != parts.len() {
                                    return Err(Error::PathTooDeep(display));
                                }
                                prop = Some(name.to_string());
                                break;
                            };
                            if k < 1 || k as usize > items.len() {
                                return Err(Error::BadIndex(display));
                            }
                            let item = items[k as usize - 1];
                            let coord = match (rest.first(), parts.get(i + 1)) {
                                (Some(&j), None) => Some(j),
                                (None, Some(_)) if i + 2 == parts.len() => {
                                    Some(match d.strings.get(names[i + 1]).trim() {
                                        "x" | "1" => 1,
                                        "y" | "2" => 2,
                                        _ => return Err(Error::PathTooDeep(display)),
                                    })
                                }
                                (None, None) => None,
                                _ => return Err(Error::PathTooDeep(display)),
                            };
                            prop = Some(match coord {
                                Some(1) => item[0].to_string(),
                                Some(2) => item[1].to_string(),
                                Some(_) => return Err(Error::BadIndex(display)),
                                None => component_type
                                    .array_item_prop(name, k as usize)
                                    .ok_or_else(|| Error::PathTooDeep(display.clone()))?,
                            });
                            break;
                        }
                        // `$l.point1[2]`: a coordinate of a point-valued prop.
                        if let (Some(parts_of), Some(expr)) = (
                            component_type.virtual_prop(name),
                            d.part_indices(part).next(),
                        ) {
                            let k = self.literal_index(expr, &display)?;
                            if !(1..=2).contains(&k)
                                || d.part_indices(part).nth(1).is_some()
                                || i + 1 != parts.len()
                            {
                                return Err(Error::PathTooDeep(display));
                            }
                            prop = Some(parts_of[k as usize - 1].to_string());
                            break;
                        }
                        if d.part_indices(part).next().is_some() {
                            return Err(Error::PathTooDeep(display));
                        }
                        // A prop name, or a coordinate of a point-valued prop
                        // (`$c.center.y`), which must end the path.
                        if i + 1 != parts.len() {
                            let parts_of = component_type
                                .virtual_prop(name)
                                .ok_or_else(|| Error::PathTooDeep(display.clone()))?;
                            let coord = d.strings.get(names[i + 1]).trim();
                            let j = match coord {
                                "x" | "1" => 0,
                                "y" | "2" => 1,
                                _ => return Err(Error::PathTooDeep(display)),
                            };
                            if i + 2 != parts.len() {
                                return Err(Error::PathTooDeep(display));
                            }
                            prop = Some(parts_of[j].to_string());
                            break;
                        }
                        if component_type.prop_index(name).is_none()
                            && component_type.virtual_prop(name).is_none()
                            && component_type.array_prop(name).is_none()
                        {
                            return Err(Error::UnknownProp {
                                name: self.elem_label(cur_t, e),
                                prop: name.into(),
                            });
                        }
                        prop = Some(name.to_string());
                        break;
                    }
                }
            }
            for expr in d.part_indices(part) {
                let At::Elem(e) = at else {
                    if matches!(at, At::SelectPick(_)) {
                        return Err(Error::Banned(format!(
                            "'${display}' reaches into a select's option by position; name the content and use $s[k].name"
                        )));
                    }
                    return Err(Error::NotIndexable(display));
                };
                // `$p[2]`: a coordinate of a point.
                let ek = self.compiled.templates[cur_t].elems[e].component_type;
                if let Some(parts_of) = ek.default_prop().and_then(|dp| ek.virtual_prop(dp)) {
                    if prop.is_some() || i + 1 != parts.len() {
                        return Err(Error::PathTooDeep(display));
                    }
                    let k = self.literal_index(expr, &display)?;
                    if !(1..=parts_of.len() as i64).contains(&k) {
                        return Err(Error::BadIndex(display));
                    }
                    prop = Some(parts_of[k as usize - 1].to_string());
                    continue;
                }
                match self.compiled.templates[cur_t].elems[e].body {
                    Body::Repeat { template } => {
                        let ip = self.plan_index(t, expr, &display)?;
                        steps.push(Step::Index(ip));
                        cur_t = template;
                        at = At::Iteration;
                    }
                    // A collect's or point list's item: still that component.
                    Body::Collect { .. } => {
                        let ip = self.plan_index(t, expr, &display)?;
                        steps.push(Step::Index(ip));
                    }
                    Body::Choice(cid) if !self.compiled.choices[cid].reactive && !after_iface => {
                        let ip = self.plan_index(t, expr, &display)?;
                        steps.push(Step::Index(ip));
                        at = At::SelectPick(cid);
                    }
                    _ if self.compiled.templates[cur_t].elems[e].component_type
                        == ComponentType::PointList =>
                    {
                        let ip = self.plan_index(t, expr, &display)?;
                        steps.push(Step::Index(ip));
                    }
                    _ => return Err(Error::NotIndexable(display)),
                }
            }
        }
        // A bare `$s` names the one option a select picks.
        if let (At::Elem(e), None, false) = (at, &prop, after_iface)
            && let Body::Choice(cid) = self.compiled.templates[cur_t].elems[e].body
            && !self.compiled.choices[cid].reactive
        {
            if self.compiled.choices[cid].num_to_select != 1 {
                return Err(Error::Banned(format!(
                    "'${display}' needs an index: the select picks {} options",
                    self.compiled.choices[cid].num_to_select
                )));
            }
            steps.push(Step::Index(IndexPlan {
                terms: vec![IndexTerm::Const(1)],
            }));
        }
        self.compiled.refs.push(RefPlan {
            hops,
            steps,
            prop,
            display,
        });
        Ok(self.compiled.refs.len() - 1)
    }

    /// A literal integer index (array props are static, so `[$n]` is not
    /// supported on them).
    pub(in crate::build) fn literal_index(&self, expr: &[NodeId], display: &str) -> Result<i64> {
        let d = self.compiled.dast;
        let mut text = String::new();
        for &n in expr {
            match d.kind(n) {
                NodeKind::Text => text.push_str(d.str(n)),
                NodeKind::Macro => return Err(Error::DynamicIndex(display.to_string())),
                _ => {}
            }
        }
        text.trim()
            .parse::<i64>()
            .map_err(|_| Error::BadIndex(display.to_string()))
    }

    /// An index expression: a sum of literal integers and iteration indices.
    pub(in crate::build) fn plan_index(
        &self,
        t: TemplateId,
        expr: &[NodeId],
        display: &str,
    ) -> Result<IndexPlan> {
        let d = self.compiled.dast;
        let mut terms = Vec::new();
        for &n in expr {
            match d.kind(n) {
                NodeKind::Text => {
                    let s: String = d.str(n).chars().filter(|c| !c.is_whitespace()).collect();
                    if s.is_empty() {
                        continue;
                    }
                    terms.push(IndexTerm::Const(
                        s.trim_start_matches('+')
                            .parse::<i64>()
                            .map_err(|_| Error::BadIndex(display.to_string()))?,
                    ));
                }
                NodeKind::Macro => {
                    let path = d.macro_path(n);
                    if path.len() != 1 || d.macro_has_index(n) {
                        return Err(Error::DynamicIndex(display.to_string()));
                    }
                    let name = d.strings.get(path[0]);
                    let (hops, e) = self
                        .lookup(t, ROOT_SCOPE, name)?
                        .ok_or_else(|| Error::UnknownName(name.into()))?;
                    let mut tt = t;
                    for _ in 0..hops {
                        tt = self.compiled.templates[tt].parent.unwrap().0;
                    }
                    let el = &self.compiled.templates[tt].elems[e];
                    match (el.component_type, el.props.first()) {
                        (ComponentType::Number, Some(SourcePlan::IterIndex)) => {
                            terms.push(IndexTerm::Iter(hops))
                        }
                        _ => return Err(Error::DynamicIndex(display.to_string())),
                    }
                }
                _ => {}
            }
        }
        Ok(IndexPlan { terms })
    }
}

/// Where a reference path stands while `plan_ref` walks it.
#[derive(Clone, Copy)]
enum At {
    /// At an element of the current template.
    Elem(ElemId),
    /// Right after an index into a repeat: inside an iteration, before a
    /// name picks an element.
    Iteration,
    /// Right after `$s[k]` on a select: the next name is an interface name.
    SelectPick(ChoiceId),
}

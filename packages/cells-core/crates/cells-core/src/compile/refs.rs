//! References: name lookup through template scopes, and `$a.b[k].c` paths
//! turned into reference plans (`RefPlan`) that expansion resolves per
//! instance.

use super::*;

/// What a reference names, as far as the templates tell: its type, and
/// the last element its path named (`Compiler::ref_target`).
pub(in crate::compile) type RefTarget = (Option<ComponentType>, Option<(TemplateId, ElemId)>);

impl<'a> Compiler<'a> {
    /// A copy of plan `p` naming `prop` instead of its own (`$l` -> `$l.x2`).
    pub(in crate::compile) fn plan_with_prop(
        &mut self,
        t: TemplateId,
        p: RefId,
        prop: &'static str,
    ) -> RefId {
        let of = self.ref_target_type(t, p).ok().flatten();
        let mut plan = self.compiled.refs[p.index()].clone();
        plan.prop = Some(RefProp::named(of, prop));
        plan.display = RefDisplay::Prop(Box::new(plan.display), prop);
        self.compiled.refs.push(plan);
        RefId::from_index(self.compiled.refs.len() - 1)
    }

    /// Prop `name` (a DAST string) of type `ty`, found once per type and
    /// spelling: a reference reads it with no name to compare.
    fn prop_sel(&mut self, ty: ComponentType, name: StrId) -> Option<PropSel> {
        let i = name.index();
        if let Some(Some((of, sel))) = self.prop_sels.get(i)
            && *of == ty
        {
            return *sel;
        }
        let sel = ty.resolve_prop(ty.canonical_prop(self.dast.strings.get(name)));
        if self.prop_sels.len() <= i {
            self.prop_sels
                .resize(self.dast.strings.len().max(i + 1), None);
        }
        self.prop_sels[i] = Some((ty, sel));
        sel
    }

    /// Prop `name` of what plan `p`, planned from `t`, names: resolved on
    /// its type when the compile knows it.
    pub(in crate::compile) fn prop_named(
        &mut self,
        t: TemplateId,
        p: RefId,
        name: &'static str,
    ) -> RefProp {
        RefProp::named(self.ref_target_type(t, p).ok().flatten(), name)
    }

    /// The template `hops` levels up from `t`: the one a plan's names are
    /// looked up in.
    pub(in crate::compile) fn template_up(&self, mut t: TemplateId, hops: u32) -> TemplateId {
        for _ in 0..hops {
            t = self.compiled.templates[t.index()]
                .parent
                .expect("a plan's hops stay within the template nesting")
                .0;
        }
        t
    }

    /// The element a plan names, wherever it is up the template nesting,
    /// when the path is names only (no index, no interface), with its
    /// template. The plan may name a prop of it.
    pub(in crate::compile) fn static_target(
        &self,
        t: TemplateId,
        p: RefId,
    ) -> Option<(TemplateId, ElemId)> {
        let plan = &self.compiled.refs[p.index()];
        let mut last = None;
        for step in &plan.steps {
            match step {
                Step::Elem(e) => last = Some(*e),
                Step::Index(_) | Step::Iface(..) => return None,
            }
        }
        last.map(|e| (self.template_up(t, plan.hops), e))
    }

    /// The element a plan names, if it is in template `t` itself (a path of
    /// names without indices, no prop).
    pub(in crate::compile) fn plan_elem_target(&self, t: TemplateId, p: RefId) -> Option<ElemId> {
        let plan = &self.compiled.refs[p.index()];
        if plan.hops != 0 || plan.prop.is_some() {
            return None;
        }
        self.static_target(t, p).map(|(_, e)| e)
    }

    /// The component type a plan names, when it can be told from the
    /// templates alone: the element its path ends at, as outlining made
    /// it (`outlined_elem`), through the repeats and collects an index
    /// steps into. `None` past an interface name (settled after planning)
    /// or where the path cannot be followed.
    pub(in crate::compile) fn ref_target_type(
        &mut self,
        t: TemplateId,
        p: RefId,
    ) -> Result<Option<ComponentType>> {
        Ok(self.ref_target(t, p)?.0)
    }

    /// `ref_target_type`, and the last element the path named on the way
    /// (the target, or the collect an index steps into).
    pub(in crate::compile) fn ref_target(&mut self, t: TemplateId, p: RefId) -> Result<RefTarget> {
        let hops = self.compiled.refs[p.index()].hops;
        let mut t = t;
        for _ in 0..hops {
            let Some((pt, _)) = self.compiled.templates[t.index()].parent else {
                return Ok((None, None));
            };
            t = pt;
        }
        let mut cur: Option<ElemId> = None;
        let mut last = None;
        let mut ty = None;
        for i in 0..self.compiled.refs[p.index()].steps.len() {
            match self.compiled.refs[p.index()].steps[i] {
                Step::Elem(e) => {
                    cur = Some(e);
                    last = Some((t, e));
                    ty = Some(self.outlined_elem(t, e)?.component_type);
                }
                Step::Index(_) => {
                    let Some(c) = cur else {
                        return Ok((None, last));
                    };
                    match self.compiled.templates[t.index()].elems[c.index()].body {
                        Body::Repeat { template } => {
                            t = template;
                            cur = None;
                            ty = None;
                        }
                        Body::Collect { component_type, .. } => ty = Some(component_type),
                        _ => return Ok((None, last)),
                    }
                }
                Step::Iface(..) => return Ok((None, last)),
            }
        }
        Ok((ty, last))
    }

    /// Find a name as the current core's resolver does: from the
    /// referencing element `from` (or `ROOT_SCOPE`) walk up the ancestors;
    /// at each, the ancestor's own name wins, then a unique descendant with
    /// the name; several descendants are an ambiguity. Then continue in the
    /// enclosing template from the repeat or choice element. Returns
    /// (hops, element).
    pub(in crate::compile) fn lookup(
        &self,
        t: TemplateId,
        from: ElemId,
        name: StrId,
    ) -> Result<Option<(u32, ElemId)>> {
        let names = self.names();
        let Some(id) = names.id_of(self.dast, name) else {
            return Ok(None);
        };
        self.lookup_id(t, from, id)
            .map_err(|()| Error::AmbiguousName(self.dast.strings.get(name).trim().to_string()))
    }

    /// `lookup` of name `id`; `Err` when the name is ambiguous.
    fn lookup_id(
        &self,
        mut t: TemplateId,
        mut from: ElemId,
        id: u32,
    ) -> std::result::Result<Option<(u32, ElemId)>, ()> {
        let names = self.names();
        let mut hops = 0;
        loop {
            let tpl = &self.compiled.templates[t.index()];
            let mut a = from;
            loop {
                if a != ROOT_SCOPE {
                    let own = tpl.elems[a.index()].name;
                    if own != StrId::NONE && names.id_of(self.dast, own) == Some(id) {
                        return Ok(Some((hops, a)));
                    }
                }
                match names.at_id(t, a, id) {
                    NameHit::One(e) => return Ok(Some((hops, e))),
                    NameHit::Ambiguous => return Err(()),
                    NameHit::None => {}
                }
                if a == ROOT_SCOPE {
                    break;
                }
                a = tpl.elems[a.index()].name_scope;
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
    pub(in crate::compile) fn child_named(
        &self,
        t: TemplateId,
        e: ElemId,
        name: StrId,
    ) -> Result<Option<ElemId>> {
        let names = self.names();
        let hit = match names.id_of(self.dast, name) {
            Some(id) => names.at_id(t, e, id),
            None => NameHit::None,
        };
        match hit {
            NameHit::One(c) => Ok(Some(c)),
            NameHit::Ambiguous => Err(Error::AmbiguousName(
                self.dast.strings.get(name).trim().to_string(),
            )),
            NameHit::None => Ok(None),
        }
    }

    pub(in crate::compile) fn plan_ref(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        m: NodeId,
    ) -> Result<RefId> {
        let _s = crate::trace::tally("plan ref");
        let d = self.dast;
        let g = crate::trace::tally("parts");
        let display = Written(d, m);
        let names = d.macro_path(m);
        let parts: Vec<_> = d.macro_parts(m).collect();
        drop(g);
        let g = crate::trace::tally("lookup");
        let (hops, e0) = self
            .lookup(t, scope, names[0])?
            .ok_or_else(|| Error::UnknownName(d.strings.get(names[0]).into()))?;
        let mut cur_t = self.template_up(t, hops);
        drop(g);
        let path = crate::trace::tally("path");
        let mut steps = vec![Step::Elem(e0)];
        let mut at = At::Elem(e0);
        let mut prop = None;
        // Past an interface name only props may follow.
        let mut after_iface = false;
        for (i, &part) in parts.iter().enumerate() {
            // An element outlined as a box (an earlier compile's, or one
            // outlining could not read) has no props, children or items: a
            // path through it ends at it, and reads as undefined when built
            // (ADR 0027). A box made in place keeps what outlining made of
            // it, so the path goes on, the same in every stage and order
            // (ADR 0031), and the build reads what is under a box as
            // undefined.
            if let At::Elem(e) = at
                && self.compiled.templates[cur_t.index()].elems[e.index()].component_type
                    == ComponentType::Error
            {
                break;
            }
            if i > 0 {
                let name = d.strings.get(names[i]);
                // What follows an element's name is read from its type,
                // body or children, as outlining made them.
                if let At::Elem(e) = at
                    && !after_iface
                {
                    self.outlined_elem(cur_t, e)?;
                }
                let choice_here = match at {
                    At::Elem(e) if !after_iface => {
                        match self.compiled.templates[cur_t.index()].elems[e.index()].body {
                            Body::Choice(cid)
                                if self.compiled.templates[cur_t.index()].elems[e.index()]
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
                    if matches!(at, At::Elem(_)) && !self.compiled.choices[cid.index()].reactive {
                        // `$s.x` is `$s[1].x` when the select picks one option.
                        if self.compiled.choices[cid.index()].num_to_select != 1 {
                            return Err(Error::Banned(format!(
                                "'${display}' needs an index: the select picks {} options",
                                self.compiled.choices[cid.index()].num_to_select
                            )));
                        }
                        steps.push(Step::Index(IndexPlan {
                            terms: vec![IndexTerm::Const(1)],
                        }));
                    }
                    let (step, tpl, x) = self.iface_step(cid, name, display)?;
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
                            .child_named(cur_t, ROOT_SCOPE, names[i])?
                            .ok_or_else(|| Error::UnknownName(display.to_string()))?;
                        steps.push(Step::Elem(e));
                        at = At::Elem(e);
                    }
                    // A descendant of the component: `$g.p`.
                    At::Elem(e)
                        if let Some(child) = (!after_iface)
                            .then(|| self.child_named(cur_t, e, names[i]))
                            .transpose()?
                            .flatten() =>
                    {
                        steps.push(Step::Elem(child));
                        at = At::Elem(child);
                    }
                    At::Elem(e) => {
                        let component_type =
                            self.compiled.templates[cur_t.index()].elems[e.index()].component_type;
                        let component_type =
                            match self.compiled.templates[cur_t.index()].elems[e.index()].body {
                                // After `$c[k]` the component is a collected copy.
                                Body::Collect {
                                    component_type: ck, ..
                                } if steps.len() > 1 => ck,
                                _ => component_type,
                            };
                        // `$l.points[1]`, `$l.points[1][2]`, `$l.points[2].y`:
                        // points of a list, by literal index. The prop is
                        // found once per type and spelling (`prop_sel`).
                        let sel = self.prop_sel(component_type, names[i]);
                        let prop_of = |sel| RefProp::of(component_type, sel);
                        // A list's points are as many as the element has: an
                        // index past them is the missing value when built.
                        let list = component_type
                            .given_coords()
                            .filter(|_| sel == Some(PropSel::At(PropAt::List)));
                        let items = (sel == Some(PropSel::TableList))
                            .then(|| component_type.table_points())
                            .flatten();
                        if list.is_some() || items.is_some() {
                            let items = items.unwrap_or(&[]);
                            let idx: Vec<i64> = d
                                .part_indices(part)
                                .map(|expr| self.literal_index(expr, display))
                                .collect::<Result<_>>()?;
                            let (Some(&k), rest) = (idx.first(), &idx[1.min(idx.len())..]) else {
                                if i + 1 != parts.len() {
                                    return Err(Error::PathTooDeep(display.to_string()));
                                }
                                prop = sel.map(prop_of);
                                break;
                            };
                            if k < 1 || (list.is_none() && k as usize > items.len()) {
                                return Err(Error::BadIndex(display.to_string()));
                            }
                            let k = k as usize;
                            let coord_sel = |j: usize| match list {
                                Some(_) => PropSel::At(PropAt::Coord(k, j)),
                                None => PropSel::At(PropAt::Position(
                                    component_type.parts_sel(&items[k - 1]).parts()[j] as usize,
                                )),
                            };
                            let coord = match (rest.first(), parts.get(i + 1)) {
                                (Some(&j), None) => Some(j),
                                (None, Some(_)) if i + 2 == parts.len() => {
                                    Some(match d.strings.get(names[i + 1]).trim() {
                                        "x" | "1" => 1,
                                        "y" | "2" => 2,
                                        _ => return Err(Error::PathTooDeep(display.to_string())),
                                    })
                                }
                                (None, None) => None,
                                _ => return Err(Error::PathTooDeep(display.to_string())),
                            };
                            prop = Some(prop_of(match (coord, list) {
                                (Some(1), _) => coord_sel(0),
                                (Some(2), _) => coord_sel(1),
                                (Some(_), _) => return Err(Error::BadIndex(display.to_string())),
                                (None, Some(_)) => PropSel::At(PropAt::Item(k)),
                                (None, None) => component_type.parts_sel(&items[k - 1]),
                            }));
                            break;
                        }
                        // The coordinates of a point-valued prop: a combined prop
                        // (`center`) or a list's point (`vertex3`).
                        let given_item = |sel: Option<PropSel>| match sel {
                            Some(PropSel::At(PropAt::Item(k))) => {
                                component_type.given_coords().map(|_| k)
                            }
                            _ => None,
                        };
                        let point_parts =
                            matches!(sel, Some(PropSel::Parts { .. })) || given_item(sel).is_some();
                        // Coordinate `j` (0-based) of the point-valued prop.
                        let part_sel = |j: usize| match (sel, given_item(sel)) {
                            (Some(s @ PropSel::Parts { .. }), _) => s
                                .parts()
                                .get(j)
                                .map(|&pi| PropSel::At(PropAt::Position(pi as usize))),
                            (_, Some(k)) => (j < 2).then_some(PropSel::At(PropAt::Coord(k, j))),
                            _ => None,
                        };
                        // `$l.point1[2]`: a coordinate of a point-valued prop.
                        if let (true, Some(expr)) = (point_parts, d.part_indices(part).next()) {
                            let k = self.literal_index(expr, display)?;
                            if !(1..=2).contains(&k)
                                || d.part_indices(part).nth(1).is_some()
                                || i + 1 != parts.len()
                            {
                                return Err(Error::PathTooDeep(display.to_string()));
                            }
                            prop = part_sel(k as usize - 1).map(prop_of);
                            break;
                        }
                        if d.part_indices(part).next().is_some() {
                            return Err(Error::PathTooDeep(display.to_string()));
                        }
                        // A prop name, or a coordinate of a point-valued prop
                        // (`$c.center.y`), which must end the path.
                        if i + 1 != parts.len() {
                            if !point_parts {
                                return Err(Error::PathTooDeep(display.to_string()));
                            }
                            let coord = d.strings.get(names[i + 1]).trim();
                            let j = match coord {
                                "x" | "1" => 0,
                                "y" | "2" => 1,
                                _ => return Err(Error::PathTooDeep(display.to_string())),
                            };
                            if i + 2 != parts.len() {
                                return Err(Error::PathTooDeep(display.to_string()));
                            }
                            prop = part_sel(j).map(prop_of);
                            break;
                        }
                        let Some(sel) = sel else {
                            return Err(Error::UnknownProp {
                                name: self.elem_label(cur_t, e),
                                prop: component_type.canonical_prop(name).into(),
                            });
                        };
                        prop = Some(prop_of(sel));
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
                    return Err(Error::NotIndexable(display.to_string()));
                };
                // `$p[2]`: a coordinate of a point (a `<math>` may be one).
                let ek = self.outlined_elem(cur_t, e)?.component_type;
                if let Some(dsel @ PropSel::Parts { .. }) = ek.default_sel() {
                    if prop.is_some() || i + 1 != parts.len() {
                        return Err(Error::PathTooDeep(display.to_string()));
                    }
                    let k = self.literal_index(expr, display)?;
                    let parts_of = dsel.parts();
                    if !(1..=parts_of.len() as i64).contains(&k) {
                        return Err(Error::BadIndex(display.to_string()));
                    }
                    let pi = parts_of[k as usize - 1] as usize;
                    prop = Some(RefProp::of(ek, PropSel::At(PropAt::Position(pi))));
                    continue;
                }
                match self.compiled.templates[cur_t.index()].elems[e.index()].body {
                    Body::Repeat { template } => {
                        let ip = self.plan_index(t, expr, display)?;
                        steps.push(Step::Index(ip));
                        cur_t = template;
                        at = At::Iteration;
                    }
                    // A collect's or point list's item: still that component.
                    Body::Collect { .. } => {
                        let ip = self.plan_index(t, expr, display)?;
                        steps.push(Step::Index(ip));
                    }
                    Body::Choice(cid)
                        if !self.compiled.choices[cid.index()].reactive && !after_iface =>
                    {
                        let ip = self.plan_index(t, expr, display)?;
                        steps.push(Step::Index(ip));
                        at = At::SelectPick(cid);
                    }
                    _ if self.compiled.templates[cur_t.index()].elems[e.index()].component_type
                        == ComponentType::PointList =>
                    {
                        let ip = self.plan_index(t, expr, display)?;
                        steps.push(Step::Index(ip));
                    }
                    _ => return Err(Error::NotIndexable(display.to_string())),
                }
            }
        }
        // A bare `$s` names the one option a select picks.
        if let (At::Elem(e), None, false) = (at, &prop, after_iface)
            && let Body::Choice(cid) = self.compiled.templates[cur_t.index()].elems[e.index()].body
            && !self.compiled.choices[cid.index()].reactive
        {
            if self.compiled.choices[cid.index()].num_to_select != 1 {
                return Err(Error::Banned(format!(
                    "'${display}' needs an index: the select picks {} options",
                    self.compiled.choices[cid.index()].num_to_select
                )));
            }
            steps.push(Step::Index(IndexPlan {
                terms: vec![IndexTerm::Const(1)],
            }));
        }
        drop(path);
        // A `$mi` in a `<when>` that names an input stands for the answer's
        // submitted copy of it (`Settled::submitted`), a fact outlining
        // settled: the path planned to the input is planned to the copy,
        // whose props the input's prop names.
        let (hops, steps) = match self.submitted(m) {
            Some(r) => (0, vec![Step::Elem(r)]),
            None => (hops, steps),
        };
        let _p = crate::trace::tally("push");
        self.compiled.refs.push(RefPlan {
            hops,
            steps,
            prop,
            display: RefDisplay::Written,
            node: m,
        });
        Ok(RefId::from_index(self.compiled.refs.len() - 1))
    }

    /// A literal integer index (list props are static, so `[$n]` is not
    /// supported on them).
    pub(in crate::compile) fn literal_index(
        &self,
        expr: &[NodeId],
        display: impl std::fmt::Display,
    ) -> Result<i64> {
        let d = self.dast;
        if expr.iter().any(|&n| d.kind(n) == NodeKind::Macro) {
            return Err(Error::DynamicIndex(display.to_string()));
        }
        // The text of the nodes as one, trimmed: read in place.
        let chars = expr
            .iter()
            .filter(|&&n| d.kind(n) == NodeKind::Text)
            .flat_map(|&n| d.str(n).chars())
            .skip_while(|c| c.is_whitespace());
        parse_index(chars).ok_or_else(|| Error::BadIndex(display.to_string()))
    }

    /// An index expression: a sum of literal integers and iteration indices.
    pub(in crate::compile) fn plan_index(
        &self,
        t: TemplateId,
        expr: &[NodeId],
        display: impl std::fmt::Display + Copy,
    ) -> Result<IndexPlan> {
        let d = self.dast;
        let mut terms = Vec::new();
        for &n in expr {
            match d.kind(n) {
                NodeKind::Text => {
                    let s = d.str(n);
                    if s.chars().all(char::is_whitespace) {
                        continue;
                    }
                    // Whitespace anywhere is no part of the term, nor are
                    // leading `+`s: `$i + 1`, `$i - 1`.
                    let chars = s
                        .chars()
                        .filter(|c| !c.is_whitespace())
                        .skip_while(|&c| c == '+');
                    let k =
                        parse_index(chars).ok_or_else(|| Error::BadIndex(display.to_string()))?;
                    terms.push(IndexTerm::Const(k));
                }
                NodeKind::Macro => {
                    let path = d.macro_path(n);
                    if path.len() != 1 || d.macro_has_index(n) {
                        return Err(Error::DynamicIndex(display.to_string()));
                    }
                    let (hops, e) = self
                        .lookup(t, ROOT_SCOPE, path[0])?
                        .ok_or_else(|| Error::UnknownName(d.strings.get(path[0]).into()))?;
                    let tt = self.template_up(t, hops);
                    // An iteration index name (`indexName`): the hidden
                    // `<number>` outlining makes for it, the only one it
                    // makes. Read from outlining's row, so a reference
                    // planned before the repeat (a `<math>`'s, when
                    // parsing) finds it too.
                    let el = &self.compiled.templates[tt.index()].elems[e.index()];
                    let index_name = el.component_type == ComponentType::Number
                        && el.node == NodeId::NONE
                        && !el.cloned;
                    if !index_name {
                        return Err(Error::DynamicIndex(display.to_string()));
                    }
                    terms.push(IndexTerm::Iter(hops));
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

/// A reference as written (`Dast::macro_display`), spelled only when an
/// error formats it: planning a reference builds no string.
#[derive(Clone, Copy)]
pub(in crate::compile) struct Written<'d>(
    pub(in crate::compile) &'d Dast,
    pub(in crate::compile) NodeId,
);

impl std::fmt::Display for Written<'_> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.0.macro_display(self.1))
    }
}

/// An integer as `str::parse::<i64>` reads it, from `chars` with no
/// leading whitespace, trailing whitespace allowed (`str::trim`'s end):
/// one optional sign, then ASCII digits, within `i64`. Reads the source
/// in place: no string is built.
fn parse_index(mut chars: impl Iterator<Item = char>) -> Option<i64> {
    let mut first = chars.next()?;
    let negative = first == '-';
    if first == '-' || first == '+' {
        first = chars.next()?;
    }
    let mut value: i64 = 0;
    let mut c = Some(first);
    while let Some(ch) = c {
        let Some(digit) = ch.to_digit(10) else {
            // Only whitespace may follow the digits.
            return (ch.is_whitespace() && chars.all(char::is_whitespace)).then_some(value);
        };
        let digit = i64::from(digit);
        value = value.checked_mul(10)?;
        value = if negative {
            value.checked_sub(digit)?
        } else {
            value.checked_add(digit)?
        };
        c = chars.next();
    }
    Some(value)
}

/// What both outlining and planning read of a reference: an `extend`'s
/// plan, its referent's type, and a choice's interface a path steps into.
impl Compiler<'_> {
    /// Element `e` as outlining made it, for a reference to read on
    /// through. A container copy whose clones outlining has not made yet
    /// is not there to read: the read fails naming it, for outlining to
    /// make them and plan the reference again (`with_clones`). So planning
    /// a reference makes nothing, in whichever stage (ADR 0031).
    pub(in crate::compile) fn outlined_elem(&self, t: TemplateId, e: ElemId) -> Result<&Elem> {
        let el = &self.compiled.templates[t.index()].elems[e.index()];
        if el.clones_pending {
            return Err(Error::AwaitsClones {
                template: t.get(),
                elem: e.get(),
            });
        }
        Ok(el)
    }

    /// The reference in `e`'s `extend`, planned once, when outlining, from
    /// where `e` sits (ADR 0031): first for a container copy, which needs it
    /// for its clones, then for every other element (`plan_extends`). It is
    /// outlining's row's `extend`.
    pub(in crate::compile) fn plan_extend(
        &mut self,
        t: TemplateId,
        e: ElemId,
    ) -> Result<Option<RefId>> {
        if let Some(p) = self.compiled.templates[t.index()].elems[e.index()].extend {
            return Ok(Some(p));
        }
        let Elem {
            node, name_scope, ..
        } = self.compiled.templates[t.index()].elems[e.index()];
        let Some(a) = self.dast.attr(node, "extend") else {
            return Ok(None);
        };
        let m = self.single_macro(a).ok_or_else(|| Error::BadValue {
            attr: "extend".into(),
            text: self.attr_text(a).unwrap_or_default(),
        })?;
        let p = self.plan_ref(t, name_scope, m)?;
        // `<math extend="$n"/>`, `<mathInput extend="$m"/>`: an extend
        // across related types is the referent's value as the element's
        // type (REF-5, ADR 0025), so it is the extend of its default prop,
        // decided here from the types outlining settled. An unrelated pair
        // is left to the build, which refuses it once both types are
        // known. A container copy names its referent itself.
        let component_type = self.compiled.templates[t.index()].elems[e.index()].component_type;
        if !component_type.container()
            && self.compiled.refs[p.index()].prop.is_none()
            && let Ok(Some(rt)) = self.ref_target_type(t, p)
            && rt != component_type
            && ComponentType::extends_as(rt, component_type)
            && let Some(dp) = rt.default_prop()
        {
            let r = &mut self.compiled.refs[p.index()];
            r.prop = Some(RefProp::named(Some(rt), dp));
            let base = std::mem::replace(&mut r.display, RefDisplay::Written);
            r.display = RefDisplay::Prop(Box::new(base), dp);
        }
        debug_assert!(self.outlining.is_some(), "only outlining plans an extend");
        self.compiled.templates[t.index()].elems[e.index()].extend = Some(p);
        Ok(Some(p))
    }

    /// The type of what `p` names, as outlining settled it, for `e`'s planner
    /// to decide its plan by (an extend, `<constrainTo>`, ...). A box has
    /// no type to plan from, so `e` is boxed in turn, its referent's box
    /// the cause: here for a referent already boxed, when linking for one
    /// boxed after `e` is planned (`box_readers_of_boxes`).
    pub(in crate::compile) fn referent_type(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
    ) -> Result<Option<ComponentType>> {
        match &mut self.outlining {
            Some(o) => o.work.settled.referent_readers.push((t, e, p)),
            None => self.planning().referent_readers.push((t, e, p)),
        }
        self.read_referent(t, p)
    }

    /// The type of what `p` names, or, when it is a box this stage may see
    /// (`is_visible_box`; one outlined as `Error` always), the error that
    /// boxes what reads it.
    pub(in crate::compile) fn read_referent(
        &mut self,
        t: TemplateId,
        p: RefId,
    ) -> Result<Option<ComponentType>> {
        let (ty, last) = self.ref_target(t, p)?;
        let boxed = ty == Some(ComponentType::Error)
            || last.is_some_and(|(lt, le)| self.is_visible_box(lt, le));
        if boxed {
            return Err(Error::BoxedReferent(self.compiled.ref_display(p)));
        }
        Ok(ty)
    }

    /// The step for interface name `name` of choice `cid`, and the element
    /// of the first branch that has it, which stands for every branch while
    /// the rest of the path is planned (the interface check makes their
    /// types equal).
    pub(in crate::compile) fn iface_step(
        &self,
        cid: ChoiceId,
        name: &str,
        display: impl std::fmt::Display,
    ) -> Result<(Step, TemplateId, ElemId)> {
        let name = name.trim();
        let def = &self.compiled.choices[cid.index()];
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
        // A branch carries the name, so the name table has it. Which
        // names references use is sealing's to gather (ADR 0031).
        let id = self.names().id(name).expect("a name a branch carries");
        Ok((Step::Iface(cid, id), tpl, elem))
    }
}

#[cfg(test)]
mod tests {
    use super::parse_index;

    /// `parse_index` reads as the string-building readers it replaced: a
    /// `plan_index` term (whitespace stripped, leading `+`s dropped) and
    /// a `literal_index` (trimmed).
    #[test]
    fn index_text_reads_as_parse_does() {
        let cases = [
            "1",
            " 2 ",
            "+ 1",
            " - 1",
            "-1",
            "+-1",
            "-+1",
            "++3",
            "+",
            "-",
            "",
            "  ",
            "1 2",
            "12a",
            "a",
            "007",
            "-0",
            "1.5",
            "9223372036854775807",
            "9223372036854775808",
            "-9223372036854775808",
            "-9223372036854775809",
            "\u{a0}4\u{a0}",
            "٣",
            "1\t",
            "+ -",
        ];
        for case in cases {
            let stripped: String = case.chars().filter(|c| !c.is_whitespace()).collect();
            let old = stripped.trim_start_matches('+').parse::<i64>().ok();
            let chars = case
                .chars()
                .filter(|c| !c.is_whitespace())
                .skip_while(|&c| c == '+');
            assert_eq!(parse_index(chars), old, "term {case:?}");
            let old = case.trim().parse::<i64>().ok();
            let chars = case.chars().skip_while(|c| c.is_whitespace());
            assert_eq!(parse_index(chars), old, "literal {case:?}");
        }
    }
}

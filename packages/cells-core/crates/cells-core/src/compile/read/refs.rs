//! References: name lookup through template scopes, and `$a.b[k].c` paths
//! turned into reference plans ([`RefPlan`]) that expansion resolves per
//! instance.

use crate::compile::*;

/// What a reference names, as far as the templates tell: its type, and
/// the last element its path named.
pub(in crate::compile) type RefTarget = (Option<ComponentType>, Option<(TemplateId, ElemId)>);

/// Reference plans: name lookup through template scopes and `$a.b[k].c` paths,
/// run by outlining, parsing and planning (ADR 0031, "Code more than one stage
/// runs"). Writes only the reference arena.
impl<'a> Reader<'a> {
    /// A copy of plan `p` naming `prop` instead of its own (`$l` -> `$l.x2`).
    pub(in crate::compile) fn plan_with_prop(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        p: RefId,
        prop: &'static str,
    ) -> Result<RefId> {
        let named = self.prop_named(ar, t, p, prop)?;
        let mut plan = ar.refs[p.index()].clone();
        plan.prop = named;
        plan.display = RefDisplay::Prop(Box::new(plan.display), prop);
        Ok(ar.push_ref(plan))
    }

    /// Prop `name` of what plan `p`, planned from `t`, names, resolved on
    /// the type the path reaches. None where the templates reach no type: a
    /// box, what is under one, or a whole pick or iteration holding several
    /// components.
    pub(in crate::compile) fn prop_named(
        &self,
        ar: &Arenas,
        t: TemplateId,
        p: RefId,
        name: &'static str,
    ) -> Result<Option<RefProp>> {
        match self.ref_target_type(ar, t, p)? {
            None => Ok(None),
            Some(ty) if ty.plays(Role::Refused) => Ok(None),
            Some(ty) => RefProp::named(ty, name)
                .map(Some)
                .ok_or_else(|| Error::UnknownProp {
                    name: ar.ref_display(self.dast, p),
                    prop: name.into(),
                }),
        }
    }

    /// The template `hops` levels up from `t`: the one a plan's names are
    /// looked up in.
    pub(in crate::compile) fn template_up(&self, mut t: TemplateId, hops: u32) -> TemplateId {
        for _ in 0..hops {
            t = self
                .outlined(t)
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
        ar: &Arenas,
        t: TemplateId,
        p: RefId,
    ) -> Option<(TemplateId, ElemId)> {
        let plan = &ar.refs[p.index()];
        if !plan.entries.is_empty() {
            return None;
        }
        let mut last = None;
        for step in &plan.steps {
            match step {
                Step::Elem(e) => last = Some(*e),
                Step::Iter(_) | Step::Item(..) | Step::Iface(..) => return None,
            }
        }
        last.map(|e| (self.template_up(t, plan.hops), e))
    }

    /// The element a plan names, if it is in template `t` itself (a path of
    /// names without indices, no prop).
    pub(in crate::compile) fn plan_elem_target(
        &self,
        ar: &Arenas,
        t: TemplateId,
        p: RefId,
    ) -> Option<ElemId> {
        let plan = &ar.refs[p.index()];
        if plan.hops != 0 || plan.prop.is_some() {
            return None;
        }
        self.static_target(ar, t, p).map(|(_, e)| e)
    }

    /// The component type a plan names, when it can be told from the
    /// templates alone: the type of the element its path ends at, as
    /// outlining made it. `None` where the path cannot be followed, or
    /// names a whole iteration or pick that holds several components.
    pub(in crate::compile) fn ref_target_type(
        &self,
        ar: &Arenas,
        t: TemplateId,
        p: RefId,
    ) -> Result<Option<ComponentType>> {
        Ok(self.ref_target(ar, t, p)?.0)
    }

    /// `ref_target_type`, and the last element the path named on the way
    /// (the target, or the collect an index steps into).
    pub(in crate::compile) fn ref_target(
        &self,
        ar: &Arenas,
        t: TemplateId,
        p: RefId,
    ) -> Result<RefTarget> {
        let hops = ar.refs[p.index()].hops;
        let mut t = t;
        for _ in 0..hops {
            let Some((pt, _)) = self.outlined(t).parent else {
                return Ok((None, None));
            };
            t = pt;
        }
        let mut cur: Option<ElemId> = None;
        let mut last = None;
        let mut ty = None;
        for i in 0..ar.refs[p.index()].steps.len() {
            match ar.refs[p.index()].steps[i].clone() {
                Step::Elem(e) => {
                    cur = Some(e);
                    last = Some((t, e));
                    ty = Some(self.outlined_elem(t, e)?.component_type);
                }
                Step::Iter(_) => {
                    let Some(c) = cur else {
                        return Ok((None, last));
                    };
                    let Body::Repeat { template } = self.outlined(t).elems[c.index()].body else {
                        return Ok((None, last));
                    };
                    t = template;
                    cur = None;
                    // A bare `$r[k]` names the one component of the
                    // iteration, when the body holds one.
                    ty = self.single_child_type(t);
                }
                Step::Item(Collection::Gathered, _) => {
                    let Some(c) = cur else {
                        return Ok((None, last));
                    };
                    let Body::Collect { component_type } = self.outlined(t).elems[c.index()].body
                    else {
                        return Ok((None, last));
                    };
                    ty = Some(component_type);
                }
                Step::Item(Collection::ListPoints, _) => ty = Some(Role::ListPoint.ty()),
                Step::Item(Collection::Picks, _) => {
                    let Some(c) = cur else {
                        return Ok((None, last));
                    };
                    let Body::Choice(cid) = self.outlined(t).elems[c.index()].body else {
                        return Ok((None, last));
                    };
                    // A whole pick may be any option: its type is known
                    // when every option holds one component of one type.
                    let branches = self.choice(cid).branches.clone();
                    let mut types = branches.iter().map(|&b| self.single_child_type(b));
                    let first = types.next().flatten();
                    cur = None;
                    ty = first.filter(|_| types.all(|x| x == first));
                }
                Step::Item(_, _) => return Ok((None, last)),
                Step::Iface(cid, id) => {
                    let name = self.names().text(id).to_string();
                    let Ok((_, bt, be)) = self.iface_step(cid, &name, "") else {
                        return Ok((None, last));
                    };
                    t = bt;
                    cur = Some(be);
                    ty = Some(self.outlined(bt).elems[be.index()].component_type);
                }
            }
        }
        Ok((ty, last))
    }

    /// The type of the one component template `t` holds at its top, when
    /// it holds exactly one and that is an element (a `$ref` child's type
    /// is known only when it resolves).
    fn single_child_type(&self, t: TemplateId) -> Option<ComponentType> {
        let mut comps = self
            .outlined(t)
            .children
            .iter()
            .filter(|c| !matches!(c, Child::Text(_)));
        match (comps.next(), comps.next()) {
            (Some(Child::Elem(e)), None) => Some(self.outlined(t).elems[e.index()].component_type),
            _ => None,
        }
    }

    /// Find a name: from the referencing element `from` (or `ROOT_SCOPE`)
    /// walk up the ancestors; at each, the ancestor's own name wins, then a
    /// unique descendant with the name; several descendants are an
    /// ambiguity. Then continue in the enclosing template from the repeat
    /// or choice element. Returns (hops, element).
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
        id: NameId,
    ) -> std::result::Result<Option<(u32, ElemId)>, ()> {
        let names = self.names();
        let mut hops = 0;
        loop {
            let tpl = self.outlined(t);
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
        &self,
        ar: &mut Arenas,
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
        let mut entries = Vec::new();
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
                && self.outlined(cur_t).elems[e.index()]
                    .component_type
                    .plays(Role::Refused)
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
                        match self.outlined(cur_t).elems[e.index()].body {
                            Body::Choice(cid)
                                if self.outlined(cur_t).elems[e.index()]
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
                    if matches!(at, At::Elem(_)) && !self.choice(cid).reactive {
                        // `$s.x` is `$s[1].x` when the select picks one option.
                        self.picks_one(cid, &display.to_string())?;
                        steps.push(Step::Item(
                            Collection::Picks,
                            IndexPlan {
                                terms: vec![IndexTerm::Const(1)],
                            },
                        ));
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
                        let component_type = self.outlined(cur_t).elems[e.index()].component_type;
                        let component_type = match self.outlined(cur_t).elems[e.index()].body {
                            // After `$c[k]` the component is a collected copy.
                            Body::Collect {
                                component_type: ck, ..
                            } if steps.len() > 1 => ck,
                            _ => component_type,
                        };
                        // `$l.points[1]`, `$l.points[$k][2]`, `$l.points[2].y`:
                        // points of a list, by any index (ADR 0041). The prop is
                        // found once per type and spelling (`prop_sel`).
                        let sel = ar.prop_sel(self.dast, component_type, names[i]);
                        let prop_of = |sel| RefProp::of(component_type, sel);
                        // `$l.numbers[k]`: an entry of a value list, its
                        // count known only to the build (ADR 0041).
                        if sel == Some(PropSel::At(PropAt::List))
                            && component_type.list_width() == 1
                        {
                            let mut indices = d.part_indices(part);
                            if let Some(first) = indices.next() {
                                if indices.next().is_some() || i + 1 != parts.len() {
                                    return Err(Error::PathTooDeep(display.to_string()));
                                }
                                let index = self.plan_entry_index(ar, t, scope, first, display)?;
                                entries.push(EntryIndex { index, width: 1 });
                            } else if i + 1 != parts.len() {
                                return Err(Error::PathTooDeep(display.to_string()));
                            }
                            prop = sel.map(prop_of);
                            break;
                        }
                        // A list's points are as many as the element has: an
                        // index past them is the missing value when built.
                        let list = component_type
                            .given_coords()
                            .filter(|_| component_type.lists_points())
                            .filter(|_| sel == Some(PropSel::At(PropAt::List)));
                        let items = (sel == Some(PropSel::TableList))
                            .then(|| component_type.table_points())
                            .flatten();
                        if list.is_some() || items.is_some() {
                            let items = items.unwrap_or(&[]);
                            let mut indices = d.part_indices(part);
                            let Some(first) = indices.next() else {
                                if i + 1 != parts.len() {
                                    return Err(Error::PathTooDeep(display.to_string()));
                                }
                                prop = sel.map(prop_of);
                                break;
                            };
                            let second = indices.next();
                            if indices.next().is_some() {
                                return Err(Error::PathTooDeep(display.to_string()));
                            }
                            let point = self.plan_entry_index(ar, t, scope, first, display)?;
                            // The coordinate: a second index, or `.x`, `.y`
                            // after the point.
                            let coord = match (second, parts.get(i + 1)) {
                                (Some(expr), None) => {
                                    Some(self.plan_entry_index(ar, t, scope, expr, display)?)
                                }
                                (None, Some(_)) if i + 2 == parts.len() => Some(
                                    IndexPlan::constant(match d.strings.get(names[i + 1]).trim() {
                                        "x" | "1" => 1,
                                        "y" | "2" => 2,
                                        _ => {
                                            return Err(Error::PathTooDeep(display.to_string()));
                                        }
                                    }),
                                ),
                                (None, None) => None,
                                _ => return Err(Error::PathTooDeep(display.to_string())),
                            };
                            // A literal point is the element's own: of a
                            // list, at any position (past the points it has
                            // is the missing value when built); of a
                            // table, one it has.
                            let fixed = point.constant_value().filter(|&k| {
                                k >= 1 && (list.is_some() || k as usize <= items.len())
                            });
                            let Some(k) = fixed else {
                                // Any other is an entry of the whole list's
                                // points (ADR 0041).
                                let whole = match list {
                                    Some(_) => PropSel::At(PropAt::List),
                                    None => {
                                        let flat: Vec<&str> =
                                            items.iter().flatten().copied().collect();
                                        if flat.len() > crate::components::MAX_PARTS {
                                            return Err(Error::Unsupported(format!(
                                                "'${display}': an index other than a literal into more than {} points",
                                                crate::components::MAX_PARTS / 2
                                            )));
                                        }
                                        component_type.parts_sel(&flat)
                                    }
                                };
                                prop = Some(prop_of(whole));
                                entries.push(EntryIndex {
                                    index: point,
                                    width: 2,
                                });
                                if let Some(coord) = coord {
                                    entries.push(EntryIndex {
                                        index: coord,
                                        width: 1,
                                    });
                                }
                                break;
                            };
                            let k = k as usize;
                            let point_sel = match list {
                                Some(_) => PropSel::At(PropAt::Item(k)),
                                None => component_type.parts_sel(&items[k - 1]),
                            };
                            let coord_sel = |j: usize| match list {
                                Some(_) => PropSel::At(PropAt::Coord(k, j)),
                                None => {
                                    PropSel::At(PropAt::Position(point_sel.parts()[j] as usize))
                                }
                            };
                            prop = Some(prop_of(match coord {
                                None => point_sel,
                                Some(coord) => match coord.entry_in(2) {
                                    Some(j) => coord_sel(j - 1),
                                    None => {
                                        entries.push(EntryIndex {
                                            index: coord,
                                            width: 1,
                                        });
                                        point_sel
                                    }
                                },
                            }));
                            break;
                        }
                        // The coordinates of a point-valued prop: a combined prop
                        // (`center`) or a list's point (`vertex3`).
                        let given_item = |sel: Option<PropSel>| match sel {
                            Some(PropSel::At(PropAt::Item(k))) => {
                                component_type.lists_points().then_some(k)
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
                            if d.part_indices(part).nth(1).is_some() || i + 1 != parts.len() {
                                return Err(Error::PathTooDeep(display.to_string()));
                            }
                            let index = self.plan_entry_index(ar, t, scope, expr, display)?;
                            let n = match sel {
                                Some(s @ PropSel::Parts { .. }) => s.parts().len(),
                                _ => 2,
                            };
                            // A literal in range is that coordinate; any
                            // other index an entry (ADR 0041).
                            prop = match index.entry_in(n) {
                                Some(k) => part_sel(k - 1).map(prop_of),
                                None => {
                                    entries.push(EntryIndex { index, width: 1 });
                                    sel.map(prop_of)
                                }
                            };
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
                // `$l[k]`: an entry of a value list (ADR 0041), whose
                // count only the build knows.
                if let Some(dsel @ PropSel::At(PropAt::List)) = ek.default_sel()
                    && ek.list_width() == 1
                {
                    if prop.is_some() || i + 1 != parts.len() {
                        return Err(Error::PathTooDeep(display.to_string()));
                    }
                    let index = self.plan_entry_index(ar, t, scope, expr, display)?;
                    entries.push(EntryIndex { index, width: 1 });
                    prop = Some(RefProp::of(ek, dsel));
                    continue;
                }
                if let Some(dsel @ PropSel::Parts { .. }) = ek.default_sel() {
                    if prop.is_some() || i + 1 != parts.len() {
                        return Err(Error::PathTooDeep(display.to_string()));
                    }
                    let index = self.plan_entry_index(ar, t, scope, expr, display)?;
                    let parts_of = dsel.parts();
                    // A literal in range is that coordinate; any other
                    // index is an entry of them, the missing value when it
                    // names none (ADR 0041).
                    prop = Some(RefProp::of(
                        ek,
                        match index.entry_in(parts_of.len()) {
                            Some(k) => PropSel::At(PropAt::Position(parts_of[k - 1] as usize)),
                            None => {
                                entries.push(EntryIndex { index, width: 1 });
                                dsel
                            }
                        },
                    ));
                    continue;
                }
                // The step's kind is the body's (ADR 0032, decision 5): the
                // build walks what the kind says and asks no type.
                match self.outlined(cur_t).elems[e.index()].body {
                    Body::Repeat { template } => {
                        let ip = self.plan_index(ar, t, scope, expr, display)?;
                        steps.push(Step::Iter(ip));
                        cur_t = template;
                        at = At::Iteration;
                    }
                    // A collect's item: still that component.
                    Body::Collect { .. } => {
                        let ip = self.plan_index(ar, t, scope, expr, display)?;
                        steps.push(Step::Item(Collection::Gathered, ip));
                    }
                    Body::Choice(cid) if !self.choice(cid).reactive && !after_iface => {
                        let ip = self.plan_index(ar, t, scope, expr, display)?;
                        // Which option a pick is comes from the seed, not a
                        // cell.
                        if ip.is_dynamic() {
                            return Err(Error::DynamicIndex(display.to_string()));
                        }
                        steps.push(Step::Item(Collection::Picks, ip));
                        at = At::SelectPick(cid);
                    }
                    _ if self.outlined(cur_t).elems[e.index()]
                        .component_type
                        .holds_list_points() =>
                    {
                        let ip = self.plan_index(ar, t, scope, expr, display)?;
                        steps.push(Step::Item(Collection::ListPoints, ip));
                    }
                    _ => return Err(Error::NotIndexable(display.to_string())),
                }
            }
        }
        // A bare `$s` names the one option a select picks.
        if let (At::Elem(e), None, false) = (at, &prop, after_iface)
            && let Body::Choice(cid) = self.outlined(cur_t).elems[e.index()].body
            && !self.choice(cid).reactive
        {
            self.picks_one(cid, &display.to_string())?;
            steps.push(Step::Item(
                Collection::Picks,
                IndexPlan {
                    terms: vec![IndexTerm::Const(1)],
                },
            ));
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
        let plan = RefPlan {
            hops,
            steps,
            prop,
            entries,
            display: RefDisplay::Written,
            node: m,
        };
        Ok(ar.push_ref(plan))
    }

    /// The index of an entry of a port's sequence (`$P[k]`,
    /// `$l.points[k]`, ADR 0041): a literal, or one reference to a cell
    /// (`$P[$k]`), an iteration's index name among them. A literal that is
    /// a number but no integer (`2.5`) names nothing, as zero does.
    pub(in crate::compile) fn plan_entry_index(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        expr: &[NodeId],
        display: impl std::fmt::Display,
    ) -> Result<IndexPlan> {
        let d = self.dast;
        let mut macros = expr.iter().filter(|&&n| d.kind(n) == NodeKind::Macro);
        if let Some(&m) = macros.next() {
            let only = macros.next().is_none()
                && expr
                    .iter()
                    .all(|&n| d.kind(n) != NodeKind::Text || d.str(n).trim().is_empty());
            if !only {
                return Err(Error::DynamicIndex(display.to_string()));
            }
            let p = self.plan_ref(ar, t, scope, m)?;
            return Ok(IndexPlan {
                terms: vec![IndexTerm::Cell(p)],
            });
        }
        // The text of the nodes as one, trimmed: read in place.
        let chars = || {
            expr.iter()
                .filter(|&&n| d.kind(n) == NodeKind::Text)
                .flat_map(|&n| d.str(n).chars())
                .skip_while(|c| c.is_whitespace())
        };
        if let Some(k) = parse_index(chars()) {
            return Ok(IndexPlan::constant(k));
        }
        if names_nothing(&chars().collect::<String>()) {
            return Ok(IndexPlan::constant(0));
        }
        Err(Error::BadIndex(display.to_string()))
    }

    /// An index expression: a sum of literal integers and iteration
    /// indices, or one reference to a cell (`$r[$n]`), which the build
    /// reads when the document runs. A cell plus a literal is not read as a
    /// sum: the reference is the whole index.
    pub(in crate::compile) fn plan_index(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        expr: &[NodeId],
        display: impl std::fmt::Display + Copy,
    ) -> Result<IndexPlan> {
        let d = self.dast;
        let mut terms = Vec::new();
        let mut nothing = false;
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
                    let text: String = chars.collect();
                    match parse_index(text.chars()) {
                        Some(k) => terms.push(IndexTerm::Const(k)),
                        // A number that is no integer: the whole index
                        // names nothing, whatever else it adds (ADR 0041).
                        None if names_nothing(&text) => nothing = true,
                        None => return Err(Error::BadIndex(display.to_string())),
                    }
                }
                NodeKind::Macro => {
                    let path = d.macro_path(n);
                    let index_name = path.len() == 1 && !d.macro_has_index(n) && {
                        let (hops, e) = self
                            .lookup(t, ROOT_SCOPE, path[0])?
                            .ok_or_else(|| Error::UnknownName(d.strings.get(path[0]).into()))?;
                        let tt = self.template_up(t, hops);
                        // An iteration index name (`indexName`): the hidden
                        // index outlining makes for it, the only component
                        // of that role it makes. Read from outlining's
                        // row, so a reference planned before the repeat (a
                        // `<math>`'s, when parsing) finds it too.
                        let el = &self.outlined(tt).elems[e.index()];
                        let is_index = el.component_type.plays(Role::Index)
                            && el.node == NodeId::NONE
                            && !el.cloned;
                        if is_index {
                            terms.push(IndexTerm::Iter(hops));
                        }
                        is_index
                    };
                    if !index_name {
                        // A cell: the whole index.
                        if !terms.is_empty() {
                            return Err(Error::DynamicIndex(display.to_string()));
                        }
                        let p = self.plan_ref(ar, t, scope, n)?;
                        terms.push(IndexTerm::Cell(p));
                    }
                }
                _ => {}
            }
        }
        // A literal after a cell is as unsupported as one before it.
        if terms.len() > 1 && terms.iter().any(|t| matches!(t, IndexTerm::Cell(_))) {
            return Err(Error::DynamicIndex(display.to_string()));
        }
        if nothing {
            return Ok(IndexPlan::constant(0));
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

/// A reference as written, spelled only when an error formats it.
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

/// Record that element `e` of template `t` read the facts of what `p` names
/// (its type, its row, its children), so it is boxed when that is.
pub(in crate::compile) fn record_read(reads: &mut Vec<Read>, t: TemplateId, e: ElemId, p: RefId) {
    reads.push((t, e, p));
}

/// Whether index text that is no integer is still a number (`2.5`, `NaN`),
/// so the index names nothing rather than being refused (ADR 0041,
/// decision 3: an index is never rounded).
fn names_nothing(text: &str) -> bool {
    text.trim().parse::<f64>().is_ok()
}

/// An integer as `str::parse::<i64>` reads it, from `chars` with no
/// leading whitespace, trailing whitespace allowed: one optional sign, then
/// ASCII digits, within `i64`.
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

/// What both outlining and planning read of a reference: its referent's type,
/// and a choice's interface a path steps into.
impl<'a> Reader<'a> {
    /// A reference `display` naming the one option select `cid` picks
    /// needs the select to pick one, which only a literal `numToSelect`
    /// says while planning.
    pub(in crate::compile) fn picks_one(&self, cid: ChoiceId, display: &str) -> Result<()> {
        match self.choice(cid).num_to_select {
            Some(1) => Ok(()),
            Some(n) => Err(Error::Banned(format!(
                "'${display}' needs an index: the select picks {n} options"
            ))),
            None => Err(Error::Banned(format!(
                "'${display}' needs an index: the select's numToSelect is not a literal 1"
            ))),
        }
    }

    /// Element `e` as outlining made it, for a reference to read on
    /// through. Fails naming a container copy whose clones outlining has
    /// not made yet.
    pub(in crate::compile) fn outlined_elem(&self, t: TemplateId, e: ElemId) -> Result<&'a Elem> {
        let el = self.elem(t, e);
        if el.clones_pending {
            return Err(Error::AwaitsClones {
                template: t.get(),
                elem: e.get(),
            });
        }
        Ok(el)
    }

    /// The type of what `p` names, as outlining settled it, for `e`'s
    /// planner to decide its plan by. Fails when the referent is a box, so
    /// `e` is boxed in turn. The read is recorded in `reads`.
    pub(in crate::compile) fn referent_type(
        &self,
        ar: &Arenas,
        boxes: Visible<'_>,
        reads: &mut Vec<Read>,
        t: TemplateId,
        e: ElemId,
        p: RefId,
    ) -> Result<Option<ComponentType>> {
        record_read(reads, t, e, p);
        self.read_referent(ar, boxes, t, p)
    }

    /// The type of what `p` names, or, when it is a box this stage may see,
    /// the error that boxes what reads it.
    pub(in crate::compile) fn read_referent(
        &self,
        ar: &Arenas,
        boxes: Visible<'_>,
        t: TemplateId,
        p: RefId,
    ) -> Result<Option<ComponentType>> {
        let (ty, last) = self.ref_target(ar, t, p)?;
        let boxed = ty.is_some_and(|ty| ty.plays(Role::Refused))
            || last.is_some_and(|(lt, le)| boxes.is_box(lt, le));
        if boxed {
            return Err(Error::BoxedReferent(ar.ref_display(self.dast, p)));
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
        let def = self.choice(cid);
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

    /// `parse_index` reads as `str::parse` does a `plan_index` term
    /// (whitespace stripped, leading `+`s dropped) and a
    /// `plan_entry_index` literal (trimmed).
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

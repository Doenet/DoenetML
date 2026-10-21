//! Compile's output, which expand reads: one [`Template`] per repeat body,
//! choice branch and the document, with a plan for every element's props
//! and every reference. Nothing here names an iteration; see `build/mod.rs`.

use super::*;

/// An element's identity across loads of one document, what saved state
/// names it by, assigned by the compile: its DAST node and 0; for an element the build makes (an
/// answer's implicit input, a container copy's clones, a repeat's hidden
/// iteration components), the node of the nearest element it belongs to
/// and its 1-based position among the elements made for that node.
pub type ElemKey = (NodeId, u32);

pub(crate) type TemplateId = usize;
pub(crate) type ElemId = usize;
pub(crate) type RefId = usize;
pub(crate) type ChoiceId = usize;

// ---------------------------------------------------------------------------
// Compiled templates
// ---------------------------------------------------------------------------

/// A cell an operator reads or a slot aliases, named before any iteration
/// exists: a reference (with a selector into what it names), one of the
/// element's own slots, or a slot of another element in the same template.
#[derive(Debug, Clone, Copy)]
pub(crate) enum Arg {
    Ref(RefId, Sel),
    Own(u8),
    /// A copy with overridden attributes shares the rest of the original's
    /// essential state through this.
    Elem(ElemId, u8),
}

/// Which cell of a reference's target: the single cell, coordinate `j` of a
/// point-valued prop, or coordinate `j` of item `i` of an array prop.
#[derive(Debug, Clone, Copy)]
pub(crate) enum Sel {
    Whole,
    Coord(u8),
    Item(u8, u8),
}

/// Where a prop's value comes from, before any iteration exists.
#[derive(Debug, Clone)]
pub(crate) enum SourcePlan {
    /// An essential cell with this initial value.
    Literal(f64),
    /// An essential text cell: a string id, or NaN for none.
    TextLiteral(f64),
    /// An essential cell with the type's default value.
    Default(f64),
    /// The matching slot of the `extend` referent.
    Inherit,
    /// Slot `k` of the `extend` referent: an `Inherit` a gate moved.
    InheritFrom(u8),
    /// A constant that is not state.
    Fixed(f64),
    Alias(Arg),
    /// Operator over cells.
    Op(OpSpec, Vec<Arg>),
    /// The 1-based position of the enclosing iteration.
    IterIndex,
    /// A `<selectFromSequence>`'s value: `from + step * k` for a `k` below
    /// `count` drawn per instance from the document seed (ADR 0009).
    SequencePick {
        from: f64,
        step: f64,
        count: u32,
    },
    /// Math text: lowered to operators if numeric, else NaN.
    Math(ExprId),
    /// A `<math>`'s `expr` prop: NaN when the math is numeric (it lowers),
    /// else as `SymExpr`.
    MathHandle(ExprId, Post),
    /// A `<math>`'s `value` prop: the literal if the expression is a
    /// number, the lowered operators if numeric, else an `Evaluate` of its
    /// `expr`.
    MathValue(ExprId),
    /// A math cell from math text (`Compiled::sym_text`): a fixed handle
    /// without cell leaves, an alias of a lone math leaf, else an
    /// `Instantiate` instruction over the leaves.
    SymExpr(ExprId, Post),
    /// An essential math cell (an unbound mathInput's `expr`, an answer's
    /// `submitted`) holding this expression, or blank (NaN).
    MathEssential(Option<Tree>),
    /// An essential math cell whose initial expression is the value the
    /// reference names when the cell is first built (a mathInput's
    /// `prefill="$n"`): a seed, not a binding.
    MathEssentialFrom(RefId),
    /// `first` in the first iteration of the enclosing repeat, `rest` in
    /// the others (a function iterate: the initial value, else `f` of the
    /// previous iterate). Chosen per instance, like `IterIndex`.
    FirstIteration(Box<SourcePlan>, Box<SourcePlan>),
    /// Output `k` of the vector instruction headed at own slot `head`
    /// (an `Op(OpSpec::Vec(..))`, which is output 0).
    /// Wired once the whole tree is built, from what is around the element
    /// (`build/expand/scoring.rs`, a collect's expansion): no plan can say
    /// it, so the plan says that it is deferred and who fills it.
    Deferred(Deferred),
    VecOut(u8, u8),
}

impl SourcePlan {
    pub(crate) fn reference(p: RefId) -> Self {
        SourcePlan::Alias(Arg::Ref(p, Sel::Whole))
    }
    pub(crate) fn coord(p: RefId, j: usize) -> Self {
        SourcePlan::Alias(Arg::Ref(p, Sel::Coord(byte(j))))
    }
    pub(crate) fn item(p: RefId, i: usize, j: usize) -> Self {
        SourcePlan::Alias(Arg::Ref(p, Sel::Item(byte(i), byte(j))))
    }
    pub(crate) fn own(slot: usize) -> Self {
        SourcePlan::Alias(Arg::Own(own_slot(slot)))
    }
    /// Operator over the element's own slots.
    pub(crate) fn computed(op: OpSpec, args: Vec<usize>) -> Self {
        SourcePlan::Op(
            op,
            args.into_iter().map(|a| Arg::Own(own_slot(a))).collect(),
        )
    }
    /// A type's `PropFrom::Computed` prop.
    pub(crate) fn from_def(op: OpSpec, args: &[u8]) -> Self {
        SourcePlan::Op(op, args.iter().map(|&a| Arg::Own(a)).collect())
    }
    /// Head of a vector instruction over own slots; this slot is output 0,
    /// the next `n_out - 1` slots are `VecOut`.
    pub(crate) fn vector(op: VecOp, args: Vec<usize>) -> Self {
        SourcePlan::computed(OpSpec::Vec(op), args)
    }
}

#[derive(Debug, Clone)]
pub(crate) enum Child {
    Elem(ElemId),
    Text(StrId),
    /// A `$ref` child: a copy or a number, decided when it resolves. The
    /// flag says whether the path carries an index.
    Macro(RefId, bool),
}

#[derive(Debug, Clone)]
pub(crate) enum Body {
    Plain,
    Repeat {
        template: TemplateId,
    },
    Collect {
        from: RefId,
        component_type: ComponentType,
    },
    /// `<pointList extend="$l.points">`: children are synthesized points.
    PointList {
        from: RefId,
    },
    /// A `<conditionalContent>` or `<select>` (ADR 0009): `Compiled::choices`.
    Choice(ChoiceId),
}

/// A choice as compiled (ADR 0009): one template per branch, its
/// branch interface, and how it chooses.
#[derive(Debug, Clone)]
pub(crate) struct ChoiceDef {
    /// The choice element: (template, element).
    pub(crate) at: (TemplateId, ElemId),
    /// `<conditionalContent>` (reactive) or `<select>` (load-time).
    pub(crate) reactive: bool,
    /// One template per case or option, in document order.
    pub(crate) branches: Vec<TemplateId>,
    /// Reactive: each case's `condition` attribute (None: an else).
    pub(crate) conditions: Vec<Option<u32>>,
    /// Load-time: picks, with replacement or not, and a weight per option.
    pub(crate) num_to_select: u32,
    pub(crate) with_replacement: bool,
    pub(crate) weights: Vec<f64>,
    /// The branch interface (`CONTEXT.md`): name -> type and the element
    /// carrying it in each branch. Filled once every element is planned.
    pub(crate) iface: HashMap<String, (ComponentType, Vec<ElemId>)>,
    /// Interface names that references use, in first-use order; a
    /// `Step::Iface` holds an index here.
    pub(crate) used: Vec<String>,
}

/// How many public props an element has.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum NPublic {
    /// Its type table's, whatever type the element ends up with.
    Table,
    /// The table's, then two per point of its list, as planned.
    Planned(u32),
    /// As many as its `extend` referent has: a bare or cloned copy of a
    /// type with a list, whose length is known only when built.
    AsReferent,
}

/// The template itself, as the parent of its top-level elements.
pub(crate) const ROOT_SCOPE: ElemId = usize::MAX;

#[derive(Debug, Clone)]
pub(crate) struct Elem {
    pub(crate) node: NodeId,
    pub(crate) component_type: ComponentType,
    pub(crate) name: StrId,
    /// Parent element within the template (`ROOT_SCOPE` at the top). A
    /// name is visible from every ancestor, as in the current core's
    /// resolver; repeats hide their children behind their own name because
    /// each repeat body is its own template.
    pub(crate) name_scope: ElemId,
    /// First of this element's prop slots within the template's slot space.
    /// Assigned once every element is planned, since planned types add
    /// hidden slots after the public props.
    pub(crate) slot_off: u32,
    /// The element's identity across loads, for saved state.
    pub(crate) key: ElemKey,
    pub(crate) props: Vec<SourcePlan>,
    /// How many of `props` are public (ADR 0016); hidden slots follow.
    pub(crate) n_public: NPublic,
    pub(crate) children: Vec<Child>,
    pub(crate) extend: Option<RefId>,
    /// A child of a container copy (`<graph extend="$g"/>`): every prop
    /// aliases the original's, and the children are clones too.
    pub(crate) cloned: bool,
    pub(crate) body: Body,
}

#[derive(Debug, Clone, Default)]
pub(crate) struct Template {
    /// (template, element) of the repeat this template belongs to.
    pub(crate) parent: Option<(TemplateId, ElemId)>,
    /// The node of the element that owns the template (0, the DAST root,
    /// for the document's): what an element the build makes at the top of
    /// the template is keyed by.
    pub(crate) owner: NodeId,
    pub(crate) elems: Vec<Elem>,
    pub(crate) n_slots: u32,
    /// Children of the template itself (the document, or the repeat body).
    pub(crate) children: Vec<Child>,
}

/// One step of a resolved reference path.
#[derive(Debug, Clone)]
pub(crate) enum Step {
    /// An element of the current template.
    Elem(ElemId),
    /// `[k]` on the repeat or collect just selected.
    Index(IndexPlan),
    /// Interface name `used[k]` of a choice: `$cc.x`, or `$s[1].x` after
    /// an index into a select's picks.
    Iface(ChoiceId, u32),
}

#[derive(Debug, Clone)]
pub(crate) enum IndexTerm {
    Const(i64),
    /// The position of the iteration `hops` template levels up from the
    /// referencing element.
    Iter(u32),
}

#[derive(Debug, Clone)]
pub(crate) struct IndexPlan {
    pub(crate) terms: Vec<IndexTerm>,
}

#[derive(Debug, Clone)]
pub(crate) struct RefPlan {
    /// Template levels up from the referencing element to where the first
    /// name was found.
    pub(crate) hops: u32,
    pub(crate) steps: Vec<Step>,
    /// The prop named by the final part, if any.
    pub(crate) prop: Option<String>,
    /// For error messages.
    pub(crate) display: String,
    /// The macro node the plan came from, or NONE for a plan the build
    /// made itself; what an error in resolving it is reported on.
    pub(crate) node: NodeId,
}

/// An element's own slot as `Arg::Own` stores it.
pub(crate) fn own_slot(i: usize) -> u8 {
    u8::try_from(i).expect("fewer than 256 slots per element")
}

/// The name a planner gives a piece of essential state, so that a copy
/// with overrides shares it with its original (`plan_geo`): the copy's
/// slot with a role aliases the original's slot with the same role. A
/// copy extends an element of its own type only, so a role need only be
/// unique within its type. Roles are constants: a component's own, which
/// `typed_props!` declares beside its props, and a list's points'
/// ([`point_roles`]), so a planner cannot misspell one.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(crate) struct Role(&'static str, u32);

impl Role {
    /// A role a component declares in `typed_props!`, which alone calls
    /// this.
    #[doc(hidden)]
    pub(crate) const fn declared(name: &'static str) -> Role {
        Role(name, 0)
    }

    /// The role's name, for `typed_props!`'s check that no declared role
    /// takes `point_roles`'s.
    #[doc(hidden)]
    pub(crate) const fn name(self) -> &'static str {
        self.0
    }
}

/// A point a planner uses when the author gives none: its essential
/// roles and value. Both are a component's to say (the line's and
/// segment's values are in `components/geometry/mod.rs`).
pub(crate) type DefaultPoint = ([Role; 2], [f64; 2]);

/// A slot's plan and, when it is essential state that a copy shares, its
/// role and the attribute its value came from: what a typed plan's fields
/// hold (`typed_props!`), so a role is always on the slot whose plan it
/// names.
#[derive(Debug, Clone)]
pub(crate) struct Planned {
    pub(crate) plan: SourcePlan,
    role: Option<(Role, Option<&'static str>)>,
}

impl From<SourcePlan> for Planned {
    fn from(plan: SourcePlan) -> Self {
        Planned { plan, role: None }
    }
}

impl Planned {
    /// Essential state with `role`, initially `v`.
    pub(crate) fn essential(role: Role, v: f64) -> Self {
        Planned {
            plan: SourcePlan::Literal(v),
            role: Some((role, None)),
        }
    }
    /// Essential state with `role`, initially `v`, given by `attr`: a copy
    /// that gives `attr` itself does not share it.
    pub(crate) fn essential_from(role: Role, attr: &'static str, v: f64) -> Self {
        Planned {
            plan: SourcePlan::Literal(v),
            role: Some((role, Some(attr))),
        }
    }
    /// A constant that is not state.
    pub(crate) fn fixed(v: f64) -> Self {
        SourcePlan::Fixed(v).into()
    }
    /// An alias of the element's own slot.
    pub(crate) fn own(slot: usize) -> Self {
        SourcePlan::own(slot).into()
    }
    /// An operator over the element's own slots.
    pub(crate) fn computed(op: OpSpec, args: Vec<usize>) -> Self {
        SourcePlan::computed(op, args).into()
    }
    /// Prop `i` as the type's table computes it from its other props.
    pub(crate) fn from_table(component_type: ComponentType, i: usize) -> Self {
        match component_type.prop_defs()[i].from {
            PropFrom::Computed { op, args } => SourcePlan::from_def(op, &args).into(),
            _ => unreachable!(
                "{} is not computed by the table",
                component_type.prop_defs()[i].name
            ),
        }
    }
    /// A given point as `point` plans it, else the essential default with
    /// its roles.
    pub(crate) fn point_or_default(
        p: Option<&PointPlan>,
        roles: [Role; 2],
        attr: &'static str,
        (default_roles, default): DefaultPoint,
    ) -> [Self; 2] {
        match p {
            Some(p) => Self::point(p, roles, attr),
            None => std::array::from_fn(|j| Self::essential(default_roles[j], default[j])),
        }
    }
    /// A point's two coordinates: a literal coordinate is essential state
    /// with its role, given by `attr`.
    pub(crate) fn point(p: &PointPlan, roles: [Role; 2], attr: &'static str) -> [Self; 2] {
        std::array::from_fn(|j| match p.coord(j) {
            SourcePlan::Literal(v) => Planned::essential_from(roles[j], attr, v),
            other => other.into(),
        })
    }
}

/// A planned element's prop list under construction: public slots set by
/// index, hidden slots appended after them and referenced by index like any
/// own prop.
pub(crate) struct ElemPlan {
    pub(crate) props: Vec<Option<SourcePlan>>,
    /// The public slots: the table's props, then the list's points.
    pub(crate) n_public: usize,
    pub(crate) roles: HashMap<Role, u8>,
    /// The attribute a role's value came from, if any; a copy that gives
    /// that attribute itself does not share the role.
    pub(crate) role_attr: HashMap<Role, &'static str>,
}

/// A prop wired from the built tree rather than planned (`SourcePlan::Deferred`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Deferred {
    /// The document's or a section's `creditAchieved`: the weighted mean of
    /// the credit of what it scores.
    Credit,
    /// Its `percentCreditAchieved`: the credit times 100, a constant when
    /// the credit is one.
    PercentCredit,
    /// A section's `number` among its siblings.
    SectionNumber,
    /// A collect's `count`, or a polyline's `numVertices` when it gathers
    /// its vertices as a collect does: how many it gathered, which may
    /// follow the counts of the repeats it gathers from.
    CollectCount,
}

impl Deferred {
    /// The deferred prop of `component_type` at position `pi`, if it is one:
    /// every planner plans it so, whatever else it inherits or copies.
    pub(crate) fn of(component_type: ComponentType, pi: usize) -> Option<Deferred> {
        use crate::components::prop::{collect, document, polyline, section};
        match (component_type, pi) {
            (ComponentType::Document, document::CREDIT)
            | (ComponentType::Section, section::CREDIT) => Some(Deferred::Credit),
            (ComponentType::Document, document::PERCENT_CREDIT)
            | (ComponentType::Section, section::PERCENT_CREDIT) => Some(Deferred::PercentCredit),
            (ComponentType::Section, section::NUMBER) => Some(Deferred::SectionNumber),
            (ComponentType::Collect, collect::COUNT)
            | (ComponentType::Polyline, polyline::NUM_VERTICES) => Some(Deferred::CollectCount),
            _ => None,
        }
    }

    /// `props`, a plan for an element of `component_type`, with its deferred
    /// props planned so.
    pub(crate) fn mark(component_type: ComponentType, props: &mut [SourcePlan]) {
        for (pi, p) in props.iter_mut().enumerate() {
            if let Some(k) = Deferred::of(component_type, pi) {
                *p = SourcePlan::Deferred(k);
            }
        }
    }
}

/// A point's props: its coordinates, and `hide` at its default.
pub(crate) fn point_props(x: SourcePlan, y: SourcePlan) -> Vec<SourcePlan> {
    use crate::components::prop::point;
    let mut plan = ElemPlan::of(ComponentType::Point);
    plan.set(point::X, x);
    plan.set(point::Y, y);
    let hide = ComponentType::Point.prop_defs()[point::HIDE].default;
    plan.set(point::HIDE, SourcePlan::Default(hide));
    plan.finish()
}

/// A math's props: its expression, with `post` applied, and its value.
pub(crate) fn math_props(id: ExprId, post: Post) -> Vec<SourcePlan> {
    use crate::components::prop::math;
    let mut plan = ElemPlan::of(ComponentType::Math);
    plan.set(math::EXPR, SourcePlan::MathHandle(id, post));
    plan.set(math::VALUE, SourcePlan::MathValue(id));
    plan.finish()
}

/// A tuple's props: its entry count, its entries, and NaN in the entries
/// past them.
pub(crate) fn tuple_props(entries: Vec<SourcePlan>) -> Vec<SourcePlan> {
    use crate::components::prop::tuple;
    let mut plan = ElemPlan::of(ComponentType::Tuple);
    plan.set(tuple::N, SourcePlan::Fixed(entries.len() as f64));
    let n_entries = plan.props.len() - tuple::X1;
    debug_assert!(entries.len() <= n_entries, "checked against MAX_TUPLE");
    let mut entries = entries.into_iter();
    for k in 0..n_entries {
        let p = entries.next().unwrap_or(SourcePlan::Fixed(f64::NAN));
        plan.set(tuple::X1 + k, p);
    }
    plan.finish()
}

impl ElemPlan {
    /// A plan for an element of `component_type`, one public slot per prop
    /// in its table, each set by its name's position (`components::prop`).
    pub(crate) fn of(component_type: ComponentType) -> Self {
        Self::new(component_type.prop_defs().len())
    }

    /// A plan for an element of `component_type` whose list holds
    /// `n_points` points, after the table's props.
    pub(crate) fn with_list(component_type: ComponentType, n_points: usize) -> Self {
        debug_assert!(component_type.list().is_some());
        Self::new(component_type.prop_defs().len() + 2 * n_points)
    }

    pub(crate) fn new(n_public: usize) -> Self {
        ElemPlan {
            n_public,
            props: vec![None; n_public],
            roles: HashMap::new(),
            role_attr: HashMap::new(),
        }
    }
    pub(crate) fn set(&mut self, i: usize, plan: SourcePlan) {
        self.props[i] = Some(plan);
    }
    /// A vector instruction over own slots, its head at public slot `head`
    /// and its other outputs at the slots after it.
    pub(crate) fn set_vec(&mut self, head: usize, op: VecOp, args: Vec<usize>) {
        for k in 1..op.n_out() {
            self.set(head + k, SourcePlan::VecOut(own_slot(head), byte(k)));
        }
        self.set(head, SourcePlan::vector(op, args));
    }
    pub(crate) fn hidden(&mut self, plan: SourcePlan) -> usize {
        self.props.push(Some(plan));
        own_slot(self.props.len() - 1);
        self.props.len() - 1
    }
    /// Puts a point's coordinates on two public slots, a literal
    /// coordinate as essential state with its role, given by `attr`. A free
    /// shape's own points are the points themselves: no instruction stands
    /// between (ADR 0006).
    pub(crate) fn set_point(
        &mut self,
        slots: [usize; 2],
        p: &PointPlan,
        roles: [Role; 2],
        attr: &'static str,
    ) {
        for j in 0..2 {
            match p.coord(j) {
                SourcePlan::Literal(v) => {
                    self.role_from_attr(roles[j], attr);
                    self.set_essential(slots[j], roles[j], v)
                }
                other => self.set(slots[j], other),
            }
        }
    }
    /// Two hidden slots holding a point's coordinates, a literal coordinate
    /// as essential state with its role, given by `attr`.
    pub(crate) fn hidden_point_with_roles(
        &mut self,
        p: &PointPlan,
        roles: [Role; 2],
        attr: &'static str,
    ) -> [usize; 2] {
        std::array::from_fn(|j| match p.coord(j) {
            SourcePlan::Literal(v) => {
                self.role_from_attr(roles[j], attr);
                self.essential(roles[j], v)
            }
            other => self.hidden(other),
        })
    }
    /// Moves `role`, if the plan gives it, to slot `i`.
    pub(crate) fn move_role(&mut self, role: Role, i: usize) {
        if let Some(slot) = self.roles.get_mut(&role) {
            *slot = own_slot(i);
        }
    }
    /// Two hidden slots holding a point's coordinates.
    pub(crate) fn hidden_point(&mut self, p: &PointPlan) -> [usize; 2] {
        [self.hidden(p.coord(0)), self.hidden(p.coord(1))]
    }
    /// A hidden slot planned as `p`, with its role if it has one.
    pub(crate) fn hidden_planned(&mut self, p: Planned) -> usize {
        let i = self.hidden(p.plan);
        if let Some((role, attr)) = p.role {
            self.add_role(i, role, attr);
        }
        i
    }
    /// A hidden essential slot with a role name (see `Elem::roles`).
    pub(crate) fn essential(&mut self, role: Role, value: f64) -> usize {
        let i = self.hidden(SourcePlan::Literal(value));
        self.roles.insert(role, own_slot(i));
        i
    }
    /// A public essential slot with a role name.
    pub(crate) fn set_essential(&mut self, i: usize, role: Role, value: f64) {
        self.set(i, SourcePlan::Literal(value));
        self.roles.insert(role, own_slot(i));
    }
    /// A public essential text slot with a role name, holding string id `id`.
    pub(crate) fn set_text_essential(&mut self, i: usize, role: Role, id: f64) {
        self.set(i, SourcePlan::TextLiteral(id));
        self.roles.insert(role, own_slot(i));
    }
    /// Record that `role` came from attribute `attr`.
    pub(crate) fn role_from_attr(&mut self, role: Role, attr: &'static str) {
        self.role_attr.insert(role, attr);
    }
    fn add_role(&mut self, i: usize, role: Role, attr: Option<&'static str>) {
        self.roles.insert(role, own_slot(i));
        if let Some(a) = attr {
            self.role_from_attr(role, a);
        }
    }
    /// Every public slot, from a typed plan's fields in table order
    /// (`Props::into_vec`), with their roles.
    pub(crate) fn set_public(&mut self, props: Vec<Planned>) {
        for (i, p) in props.into_iter().enumerate() {
            self.props[i] = Some(p.plan);
            if let Some((role, attr)) = p.role {
                self.add_role(i, role, attr);
            }
        }
    }
    /// The list's points, which fill the public slots after the table's
    /// props, with their roles.
    pub(crate) fn set_list(&mut self, points: Vec<[Planned; 2]>) {
        let n_fixed = self
            .n_public
            .checked_sub(2 * points.len())
            .expect("the plan holds the list's points");
        for (k, point) in points.into_iter().enumerate() {
            for (j, p) in point.into_iter().enumerate() {
                let i = n_fixed + 2 * k + j;
                self.props[i] = Some(p.plan);
                if let Some((role, attr)) = p.role {
                    self.add_role(i, role, attr);
                }
            }
        }
    }
    /// The outputs of a vector instruction over own slots, for the public
    /// slots `at`, which must be consecutive: the head at `at[0]`, output
    /// `k` at `at[k]` (`set_vec`).
    pub(crate) fn vector<const N: usize>(
        at: [usize; N],
        op: VecOp,
        args: Vec<usize>,
    ) -> [Planned; N] {
        assert_eq!(op.n_out(), N, "a vector operator's outputs are its slots");
        assert!(
            at.iter().enumerate().all(|(k, &a)| a == at[0] + k),
            "a vector operator's outputs are consecutive slots"
        );
        std::array::from_fn(|k| {
            if k == 0 {
                SourcePlan::vector(op, args.clone()).into()
            } else {
                SourcePlan::VecOut(own_slot(at[0]), byte(k)).into()
            }
        })
    }
    pub(crate) fn finish(self) -> Vec<SourcePlan> {
        self.props
            .into_iter()
            .enumerate()
            .map(|(i, p)| p.unwrap_or_else(|| panic!("public prop {i} left unplanned")))
            .collect()
    }
}

/// Roles of the k-th (0-based) literal point of a point list, as many as
/// a list holds.
pub(crate) fn point_roles(k: usize) -> [Role; 2] {
    let k = u32::try_from(2 * k).expect("fewer points than a u32 counts");
    [Role("pt", k), Role("pt", k + 1)]
}

/// One point of a point-list attribute (`through`, `vertices`, `endpoints`).
#[derive(Debug, Clone)]
pub(crate) enum PointPlan {
    /// `$p`: a point-valued reference (two cells).
    Ref(RefId),
    /// `(a, b)`: two scalar plans.
    Tuple([SourcePlan; 2]),
    /// Item `i` of an array prop: `$l.points` contributes one per item.
    Item(RefId, usize),
}

impl PointPlan {
    pub(crate) fn coord(&self, j: usize) -> SourcePlan {
        match self {
            PointPlan::Ref(p) => SourcePlan::coord(*p, j),
            PointPlan::Tuple(xy) => xy[j].clone(),
            PointPlan::Item(p, i) => SourcePlan::item(*p, *i, j),
        }
    }
}

/// A document as compiled: its templates and plans, made once from its
/// source and kept for the life of the document (ADR 0015).
#[derive(Debug)]
pub struct Compiled {
    pub(crate) dast: Arc<Dast>,
    pub(crate) templates: Vec<Template>,
    pub(crate) refs: Vec<RefPlan>,
    /// Expression templates: cell leaves hold plan ids.
    pub(crate) arena: Arena,
    /// The math text of templates that may be symbolic, with each `$ref`
    /// written `cellN<plan>` (see `sym::engine::leaf_name`).
    pub(crate) sym_text: HashMap<ExprId, String>,
    /// In a document with repeats, each math text's parse once a build has
    /// found the math symbolic: a template parses once however many
    /// instances stamp it and however many builds run. Empty in a document
    /// without repeats, which builds each template once and would only raise
    /// its load's peak memory by keeping the trees.
    pub(crate) sym_trees: HashMap<ExprId, OnceLock<std::result::Result<Tree, String>>>,
    pub(crate) choices: Vec<ChoiceDef>,
    /// Text the build needs that is not a DAST string (a textInput's
    /// `prefill`, the literal side of a text comparison), appended after
    /// the DAST's table in every build, so their ids are the same each time.
    pub(crate) extra_strings: Vec<String>,
    /// The source's diagnostics (ADR 0015): the lint findings and the
    /// errors of the boxed elements, in node order. Set by `compile::compile`.
    pub(crate) diagnostics: Vec<crate::diagnostics::Diagnostic>,
    /// Whether the document has a repeat, so its structure can change and
    /// a later build will stamp this compile.
    pub(crate) rebuilds: bool,
    /// The document's structural depth (`Structure::structural_depth`) as
    /// the check found it: the probe's, which bounds every build's, since
    /// each build's chains of repeats map onto the probe's; 0 without a
    /// repeat. None when the check was skipped (a test load).
    pub(crate) structural_depth: Option<u32>,
}

impl Compiled {
    /// The source it was compiled from.
    pub fn dast(&self) -> &Arc<Dast> {
        &self.dast
    }

    /// Drop the plans' spare capacity once planning is done, before the
    /// check builds, so the build reuses that memory rather than raising
    /// the load's peak, which in wasm is what the page keeps. (What only
    /// planning reads, the name table and roles, is the `Compiler`'s and
    /// goes with it.)
    pub(crate) fn shrink_to_fit(&mut self) {
        self.templates.shrink_to_fit();
        for tpl in &mut self.templates {
            tpl.elems.shrink_to_fit();
            tpl.children.shrink_to_fit();
            for el in &mut tpl.elems {
                el.props.shrink_to_fit();
                el.children.shrink_to_fit();
            }
        }
        self.refs.shrink_to_fit();
        self.arena.nodes.shrink_to_fit();
        self.sym_text.shrink_to_fit();
        self.choices.shrink_to_fit();
    }

    /// Everything the compile holds, as text that is equal exactly when two
    /// compiles are (maps in key order): what `tests/compile_purity.rs`
    /// compares across seeds.
    pub(crate) fn fingerprint(&self) -> String {
        use std::fmt::Write;
        let mut out = String::new();
        let mut sym: Vec<_> = self.sym_text.iter().collect();
        sym.sort();
        let _ = writeln!(out, "templates {:?}", self.templates);
        let _ = writeln!(out, "refs {:?}", self.refs);
        let _ = writeln!(out, "arena {:?}", self.arena);
        let _ = writeln!(out, "sym_text {sym:?}");
        for c in &self.choices {
            let mut iface: Vec<_> = c.iface.iter().collect();
            iface.sort_by(|a, b| a.0.cmp(b.0));
            let _ = writeln!(
                out,
                "choice {:?} {} {:?} {:?} {} {} {:?} {:?} {iface:?}",
                c.at,
                c.reactive,
                c.branches,
                c.conditions,
                c.num_to_select,
                c.with_replacement,
                c.weights,
                c.used,
            );
        }
        let _ = writeln!(out, "extra_strings {:?}", self.extra_strings);
        let _ = writeln!(out, "diagnostics {:?}", self.diagnostics);
        let _ = writeln!(out, "rebuilds {}", self.rebuilds);
        let _ = writeln!(out, "structural_depth {:?}", self.structural_depth);
        out
    }

    /// How many build passes a load or a rebuild may take before the
    /// structure must have settled: the structural depth plus one, and
    /// never fewer than `floor`. None when the check was skipped.
    pub(crate) fn passes(&self, floor: usize) -> Option<usize> {
        self.structural_depth.map(|d| (d as usize + 1).max(floor))
    }

    /// Whether the document has a load-time choice (a `<select>`), which a
    /// seed draws from.
    pub(crate) fn has_selects(&self) -> bool {
        self.choices.iter().any(|c| !c.reactive)
    }

    /// Whether any template is a repeat body: without one the structure
    /// never changes and the schedule's own check is complete.
    pub(crate) fn has_repeats(&self) -> bool {
        self.templates.iter().any(|t| {
            t.elems
                .iter()
                .any(|e| matches!(e.body, Body::Repeat { .. }))
        })
    }

    /// Whether a later build can stamp it: the document has a repeat.
    pub fn rebuilds(&self) -> bool {
        self.rebuilds
    }
}

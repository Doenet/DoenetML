//! Compile's output, which expand reads: one [`Template`] per repeat body,
//! choice branch and the document, with a plan for every element's props
//! and every reference. Nothing here names an iteration; see `build/mod.rs`.

use super::*;

/// An element's stable key (ADR 0017), as an index into the compile's
/// [`Keys`]: what saved state names it by, the same across versions of the
/// document that an ordinary edit makes. Every instance of a template
/// element shares its key; the scope tells them apart.
pub type ElemKey = u32;

/// A slot's position among its element's, as an essential key holds it:
/// a public prop's position, or a hidden slot's with `HIDDEN` set.
pub const HIDDEN: u32 = 1 << 31;

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
/// point-valued prop, or coordinate `j` of item `i` of a list prop.
#[derive(Debug, Clone, Copy)]
pub(crate) enum Sel {
    Whole,
    Coord(u8),
    Item(u8, u8),
}

/// A value not given (yet): an attribute's default when it has no value
/// of its own, an emptied input, an answer not submitted, an entry past a
/// tuple's end, an operator input left out. A component writes NaN only
/// as this, or as `Wire::undefined`/`Source::undefined` after a warning
/// (ADR 0016, "No silent NaN"); a test in `components/mod.rs` holds it to
/// that.
pub(crate) const NO_VALUE: f64 = f64::NAN;

/// What `PlanCtx::warn` returns: that the element's diagnostic was
/// raised. Only the compile makes one, so a value a planner cannot
/// define (`Wire::undefined`, `Source::undefined`) always comes with the
/// diagnostic that explains it.
#[derive(Debug, Clone, Copy)]
pub(crate) struct Warned(());

impl Warned {
    pub(in crate::compile) fn raised() -> Self {
        Warned(())
    }
}

/// Where a prop's value comes from, before any iteration exists.
#[derive(Debug, Clone)]
pub(crate) enum Source {
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
    FirstIteration(Box<Source>, Box<Source>),
    /// Wired once the whole tree is built, from what is around the element
    /// (`build/expand/scoring.rs`, a collect's expansion): no planner can
    /// wire it, so its wiring says that it is deferred and who fills it.
    Deferred(Deferred),
    /// Output `k` of the vector instruction headed at own slot `head`
    /// (an `Op(OpSpec::Vec(..))`, which is output 0).
    VecOut(u8, u8),
}

impl Source {
    /// A value the element cannot have, as `warned` explains: NaN.
    pub(crate) fn undefined(_: Warned) -> Self {
        Source::Fixed(f64::NAN)
    }
    /// A value not given (`NO_VALUE`), as a constant.
    pub(crate) fn absent() -> Self {
        Source::Fixed(NO_VALUE)
    }
    pub(crate) fn reference(p: RefId) -> Self {
        Source::Alias(Arg::Ref(p, Sel::Whole))
    }
    pub(crate) fn coord(p: RefId, j: usize) -> Self {
        Source::Alias(Arg::Ref(p, Sel::Coord(byte(j))))
    }
    pub(crate) fn item(p: RefId, i: usize, j: usize) -> Self {
        Source::Alias(Arg::Ref(p, Sel::Item(byte(i), byte(j))))
    }
    pub(crate) fn own(slot: usize) -> Self {
        Source::Alias(Arg::Own(own_slot(slot)))
    }
    /// Operator over the element's own slots.
    pub(crate) fn computed(op: OpSpec, args: Vec<usize>) -> Self {
        Source::Op(
            op,
            args.into_iter().map(|a| Arg::Own(own_slot(a))).collect(),
        )
    }
    /// A type's `PropFrom::Computed` prop.
    pub(crate) fn from_def(op: OpSpec, args: &[u8]) -> Self {
        Source::Op(op, args.iter().map(|&a| Arg::Own(a)).collect())
    }
    /// Head of a vector instruction over own slots; this slot is output 0,
    /// the next `n_out - 1` slots are `VecOut`.
    pub(crate) fn vector(op: VecOp, args: Vec<usize>) -> Self {
        Source::computed(OpSpec::Vec(op), args)
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
    /// Each branch's stable key (ADR 0017): the case's or option's name,
    /// else its tag and its position among the choice's branches with that
    /// tag (`option#2`); `body` for a choice that is its own one branch.
    pub(crate) branch_keys: Vec<Box<str>>,
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
    pub(crate) props: Vec<Source>,
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
    /// (template, element) of the repeat or choice this template belongs to.
    pub(crate) parent: Option<(TemplateId, ElemId)>,
    pub(crate) elems: Vec<Elem>,
    pub(crate) n_slots: u32,
    /// Children of the template itself (the document, a repeat body or a
    /// choice branch).
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

/// The name of a piece of essential state a copy shares with its
/// original unless it overrides it (`plan_with_extend`): the copy's slot
/// holding shared state `R` aliases the original's slot holding `R`. A copy
/// extends an element of its own type only, so a name need only be
/// unique within its type. Every one is a constant: a component's own,
/// declared beside its props (`shared_state { .. }` in `component!`), or a
/// list's points' ([`shared_point_state`]), so a planner cannot misspell
/// one.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(crate) struct SharedState(&'static str, u32);

impl SharedState {
    /// Shared state a component declares (`shared_state { .. }`); only
    /// `typed_props!` calls this.
    #[doc(hidden)]
    pub(crate) const fn declared(name: &'static str) -> SharedState {
        SharedState(name, 0)
    }

    /// Its name, for `typed_props!`'s check that no declared name is the
    /// one `shared_point_state` uses.
    #[doc(hidden)]
    pub(crate) const fn name(self) -> &'static str {
        self.0
    }

    /// What saved state names a hidden slot holding it by (ADR 0017): its
    /// name, and its position for a list's points (`pt3`).
    pub(crate) fn key(self) -> String {
        if self.1 == 0 {
            self.0.to_string()
        } else {
            format!("{}{}", self.0, self.1)
        }
    }
}

/// An attribute a component's planner reads, as its `attributes { .. }`
/// declares it (`component!`): only the macro makes one, as a constant of
/// the component's `attr` module (`attr::radius`), so a planner can name
/// only an attribute its type declares, and a misspelling does not
/// compile.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Attr(&'static str);

impl Attr {
    /// An attribute a component declares; only `component!` calls this.
    #[doc(hidden)]
    pub(crate) const fn declared(name: &'static str) -> Attr {
        Attr(name)
    }

    /// Its name, as the source spells it (ignoring case).
    pub(crate) const fn name(self) -> &'static str {
        self.0
    }
}

/// Where the value of a piece of essential state was given, which decides
/// whether a copy with overrides keeps it or shares its referent's
/// (`plan_with_extend`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Given {
    /// By the attribute, the element's own or, when it omits it, its
    /// referent's: a copy that gives the attribute keeps the value.
    Attr(Attr),
    /// By the element's own children: a copy keeps the value.
    Children,
    /// By the referent's children, which the element stands on when it
    /// has none of its own: a copy shares the value.
    Referent,
}

impl From<Attr> for Given {
    fn from(a: Attr) -> Self {
        Given::Attr(a)
    }
}

/// A point a planner uses when the author gives none: the shared state
/// its coordinates are, and their value. Both are a component's to say (the line's and
/// segment's values are in `components/geometry/mod.rs`).
pub(crate) type DefaultPoint = ([SharedState; 2], [f64; 2]);

/// One prop's source and, when it is essential state that a copy shares,
/// which shared state it is and where its value was given: what a typed
/// plan's fields hold (`typed_props!`), so shared state is always named on
/// the slot that holds it.
#[derive(Debug, Clone)]
pub(crate) struct Wire {
    pub(crate) source: Source,
    state: Option<(SharedState, Option<Given>)>,
}

impl From<Source> for Wire {
    fn from(source: Source) -> Self {
        Wire {
            source,
            state: None,
        }
    }
}

impl Wire {
    /// Essential state, shared as `state`, initially `v`.
    pub(crate) fn essential(state: SharedState, v: f64) -> Self {
        Wire {
            source: Source::Literal(v),
            state: Some((state, None)),
        }
    }
    /// Essential state, shared as `state`, initially `v`, given as `given`
    /// says: a copy that gives it itself does not share it.
    pub(crate) fn essential_from(state: SharedState, given: impl Into<Given>, v: f64) -> Self {
        Wire {
            source: Source::Literal(v),
            state: Some((state, Some(given.into()))),
        }
    }
    /// Essential text state, shared as `state`, initially the string `id`.
    pub(crate) fn text_essential(state: SharedState, id: f64) -> Self {
        Wire {
            source: Source::TextLiteral(id),
            state: Some((state, None)),
        }
    }
    /// A constant that is not state, and not NaN: a value not given is
    /// `absent`, one the element cannot have `undefined`.
    pub(crate) fn fixed(v: f64) -> Self {
        assert!(
            !v.is_nan(),
            "Wire::fixed(NaN): use Wire::absent, or Wire::undefined after a warning"
        );
        Source::Fixed(v).into()
    }
    /// A value not given (`NO_VALUE`), as a constant.
    pub(crate) fn absent() -> Self {
        Source::absent().into()
    }
    /// A value the element cannot have, as `warned` explains: NaN.
    pub(crate) fn undefined(warned: Warned) -> Self {
        Source::undefined(warned).into()
    }
    /// An alias of the element's own slot.
    pub(crate) fn own(slot: usize) -> Self {
        Source::own(slot).into()
    }
    /// An operator over the element's own slots.
    pub(crate) fn computed(op: OpSpec, args: Vec<usize>) -> Self {
        Source::computed(op, args).into()
    }
    /// Prop `i` as the type's table computes it from its other props.
    pub(crate) fn from_table(component_type: ComponentType, i: usize) -> Self {
        match component_type.prop_defs()[i].from {
            PropFrom::Computed { op, args } => Source::from_def(op, &args).into(),
            _ => unreachable!(
                "{} is not computed by the table",
                component_type.prop_defs()[i].name
            ),
        }
    }
    /// A given point as `point` plans it, else the essential default with
    /// its shared state.
    pub(crate) fn point_or_default(
        p: Option<&GivenPoint>,
        shared_state: [SharedState; 2],
        given: impl Into<Given>,
        (default_shared_state, default): DefaultPoint,
    ) -> [Self; 2] {
        match p {
            Some(p) => Self::point(p, shared_state, given),
            None => std::array::from_fn(|j| Self::essential(default_shared_state[j], default[j])),
        }
    }
    /// A point's two coordinates: a literal coordinate is essential state
    /// with its shared state, given as `given` says.
    pub(crate) fn point(
        p: &GivenPoint,
        shared_state: [SharedState; 2],
        given: impl Into<Given>,
    ) -> [Self; 2] {
        let given = given.into();
        std::array::from_fn(|j| match p.coord(j) {
            Source::Literal(v) => Wire::essential_from(shared_state[j], given, v),
            other => other.into(),
        })
    }
}

/// How each of an element's props gets its value, as its planner builds it:
/// the public props (the table's, then the list's points), then hidden
/// helper values that the props read like any own prop.
pub(crate) struct ElemWiring {
    pub(crate) props: Vec<Option<Source>>,
    /// The public slots: the table's props, then the list's points.
    pub(crate) n_public: usize,
    /// Which slot holds each piece of shared state.
    pub(crate) shared_state: HashMap<SharedState, u8>,
    /// Where a piece of shared state's value was given, if it was; a copy
    /// that gives it itself does not share it.
    pub(crate) shared_state_given: HashMap<SharedState, Given>,
}

/// A prop wired from the built tree rather than planned (`Source::Deferred`).
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

    /// `props`, wiring for an element of `component_type`, with its deferred
    /// props planned so.
    pub(crate) fn mark(component_type: ComponentType, props: &mut [Source]) {
        for (pi, p) in props.iter_mut().enumerate() {
            if let Some(k) = Deferred::of(component_type, pi) {
                *p = Source::Deferred(k);
            }
        }
    }
}

impl ElemWiring {
    /// Wiring for an element of `component_type`, one public slot per prop
    /// in its table, each set by its name's position (`components::prop`).
    pub(crate) fn of(component_type: ComponentType) -> Self {
        Self::new(component_type.prop_defs().len())
    }

    /// Wiring for an element of `component_type` whose list holds
    /// `n_points` points, after the table's props.
    pub(crate) fn with_list(component_type: ComponentType, n_points: usize) -> Self {
        debug_assert!(component_type.given_coords().is_some());
        Self::new(component_type.prop_defs().len() + 2 * n_points)
    }

    pub(crate) fn new(n_public: usize) -> Self {
        ElemWiring {
            n_public,
            props: vec![None; n_public],
            shared_state: HashMap::new(),
            shared_state_given: HashMap::new(),
        }
    }
    pub(crate) fn hidden(&mut self, source: Source) -> usize {
        self.props.push(Some(source));
        own_slot(self.props.len() - 1);
        self.props.len() - 1
    }
    /// Two hidden slots holding a point's coordinates, a literal coordinate
    /// as essential state with its shared state, given as `given` says.
    pub(crate) fn hidden_point_with_shared_state(
        &mut self,
        p: &GivenPoint,
        shared_state: [SharedState; 2],
        given: impl Into<Given>,
    ) -> [usize; 2] {
        let given = given.into();
        std::array::from_fn(|j| match p.coord(j) {
            Source::Literal(v) => {
                self.shared_state_given.insert(shared_state[j], given);
                self.essential(shared_state[j], v)
            }
            other => self.hidden(other),
        })
    }
    /// Two hidden slots holding a point's coordinates.
    pub(crate) fn hidden_point(&mut self, p: &GivenPoint) -> [usize; 2] {
        [self.hidden(p.coord(0)), self.hidden(p.coord(1))]
    }
    /// A hidden slot planned as `p`, holding its shared state if any.
    pub(crate) fn hidden_wire(&mut self, p: Wire) -> usize {
        let i = self.hidden(p.source);
        if let Some((state, given)) = p.state {
            self.add_shared_state(i, state, given);
        }
        i
    }
    /// A hidden essential slot holding shared state `state`.
    pub(crate) fn essential(&mut self, state: SharedState, value: f64) -> usize {
        let i = self.hidden(Source::Literal(value));
        self.shared_state.insert(state, own_slot(i));
        i
    }
    fn add_shared_state(&mut self, i: usize, state: SharedState, given: Option<Given>) {
        self.shared_state.insert(state, own_slot(i));
        if let Some(g) = given {
            self.shared_state_given.insert(state, g);
        }
    }
    /// Every public slot, from a typed plan's fields in table order
    /// (`Props::into_vec`), with their shared state.
    pub(crate) fn set_public(&mut self, props: impl IntoIterator<Item = Wire>) {
        for (i, p) in props.into_iter().enumerate() {
            self.props[i] = Some(p.source);
            if let Some((state, given)) = p.state {
                self.add_shared_state(i, state, given);
            }
        }
    }
    /// `set_public` for a typed plan of sources that hold no shared state.
    pub(crate) fn set_public_sources(&mut self, props: impl IntoIterator<Item = Source>) {
        self.set_public(props.into_iter().map(Wire::from));
    }
    /// The list's points, which fill the public slots after the table's
    /// props, with their shared state.
    pub(crate) fn set_list(&mut self, points: Vec<[Wire; 2]>) {
        let n_fixed = self
            .n_public
            .checked_sub(2 * points.len())
            .expect("the wiring holds the list's points");
        for (k, point) in points.into_iter().enumerate() {
            for (j, p) in point.into_iter().enumerate() {
                let i = n_fixed + 2 * k + j;
                self.props[i] = Some(p.source);
                if let Some((state, given)) = p.state {
                    self.add_shared_state(i, state, given);
                }
            }
        }
    }
    /// `vector` for as many consecutive slots as the operator has outputs,
    /// from `head` (a list's points, which a polygon's `Shape` moves).
    pub(crate) fn vector_from(head: usize, op: VecOp, args: Vec<usize>) -> Vec<Wire> {
        (0..op.n_out())
            .map(|k| {
                if k == 0 {
                    Source::vector(op, args.clone()).into()
                } else {
                    Source::VecOut(own_slot(head), byte(k)).into()
                }
            })
            .collect()
    }
    /// The outputs of a vector instruction over own slots, for the public
    /// slots `at`, which must be consecutive: the head at `at[0]`, output
    /// `k` at `at[k]`.
    pub(crate) fn vector<const N: usize>(at: [usize; N], op: VecOp, args: Vec<usize>) -> [Wire; N] {
        assert_eq!(op.n_out(), N, "a vector operator's outputs are its slots");
        assert!(
            at.iter().enumerate().all(|(k, &a)| a == at[0] + k),
            "a vector operator's outputs are consecutive slots"
        );
        std::array::from_fn(|k| {
            if k == 0 {
                Source::vector(op, args.clone()).into()
            } else {
                Source::VecOut(own_slot(at[0]), byte(k)).into()
            }
        })
    }
    pub(crate) fn finish(self) -> Vec<Source> {
        self.props
            .into_iter()
            .enumerate()
            .map(|(i, p)| p.unwrap_or_else(|| panic!("public prop {i} left unplanned")))
            .collect()
    }
}

/// The shared state of the k-th (0-based) literal point of a point list,
/// for as many points as a list holds.
pub(crate) fn shared_point_state(k: usize) -> [SharedState; 2] {
    let k = u32::try_from(2 * k).expect("fewer points than a u32 counts");
    [SharedState("pt", k), SharedState("pt", k + 1)]
}

/// One point of a point-list attribute (`through`, `vertices`, `endpoints`).
#[derive(Debug, Clone)]
pub(crate) enum GivenPoint {
    /// `$p`: a point-valued reference (two cells).
    Ref(RefId),
    /// `(a, b)`: two scalar sources.
    Tuple([Source; 2]),
    /// Item `i` of a list prop: `$l.points` contributes one per item.
    Item(RefId, usize),
}

impl GivenPoint {
    pub(crate) fn coord(&self, j: usize) -> Source {
        match self {
            GivenPoint::Ref(p) => Source::coord(*p, j),
            GivenPoint::Tuple(xy) => xy[j].clone(),
            GivenPoint::Item(p, i) => Source::item(*p, *i, j),
        }
    }
}

/// A document as compiled: its templates and plans, made once from its
/// source and kept for the life of the document (ADR 0015).
#[derive(Debug, Clone)]
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
    /// The source's `Dast::version_hash`, once per load rather than per
    /// build.
    pub(crate) version: u64,
    /// Every element's stable key (ADR 0017), set once planning is done.
    pub(crate) keys: Arc<super::keys::Keys>,
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
    /// How a build classes its value slots, essential or fixed (ADR 0018).
    pub(crate) classes: Classes,
    /// How a build finds which slots it computes, by the same three ways
    /// (ADR 0019): the probe's record of the live template slots, its own
    /// walk, or every slot, where a document that varies has no probe.
    pub(crate) live: Classes,
}

/// How a build classes its value slots (ADR 0018): essential when a
/// student's action can write one (`build/writable.rs`), else fixed.
#[derive(Debug, Clone, Default, PartialEq)]
pub(crate) enum Classes {
    /// By the build's own walk: the probe, and the one build of a document
    /// without repeats or selects.
    #[default]
    Walk,
    /// By the probe's walk, which holds every edge any count or pick can
    /// create: per template, a bit per template slot (`slot_off + pi`),
    /// set for a writable one. Every build of a document with repeats or
    /// selects reads it, so a slot's class is the same in every build.
    Record(Arc<Vec<Vec<u64>>>),
    /// Every value slot essential, as before ADR 0018: a test load with
    /// the classing off (`LoadOptions::classify`), or with the check off
    /// and a repeat or select, which has no probe to record.
    Off,
}

impl Classes {
    /// Whether the record marks template slot `slot` of `template`.
    pub(crate) fn recorded(record: &[Vec<u64>], template: usize, slot: u32) -> bool {
        record[template]
            .get(slot as usize / 64)
            .is_some_and(|w| w & (1 << (slot % 64)) != 0)
    }
}

impl Compiled {
    /// The source it was compiled from.
    pub fn dast(&self) -> &Arc<Dast> {
        &self.dast
    }

    /// Drop the plans' spare capacity once planning is done, before the
    /// check builds, so the build reuses that memory rather than raising
    /// the load's peak, which in wasm is what the page keeps. (What only
    /// planning reads, the name table and shared state, is the `Compiler`'s and
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
                "choice {:?} {} {:?} {:?} {:?} {} {} {:?} {:?} {iface:?}",
                c.at,
                c.reactive,
                c.branches,
                c.branch_keys,
                c.conditions,
                c.num_to_select,
                c.with_replacement,
                c.weights,
                c.used,
            );
        }
        let _ = writeln!(out, "keys {}", self.keys.fingerprint());
        let _ = writeln!(out, "extra_strings {:?}", self.extra_strings);
        let _ = writeln!(out, "diagnostics {:?}", self.diagnostics);
        let _ = writeln!(out, "rebuilds {}", self.rebuilds);
        let _ = writeln!(out, "structural_depth {:?}", self.structural_depth);
        let _ = writeln!(out, "classes {:?}", self.classes);
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

//! Compile's output, which expand reads: one [`Template`] per repeat body,
//! choice branch and the document, with a plan for every element's props
//! and every reference. Nothing here names an iteration; see `build/mod.rs`.

use super::*;

// ---------------------------------------------------------------------------
// Compiled templates
// ---------------------------------------------------------------------------

/// A cell an operator reads or a slot aliases, named before any iteration
/// exists: a reference (with a selector into what it names), one of the
/// element's own slots, or a slot of another element in the same template.
#[derive(Debug, Clone, Copy)]
pub(in crate::build) enum Arg {
    Ref(RefId, Sel),
    Own(u8),
    /// A copy with overridden attributes shares the rest of the original's
    /// essential state through this.
    Elem(ElemId, u8),
}

/// Which cell of a reference's target: the single cell, coordinate `j` of a
/// point-valued prop, or coordinate `j` of item `i` of an array prop.
#[derive(Debug, Clone, Copy)]
pub(in crate::build) enum Sel {
    Whole,
    Coord(u8),
    Item(u8, u8),
}

/// Where a prop's value comes from, before any iteration exists.
#[derive(Debug, Clone)]
pub(in crate::build) enum SourcePlan {
    /// An essential cell with this initial value.
    Literal(f64),
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
    VecOut(u8, u8),
}

impl SourcePlan {
    pub(in crate::build) fn reference(p: RefId) -> Self {
        SourcePlan::Alias(Arg::Ref(p, Sel::Whole))
    }
    pub(in crate::build) fn coord(p: RefId, j: usize) -> Self {
        SourcePlan::Alias(Arg::Ref(p, Sel::Coord(j as u8)))
    }
    pub(in crate::build) fn item(p: RefId, i: usize, j: usize) -> Self {
        SourcePlan::Alias(Arg::Ref(p, Sel::Item(i as u8, j as u8)))
    }
    pub(in crate::build) fn own(slot: usize) -> Self {
        SourcePlan::Alias(Arg::Own(own_slot(slot)))
    }
    /// Operator over the element's own slots.
    pub(in crate::build) fn computed(op: OpSpec, args: Vec<usize>) -> Self {
        SourcePlan::Op(
            op,
            args.into_iter().map(|a| Arg::Own(own_slot(a))).collect(),
        )
    }
    /// A type's `PropFrom::Computed` prop.
    pub(in crate::build) fn from_def(op: OpSpec, args: &[u8]) -> Self {
        SourcePlan::Op(op, args.iter().map(|&a| Arg::Own(a)).collect())
    }
    /// Head of a vector instruction over own slots; this slot is output 0,
    /// the next `n_out - 1` slots are `VecOut`.
    pub(in crate::build) fn vector(op: VecOp, args: Vec<usize>) -> Self {
        SourcePlan::computed(OpSpec::Vec(op), args)
    }
}

#[derive(Debug, Clone)]
pub(in crate::build) enum Child {
    Elem(ElemId),
    Text(StrId),
    /// A `$ref` child: a copy or a number, decided when it resolves. The
    /// flag says whether the path carries an index.
    Macro(RefId, bool),
}

#[derive(Debug, Clone)]
pub(in crate::build) enum Body {
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
pub(in crate::build) struct ChoiceDef {
    /// The choice element: (template, element).
    pub(in crate::build) at: (TemplateId, ElemId),
    /// `<conditionalContent>` (reactive) or `<select>` (load-time).
    pub(in crate::build) reactive: bool,
    /// One template per case or option, in document order.
    pub(in crate::build) branches: Vec<TemplateId>,
    /// Reactive: each case's `condition` attribute (None: an else).
    pub(in crate::build) conditions: Vec<Option<u32>>,
    /// Load-time: picks, with replacement or not, and a weight per option.
    pub(in crate::build) num_to_select: u32,
    pub(in crate::build) with_replacement: bool,
    pub(in crate::build) weights: Vec<f64>,
    /// The branch interface (`CONTEXT.md`): name -> type and the element
    /// carrying it in each branch. Filled once every element is planned.
    pub(in crate::build) iface: HashMap<String, (ComponentType, Vec<ElemId>)>,
    /// Interface names that references use, in first-use order; a
    /// `Step::Iface` holds an index here.
    pub(in crate::build) used: Vec<String>,
}

/// The template itself, as the parent of its top-level elements.
pub(in crate::build) const ROOT_SCOPE: ElemId = usize::MAX;

#[derive(Debug, Clone)]
pub(in crate::build) struct Elem {
    pub(in crate::build) node: NodeId,
    pub(in crate::build) component_type: ComponentType,
    pub(in crate::build) name: StrId,
    /// Parent element within the template (`ROOT_SCOPE` at the top). A
    /// name is visible from every ancestor, as in the current core's
    /// resolver; repeats hide their children behind their own name because
    /// each repeat body is its own template.
    pub(in crate::build) name_scope: ElemId,
    /// First of this element's prop slots within the template's slot space.
    /// Assigned once every element is planned, since planned types add
    /// hidden slots after the public props.
    pub(in crate::build) slot_off: u32,
    pub(in crate::build) props: Vec<SourcePlan>,
    pub(in crate::build) children: Vec<Child>,
    pub(in crate::build) extend: Option<RefId>,
    /// A child of a container copy (`<graph extend="$g"/>`): every prop
    /// aliases the original's, and the children are clones too.
    pub(in crate::build) cloned: bool,
    /// Named essential slots of a planned type (a line's default points, a
    /// circle's essential radius), so a copy with overridden attributes can
    /// share the ones it does not override.
    pub(in crate::build) roles: HashMap<&'static str, u8>,
    pub(in crate::build) body: Body,
}

#[derive(Debug, Clone, Default)]
pub(in crate::build) struct Template {
    /// (template, element) of the repeat this template belongs to.
    pub(in crate::build) parent: Option<(TemplateId, ElemId)>,
    pub(in crate::build) elems: Vec<Elem>,
    pub(in crate::build) n_slots: u32,
    /// Children of the template itself (the document, or the repeat body).
    pub(in crate::build) children: Vec<Child>,
    /// Compile-time name table: for every ancestor (and `ROOT_SCOPE`), the
    /// descendants carrying each name. More than one is an ambiguity.
    pub(in crate::build) names: HashMap<(ElemId, String), Vec<ElemId>>,
}

/// One step of a resolved reference path.
#[derive(Debug, Clone)]
pub(in crate::build) enum Step {
    /// An element of the current template.
    Elem(ElemId),
    /// `[k]` on the repeat or collect just selected.
    Index(IndexPlan),
    /// Interface name `used[k]` of a choice: `$cc.x`, or `$s[1].x` after
    /// an index into a select's picks.
    Iface(ChoiceId, u32),
}

#[derive(Debug, Clone)]
pub(in crate::build) enum IndexTerm {
    Const(i64),
    /// The position of the iteration `hops` template levels up from the
    /// referencing element.
    Iter(u32),
}

#[derive(Debug, Clone)]
pub(in crate::build) struct IndexPlan {
    pub(in crate::build) terms: Vec<IndexTerm>,
}

#[derive(Debug, Clone)]
pub(in crate::build) struct RefPlan {
    /// Template levels up from the referencing element to where the first
    /// name was found.
    pub(in crate::build) hops: u32,
    pub(in crate::build) steps: Vec<Step>,
    /// The prop named by the final part, if any.
    pub(in crate::build) prop: Option<String>,
    /// For error messages.
    pub(in crate::build) display: String,
}

/// An element's own slot as `Arg::Own` stores it.
pub(in crate::build) fn own_slot(i: usize) -> u8 {
    u8::try_from(i).expect("fewer than 256 slots per element")
}

/// A planned element's prop list under construction: public slots set by
/// index, hidden slots appended after them and referenced by index like any
/// own prop.
pub(in crate::build) struct ElemPlan {
    pub(in crate::build) props: Vec<Option<SourcePlan>>,
    pub(in crate::build) roles: HashMap<&'static str, u8>,
    /// The attribute a role's value came from, if any; a copy that gives
    /// that attribute itself does not share the role.
    pub(in crate::build) role_attr: HashMap<&'static str, &'static str>,
}

impl ElemPlan {
    pub(in crate::build) fn new(n_public: usize) -> Self {
        ElemPlan {
            props: vec![None; n_public],
            roles: HashMap::new(),
            role_attr: HashMap::new(),
        }
    }
    pub(in crate::build) fn set(&mut self, i: usize, plan: SourcePlan) {
        self.props[i] = Some(plan);
    }
    /// A vector instruction over own slots, its head at public slot `head`
    /// and its other outputs at the slots after it.
    pub(in crate::build) fn set_vec(&mut self, head: usize, op: VecOp, args: Vec<usize>) {
        for k in 1..op.n_out() {
            self.set(head + k, SourcePlan::VecOut(own_slot(head), k as u8));
        }
        self.set(head, SourcePlan::vector(op, args));
    }
    pub(in crate::build) fn hidden(&mut self, plan: SourcePlan) -> usize {
        self.props.push(Some(plan));
        own_slot(self.props.len() - 1);
        self.props.len() - 1
    }
    /// A hidden essential slot with a role name (see `Elem::roles`).
    pub(in crate::build) fn essential(&mut self, role: &'static str, value: f64) -> usize {
        let i = self.hidden(SourcePlan::Literal(value));
        self.roles.insert(role, own_slot(i));
        i
    }
    /// A public essential slot with a role name.
    pub(in crate::build) fn set_essential(&mut self, i: usize, role: &'static str, value: f64) {
        self.set(i, SourcePlan::Literal(value));
        self.roles.insert(role, own_slot(i));
    }
    /// Record that `role` came from attribute `attr`.
    pub(in crate::build) fn role_from_attr(&mut self, role: &'static str, attr: &'static str) {
        self.role_attr.insert(role, attr);
    }
    pub(in crate::build) fn finish(self) -> Vec<SourcePlan> {
        self.props
            .into_iter()
            .enumerate()
            .map(|(i, p)| p.unwrap_or_else(|| panic!("public prop {i} left unplanned")))
            .collect()
    }
}

/// Role names of the k-th literal point of a point list (k < 16).
pub(in crate::build) const POINT_ROLES: [[&str; 2]; 16] = [
    ["pt1x", "pt1y"],
    ["pt2x", "pt2y"],
    ["pt3x", "pt3y"],
    ["pt4x", "pt4y"],
    ["pt5x", "pt5y"],
    ["pt6x", "pt6y"],
    ["pt7x", "pt7y"],
    ["pt8x", "pt8y"],
    ["pt9x", "pt9y"],
    ["pt10x", "pt10y"],
    ["pt11x", "pt11y"],
    ["pt12x", "pt12y"],
    ["pt13x", "pt13y"],
    ["pt14x", "pt14y"],
    ["pt15x", "pt15y"],
    ["pt16x", "pt16y"],
];

/// One point of a point-list attribute (`through`, `vertices`, `endpoints`).
#[derive(Debug, Clone)]
pub(in crate::build) enum PointPlan {
    /// `$p`: a point-valued reference (two cells).
    Ref(RefId),
    /// `(a, b)`: two scalar plans.
    Tuple([SourcePlan; 2]),
    /// Item `i` of an array prop: `$l.points` contributes one per item.
    Item(RefId, usize),
}

impl PointPlan {
    pub(in crate::build) fn coord(&self, j: usize) -> SourcePlan {
        match self {
            PointPlan::Ref(p) => SourcePlan::coord(*p, j),
            PointPlan::Tuple(xy) => xy[j].clone(),
            PointPlan::Item(p, i) => SourcePlan::item(*p, *i, j),
        }
    }
}

pub(in crate::build) struct Compiled<'a> {
    pub(in crate::build) dast: &'a Dast,
    pub(in crate::build) templates: Vec<Template>,
    pub(in crate::build) refs: Vec<RefPlan>,
    /// Expression templates: cell leaves hold plan ids.
    pub(in crate::build) arena: Arena,
    /// The math text of templates that may be symbolic, with each `$ref`
    /// written `cellN<plan>` (see `sym::engine::leaf_name`).
    pub(in crate::build) sym_text: HashMap<ExprId, String>,
    pub(in crate::build) choices: Vec<ChoiceDef>,
}

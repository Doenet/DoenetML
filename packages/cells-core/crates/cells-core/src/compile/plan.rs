//! Compile's output, which expand reads: one [`Template`] per repeat body,
//! choice branch and the document, with a plan for every element's props
//! and every reference. Nothing here names an iteration; see `build/mod.rs`.

use super::*;
use crate::components::ArgFrom;

crate::index::index_type! {
    /// An element's stable key (ADR 0017), as an index into the compile's
    /// [`Keys`]: what saved state names it by, the same across versions of
    /// the document that an ordinary edit makes. Every instance of a
    /// template element shares its key; the scope tells them apart.
    pub struct ElemKey;
}

/// A port of an element's wiring (ADR 0032): one of its public props, a
/// coordinate of one of its list's points, or a hidden port its planner
/// made. A planner holds one only as its type's table or the wiring hands
/// it out (`Props::PORTS`, `ElemWiring::item`, `ElemWiring::hidden`),
/// never from a number: a wiring names a port by identifier, and no
/// planner computes a slot. The build numbers ports into slots in the
/// order the wiring holds them (`index`): the table's props, then two
/// per point of the list, then the hidden ports. A saved-state key names
/// an element's port by this number, and a port's name is a fact of its
/// element (`keys::Keys::prop_key`): a public prop's, or the shared state
/// a hidden port holds.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub struct Port(u8);

impl Port {
    /// The port at position `i` of its element's wiring: a table prop by
    /// its position, which only `component!` and the wiring make.
    #[doc(hidden)]
    pub(crate) const fn table(i: usize) -> Port {
        assert!(i < 256, "fewer than 256 ports per element");
        Port(i as u8)
    }

    /// The port's position among its element's, which the build numbers
    /// its slot by.
    pub(crate) const fn index(self) -> usize {
        self.0 as usize
    }
}

crate::index::index_type! {
    /// A template: a position in `Compiled::templates`.
    pub(crate) struct TemplateId;
}

crate::index::index_type! {
    /// An element of a template: a position in its `Template::elems`.
    pub(crate) struct ElemId;
}

crate::index::index_type! {
    /// A reference plan: a position in `Compiled::refs`. A compiled math's
    /// `$ref` leaves are these, until a build binds them to slots.
    pub(crate) struct RefId;
}

impl crate::sym::Leaf for RefId {
    fn raw(self) -> u32 {
        self.get()
    }
    fn from_raw(raw: u32) -> Self {
        Self::new(raw)
    }
}

crate::index::index_type! {
    /// A choice (a select or conditional content): a position in
    /// `Compiled::choices`.
    pub(crate) struct ChoiceId;
}

crate::index::index_type! {
    /// A `$ref` child of a template's elements or of the template itself:
    /// a position in its template's `ref_children` and `ref_child_plans`.
    pub(crate) struct RefChildId;
}

// ---------------------------------------------------------------------------
// Compiled templates
// ---------------------------------------------------------------------------

/// A cell an operator reads or a slot aliases, named before any iteration
/// exists: a reference (with a selector into what it names), one of the
/// element's own ports, a port of another element in the same template, or
/// a constant.
#[derive(Debug, Clone, Copy)]
pub(crate) enum Arg {
    Ref(RefId, Sel),
    Own(Port),
    /// A copy with overridden attributes shares the rest of the original's
    /// essential state through this.
    Elem(ElemId, Port),
    /// A literal an operator reads: the build's one constant for the
    /// value (`Builder::const_slot`). Only an operator input, never an
    /// alias.
    Const(f64),
}

/// Which cell of a reference's target: the single cell, coordinate `j` of a
/// point-valued prop, coordinate `j` of item `i` of a list prop, or port
/// `k` of the element the path names, whatever prop it is (a copy's port
/// aliasing its referent's across a scope, ADR 0032).
#[derive(Debug, Clone, Copy)]
pub(crate) enum Sel {
    Whole,
    Coord(u8),
    Item(u8, u8),
    Port(u8),
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

/// Where a port's value comes from, before any iteration exists (ADR
/// 0032, decision 2): a leaf, a dataflow expression over ports, or a
/// scope specialization choosing between two by the scope the template is
/// stamped in. `Deferred` is the one hole the build still fills, until a
/// deferred prop is an aggregate (step 5).
#[derive(Debug, Clone)]
pub(crate) enum Source {
    Leaf(Leaf),
    Flow(Flow),
    /// The first source where `pred` holds of the scope the template is
    /// stamped in, the second elsewhere: chosen per instance, like a
    /// scope constant.
    Specialize(ScopePred, Box<Source>, Box<Source>),
    /// Wired once the whole tree is built, from what is around the element
    /// (`build/expand/scoring.rs`, a collect's expansion): no planner can
    /// wire it, so its wiring says that it is deferred and who fills it.
    Deferred(Deferred),
}

/// A value nothing computes: given (essential when a student's action can
/// write it, a constant otherwise, ADR 0018), a constant, or a scope
/// constant, the same in every instance of the template slot but for the
/// scope it is stamped in.
#[derive(Debug, Clone)]
pub(crate) enum Leaf {
    /// A given value (ADR 0028): the attribute's, or the type's default
    /// without one.
    Given(f64),
    /// A given text value holding this string, or none (blank).
    GivenText(Option<StrId>),
    /// A given math value (an unbound mathInput's `expr`, an answer's
    /// `submitted`) holding this expression, or blank (NaN).
    GivenMath(Option<Tree<RefId>>),
    /// A constant (ADR 0028): never state, whatever can reach it.
    Const(f64),
    /// A value that depends on the scope the template is stamped in.
    Scope(ScopeConst),
}

/// A scope constant: a value that depends on the scope alone (ADR 0028).
#[derive(Debug, Clone, Copy)]
pub(crate) enum ScopeConst {
    /// The 1-based position of the enclosing iteration.
    IterIndex,
    /// A `<selectFromSequence>`'s value: `from + step * k` for a `k` below
    /// `count` drawn per instance from the document seed (ADR 0009).
    SequencePick { from: f64, step: f64, count: u32 },
    /// A given math value whose initial expression is the value the
    /// reference names when the cell is first built (a mathInput's
    /// `prefill="$n"`): a seed, not a binding.
    Seed(RefId),
}

/// A dataflow expression over ports: an alias, an operator, a lowered math
/// tree whose leaves are ports, or a symbolic template whose leaves are
/// ports.
#[derive(Debug, Clone)]
pub(crate) enum Flow {
    Alias(Arg),
    /// Operator over cells.
    Op(OpSpec, Vec<Arg>),
    /// Output `k` of the vector instruction headed at own port `head`
    /// (an `Op(OpSpec::Vec(..))`, which is output 0).
    VecOut(Port, u8),
    /// Math text: lowered to operators if numeric, else NaN.
    Math(ExprId),
    /// A `<math>`'s `expr` prop: NaN when the math is numeric (it lowers),
    /// else as `SymExpr`.
    MathHandle(ExprId, Post),
    /// A `<math>`'s `value` prop: the literal if the expression is a
    /// number, the lowered operators if numeric, else an `Evaluate` of its
    /// `expr`.
    MathValue(ExprId),
    /// A math cell from math text (`Compiled::sym_text`): a constant handle
    /// without cell leaves, an alias of a lone math leaf, else an
    /// `Instantiate` instruction over the leaves.
    SymExpr(ExprId, Post),
}

/// A structural predicate of the scope a template is stamped in
/// (`Source::Specialize`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum ScopePred {
    /// The first iteration of the enclosing repeat (a function iterate's
    /// initial value).
    FirstIteration,
}

impl Leaf {
    /// Whether the leaf is a document constant when it is a constant (ADR
    /// 0028): the same in every instance of its template slot. A scope
    /// constant is not.
    pub(crate) fn is_document_constant(&self) -> bool {
        !matches!(self, Leaf::Scope(_))
    }
}

impl Flow {
    /// Whether a constant this expression gives is a document constant
    /// (ADR 0028): math text with nothing to read is the same in every
    /// instance; an alias or an operator is what it reads.
    pub(crate) fn is_document_constant(&self) -> bool {
        matches!(
            self,
            Flow::Math(_) | Flow::MathHandle(..) | Flow::MathValue(_) | Flow::SymExpr(..)
        )
    }
}

impl Source {
    /// Whether a constant this plan gives is a document constant (ADR
    /// 0028): one made from the source alone, the same in every instance
    /// of its template slot. A match on the leaf and expression types
    /// alone: a specialization or a deferred port depends on the scope or
    /// the tree.
    pub(crate) fn gives_document_constant(&self) -> bool {
        match self {
            Source::Leaf(leaf) => leaf.is_document_constant(),
            Source::Flow(flow) => flow.is_document_constant(),
            Source::Specialize(..) | Source::Deferred(_) => false,
        }
    }

    /// Port `k` of the element `p` names, whatever prop it is: a copy's
    /// port aliasing its referent's (ADR 0032).
    pub(crate) fn port_of(p: RefId, k: usize) -> Self {
        Source::Flow(Flow::Alias(Arg::Ref(p, Sel::Port(byte(k)))))
    }

    /// A given value (ADR 0028).
    pub(crate) fn given(v: f64) -> Self {
        Source::Leaf(Leaf::Given(v))
    }
    /// A constant (ADR 0028).
    pub(crate) fn constant(v: f64) -> Self {
        Source::Leaf(Leaf::Const(v))
    }
    /// A value the element cannot have, as `warned` explains: NaN.
    pub(crate) fn undefined(_: Warned) -> Self {
        Source::constant(f64::NAN)
    }
    /// A value not given (`NO_VALUE`), as a constant.
    pub(crate) fn absent() -> Self {
        Source::constant(NO_VALUE)
    }
    pub(crate) fn reference(p: RefId) -> Self {
        Source::Flow(Flow::Alias(Arg::Ref(p, Sel::Whole)))
    }
    pub(crate) fn coord(p: RefId, j: usize) -> Self {
        Source::Flow(Flow::Alias(Arg::Ref(p, Sel::Coord(byte(j)))))
    }
    pub(crate) fn item(p: RefId, i: usize, j: usize) -> Self {
        Source::Flow(Flow::Alias(Arg::Ref(p, Sel::Item(byte(i), byte(j)))))
    }
    /// An alias of the element's own port.
    pub(crate) fn own(port: Port) -> Self {
        Source::Flow(Flow::Alias(Arg::Own(port)))
    }
    /// An alias of `arg`.
    pub(crate) fn alias(arg: Arg) -> Self {
        Source::Flow(Flow::Alias(arg))
    }
    /// Operator `op` over `args`.
    pub(crate) fn op(op: OpSpec, args: Vec<Arg>) -> Self {
        Source::Flow(Flow::Op(op, args))
    }
    /// Operator over the element's own ports.
    pub(crate) fn computed(op: OpSpec, args: Vec<Port>) -> Self {
        Source::op(op, args.into_iter().map(Arg::Own).collect())
    }
    /// A type's `PropFrom::Computed` prop.
    pub(crate) fn from_def(op: OpSpec, args: &[ArgFrom]) -> Self {
        let arg = |&a: &ArgFrom| match a {
            ArgFrom::Prop(p) => Arg::Own(Port::table(p as usize)),
            ArgFrom::Const(k) => Arg::Const(k),
        };
        Source::op(op, args.iter().map(arg).collect())
    }
    /// Operator over the element's own port `a` and the literal `k`.
    pub(crate) fn computed_k(op: OpSpec, a: Port, k: f64) -> Self {
        Source::op(op, vec![Arg::Own(a), Arg::Const(k)])
    }
    /// Head of a vector instruction over own ports; this port is output 0,
    /// the next `n_out - 1` ports are `VecOut`.
    pub(crate) fn vector(op: VecOp, args: Vec<Port>) -> Self {
        Source::computed(OpSpec::Vec(op), args)
    }
    /// A math cell from math text (`Flow::SymExpr`).
    pub(crate) fn sym_expr(id: ExprId, post: Post) -> Self {
        Source::Flow(Flow::SymExpr(id, post))
    }
    /// Math text (`Flow::Math`).
    pub(crate) fn math(id: ExprId) -> Self {
        Source::Flow(Flow::Math(id))
    }
}

#[derive(Debug, Clone)]
pub(crate) enum Child {
    Elem(ElemId),
    Text(StrId),
    /// A `$ref` child: a copy or a number, decided when it resolves. What
    /// outlining knows of it is its template's `ref_children`, and its
    /// plan its template's `ref_child_plans` (ADR 0031).
    Macro(RefChildId),
}

#[derive(Debug, Clone)]
pub(crate) enum Body {
    Plain,
    Repeat {
        template: TemplateId,
    },
    /// A `<collect>` or `<polyline>`, of the type it collects; what it
    /// gathers from is planning's (`ElemPlan::from`).
    Collect {
        component_type: ComponentType,
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
    /// Interface names that references use, in the order the reference
    /// plans first name them. Sealing's (ADR 0031), from every plan's
    /// `Step::Iface`.
    pub(crate) used: Vec<String>,
    /// Each used name's position in `used`, by the name-table id a
    /// `Step::Iface` holds. Sealing's.
    pub(crate) used_at: HashMap<u32, u32>,
}

/// What sealing finds of a choice (ADR 0031): its branch interface and
/// the interface names references use, put into its `ChoiceDef` once the
/// compile is done.
#[derive(Debug, Clone, Default)]
pub(crate) struct ChoiceSeal {
    pub(crate) iface: HashMap<String, (ComponentType, Vec<ElemId>)>,
    pub(crate) used: Vec<String>,
    pub(crate) used_at: HashMap<u32, u32>,
}

impl ChoiceSeal {
    /// `def`, as outlining made it, with what sealing found.
    pub(crate) fn into_def(self, def: ChoiceDef) -> ChoiceDef {
        ChoiceDef {
            iface: self.iface,
            used: self.used,
            used_at: self.used_at,
            ..def
        }
    }
}

/// Math text tokenized once (`Compiler::math_text`): its `$ref`s are
/// placeholders, `Token::Cell(RefId::NONE)`, until `resolve_math` plans
/// them.
pub(crate) struct MathText {
    pub(in crate::compile) toks: Vec<Token>,
    /// The `$ref` nodes, one per placeholder, in order.
    pub(in crate::compile) macros: Vec<NodeId>,
    /// The nodes the text was read from: spelled only for an error or the
    /// symbolic engine (`MathSrc`, `SymText`).
    pub(in crate::compile) nodes: Box<[NodeId]>,
}

impl MathText {
    pub(crate) fn tokens(&self) -> &[Token] {
        &self.toks
    }

    /// Where the text came from, for an error.
    pub(in crate::compile) fn src(&self) -> MathSrc<'_> {
        MathSrc(&self.nodes)
    }
}

/// The nodes math text was read from, spelled (`text`) only when an error
/// shows it: planning math builds no strings.
#[derive(Clone, Copy)]
pub(crate) struct MathSrc<'n>(pub(in crate::compile) &'n [NodeId]);

impl MathSrc<'_> {
    /// The text, each `$ref` as written, trimmed.
    pub(crate) fn text(self, dast: &Dast) -> String {
        spell_math(dast, self.0).trim().to_string()
    }
}

/// Math text from `nodes` as written: its text, and `$` with each
/// reference's path. Other elements are skipped, as tokenizing skips them.
pub(in crate::compile) fn spell_math(dast: &Dast, nodes: &[NodeId]) -> String {
    let mut text = String::new();
    for &n in nodes {
        match dast.kind(n) {
            NodeKind::Text => text.push_str(dast.str(n)),
            NodeKind::Macro => {
                text.push('$');
                text.push_str(&dast.macro_display(n));
            }
            _ => {}
        }
    }
    text
}

/// The symbolic engine's text of a math template (`Compiled::sym_text`),
/// spelled by the build only when it finds the math symbolic.
#[derive(Debug, Clone)]
pub(crate) enum SymText {
    /// Math text from the DAST: its nodes, and the plan of each `$ref` among
    /// them, in order, which the text spells as its leaf.
    Nodes {
        nodes: Box<[NodeId]>,
        plans: Box<[RefId]>,
    },
    /// One reference's leaf alone.
    Leaf(RefId),
    /// Text the compile spelled already (a condition's operand).
    Spelled(String),
}

impl SymText {
    /// The text, each `$ref` written `cellN<plan>` (`sym::engine::leaf_name`).
    pub(crate) fn spell(&self, dast: &Dast) -> String {
        let leaf = |p: RefId| crate::sym::engine::leaf_name(p.get(), false);
        match self {
            SymText::Nodes { nodes, plans } => {
                let mut text = String::new();
                let mut plans = plans.iter();
                for &n in nodes.iter() {
                    match dast.kind(n) {
                        NodeKind::Text => text.push_str(dast.str(n)),
                        // Spaces keep `2$a` from reading as one token.
                        NodeKind::Macro => {
                            let p = *plans.next().expect("a plan per reference");
                            text.push(' ');
                            text.push_str(&leaf(p));
                            text.push(' ');
                        }
                        _ => {}
                    }
                }
                text
            }
            SymText::Leaf(p) => leaf(*p),
            SymText::Spelled(text) => text.clone(),
        }
    }
}

/// A `<math>`'s text parsed once, when parsing (ADR 0029), as the type
/// outlining settled: what its planner plans from and a line's equation
/// inlines.
#[derive(Debug, Clone)]
pub(crate) enum ParsedMath {
    /// A math: one expression.
    Expr(ExprId),
    /// A point or a tuple: an expression per entry.
    Entries(Vec<ExprId>),
}

/// How many points an element's list holds (ADR 0016, ADR 0032), which
/// with its type's table says which of its ports are public.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub(crate) enum ListLen {
    /// No points after the table's props: a type without a given list, or
    /// one planned without its list.
    #[default]
    None,
    /// As many as planning made, two ports per point after the table's
    /// props.
    Points(u32),
    /// As many as its `extend` referent has: a bare or cloned copy of a
    /// type with a list, whose length is known only when built.
    AsReferent,
}

/// The template itself, as the parent of its top-level elements.
pub(crate) const ROOT_SCOPE: ElemId = ElemId::NONE;

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
    pub(crate) children: Vec<Child>,
    /// The reference the element's `extend` attribute names, planned when
    /// outlining (ADR 0031): every element's, once the container copies
    /// have their clones (`plan_extends`); a clone's names its original.
    /// What the build copies is planning's (`ElemPlan::extend`).
    pub(crate) extend: Option<RefId>,
    /// A child of a container copy (`<graph extend="$g"/>`): every prop
    /// aliases the original's, and the children are clones too.
    pub(crate) cloned: bool,
    /// The type whose planner plans it: its tag's, where `component_type`
    /// is the type outlining settled (a `<math>` that is a point, ADR 0029).
    pub(crate) planned_as: ComponentType,
    pub(crate) body: Body,
    /// A container copy whose clones outlining has not made yet: what a
    /// reference reads of it is not there (`Compiler::outlined_elem`).
    /// Outlining's, and false once outlining is done.
    pub(crate) clones_pending: bool,
}

impl Elem {
    /// This element as its box (ADR 0013, ADR 0027): an `_error` element
    /// with its node and name, and no props, children, body or extend.
    pub(crate) fn as_box(&self) -> Elem {
        Elem {
            node: self.node,
            component_type: ComponentType::Error,
            name: self.name,
            name_scope: self.name_scope,
            children: Vec::new(),
            extend: None,
            cloned: self.cloned,
            planned_as: self.planned_as,
            body: Body::Plain,
            clones_pending: false,
        }
    }
}

/// What planning makes of one element (ADR 0031): row `e` of a
/// template's `plans` is element `e`'s. Linking aliases shared ports in
/// `props`; no other stage writes it.
#[derive(Debug, Clone, Default)]
pub(crate) struct ElemPlan {
    /// Each port's source, by `Port::index`: the table's props, then two
    /// per point of the list, then the hidden ports.
    pub(crate) props: Vec<Source>,
    /// How many points its list holds (ADR 0016), which says how many of
    /// `props` are public; the hidden ports follow them.
    pub(crate) list: ListLen,
    /// What holds it (`fixed`, `compile/planning/fix.rs`).
    pub(crate) hold: Hold,
    /// What planning gave its body to read: the reference a `<collect>`
    /// gathers from, or the list a `<pointList extend="$l.points">`
    /// takes its points from.
    pub(crate) from: Option<RefId>,
    /// What the element is a copy of, which the build wires it from:
    /// outlining's `Elem::extend`, unless planning made the element an
    /// alias of what it extends instead (an extend of a prop, ADR 0025).
    pub(crate) extend: Option<RefId>,
}

impl ElemPlan {
    /// The plan of a box, and of an element not planned: nothing.
    pub(crate) const NONE: ElemPlan = ElemPlan {
        props: Vec::new(),
        list: ListLen::None,
        hold: Hold::Off,
        from: None,
        extend: None,
    };

    /// How many of the element's ports are public, for an element of
    /// `component_type`: its table's props and its list's points. None
    /// when only a build knows (`ListLen::AsReferent`).
    pub(crate) fn n_public(&self, component_type: ComponentType) -> Option<usize> {
        let n_table = component_type.prop_defs().len();
        match self.list {
            ListLen::None => Some(n_table),
            ListLen::Points(n) => Some(n_table + 2 * n as usize),
            ListLen::AsReferent => None,
        }
    }
}

/// What outlining knows of a `$ref` child (ADR 0031): its node, the
/// element whose child it is (`None` for the template's own children), and
/// whether its path carries an index.
#[derive(Debug, Clone, Copy)]
pub(crate) struct RefChild {
    pub(crate) node: NodeId,
    pub(crate) owner: Option<ElemId>,
    pub(crate) has_index: bool,
}

/// A `$ref` child's plan (ADR 0031): planning's, as a reference, or a box
/// when it cannot be planned (ADR 0027), which the build makes an `_error`
/// component of. `Unplanned` is under a box: no build reaches it.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub(crate) enum RefChildPlan {
    #[default]
    Unplanned,
    Ref(RefId),
    Boxed,
}

/// The stage that made a box (ADR 0031): a reader of a referent's type
/// while planning sees only outlining's, so planning does not depend on
/// its own order.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Stage {
    Outline,
    Plan,
    Link,
}

/// Whether an element is a box (ADR 0031): boxing's own table, parallel to
/// the elements, so boxing never rewrites what another stage made.
#[derive(Debug, Clone, Default)]
pub(crate) enum BoxState {
    #[default]
    Live,
    /// Boxed where it failed, or, `dead`, under a box: no build makes a
    /// dead element, and a reference to it reads as undefined. `row` is
    /// the element as the build sees it (`Elem::as_box`).
    Boxed {
        row: Box<Elem>,
        by: Stage,
        dead: bool,
    },
}

/// What holds an element (`compile/planning/fix.rs`): a fact beside its plans,
/// never a change to them. The build makes each of the element's cells
/// refuse requests as it says (`Program::holds`).
#[derive(Debug, Clone, Default)]
pub(crate) enum Hold {
    #[default]
    Off,
    /// A literal `fixed`.
    Always,
    /// While any of these flags is set.
    While(Vec<RefId>),
}

/// What sealing makes of one element (ADR 0031): row `e` of a template's
/// `sealed` table is element `e`'s.
#[derive(Debug, Clone, Copy)]
pub(crate) struct Sealed {
    /// The element's identity across loads, for saved state.
    pub(crate) key: ElemKey,
    /// First of this element's prop slots within the template's slot space,
    /// once every element is planned, since planned types add hidden slots
    /// after the public props.
    pub(crate) slot_off: u32,
}

/// What sealing makes of a template (ADR 0031): a row per element, how
/// many slots its elements take, and what each port holds.
#[derive(Debug, Clone, Default)]
pub(crate) struct SealedTemplate {
    pub(crate) elems: Vec<Sealed>,
    pub(crate) n_slots: u32,
    /// Each port's type (ADR 0032), by template slot (`Sealed::slot_off`
    /// plus the port's position): what the type pass inferred once, which
    /// every build reads (`compile/seal/types.rs`).
    pub(crate) types: Vec<PortType>,
}

/// What a port's cell holds (ADR 0032): a number (a boolean or an index
/// among them), a string id, or a handle in the symbolic engine. Inferred
/// once per template port by the compile's type pass, from the port's
/// source and the ports it reads, and read by every build: a cell's value
/// type (`program::ValueType`) is its defining port's. `Num` is the
/// bottom: what a port is until something it reads says otherwise.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
pub enum PortType {
    #[default]
    Num,
    Text,
    Math,
}

impl PortType {
    /// The least type above both: `Num` yields to either, and a text port
    /// read where a math is expected is refused before this is asked.
    pub(crate) fn join(self, other: PortType) -> PortType {
        match (self, other) {
            (PortType::Num, t) | (t, PortType::Num) => t,
            (PortType::Math, _) | (_, PortType::Math) => PortType::Math,
            (PortType::Text, PortType::Text) => PortType::Text,
        }
    }

    /// The value type a cell of this port holds.
    pub fn value_type(self) -> crate::program::ValueType {
        match self {
            PortType::Num => crate::program::ValueType::Number,
            PortType::Text => crate::program::ValueType::Text,
            PortType::Math => crate::program::ValueType::Math,
        }
    }
}

/// What outlining makes of a template (ADR 0031): its elements' rows,
/// its own children and its `$ref` children. Read-only to every stage
/// after outlining (`Settled::templates`).
#[derive(Debug, Clone, Default)]
pub(crate) struct Outlined {
    /// (template, element) of the repeat or choice this template belongs to.
    pub(crate) parent: Option<(TemplateId, ElemId)>,
    pub(crate) elems: Vec<Elem>,
    /// Children of the template itself (the document, a repeat body or a
    /// choice branch).
    pub(crate) children: Vec<Child>,
    /// Outlining's table of `$ref` children (ADR 0031), by `RefChildId`.
    pub(crate) ref_children: Vec<RefChild>,
}

/// What boxing and planning make of a template's elements (ADR 0031),
/// parallel to `Outlined::elems` and `ref_children`: the tables the stages
/// after outlining write.
#[derive(Debug, Clone, Default)]
pub(crate) struct Tables {
    /// Boxing's table: a row per element.
    pub(crate) boxes: Vec<BoxState>,
    /// Planning's table: empty until planning makes it.
    pub(crate) plans: Vec<ElemPlan>,
    /// Planning's table of `$ref` children's plans: empty until planning
    /// makes it.
    pub(crate) ref_child_plans: Vec<RefChildPlan>,
}

/// A template as the build reads it: each stage's table, put together
/// once the compile is done (ADR 0031). It reads as its outlined part
/// (`Deref`).
#[derive(Debug, Clone, Default)]
pub(crate) struct Template {
    pub(crate) outlined: Outlined,
    pub(crate) tables: Tables,
    /// Sealing's table (ADR 0031), parallel to `elems`.
    pub(crate) sealed: SealedTemplate,
}

impl std::ops::Deref for Template {
    type Target = Outlined;
    fn deref(&self) -> &Outlined {
        &self.outlined
    }
}

/// A template's outlined part and its tables, read together: an element as
/// built, its plan, whether it is a box.
#[derive(Clone, Copy)]
pub(crate) struct TemplateRef<'t> {
    pub(crate) outlined: &'t Outlined,
    pub(crate) tables: &'t Tables,
}

impl std::ops::Deref for TemplateRef<'_> {
    type Target = Outlined;
    fn deref(&self) -> &Outlined {
        self.outlined
    }
}

impl<'t> TemplateRef<'t> {
    /// Whether element `e` is a box, or under one.
    pub(crate) fn is_box(self, e: ElemId) -> bool {
        matches!(self.tables.boxes[e.index()], BoxState::Boxed { .. })
    }

    /// Whether element `e` is under a box: no build makes it.
    pub(crate) fn is_dead(self, e: ElemId) -> bool {
        matches!(
            self.tables.boxes[e.index()],
            BoxState::Boxed { dead: true, .. }
        )
    }

    /// Element `e` as built: its box's row when it is a box, else its own.
    pub(crate) fn row(self, e: ElemId) -> &'t Elem {
        match &self.tables.boxes[e.index()] {
            BoxState::Boxed { row, .. } => row,
            BoxState::Live => &self.outlined.elems[e.index()],
        }
    }

    /// Element `e`'s plan as built: nothing for a box, else planning's.
    pub(crate) fn plan(self, e: ElemId) -> &'t ElemPlan {
        static NONE: ElemPlan = ElemPlan::NONE;
        match self.tables.boxes[e.index()] {
            BoxState::Boxed { .. } => &NONE,
            BoxState::Live => &self.tables.plans[e.index()],
        }
    }

    /// Every element as built, in order.
    pub(crate) fn rows(self) -> impl Iterator<Item = &'t Elem> {
        (0..self.outlined.elems.len()).map(move |e| self.row(ElemId::from_index(e)))
    }
}

impl Template {
    /// Its outlined part and its tables, read together.
    pub(crate) fn view(&self) -> TemplateRef<'_> {
        TemplateRef {
            outlined: &self.outlined,
            tables: &self.tables,
        }
    }

    pub(crate) fn is_dead(&self, e: ElemId) -> bool {
        self.view().is_dead(e)
    }

    pub(crate) fn row(&self, e: ElemId) -> &Elem {
        self.view().row(e)
    }

    pub(crate) fn plan(&self, e: ElemId) -> &ElemPlan {
        self.view().plan(e)
    }
}

/// One step of a resolved reference path.
#[derive(Debug, Clone)]
pub(crate) enum Step {
    /// An element of the current template.
    Elem(ElemId),
    /// `[k]` on the repeat or collect just selected.
    Index(IndexPlan),
    /// An interface name of a choice, by its name-table id: `$cc.x`, or
    /// `$s[1].x` after an index into a select's picks. Its position among
    /// the names references use is sealing's (`ChoiceDef::used_at`), so a
    /// reference plans the same in any stage and order (ADR 0031).
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
    pub(crate) prop: Option<RefProp>,
    /// How the plan is shown in an error (`Compiled::display_of`).
    pub(crate) display: RefDisplay,
    /// The macro node the plan came from, or NONE for a plan the build
    /// made itself; what an error in resolving it is reported on.
    pub(crate) node: NodeId,
}

/// The prop a reference plan names, found from its name once: on the type
/// the compile saw at the referent, or, when it did not know that type, a
/// name the build looks up (a prop a planner names).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum RefProp {
    /// `sel` of `of`. A build reaching a component of another type looks
    /// the prop up by its name on that type.
    Resolved {
        of: ComponentType,
        sel: crate::components::PropSel,
    },
    /// A prop named by the compile for a referent of a type it did not know.
    Named(&'static str),
}

impl RefProp {
    /// `sel` of `of`.
    pub(crate) fn of(of: ComponentType, sel: crate::components::PropSel) -> RefProp {
        RefProp::Resolved { of, sel }
    }

    /// Prop `name` of a referent of type `of`, when the compile knows it.
    pub(crate) fn named(of: Option<ComponentType>, name: &'static str) -> RefProp {
        match of.and_then(|ty| ty.resolve_prop(name).map(|sel| (ty, sel))) {
            Some((of, sel)) => RefProp::Resolved { of, sel },
            None => RefProp::Named(name),
        }
    }

    /// The prop's name: for an error, or a component of another type.
    pub(crate) fn name(&self) -> std::borrow::Cow<'static, str> {
        match *self {
            RefProp::Resolved { of, sel } => of.sel_name(sel),
            RefProp::Named(name) => name.into(),
        }
    }

    /// The selector on a component of type `ty`: the resolved one when
    /// `ty` is the type it was resolved on, else found by name.
    pub(crate) fn sel_on(&self, ty: ComponentType) -> Option<crate::components::PropSel> {
        match *self {
            RefProp::Resolved { of, sel } if of == ty => Some(sel),
            _ => ty.resolve_prop(&self.name()),
        }
    }

    /// Whether this is the table prop `name` (`value`, `expr`): for the
    /// compile's few checks of what a reference reads.
    pub(crate) fn is(&self, name: &str) -> bool {
        match *self {
            RefProp::Resolved {
                of,
                sel: crate::components::PropSel::At(crate::components::PropAt::Position(i)),
            } => of.prop_defs()[i].name == name,
            RefProp::Resolved { .. } => false,
            RefProp::Named(n) => n == name,
        }
    }
}

/// How a reference plan is shown in an error, spelled only then
/// (`Compiled::display_of`): planning a reference builds no string.
#[derive(Debug, Clone)]
pub(crate) enum RefDisplay {
    /// The plan's macro node (`RefPlan::node`) as written.
    Written,
    /// Another display, then `.prop`: a plan of another's prop.
    Prop(Box<RefDisplay>, &'static str),
    /// `(copy of c)`: a container copy's clone of element `c` of template `t`.
    CopyOf(TemplateId, ElemId),
    /// Spelled by the compile, for a plan it made itself.
    Spelled(Box<str>),
}

impl Compiled {
    /// How plan `p` is shown in an error.
    pub(crate) fn ref_display(&self, p: RefId) -> String {
        self.display_of(&self.refs[p.index()])
    }

    /// How `plan` is shown in an error.
    pub(crate) fn display_of(&self, plan: &RefPlan) -> String {
        self.spell_display(&plan.display, plan.node)
    }

    fn spell_display(&self, display: &RefDisplay, node: NodeId) -> String {
        match display {
            RefDisplay::Written => self.dast.macro_display(node).to_string(),
            RefDisplay::Prop(base, prop) => format!("{}.{prop}", self.spell_display(base, node)),
            RefDisplay::CopyOf(t, e) => {
                let el = &self.templates[t.index()].elems[e.index()];
                format!("(copy of {})", elem_label(&self.dast, el))
            }
            RefDisplay::Spelled(text) => text.to_string(),
        }
    }
}

/// An attribute a component's planner reads, as its `attributes { .. }`
/// declares it (`component!`): only the macro makes one, as a constant of
/// the component's `attr` module (`attr::radius`), so a planner can name
/// only an attribute its type declares, and a misspelling does not
/// compile. Its position among the type's declarations is where the
/// element's record holds it.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Attr(&'static str, u8);

impl Attr {
    /// An attribute a component declares; only `component!` calls this.
    #[doc(hidden)]
    pub(crate) const fn declared(name: &'static str, index: u8) -> Attr {
        Attr(name, index)
    }

    /// Its name, as the source spells it (ignoring case).
    pub(crate) const fn name(self) -> &'static str {
        self.0
    }

    /// Its position among its type's declarations (`Record`).
    pub(crate) const fn index(self) -> usize {
        self.1 as usize
    }
}

/// A parameter a planner introduces that no attribute gives (`params {
/// .. }` in `component!`, ADR 0032): a named given leaf with a default,
/// which a copy shares with its original (a line's distance along its
/// direction). Only the macro makes one.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Param(&'static str);

impl Param {
    /// A parameter a component declares; only `component!` calls this.
    #[doc(hidden)]
    pub(crate) const fn declared(name: &'static str) -> Param {
        Param(name)
    }

    pub(crate) const fn name(self) -> &'static str {
        self.0
    }
}

/// What gave a given leaf its value (ADR 0032, decision 3): an attribute
/// (its `k`-th leaf: a point's two coordinates, a list's points), the
/// element's children, or a parameter the planner introduced. A copy
/// shares every given leaf whose attribute it did not override by
/// aliasing it to the referent's port holding the same identity
/// (`plan_with_extend`, `link_given_leaves`), and a hidden port holding
/// one is saved by its identity's name (ADR 0017, `Keys`).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(crate) enum GivenId {
    Attr(Attr, u32),
    /// The `k`-th leaf of what the children give (a point's `(a, b)`).
    Children(u32),
    Param(Param),
}

impl GivenId {
    /// What saved state names a hidden port holding it by (ADR 0017): the
    /// attribute's or the parameter's name, and the leaf's position after
    /// the first (`_through3`), under a `_` so it is never a prop's name
    /// (a circle's given radius beside its `radius` prop).
    pub(crate) fn key(self) -> String {
        match self {
            GivenId::Attr(a, 0) => format!("_{}", a.name()),
            GivenId::Attr(a, k) => format!("_{}{k}", a.name()),
            GivenId::Children(0) => "_children".to_string(),
            GivenId::Children(k) => format!("_children{k}"),
            GivenId::Param(p) => format!("_{}", p.name()),
        }
    }
}

/// A point a planner uses when the author gives none: the parameters its
/// coordinates are, and their value. Both are a component's to say (the
/// line's and segment's values are in `components/geometry/mod.rs`).
pub(crate) type DefaultPoint = ([Param; 2], [f64; 2]);

/// One port's source and, when it is a given leaf, what gave it: what a
/// typed plan's fields hold (`component!`'s `Props`), so a given leaf is
/// always identified on the port that holds it.
#[derive(Debug, Clone)]
pub(crate) struct Wire {
    pub(crate) source: Source,
    given: Option<GivenId>,
}

impl From<Source> for Wire {
    fn from(source: Source) -> Self {
        Wire {
            source,
            given: None,
        }
    }
}

impl Wire {
    /// A given value `v`, the `k`-th leaf of what `id` gives: state when a
    /// student's action can write it (ADR 0018).
    pub(crate) fn given(id: GivenId, v: f64) -> Self {
        Wire {
            source: Source::given(v),
            given: Some(id),
        }
    }
    /// A given value `v` of attribute `attr` (its first leaf).
    pub(crate) fn given_by(attr: Attr, v: f64) -> Self {
        Wire::given(GivenId::Attr(attr, 0), v)
    }
    /// A parameter at its default `v`.
    pub(crate) fn param(param: Param, v: f64) -> Self {
        Wire::given(GivenId::Param(param), v)
    }
    /// A given text value, given by `attr`, initially the string `id`.
    pub(crate) fn given_text(id: GivenId, text: StrId) -> Self {
        Wire {
            source: Source::Leaf(Leaf::GivenText(Some(text))),
            given: Some(id),
        }
    }
    /// A constant (ADR 0028), not NaN: a value not given is
    /// `absent`, one the element cannot have `undefined`.
    pub(crate) fn constant(v: f64) -> Self {
        assert!(
            !v.is_nan(),
            "Wire::constant(NaN): use Wire::absent, or Wire::undefined after a warning"
        );
        Source::constant(v).into()
    }
    /// A value not given (`NO_VALUE`), as a constant.
    pub(crate) fn absent() -> Self {
        Source::absent().into()
    }
    /// A value the element cannot have, as `warned` explains: NaN.
    pub(crate) fn undefined(warned: Warned) -> Self {
        Source::undefined(warned).into()
    }
    /// An alias of the element's own port.
    pub(crate) fn own(port: Port) -> Self {
        Source::own(port).into()
    }
    /// An operator over the element's own ports.
    pub(crate) fn computed(op: OpSpec, args: Vec<Port>) -> Self {
        Source::computed(op, args).into()
    }
    /// The prop at `port` as the type's table computes it from its other
    /// props.
    pub(crate) fn from_table(component_type: ComponentType, port: Port) -> Self {
        let i = port.index();
        match component_type.prop_defs()[i].from {
            PropFrom::Computed { op, args } => Source::from_def(op, &args).into(),
            _ => unreachable!(
                "{} is not computed by the table",
                component_type.prop_defs()[i].name
            ),
        }
    }
    /// A scalar as its source plans it: a literal is a given leaf of `id`,
    /// anything else what it computes.
    pub(crate) fn scalar(source: Source, id: GivenId) -> Self {
        match source {
            Source::Leaf(Leaf::Given(v)) => Wire::given(id, v),
            other => other.into(),
        }
    }
    /// A given point as `point` plans it, else the default with its
    /// parameters.
    pub(crate) fn point_or_default(
        p: Option<&GivenPoint>,
        attr: Attr,
        k: usize,
        (params, default): DefaultPoint,
    ) -> [Self; 2] {
        match p {
            Some(p) => Self::point(p, attr, k),
            None => std::array::from_fn(|j| Self::param(params[j], default[j])),
        }
    }
    /// The `k`-th point of attribute `attr`: a literal coordinate is a
    /// given leaf of the attribute, the `2k + j`-th.
    pub(crate) fn point(p: &GivenPoint, attr: Attr, k: usize) -> [Self; 2] {
        Self::point_given(p, |j| GivenId::Attr(attr, (2 * k + j) as u32))
    }
    /// A point's two coordinates, a literal coordinate a given leaf whose
    /// identity `id` names by coordinate.
    pub(crate) fn point_given(p: &GivenPoint, id: impl Fn(usize) -> GivenId) -> [Self; 2] {
        std::array::from_fn(|j| match p.coord(j) {
            Source::Leaf(Leaf::Given(v)) => Wire::given(id(j), v),
            other => other.into(),
        })
    }
}

/// How each of an element's ports gets its value, as its planner builds
/// it (ADR 0032): the public ports (the table's props, then the list's
/// points), then hidden ports holding helper values that the props read
/// like any own port. A planner names a port only as the wiring hands it
/// out: the table's by `Props::PORTS`, a list point's by `item`, a hidden
/// one by what made it.
pub(crate) struct ElemWiring {
    component_type: ComponentType,
    /// Each port's source, by `Port::index`.
    props: Vec<Option<Source>>,
    /// How many points the list holds, two ports each after the table's
    /// props.
    n_points: usize,
    /// Which port holds each given leaf, by what gave it.
    given: HashMap<GivenId, Port>,
}

/// The props of an element planned from its type's table (`plan_attrs`),
/// one per table prop by its port, which a `PropsThen` planner adjusts
/// (`props[Props::PORTS.expr] = Some(..)`).
pub(crate) struct TableProps(Vec<Option<Source>>);

impl TableProps {
    /// One unplanned prop per prop of `component_type`'s table.
    pub(in crate::compile) fn of(component_type: ComponentType) -> Self {
        TableProps(vec![None; component_type.prop_defs().len()])
    }

    /// The props in table order, each planned.
    pub(in crate::compile) fn finish(self) -> Vec<Source> {
        self.0
            .into_iter()
            .enumerate()
            .map(|(i, p)| p.unwrap_or_else(|| panic!("table prop {i} left unplanned")))
            .collect()
    }
}

impl std::ops::Index<Port> for TableProps {
    type Output = Option<Source>;
    fn index(&self, port: Port) -> &Option<Source> {
        &self.0[port.index()]
    }
}

impl std::ops::IndexMut<Port> for TableProps {
    fn index_mut(&mut self, port: Port) -> &mut Option<Source> {
        &mut self.0[port.index()]
    }
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
    /// Wiring for an element of `component_type`, one public port per prop
    /// in its table, each set by its name (`Props::PORTS`).
    pub(crate) fn of(component_type: ComponentType) -> Self {
        let n_table = component_type.prop_defs().len();
        ElemWiring {
            component_type,
            props: vec![None; n_table],
            n_points: 0,
            given: HashMap::new(),
        }
    }

    /// Wiring for an element of `component_type` whose list holds
    /// `n_points` points, two public ports each after the table's props
    /// (`item`).
    pub(crate) fn with_list(component_type: ComponentType, n_points: usize) -> Self {
        debug_assert!(component_type.given_coords().is_some());
        let mut wiring = Self::of(component_type);
        wiring.n_points = n_points;
        wiring.props.resize(wiring.n_public(), None);
        wiring
    }

    /// How many of the ports are public: the table's props and the list's
    /// points.
    fn n_public(&self) -> usize {
        self.component_type.prop_defs().len() + 2 * self.n_points
    }

    /// The two ports holding the coordinates of list point `k` (0-based),
    /// which the wiring holds.
    pub(crate) fn item(&self, k: usize) -> [Port; 2] {
        assert!(
            k < self.n_points,
            "list point {k} of a list of {} points",
            self.n_points
        );
        let first = self.component_type.prop_defs().len() + 2 * k;
        [Port::table(first), Port::table(first + 1)]
    }

    /// The ports of every list point, in order (`item`).
    pub(crate) fn items(&self) -> impl Iterator<Item = [Port; 2]> + '_ {
        (0..self.n_points).map(|k| self.item(k))
    }

    /// A hidden port planned as `source`.
    pub(crate) fn hidden(&mut self, source: Source) -> Port {
        self.props.push(Some(source));
        Port::table(self.props.len() - 1)
    }
    /// Two hidden ports holding the `k`-th point of attribute `attr`, a
    /// literal coordinate a given leaf of it.
    pub(crate) fn hidden_point_of(&mut self, p: &GivenPoint, attr: Attr, k: usize) -> [Port; 2] {
        Wire::point(p, attr, k).map(|w| self.hidden_wire(w))
    }
    /// Two hidden ports holding a point's coordinates.
    pub(crate) fn hidden_point(&mut self, p: &GivenPoint) -> [Port; 2] {
        [self.hidden(p.coord(0)), self.hidden(p.coord(1))]
    }
    /// A hidden port planned as `p`, holding its given leaf if any.
    pub(crate) fn hidden_wire(&mut self, p: Wire) -> Port {
        let port = self.hidden(p.source);
        if let Some(id) = p.given {
            self.given.insert(id, port);
        }
        port
    }
    /// A hidden port holding parameter `param` at `value`.
    pub(crate) fn param(&mut self, param: Param, value: f64) -> Port {
        self.hidden_wire(Wire::param(param, value))
    }
    /// Every table prop's port, from a typed plan's fields in table order
    /// (`Props::into_iter`), with their given leaves.
    pub(crate) fn set_public(&mut self, props: impl IntoIterator<Item = Wire>) {
        for (i, p) in props.into_iter().enumerate() {
            self.props[i] = Some(p.source);
            if let Some(id) = p.given {
                self.given.insert(id, Port::table(i));
            }
        }
    }
    /// `set_public` for a typed plan of sources that hold no shared state.
    pub(crate) fn set_public_sources(&mut self, props: impl IntoIterator<Item = Source>) {
        self.set_public(props.into_iter().map(Wire::from));
    }
    /// The list's points, which fill the public ports after the table's
    /// props (`item`), with their given leaves.
    pub(crate) fn set_list(&mut self, points: Vec<[Wire; 2]>) {
        assert_eq!(
            points.len(),
            self.n_points,
            "the wiring holds the list's points"
        );
        for (k, point) in points.into_iter().enumerate() {
            let ports = self.item(k);
            for (port, p) in ports.into_iter().zip(point) {
                self.props[port.index()] = Some(p.source);
                if let Some(id) = p.given {
                    self.given.insert(id, port);
                }
            }
        }
    }
    /// `vector` for as many consecutive ports as the operator has outputs,
    /// from `head` (a list's points, which a polygon's `Shape` moves).
    pub(crate) fn vector_from(head: Port, op: VecOp, args: Vec<Port>, consts: &[f64]) -> Vec<Wire> {
        let args: Vec<Arg> = args
            .into_iter()
            .map(Arg::Own)
            .chain(consts.iter().map(|&k| Arg::Const(k)))
            .collect();
        (0..op.n_out())
            .map(|k| {
                if k == 0 {
                    Source::op(OpSpec::Vec(op), args.clone()).into()
                } else {
                    Source::Flow(Flow::VecOut(head, byte(k))).into()
                }
            })
            .collect()
    }
    /// The outputs of a vector instruction over own ports, for the public
    /// ports `at`, which must be consecutive: the head at `at[0]`, output
    /// `k` at `at[k]`.
    pub(crate) fn vector<const N: usize>(at: [Port; N], op: VecOp, args: Vec<Port>) -> [Wire; N] {
        assert_eq!(op.n_out(), N, "a vector operator's outputs are its ports");
        assert!(
            at.iter()
                .enumerate()
                .all(|(k, a)| a.index() == at[0].index() + k),
            "a vector operator's outputs are consecutive ports"
        );
        std::array::from_fn(|k| {
            if k == 0 {
                Source::vector(op, args.clone()).into()
            } else {
                Source::Flow(Flow::VecOut(at[0], byte(k))).into()
            }
        })
    }

    /// Which port holds each given leaf, by what gave it
    /// (`plan_with_extend`).
    pub(in crate::compile) fn given(&self) -> &HashMap<GivenId, Port> {
        &self.given
    }

    /// Whether `port` is planned as a given value.
    pub(in crate::compile) fn is_given(&self, port: Port) -> bool {
        matches!(self.props[port.index()], Some(Source::Leaf(Leaf::Given(_))))
    }

    /// Every port's source, by `Port::index`, and how many points the list
    /// holds: what an element's plan keeps of it.
    pub(crate) fn finish(self) -> (Vec<Source>, ListLen) {
        let list = if self.component_type.given_coords().is_some() {
            ListLen::Points(self.n_points as u32)
        } else {
            ListLen::None
        };
        let props = self
            .props
            .into_iter()
            .enumerate()
            .map(|(i, p)| p.unwrap_or_else(|| panic!("public prop {i} left unplanned")))
            .collect();
        (props, list)
    }
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
    pub(crate) arena: Arena<RefId>,
    /// The math text of templates that may be symbolic, with each `$ref`
    /// written `cellN<plan>` (see `sym::engine::leaf_name`).
    pub(crate) sym_text: HashMap<ExprId, SymText>,
    /// In a document with repeats, each math text's parse once a build has
    /// found the math symbolic: a template parses once however many
    /// instances stamp it and however many builds run. Empty in a document
    /// without repeats, whose abstract build and one build each parse,
    /// which costs less than keeping the trees would raise its load's peak
    /// memory.
    pub(crate) sym_trees: HashMap<ExprId, OnceLock<std::result::Result<Tree<RefId>, String>>>,
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
    /// The source's diagnostics (ADR 0013, ADR 0015): the lint findings,
    /// the errors of the boxed elements and the planners' and the abstract
    /// build's warnings, in node order, which every document built from
    /// this compile reports. Set by `compile::compile`.
    pub(crate) diagnostics: Arc<Vec<crate::diagnostics::Diagnostic>>,
    /// The document's structural depth (`CONTEXT.md`) as the abstract build
    /// found it, which bounds every build's, since each build's chains of
    /// repeats map onto the abstract build's: 0 without a repeat, and 0
    /// when a test load skips the abstract build's count check.
    pub(crate) structural_depth: u32,
    /// The abstract build's record of the value slots a student's action
    /// can write (ADR 0018), by which every build classes them essential or
    /// constant; None with the classing off (a test load), when every value
    /// slot is essential.
    pub(crate) classes: Option<Arc<Record>>,
    /// The abstract build's record of the live slots (ADR 0019), by which
    /// every build finds which cells it computes.
    pub(crate) live: Arc<Record>,
    /// The abstract build's record of the counted values (ADR 0028): the
    /// template slots whose value a build counts from the structure it
    /// stamped (a collect's count, a section's number after a repeat, the
    /// credit of a section whose answers are all in repeats). Each follows
    /// the counts, so every build makes it a derived cell, never a
    /// constant, even at a count where it has nothing to count.
    pub(crate) counted: Arc<Record>,
    /// The abstract build's record of the document constants (ADR 0028):
    /// the template slots whose constant is the same in every instance,
    /// made from the source alone. Every other constant is a scope
    /// constant.
    pub(crate) document_constants: Arc<Record>,
    /// Whether a build gives a dead slot no cell (ADR 0019,
    /// `LoadOptions::prune`); never in the abstract build.
    pub(crate) prune: bool,
    /// Whether a build folds instructions over constants (ADR 0028,
    /// `LoadOptions::fold`); never in the abstract build.
    pub(crate) fold: bool,
}

/// What the abstract build records of a document (ADR 0018, ADR 0019): per
/// template, a bit per template slot (`slot_off + pi`), set for a slot a
/// student's action can write or for a live one. Every build of the
/// document reads it, so a slot's class is the same in every build.
#[derive(Debug, Clone, Default, PartialEq)]
pub(crate) struct Record(pub(crate) Vec<Vec<u64>>);

impl Record {
    /// Whether the record marks template slot `slot` of `template`.
    pub(crate) fn marks(&self, template: usize, slot: u32) -> bool {
        self.0[template]
            .get(slot as usize / 64)
            .is_some_and(|w| w & (1 << (slot % 64)) != 0)
    }
}

impl Compiled {
    /// The source it was compiled from.
    pub fn dast(&self) -> &Arc<Dast> {
        &self.dast
    }

    /// The type of template slot `slot` of `template` (ADR 0032): what the
    /// type pass settled for the port, which every build reads.
    pub fn port_type(&self, template: usize, slot: u32) -> PortType {
        self.templates[template].sealed.types[slot as usize]
    }

    /// Drop the plans' spare capacity once planning is done, before the
    /// check builds, so the build reuses that memory rather than raising
    /// the load's peak, which in wasm is what the page keeps. (What only
    /// planning reads, the name table and shared state, is the `Compiler`'s and
    /// goes with it.)
    pub(crate) fn shrink_to_fit(&mut self) {
        self.templates.shrink_to_fit();
        for tpl in &mut self.templates {
            let o = &mut tpl.outlined;
            o.elems.shrink_to_fit();
            o.children.shrink_to_fit();
            for el in &mut o.elems {
                el.children.shrink_to_fit();
            }
            for plan in &mut tpl.tables.plans {
                plan.props.shrink_to_fit();
            }
        }
        self.refs.shrink_to_fit();
        self.arena.nodes.shrink_to_fit();
        self.sym_text.shrink_to_fit();
        self.choices.shrink_to_fit();
    }

    /// How many build passes a load or a rebuild may take before the
    /// structure must have settled: the structural depth plus one, and
    /// never fewer than `floor`.
    pub(crate) fn passes(&self, floor: usize) -> usize {
        (self.structural_depth as usize + 1).max(floor)
    }

    /// Whether any template is a repeat body: without one the structure
    /// never changes, the schedule's own check is complete, and no later
    /// build stamps the compile.
    pub(crate) fn has_repeats(&self) -> bool {
        self.templates.iter().any(|t| {
            t.elems
                .iter()
                .any(|e| matches!(e.body, Body::Repeat { .. }))
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// What a plan gives is classed by its kind alone (ADR 0032, step 3):
    /// every leaf but a scope constant is a document constant when it is a
    /// constant, every math expression is, and nothing that reads a port,
    /// chooses by the scope or waits for the tree is.
    #[test]
    fn document_constants_are_classed_by_kind() {
        let p = RefId::new(0);
        let expr = ExprId::new(0);
        let leaves = [
            (Leaf::Given(1.0), true),
            (Leaf::GivenText(None), true),
            (Leaf::GivenMath(None), true),
            (Leaf::Const(1.0), true),
            (Leaf::Scope(ScopeConst::IterIndex), false),
            (
                Leaf::Scope(ScopeConst::SequencePick {
                    from: 1.0,
                    step: 1.0,
                    count: 2,
                }),
                false,
            ),
            (Leaf::Scope(ScopeConst::Seed(p)), false),
        ];
        for (leaf, document) in leaves {
            assert_eq!(
                Source::Leaf(leaf.clone()).gives_document_constant(),
                document,
                "{leaf:?}"
            );
        }
        let flows = [
            (Flow::Alias(Arg::Ref(p, Sel::Whole)), false),
            (
                Flow::Op(OpSpec::Add, vec![Arg::Const(1.0), Arg::Const(2.0)]),
                false,
            ),
            (Flow::VecOut(Port::table(0), 1), false),
            (Flow::Math(expr), true),
            (Flow::MathHandle(expr, Post::None), true),
            (Flow::MathValue(expr), true),
            (Flow::SymExpr(expr, Post::None), true),
        ];
        for (flow, document) in flows {
            assert_eq!(
                Source::Flow(flow.clone()).gives_document_constant(),
                document,
                "{flow:?}"
            );
        }
        let one = Box::new(Source::constant(1.0));
        assert!(
            !Source::Specialize(ScopePred::FirstIteration, one.clone(), one)
                .gives_document_constant()
        );
        assert!(!Source::Deferred(Deferred::Credit).gives_document_constant());
    }
}

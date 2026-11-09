//! The declaration vocabulary: a component type's row ([`ComponentDef`]),
//! and how it declares its props ([`PropDef`], [`PropFrom`]), attributes
//! ([`AttrDecl`]), children ([`ChildrenDecl`]), list, flags and where it
//! renders. `component!` writes these; the compile and the build read them.

use super::*;
use crate::program::OpSpec;

/// What the core knows about a type apart from how it is planned and
/// expanded: one row per type in `COMPONENT_DEFS`, indexed by discriminant.
pub struct ComponentDef {
    /// The tag the type shows as, then other tags that make it.
    pub tags: &'static [&'static str],
    /// The single-cell props, in table order.
    pub props: &'static [PropDef],
    /// The prop a bare `$name` reference resolves to.
    pub default_prop: Option<&'static str>,
    /// Props made of several single-cell props, read together: a point's
    /// `coords` is `x` and `y`.
    pub combined_props: &'static [(&'static str, &'static [&'static str])],
    /// The type's one list prop of points, if it has one.
    pub list: Option<ListProp>,
    /// The current core's spellings of a few props, accepted in references
    /// so its documents resolve unchanged.
    pub alternate_names: &'static [(&'static str, &'static str)],
    /// What the type is apart from its props.
    pub flags: Flags,
    /// Where a component of the type is drawn.
    pub renders: Renders,
    /// The type a bare reference to a component of this type reads as: `$mi` of
    /// a `<mathInput>` is a `<math>` holding what the reader entered, not a
    /// second input. `None` for a type a bare reference copies.
    pub reads_as: Option<ComponentType>,
    /// How an element of the type is planned.
    pub(crate) planner: crate::compile::api::Planner,
    /// The attributes the type's planner reads, each with its kind.
    pub attributes: &'static [AttrDecl],
    /// How the type reads its children.
    pub children: ChildrenDecl,
    /// The machinery several types share that plans an element of the type, in
    /// place of a planner of its own.
    pub machinery: Option<Machinery>,
    /// What owns an `owned` type, for the refusal of a free one.
    pub owner: Option<ComponentType>,
    /// The roles the type plays for the core: what it makes when it needs a
    /// root, a refused element's box, an iteration's index, ... Each role is
    /// claimed by exactly one type.
    pub roles: &'static [Role],
    /// How the type is structure rather than content: looked through, a
    /// gate, or a repeat. `None` for a type whose children are its own.
    pub structure_kind: Option<StructureKind>,
    /// What an answer's response reads of an input of this type, and what
    /// kind of value it is; `Some` marks the type as an answer's input.
    pub response: Option<ResponseKind>,
    /// How a component of the type shows in text; `None` for its
    /// children's text.
    pub text: Option<TextKind>,
    /// What a component of the type changes about where its descendants
    /// are: inside a graph, or in a sticky group.
    pub encloses: Option<Encloses>,
    /// How a point is constrained to a component of the type: a type without
    /// one is no constraint target.
    pub constrain_target: Option<ConstrainTarget>,
    /// The parameters the type's planner introduces that no attribute gives:
    /// named given leaves a copy shares.
    pub params: &'static [&'static str],
    /// Attributes of this type a renderer reads and the core does not.
    pub presentation: &'static [&'static str],
    /// How a member of a sticky group attracts and snaps: its shape, and
    /// where its points are.
    pub sticky: Option<(crate::tick::snap::Shape, StickyPoints)>,
}

/// What an attribute a planner reads holds: how it is parsed, and the type of
/// its field in the type's `Attrs`.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AttrKind {
    /// A number, a reference or math (`radius="2"`, `x="$n"`,
    /// `slope="2 $m"`): a source.
    Scalar,
    /// A literal number or one reference, as a table prop's attribute is read:
    /// a source, or an error for math.
    Value,
    /// A point: one reference, or a tuple `(a, b)`.
    Point,
    /// A list of points, at most `max` when given.
    Points {
        /// The most points the list may hold.
        max: Option<usize>,
    },
    /// A list of scalars, each a number or one reference, separated by
    /// spaces as DoenetML writes a list (`exclude="$a 7 $b"`): a source
    /// each.
    Scalars,
    /// An on/off attribute that may be bound (`hide="$h"`): a 0/1 source,
    /// `default` without one.
    Flag {
        /// The value when the attribute is absent.
        default: bool,
    },
    /// A literal on/off attribute: present and empty or `true`.
    Bool {
        /// The value when the attribute is absent.
        default: bool,
    },
    /// A literal number, `default` when absent or not a number.
    Number {
        /// The value when the attribute is absent or not a number.
        default: f64,
    },
    /// A literal number, `default` when absent; a reference or text that is no
    /// number is an error when the planner reads it.
    Literal {
        /// The value when the attribute is absent.
        default: f64,
    },
    /// A literal on/off attribute that may also take a value: present and
    /// not `false` or `none` (`simplify`, `simplify="full"`).
    On,
    /// Whether the attribute is written at all, whatever it holds: one a
    /// type refuses.
    Written,
    /// A literal on/off attribute that decides the wiring: present and
    /// empty or `true`, read as written; one holding a reference is no
    /// literal, which the planner refuses.
    LiteralFlag,
    /// A value as children are one: a literal, one reference, or math text (a
    /// `<mathInput>`'s `prefill`).
    Content,
    /// Literal text, none when it holds a reference.
    Text,
    /// Math text, kept as the nodes it is written in for the planner to
    /// parse as it needs (a line's equation).
    Math,
    /// One reference and nothing else.
    Ref,
}

/// One attribute a type's planner reads.
#[derive(Debug, Clone, Copy)]
pub struct AttrDecl {
    /// The attribute's name, as written.
    pub name: &'static str,
    /// How it is parsed.
    pub kind: AttrKind,
}

/// How a type reads its children: what they are parsed into before the planner
/// runs.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ChildrenKind {
    /// Read by nothing and built as nothing: only presentation (a `<label>`) is
    /// built, for a renderer. A shape's.
    None,
    /// Math text: the text and references, kept as the nodes they are
    /// written in for the planner to parse as it needs (a `<math>`'s, a
    /// `<function>`'s, a `<point>`'s `(a, b)`).
    Math,
    /// A value: a blank, a literal, one reference, or math text (a
    /// `<number>`'s, a `<text>`'s, an input's initial state), the one
    /// reference planned.
    Value,
    /// Content a renderer shows: every child is built as a component, and
    /// nothing reads them as a value. What a type that declares nothing
    /// has.
    Rendered,
}

/// How a `<constrainTo>` naming a component of a type constrains its point.
#[derive(Debug, Clone, Copy)]
pub enum ConstrainTarget {
    /// The point's coordinates are the projection by `op` of what it was
    /// asked, given the target's props `props`, in order
    /// (`constrain_target { ports: [cx, cy, radius], op: ProjectCircle }`).
    Project {
        /// The target's props the projection reads.
        props: &'static [&'static str],
        /// The projection.
        op: crate::program::VecOp,
    },
    /// The point rides a graph: its `x` is what was asked, its `y` the
    /// target's prop `expr` evaluated there (`constrain_target { graph:
    /// expr }`).
    Graph {
        /// The target's prop holding the curve's expression.
        expr: &'static str,
    },
}

/// Machinery several types share, which plans an element of a type that names
/// it.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Machinery {
    /// An answer, its inputs, awards and whens.
    Answer,
    /// A choice, reactive or at load.
    Choice,
    /// A repeat over a list.
    RepeatFor,
    /// A function's iterates, built as a repeat.
    FunctionIterates,
    /// Copies of the components under what an attribute names, of the type
    /// outlining recorded (`<collect from>`, `<polyline vertices>`).
    Collect,
}

/// A component the core makes without a tag in the source, or recognizes
/// in a part it played: which type plays it is the definition's to say
/// (`roles: [Root]`), so the core names the role and not the type (ADR
/// 0038). Each role is claimed by exactly one type, checked when the
/// types are listed; [`Role::ty`] finds it.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Role {
    /// The document's root, synthesized when the source has none; it also
    /// stands in for a `$ref` child until the reference resolves.
    Root,
    /// What a refused element is in the document: its box.
    Refused,
    /// A repeat's `indexName`: the iteration's 1-based position.
    Index,
    /// A `<repeatForSequence>`'s `valueName`: the sequence's value.
    SequenceValue,
    /// A `<repeat>`'s `valueName`, and a function iteration's hidden
    /// item: a tuple.
    Item,
    /// A point of a list given by an attribute (`<pointList from>`).
    ListPoint,
    /// One built branch of a reactive choice.
    Case,
    /// An answer's record of one input's submitted value.
    Response,
    /// The input an answer makes when it names none.
    ImplicitInput,
}

impl Role {
    /// Every role, in declaration order.
    pub const ALL: &[Role] = &[
        Role::Root,
        Role::Refused,
        Role::Index,
        Role::SequenceValue,
        Role::Item,
        Role::ListPoint,
        Role::Case,
        Role::Response,
        Role::ImplicitInput,
    ];
}

/// How a type is structure rather than content (ADR 0038): what the core
/// looks through when it scores, numbers sections, gathers a sticky
/// group's members, reads a component's text or signs the input, so no
/// walk names the types it looks through. Each prop it names is a
/// position in the type's table.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StructureKind {
    /// Expanded in place (a group, a collect, a choice): its children are
    /// scored, numbered and gathered as its parent's. A `hide` it has hides
    /// what it holds from its text. `choice`, when given, is the prop whose
    /// value picks what it holds, which whether anything inside exists
    /// depends on (a conditional content's).
    Transparent {
        /// The prop that picks what it holds.
        choice: Option<usize>,
    },
    /// Holds its children while `active` is 1 (a reactive choice's case):
    /// looked through, with what is inside gated by `active`, and nothing
    /// inside there while it is 0.
    Gate {
        /// The 0/1 prop that says whether its children are there.
        active: usize,
    },
    /// One scope per iteration, `count` of them (a repeat, a function's
    /// iterates): looked through, what is inside numbered as each iteration
    /// adds it, and whether it exists reads every prop of the repeat.
    Repeat {
        /// The structural prop holding how many iterations it has.
        count: usize,
    },
}

/// What an answer's response reads of an input, by the kind of value it
/// is (ADR 0038): the answer code tells its inputs apart by this, not by
/// their types. Each holds the position of the prop the response reads.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ResponseKind {
    /// An expression (a `<mathInput>`'s `expr`), compared as math; an
    /// answer with no input makes such an input.
    Math(usize),
    /// A boolean (a `<booleanInput>`'s `value`).
    Boolean(usize),
    /// A string (a `<textInput>`'s `value`), read by a text answer only.
    Text(usize),
    /// The index of a choice (a `<choiceInput>`'s `selectedIndex`), whose
    /// credit the choice earns.
    Index(usize),
}

impl ResponseKind {
    /// The position of the prop the response reads.
    pub const fn prop(self) -> usize {
        match self {
            Self::Math(pi) | Self::Boolean(pi) | Self::Text(pi) | Self::Index(pi) => pi,
        }
    }
}

/// How a component shows in text, as the current core's `text` state
/// variable reads it ([`crate::Document::rendered_text`]). Each holds the
/// positions of the props it reads.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TextKind {
    /// A number, formatted.
    Number(usize),
    /// A string id's text.
    Text(usize),
    /// `true` when the value is 1, else `false`.
    Boolean(usize),
    /// The expression's text (`expr`, the first), or the number (`value`)
    /// when there is no expression.
    Math(usize, usize),
}

/// What a component changes about where its descendants are (ADR 0038):
/// the core places, snaps and saves by this, not by the type. Each holds
/// positions in the type's table.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Encloses {
    /// A graph: what is drawn only in a graph (`Renders::InGraph`) is drawn
    /// inside it, and its `bounds`, `xmin`, `xmax`, `ymin` and `ymax`,
    /// are the view a pan or a zoom writes.
    Graph {
        /// The props of its view, left, right, bottom and top.
        bounds: [usize; 4],
    },
    /// A sticky group: its members snap to one another when dragged.
    Sticky {
        /// How near a dragged member must come to snap.
        threshold: usize,
        /// 1 when `threshold` is measured in the graph's scales.
        relative: usize,
    },
}

/// A group of element children of given types (`constraints:
/// [ConstrainTo, ConstrainToGrid]`), each parsed into a record of its
/// own, written directly under the element or inside a wrapper element
/// named as the group is (`<constraints>`).
#[derive(Debug, Clone, Copy)]
pub struct ChildGroup {
    /// The group's name, and its wrapper element's tag.
    pub name: &'static str,
    /// The types its elements may be.
    pub types: &'static [ComponentType],
}

/// A type's `children:` declaration: its kind, and the groups of element
/// children it reads beside it.
#[derive(Debug, Clone, Copy)]
pub struct ChildrenDecl {
    /// What the children are parsed into.
    pub kind: ChildrenKind,
    /// The groups of element children it reads beside them.
    pub groups: &'static [ChildGroup],
}

impl ChildrenDecl {
    /// What a type that declares nothing has: rendered children.
    pub const RENDERED: ChildrenDecl = ChildrenDecl {
        kind: ChildrenKind::Rendered,
        groups: &[],
    };

    /// Whether the children are built as components (rendered content)
    /// rather than read by the planner, presentation aside.
    pub fn built(&self) -> bool {
        self.kind == ChildrenKind::Rendered
    }
}

/// A type's one list prop of points: the names the list goes by
/// (`throughPoints`, `points`), the name of a point in it (`throughPoint`
/// for `throughPoint2`), and where its points are. However they are
/// stored, a document reads them alike: `$l.points`, `$l.point2`,
/// `$l.points[2].x`.
pub struct ListProp {
    /// The names the list goes by: `throughPoints`, `points`.
    pub names: &'static [&'static str],
    /// The name of one point in it, before its 1-based number: `throughPoint`.
    pub item: &'static str,
    /// Where its points are.
    pub points: ListPoints,
    /// A renderer may request every point: a drag of one point or of the
    /// whole shape moves them (a line's, a circle's through points, a
    /// polygon's vertices).
    pub interactive: bool,
    /// A renderer reads every point (a polygon's vertices).
    pub rendered: bool,
}

/// Where a component of a type is drawn, and so whether the props a renderer
/// reads are outputs. A component is rendered when its type's rule allows it
/// where it is and its parent is rendered; the document is. A dynamic `hide`,
/// or a case that is not active, leaves it rendered.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Renders {
    /// Wherever it is; its children are rendered as their own rules say.
    Always,
    /// Nowhere, nor anything inside it: an `<award>`, a `<setup>`'s content,
    /// a `<function>` no renderer draws yet.
    Never,
    /// Only with a `<graph>` above it: a line, a circle.
    InGraph,
}

/// Where a list's points are.
pub enum ListPoints {
    /// As many as the element was given, stored after the props of the type's
    /// table, two per point; the list's length is what is left over. Point `k`
    /// (1-based) has coordinates `coords[0]` k and `coords[1]` k (`throughX2`),
    /// also spelled `alternate_name` k `_` 1 and `_` 2 (`throughPointX2_1`).
    /// The points are given by the attribute `attribute`, and the list keeps at
    /// most `max` of them.
    Given {
        /// The names of a point's coordinates, before its number: `throughX`.
        coords: [&'static str; 2],
        /// The current core's name for them: `throughPointX`.
        alternate_name: Option<&'static str>,
        /// The attribute that gives the points.
        attribute: crate::compile::api::Attr,
        /// The most points the list keeps.
        max: Option<usize>,
    },
    /// A fixed number, each a pair of the table's props: a line's two
    /// points are `x1`, `y1` and `x2`, `y2`.
    Table(&'static [[&'static str; 2]]),
}

/// Where a sticky group member's points are, as (x, y) pairs.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StickyPoints {
    /// `n` points from the table's prop `first`.
    Props {
        /// The table position of the first point's x.
        first: usize,
        /// How many points.
        n: usize,
    },
    /// The points of the type's list.
    List,
}

/// Where a prop name lands in an element's props: a position, or a point
/// of the type's list (`k` 1-based), whole or one coordinate.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PropAt {
    /// A single-cell prop, at this table position.
    Position(usize),
    /// A whole point of the list.
    Item(usize),
    /// One coordinate (0 for x, 1 for y) of a point of the list.
    Coord(usize, usize),
    /// The list as a whole (`throughPoints`).
    List,
}

/// A prop of a component type, resolved from its name.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PropSel {
    /// Where `prop_at` finds it.
    At(PropAt),
    /// A combined prop (`center`) or a point of a list whose points are table
    /// props (`vertex3`, `point1`): its single-cell parts, as table positions.
    Parts {
        /// The parts' table positions; only the first `len` are used.
        idx: [u8; MAX_PARTS],
        /// How many parts there are.
        len: u8,
    },
    /// A list whose points are table props, as a whole (`points`).
    TableList,
}

/// The most parts a combined prop has: a tuple's entries.
pub const MAX_PARTS: usize = crate::limits::MAX_TUPLE;

impl PropSel {
    /// A `Parts`'s table positions.
    pub fn parts(&self) -> &[u8] {
        match self {
            PropSel::Parts { idx, len } => &idx[..*len as usize],
            _ => &[],
        }
    }
}

/// What a type is, apart from its props: each false unless its `component!`
/// block's `flags` names it.
#[derive(Debug, Clone, Copy)]
pub struct Flags {
    /// `$name` as a child may produce a copy of the component, and
    /// `<collect componentType>` may name the type.
    pub copyable: bool,
    /// The children are rendered; `extend` copies them deeply.
    pub container: bool,
    /// Planned as math cells; not allowed in a branch interface.
    pub symbolic: bool,
    /// Made by the builder, never by a tag in the source.
    pub internal: bool,
    /// Planned only by what owns it (an `<award>` by its `<answer>`, a
    /// constraint in its point's record): one that stands free is refused.
    pub owned: bool,
    /// Cannot be extended: an `extend` of one is refused. A choice's interface
    /// names are referenced instead.
    pub not_extendable: bool,
    /// Every value it holds is a location: a point's coordinates, a circle's
    /// center and radius, a polygon's vertices. `fixLocation` holds it as
    /// `fixed` does.
    pub located: bool,
}

/// Where a prop's value comes from: an attribute, the children, an operator
/// over the component's own props, and so on.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PropFrom {
    /// Value given by an attribute ([`PropDef::attr`], or the prop's name).
    Attribute,
    /// Value given by the element's children (a literal or one reference).
    Children,
    /// Value computed by `op` from the component's own props at `args`.
    Computed {
        /// The operator.
        op: OpSpec,
        /// Its inputs, in order.
        args: Args,
    },
    /// Value given by the attribute if present, else an alias of the
    /// component's own prop at `alias`.
    AttributeOr {
        /// The table position of the prop aliased without the attribute.
        alias: u8,
    },
    /// Set by the type's planner (its `component!` block names it), which
    /// reads the whole element: a circle's center from whichever of
    /// `center`, `radius` and `through` the author gave.
    ByPlanner,
    /// An aggregate over a collection of components around the element,
    /// materialized by the build: no planner can wire it, and nothing overrides
    /// it.
    Aggregate(Aggregate),
}

/// A set of components around an element, described at compile time and
/// materialized by the build. Each reaches through containers, repeats and
/// choices, with a *gate* per choice branch (a case's `active`).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Collection {
    /// The scored items under the element, in document order: the answers,
    /// and the sections that aggregate scores, looking through other
    /// sections and containers but not into `<setup>`.
    ScoredItems,
    /// The sections among the element's siblings up to and including it,
    /// where siblings are counted through the containers the current core
    /// expands in place (choices, cases, groups, repeats, collects).
    SectionsThrough,
    /// The components of the type the element gathers, under what it gathers
    /// from, in document order, not entering a match: a collect's, or a
    /// polyline's points.
    Gathered,
    /// The points a point list holds: its children, one per item of the
    /// list it extends.
    ListPoints,
    /// The picks of a load-time select, each an option's template stamped
    /// once; a reference's `Item` into them (`$s[k]`).
    Picks,
}

/// An operator over a collection's ports.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AggOp {
    /// The weighted mean of the items' credit, each weight gated; 1 with
    /// no item (nothing scored, or nothing active).
    Credit,
    /// The weighted mean of credit as a percentage.
    PercentCredit,
    /// How many items the collection holds.
    Count,
}

/// A prop wired from a collection: `op` over the ports of `over`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Aggregate {
    /// The operator.
    pub op: AggOp,
    /// The collection it reads.
    pub over: Collection,
}

/// A computed prop's inputs: positions among its component's props, or
/// literals.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Args {
    pub(super) at: [ArgFrom; MAX_ARGS],
    pub(super) len: u8,
}

/// One input of a computed prop.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ArgFrom {
    /// The component's own prop at this position.
    Prop(u8),
    /// A literal: the build's constant for it.
    Const(f64),
}

/// The most inputs a computed prop's operator takes.
pub(super) const MAX_ARGS: usize = 4;

impl std::ops::Deref for Args {
    type Target = [ArgFrom];
    fn deref(&self) -> &[ArgFrom] {
        &self.at[..self.len as usize]
    }
}

/// A prop as a component type declares it: its name, its default, where its
/// value comes from, and how it is read and written.
#[derive(Debug, Clone, Copy)]
pub struct PropDef {
    /// The prop's name, as a reference spells it.
    pub name: &'static str,
    /// The value before anything gives it one.
    pub default: f64,
    /// Where its value comes from.
    pub from: PropFrom,
    /// Attribute to read instead of `name`, for [`PropFrom::Attribute`]; for
    /// [`PropFrom::Children`], the attribute that stands in for blank
    /// children (a mathInput's `prefill`).
    pub attr: Option<&'static str>,
    /// An attribute whose reference, when present, this prop aliases
    /// (a slider's `bindValueTo`). Takes precedence over `attr`.
    pub bind: Option<&'static str>,
    /// When the attribute is a bare component reference, alias this prop of
    /// the referent instead of its default prop (`function="$m"` wants the
    /// math's `expr`, not its `value`).
    pub ref_prop: Option<&'static str>,
    /// The prop holds text, a string id (a `<text>`'s or `<textInput>`'s
    /// `value`), whatever gives it.
    pub text: bool,
    /// A renderer may request this prop: a student's action writes it, so it is
    /// one of the document's inputs.
    pub interactive: bool,
    /// An action writes this prop (a submit, a trigger): student state, though
    /// no renderer requests it.
    pub written_by_action: bool,
    /// A renderer reads this prop.
    pub rendered: bool,
    /// A grader reads this prop.
    pub score: bool,
    /// An action reads this prop.
    pub read_by_action: bool,
    /// How many consecutive cells the prop is the first of: 1, or
    /// `SAMPLES` for a curve's samples, which a renderer reads together.
    pub span: usize,
    /// For a span over 1, the prop whose nonzero value says the run is
    /// there (a function's `curve`); when it is 0, the prop is one cell.
    pub span_when: Option<u8>,
    /// Whether the prop stands for an expression, read in math as the
    /// expression rather than its value: where the expression is, and the
    /// prop whose port says, by being math, that there is one.
    pub expr: Option<ExprOf>,
}

/// Where the expression a prop stands for is ([`PropDef::expr`]): a
/// `<math>`'s `value` stands for its `expr`, a response's `value` for its
/// `submitted`, and an answer's `correct` for itself, each when the prop
/// at `when` is math. Positions in the type's table.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ExprOf {
    /// The prop holding the expression.
    pub at: u8,
    /// The prop whose port is math when there is an expression.
    pub when: u8,
}

impl PropDef {
    /// The attribute that gives the prop: `attr`, or the prop's own name.
    pub fn attr_name(&self) -> &'static str {
        self.attr.unwrap_or(self.name)
    }
}

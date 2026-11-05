//! Component definitions: which props each tag has, where each prop's value
//! comes from, and its default. This is the only place that knows DoenetML
//! tag vocabulary.
//!
//! A prop may be computed from the component's other props by an operator
//! (`PropFrom::Computed`), so a value chain such as a `<slider>`'s is data,
//! inverted by the generic operator inverse.
//!
//! Each type is one `component!` block, grouped by family; the list of
//! every type is `component_types!`.

use crate::program::OpSpec;

pub(crate) mod containers;
pub(crate) mod define;
pub(crate) mod geometry;
pub(crate) mod inputs;
pub mod prop;
pub(crate) mod structure;
#[cfg(test)]
pub(crate) mod test_only;
pub(crate) mod values;

pub use containers::SECTION_TAGS;

/// Presentation attributes a renderer reads and the core does not, accepted
/// on any element. Every other attribute must be read by the type's
/// planner, or the element is refused.
pub const PRESENTATION_ATTRS: &[&str] = &[
    "displayDecimals",
    "label",
    "labelPosition",
    "layer",
    "shortDescription",
    "styleNumber",
];
pub use geometry::{MAX_RIGID_VERTICES, MAX_VERTICES};
pub use values::MAX_TUPLE;

/// Declares every component type from one list: the `ComponentType` enum,
/// `ComponentType::ALL`, and `COMPONENT_DEFS`, all in list order. Each
/// entry names a `component!` block's `DEFINITION`. The `#[cfg(test)]`
/// entries come last, so no other type's discriminant depends on them.
macro_rules! component_types {
    (
        $($(#[$doc:meta])* $variant:ident => $def:expr,)*;
        #[cfg(test)] {
            $($(#[$tdoc:meta])* $tvariant:ident => $tdef:expr,)*
        }
    ) => {
        /// `repr(u8)` so the renderer can read the type column as a byte
        /// array; the discriminants follow the list in `component_types!`.
        #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
        #[repr(u8)]
        pub enum ComponentType {
            $($(#[$doc])* $variant,)*
            $(#[cfg(test)] $(#[$tdoc])* $tvariant,)*
        }

        impl ComponentType {
            /// Every type, in discriminant order.
            pub const ALL: &[ComponentType] = &[
                $(ComponentType::$variant,)*
                $(#[cfg(test)] ComponentType::$tvariant,)*
            ];
        }

        /// Every type's row, indexed by discriminant.
        pub const COMPONENT_DEFS: &[ComponentDef] = &[
            $($def,)*
            $(#[cfg(test)] $tdef,)*
        ];

        /// Each non-test type with the path its entry names
        /// (`geometry::circle::DEFINITION`).
        #[cfg(test)]
        const DEFINED_IN: &[(ComponentType, &str)] =
            &[$((ComponentType::$variant, stringify!($def)),)*];
    };
}

component_types! {
    Document => containers::document::DEFINITION,
    Graph => containers::graph::DEFINITION,
    Point => geometry::point::DEFINITION,
    Number => values::number::DEFINITION,
    NumberInput => inputs::number_input::DEFINITION,
    Slider => inputs::slider::DEFINITION,
    RepeatForSequence => structure::repeat_for_sequence::DEFINITION,
    Collect => structure::collect::DEFINITION,
    SequenceValue => structure::sequence_value::DEFINITION,
    BooleanInput => inputs::boolean_input::DEFINITION,
    Math => values::math::DEFINITION,
    Evaluate => values::evaluate::DEFINITION,
    MathInput => inputs::math_input::DEFINITION,
    ChoiceInput => inputs::choice_input::DEFINITION,
    Choice => inputs::choice::DEFINITION,
    Circle => geometry::circle::DEFINITION,
    Line => geometry::line::DEFINITION,
    LineSegment => geometry::segment::DEFINITION,
    Polygon => geometry::polygon::DEFINITION,
    PointList => geometry::point_list::DEFINITION,
    P => containers::p::DEFINITION,
    ShortDescription => containers::short_description::DEFINITION,
    Error => containers::error::DEFINITION,
    Hint => containers::hint::DEFINITION,
    Setup => containers::setup::DEFINITION,
    StickyGroup => containers::sticky_group::DEFINITION,
    Function => values::curve::DEFINITION,
    Derivative => values::curve::DERIVATIVE,
    Answer => values::answer::DEFINITION,
    Text => values::text::DEFINITION,
    ConditionalContent => structure::conditional_content::DEFINITION,
    Case => structure::case::DEFINITION,
    Select => structure::select::DEFINITION,
    SelectFromSequence => structure::select_from_sequence::DEFINITION,
    Group => containers::group::DEFINITION,
    Section => containers::section::DEFINITION,
    Title => containers::title::DEFINITION,
    Ref => containers::reference::DEFINITION,
    List => containers::list::DEFINITION,
    ListItem => containers::list_item::DEFINITION,
    InlineMath => containers::inline_math::DEFINITION,
    DisplayMath => containers::display_math::DEFINITION,
    MathRow => containers::math_row::DEFINITION,
    Aside => containers::aside::DEFINITION,
    SideBySide => containers::side_by_side::DEFINITION,
    Stack => containers::stack::DEFINITION,
    Tabular => containers::tabular::DEFINITION,
    Spreadsheet => containers::spreadsheet::DEFINITION,
    Row => containers::row::DEFINITION,
    Cell => containers::cell::DEFINITION,
    Legend => containers::legend::DEFINITION,
    TriggerSet => containers::trigger_set::DEFINITION,
    UpdateValue => values::update_value::DEFINITION,
    ClampNumber => values::clamp_number::DEFINITION,
    Tuple => values::tuple::DEFINITION,
    RepeatFor => structure::repeat_for::DEFINITION,
    FunctionIterates => structure::function_iterates::DEFINITION,
    Polyline => geometry::polyline::DEFINITION,
    Boolean => values::boolean::DEFINITION,
    Award => values::award::DEFINITION,
    When => values::when::DEFINITION,
    Response => values::response::DEFINITION,
    TextInput => inputs::text_input::DEFINITION,
    Triangle => geometry::triangle::DEFINITION,
    ConstrainTo => geometry::constrain_to::DEFINITION,
    ConstrainToGrid => geometry::constrain_to_grid::DEFINITION,
    ;
    #[cfg(test)] {
        /// `<testValue>`: planned from its table alone.
        TestValue => test_only::test_value::DEFINITION,
        /// `<testShape>`: planned by a function inside `plan_with_extend`.
        TestShape => test_only::test_shape::DEFINITION,
        /// `<testList>`: a list of points, planned by a function.
        TestList => test_only::test_list::DEFINITION,
    }
}

/// What the core knows about a type apart from how it is planned and
/// expanded: one row per type in `COMPONENT_DEFS`, indexed by discriminant.
pub struct ComponentDef {
    /// The tag the type shows as, then other tags that make it.
    pub tags: &'static [&'static str],
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
    Points { max: Option<usize> },
    /// An on/off attribute that may be bound (`hide="$h"`): a 0/1 source,
    /// `default` without one.
    Flag { default: bool },
    /// A literal on/off attribute: present and empty or `true`.
    Bool { default: bool },
    /// A literal number, `default` when absent or not a number.
    Number { default: f64 },
    /// A literal number, `default` when absent; a reference or text that is no
    /// number is an error when the planner reads it.
    Literal { default: f64 },
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
    pub name: &'static str,
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
        props: &'static [&'static str],
        op: crate::program::VecOp,
    },
    /// The point rides a graph: its `x` is what was asked, its `y` the
    /// target's prop `expr` evaluated there (`constrain_target { graph:
    /// expr }`).
    Graph { expr: &'static str },
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

/// A group of element children of given types (`constraints:
/// [ConstrainTo, ConstrainToGrid]`), each parsed into a record of its
/// own, written directly under the element or inside a wrapper element
/// named as the group is (`<constraints>`).
#[derive(Debug, Clone, Copy)]
pub struct ChildGroup {
    pub name: &'static str,
    pub types: &'static [ComponentType],
}

/// A type's `children:` declaration: its kind, and the groups of element
/// children it reads beside it.
#[derive(Debug, Clone, Copy)]
pub struct ChildrenDecl {
    pub kind: ChildrenKind,
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
    pub names: &'static [&'static str],
    pub item: &'static str,
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
        coords: [&'static str; 2],
        alternate_name: Option<&'static str>,
        attribute: crate::compile::api::Attr,
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
    Props { first: usize, n: usize },
    /// The points of the type's list.
    List,
}

/// Where a prop name lands in an element's props: a position, or a point
/// of the type's list (`k` 1-based), whole or one coordinate.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PropAt {
    Position(usize),
    Item(usize),
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
    Parts { idx: [u8; MAX_PARTS], len: u8 },
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

impl ComponentType {
    pub fn def(self) -> &'static ComponentDef {
        &COMPONENT_DEFS[self as usize]
    }

    pub fn from_tag(tag: &str) -> Option<Self> {
        static BY_TAG: std::sync::OnceLock<std::collections::HashMap<&'static str, ComponentType>> =
            std::sync::OnceLock::new();
        let by_tag = BY_TAG.get_or_init(|| {
            ComponentType::ALL
                .iter()
                .filter(|k| !k.def().flags.internal)
                .flat_map(|&k| k.def().tags.iter().map(move |&t| (t, k)))
                .collect()
        });
        by_tag.get(tag).copied()
    }

    pub fn tag(self) -> &'static str {
        self.def().tags[0]
    }

    /// Single-cell props, in declaration order.
    pub fn prop_defs(self) -> &'static [PropDef] {
        self.def().props
    }

    pub fn prop_index(self, name: &str) -> Option<usize> {
        let name = self.canonical_prop(name);
        self.prop_defs().iter().position(|p| p.name == name)
    }

    /// A prop name with the current core's spellings mapped to ours.
    pub fn canonical_prop(self, name: &str) -> &str {
        self.def()
            .alternate_names
            .iter()
            .find(|(from, _)| *from == name)
            .map_or(name, |(_, to)| to)
    }

    /// A prop made of several single-cell props: one of the type's combined
    /// props, or an array item by name (`vertex3`, `point1`).
    pub fn combined_prop(self, name: &str) -> Option<&'static [&'static str]> {
        let def = self.def();
        if let Some((_, parts)) = def.combined_props.iter().find(|(v, _)| *v == name) {
            return Some(*parts);
        }
        let list = def.list.as_ref()?;
        let ListPoints::Table(points) = list.points else {
            return None;
        };
        let k: usize = name.strip_prefix(list.item)?.parse().ok()?;
        (1..=points.len()).contains(&k).then(|| &points[k - 1][..])
    }

    /// The type's list prop, if it has one.
    pub fn list(self) -> Option<&'static ListProp> {
        self.def().list.as_ref()
    }

    /// The coordinate names of the type's list when its points are as many
    /// as an element was given (`ListPoints::Given`), with the list.
    fn given_list(self) -> Option<(&'static ListProp, [&'static str; 2], Option<&'static str>)> {
        let list = self.list()?;
        match list.points {
            ListPoints::Given {
                coords,
                alternate_name,
                ..
            } => Some((list, coords, alternate_name)),
            ListPoints::Table(_) => None,
        }
    }

    /// The coordinate names of the type's list when its points are as many
    /// as an element was given, stored after the table: `throughX` and
    /// `throughY`.
    pub fn given_coords(self) -> Option<[&'static str; 2]> {
        self.given_list().map(|(_, coords, _)| coords)
    }

    /// The attribute that gives the type's list its points, and the most
    /// the list keeps, when they are as many as an element was given
    /// (`ListPoints::Given`): a circle's `through`, at most three.
    pub(crate) fn given_from(self) -> Option<(crate::compile::api::Attr, Option<usize>)> {
        match self.list()?.points {
            ListPoints::Given { attribute, max, .. } => Some((attribute, max)),
            ListPoints::Table(_) => None,
        }
    }

    /// The points of the list `name` when they are the table's props
    /// (`ListPoints::Table`): each one's two prop names.
    pub fn table_list(self, name: &str) -> Option<&'static [[&'static str; 2]]> {
        let list = self.list().filter(|l| l.names.contains(&name))?;
        match list.points {
            ListPoints::Table(points) => Some(points),
            ListPoints::Given { .. } => None,
        }
    }

    /// The name of point `k` (1-based) of the list `name` whose points are
    /// the table's props (`point2`).
    pub fn table_list_item(self, name: &str, k: usize) -> Option<String> {
        self.table_list(name)
            .map(|_| format!("{}{k}", self.list().expect("a list").item))
    }

    /// Prop `name` of the type, found once: a combined prop or a table
    /// list's point by its parts, then where `prop_at` finds it, then a
    /// table list as a whole. None when the type has no such prop.
    pub fn resolve_prop(self, name: &str) -> Option<PropSel> {
        if let Some(parts) = self.combined_prop(name) {
            return Some(self.parts_sel(parts));
        }
        if let Some(at) = self.prop_at(name) {
            return Some(PropSel::At(at));
        }
        self.table_list(name).map(|_| PropSel::TableList)
    }

    /// The `Parts` of the table props named `parts`.
    pub fn parts_sel(self, parts: &[&str]) -> PropSel {
        let mut idx = [0u8; MAX_PARTS];
        assert!(
            parts.len() <= MAX_PARTS,
            "a combined prop of at most MAX_PARTS parts"
        );
        for (slot, part) in idx.iter_mut().zip(parts) {
            let i = self.prop_index(part).expect("a part is a table prop");
            *slot = u8::try_from(i).expect("fewer than 256 table props");
        }
        PropSel::Parts {
            idx,
            len: parts.len() as u8,
        }
    }

    /// The type's default prop (`default_prop`), resolved: once per type.
    pub fn default_sel(self) -> Option<PropSel> {
        static DEFAULTS: std::sync::OnceLock<Vec<Option<PropSel>>> = std::sync::OnceLock::new();
        let table = DEFAULTS.get_or_init(|| {
            let mut table = vec![None; ComponentType::ALL.len()];
            for &ty in ComponentType::ALL {
                table[ty as usize] = ty.default_prop().and_then(|dp| ty.resolve_prop(dp));
            }
            table
        });
        table[self as usize]
    }

    /// The table positions of each point of the type's list when its
    /// points are table props (`table_points`): once per type.
    pub fn table_point_positions(self) -> &'static [[u8; 2]] {
        static POSITIONS: std::sync::OnceLock<Vec<Vec<[u8; 2]>>> = std::sync::OnceLock::new();
        let table = POSITIONS.get_or_init(|| {
            let mut table = vec![Vec::new(); ComponentType::ALL.len()];
            for &ty in ComponentType::ALL {
                table[ty as usize] = ty.table_points().map_or_else(Vec::new, |points| {
                    points
                        .iter()
                        .map(|p| {
                            let parts = ty.parts_sel(p);
                            [parts.parts()[0], parts.parts()[1]]
                        })
                        .collect()
                });
            }
            table
        });
        &table[self as usize]
    }

    /// The points of the type's list when they are table props.
    pub fn table_points(self) -> Option<&'static [[&'static str; 2]]> {
        match self.list()?.points {
            ListPoints::Table(points) => Some(points),
            ListPoints::Given { .. } => None,
        }
    }

    /// The name of `sel` on this type, as an error shows it or another
    /// type looks it up by.
    pub fn sel_name(self, sel: PropSel) -> std::borrow::Cow<'static, str> {
        let list = self.list();
        let list_name = || list.map_or("", |l| l.names.first().copied().unwrap_or(""));
        match sel {
            PropSel::At(PropAt::Position(i)) => self.prop_defs()[i].name.into(),
            PropSel::At(PropAt::Item(k)) => format!("{}{k}", list.map_or("", |l| l.item)).into(),
            PropSel::At(PropAt::Coord(k, j)) => {
                format!("{}{k}", self.given_coords().map_or("", |c| c[j])).into()
            }
            PropSel::At(PropAt::List) | PropSel::TableList => list_name().into(),
            PropSel::Parts { .. } => {
                let named = |parts: &[&str]| self.parts_sel(parts) == sel;
                if let Some((name, _)) = self.def().combined_props.iter().find(|(_, p)| named(p)) {
                    return (*name).into();
                }
                match self
                    .table_points()
                    .and_then(|ps| ps.iter().position(|p| named(p)))
                {
                    Some(k) => format!("{}{}", list.map_or("", |l| l.item), k + 1).into(),
                    None => "".into(),
                }
            }
        }
    }

    /// Where the prop `name` is: a position in the table, or a point (or
    /// coordinate) of the type's list when its points are stored after the
    /// table (`ListPoints::Given`), or nowhere. Whether such a point exists
    /// depends on the element (`list_slot`). A table list's points are
    /// table props already.
    pub fn prop_at(self, name: &str) -> Option<PropAt> {
        if let Some(i) = self.prop_index(name) {
            return Some(PropAt::Position(i));
        }
        let (list, coords, alternate_name) = self.given_list()?;
        if list.names.contains(&name) {
            return Some(PropAt::List);
        }
        let index = |s: &str| s.parse::<usize>().ok().filter(|&k| k >= 1);
        if let Some(k) = name.strip_prefix(list.item).and_then(index) {
            return Some(PropAt::Item(k));
        }
        for (j, c) in coords.iter().enumerate() {
            if let Some(k) = name.strip_prefix(c).and_then(index) {
                return Some(PropAt::Coord(k, j));
            }
        }
        let rest = name.strip_prefix(alternate_name?)?;
        let (k, j) = rest.split_once('_')?;
        match (index(k), j) {
            (Some(k), "1") => Some(PropAt::Coord(k, 0)),
            (Some(k), "2") => Some(PropAt::Coord(k, 1)),
            _ => None,
        }
    }

    /// The position of coordinate `j` of list point `k` (1-based) in an
    /// element with `n_props` props, if the element has that point.
    pub fn list_slot(self, n_props: usize, k: usize, j: usize) -> Option<usize> {
        let n_table = self.prop_defs().len();
        (self.given_list().is_some() && k >= 1 && n_table + 2 * k <= n_props)
            .then(|| n_table + 2 * (k - 1) + j)
    }

    /// The name of prop `pi` of an element with `n_props` public props:
    /// the table's, or a list coordinate (`throughX2`); None for a hidden
    /// slot.
    pub fn prop_name(self, n_props: usize, pi: usize) -> Option<std::borrow::Cow<'static, str>> {
        let n_table = self.prop_defs().len();
        if pi < n_table {
            return Some(self.prop_defs()[pi].name.into());
        }
        let coords = self.given_coords().filter(|_| pi < n_props)?;
        let (k, j) = ((pi - n_table) / 2 + 1, (pi - n_table) % 2);
        Some(format!("{}{k}", coords[j]).into())
    }

    /// How many points the list of an element with `n_props` props holds.
    pub fn list_len(self, n_props: usize) -> usize {
        match self.given_list() {
            Some(_) => (n_props - self.prop_defs().len()) / 2,
            None => 0,
        }
    }

    /// Whether prop `pi` of an element with `n_props` public props is
    /// interactive: marked so in the table, or a point of a list marked
    /// so.
    pub fn is_interactive_prop(self, n_props: usize, pi: usize) -> bool {
        self.is_marked(n_props, pi, |d| d.interactive, |l| l.interactive)
    }

    /// Whether prop `pi` of an element with `n_props` public props is one
    /// a renderer reads: marked so in the table, or a point of a list
    /// marked so. An output when the component is rendered.
    pub fn is_rendered_prop(self, n_props: usize, pi: usize) -> bool {
        self.is_marked(n_props, pi, |d| d.rendered, |l| l.rendered)
    }

    /// How many consecutive cells prop `pi` is the first of: 1 but for a
    /// curve's samples.
    pub fn prop_span(self, pi: usize) -> usize {
        self.prop_defs().get(pi).map_or(1, |d| d.span)
    }

    /// The prop whose nonzero value says prop `pi`'s run of `prop_span`
    /// cells is there (a function's `curve`).
    pub fn prop_span_when(self, pi: usize) -> Option<usize> {
        self.prop_defs().get(pi)?.span_when.map(usize::from)
    }

    /// Whether prop `pi` is a score a grader reads.
    pub fn is_score_prop(self, pi: usize) -> bool {
        self.prop_defs().get(pi).is_some_and(|d| d.score)
    }

    /// Whether prop `pi` is one an action reads.
    pub fn is_read_by_action_prop(self, pi: usize) -> bool {
        self.prop_defs().get(pi).is_some_and(|d| d.read_by_action)
    }

    /// Whether prop `pi` is one the core reads whether or not the
    /// component is rendered: a score, an input, what an action reads, or
    /// a repeat's count.
    pub fn is_root_prop(self, n_props: usize, pi: usize) -> bool {
        self.is_score_prop(pi)
            || self.is_input_prop(n_props, pi)
            || self.is_read_by_action_prop(pi)
            || self.count_prop() == Some(pi)
    }

    /// Whether prop `pi` is marked: its table entry by `prop`, or a point
    /// of the type's list by `list`, a table point by either.
    fn is_marked(
        self,
        n_props: usize,
        pi: usize,
        prop: impl Fn(&PropDef) -> bool,
        list: impl Fn(&ListProp) -> bool,
    ) -> bool {
        if let Some(def) = self.prop_defs().get(pi) {
            return prop(def)
                || self.list().is_some_and(|l| {
                    list(l)
                        && matches!(l.points, ListPoints::Table(points)
                            if points.iter().flatten().any(|&p| p == def.name))
                });
        }
        pi < n_props && self.list().is_some_and(list)
    }

    /// Where a component of the type is drawn.
    pub fn renders(self) -> Renders {
        self.def().renders
    }

    /// Whether prop `pi` is one an action writes.
    pub fn is_action_prop(self, pi: usize) -> bool {
        self.prop_defs()
            .get(pi)
            .is_some_and(|d| d.written_by_action)
    }

    /// Whether prop `pi` is where a student's action starts: a renderer's
    /// request (`is_interactive_prop`) or an action (`is_action_prop`).
    pub fn is_input_prop(self, n_props: usize, pi: usize) -> bool {
        self.is_interactive_prop(n_props, pi) || self.is_action_prop(pi)
    }

    /// The prop a bare `$name` reference resolves to.
    pub fn default_prop(self) -> Option<&'static str> {
        self.def().default_prop
    }

    /// Whether `$name` as a child may produce a copy of this component, and
    /// `<collect componentType>` name the type.
    pub fn copyable(self) -> bool {
        self.def().flags.copyable
    }

    /// Containers whose children are rendered; `extend` copies them deeply.
    pub fn container(self) -> bool {
        self.def().flags.container
    }

    /// Function, derivative and answer: planned as math cells.
    pub fn symbolic(self) -> bool {
        self.def().flags.symbolic
    }

    /// Whether every value it holds is a location.
    pub fn located(self) -> bool {
        self.def().flags.located
    }

    /// The type a bare reference to a component of this type reads as.
    pub fn reads_as(self) -> Option<ComponentType> {
        self.def().reads_as
    }

    /// Whether `<to extend="$x"/>` of an `x` of type `from` gives `x`'s
    /// value as a `to`: a number and a math, or an input and a value type
    /// it reads as or one related to it, either way (`<math
    /// extend="$mi"/>`, `<mathInput extend="$n"/>`).
    pub fn extends_as(from: ComponentType, to: ComponentType) -> bool {
        use ComponentType::*;
        fn values(a: ComponentType, b: ComponentType) -> bool {
            a == b || matches!((a, b), (Number, Math) | (Math, Number))
        }
        from != to
            && (values(from, to)
                || from.reads_as().is_some_and(|vt| values(vt, to))
                || to.reads_as().is_some_and(|vt| values(vt, from)))
    }

    /// The structural cell of a type built like a repeat (one scope per
    /// iteration): its `count` prop.
    pub fn count_prop(self) -> Option<usize> {
        match self {
            ComponentType::RepeatForSequence
            | ComponentType::RepeatFor
            | ComponentType::FunctionIterates => self.prop_index("count"),
            _ => None,
        }
    }

    pub fn sticky_layout(self) -> Option<(crate::tick::snap::Shape, StickyPoints)> {
        self.def().sticky
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PropFrom {
    /// Value given by an attribute (`PropDef::attr`, or the prop's name).
    Attribute,
    /// Value given by the element's children (a literal or one reference).
    Children,
    /// Value computed by `op` from the component's own props at `args`.
    Computed { op: OpSpec, args: Args },
    /// Value given by the attribute if present, else an alias of the
    /// component's own prop at `alias`.
    AttributeOr { alias: u8 },
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
    pub op: AggOp,
    pub over: Collection,
}

/// A computed prop's inputs: positions among its component's props, or
/// literals.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Args {
    at: [ArgFrom; MAX_ARGS],
    len: u8,
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
const MAX_ARGS: usize = 4;

impl std::ops::Deref for Args {
    type Target = [ArgFrom];
    fn deref(&self) -> &[ArgFrom] {
        &self.at[..self.len as usize]
    }
}

#[derive(Debug, Clone, Copy)]
pub struct PropDef {
    pub name: &'static str,
    pub default: f64,
    pub from: PropFrom,
    /// Attribute to read instead of `name`, for `PropFrom::Attribute`; for
    /// `PropFrom::Children`, the attribute that stands in for blank
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
}

impl PropDef {
    pub fn attr_name(&self) -> &'static str {
        self.attr.unwrap_or(self.name)
    }
}

#[cfg(test)]
mod tests {
    use super::ComponentType;
    use std::path::Path;

    /// Every prop of every type, resolved, spells back (`sel_name`) to a
    /// name that resolves to the same place.
    #[test]
    fn a_resolved_prop_spells_back_to_itself() {
        for &ty in ComponentType::ALL {
            let def = ty.def();
            let mut names: Vec<String> = ty.prop_defs().iter().map(|d| d.name.into()).collect();
            names.extend(def.combined_props.iter().map(|(n, _)| n.to_string()));
            if let Some(list) = ty.list() {
                names.extend(list.names.iter().map(|n| n.to_string()));
                names.extend((1..=3).map(|k| format!("{}{k}", list.item)));
            }
            if let Some(coords) = ty.given_coords() {
                names.extend(coords.iter().map(|c| format!("{c}2")));
            }
            for name in names {
                let Some(sel) = ty.resolve_prop(&name) else {
                    continue;
                };
                let spelled = ty.sel_name(sel);
                assert_eq!(
                    ty.resolve_prop(&spelled),
                    Some(sel),
                    "{}.{name} spells as {spelled}",
                    ty.tag()
                );
            }
        }
    }

    /// A default prop resolves wherever a type has one.
    #[test]
    fn every_default_prop_resolves() {
        for &ty in ComponentType::ALL {
            if let Some(dp) = ty.default_prop() {
                assert_eq!(ty.default_sel(), ty.resolve_prop(dp), "{}", ty.tag());
                assert!(ty.default_sel().is_some(), "{}.{dp}", ty.tag());
            }
            if let Some(points) = ty.table_points() {
                assert_eq!(ty.table_point_positions().len(), points.len());
            }
        }
    }

    /// Every `.rs` file under `dir`.
    fn sources(dir: &Path, out: &mut Vec<std::path::PathBuf>) {
        for entry in std::fs::read_dir(dir).unwrap() {
            let path = entry.unwrap().path();
            if path.is_dir() {
                sources(&path, out);
            } else if path.extension().is_some_and(|e| e == "rs") {
                out.push(path);
            }
        }
    }

    /// No component file but `define.rs` writes `f64::NAN` itself: NaN
    /// is `NO_VALUE` or `Wire::undefined` / `Source::undefined`.
    #[test]
    fn components_write_no_nan_of_their_own() {
        // Spelled in two halves, so this file does not find itself.
        let needle = concat!("f64", "::NAN");
        let dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/components");
        let mut files = Vec::new();
        sources(&dir, &mut files);
        let found: Vec<String> = files
            .iter()
            .filter(|p| p.file_name().is_some_and(|n| n != "define.rs"))
            .flat_map(|p| {
                let text = std::fs::read_to_string(p).unwrap();
                text.lines()
                    .enumerate()
                    .filter(|(_, l)| l.contains(needle) && !l.trim_start().starts_with("//"))
                    .map(|(i, l)| format!("{}:{}: {}", p.display(), i + 1, l.trim()))
                    .collect::<Vec<_>>()
            })
            .collect();
        assert!(
            found.is_empty(),
            "write NO_VALUE for a value not given, or Wire::undefined after a warning:\n{}",
            found.join("\n")
        );
    }

    /// No planner computes a slot position (`list_slot`, `Port::table`):
    /// it names a port.
    #[test]
    fn components_compute_no_slot_positions() {
        // Spelled in halves, so this file does not find itself.
        let needles = [concat!(".list_", "slot("), concat!("Port::", "table(")];
        let dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/components");
        let mut files = Vec::new();
        sources(&dir, &mut files);
        let found: Vec<String> = files
            .iter()
            .filter(|p| p.file_name().is_some_and(|n| n != "define.rs"))
            .flat_map(|p| {
                let text = std::fs::read_to_string(p).unwrap();
                text.lines()
                    .enumerate()
                    .filter(|(_, l)| {
                        needles.iter().any(|n| l.contains(n)) && !l.trim_start().starts_with("//")
                    })
                    .map(|(i, l)| format!("{}:{}: {}", p.display(), i + 1, l.trim()))
                    .collect::<Vec<_>>()
            })
            .collect();
        assert!(
            found.is_empty(),
            "name a port (`Props::PORTS`, `wiring.item(k)`, `wiring.hidden(..)`) instead of computing a position:\n{}",
            found.join("\n")
        );
    }

    /// A type planned from its table has no `by_planner` prop.
    #[test]
    fn a_table_type_plans_every_prop() {
        let found: Vec<String> = ComponentType::ALL
            .iter()
            .filter(|ty| matches!(ty.def().planner, crate::compile::api::Planner::Props))
            // What owns it, or machinery, plans it.
            .filter(|ty| !ty.def().flags.owned && ty.def().machinery.is_none())
            .flat_map(|ty| {
                ty.prop_defs()
                    .iter()
                    .filter(|d| d.from == super::PropFrom::ByPlanner)
                    .map(move |d| format!("{}.{}", ty.tag(), d.name))
            })
            .collect();
        assert!(
            found.is_empty(),
            "by_planner props of table types: {found:?}"
        );
    }

    /// No planner reaches the DAST, a node, an `extend` referent or the
    /// `extend` itself: it reads its record.
    #[test]
    fn components_read_no_source() {
        // Spelled in halves, so this file does not find itself.
        let needles = [
            concat!(".da", "st()"),
            concat!(".no", "de()"),
            concat!(".ba", "se()"),
            concat!(".ext", "end()"),
        ];
        let dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/components");
        let mut files = Vec::new();
        sources(&dir, &mut files);
        let found: Vec<String> = files
            .iter()
            .flat_map(|p| {
                let text = std::fs::read_to_string(p).unwrap();
                text.lines()
                    .enumerate()
                    .filter(|(_, l)| {
                        needles.iter().any(|n| l.contains(n)) && !l.trim_start().starts_with("//")
                    })
                    .map(|(i, l)| format!("{}:{}: {}", p.display(), i + 1, l.trim()))
                    .collect::<Vec<_>>()
            })
            .collect();
        assert!(
            found.is_empty(),
            "read the element's record (`Attrs::of(ctx.record())`) instead of the source:\n{}",
            found.join("\n")
        );
    }

    /// `PlanCtx`'s planner methods match a recorded count, so the API
    /// grows only deliberately.
    #[test]
    fn plan_ctx_grows_deliberately() {
        const PLAN_CTX_METHODS: usize = 19;
        let path = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/compile/planning/ctx.rs");
        let text = std::fs::read_to_string(path).unwrap();
        let n = text
            .lines()
            .filter(|l| l.starts_with(concat!("    pub(crate) ", "fn ")))
            .count();
        assert_eq!(
            n, PLAN_CTX_METHODS,
            "`PlanCtx` has {n} methods for planners; update the count only with a reason"
        );
    }

    /// Types a spec is still to be written for: the list only shrinks.
    const WITHOUT_SPEC: &[super::ComponentType] = {
        use super::ComponentType::*;
        &[
            Document,
            Graph,
            Point,
            Number,
            NumberInput,
            RepeatForSequence,
            Collect,
            BooleanInput,
            Math,
            Evaluate,
            MathInput,
            ChoiceInput,
            Choice,
            PointList,
            P,
            ShortDescription,
            Hint,
            Setup,
            StickyGroup,
            Function,
            Derivative,
            Answer,
            Text,
            ConditionalContent,
            Case,
            Select,
            SelectFromSequence,
            Group,
            Section,
            Title,
            Ref,
            List,
            ListItem,
            InlineMath,
            DisplayMath,
            MathRow,
            Aside,
            SideBySide,
            Stack,
            Tabular,
            Spreadsheet,
            Row,
            Cell,
            Legend,
            TriggerSet,
            UpdateValue,
            ClampNumber,
            RepeatFor,
            FunctionIterates,
            Polyline,
            Boolean,
            Award,
            When,
            TextInput,
        ]
    };

    /// Every type an author writes has a spec at
    /// `tests/specs/<family>/<file>.rs` exactly when it is not in
    /// `WITHOUT_SPEC`.
    #[test]
    fn every_component_has_a_spec() {
        let specs = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/specs");
        let mut missing = Vec::new();
        let mut listed_with_spec = Vec::new();
        for &(component_type, defined_in) in super::DEFINED_IN {
            // Specified with what owns it, or never written.
            if component_type.def().flags.internal || component_type.def().flags.owned {
                continue;
            }
            // `geometry::circle::DEFINITION` is `geometry/circle.rs`.
            let (module, _) = defined_in.rsplit_once("::").unwrap();
            let file = format!("{}.rs", module.replace("::", "/"));
            let has_spec = specs.join(&file).is_file();
            let listed = WITHOUT_SPEC.contains(&component_type);
            if !has_spec && !listed {
                missing.push(format!("{component_type:?} (tests/specs/{file})"));
            }
            if has_spec && listed {
                listed_with_spec.push(format!("{component_type:?}"));
            }
        }
        assert!(
            missing.is_empty() && listed_with_spec.is_empty(),
            "without a spec: {missing:?}\nin WITHOUT_SPEC but with a spec (take them off): {listed_with_spec:?}"
        );
    }
}

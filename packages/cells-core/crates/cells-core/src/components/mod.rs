//! Component definitions: which props each tag has, where each prop's value
//! comes from, and its default. This is the only place that knows DoenetML
//! tag vocabulary.
//!
//! A prop may be computed from the component's other props by an operator
//! ([`PropFrom::Computed`]), so a value chain such as a `<slider>`'s is data,
//! inverted by the generic operator inverse.
//!
//! Each type is one `component!` block, grouped by family; the list of
//! every type is `component_types!`. The vocabulary those blocks are
//! written in, a type's row and the declarations of its props, attributes
//! and children, is [`decl`]'s.

pub(crate) mod containers;
mod decl;
pub(crate) mod define;
pub(crate) mod geometry;
pub(crate) mod inputs;
pub mod prop;
pub(crate) mod structure;
#[cfg(test)]
pub(crate) mod test_only;
pub(crate) mod values;

pub use containers::SECTION_TAGS;
pub use decl::*;

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

/// Declares every component type from one list: the [`ComponentType`] enum,
/// [`ComponentType::ALL`], and `COMPONENT_DEFS`, all in list order. Each
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
            $(
                $(#[$doc])*
                #[doc = concat!("\n\nDefined by [`", stringify!($def), "`](", stringify!($def), ").")]
                $variant,
            )*
            $(
                #[cfg(test)]
                $(#[$tdoc])*
                #[doc = concat!("\n\nDefined by [`", stringify!($tdef), "`](", stringify!($tdef), "), for tests.")]
                $tvariant,
            )*
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

/// The type that plays each role, by `Role` discriminant: found, and
/// checked to be exactly one, when the crate compiles.
const ROLE_TYPES: [ComponentType; Role::ALL.len()] = {
    let mut found: [Option<ComponentType>; Role::ALL.len()] = [None; Role::ALL.len()];
    let mut i = 0;
    while i < COMPONENT_DEFS.len() {
        let roles = COMPONENT_DEFS[i].roles;
        let mut j = 0;
        while j < roles.len() {
            let r = roles[j] as usize;
            assert!(found[r].is_none(), "a role is claimed by two types");
            found[r] = Some(ComponentType::ALL[i]);
            j += 1;
        }
        i += 1;
    }
    let mut out = [ComponentType::ALL[0]; Role::ALL.len()];
    let mut r = 0;
    while r < Role::ALL.len() {
        assert!(
            Role::ALL[r] as usize == r,
            "Role::ALL is in declaration order"
        );
        out[r] = match found[r] {
            Some(ty) => ty,
            None => panic!("a role no type claims"),
        };
        r += 1;
    }
    out
};

impl Role {
    /// The type that plays the role.
    pub const fn ty(self) -> ComponentType {
        ROLE_TYPES[self as usize]
    }
}

impl ComponentType {
    /// Whether the type plays `role`.
    pub fn plays(self, role: Role) -> bool {
        role.ty() == self
    }

    /// The type's row in `COMPONENT_DEFS`.
    pub fn def(self) -> &'static ComponentDef {
        &COMPONENT_DEFS[self as usize]
    }

    /// The type a tag in the source makes, if any; internal types have none.
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

    /// The tag the type shows as: the first of its tags.
    pub fn tag(self) -> &'static str {
        self.def().tags[0]
    }

    /// Single-cell props, in declaration order.
    pub fn prop_defs(self) -> &'static [PropDef] {
        self.def().props
    }

    /// The table position of the single-cell prop `name`, current core spellings
    /// accepted.
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
    /// as an element was given ([`ListPoints::Given`]), with the list.
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
    /// ([`ListPoints::Given`]): a circle's `through`, at most three.
    pub(crate) fn given_from(self) -> Option<(crate::compile::api::Attr, Option<usize>)> {
        match self.list()?.points {
            ListPoints::Given { attribute, max, .. } => Some((attribute, max)),
            ListPoints::Table(_) => None,
        }
    }

    /// The points of the list `name` when they are the table's props
    /// ([`ListPoints::Table`]): each one's two prop names.
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
    /// table ([`ListPoints::Given`]), or nowhere. Whether such a point exists
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

    /// How the type is structure rather than content, if it is.
    pub fn structure_kind(self) -> Option<StructureKind> {
        self.def().structure_kind
    }

    /// The structural cell of a type built like a repeat (one scope per
    /// iteration, [`StructureKind::Repeat`]): its `count` prop.
    pub fn count_prop(self) -> Option<usize> {
        match self.structure_kind() {
            Some(StructureKind::Repeat { count }) => Some(count),
            _ => None,
        }
    }

    /// Where the expression prop `pi` stands for is, if it stands for one
    /// ([`PropDef::expr`]).
    pub fn expr_of(self, pi: usize) -> Option<ExprOf> {
        self.prop_defs().get(pi)?.expr
    }

    /// What an answer's response reads of an input of the type; None for a
    /// type that is no answer's input.
    pub fn response(self) -> Option<ResponseKind> {
        self.def().response
    }

    /// How a component of the type shows in text; None for its children's
    /// text.
    pub fn text_kind(self) -> Option<TextKind> {
        self.def().text
    }

    /// What a component of the type changes about where its descendants
    /// are, if anything.
    pub fn encloses(self) -> Option<Encloses> {
        self.def().encloses
    }

    /// The props of the view of a type that encloses a graph
    /// ([`Encloses::Graph`]): `xmin`, `xmax`, `ymin`, `ymax`.
    pub fn graph_bounds(self) -> Option<[usize; 4]> {
        match self.encloses() {
            Some(Encloses::Graph { bounds }) => Some(bounds),
            _ => None,
        }
    }

    /// Whether the type is a sticky group ([`Encloses::Sticky`]).
    pub fn is_sticky_group(self) -> bool {
        matches!(self.encloses(), Some(Encloses::Sticky { .. }))
    }

    /// What the type is to scoring, if anything ([`Scored`]).
    pub fn scored(self) -> Option<Scored> {
        self.def().scored
    }

    /// The position of the prop the type declares as `op` over `over`
    /// ([`PropFrom::Aggregate`]): a section's credit is its `Credit` over
    /// its `ScoredItems`, its number its `Count` over `SectionsThrough`.
    pub fn aggregate_prop(self, op: AggOp, over: Collection) -> Option<usize> {
        self.prop_defs()
            .iter()
            .position(|d| d.from == PropFrom::Aggregate(Aggregate { op, over }))
    }

    /// The 0/1 prop a gate holds its children by ([`StructureKind::Gate`]).
    pub fn gate_prop(self) -> Option<usize> {
        match self.structure_kind() {
            Some(StructureKind::Gate { active }) => Some(active),
            _ => None,
        }
    }

    /// How a member of the type behaves in a sticky group: its shape, and where
    /// its points are. None for a type that is never a member.
    pub fn sticky_layout(self) -> Option<(crate::tick::snap::Shape, StickyPoints)> {
        self.def().sticky
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
    /// is `NO_VALUE` or [`Wire::undefined`] / [`Source::undefined`]. A spec
    /// (`*.spec.rs`) may expect one.
    #[test]
    fn components_write_no_nan_of_their_own() {
        // Spelled in two halves, so this file does not find itself.
        let needle = concat!("f64", "::NAN");
        let dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/components");
        let mut files = Vec::new();
        sources(&dir, &mut files);
        let found: Vec<String> = files
            .iter()
            .filter(|p| {
                p.file_name()
                    .and_then(|n| n.to_str())
                    .is_some_and(|n| n != "define.rs" && !n.ends_with(".spec.rs"))
            })
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

    /// No planner computes a slot position (`list_slot`, [`Port::table`]):
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

    /// [`PlanCtx`]'s planner methods match a recorded count, so the API
    /// grows only deliberately.
    #[test]
    fn plan_ctx_grows_deliberately() {
        const PLAN_CTX_METHODS: usize = 19;
        let path = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/compile/stages/plan/ctx.rs");
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

    /// Files outside `components/` that name a type or read a prop's
    /// position, with how many lines do (ADR 0038): the list only shrinks.
    /// Each line is a match the core makes on a type, which its definition
    /// should say instead.
    const NAMING_TYPES: &[(&str, usize)] = &[
        ("build/expand/aggregate.rs", 1),
        ("build/expand/choice.rs", 2),
        ("build/expand/mod.rs", 10),
        ("compile/graph/eval.rs", 4),
        ("compile/graph/expand.rs", 7),
        ("compile/graph/mod.rs", 5),
        ("compile/graph/signature.rs", 5),
        ("compile/graph/walk.rs", 1),
        ("compile/ir/record.rs", 1),
        ("compile/read/answer.rs", 3),
        ("compile/read/maths.rs", 1),
        ("compile/read/refs.rs", 1),
        ("compile/stages/outline/answer.rs", 2),
        ("compile/stages/outline/choice.rs", 1),
        ("compile/stages/outline/copies.rs", 2),
        ("compile/stages/outline/mod.rs", 14),
        ("compile/stages/plan/answer.rs", 8),
        ("compile/stages/plan/choice.rs", 2),
        ("compile/stages/plan/copies.rs", 10),
        ("compile/stages/plan/iterates.rs", 3),
        ("compile/stages/plan/mod.rs", 2),
        ("compile/stages/seal/keys.rs", 1),
        ("compile/stages/share.rs", 1),
        ("document/mod.rs", 2),
        ("document/paths.rs", 1),
        ("document/request.rs", 3),
        ("document/sections.rs", 9),
    ];

    /// The lines of `text` that name a [`ComponentType`] variant
    /// (`ComponentType::Graph`) or read a prop's position (`case::ACTIVE`,
    /// `prop::case::ACTIVE`, or `ACTIVE` after `use case::{ACTIVE}`),
    /// where `modules` are `prop`'s modules.
    fn naming_type_lines<'t>(text: &'t str, modules: &[String]) -> Vec<(usize, &'t str)> {
        let variants: Vec<String> = ComponentType::ALL
            .iter()
            .map(|ty| format!("{ty:?}"))
            .collect();
        let ident = |c: char| c.is_ascii_alphanumeric() || c == '_';
        let constant = |name: &str| {
            name.starts_with(|c: char| c.is_ascii_uppercase())
                && name
                    .chars()
                    .all(|c| c.is_ascii_uppercase() || c.is_ascii_digit() || c == '_')
        };
        // Each `path::rest` on the line: the identifier before the `::`,
        // what precedes it, and what follows it.
        let paths = |line: &'t str| {
            line.match_indices("::").map(move |(at, _)| {
                let before = &line[..at];
                let start = before.rfind(|c| !ident(c)).map_or(0, |i| i + 1);
                (&before[..start], &before[start..], &line[at + 2..])
            })
        };
        // `prop`'s module `path`, as `prop::case` or `case` alone; not the
        // `document` of `crate::document`.
        let is_module = |prefix: &str, path: &str| {
            modules.iter().any(|m| m == path)
                && (prefix.ends_with("prop::") || !prefix.ends_with("::"))
        };
        // The constants imported by name, `use section::{CREDIT, NUMBER};`.
        let imported: Vec<&str> = text
            .split(';')
            .filter(|u| u.trim_start().starts_with("use "))
            .flat_map(|u| {
                paths(u)
                    .filter(|(prefix, path, _)| is_module(prefix, path))
                    .collect::<Vec<_>>()
            })
            .flat_map(|(_, _, rest)| rest.split(|c| !ident(c)))
            .filter(|name| constant(name))
            .collect();
        let names_one = |line: &'t str| {
            paths(line).any(|(prefix, path, after)| {
                let name = &after[..after.find(|c| !ident(c)).unwrap_or(after.len())];
                (path == "ComponentType" && variants.iter().any(|v| v == name))
                    || (is_module(prefix, path) && constant(name))
            }) || line
                .split(|c| !ident(c))
                .any(|word| imported.contains(&word))
        };
        text.lines()
            .enumerate()
            .filter(|(_, l)| names_one(l))
            .map(|(i, l)| (i + 1, l))
            .collect()
    }

    /// No file outside `components/` names a type or reads a prop's
    /// position more often than `NAMING_TYPES` lists, and none less: a
    /// file that names fewer lowers its count, or leaves the list at zero.
    /// Once the list is empty, no file names any (ADR 0038, step 1).
    #[test]
    fn the_core_names_types_ever_less() {
        let src = Path::new(env!("CARGO_MANIFEST_DIR")).join("src");
        let components = src.join("components");
        // `prop`'s modules: the names in its `pub use super::...::{..}`.
        let prop = std::fs::read_to_string(components.join("prop.rs")).unwrap();
        let modules: Vec<String> = prop
            .split("pub use ")
            .skip(1)
            .filter_map(|u| {
                let u = &u[..u.find(';')?];
                Some(&u[u.find('{')? + 1..u.find('}')?])
            })
            .flat_map(|names| names.split(','))
            .map(|m| m.trim().to_string())
            .filter(|m| !m.is_empty())
            .collect();
        assert!(
            modules.iter().any(|m| m == "case"),
            "prop's modules: {modules:?}"
        );

        let mut files = Vec::new();
        sources(&src, &mut files);
        files.retain(|p| !p.starts_with(&components));
        files.sort();
        let mut found = Vec::new();
        let mut rose = Vec::new();
        for p in &files {
            let text = std::fs::read_to_string(p).unwrap();
            let lines = naming_type_lines(&text, &modules);
            let file = p
                .strip_prefix(&src)
                .unwrap()
                .display()
                .to_string()
                .replace('\\', "/");
            let listed = NAMING_TYPES
                .iter()
                .find(|(f, _)| *f == file)
                .map_or(0, |&(_, n)| n);
            if lines.len() > listed {
                rose.extend(
                    lines
                        .iter()
                        .map(|(i, l)| format!("{file}:{i}: {}", l.trim())),
                );
            }
            if !lines.is_empty() {
                found.push((file, lines.len()));
            }
        }
        let listed: Vec<(String, usize)> = NAMING_TYPES
            .iter()
            .map(|&(f, n)| (f.to_string(), n))
            .collect();
        assert!(
            rose.is_empty(),
            "the core names a type more often than NAMING_TYPES lists; say it in the type's \
             definition instead (ADR 0038):\n{}",
            rose.join("\n")
        );
        let table: String = found
            .iter()
            .map(|(f, n)| format!("        (\"{f}\", {n}),\n"))
            .collect();
        assert_eq!(
            found, listed,
            "the core names types less often than NAMING_TYPES lists; lower it to:\n{table}"
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

    /// Every type an author writes has a spec beside its definition,
    /// `<family>/<file>.spec.rs`, included by the file that defines it,
    /// exactly when it is not in `WITHOUT_SPEC`. A spec nothing includes
    /// would never run, so it counts as missing.
    #[test]
    fn every_component_has_a_spec() {
        let components = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/components");
        let mut missing = Vec::new();
        let mut listed_with_spec = Vec::new();
        for &(component_type, defined_in) in super::DEFINED_IN {
            // Specified with what owns it, or never written.
            if component_type.def().flags.internal || component_type.def().flags.owned {
                continue;
            }
            // `geometry::circle::DEFINITION` is `geometry/circle.rs`, its
            // spec `geometry/circle.spec.rs`; a type in an inline module of
            // its family's `mod.rs` (`inputs::slider`) has its spec beside
            // that `mod.rs`, which includes it.
            let (module, _) = defined_in.rsplit_once("::").unwrap();
            let stem = module.replace("::", "/");
            let spec_file = format!("{stem}.spec.rs");
            let (family, name) = stem.rsplit_once('/').unwrap_or(("", &stem));
            let defining = components.join(format!("{stem}.rs"));
            let defining = if defining.is_file() {
                defining
            } else {
                components.join(family).join("mod.rs")
            };
            let include = format!("#[path = \"{name}.spec.rs\"]");
            let has_spec = components.join(&spec_file).is_file()
                && std::fs::read_to_string(&defining).is_ok_and(|src| src.contains(&include));
            let listed = WITHOUT_SPEC.contains(&component_type);
            if !has_spec && !listed {
                missing.push(format!(
                    "{component_type:?} (src/components/{spec_file}, included by {})",
                    defining.strip_prefix(&components).unwrap().display()
                ));
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

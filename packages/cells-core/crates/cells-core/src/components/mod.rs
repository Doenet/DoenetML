//! Stripped-down component definitions: which props each tag has, where each
//! prop's value comes from, and its default. This is the only place that
//! knows DoenetML tag vocabulary.
//!
//! A component's props are its slots; a prop may be computed from the
//! component's other props by an operator (`PropFrom::Computed`), which is how
//! a component such as `<slider>` describes its whole value chain without any
//! code of its own: the chain is data, and inversion through it is the
//! generic operator inverse.
//!
//! This file holds the types, the lookups the build uses, and the list of
//! every type (`component_types!`). Each type is one `component!` block
//! (`define.rs`, ADR 0016): its tags, flags, props, combined props, list,
//! alternate names, shared state and planner, with its docs. The blocks
//! are in the families' directories: `containers/`, `geometry/`,
//! `inputs/`, `structure/`, `values/`. A type with a planner of its own
//! has a file of its own there, its block and its planner together
//! (`geometry/circle.rs`); a type planned from its table alone, or whose
//! planner only refuses it, has an inline module in the family's
//! `mod.rs`, which also holds what the family's members share. `prop.rs`
//! gathers the named positions. ARCHITECTURE.md walks through adding a
//! type.

use crate::program::OpSpec;

pub(crate) mod containers;
pub(crate) mod define;
pub(crate) mod geometry;
pub(crate) mod inputs;
pub mod prop;
pub(crate) mod structure;
pub(crate) mod values;

pub use containers::SECTION_TAGS;
pub use geometry::{MAX_RIGID_VERTICES, MAX_VERTICES};
pub use values::MAX_TUPLE;

/// Declares every component type from one list: the `ComponentType` enum,
/// `ComponentType::ALL`, and `COMPONENT_DEFS`, all in list order. Each
/// entry names its type's definition, a `component!` block's
/// `DEFINITION`.
macro_rules! component_types {
    ($($(#[$doc:meta])* $variant:ident => $def:expr,)*) => {
        /// `repr(u8)` so the renderer can read the type column as a byte
        /// array; the discriminants follow the list in `component_types!`.
        #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
        #[repr(u8)]
        pub enum ComponentType {
            $($(#[$doc])* $variant,)*
        }

        impl ComponentType {
            /// Every type, in discriminant order.
            pub const ALL: &[ComponentType] = &[$(ComponentType::$variant,)*];
        }

        /// Every type's row, indexed by discriminant.
        pub const COMPONENT_DEFS: &[ComponentDef] = &[$($def,)*];
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
    /// Array props whose items are points.
    pub arrays: &'static [ArrayProp],
    /// The type's one list prop, if it has one: points, as many as the
    /// element has (ADR 0016), stored after the table's props.
    pub list: Option<ListProp>,
    /// The current core's spellings of a few props, accepted in references
    /// so its documents resolve unchanged.
    pub alternate_names: &'static [(&'static str, &'static str)],
    pub flags: Flags,
    /// How an element of the type is planned.
    pub(crate) planner: crate::compile::api::Planner,
    /// How a member of a sticky group attracts and snaps: its shape, and
    /// where its points are.
    pub sticky: Option<(crate::tick::snap::Shape, StickyPoints)>,
}

/// An array prop of points, such as a polygon's `vertices`: the names it
/// goes by, the name of an item (`vertex` for `vertex3`), and each item's
/// coordinate props, as many as the type can hold.
pub struct ArrayProp {
    pub names: &'static [&'static str],
    pub item: &'static str,
    pub items: &'static [[&'static str; 2]],
}

/// A list prop of points, such as a circle's `throughPoints`: as many
/// points as the element was given, stored after the props of the type's
/// table (ADR 0016). An element's props are the table's, then two per
/// point; the list's length is what is left over, so it needs no cell of
/// its own. Point `k` (1-based) is the combined prop `item` k (`throughPoint2`),
/// with coordinates `coords[0]` k and `coords[1]` k (`throughX2`), which
/// the current core also spells `alternate_name` k `_` 1 and `_` 2
/// (`throughPointX2_1`).
pub struct ListProp {
    pub names: &'static [&'static str],
    pub item: &'static str,
    pub coords: [&'static str; 2],
    pub alternate_name: Option<&'static str>,
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
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PropAt {
    Fixed(usize),
    Item(usize),
    Coord(usize, usize),
    /// The list as a whole (`throughPoints`).
    List,
}

/// What a type is, apart from its props: each false until `info`'s
/// builder of the same name (`.copyable()`, ...) sets it.
#[derive(Debug, Clone, Copy)]
pub struct Flags {
    /// `$name` as a child may produce a copy of the component, and
    /// `<collect componentType>` may name the type.
    pub copyable: bool,
    /// The children are rendered; `extend` copies them deeply.
    pub container: bool,
    /// Planned as math cells (`values/curve.rs`); not allowed in a branch
    /// interface.
    pub symbolic: bool,
    /// Made by the builder, never by a tag in the source.
    pub internal: bool,
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
        def.arrays.iter().find_map(|a| {
            let k: usize = name.strip_prefix(a.item)?.parse().ok()?;
            (1..=a.items.len())
                .contains(&k)
                .then(|| &a.items[k - 1][..])
        })
    }

    /// Array props whose items are points: the prop names of each item's
    /// cells, as many items as the type can hold. A polygon's live count is
    /// its `numVertices` cell; the builder trims the list.
    pub fn array_prop(self, name: &str) -> Option<&'static [[&'static str; 2]]> {
        self.array(name).map(|a| a.items)
    }

    /// The point-valued virtual prop for item `k` (1-based) of an array prop.
    pub fn array_item_prop(self, name: &str, k: usize) -> Option<String> {
        self.array(name).map(|a| format!("{}{k}", a.item))
    }

    fn array(self, name: &str) -> Option<&'static ArrayProp> {
        self.def().arrays.iter().find(|a| a.names.contains(&name))
    }

    /// The type's list prop, if it has one.
    pub fn list(self) -> Option<&'static ListProp> {
        self.def().list.as_ref()
    }

    /// Where the prop `name` is: a position in the table, or a point (or
    /// coordinate) of the type's list, or nowhere. Whether a point exists
    /// depends on the element (`list_slot`).
    pub fn prop_at(self, name: &str) -> Option<PropAt> {
        if let Some(i) = self.prop_index(name) {
            return Some(PropAt::Fixed(i));
        }
        let list = self.list()?;
        if list.names.contains(&name) {
            return Some(PropAt::List);
        }
        let index = |s: &str| s.parse::<usize>().ok().filter(|&k| k >= 1);
        if let Some(k) = name.strip_prefix(list.item).and_then(index) {
            return Some(PropAt::Item(k));
        }
        for (j, c) in list.coords.iter().enumerate() {
            if let Some(k) = name.strip_prefix(c).and_then(index) {
                return Some(PropAt::Coord(k, j));
            }
        }
        let rest = name.strip_prefix(list.alternate_name?)?;
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
        let fixed = self.prop_defs().len();
        (self.list().is_some() && k >= 1 && fixed + 2 * k <= n_props)
            .then(|| fixed + 2 * (k - 1) + j)
    }

    /// The name of prop `pi` of an element with `n_props` public props:
    /// the table's, or a list coordinate (`throughX2`); None for a hidden
    /// slot.
    pub fn prop_name(self, n_props: usize, pi: usize) -> Option<std::borrow::Cow<'static, str>> {
        let fixed = self.prop_defs().len();
        if pi < fixed {
            return Some(self.prop_defs()[pi].name.into());
        }
        let list = self.list().filter(|_| pi < n_props)?;
        let (k, j) = ((pi - fixed) / 2 + 1, (pi - fixed) % 2);
        Some(format!("{}{k}", list.coords[j]).into())
    }

    /// How many points the list of an element with `n_props` props holds.
    pub fn list_len(self, n_props: usize) -> usize {
        match self.list() {
            Some(_) => (n_props - self.prop_defs().len()) / 2,
            None => 0,
        }
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
    /// Set by the type's planner (`compile/planner.rs` names it), which
    /// reads the whole element: a circle's center from whichever of
    /// `center`, `radius` and `through` the author gave.
    ByPlanner,
}

/// The positions of a computed prop's inputs among its component's props.
/// Written as prop names in the tables and resolved when compiled
/// (`props` in `define.rs`).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Args {
    at: [u8; MAX_ARGS],
    len: u8,
}

/// The most inputs a computed prop's operator takes.
const MAX_ARGS: usize = 4;

impl std::ops::Deref for Args {
    type Target = [u8];
    fn deref(&self) -> &[u8] {
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
}

impl PropDef {
    pub fn attr_name(&self) -> &'static str {
        self.attr.unwrap_or(self.name)
    }
}

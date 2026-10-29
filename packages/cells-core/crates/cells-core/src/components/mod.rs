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
//! gathers the named positions. `test_only.rs` holds components that
//! exist only in this crate's unit tests. ARCHITECTURE.md walks through adding a
//! type.

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

/// Attributes a renderer reads from the document's literal attributes
/// (`LiteralAttrs`, ADR 0020) rather than the core from the DAST: how a
/// component is presented, which is document text, not state. The check
/// accepts them on any element, since the core never looks them up
/// (`compile/check.rs`); one a renderer reads of one type alone is in that
/// type's `presentation { .. }`. Every other attribute must be read by the
/// type's planner, or the element is refused.
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
/// entry names its type's definition, a `component!` block's
/// `DEFINITION`. The entries of the `#[cfg(test)]` section, after the
/// `;`, exist only in this crate's unit tests (`test_only.rs`, ADR 0016);
/// they come after every other type, so no other type's discriminant
/// depends on them.
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

        /// Where each type (but the test-only ones) is defined, as its
        /// entry names it (`geometry::circle::DEFINITION`): where its spec
        /// is, under `tests/specs/` (`geometry/circle.rs`).
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
    /// Where a component of the type is drawn (ADR 0019).
    pub renders: Renders,
    /// How an element of the type is planned.
    pub(crate) planner: crate::compile::api::Planner,
    /// Attributes of this type a renderer reads from the literal attributes
    /// and the core does not (`presentation { .. }`), accepted by the check
    /// beside `PRESENTATION_ATTRS`.
    pub presentation: &'static [&'static str],
    /// How a member of a sticky group attracts and snaps: its shape, and
    /// where its points are.
    pub sticky: Option<(crate::tick::snap::Shape, StickyPoints)>,
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
    /// A renderer reads every point (a polygon's vertices; ADR 0019).
    pub rendered: bool,
}

/// Where a component of a type is drawn, and so whether the props a
/// renderer reads are outputs (ADR 0019). A component is rendered when its
/// type's rule allows it where it is and its parent is rendered; the
/// document is. A dynamic `hide`, or a case that is not active, leaves it
/// rendered: either can change on any tick.
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
    /// As many as the element was given, stored after the props of the
    /// type's table (ADR 0016): a circle's through points, a polygon's
    /// vertices. An element's props are the table's, then two per point;
    /// the list's length is what is left over, so it needs no cell of its
    /// own. Point `k` (1-based) has coordinates `coords[0]` k and
    /// `coords[1]` k (`throughX2`), which the current core also spells
    /// `alternate_name` k `_` 1 and `_` 2 (`throughPointX2_1`). The
    /// points are given by the attribute `attribute`, one of the type's
    /// `attributes { .. }`, and the list keeps at most `max` of them (a
    /// circle's three through points).
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
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PropAt {
    Fixed(usize),
    Item(usize),
    Coord(usize, usize),
    /// The list as a whole (`throughPoints`).
    List,
}

/// What a type is, apart from its props: each false until its
/// `component!` block's `flags` names it, which calls the builder of the
/// same name (`.copyable()`, ...).
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

    /// Where the prop `name` is: a position in the table, or a point (or
    /// coordinate) of the type's list when its points are stored after the
    /// table (`ListPoints::Given`), or nowhere. Whether such a point exists
    /// depends on the element (`list_slot`). A table list's points are
    /// table props already.
    pub fn prop_at(self, name: &str) -> Option<PropAt> {
        if let Some(i) = self.prop_index(name) {
            return Some(PropAt::Fixed(i));
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
        let fixed = self.prop_defs().len();
        (self.given_list().is_some() && k >= 1 && fixed + 2 * k <= n_props)
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
        let coords = self.given_coords().filter(|_| pi < n_props)?;
        let (k, j) = ((pi - fixed) / 2 + 1, (pi - fixed) % 2);
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
    /// so (ADR 0017).
    pub fn is_interactive_prop(self, n_props: usize, pi: usize) -> bool {
        self.is_marked(n_props, pi, |d| d.interactive, |l| l.interactive)
    }

    /// Whether prop `pi` of an element with `n_props` public props is one
    /// a renderer reads: marked so in the table, or a point of a list
    /// marked so (ADR 0019). An output when the component is rendered.
    pub fn is_rendered_prop(self, n_props: usize, pi: usize) -> bool {
        self.is_marked(n_props, pi, |d| d.rendered, |l| l.rendered)
    }

    /// How many consecutive cells prop `pi` is the first of: 1 but for a
    /// curve's samples (ADR 0019).
    pub fn prop_span(self, pi: usize) -> usize {
        self.prop_defs().get(pi).map_or(1, |d| d.span)
    }

    /// Whether prop `pi` is a score a grader reads (ADR 0019).
    pub fn is_score_prop(self, pi: usize) -> bool {
        self.prop_defs().get(pi).is_some_and(|d| d.score)
    }

    /// Whether prop `pi` is one an action reads (ADR 0019).
    pub fn is_read_by_action_prop(self, pi: usize) -> bool {
        self.prop_defs().get(pi).is_some_and(|d| d.read_by_action)
    }

    /// Whether prop `pi` is one the core reads itself whether or not the
    /// component is rendered (ADR 0019): a score, an input, what an action
    /// reads, or a repeat's count. With the rendered props of rendered
    /// components, the roots of what a document computes.
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

    /// Where a component of the type is drawn (ADR 0019).
    pub fn renders(self) -> Renders {
        self.def().renders
    }

    /// Whether prop `pi` is one an action writes (ADR 0018).
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
    /// A renderer may request this prop: a student's action writes it, so
    /// it is one of the document's inputs (ADR 0017).
    pub interactive: bool,
    /// An action writes this prop (a submit, a trigger): student state,
    /// though no renderer requests it (ADR 0018).
    pub written_by_action: bool,
    /// A renderer reads this prop (ADR 0019).
    pub rendered: bool,
    /// A grader reads this prop (ADR 0019).
    pub score: bool,
    /// An action reads this prop (ADR 0019).
    pub read_by_action: bool,
    /// How many consecutive cells the prop is the first of: 1, or
    /// `SAMPLES` for a curve's samples, which a renderer reads together.
    pub span: usize,
}

impl PropDef {
    pub fn attr_name(&self) -> &'static str {
        self.attr.unwrap_or(self.name)
    }
}

#[cfg(test)]
mod tests {
    use std::path::Path;

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

    /// No silent NaN (ADR 0016): a component writes NaN only as
    /// `NO_VALUE` (a value not given) or as `Wire::undefined` /
    /// `Source::undefined` after a warning, never as `f64::NAN`. Only
    /// `define.rs`, the machinery of definitions, uses NaN itself.
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

    /// Types a spec is still to be written for (ADR 0016, Migration step
    /// 8): the list only shrinks. A type with a spec must leave it, and a
    /// new type comes with its spec.
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
    /// `tests/specs/<family>/<file>.rs`, where its definition is, unless it
    /// is in `WITHOUT_SPEC`; one in `WITHOUT_SPEC` has none.
    #[test]
    fn every_component_has_a_spec() {
        let specs = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/specs");
        let mut missing = Vec::new();
        let mut listed_with_spec = Vec::new();
        for &(component_type, defined_in) in super::DEFINED_IN {
            if component_type.def().flags.internal {
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

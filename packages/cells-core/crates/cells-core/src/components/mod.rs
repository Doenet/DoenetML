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
//! every type (`component_types!`). Each type's definition (its docs, its
//! prop table, its row and its named prop positions) is in a family file:
//! `containers.rs`, `geometry.rs`, `inputs.rs`, `structure.rs`,
//! `values.rs`. `define.rs` has the builders they are written with, and
//! `prop.rs` gathers the named positions. ARCHITECTURE.md walks through
//! adding a type.

use crate::program::OpSpec;

mod containers;
mod define;
mod geometry;
mod inputs;
pub mod prop;
mod structure;
mod values;

pub use containers::SECTION_TAGS;
pub use geometry::MAX_VERTICES;
pub use values::MAX_TUPLE;

/// Declares every component type from one list: the `ComponentType` enum,
/// `ComponentType::ALL`, and `COMPONENT_TYPES`, all in list order. Each
/// entry names its type's row (built with `info`).
macro_rules! component_types {
    ($($(#[$doc:meta])* $variant:ident => $info:expr,)*) => {
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
        pub const COMPONENT_TYPES: &[ComponentTypeInfo] = &[$($info,)*];
    };
}

component_types! {
    /// The root of every document.
    Document => containers::DOCUMENT,
    /// `<graph>`.
    Graph => containers::GRAPH,
    /// `<point>`.
    Point => geometry::POINT,
    /// `<number>`.
    Number => values::NUMBER,
    /// `<numberInput>`.
    NumberInput => inputs::NUMBER_INPUT,
    /// `<op>`: a numeric operator over referenced cells (prototype only;
    /// its tag is registered only with the `testing` feature).
    Op => values::OP,
    /// `<slider>`.
    Slider => inputs::SLIDER,
    /// `<repeatForSequence>`.
    RepeatForSequence => structure::REPEAT_FOR_SEQUENCE,
    /// `<collect>`.
    Collect => structure::COLLECT,
    /// The hidden component behind a repeat's `valueName`.
    SequenceValue => structure::SEQUENCE_VALUE,
    /// `<booleanInput>`.
    BooleanInput => inputs::BOOLEAN_INPUT,
    /// `<math>`.
    Math => values::MATH,
    /// `<evaluate>`.
    Evaluate => values::EVALUATE,
    /// `<mathInput>`.
    MathInput => inputs::MATH_INPUT,
    /// `<circle>`.
    Circle => geometry::CIRCLE,
    /// `<line>`.
    Line => geometry::LINE,
    /// `<lineSegment>`.
    LineSegment => geometry::LINE_SEGMENT,
    /// `<polygon>` and `<triangle>`.
    Polygon => geometry::POLYGON,
    /// `<pointList>`.
    PointList => geometry::POINT_LIST,
    /// `<p>`.
    P => containers::P,
    /// `<setup>`.
    Setup => containers::SETUP,
    /// `<stickyGroup>`.
    StickyGroup => containers::STICKY_GROUP,
    /// `<function>`.
    Function => values::FUNCTION,
    /// `<derivative>`.
    Derivative => values::DERIVATIVE,
    /// `<answer>`.
    Answer => values::ANSWER,
    /// `<text>`.
    Text => values::TEXT,
    /// `<conditionalContent>`.
    ConditionalContent => structure::CONDITIONAL_CONTENT,
    /// One built branch of a `<conditionalContent>`.
    Case => structure::CASE,
    /// `<select>`.
    Select => structure::SELECT,
    /// `<group>` and `<label>`.
    Group => containers::GROUP,
    /// `<section>` and its kin (`<problem>`, `<exercise>`, ...).
    Section => containers::SECTION,
    /// `<title>`.
    Title => containers::TITLE,
    /// `<ref>`.
    Ref => containers::REF,
    /// `<ul>`.
    List => containers::LIST,
    /// `<li>`.
    ListItem => containers::LIST_ITEM,
    /// `<m>`.
    InlineMath => containers::INLINE_MATH,
    /// `<md>` and `<me>`.
    DisplayMath => containers::DISPLAY_MATH,
    /// `<mrow>`.
    MathRow => containers::MATH_ROW,
    /// `<aside>`.
    Aside => containers::ASIDE,
    /// `<sideBySide>`.
    SideBySide => containers::SIDE_BY_SIDE,
    /// `<stack>`.
    Stack => containers::STACK,
    /// `<tabular>`.
    Tabular => containers::TABULAR,
    /// `<spreadsheet>`.
    Spreadsheet => containers::SPREADSHEET,
    /// `<row>`.
    Row => containers::ROW,
    /// `<cell>`.
    Cell => containers::CELL,
    /// `<legend>`.
    Legend => containers::LEGEND,
    /// `<triggerSet>`.
    TriggerSet => containers::TRIGGER_SET,
    /// `<updateValue>`.
    UpdateValue => values::UPDATE_VALUE,
    /// `<clampNumber>`.
    ClampNumber => values::CLAMP_NUMBER,
    /// A tuple of three or more numbers (a `<math>`, an iterate).
    Tuple => values::TUPLE,
    /// `<repeat>`.
    RepeatFor => structure::REPEAT_FOR,
    /// `<functionIterates>`.
    FunctionIterates => structure::FUNCTION_ITERATES,
    /// `<polyline>`.
    Polyline => geometry::POLYLINE,
}

/// What the core knows about a type apart from how it is planned and
/// expanded: one row per type in `COMPONENT_TYPES`, indexed by discriminant.
pub struct ComponentTypeInfo {
    /// The tag the type shows as, then other tags that make it.
    pub tags: &'static [&'static str],
    pub props: &'static [PropDef],
    /// The prop a bare `$name` reference resolves to.
    pub default_prop: Option<&'static str>,
    /// Point- and tuple-valued props that are views over single-cell props.
    pub views: &'static [(&'static str, &'static [&'static str])],
    /// Array props whose items are points.
    pub arrays: &'static [ArrayProp],
    /// The current core's spellings of a few props, accepted in references
    /// so its documents resolve unchanged.
    pub aliases: &'static [(&'static str, &'static str)],
    pub flags: u8,
    /// How a member of a sticky group attracts and snaps: its shape, the
    /// prop of its first coordinate, and how many points it has at most (a
    /// polygon's live count is its `numVertices` cell).
    pub sticky: Option<(crate::tick::snap::Shape, usize, usize)>,
}

/// An array prop of points, such as a polygon's `vertices`: the names it
/// goes by, the name of an item (`vertex` for `vertex3`), and each item's
/// coordinate props, as many as the type can hold.
pub struct ArrayProp {
    pub names: &'static [&'static str],
    pub item: &'static str,
    pub items: &'static [[&'static str; 2]],
}

/// `$name` as a child may produce a copy of the component, and
/// `<collect componentType>` may name the type.
const COPYABLE: u8 = 1;
/// The children are rendered; `extend` copies them deeply.
const CONTAINER: u8 = 2;
/// Planned as math cells (`plan_symbolic`); not allowed in a branch
/// interface.
const SYMBOLIC: u8 = 8;
/// Made by the builder, never by a tag in the source.
const INTERNAL: u8 = 16;
/// A prototype-only tag, registered only with the `testing` feature.
const TEST_ONLY: u8 = 32;

impl ComponentType {
    pub fn info(self) -> &'static ComponentTypeInfo {
        &COMPONENT_TYPES[self as usize]
    }

    pub fn from_tag(tag: &str) -> Option<Self> {
        static BY_TAG: std::sync::OnceLock<std::collections::HashMap<&'static str, ComponentType>> =
            std::sync::OnceLock::new();
        let by_tag = BY_TAG.get_or_init(|| {
            ComponentType::ALL
                .iter()
                .filter(|k| k.info().flags & INTERNAL == 0)
                // Test-only tags are unknown to documents outside tests.
                .filter(|k| cfg!(feature = "testing") || k.info().flags & TEST_ONLY == 0)
                .flat_map(|&k| k.info().tags.iter().map(move |&t| (t, k)))
                .collect()
        });
        by_tag.get(tag).copied()
    }

    pub fn tag(self) -> &'static str {
        self.info().tags[0]
    }

    /// Single-cell props, in declaration order.
    pub fn prop_defs(self) -> &'static [PropDef] {
        self.info().props
    }

    pub fn prop_index(self, name: &str) -> Option<usize> {
        let name = self.canonical_prop(name);
        self.prop_defs().iter().position(|p| p.name == name)
    }

    /// A prop name with the current core's spellings mapped to ours.
    pub fn canonical_prop(self, name: &str) -> &str {
        self.info()
            .aliases
            .iter()
            .find(|(from, _)| *from == name)
            .map_or(name, |(_, to)| to)
    }

    /// Multi-cell props that are views over single-cell props: the type's
    /// views, and each array item by name (`vertex3`, `point1`).
    pub fn virtual_prop(self, name: &str) -> Option<&'static [&'static str]> {
        let info = self.info();
        if let Some((_, parts)) = info.views.iter().find(|(v, _)| *v == name) {
            return Some(*parts);
        }
        info.arrays.iter().find_map(|a| {
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
        self.info().arrays.iter().find(|a| a.names.contains(&name))
    }

    /// The prop a bare `$name` reference resolves to.
    pub fn default_prop(self) -> Option<&'static str> {
        self.info().default_prop
    }

    /// Whether `$name` as a child may produce a copy of this component, and
    /// `<collect componentType>` name the type.
    pub fn copyable(self) -> bool {
        self.info().flags & COPYABLE != 0
    }

    /// Containers whose children are rendered; `extend` copies them deeply.
    pub fn container(self) -> bool {
        self.info().flags & CONTAINER != 0
    }

    /// Function, derivative and answer: planned as math cells.
    pub fn symbolic(self) -> bool {
        self.info().flags & SYMBOLIC != 0
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

    pub fn sticky_layout(self) -> Option<(crate::tick::snap::Shape, usize, usize)> {
        self.info().sticky
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PropFrom {
    /// Value given by an attribute (`PropDef::attr`, or the prop's name).
    Attribute,
    /// Value given by the element's children (a literal or one reference).
    Children,
    /// Value computed by an operator from the `<op>` element's `args`.
    Derived,
    /// Value computed by `op` from the component's own props at `args`.
    Computed { op: OpSpec, args: Args },
    /// Value given by the attribute if present, else an alias of the
    /// component's own prop at `alias`.
    AttributeOr { alias: u8 },
    /// Planned by the builder from the whole element (geometric types).
    Planned,
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

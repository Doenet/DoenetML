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
pub(crate) mod operators;
pub mod prop;
mod shape;
pub(crate) mod structure;
#[cfg(test)]
pub(crate) mod test_only;
pub mod types;
pub(crate) mod values;

pub use containers::SECTION_TAGS;
pub use decl::*;
pub use shape::ListShape;
pub use types::{AuthorType, Fit, Place, PropType, StandsIn, TypeDecl, TypeKind, Typing, Want};

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
    // How a number shows, beside `displayDecimals`: the display's only,
    // read where the LaTeX is written (`sym::Display`).
    "displayDigits",
    "displaySmallAsZero",
    "padZeros",
    "avoidScientificNotation",
    "displayBlanks",
];
/// Presentation attributes a renderer reads and the core does not, accepted
/// on any type with an anchor ([`PropFrom::Anchor`]): where the value sits
/// against its anchor, and whether a drag moves it.
pub const ANCHOR_PRESENTATION_ATTRS: &[&str] = &["positionFromAnchor", "draggable"];
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
        /// `repr(u16)` so the renderer can read the type column as a
        /// 16-bit array; the discriminants follow the list in
        /// `component_types!`.
        #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
        #[repr(u16)]
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
    NumberList => values::number_list::DEFINITION,
    TextList => values::text_list::DEFINITION,
    BooleanList => values::boolean_list::DEFINITION,
    MathList => values::math_list::DEFINITION,
    MathValue => values::math_value::DEFINITION,
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
    TriggerSet => inputs::trigger_set::DEFINITION,
    UpdateValue => inputs::update_value::DEFINITION,
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
    Em => containers::markup::EM,
    Alert => containers::markup::ALERT,
    Term => containers::markup::TERM,
    Q => containers::markup::Q,
    Sq => containers::markup::SQ,
    C => containers::markup::C,
    Attr => containers::markup::ATTR,
    Span => containers::markup::SPAN,
    Tag => containers::markup::TAG,
    Tagc => containers::markup::TAGC,
    Tage => containers::markup::TAGE,
    Ndash => containers::markup::NDASH,
    Mdash => containers::markup::MDASH,
    Nbsp => containers::markup::NBSP,
    Ellipsis => containers::markup::ELLIPSIS,
    Lq => containers::markup::LQ,
    Rq => containers::markup::RQ,
    Lsq => containers::markup::LSQ,
    Rsq => containers::markup::RSQ,
    Br => containers::markup::BR,
    Hr => containers::markup::HR,
    Div => containers::markup::DIV,
    Pre => containers::markup::PRE,
    BlockQuote => containers::markup::BLOCK_QUOTE,
    Ol => containers::markup::OL,
    Proof => containers::blocks::proof::DEFINITION,
    Solution => containers::blocks::solution::DEFINITION,
    Introduction => containers::blocks::introduction::DEFINITION,
    Conclusion => containers::blocks::conclusion::DEFINITION,
    Statement => containers::blocks::statement::DEFINITION,
    Figure => containers::blocks::figure::DEFINITION,
    Caption => containers::blocks::caption::DEFINITION,
    Footnote => containers::blocks::footnote::DEFINITION,
    PostponeRenderContainer => containers::blocks::postpone_render_container::DEFINITION,
    Abs => operators::abs::DEFINITION,
    Sign => operators::abs::SIGN,
    Floor => operators::abs::FLOOR,
    Ceil => operators::abs::CEIL,
    Round => operators::round::DEFINITION,
    SetSmallToZero => operators::set_small_to_zero::DEFINITION,
    WrapNumberPeriodic => operators::wrap_number_periodic::DEFINITION,
    Sum => operators::fold::DEFINITION,
    Product => operators::fold::PRODUCT,
    Mean => operators::fold::MEAN,
    Median => operators::fold::MEDIAN,
    Min => operators::fold::MIN,
    Max => operators::fold::MAX,
    Mod => operators::fold::MOD,
    Gcd => operators::fold::GCD,
    Lcm => operators::fold::LCM,
    Count => operators::fold::COUNT,
    Variance => operators::variance::DEFINITION,
    StandardDeviation => operators::variance::STANDARD_DEVIATION,
    And => operators::logic::DEFINITION,
    Or => operators::logic::OR,
    Xor => operators::logic::XOR,
    Iff => operators::logic::IFF,
    Implies => operators::logic::IMPLIES,
    Not => operators::not::DEFINITION,
    IsInteger => operators::is_integer::DEFINITION,
    IsNumber => operators::is_number::DEFINITION,
    IsBetween => operators::is_between::DEFINITION,
    Ray => geometry::ray::DEFINITION,
    Vector => geometry::vector::DEFINITION,
    Rectangle => geometry::rectangle::DEFINITION,
    RegularPolygon => geometry::regular_polygon::DEFINITION,
    Angle => geometry::angle::DEFINITION,
    Integer => values::formatted::INTEGER,
    IntComma => values::formatted::INT_COMMA,
    Pluralize => values::pluralize::DEFINITION,
    Table => containers::layout::TABLE,
    SbsGroup => containers::layout::SBS_GROUP,
    AsList => containers::layout::AS_LIST,
    Latex => containers::layout::LATEX,
    Pretext => containers::layout::PRETEXT,
    Article => containers::layout::ARTICLE,
    Book => containers::layout::BOOK,
    AxisLabel => containers::layout::AXIS_LABEL,
    CumulativeSum => operators::scan::DEFINITION,
    CumulativeProduct => operators::scan::CUMULATIVE_PRODUCT,
    CumulativeMin => operators::scan::CUMULATIVE_MIN,
    CumulativeMax => operators::scan::CUMULATIVE_MAX,
    Differences => operators::scan::DIFFERENCES,
    ArgMin => operators::index_of::DEFINITION,
    ArgMax => operators::index_of::ARG_MAX,
    IndexOf => operators::index_of::INDEX_OF,
    SearchSorted => operators::index_of::SEARCH_SORTED,
    Sort => operators::sort::DEFINITION,
    Shuffle => operators::sort::SHUFFLE,
    Sequence => values::sequence::DEFINITION,
    SelectRandomNumbers => structure::select_random_numbers::DEFINITION,
    SampleRandomNumbers => structure::sample_random_numbers::DEFINITION,
    SelectPrimeNumbers => structure::select_prime_numbers::DEFINITION,
    SamplePrimeNumbers => structure::sample_prime_numbers::DEFINITION,
    ClampFunction => values::function_operators::DEFINITION,
    WrapFunctionPeriodic => values::function_operators::WRAP_FUNCTION_PERIODIC,
    BestFitLine => geometry::best_fit_line::DEFINITION,
    Intersection => geometry::intersection::DEFINITION,
    EquilibriumPoint => geometry::equilibrium_point::DEFINITION,
    EquilibriumLine => geometry::equilibrium_line::DEFINITION,
    Endpoint => geometry::endpoint::DEFINITION,
    Parabola => geometry::parabola::DEFINITION,
    CallAction => inputs::call_action::DEFINITION,
    FractionInput => inputs::fraction_input::DEFINITION,
    FractionInputPart => inputs::fraction_input::part::DEFINITION,
    PiecewiseFunction => values::piecewise_function::DEFINITION,
    Curve => geometry::curve::DEFINITION,
    BezierControls => geometry::curve::bezier_controls_tag::DEFINITION,
    ControlVectors => geometry::curve::control_vectors_tag::DEFINITION,
    EquilibriumCurve => geometry::equilibrium_curve::DEFINITION,
    Interval => values::interval::DEFINITION,
    SubsetOfReals => values::subset_of_reals::DEFINITION,
    IntervalList => values::interval_list::DEFINITION,
    StructuralSequence => values::structural_sequence::DEFINITION,
    Matrix => values::matrix::DEFINITION,
    MatrixRow => values::matrix::row::DEFINITION,
    MatrixColumn => values::matrix::column::DEFINITION,
    MatrixInput => inputs::matrix_input::DEFINITION,
    BoundMatrixInput => inputs::matrix_input::bound::DEFINITION,
    MatrixInputRow => inputs::matrix_input::row::DEFINITION,
    BoundMatrixInputRow => inputs::matrix_input::bound_row::DEFINITION,
    MatrixInputCell => inputs::matrix_input::cell::DEFINITION,
    Page => containers::blocks::page::DEFINITION,
    /// `<cascade>`: steps revealed as the ones before them are complete
    /// (ADR 0062).
    Cascade => containers::cascade::DEFINITION,
    /// `<cascadeMessage>`: what a cascade shows for a gap between its steps.
    CascadeMessage => containers::cascade::MESSAGE,
    /// A `<mathList>` over a math value (ADR 0063).
    OverValueMathList => values::over_value::math_list::DEFINITION,
    /// A `<numberList>` over a math value (ADR 0063).
    OverValueNumberList => values::over_value::number_list::DEFINITION,
    /// A `<pointList>` over a math value (ADR 0063).
    OverValuePointList => values::over_value::point_list::DEFINITION,
    /// `<summaryStatistics>`: statistics of the finite values of its
    /// operands.
    SummaryStatistics => operators::summary_statistics::DEFINITION,
    /// `<sampleMultivariateRandomNumber>`: one number per category, drawn
    /// together at load.
    SampleMultivariateRandomNumber => structure::sample_multivariate_random_number::DEFINITION,
    /// `<attractTo>` among a point's constraints.
    AttractTo => geometry::attract_to::DEFINITION,
    /// A `<pointList>` of one entry of a point list chosen by an index, a
    /// count of 0 or 1 (ADR 0074).
    PointListEntry => geometry::point_list_entry::DEFINITION,
    /// A `<sequence type="letters">` whose count follows a value: its
    /// items texts (ADR 0074).
    StructuralLetterSequence => values::structural_sequence::LETTERS,
    /// `<label>`: a component's label, with its text as a value (ADR
    /// 0024, ADR 0075).
    Label => containers::label::DEFINITION,
    /// A `<polyline>` whose vertices are a repeat's points (ADR 0075).
    PolylineOverIterations => geometry::over_iterations::polyline::DEFINITION,
    /// A `<polygon>` whose vertices are a repeat's points (ADR 0075).
    PolygonOverIterations => geometry::over_iterations::polygon::DEFINITION,
    /// `<sortIndices>`: the positions of its operands in sorted order.
    SortIndices => operators::sort_indices::DEFINITION,
    /// `<binCounts>`: how many operands fall in each bin (ADR 0078).
    BinCounts => operators::bin_counts::DEFINITION,
    /// `<tally>`: how many operands equal each declared category (ADR
    /// 0078).
    Tally => operators::tally::DEFINITION,
    /// `<image>`: an image laid out in the flow (ADR 0078).
    Image => containers::image::DEFINITION,
    /// `<video>`: a video laid out in the flow (ADR 0078).
    Video => containers::video::DEFINITION,
    /// `<variantControl>`: the document's or a section's variants, read
    /// when compiled (ADR 0085).
    VariantControl => structure::variant_control::DEFINITION,
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

    /// What the type is among the types that share its definition, as its
    /// block's `variant` or its `DEFINITION.variant(..)` says: how the
    /// planner they share tells them apart. Panics for a type that
    /// declares none of type `V`, a mistake in its definition.
    pub(crate) fn variant<V: 'static>(self) -> &'static V {
        self.def()
            .variant
            .and_then(|v| v.downcast_ref())
            .unwrap_or_else(|| {
                panic!(
                    "<{}> declares no variant of type {}",
                    self.tag(),
                    std::any::type_name::<V>()
                )
            })
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

    /// The type an element of this type is, given whether each attribute
    /// it carries holds literal numbers only (`is_literal`): a
    /// structural sequence's (ADR 0041) when one its count follows does
    /// not, else this.
    pub fn laid_out(self, is_literal: impl Fn(&str) -> bool) -> ComponentType {
        match self.def().structural {
            Some(s) if !s.when.iter().all(|a| is_literal(a)) => s.is,
            _ => self,
        }
    }

    /// The type an element of this type is when its content is one
    /// reference to a math value (ADR 0063): a list whose count follows
    /// the value, settled by outlining once names resolve.
    pub fn over_value(self) -> Option<ComponentType> {
        self.def().over_value
    }

    /// The type an element of this type is when its points attribute
    /// names a structural sequence of points (ADR 0075), settled by
    /// outlining once names resolve.
    pub fn over_iterations(self) -> Option<ComponentType> {
        self.def().over_iterations
    }

    /// Whether the type is a list over a math value (ADR 0063): what some
    /// type's [`over_value`](Self::over_value) names.
    pub fn is_over_value(self) -> bool {
        ComponentType::ALL
            .iter()
            .any(|t| t.def().over_value == Some(self))
    }

    /// Whether a component of the type shows what it holds as a list of
    /// items (COMP-2): a repeat's iterations, a collect's gathered
    /// components, each one item.
    pub fn lists_items(self) -> bool {
        matches!(self.structure_kind(), Some(StructureKind::Repeat { .. }))
            || self.def().machinery == Some(Machinery::Collect)
    }

    /// The type a child element of tag `tag` is under an element of this
    /// type (ADR 0055): the one the type declares for the tag, else the
    /// tag's own.
    pub fn child_type(self, tag: &str) -> Option<ComponentType> {
        self.def()
            .child_types
            .iter()
            .find(|(t, _)| *t == tag)
            .map(|&(_, ty)| ty)
            .or_else(|| ComponentType::from_tag(tag))
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
    fn given_list(
        self,
    ) -> Option<(
        &'static ListProp,
        &'static [&'static str],
        Option<&'static str>,
    )> {
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

    /// The cell names of an entry of the type's list when its entries are
    /// as many as an element was given, stored after the table: `throughX`
    /// and `throughY`, or a value list's one, `number`.
    pub fn given_coords(self) -> Option<&'static [&'static str]> {
        self.given_list().map(|(_, coords, _)| coords)
    }

    /// How many cells an entry of the type's given list is: two for a
    /// point, one for a value (ADR 0041); 0 without a given list.
    pub fn list_width(self) -> usize {
        self.given_coords().map_or(0, <[_]>::len)
    }

    /// What a `$ref` child naming `sel` of this type shows as, when the
    /// port alone says: an entry of a boolean list is a boolean (ADR 0041).
    pub fn shows_as(self, sel: PropSel) -> Option<Role> {
        match sel {
            PropSel::At(PropAt::List | PropAt::Item(_) | PropAt::Coord(..))
                if self.list_entry() == Some(EntryKind::Boolean) =>
            {
                Some(Role::BooleanValue)
            }
            _ => None,
        }
    }

    /// What an entry of the type's given list is, if it has one.
    pub fn list_entry(self) -> Option<EntryKind> {
        match self.list()?.points {
            ListPoints::Given { entry, .. } => Some(entry),
            ListPoints::Table(_) => None,
        }
    }

    /// The attribute whose literal number cuts a value list's entries
    /// (`maxNumber`), if the type declares one.
    pub(crate) fn list_max_attr(self) -> Option<crate::compile::api::Attr> {
        match self.list()?.points {
            ListPoints::Given { max_by, .. } => max_by,
            ListPoints::Table(_) => None,
        }
    }

    /// How many fewer entries the type's list has than its children
    /// contribute, when its count follows its children's (a value list's,
    /// a `<sort>`'s, a `<cumulativeSum>`'s, one for a `<differences>`).
    pub(crate) fn list_from_children(self) -> Option<u8> {
        match self.list()?.points {
            ListPoints::Given { from_children, .. } => from_children,
            ListPoints::Table(_) => None,
        }
    }

    /// The type of a row of an entry of the type's list (ADR 0041,
    /// decision 4), when the entries are the element's own (its children
    /// or its planner give them, never an attribute: a value list's, a
    /// list operator's, a sampler's): a number, a text, a boolean, a math
    /// value or a point, as the entry is. Each entry of such an element is
    /// a component of this type, a child of the list, whose ports
    /// ([`ComponentType::entry_ports`]) alias the entry's cells.
    pub fn entry_row(self) -> Option<ComponentType> {
        let ListPoints::Given {
            attribute: None,
            entry,
            ..
        } = self.list()?.points
        else {
            return None;
        };
        (!self.given_coords()?.is_empty()).then(|| shape::entry_row_type(entry))
    }

    /// The ports of a row of this type (an [`ComponentType::entry_row`])
    /// that alias an entry's cells, in the entry's order: a value's one,
    /// a point's two coordinates.
    pub fn entry_ports(self) -> Vec<usize> {
        match self.default_sel() {
            Some(sel @ PropSel::Parts { .. }) => {
                sel.parts().iter().map(|&p| usize::from(p)).collect()
            }
            _ => self.scalar_prop().into_iter().collect(),
        }
    }

    /// Whether the type's given list holds points, two cells an entry.
    pub fn lists_points(self) -> bool {
        self.list_width() == 2
    }

    /// The attribute that gives the type's list its points, and the most
    /// the list keeps, when they are as many as an element was given
    /// ([`ListPoints::Given`]): a circle's `through`, at most three.
    pub(crate) fn given_from(self) -> Option<(crate::compile::api::Attr, Option<usize>)> {
        match self.list()?.points {
            ListPoints::Given { attribute, max, .. } => Some((attribute?, max)),
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
            PropSel::At(PropAt::Companion) => list.and_then(|l| l.companion).unwrap_or("").into(),
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
        if list.companion == Some(name) {
            return Some(PropAt::Companion);
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
    /// element with `n_props` props, if the element has that point, when
    /// the element's entries are the type's ([`ListShape::list_slot`]).
    pub fn list_slot(self, n_props: usize, k: usize, j: usize) -> Option<usize> {
        ListShape::list_slot(self.shape(), n_props, k, j)
    }

    /// The name of prop `pi` of an element with `n_props` public props:
    /// the table's, or a list coordinate (`throughX2`); None for a hidden
    /// slot ([`ListShape::prop_name`]).
    pub fn prop_name(self, n_props: usize, pi: usize) -> Option<std::borrow::Cow<'static, str>> {
        self.shape().prop_name(n_props, pi)
    }

    /// How many points the list of an element with `n_props` props holds
    /// ([`ListShape::list_len`]).
    pub fn list_len(self, n_props: usize) -> usize {
        self.shape().list_len(n_props)
    }

    /// How many cells an entry has in the list's companion sequence
    /// ([`ListProp::companion`]): one when the list has one, else none.
    pub fn companion_width(self) -> usize {
        usize::from(self.list().is_some_and(|l| l.companion.is_some()))
    }

    /// The prop a bare `$x[k]` reads entries inside the expression of
    /// (ADR 0041, decision 2): its default prop, when that is one cell that
    /// stands for an expression (`expr_of`) and the type has no list (a
    /// `<math>`'s, a `<mathInput>`'s `value`).
    pub fn handle_sel(self) -> Option<PropSel> {
        let sel = self.default_sel()?;
        let PropSel::At(PropAt::Position(pi)) = sel else {
            return None;
        };
        (self.list().is_none() && self.expr_of(pi).is_some()).then_some(sel)
    }

    /// The table position of a capped list's live length
    /// ([`ListProp::live`], ADR 0041 decision 2), if the type's list is one.
    pub fn live_len(self) -> Option<usize> {
        self.prop_index(self.list()?.live?)
    }

    /// How many public props an element with `n` list entries has after
    /// its table's: the entries' cells, then the companion sequence's
    /// ([`ListShape::list_props`]).
    pub fn list_props(self, n: usize) -> usize {
        self.shape().list_props(n)
    }

    /// The positions of the companion sequence ([`ListProp::companion`])
    /// of an element with `n_props` props ([`ListShape::companion_slots`]).
    pub fn companion_slots(self, n_props: usize) -> std::ops::Range<usize> {
        self.shape().companion_slots(n_props)
    }

    /// The list shape of an element of the type whose entries are the
    /// type's: every element's but a `<sort>`'s or `<shuffle>`'s of
    /// points or booleans, whose entries are its own (ADR 0053).
    pub fn shape(self) -> ListShape {
        ListShape::new(self, None)
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

    /// The positions of the props giving where a component of the type is
    /// drawn in a graph, x then y ([`PropFrom::Anchor`]), if it has them.
    pub fn anchor_props(self) -> Option<[usize; 2]> {
        let defs = self.prop_defs();
        let at = |k: u8| {
            defs.iter()
                .position(|d| d.from == PropFrom::Anchor { coord: k })
        };
        Some([at(0)?, at(1)?])
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

    /// What the type is to the document's variants (ADR 0085): the
    /// current core's types that create variants, and how each counts
    /// them.
    pub fn creates_variants(self) -> Option<VariantDecl> {
        use ComponentType::*;
        Some(match self {
            Document => VariantDecl::Document,
            RepeatForSequence => VariantDecl::Repeat,
            ChoiceInput => VariantDecl::ChoiceInput,
            Choice => VariantDecl::Choice,
            ConditionalContent => VariantDecl::Repeat,
            Select => VariantDecl::Select,
            SelectFromSequence => VariantDecl::Sequence,
            Group => VariantDecl::Product,
            Section => VariantDecl::Section,
            RepeatFor => VariantDecl::Repeat,
            Shuffle => VariantDecl::Shuffle,
            SelectRandomNumbers => VariantDecl::Uncounted,
            SampleRandomNumbers => VariantDecl::Sampler,
            SelectPrimeNumbers => VariantDecl::Uncounted,
            SamplePrimeNumbers => VariantDecl::Sampler,
            SampleMultivariateRandomNumber => VariantDecl::Sampler,
            VariantControl => VariantDecl::Control,
            _ => return None,
        })
    }

    /// How the type is structure rather than content, if it is.
    pub fn structure_kind(self) -> Option<StructureKind> {
        self.def().structure_kind
    }

    /// What the type is to the sequences numbering the divisions and the
    /// list items, when it is neither numbered nor structure (ADR 0054).
    pub fn numbering(self) -> Option<Numbering> {
        self.def().numbering
    }

    /// Whether the list items' sequence passes through it (ADR 0054, ADR
    /// 0058): a structure, or a type both sequences pass through (a
    /// `<page>`). A section's parent, whose `asList` makes it a list item,
    /// is its nearest ancestor that is neither.
    pub fn passes_list_items(self) -> bool {
        self.structure_kind().is_some() || self.numbering() == Some(Numbering::PassesBoth)
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

    /// The expression a box of a grid stands for (ADR 0045): the prop its
    /// default prop stands for, or the default prop itself.
    pub fn box_expr(self) -> Option<usize> {
        let at = self.prop_index(self.default_prop()?)?;
        Some(self.expr_of(at).map_or(at, |x| usize::from(x.at)))
    }

    /// The prop that stands for the expression prop `pi` holds, if one
    /// does: a `<math>`'s `value` for its `expr`.
    pub fn value_of_expr(self, pi: usize) -> Option<usize> {
        (0..self.prop_defs().len())
            .find(|&k| k != pi && self.expr_of(k).is_some_and(|x| usize::from(x.at) == pi))
    }

    /// What an answer's response reads of an input of the type; None for a
    /// type that is no answer's input.
    pub fn response(self) -> Option<ResponseKind> {
        self.def().response
    }

    /// The inputs a component of the type owns ([`InnerInput`], ADR 0045).
    pub fn inner(self) -> &'static [InnerInput] {
        self.def().inner
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

    /// The type an element of this type is, given whether it carries
    /// each attribute: the type a `rewrite` names when it carries that
    /// attribute (`<group rendered>` is a conditional content), else this.
    pub fn rewritten(self, has_attr: impl Fn(&str) -> bool) -> ComponentType {
        match self.def().rewrite {
            Some((attr, to)) if has_attr(attr) => to,
            _ => self,
        }
    }

    /// Why an element of an owned type standing free is refused: what owns
    /// it (`an <award> outside an <answer>`), or that only its owner makes
    /// it.
    pub fn free_owned_refusal(self) -> String {
        let a = |tag: &str| {
            if tag.starts_with(['a', 'e', 'i', 'o', 'u']) {
                "an"
            } else {
                "a"
            }
        };
        let tag = self.tag();
        match self.def().owner {
            Some(owner) => format!(
                "{} <{tag}> outside {} <{}>",
                a(tag),
                a(owner.tag()),
                owner.tag()
            ),
            None => format!("{} <{tag}>, which only what owns it makes", a(tag)),
        }
    }

    /// The prop that holds the value of an element of the type, when it
    /// holds a scalar ([`ExtendValue::Scalar`]): a number's `value`.
    pub fn scalar_prop(self) -> Option<usize> {
        match self.def().extend_value {
            Some(ExtendValue::Scalar(pi)) => Some(pi),
            _ => None,
        }
    }

    /// The prop whose value picks what a choice of the type holds
    /// ([`StructureKind::Transparent`]'s `choice`): a conditional
    /// content's, which makes it a reactive choice.
    pub fn choice_prop(self) -> Option<usize> {
        match self.structure_kind() {
            Some(StructureKind::Transparent { choice }) => choice,
            _ => None,
        }
    }

    /// Whether the type is a choice made at load (a `<select>`): the
    /// `Choice` machinery plans it, and no prop picks what it holds.
    pub fn chooses_at_load(self) -> bool {
        self.def().machinery == Some(Machinery::Choice) && self.choice_prop().is_none()
    }

    /// Whether an element of the type holds the points of the list it
    /// extends, made when built ([`ExtendValue::List`]): a `<pointList>`.
    pub fn holds_list_points(self) -> bool {
        matches!(self.def().extend_value, Some(ExtendValue::List))
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

    /// The gate the type sets on each of its children by its place
    /// ([`StepGate`], ADR 0062): a `<cascade>`'s.
    pub fn step_gate(self) -> Option<StepGate> {
        self.def().gate
    }

    /// The [`StepGate`] whose message type the type is, when one is: what
    /// shows a message of the type (ADR 0062).
    pub fn message_of(self) -> Option<StepGate> {
        static GATES: std::sync::OnceLock<Vec<StepGate>> = std::sync::OnceLock::new();
        GATES
            .get_or_init(|| {
                ComponentType::ALL
                    .iter()
                    .filter_map(|t| t.step_gate())
                    .collect()
            })
            .iter()
            .copied()
            .find(|g| g.message == self)
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
            // Nor a repeat-like type's item, which its declared function
            // wires (ADR 0040), when nothing else makes one.
            .filter(|&&ty| {
                !(ty.def().flags.internal
                    && ComponentType::ALL
                        .iter()
                        .any(|o| o.def().item.is_some_and(|i| i.ty == ty)))
            })
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
        // 25: ADR 0045 added `inner`, `plan_inner`, `inner_quotient` and
        // `Inner::port`, for the inputs a type owns; ADR 0041 a list's
        // entries and an entry read as math. 27: ADR 0043 added
        // `operand_expr` and `operator_expr`, for operators over math. 31:
        // ADR 0049 added `interval`, a domain's endpoints and closedness,
        // `symbol`, a function's variable as a math cell,
        // `children_playing`, a piecewise function's pieces, and
        // `sym_tokens`, a curve's coordinate from its tuple's entry.
        // 33: ADR 0041 step 3 added which entries are a value list's
        // element children as they stand, and a point list's points. 35:
        // ADR 0053 added `entry_kind` and `reference_entries`, for what a
        // sort compares and what a text joins. 38: ADR 0053 added
        // `ref_prop`, `ref_of_elem` and `ref_cells`, for a sort by a prop
        // of its operands (`sortByProp`, a vector's displacement or tail).
        // 40: ADR 0058 added `ancestor_prop` and `last_child_text`, for a
        // section's full number and title as text. 41: ADR 0062 added
        // `is_step`, for a step of a cascade, which aggregates its scores.
        // 44: ADR 0064 added `ref_kind`, `not_a_boolean` and `type_mix`, for
        // a `<boolean>` of a number or a text, a type mix (D47, D68). 45:
        // ADR 0072 added `entry_number`, a list's entry read as a number, a
        // math cell evaluated.
        // ADR 0074 added `source_text`, a sequence's letters or math as
        // written.
        // ADR 0075 added `children_joined`, a label's text as a value.
        const PLAN_CTX_METHODS: usize = 47;
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
    /// position (ADR 0038): what the core needs of a type it reads from the
    /// type's definition, a role, a declaration or a machinery.
    #[test]
    fn the_core_names_no_type() {
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
        let found: Vec<String> = files
            .iter()
            .flat_map(|p| {
                let text = std::fs::read_to_string(p).unwrap();
                let file = p.strip_prefix(&src).unwrap().display().to_string();
                naming_type_lines(&text, &modules)
                    .into_iter()
                    .map(|(i, l)| format!("{file}:{i}: {}", l.trim()))
                    .collect::<Vec<_>>()
            })
            .collect();
        assert!(
            found.is_empty(),
            "the core names a type; say it in the type's definition instead (ADR 0038):\n{}",
            found.join("\n")
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
            P,
            ShortDescription,
            Hint,
            Setup,
            StickyGroup,
            Answer,
            Text,
            ConditionalContent,
            Case,
            Select,
            Group,
            Title,
            Ref,
            List,
            ListItem,
            InlineMath,
            DisplayMath,
            MathRow,
            SideBySide,
            Stack,
            Tabular,
            Spreadsheet,
            Row,
            Cell,
            Legend,
            ClampNumber,
            RepeatFor,
            FunctionIterates,
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

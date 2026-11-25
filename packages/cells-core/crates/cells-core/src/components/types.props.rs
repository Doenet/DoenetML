//! Each prop's author type (ADR 0076 §7): what `$x.prop` is, in words an
//! author would use, declared for every single-cell prop, combined prop
//! (`coords`) and list prop (`vertices`) of every type.
//!
//! A name that means one thing on every type (`hide`, `anchorX`,
//! `numComponents`) is declared once, in [`COMMON`]; the rest per type, in
//! one exhaustive match ([`ComponentType::declared_props`]). A list type's
//! list and its items are typed by its [`TypeDecl::ListOf`]. Like the type
//! declarations, these sit beside today's flags (`PropDef::text`,
//! `expr_of`, [`TextKind`](crate::components::TextKind), ...) until planners read them.

use super::{ComponentType, TypeDecl};

/// What a prop is to an author.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PropType {
    /// A value of this type: a number, a math, a point.
    Is(ComponentType),
    /// Any number of entries of this type.
    ListOf(ComponentType),
    /// Given by the element's written attributes and children: a `<sort>`'s
    /// values by its items, an answer's response by its input (D55).
    ByElement,
    /// A number the core reads, where an author would name something else
    /// (a curve's kind, which the current core reads as a text; a section's
    /// tag): no author type until it is held as one.
    Code,
}

use ComponentType as C;
use PropType::*;

/// The names that mean the same on every type that has them. A type's own
/// declaration of a name takes its place.
pub const COMMON: &[(&str, PropType)] = &[
    ("hide", Is(C::Boolean)),
    ("anchorX", Is(C::Number)),
    ("anchorY", Is(C::Number)),
    // How a number shows (ADR 0058).
    ("displayDigits", Is(C::Integer)),
    ("displayDecimals", Is(C::Integer)),
    ("displaySmallAsZero", Is(C::Number)),
    ("padZeros", Is(C::Boolean)),
    ("avoidScientificNotation", Is(C::Boolean)),
    ("displayBlanks", Is(C::Boolean)),
    // Counts.
    ("numComponents", Is(C::Integer)),
    ("numVertices", Is(C::Integer)),
    ("numPoints", Is(C::Integer)),
    ("numDimensions", Is(C::Integer)),
    ("numRows", Is(C::Integer)),
    ("numColumns", Is(C::Integer)),
    ("numMinima", Is(C::Integer)),
    ("numMaxima", Is(C::Integer)),
    ("numExtrema", Is(C::Integer)),
    ("count", Is(C::Integer)),
    ("number", Is(C::Integer)),
    ("matrixSize", ListOf(C::Integer)),
    // A value's text, an expression.
    ("text", Is(C::Text)),
    ("expr", Is(C::Math)),
    // Whether a drag may move it (ADR 0070).
    ("draggable", Is(C::Boolean)),
    ("verticesDraggable", Is(C::Boolean)),
    ("endpointsDraggable", Is(C::Boolean)),
    // Whether a point's constraints moved it (ADR 0080).
    ("constraintUsed", Is(C::Boolean)),
    // A graph's view, a function's or a curve's range.
    ("xmin", Is(C::Number)),
    ("xmax", Is(C::Number)),
    ("ymin", Is(C::Number)),
    ("ymax", Is(C::Number)),
    ("xscale", Is(C::Number)),
    ("yscale", Is(C::Number)),
    // A function's.
    ("variable", Is(C::Math)),
    ("domainMin", Is(C::Number)),
    ("domainMax", Is(C::Number)),
    ("domainMinClosed", Is(C::Boolean)),
    ("domainMaxClosed", Is(C::Boolean)),
    ("minima", Is(C::Math)),
    ("maxima", Is(C::Math)),
    ("extrema", Is(C::Math)),
    ("globalMinimum", Is(C::Math)),
    ("globalInfimum", Is(C::Math)),
    ("globalMaximum", Is(C::Math)),
    ("globalSupremum", Is(C::Math)),
    // A renderer's run of sampled values, read together.
    ("curve", Code),
    ("samples", Code),
    ("samplesX", Code),
    // Coordinates and measures of a shape.
    ("x", Is(C::Number)),
    ("y", Is(C::Number)),
    ("x1", Is(C::Number)),
    ("y1", Is(C::Number)),
    ("x2", Is(C::Number)),
    ("y2", Is(C::Number)),
    ("x3", Is(C::Number)),
    ("y3", Is(C::Number)),
    ("cx", Is(C::Number)),
    ("cy", Is(C::Number)),
    ("coords", Is(C::Point)),
    ("center", Is(C::Point)),
    ("slope", Is(C::Number)),
    ("xintercept", Is(C::Number)),
    ("yintercept", Is(C::Number)),
    ("coeffvar1", Is(C::Number)),
    ("coeffvar2", Is(C::Number)),
    ("coeff0", Is(C::Number)),
    ("length", Is(C::Number)),
    ("area", Is(C::Number)),
    ("perimeter", Is(C::Number)),
    ("stable", Is(C::Boolean)),
    // Bounds an operator holds a value between.
    ("lowerValue", Is(C::Number)),
    ("upperValue", Is(C::Number)),
    // Scoring (ADR 0044's aggregates).
    ("credit", Is(C::Number)),
    ("weight", Is(C::Number)),
    ("creditAchieved", Is(C::Number)),
    ("percentCreditAchieved", Is(C::Number)),
    ("creditAchievedForProgress", Is(C::Number)),
    // Numbering and presentation of a division (ADR 0054).
    ("includeParentNumber", Is(C::Boolean)),
    ("aggregateScores", Is(C::Boolean)),
    ("asList", Is(C::Boolean)),
    ("open", Is(C::Boolean)),
    // A random draw's parameters.
    ("mean", Is(C::Number)),
    ("variance", Is(C::Number)),
    ("standardDeviation", Is(C::Number)),
    // An action's condition.
    ("triggerWhen", Is(C::Boolean)),
    // A matrix input's.
    ("prefill", Is(C::Math)),
    ("defaultEntry", Is(C::Math)),
    ("bound", Is(C::Math)),
];

/// The type of `name` in [`COMMON`].
fn common(name: &str) -> Option<PropType> {
    COMMON.iter().find(|(n, _)| *n == name).map(|&(_, t)| t)
}

impl ComponentType {
    /// The type of the prop `name` (any spelling a reference accepts): the
    /// type's own declaration, its list's, then [`COMMON`]'s. `None` for a
    /// name the type has no declaration of.
    pub fn prop_type(self, name: &str) -> Option<PropType> {
        let name = self.canonical_prop(name);
        if let Some(&(_, t)) = self.declared_props().iter().find(|(n, _)| *n == name) {
            return Some(t);
        }
        if let Some(list) = self.list() {
            let of_list = || match self.type_decl() {
                TypeDecl::ListOf(entry) => Some(ListOf(entry)),
                TypeDecl::ByElement => Some(ByElement),
                _ => None,
            };
            if list.names.contains(&name) {
                return of_list();
            }
            // An item (`vertex3`) is an entry of the list.
            if name
                .strip_prefix(list.item)
                .is_some_and(|k| !k.is_empty() && k.bytes().all(|b| b.is_ascii_digit()))
            {
                let names = list.names.iter();
                let declared = names
                    .filter_map(|n| self.declared_props().iter().find(|(d, _)| d == n))
                    .map(|&(_, t)| t)
                    .next();
                return match declared.or_else(of_list) {
                    Some(ListOf(entry)) => Some(Is(entry)),
                    Some(ByElement) => Some(ByElement),
                    _ => None,
                };
            }
        }
        common(name)
    }

    /// The types of the type's own props, where [`COMMON`] does not say or
    /// says otherwise.
    pub const fn declared_props(self) -> &'static [(&'static str, PropType)] {
        use ComponentType::*;
        match self {
            Document
            | P
            | ShortDescription
            | Error
            | Hint
            | Setup
            | StyleDefinition
            | StylePalette
            | StyleDefinitions
            | VariantControl
            | Title
            | Ref
            | List
            | ListItem
            | InlineMath
            | DisplayMath
            | MathRow
            | SideBySide
            | Stack
            | Tabular
            | Spreadsheet
            | Row
            | Cell
            | Legend
            | Em
            | Alert
            | Term
            | Q
            | Sq
            | C
            | Attr
            | Span
            | Tag
            | Tagc
            | Tage
            | Ndash
            | Mdash
            | Nbsp
            | Ellipsis
            | Lq
            | Rq
            | Lsq
            | Rsq
            | Br
            | Hr
            | Div
            | Pre
            | BlockQuote
            | Ol
            | Solution
            | Introduction
            | Conclusion
            | Statement
            | Figure
            | Caption
            | Footnote
            | PostponeRenderContainer
            | Table
            | SbsGroup
            | AsList
            | Latex
            | Pretext
            | Article
            | Book
            | AxisLabel
            | Page
            | CascadeMessage
            | Group
            | Select
            | RepeatFor
            | Collect
            | Point
            | Endpoint
            | EquilibriumPoint
            | ConstrainTo
            | ConstrainToGrid
            | AttractTo
            | AttractToGrid
            | ConstrainToGraph
            | ConstrainToInterior
            | BezierControls
            | ControlVectors => &[],
            Image => &[
                ("size", Is(Text)),
                ("width", Is(Number)),
                ("horizontalAlign", Is(Text)),
                ("displayMode", Is(Text)),
                ("decorative", Is(Boolean)),
                ("rotate", Is(Number)),
                ("source", Is(Text)),
                ("aspectRatio", Is(Number)),
            ],
            Video => &[
                ("size", Is(Text)),
                ("width", Is(Number)),
                ("horizontalAlign", Is(Text)),
                ("displayMode", Is(Text)),
                ("youtube", Is(Text)),
                ("source", Is(Text)),
            ],

            Graph => &[
                ("xScale", Is(Number)),
                ("yScale", Is(Number)),
                ("aspectRatio", Is(Number)),
            ],
            StickyGroup => &[
                ("threshold", Is(Number)),
                ("relativeToGraphScales", Is(Boolean)),
            ],
            Section => &[
                // Its tag's index among the section tags, which names its
                // title's word.
                ("label", Code),
                ("listItem", Is(Boolean)),
                ("sectionNumber", Is(Text)),
                ("title", Is(Text)),
                ("collapsible", Is(Boolean)),
                ("openState", Is(Boolean)),
                ("notCollapsible", Is(Boolean)),
            ],
            Aside => &[
                ("label", Code),
                ("collapsible", Is(Boolean)),
                ("openState", Is(Boolean)),
                ("notCollapsible", Is(Boolean)),
            ],
            Proof => &[
                ("collapsible", Is(Boolean)),
                ("openState", Is(Boolean)),
                ("notCollapsible", Is(Boolean)),
            ],
            Cascade => &[
                ("numCompleted", Is(Integer)),
                ("revealAll", Is(Boolean)),
                ("hideFutureSections", Is(Boolean)),
            ],
            Label => &[("value", Is(Text))],

            // The values.
            Number => &[("value", Is(Number))],
            Integer => &[("valuePreRound", Is(Number)), ("value", Is(Integer))],
            IntComma => &[("value", Is(Integer))],
            Math | Interval => &[("value", Is(Math))],
            Text => &[("value", Is(Text))],
            Boolean | When => &[("value", Is(Boolean))],
            Pluralize => &[("value", Is(Text)), ("basedOnNumber", Is(Number))],
            Evaluate => &[
                ("function", Is(Function)),
                ("input", Is(Math)),
                ("value", Is(Math)),
            ],
            ClampNumber => &[
                ("unclamped", Is(Number)),
                ("atLeastLower", Is(Number)),
                ("value", Is(Number)),
            ],
            WrapNumberPeriodic => &[("operand", Is(Number)), ("value", Is(Number))],
            Abs | Sign | Floor | Ceil => &[("operand", Is(Math)), ("value", Is(Math))],
            Round => &[
                ("operand", Is(Math)),
                ("numDecimals", Is(Integer)),
                ("numDigits", Is(Integer)),
                ("value", Is(Math)),
            ],
            SetSmallToZero => &[
                ("operand", Is(Math)),
                ("threshold", Is(Number)),
                ("value", Is(Math)),
            ],
            Sum | Product | Mean | Median | Min | Max | Mod | Gcd | Lcm | Count => {
                &[("value", Is(Math))]
            }
            Variance | StandardDeviation => &[("population", Is(Boolean)), ("value", Is(Math))],
            And | Or | Xor | Iff | Implies => &[("value", Is(Boolean))],
            Not => &[("operand", Is(Boolean)), ("value", Is(Boolean))],
            IsInteger => &[("operand", Is(Number)), ("value", Is(Boolean))],
            IsNumber => &[("operand", Is(Math)), ("value", Is(Boolean))],
            IsBetween => &[
                ("operand", Is(Number)),
                ("strict", Is(Boolean)),
                ("value", Is(Boolean)),
            ],
            ArgMin | ArgMax | IndexOf | SearchSorted => &[("value", Is(Integer))],
            Matrix => &[("value", Is(Math))],
            SubsetOfReals => &[
                ("value", Is(Math)),
                ("points", Is(Math)),
                ("pointsClosed", Is(Math)),
                ("intervals", Is(Math)),
                ("isolatedPoints", Is(Math)),
            ],
            // A math held as a tuple (ADR 0064 §1).
            Tuple => &[
                ("n", Is(Integer)),
                ("x4", Is(Number)),
                ("x5", Is(Number)),
                ("x6", Is(Number)),
                ("x7", Is(Number)),
                ("x8", Is(Number)),
                ("coords", Is(Math)),
            ],
            MathValue => &[("value", Is(Math))],
            OverValueMathList | OverValueNumberList | OverValuePointList => &[("value", Is(Math))],

            // The inputs.
            NumberInput => &[("value", Is(Number))],
            Slider => &[
                ("from", Is(Number)),
                ("to", Is(Number)),
                ("step", Is(Number)),
                ("preliminaryValue", Is(Number)),
                ("span", Is(Number)),
                ("spanSteps", Is(Number)),
                ("spanStepsEps", Is(Number)),
                ("maxIndex", Is(Integer)),
                ("offset", Is(Number)),
                ("rawIndex", Is(Number)),
                ("roundedIndex", Is(Integer)),
                ("nonNegIndex", Is(Integer)),
                ("clampedIndex", Is(Integer)),
                ("index", Is(Integer)),
                ("scaled", Is(Number)),
                ("value", Is(Number)),
            ],
            BooleanInput => &[("value", Is(Boolean))],
            TextInput => &[("value", Is(Text))],
            MathInput | MatrixInputCell | FractionInputPart => &[("value", Is(Math))],
            FractionInput => &[
                ("value", Is(Math)),
                ("numerator", Is(Math)),
                ("denominator", Is(Math)),
            ],
            MatrixInput | BoundMatrixInput => &[("value", Is(Math))],
            MatrixInputRow => &[],
            BoundMatrixInputRow => &[("rowIndex", Is(Integer))],
            ChoiceInput => &[
                ("choiceOrder", ListOf(Integer)),
                ("preliminaryIndex", Is(Integer)),
                ("selectedIndex", Is(Integer)),
                ("selectedChoice", Is(Integer)),
                ("selectedValue", Is(Text)),
            ],
            Choice => &[("selected", Is(Boolean))],
            Angle => &[
                ("radians", Is(Math)),
                ("degrees", Is(Math)),
                ("radiansExpr", Is(Math)),
                ("degreesExpr", Is(Math)),
                ("points", ListOf(Point)),
            ],

            // Answers and actions.
            Answer => &[
                // What the answer's input decides (D55).
                ("response", ByElement),
                ("correct", ByElement),
                ("submitted", ByElement),
                ("numSubmissions", Is(Integer)),
            ],
            Response => &[
                ("response", ByElement),
                ("submitted", ByElement),
                ("value", ByElement),
            ],
            Award => &[("awarded", Is(Boolean))],
            UpdateValue => &[
                // The reference it writes, and a value of its type (D54).
                ("target", Code),
                ("newValue", ByElement),
            ],
            TriggerSet | CallAction => &[],

            // Shapes.
            Circle => &[
                ("radius", Is(Number)),
                ("diameter", Is(Number)),
                ("circumference", Is(Number)),
                ("centerX", Is(Number)),
                ("centerY", Is(Number)),
                ("numThroughPoints", Is(Integer)),
                ("numericalCenter", Is(Point)),
                ("throughPoints", ListOf(Point)),
            ],
            BestFitLine => &[("points", ListOf(Point))],
            Line | EquilibriumLine => &[
                ("basedOnDirection", Is(Boolean)),
                ("points", ListOf(Point)),
                ("endpoints", ListOf(Point)),
            ],
            LineSegment => &[
                ("mx", Is(Number)),
                ("my", Is(Number)),
                ("basedOnSlopeOrMidpoint", Is(Boolean)),
                ("midpoint", Is(Point)),
                ("endpoint1", Is(Point)),
                ("endpoint2", Is(Point)),
                ("points", ListOf(Point)),
                ("endpoints", ListOf(Point)),
            ],
            Ray => &[
                ("endpointX", Is(Number)),
                ("endpointY", Is(Number)),
                ("throughX", Is(Number)),
                ("throughY", Is(Number)),
                ("directionX", Is(Number)),
                ("directionY", Is(Number)),
                ("endpoint", Is(Point)),
                ("through", Is(Point)),
                ("direction", Is(Vector)),
            ],
            Vector => &[
                // What a drag may move (ADR 0070).
                ("headDraggable", Is(Boolean)),
                ("tailDraggable", Is(Boolean)),
                ("tailX", Is(Number)),
                ("tailY", Is(Number)),
                ("headX", Is(Number)),
                ("headY", Is(Number)),
                ("magnitude", Is(Number)),
                ("tail", Is(Point)),
                ("head", Is(Point)),
                ("displacement", Is(Vector)),
            ],
            Polygon | Polyline | Triangle => &[("vertices", ListOf(Point))],
            // Its vertices are the iterations' points (ADR 0075).
            PolylineOverIterations | PolygonOverIterations => &[],
            Rectangle => &[
                ("width", Is(Number)),
                ("height", Is(Number)),
                ("vertices", ListOf(Point)),
            ],
            RegularPolygon => &[
                ("circumradius", Is(Number)),
                ("inradius", Is(Number)),
                ("sideLength", Is(Number)),
                ("vertices", ListOf(Point)),
            ],
            Parabola => &[
                ("a", Is(Number)),
                ("b", Is(Number)),
                ("c", Is(Number)),
                ("vertexX", Is(Number)),
                ("vertexY", Is(Number)),
                ("vertex", Is(Point)),
            ],
            Curve | EquilibriumCurve => &[
                // 0, 1 or 2 for a function's graph, a parametric curve or a
                // Bézier spline, which the current core reads as a text.
                ("curveType", Code),
                ("parMin", Is(Number)),
                ("parMax", Is(Number)),
                ("parametric", Is(Boolean)),
                ("throughPoints", ListOf(Point)),
                ("through", ListOf(Point)),
            ],
            PointListEntry => &[],
            ClampFunction | WrapFunctionPeriodic | PiecewiseFunction => &[],
            Function | Derivative => &[
                // An interpolated function's pieces as one value, for a
                // reader.
                ("pieces", Code),
                // How it evaluates (ADR 0081).
                ("symbolic", Is(Boolean)),
                ("symbolicExpr", Code),
                ("substitutePost", Code),
                ("evalExpr", Code),
                ("numInputs", Is(Integer)),
                ("numOutputs", Is(Integer)),
                ("variablesExpr", Code),
                ("multiExpr", Code),
                ("domainsExpr", Code),
            ],

            // Lists and structure.
            ConditionalContent => &[("choice", Is(Integer))],
            Case => &[("active", Is(Boolean))],
            RepeatForSequence => &[
                ("from", Is(Number)),
                ("to", Is(Number)),
                ("step", Is(Number)),
                ("maxNumber", Is(Integer)),
                ("span", Is(Number)),
                ("spanSteps", Is(Number)),
                ("spanStepsEps", Is(Number)),
                ("lengthFromTo", Is(Integer)),
                ("lengthFloor", Is(Integer)),
                ("lengthNonNeg", Is(Integer)),
            ],
            FunctionIterates => &[
                ("numIterates", Is(Integer)),
                ("numIteratesFloor", Is(Integer)),
                ("numIteratesClamped", Is(Integer)),
                // The lengths of the current core's lists of iterates.
                ("iterates", Code),
                ("allIteratesWithInitial", Code),
            ],
            StructuralSequence | StructuralLetterSequence => &[
                // Numbers, letters or maths, by its `type` (ADR 0074).
                ("from", ByElement),
                ("step", ByElement),
                ("exclude1", ByElement),
                ("exclude2", ByElement),
                ("exclude3", ByElement),
                ("exclude4", ByElement),
                ("exclude5", ByElement),
                ("exclude6", ByElement),
                ("exclude7", ByElement),
                ("exclude8", ByElement),
                ("exclude9", ByElement),
                ("exclude10", ByElement),
                ("lowercase", Is(Boolean)),
            ],
            SelectFromSequence => &[("value", ByElement)],
            // The order its items are shown in (ADR 0053).
            Sort | Shuffle => &[("componentOrder", ListOf(Integer))],
            // Which of its entries are past its live length (ADR 0041).
            Intersection => &[("hidden", ListOf(Boolean))],
            Sequence | NumberList | TextList | BooleanList | MathList | PointList
            | CumulativeSum | CumulativeProduct | CumulativeMin | CumulativeMax | Differences
            | SelectPrimeNumbers | SamplePrimeNumbers | IntervalList | MatrixRow | MatrixColumn => {
                &[]
            }
            SortIndices | BinCounts => &[],
            // What it counts into, of its `type` (ADR 0078).
            Tally => &[("categories", ByElement)],
            SampleMultivariateRandomNumber => &[
                ("numCategories", Is(Integer)),
                ("numTotal", Is(Integer)),
                ("numDraws", Is(Integer)),
            ],
            SummaryStatistics => &[
                ("stdev", Is(Number)),
                ("stderr", Is(Number)),
                ("minimum", Is(Number)),
                ("quartile1", Is(Number)),
                ("median", Is(Number)),
                ("quartile3", Is(Number)),
                ("maximum", Is(Number)),
                ("range", Is(Number)),
                ("sum", Is(Number)),
                // Which statistics it shows, as bits.
                ("statisticsShown", Code),
            ],
            // The parameters of the distribution it draws from, those it
            // has (ADR 0079).
            SelectRandomNumbers | SampleRandomNumbers => &[
                ("logMean", Is(Number)),
                ("logStandardDeviation", Is(Number)),
                ("logVariance", Is(Number)),
                ("numTotal", Is(Integer)),
                ("numSuccesses", Is(Integer)),
                ("numDraws", Is(Integer)),
                ("numTrials", Is(Integer)),
                ("probability", Is(Number)),
            ],

            #[cfg(test)]
            TestValue => &[("value", Is(Number)), ("double", Is(Number))],
            #[cfg(test)]
            TestShape => &[("a", Is(Number)), ("b", Is(Number)), ("sum", Is(Number))],
            #[cfg(test)]
            TestList => &[("points", ListOf(Point))],
        }
    }
}

impl PropType {
    /// The type of `[k]` on a value of this type (ADR 0076 §6): an entry of
    /// a list; a coordinate of a point or a vector; an entry of a math,
    /// itself a math. `None` for a type with no entries (a scalar index is
    /// an error at load, D75).
    pub fn entry(self) -> Option<PropType> {
        match self {
            ListOf(t) => Some(Is(t)),
            ByElement => Some(ByElement),
            Code => None,
            Is(t) if super::is_a(t, C::Point) || super::is_a(t, C::Vector) => Some(Is(C::Number)),
            Is(t) if super::is_a(t, C::Math) && !super::is_a(t, C::Number) => Some(Is(C::Math)),
            Is(_) => None,
        }
    }

    /// Whether planning's reading of a reference of this type
    /// (`ValueKind`, read off how the prop is held) is one the type allows
    /// (ADR 0076 §9): a text held as text; a math, a number or a boolean
    /// in a number cell or as an expression; a point or a vector as its
    /// coordinates; a list as a list. A code, and a type the element
    /// decides, may be held as anything.
    pub(crate) fn allows(self, kind: crate::compile::api::ValueKind) -> bool {
        use super::is_a;
        use crate::compile::api::ValueKind as K;
        match self {
            Code | ByElement => true,
            ListOf(_) => matches!(kind, K::List | K::Point),
            Is(t) => match kind {
                K::Text => is_a(t, C::Text),
                K::Boolean => is_a(t, C::Boolean),
                K::Math => is_a(t, C::Math),
                // A number cell: a number, a math held as one, a boolean
                // held as 0 or 1.
                K::Number => is_a(t, C::Math) || is_a(t, C::Boolean),
                K::Point => is_a(t, C::Point) || is_a(t, C::Vector),
                K::List => false,
            },
        }
    }
}

impl crate::components::EntryKind {
    /// The type of an entry of this kind, when the kind is one type.
    pub fn author_type(self) -> Option<PropType> {
        use crate::components::EntryKind as E;
        match self {
            E::Number => Some(Is(C::Number)),
            E::Text => Some(Is(C::Text)),
            E::Boolean => Some(Is(C::Boolean)),
            E::Math => Some(Is(C::Math)),
            E::Point => Some(Is(C::Point)),
            E::Any => None,
        }
    }
}

impl ComponentType {
    /// The type of the prop `sel` selects on the type: by its name, or a
    /// coordinate of an item of its list.
    pub fn sel_type(self, sel: crate::components::PropSel) -> Option<PropType> {
        use crate::components::{PropAt, PropSel};
        match sel {
            PropSel::At(PropAt::Coord(..)) => Some(Is(C::Number)),
            _ => self.prop_type(&self.sel_name(sel)),
        }
    }
}

impl PropType {
    /// What planning reads a reference of this type as (`ValueKind`), from
    /// the type alone (ADR 0076, Migration step 5): a text, a boolean, a
    /// point or vector's coordinates, a number, a math, a list. `None` for
    /// an object, and for a type the element decides.
    pub(crate) fn value_kind(self) -> Option<crate::compile::api::ValueKind> {
        use super::is_a;
        use crate::compile::api::ValueKind as K;
        match self {
            Is(t) if is_a(t, C::Text) => Some(K::Text),
            Is(t) if is_a(t, C::Boolean) => Some(K::Boolean),
            Is(t) if is_a(t, C::Point) || is_a(t, C::Vector) => Some(K::Point),
            Is(t) if is_a(t, C::Number) => Some(K::Number),
            Is(t) if is_a(t, C::Math) => Some(K::Math),
            Is(_) | ByElement => None,
            ListOf(_) => Some(K::List),
            Code => Some(K::Number),
        }
    }
}

impl PropType {
    /// Whether a value of this type is held as a string id (ADR 0076 §9,
    /// each type's representations): `Some(true)` for a text,
    /// `Some(false)` for every other type an author names, `None` for a
    /// code or a type the element decides, which may be held either way.
    pub fn held_as_text(self) -> Option<bool> {
        match self {
            Is(t) => Some(super::is_a(t, C::Text)),
            ListOf(t) => Some(super::is_a(t, C::Text)),
            ByElement | Code => None,
        }
    }
}

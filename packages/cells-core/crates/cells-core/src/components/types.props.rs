//! Each prop's author type (ADR 0076 §7): what `$x.prop` is, in words an
//! author would use, declared for every single-cell prop, combined prop
//! (`coords`) and list prop (`vertices`) of every type.
//!
//! A name that means one thing on every type (`hide`, `anchorX`,
//! `numComponents`) is declared once, in [`COMMON`]; the rest per type, in
//! one exhaustive match ([`ComponentType::declared_props`]). A list type's
//! list and its items are typed by its [`TypeDecl::ListOf`]. Like the type
//! declarations, these sit beside today's flags (`PropDef::text`,
//! `expr_of`, [`TextKind`](super::TextKind), ...) until planners read them.

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
            | Proof
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

            Graph => &[],
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
            ],
            Aside => &[("label", Code)],
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
                ("preliminaryIndex", Is(Integer)),
                ("selectedIndex", Is(Integer)),
            ],
            Choice => &[],
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
            Sequence | Sort | Shuffle | NumberList | TextList | BooleanList | MathList
            | PointList | CumulativeSum | CumulativeProduct | CumulativeMin | CumulativeMax
            | Differences | SelectRandomNumbers | SampleRandomNumbers | SelectPrimeNumbers
            | SamplePrimeNumbers | Intersection | IntervalList | MatrixRow | MatrixColumn
            | SortIndices | BinCounts | Tally => &[],
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

            #[cfg(test)]
            TestValue => &[("value", Is(Number)), ("double", Is(Number))],
            #[cfg(test)]
            TestShape => &[("a", Is(Number)), ("b", Is(Number)), ("sum", Is(Number))],
            #[cfg(test)]
            TestList => &[("points", ListOf(Point))],
        }
    }
}

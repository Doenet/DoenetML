//! Author types (ADR 0076): what a component, an entry or a reference *is*,
//! in words an author would use ("a text", "a point", "a list of maths"),
//! and the three relations that let a value of one type be used as another.
//!
//! Each component type declares its type here ([`ComponentType::type_decl`],
//! one exhaustive match, so a new component type does not compile without
//! one), and [`fit`] is the one judgment of a value of one type where
//! another is wanted. Nothing reads either yet: they sit beside the flags
//! they replace (`reads_as`, `extends_as`, `extend_reads`,
//! `input_from_value`, [`EntryKind`](crate::components::EntryKind), [`TextKind`](crate::components::TextKind), [`ResponseKind`](crate::components::ResponseKind)), and
//! this module's tests hold the two in agreement (ADR 0076, Migration steps
//! 1 and 2). Anything finer the core knows about a value (its
//! representation, whether it is numeric now, how many entries it has) is
//! a refinement, never a type (ADR 0076 §9).

use super::ComponentType;

/// The three kinds of type (D46).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TypeKind {
    /// A math, a number, an integer, a text or a boolean, or a type that
    /// *is a* one of them (a `<sum>` is a math).
    Value,
    /// A point, a line, a function, an answer, an input: a thing with
    /// props, which may stand in as one of them.
    Object,
    /// A paragraph, a section, markup: everything a document shows that is
    /// neither. All content is one type.
    Content,
}

/// What a type is to an author, as one exhaustive declaration per component
/// type ([`ComponentType::type_decl`]).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TypeDecl {
    /// A type named by its tag: a value, an object or content, with its
    /// relations to other types.
    Named(Typing),
    /// A list of entries of a type: a `<numberList>` is a list of numbers.
    ListOf(ComponentType),
    /// Another type's element, as the author wrote it: a math list whose
    /// count follows a math value (ADR 0063) is a `<mathList>`, a math the
    /// core holds as a tuple is a `<math>`.
    Presents(ComponentType),
    /// Typed from what is written in the element, not from its tag: a
    /// composite from its contents (ADR 0076 §5), a `<sequence>` by its
    /// `type`, a `<sort>` by its items, an answer's response by its input.
    ByElement,
}

/// A type named by its tag: its kind and its relations (ADR 0076 §3).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Typing {
    /// Value, object or content.
    pub kind: TypeKind,
    /// The types it *is a*, directly: an integer is a number. The relation
    /// is transitive.
    pub is_a: &'static [ComponentType],
    /// The prop it presents when a value is wanted, if any.
    pub stands_in: Option<StandsIn>,
    /// The types a different value may be made of it as, each with whether
    /// the conversion runs backward.
    pub converts_to: &'static [Converts],
}

impl Typing {
    /// A type with no relations of its own.
    const fn of(kind: TypeKind) -> Self {
        Typing {
            kind,
            is_a: &[],
            stands_in: None,
            converts_to: &[],
        }
    }

    /// A type that *is a* those.
    const fn is_a(mut self, is_a: &'static [ComponentType]) -> Self {
        self.is_a = is_a;
        self
    }

    /// A type that stands in as one of its props.
    const fn stands_in(mut self, stands_in: StandsIn) -> Self {
        self.stands_in = Some(stands_in);
        self
    }

    /// A type that converts to those.
    const fn converts_to(mut self, converts_to: &'static [Converts]) -> Self {
        self.converts_to = converts_to;
        self
    }
}

/// How a type presents one prop of itself when a value is wanted (D69).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StandsIn {
    /// It *is* its value (an input, an `<angle>`): it stands in as `ty`,
    /// and may then convert as `ty` does (`<number extend="$mi"/>`).
    IsItsValue {
        /// The prop read.
        prop: &'static str,
        /// What the prop is.
        ty: ComponentType,
    },
    /// It *has* a value to show (a line's equation, a label's text): it
    /// stands in as `ty` and nothing further (`<text extend="$line"/>` is a
    /// mismatch).
    Shows {
        /// The prop read.
        prop: &'static str,
        /// What the prop is.
        ty: ComponentType,
    },
}

impl StandsIn {
    /// The prop read.
    pub const fn prop(self) -> &'static str {
        match self {
            StandsIn::IsItsValue { prop, .. } | StandsIn::Shows { prop, .. } => prop,
        }
    }

    /// What the prop is.
    pub const fn ty(self) -> ComponentType {
        match self {
            StandsIn::IsItsValue { ty, .. } | StandsIn::Shows { ty, .. } => ty,
        }
    }
}

/// One declared conversion: to a type, and whether a change of the result
/// is written back (`<point extend="$v"/>` drags `v`; a text shown from a
/// number is not written back).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Converts {
    /// The type made.
    pub to: ComponentType,
    /// Whether the conversion runs backward.
    pub backward: bool,
}

/// A conversion both ways.
const fn both(to: ComponentType) -> Converts {
    Converts { to, backward: true }
}

/// A conversion one way.
const fn one_way(to: ComponentType) -> Converts {
    Converts {
        to,
        backward: false,
    }
}

/// A type as an author can say it (ADR 0076 §2).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AuthorType {
    /// A component type, named by its tag (content all one type).
    Tag(ComponentType),
    /// Any number of entries, each of this type.
    List(ComponentType),
    /// A fixed number of entries with a type for each position.
    Tuple(&'static [ComponentType]),
}

impl AuthorType {
    /// The author type of a component type's element, from its tag alone:
    /// `None` for one typed by what is written in it
    /// ([`TypeDecl::ByElement`]).
    pub fn of(ty: ComponentType) -> Option<AuthorType> {
        match ty.type_decl() {
            TypeDecl::Named(_) => Some(AuthorType::Tag(ty)),
            TypeDecl::ListOf(entry) => Some(AuthorType::List(entry)),
            TypeDecl::Presents(other) => AuthorType::of(other),
            TypeDecl::ByElement => None,
        }
    }

    /// A tuple whose positions all agree is a list of that type (ADR 0076
    /// §2).
    fn normalized(self) -> AuthorType {
        match self {
            AuthorType::Tuple([first, rest @ ..]) if rest.iter().all(|t| t == first) => {
                AuthorType::List(*first)
            }
            other => other,
        }
    }
}

/// The answer of [`fit`]: how a value of one type is used where another is
/// wanted (ADR 0076 §4).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Fit {
    /// It *is a* the wanted type: used unchanged.
    Same,
    /// It stands in as one of its props, which is then used unchanged or
    /// converted.
    StandsIn {
        /// The prop read.
        prop: &'static str,
        /// The conversion after it, if one is needed.
        then: Option<Conversion>,
    },
    /// A different value is made of it.
    Converts(Conversion),
    /// No chain connects the two: what that does is the place's kind, not
    /// the pair's.
    Mismatch,
}

/// A conversion [`fit`] chose: from a type (after any stand-in), to a type,
/// and whether it runs backward.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Conversion {
    /// The type converted from: the value's, or a type it *is a*.
    pub from: AuthorType,
    /// The type made: the wanted one, or one that *is a* it.
    pub to: AuthorType,
    /// Whether a change of the result is written back.
    pub backward: bool,
}

/// Whether `a` *is a* `b`: the same type, the same kind of content, or by
/// the declared relation, transitively.
pub fn is_a(a: ComponentType, b: ComponentType) -> bool {
    if a == b {
        return true;
    }
    match (a.typing(), b.typing()) {
        (Some(x), Some(y)) if x.kind == TypeKind::Content && y.kind == TypeKind::Content => true,
        (Some(x), _) => x.is_a.iter().any(|&s| is_a(s, b)),
        _ => false,
    }
}

/// `a` and every type it *is a*, nearest first.
fn supertypes(a: ComponentType) -> Vec<ComponentType> {
    let mut out = vec![a];
    let mut k = 0;
    while k < out.len() {
        if let Some(t) = out[k].typing() {
            for &s in t.is_a {
                if !out.contains(&s) {
                    out.push(s);
                }
            }
        }
        k += 1;
    }
    out
}

/// The one conversion from `have` to `want`, with *is a* free at either
/// end: from `have` or a type it is, to `want` or a type that is it.
/// One straight to `want` is chosen over one to a type that is it: a text
/// to a math is parsed as a math, not as a number.
fn convert(have: ComponentType, want: ComponentType) -> Option<Conversion> {
    let declared = || {
        supertypes(have).into_iter().flat_map(|from| {
            let all = from.typing().map_or(&[][..], |t| t.converts_to);
            all.iter().map(move |c| (from, *c))
        })
    };
    let (from, c) = declared()
        .find(|(_, c)| c.to == want)
        .or_else(|| declared().find(|(_, c)| is_a(c.to, want)))?;
    Some(Conversion {
        from: AuthorType::Tag(from),
        to: AuthorType::Tag(c.to),
        backward: c.backward,
    })
}

/// How a value of type `have` is used where `want` is wanted (ADR 0076 §3,
/// §4): unchanged when it *is a* `want`; else through the longest chain,
/// one *stands in as* then one *converts to*, each optional, with *is a*
/// free at either end; else a mismatch. A conversion never follows a
/// conversion, and nothing follows a stand-in that shows a value.
pub fn fit(have: AuthorType, want: AuthorType) -> Fit {
    match (have.normalized(), want.normalized()) {
        (AuthorType::Tag(h), AuthorType::Tag(w)) => fit_tags(h, w),
        (AuthorType::List(h), AuthorType::List(w)) if is_a(h, w) => Fit::Same,
        // A list from the matching scalar.
        (AuthorType::Tag(h), AuthorType::List(w)) => {
            let to_list = |from: ComponentType| Conversion {
                from: AuthorType::Tag(from),
                to: AuthorType::List(w),
                backward: true,
            };
            match fit_tags(h, w) {
                Fit::Same => Fit::Converts(to_list(h)),
                Fit::StandsIn { prop, then: None } => Fit::StandsIn {
                    prop,
                    then: h
                        .typing()
                        .and_then(|t| t.stands_in)
                        .map(|s| to_list(s.ty())),
                },
                _ => Fit::Mismatch,
            }
        }
        (AuthorType::Tuple(h), AuthorType::Tuple(w))
            if h.len() == w.len() && h.iter().zip(w).all(|(&a, &b)| is_a(a, b)) =>
        {
            Fit::Same
        }
        _ => Fit::Mismatch,
    }
}

/// [`fit`] between two types named by their tags.
fn fit_tags(have: ComponentType, want: ComponentType) -> Fit {
    if is_a(have, want) {
        return Fit::Same;
    }
    let Some(typing) = have.typing() else {
        return Fit::Mismatch;
    };
    let stand_in = typing.stands_in;
    if let Some(s) = stand_in
        && is_a(s.ty(), want)
    {
        return Fit::StandsIn {
            prop: s.prop(),
            then: None,
        };
    }
    if let Some(c) = convert(have, want) {
        return Fit::Converts(c);
    }
    match stand_in {
        Some(StandsIn::IsItsValue { prop, ty }) => match convert(ty, want) {
            Some(c) => Fit::StandsIn {
                prop,
                then: Some(c),
            },
            None => Fit::Mismatch,
        },
        _ => Fit::Mismatch,
    }
}

impl ComponentType {
    /// What the type is to an author (ADR 0076 §7), declared for every
    /// type.
    pub const fn type_decl(self) -> TypeDecl {
        use ComponentType::*;
        use TypeDecl::*;
        use TypeKind::*;
        const fn value(is_a: &'static [ComponentType]) -> TypeDecl {
            Named(Typing::of(Value).is_a(is_a))
        }
        const fn object() -> TypeDecl {
            Named(Typing::of(Object))
        }
        const fn object_is(is_a: &'static [ComponentType]) -> TypeDecl {
            Named(Typing::of(Object).is_a(is_a))
        }
        /// An input, which *is* its value (D69).
        const fn input(prop: &'static str, ty: ComponentType) -> TypeDecl {
            Named(Typing::of(Object).stands_in(StandsIn::IsItsValue { prop, ty }))
        }
        // REF-5's pairs, each declared by the type converted from.
        const MATH: &[Converts] = &[both(Number), one_way(Text), both(Point), both(Vector)];
        const SHOWN: &[Converts] = &[one_way(Text)];
        const PARSED: &[Converts] = &[one_way(Number), one_way(Math)];
        const POINT: &[Converts] = &[both(Vector), both(Math)];
        const VECTOR: &[Converts] = &[both(Point), both(Math)];
        match self {
            // The five value types (D46), and REF-5's pairs among them: math,
            // number and text among each other, text from a boolean. A
            // boolean and a number, and a text and a boolean, are not a
            // pair (D47, D68).
            Math => Named(Typing::of(Value).converts_to(MATH)),
            // A number is a math (ADR 0076, Departures 1).
            Number => Named(Typing::of(Value).is_a(&[Math]).converts_to(SHOWN)),
            Integer => value(&[Number]),
            Text => Named(Typing::of(Value).converts_to(PARSED)),
            Boolean => Named(Typing::of(Value).converts_to(SHOWN)),

            // Values of those types, as an operator or a format makes them.
            Evaluate | Abs | Sign | Floor | Ceil | Round | SetSmallToZero | Sum | Product
            | Mean | Median | Min | Max | Mod | Gcd | Lcm | Count | Variance
            | StandardDeviation | Matrix | Interval | SubsetOfReals => value(&[Math]),
            ClampNumber | WrapNumberPeriodic => value(&[Number]),
            // An index is an integer.
            ArgMin | ArgMax | IndexOf | SearchSorted => value(&[Integer]),
            IntComma => value(&[Integer]),
            Pluralize => value(&[Text]),
            And | Or | Xor | Iff | Implies | Not | IsInteger | IsNumber | IsBetween | When => {
                value(&[Boolean])
            }

            // Inputs, each its value (REF-1a, D69); an input is not made from
            // a value (`doenet-e0062`), so none declares a conversion.
            NumberInput | Slider => input("value", Number),
            BooleanInput => input("value", Boolean),
            TextInput => input("value", Text),
            MathInput | FractionInput | MatrixInput => input("value", Math),
            // An angle is its measure (D69 decision 3).
            Angle => input("radians", Math),

            // Points and vectors, among each other and with a math
            // (REF-5).
            Point => Named(Typing::of(Object).converts_to(POINT)),
            Vector => Named(Typing::of(Object).converts_to(VECTOR)),
            Endpoint | EquilibriumPoint => object_is(&[Point]),

            BestFitLine | EquilibriumLine => object_is(&[Line]),
            Triangle | Rectangle | RegularPolygon => object_is(&[Polygon]),
            EquilibriumCurve => object_is(&[Curve]),
            Derivative | ClampFunction | WrapFunctionPeriodic | PiecewiseFunction => {
                object_is(&[Function])
            }
            // A line has its equation to show (D69), once it has an
            // `equation` prop to show it from.
            Line | Circle | LineSegment | Polygon | Polyline | Ray | Parabola | Curve
            | Function | Answer | Award | UpdateValue | CallAction | TriggerSet | ChoiceInput
            | Choice | ConstrainTo | ConstrainToGrid | AttractTo | AttractToGrid
            | ConstrainToGraph | ConstrainToInterior | BezierControls | ControlVectors
            | FractionInputPart | MatrixInputRow | BoundMatrixInputRow | MatrixInputCell
            | SummaryStatistics => object(),

            // Lists (ADR 0041).
            NumberList
            | SelectRandomNumbers
            | SampleRandomNumbers
            | SelectPrimeNumbers
            | SamplePrimeNumbers
            | SampleMultivariateRandomNumber => ListOf(Number),
            MathList | CumulativeSum | CumulativeProduct | CumulativeMin | CumulativeMax
            | Differences | MatrixRow | MatrixColumn => ListOf(Math),
            TextList => ListOf(Text),
            BooleanList => ListOf(Boolean),
            PointList | Intersection => ListOf(Point),
            IntervalList => ListOf(Interval),
            // Indices and counts (ADR 0078).
            SortIndices | Tally | BinCounts => ListOf(Integer),

            // What the core makes of an element the author named otherwise.
            MathValue | Tuple => Presents(Math),
            PointListEntry => Presents(Point),
            OverValueMathList => Presents(MathList),
            OverValueNumberList => Presents(NumberList),
            OverValuePointList => Presents(PointList),
            PolylineOverIterations => Presents(Polyline),
            PolygonOverIterations => Presents(Polygon),
            BoundMatrixInput => Presents(MatrixInput),
            StructuralSequence | StructuralLetterSequence => Presents(Sequence),

            // Typed from what is written in it.
            Group | Select | ConditionalContent | Case | Collect | RepeatFor
            | RepeatForSequence | FunctionIterates | Sequence | SelectFromSequence | Sort
            | Shuffle | Response => ByElement,

            // A label has its text to show (D69).
            Label => Named(Typing::of(Content).stands_in(StandsIn::Shows {
                prop: "value",
                ty: Text,
            })),
            Document
            | Graph
            | P
            | ShortDescription
            | Error
            | Hint
            | Setup
            | VariantControl
            | StickyGroup
            | Section
            | Title
            | Ref
            | List
            | ListItem
            | InlineMath
            | DisplayMath
            | MathRow
            | Aside
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
            | Cascade
            | CascadeMessage
            | Image
            | Video => TypeDecl::Named(Typing::of(Content)),

            #[cfg(test)]
            TestValue | TestShape | TestList => object(),
        }
    }

    /// The type's relations, for a type named by its tag.
    pub const fn typing(self) -> Option<Typing> {
        match self.type_decl() {
            TypeDecl::Named(t) => Some(t),
            _ => None,
        }
    }
}

#[path = "types.props.rs"]
mod props;
pub use props::{COMMON, PropType};

#[path = "types.places.rs"]
mod places;
pub use places::{OVERRIDES, Place, Want};

#[path = "types.export.rs"]
mod export;
pub use export::export;

#[cfg(test)]
#[path = "types.test.rs"]
mod tests;

/// The type of a composite whose branches may be any of `types` (ADR 0076
/// §5): the one type every branch *is a*, if there is one. A number beside
/// a math is a math; a point beside a vector is no type, though each
/// converts to the other.
pub fn join(types: &[ComponentType]) -> Option<ComponentType> {
    let (&first, rest) = types.split_first()?;
    supertypes(first)
        .into_iter()
        .find(|&s| rest.iter().all(|&t| is_a(t, s)))
}

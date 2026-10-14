//! Which planner each component type's elements go to. The match has no
//! catch-all arm, so a type added to `component_types!` does not compile
//! until it is given one here.

use super::*;

/// Adjusts the props `plan_attrs` planned, from the element.
pub(super) type PropsFn<'a> =
    fn(&mut Compiler<'a>, NodeId, &mut [Option<SourcePlan>]) -> Result<()>;
/// Plans a geometric element, given the node of the element it extends.
pub(super) type GeoFn<'a> =
    fn(&mut Compiler<'a>, TemplateId, ElemId, Option<NodeId>) -> Result<ElemPlan>;
/// Plans the whole element.
pub(super) type WholeFn<'a> = fn(&mut Compiler<'a>, TemplateId, ElemId) -> Result<()>;

/// How an element is planned once the cases that do not depend on its type
/// (clones, synthesized elements, `extend` of a prop or of a container) are
/// ruled out.
pub(super) enum Planner<'a> {
    /// From the type's prop table (`plan_attrs`).
    Props,
    /// From the prop table, then adjusted by the function.
    PropsThen(PropsFn<'a>),
    /// By the function, inside `plan_geo`'s shared handling of `extend`.
    Geometric(GeoFn<'a>),
    /// By the function alone.
    Whole(WholeFn<'a>),
}

impl<'a> Compiler<'a> {
    pub(super) fn planner(component_type: ComponentType) -> Planner<'a> {
        use ComponentType as K;
        use Planner::*;
        match component_type {
            // Containers
            K::Document => Props,
            K::Graph => Props,
            K::P => Props,
            K::Setup => Props,
            K::Group => Props,
            K::StickyGroup => Props,
            K::Section => PropsThen(Self::plan_section_flags),
            K::Title => Props,
            K::Ref => Props,
            K::List => Props,
            K::ListItem => Props,
            K::InlineMath => Props,
            K::DisplayMath => Props,
            K::MathRow => Props,
            K::Aside => Props,
            K::SideBySide => Props,
            K::Stack => Props,
            K::Tabular => Props,
            K::Spreadsheet => Props,
            K::Row => Props,
            K::Cell => Props,
            K::Legend => Props,
            K::TriggerSet => Props,
            // Geometry
            K::Point => Geometric(Self::plan_point),
            K::Circle => Geometric(Self::plan_circle),
            K::Line => Geometric(Self::plan_line),
            K::LineSegment => Geometric(Self::plan_segment),
            K::Polygon => Geometric(Self::plan_polygon),
            K::PointList => Whole(Self::reject_point_list),
            K::Polyline => Whole(Self::plan_polyline),
            // Inputs
            K::NumberInput => Props,
            K::BooleanInput => Props,
            K::MathInput => PropsThen(Self::plan_math_input),
            K::Slider => Props,
            K::UpdateValue => Props,
            // Values
            K::Number => Props,
            K::ClampNumber => Props,
            K::Tuple => Whole(Self::reject_tuple),
            K::Text => Whole(Self::plan_text_elem),
            K::Op => Props,
            K::Math => Whole(Self::plan_math_elem),
            K::Evaluate => Props,
            K::Function => Whole(Self::plan_symbolic),
            K::Derivative => Whole(Self::plan_symbolic),
            K::Answer => Whole(Self::plan_symbolic),
            // Structure
            K::RepeatForSequence => Props,
            K::RepeatFor => Whole(Self::plan_repeat_for),
            K::FunctionIterates => Whole(Self::plan_function_iterates),
            K::SequenceValue => Props,
            K::Collect => Whole(Self::plan_collect),
            K::ConditionalContent => Whole(Self::plan_choice_elem),
            K::Case => Props,
            K::Select => Whole(Self::plan_choice_elem),
        }
    }

    /// A `<pointList>` only exists as `extend="$shape.points"`, which
    /// `elem_shape` takes before asking for a planner.
    fn reject_point_list(&mut self, _: TemplateId, _: ElemId) -> Result<()> {
        Err(Error::BadValue {
            attr: "extend".into(),
            text: "<pointList> needs extend=\"$shape.points\"".into(),
        })
    }

    /// A tuple is made from a `<math>` or by the builder, never by a tag.
    fn reject_tuple(&mut self, _: TemplateId, _: ElemId) -> Result<()> {
        Err(Error::Unsupported("extending a tuple".into()))
    }

    /// A `<text>` that extends another is planned from its prop table.
    fn plan_text_elem(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        match self.compiled.templates[t].elems[e].extend {
            Some(p) => self.plan_attrs(t, e, Some(p)),
            None => self.plan_text(t, e),
        }
    }

    /// A choice cannot be extended: its interface names are referenced
    /// instead.
    fn plan_choice_elem(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let elem = &self.compiled.templates[t].elems[e];
        if elem.extend.is_some() {
            return Err(Error::Banned(format!(
                "extend on a <{}>: reference its interface names instead",
                elem.component_type.tag()
            )));
        }
        self.plan_choice(t, e)
    }
}

//! Which planner each component type's elements go to. The match has no
//! catch-all arm, so a type added to `component_types!` does not compile
//! until it is given one here.

use super::*;
use crate::components::{containers, geometry, inputs, structure, values};
use ctx::PlanCtx;

/// Adjusts the props `plan_attrs` planned from the table.
pub(crate) type PropsFn =
    for<'c, 'a> fn(&mut PlanCtx<'c, 'a>, &mut [Option<SourcePlan>]) -> Result<()>;
/// Plans a geometric element, its attributes merged over those of the
/// element it extends.
pub(crate) type GeoFn = for<'c, 'a> fn(&mut PlanCtx<'c, 'a>) -> Result<ElemPlan>;
/// Plans the whole element.
pub(crate) type WholeFn = for<'c, 'a> fn(&mut PlanCtx<'c, 'a>) -> Result<()>;

/// How an element is planned once the cases that do not depend on its type
/// (clones, synthesized elements, `extend` of a prop or of a container) are
/// ruled out. Every planner but `Props` is a function in the type's file
/// under `components/` (ADR 0016).
#[derive(Debug, Clone, Copy)]
pub(crate) enum Planner {
    /// From the type's prop table (`plan_attrs`).
    Props,
    /// From the prop table, then adjusted by the function.
    PropsThen(PropsFn),
    /// By the function, inside `plan_geo`'s shared handling of `extend`.
    Geometric(GeoFn),
    /// By the function alone.
    Whole(WholeFn),
}

impl<'a> Compiler<'a> {
    pub(super) fn planner(component_type: ComponentType) -> Planner {
        // A type defined with `component!` names its planner itself.
        if let Some(planner) = component_type.info().planner {
            return planner;
        }
        use ComponentType as K;
        use Planner::*;
        use containers::section;
        use geometry::{line, point, polygon, polyline, segment};
        use inputs::{choice_input, math_input, text_input};
        use structure::{
            collect, conditional_content, function_iterates, repeat_for, select,
            select_from_sequence,
        };
        use values::{answer, award, boolean, curve, math, text, when};
        match component_type {
            // Containers
            K::Document => Props,
            K::Graph => Props,
            K::P => Props,
            K::ShortDescription => Props,
            K::Error => Whole(containers::plan_error),
            K::Hint => Props,
            K::Setup => Props,
            K::Group => Props,
            K::StickyGroup => Props,
            K::Section => PropsThen(section::plan),
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
            K::Point => Geometric(point::plan),
            K::Circle => unreachable!("defined with component!"),
            K::Line => Geometric(line::plan),
            K::LineSegment => Geometric(segment::plan),
            K::Polygon => Geometric(polygon::plan),
            K::PointList => Whole(geometry::plan_point_list),
            K::Polyline => Whole(polyline::plan),
            // Inputs
            K::NumberInput => Props,
            K::BooleanInput => Props,
            K::MathInput => PropsThen(math_input::plan),
            K::ChoiceInput => PropsThen(choice_input::plan),
            K::Choice => Props,
            K::TextInput => Whole(text_input::plan),
            K::Slider => Props,
            K::UpdateValue => Props,
            // Values
            K::Number => Props,
            K::ClampNumber => Props,
            K::Tuple => Whole(values::plan_tuple),
            K::Text => Whole(text::plan),
            K::Boolean => Whole(boolean::plan),
            K::Math => Whole(math::plan),
            K::Evaluate => Props,
            K::Function => Whole(curve::plan),
            K::Derivative => Whole(curve::plan),
            K::Answer => Whole(answer::plan),
            K::Award => Whole(award::plan),
            K::When => Whole(when::plan),
            K::Response => Whole(values::plan_response),
            // Structure
            K::RepeatForSequence => Props,
            K::RepeatFor => Whole(repeat_for::plan),
            K::FunctionIterates => Whole(function_iterates::plan),
            K::SequenceValue => Props,
            K::Collect => Whole(collect::plan),
            K::ConditionalContent => Whole(conditional_content::plan),
            K::Case => Props,
            K::Select => Whole(select::plan),
            K::SelectFromSequence => PropsThen(select_from_sequence::plan),
        }
    }
}

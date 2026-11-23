//! `<subsetOfReals>`: a subset of the real numbers, written as intervals
//! and points or as inequalities.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::{Post, SymKind};
use crate::sym::SubsetPart;

component! {
    /// `<subsetOfReals>`: the subset of the reals its math names (ADR
    /// 0041, decision 8): intervals and points (`(4, 5] union {7}`), set
    /// operations (`union`, `intersect`, `^c`), inequalities and
    /// memberships in its `variable` (`x > 1`, `x in [0, 1)`, `{t | t >
    /// 0}`). Its `expr` is that subset as the JavaScript core writes it,
    /// merged into intervals and points, or as inequalities with
    /// `displayMode="inequalities"`; no subset is the blank. A write to it
    /// writes the subset, as it is written, to what it reads.
    tags: ["subsetOfReals"],
    flags: [copyable],
    text: Math(expr, value),
    settle: FromMathText(settled_type),
    extend_value: Expr(extended),
    default_prop: value,
    props {
        expr: by_planner { rendered, expr_of: expr },
        value: by_planner { rendered, expr_of: expr },
        // The math cell holding its variable's symbol.
        variable: by_planner,
        // Its parts, each a math cell holding a list (one entry alone,
        // none empty): the ends of its intervals and its points, whether
        // each is in it, its intervals, its points that end no interval.
        points: by_planner { rendered },
        pointsClosed: by_planner { rendered },
        intervals: by_planner { rendered },
        isolatedPoints: by_planner { rendered },
        ..anchor
    }
    attributes {
        variable: Content,
        displayMode: Content,
    }
    children: Math,
    planner: Plan(plan),
}

/// A subset is one expression whatever its text.
fn settled_type(_: &[Token]) -> ComponentType {
    ComponentType::SubsetOfReals
}

/// Its wiring over math `id` and the variable `variable`, written as
/// inequalities or not.
fn wiring_of(id: ExprId, variable: Source, inequalities: bool) -> ElemWiring {
    let mut wiring = ElemWiring::of(ComponentType::SubsetOfReals);
    // The math as written: its pairs are read as intervals by the subset
    // operator, so one reference is an alias a write reaches.
    let raw = wiring.hidden(Source::sym_expr(id, Post::None));
    let at = Props::PORTS;
    let part = |part: SubsetPart| -> Wire {
        Source::computed(
            OpSpec::Sym(SymKind::Subset { part, inequalities }),
            vec![raw, at.variable],
        )
        .into()
    };
    wiring.set_planned(Planned {
        expr: part(SubsetPart::Value),
        value: Source::computed(OpSpec::Sym(SymKind::Evaluate), vec![at.expr]).into(),
        variable: variable.into(),
        points: part(SubsetPart::Points),
        pointsClosed: part(SubsetPart::PointsClosed),
        intervals: part(SubsetPart::Intervals),
        isolatedPoints: part(SubsetPart::IsolatedPoints),
    });
    wiring
}

/// What `extend="$x.prop"` makes of a value: the subset of expression
/// `id`, in `x`, as intervals.
pub(crate) fn extended(id: ExprId) -> Vec<Source> {
    wiring_of(id, Source::Leaf(Leaf::Const(NO_VALUE)), false)
        .finish()
        .0
}

fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ParsedMath::Expr(id) = ctx.parsed_math()? else {
        return Err(Error::Internal("a subset is one expression".into()));
    };
    let attrs = Attrs::of(ctx.record());
    let variable = match attrs.variable.as_ref().map(|v| &v.value) {
        Some(ChildValue::Text { text, .. }) if !text.trim().is_empty() => ctx.symbol(text.trim()),
        // A reference: the expression it stands for (a math input's).
        Some(ChildValue::Reference(p)) => {
            let source = Source::reference(*p);
            match ctx.operand_expr(&source) {
                Some(leaf) => Source::Flow(Flow::MathHandle(leaf, Post::None)),
                None => ctx.symbol("x"),
            }
        }
        _ => ctx.symbol("x"),
    };
    let inequalities = match attrs.displayMode.as_ref().map(|v| &v.value) {
        Some(ChildValue::Text { text, .. }) => match text.trim().to_ascii_lowercase().as_str() {
            "inequalities" => true,
            "intervals" => false,
            other => {
                ctx.warn(
                        "cells-display-mode",
                        &format!(
                            "displayMode \"{other}\" is neither \"intervals\" nor \"inequalities\"; shown as intervals"
                        ),
                    );
                false
            }
        },
        None | Some(ChildValue::Blank) => false,
        Some(_) => {
            ctx.warn(
                "cells-display-mode",
                "a displayMode that follows a value is not supported yet; shown as intervals",
            );
            false
        }
    };
    Ok(wiring_of(id, variable, inequalities))
}

#[cfg(test)]
#[path = "subset_of_reals.spec.rs"]
mod spec;

//! `<mathInput>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::{Post, SymKind};

component! {
    /// `<mathInput>`: bound to another cell by a child reference or
    /// `bindValueTo`, it is a numeric input (`expr` NaN). Unbound, its `expr`
    /// is an essential math cell (typing writes a parsed handle) and `value`
    /// evaluates it; a request on `value` writes a constant expression.
    tags: ["mathInput"],
    flags: [copyable],
    reads_as: Math,
    roles: [ImplicitInput],
    response: Math(expr),
    text: Math(expr, value),
    needs: Label,
    extend_value: Scalar(value),
    default_prop: value,
    props {
        // A mathInput's value is bound by a child reference or `bindValueTo`,
        // else it is the `prefill` (the builder reads it). `plan` sets `expr`
        // from what `value` turned out to be.
        // Typing requests `expr`, or `value` when the input is bound to a
        // number.
        value: children {
            attribute: prefill, bind: bindValueTo, interactive, rendered, infinite, expr_of: expr
        },
        expr: by_planner { interactive, rendered, expr_of: expr },
        // How many entries its value holds (ADR 0041, inside the handle).
        numDimensions: computed(OpSpec::Sym(SymKind::Count), [expr]),
    }
    attributes {
        prefill: Content,
        bindValueTo: Ref,
    }
    children: Value,
    planner: Plan(plan),
}

/// The position of `value`: the input's numeric value.
pub const VALUE: usize = Props::AT.value;
/// The position of `expr`: the entered expression, a math cell; NaN when bound.
pub const EXPR: usize = Props::AT.expr;

/// A mathInput bound to a cell (a reference child or `bindValueTo`)
/// stays a numeric input. Unbound, its `expr` is an essential math cell
/// holding the prefill (or its children's text) and `value` evaluates it.
/// A `prefill="$n"` is not a binding: the expression starts as `$n`'s
/// value when the input is first built.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let attrs = Attrs::of(ctx.record());
    let blank = matches!(attrs.children.value, ChildValue::Blank);
    let mut wiring = ElemWiring::of(ComponentType::MathInput);
    // `value` as a table prop of `children { attribute: prefill, bind:
    // bindValueTo }` is planned.
    let value = match (attrs.bindValueTo, &attrs.prefill) {
        (Some(p), _) => Source::reference(p),
        (None, _) if !blank => ctx.value_of(&attrs.children)?,
        (None, Some(prefill)) => ctx.value_of(prefill)?,
        (None, None) => Source::given(ComponentType::MathInput.prop_defs()[VALUE].default),
    };
    let evaluated = || Source::computed(OpSpec::Sym(SymKind::Evaluate), vec![at.expr]);
    if attrs.bindValueTo.is_none()
        && blank
        && let Some(ChildValue::Reference(p)) = attrs.prefill.as_ref().map(|v| &v.value)
    {
        wiring.set_planned(Planned {
            value: evaluated().into(),
            expr: Source::Leaf(Leaf::Scope(ScopeConst::Seed(*p))).into(),
        });
        return Ok(wiring);
    }
    let text_of = attrs.prefill.unwrap_or(attrs.children);
    let bound = matches!(value, Source::Flow(Flow::Alias(_))) || text_of.references > 0;
    if bound {
        // Bound to one reference, its expression is what the reference
        // stands for when that is an expression (a symbolic math's, an
        // input's, an entry of a math list's; ADR 0041): one math leaf,
        // the referent's math cell itself, so typing writes an expression
        // there. Bound to a number, it has none and stays numeric.
        let expr = match &value {
            Source::Flow(Flow::Alias(_)) => {
                ctx.operand_expr(&value).map_or_else(Wire::absent, |id| {
                    Source::Flow(Flow::MathHandle(id, Post::None)).into()
                })
            }
            _ => Wire::absent(),
        };
        wiring.set_planned(Planned {
            value: value.into(),
            expr,
        });
        return Ok(wiring);
    }
    let text = match &text_of.value {
        ChildValue::Text { text, .. } => text.trim(),
        _ => "",
    };
    let tree = if text.is_empty() {
        None
    } else {
        Some(
            // Build-time only, so a throwaway engine parses it.
            crate::sym::Engine::new()
                .parse_given(text)
                .map_err(|reason| Error::BadMath {
                    text: text.into(),
                    reason,
                })?,
        )
    };
    wiring.set_planned(Planned {
        value: evaluated().into(),
        expr: Source::Leaf(Leaf::GivenMath(tree)).into(),
    });
    Ok(wiring)
}

//! `<fractionInput>`: a numerator and a denominator, each a math input the
//! fraction input owns (ADR 0045), and the fraction they make.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::SymKind;

component! {
    /// `<fractionInput>`: two owned math inputs, the numerator and the
    /// denominator, which a student types into; `numerator` and
    /// `denominator` are their expressions, and `expr` the fraction
    /// `numerator / denominator` they make, a math cell, which `value`
    /// evaluates. `prefillNumerator` and `prefillDenominator` are each
    /// box's first expression. It is an answer's input (its `expr`) and
    /// reads as a `<math>` of its fraction. A value bound to it (a math
    /// child; `bindValueTo` is not read) is refused: a bound math input is
    /// numeric in this core, and a number has no numerator to show.
    tags: ["fractionInput"],
    flags: [copyable, not_extendable],
    reads_as: Math,
    response: Math(expr),
    text: Math(expr, value),
    needs: Label,
    default_prop: value,
    props {
        value: by_planner { expr_of: expr },
        expr: by_planner { expr_of: expr },
        numerator: by_planner { expr_of: numerator },
        denominator: by_planner { expr_of: denominator },
    }
    attributes {
        prefillNumerator: Content,
        prefillDenominator: Content,
    }
    inner {
        numerator: FractionInputPart,
        denominator: FractionInputPart,
    }
    children: Value,
    planner: Plan(plan),
}

/// `_fractionInputComponent`: one box of a fraction input, which the
/// parser's normalizer writes as the fraction input's child (`part` names
/// which). An unbound math input its fraction input plans: `expr` is an
/// essential math cell a student types into, `value` evaluates it.
pub(crate) mod part {
    use crate::components::define::*;

    component! {
        /// A box of a `<fractionInput>`, its numerator or its denominator:
        /// a math input, planned with its fraction input.
        tags: ["_fractionInputComponent"],
        flags: [owned],
        props {
            value: by_planner { interactive, rendered, expr_of: expr },
            expr: by_planner { interactive, rendered, expr_of: expr },
        }
        owner: FractionInput,
    }
}

/// Each owned box an unbound math input holding its prefill, and the
/// fraction input's props read from theirs.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    if !matches!(attrs.children.value, ChildValue::Blank) {
        return Err(Error::Unsupported(
            "a <fractionInput> with a value: a bound math input is a number in this core, \
             which has no numerator or denominator to show"
                .into(),
        ));
    }
    let at = part::Props::PORTS;
    let (num, den) = (ctx.inner(0)?, ctx.inner(1)?);
    ctx.plan_inner(num, owned_box(attrs.prefillNumerator.as_ref())?);
    ctx.plan_inner(den, owned_box(attrs.prefillDenominator.as_ref())?);
    let quotient = ctx.inner_quotient((num, at.expr), (den, at.expr));
    let ports = Props::PORTS;
    let mut wiring = ElemWiring::of(ComponentType::FractionInput);
    wiring.set_planned(Planned {
        value: Source::computed(OpSpec::Sym(SymKind::Evaluate), vec![ports.expr]).into(),
        expr: quotient.into(),
        numerator: num.port(at.expr).into(),
        denominator: den.port(at.expr).into(),
    });
    Ok(wiring)
}

/// An owned box: an unbound math input whose expression starts as
/// `prefill`, literal math text, and whose value evaluates it.
fn owned_box(prefill: Option<&ValueChildren>) -> Result<ElemWiring> {
    let text = match prefill {
        None => "",
        Some(v) => match &v.value {
            ChildValue::Blank => "",
            ChildValue::Text { text, .. } => text.trim(),
            _ => {
                return Err(Error::Unsupported(
                    "a <fractionInput> prefill other than literal math".into(),
                ));
            }
        },
    };
    let tree = if text.is_empty() {
        None
    } else {
        // Build-time only, so a throwaway engine parses it.
        Some(
            crate::sym::Engine::new()
                .parse_tree(text)
                .map_err(|reason| Error::BadMath {
                    text: text.into(),
                    reason,
                })?,
        )
    };
    let at = part::Props::PORTS;
    let mut wiring = ElemWiring::of(ComponentType::FractionInputPart);
    wiring.set_public(part::Props {
        value: Source::computed(OpSpec::Sym(SymKind::Evaluate), vec![at.expr]).into(),
        expr: Source::Leaf(Leaf::GivenMath(tree)).into(),
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "fraction_input.spec.rs"]
mod spec;

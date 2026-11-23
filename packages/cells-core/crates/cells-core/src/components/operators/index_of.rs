//! `<argMin>`, `<argMax>`, `<indexOf>` and `<searchSorted>`, which share
//! their table: a position among their children read as a list (ADR
//! 0041), one value per text piece and per reference, as the current
//! core's index operators (`ListIndexOperators.js`) compute numerically.
//! `<indexOf>` and `<searchSorted>` look for one `target`; a list of
//! targets, which the current core answers with a list, is refused.

use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentDef, ComponentType};
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{Reduction, VecOp};

component! {
    /// `<argMin>3 1 2</argMin>`: the position (from 1) of its least
    /// operand, the first of equal ones; 0 with none.
    tags: ["argMin"],
    flags: [copyable],
    text: Number(value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        value: by_planner { rendered },
        anchorX: anchor(0),
        anchorY: anchor(1),
    }
    attributes {
        target: Scalar,
        side: Text,
        allowUnsorted: LiteralFlag,
    }
    children: List,
    planner: Plan(plan),
}

/// `<argMax>`: the position of its greatest operand.
pub(crate) const ARG_MAX: ComponentDef = DEFINITION.with_tags(&["argMax"]);
/// `<indexOf target>`: the position of the first operand equal to its
/// target, 0 when none is.
pub(crate) const INDEX_OF: ComponentDef = DEFINITION.with_tags(&["indexOf"]);
/// `<searchSorted target side allowUnsorted>`: the position at which its
/// target would go among its operands, which must be in increasing order
/// unless `allowUnsorted`; 0 when they are not, or there are none.
pub(crate) const SEARCH_SORTED: ComponentDef = DEFINITION.with_tags(&["searchSorted"]);

/// A diagnostic for an `<indexOf>` or `<searchSorted>` with no `target`,
/// which no document can answer.
const NO_TARGET: &str = "cells-index-no-target";

/// Its `value`: an instruction over the target, for the two that take
/// one, and a hidden port per operand ([`operands`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let refuse = |attr: &str| {
        Err(Error::Unsupported(format!(
            "<{} {attr}>: only <searchSorted> takes `side` and `allowUnsorted`, and only it and <indexOf> a `target`",
            ty.tag()
        )))
    };
    let takes_target = matches!(ty, ComponentType::IndexOf | ComponentType::SearchSorted);
    if !takes_target && attrs.target.is_some() {
        return refuse("target");
    }
    if ty != ComponentType::SearchSorted {
        if attrs.side.is_some() {
            return refuse("side");
        }
        if attrs.allowUnsorted.is_some() {
            return refuse("allowUnsorted");
        }
    }
    let right = match attrs.side.as_deref().map(|s| s.trim().to_ascii_lowercase()) {
        None => false,
        Some(s) if s == "left" => false,
        Some(s) if s == "right" => true,
        Some(s) => {
            return Err(Error::BadValue {
                attr: "side".into(),
                text: s,
            });
        }
    };
    let unsorted = match attrs.allowUnsorted {
        None => false,
        Some(Some(b)) => b,
        Some(None) => {
            return Err(Error::Unsupported(
                "<searchSorted allowUnsorted> bound to a value".into(),
            ));
        }
    };
    let op = match ty {
        ComponentType::ArgMin => Reduction::ArgMin,
        ComponentType::ArgMax => Reduction::ArgMax,
        ComponentType::IndexOf => Reduction::IndexOf,
        ComponentType::SearchSorted => Reduction::SearchSorted { right, unsorted },
        _ => unreachable!("<{}> is not planned by this table", ty.tag()),
    };
    let pieces = ctx.list_entries(attrs.children, f64::INFINITY)?;
    let mut wiring = ElemWiring::of(ty);
    let value = match (takes_target, attrs.target) {
        (true, None) => {
            let w = ctx.warn(
                NO_TARGET,
                &format!("<{}> has no `target` to look for", ty.tag()),
            );
            Wire::undefined(w)
        }
        // Nothing to look through: no position.
        _ if pieces.is_empty() => Wire::constant(0.0),
        (_, target) => {
            let mut args = Vec::new();
            if let Some(target) = target {
                args.push(wiring.hidden(target));
            }
            args.extend(operands(
                ctx,
                &mut wiring,
                pieces,
                PieceKind::Number,
                false,
            )?);
            Source::vector(
                VecOp::Reduce {
                    op,
                    n: byte(args.len()),
                },
                args,
            )
            .into()
        }
    };
    wiring.set_planned(Planned { value });
    Ok(wiring)
}

#[cfg(test)]
#[path = "index_of.spec.rs"]
mod spec;

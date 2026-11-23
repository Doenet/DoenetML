//! Number, boolean, text, math, evaluate, clamp number, tuple, update
//! value, function, derivative, the function operators (clampFunction,
//! wrapFunctionPeriodic) and answer (with its award, when and response),
//! the value lists, and the values shown a particular way (integer,
//! intComma, pluralize): types that hold a value, numeric or symbolic, or a
//! sequence of them (ADR 0041). Function, derivative, the function
//! operators and answer are `symbolic`, planned as math cells.

use super::define::*;
use crate::compile::api::{
    ElemWiring, GivenId, ListEntry, ListPiece, NO_VALUE, PlanCtx, Source, Wire,
};
use crate::components::EntryKind;
use crate::program::{Post, SymKind};

pub mod answer;
pub mod award;
pub mod boolean;
pub(crate) mod boolean_list;
pub mod curve;
pub(crate) mod formatted;
pub(crate) mod function_operators;
pub(crate) mod interval;
pub mod math;
pub(crate) mod math_list;
pub(crate) mod number_list;
pub(crate) mod piecewise_function;
pub(crate) mod pluralize;
pub mod text;
pub(crate) mod text_list;

pub(crate) mod sequence;
pub mod when;

/// Plans a value list's entries from its children (ADR 0041, decision 1:
/// a static sequence, its count a fact of the source): one entry per
/// piece of text, a given value of the list's entry kind (a number list's
/// piece that is no number read as the math it is, `1+1`, `pi`); and the
/// entries each reference and element child contributes, an alias each of
/// what it names (decision 9: a nested list's entries spliced), at most
/// `max` (`maxNumber`). Returns the wiring, the entries set, and how many
/// there are.
pub(crate) fn plan_list(
    ctx: &mut PlanCtx<'_, '_>,
    pieces: Vec<ListPiece>,
    max: f64,
) -> crate::error::Result<(ElemWiring, usize)> {
    let component_type = ctx.component_type();
    let kind = component_type.list_entry().expect("a value list");
    let entries = ctx.list_entries(pieces.clone(), max)?;
    let n = entries.len();
    ctx.element_rows(&pieces, n);
    let mut wiring = ElemWiring::with_list(component_type, n);
    // Math text with references inside its brackets is read where math is.
    if !matches!(kind, EntryKind::Number | EntryKind::Math)
        && entries.iter().any(|e| matches!(e, ListEntry::Math(_)))
    {
        return Err(crate::error::Error::Unsupported(format!(
            "a reference inside brackets in <{}>",
            component_type.tag()
        )));
    }
    let entries = entries
        .into_iter()
        .map(|entry| match entry {
            ListEntry::Ref(_) if kind == EntryKind::Math => {
                let id = ctx.entry_math(&entry).expect("a reference is math");
                Source::sym_expr(id, Post::None).into()
            }
            ListEntry::Ref(p) => Source::reference(p).into(),
            ListEntry::Math(id) if kind == EntryKind::Number => Source::math(id).into(),
            ListEntry::Math(id) => Source::sym_expr(id, Post::None).into(),
            ListEntry::Text(k, text) => {
                let id = GivenId::Children(k);
                match kind {
                    EntryKind::Number => match text.parse::<f64>() {
                        Ok(v) => Wire::given(id, v),
                        // Math, numeric or not (`1+1`, `x`), or none (`@`).
                        Err(_) => match ctx.entry_math(&ListEntry::Text(k, text)) {
                            Some(expr) => Source::math(expr).into(),
                            None => Wire::given(id, NO_VALUE),
                        },
                    },
                    EntryKind::Text => Wire::given_text(id, ctx.intern(&text)),
                    EntryKind::Boolean => {
                        Wire::given(id, f64::from(u8::from(text.eq_ignore_ascii_case("true"))))
                    }
                    // As written: a given expression a write may change, or
                    // blank for text that is no math.
                    EntryKind::Math => {
                        Wire::given_math(id, crate::sym::Engine::new().parse_tree(text.trim()).ok())
                    }
                    EntryKind::Point => unreachable!("a value list's entries are values"),
                }
            }
        })
        .collect();
    wiring.set_entries(entries);
    Ok((wiring, n))
}

/// `<number>`: a numeric value.
pub mod number {
    use super::*;

    component! {
        /// `<number>`.
        tags: ["number"],
        flags: [copyable],
        roles: [Index, Value],
        text: Number(value),
        extend_value: Scalar(value),
        default_prop: value,
        props {
            value: children { rendered },
            anchorX: anchor(0),
            anchorY: anchor(1),
        }
        children: Value,
        planner: Props,
    }

    /// The position of `value`: the number.
    pub const VALUE: usize = Props::AT.value;
}

/// `mathValue`: a `$ref` child naming a math cell that stands for no
/// component's expression, an entry of a math list (ADR 0041).
pub(crate) mod math_value {
    use super::*;

    component! {
        /// What `$ml[2]` shows as: the expression its one cell holds, or
        /// the number where the entry aliases one. Made by the builder.
        tags: ["mathValue"],
        flags: [copyable, internal],
        roles: [MathValue],
        text: Held(value),
        extend_value: Scalar(value),
        default_prop: value,
        props {
            value: attr(NO_VALUE) { rendered },
        }
        planner: Props,
    }
}

pub(crate) mod evaluate {
    use super::*;
    use crate::components::{ConstrainTarget, FUNCTION_PROPS};
    use crate::error::Result;

    component! {
        /// `<evaluate function="$m" input="$a"/>`: the math's expression with
        /// its free symbol set to the input; a function's (ADR 0049) in its
        /// variable, missing outside its domain.
        tags: ["evaluate"],
        flags: [copyable],
        default_prop: value,
        props {
            function: by_planner,
            input: by_planner,
            value: by_planner { rendered },
            anchorX: anchor(0),
            anchorY: anchor(1),
        }
        attributes {
            function: Ref,
            input: Scalar,
        }
        planner: Plan(plan),
    }

    /// `x` bound to the input in the math's expression, or the function
    /// of one variable (`EvalFunction`) at the input.
    fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
        let attrs = Attrs::of(ctx.record());
        let at = Props::PORTS;
        let mut wiring = ElemWiring::of(ctx.component_type());
        let input = match attrs.input {
            Some(source) => Wire::scalar(source, GivenId::Attr(attr::input, 0)),
            None => Wire::absent(),
        };
        let Some(p) = attrs.function else {
            wiring.set_public(Props {
                function: Wire::absent(),
                input,
                value: Wire::computed(OpSpec::Sym(SymKind::EvalAt), vec![at.function, at.input]),
                // Planned after this, from the element's `anchor` (`plan_anchor`).
                anchorX: Wire::absent(),
                anchorY: Wire::absent(),
            });
            return Ok(wiring);
        };
        let target = ctx
            .reference_type(p)?
            .and_then(|ty| ty.def().constrain_target);
        let (function, value) = match target {
            Some(ConstrainTarget::Graph {
                expr,
                function: true,
            }) => {
                let mut f = Vec::new();
                for name in FUNCTION_PROPS {
                    f.push(wiring.hidden(Source::reference(ctx.with_prop(p, name)?)));
                }
                let mut eval = vec![at.input];
                eval.extend(curve::one_piece(
                    &mut wiring,
                    at.function,
                    f[0],
                    [f[1], f[2], f[3], f[4]],
                ));
                (
                    Wire::from(Source::reference(ctx.with_prop(p, expr)?)),
                    Wire::computed(OpSpec::Sym(SymKind::EvalFunction), eval),
                )
            }
            _ => (
                Wire::from(Source::reference(ctx.with_prop(p, "expr")?)),
                Wire::computed(OpSpec::Sym(SymKind::EvalAt), vec![at.function, at.input]),
            ),
        };
        wiring.set_public(Props {
            function,
            input,
            value,
            // Planned after this, from the element's `anchor` (`plan_anchor`).
            anchorX: Wire::absent(),
            anchorY: Wire::absent(),
        });
        Ok(wiring)
    }
}

/// `response`: one response an answer submits.
pub mod response {
    use super::*;

    component! {
        /// One response of an answer whose awards reference an input:
        /// `response` aliases the input's live expression, `submitted` is the
        /// essential copy a submit takes, and `value` evaluates it. A `$mi`
        /// inside a `<when>` resolves here, so credit changes only on submit.
        /// Made by the builder.
        tags: ["response"],
        flags: [internal, owned],
        renders: Never,
        roles: [Response],
        submit: Copies(response, submitted),
        default_prop: value,
        props {
            response: by_planner { read_by_action },
            // A submit writes it (its answer's `submitAnswer`).
            submitted: by_planner { written_by_action, expr_of: submitted },
            value: by_planner { expr_of: submitted },
        }
        actions { submit: submit }
        owner: Answer,
    }

    /// `submit`, which its answer's submit calls: copies the live response
    /// into the submitted cell.
    fn submit(view: &crate::document::ActionView<'_>, _args: &[f64]) -> Vec<crate::tick::Request> {
        let at = Props::AT;
        vec![view.request(at.submitted, view.value(at.response))]
    }

    /// The position of `response`: the input's live expression.
    pub const RESPONSE: usize = Props::AT.response;
    /// The position of `submitted`: the response as last submitted.
    pub const SUBMITTED: usize = Props::AT.submitted;
    /// The position of `value`: the submitted response, evaluated.
    pub const VALUE: usize = Props::AT.value;
}

pub(crate) mod clamp_number {
    use super::*;

    component! {
        /// `<clampNumber lowerValue="0" upperValue="1">x</clampNumber>`: its
        /// children held between the bounds. A request on `value` inverts
        /// through the bounds' projections to the unclamped number.
        tags: ["clampNumber"],
        flags: [copyable],
        default_prop: value,
        props {
            unclamped: children,
            lowerValue: attr(0.0),
            upperValue: attr(1.0),
            atLeastLower: computed(OpSpec::Max, [unclamped, lowerValue]),
            value: computed(OpSpec::Min, [atLeastLower, upperValue]) { rendered },
            anchorX: anchor(0),
            anchorY: anchor(1),
        }
        children: Value,
        planner: Props,
    }
}

/// Most entries a tuple holds.
pub use crate::limits::MAX_TUPLE;

/// `tuple`: a tuple of numbers, up to [`MAX_TUPLE`] entries.
pub mod tuple {
    use super::*;
    use crate::compile::api::{ElemWiring, Source, Wire};
    use crate::components::ComponentType;

    component! {
        /// A tuple of numbers: a `<math>` that is `(a, b, c)` with three or
        /// more entries (two make a point), and the iterates of a
        /// `<functionIterates>`. `n` is how many entries it has; `x1`, ... the
        /// entries, unused ones NaN. `coords` combines the entries, so `$t[2]`
        /// is `x2`.
        tags: ["tuple"],
        flags: [copyable, internal, owned],
        roles: [Item],
        default_prop: coords,
        props {
            n: by_planner { rendered },
            x1: by_planner { rendered },
            x2: by_planner { rendered },
            x3: by_planner { rendered },
            x4: by_planner { rendered },
            x5: by_planner { rendered },
            x6: by_planner { rendered },
            x7: by_planner { rendered },
            x8: by_planner { rendered },
        }
        combined_props {
            coords: [x1, x2, x3, x4, x5, x6, x7, x8],
        }
    }

    // One entry for each of the `MAX_TUPLE` a tuple holds.
    const _: () = assert!(
        PROPS.len() == 1 + MAX_TUPLE,
        "a tuple holds MAX_TUPLE entries"
    );

    /// The position of `n`: how many entries the tuple has.
    pub const N: usize = Props::AT.n;
    /// The first entry; entry k (0-based) is at `X1 + k`.
    pub const X1: usize = Props::AT.x1;

    /// A tuple's props: its entry count, its entries, and NaN in the
    /// entries past them.
    pub(crate) fn props_of(entries: Vec<Source>) -> Vec<Source> {
        wiring_of(entries).finish().0
    }

    /// A tuple's wiring (`props_of`).
    pub(crate) fn wiring_of(entries: Vec<Source>) -> ElemWiring {
        debug_assert!(entries.len() <= MAX_TUPLE, "checked against MAX_TUPLE");
        let n = Wire::constant(entries.len() as f64);
        let mut entries = entries
            .into_iter()
            .map(Wire::from)
            .chain(std::iter::repeat_with(Wire::absent));
        let mut next = || entries.next().expect("an endless supply");
        let mut wiring = ElemWiring::of(ComponentType::Tuple);
        wiring.set_public(Props {
            n,
            x1: next(),
            x2: next(),
            x3: next(),
            x4: next(),
            x5: next(),
            x6: next(),
            x7: next(),
            x8: next(),
        });
        wiring
    }
}

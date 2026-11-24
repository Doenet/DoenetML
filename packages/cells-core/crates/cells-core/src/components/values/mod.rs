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
pub mod curve;
pub(crate) mod formatted;
pub(crate) mod function_operators;
pub(crate) mod interval;
pub(crate) mod interval_list;
pub mod math;
pub(crate) mod piecewise_function;
pub(crate) mod pluralize;
pub(crate) mod subset_of_reals;
pub mod text;

pub(crate) mod matrix;
pub(crate) mod over_value;
pub(crate) mod sequence;
pub(crate) mod structural_sequence;
pub mod when;

// The specs of the value lists, defined below by `value_list!`, sit
// beside this file.
#[cfg(test)]
#[path = "boolean_list.spec.rs"]
mod boolean_list_spec;
#[cfg(test)]
#[path = "math_list.spec.rs"]
mod math_list_spec;
#[cfg(test)]
#[path = "number_list.spec.rs"]
mod number_list_spec;
#[cfg(test)]
#[path = "text_list.spec.rs"]
mod text_list_spec;

/// A value list (ADR 0041): a static sequence of values of one kind, one
/// entry per piece of its text (split at the spaces outside any bracket
/// pair) and per entry each reference and element child among its
/// children names, in order, at most `maxNumber`. Its entries are its
/// list, under the name given and `values` (`numbers`, `number1`, ...),
/// `numComponents` how many there are, and `text` their texts joined with
/// commas. The four differ in the name, the kind of an entry and the
/// attributes they read beside `maxNumber`.
macro_rules! value_list {
    (
        $(#[$doc:meta])*
        $module:ident: $tag:literal, $names:ident, $item:ident of $kind:ident
        $(, over_value: $over:ident)?
        $(, attributes { $($attrs:tt)* })? $(,)?
    ) => {
        pub(crate) mod $module {
            use super::*;

            component! {
                $(#[$doc])*
                tags: [$tag],
                flags: [copyable],
                $(over_value: $over,)?
                // `<numberList extend="$A.matrixSize"/>`: the value is
                // its one child (ADR 0073).
                extend_value: Children,
                default_prop: $names,
                props {
                    numComponents: list_len { rendered },
                    text: by_planner { text },
                }
                list {
                    names: [$names, values],
                    item: $item,
                    values: $item of $kind, max_by: maxNumber, entries: children,
                    rendered: true,
                }
                alternate_names {
                    numValues: numComponents,
                }
                // Whether a renderer shows the entries separated by commas.
                presentation { asList }
                attributes {
                    maxNumber: Literal(f64::INFINITY),
                    $($($attrs)*)?
                }
                children: List,
                planner: Plan(plan),
            }

            /// Plans the list from its children ([`plan_list`]), and its
            /// text from its entries ([`joined_entries`]).
            fn plan(ctx: &mut PlanCtx<'_, '_>) -> crate::error::Result<ElemWiring> {
                let attrs = Attrs::of(ctx.record());
                let (mut wiring, n) = plan_list(ctx, attrs.children, attrs.maxNumber?)?;
                let booleans = EntryKind::$kind == EntryKind::Boolean;
                wiring.set_planned(Planned {
                    text: joined_entries(&wiring, n, booleans).into(),
                });
                Ok(wiring)
            }
        }
    };
}

value_list! {
    /// `<numberList>`: its entries are numbers, `numbers` (`number1`,
    /// ...); a piece that is no number is read as the math it is.
    number_list: "numberList", numbers, number of Number,
    over_value: OverValueNumberList,
    attributes {
        // Read as the children are parsed: whether a `<math>` child that
        // is a list gives its items as entries.
        mergeMathLists: LiteralFlag,
    }
}

value_list! {
    /// `<mathList>`: its entries are expressions, `maths` (`math1`, ...),
    /// each piece of text one a write may change.
    math_list: "mathList", maths, math of Math,
    over_value: OverValueMathList,
    attributes {
        // Read as the children are parsed: whether a `<math>` child that
        // is a list gives its items as entries.
        mergeMathLists: LiteralFlag,
    }
}

value_list! {
    /// `<textList>`: its entries are texts, `texts` (`text1`, ...).
    text_list: "textList", texts, text of Text,
}

value_list! {
    /// `<booleanList>`: its entries are booleans, `booleans` (`boolean1`,
    /// ...).
    boolean_list: "booleanList", booleans, boolean of Boolean,
}

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
    plan_list_as(ctx, pieces, max, false)
}

/// [`plan_list`], a math list's pieces of text and math text with their
/// pairs made intervals when `intervals` (an `<intervalList>`'s, ADR 0041
/// decision 8).
pub(crate) fn plan_list_as(
    ctx: &mut PlanCtx<'_, '_>,
    pieces: Vec<ListPiece>,
    max: f64,
    intervals: bool,
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
            // A math cell is read as the number it holds.
            ListEntry::Ref(p) if kind == EntryKind::Number => {
                ctx.entry_number(&mut wiring, p).into()
            }
            ListEntry::Ref(p) => Source::reference(p).into(),
            ListEntry::Math(id) if kind == EntryKind::Number => Source::math(id).into(),
            ListEntry::Math(id) => {
                Source::sym_expr(id, Post::None.with_shapes(false, intervals)).into()
            }
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
                        let tree = crate::sym::Engine::new().parse_tree(text.trim()).ok();
                        Wire::given_math(
                            id,
                            tree.map(|t| if intervals { t.intervals() } else { t }),
                        )
                    }
                    EntryKind::Point | EntryKind::Any => {
                        unreachable!("a value list's entries are values of a kind")
                    }
                }
            }
        })
        .collect();
    wiring.set_entries(entries);
    Ok((wiring, n))
}

/// The text of `entries` joined with commas, each as it reads (a `Join`,
/// ADR 0053): a hidden port per entry, a reference's alias. A string made
/// in the tick when an entry is not constant.
pub(crate) fn joined(wiring: &mut ElemWiring, entries: Vec<ListEntry>, booleans: bool) -> Source {
    let ports: Vec<_> = entries
        .into_iter()
        .filter_map(|e| match e {
            ListEntry::Ref(p) => Some(wiring.hidden(Source::reference(p))),
            _ => None,
        })
        .collect();
    if ports.is_empty() {
        return Source::constant(crate::program::MISSING);
    }
    let op = crate::program::OpSpec::Sym(SymKind::Join {
        n: crate::limits::byte(ports.len()),
        kinds: 0,
        booleans,
    });
    Source::computed(op, ports)
}

/// A value list's `text`: its `n` entries joined, as [`joined`] joins
/// them (the current core's `text` of a list).
pub(crate) fn joined_entries(wiring: &ElemWiring, n: usize, booleans: bool) -> Source {
    if n == 0 {
        // No entries: the missing value (ADR 0041 decision 5).
        return Source::constant(crate::program::MISSING);
    }
    let ports: Vec<_> = (0..n).map(|k| wiring.entry(k)).collect();
    let op = crate::program::OpSpec::Sym(SymKind::Join {
        n: crate::limits::byte(n),
        kinds: 0,
        booleans,
    });
    Source::computed(op, ports)
}

/// `<number>`: a numeric value.
pub mod number {
    use super::*;

    component! {
        /// `<number>`.
        tags: ["number"],
        flags: [copyable],
        roles: [Index, Value],
        value: Number,
        props {
            value: children { rendered },
            // How its value shows (ADR 0058).
            displayDigits: display,
            displayDecimals: display,
            displaySmallAsZero: display,
            padZeros: display,
            avoidScientificNotation: display,
            displayBlanks: display,
            ..anchor
        }
        attributes {
            // Read where its children are planned: a boolean in them is 1
            // or 0, the one place one is (D47).
            convertBoolean: On,
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
        value: Held,
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
            ..anchor
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
        let input = Wire::attr(attr::input, attrs.input).unwrap_or(Wire::absent());
        let Some(p) = attrs.function else {
            wiring.set_planned(Planned {
                function: Wire::absent(),
                input,
                value: Wire::computed(OpSpec::Sym(SymKind::EvalAt), vec![at.function, at.input]),
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
        wiring.set_planned(Planned {
            function,
            input,
            value,
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
            ..anchor
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
        text: Tuple(n, x1),
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
        wiring.set_planned(Planned {
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

//! `<selectPrimeNumbers>`: its definition and its planner, and what
//! `<samplePrimeNumbers>` shares with it ([`plan_primes`]).

use super::select_random_numbers::{draw_count, plan_draws};
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::{Dist, Order};

component! {
    /// `<selectPrimeNumbers from to exclude numToSelect withReplacement
    /// sort>`: a list of primes (`numbers`, `number1`, ...) from `from` to
    /// `to` (2 and 100 by default) less what it excludes, drawn at load
    /// from the document seed, no prime twice unless `withReplacement`,
    /// in the order drawn unless `sort` is `increasing` (or `true`) or
    /// `decreasing`. The parameters may read any value no student can
    /// change (ADR 0037), which the check makes sure of, with every draw
    /// possible. `numToSelect` is a literal: the list's length is a fact
    /// of the source.
    tags: ["selectPrimeNumbers"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: list_len { rendered },
    }
    list {
        names: [numbers, values],
        item: number,
        values: number of Number,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        from: Scalar,
        to: Scalar,
        exclude: Scalars,
        numToSelect: Literal(1.0),
        withReplacement: Bool(false),
        sort: Text,
        excludeCombinations: Written,
    }
    static_count: count,
    children: None,
    planner: Plan(plan),
}

/// The order `sort` asks for, as the current core reads it: absent,
/// `unsorted` or `false` as drawn, `increasing` or `true` least first,
/// `decreasing` greatest first.
pub(super) fn order(sort: Option<String>) -> Result<Order> {
    let Some(text) = sort else {
        return Ok(Order::Unsorted);
    };
    match text.trim().to_ascii_lowercase().as_str() {
        "" | "true" | "increasing" => Ok(Order::Increasing),
        "false" | "unsorted" => Ok(Order::Unsorted),
        "decreasing" => Ok(Order::Decreasing),
        _ => Err(Error::BadValue {
            attr: "sort".into(),
            text,
        }),
    }
}

/// A prime sampler's list of `n` primes from `from` to `to` less the
/// excludes ([`plan_draws`]).
pub(super) fn plan_primes(
    ctx: &mut PlanCtx<'_, '_>,
    n: usize,
    (from, to, exclude): (Option<Source>, Option<Source>, Vec<Source>),
    replace: bool,
    order: Order,
) -> Result<ElemWiring> {
    let from = from.unwrap_or_else(|| Source::constant(2.0));
    let to = to.unwrap_or_else(|| Source::constant(100.0));
    plan_draws(
        ctx,
        Dist::Primes { replace, order },
        n,
        vec![from, to],
        exclude,
    )
}

/// Its list: `numToSelect` primes ([`plan_primes`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    if attrs.excludeCombinations {
        return Err(Error::Unsupported(
            "<selectPrimeNumbers excludeCombinations>".into(),
        ));
    }
    let n = draw_count("numToSelect", attrs.numToSelect)?;
    let order = order(attrs.sort)?;
    let range = (attrs.from, attrs.to, attrs.exclude);
    let mut wiring = plan_primes(ctx, n, range, attrs.withReplacement, order)?;
    wiring.set_planned(Planned {});
    Ok(wiring)
}

#[cfg(test)]
#[path = "select_prime_numbers.spec.rs"]
mod spec;

/// How many numbers its record draws (`numToSelect`): a reference to it among
/// a list's children contributes as many (ADR 0041).
fn count(record: &Record) -> Option<usize> {
    draw_count("numToSelect", Attrs::of(record).numToSelect).ok()
}

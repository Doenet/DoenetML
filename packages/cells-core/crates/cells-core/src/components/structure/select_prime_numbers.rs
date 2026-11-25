//! `<selectPrimeNumbers>`: its definition and its planner, and what
//! `<samplePrimeNumbers>` shares with it ([`plan_primes`]).

use super::combinations::{self, ComboEntry};
use super::select_random_numbers::{draw_count, plan_draws_avoiding};
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{Avoid, Dist, Order, primes_between};

component! {
    /// `<selectPrimeNumbers from to exclude numToSelect withReplacement
    /// sort>`: a list of primes (`numbers`, `number1`, ...) from `from` to
    /// `to` (2 and 100 by default) less what it excludes, drawn at load
    /// from the document seed, no prime twice unless `withReplacement`,
    /// in the order drawn unless `sort` is `increasing` (or `true`) or
    /// `decreasing`. The parameters may read any value no student can
    /// change (ADR 0037), which the check makes sure of, with every draw
    /// possible. `numToSelect` is a literal: the list's length is a fact
    /// of the source. Several primes avoid the combinations
    /// `excludeCombinations` names (`(2 _)`, `_` any prime), drawn again
    /// until they do (ADR 0079).
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
        excludeCombinations: Entries,
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
/// excludes ([`plan_draws_avoiding`]), avoiding the combinations `combos`
/// (ADR 0079): refused, as the current core refuses them before it draws,
/// when the parameters are literals and the combinations exclude over 70%
/// of the draws (`doenet-e0051`).
pub(super) fn plan_primes(
    ctx: &mut PlanCtx<'_, '_>,
    n: usize,
    (from, to, exclude): (Option<Source>, Option<Source>, Vec<Source>),
    replace: bool,
    order: Order,
    combos: Vec<Vec<ComboEntry>>,
    on: DrawOn,
) -> Result<ElemWiring> {
    let from = from.unwrap_or_else(|| Source::constant(2.0));
    let to = to.unwrap_or_else(|| Source::constant(100.0));
    let lit = |s: &Source| match s {
        Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) => Some(*v),
        _ => None,
    };
    let number = |t: &str| t.parse::<f64>().ok();
    let excluded: Option<Vec<f64>> = exclude.iter().map(lit).collect();
    if let (Some(lits), Some(f), Some(t), Some(ex)) = (
        combinations::literal(&combos, number),
        lit(&from),
        lit(&to),
        excluded,
    ) && let Some(primes) = primes_between(f, t)
    {
        let left = primes
            .iter()
            .filter(|&&p| !ex.contains(&(p as f64)))
            .count() as f64;
        let merged = combinations::merged(lits);
        if combinations::too_many(&merged, left, left, replace, n) {
            return Err(Error::ChoiceDomain {
                tag: "selectPrimeNumbers".into(),
                reason: "Excluded over 70% of combinations in selectPrimeNumbers".into(),
            });
        }
    }
    let avoid = if combos.is_empty() {
        Avoid::Nothing
    } else {
        Avoid::Combinations {
            m: byte(combos.len()),
        }
    };
    let combos = combinations::sources(&combos, number)?;
    plan_draws_avoiding(
        ctx,
        Dist::Primes {
            replace,
            order,
            avoid,
        },
        n,
        vec![from, to],
        exclude,
        combos,
        on,
    )
    .map(|(wiring, _)| wiring)
}

/// Its list: `numToSelect` primes ([`plan_primes`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let mut attrs = Attrs::of(ctx.record());
    let n = draw_count("numToSelect", attrs.numToSelect)?;
    let written = std::mem::take(&mut attrs.excludeCombinations);
    let combos = combinations::parse(ctx, written, n)?;
    let order = order(attrs.sort)?;
    let range = (attrs.from, attrs.to, attrs.exclude);
    // The order is not the draw's: a copy sorting what its referent drew
    // shares the draw.
    let on = DrawOn {
        attrs: &[
            attr::from,
            attr::to,
            attr::exclude,
            attr::numToSelect,
            attr::withReplacement,
            attr::excludeCombinations,
        ],
        children: false,
    };
    let replace = attrs.withReplacement;
    let mut wiring = plan_primes(ctx, n, range, replace, order, combos, on)?;
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

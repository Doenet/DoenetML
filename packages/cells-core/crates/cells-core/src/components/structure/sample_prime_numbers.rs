//! `<samplePrimeNumbers>`: its definition and its planner.

use super::select_prime_numbers::plan_primes;
use super::select_random_numbers::draw_count;
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;
use crate::program::Order;

component! {
    /// `<samplePrimeNumbers from to exclude numSamples>`: a list of
    /// `numSamples` primes from `from` to `to` (2 and 100 by default)
    /// less what it excludes, each drawn independently, so a prime may
    /// come twice. The samples are drawn from the document seed, so a
    /// fresh build of the same document under the same seed draws them
    /// again, and their parameters must be constants (ADR 0037); the
    /// current core's `resample` action is not supported.
    tags: ["samplePrimeNumbers"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: by_planner { rendered },
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
        numSamples: Literal(1.0),
    }
    children: None,
    planner: Plan(plan),
}

/// Its list: `numSamples` primes, with replacement ([`plan_primes`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let n = draw_count("numSamples", attrs.numSamples)?;
    let range = (attrs.from, attrs.to, attrs.exclude);
    let mut wiring = plan_primes(ctx, n, range, true, Order::Unsorted)?;
    wiring.set_planned(Planned {
        numComponents: Wire::constant(n as f64),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "sample_prime_numbers.spec.rs"]
mod spec;

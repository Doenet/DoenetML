//! `<sampleRandomNumbers>`: its definition and its planner.

use super::select_random_numbers::{RandomParams, draw_count, plan_random};
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<sampleRandomNumbers type from to step mean standardDeviation
    /// exclude numSamples>`: as `<selectRandomNumbers>`, `numSamples`
    /// values. The samples are drawn from the document seed, so a fresh
    /// build of the same document under the same seed draws them again, and
    /// their parameters must be constants (ADR 0037); the current core's
    /// `resample` action and samples that follow a changing parameter are
    /// not supported.
    tags: ["sampleRandomNumbers"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: list_len { rendered },
        // The distribution's, from its parameters.
        mean: by_planner,
        variance: by_planner,
        standardDeviation: by_planner,
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
        r#type: Text,
        from: Scalar,
        to: Scalar,
        step: Scalar,
        mean: Scalar,
        standardDeviation: Scalar,
        variance: Scalar,
        exclude: Scalars,
        numSamples: Literal(1.0),
    }
    static_count: count,
    children: None,
    planner: Plan(plan),
}

/// Its list: `numSamples` values from the distribution its `type` names
/// ([`plan_random`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let n = draw_count("numSamples", attrs.numSamples)?;
    let params = RandomParams {
        kind: attrs.r#type,
        from: attrs.from,
        to: attrs.to,
        step: attrs.step,
        mean: attrs.mean,
        standard_deviation: attrs.standardDeviation,
        variance: attrs.variance,
        exclude: attrs.exclude,
        on: DrawOn {
            attrs: &[
                attr::r#type,
                attr::from,
                attr::to,
                attr::step,
                attr::mean,
                attr::standardDeviation,
                attr::variance,
                attr::exclude,
                attr::numSamples,
            ],
            children: false,
        },
    };
    let (mut wiring, [mean, variance, sd]) = plan_random(ctx, n, params)?;
    wiring.set_planned(Planned {
        mean: Wire::own(mean),
        variance: Wire::own(variance),
        standardDeviation: Wire::own(sd),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "sample_random_numbers.spec.rs"]
mod spec;

/// How many numbers its record draws (`numSamples`): a reference to it among
/// a list's children contributes as many (ADR 0041).
fn count(record: &Record) -> Option<usize> {
    draw_count("numSamples", Attrs::of(record).numSamples).ok()
}

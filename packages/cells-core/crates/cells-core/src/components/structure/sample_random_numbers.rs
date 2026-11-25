//! `<sampleRandomNumbers>`: its definition and its planner.

use super::select_random_numbers::{RandomParams, draw_count, plan_random, plan_random_sampler};
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<sampleRandomNumbers type from to step mean standardDeviation
    /// exclude numSamples>`: as `<selectRandomNumbers>`, `numSamples`
    /// values, of the same distributions (ADR 0079). The samples are drawn
    /// from the document seed, so a fresh build of the same document under
    /// the same seed draws them again, and their parameters must be
    /// constants (ADR 0037); the current core's `resample` action and
    /// samples that follow a changing parameter are not supported.
    tags: ["sampleRandomNumbers"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: list_len { rendered },
        // The distribution's, from its parameters.
        mean: by_planner,
        variance: by_planner,
        standardDeviation: by_planner,
        // The parameters of a distribution that has them (ADR 0079).
        logMean: by_planner,
        logStandardDeviation: by_planner,
        logVariance: by_planner,
        numTotal: by_planner,
        numSuccesses: by_planner,
        numDraws: by_planner,
        numTrials: by_planner,
        probability: by_planner,
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
        logMean: Scalar,
        logStandardDeviation: Scalar,
        logVariance: Scalar,
        means: Scalars,
        standardDeviations: Scalars,
        variances: Scalars,
        weights: Scalars,
        numTotal: Scalar,
        numSuccesses: Scalar,
        numDraws: Scalar,
        numTrials: Scalar,
        probability: Scalar,
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
    plan_random_sampler!(ctx, attrs, n, numSamples)
}

#[cfg(test)]
#[path = "sample_random_numbers.spec.rs"]
mod spec;

/// How many numbers its record draws (`numSamples`): a reference to it among
/// a list's children contributes as many (ADR 0041).
fn count(record: &Record) -> Option<usize> {
    draw_count("numSamples", Attrs::of(record).numSamples).ok()
}

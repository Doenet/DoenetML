//! `<sampleMultivariateRandomNumber>`: its definition and its planner.

use super::select_random_numbers::plan_draws;
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{Dist, Reduction, VecOp};

component! {
    /// `<sampleMultivariateRandomNumber type="hypergeometric"
    /// numInCategories="5 3 2" numDraws="4">`: one number per category,
    /// drawn together, how many of each `numDraws` items drawn without
    /// replacement take from a population of the categories' sizes; no
    /// value where those describe no population (ADR 0067). Drawn at load
    /// from the document seed, so its parameters must be constants (ADR
    /// 0037), and a copy draws what its referent drew (ADR 0059); the
    /// current core's `resample` action is not supported. Each
    /// category's mean and variance are its named sequences `means` and
    /// `variances` (ADR 0086).
    tags: ["sampleMultivariateRandomNumber"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: list_len { rendered },
        numCategories: by_planner,
        numTotal: by_planner,
        numDraws: by_planner,
    }
    list {
        names: [numbers, values, sampledValues],
        item: number,
        values: number of Number,
        rendered: true,
        sequences: [means, variances],
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        r#type: Text,
        numInCategories: Scalars,
        numDraws: Scalar,
    }
    static_count: count,
    children: None,
    planner: Plan(plan),
}

/// What decides its draw: all of it.
const DRAW_ON: DrawOn = DrawOn {
    attrs: &[attr::r#type, attr::numInCategories, attr::numDraws],
    children: false,
};

/// Its list: one number per category, a `VecOp::Draws` of
/// [`Dist::MultivariateHypergeometric`] over `numDraws` and the sizes
/// ([`plan_draws`]); without `numDraws`, no value.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    match attrs.r#type.as_deref().map(str::trim) {
        Some(t) if t.eq_ignore_ascii_case("hypergeometric") => {}
        Some(t) => {
            return Err(Error::Unsupported(format!(
                "<sampleMultivariateRandomNumber type=\"{t}\">: only hypergeometric"
            )));
        }
        None => {
            return Err(Error::Unsupported(
                "<sampleMultivariateRandomNumber> without a type: it has no default".into(),
            ));
        }
    }
    let k = attrs.numInCategories.len();
    let num_categories = Wire::constant(k as f64);
    let Some(num_draws) = attrs.numDraws else {
        let mut wiring = ElemWiring::with_list(ctx.component_type(), k);
        wiring.set_entries((0..k).map(|_| Wire::absent()).collect());
        // No draws: no distribution, so no moments, as no values.
        for name in ["means", "variances"] {
            wiring.set_sequence(name, (0..k).map(|_| Wire::absent()).collect());
        }
        wiring.set_planned(Planned {
            numCategories: num_categories,
            numTotal: Wire::absent(),
            numDraws: Wire::absent(),
        });
        return Ok(wiring);
    };
    let dist = Dist::MultivariateHypergeometric;
    let (mut wiring, inputs) = plan_draws(
        ctx,
        dist,
        k,
        vec![num_draws],
        attrs.numInCategories,
        DRAW_ON,
    )?;
    // Each category's mean and variance (`VecOp::Moments` of the
    // multivariate hypergeometric, ADR 0086).
    let moments = if k == 0 {
        Vec::new()
    } else {
        let op = VecOp::Moments {
            dist,
            n_exclude: byte(k),
        };
        wiring.hidden_vector(op, inputs.clone())
    };
    let (means, variances) = moments.split_at(k.min(moments.len()));
    wiring.set_sequence("means", means.iter().map(|&p| Wire::own(p)).collect());
    wiring.set_sequence(
        "variances",
        variances.iter().map(|&p| Wire::own(p)).collect(),
    );
    let num_total = if k == 0 {
        Wire::constant(0.0)
    } else {
        let op = VecOp::Reduce {
            op: Reduction::Sum,
            n: byte(k),
        };
        Source::vector(op, inputs[1..].to_vec()).into()
    };
    wiring.set_planned(Planned {
        numCategories: num_categories,
        numTotal: num_total,
        numDraws: Wire::own(inputs[0]),
    });
    Ok(wiring)
}

/// How many numbers its record draws: one per category.
fn count(record: &Record) -> Option<usize> {
    Some(Attrs::of(record).numInCategories.len())
}

#[cfg(test)]
#[path = "sample_multivariate_random_number.spec.rs"]
mod spec;

//! `<summaryStatistics>`: twelve statistics of its children read as a
//! list (ADR 0041), each a [`Reduction::Statistic`] over the same operands.

use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;
use crate::limits::byte;
use crate::program::{Reduction, Statistic, SymKind, VecOp};

component! {
    /// `<summaryStatistics statisticsToDisplay="mean median">2 4 $l</summaryStatistics>`:
    /// the mean, sample standard deviation, sample variance, standard
    /// error, count, minimum, quartiles, median, maximum, range and sum of
    /// its operands' finite values, as the current core computes them: a
    /// value that is not a finite number is missing data, passed over, and
    /// a statistic of none has no value (the count is 0). Which of them a
    /// renderer shows is `statisticsShown`, a mask over them in that order
    /// (bit `k` the `k`th), from the literal `statisticsToDisplay`. A
    /// request cannot change any of them, as in the current core.
    tags: ["summaryStatistics"],
    flags: [copyable],
    props {
        mean: by_planner { rendered },
        stdev: by_planner { rendered },
        variance: by_planner { rendered },
        stderr: by_planner { rendered },
        count: by_planner { rendered },
        minimum: by_planner { rendered },
        quartile1: by_planner { rendered },
        median: by_planner { rendered },
        quartile3: by_planner { rendered },
        maximum: by_planner { rendered },
        range: by_planner { rendered },
        sum: by_planner { rendered },
        statisticsShown: by_planner { rendered },
        // How each statistic shows (ADR 0058).
        displayDigits: display,
        displayDecimals: display,
        displaySmallAsZero: display,
        padZeros: display,
        avoidScientificNotation: display,
    }
    attributes {
        statisticsToDisplay: Text,
    }
    children: List,
    planner: Plan(plan),
}

/// The statistics `statisticsToDisplay="default"` shows.
const DEFAULT: [Statistic; 8] = [
    Statistic::Mean,
    Statistic::Stdev,
    Statistic::Count,
    Statistic::Minimum,
    Statistic::Quartile1,
    Statistic::Median,
    Statistic::Quartile3,
    Statistic::Maximum,
];

/// The statistics `statisticsToDisplay="fiveNumberSummary"` shows.
const FIVE_NUMBER_SUMMARY: [Statistic; 5] = [
    Statistic::Minimum,
    Statistic::Quartile1,
    Statistic::Median,
    Statistic::Quartile3,
    Statistic::Maximum,
];

/// The mask of the statistics `text` asks for, as the current core reads
/// `statisticsToDisplay`: lower-cased words, each a statistic or one of
/// the selections `default`, `all` and `fiveNumberSummary`, unioned; a
/// word that is none of them is passed over. Absent, the default.
fn shown(text: Option<&str>) -> u32 {
    let bit = |s: Statistic| {
        1u32 << Statistic::ALL
            .iter()
            .position(|&t| t == s)
            .expect("every statistic is listed")
    };
    let of = |ss: &[Statistic]| ss.iter().fold(0, |m, &s| m | bit(s));
    let Some(text) = text else {
        return of(&DEFAULT);
    };
    text.split_whitespace()
        .map(str::to_ascii_lowercase)
        .fold(0, |mask, word| {
            mask | match word.as_str() {
                "default" => of(&DEFAULT),
                "all" => of(&Statistic::ALL),
                "fivenumbersummary" => of(&FIVE_NUMBER_SUMMARY),
                w => Statistic::ALL
                    .iter()
                    .find(|s| s.name() == w)
                    .map_or(0, |&s| bit(s)),
            }
        })
}

/// Each statistic a `VecOp::Reduce` of its [`Statistic`] over one hidden
/// port per operand ([`operands`]); with none, the count 0 and no value
/// for the rest.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let mut wiring = ElemWiring::of(ty);
    let pieces = ctx.list_entries(attrs.children, f64::INFINITY)?;
    let texts: Vec<bool> = pieces
        .iter()
        .map(|p| ctx.entry_kind(p) == Some(ValueKind::Text))
        .collect();
    let mut args = operands(ctx, &mut wiring, pieces, PieceKind::Math, false)?;
    // A text is data when it reads as a number.
    for (arg, text) in args.iter_mut().zip(texts) {
        if text {
            *arg = wiring.hidden(Source::computed(
                OpSpec::Sym(SymKind::TextNumber),
                vec![*arg],
            ));
        }
    }
    let stat = |s: Statistic| -> Wire {
        if args.is_empty() {
            return match s {
                Statistic::Count => Wire::constant(0.0),
                _ => Wire::absent(),
            };
        }
        let op = VecOp::Reduce {
            op: Reduction::Statistic(s),
            n: byte(args.len()),
        };
        Source::vector(op, args.clone()).into()
    };
    let mask = shown(attrs.statisticsToDisplay.as_deref());
    wiring.set_planned(Planned {
        mean: stat(Statistic::Mean),
        stdev: stat(Statistic::Stdev),
        variance: stat(Statistic::Variance),
        stderr: stat(Statistic::Stderr),
        count: stat(Statistic::Count),
        minimum: stat(Statistic::Minimum),
        quartile1: stat(Statistic::Quartile1),
        median: stat(Statistic::Median),
        quartile3: stat(Statistic::Quartile3),
        maximum: stat(Statistic::Maximum),
        range: stat(Statistic::Range),
        sum: stat(Statistic::Sum),
        statisticsShown: Wire::constant(f64::from(mask)),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "summary_statistics.spec.rs"]
mod spec;

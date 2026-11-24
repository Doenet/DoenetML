//! `<cascade>` and `<cascadeMessage>`: steps revealed one at a time (ADR
//! 0062).
//!
//! A cascade is no section: it has no heading, number or score of its own,
//! and both numbering sequences pass through it, so a section inside it is
//! numbered as if written beside it (ADR 0054, `passes_both`). What it adds
//! is a gate per step ([`StepGate`](crate::components::StepGate)): its
//! steps are its component children, looked through the structure, but a
//! `<title>`, a `<setup>` and its messages; the step at place k (from 0)
//! is there while k is at most `numCompleted`, how many leading steps are
//! complete (each one's `creditAchievedForProgress` is 1, or it holds
//! nothing scored), or `revealAll` is 1. A step not there is not shown,
//! not scored and not in the text; a held-back section or cascade keeps
//! its heading unless `hideFutureSections`. Each step aggregates its own
//! scores, as the current core's `childrenAggregateScores` makes it.
//!
//! A `<cascadeMessage>` is a block shown for a gap between the steps shown
//! and those held back: one per gap, as the current core chooses it
//! (`Document::revealed`).

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<cascade>`: its steps, revealed as the ones before them are
    /// complete. `numCompleted` counts the leading complete steps;
    /// `creditAchievedForProgress` is the progress of what it holds, which
    /// a cascade around it reads of it as a step.
    tags: ["cascade"],
    flags: [container, passes_both],
    gate: Step(numCompleted, revealAll, hideFutureSections) {
        skip: [Title, Setup],
        message: CascadeMessage,
        headed: [Section, Aside, Proof, Cascade],
    },
    props {
        numCompleted: aggregate(Completed, Steps) { rendered },
        creditAchievedForProgress: aggregate(ProgressCredit, ScoredItems),
        // Literals, or the nearest cascade around it's.
        revealAll: by_planner { rendered },
        hideFutureSections: by_planner { rendered },
    }
    // The colors a step's heading bar shows its progress in, and whether
    // every step is boxed: the renderer's.
    presentation {
        boxAll,
        completedColor,
        inProgressColor,
        notStartedColor,
        completedColorRequiresCredit,
        completedColorDarkMode,
        inProgressColorDarkMode,
        notStartedColorDarkMode,
    }
    attributes {
        revealAll: LiteralFlag,
        hideFutureSections: LiteralFlag,
    }
    planner: Plan(plan),
}

/// A cascade's flags: `revealAll` its own literal, else the nearest
/// cascade around it's, else off; `hideFutureSections` its own literal. A
/// `<title>` in it, which it does not show, is warned of. (The section
/// attributes a cascade no longer has, the parser drops with a warning.)
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let literal = |name: &str, value: Option<Option<bool>>| -> Result<Option<f64>> {
        match value {
            None => Ok(None),
            Some(Some(on)) => Ok(Some(f64::from(on))),
            Some(None) => Err(Error::Unsupported(format!(
                "'{name}' on a <cascade> must be a literal: it decides which steps are shown"
            ))),
        }
    };
    let reveal_all = match literal("revealAll", attrs.revealAll)? {
        Some(v) => Wire::constant(v),
        None => match ctx.ancestor_prop(|ty| ty == ComponentType::Cascade, "revealAll") {
            Some(Some(around)) => around.into(),
            _ => Wire::constant(0.0),
        },
    };
    let future = literal("hideFutureSections", attrs.hideFutureSections)?.unwrap_or(0.0);
    if ctx.last_child_text(ComponentType::Title).is_some() {
        ctx.warn(
            "cells-cascade-title",
            "A <title> in a <cascade> is not shown: a cascade has no heading. Wrap the cascade in a <section> to give it one.",
        );
    }
    let mut wiring = ElemWiring::of(ComponentType::Cascade);
    wiring.set_planned(Planned {
        revealAll: reveal_all,
        hideFutureSections: Wire::constant(future),
    });
    Ok(wiring)
}

containers! {
    /// `<cascadeMessage>`: a block a cascade shows for the gap between the
    /// steps it shows and those it holds back, one per gap; inside a step,
    /// the message for that step while it is the next held back.
    cascade_message: ["cascadeMessage"];
}

/// `<cascadeMessage>`'s definition, specified beside the cascade's.
pub(crate) const MESSAGE: crate::components::ComponentDef = cascade_message::DEFINITION;

#[cfg(all(test, feature = "testing"))]
#[path = "cascade.spec.rs"]
mod spec;

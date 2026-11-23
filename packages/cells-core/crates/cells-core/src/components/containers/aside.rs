//! `<aside>`: a collapsible block, numbered among the divisions around it
//! as the current core numbers it ("Aside 2"; `Sectioning.js`, an aside is a
//! division numbered with its siblings).

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<aside>`: a collapsible block whose `<title>` is the summary,
    /// numbered among its sibling sections, whatever their tag, as a
    /// section is (`number`, an aggregate). The renderer reads
    /// `startOpen`; the parser, `postponeRendering`.
    tags: ["aside"],
    flags: [container],
    numbered: Titled(includeParentNumber, label, title_word),
    props {
        number: aggregate(Count, SectionsThrough) { rendered },
        includeParentNumber: by_planner { rendered },
        label: by_planner,
    }
    presentation { startOpen, postponeRendering }
    attributes {
        includeParentNumber: LiteralFlag,
    }
    planner: Plan(plan),
}

/// The word an aside's title shows.
fn title_word(_label: usize) -> &'static str {
    "Aside"
}

/// An aside's `includeParentNumber`, a literal (off unless given), and its
/// `label`, which has one word.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let include = match attrs.includeParentNumber {
        None => 0.0,
        Some(Some(on)) => f64::from(on),
        Some(None) => {
            return Err(crate::error::Error::Unsupported(
                "'includeParentNumber' on an <aside> must be a literal: it decides how it is numbered"
                    .into(),
            ));
        }
    };
    let mut wiring = ElemWiring::of(ComponentType::Aside);
    wiring.set_planned(Planned {
        includeParentNumber: Wire::constant(include),
        label: Wire::constant(0.0),
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "aside.spec.rs"]
mod spec;

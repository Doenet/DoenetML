//! `<video>`: a video laid out in the flow of the document (ADR 0078,
//! [`super::media`]).

use super::media::layout;
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<video youtube="..."/>`: a video, its `size` a preset (`full` by
    /// default, else the nearest to `width`), its `width` in pixels,
    /// `horizontalAlign` and `displayMode`. It needs a
    /// `<shortDescription>`.
    tags: ["video"],
    flags: [copyable],
    needs: ShortDescription,
    list_item: Top,
    props {
        size: by_planner,
        width: by_planner { rendered },
        horizontalAlign: by_planner { rendered },
        displayMode: by_planner { rendered },
        youtube: by_planner { rendered },
        source: by_planner { rendered },
    }
    attributes {
        size: Text,
        width: Text,
        horizontalAlign: Text,
        displayMode: Text,
        youtube: Text,
        source: Text,
    }
    planner: Plan(plan),
}

/// Its layout settled from its literal attributes, and its source.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let l = layout(
        ctx,
        [
            attrs.size.as_deref(),
            attrs.width.as_deref(),
            attrs.horizontalAlign.as_deref(),
            attrs.displayMode.as_deref(),
        ],
        [
            attr::size,
            attr::width,
            attr::horizontalAlign,
            attr::displayMode,
        ],
        "full",
    );
    let youtube = ctx.intern(attrs.youtube.as_deref().unwrap_or("").trim());
    let source = ctx.intern(attrs.source.as_deref().unwrap_or("").trim());
    let mut wiring = ElemWiring::of(ctx.component_type());
    wiring.set_planned(Planned {
        size: l.size,
        width: l.width,
        horizontalAlign: l.horizontal_align,
        displayMode: l.display_mode,
        youtube: Wire::given_text(GivenId::Attr(attr::youtube, 0), youtube),
        source: Wire::given_text(GivenId::Attr(attr::source, 0), source),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "video.spec.rs"]
mod spec;

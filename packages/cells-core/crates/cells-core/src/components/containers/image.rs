//! `<image>`: an image laid out in the flow of the document (ADR 0078,
//! [`super::media`]).

use super::media::layout;
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<image source="..." size="small"/>`: an image, its `size` a
    /// preset (`medium` by default, else the nearest to `width`), its
    /// `width` in pixels, `horizontalAlign` and `displayMode`;
    /// `decorative` when it describes nothing, else it needs a
    /// `<shortDescription>`.
    tags: ["image"],
    flags: [copyable],
    needs: Description,
    props {
        size: by_planner,
        width: by_planner { rendered },
        horizontalAlign: by_planner { rendered },
        displayMode: by_planner { rendered },
        decorative: by_planner { rendered },
        rotate: by_planner { rendered },
        source: by_planner { rendered },
        aspectRatio: by_planner { rendered },
    }
    attributes {
        size: Text,
        width: Text,
        horizontalAlign: Text,
        displayMode: Text,
        decorative: Flag(false),
        rotate: Scalar,
        source: Text,
        aspectRatio: Scalar,
    }
    planner: Plan(plan),
}

/// Its layout settled from its literal attributes; its rotation and
/// aspect ratio values.
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
        "medium",
    );
    let source = ctx.intern(attrs.source.as_deref().unwrap_or("").trim());
    let mut wiring = ElemWiring::of(ctx.component_type());
    wiring.set_planned(Planned {
        size: l.size,
        width: l.width,
        horizontalAlign: l.horizontal_align,
        displayMode: l.display_mode,
        decorative: Wire::scalar(attrs.decorative, GivenId::Attr(attr::decorative, 0)),
        rotate: Wire::attr(attr::rotate, attrs.rotate)
            .unwrap_or_else(|| Wire::given_by(attr::rotate, 0.0)),
        source: Wire::given_text(GivenId::Attr(attr::source, 0), source),
        aspectRatio: Wire::attr(attr::aspectRatio, attrs.aspectRatio).unwrap_or_else(Wire::absent),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "image.spec.rs"]
mod spec;

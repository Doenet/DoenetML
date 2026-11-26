//! Document-structure blocks beside the numbered divisions: a proof, a
//! solution, the introduction, conclusion and statement of a division, a
//! figure and its caption, a footnote, and the wrapper the parser puts a
//! solution's content in.
//!
//! Each is a container with few or no props of its own: how it looks is the
//! renderer's. What the core cares about is whether the sections inside it
//! are numbered among the sections around it: through an introduction, a
//! conclusion or a statement they are (each passes the divisions' sequence
//! through, as a `<div>` does; ADR 0054); a proof, a solution or a figure numbers its own
//! sections from 1 and takes no number among its siblings.
//!
//! A figure's number ("Figure 2", shared with the tables) and a footnote's
//! (its marker 3) run through the whole document, apart from the sections:
//! each declares the counter it advances
//! ([`Counted`](crate::components::Counted)), and the document counts
//! when it is asked (ADR 0044).

#[cfg(all(test, feature = "testing"))]
#[path = "proof.spec.rs"]
mod proof_spec;

#[cfg(all(test, feature = "testing"))]
#[path = "solution.spec.rs"]
mod solution_spec;

#[cfg(all(test, feature = "testing"))]
#[path = "introduction.spec.rs"]
mod introduction_spec;

#[cfg(all(test, feature = "testing"))]
#[path = "conclusion.spec.rs"]
mod conclusion_spec;

#[cfg(all(test, feature = "testing"))]
#[path = "statement.spec.rs"]
mod statement_spec;

#[cfg(all(test, feature = "testing"))]
#[path = "figure.spec.rs"]
mod figure_spec;

#[cfg(all(test, feature = "testing"))]
#[path = "caption.spec.rs"]
mod caption_spec;

#[cfg(all(test, feature = "testing"))]
#[path = "footnote.spec.rs"]
mod footnote_spec;

#[cfg(all(test, feature = "testing"))]
#[path = "page.spec.rs"]
mod page_spec;

#[cfg(all(test, feature = "testing"))]
#[path = "postpone_render_container.spec.rs"]
mod postpone_render_container_spec;

containers! {

    /// `<solution>`: a block the reader reveals; `open` is its own state
    /// (0 or 1). The sections inside it are numbered among themselves.
    solution: ["solution"] {
        props {
            open: attr(0.0) { interactive, rendered },
        }
    };

    /// `<introduction>`: the opening block of a division, a `<div>`
    /// to the numbering: a section inside it is numbered among the
    /// sections around it (ADR 0054).
    introduction: ["introduction"] with [passes_divisions];

    /// `<conclusion>`: the closing block of a division, numbered
    /// through as an `<introduction>` is.
    conclusion: ["conclusion"] with [passes_divisions];

    /// `<statement>`: the statement of a problem or a theorem,
    /// numbered through as an `<introduction>` is.
    statement: ["statement"] with [passes_divisions];

    /// `<page>`: the content of one printed page, on screen a block
    /// around its children. Both sequences pass through it (ADR 0058): a
    /// section inside it is numbered as if written beside it, and the
    /// problems each on a page in a `<problems>` are its items.
    page: ["page"] with [passes_both];

    /// `<figure>`: its content, then its `<caption>` under its name,
    /// "Figure 2", its number shared with the tables (ADR 0044) unless
    /// `number="false"`.
    figure: ["figure"] {
        list_item: Wrapper,
        counted: Figures(number),
        props {
            number: attr(1.0) { rendered },
        }
        presentation { suppressFigureNameInCaption }
    };

    /// `<caption>`: the caption of the figure it sits in.
    caption: ["caption"] {
        list_item: Naming,
    };

    /// `_postponeRenderContainer`: what the parser wraps a solution's
    /// content in (a proof's or an aside's with `postponeRendering`), so
    /// the current core makes it only once opened. Here it is built
    /// with the rest and looked through; drawing it only when open is
    /// the renderer's.
    postpone_render_container: ["_postponeRenderContainer"] {
        structure: Transparent,
    };

    /// `<footnote>`: a marker in the text, its number among the
    /// document's footnotes (ADR 0044), whose content is shown on
    /// demand.
    footnote: ["footnote"] {
        counted: Footnotes,
    };
}

/// `<proof>`: its definition and its planner.
pub(crate) mod proof {
    use crate::compile::api::*;
    use crate::components::ComponentType;
    use crate::components::define::*;
    use crate::error::Result;

    component! {
        /// `<proof>`: a division with a heading, collapsed until opened
        /// (`startOpen`), that takes no number: the sections inside it are
        /// numbered among themselves. It takes a place among its parent's
        /// list items, as every sectioning component does (ADR 0054).
        tags: ["proof"],
        flags: [container, unnumbered_division, style_scope, collapsible],
        props {
            // Collapsible and closed unless it says otherwise (ADR 0084).
            collapsible: by_planner { rendered },
            openState: by_planner { interactive, rendered },
            notCollapsible: computed(OpSpec::Not, [collapsible]),
            open: computed(OpSpec::Max, [notCollapsible, openState]),
        }
        presentation { boxed, postponeRendering }
        attributes {
            collapsible: Flag(true),
            startOpen: Flag(false),
        }
        planner: Plan(plan),
    }

    /// Its `collapsible` and its open state, from `startOpen`.
    pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
        let attrs = Attrs::of(ctx.record());
        let mut wiring = ElemWiring::of(ComponentType::Proof);
        wiring.set_planned(Planned {
            collapsible: Wire::scalar(attrs.collapsible, GivenId::Attr(attr::collapsible, 0)),
            openState: Wire::scalar(attrs.startOpen, GivenId::Attr(attr::startOpen, 0)),
        });
        Ok(wiring)
    }
}

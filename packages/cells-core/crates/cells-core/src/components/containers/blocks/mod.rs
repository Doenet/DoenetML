//! Document-structure blocks beside the numbered divisions: a proof, a
//! solution, the introduction, conclusion and statement of a division, a
//! figure and its caption, a footnote, and the wrapper the parser puts a
//! solution's content in.
//!
//! Each is a container with few or no props of its own: how it looks is the
//! renderer's. What the core cares about is whether the sections inside it
//! are numbered among the sections around it: through an introduction, a
//! conclusion or a statement they are (each is structure, as a `<div>` is in
//! the current core); a proof, a solution or a figure numbers its own
//! sections from 1 and takes no number among its siblings.
//!
//! A figure's number ("Figure 2") and a footnote's (its marker 3) run through the
//! whole document, apart from the sections, in the current core; the core
//! here numbers a component only among its sibling sections
//! ([`Numbered`](crate::components::Numbered)), so neither is numbered.

use super::super::define::*;

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
#[path = "postpone_render_container.spec.rs"]
mod postpone_render_container_spec;

pub(crate) mod proof {
    use super::*;

    component! {
        /// `<proof>`: a division with a heading, collapsed until opened
        /// (`startOpen`), that takes no number: the sections inside it are
        /// numbered among themselves.
        tags: ["proof"],
        flags: [container],
        presentation { startOpen, boxed, postponeRendering }
        planner: Props,
    }
}

pub(crate) mod solution {
    use super::*;

    component! {
        /// `<solution>`: a block the reader reveals; `open` is its own state
        /// (0 or 1). The sections inside it are numbered among themselves.
        tags: ["solution"],
        flags: [container],
        props {
            open: attr(0.0) { interactive, rendered },
        }
        planner: Props,
    }
}

pub(crate) mod introduction {
    use super::*;

    component! {
        /// `<introduction>`: the opening block of a division, looked
        /// through: a section inside it is numbered among the sections
        /// around it.
        tags: ["introduction"],
        flags: [container],
        structure: Transparent,
        planner: Props,
    }
}

pub(crate) mod conclusion {
    use super::*;

    component! {
        /// `<conclusion>`: the closing block of a division, looked through
        /// as an `<introduction>` is.
        tags: ["conclusion"],
        flags: [container],
        structure: Transparent,
        planner: Props,
    }
}

pub(crate) mod statement {
    use super::*;

    component! {
        /// `<statement>`: the statement of a problem or a theorem, looked
        /// through as an `<introduction>` is.
        tags: ["statement"],
        flags: [container],
        structure: Transparent,
        planner: Props,
    }
}

pub(crate) mod figure {
    use super::*;

    component! {
        /// `<figure>`: its content, then its `<caption>` under the word
        /// "Figure". Unnumbered here (see the module).
        tags: ["figure"],
        flags: [container],
        presentation { suppressFigureNameInCaption }
        planner: Props,
    }
}

pub(crate) mod caption {
    use super::*;

    component! {
        /// `<caption>`: the caption of the figure it sits in.
        tags: ["caption"],
        flags: [container],
        planner: Props,
    }
}

pub(crate) mod postpone_render_container {
    use super::*;

    component! {
        /// `_postponeRenderContainer`: what the parser wraps a solution's
        /// content in (a proof's or an aside's with `postponeRendering`), so
        /// the current core makes it only once opened. Here it is built
        /// with the rest and looked through; drawing it only when open is
        /// the renderer's.
        tags: ["_postponeRenderContainer"],
        flags: [container],
        structure: Transparent,
        planner: Props,
    }
}

pub(crate) mod footnote {
    use super::*;

    component! {
        /// `<footnote>`: a marker in the text whose content is shown on
        /// demand. Unnumbered here (see the module).
        tags: ["footnote"],
        flags: [container],
        planner: Props,
    }
}

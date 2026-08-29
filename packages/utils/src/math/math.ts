/**
 * How an unfilled input embedded in typeset math appears in the expression's
 * `latex`.
 *
 * An input written inside `<m>` is drawn where it is written, so what `latex`
 * says about it is a separate question from what the reader sees: `latex` is
 * the expression as a standalone thing, and it is what a PreTeXt export writes
 * out. A filled-in input contributes its value there; an empty one contributes
 * this, because contributing *nothing* does not leave a gap so much as delete a
 * term — `x = ␣ + 3` collapses to `x =  + 3`, in which the `+` is no longer an
 * operator but a sign.
 *
 * Shared rather than local because two packages have to agree on it: the worker
 * writes it into `latex`, and the PreTeXt exporter reads it back out to emit a
 * `<fillin>` in its place.
 */
export const MATH_BLANK_LATEX = "\\underline{\\hspace{2em}}";

/**
 * Configuration staged as `window.MathJax` for the MathJax copy Doenet loads.
 *
 * When a host page already provides MathJax, Doenet reuses that engine rather
 * than clobbering it, so this object is never staged there. The `macros` and the
 * `tex.packages` added below are applied to such an engine after the fact
 * instead, by the priming step in `loadMathJax` — whose `\require` both fetches
 * an added package and enables it, covering the `loader.load` entry too. The
 * remaining options (`tags`, `displayMath`, `output`) stay the host's to decide,
 * so e.g. long displayed equations do not line-break on a host engine.
 */
export const mathjaxConfig = {
    loader: {
        // The `units` package is neither bundled into the combined component
        // we load nor reachable through `autoload`, so it has to be requested
        // by name. MathJax fetches it during startup, from the same place it
        // gets the rest of its components.
        //
        // `html` is reachable through `autoload`, so naming it is not what
        // makes `\cssId` work here — it is what makes it work on a host page
        // that supplies its own MathJax configured without `autoload`. A
        // package named in `packages` below must be loaded here too, or MathJax
        // fails to enable it at startup.
        load: ["[tex]/units", "[tex]/html"],
    },
    tex: {
        tags: "ams",
        // `[+]` adds to MathJax's default package list rather than replacing
        // it. `units` supplies `\units`, `\unitfrac`, and `\nicefrac`, so that
        // units can be typeset semantically instead of hand-spaced. `html`
        // supplies `\cssId`, which is how an input embedded in an expression
        // finds the space reserved for it; it is normally autoloaded, but
        // naming it here is also what gets it requested on a host page that
        // configures its own package list without `autoload`.
        packages: { "[+]": ["units", "html"] },
        macros: {
            lt: "<",
            gt: ">",
            amp: "&",
            var: ["\\mathrm{#1}", 1],
            csch: "\\operatorname{csch}",
            sech: "\\operatorname{sech}",
            erf: "\\operatorname{erf}",
        },
        displayMath: [["\\[", "\\]"]],
    },
    output: {
        displayOverflow: "linebreak",
    },
};

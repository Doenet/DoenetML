/**
 * Configuration staged as `window.MathJax` for the MathJax copy Doenet loads.
 *
 * When a host page already provides MathJax, Doenet reuses that engine rather
 * than clobbering it, so this object is never staged there. The `macros` and the
 * `tex.packages` added below are applied to such an engine after the fact
 * instead, by the priming step in `loadMathJax`; the remaining options
 * (`tags`, `displayMath`, `output`) stay the host's to decide.
 */
export const mathjaxConfig = {
    loader: {
        // The `units` package is neither bundled into the combined component
        // we load nor reachable through `autoload`, so it has to be requested
        // by name. MathJax fetches it during startup, from the same place it
        // gets the rest of its components.
        load: ["[tex]/units"],
    },
    tex: {
        tags: "ams",
        // `[+]` adds to MathJax's default package list rather than replacing
        // it. `units` supplies `\units`, `\unitfrac`, and `\nicefrac`, so that
        // units can be typeset semantically instead of hand-spaced.
        packages: { "[+]": ["units"] },
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

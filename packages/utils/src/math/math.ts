/**
 * Configuration staged as `window.MathJax` for the MathJax copy Doenet loads.
 *
 * Note that this only governs *our* engine: when a host page already provides
 * MathJax, Doenet reuses it and this configuration is not applied (see
 * `loadMathJax`). Authors on such a page can still reach the extensions below
 * with MathJax's `\require`, e.g. `\require{units}`.
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

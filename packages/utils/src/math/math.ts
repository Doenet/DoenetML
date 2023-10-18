export const mathjaxConfig = {
    showProcessingMessages: false,
    "fast-preview": {
        disabled: true,
    },
    jax: ["input/TeX", "output/CommonHTML"],
    extensions: [
        "tex2jax.js",
        "MathMenu.js",
        "MathZoom.js",
        "AssistiveMML.js",
        "a11y/accessibility-menu.js",
    ],
    TeX: {
        extensions: [
            "AMSmath.js",
            "AMSsymbols.js",
            "noErrors.js",
            "noUndefined.js",
        ],
        equationNumbers: {
            autoNumber: "AMS",
        },
        Macros: {
            lt: "<",
            gt: ">",
            amp: "&",
            var: ["\\mathrm{#1}", 1],
            csch: "\\operatorname{csch}",
            sech: "\\operatorname{sech}",
        },
    },
    tex2jax: {
        displayMath: [["\\[", "\\]"]],
    },
};

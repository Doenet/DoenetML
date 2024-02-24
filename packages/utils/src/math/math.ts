
export const mathjaxConfig = 
{
    tex: {
      tags: "ams",
      macros: {
        lt: "<",
        gt: ">",
        amp: "&",
        var: ["\\mathrm{#1}", 1],
        csch: "\\operatorname{csch}",
        sech: "\\operatorname{sech}"
      },
      displayMath: [["\\[", "\\]"]],
      packages: ['base', 'ams', 'noerrors', 'noundefined']
    },
    options: {
      ignoreHtmlClass: 'tex2jax_ignore',
      processHtmlClass: 'tex2jax_process'
    },
    loader: {
      load: ['[tex]/noerrors']
    }
  };

export const mathjaxConfigOld = 
    {
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

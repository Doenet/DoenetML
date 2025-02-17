export const mathjaxConfig = {
    tex: {
        tags: "ams",
        macros: {
            lt: "<",
            gt: ">",
            amp: "&",
            var: ["\\mathrm{#1}", 1],
            csch: "\\operatorname{csch}",
            sech: "\\operatorname{sech}",
        },
        displayMath: [["\\[", "\\]"]],
        packages: ["base", "ams", "noerrors", "noundefined", "configmacros"],
    },
    options: {
        ignoreHtmlClass: "tex2jax_ignore",
        processHtmlClass: "tex2jax_process",
    },
    loader: {
        load: ["[tex]/noerrors"],
    },
};

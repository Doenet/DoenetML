import * as fs from "node:fs/promises";

const destUrl = new URL("../src/generated/math-assets.json", import.meta.url);

const appliedFunctionSymbolsDefault = [
    "abs",
    "exp",
    "log",
    "ln",
    "log10",
    "sign",
    "sqrt",
    "erf",
    "cos",
    "cosh",
    "acos",
    "acosh",
    "arccos",
    "arccosh",
    "cot",
    "coth",
    "acot",
    "acoth",
    "arccot",
    "arccoth",
    "csc",
    "csch",
    "acsc",
    "acsch",
    "arccsc",
    "arccsch",
    "sec",
    "sech",
    "asec",
    "asech",
    "arcsec",
    "arcsech",
    "sin",
    "sinh",
    "asin",
    "asinh",
    "arcsin",
    "arcsinh",
    "tan",
    "tanh",
    "atan",
    "atan2",
    "atanh",
    "arctan",
    "arctanh",
    "arg",
    "min",
    "max",
    "mean",
    "median",
    "floor",
    "ceil",
    "round",
    "sum",
    "prod",
    "variance",
    "std",
    "count",
    "mod",
    "re",
    "im",
    "det",
    "trace",
    "nPr",
    "nCr",
];

const appliedFunctionSymbolsDefaultLatex = [
    "abs",
    "exp",
    "log",
    "ln",
    "log10",
    "sign",
    "sqrt",
    "erf",
    "cos",
    "cosh",
    "acos",
    "acosh",
    "arccos",
    "arccosh",
    "cot",
    "coth",
    "acot",
    "acoth",
    "arccot",
    "arccoth",
    "csc",
    "csch",
    "acsc",
    "acsch",
    "arccsc",
    "arccsch",
    "sec",
    "sech",
    "asec",
    "asech",
    "arcsec",
    "arcsech",
    "sin",
    "sinh",
    "asin",
    "asinh",
    "arcsin",
    "arcsinh",
    "tan",
    "tanh",
    "atan",
    "atan2",
    "atanh",
    "arctan",
    "arctanh",
    "arg",
    "min",
    "max",
    "mean",
    "median",
    "floor",
    "ceil",
    "round",
    "sum",
    "prod",
    "variance",
    "std",
    "count",
    "mod",
    "Re",
    "Im",
    "det",
    "trace",
    "nPr",
    "nCr",
];

const allowedLatexSymbols = [
    "alpha",
    "beta",
    "gamma",
    "Gamma",
    "delta",
    "Delta",
    "epsilon",
    "zeta",
    "eta",
    "theta",
    "Theta",
    "iota",
    "kappa",
    "lambda",
    "Lambda",
    "mu",
    "nu",
    "xi",
    "Xi",
    "pi",
    "Pi",
    "rho",
    "sigma",
    "Sigma",
    "tau",
    "Tau",
    "upsilon",
    "Upsilon",
    "phi",
    "Phi",
    "chi",
    "psi",
    "Psi",
    "omega",
    "Omega",
    "partial",
    "varnothing",
    "emptyset",
    "angle",
    "circ",
    "$",
    "%",
];

const latexSubstitutions = {
    "\u03B1": "\\alpha ", // 'α'
    "\u03B2": "\\beta ", // 'β'
    "\u03D0": "\\beta ", // 'ϐ'
    "\u0393": "\\Gamma ", // 'Γ'
    "\u03B3": "\\gamma ", // 'γ'
    "\u0394": "\\Delta ", // 'Δ'
    "\u03B4": "\\delta ", // 'δ'
    "\u03B5": "\\epsilon ", // 'ε' should this be varepsilon?
    "\u03F5": "\\epsilon ", // 'ϵ'
    "\u03B6": "\\zeta ", // 'ζ'
    "\u03B7": "\\eta ", // 'η'
    "\u0398": "\\Theta ", // 'Θ'
    "\u03F4": "\\Theta ", // 'ϴ'
    "\u03B8": "\\theta ", // 'θ'
    "\u1DBF": "\\theta ", // 'ᶿ'
    "\u03D1": "\\theta ", // 'ϑ'
    "\u03B9": "\\iota ", // 'ι'
    "\u03BA": "\\kappa ", // 'κ'
    "\u039B": "\\Lambda ", // 'Λ'
    "\u03BB": "\\lambda ", // 'λ'
    "\u03BC": "\\mu ", // 'μ'
    "\u00B5": "\\mu ", // 'µ' should this be micro?
    "\u03BD": "\\nu ", // 'ν'
    "\u039E": "\\Xi ", // 'Ξ'
    "\u03BE": "\\xi ", // 'ξ'
    "\u03A0": "\\Pi ", // 'Π'
    "\u03C0": "\\pi ", // 'π'
    "\u03D6": "\\pi ", // 'ϖ' should this be varpi?
    "\u03C1": "\\rho ", // 'ρ'
    "\u03F1": "\\rho ", // 'ϱ' should this be varrho?
    "\u03A3": "\\Sigma ", // 'Σ'
    "\u03C3": "\\sigma ", // 'σ'
    "\u03C2": "\\sigma ", // 'ς' should this be varsigma?
    "\u03C4": "\\tau ", // 'τ'
    "\u03A5": "\\Upsilon ", // 'Υ'
    "\u03C5": "\\upsilon ", // 'υ'
    "\u03A6": "\\Phi ", // 'Φ'
    "\u03C6": "\\phi ", // 'φ' should this be varphi?
    "\u03D5": "\\phi ", // 'ϕ'
    "\u03A8": "\\Psi ", // 'Ψ'
    "\u03C8": "\\psi ", // 'ψ'
    "\u03A9": "\\Omega ", // 'Ω'
    "\u03C9": "\\omega ", // 'ω'
    "\u2212": "-", // minus sign
    "\u22C5": " \\cdot ", // dot operator
    "\u00B7": " \\cdot ", // middle dot
    "\u222A": " \\cup ", // ∪
    "\u2229": " \\cap ", // ∩
    "\u221E": " \\infty ", // ∞
    "\u2205": " \\emptyset ", // ∅
    "\u2032": "'", // ′
};

const mathAssets = {
    appliedFunctionSymbolsDefault,
    appliedFunctionSymbolsDefaultLatex,
    allowedLatexSymbols,
    latexSubstitutions,
};

console.log("Writing math assets to", destUrl.pathname);

await fs.writeFile(destUrl.pathname, JSON.stringify(mathAssets, null, 4));

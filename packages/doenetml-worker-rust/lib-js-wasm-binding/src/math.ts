// @ts-ignore
import me from "math-expressions";

import { vectorOperators } from "@doenet/utils";

export var appliedFunctionSymbolsDefault = [
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

export var appliedFunctionSymbolsDefaultLatex = [
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

let allowedLatexSymbols = [
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

export var textToAst = new me.converters.textToAstObj({
    appliedFunctionSymbols: appliedFunctionSymbolsDefault,
});

export function getTextToMathConverter({
    functionSymbols,
    appliedFunctionSymbols = appliedFunctionSymbolsDefault,
    splitSymbols = true,
    parseScientificNotation = false,
}: {
    functionSymbols?: string[];
    appliedFunctionSymbols?: string[];
    splitSymbols?: boolean;
    parseScientificNotation?: boolean;
} = {}) {
    return (x: string) =>
        me.fromAst(
            new me.converters.textToAstObj({
                appliedFunctionSymbols,
                functionSymbols,
                splitSymbols,
                parseScientificNotation,
            }).convert(x),
        );
}

export var latexToAst = new me.converters.latexToAstObj({
    appliedFunctionSymbols: appliedFunctionSymbolsDefaultLatex,
    allowedLatexSymbols,
});

export function getLatexToMathConverter({
    functionSymbols,
    appliedFunctionSymbols = appliedFunctionSymbolsDefaultLatex,
    splitSymbols = true,
    parseScientificNotation = false,
}: {
    functionSymbols?: string[];
    appliedFunctionSymbols?: string[];
    splitSymbols?: boolean;
    parseScientificNotation?: boolean;
} = {}) {
    if (splitSymbols) {
        return (x: string) =>
            me.fromAst(
                new me.converters.latexToAstObj({
                    appliedFunctionSymbols,
                    functionSymbols,
                    allowedLatexSymbols,
                    parseScientificNotation,
                }).convert(
                    wrapWordIncludingNumberWithVar(x, parseScientificNotation),
                ),
            );
    } else {
        return (x: string) =>
            me.fromAst(
                new me.converters.latexToAstObj({
                    appliedFunctionSymbols,
                    functionSymbols,
                    allowedLatexSymbols,
                    parseScientificNotation,
                }).convert(wrapWordWithVar(x, parseScientificNotation)),
            );
    }
}

export function normalizeLatexString(
    latexString: string,
    { unionFromU = false } = {},
) {
    let substitutions = [
        ["\u03B1", "\\alpha "], // 'α'
        ["\u03B2", "\\beta "], // 'β'
        ["\u03D0", "\\beta "], // 'ϐ'
        ["\u0393", "\\Gamma "], // 'Γ'
        ["\u03B3", "\\gamma "], // 'γ'
        ["\u0394", "\\Delta "], // 'Δ'
        ["\u03B4", "\\delta "], // 'δ'
        ["\u03B5", "\\epsilon "], // 'ε' should this be varepsilon?
        ["\u03F5", "\\epsilon "], // 'ϵ'
        ["\u03B6", "\\zeta "], // 'ζ'
        ["\u03B7", "\\eta "], // 'η'
        ["\u0398", "\\Theta "], // 'Θ'
        ["\u03F4", "\\Theta "], // 'ϴ'
        ["\u03B8", "\\theta "], // 'θ'
        ["\u1DBF", "\\theta "], // 'ᶿ'
        ["\u03D1", "\\theta "], // 'ϑ'
        ["\u03B9", "\\iota "], // 'ι'
        ["\u03BA", "\\kappa "], // 'κ'
        ["\u039B", "\\Lambda "], // 'Λ'
        ["\u03BB", "\\lambda "], // 'λ'
        ["\u03BC", "\\mu "], // 'μ'
        ["\u00B5", "\\mu "], // 'µ' should this be micro?
        ["\u03BD", "\\nu "], // 'ν'
        ["\u039E", "\\Xi "], // 'Ξ'
        ["\u03BE", "\\xi "], // 'ξ'
        ["\u03A0", "\\Pi "], // 'Π'
        ["\u03C0", "\\pi "], // 'π'
        ["\u03D6", "\\pi "], // 'ϖ' should this be varpi?
        ["\u03C1", "\\rho "], // 'ρ'
        ["\u03F1", "\\rho "], // 'ϱ' should this be varrho?
        ["\u03A3", "\\Sigma "], // 'Σ'
        ["\u03C3", "\\sigma "], // 'σ'
        ["\u03C2", "\\sigma "], // 'ς' should this be varsigma?
        ["\u03C4", "\\tau "], // 'τ'
        ["\u03A5", "\\Upsilon "], // 'Υ'
        ["\u03C5", "\\upsilon "], // 'υ'
        ["\u03A6", "\\Phi "], // 'Φ'
        ["\u03C6", "\\phi "], // 'φ' should this be varphi?
        ["\u03D5", "\\phi "], // 'ϕ'
        ["\u03A8", "\\Psi "], // 'Ψ'
        ["\u03C8", "\\psi "], // 'ψ'
        ["\u03A9", "\\Omega "], // 'Ω'
        ["\u03C9", "\\omega "], // 'ω'
        ["\u2212", "-"], // minus sign
        ["\u22C5", " \\cdot "], // dot operator
        ["\u00B7", " \\cdot "], // middle dot
        ["\u222A", " \\cup "], // ∪
        ["\u2229", " \\cap "], // ∩
        ["\u221E", " \\infty "], // ∞
        ["\u2205", " \\emptyset "], // ∅
        ["\u2032", "'"], // ′
    ];

    for (let sub of substitutions) {
        latexString = latexString.replace(new RegExp(sub[0], "g"), sub[1]);
    }

    let startLdotsMatch = latexString.match(
        /^(\\ )*(\\ldots|\.(\\ )*\.(\\ )*\.)(\\ )*(.*)$/,
    );

    if (startLdotsMatch) {
        let afterLdots = startLdotsMatch[6];
        if (afterLdots[0] !== ",") {
            latexString = "\\ldots," + afterLdots;
        } else {
            latexString = "\\ldots" + afterLdots;
        }
    }

    let endLdotsMatch = latexString.match(
        /^(.*?)(\\ )*(\\ldots|\.(\\ )*\.(\\ )*\.)(\\ )*$/,
    );

    if (endLdotsMatch) {
        let beforeLdots = endLdotsMatch[1];
        if (beforeLdots[beforeLdots.length - 1] !== ",") {
            latexString = beforeLdots + ",\\ldots";
        } else {
            latexString = beforeLdots + "\\ldots";
        }
    }

    // replace [space]or/and/U[space]
    // with latex
    latexString = latexString.replace(/(\b|\\ )or(\b|\\ )/g, "$1\\lor$2");
    latexString = latexString.replace(/(\b|\\ )and(\b|\\ )/g, "$1\\land$2");

    if (unionFromU) {
        latexString = latexString.replace(/(\b|\\ )U(\b|\\ )/g, "$1\\cup$2");
    }

    return latexString;
}

function wrapWordWithVar(string: string, parseScientificNotation: boolean) {
    // wrap words that aren't already in a \operatorname with a \operatorname

    let newString = "";

    let regex = /\\operatorname\s*{[^{}]*}/;
    let match = string.match(regex);
    while (match && match.index !== undefined) {
        let beginMatch = match.index;
        let endMatch = beginMatch + match[0].length;
        newString += wrapWordWithVarSub(
            string.substring(0, beginMatch),
            parseScientificNotation,
        );
        newString += string.substring(beginMatch, endMatch);
        string = string.substring(endMatch);
        match = string.match(regex);
    }
    newString += wrapWordWithVarSub(string, parseScientificNotation);

    return newString;
}

function wrapWordWithVarSub(string: string, parseScientificNotation: boolean) {
    let newString = "";

    const regex = /([^a-zA-Z0-9]?)([a-zA-Z][a-zA-Z0-9]+)([^a-zA-Z0-9]?)/;

    let regexSN;

    if (parseScientificNotation) {
        const sci_notat_exp_regex =
            "(E[+\\-]?[0-9]+\\s*($|(?=\\,|&|\\||\\\\\\||\\)|\\}|\\\\}|\\]|\\\\\\\\|\\\\end)))";
        regexSN = new RegExp(
            "([0-9]+(\\.[0-9]*)?" +
                sci_notat_exp_regex +
                ")|(\\.[0-9]+" +
                sci_notat_exp_regex +
                ")",
        );
    }

    let match = string.match(regex);
    while (match && match.index !== undefined) {
        let beginMatch = match.index;
        let endMatch = beginMatch + match[0].length - match[3].length;
        if (regexSN) {
            let matchSN = string.match(regexSN);
            if (
                matchSN &&
                matchSN.index !== undefined &&
                matchSN.index < endMatch &&
                matchSN.index + matchSN[0].length > beginMatch
            ) {
                // skip because is part of scientific notation
                newString += string.substring(0, endMatch);
                string = string.substring(endMatch);
                match = string.match(regex);
                continue;
            }
        }
        if (match[1] === "\\") {
            // start with backslash, so skip
            newString += string.substring(0, endMatch);
            string = string.substring(endMatch);
        } else {
            let beginWord = beginMatch + match[1].length;
            newString += string.substring(0, beginWord);
            newString += `\\operatorname{${match[2]}}`;
            string = string.substring(endMatch);
        }

        match = string.match(regex);
    }

    newString += string;

    return newString;
}

function wrapWordIncludingNumberWithVar(
    string: string,
    parseScientificNotation: boolean,
) {
    let newString = "";

    let regex = /\\operatorname\s*{[^{}]*}/;
    let match = string.match(regex);
    while (match && match.index !== undefined) {
        let beginMatch = match.index;
        let endMatch = beginMatch + match[0].length;
        newString += wrapWordIncludingNumberWithVarSub(
            string.substring(0, beginMatch),
            parseScientificNotation,
        );
        newString += string.substring(beginMatch, endMatch);
        string = string.substring(endMatch);
        match = string.match(regex);
    }
    newString += wrapWordIncludingNumberWithVarSub(
        string,
        parseScientificNotation,
    );

    return newString;
}

function wrapWordIncludingNumberWithVarSub(
    string: string,
    parseScientificNotation: boolean,
) {
    let newString = "";

    const regex =
        /([^a-zA-Z0-9\s]?\s*)([a-zA-Z][a-zA-Z0-9]*[0-9][a-zA-Z0-9]*)([^a-zA-Z0-9]?)/;

    let regexSN;

    if (parseScientificNotation) {
        const sci_notat_exp_regex =
            "(E[+\\-]?[0-9]+\\s*($|(?=\\,|&|\\||\\\\\\||\\)|\\}|\\\\}|\\]|\\\\\\\\|\\\\end)))";
        regexSN = new RegExp(
            "([0-9]+(\\.[0-9]*)?" +
                sci_notat_exp_regex +
                ")|(\\.[0-9]+" +
                sci_notat_exp_regex +
                ")",
        );
    }

    let match = string.match(regex);
    while (match && match.index !== undefined) {
        let beginMatch = match.index;
        let endMatch = beginMatch + match[0].length - match[3].length;
        if (regexSN) {
            let matchSN = string.match(regexSN);
            if (
                matchSN &&
                matchSN.index !== undefined &&
                matchSN.index < endMatch &&
                matchSN.index + matchSN[0].length > beginMatch
            ) {
                // skip because is part of scientific notation
                newString += string.substring(0, endMatch);
                string = string.substring(endMatch);
                match = string.match(regex);
                continue;
            }
        }
        if (match[1] === "\\" || match[1][0] === "^" || match[1][0] === "_") {
            // start with backslash or with a ^ or _ and optional space
            // so skip
            newString += string.substring(0, endMatch);
            string = string.substring(endMatch);
        } else {
            let beginWord = beginMatch + match[1].length;
            newString += string.substring(0, beginWord);
            newString += `\\operatorname{${match[2]}}`;
            string = string.substring(endMatch);
        }

        match = string.match(regex);
    }

    newString += string;

    return newString;
}

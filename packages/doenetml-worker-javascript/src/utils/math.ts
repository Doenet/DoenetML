// @ts-ignore
import me from "math-expressions";

import { subsets, vectorOperators } from "@doenet/utils";

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

export function textToMathFactory({
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

export function latexToMathFactory({
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

export function findFiniteNumericalValue(value: any) {
    // return undefined if value is undefined
    // returns null if value has a non-numerical value (including Infinity)
    // otherwise, returns numerical value

    if (value === undefined) {
        return undefined;
    }

    if (Number.isFinite(value)) {
        return value;
    }

    if (value.evaluate_to_constant !== undefined) {
        value = value.evaluate_to_constant();
        if (Number.isFinite(value)) {
            return value;
        }
    }

    // couldn't find numerical value
    return null;
}

export function returnNVariables(n: number, variablesSpecified: any[]) {
    // console.log(`return N variables`, n, variablesSpecified)

    if (!Number.isInteger(n) || n < 1) {
        return [];
    }

    let nVariablesSpecified = variablesSpecified.length;

    if (nVariablesSpecified === 0) {
        if (n === 1) {
            return [me.fromAst("x")];
        } else if (n === 2) {
            return [me.fromAst("x"), me.fromAst("y")];
        } else if (n === 3) {
            return [me.fromAst("x"), me.fromAst("y"), me.fromAst("z")];
        } else {
            let variables = [];
            for (let i = 1; i <= n; i++) {
                variables.push(me.fromAst(textToAst.convert(`x_${i}`)));
            }
            return variables;
        }
    }

    if (
        new Set(variablesSpecified.map((x) => x.toString())).size <
        nVariablesSpecified
    ) {
        console.warn("Duplicate variables specified");
    }

    if (n <= nVariablesSpecified) {
        return variablesSpecified.slice(0, n);
    }

    let variablesUsed = [...variablesSpecified.map((x) => x.toString())];
    let variables = [...variablesSpecified];
    for (let i = nVariablesSpecified + 1; i <= n; i++) {
        let preferredVariables;
        if (i == 1) {
            if (n > 3) {
                preferredVariables = ["x_1"];
            } else {
                preferredVariables = ["x"];
            }
        } else if (i == 2) {
            if (n > 3) {
                preferredVariables = ["x_2", "y_2"];
            } else {
                preferredVariables = ["y", "x_2"];
            }
        } else if (i == 3) {
            if (n > 3) {
                preferredVariables = ["x_3", "y_3", "z_3"];
            } else {
                preferredVariables = ["z", "x_3", "z_3"];
            }
        } else {
            preferredVariables = [
                "x",
                "y",
                "z",
                "u",
                "v",
                "w",
                "X",
                "Y",
                "Z",
            ].map((x) => `${x}_${i}`);
        }
        let addedVariable = false;
        for (let v of preferredVariables) {
            if (!variablesUsed.includes(v)) {
                variables.push(me.fromAst(textToAst.convert(v)));
                variablesUsed.push(v);
                addedVariable = true;
                break;
            }
        }
        if (!addedVariable) {
            let v = preferredVariables[0];
            variables.push(me.fromAst(textToAst.convert(v)));
            variablesUsed.push(v);
            console.warn(`Variables added were not unique`);
        }
    }

    return variables;
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
        ["\u00D7", " \\times "], // times operator
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

    // replace [space]or[space]
    // with \or
    latexString = latexString.replace(/(\b|\\ )or(\b|\\ )/g, "$1\\lor$2");
    latexString = latexString.replace(/(\b|\\ )and(\b|\\ )/g, "$1\\land$2");

    if (unionFromU) {
        latexString = latexString.replace(/(\b|\\ )U(\b|\\ )/g, "$1\\cup$2");
    }

    latexString = removeRepeatedSuperSubScripts(latexString);

    return latexString;
}

export function isValidVariable(expression: {
    tree: any;
    [key: string]: unknown;
}) {
    // to be a valid variable, tree must be either
    // - a string other than long underscore, or
    // - a string with a subscript that is a string or a number
    let tree = expression.tree;
    let validVariable = true;
    if (typeof tree === "string") {
        if (tree === "\uFF3F") {
            // long underscore
            validVariable = false;
        }
    } else if (
        !Array.isArray(tree) ||
        tree[0] !== "_" ||
        typeof tree[1] !== "string" ||
        (typeof tree[2] !== "string" && typeof tree[2] !== "number")
    ) {
        validVariable = false;
    }

    return validVariable;
}

export function mathStateVariableFromNumberStateVariable({
    numberVariableName = "number",
    mathVariableName = "math",
    isPublic = false,
} = {}) {
    let mathDef: any = {
        returnDependencies: () => ({
            number: {
                dependencyType: "stateVariable",
                variableName: numberVariableName,
            },
        }),
        definition: function ({ dependencyValues }: any) {
            return {
                setValue: {
                    [mathVariableName]: numberToMathExpression(
                        dependencyValues.number,
                    ),
                },
            };
        },
        inverseDefinition: function ({ desiredStateVariableValues }: any) {
            let desiredMath = desiredStateVariableValues[mathVariableName];

            let desiredNumber;
            if (desiredMath instanceof me.class) {
                desiredNumber = desiredMath.evaluate_to_constant();
            } else if (typeof desiredMath === "number") {
                desiredNumber = desiredMath;
            } else {
                desiredNumber = NaN;
            }

            return {
                success: true,
                instructions: [
                    {
                        setDependency: "number",
                        desiredValue: desiredNumber,
                    },
                ],
            };
        },
    };

    if (isPublic) {
        mathDef.public = true;
        mathDef.shadowingInstructions = { createComponentOfType: "math" };
    }

    return mathDef;
}

export function numberToMathExpression(
    number: number | { re: number; im: number },
) {
    let mathTree;
    if (typeof number === "number") {
        mathTree = number;
    } else if (
        typeof number?.re === "number" &&
        typeof number?.im === "number"
    ) {
        if (number.im === 0) {
            mathTree = number.re;
        } else {
            let imPart;
            if (number.im === 1) {
                imPart = "i";
            } else if (number.im === -1) {
                imPart = ["-", "i"];
            } else {
                imPart = ["*", number.im, "i"];
            }
            if (number.re === 0) {
                mathTree = imPart;
            } else {
                mathTree = ["+", number.re, imPart];
            }
        }
    } else {
        mathTree = number;
    }
    return me.fromAst(mathTree);
}

export function roundForDisplay({ value, dependencyValues }: any) {
    let rounded = me.round_numbers_to_precision_plus_decimals(
        value,
        dependencyValues.displayDigits,
        dependencyValues.displayDecimals,
    );

    if (
        dependencyValues.displayDigits > 0 &&
        dependencyValues.displaySmallAsZero > 0
    ) {
        rounded = me.set_small_zero(
            rounded,
            dependencyValues.displaySmallAsZero,
        );
    }

    return rounded;
}

export function mergeListsWithOtherContainers(tree: any) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    let operands = tree.slice(1);

    if ([...vectorOperators, "list", "set"].includes(operator)) {
        operands = operands.reduce(
            (a, c) =>
                Array.isArray(c) && c[0] === "list"
                    ? [...a, ...c.slice(1)]
                    : [...a, c],
            [],
        );
    }

    operands = operands.map((x) => mergeListsWithOtherContainers(x));

    return [operator, ...operands];
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

export function stripLatex(latex: string) {
    return latex.replace(/\\,/g, "").replace(/\\operatorname{([^{}]*)}/g, "$1");
}

export function superSubscriptsToUnicode(text: string) {
    let charToSubscriptUnicode = {
        0: "\u2080",
        1: "\u2081",
        2: "\u2082",
        3: "\u2083",
        4: "\u2084",
        5: "\u2085",
        6: "\u2086",
        7: "\u2087",
        8: "\u2088",
        9: "\u2089",
        "+": "\u208A",
        "-": "\u208B",
        " ": "",
    };

    let charToSuperscriptUnicode = {
        0: "\u2070",
        1: "\u00B9",
        2: "\u00B2",
        3: "\u00B3",
        4: "\u2074",
        5: "\u2075",
        6: "\u2076",
        7: "\u2077",
        8: "\u2078",
        9: "\u2079",
        "+": "\u207A",
        "-": "\u207B",
        " ": "",
    };

    function replaceSubscripts(match: string, p1: string) {
        let newVal = "";

        for (let char of p1) {
            // @ts-ignore
            newVal += charToSubscriptUnicode[char];
        }

        return newVal;
    }

    function replaceSuperscripts(match: string, p1: string) {
        let newVal = "";

        for (let char of p1) {
            // @ts-ignore
            newVal += charToSuperscriptUnicode[char];
        }

        return newVal;
    }

    text = text.replace(/_(\d+)(?!\.)/g, replaceSubscripts);
    text = text.replace(/_\(([\d +-]+)\)/g, replaceSubscripts);
    text = text.replace(/\^(\d+)(?!\.)/g, replaceSuperscripts);
    text = text.replace(/\^\(([\d +-]+)\)/g, replaceSuperscripts);

    return text;
}

export function unicodeToSuperSubscripts(text: string) {
    let subscriptUnicodeToChar = {
        "\u2080": "0",
        "\u2081": "1",
        "\u2082": "2",
        "\u2083": "3",
        "\u2084": "4",
        "\u2085": "5",
        "\u2086": "6",
        "\u2087": "7",
        "\u2088": "8",
        "\u2089": "9",
        "\u208A": "+",
        "\u208B": "-",
    };

    let superscriptUnicodeToChar = {
        "\u2070": "0",
        "\u00B9": "1",
        "\u00B2": "2",
        "\u00B3": "3",
        "\u2074": "4",
        "\u2075": "5",
        "\u2076": "6",
        "\u2077": "7",
        "\u2078": "8",
        "\u2079": "9",
        "\u207A": "+",
        "\u207B": "-",
    };

    function replaceSubscripts(match: string, p1: string) {
        let newVal = "";

        for (let char of p1) {
            // @ts-ignore
            newVal += subscriptUnicodeToChar[char];
        }

        return "_(" + newVal + ")";
    }

    function replaceSuperscripts(match: string, p1: string) {
        let newVal = "";

        for (let char of p1) {
            // @ts-ignore
            newVal += superscriptUnicodeToChar[char];
        }

        return "^(" + newVal + ")";
    }

    text = text.replace(
        /([\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089\u208A\u208B]+)/g,
        replaceSubscripts,
    );
    text = text.replace(
        /([\u2070\u00B9\u00B2\u00B3\u2074\u2075\u2076\u2077\u2078\u2079\u207A\u207B]+)/g,
        replaceSuperscripts,
    );

    return text;
}

export function removeFunctionsMathExpressionClass(value: any) {
    if (value instanceof me.class) {
        value = value.tree;
    } else if (typeof value === "function") {
        value = undefined;
    } else if (Array.isArray(value)) {
        value = value.map((x) => removeFunctionsMathExpressionClass(x));
    } else if (
        typeof value === "object" &&
        value !== null &&
        !subsets.isSubset(value)
    ) {
        let valueCopy: any = {};
        for (let key in value) {
            valueCopy[key] = removeFunctionsMathExpressionClass(value[key]);
        }
        value = valueCopy;
    }
    return value;
}

/**
 * Preprocess the desired value within the inverse definition of a math state variable
 * to fill in any any vector components.
 *
 * If the workspace already have values from a previous call to
 * `preprocessMathInverseDefinition` with the current state variable,
 * then use the values from the workspace to fill in empty components.
 * Otherwise, use values from the current value of the state variable
 * to fill in empty components.
 *
 * If the desired value is a list, then recurse on the list components,
 * keeping track of the list indices used in order to find the current value
 * of the given list component.
 */
export async function preprocessMathInverseDefinition({
    desiredValue,
    stateValues,
    variableName = "value",
    arrayKey,
    workspace,
    listIndex = [],
}: any) {
    if (desiredValue.tree[0] === "list") {
        let newAst = ["list"];
        for (let [ind, entry] of desiredValue.tree.slice(1).entries()) {
            let newEntryResult = await preprocessMathInverseDefinition({
                desiredValue: me.fromAst(entry),
                stateValues,
                variableName,
                arrayKey,
                workspace,
                listIndex: [...listIndex, ind],
            });
            newAst.push(newEntryResult.desiredValue.tree);
        }
        return { desiredValue: me.fromAst(newAst) };
    }

    if (
        !vectorOperators.includes(desiredValue.tree[0]) ||
        !desiredValue.tree.includes()
    ) {
        return { desiredValue };
    }

    // have a desiredValue that is a vector that is missing some entries

    let valueAst;

    let workspaceKey = variableName + "Ast";
    if (arrayKey !== undefined) {
        workspaceKey += `_${arrayKey}`;
    }
    if (listIndex.length > 0) {
        workspaceKey += `_list_` + listIndex.join("_");
    }

    if (workspace[workspaceKey]) {
        // if have value from workspace
        // we will merge components from desired value into workspace value
        valueAst = workspace[workspaceKey].slice(0, desiredValue.tree.length);
    } else {
        let currentValue = await stateValues[variableName];

        if (currentValue) {
            currentValue = currentValue.expand().simplify();

            if (arrayKey !== undefined && currentValue[arrayKey]) {
                // TODO: generalize to multi-dimensional arrays?
                currentValue = currentValue[arrayKey];
            }

            if (listIndex.length > 0) {
                for (let ind of listIndex) {
                    if (
                        currentValue.tree[0] === "list" &&
                        currentValue.tree[ind + 1]
                    ) {
                        currentValue = me.fromAst(currentValue.tree[ind + 1]);
                    }
                }
            }

            if (vectorOperators.includes(currentValue.tree[0])) {
                // if we have a currentValue that is a vector
                // we will merge components from desired value into current value
                valueAst = currentValue.tree.slice(0, desiredValue.tree.length);
            }
        }
    }

    if (valueAst) {
        // have a vector that we'll merge desiredValue into

        let vectorComponentsNotAffected = [];
        let foundNotAffected = false;
        for (let [ind, value] of desiredValue.tree.entries()) {
            if (value === undefined) {
                foundNotAffected = true;
                vectorComponentsNotAffected.push(ind);
            } else {
                valueAst[ind] = value;
            }
        }
        desiredValue = me.fromAst(valueAst);
        workspace[workspaceKey] = valueAst;

        if (foundNotAffected) {
            return {
                desiredValue,
                vectorComponentsNotAffected,
            };
        } else {
            return { desiredValue };
        }
    } else {
        // don't have a vector to merge desiredValue into
        // but desiredValue has undefined entries
        // desired expression could have undefined entries
        // fill in with \uff3f
        let desiredOperands = [];
        for (let val of desiredValue.tree.slice(1)) {
            if (val === undefined) {
                desiredOperands.push("\uff3f");
            } else {
                desiredOperands.push(val);
            }
        }

        desiredValue = me.fromAst([desiredValue.tree[0], ...desiredOperands]);

        return { desiredValue };
    }
}

/**
 * Attempt to create a text representation of a latex expression by creating a math expression from that latex
 * and converting the math expression to a string.
 * If unsuccessful, just return the original latex.
 */
export function latexToText(latex: string) {
    let expression;
    try {
        expression = me.fromAst(latexToAst.convert(latex));
    } catch (e) {
        // just return latex if can't parse with math-expressions
        return latex;
    }

    return superSubscriptsToUnicode(expression.toString());
}

/**
 * Attempt to create a latex representation of a text expression by creating a math expression from that text
 * and converting the math expression to a latex.
 * If unsuccessful, just return the original text.
 */
export function textToLatex(text: string) {
    let expression;
    try {
        expression = me.fromAst(textToAst.convert(text));
    } catch (e) {
        // just return text if can't parse with math-expressions
        return text;
    }

    return expression.toLatex();
}

/**
 * Collapse repeated exponents or subscripts in a LaTeX string.
 *
 * Examples:
 * - x^{^{2}} -> x^{2}
 * - x_{_{5}} -> x_{5}
 * - x^{^{\frac{8}{3}}} -> x^{\frac{8}{3}}
 * - x^{^{^{2}}} -> x^{2} (handles multiple levels)
 *
 * Handles nested braces inside the inner script.
 */
function removeRepeatedSuperSubScripts(latex: string) {
    let newLatex = latex;

    const isWhitespace = (char: string) => /\s/.test(char);

    const findMatchingBrace = (text: string, openIndex: number) => {
        if (text[openIndex] !== "{") {
            return -1;
        }
        let depth = 0;
        for (let i = openIndex; i < text.length; i++) {
            if (text[i] === "{") {
                depth++;
            } else if (text[i] === "}") {
                depth--;
                if (depth === 0) {
                    return i;
                }
            }
        }
        return -1;
    };

    const removeRepScript = (scriptChar: "^" | "_") => {
        let changed = true;
        while (changed) {
            changed = false;
            let i = 0;
            while (i < newLatex.length) {
                if (newLatex[i] !== scriptChar) {
                    i++;
                    continue;
                }

                let j = i + 1;
                while (j < newLatex.length && isWhitespace(newLatex[j])) {
                    j++;
                }

                if (newLatex[j] !== "{") {
                    i++;
                    continue;
                }

                let outerOpen = j;
                let outerClose = findMatchingBrace(newLatex, outerOpen);
                if (outerClose === -1) {
                    i++;
                    continue;
                }

                let k = outerOpen + 1;
                while (k < outerClose && isWhitespace(newLatex[k])) {
                    k++;
                }

                if (newLatex[k] !== scriptChar) {
                    i = outerClose + 1;
                    continue;
                }

                let l = k + 1;
                while (l < outerClose && isWhitespace(newLatex[l])) {
                    l++;
                }

                if (newLatex[l] !== "{") {
                    i = outerClose + 1;
                    continue;
                }

                let innerOpen = l;
                let innerClose = findMatchingBrace(newLatex, innerOpen);
                if (innerClose === -1 || innerClose > outerClose) {
                    i = outerClose + 1;
                    continue;
                }

                let trailing = innerClose + 1;
                while (
                    trailing < outerClose &&
                    isWhitespace(newLatex[trailing])
                ) {
                    trailing++;
                }

                if (trailing !== outerClose) {
                    i = outerClose + 1;
                    continue;
                }

                let innerScript = newLatex.substring(innerOpen + 1, innerClose);
                newLatex =
                    newLatex.substring(0, i) +
                    `${scriptChar}{${innerScript}}` +
                    newLatex.substring(outerClose + 1);
                changed = true;
                i = i + 1 + innerScript.length + 2;
            }
        }
    };

    removeRepScript("^");
    removeRepScript("_");

    return newLatex;
}

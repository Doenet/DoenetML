// @ts-ignore
import me from "math-expressions";

import { mathAssets } from "@doenet/static-assets/math-assets";

/*************************************************************
 * These functions were copied over from DoenetML version 0.6.
 * They should be reworked to fix several issues.
 * See https://github.com/Doenet/DoenetML/issues/127
 *************************************************************/

export var appliedFunctionSymbolsDefault =
    mathAssets.appliedFunctionSymbolsDefault;

export var appliedFunctionSymbolsDefaultLatex =
    mathAssets.appliedFunctionSymbolsDefaultLatex;

let allowedLatexSymbols = mathAssets.allowedLatexSymbols;

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
    let wrapper = splitSymbols
        ? wrapWordIncludingNumberWithOperatorName
        : wrapWordWithOperatorName;

    return (x: string) =>
        me.fromAst(
            new me.converters.latexToAstObj({
                appliedFunctionSymbols,
                functionSymbols,
                allowedLatexSymbols,
                parseScientificNotation,
            }).convert(wrapper(x, parseScientificNotation)),
        );
}

export function normalizeLatexString(
    latexString: string,
    { unionFromU = false } = {},
) {
    let substitutions = mathAssets.latexSubstitutions as Record<string, string>;

    let re = new RegExp(Object.keys(substitutions).join("|"), "g");
    latexString = latexString.replace(re, function (matched) {
        return substitutions[matched];
    });

    // TODO: figure out what this regex is supposed to match and then annotate with some examples.
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

/**
 * wrap words that aren't already in a \operatorname with a \operatorname
 */
function wrapWordWithOperatorName(
    string: string,
    parseScientificNotation: boolean,
) {
    let newString = "";

    let regex = /\\operatorname\s*{[^{}]*}/;
    let match = string.match(regex);
    while (match && match.index !== undefined) {
        let beginMatch = match.index;
        let endMatch = beginMatch + match[0].length;
        newString += wrapWordWithOperatorNameSub(
            string.substring(0, beginMatch),
            parseScientificNotation,
        );
        newString += string.substring(beginMatch, endMatch);
        string = string.substring(endMatch);
        match = string.match(regex);
    }
    newString += wrapWordWithOperatorNameSub(string, parseScientificNotation);

    return newString;
}

function wrapWordWithOperatorNameSub(
    string: string,
    parseScientificNotation: boolean,
) {
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

/**
 * wrap words that include a number in them and that aren't already in a \operatorname with a \operatorname
 */
function wrapWordIncludingNumberWithOperatorName(
    string: string,
    parseScientificNotation: boolean,
) {
    let newString = "";

    let regex = /\\operatorname\s*{[^{}]*}/;
    let match = string.match(regex);
    while (match && match.index !== undefined) {
        let beginMatch = match.index;
        let endMatch = beginMatch + match[0].length;
        newString += wrapWordIncludingNumberWithOperatorNameSub(
            string.substring(0, beginMatch),
            parseScientificNotation,
        );
        newString += string.substring(beginMatch, endMatch);
        string = string.substring(endMatch);
        match = string.match(regex);
    }
    newString += wrapWordIncludingNumberWithOperatorNameSub(
        string,
        parseScientificNotation,
    );

    return newString;
}

function wrapWordIncludingNumberWithOperatorNameSub(
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

import checkEquality from "./checkEquality";
import me from "math-expressions";
import { buildSubsetFromMathExpression, deepCompare } from "@doenet/utils";
import {
    appliedFunctionSymbolsDefault,
    textToMathFactory,
    numberToMathExpression,
} from "./math";
import { createInputStringFromChildren } from "./parseMath";

const appliedFunctionSymbolsWithBooleanOperators = [
    ...appliedFunctionSymbolsDefault,
    "isnumber",
    "isinteger",
];

var fromTextUnsplit = textToMathFactory({
    splitSymbols: false,
    appliedFunctionSymbols: appliedFunctionSymbolsWithBooleanOperators,
    parseScientificNotation: false,
});

var fromTextSplit = textToMathFactory({
    parseScientificNotation: false,
});

export function buildParsedExpression({
    dependencyValues,
    componentInfoObjects,
    doNotSplit = false,
    splitAtInitialLevel = false,
}) {
    let codePre = "comp";

    // make sure that codePre is not in any string piece
    let foundInString = true;
    while (foundInString) {
        foundInString = false;

        for (let child of dependencyValues.stringChildren) {
            if (child.includes(codePre)) {
                // found codePre in a string, so extend codePre and try again
                foundInString = true;
                codePre += "p";
                break;
            }
        }
    }

    let stringResults = createInputStringFromChildren({
        children: dependencyValues.allChildren,
        codePre,
        format: "text",
        createInternalLists: true,
        parser: fromTextUnsplit,
    });

    let inputString = stringResults.string;
    let internalLists = stringResults.internalLists;

    let subnum = 0;
    let nonMathCodes = [];

    for (let child of dependencyValues.allChildren) {
        if (typeof child !== "string") {
            let code = codePre + subnum;
            if (
                !(
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: child.componentType,
                        baseComponentType: "math",
                    }) ||
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: child.componentType,
                        baseComponentType: "number",
                    })
                )
            ) {
                nonMathCodes.push(code);
            }

            subnum += 1;
        }
    }

    let parsedExpression = null;

    try {
        parsedExpression = fromTextUnsplit(inputString);
    } catch (e) {}

    if (parsedExpression) {
        parsedExpression = parsedExpression.substitute(internalLists);
        if (!doNotSplit) {
            parsedExpression = me.fromAst(
                splitSymbolsIfMath({
                    logicTree: parsedExpression.tree,
                    nonMathCodes,
                    init: !splitAtInitialLevel,
                }),
            );
        }
    }

    return {
        setValue: {
            codePre,
            parsedExpression,
        },
    };
}

export function returnChildrenByCodeStateVariableDefinitions() {
    let stateVariableDefinitions = {};

    stateVariableDefinitions.mathChildrenByCode = {
        additionalStateVariablesDefined: [
            "numberChildrenByCode",
            "textChildrenByCode",
            "booleanChildrenByCode",
            "otherChildrenByCode",
        ],
        returnDependencies: () => ({
            children: {
                dependencyType: "child",
                childGroups: ["comparableTypes"],
                variableNames: [
                    "value",
                    "fractionSatisfied",
                    "unordered",
                    "inUnorderedList",
                ],
                variablesOptional: true,
            },
            codePre: {
                dependencyType: "stateVariable",
                variableName: "codePre",
            },
        }),
        definition({ dependencyValues, componentInfoObjects }) {
            let mathChildrenByCode = {};
            let numberChildrenByCode = {};
            let textChildrenByCode = {};
            let booleanChildrenByCode = {};
            let otherChildrenByCode = {};
            let subnum = 0;

            let codePre = dependencyValues.codePre;

            for (let child of dependencyValues.children) {
                // a math, text, or boolean
                let code = codePre + subnum;

                if (
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: child.componentType,
                        baseComponentType: "math",
                    })
                ) {
                    mathChildrenByCode[code] = child;
                } else if (
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: child.componentType,
                        baseComponentType: "number",
                    })
                ) {
                    numberChildrenByCode[code] = child;
                } else if (
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: child.componentType,
                        baseComponentType: "text",
                    })
                ) {
                    textChildrenByCode[code] = child;
                } else if (
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: child.componentType,
                        baseComponentType: "boolean",
                    })
                ) {
                    booleanChildrenByCode[code] = child;
                } else {
                    otherChildrenByCode[code] = child;
                }
                subnum += 1;
            }

            return {
                setValue: {
                    mathChildrenByCode,
                    numberChildrenByCode,
                    textChildrenByCode,
                    booleanChildrenByCode,
                    otherChildrenByCode,
                },
            };
        },
    };

    return stateVariableDefinitions;
}

export function evaluateLogic({
    logicTree,
    canOverrideUnorderedCompare = false,
    dependencyValues,
    valueOnInvalid = 0,
}) {
    let evaluateSub = (x) =>
        evaluateLogic({
            logicTree: x,
            canOverrideUnorderedCompare,
            dependencyValues,
            valueOnInvalid,
        });

    if (!Array.isArray(logicTree)) {
        // if don't have an array, then the only valid option is that the tree
        // is a single boolean component

        // TODO: should have a flag where one can set <when> to substitute math children at the beginning?
        // this would allow one to specify logic operators in the math
        // but it would prevent one from comparing expressions involving those operators

        if (typeof logicTree === "string") {
            let booleanChild =
                dependencyValues.booleanChildrenByCode[logicTree];
            if (booleanChild) {
                if (
                    dependencyValues.matchPartial &&
                    booleanChild.stateValues.fractionSatisfied !== undefined
                ) {
                    return booleanChild.stateValues.fractionSatisfied;
                } else {
                    return booleanChild.stateValues.value ? 1 : 0;
                }
            } else {
                let mathChild = dependencyValues.mathChildrenByCode[logicTree];
                if (mathChild) {
                    // TODO: should we simplify before evaluating to constant?
                    let numericalValue = mathChild.stateValues.value
                        .simplify()
                        .evaluate_to_constant();
                    if (
                        Number.isFinite(numericalValue) &&
                        numericalValue !== 0
                    ) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    let numberChild =
                        dependencyValues.numberChildrenByCode[logicTree];
                    if (numberChild) {
                        let numericalValue = numberChild.stateValues.value;
                        if (
                            Number.isFinite(numericalValue) &&
                            numericalValue !== 0
                        ) {
                            return 1;
                        } else {
                            return 0;
                        }
                    } else if (logicTree.toLowerCase() === "true") {
                        return 1;
                    } else if (logicTree.toLowerCase() === "false") {
                        return 0;
                    }
                }
            }
        } else if (typeof logicTree === "number") {
            return logicTree === 0 ? 0 : 1;
        }

        return valueOnInvalid;
    }

    let operator = logicTree[0];
    let operands = logicTree.slice(1);

    if (operator === "not") {
        if (operands.length !== 1) {
            return valueOnInvalid;
        }
        return evaluateSub(operands[0]) === 0 ? 1 : 0;
    }
    if (operator === "and") {
        if (dependencyValues.matchPartial) {
            return (
                operands.reduce((a, c) => a + evaluateSub(c), 0) /
                operands.length
            );
        } else {
            return operands.every((x) => evaluateSub(x) === 1) ? 1 : 0;
        }
    }
    if (operator === "or") {
        if (dependencyValues.matchPartial) {
            return operands.reduce((a, c) => Math.max(evaluateSub(c), a), 0);
        } else {
            return operands.some((x) => evaluateSub(x) === 1) ? 1 : 0;
        }
    }

    // Note: foundMath, foundText, foundBoolean, and foundOther will all be false
    // if all operands are strings.
    // In this case, we will default to treating the strings as math
    let foundMath = false;
    let foundText = false;
    let foundBoolean = false;
    let foundOther = false;

    function findTypes(ops) {
        for (let op of ops) {
            if (typeof op === "string") {
                if (
                    op in dependencyValues.mathChildrenByCode ||
                    op in dependencyValues.numberChildrenByCode
                ) {
                    foundMath = true;
                } else if (op in dependencyValues.textChildrenByCode) {
                    foundText = true;
                } else if (op in dependencyValues.booleanChildrenByCode) {
                    foundBoolean = true;
                } else if (op in dependencyValues.otherChildrenByCode) {
                    foundOther = true;
                }
            } else if (Array.isArray(op)) {
                findTypes(op.slice(1));
            }
        }
    }

    findTypes(operands);

    let replaceMath = function (tree) {
        if (typeof tree === "string") {
            let child = dependencyValues.mathChildrenByCode[tree];
            if (child !== undefined) {
                return child.stateValues.value.tree;
            }
            child = dependencyValues.numberChildrenByCode[tree];
            if (child !== undefined) {
                return numberToMathExpression(child.stateValues.value).tree;
            }
            return tree;
        }
        if (!Array.isArray(tree)) {
            return tree;
        }

        return [tree[0], ...tree.slice(1).map(replaceMath)];
    };

    if (
        operator === "apply" &&
        ["isnumber", "isinteger"].includes(operands[0])
    ) {
        if (foundText || foundBoolean || foundOther) {
            return 0;
        }

        // try to see if operand can be evaluated to a number
        let expression = me.fromAst(replaceMath(operands[1]));

        // TODO: should we simplify before evaluating to constant?
        let numericalValue = expression.simplify().evaluate_to_constant();

        if (!Number.isFinite(numericalValue)) {
            return 0;
        }

        if (operands[0] === "isnumber") {
            return 1;
        } else {
            // to account for round off error, round to nearest integer
            // and check if close to that integer
            let rounded = Math.round(numericalValue);
            if (
                Math.abs(rounded - numericalValue) <=
                1e-15 * Math.abs(numericalValue)
            ) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    // TODO: other set operations

    if (
        ![
            "=",
            "ne",
            "<",
            ">",
            "le",
            "ge",
            "lts",
            "gts",
            "in",
            "notin",
            "subset",
            "notsubset",
            "superset",
            "notsuperset",
        ].includes(operator)
    ) {
        if (foundText || foundBoolean || foundOther) {
            return valueOnInvalid;
        }

        // try to see if logic tree can be evaluated to a number
        let expression = me.fromAst(replaceMath(logicTree));

        // TODO: should we simplify before evaluating to constant?
        let numericalValue = expression.simplify().evaluate_to_constant();
        if (Number.isFinite(numericalValue) && numericalValue !== 0) {
            return 1;
        } else {
            return 0;
        }
    }

    if (foundBoolean) {
        if (foundMath || foundText || foundOther) {
            return valueOnInvalid;
        }

        let foundUnordered = false;
        let replaceBooleanAndFindUnordered = function (tree) {
            if (typeof tree === "string") {
                let child = dependencyValues.booleanChildrenByCode[tree];
                if (child !== undefined) {
                    if (child.stateValues.inUnorderedList) {
                        foundUnordered = true;
                    }
                    return child.stateValues.value;
                }
                tree = tree.toLowerCase().trim();
                if (tree === "true") {
                    return true;
                }
                if (tree === "false") {
                    return false;
                }

                throw Error("Invalid format");
            }

            if (!Array.isArray(tree)) {
                throw Error("Invalid format");
            }

            if (tree[0] === "list") {
                return tree.slice(1).map(replaceBooleanAndFindUnordered);
            } else {
                return evaluateSub(tree) === 1 ? true : false;
            }
        };

        try {
            operands = operands.map(replaceBooleanAndFindUnordered);
        } catch (e) {
            return valueOnInvalid;
        }

        let unorderedCompare = dependencyValues.unorderedCompare;
        if (canOverrideUnorderedCompare) {
            if (foundUnordered) {
                unorderedCompare = true;
            }
        }

        if (operator === "=") {
            let boolean1 = operands[0];
            if (dependencyValues.matchPartial) {
                let results = operands.slice(1).map((x) =>
                    checkEquality({
                        object1: boolean1,
                        object2: x,
                        isUnordered: unorderedCompare,
                        partialMatches: dependencyValues.matchPartial,
                        matchByExactPositions:
                            dependencyValues.matchByExactPositions,
                    }),
                );

                // return average of fraction_equal
                let sum = results.reduce((a, c) => a + c.fraction_equal, 0);
                return sum / results.length;
            } else {
                return operands.slice(1).every(
                    (x) =>
                        checkEquality({
                            object1: boolean1,
                            object2: x,
                            isUnordered: unorderedCompare,
                            partialMatches: dependencyValues.matchPartial,
                            matchByExactPositions:
                                dependencyValues.matchByExactPositions,
                        }).fraction_equal === 1,
                )
                    ? 1
                    : 0;
            }
        } else if (operator === "ne") {
            if (operands.length !== 2) {
                return valueOnInvalid;
            }
            let fraction_equal = checkEquality({
                object1: operands[0],
                object2: operands[1],
                isUnordered: unorderedCompare,
                partialMatches: dependencyValues.matchPartial,
                matchByExactPositions: dependencyValues.matchByExactPositions,
            }).fraction_equal;

            return fraction_equal === 0 ? 1 : 0;
        } else if (operator === "in" || operator === "notin") {
            let boolean1 = operands[0];
            if (
                !(
                    operands.length === 2 &&
                    typeof boolean1 === "boolean" &&
                    Array.isArray(operands[1]) &&
                    operands[1].every((b) => typeof b === "boolean")
                )
            ) {
                return valueOnInvalid;
            }

            // Have: [boolean1] in/notin [booleanlist]
            // check if one of the elements in booleanlist is boolean1
            let isInList = operands[1].includes(boolean1);
            if (operator === "in") {
                return isInList ? 1 : 0;
            } else {
                // notin
                return isInList ? 0 : 1;
            }
        } else if (
            ["subset", "notsubset", "superset", "notsuperset"].includes(
                operator,
            )
        ) {
            let booleanList1 = operands[0];
            let booleanList2 = operands[1];

            // since single lists are indistinguishable from singletons,
            // turn single booleans into arrays
            if (typeof booleanList1 === "boolean") {
                booleanList1 = [booleanList1];
            }
            if (typeof booleanList2 === "boolean") {
                booleanList2 = [booleanList2];
            }

            if (
                !(
                    operands.length === 2 &&
                    Array.isArray(booleanList1) &&
                    booleanList1.every((b) => typeof b === "boolean") &&
                    Array.isArray(booleanList2) &&
                    booleanList2.every((b) => typeof b === "boolean")
                )
            ) {
                return valueOnInvalid;
            }

            // Have: [booleanList1] operator [booleanList2],
            // where operator is subset, notsubset, superset, or notsuperset

            if (operator === "superset" || operator === "notsuperset") {
                // swap operands so can use subset convention
                [booleanList1, booleanList2] = [booleanList2, booleanList1];
            }

            // check if every element of booleanList1 is in booleanList2
            let haveContainment = booleanList1.every((b) =>
                booleanList2.includes(b),
            );
            if (operator.substring(0, 3) === "not") {
                return haveContainment ? 0 : 1;
            } else {
                return haveContainment ? 1 : 0;
            }
        } else {
            return valueOnInvalid;
        }
    } else if (foundText) {
        if (foundMath || foundOther) {
            return valueOnInvalid;
        }

        let foundUnordered = false;

        let replaceTextAndFindUnordered = function (tree, recurse = true) {
            if (typeof tree === "string") {
                let child = dependencyValues.textChildrenByCode[tree];
                if (child !== undefined) {
                    if (child.stateValues.inUnorderedList) {
                        foundUnordered = true;
                    }
                    return child.stateValues.value.trim().replace(/\s+/, " ");
                }
                return tree.trim();
            }

            if (typeof tree === "number") {
                return tree.toString();
            }

            if (recurse && Array.isArray(tree)) {
                if (tree[0] === "*") {
                    // multiple words would become multiplication
                    return tree
                        .slice(1)
                        .map((x) => replaceTextAndFindUnordered(x, false))
                        .join(" ");
                } else if (tree[0] === "list") {
                    return tree
                        .slice(1)
                        .map((x) => replaceTextAndFindUnordered(x, false))
                        .map((x) => x.trim().replace(/\s+/, " "));
                }
            }

            throw Error("Invalid format");
        };

        try {
            // every operand must be a text or string
            operands = operands.map((x) => replaceTextAndFindUnordered(x));
        } catch (e) {
            return valueOnInvalid;
        }

        let unorderedCompare = dependencyValues.unorderedCompare;
        if (canOverrideUnorderedCompare) {
            if (foundUnordered) {
                unorderedCompare = true;
            }
        }

        if (operator === "=") {
            let text1 = operands[0];
            if (dependencyValues.matchPartial) {
                let results = operands.slice(1).map((x) =>
                    checkEquality({
                        object1: text1,
                        object2: x,
                        isUnordered: unorderedCompare,
                        partialMatches: dependencyValues.matchPartial,
                        matchByExactPositions:
                            dependencyValues.matchByExactPositions,
                        caseInsensitiveMatch:
                            dependencyValues.caseInsensitiveMatch,
                    }),
                );

                // return average of fraction_equal
                let sum = results.reduce((a, c) => a + c.fraction_equal, 0);
                return sum / results.length;
            } else {
                return operands.slice(1).every(
                    (x) =>
                        checkEquality({
                            object1: text1,
                            object2: x,
                            isUnordered: unorderedCompare,
                            partialMatches: dependencyValues.matchPartial,
                            matchByExactPositions:
                                dependencyValues.matchByExactPositions,
                            caseInsensitiveMatch:
                                dependencyValues.caseInsensitiveMatch,
                        }).fraction_equal === 1,
                )
                    ? 1
                    : 0;
            }
        } else if (operator === "ne") {
            if (operands.length !== 2) {
                return 0;
            }

            let fraction_equal = checkEquality({
                object1: operands[0],
                object2: operands[1],
                isUnordered: unorderedCompare,
                partialMatches: dependencyValues.matchPartial,
                matchByExactPositions: dependencyValues.matchByExactPositions,
                caseInsensitiveMatch: dependencyValues.caseInsensitiveMatch,
            }).fraction_equal;

            return fraction_equal === 0 ? 1 : 0;
        } else if (operator === "in" || operator === "notin") {
            let text1 = operands[0];
            if (operands.length !== 2 || typeof text1 !== "string") {
                return valueOnInvalid;
            }

            if (dependencyValues.caseInsensitiveMatch) {
                text1 = text1.toLowerCase();
            }

            if (typeof operands[1] === "string") {
                let text2 = operands[1];
                if (dependencyValues.caseInsensitiveMatch) {
                    text2 = text2.toLowerCase();
                }
                // Have: [text1] in/notin [text2]
                // check if text1 is a substring of text2
                let isSubstring = text2.includes(text1);
                if (operator === "in") {
                    return isSubstring ? 1 : 0;
                } else {
                    // notin
                    return isSubstring ? 0 : 1;
                }
            } else if (
                Array.isArray(operands[1]) &&
                operands[1].every((s) => typeof s === "string")
            ) {
                let textlist = operands[1];
                if (dependencyValues.caseInsensitiveMatch) {
                    textlist = textlist.map((s) => s.toLowerCase());
                }

                // Have: [text1] in/notin [textlist]
                // check if one of the elements in textlist is text1
                let isInList = textlist.includes(text1);
                if (operator === "in") {
                    return isInList ? 1 : 0;
                } else {
                    // notin
                    return isInList ? 0 : 1;
                }
            } else {
                return valueOnInvalid;
            }
        } else if (
            ["subset", "notsubset", "superset", "notsuperset"].includes(
                operator,
            )
        ) {
            let textList1 = operands[0];
            let textList2 = operands[1];

            // since single lists are indistinguishable from singletons,
            // turn single texts into arrays
            if (typeof textList1 === "string") {
                textList1 = [textList1];
            }
            if (typeof textList2 === "string") {
                textList2 = [textList2];
            }

            if (
                !(
                    operands.length === 2 &&
                    Array.isArray(textList1) &&
                    textList1.every((b) => typeof b === "string") &&
                    Array.isArray(textList2) &&
                    textList2.every((b) => typeof b === "string")
                )
            ) {
                return valueOnInvalid;
            }

            if (dependencyValues.caseInsensitiveMatch) {
                textList1 = textList1.map((s) => s.toLowerCase());
                textList2 = textList2.map((s) => s.toLowerCase());
            }

            // Have: [textList1] operator [textList2],
            // where operator is subset, notsubset, superset, or notsuperset

            if (operator === "superset" || operator === "notsuperset") {
                // swap operands so can use subset convention
                [textList1, textList2] = [textList2, textList1];
            }

            // check if every element of textList1 is in textList2
            let haveContainment = textList1.every((b) => textList2.includes(b));
            if (operator.substring(0, 3) === "not") {
                return haveContainment ? 0 : 1;
            } else {
                return haveContainment ? 1 : 0;
            }
        } else {
            return valueOnInvalid;
        }
    } else if (foundOther) {
        if (foundMath) {
            return valueOnInvalid;
        }

        let foundInvalidFormat = false;

        operands = operands.map(function (x) {
            if (typeof x === "string") {
                let child = dependencyValues.otherChildrenByCode[x];
                if (child !== undefined) {
                    return child.stateValues.value;
                }
            }

            foundInvalidFormat = true;
            return null;
        });

        if (foundInvalidFormat) {
            return valueOnInvalid;
        }

        if (operator === "=") {
            if (operands.slice(1).every((x) => deepCompare(x, operands[0]))) {
                return 1;
            } else {
                return 0;
            }
        }

        if (operator === "ne") {
            if (operands.length !== 2) {
                return 0;
            }

            if (deepCompare(operands[0], operands[1])) {
                return 0;
            } else {
                return 1;
            }
        }

        return 0;
    }

    // no boolean or text, just math, number, and strings

    let strict;
    if (operator === "lts" || operator === "gts") {
        strict = operands[1].slice(1);
        operands = operands[0].slice(1);
    }

    let foundUnordered = false;

    let replaceMathAndFindUnordered = function (tree) {
        if (typeof tree === "string") {
            let child = dependencyValues.mathChildrenByCode[tree];
            if (child !== undefined) {
                // TODO: should we treat `unordered` differently from `inUnorderedList`?
                if (
                    child.stateValues.unordered ||
                    child.stateValues.inUnorderedList
                ) {
                    foundUnordered = true;
                }
                return child.stateValues.value.tree;
            }
            child = dependencyValues.numberChildrenByCode[tree];
            if (child !== undefined) {
                if (child.stateValues.inUnorderedList) {
                    foundUnordered = true;
                }
                return numberToMathExpression(child.stateValues.value).tree;
            }
            return tree;
        }
        if (!Array.isArray(tree)) {
            return tree;
        }

        return [tree[0], ...tree.slice(1).map(replaceMathAndFindUnordered)];
    };

    let mathOperands = operands.map(function (x) {
        return me.fromAst(replaceMathAndFindUnordered(x));
    });

    let unorderedCompare = dependencyValues.unorderedCompare;
    if (canOverrideUnorderedCompare) {
        if (foundUnordered) {
            unorderedCompare = true;
        }
    }

    if (operator === "=") {
        let expr = mathOperands[0];
        if (Number.isNaN(expr.tree)) {
            return mathOperands.slice(1).every((x) => Number.isNaN(x.tree))
                ? 1
                : 0;
        }
        if (dependencyValues.matchPartial) {
            let results = mathOperands.slice(1).map((x) =>
                checkEquality({
                    object1: expr,
                    object2: x,
                    isUnordered: unorderedCompare,
                    partialMatches: dependencyValues.matchPartial,
                    matchByExactPositions:
                        dependencyValues.matchByExactPositions,
                    symbolicEquality: dependencyValues.symbolicEquality,
                    simplify: dependencyValues.simplifyOnCompare,
                    expand: dependencyValues.expandOnCompare,
                    allowedErrorInNumbers:
                        dependencyValues.allowedErrorInNumbers,
                    includeErrorInNumberExponents:
                        dependencyValues.includeErrorInNumberExponents,
                    allowedErrorIsAbsolute:
                        dependencyValues.allowedErrorIsAbsolute,
                    numSignErrorsMatched: dependencyValues.numSignErrorsMatched,
                    numPeriodicSetMatchesRequired:
                        dependencyValues.numPeriodicSetMatchesRequired,
                    caseInsensitiveMatch: dependencyValues.caseInsensitiveMatch,
                    matchBlanks: dependencyValues.matchBlanks,
                }),
            );

            // return average of fraction_equal
            let sum = results.reduce((a, c) => a + c.fraction_equal, 0);
            return sum / results.length;
        } else {
            return mathOperands.slice(1).every(
                (x) =>
                    checkEquality({
                        object1: expr,
                        object2: x,
                        isUnordered: unorderedCompare,
                        partialMatches: dependencyValues.matchPartial,
                        matchByExactPositions:
                            dependencyValues.matchByExactPositions,
                        symbolicEquality: dependencyValues.symbolicEquality,
                        simplify: dependencyValues.simplifyOnCompare,
                        expand: dependencyValues.expandOnCompare,
                        allowedErrorInNumbers:
                            dependencyValues.allowedErrorInNumbers,
                        includeErrorInNumberExponents:
                            dependencyValues.includeErrorInNumberExponents,
                        allowedErrorIsAbsolute:
                            dependencyValues.allowedErrorIsAbsolute,
                        numSignErrorsMatched:
                            dependencyValues.numSignErrorsMatched,
                        numPeriodicSetMatchesRequired:
                            dependencyValues.numPeriodicSetMatchesRequired,
                        caseInsensitiveMatch:
                            dependencyValues.caseInsensitiveMatch,
                        matchBlanks: dependencyValues.matchBlanks,
                    }).fraction_equal === 1,
            )
                ? 1
                : 0;
        }
    }
    if (operator === "ne") {
        let fraction_equal = checkEquality({
            object1: mathOperands[0],
            object2: mathOperands[1],
            isUnordered: unorderedCompare,
            partialMatches: dependencyValues.matchPartial,
            matchByExactPositions: dependencyValues.matchByExactPositions,
            symbolicEquality: dependencyValues.symbolicEquality,
            simplify: dependencyValues.simplifyOnCompare,
            expand: dependencyValues.expandOnCompare,
            allowedErrorInNumbers: dependencyValues.allowedErrorInNumbers,
            includeErrorInNumberExponents:
                dependencyValues.includeErrorInNumberExponents,
            allowedErrorIsAbsolute: dependencyValues.allowedErrorIsAbsolute,
            numSignErrorsMatched: dependencyValues.numSignErrorsMatched,
            numPeriodicSetMatchesRequired:
                dependencyValues.numPeriodicSetMatchesRequired,
            caseInsensitiveMatch: dependencyValues.caseInsensitiveMatch,
            matchBlanks: dependencyValues.matchBlanks,
        }).fraction_equal;

        return fraction_equal === 0 ? 1 : 0;
    }

    if (operator === "in" || operator === "notin") {
        if (mathOperands.length !== 2) {
            return valueOnInvalid;
        }

        let element = mathOperands[0];
        let set = mathOperands[1];

        // operator is in or notin
        // If first operand is a number and second operand can be turned into a subset of reals,
        // then we can check for inclusion.

        let number1 = element.evaluate_to_constant();

        // Note: since single lists are indistinguishable from singletons,
        // we accept the behavior that buildSubsetFromMathExpression will turn
        // a number into a singleton set

        if (Number.isFinite(number1)) {
            let subsetOfReals = buildSubsetFromMathExpression(set);

            if (subsetOfReals.isValid()) {
                let containsNumber = subsetOfReals.containsElement(number1);
                if (operator === "in") {
                    return containsNumber ? 1 : 0;
                } else {
                    // notin
                    return containsNumber ? 0 : 1;
                }
            }
        }

        let set_tree = set.tree;

        // since single lists are indistinguishable from singletons,
        // turn single values into lists
        if (
            !(Array.isArray(set_tree) && ["set", "list"].includes(set_tree[0]))
        ) {
            set_tree = ["list", set_tree];
        }

        if (dependencyValues.matchPartial) {
            let results = set_tree.slice(1).map((x) =>
                checkEquality({
                    object1: element,
                    object2: me.fromAst(x),
                    isUnordered: unorderedCompare,
                    partialMatches: dependencyValues.matchPartial,
                    matchByExactPositions:
                        dependencyValues.matchByExactPositions,
                    symbolicEquality: dependencyValues.symbolicEquality,
                    simplify: dependencyValues.simplifyOnCompare,
                    expand: dependencyValues.expandOnCompare,
                    allowedErrorInNumbers:
                        dependencyValues.allowedErrorInNumbers,
                    includeErrorInNumberExponents:
                        dependencyValues.includeErrorInNumberExponents,
                    allowedErrorIsAbsolute:
                        dependencyValues.allowedErrorIsAbsolute,
                    numSignErrorsMatched: dependencyValues.numSignErrorsMatched,
                    numPeriodicSetMatchesRequired:
                        dependencyValues.numPeriodicSetMatchesRequired,
                    caseInsensitiveMatch: dependencyValues.caseInsensitiveMatch,
                    matchBlanks: dependencyValues.matchBlanks,
                }),
            );

            let max_fraction = results.reduce(
                (a, c) => Math.max(a, c.fraction_equal),
                0,
            );
            if (operator === "in") {
                return max_fraction;
            } else {
                return 1 - max_fraction;
            }
        } else {
            let result = set_tree.slice(1).some(
                (x) =>
                    checkEquality({
                        object1: element,
                        object2: me.fromAst(x),
                        isUnordered: unorderedCompare,
                        partialMatches: dependencyValues.matchPartial,
                        matchByExactPositions:
                            dependencyValues.matchByExactPositions,
                        symbolicEquality: dependencyValues.symbolicEquality,
                        simplify: dependencyValues.simplifyOnCompare,
                        expand: dependencyValues.expandOnCompare,
                        allowedErrorInNumbers:
                            dependencyValues.allowedErrorInNumbers,
                        includeErrorInNumberExponents:
                            dependencyValues.includeErrorInNumberExponents,
                        allowedErrorIsAbsolute:
                            dependencyValues.allowedErrorIsAbsolute,
                        numSignErrorsMatched:
                            dependencyValues.numSignErrorsMatched,
                        numPeriodicSetMatchesRequired:
                            dependencyValues.numPeriodicSetMatchesRequired,
                        caseInsensitiveMatch:
                            dependencyValues.caseInsensitiveMatch,
                        matchBlanks: dependencyValues.matchBlanks,
                    }).fraction_equal === 1,
            );

            if (operator === "in") {
                return result ? 1 : 0;
            } else {
                return result ? 0 : 1;
            }
        }
    }

    if (["subset", "notsubset", "superset", "notsuperset"].includes(operator)) {
        if (mathOperands.length !== 2) {
            return valueOnInvalid;
        }

        let set1 = mathOperands[0];
        let set2 = mathOperands[1];

        if (operator === "superset" || operator === "notsuperset") {
            // swap operands so can use subset convention
            [set1, set2] = [set2, set1];
        }

        // operator is subset, notsubset, superset, or notsuperset,
        // but operands are not lists or sets
        // If both operands can be turned into a subset of reals,
        // then we can check for inclusion.

        // Note: since single lists are indistinguishable from singletons,
        // we accept the behavior that buildSubsetFromMathExpression will turn
        // a number into a singleton set

        let subsetOfReals1 = buildSubsetFromMathExpression(set1);

        if (subsetOfReals1.isValid()) {
            let subsetOfReals2 = buildSubsetFromMathExpression(set2);

            if (subsetOfReals2.isValid()) {
                let haveContainment =
                    subsetOfReals2.containsSubset(subsetOfReals1);

                if (operator.substring(0, 3) === "not") {
                    return haveContainment ? 0 : 1;
                } else {
                    return haveContainment ? 1 : 0;
                }
            }
        }

        let set1_tree = set1.tree;
        let set2_tree = set2.tree;

        // since single lists are indistinguishable from singletons,
        // turn single values into lists

        if (
            !(
                Array.isArray(set1_tree) &&
                ["set", "list"].includes(set1_tree[0])
            )
        ) {
            set1_tree = ["list", set1_tree];
        }
        if (
            !(
                Array.isArray(set2_tree) &&
                ["set", "list"].includes(set2_tree[0])
            )
        ) {
            set2_tree = ["list", set2_tree];
        }

        // check if every element in set 1 is equal to an element in set 2
        let haveContainment = set1_tree.slice(1).every((elt1) =>
            set2_tree.slice(1).some(
                (elt2) =>
                    checkEquality({
                        object1: me.fromAst(elt1),
                        object2: me.fromAst(elt2),
                        isUnordered: unorderedCompare,
                        partialMatches: dependencyValues.matchPartial,
                        matchByExactPositions:
                            dependencyValues.matchByExactPositions,
                        symbolicEquality: dependencyValues.symbolicEquality,
                        simplify: dependencyValues.simplifyOnCompare,
                        expand: dependencyValues.expandOnCompare,
                        allowedErrorInNumbers:
                            dependencyValues.allowedErrorInNumbers,
                        includeErrorInNumberExponents:
                            dependencyValues.includeErrorInNumberExponents,
                        allowedErrorIsAbsolute:
                            dependencyValues.allowedErrorIsAbsolute,
                        numSignErrorsMatched:
                            dependencyValues.numSignErrorsMatched,
                        numPeriodicSetMatchesRequired:
                            dependencyValues.numPeriodicSetMatchesRequired,
                        caseInsensitiveMatch:
                            dependencyValues.caseInsensitiveMatch,
                        matchBlanks: dependencyValues.matchBlanks,
                    }).fraction_equal === 1,
            ),
        );

        if (operator.substring(0, 3) === "not") {
            return haveContainment ? 0 : 1;
        } else {
            return haveContainment ? 1 : 0;
        }
    }

    // since have inequality, all operands must be numbers
    let numberOperands = mathOperands.map((x) =>
        x.simplify().evaluate_to_constant(),
    );
    if (numberOperands.some((x) => Number.isNaN(x))) {
        return 0;
    }

    // at this point, all operands are numbers, Infinity, or -Infinity

    if (operator === "<") {
        return numberOperands[0] < numberOperands[1] ? 1 : 0;
    } else if (operator === ">") {
        return numberOperands[0] > numberOperands[1] ? 1 : 0;
    } else if (operator === "le") {
        return numberOperands[0] <= numberOperands[1] ? 1 : 0;
    } else if (operator === "ge") {
        return numberOperands[0] >= numberOperands[1] ? 1 : 0;
    }

    // have lts or gts
    for (let ind = 0; ind < strict.length; ind++) {
        if (operator === "lts") {
            if (strict[ind] === true) {
                if (!(numberOperands[ind] < numberOperands[ind + 1])) {
                    return 0;
                }
            } else {
                if (!(numberOperands[ind] <= numberOperands[ind + 1])) {
                    return 0;
                }
            }
        } else {
            if (strict[ind] === true) {
                if (!(numberOperands[ind] > numberOperands[ind + 1])) {
                    return 0;
                }
            } else {
                if (!(numberOperands[ind] >= numberOperands[ind + 1])) {
                    return 0;
                }
            }
        }
    }
    // all inequalities satisfied
    return 1;
}

export function splitSymbolsIfMath({
    logicTree,
    nonMathCodes,
    foundNonMath = false,
    init = true,
}) {
    if (!Array.isArray(logicTree)) {
        if (typeof logicTree === "string" && !foundNonMath && !init) {
            return fromTextSplit(logicTree).tree; // split string
        } else {
            return logicTree;
        }
    }

    let operator = logicTree[0];
    let operands = logicTree.slice(1);

    if (["and", "not", "or"].includes(operator)) {
        return [
            operator,
            ...operands.map((x) =>
                splitSymbolsIfMath({
                    logicTree: x,
                    nonMathCodes,
                    foundNonMath,
                    init,
                }),
            ),
        ];
    }

    // check if an operand is a non-math or a list containing a non-math
    for (let op of operands) {
        if (nonMathCodes.includes(op)) {
            foundNonMath = true;
            break;
        }
        if (
            Array.isArray(op) &&
            op[0] === "list" &&
            op.slice(1).some((x) => nonMathCodes.includes(x))
        ) {
            foundNonMath = true;
            break;
        }
    }

    if (operator === "apply") {
        operands = [
            operands[0],
            ...operands.slice(1).map((x) =>
                splitSymbolsIfMath({
                    logicTree: x,
                    nonMathCodes,
                    foundNonMath,
                    init: false,
                }),
            ),
        ];

        // look for int
        let foundInt = false;
        if (operands[0] === "int") {
            foundInt = true;
        } else if (Array.isArray(operands[0])) {
            if (operands[0][0] === "^") {
                if (operands[0][1] === "int") {
                    foundInt = true;
                } else if (Array.isArray(operands[0][1])) {
                    if (
                        operands[0][1][0] === "_" &&
                        operands[0][1][1] === "int"
                    ) {
                        foundInt = true;
                    }
                }
            } else if (operands[0][0] === "_") {
                if (operands[0][1] === "int") {
                    foundInt = true;
                }
            }
        }

        if (foundInt) {
            // round trip from tree -> math-expression -> tree to flatten tree
            operands = me.fromAst([operator, ...operands]).tree.slice(1);

            let integrand = operands[1];
            if (Array.isArray(integrand) && integrand[0] === "*") {
                // look for consecutive factors of "d" followed by a string

                let ds = [];
                for (let i = 0; i < integrand.length - 1; i++) {
                    let factor1 = integrand[i];
                    if (factor1 === "d") {
                        let factor2 = integrand[i + 1];
                        integrand.splice(i, 2);
                        ds.push(["d", factor2]);
                        i--;
                    }
                }
                integrand.push(...ds);
            }
        }
        return [operator, ...operands];
    } else if (operator === "angle") {
        let newOperands = [];
        for (let op of operands) {
            if (typeof op === "string" && !foundNonMath) {
                let splitResult = fromTextSplit(op).tree;
                if (splitResult[0] === "*") {
                    newOperands.push(...splitResult.slice(1));
                } else {
                    newOperands.push(splitResult);
                }
            } else {
                newOperands.push(
                    splitSymbolsIfMath({
                        logicTree: op,
                        nonMathCodes,
                        foundNonMath,
                        init: false,
                    }),
                );
            }
        }
        return [operator, ...newOperands];
    } else {
        return [
            operator,
            ...operands.map((x) =>
                splitSymbolsIfMath({
                    logicTree: x,
                    nonMathCodes,
                    foundNonMath,
                    init: false,
                }),
            ),
        ];
    }
}

/**
 * The value logic of `<math>` as functions of plain values: strings, the
 * values of the math children, and the settings already resolved. `<math>`
 * calls them from its state-variable definitions, and a list that evaluates
 * a `<math>` template at each index (Doenet/DoenetML#2163) calls the same
 * functions, so the logic exists once.
 *
 * The functions split along what changes between the iterations of such a
 * template. `mathCodePre`, `mathExpressionWithCodes`,
 * `mathCodesAdjacentToStrings` and `mathInverseAnalysis` depend only on the
 * strings, which children there are and which of them can be modified, and the
 * settings: they are the same at every index. `mathValueFromCodes`,
 * `mathValueForDisplay`, `mathDisplayString` and `invertMathValue` read the
 * children's values.
 *
 * `content` is the strings and math children in order, as `<math>`'s
 * `strings` and `maths` child groups give them: a string is a string piece,
 * anything else stands for a math child, whose value is not read here. Its
 * `compositeReplacementRange` property, if any, marks children that a list
 * gave (see `createInputStringFromChildren`).
 */
import me from "math-expressions";
import {
    normalizeMathExpression,
    vectorOperators,
    flattenDeep,
} from "@doenet/utils";
import {
    textToMathFactory,
    latexToMathFactory,
    roundForDisplay,
    mergeListsIfNeeded,
    superSubscriptsToUnicode,
} from "../math";
import { buildNumberDisplayParameters } from "../numberDisplay";
import { createInputStringFromChildren } from "../parseMath";

const vectorAndListOperators = ["list", ...vectorOperators];

/**
 * The prefix of the codes that stand for the math children in the parsed
 * expression: `math`, extended with `m` until no string piece contains it.
 *
 * @param {string[]} strings
 * @returns {string}
 */
export function mathCodePre(strings) {
    let codePre = "math";

    // make sure that codePre is not in any string piece
    let foundInString = false;
    do {
        foundInString = false;

        for (let child of strings) {
            if (child.includes(codePre) === true) {
                // found codePre in a string, so extend codePre and try again
                foundInString = true;
                codePre += "m";
                break;
            }
        }
    } while (foundInString);

    return codePre;
}

/**
 * The content parsed into one expression, in which math child `k` is the
 * code `codePre + k`. `null` if there is no content, which means the value
 * comes from elsewhere (`<math>`'s `valueShadow`). A blank (`＿`) if the
 * content is empty or does not parse.
 *
 * @param {object} args
 * @param {any[]} args.content
 * @param {string} args.codePre
 * @param {"text"|"latex"} args.format
 * @param {string[]} args.functionSymbols
 * @param {number[]} args.functionSymbolChildIndices - the math children
 *   that are function symbols (`referencesAreFunctionSymbols`)
 * @param {boolean} args.splitSymbols
 * @param {boolean} args.parseScientificNotation
 */
export function mathExpressionWithCodes({
    content,
    codePre,
    format,
    functionSymbols,
    functionSymbolChildIndices,
    splitSymbols,
    parseScientificNotation,
}) {
    if (content.length === 0) {
        return null;
    }

    functionSymbols = [
        ...functionSymbols,
        ...functionSymbolChildIndices.map((x) => codePre + x),
    ];

    let parser;

    if (format === "text") {
        parser = textToMathFactory({
            functionSymbols,
            splitSymbols,
            parseScientificNotation,
        });
    } else if (format === "latex") {
        parser = latexToMathFactory({
            functionSymbols,
            splitSymbols,
            parseScientificNotation,
        });
    }

    let stringResults = createInputStringFromChildren({
        children: content,
        codePre,
        format,
        parser,
    });

    let inputString = stringResults.string;

    let expressionWithCodes = null;

    if (inputString === "") {
        expressionWithCodes = me.fromAst("＿"); // long underscore
    } else {
        try {
            expressionWithCodes = parser(inputString);
        } catch (e) {
            expressionWithCodes = me.fromAst("＿"); // long underscore
            console.log(
                `Invalid value for a math of ${format} format: \`${inputString}\``,
            );
        }
    }

    return expressionWithCodes;
}

/**
 * The value: `expressionWithCodes` with each code replaced by the value of
 * its math child, and lists merged. Not yet normalized (see
 * `normalizeMathExpression`).
 *
 * @param {object} args
 * @param {any} args.expressionWithCodes - not null
 * @param {string} args.codePre
 * @param {any[]} args.codeValues - the value of each math child, in order
 */
export function mathValueFromCodes({
    expressionWithCodes,
    codePre,
    codeValues,
}) {
    let value = expressionWithCodes;
    if (codeValues.length > 0) {
        let subsMapping = {};
        for (let [ind, codeValue] of codeValues.entries()) {
            subsMapping[codePre + ind] = codeValue;
        }
        value = value.substitute(subsMapping);
    }

    return mergeListsIfNeeded(value);
}

/**
 * The value rounded for display, by `displayDigits`, `displayDecimals` and
 * `displaySmallAsZero`, then simplified or expanded as the value is.
 */
export function mathValueForDisplay({
    value,
    displayDigits,
    displayDecimals,
    displaySmallAsZero,
    simplify,
    expand,
}) {
    // for display via latex and text, round any decimal numbers to the significant digits
    // determined by displayDigits, displayDecimals, and/or displaySmallAsZero
    let rounded = roundForDisplay({
        value,
        dependencyValues: {
            displayDigits,
            displayDecimals,
            displaySmallAsZero,
        },
    });

    return normalizeMathExpression({
        value: rounded,
        simplify,
        expand,
    });
}

/**
 * The value for display as a LaTeX (`format: "latex"`) or text string. A
 * value that cannot be written is a blank, or empty if blanks are not
 * displayed.
 */
export function mathDisplayString({
    valueForDisplay,
    format,
    padZeros,
    avoidScientificNotation,
    displayDigits,
    displayDecimals,
    displayBlanks,
}) {
    let params = buildNumberDisplayParameters({
        padZeros,
        displayDigits,
        displayDecimals,
        avoidScientificNotation,
    });
    if (!displayBlanks) {
        params.showBlanks = false;
    }
    let result;
    try {
        result =
            format === "latex"
                ? valueForDisplay.toLatex(params)
                : valueForDisplay.toString(params);
    } catch (e) {
        result = displayBlanks ? "＿" : "";
    }
    return format === "latex" ? result : superSubscriptsToUnicode(result);
}

/**
 * For each string piece that is followed by a math child or ends the content,
 * the codes just before and after it in the written expression
 * (`{prevCode, nextCode}`), from which `mathStringsFromExpressionWithCodes`
 * recovers the piece. A string piece followed by another string piece is
 * skipped: it gets no entry, so it is not set to empty by an inverse, and
 * the entries after it are one string piece out of line.
 */
export function mathCodesAdjacentToStrings({ content, codePre, format }) {
    let codesAdjacentToStrings = [];
    let mathInd;
    for (let [ind, child] of content.entries()) {
        if (typeof child === "string") {
            let nextChild = content[ind + 1];
            if (nextChild !== undefined && typeof nextChild === "string") {
                // if following child is also a string, skip the first string:
                // it gets no entry (see the doc comment above)
                continue;
            }

            let subCodes = {};
            if (mathInd !== undefined) {
                if (format === "latex") {
                    subCodes.prevCode =
                        "\\operatorname{" + codePre + mathInd + "}";
                } else {
                    subCodes.prevCode = codePre + mathInd;
                }
            }

            if (nextChild !== undefined) {
                // next child is a math
                let nextInd = 0;
                if (mathInd !== undefined) {
                    nextInd = mathInd + 1;
                }

                if (format === "latex") {
                    subCodes.nextCode =
                        "\\operatorname{" + codePre + nextInd + "}";
                } else {
                    subCodes.nextCode = codePre + nextInd;
                }
            }

            codesAdjacentToStrings.push(subCodes);
        } else {
            // have a mathChild, so increment mathInd
            if (mathInd === undefined) {
                mathInd = 0;
            } else {
                mathInd++;
            }
        }
    }

    return codesAdjacentToStrings;
}

/**
 * The string pieces that write a new `expressionWithCodes`, the `k`th
 * written to string piece `k`. With no math children, the first piece gets
 * the whole expression and the others are empty. Otherwise there is one for
 * each entry of `codesAdjacentToStrings`, the text between those codes, so
 * a string piece followed by another gets none (see
 * `mathCodesAdjacentToStrings`).
 *
 * @returns {string[]}
 */
export function mathStringsFromExpressionWithCodes({
    expressionWithCodes,
    format,
    numStrings,
    numMaths,
    codesAdjacentToStrings,
}) {
    let stringExpr =
        format === "latex"
            ? expressionWithCodes.toLatex()
            : expressionWithCodes.toString();

    if (numMaths === 0) {
        // just string children.  Set first to value, the rest to empty strings
        let strings = [stringExpr];
        for (let ind = 1; ind < numStrings; ind++) {
            strings.push("");
        }
        return strings;
    }

    let strings = [];
    for (let stringCodes of codesAdjacentToStrings) {
        let thisString = stringExpr;
        if (Object.keys(stringCodes).length === 0) {
            // an entry with no codes, so set the string to empty
            // (an entry has a code whenever there are math children)
            strings.push("");
        } else {
            if (stringCodes.prevCode) {
                thisString = thisString.split(stringCodes.prevCode)[1];
            }
            if (stringCodes.nextCode) {
                thisString = thisString.split(stringCodes.nextCode)[0];
            }
            strings.push(thisString);
        }
    }
    return strings;
}

const CANNOT_BE_MODIFIED = {
    canBeModified: false,
    constantChildIndices: null,
    codeForExpression: null,
    inverseMaps: null,
    template: null,
    mathChildrenMapped: null,
};

/**
 * Whether a value can be written back, and how: the expression must be
 * linear, each component in one modifiable math child. Returns
 * `canBeModified` and, when it is true and there are math children, the
 * `template` a desired value is matched against, the `inverseMaps` that give
 * each modifiable child from the match, `codeForExpression`, the
 * `constantChildIndices` (children that cannot be modified, by code) and the
 * set `mathChildrenMapped`.
 *
 * @param {object} args
 * @param {any} args.expressionWithCodes
 * @param {string} args.codePre
 * @param {boolean[]} args.childCanBeModified - for each math child
 * @param {boolean} args.modifyIndirectly
 * @param {boolean} args.fixed
 * @param {boolean} args.fixLocation
 */
export function mathInverseAnalysis({
    expressionWithCodes,
    codePre,
    childCanBeModified,
    modifyIndirectly,
    fixed,
    fixLocation,
}) {
    if (!modifyIndirectly || fixed || fixLocation) {
        return { ...CANNOT_BE_MODIFIED };
    }

    if (childCanBeModified.length === 0) {
        // if have no math children, then can directly set value
        // to any specified expression
        return { ...CANNOT_BE_MODIFIED, canBeModified: true };
    }

    // determine if can calculate value of activeChildren from
    // any specified value of expression

    // categorize all math activeChildren as variables or constants
    let variableInds = [];
    let variables = [];
    let constants = [];

    let constantChildIndices = {};

    for (let [ind, canBeModified] of childCanBeModified.entries()) {
        let substitutionCode = codePre + ind;

        if (canBeModified === true) {
            variableInds.push(ind);
            variables.push(substitutionCode);
        } else {
            constants.push(substitutionCode);
            constantChildIndices[substitutionCode] = ind;
        }
    }

    // include codePre in code for whole expression, as we know codePre is not in math expression
    let codeForExpression = codePre + "expr";
    let tree = me.utils.unflattenLeft(expressionWithCodes.tree);

    let result = checkForLinearExpression(
        tree,
        variables,
        codeForExpression,
        constants,
    );

    if (!result.foundLinear) {
        // if not linear, can't find an inverse
        return { ...CANNOT_BE_MODIFIED };
    }

    let inverseMaps = {};
    let template = result.template;
    let mathChildrenMapped = new Set();

    for (let key in result.mappings) {
        inverseMaps[key] = result.mappings[key];

        // if component was due to a math child, add Ind of the math child
        let mathChildSub = inverseMaps[key].mathChildSub;
        if (mathChildSub) {
            let mathChildInd = variableInds[variables.indexOf(mathChildSub)];
            inverseMaps[key].mathChildInd = mathChildInd;
            mathChildrenMapped.add(Number(mathChildInd));
        }
    }

    mathChildrenMapped.has = mathChildrenMapped.has.bind(mathChildrenMapped);

    // found an inverse
    return {
        canBeModified: true,
        constantChildIndices,
        codeForExpression,
        inverseMaps,
        template,
        mathChildrenMapped,
    };
}

/**
 * What to write so that the value becomes `desiredValue`, which has been
 * preprocessed (`preprocessMathInverseDefinition`). The caller has checked
 * that the value can be modified, and handled the case of a single math child
 * and no strings.
 *
 * Returns `{success: false}`, or `{success: true}` with any of
 * - `childValues`: a desired value for each math child to write, by index;
 * - `expressionWithCodes`: a new expression with codes, to write to the
 *   string pieces;
 * - `valueShadow`: the value itself, when there is no content.
 *
 * @param {object} args
 * @param {any} args.desiredValue
 * @param {number} args.numStrings
 * @param {any[]} args.codeValues - the value of each math child, in order
 * @param {boolean[]} args.childCanBeModified
 * @param {number[]} args.childrenToSkip - math children to leave unchanged
 * @param {object} args.analysis - from `mathInverseAnalysis`
 * @param {any} args.expressionWithCodes
 * @param {string} args.codePre
 */
export function invertMathValue({
    desiredValue,
    numStrings,
    codeValues,
    childCanBeModified,
    childrenToSkip,
    analysis,
    expressionWithCodes,
    codePre,
    simplify,
    expand,
    createVectors,
    createIntervals,
}) {
    if (codeValues.length === 0) {
        if (numStrings > 0) {
            return { success: true, expressionWithCodes: desiredValue };
        } else {
            return { success: true, valueShadow: desiredValue };
        }
    }

    // first calculate expression pieces to make sure really can update
    let expressionPieces = mathExpressionPieces({
        expression: desiredValue,
        template: analysis.template,
        inverseMaps: analysis.inverseMaps,
        codeForExpression: analysis.codeForExpression,
        simplify,
        expand,
        createVectors,
        createIntervals,
    });
    if (!expressionPieces) {
        return { success: false };
    }

    let childValues = {};

    // update math children where have inversemap and canBeModified is true
    for (let childInd = 0; childInd < codeValues.length; childInd++) {
        if (
            analysis.mathChildrenMapped.has(childInd) &&
            childCanBeModified[childInd]
        ) {
            if (!childrenToSkip.includes(childInd)) {
                let childValue = expressionPieces[childInd];
                let subsMap = {};
                let foundConst = false;
                for (let code in analysis.constantChildIndices) {
                    let constInd = analysis.constantChildIndices[code];
                    subsMap[code] = codeValues[constInd];
                    foundConst = true;
                }
                if (foundConst) {
                    // substitute values of any math children that are constant
                    // (i.e., that are marked as not modifiable from above)
                    childValue = childValue.substitute(subsMap);
                }

                childValues[childInd] = childValue.expand().simplify();
            }

            delete expressionPieces[childInd];
        }
    }

    let result = { success: true, childValues };

    // if there are any string children,
    // need to update expressionWithCodes with new values

    if (numStrings > 0) {
        let newExpressionWithCodes = expressionWithCodes;
        let nCP = codePre.length;

        // Given that we have both string and math children,
        // the only way that expressionWithCodes could change
        // is if expression is a vector
        // and there is a vector component that came entirely from a string child,
        // i.e., that that vector component in expressionWithCodes
        // does not have any Codes in it.

        let mathComponentIsCode = (tree) =>
            typeof tree === "string" && tree.substring(0, nCP) === codePre;

        let mathComponentContainsCode = (tree) => {
            if (Array.isArray(tree)) {
                return flattenDeep(tree.slice(1)).some(mathComponentIsCode);
            } else {
                return mathComponentIsCode(tree);
            }
        };

        if (
            vectorAndListOperators.includes(newExpressionWithCodes.tree[0]) &&
            !newExpressionWithCodes.tree
                .slice(1)
                .every(mathComponentContainsCode)
        ) {
            for (let piece in expressionPieces) {
                let inverseMap = analysis.inverseMaps[piece];
                // skip math children
                if (inverseMap.mathChildInd !== undefined) {
                    continue;
                }
                let components = inverseMap.components;
                newExpressionWithCodes =
                    newExpressionWithCodes.substitute_component(
                        components,
                        expressionPieces[piece],
                    );
            }

            result.expressionWithCodes = newExpressionWithCodes;
        }
    }

    return result;
}

/**
 * The desired value matched against the analysis's `template`, converting
 * tuples to vectors and to intervals if it does not match as is: the piece
 * for each math child (by index) and each string component (by key), or
 * `false` if it does not match.
 */
function mathExpressionPieces({
    expression,
    template,
    inverseMaps,
    codeForExpression,
    simplify,
    expand,
    createVectors,
    createIntervals,
}) {
    let matching = me.utils.match(expression.tree, template);

    // if doesn't match, trying matching, by converting vectors, intervals, or both
    if (!matching) {
        matching = me.utils.match(
            expression.tuples_to_vectors().tree,
            me.fromAst(template).tuples_to_vectors().tree,
        );
        if (!matching) {
            matching = me.utils.match(
                expression.to_intervals().tree,
                me.fromAst(template).to_intervals().tree,
            );
            if (!matching) {
                matching = me.utils.match(
                    expression.tuples_to_vectors().to_intervals().tree,
                    me.fromAst(template).tuples_to_vectors().to_intervals()
                        .tree,
                );
                if (!matching) {
                    return false;
                }
            }
        }
    }

    let pieces = {};
    for (let x in matching) {
        let subMap = {};
        subMap[codeForExpression] = matching[x];
        let inverseMap = inverseMaps[x];
        if (inverseMap !== undefined) {
            let id = x;
            if (inverseMap.mathChildInd !== undefined) {
                id = inverseMap.mathChildInd;
            }
            pieces[id] = inverseMap.result.substitute(subMap);

            pieces[id] = normalizeMathExpression({
                value: pieces[id],
                simplify,
                expand,
                createVectors,
                createIntervals,
            });
        }
    }
    return pieces;
}

function checkForLinearExpression(
    tree,
    variables,
    inverseTree,
    constants = [],
    components = [],
) {
    // Check if tree is a linear expression in variables.
    // Each component of container must be a linear expression in just one variable.
    // Haven't implemented inversion of a multivariable linear map

    let tree_variables = me.variables(tree);
    if (tree_variables.every((v) => !variables.includes(v))) {
        if (tree_variables.every((v) => !constants.includes(v))) {
            // if there are no variable or constant math activeChildren, then consider it linear
            let mappings = {};
            let key = "x" + components.join("_");
            mappings[key] = {
                result: me.fromAst(inverseTree).expand().simplify(),
                components: components,
            };
            //let modifiableStrings = {[key]: components};
            return { foundLinear: true, mappings: mappings, template: key };
            //modifiableStrings: modifiableStrings };
        }
    }

    // if not an array, check if is a variable
    if (!Array.isArray(tree)) {
        return checkForScalarLinearExpression(
            tree,
            variables,
            inverseTree,
            components,
        );
    }

    let operator = tree[0];
    let operands = tree.slice(1);

    // for container, check if at least one component is a linear expression
    if (vectorAndListOperators.includes(operator)) {
        let result = { mappings: {}, template: [operator] }; //, modifiableStrings: {}};
        let numLinear = 0;
        for (let ind = 0; ind < operands.length; ind++) {
            let new_components = [...components, ind];
            let res = checkForLinearExpression(
                operands[ind],
                variables,
                inverseTree,
                constants,
                new_components,
            );
            if (res.foundLinear) {
                numLinear++;

                // append mappings found for the component
                result.mappings = Object.assign(result.mappings, res.mappings);

                // // append modifiableStrings found for the component
                // result.modifiableStrings = Object.assign(result.modifiableStrings, res.modifiableStrings);

                // append template
                result.template.push(res.template);
            } else {
                result.template.push("x" + new_components.join("_"));
            }
        }

        // if no components are linear, view whole container as nonlinear
        if (numLinear === 0) {
            return { foundLinear: false };
        }

        // if at least one component is a linear functions, view as linear
        result.foundLinear = true;
        return result;
    } else {
        // if not a container, check if is a scalar linear function
        return checkForScalarLinearExpression(
            tree,
            variables,
            inverseTree,
            components,
        );
    }
}

// check if tree is a scalar linear function in one of the variables
function checkForScalarLinearExpression(
    tree,
    variables,
    inverseTree,
    components = [],
) {
    if (typeof tree === "string" && variables.includes(tree)) {
        let mappings = {};
        let template = "x" + components.join("_");
        mappings[template] = {
            result: me.fromAst(inverseTree).expand().simplify(),
            components: components,
            mathChildSub: tree,
        };
        return { foundLinear: true, mappings: mappings, template: template };
    }

    if (!Array.isArray(tree)) {
        return { foundLinear: false };
    }

    let operator = tree[0];
    let operands = tree.slice(1);

    if (operator === "-") {
        inverseTree = ["-", inverseTree];
        return checkForScalarLinearExpression(
            operands[0],
            variables,
            inverseTree,
            components,
        );
    }
    if (operator === "+") {
        if (operands.length === 1) {
            // a unary plus, as in `+x`. One is also left when a reference
            // in a sum is gone: `$x + <math>0</math>` in an iteration of a
            // `<repeat for="$s">` that is withheld when `$s` gets shorter
            // (`line.test.ts`, "line through dynamic number of moveable
            // points").
            return checkForScalarLinearExpression(
                operands[0],
                variables,
                inverseTree,
                components,
            );
        }
        if (me.variables(operands[0]).every((v) => !variables.includes(v))) {
            // if none of the variables appear in the first operand, subtract off operand from inverseTree
            inverseTree = ["+", inverseTree, ["-", operands[0]]];
            return checkForScalarLinearExpression(
                operands[1],
                variables,
                inverseTree,
                components,
            );
        } else if (
            me.variables(operands[1]).every((v) => !variables.includes(v))
        ) {
            // if none of the variables appear in the second operand, subtract off operand from inverseTree
            inverseTree = ["+", inverseTree, ["-", operands[1]]];
            return checkForScalarLinearExpression(
                operands[0],
                variables,
                inverseTree,
                components,
            );
        } else {
            // neither operand was a constant
            return { foundLinear: false };
        }
    }
    if (operator === "*") {
        if (
            me.variables(operands[0]).every((v) => !variables.includes(v)) &&
            !exprContainsVector(operands[0])
        ) {
            // if none of the variables appear in the first operand and it doesn't contain a vector,
            // divide inverseTree by operand
            inverseTree = ["/", inverseTree, operands[0]];
            return checkForScalarLinearExpression(
                operands[1],
                variables,
                inverseTree,
                components,
            );
        } else if (
            me.variables(operands[1]).every((v) => !variables.includes(v)) &&
            !exprContainsVector(operands[1])
        ) {
            // if none of the variables appear in the second operand and it doesn't contain a vector,
            // divide inverseTree by operand
            inverseTree = ["/", inverseTree, operands[1]];
            return checkForScalarLinearExpression(
                operands[0],
                variables,
                inverseTree,
                components,
            );
        } else {
            // neither operand was a constant
            return { foundLinear: false };
        }
    }
    if (operator === "/") {
        if (me.variables(operands[1]).every((v) => !variables.includes(v))) {
            // if none of the variables appear in the second operand, multiply inverseTree by operand
            inverseTree = ["*", inverseTree, operands[1]];
            return checkForScalarLinearExpression(
                operands[0],
                variables,
                inverseTree,
                components,
            );
        } else {
            // second operand was not a constant
            return { foundLinear: false };
        }
    }

    // any other operator means not linear
    return { foundLinear: false };
}

function exprContainsVector(tree) {
    if (!Array.isArray(tree)) {
        return false;
    }

    let operator = tree[0];
    let operands = tree.slice(1);

    if (vectorOperators.includes(operator)) {
        return true;
    }

    return operands.some(exprContainsVector);
}

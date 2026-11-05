/**
 * The value logic of `<number>` as functions of plain values: strings, the
 * values of the children by code, and the settings already resolved.
 * `<number>` calls them from its state-variable definitions, and a list that
 * evaluates a `<number>` template at each index (Doenet/DoenetML#2163) calls
 * the same functions. See `./math.js` for the pattern.
 */
import me from "math-expressions";
import { buildParsedExpression, evaluateLogic } from "../booleanLogic";
import { buildNumberDisplayParameters } from "../numberDisplay";
import {
    textToAst,
    textToMathFactory,
    numberToMathExpression,
    plainComplex,
    roundForDisplay,
} from "../math";

/**
 * The numeric value of an expression carrying a currency marker — `2$` is `2`.
 *
 * A well-formed `["unit", …]` node (`$5`, `25%`, `60 deg`) needs none of this:
 * `evaluate_to_constant()` already answers `5`, `0.25` and `π/3`. What it
 * cannot do is a *stray* `$`, which parses as a free factor — `2$` is
 * `["*", 2, "$"]`, and a free factor makes the whole expression unevaluable.
 * Asking `<number>` for a value is exactly the place where that marker should
 * be dropped, so it is substituted with 1 here and nowhere else.
 *
 * The substitution is global, so a `$` that is not a factor is silently given
 * the value 1 too: `$-5` parses as `["+", "$", -5]` and answers **-4**. That is
 * a wrong number rather than a refusal, and it is the known cost of doing this
 * with `substitute` instead of matching the marker where it sits.
 *
 * Returns `NaN` when the expression still has no numeric value after the
 * marker is dropped — a free variable, say — which is what
 * `evaluate_to_constant()` answers for it, so a caller can test the result the
 * one way.
 *
 * A note for the record, because an earlier review pass wrote the opposite here
 * and it was never true: `2$`, `-5$` and a bare `$` all answer `NaN`, not
 * `null`, and did so even while `evaluate_to_constant` had a `null` sentinel —
 * `$` is one of the unit names it excludes from "free variables", so those fell
 * through to its `NaN` arm. The claim that the callers' `number === null` test
 * was the half that reached this function was therefore backwards; it was
 * always `Number.isNaN`. Measured both then and now.
 */
function valueIgnoringUnits(expr) {
    try {
        return expr
            .remove_scaling_units()
            .substitute({ $: 1 })
            .evaluate_to_constant();
    } catch (e) {
        return NaN;
    }
}

/**
 * The number that `text` is, as a `<number>` whose only child is that text
 * reads it, before `plainComplex`. `convertBoolean` and `valueOnNaN` are the
 * number's attributes. A `<numberList>` reads each piece of its text so.
 */
export function numberFromString(
    text,
    { convertBoolean = false, valueOnNaN = NaN, componentInfoObjects } = {},
) {
    // Convert string child to number, but don't let empty string be converted to 0
    let number = Number(text || undefined);
    if (Number.isNaN(number)) {
        try {
            const parsed = me.fromAst(textToAst.convert(text));
            number = parsed.evaluate_to_constant();
            if (Number.isNaN(number)) {
                number = valueIgnoringUnits(parsed);
            }

            if (typeof number === "boolean") {
                if (convertBoolean) {
                    number = number ? 1 : 0;
                } else {
                    number = valueOnNaN;
                }
                // `NaN` is "no numeric value" — a blank
                // `_`, a free variable, or an indeterminate
                // form. `valueOnNaN` is the author-facing
                // knob for what to show instead.
            } else if (Number.isNaN(number)) {
                if (convertBoolean) {
                    let parsedExpression = buildParsedExpression({
                        dependencyValues: {
                            stringChildren: [text],
                            allChildren: [text],
                        },
                        componentInfoObjects,
                    }).setValue.parsedExpression;

                    number = evaluateLogic({
                        logicTree: parsedExpression.tree,
                        dependencyValues: {
                            booleanChildrenByCode: {},
                            booleanListChildrenByCode: {},
                            textChildrenByCode: {},
                            textListChildrenByCode: {},
                            mathChildrenByCode: {},
                            mathListChildrenByCode: {},
                            numberChildrenByCode: {},
                            numberListChildrenByCode: {},
                            otherChildrenByCode: {},
                        },
                        valueOnInvalid: valueOnNaN,
                    });
                } else {
                    number = valueOnNaN;
                }
            } else if (
                number?.re === Infinity ||
                number?.re === -Infinity ||
                number?.im === Infinity ||
                number?.im === -Infinity
            ) {
                // if start with Infinity*i, evaluate_to_constant makes it Infinity+Infinity*i,
                // but if start with Infinity+Infinity*i, evaluate_to_constant makes is NaN+NaN*i
                // To make sure displayed value (which has one more pass through evaluate_to_constant)
                // and value match, pass through evaluate_to_constant a second time in this case
                number = numberToMathExpression(number).evaluate_to_constant();
            } else if (number?.im === 0) {
                number = number.re;
            }
        } catch (e) {
            number = valueOnNaN;
        }
    }
    return number;
}

/**
 * Whether `number` is a number or a complex number (`{re, im}`).
 */
function isNumberOrComplex(number) {
    return (
        typeof number === "number" ||
        (typeof number?.re === "number" && typeof number?.im === "number")
    );
}

/**
 * The value of an expression of maths and numbers: `parsedExpression` with
 * each code replaced by the value of its child, evaluated, ignoring units if
 * it has none otherwise. `null` if that is not a number, in which case
 * `<number>` gives `valueOnNaN` or, with `convertBoolean`, evaluates the
 * expression as logic. If evaluating throws, `valueOnNaN` when that is a
 * number, else `null`.
 *
 * @param {object} args
 * @param {any} args.parsedExpression
 * @param {Record<string, any>} args.mathValuesByCode
 * @param {Record<string, number>} args.numberValuesByCode
 * @param {number} args.valueOnNaN
 */
export function numberValueFromCodes({
    parsedExpression,
    mathValuesByCode,
    numberValuesByCode,
    valueOnNaN,
}) {
    function replaceMath(tree) {
        if (typeof tree === "string") {
            let value = mathValuesByCode[tree];
            if (value !== undefined) {
                return value.tree;
            }
            value = numberValuesByCode[tree];
            if (value !== undefined) {
                return numberToMathExpression(value).tree;
            }
            return tree;
        }
        if (!Array.isArray(tree)) {
            return tree;
        }
        return [tree[0], ...tree.slice(1).map(replaceMath)];
    }

    let number;

    try {
        const parsed = me.fromAst(replaceMath(parsedExpression.tree));
        number = parsed.evaluate_to_constant();
        if (Number.isNaN(number)) {
            number = valueIgnoringUnits(parsed);
        }
    } catch (e) {
        number = valueOnNaN;
    }

    if (!Number.isNaN(number) && isNumberOrComplex(number)) {
        return plainComplex(number);
    }
    return null;
}

/**
 * The value rounded for display, by `displayDigits`, `displayDecimals` and
 * `displaySmallAsZero`.
 */
export function numberValueForDisplay({
    value,
    displayDigits,
    displayDecimals,
    displaySmallAsZero,
}) {
    // for display via latex and text, round any decimal numbers to the significant digits
    // determined by displaydigits
    return plainComplex(
        roundForDisplay({
            value: numberToMathExpression(value),
            dependencyValues: {
                displayDigits,
                displayDecimals,
                displaySmallAsZero,
            },
        }).evaluate_to_constant(),
    );
}

/**
 * The value for display as a LaTeX (`format: "latex"`) or text string.
 */
export function numberDisplayString({
    valueForDisplay,
    format,
    padZeros,
    avoidScientificNotation,
    displayDigits,
    displayDecimals,
}) {
    let params = buildNumberDisplayParameters({
        padZeros,
        displayDigits,
        displayDecimals,
        avoidScientificNotation,
    });
    const expression = numberToMathExpression(valueForDisplay);
    return format === "latex"
        ? expression.toLatex(params)
        : expression.toString(params);
}

/**
 * A value desired for a `<number>`, as a number or complex number: a math
 * expression is evaluated, anything else converted with `Number`, and what
 * is not a number becomes `valueOnNaN`.
 */
export function numberFromDesiredValue(desiredValue, valueOnNaN) {
    if (desiredValue instanceof me.class) {
        desiredValue = plainComplex(desiredValue.evaluate_to_constant());
        if (Number.isNaN(desiredValue) || !isNumberOrComplex(desiredValue)) {
            desiredValue = valueOnNaN;
        }
    } else {
        if (Number.isNaN(desiredValue) || !isNumberOrComplex(desiredValue)) {
            desiredValue = Number(desiredValue);
            if (Number.isNaN(desiredValue)) {
                desiredValue = valueOnNaN;
            }
        }
    }
    return desiredValue;
}

/**
 * The finite number a text desired for a `<number>` stands for, or `null`.
 */
export function numberFromDesiredText(text) {
    let desiredNumber = Number(text);
    if (Number.isFinite(desiredNumber)) {
        return desiredNumber;
    }

    let fromText = textToMathFactory({
        parseScientificNotation: false,
    });

    let expr;
    try {
        expr = fromText(text);
    } catch (e) {
        return null;
    }

    desiredNumber = expr.evaluate_to_constant();

    return Number.isFinite(desiredNumber) ? desiredNumber : null;
}

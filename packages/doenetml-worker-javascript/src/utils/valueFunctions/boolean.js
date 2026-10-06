/**
 * The value logic of `<boolean>` as a function of plain values. The logic
 * itself is `evaluateLogic` (`../booleanLogic.js`), which reads the children
 * by code and the compare settings from one object. This names that object,
 * so that `<boolean>` and a list that evaluates a `<boolean>` template at each
 * index (Doenet/DoenetML#2163) build it the same way. See `./math.js` for the
 * pattern.
 */
import { evaluateLogic } from "../booleanLogic";

/**
 * The value of a boolean whose content parsed to `parsedExpression`:
 * `false` if it did not parse, else whether its logic is fully satisfied.
 *
 * @param {object} args
 * @param {any} args.parsedExpression - from `buildParsedExpression`
 * @param {object} args.childrenAndSettings - the children by code
 *   (`mathChildrenByCode`, `numberChildrenByCode`, `textChildrenByCode`,
 *   `booleanChildrenByCode`, `otherChildrenByCode`, each mapping a code to
 *   `{componentType, stateValues}`) and the compare settings
 *   (`symbolicEquality`, `expandOnCompare`, `simplifyOnCompare`,
 *   `unorderedCompare`, `matchByExactPositions`, `allowedErrorInNumbers`,
 *   `includeErrorInNumberExponents`, `allowedErrorIsAbsolute`,
 *   `numSignErrorsMatched`, `numPeriodicSetMatchesRequired`,
 *   `caseInsensitiveMatch`, `matchBlanks`)
 * @param {boolean} args.canOverrideUnorderedCompare - whether
 *   `unorderedCompare` took its default
 * @returns {boolean}
 */
export function booleanValueFromCodes({
    parsedExpression,
    childrenAndSettings,
    canOverrideUnorderedCompare,
}) {
    if (parsedExpression === null) {
        // if don't have parsed expression
        // (which could occur if have invalid form)
        // return false
        return false;
    }

    let fractionSatisfied = evaluateLogic({
        logicTree: parsedExpression.tree,
        canOverrideUnorderedCompare,
        dependencyValues: childrenAndSettings,
    });

    return fractionSatisfied === 1;
}

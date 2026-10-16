/**
 * The value logic of `<text>` as functions of plain values. The value itself
 * is `textFromChildren` (`../text.ts`), which reads only the children's
 * `text` and `hidden` and the composite ranges. `<text>` calls these from its
 * state-variable definitions, and a list that evaluates a `<text>` template at
 * each index (Doenet/DoenetML#2163) calls the same functions. See `./math.js`
 * for the pattern.
 */
import me from "math-expressions";
import { textToMathFactory, latexToMathFactory } from "../math";

/**
 * The value desired for each child so that the text becomes `desiredValue`,
 * or `null` if it cannot. One child takes the whole text. Several children
 * take it only if they all came from one composite shown as a list and the
 * text has as many comma-separated entries as there are children.
 *
 * @param {object} args
 * @param {string} args.desiredValue
 * @param {number} args.numChildren - at least 1
 * @param {{firstInd: number, lastInd: number, asList?: boolean}[]} [args.compositeReplacementRange]
 * @returns {string[] | null}
 */
export function textChildValuesFromDesired({
    desiredValue,
    numChildren,
    compositeReplacementRange = [],
}) {
    if (numChildren === 1) {
        return [desiredValue];
    }

    // if have multiple children, then we could still update them if
    // 1. all children come from a single composite with asList set to true, and
    // 2. the desired value is a comma-separated list with the number of entries
    //    matching the number of children.
    // In that case, we will attempt to update each child to the corresponding entry
    // from the desired value.
    const foundAllFromListComposite = compositeReplacementRange.some(
        (range) =>
            range.asList &&
            range.firstInd === 0 &&
            range.lastInd === numChildren - 1,
    );

    if (foundAllFromListComposite) {
        let splitValues = desiredValue.split(",").map((v) => v.trim());
        if (splitValues.length === numChildren) {
            return splitValues;
        }
    }
    return null;
}

/**
 * The text parsed as math (as LaTeX if `isLatex`), or a blank if it does not
 * parse.
 */
export function textToMath({ value, isLatex }) {
    let parser = isLatex ? latexToMathFactory() : textToMathFactory();
    try {
        return parser(value);
    } catch (e) {
        return me.fromAst("＿");
    }
}

/**
 * The text that a math expression desired for a `<text>` writes.
 */
export function textFromMath({ math, isLatex }) {
    return isLatex ? math.toLatex() : math.toString();
}

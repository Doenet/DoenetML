import me from "math-expressions";

import { serializedComponentsReviver, toNumberOrNaN } from "@doenet/utils";

/**
 * Parse a serialized math-expression ast into a JSON ast,
 * create a math expression from it,
 * and evaluate it as a constant, returning the resulting number.
 *
 * `toNumberOrNaN` rather than `?? NaN`: `evaluate_to_constant()` answers `null`
 * for an expression it cannot evaluate *and* a math.js `Complex` for one whose
 * value is not real, so `?? NaN` caught only the first of the two and let a
 * `{re, im}` object out of a function that promises a number.
 *
 * @param serializedAst
 * @returns number
 */
export function numberFromSerializedAst(serializedAst: string): number {
    return toNumberOrNaN(
        me
            .fromAst(JSON.parse(serializedAst, serializedComponentsReviver))
            .evaluate_to_constant(),
    );
}

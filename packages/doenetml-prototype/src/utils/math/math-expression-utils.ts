import me from "math-expressions";

import { serializedComponentsReviver, toNumberOrNaN } from "@doenet/utils";

/**
 * Parse a serialized math-expression ast into a JSON ast,
 * create a math expression from it,
 * and evaluate it as a constant, returning the resulting number.
 *
 * `toNumberOrNaN` rather than `?? NaN`: `evaluate_to_constant()` answers a
 * math.js `Complex` for an expression whose value is not real, and `?? NaN`
 * would let a `{re, im}` object out of a function that promises a number. (It
 * also used to answer `null` for an expression it could not evaluate, which
 * `?? NaN` did catch; that one is `NaN` at the source now.)
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

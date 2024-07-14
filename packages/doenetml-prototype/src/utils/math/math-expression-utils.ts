//@ts-ignore
import me from "math-expressions";

import { serializedComponentsReviver } from "@doenet/utils";

/**
 * Parse a serialized math-expression ast into a JSON ast,
 * create a math expression from it,
 * and evaluate it as a constant, returning the resulting number.
 *
 * @param serializedAst
 * @returns number
 */
export function numberFromSerializedAst(serializedAst: string): number {
    return me
        .fromAst(JSON.parse(serializedAst, serializedComponentsReviver))
        .evaluate_to_constant();
}

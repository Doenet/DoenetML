import { DastText, DastFunctionMacro, DastMacro } from "../types";
import { MacroParser } from "./parser";

/**
 * Parse a string and turn it into a list of text/macro/function-macro nodes.
 */
export function parseMacros(
    str: string,
): (DastText | DastMacro | DastFunctionMacro)[] {
    return MacroParser.parse(str) as (
        | DastText
        | DastMacro
        | DastFunctionMacro
    )[];
}

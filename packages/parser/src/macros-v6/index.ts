import { DastText, DastMacroV6, DastFunctionMacroV6 } from "../types";
import { MacroParser } from "./parser";

/**
 * Parse a string and turn it into a list of text/macro/function-macro nodes.
 */
export function parseMacrosV06(
    str: string,
): (DastText | DastMacroV6 | DastFunctionMacroV6)[] {
    return MacroParser.parse(str) as (
        | DastText
        | DastMacroV6
        | DastFunctionMacroV6
    )[];
}

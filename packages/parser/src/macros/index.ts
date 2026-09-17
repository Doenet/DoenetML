import { DastText, DastFunctionMacro, DastMacro } from "../types";
import { MacroParser } from "./parser";
import type { MacroTail } from "./types";

/**
 * Parse a string and turn it into a list of text/macro/function-macro nodes.
 */
export function parseMacros(
    str: string,
): (DastText | DastMacro | DastFunctionMacro)[] {
    return MacroParser.parse(str) as (
        DastText | DastMacro | DastFunctionMacro
    )[];
}

/**
 * Parse as much of `str` as could have continued a reference's path — further
 * indices, further path parts, a `{…}` block — and report the rest as
 * `remainder`.
 *
 * This exists because an element written between index brackets splits the text
 * the macro parser is handed, so `$a[<n/>].x` never reaches it as one string.
 * `gobblePropIndices` re-associates the index and then calls this on what
 * follows the `]`. See `MacroTail` in `macros.peggy`.
 *
 * Positions are relative to `str` and have to be rebased by the caller.
 */
export function parseMacroTail(str: string): MacroTail {
    return MacroParser.parse(str, { startRule: "MacroTail" as const });
}

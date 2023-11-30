// This file needs to be here because typescript does not know how to use the transpiler
// to directly load Pegjs grammars.
// @ts-nocheck
import _MacroParser from "./macros.peggy";
import { ParseFunction } from "./types";

type PegParser = {
    parse: ParseFunction;
    SyntaxError: (
        message: string,
        expected: string,
        found: unknown,
        location: unknown,
    ) => unknown;
};

const MacroParser = _MacroParser as PegParser;

export { MacroParser };

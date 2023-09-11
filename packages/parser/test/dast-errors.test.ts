import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import util from "util";
import { filterPositionInfo } from "../src/dast-to-xml/utils";
import { DastFunctionMacro, DastRootContent } from "../src/types";
import { MacroParser } from "../src/macros/parser";
import { gobbleFunctionArguments } from "../src/lezer-to-dast/gobble-function-arguments";
import { parser } from "../src/generated-assets/lezer-doenet";
import { showCursor } from "../src/parser";
import { TreeCursor } from "@lezer/common";
import { extractDastErrors } from "../src/extract-dast-errors";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

function parseToLezerTree(source: string): TreeCursor {
    return parser.parse(source).cursor();
}

describe("DAST", async () => {
    it("Shows error for incomplete XML tag", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;
        let cursor: TreeCursor;

        source = `<a`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<a><b>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(2);

        source = `<a!b`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<-/>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<x " />`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
    });
});

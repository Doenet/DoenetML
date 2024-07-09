import { describe, expect, it } from "vitest";
import util from "util";
import { lezerToDast, toXml } from "@doenet/parser";
import { normalizeDocumentDast } from "../src/state/redux-slices/dast/utils/normalize-dast";
import { ensurePretextTag } from "../src/utils/pretext/ensure-pretext-tag";
import { FlatDastRoot } from "@doenet/doenetml-worker-rust";
import { renderToPretext } from "../src/utils/pretext/render-to-pretext";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

// <p>
//   Hi
// </p>
const SIMPLE_FLAT_DAST = {
    type: "root",
    children: [
        {
            id: 0,
            annotation: "original",
        },
    ],
    elements: [
        {
            type: "element",
            name: "document",
            attributes: {},
            children: [
                {
                    id: 1,
                    annotation: "original",
                },
            ],
            data: {
                id: 0,
                action_names: [],
                props: {},
            },
        },
        {
            type: "element",
            name: "p",
            attributes: {},
            children: ["\n  Hi\n"],
            data: {
                id: 1,
                action_names: [],
            },
        },
    ],
    warnings: [],
} as FlatDastRoot;

describe("Pretext export", async () => {
    it("Wraps root in <pretext> tag", () => {
        const flatDast = structuredClone(SIMPLE_FLAT_DAST);
        expect(renderToPretext(flatDast)).toMatchObject("");
    });
});

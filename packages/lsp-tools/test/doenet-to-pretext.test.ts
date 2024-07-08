import { describe, expect, it } from "vitest";
import util from "util";
import { toXml } from "xast-util-to-xml";

import { DoenetSourceObject } from "../src/doenet-source-object";
import { doenetToMarkdown, textContent } from "../src";
import { trimLeadingWhitespace } from "../src/doenet-to-markdown/trim";
import { FlatDastRoot } from "@doenet/doenetml-worker-rust";
import { doenetToPretext } from "../src/doenet-to-pretext";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

// <p>
//   Here is some math: <m>x^2</m>
// </p>
const SAMPLE_FLAT_DAST1: FlatDastRoot = {
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
            },
        },
        {
            type: "element",
            name: "p",
            attributes: {},
            children: [
                "\n  Here is some math: ",
                {
                    id: 2,
                    annotation: "original",
                },
                "\n",
            ],
            data: {
                id: 1,
                action_names: [],
            },
            position: {
                start: {
                    line: 1,
                    column: 1,
                    offset: 0,
                },
                end: {
                    line: 3,
                    column: 5,
                    offset: 40,
                },
            },
        },
        {
            type: "element",
            name: "m",
            attributes: {},
            children: ["x^2"],
            data: {
                id: 2,
                action_names: [],
            },
            position: {
                start: {
                    line: 2,
                    column: 22,
                    offset: 25,
                },
                end: {
                    line: 2,
                    column: 32,
                    offset: 35,
                },
            },
        },
    ],
    warnings: [],
};

describe("doenet-to-pretext", () => {
    it("can convert simple document to pretext", () => {
        const result = doenetToPretext(SAMPLE_FLAT_DAST1);
        expect(toXml(result)).toEqual(`<?xml version="1.0" encoding="UTF-8"?>
<pretext><article>
<p>
  Here is some math: <m>x^2</m>
</p>
</article></pretext>`);
    });
});

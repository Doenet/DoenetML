import { describe, expect, it } from "vitest";
import util from "util";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import { normalizeDocumentDast } from "../src/dast-normalize/normalize-dast";
import {
    DastRoot,
    expandExternalExtend,
    extractDastErrors,
    filterPositionInfo,
    isDastElement,
} from "../src";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 20, true)));
};

const DoenetMLs = {
    abcdef: `<p name="par">hi</p>`,
    ghijkl: `<p extend="doenet:abcdef"> there</p>`,
};

/**
 * A mock function for retrieving DoenetML source from a URI,
 * using the URI `doenet:[code]`.
 */
function returnDoenetML(sourceUri: string) {
    return new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            const match = sourceUri.match(/^doenet:(\w+)/);

            if (match) {
                const doenetML = DoenetMLs[match[1]];

                if (doenetML) {
                    return resolve(doenetML);
                }
            }
            reject(`DoenetML for "${sourceUri}" not found.`);
        });
    });
}

describe("Expand external extend", async () => {
    it("load in external content via extend", async () => {
        const source = `<p extend="doenet:abcdef" />`;
        const result = await expandExternalExtend(
            lezerToDast(source),
            returnDoenetML,
        );

        const dast = filterPositionInfo(result.processedDast) as DastRoot;

        expect(result.errors.length).eq(0);

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        if (!isDastElement(p)) {
            throw Error("Something went wrong");
        }

        expect(p.children.length).eq(1);
        const externalContent = p.children[0];

        expect(externalContent).toMatchObject({
            type: "element",
            name: "_externalContent",
            attributes: {
                name: {
                    type: "attribute",
                    name: "name",
                    children: [{ type: "text", value: "par" }],
                },
                doenetMLSource: {
                    type: "attribute",
                    name: "doenetMLSource",
                    children: [{ type: "text", value: DoenetMLs.abcdef }],
                },
                forType: {
                    type: "attribute",
                    name: "forType",
                    children: [{ type: "text", value: "p" }],
                },
            },
            children: [{ type: "text", value: "hi" }],
        });
    });

    it("load in external content recursively via copy", async () => {
        const source = `<p copy="doenet:ghijkl" />`;
        const result = await expandExternalExtend(
            lezerToDast(source),
            returnDoenetML,
        );

        const dast = filterPositionInfo(result.processedDast) as DastRoot;

        expect(result.errors.length).eq(0);

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        if (!isDastElement(p)) {
            throw Error("Something went wrong");
        }

        expect(p.children.length).eq(1);
        const externalContent = p.children[0];

        expect(externalContent).toMatchObject({
            type: "element",
            name: "_externalContent",
            attributes: {
                doenetMLSource: {
                    type: "attribute",
                    name: "doenetMLSource",
                    children: [{ type: "text", value: DoenetMLs.ghijkl }],
                },
                forType: {
                    type: "attribute",
                    name: "forType",
                    children: [{ type: "text", value: "p" }],
                },
            },
            children: [
                {
                    type: "element",
                    name: "_externalContent",
                    attributes: {
                        name: {
                            type: "attribute",
                            name: "name",
                            children: [{ type: "text", value: "par" }],
                        },
                        doenetMLSource: {
                            type: "attribute",
                            name: "doenetMLSource",
                            children: [
                                { type: "text", value: DoenetMLs.abcdef },
                            ],
                        },
                        forType: {
                            type: "attribute",
                            name: "forType",
                            children: [{ type: "text", value: "p" }],
                        },
                    },
                    children: [{ type: "text", value: "hi" }],
                },
                { type: "text", value: " there" },
            ],
        });
    });

    it("attempt to load non-existing external content", async () => {
        const source = `<p extend="doenet:bad" />`;
        const result = await expandExternalExtend(
            lezerToDast(source),
            returnDoenetML,
        );

        expect(result.errors).toMatchInlineSnapshot(`
            [
              [1:4-1:23: Unable to retrieve DoenetML from extend="doenet:bad"],
            ]
          `);

        const dast = filterPositionInfo(result.processedDast) as DastRoot;

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        if (!isDastElement(p)) {
            throw Error("Something went wrong");
        }

        expect(p.children.length).eq(0);
    });

    it("attempt to extend external content that does not match type", async () => {
        const source = `<text extend="doenet:abcdef" />`;
        const result = await expandExternalExtend(
            lezerToDast(source),
            returnDoenetML,
        );

        expect(result.errors).toMatchInlineSnapshot(`
            [
              [1:7-1:29: Invalid DoenetML retrieved from extend="doenet:abcdef": it did not match the component type "text"],
            ]
          `);

        const dast = filterPositionInfo(result.processedDast) as DastRoot;

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        if (!isDastElement(p)) {
            throw Error("Something went wrong");
        }

        expect(p.children.length).eq(0);
    });
});

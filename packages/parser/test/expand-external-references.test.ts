import { describe, expect, it } from "vitest";
import util from "util";
import { lezerToDast } from "../src/lezer-to-dast";
import {
    DastRoot,
    expandExternalReferences,
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
    ghijkl: `<p copy="doenet:abcdef"> there</p>`,
};

/**
 * A mock function for retrieving DoenetML source from a URI,
 * using the URI `doenet:[code]`.
 */
function retrieveDoenetML(sourceUri: string) {
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

describe("Expand external references", async () => {
    it("load in external content via copy", async () => {
        const source = `<p copy="doenet:abcdef" />`;

        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                retrieveDoenetML,
            ),
        ) as DastRoot;

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

    it("load in external content via copy, case-insensitive match", async () => {
        const source = `<p cOpY="doenet:abcdef" />`;

        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                retrieveDoenetML,
            ),
        ) as DastRoot;

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

        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                retrieveDoenetML,
            ),
        ) as DastRoot;

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
        const source = `<p copy="doenet:bad" />`;
        let dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                retrieveDoenetML,
            ),
        ) as DastRoot;

        expect(extractDastErrors(dast)).toMatchObject([
            {
                message: 'Unable to retrieve DoenetML from copy="doenet:bad"',
                type: "error",
            },
        ]);

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        if (!isDastElement(p)) {
            throw Error("Something went wrong");
        }

        expect(p.children.length).eq(1);
        expect(p.children[0]).toMatchObject({
            message: 'Unable to retrieve DoenetML from copy="doenet:bad"',
            type: "error",
        });
    });

    it("attempt to copy external content that does not match type", async () => {
        const source = `<text copy="doenet:abcdef" />`;
        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                retrieveDoenetML,
            ),
        ) as DastRoot;

        expect(extractDastErrors(dast)).toMatchObject([
            {
                message:
                    'Invalid DoenetML retrieved from copy="doenet:abcdef": it did not match the component type "text"',
                type: "error",
            },
        ]);

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        if (!isDastElement(p)) {
            throw Error("Something went wrong");
        }

        expect(p.children.length).eq(1);
        expect(p.children[0]).toMatchObject({
            message:
                'Invalid DoenetML retrieved from copy="doenet:abcdef": it did not match the component type "text"',
            type: "error",
        });
    });

    it("cannot load in external content via extend", async () => {
        const source = `<p extend="doenet:abcdef" />`;

        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                retrieveDoenetML,
            ),
        ) as DastRoot;

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        if (!isDastElement(p)) {
            throw Error("Something went wrong");
        }

        expect(p.children.length).eq(0);
    });

    it("presence of extend attribute prevents loading of external content", async () => {
        const source = `<p copy="doenet:abcdef" extend="$q" />`;

        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                retrieveDoenetML,
            ),
        ) as DastRoot;

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        if (!isDastElement(p)) {
            throw Error("Something went wrong");
        }

        expect(p.children.length).eq(0);
    });

    it("presence of extend attribute prevents loading of external content, case-insensitive match", async () => {
        const source = `<p copy="doenet:abcdef" eXTend="$q" />`;

        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                retrieveDoenetML,
            ),
        ) as DastRoot;

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        if (!isDastElement(p)) {
            throw Error("Something went wrong");
        }

        expect(p.children.length).eq(0);
    });
});

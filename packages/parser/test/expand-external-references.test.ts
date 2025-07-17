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
    ghijkl: `<p copy="doenet:abcdef" name="par2"> there</p>`,
    mnopqr: `<p copy="doenet:ghijkl" name="p1"><p copy="doenet:ghijkl" name="p2"> more</p> text</p>`,
    stuvwx: `<section name="s">$s.creditAchieved<number name="n"/><point name="P" y="$s.creditAchieved"/><math extend="$P[$n]" /></section>`,
};

/**
 * A mock function for retrieving DoenetML source from a URI,
 * using the URI `doenet:[code]`.
 */
function fetchExternalDoenetML(sourceUri: string) {
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
                fetchExternalDoenetML,
            ),
        ) as DastRoot;

        expect(dast.sources).eqls([
            `<p copy="doenet:abcdef" />`,
            `<p name="par">hi</p>`,
        ]);

        expect(dast.children.length).eq(1);
        const p = dast.children[0];

        expect(p).eqls({
            type: "element",
            name: "p",
            attributes: {
                "source-1:name": {
                    type: "attribute",
                    name: "source-1:name",
                    source_doc: 1,
                    children: [{ type: "text", value: "par", source_doc: 1 }],
                },
                "source:sequence": {
                    type: "attribute",
                    name: "source:sequence",
                    children: [
                        { type: "text", value: "0" },
                        { type: "text", value: "1" },
                    ],
                },
            },
            children: [{ type: "text", value: "hi", source_doc: 1 }],
        });
    });

    it("load in external content via copy, case-insensitive match", async () => {
        const source = `<p cOpY="doenet:abcdef" />`;

        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                fetchExternalDoenetML,
            ),
        ) as DastRoot;

        expect(dast.sources).eqls([
            `<p cOpY="doenet:abcdef" />`,
            `<p name="par">hi</p>`,
        ]);

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        expect(p).eqls({
            type: "element",
            name: "p",
            attributes: {
                "source-1:name": {
                    type: "attribute",
                    name: "source-1:name",
                    source_doc: 1,
                    children: [{ type: "text", value: "par", source_doc: 1 }],
                },
                "source:sequence": {
                    type: "attribute",
                    name: "source:sequence",
                    children: [
                        { type: "text", value: "0" },
                        { type: "text", value: "1" },
                    ],
                },
            },
            children: [{ type: "text", value: "hi", source_doc: 1 }],
        });
    });

    it("load in external content recursively via copy", async () => {
        const source = `<p copy="doenet:ghijkl" name="p1" />`;

        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                fetchExternalDoenetML,
            ),
        ) as DastRoot;

        expect(dast.sources).eqls([
            `<p copy="doenet:ghijkl" name="p1" />`,
            `<p copy="doenet:abcdef" name="par2"> there</p>`,
            `<p name="par">hi</p>`,
        ]);

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        expect(p).eqls({
            type: "element",
            name: "p",
            attributes: {
                "source-2:name": {
                    type: "attribute",
                    name: "source-2:name",
                    source_doc: 2,
                    children: [{ type: "text", value: "par", source_doc: 2 }],
                },
                "source-1:name": {
                    type: "attribute",
                    name: "source-1:name",
                    source_doc: 1,
                    children: [{ type: "text", value: "par2", source_doc: 1 }],
                },
                name: {
                    type: "attribute",
                    name: "name",
                    children: [{ type: "text", value: "p1" }],
                },
                "source:sequence": {
                    type: "attribute",
                    name: "source:sequence",
                    children: [
                        { type: "text", value: "0" },
                        { type: "text", value: "1" },
                        { type: "text", value: "2" },
                    ],
                },
            },
            children: [
                { type: "text", value: "hi", source_doc: 2 },
                { type: "text", value: " there", source_doc: 1 },
            ],
        });
    });

    it("load in external content recursively and in parallel", async () => {
        const source = `<p copy="doenet:mnopqr" name="p1"><p copy="doenet:abcdef">ok</p></p>`;

        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                fetchExternalDoenetML,
            ),
        ) as DastRoot;

        expect(dast.sources).eqls([
            '<p copy="doenet:mnopqr" name="p1"><p copy="doenet:abcdef">ok</p></p>',
            '<p name="par">hi</p>',
            '<p copy="doenet:ghijkl" name="p1"><p copy="doenet:ghijkl" name="p2"> more</p> text</p>',
            '<p copy="doenet:abcdef" name="par2"> there</p>',
            '<p name="par">hi</p>',
            '<p copy="doenet:abcdef" name="par2"> there</p>',
            '<p name="par">hi</p>',
        ]);

        expect(dast.children.length).eq(1);
        const p = dast.children[0];
        expect(p).eqls({
            type: "element",
            name: "p",
            attributes: {
                name: {
                    type: "attribute",
                    name: "name",
                    children: [{ type: "text", value: "p1" }],
                },
                "source-2:name": {
                    type: "attribute",
                    name: "source-2:name",
                    source_doc: 2,
                    children: [{ type: "text", value: "p1", source_doc: 2 }],
                },
                "source-5:name": {
                    type: "attribute",
                    name: "source-5:name",
                    source_doc: 5,
                    children: [{ type: "text", value: "par2", source_doc: 5 }],
                },
                "source-6:name": {
                    type: "attribute",
                    name: "source-6:name",
                    source_doc: 6,
                    children: [{ type: "text", value: "par", source_doc: 6 }],
                },
                "source:sequence": {
                    type: "attribute",
                    name: "source:sequence",
                    children: [
                        { type: "text", value: "0" },
                        { type: "text", value: "2" },
                        { type: "text", value: "5" },
                        { type: "text", value: "6" },
                    ],
                },
            },
            children: [
                { type: "text", value: "hi", source_doc: 6 },
                { type: "text", value: " there", source_doc: 5 },
                {
                    type: "element",
                    name: "p",
                    attributes: {
                        name: {
                            type: "attribute",
                            name: "name",
                            source_doc: 2,
                            children: [
                                { type: "text", value: "p2", source_doc: 2 },
                            ],
                        },
                        "source-3:name": {
                            type: "attribute",
                            name: "source-3:name",
                            source_doc: 3,
                            children: [
                                { type: "text", value: "par2", source_doc: 3 },
                            ],
                        },
                        "source-4:name": {
                            type: "attribute",
                            name: "source-4:name",
                            source_doc: 4,
                            children: [
                                { type: "text", value: "par", source_doc: 4 },
                            ],
                        },
                        "source:sequence": {
                            type: "attribute",
                            name: "source:sequence",
                            children: [
                                { type: "text", value: "2" },
                                { type: "text", value: "3" },
                                { type: "text", value: "4" },
                            ],
                        },
                    },
                    children: [
                        { type: "text", value: "hi", source_doc: 4 },
                        { type: "text", value: " there", source_doc: 3 },
                        { type: "text", value: " more", source_doc: 2 },
                    ],
                    source_doc: 2,
                },
                { type: "text", value: " text", source_doc: 2 },
                {
                    type: "element",
                    name: "p",
                    attributes: {
                        "source-1:name": {
                            type: "attribute",
                            name: "source-1:name",
                            source_doc: 1,
                            children: [
                                { type: "text", value: "par", source_doc: 1 },
                            ],
                        },
                        "source:sequence": {
                            type: "attribute",
                            name: "source:sequence",
                            children: [
                                { type: "text", value: "0" },
                                { type: "text", value: "1" },
                            ],
                        },
                    },
                    children: [
                        { type: "text", value: "hi", source_doc: 1 },
                        { type: "text", value: "ok" },
                    ],
                },
            ],
        });
    });

    it("source doc is added to attributes and macro indices", async () => {
        const source = `<section copy="doenet:stuvwx" name="s2">$s2.creditAchieved</section>`;

        const dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                fetchExternalDoenetML,
            ),
        ) as DastRoot;

        expect(dast.sources).eqls([
            `<section copy="doenet:stuvwx" name="s2">$s2.creditAchieved</section>`,
            `<section name="s">$s.creditAchieved<number name="n"/><point name="P" y="$s.creditAchieved"/><math extend="$P[$n]" /></section>`,
        ]);

        expect(dast.children.length).eq(1);
        const section = dast.children[0];

        const creditAchievedRef = {
            type: "macro",
            attributes: {},
            source_doc: 1,
            path: [
                {
                    type: "pathPart",
                    name: "s",
                    index: [],
                    source_doc: 1,
                },
                {
                    type: "pathPart",
                    name: "creditAchieved",
                    index: [],
                    source_doc: 1,
                },
            ],
        };

        const creditAchievedRef2 = {
            type: "macro",
            attributes: {},
            path: [
                {
                    type: "pathPart",
                    name: "s2",
                    index: [],
                },
                {
                    type: "pathPart",
                    name: "creditAchieved",
                    index: [],
                },
            ],
        };

        const PnRef = {
            type: "macro",
            attributes: {},
            source_doc: 1,
            path: [
                {
                    type: "pathPart",
                    name: "P",
                    source_doc: 1,
                    index: [
                        {
                            type: "index",
                            source_doc: 1,
                            value: [
                                {
                                    type: "macro",
                                    attributes: {},
                                    source_doc: 1,
                                    path: [
                                        {
                                            type: "pathPart",
                                            name: "n",
                                            source_doc: 1,
                                            index: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        expect(section).eqls({
            type: "element",
            name: "section",
            attributes: {
                name: {
                    type: "attribute",
                    name: "name",
                    children: [{ type: "text", value: "s2" }],
                },
                "source-1:name": {
                    type: "attribute",
                    name: "source-1:name",
                    source_doc: 1,
                    children: [{ type: "text", value: "s", source_doc: 1 }],
                },
                "source:sequence": {
                    type: "attribute",
                    name: "source:sequence",
                    children: [
                        { type: "text", value: "0" },
                        { type: "text", value: "1" },
                    ],
                },
            },
            children: [
                creditAchievedRef,
                {
                    type: "element",
                    name: "number",
                    attributes: {
                        name: {
                            type: "attribute",
                            name: "name",
                            source_doc: 1,
                            children: [
                                { type: "text", value: "n", source_doc: 1 },
                            ],
                        },
                    },
                    children: [],
                    source_doc: 1,
                },
                {
                    type: "element",
                    name: "point",
                    attributes: {
                        name: {
                            type: "attribute",
                            name: "name",
                            source_doc: 1,
                            children: [
                                { type: "text", value: "P", source_doc: 1 },
                            ],
                        },
                        y: {
                            type: "attribute",
                            name: "y",
                            source_doc: 1,
                            children: [creditAchievedRef],
                        },
                    },
                    children: [],
                    source_doc: 1,
                },
                {
                    type: "element",
                    name: "math",
                    attributes: {
                        extend: {
                            type: "attribute",
                            name: "extend",
                            source_doc: 1,
                            children: [PnRef],
                        },
                    },
                    children: [],
                    source_doc: 1,
                },
                creditAchievedRef2,
            ],
        });
    });

    it("attempt to load non-existing external content", async () => {
        const source = `<p copy="doenet:bad" />`;
        let dast = filterPositionInfo(
            await expandExternalReferences(
                lezerToDast(source),
                fetchExternalDoenetML,
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
                fetchExternalDoenetML,
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
                fetchExternalDoenetML,
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
                fetchExternalDoenetML,
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
                fetchExternalDoenetML,
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

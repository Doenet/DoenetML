import { describe, expect, it } from "vitest";
import { parse, parseAndCompile, showCursor } from "../src/parser";

describe("Lezer Parsing Tests", () => {
    it("should parse a simple expression", () => {
        const inputOutput = [
            {
                inStr: "hi there",
                outStr: "Document(Text)",
            },
            {
                inStr: "hi there <doenet/>",
                outStr: "Document(Text,Element(SelfClosingTag(StartTag,TagName,SelfCloseEndTag)))",
            },
            {
                inStr: `<doenet attr1 attr2="foo"/>`,
                outStr: "Document(Element(SelfClosingTag(StartTag,TagName,Attribute(AttributeName),Attribute(AttributeName,Is,AttributeValue),SelfCloseEndTag)))",
            },
            {
                inStr: "<doenet>child</doenet>",
                outStr: "Document(Element(OpenTag(StartTag,TagName,EndTag),Text,CloseTag(StartCloseTag,TagName,EndTag)))",
            },
        ];
        for (const { inStr, outStr } of inputOutput) {
            const parsed = parse(inStr);
            const parsedRepr = showCursor(parsed);
            expect(parsedRepr).toEqual(outStr);
        }
    });
    it("can parseAndCompile nodes", () => {
        const inputOutput = [
            {
                inStr: "hi there",
                outStr: { components: ["hi there"], errors: [] },
            },
            {
                inStr: "hi there <doenet/>",
                outStr: {
                    components: [
                        "hi there ",
                        {
                            attributeRanges: {},
                            children: [],
                            componentType: "doenet",
                            props: {},
                            doenetMLrange: {
                                selfCloseBegin: 10,
                                selfCloseEnd: 18,
                            },
                        },
                    ],
                    errors: [],
                },
            },
            {
                inStr: `<doenet attr1 attr2="foo"/>`,
                outStr: {
                    components: [
                        {
                            attributeRanges: {
                                attr2: {
                                    attrBegin: 15,
                                    attrEnd: 25,
                                    begin: 22,
                                    end: 24,
                                },
                            },
                            componentType: "doenet",
                            props: { attr1: true, attr2: "foo" },
                            children: [],
                            doenetMLrange: {
                                selfCloseBegin: 1,
                                selfCloseEnd: 27,
                            },
                        },
                    ],
                    errors: [],
                },
            },
            {
                inStr: "<doenet>child</doenet>",
                outStr: {
                    components: [
                        {
                            attributeRanges: {},
                            componentType: "doenet",
                            props: {},
                            children: ["child"],
                            doenetMLrange: {
                                openBegin: 1,
                                openEnd: 8,
                                closeBegin: 14,
                                closeEnd: 22,
                            },
                        },
                    ],
                    errors: [],
                },
            },
        ];
        for (const { inStr, outStr } of inputOutput) {
            const parsed = parseAndCompile(inStr);
            expect(parsed).toEqual(outStr);
        }
    });
});

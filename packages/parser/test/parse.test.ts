import { describe, expect, it } from "vitest";
import { parse, showCursor } from "../src/parser";

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
});

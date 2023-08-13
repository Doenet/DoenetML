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
        outStr: "Document(Text,Element(SelfClosingTag(StartTag,TagName)))",
      },
      {
        inStr: `<doenet attr1 attr2="foo"/>`,
        outStr:
          "Document(Element(SelfClosingTag(StartTag,TagName,Attribute(AttributeName),Attribute(AttributeName,Is,AttributeValue))))",
      },
      {
        inStr: "<doenet>child</doenet>",
        outStr:
          "Document(Element(OpenTag(StartTag,TagName),Text,CloseTag(StartCloseTag,TagName)))",
      },
    ];
    for (const { inStr, outStr } of inputOutput) {
      const parsed = parse(inStr);
      const parsedRepr = showCursor(parsed);
      console.log(parsedRepr);
      expect(parsedRepr).toEqual(outStr);
    }
  });
  it("can parseAndCompile nodes", () => {
    const inputOutput = [
      {
        inStr: "hi there",
        outStr: ["hi there"],
      },
      {
        inStr: "hi there <doenet/>",
        outStr: [
          "hi there ",
          {
            children: [],
            componentType: "doenet",
            props: {},
            range: {
              selfCloseBegin: 10,
              selfCloseEnd: 19,
            },
          },
        ],
      },
      {
        inStr: `<doenet attr1 attr2="foo"/>`,
        outStr: [
          {
            componentType: "doenet",
            props: { attr1: true, attr2: "foo" },
            children: [],
            range: { selfCloseBegin: 1, selfCloseEnd: 28 },
          },
        ],
      },
      {
        inStr: "<doenet>child</doenet>",
        outStr: [
          {
            componentType: "doenet",
            props: {},
            children: ["child"],
            range: { openBegin: 1, openEnd: 8, closeBegin: 13, closeEnd: 22 },
          },
        ],
      },
    ];
    for (const { inStr, outStr } of inputOutput) {
      const parsed = parseAndCompile(inStr);
      console.log(parsed);
      expect(parsed).toEqual(outStr);
    }
  });
});

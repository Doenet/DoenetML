import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import util from "util";
import { DastRoot } from "../src/types";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("parser", () => {
    let source: string;
    let dast: DastRoot;
    let xml: string;

    it("can print basic doenet to xml", () => {
        source = `abc`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("abc");

        source = `<p>abc</p>`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("<p>abc</p>");

        source = `<foo />`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("<foo />");
    });

    it("can print macros", () => {
        source = `$foo.bar`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("$foo.bar");
    });

    it("can print function macros", () => {
        source = `$$foo(x)`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("$$foo(x)");
    });
});

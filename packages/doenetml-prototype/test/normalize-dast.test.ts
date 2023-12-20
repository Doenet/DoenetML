import { describe, expect, it } from "vitest";
import util from "util";
import { lezerToDast, toXml } from "@doenet/parser";
import { normalizeDocumentDast } from "../src/state/redux-slices/dast/utils/normalize-dast";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("Normalize dast", async () => {
    it("wraps in a <document> tag", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<p>hi</p>`;
        dast = lezerToDast(source);
        expect(normalizeDocumentDast(dast)).toMatchObject({
            type: "root",
            children: [{ type: "element", name: "document" }],
        });
    });
    it("removes leading and trailing whitespace", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `  <p>hi</p>  `;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><p>hi</p></document>",
        );

        source = `  ho <p>hi</p> there  `;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document>ho <p>hi</p> there</document>",
        );
    });
    it("removes xml instructions and doctypes", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = ` <? foo ?> <p>hi</p>  `;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><p>hi</p></document>",
        );

        source = `<!doctype html> <p>hi</p>  `;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><p>hi</p></document>",
        );
    });
    it("removes comments", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = ` <!-- foo --> <p>hi</p>  `;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><p>hi</p></document>",
        );

        source = ` <p><!-- bar -->hi</p>  `;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><p>hi</p></document>",
        );
    });
    it("converts CDATA to text", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<![CDATA[foo]]><p>hi</p>`;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document>foo<p>hi</p></document>",
        );

        source = `<section><![CDATA[foo]]><p>hi</p></section>`;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><section>foo<p>hi</p></section></document>",
        );
    });
    it("preserves existing document tag", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `  <document id="foo">   <p>hi</p>  </document>  `;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            `<document id="foo"><p>hi</p></document>`,
        );
    });
});

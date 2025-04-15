import { describe, expect, it } from "vitest";
import util from "util";
import { lezerToDast, toXml, normalizeDocumentDast } from "@doenet/parser";

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
            '<document><division type="section">foo<p>hi</p></division></document>',
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
    it("converts xml:id to name", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<p xml:id="foo-bar">hi</p>`;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><p name="foo-bar">hi</p></document>',
        );
    });
    it("converts xref ref to dollar-sign form", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<xref ref="$(foo-bar)" />`;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><xref ref="$(foo-bar)" /></document>',
        );

        source = `<xref ref="foo-bar" />`;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><xref ref="$(foo-bar)" /></document>',
        );
    });
});

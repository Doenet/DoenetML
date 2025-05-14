import { describe, expect, it } from "vitest";
import util from "util";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import { normalizeDocumentDast } from "../src/dast-normalize/normalize-dast";

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

    it("Sugars in repeat setup children", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        // nothing added with no valueName or indexName
        source = "<repeat>x</repeat>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><repeat>x</repeat></document>",
        );

        // with valueName
        source = "<repeat valueName='q'>x</repeat>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><repeat valueName="q">x<_repeatSetup><_placeholder name="q" /></_repeatSetup></repeat></document>',
        );

        // with indexName
        source = "<repeat indexName='i'>x</repeat>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><repeat indexName="i">x<_repeatSetup><integer name="i" /></_repeatSetup></repeat></document>',
        );

        // with valueName and indexName
        source = "<repeat valueName='v' indexName='j'>x</repeat>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><repeat valueName="v" indexName="j">x<_repeatSetup><_placeholder name="v" /><integer name="j" /></_repeatSetup></repeat></document>',
        );
    });

    it("Sugars in cases of conditionalContent", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        // nothing changed with just case
        source =
            '<conditionalContent><case condition="a">b</case></conditionalContent>';
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><conditionalContent><case condition="a">b</case></conditionalContent></document>',
        );

        // else changes to cases
        source =
            '<conditionalContent><case condition="a">b</case><else>c</else></conditionalContent>';
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><conditionalContent><case condition="a">b</case><case condition="true">c</case></conditionalContent></document>',
        );

        // with no else/cases, we add a single case
        source = '<conditionalContent condition="a">b</conditionalContent>';
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><conditionalContent><case condition="a">b</case></conditionalContent></document>',
        );
    });
});

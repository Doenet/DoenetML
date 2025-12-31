import { describe, expect, it } from "vitest";
import util from "util";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import { normalizeDocumentDast } from "../src/dast-normalize/normalize-dast";
import { extractDastErrors } from "../src";

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

    it("Sugars in repeat template and _repeatSetup children", () => {
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
            '<document><conditionalContent><case condition="a"><group>b</group></case></conditionalContent></document>',
        );

        // else changes to cases
        source =
            '<conditionalContent><case condition="a">b</case><else>c</else></conditionalContent>';
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><conditionalContent><case condition="a"><group>b</group></case><case><group>c</group></case></conditionalContent></document>',
        );

        // with no else/cases, we add a single case
        source = '<conditionalContent condition="a">b</conditionalContent>';
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><conditionalContent><case condition="a"><group>b</group></case></conditionalContent></document>',
        );
    });

    it("Sugars in options and component wrapper of select", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        // nothing changes if have options already
        source = "<select><option>$a</option><option>b</option></select>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><select><option>$a</option><option>b</option></select></document>",
        );

        // defaults to math
        source = "<select>$a b</select>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><select><option><math>$a</math></option><option><math>b</math></option></select></document>",
        );

        // set type to "text"
        source = `<select type="text">$a b</select>`;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            `<document><select type="text"><option><text>$a</text></option><option><text>b</text></option></select></document>`,
        );

        // invalid type becomes "math"
        source = `<select type="bad">$a b</select>`;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            `<document><select type="bad"><option><math>$a</math></option><option><math>b</math></option></select></document>`,
        );

        // parentheses prevent a split
        source = `<select> ($a b (c - $$f(x)) ) d$e</select>`;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            `<document><select><option><math>($a b (c - $$f(x)) )</math></option><option><math>d$e</math></option></select></document>`,
        );
    });

    it("Invalidly named elements get replaced with <_error>", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = "<_foo />";
        dast = lezerToDast(source);
        expect(extractDastErrors(normalizeDocumentDast(dast))).toMatchObject([
            {
                message: `Invalid component name "_foo". Names must start with a letter.`,
                type: "error",
            },
        ]);

        source = "<p name='_foo' />";
        dast = lezerToDast(source);
        expect(extractDastErrors(normalizeDocumentDast(dast))).toMatchObject([
            {
                message: `Invalid attribute name='_foo'. Names must start with a letter.`,
                type: "error",
            },
        ]);
    });
});

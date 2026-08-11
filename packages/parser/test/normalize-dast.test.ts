import { describe, expect, it } from "vitest";
import util from "util";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import { normalizeDocumentDast } from "../src/dast-normalize/normalize-dast";
import { extractDastErrors } from "../src";
import type { DastElement } from "../src/types";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("Normalize dast", async () => {
    it("wraps a field's bare expression in a <function> child", () => {
        const dast = normalizeDocumentDast(
            lezerToDast(`<slopeField>y - x</slopeField>`),
        );
        expect(toXml(dast)).toEqual(
            `<document><slopeField><function variables="x y">y - x</function></slopeField></document>`,
        );
    });
    it("moves a field's variables onto the <function> it wraps", () => {
        const dast = normalizeDocumentDast(
            lezerToDast(
                `<vectorField variables="$v1 $v2">($v2,-$v1)</vectorField>`,
            ),
        );
        // The references are carried over untouched, so they resolve against
        // whatever names them rather than being read here.
        expect(toXml(dast)).toEqual(
            `<document><vectorField><function variables="$v1 $v2">($v2,-$v1)</function></vectorField></document>`,
        );
    });
    it("leaves a field's explicit <function> child, and its variables, alone", () => {
        const dast = normalizeDocumentDast(
            lezerToDast(
                `<slopeField variables="s t"><function variables="u v">u-v</function></slopeField>`,
            ),
        );
        expect(toXml(dast)).toEqual(
            `<document><slopeField variables="s t"><function variables="u v">u-v</function></slopeField></document>`,
        );
    });
    it("leaves a field's label child outside the <function> it wraps", () => {
        const dast = normalizeDocumentDast(
            lezerToDast(`<slopeField>y - x<label>hi</label></slopeField>`),
        );
        expect(toXml(dast)).toEqual(
            `<document><slopeField><function variables="x y">y - x</function><label>hi</label></slopeField></document>`,
        );
    });
    it("does not give a field a <function> when it has no expression", () => {
        const dast = normalizeDocumentDast(
            lezerToDast(`<slopeField>   </slopeField>`),
        );
        expect(toXml(dast)).toEqual(
            `<document><slopeField>   </slopeField></document>`,
        );
    });
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
            '<document><division type="section">foo<p>hi</p><_dynamicChildren /></division></document>',
        );
    });
    it("marks dynamic children that are postponed with their parent", () => {
        function getDynamicChildrenAttributes(source: string) {
            const dast = lezerToDast(source);
            const normalized = normalizeDocumentDast(dast);
            const document = normalized.children[0] as DastElement;
            const section = document.children[0] as DastElement;
            const dynamicChildren = section.children.find(
                (child): child is DastElement =>
                    child.type === "element" &&
                    child.name === "_dynamicChildren",
            );
            expect(dynamicChildren).toBeDefined();
            return dynamicChildren!.attributes;
        }

        expect(
            getDynamicChildrenAttributes(
                `<aside postponeRendering><title>Hint</title><p>Secret.</p></aside>`,
            ).deferUntilParentRendered,
        ).toMatchObject({
            type: "attribute",
            name: "deferUntilParentRendered",
            children: [{ type: "text", value: "true" }],
        });

        expect(
            getDynamicChildrenAttributes(
                `<aside><title>Hint</title><p>Already created.</p></aside>`,
            ),
        ).not.toHaveProperty("deferUntilParentRendered");
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

    it("migrates deprecated selectPrimeNumbers minValue/maxValue attributes", () => {
        const source = `<selectPrimeNumbers minValue="5" maxValue="19" />`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            '<document><selectPrimeNumbers from="5" to="19" /></document>',
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );

        expect(warnings).toMatchObject([
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `minValue` on `<selectPrimeNumbers>` is deprecated; use `from` instead.",
            },
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `maxValue` on `<selectPrimeNumbers>` is deprecated; use `to` instead.",
            },
        ]);
    });

    it("prefers canonical selectPrimeNumbers attributes when deprecated and new names coexist", () => {
        const source = `<selectPrimeNumbers minValue="5" from="7" maxValue="19" to="17" />`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            '<document><selectPrimeNumbers from="7" to="17" /></document>',
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );
        expect(warnings).toMatchObject([
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `minValue` on `<selectPrimeNumbers>` is deprecated and ignored because `from` is also specified.",
            },
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `maxValue` on `<selectPrimeNumbers>` is deprecated and ignored because `to` is also specified.",
            },
        ]);
        expect(warnings?.[0].position).toBeDefined();
    });

    it("migrates deprecated samplePrimeNumbers minValue/maxValue attributes", () => {
        const source = `<samplePrimeNumbers minValue="5" maxValue="19" />`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            '<document><samplePrimeNumbers from="5" to="19" /></document>',
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );

        expect(warnings).toMatchObject([
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `minValue` on `<samplePrimeNumbers>` is deprecated; use `from` instead.",
            },
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `maxValue` on `<samplePrimeNumbers>` is deprecated; use `to` instead.",
            },
        ]);
    });

    it("prefers canonical samplePrimeNumbers attributes when deprecated and new names coexist", () => {
        const source = `<samplePrimeNumbers minValue="5" from="7" maxValue="19" to="17" />`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            '<document><samplePrimeNumbers from="7" to="17" /></document>',
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );
        expect(warnings).toMatchObject([
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `minValue` on `<samplePrimeNumbers>` is deprecated and ignored because `from` is also specified.",
            },
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `maxValue` on `<samplePrimeNumbers>` is deprecated and ignored because `to` is also specified.",
            },
        ]);
        expect(warnings?.[0].position).toBeDefined();
    });

    it("drops deprecated description attributes", () => {
        const source = `<description aggregateScores weight="2">hello</description>`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            "<document><description>hello</description></document>",
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );
        expect(warnings).toMatchObject([
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `aggregateScores` on `<description>` is deprecated and ignored.",
            },
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `weight` on `<description>` is deprecated and ignored.",
            },
        ]);
        expect(warnings?.[0].position).toBeDefined();
    });

    it("drops deprecated shortDescription attributes", () => {
        const source = `<shortDescription draggable layer="2">hi</shortDescription>`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            "<document><shortDescription>hi</shortDescription></document>",
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );
        expect(warnings).toMatchObject([
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `draggable` on `<shortDescription>` is deprecated and ignored.",
            },
            {
                type: "error",
                error_type: "warning",
                message:
                    "[deprecation] Attribute `layer` on `<shortDescription>` is deprecated and ignored.",
            },
        ]);
    });

    it("keeps non-deprecated attributes when dropping deprecated ones", () => {
        const source = `<description name="d" aggregateScores>hello</description>`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            '<document><description name="d">hello</description></document>',
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );
        expect(warnings).toHaveLength(1);
        expect(warnings[0].message).toContain(
            "[deprecation] Attribute `aggregateScores` on `<description>` is deprecated and ignored.",
        );
    });

    it("drops deprecated attributes regardless of case", () => {
        // DoenetML matches attribute names case-insensitively; the deprecation
        // pass must too, or `<description WeIgHt>` would slip through and
        // hard-error after `weight` is removed from <description>.
        const source = `<description WeIgHt="2" AGGREGATESCORES>hello</description>`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            "<document><description>hello</description></document>",
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );
        // Warnings come out in registry-iteration order (aggregateScores
        // listed before weight), not source order.
        expect(warnings).toMatchObject([
            {
                message:
                    "[deprecation] Attribute `aggregateScores` on `<description>` is deprecated and ignored.",
            },
            {
                message:
                    "[deprecation] Attribute `weight` on `<description>` is deprecated and ignored.",
            },
        ]);
    });

    it("drops renamed scored-section coloring attributes on description", () => {
        const source = `<description forceIndividualAnswerColoring>hello</description>`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            "<document><description>hello</description></document>",
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );
        expect(warnings.map((x) => x.message).sort()).toEqual([
            "[deprecation] Attribute `forceIndividualAnswerColoring` on `<description>` is deprecated and ignored.",
        ]);
    });

    it("renames deprecated attributes regardless of case", () => {
        const source = `<selectPrimeNumbers MINvalue="5" maxVALUE="19" />`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            '<document><selectPrimeNumbers from="5" to="19" /></document>',
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );
        expect(warnings).toMatchObject([
            {
                message:
                    "[deprecation] Attribute `minValue` on `<selectPrimeNumbers>` is deprecated; use `from` instead.",
            },
            {
                message:
                    "[deprecation] Attribute `maxValue` on `<selectPrimeNumbers>` is deprecated; use `to` instead.",
            },
        ]);
    });

    it("detects rename conflicts case-insensitively", () => {
        // `MinValue` and `From` refer to the same canonical attribute; the
        // deprecated form must be dropped with a conflict warning, not silently
        // co-exist with the canonical form.
        const source = `<selectPrimeNumbers MinValue="5" From="7" />`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        expect(toXml(normalized)).toEqual(
            '<document><selectPrimeNumbers From="7" /></document>',
        );

        const warnings = extractDastErrors(normalized).filter(
            (error) => error.error_type === "warning",
        );
        expect(warnings).toMatchObject([
            {
                message:
                    "[deprecation] Attribute `minValue` on `<selectPrimeNumbers>` is deprecated and ignored because `from` is also specified.",
            },
        ]);
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

    it("Adds error when answer type=videoWatched is missing video attribute", () => {
        const source = `<answer type="videoWatched" />`;
        const dast = lezerToDast(source);

        expect(extractDastErrors(normalizeDocumentDast(dast))).toMatchObject([
            {
                message:
                    "Answer with type videoWatched must have a video attribute",
                type: "error",
            },
        ]);
    });

    it("Sugars answer type=videoWatched with an award referencing the video", () => {
        const source = `<answer type="videoWatched" video="$v" />`;
        const dast = lezerToDast(source);
        const normalized = normalizeDocumentDast(dast);

        function findElementByName(node: any, name: string): any {
            if (node?.type === "element" && node.name === name) {
                return node;
            }
            if (!Array.isArray(node?.children)) {
                return undefined;
            }
            for (const child of node.children) {
                const found = findElementByName(child, name);
                if (found) {
                    return found;
                }
            }
            return undefined;
        }

        const answerElement = findElementByName(normalized, "answer");
        expect(answerElement).toBeDefined();

        const awardElement = answerElement.children.find(
            (child: any) => child.type === "element" && child.name === "award",
        );
        expect(awardElement).toBeDefined();

        expect(awardElement).toMatchObject({
            attributes: {
                credit: {
                    children: [
                        {
                            type: "macro",
                            path: [{ name: "v" }, { name: "fractionWatched" }],
                        },
                    ],
                },
            },
            children: [
                {
                    type: "element",
                    name: "when",
                    children: [{ type: "text", value: "true" }],
                },
            ],
        });
    });

    // See `postponeRenderSugar` in component-sugar/postponeRender.ts. For
    // `<solution>`/`<givenAnswer>` it always runs (unlike `<aside>`/`<proof>`
    // below, where it's conditional on `postponeRendering`).
    it("Sugars solution/givenAnswer into a _postponeRenderContainer", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        // content with no title gets wrapped
        source = "<solution><p>hi</p></solution>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><solution><_postponeRenderContainer><p>hi</p></_postponeRenderContainer></solution></document>",
        );

        // a leading title is hoisted out of the container
        source = "<solution><title>T</title><p>hi</p></solution>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><solution><title>T</title><_postponeRenderContainer><p>hi</p></_postponeRenderContainer></solution></document>",
        );

        // givenAnswer follows the same unconditional wrapping
        source = "<givenAnswer><p>hi</p></givenAnswer>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><givenAnswer><_postponeRenderContainer><p>hi</p></_postponeRenderContainer></givenAnswer></document>",
        );
    });

    // `<aside>`/`<proof>` both support dynamic children (see
    // COMPONENTS_WITH_DYNAMIC_CHILDREN in component-sugar/dynamicChildren.ts),
    // so a `<_dynamicChildren>` sibling is always appended regardless of
    // `postponeRendering`. What's conditional is only the postpone-render
    // wrapping, and whether `<_dynamicChildren>` gets a
    // `deferUntilParentRendered="true"` attribute (it does exactly when the
    // sibling `<_postponeRenderContainer>` is present, so the runtime knows
    // to defer creating these children until the parent renders).
    it("Sugars aside/proof into a _postponeRenderContainer only when postponeRendering is truthy", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        // no postponeRendering attribute: left untouched, no deferral flag
        source = "<aside><title>Hint</title><p>Secret.</p></aside>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><aside><title>Hint</title><p>Secret.</p><_dynamicChildren /></aside></document>",
        );

        // bare postponeRendering (no value) counts as truthy: wrapped, and
        // the attribute itself is normalized to postponeRendering="true"
        source =
            "<aside postponeRendering><title>Hint</title><p>Secret.</p></aside>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><aside postponeRendering="true"><title>Hint</title><_postponeRenderContainer><p>Secret.</p></_postponeRenderContainer><_dynamicChildren deferUntilParentRendered="true" /></aside></document>',
        );

        // postponeRendering="TRUE": still wrapped (case-insensitive)
        source = '<aside postponeRendering="TRUE"><p>x</p></aside>';
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><aside postponeRendering="TRUE"><_postponeRenderContainer><p>x</p></_postponeRenderContainer><_dynamicChildren deferUntilParentRendered="true" /></aside></document>',
        );

        // postponeRendering="false": explicitly opted out, left untouched
        source =
            '<aside postponeRendering="false"><title>Hint</title><p>Secret.</p></aside>';
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><aside postponeRendering="false"><title>Hint</title><p>Secret.</p><_dynamicChildren /></aside></document>',
        );

        // proof follows the same conditional branch as aside
        source = "<proof postponeRendering><p>Secret.</p></proof>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><proof postponeRendering="true"><_postponeRenderContainer><p>Secret.</p></_postponeRenderContainer><_dynamicChildren deferUntilParentRendered="true" /></proof></document>',
        );
    });

    // See `pretzelSugar` in component-sugar/pretzel.ts. All of a <pretzel>'s
    // children get wrapped in a single <_pretzelArranger>, and any <answer>
    // that is a direct child of a direct <problem> child is renamed to
    // <givenAnswer>.
    it("Sugars pretzel into a _pretzelArranger and renames nested answers to givenAnswer", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        // an <answer> inside a direct <problem> child is renamed to <givenAnswer>.
        // The tree walk in normalize-dast.ts is pre-order and re-reads a node's
        // children after mutating them, so this renamed node is immediately
        // revisited and picks up givenAnswer's own postpone-render sugar too -
        // hence the (empty, since <answer/> had no children of its own) nested
        // <_postponeRenderContainer />, and <problem>'s own <_dynamicChildren />
        // (problem supports dynamic children independent of pretzel).
        source = "<pretzel><problem><answer/></problem></pretzel>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><pretzel><_pretzelArranger><problem><givenAnswer><_postponeRenderContainer /></givenAnswer><_dynamicChildren /></problem></_pretzelArranger></pretzel></document>",
        );

        // an <answer> not nested in a <problem> is left alone - the rename is
        // scoped to direct problem > answer pairs only, not all descendants
        source = "<pretzel><answer/></pretzel>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><pretzel><_pretzelArranger><answer /></_pretzelArranger></pretzel></document>",
        );

        // a mode attribute is forwarded onto the arranger
        source = '<pretzel mode="foo"><problem><answer/></problem></pretzel>';
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            '<document><pretzel mode="foo"><_pretzelArranger mode="foo"><problem><givenAnswer><_postponeRenderContainer /></givenAnswer><_dynamicChildren /></problem></_pretzelArranger></pretzel></document>',
        );

        // with no mode attribute, the arranger has none either
        source = "<pretzel><p>hi</p></pretzel>";
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><pretzel><_pretzelArranger><p>hi</p></_pretzelArranger></pretzel></document>",
        );
    });

    // Regression guard: addDynamicChildrenSugar only checks a node's *direct*
    // children for a <_postponeRenderContainer> before adding
    // deferUntilParentRendered (see component-sugar/dynamicChildren.ts). A
    // <solution> nested inside a <problem> produces its own container, but
    // it's not a direct child of <problem>, so <problem>'s <_dynamicChildren>
    // must stay unaffected (no deferUntilParentRendered attribute).
    it("Does not let an inner solution's postpone-render sugar affect an outer problem's dynamicChildren sugar", () => {
        const source = "<problem><solution><p>hi</p></solution></problem>";
        const dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><problem><solution><_postponeRenderContainer><p>hi</p></_postponeRenderContainer></solution><_dynamicChildren /></problem></document>",
        );
    });

    it("Adds error when answer type=videoWatched has non-reference video attribute", () => {
        const source = `<answer type="videoWatched" video="myVideo" />`;
        const dast = lezerToDast(source);

        expect(extractDastErrors(normalizeDocumentDast(dast))).toMatchObject([
            {
                message:
                    "Answer with type videoWatched must have video attribute that is a reference",
                type: "error",
            },
        ]);
    });
});

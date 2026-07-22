import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

// Anchor colors of the built-in palettes used by these tests.
const DEFAULT_1 = "#1f5dff";
const DEFAULT_4 = "#644CD6";
const OKABEITO_1 = "#0072b2";
const OKABEITO_2 = "#c15400";
const TOLBRIGHT_1 = "#4477aa";

async function selectedStyleOf(
    core: any,
    resolvePathToNodeIdx: any,
    name: string,
) {
    const stateVariables = await core.returnAllStateVariables(false, true);
    return stateVariables[await resolvePathToNodeIdx(name)].stateValues
        .selectedStyle;
}

describe("Style palette tag tests @group4", async () => {
    it("selects a palette for the document", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="okabeito" />
<point name="P" />
<point name="Q" styleNumber="2" />
`,
        });

        const styleP = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(styleP.markerColor).eq(OKABEITO_1);
        expect(styleP.lineWidth).eq(4);

        const styleQ = await selectedStyleOf(core, resolvePathToNodeIdx, "Q");
        expect(styleQ.markerColor).eq(OKABEITO_2);
        expect(styleQ.markerStyle).eq("square");
    });

    it("palette graphics reach the renderer at the opacity they were verified at", async () => {
        // Palette colors are checked against the 3:1 graphic threshold at full
        // strength, so expansion states full opacity for a palette that names
        // none. What matters is that the value survives all the way to
        // `selectedStyle`: if it did not, `resolveStyleDefinition` would fill
        // in the built-in 0.7 and blend every one of these colors 70% into the
        // canvas, well below the threshold it was chosen against.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="s"><stylePalette palette="okabeito" /><point name="P" /></section>
<point name="D" />
`,
        });

        const styleP = await selectedStyleOf(core, resolvePathToNodeIdx, "s.P");
        expect(styleP.lineOpacity).eq(1);
        expect(styleP.markerOpacity).eq(1);

        // The default palette names 0.7 on every style, so the historical
        // softer look is untouched outside the palette's scope.
        const styleD = await selectedStyleOf(core, resolvePathToNodeIdx, "D");
        expect(styleD.lineOpacity).eq(0.7);
        expect(styleD.markerOpacity).eq(0.7);
    });

    it("selects a palette from inside setup", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
    <stylePalette palette="okabeito" />
</setup>
<point name="P" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(OKABEITO_1);
    });

    it("palette scopes to its section; outside is unaffected", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="s1">
    <stylePalette palette="okabeito" />
    <point name="P" />
</section>
<section name="s2">
    <point name="P" />
</section>
`,
        });

        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "s1.P"))
                .markerColor,
        ).eq(OKABEITO_1);
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "s2.P"))
                .markerColor,
        ).eq(DEFAULT_1);
    });

    it("palette selection resets ancestor styleDefinition overrides", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="1" markerColor="green" />
<section name="s1">
    <stylePalette palette="okabeito" />
    <point name="P" />
</section>
<section name="s2">
    <point name="P" />
</section>
`,
        });

        // The section that selected a palette starts fresh from the palette;
        // the sibling still sees the document-level override.
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "s1.P"))
                .markerColor,
        ).eq(OKABEITO_1);
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "s2.P"))
                .markerColor,
        ).eq("green");
    });

    it("local styleDefinition applies on top of the palette", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="s">
    <stylePalette palette="okabeito" />
    <styleDefinition styleNumber="1" markerColor="green" />
    <point name="P" />
</section>
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "s.P");
        expect(style.markerColor).eq("green");
        // Non-overridden keys still come from the palette.
        expect(style.lineColor).eq(OKABEITO_1);
    });

    it("subsection can select a different palette", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="okabeito" />
<section name="outer">
    <point name="P" />
    <section name="inner">
        <stylePalette palette="tolbright" />
        <point name="Q" />
    </section>
</section>
`,
        });

        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "outer.P"))
                .markerColor,
        ).eq(OKABEITO_1);
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "outer.inner.Q"))
                .markerColor,
        ).eq(TOLBRIGHT_1);
    });

    it("style numbers beyond the palette size cycle through the palette", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="okabeito" />
<point name="P" styleNumber="10" />
`,
        });

        // okabeito has 8 styles, so style 10 cycles to style 2.
        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(OKABEITO_2);
        expect(style.markerStyle).eq("square");
    });

    it("cycling also applies inside a section that inherits the palette", async () => {
        // Exercises the activeStylePaletteName ancestor chain: the section
        // selects no palette of its own, so cycling must key off the palette
        // name inherited from the document.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="okabeito" />
<section name="s">
    <point name="P" styleNumber="10" />
</section>
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "s.P");
        expect(style.markerColor).eq(OKABEITO_2);
        expect(style.markerStyle).eq("square");
    });

    it("without a palette, style numbers beyond the defaults keep the historical fallback", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P" styleNumber="10" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(DEFAULT_1);
    });

    it("a styleDefinition for an out-of-range number seeds from the cycled palette entry", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="okabeito" />
<styleDefinition styleNumber="10" lineColor="black" />
<point name="P" styleNumber="10" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.lineColor).eq("black");
        // Unset keys come from okabeito style 2 (10 cycles to 2 in a palette of 8).
        expect(style.markerColor).eq(OKABEITO_2);
    });

    it("an unknown palette name falls back to the default palette with a diagnostic", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="noSuchPalette" />
<point name="P" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(DEFAULT_1);

        const { infos } = getDiagnosticsByType(core);
        expect(
            infos.some((diagnostic: any) =>
                diagnostic.message.includes(
                    "Invalid value `noSuchPalette` for attribute `palette`",
                ),
            ),
        ).eq(true);
    });

    it("palette names match case-insensitively", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="OkabeIto" />
<point name="P" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(OKABEITO_1);
    });

    it("a bare <stylePalette/> selects the default palette explicitly, so it still resets and cycles", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="1" markerColor="green" />
<section name="s">
    <stylePalette />
    <point name="P" />
    <point name="Q" styleNumber="10" />
</section>
`,
        });

        // Selecting the default palette is still a reset: the ancestor
        // override is discarded and style 1 returns to the stock blue.
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "s.P"))
                .markerColor,
        ).eq(DEFAULT_1);
        // And cycling is active: default has 6 styles, so 10 cycles to 4.
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "s.Q"))
                .markerColor,
        ).eq(DEFAULT_4);
    });

    it("palette marker styles reach the renderer in JSXGraph's spelling", async () => {
        // Regression: the directional triangles use the schema's camelCase
        // spellings (triangleDown/triangleLeft/triangleRight). Authored
        // attribute values are lowercased on the way to a renderer, but
        // palette data does not travel that path, so these arrived at
        // JSXGraph as unknown face names and the points rendered INVISIBLE.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="categorical" />
<graph>
  <point name="P5" styleNumber="5">(-6,5)</point>
  <point name="P6" styleNumber="6">(-6,6)</point>
  <point name="P7" styleNumber="7">(-6,7)</point>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const [name, expected] of [
            ["P5", "triangledown"],
            ["P6", "triangleleft"],
            ["P7", "triangleright"],
        ] as const) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .selectedStyle.markerStyle,
                name,
            ).eq(expected);
        }
    });

    it("unstyled text and math keep the canvas text color under any palette", async () => {
        // Regression: text/math outside a graph render with
        // selectedStyle.textColor and unstyled content falls on style 1, so a
        // palette that painted style 1's text recolored ordinary prose.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="categorical" />
<text name="t">hello</text>
<m name="m">x^2</m>
<text name="marked" styleNumber="2">marked</text>
<text name="wrapped" styleNumber="11">wrapped</text>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const textColorOf = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .selectedStyle.textColor;

        // Unstyled prose and math stay neutral...
        expect(await textColorOf("t")).eq("black");
        expect(await textColorOf("m")).eq("black");
        // ...while an explicitly marked style still paints its text...
        expect(await textColorOf("marked")).eq("#b95b07");
        // ...and a style number that wraps onto style 1 (categorical has ten
        // styles, so 11 cycles to 1) is neutral too, matching what
        // out-of-range numbers already do with no palette selected.
        expect(await textColorOf("wrapped")).eq("black");

        // The palette still owns style 1's graphics.
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .selectedStyle.lineColor,
        ).eq("#1f77b4");
    });

    it("a styleDefinition can still paint style 1's text on top of a palette", async () => {
        // The neutral style-1 text color is an expansion rule for palette
        // data, not a lock: an author who deliberately wants colored prose
        // overrides it like any other style key.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="categorical" />
<styleDefinition styleNumber="1" textColor="green" />
<text name="t">hello</text>
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "t");
        expect(style.textColor).eq("green");
    });

    it("style descriptions reflect the palette colors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="okabeito" />
<point name="P" />
<p name="p">The $P.styleDescription point.</p>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        // The palette pins this word: the nearest-anchor derivation would
        // misname okabeito's blue as "cyan" (see issue #1527), so asserting
        // the curated word is the point of the test.
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("The blue point.");
    });

    it("with multiple stylePalettes in a section, the last wins and the others warn", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="okabeito" />
<stylePalette palette="tolbright" />
<point name="P" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(TOLBRIGHT_1);

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].message).contain(
            "A section can select only one <stylePalette>; using the last one.",
        );
    });

    it("last-wins ordering follows document order across the setup boundary", async () => {
        // A setup-hosted palette earlier in the document loses to a direct
        // one later in it: the two arrival routes interleave in document
        // order rather than grouping by route.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
    <stylePalette palette="tolbright" />
</setup>
<stylePalette palette="okabeito" />
<point name="P" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(OKABEITO_1);

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
    });
});

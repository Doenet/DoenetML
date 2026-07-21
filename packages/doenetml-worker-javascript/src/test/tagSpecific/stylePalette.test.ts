import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { colorValueToWord } from "@doenet/utils";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

// Anchor colors of the built-in palettes used by these tests.
const DEFAULT_1 = "#1f5dff";
const OCEAN_1 = "#1c3fae";
const OCEAN_2 = "#00695f";
const SUNSET_1 = "#c22047";

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
<stylePalette palette="ocean" />
<point name="P" />
<point name="Q" styleNumber="2" />
`,
        });

        const styleP = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(styleP.markerColor).eq(OCEAN_1);
        expect(styleP.lineWidth).eq(4);

        const styleQ = await selectedStyleOf(core, resolvePathToNodeIdx, "Q");
        expect(styleQ.markerColor).eq(OCEAN_2);
        expect(styleQ.markerStyle).eq("square");
    });

    it("selects a palette from inside setup", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
    <stylePalette palette="ocean" />
</setup>
<point name="P" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(OCEAN_1);
    });

    it("palette scopes to its section; outside is unaffected", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="s1">
    <stylePalette palette="ocean" />
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
        ).eq(OCEAN_1);
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
    <stylePalette palette="ocean" />
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
        ).eq(OCEAN_1);
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "s2.P"))
                .markerColor,
        ).eq("green");
    });

    it("local styleDefinition applies on top of the palette", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="s">
    <stylePalette palette="ocean" />
    <styleDefinition styleNumber="1" markerColor="green" />
    <point name="P" />
</section>
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "s.P");
        expect(style.markerColor).eq("green");
        // Non-overridden keys still come from the palette.
        expect(style.lineColor).eq(OCEAN_1);
    });

    it("subsection can select a different palette", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="ocean" />
<section name="outer">
    <point name="P" />
    <section name="inner">
        <stylePalette palette="sunset" />
        <point name="Q" />
    </section>
</section>
`,
        });

        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "outer.P"))
                .markerColor,
        ).eq(OCEAN_1);
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "outer.inner.Q"))
                .markerColor,
        ).eq(SUNSET_1);
    });

    it("style numbers beyond the palette size cycle through the palette", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="ocean" />
<point name="P" styleNumber="10" />
`,
        });

        // ocean has 8 styles, so style 10 cycles to style 2.
        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(OCEAN_2);
        expect(style.markerStyle).eq("square");
    });

    it("cycling also applies inside a section that inherits the palette", async () => {
        // Exercises the activeStylePaletteName ancestor chain: the section
        // selects no palette of its own, so cycling must key off the palette
        // name inherited from the document.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="ocean" />
<section name="s">
    <point name="P" styleNumber="10" />
</section>
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "s.P");
        expect(style.markerColor).eq(OCEAN_2);
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
<stylePalette palette="ocean" />
<styleDefinition styleNumber="10" lineColor="black" />
<point name="P" styleNumber="10" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.lineColor).eq("black");
        // Unset keys come from ocean style 2 (10 cycles to 2 in a palette of 8).
        expect(style.markerColor).eq(OCEAN_2);
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
<stylePalette palette="Ocean" />
<point name="P" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(OCEAN_1);
    });

    it("style descriptions reflect the palette colors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="ocean" />
<point name="P" />
<p name="p">The $P.styleDescription point.</p>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq(`The ${colorValueToWord(OCEAN_1)} point.`);
    });

    it("with multiple stylePalettes in a section, the last wins and the others warn", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="ocean" />
<stylePalette palette="sunset" />
<point name="P" />
`,
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq(SUNSET_1);

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].message).contain(
            "A section can select only one <stylePalette>; using the last one.",
        );
    });
});

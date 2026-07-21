import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { colorValueToWord } from "@doenet/utils";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function selectedStyleOf(
    core: any,
    resolvePathToNodeIdx: any,
    name: string,
) {
    const stateVariables = await core.returnAllStateVariables(false, true);
    return stateVariables[await resolvePathToNodeIdx(name)].stateValues
        .selectedStyle;
}

describe("Reader style overrides @group4", async () => {
    it("initial styleOverrides win over authored styleDefinitions", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="1" markerColor="green" />
<point name="P" />
<p name="p">The $P.styleDescription point.</p>
`,
            styleOverrides: { styles: { 1: { markerColor: "purple" } } },
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq("purple");

        // The style description reflects the reader's color, not the author's.
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("The purple point.");
    });

    it("styleOverrides survive section-level styleDefinitions", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="s">
    <styleDefinition styleNumber="1" markerColor="green" />
    <point name="P" />
</section>
`,
            styleOverrides: { styles: { 1: { markerColor: "purple" } } },
        });

        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "s.P"))
                .markerColor,
        ).eq("purple");
    });

    it("a reader palette replaces authored styling and cycles onto its size", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="okabeito" />
<styleDefinition styleNumber="1" lineColor="orange" />
<point name="P" />
<point name="Q" styleNumber="6" />
<p name="p">The $P.styleDescription point.</p>
`,
            styleOverrides: { palette: "grayscale" },
        });

        // Authored palette (okabeito) and styleDefinition (orange) are both
        // discarded in favor of the reader's palette.
        const styleP = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(styleP.lineColor).eq("#000000");

        // grayscale has 4 styles, so styleNumber 6 cycles onto style 2 —
        // driven by the reader palette even though the authored palette
        // (okabeito) has 8 styles.
        const styleQ = await selectedStyleOf(core, resolvePathToNodeIdx, "Q");
        expect(styleQ.lineColor).eq("#323232");

        // Style descriptions use the reader palette's curated words.
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("The black point.");
    });

    it("styles overrides apply on top of a reader palette", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<point name="P" />`,
            styleOverrides: {
                palette: "grayscale",
                styles: { 1: { markerColor: "purple" } },
            },
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq("purple");
        expect(style.lineColor).eq("#000000");
    });

    it("setStyleOverrides switches a reader palette live and back", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<point name="P" /><point name="Q" styleNumber="6" />`,
        });

        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "P")).lineColor,
        ).eq("#1f5dff");

        await core.requestAction({
            componentIdx: undefined,
            actionName: "setStyleOverrides",
            args: { styleOverrides: { palette: "grayscale" } },
        });
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "P")).lineColor,
        ).eq("#000000");
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "Q")).lineColor,
        ).eq("#323232");

        await core.requestAction({
            componentIdx: undefined,
            actionName: "setStyleOverrides",
            args: { styleOverrides: null },
        });
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "P")).lineColor,
        ).eq("#1f5dff");
        // With overrides cleared, style 6 is the default palette's gray
        // again (in range for the six default styles, so no cycling).
        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "Q")).lineColor,
        ).eq("#636363");
    });

    it("an unregistered reader palette name is ignored", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<point name="P" />`,
            styleOverrides: { palette: "sepia" },
        });

        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "P")).lineColor,
        ).eq("#1f5dff");
    });

    it("styleOverrides win over a selected style palette", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<stylePalette palette="okabeito" />
<point name="P" />
`,
            styleOverrides: { styles: { 1: { markerColor: "purple" } } },
        });

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColor).eq("purple");
        // Keys the reader did not override still come from the palette.
        expect(style.lineColor).eq("#0072b2");
    });

    it("hex overrides derive color words and dark-mode colors", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P" />
<p name="p">The $P.styleDescription point.</p>
`,
            styleOverrides: { styles: { 1: { markerColor: "#c22047" } } },
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq(`The ${colorValueToWord("#c22047")} point.`);

        const style = await selectedStyleOf(core, resolvePathToNodeIdx, "P");
        expect(style.markerColorDarkMode).toBeTruthy();
        expect(style.markerColorDarkMode).not.eq("#648FFF");
    });

    it("word keys and unknown keys in overrides are ignored", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P" />
<p name="p">The $P.styleDescription point.</p>
`,
            styleOverrides: {
                styles: {
                    1: {
                        markerColor: "purple",
                        // @ts-expect-error word keys are not part of the format
                        markerColorWord: "spoofed",
                        bogusKey: "ignored",
                    },
                },
            },
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("The purple point.");
    });

    it("the setStyleOverrides action updates and clears overrides live", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<styleDefinition styleNumber="1" markerColor="green" />
<point name="P" />
`,
        });

        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "P"))
                .markerColor,
        ).eq("green");

        await core.requestAction({
            componentIdx: undefined,
            actionName: "setStyleOverrides",
            args: {
                styleOverrides: { styles: { 1: { markerColor: "purple" } } },
            },
        });

        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "P"))
                .markerColor,
        ).eq("purple");

        await core.requestAction({
            componentIdx: undefined,
            actionName: "setStyleOverrides",
            args: { styleOverrides: null },
        });

        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "P"))
                .markerColor,
        ).eq("green");
    });

    it("reader overrides do not emit contrast diagnostics", async () => {
        // Yellow on white would fail every contrast threshold; supplied by
        // the reader it must stay diagnostic-free.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P" />
`,
            styleOverrides: {
                styles: { 1: { markerColor: "#ffff00", lineColor: "#ffff00" } },
            },
        });

        expect(
            (await selectedStyleOf(core, resolvePathToNodeIdx, "P"))
                .markerColor,
        ).eq("#ffff00");

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.accessibility ?? []).toEqual([]);
    });
});

import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

vi.mock("hyperformula");

/**
 * i18n Phase 2 (#1517): style descriptions follow the *content's* language.
 *
 * These go through the whole worker path — `setLocaleData`, the document's
 * `locale` state variable, the `translator` dependency, and the shared
 * description definitions — rather than calling `describeStyle` directly, which
 * `@doenet/utils`' golden-file suite already covers. What is checked here is
 * that the locale reaches the definitions at all, and that it is the document's
 * locale rather than the host's when the two disagree.
 */
describe("style descriptions follow the document locale", () => {
    async function descriptions(
        doenetML: string,
        names: string[],
        documentLocale?: string,
    ): Promise<Record<string, string>> {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            documentLocale,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const values: Record<string, string> = {};
        for (const name of names) {
            const idx = await resolvePathToNodeIdx(name);
            values[name] = stateVariables[idx].stateValues.value;
        }
        return values;
    }

    // Every word spelled out, so the expectations below do not silently track
    // whatever the default palette happens to say this release.
    const styled = `
    <setup>
      <styleDefinition styleNumber="1" lineColor="red" lineWidth="6"
        lineStyle="dashed" fillColor="blue" fillStyle="dots"
        markerColor="green" markerStyle="square" />
    </setup>
    <graph>
      <line through="(0,0) (1,1)" name="l" />
      <point name="p" />
      <circle name="c" filled />
    </graph>
    <text name="st" extend="$l.styleDescription" />
    <text name="stn" extend="$l.styleDescriptionWithNoun" />
    <text name="pt" extend="$p.styleDescriptionWithNoun" />
    <text name="sh" extend="$c.styleDescriptionWithNoun" />
    `;
    const names = ["st", "stn", "pt", "sh"];

    it("renders English by default", async () => {
        const values = await descriptions(styled, names);
        expect(values.st).eq("thick dashed red");
        expect(values.stn).eq("thick dashed red line");
        expect(values.pt).eq("green square");
        expect(values.sh).eq(
            "filled blue circle with dots and a thick dashed red border",
        );
    });

    it("renders Spanish when the host asks for it", async () => {
        const values = await descriptions(styled, names, "es");
        expect(values.st).eq("discontinua gruesa roja");
        expect(values.stn).eq("línea discontinua gruesa roja");
        expect(values.pt).eq("cuadrado verde");
        expect(values.sh).eq(
            "círculo azul relleno con puntos y un borde discontinuo grueso rojo",
        );
    });

    it("negotiates a regional tag down to the catalog it has", async () => {
        const values = await descriptions(styled, names, "es-MX");
        expect(values.stn).eq("línea discontinua gruesa roja");
    });

    it("falls back to English for a locale with no catalog", async () => {
        const values = await descriptions(styled, names, "fr");
        expect(values.stn).eq("thick dashed red line");
    });

    it("lets an authored lang override the host's locale", async () => {
        const values = await descriptions(
            `<document lang="es">${styled}</document>`,
            names,
            "fr",
        );
        expect(values.stn).eq("línea discontinua gruesa roja");
    });

    it("names a regular polygon by its side count", async () => {
        const doenetML = `
        <setup><styleDefinition styleNumber="1" lineColor="red" lineWidth="6" /></setup>
        <graph><regularPolygon name="r" numSides="5" /></graph>
        <text name="stn" extend="$r.styleDescriptionWithNoun" />
        `;
        expect((await descriptions(doenetML, ["stn"])).stn).eq(
            "thick red 5-sided regular polygon",
        );
        expect((await descriptions(doenetML, ["stn"], "es")).stn).eq(
            "polígono regular de 5 lados grueso rojo",
        );
    });

    it("describes a text's color and background", async () => {
        const doenetML = `
        <setup>
          <styleDefinition styleNumber="1" textColor="black" backgroundColor="yellow" />
        </setup>
        <text name="t" styleNumber="1">hola</text>
        <text name="d" extend="$t.textStyleDescription" />
        `;
        expect((await descriptions(doenetML, ["d"])).d).eq(
            "black with a yellow background",
        );
        expect((await descriptions(doenetML, ["d"], "es")).d).eq(
            "negro con un fondo amarillo",
        );
    });
});

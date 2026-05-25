import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Per-component style override tests @group4", async () => {
    it("markerStyle attribute on point overrides styleDefinition and derives word", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P" markerStyle="square" />
<p name="p">$P.styleDescriptionWithNoun</p>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const P = stateVariables[await resolvePathToNodeIdx("P")];
        expect(P.stateValues.selectedStyle.markerStyle).eq("square");
        expect(P.stateValues.selectedStyle.markerStyleWord).eq("square");
        // styleDescriptionWithNoun = "<markerColorWord> <markerStyleWord>".
        // Style 1 has the default blue marker color, but we only assert on the
        // marker noun here so we don't couple to the color-word vocabulary.
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).toMatch(/ square$/);
    });

    it("markerStyle=circle derives markerStyleWord=point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P" markerStyle="circle" />
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const P = stateVariables[await resolvePathToNodeIdx("P")];
        expect(P.stateValues.selectedStyle.markerStyle).eq("circle");
        expect(P.stateValues.selectedStyle.markerStyleWord).eq("point");
    });

    it("markerStyle=triangleUp derives markerStyleWord=triangle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P" markerStyle="triangleUp" />
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const P = stateVariables[await resolvePathToNodeIdx("P")];
        expect(P.stateValues.selectedStyle.markerStyle).eq("triangleup");
        expect(P.stateValues.selectedStyle.markerStyleWord).eq("triangle");
    });

    it("component override beats inherited styleDefinition", async () => {
        // styleNumber 3 ships markerStyle "triangle" + markerStyleWord "triangle".
        // The component overrides markerStyle to "square"; the override's
        // derived markerStyleWord must replace the inherited "triangle".
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P" styleNumber="3" markerStyle="square" />
<point name="Q" styleNumber="3" />
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const P = stateVariables[await resolvePathToNodeIdx("P")];
        const Q = stateVariables[await resolvePathToNodeIdx("Q")];
        expect(P.stateValues.selectedStyle.markerStyle).eq("square");
        expect(P.stateValues.selectedStyle.markerStyleWord).eq("square");
        // Sibling without the override falls back to styleNumber 3's value.
        expect(Q.stateValues.selectedStyle.markerStyle).eq("triangle");
        expect(Q.stateValues.selectedStyle.markerStyleWord).eq("triangle");
    });

    it("endpoint and equilibriumPoint hide markerStyle values with no fill/unfill distinction", async () => {
        // Both components render the marker open or closed based on their own
        // semantic state (Endpoint.open, EquilibriumPoint.stable), so cross
        // and plus — which have no interior — must not appear in the
        // markerStyle picker.
        const Endpoint = (await import("../../components/Endpoint.js")).default;
        const EquilibriumPoint = (
            await import("../../components/dynamicalSystems/EquilibriumPoint.js")
        ).default;

        for (const Cls of [Endpoint, EquilibriumPoint]) {
            const attrs = Cls.createAttributesObject();
            const values = attrs.markerStyle.validValues.map(
                (v: { value: string }) => v.value,
            );
            expect(values).not.toContain("cross");
            expect(values).not.toContain("plus");
            // Sanity: fill-capable shapes are still present.
            for (const v of ["circle", "square", "triangle", "diamond"]) {
                expect(values).toContain(v);
            }
        }
    });

    it("*Word descriptors are not exposed as per-component override attributes", async () => {
        // Authors customize descriptive wording via <styleDefinition> on the
        // rare occasions they need to. Per-component overrides intentionally
        // omit markerStyleWord/lineStyleWord/lineWidthWord so the attribute
        // surface stays small; derived words still flow through selectedStyle.
        const Point = (await import("../../components/Point.js")).default;
        const Line = (await import("../../components/Line.js")).default;
        const pointAttrs = Point.createAttributesObject();
        const lineAttrs = Line.createAttributesObject();
        expect(pointAttrs.markerStyleWord).toBeUndefined();
        expect(lineAttrs.lineStyleWord).toBeUndefined();
        expect(lineAttrs.lineWidthWord).toBeUndefined();
    });

    it("lineWidth override on line derives lineWidthWord=thin", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<line name="L" through="(0,0) (1,1)" lineWidth="1" />
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const L = stateVariables[await resolvePathToNodeIdx("L")];
        expect(L.stateValues.selectedStyle.lineWidth).eq(1);
        expect(L.stateValues.selectedStyle.lineWidthWord).eq("thin");
    });

    it("lineStyle=dashed override derives lineStyleWord=dashed", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<line name="L" through="(0,0) (1,1)" lineStyle="dashed" />
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const L = stateVariables[await resolvePathToNodeIdx("L")];
        expect(L.stateValues.selectedStyle.lineStyle).eq("dashed");
        expect(L.stateValues.selectedStyle.lineStyleWord).eq("dashed");
    });

    it("fillOpacity override flows through to selectedStyle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<polygon name="G" vertices="(0,0) (1,0) (1,1)" fillOpacity="0.5" />
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const G = stateVariables[await resolvePathToNodeIdx("G")];
        expect(G.stateValues.selectedStyle.fillOpacity).eq(0.5);
    });

    it("colors stay <styleDefinition>-only: markerColor attribute on point is not exposed", async () => {
        // Color attributes are intentionally NOT in styleOverrideAttributes,
        // so they're not declared on GraphicalComponent.
        const Point = (await import("../../components/Point.js")).default;
        const pointAttrs = Point.createAttributesObject();
        // Non-color override attribute IS present:
        expect(pointAttrs.markerStyle).toBeDefined();
        expect(pointAttrs.markerSize).toBeDefined();
        expect(pointAttrs.lineWidth).toBeDefined();
        expect(pointAttrs.fillOpacity).toBeDefined();
        // Color attributes are NOT present:
        expect(pointAttrs.markerColor).toBeUndefined();
        expect(pointAttrs.lineColor).toBeUndefined();
        expect(pointAttrs.fillColor).toBeUndefined();
        expect(pointAttrs.textColor).toBeUndefined();
        expect(pointAttrs.backgroundColor).toBeUndefined();
        expect(pointAttrs.highContrastColor).toBeUndefined();
    });

    it("markerStyle and lineStyle are declared as keyword/enum attributes", async () => {
        // The schema generator surfaces attributes with `validValues` as
        // `type: "keyword"` with autocomplete entries. Asserting on the
        // attribute spec keeps both the GraphicalComponent and
        // StyleDefinitions paths honest without re-reading the generated
        // JSON.
        const Point = (await import("../../components/Point.js")).default;
        const pointAttrs = Point.createAttributesObject();

        expect(pointAttrs.markerStyle.toLowerCase).toBe(true);
        const markerValues = pointAttrs.markerStyle.validValues.map(
            (v: { value: string }) => v.value,
        );
        // Values are declared in camelCase for readability; the
        // `preprocessAttributesObject` helper lowercases them at component
        // init time. `createAttributesObject` returns the pre-preprocessed
        // spec, so we assert on the declared forms.
        for (const v of [
            "circle",
            "square",
            "triangle",
            "triangleUp",
            "triangleDown",
            "triangleLeft",
            "triangleRight",
            "diamond",
            "cross",
            "plus",
        ]) {
            expect(markerValues).toContain(v);
        }

        expect(pointAttrs.lineStyle.toLowerCase).toBe(true);
        const lineValues = pointAttrs.lineStyle.validValues.map(
            (v: { value: string }) => v.value,
        );
        for (const v of ["solid", "dashed", "dotted"]) {
            expect(lineValues).toContain(v);
        }

        // <styleDefinition> path forwards the same enum metadata.
        const StyleDefinitionsModule =
            await import("../../components/StyleDefinitions.js");
        const StyleDefinition = StyleDefinitionsModule.StyleDefinition;
        const defAttrs = StyleDefinition.createAttributesObject();
        expect(defAttrs.markerStyle.toLowerCase).toBe(true);
        expect(defAttrs.markerStyle.validValues).toBeDefined();
        expect(defAttrs.lineStyle.toLowerCase).toBe(true);
        expect(defAttrs.lineStyle.validValues).toBeDefined();
    });
});

import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

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

    it("markerFilled defaults to true and flows through to selectedStyle when overridden", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P" />
<point name="Q" markerFilled="false" />
<point name="R" markerFilled="true" />
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const P = stateVariables[await resolvePathToNodeIdx("P")];
        const Q = stateVariables[await resolvePathToNodeIdx("Q")];
        const R = stateVariables[await resolvePathToNodeIdx("R")];
        expect(P.stateValues.selectedStyle.markerFilled).eq(true);
        expect(Q.stateValues.selectedStyle.markerFilled).eq(false);
        expect(R.stateValues.selectedStyle.markerFilled).eq(true);
    });

    it("plain point has no `open` state variable; endpoint and equilibriumPoint do (renderer invariant)", async () => {
        // The point renderer (`packages/doenetml/src/Viewer/renderers/point.tsx`)
        // uses `SVs.open === undefined` to detect "plain point" and only then
        // honors `selectedStyle.markerFilled`. This pins that contract so a
        // future point-like subclass that forgets to define an `open` state
        // variable would surface here rather than silently picking up
        // markerFilled semantics it doesn't want.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P" />
<endpoint name="E">(0,0)</endpoint>
<graph><equilibriumPoint name="Q">(0,0)</equilibriumPoint></graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const P = stateVariables[await resolvePathToNodeIdx("P")];
        const E = stateVariables[await resolvePathToNodeIdx("E")];
        const Q = stateVariables[await resolvePathToNodeIdx("Q")];
        // Plain point has no semantic open/closed state.
        expect(P.stateValues.open).toBeUndefined();
        // Subclasses with their own semantic state expose `open` as a boolean.
        expect(typeof E.stateValues.open).eq("boolean");
        expect(typeof Q.stateValues.open).eq("boolean");
    });

    it("endpoint and equilibriumPoint suppress markerFilled; equilibriumLine/Curve suppress lineStyle", async () => {
        const Endpoint = (await import("../../components/Endpoint.js")).default;
        const EquilibriumPoint = (
            await import("../../components/dynamicalSystems/EquilibriumPoint.js")
        ).default;
        const EquilibriumLine = (
            await import("../../components/dynamicalSystems/EquilibriumLine.js")
        ).default;
        const EquilibriumCurve = (
            await import("../../components/dynamicalSystems/EquilibriumCurve.js")
        ).default;

        expect(Endpoint.createAttributesObject().markerFilled).toBeUndefined();
        expect(
            EquilibriumPoint.createAttributesObject().markerFilled,
        ).toBeUndefined();
        expect(
            EquilibriumLine.createAttributesObject().lineStyle,
        ).toBeUndefined();
        expect(
            EquilibriumCurve.createAttributesObject().lineStyle,
        ).toBeUndefined();

        // Other override attributes are still present on the subclasses.
        expect(Endpoint.createAttributesObject().markerStyle).toBeDefined();
        expect(
            EquilibriumPoint.createAttributesObject().markerSize,
        ).toBeDefined();
        expect(
            EquilibriumLine.createAttributesObject().lineWidth,
        ).toBeDefined();
        expect(
            EquilibriumCurve.createAttributesObject().lineWidth,
        ).toBeDefined();
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

    it("colors stay <styleDefinition>-only: color attributes are never exposed on graphical components", async () => {
        const Point = (await import("../../components/Point.js")).default;
        const pointAttrs = Point.createAttributesObject();
        // Color attributes are NOT present on any graphical component.
        expect(pointAttrs.markerColor).toBeUndefined();
        expect(pointAttrs.lineColor).toBeUndefined();
        expect(pointAttrs.fillColor).toBeUndefined();
        expect(pointAttrs.textColor).toBeUndefined();
        expect(pointAttrs.backgroundColor).toBeUndefined();
        expect(pointAttrs.highContrastColor).toBeUndefined();
    });

    it("per-component attribute curation: each leaf only exposes the categories it uses", async () => {
        // marker-only components
        const Point = (await import("../../components/Point.js")).default;
        const pointAttrs = Point.createAttributesObject();
        expect(pointAttrs.markerStyle).toBeDefined();
        expect(pointAttrs.markerSize).toBeDefined();
        expect(pointAttrs.markerFilled).toBeDefined();
        // markerOpacity stays <styleDefinition>-only — it feeds the WCAG
        // contrast diagnostic as an opacityMultiplier on the foreground alpha
        // (see styleContrastAccessibility.ts), so allowing per-component
        // override would let geometry differ from what the contrast check sees.
        expect(pointAttrs.markerOpacity).toBeUndefined();
        expect(pointAttrs.lineWidth).toBeUndefined();
        expect(pointAttrs.lineStyle).toBeUndefined();
        expect(pointAttrs.fillOpacity).toBeUndefined();

        // line-only components
        const Line = (await import("../../components/Line.js")).default;
        const lineAttrs = Line.createAttributesObject();
        expect(lineAttrs.lineWidth).toBeDefined();
        expect(lineAttrs.lineStyle).toBeDefined();
        // lineOpacity stays <styleDefinition>-only for the same reason as
        // markerOpacity — it feeds the contrast diagnostic.
        expect(lineAttrs.lineOpacity).toBeUndefined();
        expect(lineAttrs.markerStyle).toBeUndefined();
        expect(lineAttrs.markerSize).toBeUndefined();
        expect(lineAttrs.fillOpacity).toBeUndefined();

        // line+fill components
        const Polygon = (await import("../../components/Polygon.js")).default;
        const polyAttrs = Polygon.createAttributesObject();
        expect(polyAttrs.lineWidth).toBeDefined();
        expect(polyAttrs.lineStyle).toBeDefined();
        expect(polyAttrs.fillOpacity).toBeDefined();
        expect(polyAttrs.markerStyle).toBeUndefined();

        // Curve is line+fill (closed-curve case); Parabola overrides to line-only
        const Curve = (await import("../../components/Curve.js")).default;
        const curveAttrs = Curve.createAttributesObject();
        expect(curveAttrs.fillOpacity).toBeDefined();
        const Parabola = (await import("../../components/Parabola.js")).default;
        const parAttrs = Parabola.createAttributesObject();
        expect(parAttrs.lineWidth).toBeDefined();
        expect(parAttrs.fillOpacity).toBeUndefined();

        // Subclasses inherit their parent's category:
        // - Triangle/Rectangle/RegularPolygon inherit Polygon's line+fill
        // - Circle inherits Curve's line+fill
        // - BestFitLine inherits Line's line-only
        // - CobwebPolyline inherits Polyline's line-only (no fill)
        const Triangle = (await import("../../components/Triangle.js")).default;
        expect(Triangle.createAttributesObject().fillOpacity).toBeDefined();
        const Circle = (await import("../../components/Circle.js")).default;
        expect(Circle.createAttributesObject().fillOpacity).toBeDefined();
        const BestFitLine = (await import("../../components/BestFitLine.js"))
            .default;
        const bflAttrs = BestFitLine.createAttributesObject();
        expect(bflAttrs.lineWidth).toBeDefined();
        expect(bflAttrs.fillOpacity).toBeUndefined();
        const CobwebPolyline = (
            await import("../../components/dynamicalSystems/CobwebPolyline.js")
        ).default;
        const cobwebAttrs = CobwebPolyline.createAttributesObject();
        expect(cobwebAttrs.lineWidth).toBeDefined();
        expect(cobwebAttrs.fillOpacity).toBeUndefined();
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

        // Per the per-component attribute curation, lineStyle lives on
        // line-family components — Point only carries marker* overrides.
        const Line = (await import("../../components/Line.js")).default;
        const lineAttrs = Line.createAttributesObject();
        expect(lineAttrs.lineStyle.toLowerCase).toBe(true);
        const lineValues = lineAttrs.lineStyle.validValues.map(
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

    it("override of underlying value overwrites a styleDefinition-supplied custom *Word", async () => {
        // styleDefinition ships a custom lineWidthWord ("hairline"). A component
        // override of `lineWidth` re-derives lineWidthWord from the new value
        // (1 → "thin"), replacing the inherited custom word. This pins the
        // documented trade-off: *Word isn't itself overridable on the
        // component, and re-derivation is preferred over keeping a stale word
        // that no longer matches the new value.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
  <styleDefinitions>
    <styleDefinition styleNumber="7" lineWidth="10" lineWidthWord="hairline" />
  </styleDefinitions>
</setup>
<line name="L1" through="(0,0) (1,1)" styleNumber="7" />
<line name="L2" through="(0,0) (1,1)" styleNumber="7" lineWidth="1" />
<line name="L3" through="(0,0) (1,1)" styleNumber="7" lineWidth="2" />
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const L1 = stateVariables[await resolvePathToNodeIdx("L1")];
        const L2 = stateVariables[await resolvePathToNodeIdx("L2")];
        const L3 = stateVariables[await resolvePathToNodeIdx("L3")];
        // No-override sibling keeps the custom word.
        expect(L1.stateValues.selectedStyle.lineWidth).eq(10);
        expect(L1.stateValues.selectedStyle.lineWidthWord).eq("hairline");
        // Override at <=1 re-derives "thin", replacing "hairline".
        expect(L2.stateValues.selectedStyle.lineWidth).eq(1);
        expect(L2.stateValues.selectedStyle.lineWidthWord).eq("thin");
        // Override in the un-named middle range (between thin and thick) still
        // erases the inherited custom word — it derives the empty descriptor
        // because the new width doesn't match either threshold, and shipping
        // a stale "hairline" alongside the new value would be misleading.
        expect(L3.stateValues.selectedStyle.lineWidth).eq(2);
        expect(L3.stateValues.selectedStyle.lineWidthWord).eq("");
    });

    it("cross-category overrides are rejected as invalid attributes", async () => {
        // The per-component override surface is curated by category, so
        // `<point lineWidth=...>` and `<line markerStyle=...>` aren't valid
        // attributes — the schema generator surfaces them as unknown.
        let { core } = await createTestCore({
            doenetML: `
<point name="P" lineWidth="3" />
<line name="L" through="(0,0) (1,1)" markerStyle="square" />
`,
        });

        const errors = getDiagnosticsByType(core).errors;
        const messages = errors.map((e) => e.message);
        expect(
            messages.some(
                (m) =>
                    m.includes('Invalid attribute "lineWidth"') &&
                    m.includes("<point>"),
            ),
            `expected lineWidth-on-point error; got: ${JSON.stringify(messages)}`,
        ).toBe(true);
        expect(
            messages.some(
                (m) =>
                    m.includes('Invalid attribute "markerStyle"') &&
                    m.includes("<line>"),
            ),
            `expected markerStyle-on-line error; got: ${JSON.stringify(messages)}`,
        ).toBe(true);
    });

    it("contrast-feeding opacities (lineOpacity, markerOpacity) are rejected as invalid attributes", async () => {
        // lineOpacity and markerOpacity feed the WCAG contrast diagnostic as
        // an opacityMultiplier on the foreground alpha (see
        // styleContrastAccessibility.ts). They stay <styleDefinition>-only
        // alongside colors so the per-styleNumber contrast check sees the
        // same effective color as the renderer. fillOpacity is decorative
        // and not part of the contrast check — it remains overridable
        // (asserted separately in the "fillOpacity override flows through to
        // selectedStyle" test above).
        let { core } = await createTestCore({
            doenetML: `
<point name="P" markerOpacity="0.5" />
<line name="L" through="(0,0) (1,1)" lineOpacity="0.5" />
`,
        });

        const errors = getDiagnosticsByType(core).errors;
        const messages = errors.map((e) => e.message);
        expect(
            messages.some(
                (m) =>
                    m.includes('Invalid attribute "markerOpacity"') &&
                    m.includes("<point>"),
            ),
            `expected markerOpacity-on-point error; got: ${JSON.stringify(messages)}`,
        ).toBe(true);
        expect(
            messages.some(
                (m) =>
                    m.includes('Invalid attribute "lineOpacity"') &&
                    m.includes("<line>"),
            ),
            `expected lineOpacity-on-line error; got: ${JSON.stringify(messages)}`,
        ).toBe(true);
    });
});

describe("styleNumber propagation through composites @group4", async () => {
    it("members of a <group styleNumber=N> inherit N", async () => {
        // A <group> is a composite: its members are reparented out of the
        // group into its container, so the parent fallback can't see the
        // group's styleNumber. The source-composite fallback carries it
        // through instead.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <group styleNumber="4">
    <point name="P1" coords="(-1,1)" />
    <point name="P2" coords="(2,-2)" />
  </group>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1")].stateValues
                .styleNumber,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                .styleNumber,
        ).eq(4);
    });

    it("an explicit styleNumber on a member overrides the group's", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <group styleNumber="4">
    <point name="P1" coords="(-1,1)" styleNumber="2" />
    <point name="P2" coords="(2,-2)" />
  </group>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        // Explicit value on the member wins.
        expect(
            stateVariables[await resolvePathToNodeIdx("P1")].stateValues
                .styleNumber,
        ).eq(2);
        // Sibling without an explicit value still inherits the group's.
        expect(
            stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                .styleNumber,
        ).eq(4);
    });

    it("a containing graph's styleNumber wins over the source composite's", async () => {
        // Members are reparented into the <graph>, so the graph is their
        // rendered parent. The parent fallback is consulted before the
        // source-composite fallback, so the graph's value (2) wins over the
        // group's (4).
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph styleNumber="2">
  <group styleNumber="4">
    <point name="P" coords="(-1,1)" />
  </group>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues
                .styleNumber,
        ).eq(2);
    });

    it("styleNumber chains through nested groups", async () => {
        // The inner group has no explicit styleNumber, so it inherits 4 from
        // the outer group via the source-composite fallback; the point then
        // inherits 4 from the inner group the same way.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <group styleNumber="4">
    <group>
      <point name="P" coords="(-1,1)" />
    </group>
  </group>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues
                .styleNumber,
        ).eq(4);
    });

    it("styleNumber propagates through a <repeat> to its members", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <repeat name="r" for="1 2" valueName="v" styleNumber="4">
    <point name="rp">($v, 0)</point>
  </repeat>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r[1].rp")].stateValues
                .styleNumber,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("r[2].rp")].stateValues
                .styleNumber,
        ).eq(4);
    });
});

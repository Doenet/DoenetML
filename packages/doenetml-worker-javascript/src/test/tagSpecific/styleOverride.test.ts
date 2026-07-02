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

    it("fillOpacity override flows through to selectedStyle on a circle", async () => {
        // Regression test for #1231. Circle borrows GraphicalComponent's
        // definitions via a separate code path from the polygon test above, and
        // that borrow dropped per-component overrides. C3 uses styleNumber 3's
        // default fillOpacity (0.3) so the overrides can't pass coincidentally.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <circle name="C1" center="(-1.5,0)" radius="1.5" styleNumber="3" filled="true" fillOpacity="0.2" />
  <circle name="C2" center="(1.5,0)" radius="1.5" styleNumber="3" filled="true" fillOpacity="0.8" />
  <circle name="C3" center="(4.5,0)" radius="1.5" styleNumber="3" filled="true" />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const C1 = stateVariables[await resolvePathToNodeIdx("C1")];
        const C2 = stateVariables[await resolvePathToNodeIdx("C2")];
        const C3 = stateVariables[await resolvePathToNodeIdx("C3")];
        expect(C1.stateValues.selectedStyle.fillOpacity).eq(0.2);
        expect(C2.stateValues.selectedStyle.fillOpacity).eq(0.8);
        // Sibling without the override falls back to styleNumber 3's default.
        expect(C3.stateValues.selectedStyle.fillOpacity).eq(0.3);
    });

    it("fillPatternOpacity override flows through to selectedStyle on closed shapes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <polygon
    name="P1"
    vertices="(0,0) (1,0) (1,1)"
    filled
    fillStyle="dots"
    fillPatternOpacity="0.2"
  />
  <circle
    name="C1"
    center="(3,0)"
    radius="1"
    filled
    fillStyle="diamonds"
    fillPatternOpacity="0.8"
  />
  <circle
    name="C2"
    center="(6,0)"
    radius="1"
    filled
    fillStyle="diamonds"
  />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const P1 = stateVariables[await resolvePathToNodeIdx("P1")];
        const C1 = stateVariables[await resolvePathToNodeIdx("C1")];
        const C2 = stateVariables[await resolvePathToNodeIdx("C2")];
        expect(P1.stateValues.selectedStyle.fillPatternOpacity).eq(0.2);
        expect(C1.stateValues.selectedStyle.fillPatternOpacity).eq(0.8);
        expect(C2.stateValues.selectedStyle.fillPatternOpacity).eq(1);
    });

    it("fillStyle values flow through to selectedStyle and derive fillStyleWord", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
  <styleDefinition styleNumber="2" fillStyle="backDiagonal" />
</setup>
<graph>
  <polygon
    name="P"
    vertices="(0,0) (1,0) (1,1)"
    filled
    fillStyle="horizontal"
  />
  <polygon
    name="PLegacy"
    vertices="(0,0) (-1,0) (-1,1)"
    filled
    fillStyle="crosshatch"
  />
  <circle
    name="C"
    center="(3,0)"
    radius="1"
    filled
    styleNumber="2"
  />
  <angle
    name="A"
    through="(0,0) (1,0) (1,1)"
    fillStyle="vertical"
  />
  <function name="f">x</function>
  <regionBetweenCurveXAxis
    name="RX"
    function="$f"
    boundaryValues="0 1"
    fillStyle="dots"
  />
  <function name="f1">x</function>
  <function name="f2">x^2</function>
  <regionBetweenCurves
    name="RB"
    boundaryValues="0 1"
    fillStyle="diamonds"
  >
    $f1 $f2
  </regionBetweenCurves>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const P = stateVariables[await resolvePathToNodeIdx("P")];
        const PLegacy = stateVariables[await resolvePathToNodeIdx("PLegacy")];
        const C = stateVariables[await resolvePathToNodeIdx("C")];
        const A = stateVariables[await resolvePathToNodeIdx("A")];
        const RX = stateVariables[await resolvePathToNodeIdx("RX")];
        const RB = stateVariables[await resolvePathToNodeIdx("RB")];

        expect(P.stateValues.selectedStyle.fillStyle).eq("horizontal");
        expect(P.stateValues.selectedStyle.fillStyleWord).eq(
            "horizontal lines",
        );
        expect(PLegacy.stateValues.selectedStyle.fillStyle).eq("crosshatch");
        expect(PLegacy.stateValues.selectedStyle.fillStyleWord).eq("dots");
        expect(C.stateValues.selectedStyle.fillStyle).eq("backdiagonal");
        expect(C.stateValues.selectedStyle.fillStyleWord).eq(
            "reverse diagonal lines",
        );
        expect(A.stateValues.selectedStyle.fillStyle).eq("vertical");
        expect(A.stateValues.selectedStyle.fillStyleWord).eq("vertical lines");
        expect(RX.stateValues.selectedStyle.fillStyle).eq("dots");
        expect(RX.stateValues.selectedStyle.fillStyleWord).eq("dots");
        expect(RB.stateValues.selectedStyle.fillStyle).eq("diamonds");
        expect(RB.stateValues.selectedStyle.fillStyleWord).eq("diamonds");
    });

    it("lineWidth/lineStyle overrides flow through to selectedStyle on a parabola", async () => {
        // Same #1231 borrow path as the circle test above, but Parabola opts
        // into only the "line" override category.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <parabola name="P" through="(0,0) (1,1) (2,0)" lineWidth="1" lineStyle="dashed" />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const P = stateVariables[await resolvePathToNodeIdx("P")];
        expect(P.stateValues.selectedStyle.lineWidth).eq(1);
        expect(P.stateValues.selectedStyle.lineWidthWord).eq("thin");
        expect(P.stateValues.selectedStyle.lineStyle).eq("dashed");
        expect(P.stateValues.selectedStyle.lineStyleWord).eq("dashed");
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
        expect(lineAttrs.fillPatternOpacity).toBeUndefined();

        // line+fill components
        const Polygon = (await import("../../components/Polygon.js")).default;
        const polyAttrs = Polygon.createAttributesObject();
        expect(polyAttrs.lineWidth).toBeDefined();
        expect(polyAttrs.lineStyle).toBeDefined();
        expect(polyAttrs.fillOpacity).toBeDefined();
        expect(polyAttrs.fillPatternOpacity).toBeDefined();
        expect(polyAttrs.fillStyle).toBeDefined();
        expect(polyAttrs.markerStyle).toBeUndefined();

        // Curve is line+fill (closed-curve case); Parabola overrides to line-only
        const Curve = (await import("../../components/Curve.js")).default;
        const curveAttrs = Curve.createAttributesObject();
        expect(curveAttrs.fillOpacity).toBeDefined();
        expect(curveAttrs.fillPatternOpacity).toBeDefined();
        expect(curveAttrs.fillStyle).toBeDefined();
        const Parabola = (await import("../../components/Parabola.js")).default;
        const parAttrs = Parabola.createAttributesObject();
        expect(parAttrs.lineWidth).toBeDefined();
        expect(parAttrs.fillOpacity).toBeUndefined();
        expect(parAttrs.fillPatternOpacity).toBeUndefined();
        expect(parAttrs.fillStyle).toBeUndefined();

        // Subclasses inherit their parent's category:
        // - Triangle/Rectangle/RegularPolygon inherit Polygon's line+fill
        // - Circle inherits Curve's line+fill
        // - BestFitLine inherits Line's line-only
        // - CobwebPolyline inherits Polyline's line-only (no fill)
        const Triangle = (await import("../../components/Triangle.js")).default;
        expect(Triangle.createAttributesObject().fillOpacity).toBeDefined();
        expect(
            Triangle.createAttributesObject().fillPatternOpacity,
        ).toBeDefined();
        expect(Triangle.createAttributesObject().fillStyle).toBeDefined();
        const Circle = (await import("../../components/Circle.js")).default;
        expect(Circle.createAttributesObject().fillOpacity).toBeDefined();
        expect(
            Circle.createAttributesObject().fillPatternOpacity,
        ).toBeDefined();
        expect(Circle.createAttributesObject().fillStyle).toBeDefined();
        const Angle = (await import("../../components/Angle.js")).default;
        expect(Angle.createAttributesObject().fillOpacity).toBeDefined();
        expect(Angle.createAttributesObject().fillPatternOpacity).toBeDefined();
        expect(Angle.createAttributesObject().fillStyle).toBeDefined();
        const RegionBetweenCurveXAxis = (
            await import("../../components/RegionBetweenCurveXAxis.js")
        ).default;
        expect(
            RegionBetweenCurveXAxis.createAttributesObject().fillOpacity,
        ).toBeDefined();
        expect(
            RegionBetweenCurveXAxis.createAttributesObject().fillPatternOpacity,
        ).toBeDefined();
        expect(
            RegionBetweenCurveXAxis.createAttributesObject().fillStyle,
        ).toBeDefined();
        const RegionBetweenCurves = (
            await import("../../components/RegionBetweenCurves.js")
        ).default;
        expect(
            RegionBetweenCurves.createAttributesObject().fillOpacity,
        ).toBeDefined();
        expect(
            RegionBetweenCurves.createAttributesObject().fillPatternOpacity,
        ).toBeDefined();
        expect(
            RegionBetweenCurves.createAttributesObject().fillStyle,
        ).toBeDefined();
        const BestFitLine = (await import("../../components/BestFitLine.js"))
            .default;
        const bflAttrs = BestFitLine.createAttributesObject();
        expect(bflAttrs.lineWidth).toBeDefined();
        expect(bflAttrs.fillOpacity).toBeUndefined();
        expect(bflAttrs.fillPatternOpacity).toBeUndefined();
        const CobwebPolyline = (
            await import("../../components/dynamicalSystems/CobwebPolyline.js")
        ).default;
        const cobwebAttrs = CobwebPolyline.createAttributesObject();
        expect(cobwebAttrs.lineWidth).toBeDefined();
        expect(cobwebAttrs.fillOpacity).toBeUndefined();
        expect(cobwebAttrs.fillPatternOpacity).toBeUndefined();
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

    it("function exposes lineStyle and lineWidth (line-only, no fill)", async () => {
        const Function_ = (await import("../../components/Function.js"))
            .default;
        const fnAttrs = Function_.createAttributesObject();
        expect(fnAttrs.lineStyle).toBeDefined();
        expect(fnAttrs.lineWidth).toBeDefined();
        // Functions have no enclosed area, so fill is not exposed.
        expect(fnAttrs.fillOpacity).toBeUndefined();
        // markerStyle is for point-like components, not functions.
        expect(fnAttrs.markerStyle).toBeUndefined();
    });

    it("lineWidth/lineStyle overrides flow through to selectedStyle on a function", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<function name="f" lineWidth="1" lineStyle="dashed">x^2</function>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const f = stateVariables[await resolvePathToNodeIdx("f")];
        expect(f.stateValues.selectedStyle.lineWidth).eq(1);
        expect(f.stateValues.selectedStyle.lineWidthWord).eq("thin");
        expect(f.stateValues.selectedStyle.lineStyle).eq("dashed");
        expect(f.stateValues.selectedStyle.lineStyleWord).eq("dashed");
    });

    it("function lineStyle/lineWidth overrides propagate to its adapted curve inside a graph", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <function name="f" lineWidth="1" lineStyle="dashed">x^2</function>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const f = stateVariables[await resolvePathToNodeIdx("f")];
        // The function itself carries the override.
        expect(f.stateValues.selectedStyle.lineWidth).eq(1);
        expect(f.stateValues.selectedStyle.lineStyle).eq("dashed");

        // Find the adapted curve that was created from the function and
        // verify it carries the same selectedStyle.
        const allComponents = Object.values(stateVariables);
        const adaptedCurve = allComponents.find(
            (c: any) =>
                c.componentType === "curve" &&
                c.stateValues.selectedStyle?.lineWidth === 1 &&
                c.stateValues.selectedStyle?.lineStyle === "dashed",
        );
        expect(adaptedCurve).toBeDefined();
    });

    it("function validates styleOverrideCategories before creating attributes", async () => {
        const Function_ = (await import("../../components/Function.js"))
            .default;

        class BadFunction extends Function_ {
            static componentType = "badFunction";
            static styleOverrideCategories = ["lin"];
        }

        expect(() => BadFunction.createAttributesObject()).toThrow(
            /Component "badFunction" lists unknown style override category "lin"/,
        );
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

        const sv = await core.returnAllStateVariables(false, true);
        const styleOf = async (name: string) =>
            sv[await resolvePathToNodeIdx(name)].stateValues.styleNumber;

        expect(await styleOf("P1")).eq(4);
        expect(await styleOf("P2")).eq(4);
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

        const sv = await core.returnAllStateVariables(false, true);
        const styleOf = async (name: string) =>
            sv[await resolvePathToNodeIdx(name)].stateValues.styleNumber;

        // Explicit value on the member wins.
        expect(await styleOf("P1")).eq(2);
        // Sibling without an explicit value still inherits the group's.
        expect(await styleOf("P2")).eq(4);
    });

    it("a group's styleNumber wins over a containing graph's (innermost wins)", async () => {
        // Members are reparented into the <graph>, so the graph is their
        // rendered parent and the group is their source composite. The
        // source-composite fallback is consulted before the parent fallback,
        // so the more-local group's value (4) wins over the graph's (2) —
        // matching how a <group> behaves like the regular container nearest
        // the component.
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
        ).eq(4);
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

        const sv = await core.returnAllStateVariables(false, true);
        const styleOf = async (name: string) =>
            sv[await resolvePathToNodeIdx(name)].stateValues.styleNumber;

        expect(await styleOf("r[1].rp")).eq(4);
        expect(await styleOf("r[2].rp")).eq(4);
    });

    it("extending a graph re-resolves styleNumber against the new context", async () => {
        // In the original graph, the loose point takes the graph's 5 and the
        // grouped points take the group's 4 (innermost wins). When the graph
        // is extended with styleNumber="2", the loose point — which has no
        // more-local style source — picks up the new graph's 2, while the
        // grouped points keep the group's 4 (the <group> is still their
        // innermost source; the implicit copy composite deletes its own
        // styleNumber so it doesn't interfere).
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph styleNumber="5" name="g">
  <point name="P0" coords="(3,5)" />
  <group styleNumber="4">
    <point name="P1" coords="(-1,1)" />
    <point name="P2" coords="(2,-2)" />
  </group>
</graph>

<graph extend="$g" styleNumber="2" name="g2" />
`,
        });

        const sv = await core.returnAllStateVariables(false, true);
        const styleOf = async (name: string) =>
            sv[await resolvePathToNodeIdx(name)].stateValues.styleNumber;

        expect(await styleOf("P0")).eq(5);
        expect(await styleOf("P1")).eq(4);
        expect(await styleOf("P2")).eq(4);

        expect(await styleOf("g2.P0")).eq(2);
        expect(await styleOf("g2.P1")).eq(4);
        expect(await styleOf("g2.P2")).eq(4);
    });

    it("a group nested in a graph and a graph nested in a section style their points identically", async () => {
        // Whether the inner styleNumber sits on a composite (<group>) or a
        // regular component (<graph> inside a <section>) must not change the
        // result: in both, the loose point follows the outer container and
        // the inner-wrapped points follow the inner container — including
        // after extension. Authors shouldn't have to know which components
        // are composites.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="s" styleNumber="5">
  <graph>
    <point name="Pa" coords="(3,5)" />
  </graph>
  <graph styleNumber="4">
    <point name="Pb1" coords="(-1,1)" />
    <point name="Pb2" coords="(2,-2)" />
  </graph>
</section>

<section extend="$s" styleNumber="2" name="s2" />
`,
        });

        const sv = await core.returnAllStateVariables(false, true);
        const styleOf = async (name: string) =>
            sv[await resolvePathToNodeIdx(name)].stateValues.styleNumber;

        expect(await styleOf("Pa")).eq(5);
        expect(await styleOf("Pb1")).eq(4);
        expect(await styleOf("Pb2")).eq(4);

        expect(await styleOf("s2.Pa")).eq(2);
        expect(await styleOf("s2.Pb1")).eq(4);
        expect(await styleOf("s2.Pb2")).eq(4);
    });
});

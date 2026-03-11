import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

const PREFIGURE_BUILD_URL = "https://prefigure.doenet.org/build";
const RUN_LIVE_PREFIGURE_VALIDATION =
    process.env.RUN_LIVE_PREFIGURE_VALIDATION === "1";

async function validatePrefigureXMLAgainstBuildService(xml: string) {
    const response = await fetch(PREFIGURE_BUILD_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/xml",
        },
        body: xml,
    });

    const responseText = await response.text();

    let parsedBody: any = null;
    try {
        parsedBody = JSON.parse(responseText);
    } catch (_e) {
        parsedBody = responseText;
    }

    return {
        ok: response.ok,
        status: response.status,
        body: parsedBody,
    };
}

describe("Graph prefigure mode tests", async () => {
    it("mode=doenet leaves prefigureXML null", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues.mode,
        ).eq("doenet");
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .effectiveMode,
        ).eq("doenet");
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML,
        ).eq(null);
    });

    it("mode=prefigure emits prefigureXML payload", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" mode="prefigure" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues.mode,
        ).eq("prefigure");
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .effectiveMode,
        ).eq("prefigure");

        expect(typeof prefigureXML).eq("string");
        expect(prefigureXML).toContain("<diagram");
        expect(prefigureXML).toContain("dimensions=");
        expect(prefigureXML).toContain("<coordinates");
        expect(prefigureXML).toContain("bbox=");
        expect(prefigureXML).toContain("<axes");
    });

    it("mode=prefigure empty graph has exact XML baseline", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" mode="prefigure" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all" /></coordinates></diagram>`,
        );
    });

    it("mode=prefigure xMin updates bbox with computed defaults", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" mode="prefigure" xMin="0" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(0,-10,10,10)"><axes axes="all" /></coordinates></diagram>`,
        );
    });

    it("mode=prefigure size and aspectRatio control dimensions", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" mode="prefigure" size="full" aspectRatio="2" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).eq(
            `<diagram dimensions="(850,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all" /></coordinates></diagram>`,
        );
    });

    it("mode=prefigure maps axis visibility to horizontal/vertical axes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="gx" mode="prefigure" displayXAxis="true" displayYAxis="false" />
<graph name="gy" mode="prefigure" displayXAxis="false" displayYAxis="true" />
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const gxPrefigureXML =
            stateVariables[await resolvePathToNodeIdx("gx")].stateValues
                .prefigureXML;
        const gyPrefigureXML =
            stateVariables[await resolvePathToNodeIdx("gy")].stateValues
                .prefigureXML;

        expect(gxPrefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="horizontal" /></coordinates></diagram>`,
        );
        expect(gyPrefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="vertical" /></coordinates></diagram>`,
        );
    });

    it("mode=prefigure with both axes hidden emits no axes element", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" mode="prefigure" displayXAxis="false" displayYAxis="false" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"></coordinates></diagram>`,
        );
    });

    it("mode=prefigure warns for unsupported graph axis label positions", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure" xLabelPosition="left" yLabelPosition="bottom">
  <xLabel>time</xLabel>
  <yLabel>value</yLabel>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`<axes axes="all">`);
        expect(prefigureXML).toContain(`<xlabel alignment="nw">time</xlabel>`);
        expect(prefigureXML).toContain(`<ylabel alignment="se">value</ylabel>`);

        let errorWarnings = core.core!.errorWarnings;
        expect(errorWarnings.errors.length).eq(0);
        expect(
            errorWarnings.warnings.some((x) =>
                x.message.includes(
                    'xLabelPosition="left" is not supported in prefigure mode',
                ),
            ),
        ).eq(true);
        expect(
            errorWarnings.warnings.some((x) =>
                x.message.includes(
                    'yLabelPosition="bottom" is not supported in prefigure mode',
                ),
            ),
        ).eq(true);
    });

    it("mode=prefigure descendant warning includes position", async () => {
        const { core } = await createTestCore({
            doenetML: `
<setup>
    <styleDefinitions>
        <styleDefinition styleNumber="7" markerStyle="triangleRight" markerColor="purple" />
    </styleDefinitions>
</setup>
<graph name="g" mode="prefigure">
    <point styleNumber="7">(1,2)</point>
</graph>
`,
        });

        let errorWarnings = core.core!.errorWarnings;
        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).toBeGreaterThan(0);

        const warningWithPosition = errorWarnings.warnings.find(
            (x) => x.position,
        );

        expect(warningWithPosition).toBeDefined();
        expect(warningWithPosition?.position).toBeDefined();
        expect(warningWithPosition?.position?.start?.line).toBeGreaterThan(0);
        expect(warningWithPosition?.position?.start?.column).toBeGreaterThan(0);
    });

    it("mode=prefigure triangle marker warning has exact position", async () => {
        const { core } = await createTestCore({
            doenetML: `
<setup>
    <styleDefinitions>
        <styleDefinition styleNumber="7" markerStyle="triangleRight" markerColor="purple" />
    </styleDefinitions>
</setup>
<graph name="g" mode="prefigure">
    <point styleNumber="7">(1,2)</point>
</graph>
`,
        });

        let errorWarnings = core.core!.errorWarnings;
        expect(errorWarnings.errors.length).eq(0);

        const triangleWarning = errorWarnings.warnings.find(
            (x) =>
                x.message.includes("marker style") &&
                x.message.includes("mapped to PreFigure style") &&
                x.message.includes("diamond"),
        );

        expect(triangleWarning).toBeDefined();
        expect(triangleWarning?.position).toBeDefined();
        expect(triangleWarning?.position?.start?.line).eq(8);
        expect(triangleWarning?.position?.start?.column).eq(5);
    });

    it("mode=prefigure maps graph axis labels with latex to m tags", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
  <xLabel><m>x^2</m></xLabel>
  <yLabel><m>y_1</m></yLabel>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`<axes axes="all">`);
        expect(prefigureXML).toContain(`<xlabel alignment="nw"><m>`);
        expect(prefigureXML).toContain(`<ylabel alignment="se"><m>`);
        expect(prefigureXML).toContain(`x^2`);
        expect(prefigureXML).toContain(`y_1`);
    });

    it("mode=prefigure maps point marker style and marker attributes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
  <styleDefinitions>
    <styleDefinition styleNumber="7" markerStyle="square" markerSize="6" markerColor="green" markerOpacity="0.4" lineWidth="3" />
  </styleDefinitions>
</setup>
<graph name="g" mode="prefigure">
  <point styleNumber="7">(1,2)</point>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(
            `p="(1,2)" style="box" size="6" fill="green" stroke="green" fill-opacity="0.4" stroke-opacity="0.4" thickness="3"`,
        );
    });

    it("mode=prefigure maps triangle marker styles to diamond with warning", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
  <styleDefinitions>
    <styleDefinition styleNumber="7" markerStyle="triangleRight" markerColor="purple" />
  </styleDefinitions>
</setup>
<graph name="g" mode="prefigure">
  <point styleNumber="7">(1,2)</point>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`style="diamond"`);

        expect(prefigureXML).toContain(`p="(1,2)" style="diamond"`);
    });

    it("extended graph preserves point marker mapping in prefigure mode", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
    <styleDefinitions>
        <styleDefinition styleNumber="7" markerStyle="square" markerSize="16" markerColor="green" markerOpacity="0.4" lineWidth="3" />
    </styleDefinitions>
</setup>
<graph name="g">
    <point styleNumber="7">(1,2)</point>
</graph>
<graph name="gp" extend="$g" mode="prefigure" />
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("gp")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(
            `p="(1,2)" style="box" size="16" fill="green" stroke="green" fill-opacity="0.4" stroke-opacity="0.4" thickness="3"`,
        );
    });

    it("mode=prefigure maps point label and labelPosition", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
  <point labelPosition="upperLeft">(1,2)<label>A</label></point>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`p="(1,2)"`);
        expect(prefigureXML).toContain(`alignment="nw"`);
        expect(prefigureXML).toContain(`>A</point>`);
    });

    it("mode=prefigure maps point latex label to m tag", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
  <point labelPosition="top">(1,2)<label><m>x^2</m></label></point>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`p="(1,2)"`);
        expect(prefigureXML).toContain(`alignment="n"`);
        expect(prefigureXML).toContain(`<m>`);
        expect(prefigureXML).toContain(`x^2`);
    });

    it("mode=prefigure maps line to PreFigure line with infinite=yes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
  <line through="(1,2) (3,4)" />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`endpoints="((1,2),(3,4))"`);
        expect(prefigureXML).toContain(`infinite="yes"`);
    });

    it("mode=prefigure maps line label and labelPosition", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
    <line through="(1,2) (3,4)" labelPosition="upperright"><label>A</label></line>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`alignment="ne"`);
        expect(prefigureXML).toContain(`>A</line>`);
    });

    it("mode=prefigure orients line endpoints so label is never upside-down (right-to-left line)", async () => {
        // Line given through=(3,4) then (1,2): natural order is right-to-left.
        // The converter must swap to (1,2)→(3,4) so PreFigure's label rotation
        // angle stays within (-90°,90°] — keeping the label on the top side and
        // never upside-down.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
    <line through="(3,4) (1,2)"><label>B</label></line>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        // Endpoints must be output with the leftward point first
        expect(prefigureXML).toContain(`endpoints="((1,2),(3,4))"`);
        expect(prefigureXML).toContain(`>B</line>`);
    });

    it("mode=prefigure orients line segment endpoints left-to-right for label readability", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
    <lineSegment endpoints="(5,1) (2,3)"><label>C</label></lineSegment>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        // (2,3) has smaller x so it must be listed first
        expect(prefigureXML).toContain(`endpoints="((2,3),(5,1))"`);
        expect(prefigureXML).toContain(`>C</line>`);
    });

    it("mode=prefigure orients vertical line bottom-to-top for label readability", async () => {
        // Vertical line: same x, so sort by y. (2,5) has larger y → swap to (2,1)→(2,5).
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
    <line through="(2,5) (2,1)"><label>D</label></line>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        // Lower-y point must come first
        expect(prefigureXML).toContain(`endpoints="((2,1),(2,5))"`);
        expect(prefigureXML).toContain(`>D</line>`);
    });

    it("mode=prefigure does not change already-left-to-right line endpoints", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
    <line through="(1,2) (3,4)"><label>E</label></line>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        // Order already correct, no swap
        expect(prefigureXML).toContain(`endpoints="((1,2),(3,4))"`);
        expect(prefigureXML).toContain(`>E</line>`);
    });

    it("mode=prefigure maps dashed/dotted styles to numeric dash arrays", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
    <styleDefinitions>
        <styleDefinition styleNumber="7" lineStyle="dashed" />
        <styleDefinition styleNumber="8" lineStyle="dotted" />
    </styleDefinitions>
</setup>
<graph name="g" mode="prefigure">
    <line styleNumber="7" through="(1,2) (3,4)" />
    <line styleNumber="8" through="(2,2) (4,4)" />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`dash="9 9"`);
        expect(prefigureXML).toContain(`dash="4 4"`);
    });

    it("mode=prefigure maps ray to bbox-clipped finite line", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure" xMin="-10" yMin="-10" xMax="10" yMax="10">
  <ray endpoint="(0,0)" through="(1,1)" />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`id="ray-0"`);
        expect(prefigureXML).toContain(`endpoints="((0,0),(10,10))"`);
        expect(prefigureXML).toContain(`infinite="no"`);
    });

    it("mode=prefigure maps vector to tail+v representation", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
  <vector tail="(3,5)" head="(-4,2)" />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`<vector `);
        expect(prefigureXML).toContain(`tail="(3,5)"`);
        expect(prefigureXML).toContain(`v="(-7,-3)"`);
    });

    it("mode=prefigure maps circle to center+radius", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
  <circle center="(1,2)" radius="3" />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`<circle `);
        expect(prefigureXML).toContain(`center="(1,2)"`);
        expect(prefigureXML).toContain(`radius="3"`);
    });

    it("mode=prefigure maps polygon vertices to closed polygon points", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" mode="prefigure">
  <polygon vertices="(0,0) (2,0) (1,1)" />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`<polygon `);
        expect(prefigureXML).toContain(`points="((0,0),(2,0),(1,1))"`);
        expect(prefigureXML).toContain(`closed="yes"`);
    });

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: build service accepts generated XML for line/ray/vector/circle/polygon",
        async () => {
            const cases = [
                {
                    doenetML: `<graph name="g" mode="prefigure"><line through="(1,2) (3,4)" /></graph>`,
                    expectText: "line",
                },
                {
                    doenetML: `<graph name="g" mode="prefigure" xMin="-10" yMin="-10" xMax="10" yMax="10"><ray endpoint="(0,0)" through="(1,1)" /></graph>`,
                    expectText: "ray",
                },
                {
                    doenetML: `<graph name="g" mode="prefigure"><vector tail="(3,5)" head="(-4,2)" /></graph>`,
                    expectText: "vector",
                },
                {
                    doenetML: `<graph name="g" mode="prefigure"><circle center="(1,2)" radius="3" /></graph>`,
                    expectText: "circle",
                },
                {
                    doenetML: `<graph name="g" mode="prefigure"><polygon vertices="(0,0) (2,0) (1,1)" /></graph>`,
                    expectText: "polygon",
                },
            ];

            for (const c of cases) {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: c.doenetML,
                });

                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const prefigureXML =
                    stateVariables[await resolvePathToNodeIdx("g")].stateValues
                        .prefigureXML;

                expect(typeof prefigureXML).eq("string");

                const result =
                    await validatePrefigureXMLAgainstBuildService(prefigureXML);

                expect(
                    result.ok,
                    `${c.expectText}: Prefigure build failed: status=${result.status}, body=${JSON.stringify(
                        result.body,
                    )}`,
                ).toBe(true);
                expect(
                    result.body?.svg,
                    `${c.expectText}: missing svg`,
                ).toBeTruthy();
            }
        },
    );

    it("nested graph inherits prefigure mode from parent", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="outer" mode="prefigure">
  <graph name="inner" mode="doenet">
    <point>(1,2)</point>
  </graph>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const outer =
            stateVariables[await resolvePathToNodeIdx("outer")].stateValues;
        const inner =
            stateVariables[await resolvePathToNodeIdx("inner")].stateValues;

        expect(outer.mode).eq("prefigure");
        expect(outer.effectiveMode).eq("prefigure");
        expect(typeof outer.prefigureXML).eq("string");

        expect(inner.mode).eq("doenet");
        expect(inner.effectiveMode).eq("prefigure");
        expect(inner.prefigureXML).eq(null);
    });

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: build service accepts generated empty-graph XML",
        async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<graph name="g" mode="prefigure" />`,
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            const prefigureXML =
                stateVariables[await resolvePathToNodeIdx("g")].stateValues
                    .prefigureXML;

            expect(typeof prefigureXML).eq("string");

            const result =
                await validatePrefigureXMLAgainstBuildService(prefigureXML);

            expect(
                result.ok,
                `Prefigure build failed: status=${result.status}, body=${JSON.stringify(
                    result.body,
                )}`,
            ).toBe(true);
            expect(result.body?.svg).toBeTruthy();
        },
    );
});

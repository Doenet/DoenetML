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

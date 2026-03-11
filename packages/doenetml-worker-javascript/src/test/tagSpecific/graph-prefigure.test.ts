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

describe("Graph prefigure renderer tests", async () => {
    it("renderer=doenet leaves prefigureXML null", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .renderer,
        ).eq("doenet");
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .effectiveRenderer,
        ).eq("doenet");
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML,
        ).eq(null);
    });

    it("renderer=prefigure emits prefigureXML payload", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" renderer="prefigure" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .renderer,
        ).eq("prefigure");
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .effectiveRenderer,
        ).eq("prefigure");

        expect(typeof prefigureXML).eq("string");
        expect(prefigureXML).toContain("<diagram");
        expect(prefigureXML).toContain("dimensions=");
        expect(prefigureXML).toContain("<coordinates");
        expect(prefigureXML).toContain("bbox=");
        expect(prefigureXML).toContain("<axes");
    });

    it("renderer=prefigure empty graph has exact XML baseline", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" renderer="prefigure" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all" /></coordinates></diagram>`,
        );
    });

    it("renderer=prefigure xMin updates bbox with computed defaults", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" renderer="prefigure" xMin="0" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(0,-10,10,10)"><axes axes="all" /></coordinates></diagram>`,
        );
    });

    it("renderer=prefigure size and aspectRatio control dimensions", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" renderer="prefigure" size="full" aspectRatio="2" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).eq(
            `<diagram dimensions="(850,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all" /></coordinates></diagram>`,
        );
    });

    it("renderer=prefigure maps axis visibility to horizontal/vertical axes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="gx" renderer="prefigure" displayXAxis="true" displayYAxis="false" />
<graph name="gy" renderer="prefigure" displayXAxis="false" displayYAxis="true" />
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

    it("renderer=prefigure with both axes hidden emits no axes element", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<graph name="g" renderer="prefigure" displayXAxis="false" displayYAxis="false" />`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"></coordinates></diagram>`,
        );
    });

    it("renderer=prefigure warns for unsupported graph axis label positions", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure" xLabelPosition="left" yLabelPosition="bottom">
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
                    'xLabelPosition="left" is not supported in prefigure renderer',
                ),
            ),
        ).eq(true);
        expect(
            errorWarnings.warnings.some((x) =>
                x.message.includes(
                    'yLabelPosition="bottom" is not supported in prefigure renderer',
                ),
            ),
        ).eq(true);
    });

    it("renderer=prefigure descendant warning includes position", async () => {
        const { core } = await createTestCore({
            doenetML: `
<setup>
    <styleDefinitions>
        <styleDefinition styleNumber="7" markerStyle="triangleRight" markerColor="purple" />
    </styleDefinitions>
</setup>
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure triangle marker warning has exact position", async () => {
        const { core } = await createTestCore({
            doenetML: `
<setup>
    <styleDefinitions>
        <styleDefinition styleNumber="7" markerStyle="triangleRight" markerColor="purple" />
    </styleDefinitions>
</setup>
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure maps graph axis labels with latex to m tags", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure maps point marker style and marker attributes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
  <styleDefinitions>
    <styleDefinition styleNumber="7" markerStyle="square" markerSize="6" markerColor="green" markerOpacity="0.4" lineWidth="3" />
  </styleDefinitions>
</setup>
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure maps triangle marker styles to diamond with warning", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
  <styleDefinitions>
    <styleDefinition styleNumber="7" markerStyle="triangleRight" markerColor="purple" />
  </styleDefinitions>
</setup>
<graph name="g" renderer="prefigure">
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

    it("extended graph preserves point marker mapping in prefigure renderer", async () => {
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
<graph name="gp" extend="$g" renderer="prefigure" />
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

    it("renderer=prefigure maps point label and labelPosition", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure maps point latex label to m tag", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure maps line to PreFigure line with infinite=yes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure maps line label and labelPosition", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
    <line through="(1,2) (3,4)" labelPosition="upperright"><label>A</label></line>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(`<line `);
        // labelPosition="upperright" maps near the right edge (inset from 1)
        expect(prefigureXML).toContain(`label-location="0.85"`);
        expect(prefigureXML).toContain(`>A</line>`);
    });

    it("renderer=prefigure line label default is center (no explicit label-location)", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
    <line through="(1,2) (3,4)"><label>CenterDefault</label></line>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).not.toContain(`label-location`);
        expect(prefigureXML).toContain(`>CenterDefault</line>`);
    });

    it("renderer=prefigure label-location positions label along visible line", async () => {
        // through=(1,2)→(3,4): ep1=(1,2), ep2=(3,4), slope positive (ep2.y > ep1.y)
        //   left       → label-location="0.15"
        //   right      → label-location="0.85"
        //   top        → label-location="0.85"  (ep2 is higher)
        //   bottom     → label-location="0.15"  (ep1 is lower)
        //   center     → no label-location attr (PreFigure default 0.5)
        // through=(1,4)→(3,2): ep1=(1,4), ep2=(3,2), slope negative (ep2.y < ep1.y)
        //   top        → label-location="0.15"  (ep1 is higher)
        //   bottom     → label-location="0.85"  (ep2 is lower)

        async function xmlFor(labelPosition: string, through: string) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<graph name="g" renderer="prefigure"><line through="${through}" labelPosition="${labelPosition}"><label>X</label></line></graph>`,
            });
            return (await core.returnAllStateVariables(false, true))[
                await resolvePathToNodeIdx("g")
            ].stateValues.prefigureXML as string;
        }

        const posSlope = "(1,2) (3,4)";
        const negSlope = "(1,4) (3,2)";

        expect(await xmlFor("left", posSlope)).toContain(
            `label-location="0.15"`,
        );
        expect(await xmlFor("right", posSlope)).toContain(
            `label-location="0.85"`,
        );
        expect(await xmlFor("upperleft", posSlope)).toContain(
            `label-location="0.15"`,
        );
        expect(await xmlFor("lowerright", posSlope)).toContain(
            `label-location="0.85"`,
        );
        expect(await xmlFor("top", posSlope)).toContain(
            `label-location="0.85"`,
        );
        expect(await xmlFor("bottom", posSlope)).toContain(
            `label-location="0.15"`,
        );
        expect(await xmlFor("top", negSlope)).toContain(
            `label-location="0.15"`,
        );
        expect(await xmlFor("bottom", negSlope)).toContain(
            `label-location="0.85"`,
        );
        // center emits no label-location (uses PreFigure default of 0.5)
        expect(await xmlFor("center", posSlope)).not.toContain(
            `label-location`,
        );
    });

    it("renderer=prefigure ray labelPosition controls label-location", async () => {
        // Ray from (0,0) going to (1,1), clipped to ((0,0),(10,10)).
        // After orientation ep1=(0,0), ep2=(10,10), slope positive.
        //   right → label-location="0.85" (near far/upper-right end)
        //   left  → label-location="0.15" (near ray origin / lower-left end)
        const { core: cr, resolvePathToNodeIdx: rr } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure" xMin="-10" yMin="-10" xMax="10" yMax="10">
  <ray endpoint="(0,0)" through="(1,1)" labelPosition="right"><label>R</label></ray>
</graph>
`,
        });
        const xmlRight = (await cr.returnAllStateVariables(false, true))[
            await rr("g")
        ].stateValues.prefigureXML as string;
        expect(xmlRight).toContain(`label-location="0.85"`);
        expect(xmlRight).toContain(`>R</line>`);

        const { core: cl, resolvePathToNodeIdx: rl } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure" xMin="-10" yMin="-10" xMax="10" yMax="10">
  <ray endpoint="(0,0)" through="(1,1)" labelPosition="left"><label>L</label></ray>
</graph>
`,
        });
        const xmlLeft = (await cl.returnAllStateVariables(false, true))[
            await rl("g")
        ].stateValues.prefigureXML as string;
        expect(xmlLeft).toContain(`label-location="0.15"`);
        expect(xmlLeft).toContain(`>L</line>`);
    });

    it("renderer=prefigure orients line endpoints so label is never upside-down (right-to-left line)", async () => {
        // Line given through=(3,4) then (1,2): natural order is right-to-left.
        // The converter must swap to (1,2)→(3,4) so PreFigure's label rotation
        // angle stays within (-90°,90°] — keeping the label on the top side and
        // never upside-down.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure orients line segment endpoints left-to-right for label readability", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure orients vertical line bottom-to-top for label readability", async () => {
        // Vertical line: same x, so sort by y. (2,5) has larger y → swap to (2,1)→(2,5).
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure does not change already-left-to-right line endpoints", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure maps dashed/dotted styles to numeric dash arrays", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
    <styleDefinitions>
        <styleDefinition styleNumber="7" lineStyle="dashed" />
        <styleDefinition styleNumber="8" lineStyle="dotted" />
    </styleDefinitions>
</setup>
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure maps ray to bbox-clipped finite line", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure" xMin="-10" yMin="-10" xMax="10" yMax="10">
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

    it("renderer=prefigure maps vector to tail+v representation", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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

    it("renderer=prefigure maps circle to center+radius", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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
        expect(prefigureXML).not.toContain(`fill="`);
        expect(prefigureXML).not.toContain(`fill-opacity="`);
    });

    it("renderer=prefigure includes fill attrs only when circle is filled", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
  <styleDefinitions>
    <styleDefinition styleNumber="7" fillColor="red" fillOpacity="0.4" />
  </styleDefinitions>
</setup>
<graph name="g" renderer="prefigure">
  <circle styleNumber="7" center="(1,2)" radius="3" />
  <circle styleNumber="7" center="(4,5)" radius="2" filled="true" />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).toContain(
            `<circle id="circle-0" center="(1,2)" radius="3"`,
        );
        expect(prefigureXML).not.toContain(
            `<circle id="circle-0" center="(1,2)" radius="3" fill="red"`,
        );

        expect(prefigureXML).toContain(
            `<circle id="circle-1" center="(4,5)" radius="2"`,
        );
        expect(prefigureXML).toContain(
            `<circle id="circle-1" center="(4,5)" radius="2" stroke=`,
        );
        expect(prefigureXML).toContain(`fill="red"`);
        expect(prefigureXML).toContain(`fill-opacity="0.4"`);
    });

    it("renderer=prefigure maps polygon vertices to closed polygon points", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g" renderer="prefigure">
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
        expect(prefigureXML).not.toContain(`fill="`);
        expect(prefigureXML).not.toContain(`fill-opacity="`);
    });

    it("renderer=prefigure includes fill attrs only when polygon is filled", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
  <styleDefinitions>
    <styleDefinition styleNumber="7" fillColor="red" fillOpacity="0.4" />
  </styleDefinitions>
</setup>
<graph name="g" renderer="prefigure">
  <polygon styleNumber="7" vertices="(0,0) (2,0) (1,1)" />
  <polygon styleNumber="7" vertices="(3,0) (5,0) (4,1)" filled="true" />
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const prefigureXML =
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .prefigureXML;

        expect(prefigureXML).not.toContain(
            `points="((0,0),(2,0),(1,1))" closed="yes" stroke="#648FFF" thickness="4" fill="red"`,
        );

        expect(prefigureXML).toContain(`points="((3,0),(5,0),(4,1))"`);
        expect(prefigureXML).toContain(
            `points="((3,0),(5,0),(4,1))" closed="yes" stroke="#648FFF" thickness="4" fill="red"`,
        );
        expect(prefigureXML).toContain(
            `points="((3,0),(5,0),(4,1))" closed="yes" stroke="#648FFF" thickness="4" fill="red" stroke-opacity="0.7" fill-opacity="0.4"`,
        );
    });

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: build service accepts generated XML for line/ray/vector/circle/polygon",
        async () => {
            const cases = [
                {
                    doenetML: `<graph name="g" renderer="prefigure"><line through="(1,2) (3,4)" /></graph>`,
                    expectText: "line",
                },
                {
                    doenetML: `<graph name="g" renderer="prefigure" xMin="-10" yMin="-10" xMax="10" yMax="10"><ray endpoint="(0,0)" through="(1,1)" /></graph>`,
                    expectText: "ray",
                },
                {
                    doenetML: `<graph name="g" renderer="prefigure"><vector tail="(3,5)" head="(-4,2)" /></graph>`,
                    expectText: "vector",
                },
                {
                    doenetML: `<graph name="g" renderer="prefigure"><circle center="(1,2)" radius="3" /></graph>`,
                    expectText: "circle",
                },
                {
                    doenetML: `<graph name="g" renderer="prefigure"><polygon vertices="(0,0) (2,0) (1,1)" /></graph>`,
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

    it("nested graph inherits prefigure renderer from parent", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="outer" renderer="prefigure">
  <graph name="inner" renderer="doenet">
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

        expect(outer.renderer).eq("prefigure");
        expect(outer.effectiveRenderer).eq("prefigure");
        expect(typeof outer.prefigureXML).eq("string");

        expect(inner.renderer).eq("doenet");
        expect(inner.effectiveRenderer).eq("prefigure");
        expect(inner.prefigureXML).eq(null);
    });

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: build service accepts generated empty-graph XML",
        async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<graph name="g" renderer="prefigure" />`,
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

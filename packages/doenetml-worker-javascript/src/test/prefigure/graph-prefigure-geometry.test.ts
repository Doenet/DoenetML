import "./graph-prefigure.setup";

import { describe, expect, it } from "vitest";
import { getPrefigureXML } from "./graph-prefigure.helpers";

describe("Graph prefigure renderer geometry mappings @group4", () => {
    it("renderer=prefigure maps line to PreFigure line with infinite=yes", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <line through="(1,2) (3,4)" />
</graph>
`);

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`endpoints="((1,2),(3,4))"`);
        expect(prefigureXML).toContain(`infinite="yes"`);
    });

    it("renderer=prefigure maps line label and labelPosition", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
    <line through="(1,2) (3,4)" labelPosition="upperright"><label>A</label></line>
</graph>
`);

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`label-location="0.85"`);
        expect(prefigureXML).toContain(`>A</line>`);
    });

    it("renderer=prefigure line label default is center (no explicit label-location)", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
    <line through="(1,2) (3,4)"><label>CenterDefault</label></line>
</graph>
`);

        expect(prefigureXML).not.toContain(`label-location`);
        expect(prefigureXML).toContain(`>CenterDefault</line>`);
    });

    it("renderer=prefigure label-location positions label along visible line", async () => {
        async function xmlFor(labelPosition: string, through: string) {
            return (await getPrefigureXML(
                `<graph name="g" renderer="prefigure"><line through="${through}" labelPosition="${labelPosition}"><label>X</label></line></graph>`,
            )) as string;
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
        expect(await xmlFor("center", posSlope)).not.toContain(
            `label-location`,
        );
    });

    it("renderer=prefigure ray labelPosition controls label-location", async () => {
        const xmlRight = (await getPrefigureXML(
            `
<graph name="g" renderer="prefigure" xMin="-10" yMin="-10" xMax="10" yMax="10">
  <ray endpoint="(0,0)" through="(1,1)" labelPosition="right"><label>R</label></ray>
</graph>
`,
        )) as string;
        expect(xmlRight).toContain(`label-location="0.85"`);
        expect(xmlRight).toContain(`>R</line>`);

        const xmlLeft = (await getPrefigureXML(
            `
<graph name="g" renderer="prefigure" xMin="-10" yMin="-10" xMax="10" yMax="10">
  <ray endpoint="(0,0)" through="(1,1)" labelPosition="left"><label>L</label></ray>
</graph>
`,
        )) as string;
        expect(xmlLeft).toContain(`label-location="0.15"`);
        expect(xmlLeft).toContain(`>L</line>`);
    });

    it("renderer=prefigure orients line endpoints so label is never upside-down (right-to-left line)", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
    <line through="(3,4) (1,2)"><label>B</label></line>
</graph>
`);

        expect(prefigureXML).toContain(`endpoints="((1,2),(3,4))"`);
        expect(prefigureXML).toContain(`>B</line>`);
    });

    it("renderer=prefigure orients line segment endpoints left-to-right for label readability", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
    <lineSegment endpoints="(5,1) (2,3)"><label>C</label></lineSegment>
</graph>
`);

        expect(prefigureXML).toContain(`endpoints="((2,3),(5,1))"`);
        expect(prefigureXML).toContain(`>C</line>`);
    });

    it("renderer=prefigure orients vertical line bottom-to-top for label readability", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
    <line through="(2,5) (2,1)"><label>D</label></line>
</graph>
`);

        expect(prefigureXML).toContain(`endpoints="((2,1),(2,5))"`);
        expect(prefigureXML).toContain(`>D</line>`);
    });

    it("renderer=prefigure does not change already-left-to-right line endpoints", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
    <line through="(1,2) (3,4)"><label>E</label></line>
</graph>
`);

        expect(prefigureXML).toContain(`endpoints="((1,2),(3,4))"`);
        expect(prefigureXML).toContain(`>E</line>`);
    });

    it("renderer=prefigure maps dashed/dotted styles to numeric dash arrays", async () => {
        const prefigureXML = await getPrefigureXML(`
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
`);

        expect(prefigureXML).toContain(`dash="9 9"`);
        expect(prefigureXML).toContain(`dash="4 4"`);
    });

    it("renderer=prefigure maps ray to bbox-clipped finite line", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure" xMin="-10" yMin="-10" xMax="10" yMax="10">
  <ray endpoint="(0,0)" through="(1,1)" />
</graph>
`);

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`id="ray-0"`);
        expect(prefigureXML).toContain(`endpoints="((0,0),(10,10))"`);
        expect(prefigureXML).toContain(`infinite="no"`);
    });

    it("renderer=prefigure maps vector to tail+v representation", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <vector tail="(3,5)" head="(-4,2)" />
</graph>
`);

        expect(prefigureXML).toContain(`<vector `);
        expect(prefigureXML).toContain(`tail="(3,5)"`);
        expect(prefigureXML).toContain(`v="(-7,-3)"`);
    });

    it("renderer=prefigure maps vector label and labelPosition", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <vector tail="(0,0)" head="(3,3)" labelPosition="right"><label>V</label></vector>
</graph>
`);

        expect(prefigureXML).toContain(`<vector `);
        expect(prefigureXML).toContain(`<label p="(2.55,2.55)"`);
        expect(prefigureXML).toContain(`alignment="north"`);
        expect(prefigureXML).toContain(`>V</label>`);
    });

    it("renderer=prefigure vector label default is centered along vector", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <vector tail="(0,0)" head="(3,3)"><label>CenterDefaultVector</label></vector>
</graph>
`);

        expect(prefigureXML).toContain(`<label p="(1.5,1.5)"`);
        expect(prefigureXML).toContain(`>CenterDefaultVector</label>`);
    });

    it("renderer=prefigure vector upperRight/lowerLeft follow spatial orientation on down-left vectors", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <vector tail="(3,3)" head="(0,0)" labelPosition="upperRight"><label>UR</label></vector>
  <vector tail="(3,3)" head="(0,0)" labelPosition="lowerLeft"><label>LL</label></vector>
</graph>
`);

        expect(prefigureXML).toContain(
            `<label p="(2.55,2.55)" alignment="north">UR</label>`,
        );
        expect(prefigureXML).toContain(
            `<label p="(0.44999999999999996,0.44999999999999996)" alignment="north">LL</label>`,
        );
    });

    it("renderer=prefigure maps circle to center+radius", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <circle center="(1,2)" radius="3" />
</graph>
`);

        expect(prefigureXML).toContain(`<circle `);
        expect(prefigureXML).toContain(`center="(1,2)"`);
        expect(prefigureXML).toContain(`radius="3"`);
        expect(prefigureXML).not.toContain(`fill="`);
        expect(prefigureXML).not.toContain(`fill-opacity="`);
    });

    it("renderer=prefigure includes fill attrs only when circle is filled", async () => {
        const prefigureXML = await getPrefigureXML(`
<setup>
  <styleDefinitions>
    <styleDefinition styleNumber="7" fillColor="red" fillOpacity="0.4" />
  </styleDefinitions>
</setup>
<graph name="g" renderer="prefigure">
  <circle styleNumber="7" center="(1,2)" radius="3" />
  <circle styleNumber="7" center="(4,5)" radius="2" filled="true" />
</graph>
`);

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
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <polygon vertices="(0,0) (2,0) (1,1)" />
</graph>
`);

        expect(prefigureXML).toContain(`<polygon `);
        expect(prefigureXML).toContain(`points="((0,0),(2,0),(1,1))"`);
        expect(prefigureXML).toContain(`closed="yes"`);
        expect(prefigureXML).not.toContain(`fill="`);
        expect(prefigureXML).not.toContain(`fill-opacity="`);
    });

    it("renderer=prefigure maps polyline vertices to open polygon points", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <polyline vertices="(0,0) (2,0) (1,1)" />
</graph>
`);

        expect(prefigureXML).toContain(`<polygon `);
        expect(prefigureXML).toContain(`points="((0,0),(2,0),(1,1))"`);
        expect(prefigureXML).toContain(`closed="no"`);
    });

    it("renderer=prefigure includes fill attrs only when polygon is filled", async () => {
        const prefigureXML = await getPrefigureXML(`
<setup>
  <styleDefinitions>
    <styleDefinition styleNumber="7" fillColor="red" fillOpacity="0.4" />
  </styleDefinitions>
</setup>
<graph name="g" renderer="prefigure">
  <polygon styleNumber="7" vertices="(0,0) (2,0) (1,1)" />
  <polygon styleNumber="7" vertices="(3,0) (5,0) (4,1)" filled="true" />
</graph>
`);

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

    it("renderer=prefigure maps triangle and rectangle directly to polygons", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <triangle vertices="(0,0) (2,0) (1,1)" />
    <rectangle center="(4,0.5)" width="2" height="1" />
</graph>
`);

        expect(prefigureXML).toContain(`<polygon `);
        expect(prefigureXML).toContain(`points="((0,0),(2,0),(1,1))"`);
        expect(prefigureXML).toContain(`points="((3,0),(5,0),(5,1),(3,1))"`);
        expect(prefigureXML).toContain(`closed="yes"`);
    });

    it("renderer=prefigure includes fill attrs only when triangle/rectangle are filled", async () => {
        const prefigureXML = await getPrefigureXML(`
<setup>
  <styleDefinitions>
    <styleDefinition styleNumber="7" fillColor="red" fillOpacity="0.4" />
  </styleDefinitions>
</setup>
<graph name="g" renderer="prefigure">
  <triangle styleNumber="7" vertices="(0,0) (2,0) (1,1)" />
  <triangle styleNumber="7" vertices="(3,0) (5,0) (4,1)" filled="true" />
    <rectangle styleNumber="7" center="(1,2.5)" width="2" height="1" />
    <rectangle styleNumber="7" center="(4,2.5)" width="2" height="1" filled="true" />
</graph>
`);

        expect(prefigureXML).not.toContain(
            `points="((0,0),(2,0),(1,1))" closed="yes" stroke="#648FFF" thickness="4" fill="red"`,
        );
        expect(prefigureXML).toContain(
            `points="((3,0),(5,0),(4,1))" closed="yes" stroke="#648FFF" thickness="4" fill="red"`,
        );

        expect(prefigureXML).not.toContain(
            `points="((0,2),(2,2),(2,3),(0,3))" closed="yes" stroke="#648FFF" thickness="4" fill="red"`,
        );
        expect(prefigureXML).toContain(
            `points="((3,2),(5,2),(5,3),(3,3))" closed="yes" stroke="#648FFF" thickness="4" fill="red"`,
        );
    });

    it("renderer=prefigure emits polygon-family shapes once (no polyline duplicate)", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <polygon vertices="(0,0) (2,0) (1,1)" />
  <triangle vertices="(3,0) (5,0) (4,1)" />
  <rectangle center="(7,0.5)" width="2" height="1" />
</graph>
`);

        const closedYesCount = (prefigureXML.match(/closed="yes"/g) ?? [])
            .length;
        const closedNoCount = (prefigureXML.match(/closed="no"/g) ?? []).length;

        expect(closedYesCount).eq(3);
        expect(closedNoCount).eq(0);
    });

    it("renderer=prefigure maps angle to sector arc with style", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <angle through="(1,0) (0,0) (0,1)"><label>\\theta</label></angle>
</graph>
`);

        expect(prefigureXML).not.toContain(`<polygon `);
        expect(prefigureXML).toContain(`<arc `);
        expect(prefigureXML).toContain(`sector="yes"`);
        expect(prefigureXML).toContain(`points="((1,0),(0,0),(0,1))"`);
        expect(prefigureXML).toContain(`radius="1"`);
        expect(prefigureXML).toContain(`stroke="#648FFF"`);
        expect(prefigureXML).toContain(`thickness="4"`);
        expect(prefigureXML).toContain(`fill="#648FFF"`);
        expect(prefigureXML).toContain(`<label anchor="`);
        expect(prefigureXML).toContain(`\\theta`);
    });

    it("renderer=prefigure honors angle swapPointOrder", async () => {
        const prefigureXML = await getPrefigureXML(`
<graph name="g" renderer="prefigure">
  <angle through="(1,0) (0,0) (0,1)" chooseReflexAngle="always" />
</graph>
`);

        expect(prefigureXML).toContain(`<arc `);
        expect(prefigureXML).toContain(`points="((0,1),(0,0),(1,0))"`);
    });
});

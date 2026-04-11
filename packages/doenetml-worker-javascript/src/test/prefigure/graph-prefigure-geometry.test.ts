import { describe, expect, it } from "vitest";
import { pointLabelAttributes } from "../../utils/prefigure/label";
import {
    getGraphRendererState,
    getPrefigureXML,
    getWarnings,
} from "./graph-prefigure.helpers";
import {
    prefigureGraph,
    withStyleDefinitions,
} from "./graph-prefigure.fixtures";

function labelLocationFromXml(prefigureXML: string): number {
    const match = prefigureXML.match(/label-location="([0-9.]+)"/);
    expect(match).not.toBeNull();
    return Number(match?.[1]);
}

function expectLabelLocationNearStart(prefigureXML: string, max = 0.15) {
    const location = labelLocationFromXml(prefigureXML);
    expect(location).toBeLessThan(max);
}

function expectLabelLocationNearEnd(prefigureXML: string, min = 0.85) {
    const location = labelLocationFromXml(prefigureXML);
    expect(location).toBeGreaterThan(min);
}

function expectLabelLocationBetween(
    prefigureXML: string,
    min: number,
    max: number,
) {
    const location = labelLocationFromXml(prefigureXML);
    expect(location).toBeGreaterThan(min);
    expect(location).toBeLessThan(max);
}

function expectLabelLocationNearCenter(prefigureXML: string, delta = 0.05) {
    const location = labelLocationFromXml(prefigureXML);
    expect(Math.abs(location - 0.5)).toBeLessThan(delta);
}

async function lineSegmentLabelXml({
    endpoints,
    labelPosition,
    label = "X",
    attrs,
}: {
    endpoints: string;
    labelPosition: string;
    label?: string;
    attrs?: string;
}) {
    return (await getPrefigureXML(
        prefigureGraph(
            `<lineSegment endpoints="${endpoints}" labelPosition="${labelPosition}"><label>${label}</label></lineSegment>`,
            attrs ? { attrs } : undefined,
        ),
    )) as string;
}

async function lineSegmentLabelLocation({
    endpoints,
    labelPosition,
    label = "X",
    attrs,
}: {
    endpoints: string;
    labelPosition: string;
    label?: string;
    attrs?: string;
}) {
    return labelLocationFromXml(
        await lineSegmentLabelXml({ endpoints, labelPosition, label, attrs }),
    );
}

async function lineSegmentLocationFromOrigin({
    x2,
    y2,
    labelPosition,
    label = "X",
}: {
    x2: number;
    y2: number;
    labelPosition: string;
    label?: string;
}) {
    return lineSegmentLabelLocation({
        endpoints: `(0,0) (${x2},${y2})`,
        labelPosition,
        label,
    });
}

describe("Graph prefigure renderer geometry mappings @group4", () => {
    it("renderer=prefigure maps line to PreFigure line with infinite=yes", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<line through="(1,2) (3,4)" />'),
        );

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`endpoints="((1,2),(3,4))"`);
        expect(prefigureXML).toContain(`infinite="yes"`);
    });

    it("renderer=prefigure prefers the cardinal candidate before diagonals when upperright fits in-bounds", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(1,2) (3,4)" labelPosition="upperright"><label>A</label></line>',
            ),
        );

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`label-location="0.95"`);
        expect(prefigureXML).toContain(`alignment="s"`);
        expect(prefigureXML).toContain(`>A</line>`);
    });

    it("renderer=prefigure line label snapshot", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(1,2) (3,4)" labelPosition="upperright"><label>A</label></line>',
            ),
        );

        expect(prefigureXML).toMatchInlineSnapshot(
            `"<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all" /><line at="line_0" endpoints="((1,2),(3,4))" infinite="yes" stroke="#648FFF" thickness="4" fill="#648FFF" stroke-opacity="0.7" fill-opacity="0.3" label-location="0.95" alignment="s">A</line></coordinates></diagram>"`,
        );
    });

    it("renderer=prefigure line label default is center (no explicit label-location)", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(1,2) (3,4)"><label>CenterDefault</label></line>',
            ),
        );

        expect(prefigureXML).not.toContain(`label-location`);
        expect(prefigureXML).toContain(`>CenterDefault</line>`);
    });

    it("renderer=prefigure keeps infinite line output when both defining points are off-screen but line crosses graph", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(-20,0) (20,0)" labelPosition="right"><label>Crosses</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((-20,0),(20,0))"`);
        expect(prefigureXML).toContain(`infinite="yes"`);
        expect(prefigureXML).toContain(`label-location="0.95"`);
    });

    it("renderer=prefigure keeps infinite line output when line is completely outside graph bounds", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(20,20) (30,20)" labelPosition="right"><label>Outside</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((20,20),(30,20))"`);
        expect(prefigureXML).toContain(`infinite="yes"`);
        expect(prefigureXML).toContain(`>Outside</line>`);
    });

    it("renderer=prefigure explicit center labelPosition uses north alignment away from the top edge", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(-4,-2) (4,2)" labelPosition="center"><label>C</label></line>',
            ),
        );

        expect(prefigureXML).not.toContain(`label-location`);
        expect(prefigureXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure explicit center labelPosition flips to south near the top edge", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(-9,9) (9,9.5)" labelPosition="center"><label>C</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).not.toContain(`label-location`);
        expect(prefigureXML).toContain(`alignment="s"`);
    });

    it("renderer=prefigure label-location positions label along visible line", async () => {
        const posSlope = "(1,2) (3,4)";
        const negSlope = "(1,4) (3,2)";

        expectLabelLocationNearStart(
            await lineSegmentLabelXml({
                labelPosition: "left",
                endpoints: posSlope,
            }),
            0.35,
        );
        expectLabelLocationNearEnd(
            await lineSegmentLabelXml({
                labelPosition: "right",
                endpoints: posSlope,
            }),
            0.7,
        );
        expectLabelLocationNearCenter(
            await lineSegmentLabelXml({
                labelPosition: "upperleft",
                endpoints: posSlope,
            }),
        );
        expectLabelLocationNearCenter(
            await lineSegmentLabelXml({
                labelPosition: "lowerright",
                endpoints: posSlope,
            }),
        );
        expectLabelLocationNearEnd(
            await lineSegmentLabelXml({
                labelPosition: "top",
                endpoints: posSlope,
            }),
            0.7,
        );
        expectLabelLocationNearStart(
            await lineSegmentLabelXml({
                labelPosition: "bottom",
                endpoints: posSlope,
            }),
            0.35,
        );
        expectLabelLocationNearStart(
            await lineSegmentLabelXml({
                labelPosition: "top",
                endpoints: negSlope,
            }),
            0.35,
        );
        expectLabelLocationNearEnd(
            await lineSegmentLabelXml({
                labelPosition: "bottom",
                endpoints: negSlope,
            }),
            0.7,
        );
        expectLabelLocationNearCenter(
            await lineSegmentLabelXml({
                labelPosition: "upperright",
                endpoints: negSlope,
            }),
        );
        expect(
            await lineSegmentLabelXml({
                labelPosition: "center",
                endpoints: posSlope,
            }),
        ).not.toContain(`label-location`);
    });

    it("renderer=prefigure ray labelPosition controls label-location", async () => {
        const xmlRight = (await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(0,0)" through="(1,1)" labelPosition="right"><label>R</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        )) as string;
        expectLabelLocationNearEnd(xmlRight, 0.8);
        expect(xmlRight).toContain(`>R</line>`);

        const xmlLeft = (await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(0,0)" through="(1,1)" labelPosition="left"><label>L</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        )) as string;
        expectLabelLocationNearStart(xmlLeft, 0.2);
        expect(xmlLeft).toContain(`>L</line>`);
    });

    it("renderer=prefigure endpoint-mode upperleft anchors near center on slope +1", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-1,-1) (1,1)" labelPosition="upperleft"><label>UL</label></lineSegment>',
            ),
        );

        expectLabelLocationNearCenter(prefigureXML);
        expect(prefigureXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure upperright line near right edge uses nw alignment", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(8,1) (9,2)" labelPosition="upperright"><label>Edge</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`label-location="0.95"`);
        expect(prefigureXML).toContain(`alignment="nw"`);
    });

    it("renderer=prefigure upperright line near top edge flips to sw alignment", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(-1,9) (1,9.5)" labelPosition="upperright"><label>Top</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`label-location="0.95"`);
        expect(prefigureXML).toContain(`alignment="sw"`);
    });

    it("renderer=prefigure lowerleft line near bottom edge flips to ne when se would overflow", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(-9,-9.5) (-8,-8.5)" labelPosition="lowerleft"><label>Bottom</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`label-location="0.05"`);
        expect(prefigureXML).toContain(`alignment="ne"`);
    });

    it("renderer=prefigure lowerleft prefers s when there is no clipping risk", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-4,-2) (4,2)" labelPosition="lowerleft"><label>LL</label></lineSegment>',
            ),
        );

        expectLabelLocationNearStart(prefigureXML);
        expect(prefigureXML).toContain(`alignment="s"`);
    });

    it("renderer=prefigure lowerright prefers s when there is no clipping risk", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-4,-2) (4,2)" labelPosition="lowerright"><label>LR</label></lineSegment>',
            ),
        );

        expectLabelLocationBetween(prefigureXML, 0.6, 0.7);
        expect(prefigureXML).toContain(`alignment="s"`);
    });

    it("renderer=prefigure steep upperRight line falls back to sw when the primary south candidate overflows", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(0,0) (1,8)" labelPosition="upperRight"><label>the line label</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`alignment="sw"`);
        expect(prefigureXML).toContain(`label-location="0.95"`);
    });

    it("renderer=prefigure upperleft segment with dominant vertical rise uses upper endpoint with n alignment", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-9,-1) (-8,1)" labelPosition="upperleft"><label>S</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationBetween(prefigureXML, 0.55, 0.65);
        expect(prefigureXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure steep line makes lowerright choose the lower endpoint", async () => {
        const xmlRight = (await getPrefigureXML(
            prefigureGraph(
                '<line through="(0,0) (1,8)" labelPosition="right"><label>R</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        )) as string;
        const xmlUpperRight = (await getPrefigureXML(
            prefigureGraph(
                '<line through="(0,0) (1,8)" labelPosition="upperRight"><label>UR</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        )) as string;
        const xmlLowerRight = (await getPrefigureXML(
            prefigureGraph(
                '<line through="(0,0) (1,8)" labelPosition="lowerRight"><label>LR</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        )) as string;

        expectLabelLocationBetween(xmlRight, 0.5, 0.65);
        expect(xmlUpperRight).toContain(`label-location="0.95"`);
        expectLabelLocationNearStart(xmlLowerRight, 0.2);
    });

    it("renderer=prefigure shallow line keeps lowerright on the right endpoint", async () => {
        const xmlUpperRight = (await getPrefigureXML(
            prefigureGraph(
                '<line through="(0,0) (8,1)" labelPosition="upperRight"><label>UR</label></line>',
            ),
        )) as string;
        const xmlLowerRight = (await getPrefigureXML(
            prefigureGraph(
                '<line through="(0,0) (8,1)" labelPosition="lowerRight"><label>LR</label></line>',
            ),
        )) as string;

        expect(xmlUpperRight).toContain(`label-location="0.95"`);
        expectLabelLocationNearEnd(xmlLowerRight, 0.8);
    });

    it("renderer=prefigure upperright ray near right edge falls back to nw", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(9,0)" through="(10,1)" labelPosition="upperright"><label>R</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationBetween(prefigureXML, 0.55, 0.7);
        expect(prefigureXML).toContain(`alignment="nw"`);
    });

    it("renderer=prefigure ray alignment depends on labelPosition, not separate endpoint/infinite-side modes", async () => {
        const endpointSideXML = await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(0,0)" through="(8,1)" labelPosition="upperLeft"><label>endpoint side</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );
        const throughpointSideXML = await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(0,0)" through="(8,1)" labelPosition="upperRight"><label>infinite side</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationNearStart(endpointSideXML, 0.2);
        expect(endpointSideXML).toContain(`alignment="n"`);

        expectLabelLocationNearEnd(throughpointSideXML);
        expect(throughpointSideXML).toContain(`alignment="nw"`);
    });

    it("renderer=prefigure long upperright segment label near right edge falls back to nw", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(8,0) (9,1)" labelPosition="upperright"><label>this is a long label near the edge</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationBetween(prefigureXML, 0.55, 0.7);
        expect(prefigureXML).toContain(`alignment="nw"`);
    });

    it("renderer=prefigure upperright horizontal segment at x=6 keeps n for 'the line segment'", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(0,2) (6,2)" labelPosition="upperRight"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationNearEnd(prefigureXML);
        expect(prefigureXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure right endpoint-side fallback near the right edge prefers cardinals before diagonals", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(0,2) (6,2)" labelPosition="right"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationNearEnd(prefigureXML);
        expect(prefigureXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure left endpoint-side fallback near the left edge prefers cardinals before diagonals", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-6,2) (0,2)" labelPosition="left"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationNearStart(prefigureXML);
        expect(prefigureXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure upperright horizontal segment at x=8 keeps n with absolute endpoint offset", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(0,2) (8,2)" labelPosition="upperRight"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationNearEnd(prefigureXML);
        expect(prefigureXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure segment upperright switches to clipped-edge line behavior when right endpoint is off-screen", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(0,2) (20,2)" labelPosition="upperRight"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((0,2),(20,2))"`);
        expectLabelLocationBetween(prefigureXML, 0.45, 0.55);
        expect(prefigureXML).toContain(`alignment="nw"`);
    });

    it("renderer=prefigure segment left keeps endpoint-style alignment when the opposite endpoint is off-screen", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(0,2) (20,2)" labelPosition="left"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((0,2),(20,2))"`);
        expectLabelLocationNearStart(prefigureXML, 0.08);
        expect(prefigureXML).toContain(`alignment="n"`);
        expect(prefigureXML).not.toContain(`alignment="ne"`);
    });

    it("renderer=prefigure segment lowerleft stays visible via clipped-edge line behavior when left endpoint is off-screen", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-20,2) (0,2)" labelPosition="lowerLeft"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((-20,2),(0,2))"`);
        expectLabelLocationBetween(prefigureXML, 0.5, 0.6);
        expect(prefigureXML).toContain(`alignment="se"`);
    });

    it("renderer=prefigure upperleft clipped horizontal segments keep distinct placements on left and right edges", async () => {
        const leftOffscreenXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-20,2) (0,2)" labelPosition="upperLeft"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );
        const rightOffscreenXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(0,2) (20,2)" labelPosition="upperLeft"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(leftOffscreenXML).toContain(`endpoints="((-20,2),(0,2))"`);
        expectLabelLocationBetween(leftOffscreenXML, 0.5, 0.6);
        expect(leftOffscreenXML).toContain(`alignment="ne"`);

        expect(rightOffscreenXML).toContain(`endpoints="((0,2),(20,2))"`);
        expectLabelLocationNearStart(rightOffscreenXML, 0.08);
        expect(rightOffscreenXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure segment right keeps endpoint-style alignment when the opposite endpoint is off-screen", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-20,2) (0,2)" labelPosition="right"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((-20,2),(0,2))"`);
        expectLabelLocationNearEnd(prefigureXML, 0.92);
        expect(prefigureXML).toContain(`alignment="n"`);
        expect(prefigureXML).not.toContain(`alignment="nw"`);
    });

    it("renderer=prefigure user case lowerleft segment with left endpoint off-screen keeps label on-screen", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-20,-8) (-5,4)" labelPosition="lowerLeft"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((-20,-8),(-5,4))"`);
        expectLabelLocationBetween(prefigureXML, 0.65, 0.75);
        expect(prefigureXML).toContain(`alignment="se"`);
        expect(prefigureXML).not.toContain(`alignment="sw"`);
    });

    it("renderer=prefigure segment center stays visible when one endpoint is off-screen", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-20,2) (0,2)" labelPosition="center"><label>center label</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((-20,2),(0,2))"`);
        expect(prefigureXML).toContain(`label-location="0.75"`);
        expect(prefigureXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure center lineSegment mostly off graph shifts anchor/alignment to keep label visible", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(8,9.7) (100,9.7)" labelPosition="center"><label>this is a long center label</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((8,9.7),(100,9.7))"`);
        expectLabelLocationNearStart(prefigureXML, 0.1);
        expect(prefigureXML).toContain(`alignment="sw"`);
    });

    it("renderer=prefigure segment with both endpoints off-screen but crossing graph uses clipped line-mode remap", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-20,2) (20,2)" labelPosition="upperRight"><label>crossing segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((-20,2),(20,2))"`);
        expectLabelLocationBetween(prefigureXML, 0.7, 0.8);
        expect(prefigureXML).toContain(`alignment="nw"`);
    });

    it("renderer=prefigure segment with both endpoints off-screen and outside graph keeps finite segment output", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(20,20) (30,20)" labelPosition="right"><label>outside segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((20,20),(30,20))"`);
        expect(prefigureXML).toContain(`infinite="no"`);
        expect(prefigureXML).toContain(`>outside segment</line>`);
    });

    it("renderer=prefigure lowerleft segment at x=9.2 settles on s for 'the line segment'", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(1,10) (9.2,1)" labelPosition="lowerLeft"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationBetween(prefigureXML, 0.5, 0.55);
        expect(prefigureXML).toContain(`alignment="s"`);
    });

    it("renderer=prefigure lowerleft segment at x=8 can remain s for 'the line segment'", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(1,10) (8,1)" labelPosition="lowerLeft"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationBetween(prefigureXML, 0.54, 0.58);
        expect(prefigureXML).toContain(`alignment="s"`);
    });

    it("renderer=prefigure bottom labelPosition prefers centered south alignment below the line", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-4,-2) (4,2)" labelPosition="bottom"><label>B</label></lineSegment>',
            ),
        );

        expectLabelLocationNearStart(prefigureXML, 0.35);
        expect(prefigureXML).toContain(`alignment="s"`);
    });

    it("renderer=prefigure near-horizontal bottom flips from s to n as lower edge approaches", async () => {
        const baseXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-6,-0.02) (6,0.01)" labelPosition="bottom"><label>B</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        const flippedXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-6,-0.02) (6,0.01)" labelPosition="bottom"><label>B</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-0.45" xMax="10" yMax="10"' },
            ),
        );

        expect(baseXML).toContain(`alignment="s"`);
        expect(flippedXML).toContain(`alignment="n"`);
        expect(flippedXML).not.toContain(`alignment="ne"`);
        expect(flippedXML).not.toContain(`alignment="nw"`);
    });

    it("renderer=prefigure right labelPosition uses the geometrically correct south side rather than e or w", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-4,-2) (4,2)" labelPosition="right"><label>R</label></lineSegment>',
            ),
        );

        expectLabelLocationNearEnd(prefigureXML);
        expect(prefigureXML).toContain(`alignment="s"`);
        expect(prefigureXML).not.toContain(`alignment="e"`);
        expect(prefigureXML).not.toContain(`alignment="w"`);
    });

    it("renderer=prefigure near-vertical right falls back between cardinals before using diagonals near the right edge", async () => {
        const baseXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(9.95,6) (10.02,-6)" labelPosition="right"><label>R</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="20" yMax="10"' },
            ),
        );

        const flippedXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(9.95,6) (10.02,-6)" labelPosition="right"><label>R</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="11" yMax="10"' },
            ),
        );

        expect(baseXML).toContain(`alignment="n"`);
        expect(flippedXML).toContain(`alignment="s"`);
        expect(flippedXML).not.toContain(`alignment="se"`);
        expect(flippedXML).not.toContain(`alignment="ne"`);
    });

    it("renderer=prefigure user-reported near-vertical right case near right edge unlocks to sw when both cardinals overflow", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(0.0212,6.03) (0.0259,-6.09)" labelPosition="right"><label>R</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="0.03" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`alignment="sw"`);
        expect(prefigureXML).not.toContain(`alignment="se"`);
    });

    it("renderer=prefigure right can reach the opposite-side diagonal fallback when preferred diagonals also overflow", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(9.95,6) (10.02,-6)" labelPosition="right"><label>probe label</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationBetween(prefigureXML, 0.3, 0.45);
        expect(prefigureXML).toContain(`alignment="sw"`);
    });

    it("renderer=prefigure top labelPosition transitions smoothly through center near horizontal", async () => {
        const locSteep = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: 8,
            labelPosition: "top",
            label: "T",
        });
        const locShallow = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: 1.25,
            labelPosition: "top",
            label: "T",
        });
        const locNearHorizontalPositive = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: 0.1,
            labelPosition: "top",
            label: "T",
        });
        const locNearHorizontalNegative = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: -0.1,
            labelPosition: "top",
            label: "T",
        });

        expect(locSteep).toBeGreaterThan(locShallow);
        expect(locShallow).toBeGreaterThan(locNearHorizontalPositive);
        expect(locNearHorizontalPositive).toBeGreaterThan(0.5);
        expect(locNearHorizontalNegative).toBeLessThan(0.5);
    });

    it("renderer=prefigure bottom labelPosition transitions smoothly through center near horizontal", async () => {
        const locSteep = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: 8,
            labelPosition: "bottom",
            label: "B",
        });
        const locShallow = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: 1.25,
            labelPosition: "bottom",
            label: "B",
        });
        const locNearHorizontalPositive = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: 0.1,
            labelPosition: "bottom",
            label: "B",
        });
        const locNearHorizontalNegative = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: -0.1,
            labelPosition: "bottom",
            label: "B",
        });

        expect(locSteep).toBeLessThan(locShallow);
        expect(locShallow).toBeLessThan(locNearHorizontalPositive);
        expect(locNearHorizontalPositive).toBeLessThan(0.5);
        expect(locNearHorizontalNegative).toBeGreaterThan(0.5);
    });

    it("renderer=prefigure right labelPosition transitions smoothly toward center near vertical", async () => {
        const locLargeX = await lineSegmentLocationFromOrigin({
            x2: 8,
            y2: 6,
            labelPosition: "right",
            label: "R",
        });
        const locMediumX = await lineSegmentLocationFromOrigin({
            x2: 1.25,
            y2: 6,
            labelPosition: "right",
            label: "R",
        });
        const locSmallX = await lineSegmentLocationFromOrigin({
            x2: 0.1,
            y2: 6,
            labelPosition: "right",
            label: "R",
        });

        // As the segment tilts from mostly-horizontal toward vertical, the
        // right label smoothly approaches center from above.
        expect(locLargeX).toBeGreaterThan(locMediumX);
        expect(locMediumX).toBeGreaterThan(locSmallX);
        expect(locSmallX).toBeGreaterThan(0.5);
    });

    it("renderer=prefigure left labelPosition transitions smoothly toward center near vertical", async () => {
        const locLargeX = await lineSegmentLocationFromOrigin({
            x2: 8,
            y2: 6,
            labelPosition: "left",
            label: "L",
        });
        const locMediumX = await lineSegmentLocationFromOrigin({
            x2: 1.25,
            y2: 6,
            labelPosition: "left",
            label: "L",
        });
        const locSmallX = await lineSegmentLocationFromOrigin({
            x2: 0.1,
            y2: 6,
            labelPosition: "left",
            label: "L",
        });

        // As the segment tilts from mostly-horizontal toward vertical, the
        // left label smoothly approaches center from below.
        expect(locLargeX).toBeLessThan(locMediumX);
        expect(locMediumX).toBeLessThan(locSmallX);
        expect(locSmallX).toBeLessThan(0.5);
    });

    it("renderer=prefigure upperright corner sweep all favor ep2 side across near-horizontal slopes", async () => {
        const locSteepPos = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: 8,
            labelPosition: "upperright",
            label: "UR",
        });
        const locShallowPos = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: 1.25,
            labelPosition: "upperright",
            label: "UR",
        });
        const locNearHorizPos = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: 0.1,
            labelPosition: "upperright",
            label: "UR",
        });
        const locNearHorizNeg = await lineSegmentLocationFromOrigin({
            x2: 6,
            y2: -0.1,
            labelPosition: "upperright",
            label: "UR",
        });

        // All near-horizontal cases favor ep2 (the upper-right endpoint).
        expect(locSteepPos).toBeGreaterThan(0.5);
        expect(locShallowPos).toBeGreaterThan(0.5);
        expect(locNearHorizPos).toBeGreaterThan(0.5);
        expect(locNearHorizNeg).toBeGreaterThan(0.5);
        // Steeper positive slope anchors further toward ep2 (longer span).
        expect(locSteepPos).toBeGreaterThan(locShallowPos);
    });

    it("renderer=prefigure orients line endpoints so label is never upside-down (right-to-left line)", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(3,4) (1,2)"><label>B</label></line>',
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((1,2),(3,4))"`);
        expect(prefigureXML).toContain(`>B</line>`);
    });

    it("renderer=prefigure orients line segment endpoints left-to-right for label readability", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(5,1) (2,3)"><label>C</label></lineSegment>',
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((2,3),(5,1))"`);
        expect(prefigureXML).toContain(`>C</line>`);
    });

    it("renderer=prefigure orients vertical line bottom-to-top for label readability", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(2,5) (2,1)"><label>D</label></line>',
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((2,1),(2,5))"`);
        expect(prefigureXML).toContain(`>D</line>`);
    });

    it("renderer=prefigure does not change already-left-to-right line endpoints", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(1,2) (3,4)"><label>E</label></line>',
            ),
        );

        expect(prefigureXML).toContain(`endpoints="((1,2),(3,4))"`);
        expect(prefigureXML).toContain(`>E</line>`);
    });

    it("renderer=prefigure maps dashed/dotted styles to numeric dash arrays", async () => {
        const prefigureXML = await getPrefigureXML(
            withStyleDefinitions(
                '        <styleDefinition styleNumber="7" lineStyle="dashed" />\n        <styleDefinition styleNumber="8" lineStyle="dotted" />',
                prefigureGraph(
                    '<line styleNumber="7" through="(1,2) (3,4)" />\n    <line styleNumber="8" through="(2,2) (4,4)" />',
                ),
            ),
        );

        expect(prefigureXML).toContain(`dash="9 9"`);
        expect(prefigureXML).toContain(`dash="4 4"`);
    });

    it("renderer=prefigure maps ray to bbox-clipped finite line", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<ray endpoint="(0,0)" through="(1,1)" />', {
                attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"',
            }),
        );

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`at="ray_0"`);
        expect(prefigureXML).toContain(`endpoints="((0,0),(10,10))"`);
        expect(prefigureXML).toContain(`infinite="no"`);
    });

    it("renderer=prefigure drops rays that are completely outside the graph bounds", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<ray endpoint="(20,20)" through="(30,30)" />', {
                attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"',
            }),
        );

        expect(prefigureXML).not.toContain(`at="ray_0"`);
    });

    it("renderer=prefigure clips rays with off-screen finite endpoints when the ray still crosses the graph", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(20,0)" through="(0,0)" labelPosition="right"><label>toward graph</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`at="ray_0"`);
        expect(prefigureXML).toContain(`endpoints="((-10,0),(10,0))"`);
        expectLabelLocationNearEnd(prefigureXML);
    });

    it("renderer=prefigure clips rays with off-screen throughpoint while keeping endpoint-side alignment mode", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(0,0)" through="(20,0)" labelPosition="left"><label>finite side</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`at="ray_0"`);
        expect(prefigureXML).toContain(`endpoints="((0,0),(10,0))"`);
        expectLabelLocationNearStart(prefigureXML);
        expect(prefigureXML).toContain(`alignment="n"`);
        expect(prefigureXML).not.toContain(`alignment="ne"`);
    });

    it("renderer=prefigure maps vector to tail+v representation", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<vector tail="(3,5)" head="(-4,2)" />'),
        );

        expect(prefigureXML).toContain(`<vector `);
        expect(prefigureXML).toContain(`tail="(3,5)"`);
        expect(prefigureXML).toContain(`v="(-7,-3)"`);
    });

    it("renderer=prefigure maps vector label and labelPosition", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<vector tail="(0,0)" head="(3,3)" labelPosition="right"><label>V</label></vector>',
            ),
        );

        expect(prefigureXML).toContain(`<vector `);
        expect(prefigureXML).toContain(`<label p="(2.85,2.85)"`);
        expect(prefigureXML).toContain(`alignment="north"`);
        expect(prefigureXML).toContain(`>V</label>`);
    });

    it("renderer=prefigure vector label snapshot", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<vector tail="(0,0)" head="(3,3)" labelPosition="right"><label>V</label></vector>',
            ),
        );

        expect(prefigureXML).toMatchInlineSnapshot(
            `"<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all" /><vector at="vector_0" tail="(0,0)" v="(3,3)" stroke="#648FFF" thickness="4" fill="#648FFF" stroke-opacity="0.7" fill-opacity="0.3" /><label p="(2.85,2.85)" alignment="north">V</label></coordinates></diagram>"`,
        );
    });

    it("renderer=prefigure vector label default is centered along vector", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<vector tail="(0,0)" head="(3,3)"><label>CenterDefaultVector</label></vector>',
            ),
        );

        expect(prefigureXML).toContain(`<label p="(1.5,1.5)"`);
        expect(prefigureXML).toContain(`>CenterDefaultVector</label>`);
    });

    it("renderer=prefigure vector upperRight/lowerLeft follow spatial orientation on down-left vectors", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<vector tail="(3,3)" head="(0,0)" labelPosition="upperRight"><label>UR</label></vector>\n  <vector tail="(3,3)" head="(0,0)" labelPosition="lowerLeft"><label>LL</label></vector>',
            ),
        );

        expect(prefigureXML).toContain(
            `<label p="(2.85,2.85)" alignment="north">UR</label>`,
        );
        expect(prefigureXML).toContain(
            `<label p="(0.15,0.15)" alignment="north">LL</label>`,
        );
    });

    it("renderer=prefigure maps circle to center+radius", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<circle center="(1,2)" radius="3" />'),
        );

        expect(prefigureXML).toContain(`<circle `);
        expect(prefigureXML).toContain(`center="(1,2)"`);
        expect(prefigureXML).toContain(`radius="3"`);
        expect(prefigureXML).not.toContain(`fill="`);
        expect(prefigureXML).not.toContain(`fill-opacity="`);
    });

    it("renderer=prefigure includes fill attrs only when circle is filled", async () => {
        const prefigureXML = await getPrefigureXML(
            withStyleDefinitions(
                '    <styleDefinition styleNumber="7" fillColor="red" fillOpacity="0.4" />',
                prefigureGraph(
                    '<circle styleNumber="7" center="(1,2)" radius="3" />\n  <circle styleNumber="7" center="(4,5)" radius="2" filled="true" />',
                ),
            ),
        );

        expect(prefigureXML).toContain(
            `<circle at="circle_0" center="(1,2)" radius="3"`,
        );
        expect(prefigureXML).not.toContain(
            `<circle at="circle_0" center="(1,2)" radius="3" fill="red"`,
        );

        expect(prefigureXML).toContain(
            `<circle at="circle_1" center="(4,5)" radius="2"`,
        );
        expect(prefigureXML).toContain(
            `<circle at="circle_1" center="(4,5)" radius="2" stroke=`,
        );
        expect(prefigureXML).toContain(`fill="red"`);
        expect(prefigureXML).toContain(`fill-opacity="0.4"`);
    });

    it("renderer=prefigure maps polygon vertices to closed polygon points", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<polygon vertices="(0,0) (2,0) (1,1)" />'),
        );

        expect(prefigureXML).toContain(`<polygon `);
        expect(prefigureXML).toContain(`points="((0,0),(2,0),(1,1))"`);
        expect(prefigureXML).toContain(`closed="yes"`);
        expect(prefigureXML).not.toContain(`fill="`);
        expect(prefigureXML).not.toContain(`fill-opacity="`);
    });

    it("renderer=prefigure maps polyline vertices to open polygon points", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<polyline vertices="(0,0) (2,0) (1,1)" />'),
        );

        expect(prefigureXML).toContain(`<polygon `);
        expect(prefigureXML).toContain(`points="((0,0),(2,0),(1,1))"`);
        expect(prefigureXML).toContain(`closed="no"`);
        expect(prefigureXML).not.toContain(`fill="`);
        expect(prefigureXML).not.toContain(`fill-opacity="`);
    });

    it("renderer=prefigure includes fill attrs only when polygon is filled", async () => {
        const prefigureXML = await getPrefigureXML(
            withStyleDefinitions(
                '    <styleDefinition styleNumber="7" fillColor="red" fillOpacity="0.4" />',
                prefigureGraph(
                    '<polygon styleNumber="7" vertices="(0,0) (2,0) (1,1)" />\n  <polygon styleNumber="7" vertices="(3,0) (5,0) (4,1)" filled="true" />',
                ),
            ),
        );

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
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<triangle vertices="(0,0) (2,0) (1,1)" />\n    <rectangle center="(4,0.5)" width="2" height="1" />',
            ),
        );

        expect(prefigureXML).toContain(`<polygon `);
        expect(prefigureXML).toContain(`points="((0,0),(2,0),(1,1))"`);
        expect(prefigureXML).toContain(`points="((3,0),(5,0),(5,1),(3,1))"`);
        expect(prefigureXML).toContain(`closed="yes"`);
    });

    it("renderer=prefigure includes fill attrs only when triangle/rectangle are filled", async () => {
        const prefigureXML = await getPrefigureXML(
            withStyleDefinitions(
                '    <styleDefinition styleNumber="7" fillColor="red" fillOpacity="0.4" />',
                prefigureGraph(
                    '<triangle styleNumber="7" vertices="(0,0) (2,0) (1,1)" />\n  <triangle styleNumber="7" vertices="(3,0) (5,0) (4,1)" filled="true" />\n    <rectangle styleNumber="7" center="(1,2.5)" width="2" height="1" />\n    <rectangle styleNumber="7" center="(4,2.5)" width="2" height="1" filled="true" />',
                ),
            ),
        );

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
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<polygon vertices="(0,0) (2,0) (1,1)" />\n  <triangle vertices="(3,0) (5,0) (4,1)" />\n  <rectangle center="(7,0.5)" width="2" height="1" />',
            ),
        );

        const closedYesCount = (prefigureXML.match(/closed="yes"/g) ?? [])
            .length;
        const closedNoCount = (prefigureXML.match(/closed="no"/g) ?? []).length;

        expect(closedYesCount).eq(3);
        expect(closedNoCount).eq(0);
    });

    it("renderer=prefigure maps angle to sector arc with style", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<angle through="(1,0) (0,0) (0,1)"><label>\\theta</label></angle>',
            ),
        );

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
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<angle through="(1,0) (0,0) (0,1)" chooseReflexAngle="always" />',
            ),
        );

        expect(prefigureXML).toContain(`<arc `);
        expect(prefigureXML).toContain(`points="((0,1),(0,0),(1,0))"`);
    });

    it("renderer=prefigure maps function curve to PreFigure graph", async () => {
        const prefigureXML = await getPrefigureXML(
            withStyleDefinitions(
                '    <styleDefinition styleNumber="7" lineColor="orange" lineWidth="6" />',
                prefigureGraph(
                    '<curve styleNumber="7"><function>x^2</function></curve>',
                ),
            ),
        );

        expect(prefigureXML).toContain(`<graph at="curve_0"`);
        expect(prefigureXML).toContain(`function="curve_0_f(x)=x^2"`);
        expect(prefigureXML).toContain(`domain="(-12,12)"`);
        expect(prefigureXML).toContain(`stroke="orange"`);
        expect(prefigureXML).toContain(`thickness="6"`);
    });

    it("renderer=prefigure uses curve parameter bounds instead of child function domain", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<curve parMin="-10" parMax="10"><function domain="(-1,1)">x^2</function></curve>',
            ),
        );

        expect(prefigureXML).toContain(`<graph at="curve_0"`);
        expect(prefigureXML).toContain(`function="curve_0_f(x)=x^2"`);
        expect(prefigureXML).toContain(`domain="(-10,10)"`);
        expect(prefigureXML).not.toContain(`domain="(-1,1)"`);
    });

    it("renderer=prefigure maps parameterized curve to PreFigure parametric-curve", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<curve parMin="-2" parMax="3"><function>3x</function><function>x^2</function></curve>',
            ),
        );

        expect(prefigureXML).toContain(`<parametric-curve at="curve_0"`);
        expect(prefigureXML).toContain(`function="curve_0_r(x)=(3 x,x^2)"`);
        expect(prefigureXML).toContain(`domain="(-2,3)"`);
        expect(prefigureXML).not.toContain(`fill="`);
        expect(prefigureXML).not.toContain(`fill-opacity="`);
    });

    it("renderer=prefigure normalizes parameter names across parametric coordinates", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<curve><function variable="u">u^2</function><function variable="v">v^3</function></curve>',
            ),
        );

        expect(prefigureXML).toContain(`<parametric-curve at="curve_0"`);
        expect(prefigureXML).toContain(`function="curve_0_r(u)=(`);
        expect(prefigureXML).not.toContain(`v^3`);
    });

    it("renderer=prefigure maps bezier curve to PreFigure parametric-curve", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<curve through="(0,0) (1,2) (2,1)" />'),
        );

        expect(prefigureXML).toContain(`<parametric-curve at="curve_0"`);
        expect(prefigureXML).toContain(`function="curve_0_r(`);
        expect(prefigureXML).toContain(`domain="(0,1)"`);
        expect(prefigureXML).toContain(`domain="(1,2)"`);
        expect(prefigureXML).not.toContain(`<spline `);
    });

    it("renderer=prefigure maps periodic bezier to matching parametric curve", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<curve through="(0,0) (1,2) (2,1) (0,0)" periodic="true" />',
            ),
        );

        expect(prefigureXML).toContain(`<parametric-curve at="curve_0"`);
        expect(prefigureXML).toContain(`function="curve_0_r(`);
        expect(prefigureXML).toContain(`domain="(0,1)"`);
        expect(prefigureXML).toContain(`domain="(1,2)"`);
        expect(prefigureXML).toContain(`domain="(2,3)"`);
        expect(prefigureXML).not.toContain(`<spline `);
    });

    it("renderer=prefigure excludes bezier control vectors from graph descendants", async () => {
        const { graphState, prefigureXML } = await getGraphRendererState(
            prefigureGraph(
                '<curve through="(0,0) (1,2) (2,1)"><bezierControls alwaysVisible>(1,1) (-1,1) (1,-1) (-1,-1)</bezierControls></curve>',
            ),
        );

        const descendants = (graphState.graphicalDescendants ?? []) as Array<{
            componentType?: string;
        }>;
        const vectorDescendants = descendants.filter(
            (x) => x.componentType === "vector",
        );

        expect(vectorDescendants.length).toBeGreaterThan(0);
        expect(prefigureXML).not.toContain(`<vector `);
    });

    it("renderer=prefigure warns and omits curve labels", async () => {
        const doenetML = prefigureGraph(
            "<curve><function>x^2</function><label>f</label></curve>",
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).toContain(`<graph at="curve_0"`);
        expect(prefigureXML).not.toContain(`<label`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes(
                    "labels are not supported on converted curve elements",
                ),
            ),
        ).eq(true);
    });

    it("renderer=prefigure warns when function curve cannot build finite domain for flipped rendering", async () => {
        const doenetML = prefigureGraph(
            '<curve flipFunction="true" parMin="a"><function>x^2</function></curve>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).not.toContain(`<graph at="curve_0"`);
        expect(prefigureXML).not.toContain(`<parametric-curve at="curve_0"`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some(
                (x) =>
                    x.message.includes("<curve>") &&
                    x.message.includes(
                        "non-finite or incomplete geometry; descendant skipped",
                    ),
            ),
        ).eq(true);
    });

    it("renderer=prefigure warns when parameterized curve cannot build finite domain", async () => {
        const doenetML = prefigureGraph(
            '<curve parMax="a"><function>3x</function><function>x^2</function></curve>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).not.toContain(`<parametric-curve at="curve_0"`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some(
                (x) =>
                    x.message.includes("<curve>") &&
                    x.message.includes(
                        "non-finite or incomplete geometry; descendant skipped",
                    ),
            ),
        ).eq(true);
    });

    it("renderer=prefigure warns when bezier curve cannot build finite geometry", async () => {
        const doenetML = prefigureGraph(
            '<curve through="(0,0) (a,2) (2,1)" />',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).not.toContain(`<parametric-curve at="curve_0"`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some(
                (x) =>
                    x.message.includes("<curve>") &&
                    x.message.includes(
                        "non-finite or incomplete geometry; descendant skipped",
                    ),
            ),
        ).eq(true);
    });

    it("renderer=prefigure serializes interpolated function curves", async () => {
        const doenetML = prefigureGraph(
            '<function through="(1,1) (2,2) (3,1)" />\n  <function>x^2</function>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).toContain(`<graph at="curve_1"`);
        expect(prefigureXML).toContain(`<graph at="curve_0"`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes(
                    "unsupported curve function definition type 'interpolated'",
                ),
            ),
        ).eq(false);
    });

    it("renderer=prefigure respects supported single-interval domains on interpolated functions", async () => {
        const doenetML = prefigureGraph(
            '<function through="(1,1) (2,2) (3,1)" domain="(1,2)" />',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).toContain(`<graph at="curve_0"`);
        expect(prefigureXML).toContain(`domain="(1,2)"`);
        expect(prefigureXML).not.toContain(`domain="(-12,1)"`);
        expect(prefigureXML).not.toContain(`domain="(2,3)"`);
    });

    it("renderer=prefigure emits one warning when supported piecewise curve has no overlapping pieces", async () => {
        const doenetML = prefigureGraph(
            '<curve parMin="-1" parMax="1"><piecewiseFunction><function domain="(2,3)">x^2</function><function domain="(3,4)">x^3</function></piecewiseFunction></curve>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).not.toContain(`<graph at="curve_0"`);
        expect(prefigureXML).not.toContain(`<parametric-curve at="curve_0"`);

        const diagnosticsByType = await getWarnings(doenetML);
        const relevantWarnings = diagnosticsByType.warnings.filter(
            (x) =>
                x.message.includes("unsupported curve function definition") ||
                x.message.includes(
                    "non-finite or incomplete geometry; descendant skipped",
                ),
        );

        expect(relevantWarnings.length).eq(1);
    });

    it("renderer=prefigure does not report supported empty piecewise child as unsupported", async () => {
        const doenetML = prefigureGraph(
            '<curve parMin="-1" parMax="1"><piecewiseFunction><function through="(2,2) (3,3) (4,2)" domain="(2,4)" /><function domain="(-1,1)">x^2</function></piecewiseFunction></curve>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).toContain(`<graph at="curve_0"`);
        expect(prefigureXML).toContain(`=x^2"`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes(
                    "unsupported function definition type 'interpolated'",
                ),
            ),
        ).eq(false);
    });

    it("renderer=prefigure expands piecewise curve into graph pieces", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<curve><piecewiseFunction><function domain="(-2,2)">x^3</function><function>x^2</function></piecewiseFunction></curve>',
            ),
        );

        const pieceCount = (prefigureXML.match(/<graph at="curve_0/g) ?? [])
            .length;
        expect(pieceCount).toBeGreaterThan(1);
        expect(prefigureXML).toContain(`function="curve_0_f(x)=x^3"`);
        expect(prefigureXML).toContain(`=x^2"`);
        expect(prefigureXML).not.toContain(`fill="`);
        expect(prefigureXML).not.toContain(`fill-opacity="`);
    });

    it("renderer=prefigure supports interpolated pieces within piecewise curves", async () => {
        const doenetML = prefigureGraph(
            '<curve><piecewiseFunction><function through="(0,0) (1,1) (2,0)" domain="(-2,2)" /><function>x^2</function></piecewiseFunction></curve>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        const pieceCount = (prefigureXML.match(/<graph at="curve_0/g) ?? [])
            .length;
        expect(pieceCount).toBeGreaterThan(1);
        expect(prefigureXML).toContain(`=x^2"`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes(
                    "unsupported curve function definition type 'interpolated'",
                ),
            ),
        ).eq(false);
    });

    it("renderer=prefigure expands parameterized piecewise curves into parametric pieces", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<curve><piecewiseFunction><function domain="(-2,2)">x^3/10</function><function>x^2</function></piecewiseFunction><piecewiseFunction><function domain="(-3,3)">x</function><function>x^3/10</function></piecewiseFunction></curve>',
            ),
        );

        const pieceCount =
            (prefigureXML.match(/<parametric-curve at="curve_0/g) ?? [])
                .length +
            (prefigureXML.match(/<parametric-curve at="curve_0_/g) ?? [])
                .length;

        expect(pieceCount).toBeGreaterThan(1);
        expect(prefigureXML).toContain(`function="curve_0_r(`);
        expect(prefigureXML).toContain(`(x^3)/10`);
        expect(prefigureXML).toContain(`domain="`);
        expect(prefigureXML).not.toContain(`fill="`);
        expect(prefigureXML).not.toContain(`fill-opacity="`);
    });
});

// ─── point label alignment overflow ──────────────────────────────────────────

async function pointLabelXml({
    xs,
    labelPosition,
    label = "X",
    attrs = "",
}: {
    xs: string;
    labelPosition: string;
    label?: string;
    attrs?: string;
}) {
    return (await getPrefigureXML(
        prefigureGraph(
            `<point xs="${xs}" labelPosition="${labelPosition}"${attrs ? " " + attrs : ""}><label>${label}</label></point>`,
        ),
    )) as string;
}

describe("point label alignment overflow @group4", () => {
    it("center — primary alignment used when no overflow", async () => {
        const prefigureXML = await pointLabelXml({
            xs: "0 0",
            labelPosition: "upperright",
        });
        expect(prefigureXML).toContain(`alignment="ne"`);
    });

    it("near top-right — primary ne overflows, fallback used", async () => {
        const prefigureXML = await pointLabelXml({
            xs: "9.5 9.5",
            labelPosition: "upperright",
        });
        expect(prefigureXML).not.toContain(`alignment="ne"`);
    });

    it("near top-left — primary nw overflows, fallback used", async () => {
        const prefigureXML = await pointLabelXml({
            xs: "-9.5 9.5",
            labelPosition: "upperleft",
        });
        expect(prefigureXML).not.toContain(`alignment="nw"`);
    });

    it("near bottom-right — primary se overflows, fallback used", async () => {
        const prefigureXML = await pointLabelXml({
            xs: "9.5 -9.5",
            labelPosition: "lowerright",
        });
        expect(prefigureXML).not.toContain(`alignment="se"`);
    });

    it("near top edge centered — primary n overflows, fallback used", async () => {
        const prefigureXML = await pointLabelXml({
            xs: "0 9.5",
            labelPosition: "top",
        });
        expect(prefigureXML).not.toContain(`alignment="n"`);
    });

    it("no graphBounds — falls back to direct lookup", () => {
        // When graphBounds is absent from stateValues, the direct alignment
        // (prefigurePointAlignmentByLabelPosition lookup) is used without
        // overflow evaluation. A top-right corner point still gets "ne".
        const result = pointLabelAttributes({
            stateValues: {
                label: "X",
                labelHasLatex: false,
                labelPosition: "upperright",
                numericalXs: [9.5, 9.5],
                // graphBounds intentionally omitted
            },
            diagnostics: [],
            warningPrefix: "test",
        });
        expect(result?.attrs).toContain(`alignment="ne"`);
    });
});

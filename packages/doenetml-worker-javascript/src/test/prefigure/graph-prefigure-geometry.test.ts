import { describe, expect, it } from "vitest";
import { getPrefigureXML } from "./graph-prefigure.helpers";
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

describe("Graph prefigure renderer geometry mappings @group4", () => {
    it("renderer=prefigure maps line to PreFigure line with infinite=yes", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<line through="(1,2) (3,4)" />'),
        );

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`endpoints="((1,2),(3,4))"`);
        expect(prefigureXML).toContain(`infinite="yes"`);
    });

    it("renderer=prefigure uses diagonal alignment for upperright line labels near the top-right corner", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(1,2) (3,4)" labelPosition="upperright"><label>A</label></line>',
            ),
        );

        expect(prefigureXML).toContain(`<line `);
        expect(prefigureXML).toContain(`label-location="0.95"`);
        expect(prefigureXML).toContain(`alignment="sw"`);
        expect(prefigureXML).toContain(`>A</line>`);
    });

    it("renderer=prefigure line label snapshot", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(1,2) (3,4)" labelPosition="upperright"><label>A</label></line>',
            ),
        );

        expect(prefigureXML).toMatchInlineSnapshot(
            `"<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all" /><line id="line-0" endpoints="((1,2),(3,4))" infinite="yes" stroke="#648FFF" thickness="4" fill="#648FFF" stroke-opacity="0.7" fill-opacity="0.3" label-location="0.95" alignment="sw">A</line></coordinates></diagram>"`,
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
        async function xmlFor(labelPosition: string, endpoints: string) {
            return (await getPrefigureXML(
                prefigureGraph(
                    `<lineSegment endpoints="${endpoints}" labelPosition="${labelPosition}"><label>X</label></lineSegment>`,
                ),
            )) as string;
        }

        const posSlope = "(1,2) (3,4)";
        const negSlope = "(1,4) (3,2)";

        expectLabelLocationNearStart(await xmlFor("left", posSlope), 0.25);
        expectLabelLocationNearEnd(await xmlFor("right", posSlope), 0.75);
        expectLabelLocationNearStart(await xmlFor("upperleft", posSlope), 0.25);
        expectLabelLocationNearEnd(await xmlFor("lowerright", posSlope), 0.75);
        expectLabelLocationNearEnd(await xmlFor("top", posSlope), 0.75);
        expectLabelLocationNearStart(await xmlFor("bottom", posSlope), 0.25);
        expectLabelLocationNearStart(await xmlFor("top", negSlope), 0.25);
        expectLabelLocationNearEnd(await xmlFor("bottom", negSlope), 0.75);
        expect(await xmlFor("center", posSlope)).not.toContain(
            `label-location`,
        );
    });

    it("renderer=prefigure ray labelPosition controls label-location", async () => {
        const xmlRight = (await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(0,0)" through="(1,1)" labelPosition="right"><label>R</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        )) as string;
        expectLabelLocationNearEnd(xmlRight);
        expect(xmlRight).toContain(`>R</line>`);

        const xmlLeft = (await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(0,0)" through="(1,1)" labelPosition="left"><label>L</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        )) as string;
        expectLabelLocationNearStart(xmlLeft);
        expect(xmlLeft).toContain(`>L</line>`);
    });

    it("renderer=prefigure endpoint-mode upperleft defaults to n alignment", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-1,-1) (1,1)" labelPosition="upperleft"><label>UL</label></lineSegment>',
            ),
        );

        expectLabelLocationNearStart(prefigureXML, 0.25);
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

        expectLabelLocationNearEnd(prefigureXML);
        expect(prefigureXML).toContain(`alignment="s"`);
    });

    it("renderer=prefigure steep upperRight line uses nw alignment to keep label inside graph", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<line through="(0,0) (1,8)" labelPosition="upperRight"><label>the line label</label></line>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`alignment="nw"`);
        expect(prefigureXML).toContain(`label-location="0.95"`);
    });

    it("renderer=prefigure upperleft segment with dominant vertical rise uses upper endpoint with n alignment", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-9,-1) (-8,1)" labelPosition="upperleft"><label>S</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationBetween(prefigureXML, 0.7, 0.8);
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

        expect(xmlRight).toContain(`label-location="0.95"`);
        expect(xmlUpperRight).toContain(`label-location="0.95"`);
        expect(xmlLowerRight).toContain(`label-location="0.05"`);
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
        expect(xmlLowerRight).toContain(`label-location="0.95"`);
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

    it("renderer=prefigure ray uses endpoint-mode alignment when label is on endpoint side", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(0,0)" through="(8,1)" labelPosition="upperLeft"><label>endpoint side</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationNearStart(prefigureXML);
        expect(prefigureXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure ray uses line-mode alignment when label is on infinite side", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(0,0)" through="(8,1)" labelPosition="upperRight"><label>infinite side</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationNearEnd(prefigureXML);
        expect(prefigureXML).toContain(`alignment="nw"`);
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

    it("renderer=prefigure right endpoint-mode uses 4-candidate fallback chain near the right edge", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(0,2) (6,2)" labelPosition="right"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationNearEnd(prefigureXML);
        expect(prefigureXML).toContain(`alignment="n"`);
    });

    it("renderer=prefigure left endpoint-mode uses 4-candidate fallback chain near the left edge", async () => {
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

    it("renderer=prefigure segment left keeps endpoint-mode alignment when the opposite endpoint is off-screen", async () => {
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

    it("renderer=prefigure segment right keeps endpoint-mode alignment when the opposite endpoint is off-screen", async () => {
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

    it("renderer=prefigure lowerleft segment at x=9.2 flips to sw for 'the line segment'", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(1,10) (9.2,1)" labelPosition="lowerLeft"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationNearEnd(prefigureXML);
        expect(prefigureXML).toContain(`alignment="sw"`);
    });

    it("renderer=prefigure lowerleft segment at x=8 can remain s for 'the line segment'", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(1,10) (8,1)" labelPosition="lowerLeft"><label>the line segment</label></lineSegment>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expectLabelLocationNearEnd(prefigureXML);
        expect(prefigureXML).toContain(`alignment="s"`);
    });

    it("renderer=prefigure bottom labelPosition prefers a diagonal below the line", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-4,-2) (4,2)" labelPosition="bottom"><label>B</label></lineSegment>',
            ),
        );

        expectLabelLocationNearStart(prefigureXML);
        expect(prefigureXML).toContain(`alignment="se"`);
    });

    it("renderer=prefigure right labelPosition uses n alignment rather than e or w", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<lineSegment endpoints="(-4,-2) (4,2)" labelPosition="right"><label>R</label></lineSegment>',
            ),
        );

        expectLabelLocationNearEnd(prefigureXML);
        expect(prefigureXML).toContain(`alignment="n"`);
        expect(prefigureXML).not.toContain(`alignment="e"`);
        expect(prefigureXML).not.toContain(`alignment="w"`);
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
        expect(prefigureXML).toContain(`id="ray-0"`);
        expect(prefigureXML).toContain(`endpoints="((0,0),(10,10))"`);
        expect(prefigureXML).toContain(`infinite="no"`);
    });

    it("renderer=prefigure drops rays that are completely outside the graph bounds", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<ray endpoint="(20,20)" through="(30,30)" />', {
                attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"',
            }),
        );

        expect(prefigureXML).not.toContain(`id="ray-0"`);
    });

    it("renderer=prefigure clips rays with off-screen finite endpoints when the ray still crosses the graph", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<ray endpoint="(20,0)" through="(0,0)" labelPosition="right"><label>toward graph</label></ray>',
                { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
            ),
        );

        expect(prefigureXML).toContain(`id="ray-0"`);
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

        expect(prefigureXML).toContain(`id="ray-0"`);
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
            `"<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all" /><vector id="vector-0" tail="(0,0)" v="(3,3)" stroke="#648FFF" thickness="4" fill="#648FFF" stroke-opacity="0.7" fill-opacity="0.3" /><label p="(2.85,2.85)" alignment="north">V</label></coordinates></diagram>"`,
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
});

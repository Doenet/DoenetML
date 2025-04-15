import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePoint,
    movePolygon,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function setupScene({
    rectangleProperties,
    rectangleChildren,
}: {
    rectangleProperties: string;
    rectangleChildren: string;
}) {
    let core = await createTestCore({
        doenetML:
            `
  <graph>
    <rectangle name="rectangle" ` +
            rectangleProperties +
            `>
    ` +
            rectangleChildren +
            `
    </rectangle>
  </graph>

  <graph>
    $rectangle.center{assignNames="centerPoint"}
    $rectangle.vertex1{assignNames="v1"}
    $rectangle.vertex2{assignNames="v2"}
    $rectangle.vertex3{assignNames="v3"}
    $rectangle.vertex4{assignNames="v4"}
  </graph>

  <mathInput name="mi1" bindValueTo="$(rectangle.width)" />
  <mathInput name="mi2" bindValueTo="$(rectangle.height)" />

  <graph name="graph3">
    $rectangle{name="rectangleCopy"}
  </graph>
  
  $graph3{name="graph4" newNamespace}
  `,
    });

    return core;
}

async function runTests({
    core,
    v0x,
    v0y,
    v2x,
    v2y,
    cornerDependencyState,
}: {
    core: PublicDoenetMLCore;
    v0x: number;
    v0y: number;
    v2x: number;
    v2y: number;
    cornerDependencyState: 0 | 1 | 2;
}) {
    let rectangleName = "/rectangle";
    let centerPointName = "/centerPoint";
    let v0Name = "/v1";
    let v1Name = "/v2";
    let v2Name = "/v3";
    let v3Name = "/v4";
    let rectangleCopyName = "/rectangleCopy";
    let rectangleCopy2Name = "/graph4/rectangleCopy";
    let widthInputName = "/mi1";
    let heightInputName = "/mi2";

    let inputs = {
        rectangleNames: [rectangleName, rectangleCopyName, rectangleCopy2Name],
        vertexNames: [v0Name, v1Name, v2Name, v3Name],
        widthInputName,
        heightInputName,
        centerPointName,
    };

    await checkRectangleValues(inputs, { v0x, v0y, v2x, v2y }, core);

    // move rectangle points individually
    await movePolygon({
        name: rectangleName,
        pointCoords: { 0: [2, -1] },
        core,
    });
    await checkRectangleValues(inputs, { v0x: 2, v0y: -1, v2x, v2y }, core);

    await movePolygon({
        name: rectangleName,
        pointCoords: { 1: [0, 2] },
        core,
    });
    await checkRectangleValues(inputs, { v0x: 2, v0y: 2, v2x: 0, v2y }, core);

    await movePolygon({
        name: rectangleName,
        pointCoords: { 2: [-4, -5] },
        core,
    });
    await checkRectangleValues(
        inputs,
        { v0x: 2, v0y: 2, v2x: -4, v2y: -5 },
        core,
    );

    await movePolygon({
        name: rectangleName,
        pointCoords: { 3: [3, 4] },
        core,
    });
    await checkRectangleValues(
        inputs,
        { v0x: 3, v0y: 2, v2x: -4, v2y: 4 },
        core,
    );

    // move rectangle points together
    await movePolygon({
        name: rectangleName,
        pointCoords: {
            0: [4, 3],
            1: [-3, 3],
            2: [-3, 5],
            3: [4, 5],
        },
        core,
    });
    await checkRectangleValues(
        inputs,
        { v0x: 4, v0y: 3, v2x: -3, v2y: 5 },
        core,
    );

    // move center point
    await movePoint({ name: centerPointName, x: 0, y: 0, core });
    await checkRectangleValues(
        inputs,
        { v0x: 3.5, v0y: -1, v2x: -3.5, v2y: 1 },
        core,
    );

    // move copied vertices
    if (cornerDependencyState === 0) {
        // natural behavior

        await movePoint({ name: v0Name, x: 0, y: 0, core });
        await checkRectangleValues(
            inputs,
            { v0x: 0, v0y: 0, v2x: -3.5, v2y: 1 },
            core,
        );

        await movePoint({ name: v1Name, x: 1, y: -1, core });
        await checkRectangleValues(
            inputs,
            { v0x: 0, v0y: -1, v2x: 1, v2y: 1 },
            core,
        );

        await movePoint({ name: v2Name, x: 2.25, y: 2.25, core });
        await checkRectangleValues(
            inputs,
            { v0x: 0, v0y: -1, v2x: 2.25, v2y: 2.25 },
            core,
        );

        await movePoint({ name: v3Name, x: -1, y: -5, core });
        await checkRectangleValues(
            inputs,
            { v0x: -1, v0y: -1, v2x: 2.25, v2y: -5 },
            core,
        );
    } else if (cornerDependencyState === 1) {
        // corner, width and height

        await movePoint({ name: v0Name, x: 0, y: 0, core });
        await checkRectangleValues(
            inputs,
            { v0x: 0, v0y: 0, v2x: -7, v2y: 2 },
            core,
        );

        await movePoint({ name: v1Name, x: 1, y: -1, core });
        await checkRectangleValues(
            inputs,
            { v0x: 0, v0y: -1, v2x: 1, v2y: 1 },
            core,
        );

        await movePoint({ name: v2Name, x: 2.25, y: 2.25, core });
        await checkRectangleValues(
            inputs,
            { v0x: 0, v0y: -1, v2x: 2.25, v2y: 2.25 },
            core,
        );

        await movePoint({ name: v3Name, x: -1, y: -5, core });
        await checkRectangleValues(
            inputs,
            { v0x: -1, v0y: -1, v2x: 1.25, v2y: -5 },
            core,
        );
    } else if (cornerDependencyState === 2) {
        //TODO: corner and center

        await movePoint({ name: v0Name, x: 0, y: 0, core });
        await checkRectangleValues(
            inputs,
            { v0x: 0, v0y: 0, v2x: 0, v2y: 0 },
            core,
        );

        await movePoint({ name: v1Name, x: 1, y: -1, core });
        await checkRectangleValues(
            inputs,
            { v0x: 0, v0y: -1, v2x: 1, v2y: 1 },
            core,
        );

        await movePoint({ name: v2Name, x: 2.25, y: 2.25, core });
        await checkRectangleValues(
            inputs,
            { v0x: 0, v0y: -1, v2x: 2.25, v2y: 2.25 },
            core,
        );

        await movePoint({ name: v3Name, x: -1, y: -5, core });
        await checkRectangleValues(
            inputs,
            { v0x: -1, v0y: -1, v2x: 3.25, v2y: -5 },
            core,
        );
    }

    for (let name of [rectangleCopyName, rectangleCopy2Name]) {
        // rectangleCopy/rectangleCopy2 together
        await movePolygon({
            name: name,
            pointCoords: { 0: [0, 0], 1: [1, 0], 2: [1, 1], 3: [0, 1] },
            core,
        });
        await checkRectangleValues(
            inputs,
            { v0x: 0, v0y: 0, v2x: 1, v2y: 1 },
            core,
        );

        // rectangleCopy/rectangleCopy2 individually
        await movePolygon({
            name: name,
            pointCoords: { 0: [2, -1] },
            core,
        });
        await checkRectangleValues(
            inputs,
            { v0x: 2, v0y: -1, v2x: 1, v2y: 1 },
            core,
        );

        await movePolygon({
            name: name,
            pointCoords: { 1: [0, 2] },
            core,
        });
        await checkRectangleValues(
            inputs,
            { v0x: 2, v0y: 2, v2x: 0, v2y: 1 },
            core,
        );

        await movePolygon({
            name: name,
            pointCoords: { 2: [-4, -5] },
            core,
        });
        await checkRectangleValues(
            inputs,
            { v0x: 2, v0y: 2, v2x: -4, v2y: -5 },
            core,
        );

        await movePolygon({
            name: name,
            pointCoords: { 3: [3, 4] },
            core,
        });
        await checkRectangleValues(
            inputs,
            { v0x: 3, v0y: 2, v2x: -4, v2y: 4 },
            core,
        );
    }

    // reset polygon
    await movePolygon({
        name: rectangleName,
        pointCoords: { 0: [0, 0], 1: [1, 0], 2: [1, 1], 3: [0, 1] },
        core,
    });
}

async function checkRectangleValues(
    {
        rectangleNames,
        vertexNames,
        widthInputName,
        heightInputName,
        centerPointName,
    }: {
        rectangleNames: string[];
        vertexNames?: string[];
        widthInputName?: string;
        heightInputName?: string;
        centerPointName?: string;
    },
    {
        v0x,
        v0y,
        v2x,
        v2y,
    }: { v0x: number; v0y: number; v2x: number; v2y: number },
    core: PublicDoenetMLCore,
) {
    const stateVariables = await core.returnAllStateVariables(false, true);

    let vertexCoords = [
        [v0x, v0y],
        [v2x, v0y],
        [v2x, v2y],
        [v0x, v2y],
    ];
    let centerCoords = [(v0x + v2x) / 2, (v0y + v2y) / 2];
    let widthValue = Math.abs(v2x - v0x);
    let heightValue = Math.abs(v2y - v0y);

    for (let rectangleName of rectangleNames) {
        let rectangle = stateVariables[rectangleName];
        expect(
            rectangle.stateValues.vertices.map((x) =>
                x.map((y) => y.evaluate_to_constant()),
            ),
        ).eqls(vertexCoords);
        expect(
            rectangle.stateValues.center.map((x) => x.evaluate_to_constant()),
        ).eqls(centerCoords);
        expect(rectangle.stateValues.width).eq(widthValue);
        expect(rectangle.stateValues.height).eq(heightValue);
    }

    if (vertexNames) {
        for (let [index, vertexName] of vertexNames.entries()) {
            let vertex = stateVariables[vertexName];
            expect(
                vertex.stateValues.xs.map((x) => x.evaluate_to_constant()),
            ).eqls(vertexCoords[index]);
        }
    }

    if (centerPointName) {
        let centerPoint = stateVariables[centerPointName];
        expect(
            centerPoint.stateValues.xs.map((x) => x.evaluate_to_constant()),
        ).eqls(centerCoords);
    }
    // expect(widthInput.stateValues.value.tree).eq(widthValue);
    // expect(heightInput.stateValues.value.tree).eq(heightValue);
}

describe("Rectangle tag tests", async () => {
    it("rectangle with no parameters (gives unit square)", async () => {
        let core = await setupScene({
            rectangleProperties: "",
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: 0,
            v0y: 0,
            v2x: 1,
            v2y: 1,
            cornerDependencyState: 1,
        });
    });

    it("rectangle with only height", async () => {
        let core = await setupScene({
            rectangleProperties: 'height="-3"',
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: 0,
            v0y: 0,
            v2x: 1,
            v2y: -3,
            cornerDependencyState: 1,
        });
    });

    it("rectangle with only width and height", async () => {
        let core = await setupScene({
            rectangleProperties: 'width="3" height="5"',
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: 0,
            v0y: 0,
            v2x: 3,
            v2y: 5,
            cornerDependencyState: 1,
        });
    });

    it("rectangle with only center", async () => {
        let core = await setupScene({
            rectangleProperties: 'center="(-1,5)"',
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: -1.5,
            v0y: 4.5,
            v2x: -0.5,
            v2y: 5.5,
            cornerDependencyState: 0,
        });
    });

    it("rectangle with only center and width", async () => {
        let core = await setupScene({
            rectangleProperties: 'width="-2" center="(-4,2)"',
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: -3,
            v0y: 1.5,
            v2x: -5,
            v2y: 2.5,
            cornerDependencyState: 0,
        });
    });

    it("rectangle with only 1 vertex", async () => {
        let core = await setupScene({
            rectangleProperties: 'vertices="(2,3)"',
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: 2,
            v0y: 3,
            v2x: 3,
            v2y: 4,
            cornerDependencyState: 1,
        });
    });

    it("rectangle with only 1 vertex and height", async () => {
        let core = await setupScene({
            rectangleProperties: 'height="6" vertices="(-3,4)"',
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: -3,
            v0y: 4,
            v2x: -2,
            v2y: 10,
            cornerDependencyState: 1,
        });
    });

    it("rectangle with center, width and height", async () => {
        let core = await setupScene({
            rectangleProperties: 'width="6" height="-3" center="(-3,-4)"',
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: -6,
            v0y: -2.5,
            v2x: 0,
            v2y: -5.5,
            cornerDependencyState: 0,
        });
    });

    it("rectangle with vertex, width and height", async () => {
        let core = await setupScene({
            rectangleProperties: 'width="7" height="4" vertices="(-1,2)"',
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: -1,
            v0y: 2,
            v2x: 6,
            v2y: 6,
            cornerDependencyState: 1,
        });
    });

    it("rectangle with 1 vertex and center", async () => {
        let core = await setupScene({
            rectangleProperties: 'vertices="(-2,-4)" center="(1,-1)"',
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: -2,
            v0y: -4,
            v2x: 4,
            v2y: 2,
            cornerDependencyState: 2,
        });
    });

    it("rectangle with 2 vertices", async () => {
        let core = await setupScene({
            rectangleProperties: 'vertices="(-5,-9) (-1,-2)"',
            rectangleChildren: "",
        });

        await runTests({
            core,
            v0x: -5,
            v0y: -9,
            v2x: -1,
            v2y: -2,
            cornerDependencyState: 0,
        });
    });

    it("copy rectangle and overwrite attributes", async () => {
        let core = await createTestCore({
            doenetML: `
    <group newNamespace name="g1" >
      <sideBySide widths="25% 25% 25% 25%" >
      <graph width="180" height="180">
        <rectangle name="r1" />
      </graph>
      <graph width="180" height="180">
        <rectangle copySource="r1" vertices="(3,4)" name="r2" styleNumber="2" />
      </graph>
      <graph width="180" height="180">
        <rectangle copySource="r2" width="5" name="r3" styleNumber="3" />
      </graph>
      <graph width="180" height="180">
        <rectangle copySource="r3" center="(4,5)" name="r4" styleNumber="4" />
      </graph>
      </sideBySide>
    </group>

    $g1{name="g2"}


    `,
        });

        async function check_items({
            v0x1,
            v0y1,
            v2x1,
            v2y1,
            v0x2,
            v0y2,
            v2x2,
            v2y2,
            v2x3,
            v2x4,
            v2y4,
        }) {
            await checkRectangleValues(
                { rectangleNames: ["/g1/r1", "/g2/r1"] },
                { v0x: v0x1, v0y: v0y1, v2x: v2x1, v2y: v2y1 },
                core,
            );

            await checkRectangleValues(
                { rectangleNames: ["/g1/r2", "/g2/r2"] },
                { v0x: v0x2, v0y: v0y2, v2x: v2x2, v2y: v2y2 },
                core,
            );

            await checkRectangleValues(
                { rectangleNames: ["/g1/r3", "/g2/r3"] },
                { v0x: v0x2, v0y: v0y2, v2x: v2x3, v2y: v2y2 },
                core,
            );

            await checkRectangleValues(
                { rectangleNames: ["/g1/r4", "/g2/r4"] },
                { v0x: v0x2, v0y: v0y2, v2x: v2x4, v2y: v2y4 },
                core,
            );
        }

        let v0x1 = 0,
            v0y1 = 0,
            v2x1 = 1,
            v2y1 = 1,
            v0x2 = 3,
            v0y2 = 4,
            v2x2 = 4,
            v2y2 = 5,
            v2x3 = 8,
            v2x4 = 5,
            v2y4 = 6;

        await check_items({
            v0x1,
            v0y1,
            v2x1,
            v2y1,
            v0x2,
            v0y2,
            v2x2,
            v2y2,
            v2x3,
            v2x4,
            v2y4,
        });

        // shift g1/r1
        let dx = -2;
        let dy = 4;

        v0x1 += dx;
        v0y1 += dy;
        v2x1 += dx;
        v2y1 += dy;

        await movePolygon({
            name: "/g1/r1",
            pointCoords: { 0: [v0x1, v0y1], 2: [v2x1, v2y1] },
            core,
        });

        await check_items({
            v0x1,
            v0y1,
            v2x1,
            v2y1,
            v0x2,
            v0y2,
            v2x2,
            v2y2,
            v2x3,
            v2x4,
            v2y4,
        });

        // move vertex 0 of g2/r1
        v0x1 = 1;
        v0y1 = 8;

        let width = v2x1 - v0x1;
        let height = v2y1 - v0y1;

        v2x2 = v0x2 + width;
        v2y2 = v0y2 + height;

        await movePolygon({
            name: "/g2/r1",
            pointCoords: { 0: [v0x1, v0y1] },
            core,
        });

        await check_items({
            v0x1,
            v0y1,
            v2x1,
            v2y1,
            v0x2,
            v0y2,
            v2x2,
            v2y2,
            v2x3,
            v2x4,
            v2y4,
        });

        // move vertex 1 of g1/r2
        let center4x = (v2x4 + v0x2) / 2;
        let center4y = (v2y4 + v0y2) / 2;

        let width3 = v2x3 - v0x2;

        v0x2 = -5;
        v0y2 = -2;

        width = v2x2 - v0x2;
        height = v2y2 - v0y2;

        v2x1 = v0x1 + width;
        v2y1 = v0y1 + height;

        v2x3 = v0x2 + width3;

        v2x4 = 2 * center4x - v0x2;
        v2y4 = 2 * center4y - v0y2;

        await movePolygon({
            name: "/g1/r2",
            pointCoords: { 0: [v0x2, v0y2] },
            core,
        });

        await check_items({
            v0x1,
            v0y1,
            v2x1,
            v2y1,
            v0x2,
            v0y2,
            v2x2,
            v2y2,
            v2x3,
            v2x4,
            v2y4,
        });

        // move vertex 2 of g2/r2
        center4y = (v2y4 + v0y2) / 2;

        v2x2 = -3;
        v0y2 = 3;

        width = v2x2 - v0x2;
        height = v2y2 - v0y2;

        v2x1 = v0x1 + width;
        v2y1 = v0y1 + height;

        v2y4 = 2 * center4y - v0y2;

        await movePolygon({
            name: "/g2/r2",
            pointCoords: { 1: [v2x2, v0y2] },
            core,
        });

        await check_items({
            v0x1,
            v0y1,
            v2x1,
            v2y1,
            v0x2,
            v0y2,
            v2x2,
            v2y2,
            v2x3,
            v2x4,
            v2y4,
        });

        // move vertex 3 of g1/r3
        v2x3 = -8;
        v2y2 = -6;

        height = v2y2 - v0y2;

        v2y1 = v0y1 + height;

        await movePolygon({
            name: "/g1/r3",
            pointCoords: { 2: [v2x3, v2y2] },
            core,
        });

        await check_items({
            v0x1,
            v0y1,
            v2x1,
            v2y1,
            v0x2,
            v0y2,
            v2x2,
            v2y2,
            v2x3,
            v2x4,
            v2y4,
        });

        // move vertex 4 of g2/r3
        center4x = (v2x4 + v0x2) / 2;

        width = v2x2 - v0x2;

        v0x2 = 7;
        v2y2 = -5;

        height = v2y2 - v0y2;

        v2x2 = v0x2 + width;

        v2x1 = v0x1 + width;
        v2y1 = v0y1 + height;

        v2x4 = 2 * center4x - v0x2;

        await movePolygon({
            name: "/g2/r3",
            pointCoords: { 3: [v0x2, v2y2] },
            core,
        });

        await check_items({
            v0x1,
            v0y1,
            v2x1,
            v2y1,
            v0x2,
            v0y2,
            v2x2,
            v2y2,
            v2x3,
            v2x4,
            v2y4,
        });

        // move vertex 2 of g1/r4
        height = v2y2 - v0y2;

        v2x4 = -9;
        v0y2 = 8;

        v2y2 = v0y2 + height;

        await movePolygon({
            name: "/g1/r4",
            pointCoords: { 1: [v2x4, v0y2] },
            core,
        });

        await check_items({
            v0x1,
            v0y1,
            v2x1,
            v2y1,
            v0x2,
            v0y2,
            v2x2,
            v2y2,
            v2x3,
            v2x4,
            v2y4,
        });

        // move vertex 3 of g2/r4
        v2x4 = 2;
        v2y4 = -5;
        await movePolygon({
            name: "/g1/r4",
            pointCoords: { 2: [v2x4, v2y4] },
            core,
        });

        await check_items({
            v0x1,
            v0y1,
            v2x1,
            v2y1,
            v0x2,
            v0y2,
            v2x2,
            v2y2,
            v2x3,
            v2x4,
            v2y4,
        });
    });

    it("copy propIndex of vertices, dot and array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <rectangle name="rectangle" vertices="(2,-3) (3,4)" />
    </graph>
 
    <p><mathInput name="n" /></p>

    <p><copy source="rectangle.vertices[$n]" assignNames="P1 P2 P3 P4" /></p>

    <p><copy source="rectangle.vertex2[$n]" assignNames="x" /></p>

    <p><copy source="rectangle.vertices[2][$n]" assignNames="xa" /></p>
    `,
        });

        let t1x = 2,
            t1y = -3;
        let t2x = 3,
            t2y = -3;
        let t3x = 3,
            t3y = 4;
        let t4x = 2,
            t4y = 4;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"]).eq(undefined);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/P4"]).eq(undefined);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/xa"]).eq(undefined);

        await updateMathInputValue({ latex: "1", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs.map((v) => v.tree)).eqls([
            t1x,
            t1y,
        ]);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/P4"]).eq(undefined);
        expect(stateVariables["/x"].stateValues.value.tree).eq(t2x);
        expect(stateVariables["/xa"].stateValues.value.tree).eq(t2x);

        await updateMathInputValue({ latex: "2", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs.map((v) => v.tree)).eqls([
            t2x,
            t2y,
        ]);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/P4"]).eq(undefined);
        expect(stateVariables["/x"].stateValues.value.tree).eq(t2y);
        expect(stateVariables["/xa"].stateValues.value.tree).eq(t2y);

        await updateMathInputValue({ latex: "3", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs.map((v) => v.tree)).eqls([
            t3x,
            t3y,
        ]);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/P4"]).eq(undefined);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/xa"]).eq(undefined);

        await updateMathInputValue({ latex: "4", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs.map((v) => v.tree)).eqls([
            t4x,
            t4y,
        ]);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/P4"]).eq(undefined);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/xa"]).eq(undefined);

        await updateMathInputValue({ latex: "5", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"]).eq(undefined);
        expect(stateVariables["/P2"]).eq(undefined);
        expect(stateVariables["/P3"]).eq(undefined);
        expect(stateVariables["/P4"]).eq(undefined);
        expect(stateVariables["/x"]).eq(undefined);
        expect(stateVariables["/xa"]).eq(undefined);
    });

    it("draggable, vertices draggable", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <rectangle vertices="(1,3) (5,7)" name="p" draggable="$draggable" verticesDraggable="$verticesDraggable" />
  </graph>
  <p>draggable: <booleanInput name="draggable" /></p>
  <p>vertices draggable: <booleanInput name="verticesDraggable" /></p>
  `,
        });

        async function check_items(
            v1: number[],
            v3: number[],
            draggable: boolean,
            verticesDraggable: boolean,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/p"].stateValues.vertices[0].map((v) => v.tree),
            ).eqls(v1);
            expect(
                stateVariables["/p"].stateValues.vertices[2].map((v) => v.tree),
            ).eqls(v3);
            expect(stateVariables["/p"].stateValues.draggable).eq(draggable);
            expect(stateVariables["/p"].stateValues.verticesDraggable).eq(
                verticesDraggable,
            );
        }

        let v1 = [1, 3];
        let v3 = [5, 7];
        let draggable = false;
        let verticesDraggable = false;

        await check_items(v1, v3, draggable, verticesDraggable);

        // cannot move single vertex
        await movePolygon({ name: "/p", pointCoords: { 0: [4, 7] }, core });
        await check_items(v1, v3, draggable, verticesDraggable);

        // cannot move all vertices
        await movePolygon({
            name: "/p",
            pointCoords: [
                [4, 7],
                [8, 10],
                [1, 9],
                [3, 2],
            ],
            core,
        });
        await check_items(v1, v3, draggable, verticesDraggable);

        // only vertices draggable
        verticesDraggable = true;
        await updateBooleanInputValue({
            boolean: verticesDraggable,
            name: "/verticesDraggable",
            core,
        });

        // can move single vertex
        v1 = [4, 7];
        await movePolygon({ name: "/p", pointCoords: { 0: v1 }, core });
        await check_items(v1, v3, draggable, verticesDraggable);

        // cannot move all vertices
        await movePolygon({
            name: "/p",
            pointCoords: [
                [3, 8],
                [8, 10],
                [1, 9],
                [3, 2],
            ],
            core,
        });
        await check_items(v1, v3, draggable, verticesDraggable);

        // vertices and polygon draggable
        draggable = true;
        await updateBooleanInputValue({
            boolean: draggable,
            name: "/draggable",
            core,
        });

        // can move single vertex
        v3 = [-3, 2];
        await movePolygon({ name: "/p", pointCoords: { 2: v3 }, core });
        await check_items(v1, v3, draggable, verticesDraggable);

        // can move all vertices
        v1 = [3, 8];
        v3 = [5, 1];
        await movePolygon({
            name: "/p",
            pointCoords: [
                [3, 8],
                [5, 8],
                [5, 1],
                [3, 1],
            ],
            core,
        });
        await check_items(v1, v3, draggable, verticesDraggable);

        // polygon but not vertices draggable
        verticesDraggable = false;
        await updateBooleanInputValue({
            boolean: verticesDraggable,
            name: "/verticesDraggable",
            core,
        });

        // cannot move single vertex
        await movePolygon({ name: "/p", pointCoords: { 2: [9, 3] }, core });
        await check_items(v1, v3, draggable, verticesDraggable);

        // can move all vertices
        v1 = [-4, 1];
        v3 = [3, 7];
        await movePolygon({
            name: "/p",
            pointCoords: [
                [-4, 1],
                [3, 1],
                [3, 7],
                [-4, 7],
            ],
            core,
        });
        await check_items(v1, v3, draggable, verticesDraggable);
    });

    it("single vertex constrained to grid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(1,3)
      <constraints>
         <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>
    <rectangle vertices="$P" name="p" />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 4]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([1, 5]);

        // move rectangle
        await movePolygon({
            name: "/p",
            pointCoords: [
                [8, 9],
                [9, 9],
                [9, 10],
                [8, 10],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([9, 10]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([10, 11]);
    });

    it("two vertices, first vertex constrained to grid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(1,3)
      <constraints>
         <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>
    <point name="Q">(6,5)</point>
    <rectangle vertices="$P $Q" name="p" />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 4]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([6, 5]);

        // move rectangle
        await movePolygon({
            name: "/p",
            pointCoords: [
                [-8, -9],
                [-2, -9],
                [-2, -8],
                [-8, -8],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([-9, -8]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([-3, -7]);
    });

    it("center and vertex, vertex constrained to grid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(1,3)
      <constraints>
         <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>
    <point name="Q">(6,5)</point>
    <rectangle vertices="$P" center="$Q" name="p" />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 4]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([12, 6]);

        // move rectangle
        await movePolygon({
            name: "/p",
            pointCoords: [
                [-8, -9],
                [4, -9],
                [4, -7],
                [-8, -7],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([-9, -8]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([3, -6]);
    });

    it("center and vertex, center constrained to grid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(1,3)</point>
    <point name="Q">(6,5)
      <constraints>
        <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>
    <rectangle vertices="$P" center="$Q" name="p" />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([1, 3]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([11, 9]);

        // move rectangle
        await movePolygon({
            name: "/p",
            pointCoords: [
                [-9, -8],
                [1, -8],
                [1, -2],
                [-9, -2],
            ],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/p"].stateValues.vertices[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([-8, -7]);
        expect(
            stateVariables["/p"].stateValues.vertices[2].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([2, -1]);
    });

    it("area and perimeter", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <rectangle name="r"/>
  </graph>
  <p>Area: <number copySource="r.area" name="area" /></p>
  <p>Perimeter: <number copySource="r.perimeter" name="perimeter" /></p>
  `,
        });

        let area = 1;
        let perimeter = 4;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/area"].stateValues.value).eq(area);
        expect(stateVariables["/perimeter"].stateValues.value).eq(perimeter);

        await movePolygon({
            name: "/r",
            pointCoords: { 1: [9, -3] },
            core,
        });

        area = 9 * 4;
        perimeter = 2 * 9 + 2 * 4;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/area"].stateValues.value).eq(area);
        expect(stateVariables["/perimeter"].stateValues.value).eq(perimeter);
    });
});

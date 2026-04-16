import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function getPolygonVerticesAndCenter(core: any, componentIdx: number) {
    const stateVariables = await core.returnAllStateVariables(false, true);
    const polygonState = stateVariables[componentIdx].stateValues;

    const vertices = polygonState.vertices.map((vertex: any[]) =>
        vertex.map((x) => x.evaluate_to_constant()),
    );
    const center = polygonState.center.map((x) => x.evaluate_to_constant());

    return { vertices, center, polygonState };
}

describe("Polyline/Polygon/Triangle center actions @group2", async () => {
    it("polyline center matches dimensionality and translates all coordinates", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <polyline name="pl" vertices="(0,0,0) (4,0,2)" />
  </graph>
  `,
        });

        const plIdx = await resolvePathToNodeIdx("pl");

        let { vertices, center } = await getPolygonVerticesAndCenter(
            core,
            plIdx,
        );
        expect(vertices).eqls([
            [0, 0, 0],
            [4, 0, 2],
        ]);
        expect(center).eqls([2, 0, 1]);

        await core.requestAction({
            componentIdx: plIdx,
            actionName: "movePolylineCenter",
            args: { center: [5, 3, 7] },
        });

        ({ vertices, center } = await getPolygonVerticesAndCenter(core, plIdx));
        expect(vertices).eqls([
            [3, 3, 6],
            [7, 3, 8],
        ]);
        expect(center).eqls([5, 3, 7]);
    });

    it("polygon has center and movePolygonCenter translates vertices", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <polygon name="pg" vertices="(0,0) (4,0) (4,2) (0,2)" />
  </graph>
  <graph name="g2">
    <polygon extend="$g1.pg" name="pg" />
  </graph>
  `,
        });

        const sourceIdx = await resolvePathToNodeIdx("g1.pg");
        const copyIdx = await resolvePathToNodeIdx("g2.pg");

        let { vertices, center } = await getPolygonVerticesAndCenter(
            core,
            sourceIdx,
        );

        expect(vertices).eqls([
            [0, 0],
            [4, 0],
            [4, 2],
            [0, 2],
        ]);
        expect(center).eqls([2, 1]);

        await core.requestAction({
            componentIdx: sourceIdx,
            actionName: "movePolygonCenter",
            args: { center: [5, -3] },
        });

        ({ vertices, center } = await getPolygonVerticesAndCenter(
            core,
            sourceIdx,
        ));
        expect(vertices).eqls([
            [3, -4],
            [7, -4],
            [7, -2],
            [3, -2],
        ]);
        expect(center).eqls([5, -3]);

        const copied = await getPolygonVerticesAndCenter(core, copyIdx);
        expect(copied.vertices).eqls(vertices);
        expect(copied.center).eqls(center);
    });

    it("movePolygonCenter ignores malformed center payloads", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <polygon name="pg" vertices="(0,0) (4,0) (4,2) (0,2)" />
  </graph>
  `,
        });

        const pgIdx = await resolvePathToNodeIdx("pg");

        await core.requestAction({
            componentIdx: pgIdx,
            actionName: "movePolygonCenter",
            args: { center: [5, -3, 99] },
        });

        const { vertices, center } = await getPolygonVerticesAndCenter(
            core,
            pgIdx,
        );
        expect(vertices).eqls([
            [0, 0],
            [4, 0],
            [4, 2],
            [0, 2],
        ]);
        expect(center).eqls([2, 1]);
    });

    it("polygon center remains symbolic when vertices are symbolic", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="a">a</math>
  <graph>
    <polygon name="pg" vertices="($a,0) (2,2) (4,0)" />
  </graph>
  `,
        });

        const pgIdx = await resolvePathToNodeIdx("pg");
        const { polygonState } = await getPolygonVerticesAndCenter(core, pgIdx);

        expect(JSON.stringify(polygonState.center[0].tree)).contain("a");
        expect(polygonState.center[1].evaluate_to_constant()).closeTo(
            2 / 3,
            1e-12,
        );
    });

    it("moveTriangleCenter updates triangle center and vertices", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <triangle name="tri" vertices="(0,0) (6,0) (0,3)" />
  </graph>
  `,
        });

        const triIdx = await resolvePathToNodeIdx("tri");

        let { vertices, center } = await getPolygonVerticesAndCenter(
            core,
            triIdx,
        );
        expect(vertices).eqls([
            [0, 0],
            [6, 0],
            [0, 3],
        ]);
        expect(center).eqls([2, 1]);

        await core.requestAction({
            componentIdx: triIdx,
            actionName: "moveTriangleCenter",
            args: { center: [4, 5] },
        });

        ({ vertices, center } = await getPolygonVerticesAndCenter(
            core,
            triIdx,
        ));
        expect(vertices).eqls([
            [2, 4],
            [8, 4],
            [2, 7],
        ]);
        expect(center).eqls([4, 5]);
    });

    it("movePolygonCenter preserves rigid translation with constrained vertices", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)
      <constrainToGrid dx="3" dy="4" />
    </point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  `,
        });

        const pgIdx = await resolvePathToNodeIdx("pg");

        let { vertices, center } = await getPolygonVerticesAndCenter(
            core,
            pgIdx,
        );
        expect(vertices).eqls([
            [3, 5],
            [-4, -1],
            [6, 4],
            [-3, 4],
        ]);
        expect(center).eqls([0.5, 3]);

        await core.requestAction({
            componentIdx: pgIdx,
            actionName: "movePolygonCenter",
            args: { center: [4.5, 6] },
        });

        ({ vertices, center } = await getPolygonVerticesAndCenter(core, pgIdx));
        // Constrained vertex snaps to the grid, so the rigid-translation correction
        // applies the same adjusted offset to the other vertices.
        expect(vertices).eqls([
            [6, 9],
            [-1, 3],
            [9, 8],
            [0, 8],
        ]);
        expect(center).eqls([3.5, 7]);
    });
});

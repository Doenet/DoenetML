import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";
import {
    movePoint,
    moveRay,
    moveVector,
    updateMathInputValue,
} from "../utils/actions";

/**
 * Note: Many of these tests are closely mirrored in the <vector> tests.
 */

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Ray Tag Tests", function () {
    /**
     * Copied from vector tests
     * @param h through
     * @param t endpoint
     * @param d direction
     */
    function check_ray_htd({
        componentIdx,
        h,
        t,
        d,
        stateVariables,
    }: {
        componentIdx: number;
        h: number[];
        t: number[];
        d: number[];
        stateVariables: any;
    }) {
        expect(
            stateVariables[componentIdx].stateValues.endpoint.map(
                (x) => x.simplify().tree,
            ),
        ).eqls(t);
        expect(
            stateVariables[componentIdx].stateValues.through.map(
                (x) => x.simplify().tree,
            ),
        ).eqls(h);
        expect(
            stateVariables[componentIdx].stateValues.direction.map(
                (x) => x.simplify().tree,
            ),
        ).eqls(d);
    }

    async function testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx = 0,
        directionEndpointShifty = 0,
        rayName = "ray1",
        endpointName = "endpoint",
        throughName = "through",
        directionName = "direction",
        core,
        resolvePathToNodeIdx,
    }) {
        function check_vec_htd({
            componentIdx,
            h,
            t,
            d,
            stateVariables,
        }: {
            componentIdx: number;
            h: number[];
            t: number[];
            d: number[];
            stateVariables: any;
        }) {
            expect(
                stateVariables[componentIdx].stateValues.tail.map(
                    (x) => x.simplify().tree,
                ),
            ).eqls(t);
            expect(
                stateVariables[componentIdx].stateValues.head.map(
                    (x) => x.simplify().tree,
                ),
            ).eqls(h);
            expect(
                stateVariables[componentIdx].stateValues.displacement.map(
                    (x) => x.simplify().tree,
                ),
            ).eqls(d);
        }

        let directionx = throughx - endpointx;
        let directiony = throughy - endpointy;

        let stateVariables = await core.returnAllStateVariables(false, true);
        check_ray_htd({
            componentIdx: await resolvePathToNodeIdx(rayName),
            h: [throughx, throughy],
            t: [endpointx, endpointy],
            d: [directionx, directiony],
            stateVariables,
        });

        expect(
            stateVariables[
                await resolvePathToNodeIdx(endpointName)
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([endpointx, endpointy]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx(throughName)
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([throughx, throughy]);

        check_vec_htd({
            componentIdx: await resolvePathToNodeIdx(directionName),
            h: [
                directionx + directionEndpointShiftx,
                directiony + directionEndpointShifty,
            ],
            t: [directionEndpointShiftx, directionEndpointShifty],
            d: [directionx, directiony],
            stateVariables,
        });
    }

    async function common_test_process({
        core,
        resolvePathToNodeIdx,
        initialEndpointX = 0,
        initialEndpointY = 0,
        initialThroughX = -4,
        initialThroughY = 2,
        checkLabel = false,
        pointMovesEntireRay = "endpoint",
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        initialEndpointX?: number;
        initialEndpointY?: number;
        initialThroughX?: number;
        initialThroughY?: number;
        checkLabel?: boolean;
        pointMovesEntireRay?: "through" | "endpoint" | "none";
    }) {
        let endpointx = initialEndpointX;
        let endpointy = initialEndpointY;
        let throughx = initialThroughX;
        let throughy = initialThroughY;
        let directionEndpointShiftx = 0;
        let directionEndpointShifty = 0;

        if (checkLabel) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("ray1")].stateValues
                    .label,
            ).eq("\\(\\vec{v}\\)");
        }

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move ray up and to the right
        let moveX = 3;
        let moveY = 2;
        endpointx += moveX;
        throughx += moveX;
        endpointy += moveY;
        throughy += moveY;

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("ray1"),
            endpointcoords: [endpointx, endpointy],
            throughcoords: [throughx, throughy],
        });
        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // moved copied endpoint
        moveX = -8;
        moveY = 4;
        endpointx += moveX;
        endpointy += moveY;
        if (pointMovesEntireRay === "endpoint") {
            throughx += moveX;
            throughy += moveY;
        }
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("endpoint"),
            x: endpointx,
            y: endpointy,
        });
        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move copied through
        moveX = -3;
        moveY = -9;
        throughx += moveX;
        throughy += moveY;
        if (pointMovesEntireRay === "through") {
            endpointx += moveX;
            endpointy += moveY;
        }
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("through"),
            x: throughx,
            y: throughy,
        });
        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move copied direction
        directionEndpointShiftx = -4;
        directionEndpointShifty = -5;

        let directionx = 2;
        let directiony = -3;

        if (pointMovesEntireRay === "through") {
            endpointx = throughx - directionx;
            endpointy = throughy - directiony;
        } else {
            throughx = endpointx + directionx;
            throughy = endpointy + directiony;
        }
        let directionthroughx = directionEndpointShiftx + directionx;
        let directionthroughy = directionEndpointShifty + directiony;

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("direction"),

            tailcoords: [directionEndpointShiftx, directionEndpointShifty],
            headcoords: [directionthroughx, directionthroughy],
        });

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });
    }

    it("ray with no arguments, through/endpoint/direction copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <ray name="ray1" />
  </graph>
  <graph>
      <point extend="$ray1.endpoint" name="endpoint" />
      <point extend="$ray1.through" name="through" />
      <vector extend="$ray1.direction" name="direction" />
  </grap
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialThroughX: 1,
            initialThroughY: 0,
            initialEndpointX: 0,
            initialEndpointY: 0,
            checkLabel: false,
        });
    });

    it("ray with just label, through/endpoint/direction copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <ray name="ray1"><label><m>\\vec{v}</m></label></ray>
  </graph>
  <graph>
      <point extend="$ray1.endpoint" name="endpoint" />
      <point extend="$ray1.through" name="through" />
      <vector extend="$ray1.direction" name="direction" />
  </graph>
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialThroughX: 1,
            initialThroughY: 0,
            initialEndpointX: 0,
            initialEndpointY: 0,
            checkLabel: true,
        });
    });

    it("ray with just direction, through/endpoint/direction copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <ray name="ray1" direction ="(-4,2)" />
  </graph>

  <graph>
  <point extend="$ray1.endpoint" name="endpoint" />
  <point extend="$ray1.through" name="through" />
  <vector extend="$ray1.direction" name="direction" />
  </graph>
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("ray with just direction and label, through/endpoint/direction copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <ray name="ray1" direction ="(-4,2)" >
    <label><m>\\vec{v}</m></label>
  </ray>
  </graph>

  <graph>
  <point extend="$ray1.endpoint" name="endpoint" />
  <point extend="$ray1.through" name="through" />
  <vector extend="$ray1.direction" name="direction" />
  </graph>
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            checkLabel: true,
        });
    });

    it("ray with direction and endpoint, through/endpoint/direction copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <ray name="ray1" direction="(-8,1)" endpoint="(4,1)" />
  </graph>

  <graph>
  <point extend="$ray1.endpoint" name="endpoint" />
  <point extend="$ray1.through" name="through" />
  <vector extend="$ray1.direction" name="direction" />
  </graph>
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialEndpointX: 4,
            initialEndpointY: 1,
        });
    });

    it("ray with direction and through, through/endpoint/direction copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <ray name="ray1" direction="(-8,1)" through="(-4,2)" />
  </graph>

  <graph>
  <point extend="$ray1.endpoint" name="endpoint" />
  <point extend="$ray1.through" name="through" />
  <vector extend="$ray1.direction" name="direction" />
  </graph>
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialEndpointX: 4,
            initialEndpointY: 1,
            pointMovesEntireRay: "through",
        });
    });

    it("ray with just through, through/endpoint/direction copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <ray name="ray1" through="(-4,2)"/>
  </graph>

  <graph>
  <point extend="$ray1.endpoint" name="endpoint" />
  <point extend="$ray1.through" name="through" />
  <vector extend="$ray1.direction" name="direction" />
  </graph>
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            pointMovesEntireRay: "none",
        });
    });

    it("ray with through and endpoint, through/endpoint/direction copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <ray name="ray1" endpoint="(4,1)" through="(-4,2)" />
  </graph>

  <graph>
  <point extend="$ray1.endpoint" name="endpoint" />
  <point extend="$ray1.through" name="through" />
  <vector extend="$ray1.direction" name="direction" />
  </graph>
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialEndpointX: 4,
            initialEndpointY: 1,
            pointMovesEntireRay: "none",
        });
    });

    it("ray with just endpoint, through/endpoint/direction copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <ray name="ray1" endpoint="(3,4)"/>
  </graph>

  <graph>
  <point extend="$ray1.endpoint" name="endpoint" />
  <point extend="$ray1.through" name="through" />
  <vector extend="$ray1.direction" name="direction" />
  </graph>
 `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialEndpointX: 3,
            initialEndpointY: 4,
            initialThroughX: 4,
            initialThroughY: 4,
        });
    });

    it("copied rays", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <ray name="ray1" endpoint="(-1,2)" through="(-2,3)"/>
    <point name="point1">(-4,7)</point>
    <point name="point2">(3,5)</point>
    <ray name="ray2" endpoint="$point1" through="$point2"/>
    <ray name="ray3" endpoint="(-9,-1)" through="(-3,6)"/>
  </graph>

  <graph name="g2">
    <ray extend="$g1.ray1" name="ray1" />
    <ray extend="$g1.ray2" name="ray2" />
    <ray extend="$g1.ray3" name="ray3" />
  </graph>

  <graph extend="$g2" name="g3" />

  <section name="s">
    <ray extend="$g3.ray1" name="ray1" />
    <ray extend="$g3.ray2" name="ray2" />
    <ray extend="$g3.ray3" name="ray3" />
  </section>
  `,
        });

        // initial state

        let v1tx = -1;
        let v1ty = 2;
        let v1hx = -2;
        let v1hy = 3;
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const ray1s = ["g1.ray1", "g2.ray1", "g3.ray1", "s.ray1"];
            const ray2s = ["g1.ray2", "g2.ray2", "g3.ray2", "s.ray2"];
            const ray3s = ["g1.ray3", "g2.ray3", "g3.ray3", "s.ray3"];
            for (let name of ray1s) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.endpoint.map((v) => v.tree),
                ).eqls([v1tx, v1ty]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.through.map((v) => v.tree),
                ).eqls([v1hx, v1hy]);
            }
            for (let name of ray2s) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.endpoint.map((v) => v.tree),
                ).eqls([v2tx, v2ty]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.through.map((v) => v.tree),
                ).eqls([v2hx, v2hy]);
            }
            for (let name of ray3s) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.endpoint.map((v) => v.tree),
                ).eqls([v3tx, v3ty]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.through.map((v) => v.tree),
                ).eqls([v3hx, v3hy]);
            }
        }
        await check_items();

        // move ray1
        v1tx = 5;
        v1ty = -8;
        v1hx = 4;
        v1hy = -9;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.ray1"),
            endpointcoords: [v1tx, v1ty],
            throughcoords: [v1hx, v1hy],
        });
        await check_items();

        // move ray4
        v1tx = 2;
        v1ty = 6;
        v1hx = -2;
        v1hy = -4;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g2.ray1"),
            endpointcoords: [v1tx, v1ty],
            throughcoords: [v1hx, v1hy],
        });
        await check_items();

        // move ray7
        v1tx = -3;
        v1ty = 9;
        v1hx = 6;
        v1hy = -8;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g3.ray1"),
            endpointcoords: [v1tx, v1ty],
            throughcoords: [v1hx, v1hy],
        });
        await check_items();

        // move ray2
        v2tx = -4;
        v2ty = 7;
        v2hx = 3;
        v2hy = 5;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.ray2"),
            endpointcoords: [v2tx, v2ty],
            throughcoords: [v2hx, v2hy],
        });
        await check_items();

        // move ray5
        v2tx = 6;
        v2ty = -2;
        v2hx = 1;
        v2hy = -7;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g2.ray2"),
            endpointcoords: [v2tx, v2ty],
            throughcoords: [v2hx, v2hy],
        });
        await check_items();

        // move ray8
        v2tx = -3;
        v2ty = -6;
        v2hx = 5;
        v2hy = -9;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g3.ray2"),
            endpointcoords: [v2tx, v2ty],
            throughcoords: [v2hx, v2hy],
        });
        await check_items();

        // move ray3
        v3tx = 6;
        v3ty = -8;
        v3hx = -1;
        v3hy = 0;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.ray3"),
            endpointcoords: [v3tx, v3ty],
            throughcoords: [v3hx, v3hy],
        });
        await check_items();

        // move ray6
        v3tx = 3;
        v3ty = 1;
        v3hx = -7;
        v3hy = -2;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g2.ray3"),
            endpointcoords: [v3tx, v3ty],
            throughcoords: [v3hx, v3hy],
        });
        await check_items();

        // move ray9
        v3tx = -2;
        v3ty = 7;
        v3hx = 5;
        v3hy = -6;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g3.ray3"),
            endpointcoords: [v3tx, v3ty],
            throughcoords: [v3hx, v3hy],
        });
        await check_items();
    });

    it("copied rays and directions", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <ray name="ray1" direction="(1,2)"/>
    </graph>
    <graph>
        <ray extend="$ray1" name="ray2" />
    </graph>
    <graph>
        <vector extend="$ray1.direction" name="dir1" />
    </graph>
    <graph>
        <vector extend="$ray1.direction" name="dir2" />
    </graph>
  `,
        });

        const rays = ["ray1", "ray2"];
        const directions = ["dir1", "dir2"]; // these are <vector>s

        // initial state
        let ray_tx = 0;
        let ray_ty = 0;
        let ray_hx = 1;
        let ray_hy = 2;
        let dtail_xs = [0, 0];
        let dtail_ys = [0, 0];

        async function check_items() {
            let direction_x = ray_hx - ray_tx;
            let direction_y = ray_hy - ray_ty;

            let dhead_xs = dtail_xs.map((x) => x + direction_x);
            let dhead_ys = dtail_ys.map((y) => y + direction_y);

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let name of rays) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.endpoint.map((v) => v.tree),
                ).eqls([ray_tx, ray_ty]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.through.map((v) => v.tree),
                ).eqls([ray_hx, ray_hy]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.direction.map((v) => v.tree),
                ).eqls([direction_x, direction_y]);
            }

            for (let i = 0; i < directions.length; i++) {
                let name = directions[i];
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.tail.map((v) => v.tree),
                ).eqls([dtail_xs[i], dtail_ys[i]]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.head.map((v) => v.tree),
                ).eqls([dhead_xs[i], dhead_ys[i]]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.displacement.map((v) => v.tree),
                ).eqls([direction_x, direction_y]);
            }
        }
        await check_items();

        // move each ray
        let txs = [-4, 7];
        let tys = [9, 3];
        let hxs = [6, -2];
        let hys = [5, 0];

        for (let i = 0; i < rays.length; i++) {
            ray_tx = txs[i];
            ray_ty = tys[i];
            ray_hx = hxs[i];
            ray_hy = hys[i];
            await moveRay({
                core,
                componentIdx: await resolvePathToNodeIdx(rays[i]),
                endpointcoords: [ray_tx, ray_ty],
                throughcoords: [ray_hx, ray_hy],
            });
            await check_items();
        }

        // move each direction
        ray_tx = 7;
        ray_ty = 3;
        txs = [7, 0];
        tys = [-3, 4];
        hxs = [8, -7];
        hys = [-2, 1];

        for (let i = 0; i < 2; i++) {
            let direction_x = hxs[i] - txs[i];
            let direction_y = hys[i] - tys[i];
            dtail_xs[i] = txs[i];
            dtail_ys[i] = tys[i];
            let dthrough_xs = dtail_xs.map((x) => x + direction_x);
            let dthrough_ys = dtail_ys.map((y) => y + direction_y);
            ray_hx = ray_tx + direction_x;
            ray_hy = ray_ty + direction_y;

            await moveVector({
                core,
                componentIdx: await resolvePathToNodeIdx(directions[i]),
                tailcoords: [dtail_xs[i], dtail_ys[i]],
                headcoords: [dthrough_xs[i], dthrough_ys[i]],
            });
            await check_items();
        }
    });

    it("constrain to ray", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="point1">(1,2)</point>
  <point name="point2">(3,4)</point>
  <ray name="ray1" endpoint="$point1" through="$point2" />

  <point name="point3" x="-5" y="2">
      <constrainTo>$ray1</constrainTo>
  </point>
  </graph>
  `,
        });

        // check initial values
        let hx = 3;
        let hy = 4;
        let tx = 1;
        let ty = 2;
        let px = 1;
        let py = 2;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([tx, ty]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([hx, hy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("point3")].stateValues
                    .xs[0].tree,
            ).closeTo(px, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("point3")].stateValues
                    .xs[1].tree,
            ).closeTo(py, 1e-12);
        }
        await check_items();

        // move ray to 45 degrees
        tx = -4;
        ty = 4;
        hx = 4;
        hy = -4;
        let pxOrig = -5;
        let pyOrig = 2;
        function calc_snap_45_deg(pxOrig, pyOrig) {
            let temp = (pxOrig - pyOrig) / 2;
            temp = Math.max(-4, temp); // No upper bound since ray continues
            const px = temp;
            const py = -temp;
            return [px, py];
        }
        [px, py] = calc_snap_45_deg(pxOrig, pyOrig);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("ray1"),
            endpointcoords: [tx, ty],
            throughcoords: [hx, hy],
        });
        await check_items();

        // move point
        pxOrig = 10;
        pyOrig = 1;
        [px, py] = calc_snap_45_deg(pxOrig, pyOrig);
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: pxOrig,
            y: pyOrig,
        });
        await check_items();

        // move point
        pxOrig = 9;
        pyOrig = 7;
        [px, py] = calc_snap_45_deg(pxOrig, pyOrig);
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: pxOrig,
            y: pyOrig,
        });
        await check_items();

        // move point
        pxOrig = -9;
        pyOrig = 7;
        [px, py] = calc_snap_45_deg(pxOrig, pyOrig);
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: pxOrig,
            y: pyOrig,
        });
        await check_items();
    });

    it("attract to ray", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="point1">(1,2)</point>
  <point name="point2">(3,4)</point>
  <ray name="ray1" endpoint="$point1" through="$point2" />

  <point name="point3" x="-5" y="2">
      <attractTo>$ray1</attractTo>
  </point>
  </graph>
  `,
        });

        // check initial values
        let tx = 1;
        let ty = 2;
        let hx = 3;
        let hy = 4;
        let px = -5;
        let py = 2;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([tx, ty]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([hx, hy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("point3")].stateValues
                    .xs[0].tree,
            ).closeTo(px, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("point3")].stateValues
                    .xs[1].tree,
            ).closeTo(py, 1e-12);
        }
        await check_items();

        // move ray to 45 degrees
        tx = -4;
        ty = 4;
        hx = 4;
        hy = -4;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("ray1"),
            endpointcoords: [tx, ty],
            throughcoords: [hx, hy],
        });
        await check_items();

        // move point
        let pxOrig = 3.3;
        let pyOrig = -3.6;

        function calc_snap_45_deg(pxOrig, pyOrig) {
            let temp = (pxOrig - pyOrig) / 2;
            temp = Math.max(-4, temp); // No upper bound since ray continues
            const px = temp;
            const py = -temp;
            return [px, py];
        }
        [px, py] = calc_snap_45_deg(pxOrig, pyOrig);

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: pxOrig,
            y: pyOrig,
        });
        await check_items();

        // move point past through point, should still snap
        pxOrig = 4.3;
        pyOrig = -4.6;
        [px, py] = calc_snap_45_deg(pxOrig, pyOrig);
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: pxOrig,
            y: pyOrig,
        });
        await check_items();

        // move point
        pxOrig = -2.4;
        pyOrig = 2.8;
        [px, py] = calc_snap_45_deg(pxOrig, pyOrig);
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: pxOrig,
            y: pyOrig,
        });
        await check_items();
        // move point

        pxOrig = -4.2;
        pyOrig = 4.3;
        [px, py] = calc_snap_45_deg(pxOrig, pyOrig);
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: pxOrig,
            y: pyOrig,
        });
        await check_items();

        // move point
        pxOrig = -4.4;
        pyOrig = 4.5;
        px = pxOrig;
        py = pyOrig;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: pxOrig,
            y: pyOrig,
        });
        await check_items();
    });

    it("constrain to ray, different scales from graph", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
        <ray name="l" through="(-1,-0.05)" endpoint="(1,0.05)"/>
        <point name="P" x="100" y="0" >
            <constrainTo relativeToGraphScales>$l</constrainTo>
        </point>
    </graph>
  `,
        });

        // test initial state
        let stateVariables = await core.returnAllStateVariables(false, true);
        let x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        let y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).greaterThan(0);
        expect(y).lessThan(0.01);
        expect(x).closeTo(20 * y, 1e-10);

        // move point
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -100,
            y: 0.05,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).lessThan(0.05);
        expect(y).greaterThan(0.04);
        expect(x).closeTo(20 * y, 1e-10);

        // move point past end

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -100,
            y: 0.1,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).eq(0.05);
        expect(x).closeTo(20 * y, 1e-10);
    });

    it("two update paths through rays", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="zeroFixed" fixed>(0,0)</point>
    <mathInput name="a" prefill="2" modifyIndirectly="false" />
    <graph>
        <ray name="original" endpoint="$zeroFixed" through="(1,3)" />
    </graph>
    <graph>
        <ray name="multiplied" endpoint="$zeroFixed" through="($a$(original.throughX1), $a$(original.throughX2))" />
    </graph>
    `,
        });

        // check initial values
        let ohx = 1;
        let ohy = 3;
        let mhx = 2;
        let mhy = 6;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("original")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([0, 0]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("original")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([ohx, ohy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("multiplied")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([0, 0]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("multiplied")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([mhx, mhy]);
        }
        await check_items();

        // move original ray
        ohx = -5;
        ohy = 1;
        mhx = 2 * ohx;
        mhy = 2 * ohy;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("original"),
            throughcoords: [ohx, ohy],
        });
        await check_items();

        // move multiplied ray
        mhx = 6;
        mhy = -8;
        ohx = mhx / 2;
        ohy = mhy / 2;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("multiplied"),
            throughcoords: [mhx, mhy],
        });
        await check_items();

        // Change factor
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("a"),
            latex: "-3",
            core,
        });
        mhx = -3 * ohx;
        mhy = -3 * ohy;
        await check_items();

        // move multiplied ray again
        mhx = -6;
        mhy = -3;
        ohx = mhx / -3;
        ohy = mhy / -3;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("multiplied"),
            throughcoords: [-6, -3],
        });
        await check_items();
    });

    it("display ray sum triangle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <ray name="u" through="(1,1)" />
        <ray name="v" endpoint="$(u.through)" direction="(1,3)" />
        <ray name="w" through="$(v.through)" endpoint="$(u.endpoint)" />
    </graph>
  `,
        });

        let uEndpoint = [0, 0];
        let u = [1, 1];
        let v = [1, 3];
        let uThrough = u.map((x, i) => x + uEndpoint[i]);
        let vEndpoint = uThrough;
        let vThrough = v.map((x, i) => x + vEndpoint[i]);
        let w = u.map((x, i) => x + v[i]);
        let wEndpoint = uEndpoint;
        let wThrough = w.map((x, i) => x + wEndpoint[i]);

        // check initial values

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("u")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([...uEndpoint]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("u")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([...uThrough]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("u")
                ].stateValues.direction.map((v) => v.tree),
            ).eqls([...u]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([...vEndpoint]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([...vThrough]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.direction.map((v) => v.tree),
            ).eqls([...v]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("w")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([...wEndpoint]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("w")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([...wThrough]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("w")
                ].stateValues.direction.map((v) => v.tree),
            ).eqls([...w]);
        }
        await check_items();

        // moving endpoint of v just moves through of u
        vEndpoint = [-3, 2];
        uThrough = vEndpoint;
        u = uThrough.map((x, i) => x - uEndpoint[i]);
        v = vThrough.map((x, i) => x - vEndpoint[i]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v"),
            endpointcoords: vEndpoint,
        });
        await check_items();

        // moving through of u keeps v direction fixed
        uThrough = [7, 1];
        vEndpoint = uThrough;
        u = uThrough.map((x, i) => x - uEndpoint[i]);
        vThrough = v.map((x, i) => x + vEndpoint[i]);
        w = u.map((x, i) => x + v[i]);
        wEndpoint = uEndpoint;
        wThrough = w.map((x, i) => x + wEndpoint[i]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("u"),
            throughcoords: uThrough,
        });
        await check_items();

        // moving endpoint of u moves endpoint of w
        uEndpoint = [3, 4];
        u = uThrough.map((x, i) => x - uEndpoint[i]);
        w = u.map((x, i) => x + v[i]);
        wEndpoint = uEndpoint;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("u"),
            endpointcoords: uEndpoint,
        });
        await check_items();

        // moving endpoint of w moves endpoint of u
        wEndpoint = [-1, 7];
        uEndpoint = wEndpoint;
        u = uThrough.map((x, i) => x - uEndpoint[i]);
        w = u.map((x, i) => x + v[i]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("w"),
            endpointcoords: wEndpoint,
        });
        await check_items();

        // moving through of w moves through of v
        wThrough = [-5, -4];
        vThrough = wThrough;
        v = vThrough.map((x, i) => x - vEndpoint[i]);
        w = u.map((x, i) => x + v[i]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("w"),
            throughcoords: wThrough,
        });
        await check_items();

        // moving through of v moves through of w
        vThrough = [4, -7];
        wThrough = vThrough;
        v = vThrough.map((x, i) => x - vEndpoint[i]);
        w = u.map((x, i) => x + v[i]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v"),
            throughcoords: vThrough,
        });
        await check_items();
    });

    it("combining components of through and endpoint through copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <ray name="v" endpoint="(1,2)" through="(-2,3)" />
  <point extend="$v.through" name="vh" />
  <point extend="$v.endpoint" name="vt" />
  <point name="c" x="$(vh.x)" y="$(vt.y)"/>
  </graph>
  `,
        });

        let tx = 1;
        let ty = 2;
        let hx = -2;
        let hy = 3;

        // initial positions

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([tx, ty]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([hx, hy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.direction.map((v) => v.tree),
            ).eqls([hx - tx, hy - ty]);

            expect(
                stateVariables[await resolvePathToNodeIdx("vt")].stateValues
                    .coords.tree,
            ).eqls(["vector", tx, ty]);
            expect(
                stateVariables[await resolvePathToNodeIdx("vh")].stateValues
                    .coords.tree,
            ).eqls(["vector", hx, hy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .coords.tree,
            ).eqls(["vector", hx, ty]);
        }
        await check_items();

        // move ray 1
        tx = 3;
        ty = -1;
        hx = -4;
        hy = 7;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v"),
            throughcoords: [hx, hy],
            endpointcoords: [tx, ty],
        });
        await check_items();

        // move through point
        hx = 2;
        hy = 9;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("vh"),
            x: hx,
            y: hy,
        });
        await check_items();

        // move endpoint point
        tx = -3;
        ty = 10;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("vt"),
            x: tx,
            y: ty,
        });
        await check_items();

        // move combined point
        hx = -6;
        ty = 0;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("c"),
            x: hx,
            y: ty,
        });
        await check_items();
    });

    it("updates depending on ray definition", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
    <point name="tvt">(1,2)</point>
    <point name="hvh">(-3,4)</point>
    <point name="dvd">(-5,-6)</point>
    <point name="tvth">(7,-8)</point>
    <point name="hvth">(-1,-2)</point>
    <point name="tvtd">(3,-4)</point>
    <point name="dvtd">(5,6)</point>
    <point name="hvhd">(-7,8)</point>
    <point name="dvhd">(9,10)</point>
</graph>

<graph>
    <ray name="vt" endpoint="$tvt" />
    <ray name="vh" through="$hvh" />
    <ray name="vd" direction="$dvd" />
    <ray name="vth" endpoint="$tvth" through="$hvth" />
    <ray name="vtd" endpoint="$tvtd" direction="$dvtd" />
    <ray name="vhd" through="$hvhd" direction="$dvhd" />
</graph>

<graph>
    <point extend="$vt.endpoint" name="tfvt" />
    <point extend="$vt.through" name="hfvt" />
    <vector extend="$vt.direction" name="dfvt" />

    <point extend="$vh.endpoint" name="tfvh" />
    <point extend="$vh.through" name="hfvh" />
    <vector extend="$vh.direction" name="dfvh" />

    <point extend="$vd.endpoint" name="tfvd" />
    <point extend="$vd.through" name="hfvd" />
    <vector extend="$vd.direction" name="dfvd" />

    <point extend="$vth.endpoint" name="tfvth" />
    <point extend="$vth.through" name="hfvth" />
    <vector extend="$vth.direction" name="dfvth" />

    <point extend="$vtd.endpoint" name="tfvtd" />
    <point extend="$vtd.through" name="hfvtd" />
    <vector extend="$vtd.direction" name="dfvtd" />

    <point extend="$vhd.endpoint" name="tfvhd" />
    <point extend="$vhd.through" name="hfvhd" />
    <vector extend="$vhd.direction" name="dfvhd" />
</graph>

<graph>
    <ray extend="$vt" name="vt2" />
    <ray extend="$vh" name="vh2" />
    <ray extend="$vd" name="vd2" />
    <ray extend="$vth" name="vth2" />
    <ray extend="$vtd" name="vtd2" />
    <ray extend="$vhd" name="vhd2" />
</graph>

<graph>
    <point extend="$vt2.endpoint" name="tfvt2" />
    <point extend="$vt2.through" name="hfvt2" />
    <vector extend="$vt2.direction" name="dfvt2" />

    <point extend="$vh2.endpoint" name="tfvh2" />
    <point extend="$vh2.through" name="hfvh2" />
    <vector extend="$vh2.direction" name="dfvh2" />

    <point extend="$vd2.endpoint" name="tfvd2" />
    <point extend="$vd2.through" name="hfvd2" />
    <vector extend="$vd2.direction" name="dfvd2" />

    <point extend="$vth2.endpoint" name="tfvth2" />
    <point extend="$vth2.through" name="hfvth2" />
    <vector extend="$vth2.direction" name="dfvth2" />

    <point extend="$vtd2.endpoint" name="tfvtd2" />
    <point extend="$vtd2.through" name="hfvtd2" />
    <vector extend="$vtd2.direction" name="dfvtd2" />

    <point extend="$vhd2.endpoint" name="tfvhd2" />
    <point extend="$vhd2.through" name="hfvhd2" />
    <vector extend="$vhd2.direction" name="dfvhd2" />
</graph>
  `,
        });

        let tvt = [1, 2];
        let hvt = [2, 2];

        let hvh = [-3, 4];
        let tvh = [0, 0];

        let dvd = [-5, -6];
        let tvd = [0, 0];

        let tvth = [7, -8];
        let hvth = [-1, -2];

        let tvtd = [3, -4];
        let dvtd = [5, 6];

        let hvhd = [-7, 8];
        let dvhd = [9, 10];

        let dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        let dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        let hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        let dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        let hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];
        let tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        // Initial configuration

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            async function check_vec_coords(name: string, coords: number[]) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.coords.simplify().tree,
                ).eqls(["vector", ...coords]);
            }

            async function check_vec_disp(name: string, disp: number[]) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.displacement.map((x) => x.simplify().tree),
                ).eqls(disp);
            }

            await check_vec_coords("tvt", tvt);
            await check_vec_coords("hvh", hvh);
            await check_vec_coords("dvd", dvd);
            await check_vec_coords("tvth", tvth);
            await check_vec_coords("hvth", hvth);
            await check_vec_coords("tvtd", tvtd);
            await check_vec_coords("dvtd", dvtd);
            await check_vec_coords("hvhd", hvhd);
            await check_vec_coords("dvhd", dvhd);

            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vt"),
                t: tvt,
                h: hvt,
                d: dvt,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vh"),
                t: tvh,
                h: hvh,
                d: dvh,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vd"),
                t: tvd,
                h: hvd,
                d: dvd,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vth"),
                t: tvth,
                h: hvth,
                d: dvth,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vtd"),
                t: tvtd,
                h: hvtd,
                d: dvtd,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vhd"),
                t: tvhd,
                h: hvhd,
                d: dvhd,
                stateVariables,
            });

            await check_vec_coords("tfvt", tvt);
            await check_vec_coords("hfvt", hvt);
            await check_vec_disp("dfvt", dvt);

            await check_vec_coords("tfvh", tvh);
            await check_vec_coords("hfvh", hvh);
            await check_vec_disp("dfvh", dvh);

            await check_vec_coords("tfvd", tvd);
            await check_vec_coords("hfvd", hvd);
            await check_vec_disp("dfvd", dvd);

            await check_vec_coords("tfvth", tvth);
            await check_vec_coords("hfvth", hvth);
            await check_vec_disp("dfvth", dvth);

            await check_vec_coords("tfvtd", tvtd);
            await check_vec_coords("hfvtd", hvtd);
            await check_vec_disp("dfvtd", dvtd);

            await check_vec_coords("tfvhd", tvhd);
            await check_vec_coords("hfvhd", hvhd);
            await check_vec_disp("dfvhd", dvhd);

            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vt2"),
                t: tvt,
                h: hvt,
                d: dvt,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vh2"),
                t: tvh,
                h: hvh,
                d: dvh,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vd2"),
                t: tvd,
                h: hvd,
                d: dvd,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vth2"),
                t: tvth,
                h: hvth,
                d: dvth,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vtd2"),
                t: tvtd,
                h: hvtd,
                d: dvtd,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("vhd2"),
                t: tvhd,
                h: hvhd,
                d: dvhd,
                stateVariables,
            });

            await check_vec_coords("tfvt2", tvt);
            await check_vec_coords("hfvh2", hvh);
            await check_vec_disp("dfvh2", dvh);

            await check_vec_coords("tfvh2", tvh);
            await check_vec_coords("hfvh2", hvh);
            await check_vec_disp("dfvh2", dvh);

            await check_vec_coords("tfvd2", tvd);
            await check_vec_coords("hfvd2", hvd);
            await check_vec_disp("dfvd2", dvd);

            await check_vec_coords("tfvth2", tvth);
            await check_vec_coords("hfvth2", hvth);
            await check_vec_disp("dfvth2", dvth);

            await check_vec_coords("tfvtd2", tvtd);
            await check_vec_coords("hfvtd2", hvtd);
            await check_vec_disp("dfvtd2", dvtd);

            await check_vec_coords("tfvhd2", tvhd);
            await check_vec_coords("hfvhd2", hvhd);
            await check_vec_disp("dfvhd2", dvhd);
        }

        await check_items();

        // move endpoint of each ray directly
        tvt = [-3, 5];
        tvh = [9, -2];
        tvd = [0, 7];
        tvth = [-7, 4];
        tvtd = [5, -9];
        tvhd = [-1, -6];

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vt"),
            endpointcoords: tvt,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vh"),
            endpointcoords: tvh,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vd"),
            endpointcoords: tvd,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vth"),
            endpointcoords: tvth,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vtd"),
            endpointcoords: tvtd,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vhd"),
            endpointcoords: tvhd,
        });

        // since moved endpoints directly, throughs stay fixed and direction changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        await check_items();

        // move through of each ray directly
        hvt = [5, -1];
        hvh = [3, -6];
        hvd = [1, -9];
        hvth = [6, 2];
        hvtd = [-6, -4];
        hvhd = [-4, 8];

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vt"),
            throughcoords: hvt,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vh"),
            throughcoords: hvh,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vd"),
            throughcoords: hvd,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vth"),
            throughcoords: hvth,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vtd"),
            throughcoords: hvtd,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vhd"),
            throughcoords: hvhd,
        });

        // since moved throughs directly, endpoints stay fixed and direction changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        await check_items();

        // move endpoint through defining point, if exists
        tvt = [9, -1];
        tvth = [3, -2];
        tvtd = [-1, 5];

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tvt"),
            x: tvt[0],
            y: tvt[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tvth"),
            x: tvth[0],
            y: tvth[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tvtd"),
            x: tvtd[0],
            y: tvtd[1],
        });

        // defined by endpoint/through, through stays fixed and direction changes
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

        // defined by endpoint or endpoint and direction, direction stays fixed and through changes
        hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        await check_items();

        // move through through defining point, if exists
        hvh = [5, 3];
        hvth = [-8, -3];
        hvhd = [7, -6];

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hvh"),
            x: hvh[0],
            y: hvh[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hvth"),
            x: hvth[0],
            y: hvth[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hvhd"),
            x: hvhd[0],
            y: hvhd[1],
        });

        // defined by through only or endpoint/through, endpoint stays fixed and direction changes
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

        // defined by through and direction, direction stays fixed and endpoint changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();

        // change direction through defining point, if exists
        dvd = [-1, -2];
        dvtd = [-6, 8];
        dvhd = [3, -7];

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("dvd"),
            x: dvd[0],
            y: dvd[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("dvtd"),
            x: dvtd[0],
            y: dvtd[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("dvhd"),
            x: dvhd[0],
            y: dvhd[1],
        });

        // defined by direction only or endpoint/direction, endpoint stays fixed and through changes
        hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        // defined by through and direction, through stays fixed and endpoint changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();

        // move endpoint of each ray through copied point
        tvt = [-5, 3];
        tvh = [7, 0];
        tvd = [-2, 1];
        tvth = [8, -8];
        tvtd = [6, 5];
        tvhd = [-3, 4];

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvt"),
            x: tvt[0],
            y: tvt[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvh"),
            x: tvh[0],
            y: tvh[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvd"),
            x: tvd[0],
            y: tvd[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvth"),
            x: tvth[0],
            y: tvth[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvtd"),
            x: tvtd[0],
            y: tvtd[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvhd"),
            x: tvhd[0],
            y: tvhd[1],
        });

        // if defined by through, through stays fixed and direction changes
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        // if not defined by through,
        // direction stays fixed and through changes
        hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
        hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        await check_items();

        // move through of each ray through copied point

        hvt = [-1, -3];
        hvh = [7, -6];
        hvd = [-2, -5];
        hvth = [-3, 8];
        hvtd = [9, 1];
        hvhd = [-4, 4];

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvt"),
            x: hvt[0],
            y: hvt[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvh"),
            x: hvh[0],
            y: hvh[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvd"),
            x: hvd[0],
            y: hvd[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvth"),
            x: hvth[0],
            y: hvth[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvtd"),
            x: hvtd[0],
            y: hvtd[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvhd"),
            x: hvhd[0],
            y: hvhd[1],
        });

        // for most rays, endpoints stay fixed and direction changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];

        // defined by through and direction, direction stays fixed and endpoint changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();

        // change direction of each ray through copied vectors
        dvt = [-9, 0];
        dvh = [-3, -1];
        dvd = [-5, 5];
        dvth = [7, 3];
        dvtd = [9, -8];
        dvhd = [1, 2];

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvt"),
            headcoords: dvt,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvh"),
            headcoords: dvh,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvd"),
            headcoords: dvd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvth"),
            headcoords: dvth,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvtd"),
            headcoords: dvtd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvhd"),
            headcoords: dvhd,
        });

        // for most rays, endpoints stay fixed and through changes
        hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
        hvh = [tvh[0] + dvh[0], tvh[1] + dvh[1]];
        hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        hvth = [tvth[0] + dvth[0], tvth[1] + dvth[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        // defined by through and direction, through stays fixed and endpoint changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();

        // move endpoint of each copied ray directly
        tvt = [1, 8];
        tvh = [-3, 2];
        tvd = [9, -1];
        tvth = [5, -3];
        tvtd = [-4, -8];
        tvhd = [-1, 6];

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vt2"),
            endpointcoords: tvt,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vh2"),
            endpointcoords: tvh,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vd2"),
            endpointcoords: tvd,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vth2"),
            endpointcoords: tvth,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vtd2"),
            endpointcoords: tvtd,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vhd2"),
            endpointcoords: tvhd,
        });

        // since moved endpoints directly, throughs stay fixed and direction changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        await check_items();

        // move through of each copied ray directly
        hvt = [-7, 2];
        hvh = [-2, 9];
        hvd = [0, -3];
        hvth = [6, 1];
        hvtd = [7, 0];
        hvhd = [-8, -4];

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vt2"),
            throughcoords: hvt,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vh2"),
            throughcoords: hvh,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vd2"),
            throughcoords: hvd,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vth2"),
            throughcoords: hvth,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vtd2"),
            throughcoords: hvtd,
        });
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("vhd2"),
            throughcoords: hvhd,
        });

        // since moved throughs directly, endpoints stay fixed and direction changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        await check_items();

        // move endpoint of each copied ray through copied point
        tvt = [1, -1];
        tvh = [9, -9];
        tvd = [-3, 2];
        tvth = [5, 0];
        tvtd = [-1, 7];
        tvhd = [-6, 6];

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvt2"),
            x: tvt[0],
            y: tvt[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvh2"),
            x: tvh[0],
            y: tvh[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvd2"),
            x: tvd[0],
            y: tvd[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvth2"),
            x: tvth[0],
            y: tvth[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvtd2"),
            x: tvtd[0],
            y: tvtd[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tfvhd2"),
            x: tvhd[0],
            y: tvhd[1],
        });

        // if defined by through, through stays fixed and direction changes
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        // if not defined by through,
        // direction stays fixed and through changes
        hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
        hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        await check_items();

        // move through of each copied ray through copied point
        hvt = [-6, -8];
        hvh = [2, -2];
        hvd = [0, 6];
        hvth = [-5, 4];
        hvtd = [3, 8];
        hvhd = [-1, 5];

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvt2"),
            x: hvt[0],
            y: hvt[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvh2"),
            x: hvh[0],
            y: hvh[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvd2"),
            x: hvd[0],
            y: hvd[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvth2"),
            x: hvth[0],
            y: hvth[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvtd2"),
            x: hvtd[0],
            y: hvtd[1],
        });
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("hfvhd2"),
            x: hvhd[0],
            y: hvhd[1],
        });

        // for most rays, endpoints stay fixed and direction changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];

        // defined by through and direction, direction stays fixed and endpoint changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();

        // change direction of each copied ray through copied vectors
        dvt = [-1, 7];
        dvh = [5, 9];
        dvd = [9, 2];
        dvth = [-3, -5];
        dvtd = [9, -4];
        dvhd = [-5, 3];

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvt2"),
            headcoords: dvt,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvh2"),
            headcoords: dvh,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvd2"),
            headcoords: dvd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvth2"),
            headcoords: dvth,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvtd2"),
            headcoords: dvtd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("dfvhd2"),
            headcoords: dvhd,
        });

        // for most rays, endpoints stay fixed and through changes
        hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
        hvh = [tvh[0] + dvh[0], tvh[1] + dvh[1]];
        hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        hvth = [tvth[0] + dvth[0], tvth[1] + dvth[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        // defined by through and direction, through stays fixed and endpoint changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();
    });

    it("three rays with mutual references", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
    <ray name="ray1" through="$ray2.through" endpoint="(1,0)" />
    <ray name="ray2" endpoint="$ray3.endpoint" through="(3,2)" />
    <ray name="ray3" through="$ray1.endpoint" endpoint="(-1,4)" />
</graph>
<point extend="$ray1.through" name="v1h" />
<point extend="$ray1.endpoint" name="v1t" />
<point extend="$ray2.through" name="v2h" />
<point extend="$ray2.endpoint" name="v2t" />
<point extend="$ray3.through" name="v3h" />
<point extend="$ray3.endpoint" name="v3t" />
  `,
        });

        let x1 = 1;
        let y1 = 0;
        let x2 = 3;
        let y2 = 2;
        let x3 = -1;
        let y3 = 4;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray2")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([x3, y3]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray2")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray3")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([x3, y3]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray3")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([x1, y1]);
        }

        // move through of ray 1
        x2 = 7;
        y2 = -3;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v1h"),
            x: x2,
            y: y2,
        });
        await check_items();

        // move endpoint of ray 1
        x1 = -1;
        y1 = -4;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v1t"),
            x: x1,
            y: y1,
        });
        await check_items();

        // move endpoint of ray 2
        x3 = 9;
        y3 = -8;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v2t"),
            x: x3,
            y: y3,
        });
        await check_items();

        // move through of ray 2
        x2 = 3;
        y2 = 2;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v2h"),
            x: x2,
            y: y2,
        });
        await check_items();

        // move through of ray 3
        x1 = -5;
        y1 = 8;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v3h"),
            x: x1,
            y: y1,
        });
        await check_items();

        // move endpoint of ray 3
        x3 = 0;
        y3 = -5;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v3t"),
            x: x3,
            y: y3,
        });
        await check_items();
    });

    it("ray with direction and endpoint, move just endpoint", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <ray name="ray1" direction="(-8,1)" endpoint="(4,1)" />
  </graph>
  `,
        });

        let endpointx = 4;
        let endpointy = 1;
        let throughx = -4;
        let throughy = 2;
        let directionx = throughx - endpointx;
        let directiony = throughy - endpointy;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([endpointx, endpointy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([throughx, throughy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.direction.map((v) => v.tree),
            ).eqls([directionx, directiony]);
        }
        await check_items();

        // move endpoint, make sure through doesn't move
        endpointx = -3;
        endpointy = 7;
        directionx = throughx - endpointx;
        directiony = throughy - endpointy;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("ray1"),
            endpointcoords: [endpointx, endpointy],
        });
        await check_items();
    });

    it("ray with direction and through, move just through", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
    <ray name="ray1" direction="(-8,1)" through="(-4,2)" />
</graph>
<ray extend="$ray1" name="v1a" />
  `,
        });

        let endpointx = 4;
        let endpointy = 1;
        let throughx = -4;
        let throughy = 2;
        let directionx = throughx - endpointx;
        let directiony = throughy - endpointy;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([endpointx, endpointy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([throughx, throughy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.direction.map((v) => v.tree),
            ).eqls([directionx, directiony]);
        }

        await check_items();

        // move through, make sure endpoint doesn't move
        throughx = 3;
        throughy = 5;
        directionx = throughx - endpointx;
        directiony = throughy - endpointy;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("ray1"),
            throughcoords: [throughx, throughy],
        });
        await check_items();
    });

    it("ray with direction, move just endpoint", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <ray name="ray1" direction="(-8,1)" />
  </graph>
  `,
        });

        let endpointx = 0;
        let endpointy = 0;
        let throughx = -8;
        let throughy = 1;
        let directionx = throughx - endpointx;
        let directiony = throughy - endpointy;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.endpoint.map((v) => v.tree),
            ).eqls([endpointx, endpointy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.through.map((v) => v.tree),
            ).eqls([throughx, throughy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("ray1")
                ].stateValues.direction.map((v) => v.tree),
            ).eqls([directionx, directiony]);
        }

        // move endpoint, make sure through doesn't move
        endpointx = -3;
        endpointy = 7;
        directionx = throughx - endpointx;
        directiony = throughy - endpointy;
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("ray1"),
            endpointcoords: [endpointx, endpointy],
        });
        await check_items();
    });

    it("mutual dependence among entire through, endpoint, direction", async () => {
        // this could be made more interesting once have operations on rays
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <ray name="v1" through="$(v1.endpoint)" endpoint="(3,4)" />
  </graph>

  <graph>
    <ray name="v2" through="$(v2.direction)" direction="(3,4)" />
  </graph>

  <graph>
    <ray name="v3" endpoint="$(v3.through)" through="(3,4)" />
  </graph>

  <graph>
    <ray name="v4" endpoint="$(v4.direction)" direction="(3,4)" />
  </graph>

  <graph>
    <ray name="v5" direction="$(v5.through)" through="(3,4)" />
  </graph>

  <graph>
    <ray name="v6" direction="$(v6.endpoint)" endpoint="(3,4)" />
  </graph>
  `,
        });

        async function check_matching_through_endpoint(
            name: string,
            val: number[],
            stateVariables?: any,
        ) {
            let stateVars =
                stateVariables ||
                (await core.returnAllStateVariables(false, true));
            const ZEROS = [0, 0];
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx(name),
                h: val,
                t: val,
                d: ZEROS,
                stateVariables: stateVars,
            });
        }

        async function check_matching_through_disp(
            name: string,
            val: number[],
            stateVariables?: any,
        ) {
            let stateVars =
                stateVariables ||
                (await core.returnAllStateVariables(false, true));
            const ZEROS = [0, 0];
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx(name),
                h: val,
                t: ZEROS,
                d: val,
                stateVariables: stateVars,
            });
        }

        async function check_matching_endpoint_disp(
            name: string,
            val: number[],
            stateVariables?: any,
        ) {
            let stateVars =
                stateVariables ||
                (await core.returnAllStateVariables(false, true));
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx(name),
                h: val.map((v) => 2 * v),
                t: val,
                d: val,
                stateVariables: stateVars,
            });
        }

        // initial values
        let stateVariables = await core.returnAllStateVariables(false, true);
        await check_matching_through_endpoint("v1", [3, 4], stateVariables);
        await check_matching_through_endpoint("v3", [3, 4], stateVariables);
        await check_matching_through_disp("v2", [3, 4], stateVariables);
        await check_matching_through_disp("v5", [3, 4], stateVariables);
        await check_matching_endpoint_disp("v4", [3, 4], stateVariables);
        await check_matching_endpoint_disp("v6", [3, 4], stateVariables);

        // move v1, through and endpoint should match
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v1"),
            throughcoords: [1, 2],
        });
        await check_matching_through_endpoint("v1", [1, 2]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v1"),
            endpointcoords: [-4, 5],
        });
        await check_matching_through_endpoint("v1", [-4, 5]);

        // move v3, through and endpoint should match
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v3"),
            throughcoords: [1, 2],
        });
        await check_matching_through_endpoint("v3", [1, 2]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v3"),
            endpointcoords: [-4, 5],
        });
        await check_matching_through_endpoint("v3", [-4, 5]);

        // move v2, through and direction should match
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v2"),
            throughcoords: [1, 2],
        });
        await check_matching_through_disp("v2", [1, 2]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v2"),
            endpointcoords: [5, 7],
        });
        await check_matching_through_disp("v2", [-4, -5]);

        // move v5, through and direction should match
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v5"),
            throughcoords: [1, 2],
        });
        await check_matching_through_disp("v5", [1, 2]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v5"),
            endpointcoords: [5, 7],
        });
        await check_matching_through_disp("v5", [-4, -5]);

        // move v4, endpoint and direction should match
        // since based on endpoint and direction
        // Ray sets direction to try to keep through in the same place
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v4"),
            throughcoords: [-1, 1],
        });
        await check_matching_endpoint_disp("v4", [-4, -3]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v4"),
            endpointcoords: [-10, -2],
        });
        await check_matching_endpoint_disp("v4", [2, -4]);

        // move v6, endpoint and direction should match
        // since based on endpoint and direction
        // Ray sets direction to try to keep through in the same place
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v6"),
            throughcoords: [-1, 1],
        });
        await check_matching_endpoint_disp("v6", [-4, -3]);
        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("v6"),
            endpointcoords: [-10, -2],
        });
        await check_matching_endpoint_disp("v6", [2, -4]);
    });

    it("ray with no arguments, copy and specify attributes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g0">
    <ray name="v0" />
    <ray extend="$v0" through="(3,4)" name="v1" />
    <ray extend="$v1" endpoint="(-1,0)" name="v2" />
    <ray extend="$v0" endpoint="(2,-6)" name="v3" />
    <ray extend="$v3" direction="(-3,4)" name="v4" />
    <ray extend="$v0" direction="(5,-1)" name="v5" />
    <ray extend="$v5" through="(6,2)" name="v6" />
  </graph>

  <graph extend="$g0" name="g1" />

  <point extend="$g0.v0.endpoint" name="v0t" />
  <point extend="$g0.v0.through" name="v0h" />
  <point extend="$g0.v1.endpoint" name="v1t" />
  <point extend="$g0.v1.through" name="v1h" />
  <point extend="$g0.v2.endpoint" name="v2t" />
  <point extend="$g0.v2.through" name="v2h" />
  <point extend="$g0.v3.endpoint" name="v3t" />
  <point extend="$g0.v3.through" name="v3h" />
  <point extend="$g0.v4.endpoint" name="v4t" />
  <point extend="$g0.v4.through" name="v4h" />
  <point extend="$g0.v5.endpoint" name="v5t" />
  <point extend="$g0.v5.through" name="v5h" />
  <point extend="$g0.v6.endpoint" name="v6t" />
  <point extend="$g0.v6.through" name="v6h" />

  `,
        });

        let endpoints = [
            [0, 0],
            [0, 0],
            [-1, 0],
            [2, -6],
            [2, -6],
            [0, 0],
            [1, 3],
        ];

        let throughs = [
            [1, 0],
            [3, 4],
            [3, 4],
            [3, -6],
            [-1, -2],
            [5, -1],
            [6, 2],
        ];

        let directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 2; j++) {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`g${j}.v${i}`)
                        ].stateValues.endpoint.map((v) => v.tree),
                    ).eqls(endpoints[i]);
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`g${j}.v${i}`)
                        ].stateValues.through.map((v) => v.tree),
                    ).eqls(throughs[i]);
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`g${j}.v${i}`)
                        ].stateValues.direction.map((v) => v.tree),
                    ).eqls(directions[i]);
                }
            }
        }

        // move endpoint of g0/v0

        endpoints[0] = endpoints[1] = endpoints[5] = [3, 5];
        throughs[5] = [
            endpoints[5][0] + directions[5][0],
            endpoints[5][1] + directions[5][1],
        ];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);
        throughs[3] = [
            endpoints[3][0] + directions[0][0],
            endpoints[3][1] + directions[0][1],
        ];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v0"),
            endpointcoords: endpoints[0],
        });
        await check_items();

        // move through of g1/v0

        throughs[0] = [-2, 8];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);
        throughs[3] = [
            endpoints[3][0] + directions[0][0],
            endpoints[3][1] + directions[0][1],
        ];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v0"),
            throughcoords: throughs[0],
        });
        await check_items();

        // move through of g0/v1

        throughs[1] = throughs[2] = [-9, -1];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v1"),
            throughcoords: throughs[1],
        });
        await check_items();

        // move endpoint of g1/v1

        endpoints[0] = endpoints[1] = endpoints[5] = [5, -3];
        throughs[0] = [
            endpoints[0][0] + directions[0][0],
            endpoints[0][1] + directions[0][1],
        ];
        throughs[5] = [
            endpoints[5][0] + directions[5][0],
            endpoints[5][1] + directions[5][1],
        ];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v1"),
            endpointcoords: endpoints[1],
        });
        await check_items();

        // move endpoint of g0/v2

        endpoints[2] = [7, 9];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v2"),
            endpointcoords: endpoints[2],
        });
        await check_items();

        // move through of g1/v2

        throughs[1] = throughs[2] = [8, 4];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v2"),
            throughcoords: throughs[2],
        });
        await check_items();

        // move through of g0/v3

        throughs[3] = [-4, -7];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);
        throughs[0] = [
            endpoints[0][0] + directions[3][0],
            endpoints[0][1] + directions[3][1],
        ];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v3"),
            throughcoords: throughs[3],
        });
        await check_items();

        // move endpoint of g1/v3

        endpoints[3] = endpoints[4] = [-6, 2];
        throughs[4] = [
            endpoints[4][0] + directions[4][0],
            endpoints[4][1] + directions[4][1],
        ];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);
        throughs[0] = [
            endpoints[0][0] + directions[3][0],
            endpoints[0][1] + directions[3][1],
        ];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v3"),
            endpointcoords: endpoints[3],
        });
        await check_items();

        // move endpoint of g0/v4

        endpoints[3] = endpoints[4] = [-2, 3];
        throughs[3] = [
            endpoints[3][0] + directions[3][0],
            endpoints[3][1] + directions[3][1],
        ];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v4"),
            endpointcoords: endpoints[4],
        });
        await check_items();

        // move through of g1/v4

        throughs[4] = [2, 0];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v4"),
            throughcoords: throughs[4],
        });
        await check_items();
        // move through of g0/v5

        throughs[5] = [-9, -8];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);
        endpoints[6] = [
            throughs[6][0] - directions[5][0],
            throughs[6][1] - directions[5][1],
        ];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v5"),
            throughcoords: throughs[5],
        });
        await check_items();

        // move endpoint of g1/v5

        endpoints[0] = endpoints[1] = endpoints[5] = [3, 7];

        throughs[0] = [
            endpoints[0][0] + directions[0][0],
            endpoints[0][1] + directions[0][1],
        ];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);
        endpoints[6] = [
            throughs[6][0] - directions[5][0],
            throughs[6][1] - directions[5][1],
        ];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v5"),
            endpointcoords: endpoints[5],
        });
        await check_items();

        // move endpoint of g0/v6

        endpoints[6] = [8, -7];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);
        throughs[5] = [
            endpoints[5][0] + directions[6][0],
            endpoints[5][1] + directions[6][1],
        ];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v6"),
            endpointcoords: endpoints[6],
        });
        await check_items();

        // move through of g1/v6

        throughs[6] = [9, -5];

        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);
        throughs[5] = [
            endpoints[5][0] + directions[6][0],
            endpoints[5][1] + directions[6][1],
        ];
        directions = throughs.map((v, i) => [
            v[0] - endpoints[i][0],
            v[1] - endpoints[i][1],
        ]);

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v6"),
            throughcoords: throughs[6],
        });
        await check_items();
    });

    it("change ray by binding to values", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <ray name="v" />
  <ray name="v2" extend="$v" />

  <p>
  <mathInput bindValueTo="$v.through" name="mivh" />
  <mathInput bindValueTo="$v.endpoint" name="mivt" />
  <mathInput bindValueTo="$v.direction" name="mivd" />
  </p>

  <p>
  <mathInput bindValueTo="$v2.through" name="miv2h" />
  <mathInput bindValueTo="$v2.endpoint" name="miv2t" />
  <mathInput bindValueTo="$v2.direction" name="miv2d" />
  </p>

  `,
        });

        let t = [0, 0];
        let h = [1, 0];
        let d = [1, 0];

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("v"),
                h,
                t,
                d,
                stateVariables,
            });
            check_ray_htd({
                componentIdx: await resolvePathToNodeIdx("v2"),
                h,
                t,
                d,
                stateVariables,
            });
        }
        await check_items();

        // change through using alt ray
        h = [6, 9];
        d = [6, 9];
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivh"),
            latex: "\\langle 6,9 \\rangle",
            core,
        });
        await check_items();

        // change endpoint using alt ray, shifts entire ray
        t = [-3, 7];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivt"),
            latex: "\\langle -3,7 \\rangle",
            core,
        });
        await check_items();

        // change direction using alt ray, through shifts accordingly
        d = [-4, 1];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivd"),
            latex: "\\langle -4,1 \\rangle",
            core,
        });
        await check_items();

        // cannot change dimnension through direction
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivd"),
            latex: "(9,8,7)",
            core,
        });
        d = [9, 8];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await check_items();

        // cannot change dimnension through endpoint
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivt"),
            latex: "(-5,-6,-7)",
            core,
        });
        t = [-5, -6];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await check_items();

        // cannot change dimnension through through
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivh"),
            latex: "(9,-9,7)",
            core,
        });
        h = [9, -9];
        d[0] = h[0] - t[0];
        d[1] = h[1] - t[1];
        await check_items();

        // cannot change dimnension through copied through
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("miv2h"),
            latex: "(0,1,2,3)",
            core,
        });
        h = [0, 1];
        d[0] = h[0] - t[0];
        d[1] = h[1] - t[1];
        await check_items();

        // cannot change dimnension through copied endpoint
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("miv2t"),
            latex: "\\langle 2, 4, 6, 8 \\rangle",
            core,
        });
        t = [2, 4];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await check_items();

        // cannot change dimnension through copied direction
        // Note: =4 as third component is intentional
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("miv2d"),
            latex: "\\langle -8, -6, =4, -2 \\rangle",
            core,
        });
        d = [-8, -6];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await check_items();
    });

    it("ray with through and endpoint, endpoint constrained to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P">(4,1)
      <constrainToGrid dx="5" dy="3" />
  </point>
  <point name="Q">(-4,2)</point>
  <ray name="ray1" endpoint="$P" through="$Q" />
  </graph>

  <graph>
  <point extend="$ray1.endpoint" name="endpoint" />
  <point extend="$ray1.through" name="through" />
  <vector extend="$ray1.direction" name="direction" />
  </graph>
  `,
        });

        let endpointx = 5;
        let endpointy = 0;
        let throughx = -4;
        let throughy = 2;
        let directionEndpointShiftx = 0;
        let directionEndpointShifty = 0;

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move ray up and to the right

        let moveX = 3;
        let moveY = 2;
        endpointx += moveX;
        throughx += moveX;
        endpointy += moveY;
        throughy += moveY;

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("ray1"),

            endpointcoords: [endpointx, endpointy],
            throughcoords: [throughx, throughy],
        });

        // adjust for constraints
        moveX = 2;
        moveY = 1;
        endpointx += moveX;
        throughx += moveX;
        endpointy += moveY;
        throughy += moveY;

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move copied through

        throughx = -5;
        throughy = 7;

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("through"),
            x: throughx,
            y: throughy,
        });

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move copied endpoint

        endpointx = -3;
        endpointy = -9;

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("endpoint"),
            x: endpointx,
            y: endpointy,
        });

        // adjust for constraints
        endpointx = -5;
        endpointy = -9;

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move copied direction

        directionEndpointShiftx = -4;
        directionEndpointShifty = -5;

        let directionx = 2;
        let directiony = -3;

        throughx = endpointx + directionx;
        throughy = endpointy + directiony;

        let directionthroughx = directionEndpointShiftx + directionx;
        let directionthroughy = directionEndpointShifty + directiony;

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("direction"),

            tailcoords: [directionEndpointShiftx, directionEndpointShifty],
            headcoords: [directionthroughx, directionthroughy],
        });

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });
    });

    it("ray with through and endpoint, through constrained to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P">(4,1)</point>
  <point name="Q">(-4,2)
      <constrainToGrid dx="5" dy="3" />
  </point>
  <ray name="ray1" endpoint="$P" through="$Q" />
  </graph>

  <graph>
  <point extend="$ray1.endpoint" name="endpoint" />
  <point extend="$ray1.through" name="through" />
  <vector extend="$ray1.direction" name="direction" />
  </graph>
  `,
        });

        let endpointx = 4;
        let endpointy = 1;
        let throughx = -5;
        let throughy = 3;
        let directionEndpointShiftx = 0;
        let directionEndpointShifty = 0;

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move ray up and to the right

        let moveX = 3;
        let moveY = 2;
        endpointx += moveX;
        throughx += moveX;
        endpointy += moveY;
        throughy += moveY;

        await moveRay({
            core,
            componentIdx: await resolvePathToNodeIdx("ray1"),

            endpointcoords: [endpointx, endpointy],
            throughcoords: [throughx, throughy],
        });

        // adjust for constraints
        moveX = 2;
        moveY = 1;
        endpointx += moveX;
        throughx += moveX;
        endpointy += moveY;
        throughy += moveY;

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move copied through

        throughx = -5;
        throughy = 7;

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("through"),
            x: throughx,
            y: throughy,
        });

        // adjust for constraints
        throughx = -5;
        throughy = 6;

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move copied endpoint

        endpointx = -3;
        endpointy = -9;

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("endpoint"),
            x: endpointx,
            y: endpointy,
        });

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });

        // move copied direction

        directionEndpointShiftx = -4;
        directionEndpointShifty = -5;

        let directionx = 2;
        let directiony = -3;

        throughx = endpointx + directionx;
        throughy = endpointy + directiony;

        let directionthroughx = directionEndpointShiftx + directionx;
        let directionthroughy = directionEndpointShifty + directiony;

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("direction"),

            tailcoords: [directionEndpointShiftx, directionEndpointShifty],
            headcoords: [directionthroughx, directionthroughy],
        });

        // adjust for constraints
        throughx = Math.round(throughx / 5) * 5;
        throughy = Math.round(throughy / 3) * 3;
        throughx = throughx === 0 ? 0 : throughx; // change -0 to 0
        directionx = throughx - endpointx;
        directiony = throughy - endpointy;

        await testRayCopiedHTD({
            core,
            resolvePathToNodeIdx,
            throughx,
            throughy,
            endpointx,
            endpointy,
            directionEndpointShiftx,
            directionEndpointShifty,
        });
    });

    it("round ray", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ray endpoint="(2.58106823,510.523950183)" through="(5.2164162,623.5234601)" name="v1"/>
<p name="p1d"><vector extend="$v1.direction" name="v1d" /></p>
<p name="p1t"><point extend="$v1.endpoint" name="v1t" /></p>
<p name="p1h"><point extend="$v1.through" name="v1h" /></p>

<ray extend="$v1" name="v2" displayDigits="6" />
<p name="p2d" ><vector extend="$v2.direction" name="v2d" /></p>
<p name="p2t" ><point extend="$v2.endpoint" name="v2t" /></p>
<p name="p2h" ><point extend="$v2.through" name="v2h" /></p>

<ray extend="$v1" name="v3" displayDecimals="0" />
<p name="p3d" ><vector extend="$v3.direction" name="v3d" /></p>
<p name="p3t" ><point extend="$v3.endpoint" name="v3t" /></p>
<p name="p3h" ><point extend="$v3.through" name="v3h" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1d")].stateValues.text,
        ).eqls("( 2.64, 113 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1t")].stateValues.text,
        ).eqls("( 2.58, 510.52 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1h")].stateValues.text,
        ).eqls("( 5.22, 623.52 )");

        expect(
            stateVariables[await resolvePathToNodeIdx("p2d")].stateValues.text,
        ).eqls("( 2.63535, 113 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2t")].stateValues.text,
        ).eqls("( 2.58107, 510.524 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2h")].stateValues.text,
        ).eqls("( 5.21642, 623.523 )");

        expect(
            stateVariables[await resolvePathToNodeIdx("p3d")].stateValues.text,
        ).eqls("( 3, 113 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3t")].stateValues.text,
        ).eqls("( 3, 511 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3h")].stateValues.text,
        ).eqls("( 5, 624 )");
    });

    it("warnings", async () => {
        let { core } = await createTestCore({
            doenetML: `
<graph>
    <ray through="(1,2)" endpoint="(3,4)" direction="(5,6)" name="ray1" />
    <ray through="(1,2)" endpoint="(3,4,5)" name="ray2" />
    <ray through="(1,2)" direction="(3,4,5)" name="ray3" />
    <ray endpoint="(1,2)" direction="(3,4,5)" name="ray4" />
</graph>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(4);

        expect(errorWarnings.warnings[0].message).contain(
            "Ray is prescribed by through, endpoint, and direction.  Ignoring specified through",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.start.line).eq(3);
        expect(errorWarnings.warnings[0].position.start.column).eq(5);
        expect(errorWarnings.warnings[0].position.end.line).eq(3);
        expect(errorWarnings.warnings[0].position.end.column).eq(75);

        expect(errorWarnings.warnings[1].message).contain(
            "numDimensions mismatch in ray",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].position.start.line).eq(4);
        expect(errorWarnings.warnings[1].position.start.column).eq(5);
        expect(errorWarnings.warnings[1].position.end.line).eq(4);
        expect(errorWarnings.warnings[1].position.end.column).eq(59);

        expect(errorWarnings.warnings[2].message).contain(
            "numDimensions mismatch in ray",
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].position.start.line).eq(5);
        expect(errorWarnings.warnings[2].position.start.column).eq(5);
        expect(errorWarnings.warnings[2].position.end.line).eq(5);
        expect(errorWarnings.warnings[2].position.end.column).eq(60);

        expect(errorWarnings.warnings[3].message).contain(
            "numDimensions mismatch in ray",
        );
        expect(errorWarnings.warnings[3].level).eq(1);
        expect(errorWarnings.warnings[3].position.start.line).eq(6);
        expect(errorWarnings.warnings[3].position.start.column).eq(5);
        expect(errorWarnings.warnings[3].position.end.line).eq(6);
        expect(errorWarnings.warnings[3].position.end.column).eq(61);
    });

    it("handle bad through/endpoint", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <ray name="ray1" through="A" endpoint="B" />
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[await resolvePathToNodeIdx("ray1")]).not.eq(
            undefined,
        );
    });

    it("style description changes with theme", async () => {
        const doenetML = `
    <setup>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
    </setup>
    <graph>
      <ray name="A" styleNumber="1" labelIsName endpoint="(0,0)" through="(1,2)" />
      <ray name="B" styleNumber="2" labelIsName endpoint="(2,2)" through="(3,4)" />
      <ray name="C" styleNumber="5" labelIsName endpoint="(4,4)" through="(5,6)" />
    </graph>
    <p name="ADescription">Ray A is $A.styleDescription.</p>
    <p name="BDescription">B is a $B.styleDescriptionWithNoun.</p>
    <p name="CDescription">C is a $C.styleDescriptionWithNoun.</p>
    `;

        async function test_items(theme: "dark" | "light") {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                theme,
            });

            const AColor = theme === "dark" ? "yellow" : "brown";
            const BShade = theme === "dark" ? "light" : "dark";
            const CColor = theme === "dark" ? "white" : "black";

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("ADescription")]
                    .stateValues.text,
            ).eq(`Ray A is thick ${AColor}.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("BDescription")]
                    .stateValues.text,
            ).eq(`B is a ${BShade} red ray.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("CDescription")]
                    .stateValues.text,
            ).eq(`C is a thin ${CColor} ray.`);
        }

        await test_items("light");
        await test_items("dark");
    });
});

import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    movePoint,
    moveVector,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

/**
 * Note: Many of these tests are closely mirrored in the <ray> tests.
 */

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Vector Tag Tests", function () {
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

    async function testVectorCopiedHTD({
        headx,
        heady,
        tailx,
        taily,
        displacementTailShiftx = 0,
        displacementTailShifty = 0,
        vectorName = "vector1",
        tailName = "tail",
        headName = "head",
        displacementName = "displacement",
        core,
        resolvePathToNodeIdx,
    }) {
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        let stateVariables = await core.returnAllStateVariables(false, true);
        check_vec_htd({
            componentIdx: await resolvePathToNodeIdx(vectorName),
            h: [headx, heady],
            t: [tailx, taily],
            d: [displacementx, displacementy],
            stateVariables,
        });

        expect(
            stateVariables[
                await resolvePathToNodeIdx(tailName)
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([tailx, taily]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx(headName)
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([headx, heady]);

        check_vec_htd({
            componentIdx: await resolvePathToNodeIdx(displacementName),
            h: [
                displacementx + displacementTailShiftx,
                displacementy + displacementTailShifty,
            ],
            t: [displacementTailShiftx, displacementTailShifty],
            d: [displacementx, displacementy],
            stateVariables,
        });
    }

    async function common_test_process({
        core,
        resolvePathToNodeIdx,
        initialTailX = 0,
        initialTailY = 0,
        initialHeadX = -4,
        initialHeadY = 2,
        checkLabel = false,
        pointMovesEntireVector = "tail",
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        initialTailX?: number;
        initialTailY?: number;
        initialHeadX?: number;
        initialHeadY?: number;
        checkLabel?: boolean;
        pointMovesEntireVector?: "head" | "tail" | "none";
    }) {
        let tailx = initialTailX;
        let taily = initialTailY;
        let headx = initialHeadX;
        let heady = initialHeadY;
        let displacementTailShiftx = 0;
        let displacementTailShifty = 0;

        if (checkLabel) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("vector1")]
                    .stateValues.label,
            ).eq("\\(\\vec{v}\\)");
        }

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move vector up and to the right
        let moveX = 3;
        let moveY = 2;
        tailx += moveX;
        headx += moveX;
        taily += moveY;
        heady += moveY;

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vector1"),
            tailcoords: [tailx, taily],
            headcoords: [headx, heady],
        });
        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // moved copied tail
        moveX = -8;
        moveY = 4;
        tailx += moveX;
        taily += moveY;
        if (pointMovesEntireVector === "tail") {
            headx += moveX;
            heady += moveY;
        }
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tail"),
            x: tailx,
            y: taily,
        });
        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move copied head
        moveX = -3;
        moveY = -9;
        headx += moveX;
        heady += moveY;
        if (pointMovesEntireVector === "head") {
            tailx += moveX;
            taily += moveY;
        }
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("head"),
            x: headx,
            y: heady,
        });
        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move copied displacement
        displacementTailShiftx = -4;
        displacementTailShifty = -5;

        let displacementx = 2;
        let displacementy = -3;

        if (pointMovesEntireVector === "head") {
            tailx = headx - displacementx;
            taily = heady - displacementy;
        } else {
            headx = tailx + displacementx;
            heady = taily + displacementy;
        }
        let displacementheadx = displacementTailShiftx + displacementx;
        let displacementheady = displacementTailShifty + displacementy;

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("displacement"),

            tailcoords: [displacementTailShiftx, displacementTailShifty],
            headcoords: [displacementheadx, displacementheady],
        });

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });
    }

    it("vector with no arguments, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <vector name="vector1" />
  </graph>
  <graph>
      <point extend="$vector1.tail" name="tail" />
      <point extend="$vector1.head" name="head" />
      <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialHeadX: 1,
            initialHeadY: 0,
            initialTailX: 0,
            initialTailY: 0,
            checkLabel: false,
        });
    });

    it("vector with just label, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <vector name="vector1"><label><m>\\vec{v}</m></label></vector>
  </graph>
  <graph>
      <point extend="$vector1.tail" name="tail" />
      <point extend="$vector1.head" name="head" />
      <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialHeadX: 1,
            initialHeadY: 0,
            initialTailX: 0,
            initialTailY: 0,
            checkLabel: true,
        });
    });

    it("vector with sugared tuple giving xs, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1">(-4,2)</vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  

  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector with sugared tuple giving xs and label, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1">
    (-4,2)
    <label><m>\\vec{v}</m></label>
  </vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  

  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            checkLabel: true,
        });
    });

    it("vector with point giving displacement, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1"><point>(-4,2)</point></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  

  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector with point giving displacement and label, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <vector name="vector1"><point>(-4,2)</point><label><m>\\vec{v}</m></label></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  

  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            checkLabel: true,
        });
    });

    it("vector from vector giving displacement, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1"><vector>(-4,2)</vector></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector from vector giving displacement and label, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1"><label><m>\\vec{v}</m></label><vector>(-4,2)</vector></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            checkLabel: true,
        });
    });

    it("vector with just displacement, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" displacement ="(-4,2)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector with just displacement and label, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" displacement ="(-4,2)" >
    <label><m>\\vec{v}</m></label>
  </vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            checkLabel: true,
        });
    });

    it("vector with xs, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" xs="-4 2" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector with xs and label, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" xs="-4 2" ><label><m>\\vec{v}</m></label></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            checkLabel: true,
        });
    });

    it("vector with math giving displacement, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1"><math>(-4,2)</math></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  

  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector with math giving displacement and label, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1">
    <math>(-4,2)</math>
    <label><m>\\vec{v}</m></label>
  </vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  

  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            checkLabel: true,
        });
    });

    it("vector with copied coords giving displacement, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <coords name="c">(-4,2)</coords>
  <graph>
  <vector name="vector1">
    <coords extend="$c" />
  </vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  

  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector with copied coords giving displacement and label, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <coords name="c">(-4,2)</coords>
  <graph>
  <vector name="vector1">
    <label><m>\\vec{v}</m></label>
    <coords extend="$c" />
  </vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  

  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            checkLabel: true,
        });
    });

    it("vector with x and y, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" x="-4" y="2" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector with x and y and label, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" x="-4" y="2" ><label><m>\\vec{v}</m></label></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            checkLabel: true,
        });
    });

    it("vector with y, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" y="2" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialHeadX: 0,
            initialHeadY: 2,
        });
    });

    it("vector with sugared tuple giving xs and tail, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" tail="(4,1)" >(-8,1)</vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
        });
    });

    it("vector with displacement point child and tail, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" tail="(4,1)" ><point>(-8,1)</point></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
        });
    });

    it("vector with displacement vector child and tail, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" tail="(4,1)" ><vector>(-8,1)</vector></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
        });
    });

    it("vector with displacement and tail, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" displacement="(-8,1)" tail="(4,1)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
        });
    });

    it("vector with xs and tail, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" xs="-8 1" tail="(4,1)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
        });
    });

    it("vector with x, y and tail, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" x="-8" y="1" tail="(4,1)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
        });
    });

    it("vector with y and tail, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" y="1" tail="(4,1)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
            initialHeadX: 4,
            initialHeadY: 2,
        });
    });

    it("vector with sugared tuple giving xs and head, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" head="(-4,2)" >(-8,1)</vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
            pointMovesEntireVector: "head",
        });
    });

    it("vector with displacement point child and head, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" head="(-4,2)" ><point>(-8,1)</point></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
            pointMovesEntireVector: "head",
        });
    });

    it("vector with displacement vector child and head, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" head="(-4,2)" ><vector>(-8,1)</vector></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
            pointMovesEntireVector: "head",
        });
    });

    it("vector with displacement and head, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" displacement="(-8,1)" head="(-4,2)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
            pointMovesEntireVector: "head",
        });
    });

    it("vector with xs and head, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" xs="-8 1" head="(-4,2)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
            pointMovesEntireVector: "head",
        });
    });

    it("vector with x, y and head, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" x="-8" y="1" head="(-4,2)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
            pointMovesEntireVector: "head",
        });
    });

    it("vector with y and head, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" y="1" head="(-4,2)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: -4,
            initialTailY: 1,
            pointMovesEntireVector: "head",
        });
    });

    it("vector with just head, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" head="(-4,2)"/>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            pointMovesEntireVector: "none",
        });
    });

    it("vector with head and tail, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" tail="(4,1)" head="(-4,2)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 4,
            initialTailY: 1,
            pointMovesEntireVector: "none",
        });
    });

    it("vector with just tail, head/tail/displacement copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" tail="(3,4)"/>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
 `,
        });

        await common_test_process({
            core,
            resolvePathToNodeIdx,
            initialTailX: 3,
            initialTailY: 4,
            initialHeadX: 4,
            initialHeadY: 4,
        });
    });

    it("copied vectors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <vector name="vector1" tail="(-1,2)" head="(-2,3)"/>
    <point name="point1">(-4,7)</point>
    <point name="point2">(3,5)</point>
    <vector name="vector2" tail="$point1" head="$point2"/>
    <vector name="vector3" tail="(-9,-1)" head="(-3,6)"/>
  </graph>

  <graph name="g2">
    <vector extend="$g1.vector1" name="vector1" />
    <vector extend="$g1.vector2" name="vector2" />
    <vector extend="$g1.vector3" name="vector3" />
  </graph>

  <graph extend="$g2" name="g3" />

  <section name="s">
    <vector extend="$g3.vector1" name="vector1" />
    <vector extend="$g3.vector2" name="vector2" />
    <vector extend="$g3.vector3" name="vector3" />
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
            const vector1s = [
                "g1.vector1",
                "g2.vector1",
                "g3.vector1",
                "s.vector1",
            ];
            const vector2s = [
                "g1.vector2",
                "g2.vector2",
                "g3.vector2",
                "s.vector2",
            ];
            const vector3s = [
                "g1.vector3",
                "g2.vector3",
                "g3.vector3",
                "s.vector3",
            ];
            for (let name of vector1s) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.tail.map((v) => v.tree),
                ).eqls([v1tx, v1ty]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.head.map((v) => v.tree),
                ).eqls([v1hx, v1hy]);
            }
            for (let name of vector2s) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.tail.map((v) => v.tree),
                ).eqls([v2tx, v2ty]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.head.map((v) => v.tree),
                ).eqls([v2hx, v2hy]);
            }
            for (let name of vector3s) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.tail.map((v) => v.tree),
                ).eqls([v3tx, v3ty]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.head.map((v) => v.tree),
                ).eqls([v3hx, v3hy]);
            }
        }
        await check_items();

        // move vector1
        v1tx = 5;
        v1ty = -8;
        v1hx = 4;
        v1hy = -9;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vector1"),
            tailcoords: [v1tx, v1ty],
            headcoords: [v1hx, v1hy],
        });
        await check_items();

        // move vector4
        v1tx = 2;
        v1ty = 6;
        v1hx = -2;
        v1hy = -4;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g2.vector1"),
            tailcoords: [v1tx, v1ty],
            headcoords: [v1hx, v1hy],
        });
        await check_items();

        // move vector7
        v1tx = -3;
        v1ty = 9;
        v1hx = 6;
        v1hy = -8;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g3.vector1"),
            tailcoords: [v1tx, v1ty],
            headcoords: [v1hx, v1hy],
        });
        await check_items();

        // move vector2
        v2tx = -4;
        v2ty = 7;
        v2hx = 3;
        v2hy = 5;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vector2"),
            tailcoords: [v2tx, v2ty],
            headcoords: [v2hx, v2hy],
        });
        await check_items();

        // move vector5
        v2tx = 6;
        v2ty = -2;
        v2hx = 1;
        v2hy = -7;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g2.vector2"),
            tailcoords: [v2tx, v2ty],
            headcoords: [v2hx, v2hy],
        });
        await check_items();

        // move vector8
        v2tx = -3;
        v2ty = -6;
        v2hx = 5;
        v2hy = -9;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g3.vector2"),
            tailcoords: [v2tx, v2ty],
            headcoords: [v2hx, v2hy],
        });
        await check_items();

        // move vector3
        v3tx = 6;
        v3ty = -8;
        v3hx = -1;
        v3hy = 0;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vector3"),
            tailcoords: [v3tx, v3ty],
            headcoords: [v3hx, v3hy],
        });
        await check_items();

        // move vector6
        v3tx = 3;
        v3ty = 1;
        v3hx = -7;
        v3hy = -2;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g2.vector3"),
            tailcoords: [v3tx, v3ty],
            headcoords: [v3hx, v3hy],
        });
        await check_items();

        // move vector9
        v3tx = -2;
        v3ty = 7;
        v3hx = 5;
        v3hy = -6;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g3.vector3"),
            tailcoords: [v3tx, v3ty],
            headcoords: [v3hx, v3hy],
        });
        await check_items();
    });

    it("copied vectors and displacements", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <vector name="vector1"><vector name="d">(1,2)</vector></vector>
    </graph>
    <graph>
        <vector extend="$vector1" name="vector2" />
    </graph>
    <graph>
        <vector extend="$d" name="vector3" />
    </graph>
    <graph>
        <vector extend="$vector1.displacement" name="vector4" />
    </graph>
  `,
        });

        const vectors = ["vector1", "vector2"];
        const displacements = ["vector3", "vector4"];

        // initial state
        let vector_tx = 0;
        let vector_ty = 0;
        let vector_hx = 1;
        let vector_hy = 2;
        let dtail_xs = [0, 0];
        let dtail_ys = [0, 0];

        async function check_items() {
            let displacement_x = vector_hx - vector_tx;
            let displacement_y = vector_hy - vector_ty;

            let dhead_xs = dtail_xs.map((x) => x + displacement_x);
            let dhead_ys = dtail_ys.map((y) => y + displacement_y);

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let name of vectors) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.tail.map((v) => v.tree),
                ).eqls([vector_tx, vector_ty]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.head.map((v) => v.tree),
                ).eqls([vector_hx, vector_hy]);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.displacement.map((v) => v.tree),
                ).eqls([displacement_x, displacement_y]);
            }

            for (let i = 0; i < displacements.length; i++) {
                let name = displacements[i];
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
                ).eqls([displacement_x, displacement_y]);
            }
        }
        await check_items();

        // move each vector
        let txs = [-4, 7];
        let tys = [9, 3];
        let hxs = [6, -2];
        let hys = [5, 0];

        for (let i = 0; i < vectors.length; i++) {
            vector_tx = txs[i];
            vector_ty = tys[i];
            vector_hx = hxs[i];
            vector_hy = hys[i];
            await moveVector({
                core,
                componentIdx: await resolvePathToNodeIdx(vectors[i]),
                tailcoords: [vector_tx, vector_ty],
                headcoords: [vector_hx, vector_hy],
            });
            await check_items();
        }

        // move each displacement
        vector_tx = 7;
        vector_ty = 3;
        txs = [7, 0];
        tys = [-3, 4];
        hxs = [8, -7];
        hys = [-2, 1];

        for (let i = 0; i < 2; i++) {
            let displacement_x = hxs[i] - txs[i];
            let displacement_y = hys[i] - tys[i];
            dtail_xs[i] = txs[i];
            dtail_ys[i] = tys[i];
            let dhead_xs = dtail_xs.map((x) => x + displacement_x);
            let dhead_ys = dtail_ys.map((y) => y + displacement_y);
            vector_hx = vector_tx + displacement_x;
            vector_hy = vector_ty + displacement_y;

            await moveVector({
                core,
                componentIdx: await resolvePathToNodeIdx(displacements[i]),
                tailcoords: [dtail_xs[i], dtail_ys[i]],
                headcoords: [dhead_xs[i], dhead_ys[i]],
            });
            await check_items();
        }
    });

    it("constrain to vector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="point1">(1,2)</point>
  <point name="point2">(3,4)</point>
  <vector name="vector1" tail="$point1" head="$point2" />

  <point name="point3" x="-5" y="2">
      <constrainTo>$vector1</constrainTo>
  </point>
  </graph>
  <vector extend="$vector1" name="v1a" />
  $point3{name="p3a"}
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
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([tx, ty]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.head.map((v) => v.tree),
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

        // move vector to 45 degrees
        tx = -4;
        ty = 4;
        hx = 4;
        hy = -4;
        let pxOrig = -5;
        let pyOrig = 2;
        function calc_snap(pxOrig, pyOrig) {
            let temp = (pxOrig - pyOrig) / 2;
            temp = Math.min(4, Math.max(-4, temp));
            const px = temp;
            const py = -temp;
            return [px, py];
        }
        [px, py] = calc_snap(pxOrig, pyOrig);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vector1"),
            tailcoords: [tx, ty],
            headcoords: [hx, hy],
        });
        await check_items();

        // move point
        pxOrig = 10;
        pyOrig = 1;
        [px, py] = calc_snap(pxOrig, pyOrig);
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
        [px, py] = calc_snap(pxOrig, pyOrig);
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
        [px, py] = calc_snap(pxOrig, pyOrig);
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: pxOrig,
            y: pyOrig,
        });
        await check_items();
    });

    it("attract to vector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="point1">(1,2)</point>
  <point name="point2">(3,4)</point>
  <vector name="vector1" tail="$point1" head="$point2" />

  <point name="point3" x="-5" y="2">
      <attractTo>$vector1</attractTo>
  </point>
  </graph>
  <vector extend="$vector1" name="v1a" />
  $point3{name="p3a"}
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
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([tx, ty]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.head.map((v) => v.tree),
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

        // move vector to 45 degrees
        tx = -4;
        ty = 4;
        hx = 4;
        hy = -4;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vector1"),
            tailcoords: [tx, ty],
            headcoords: [hx, hy],
        });
        await check_items();

        // move point
        let pxOrig = 3.3;
        let pyOrig = -3.6;

        function calc_snap(pxOrig, pyOrig) {
            let temp = (pxOrig - pyOrig) / 2;
            temp = Math.min(4, Math.max(-4, temp));
            const px = temp;
            const py = -temp;
            return [px, py];
        }
        [px, py] = calc_snap(pxOrig, pyOrig);

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: pxOrig,
            y: pyOrig,
        });
        await check_items();

        // move point
        pxOrig = 4.3;
        pyOrig = -4.6;
        px = pxOrig;
        py = pyOrig;
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
        [px, py] = calc_snap(pxOrig, pyOrig);
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
        [px, py] = calc_snap(pxOrig, pyOrig);
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

    it("constrain to vector, different scales from graph", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
        <vector name="l" head="(-1,-0.05)" tail="(1,0.05)"/>
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

    it("two update paths through vectors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="zeroFixed" fixed>(0,0)</point>
    <mathInput name="a" prefill="2" modifyIndirectly="false" />
    <graph>
        <vector name="original" tail="$zeroFixed" head="(1,3)" />
    </graph>
    <graph>
        <vector name="multiplied" tail="$zeroFixed" head="($a$(original.headX1), $a$(original.headX2))" />
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
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([0, 0]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("original")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([ohx, ohy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("multiplied")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([0, 0]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("multiplied")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([mhx, mhy]);
        }
        await check_items();

        // move original vector
        ohx = -5;
        ohy = 1;
        mhx = 2 * ohx;
        mhy = 2 * ohy;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("original"),
            headcoords: [ohx, ohy],
        });
        await check_items();

        // move multiplied vector
        mhx = 6;
        mhy = -8;
        ohx = mhx / 2;
        ohy = mhy / 2;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("multiplied"),
            headcoords: [mhx, mhy],
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

        // move multiplied vector again
        mhx = -6;
        mhy = -3;
        ohx = mhx / -3;
        ohy = mhy / -3;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("multiplied"),
            headcoords: [-6, -3],
        });
        await check_items();
    });

    it("display vector sum triangle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <vector name="u" head="(1,1)" />
        <vector name="v" tail="$(u.head)" displacement="(1,3)" />
        <vector name="w" head="$(v.head)" tail="$(u.tail)" />
    </graph>
  `,
        });

        let uTail = [0, 0];
        let u = [1, 1];
        let v = [1, 3];
        let uHead = u.map((x, i) => x + uTail[i]);
        let vTail = uHead;
        let vHead = v.map((x, i) => x + vTail[i]);
        let w = u.map((x, i) => x + v[i]);
        let wTail = uTail;
        let wHead = w.map((x, i) => x + wTail[i]);

        // check initial values

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("u")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([...uTail]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("u")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([...uHead]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("u")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([...u]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([...vTail]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([...vHead]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([...v]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("w")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([...wTail]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("w")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([...wHead]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("w")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([...w]);
        }
        await check_items();

        // moving tail of v just moves head of u
        vTail = [-3, 2];
        uHead = vTail;
        u = uHead.map((x, i) => x - uTail[i]);
        v = vHead.map((x, i) => x - vTail[i]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v"),
            tailcoords: vTail,
        });
        await check_items();

        // moving head of u keeps v displacement fixed
        uHead = [7, 1];
        vTail = uHead;
        u = uHead.map((x, i) => x - uTail[i]);
        vHead = v.map((x, i) => x + vTail[i]);
        w = u.map((x, i) => x + v[i]);
        wTail = uTail;
        wHead = w.map((x, i) => x + wTail[i]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("u"),
            headcoords: uHead,
        });
        await check_items();

        // moving tail of u moves tail of w
        uTail = [3, 4];
        u = uHead.map((x, i) => x - uTail[i]);
        w = u.map((x, i) => x + v[i]);
        wTail = uTail;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("u"),
            tailcoords: uTail,
        });
        await check_items();

        // moving tail of w moves tail of u
        wTail = [-1, 7];
        uTail = wTail;
        u = uHead.map((x, i) => x - uTail[i]);
        w = u.map((x, i) => x + v[i]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("w"),
            tailcoords: wTail,
        });
        await check_items();

        // moving head of w moves head of v
        wHead = [-5, -4];
        vHead = wHead;
        v = vHead.map((x, i) => x - vTail[i]);
        w = u.map((x, i) => x + v[i]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("w"),
            headcoords: wHead,
        });
        await check_items();

        // moving head of v moves head of w
        vHead = [4, -7];
        wHead = vHead;
        v = vHead.map((x, i) => x - vTail[i]);
        w = u.map((x, i) => x + v[i]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v"),
            headcoords: vHead,
        });
        await check_items();
    });

    it("copy coordinates off vectors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <vector name="u" tail="(1,5)" head="(7,3)" />
    </graph>
    <p>x coordinate of u is <math extend="$u.x" name="ux" /></p>
    <p>y coordinate of u is <math extend="$u.y" name="uy" />p>  
    <p>x1 coordinate of u is <math extend="$u.x1" name="ux1" /></p>
    <p>x2 coordinate of u is <math extend="$u.x2" name="ux2" /></p>

    <vector name="v" tail="(9,1,-3)" head="(-3,10,8)" />
    <p>x coordinate of v is <math extend="$v.x" name="vx" /></p>
    <p>y coordinate of v is <math extend="$v.y" name="vy" /></p>
    <p>z coordinate of v is <math extend="$v.z" name="vz" /></p>
    <p>x1 coordinate of v is <math extend="$v.x1" name="vx1" /></p>
    <p>x2 coordinate of v is <math extend="$v.x2" name="vx2" /></p>
    <p>x3 coordinate of v is <math extend="$v.x3" name="vx3" /></p>
  `,
        });

        let uTail = [1, 5];
        let uHead = [7, 3];
        let u = [uHead[0] - uTail[0], uHead[1] - uTail[1]];
        let vTail = [9, 1, -3];
        let vHead = [-3, 10, 8];
        let v = [vHead[0] - vTail[0], vHead[1] - vTail[1], vHead[2] - vTail[2]];

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("u")
            ].stateValues.tail.map((v) => v.tree),
        ).eqls([...uTail]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("u")
            ].stateValues.head.map((v) => v.tree),
        ).eqls([...uHead]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("u")
            ].stateValues.displacement.map((v) => v.tree),
        ).eqls([...u]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("v")
            ].stateValues.tail.map((v) => v.tree),
        ).eqls([...vTail]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("v")
            ].stateValues.head.map((v) => v.tree),
        ).eqls([...vHead]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("v")
            ].stateValues.displacement.map((v) => v.tree),
        ).eqls([...v]);

        expect(
            stateVariables[await resolvePathToNodeIdx("ux")].stateValues.value
                .tree,
        ).eqls(u[0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("uy")].stateValues.value
                .tree,
        ).eqls(u[1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ux1")].stateValues.value
                .tree,
        ).eqls(u[0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ux2")].stateValues.value
                .tree,
        ).eqls(u[1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("vx")].stateValues.value
                .tree,
        ).eqls(v[0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("vy")].stateValues.value
                .tree,
        ).eqls(v[1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("vz")].stateValues.value
                .tree,
        ).eqls(v[2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("vx1")].stateValues.value
                .tree,
        ).eqls(v[0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("vx2")].stateValues.value
                .tree,
        ).eqls(v[1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("vx3")].stateValues.value
                .tree,
        ).eqls(v[2]);
    });

    it("combining displacement components through copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
    <vector name="v1" tail="(1,2)" head="(3,5)" />
    <vector extend="$v1" name="v2" />
    <vector extend="$v1.displacement" name="v3" />
    <vector name="v4" displacement="($(v2.y), $(v3.x))" />
</graph>
<vector extend="$v1" name="v1a" />
  `,
        });

        let x = 2;
        let y = 3;
        let t1x = 1;
        let t1y = 2;
        let t3x = 0;
        let t3y = 0;
        let t4x = 0;
        let t4y = 0;

        // initial positions

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v1")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([t1x, t1y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v1")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([t1x + x, t1y + y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v1")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([x, y]);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v2")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([t1x, t1y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v2")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([t1x + x, t1y + y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v2")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([x, y]);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v3")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([t3x, t3y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v3")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([t3x + x, t3y + y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v3")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([x, y]);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v4")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([t4x, t4y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v4")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([t4x + y, t4y + x]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v4")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([y, x]);
        }
        await check_items();

        // move head of vector 1
        let hx = 3;
        let hy = 7;
        x = hx - t1x;
        y = hy - t1y;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v1"),
            headcoords: [hx, hy],
        });
        await check_items();

        // move tail of vector 1
        let tx = -2;
        let ty = -1;
        x += t1x - tx;
        y += t1y - ty;
        t1x = tx;
        t1y = ty;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v1"),
            tailcoords: [tx, ty],
        });
        await check_items();

        // move head of vector 2
        hx = 4;
        hy = 1;
        x = hx - t1x;
        y = hy - t1y;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v2"),
            headcoords: [hx, hy],
        });
        await check_items();

        // move tail of vector 2
        tx = 5;
        ty = 7;
        x += t1x - tx;
        y += t1y - ty;
        t1x = tx;
        t1y = ty;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v2"),
            tailcoords: [tx, ty],
        });
        await check_items();

        // move head of vector 3
        hx = -6;
        hy = 3;
        x = hx - t3x;
        y = hy - t3y;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v3"),
            headcoords: [hx, hy],
        });
        await check_items();

        // move tail of vector 3
        tx = -1;
        ty = 4;
        x += t3x - tx;
        y += t3y - ty;
        t3x = tx;
        t3y = ty;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v3"),
            tailcoords: [tx, ty],
        });
        await check_items();

        // move head of vector 4
        ((hx = 6), (hy = -2));
        x = hy - t4y;
        y = hx - t4x;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v4"),
            headcoords: [hx, hy],
        });
        await check_items();

        // move tail of vector 4
        tx = 7;
        ty = 2;
        x += t4y - ty;
        y += t4x - tx;
        t4x = tx;
        t4y = ty;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v4"),
            tailcoords: [tx, ty],
        });
        await check_items();
    });

    it("combining displacement components through copies 2", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
    <vector name="v1" tail="(1,2)" head="(3,5)" />
    <vector extend="$v1" name="v2" />
    <vector extend="$v1.displacement" name="v3" />
    <setup>
        <vector name="v2d" extend="$v2.displacement" />
        <vector name="v3d" extend="$v3.displacement" />
    </setup>
    <point name="v4displacementhead" hide>(
        $v2d.head.y,
        $v3d.head.x  
    )</point>
    <vector name="v4displacement" head="$v4displacementhead" hide />
    <vector name="v4" displacement="$v4displacement" />
</graph>
<vector extend="$v1" name="v1a" />
  `,
        });

        let x = 2;
        let y = 3;
        let t1x = 1;
        let t1y = 2;
        let t3x = 0;
        let t3y = 0;
        let t4x = 0;
        let t4y = 0;

        // initial positions

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v1")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([t1x, t1y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v1")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([t1x + x, t1y + y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v1")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([x, y]);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v2")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([t1x, t1y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v2")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([t1x + x, t1y + y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v2")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([x, y]);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v3")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([t3x, t3y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v3")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([t3x + x, t3y + y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v3")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([x, y]);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v4")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([t4x, t4y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v4")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([t4x + y, t4y + x]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v4")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([y, x]);
        }

        // move head of vector 1
        let hx = 3;
        let hy = 7;
        x = hx - t1x;
        y = hy - t1y;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v1"),
            headcoords: [hx, hy],
        });
        await check_items();

        // move tail of vector 1
        let tx = -2;
        let ty = -1;
        x += t1x - tx;
        y += t1y - ty;
        t1x = tx;
        t1y = ty;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v1"),
            tailcoords: [tx, ty],
        });
        await check_items();

        // move head of vector 2
        hx = 4;
        hy = 1;
        x = hx - t1x;
        y = hy - t1y;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v2"),
            headcoords: [hx, hy],
        });
        await check_items();

        // move tail of vector 2
        tx = 5;
        ty = 7;
        x += t1x - tx;
        y += t1y - ty;
        t1x = tx;
        t1y = ty;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v2"),
            tailcoords: [tx, ty],
        });
        await check_items();

        // move head of vector 3
        hx = -6;
        hy = 3;
        x = hx - t3x;
        y = hy - t3y;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v3"),
            headcoords: [hx, hy],
        });
        await check_items();

        // move tail of vector 3
        tx = -1;
        ty = 4;
        x += t3x - tx;
        y += t3y - ty;
        t3x = tx;
        t3y = ty;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v3"),
            tailcoords: [tx, ty],
        });
        await check_items();

        // move head of vector 4
        hx = 6;
        hy = -2;
        x = hy - t4y;
        y = hx - t4x;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v4"),
            headcoords: [hx, hy],
        });
        await check_items();

        // move tail of vector 4
        tx = 7;
        ty = 2;
        x += t4y - ty;
        y += t4x - tx;
        t4x = tx;
        t4y = ty;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v4"),
            tailcoords: [tx, ty],
        });
        await check_items();
    });

    it("combining components of head and tail through copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="v" tail="(1,2)" head="(-2,3)" />
  <point extend="$v.head" name="vh" />
  <point extend="$v.tail" name="vt" />
  <point name="c" x="$(vh.x)" y="$(vt.y)"/>
  </graph>
  $v{name="va"}
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
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([tx, ty]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([hx, hy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.displacement.map((v) => v.tree),
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

        // move vector 1
        tx = 3;
        ty = -1;
        hx = -4;
        hy = 7;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v"),
            headcoords: [hx, hy],
            tailcoords: [tx, ty],
        });
        await check_items();

        // move head point
        hx = 2;
        hy = 9;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("vh"),
            x: hx,
            y: hy,
        });
        await check_items();

        // move tail point
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

    it("updates depending on vector definition", async () => {
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
    <vector name="vt" tail="$tvt" />
    <vector name="vh" head="$hvh" />
    <vector name="vd" displacement="$dvd" />
    <vector name="vth" tail="$tvth" head="$hvth" />
    <vector name="vtd" tail="$tvtd" displacement="$dvtd" />
    <vector name="vhd" head="$hvhd" displacement="$dvhd" />
</graph>

<graph>
    <point extend="$vt.tail" name="tfvt" />
    <point extend="$vt.head" name="hfvt" />
    <vector extend="$vt.displacement" name="dfvt" />

    <point extend="$vh.tail" name="tfvh" />
    <point extend="$vh.head" name="hfvh" />
    <vector extend="$vh.displacement" name="dfvh" />

    <point extend="$vd.tail" name="tfvd" />
    <point extend="$vd.head" name="hfvd" />
    <vector extend="$vd.displacement" name="dfvd" />

    <point extend="$vth.tail" name="tfvth" />
    <point extend="$vth.head" name="hfvth" />
    <vector extend="$vth.displacement" name="dfvth" />

    <point extend="$vtd.tail" name="tfvtd" />
    <point extend="$vtd.head" name="hfvtd" />
    <vector extend="$vtd.displacement" name="dfvtd" />

    <point extend="$vhd.tail" name="tfvhd" />
    <point extend="$vhd.head" name="hfvhd" />
    <vector extend="$vhd.displacement" name="dfvhd" />
</graph>

<graph>
    <vector extend="$vt" name="vt2" />
    <vector extend="$vh" name="vh2" />
    <vector extend="$vd" name="vd2" />
    <vector extend="$vth" name="vth2" />
    <vector extend="$vtd" name="vtd2" />
    <vector extend="$vhd" name="vhd2" />
</graph>

<graph>
    <point extend="$vt2.tail" name="tfvt2" />
    <point extend="$vt2.head" name="hfvt2" />
    <vector extend="$vt2.displacement" name="dfvt2" />

    <point extend="$vh2.tail" name="tfvh2" />
    <point extend="$vh2.head" name="hfvh2" />
    <vector extend="$vh2.displacement" name="dfvh2" />

    <point extend="$vd2.tail" name="tfvd2" />
    <point extend="$vd2.head" name="hfvd2" />
    <vector extend="$vd2.displacement" name="dfvd2" />

    <point extend="$vth2.tail" name="tfvth2" />
    <point extend="$vth2.head" name="hfvth2" />
    <vector extend="$vth2.displacement" name="dfvth2" />

    <point extend="$vtd2.tail" name="tfvtd2" />
    <point extend="$vtd2.head" name="hfvtd2" />
    <vector extend="$vtd2.displacement" name="dfvtd2" />

    <point extend="$vhd2.tail" name="tfvhd2" />
    <point extend="$vhd2.head" name="hfvhd2" />
    <vector extend="$vhd2.displacement" name="dfvhd2" />
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

            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("vt"),
                t: tvt,
                h: hvt,
                d: dvt,
                stateVariables,
            });
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("vh"),
                t: tvh,
                h: hvh,
                d: dvh,
                stateVariables,
            });
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("vd"),
                t: tvd,
                h: hvd,
                d: dvd,
                stateVariables,
            });
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("vth"),
                t: tvth,
                h: hvth,
                d: dvth,
                stateVariables,
            });
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("vtd"),
                t: tvtd,
                h: hvtd,
                d: dvtd,
                stateVariables,
            });
            check_vec_htd({
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

            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("vt2"),
                t: tvt,
                h: hvt,
                d: dvt,
                stateVariables,
            });
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("vh2"),
                t: tvh,
                h: hvh,
                d: dvh,
                stateVariables,
            });
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("vd2"),
                t: tvd,
                h: hvd,
                d: dvd,
                stateVariables,
            });
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("vth2"),
                t: tvth,
                h: hvth,
                d: dvth,
                stateVariables,
            });
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("vtd2"),
                t: tvtd,
                h: hvtd,
                d: dvtd,
                stateVariables,
            });
            check_vec_htd({
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

        // move tail of each vector directly
        tvt = [-3, 5];
        tvh = [9, -2];
        tvd = [0, 7];
        tvth = [-7, 4];
        tvtd = [5, -9];
        tvhd = [-1, -6];

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vt"),
            tailcoords: tvt,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vh"),
            tailcoords: tvh,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vd"),
            tailcoords: tvd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vth"),
            tailcoords: tvth,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vtd"),
            tailcoords: tvtd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vhd"),
            tailcoords: tvhd,
        });

        // since moved tails directly, heads stay fixed and displacement changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        await check_items();

        // move head of each vector directly
        hvt = [5, -1];
        hvh = [3, -6];
        hvd = [1, -9];
        hvth = [6, 2];
        hvtd = [-6, -4];
        hvhd = [-4, 8];

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vt"),
            headcoords: hvt,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vh"),
            headcoords: hvh,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vd"),
            headcoords: hvd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vth"),
            headcoords: hvth,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vtd"),
            headcoords: hvtd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vhd"),
            headcoords: hvhd,
        });

        // since moved heads directly, tails stay fixed and displacement changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        await check_items();

        // move tail through defining point, if exists
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

        // defined by tail/head, head stays fixed and displacement changes
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

        // defined by tail or tail and displacement, displacement stays fixed and head changes
        hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        await check_items();

        // move head through defining point, if exists
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

        // defined by head only or tail/head, tail stays fixed and displacement changes
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

        // defined by head and displacement, displacement stays fixed and tail changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();

        // change displacement through defining point, if exists
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

        // defined by displacement only or tail/displacement, tail stays fixed and head changes
        hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        // defined by head and displacement, head stays fixed and tail changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();

        // move tail of each vector through copied point
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

        // if defined by head, head stays fixed and displacement changes
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        // if not defined by head,
        // displacement stays fixed and head changes
        hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
        hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        await check_items();

        // move head of each vector through copied point

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

        // for most vectors, tails stay fixed and displacement changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];

        // defined by head and displacement, displacement stays fixed and tail changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();

        // change displacement of each vector through copied vectors
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

        // for most vectors, tails stay fixed and head changes
        hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
        hvh = [tvh[0] + dvh[0], tvh[1] + dvh[1]];
        hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        hvth = [tvth[0] + dvth[0], tvth[1] + dvth[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        // defined by head and displacement, head stays fixed and tail changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();

        // move tail of each copied vector directly
        tvt = [1, 8];
        tvh = [-3, 2];
        tvd = [9, -1];
        tvth = [5, -3];
        tvtd = [-4, -8];
        tvhd = [-1, 6];

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vt2"),
            tailcoords: tvt,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vh2"),
            tailcoords: tvh,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vd2"),
            tailcoords: tvd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vth2"),
            tailcoords: tvth,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vtd2"),
            tailcoords: tvtd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vhd2"),
            tailcoords: tvhd,
        });

        // since moved tails directly, heads stay fixed and displacement changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        await check_items();

        // move head of each copied vector directly
        hvt = [-7, 2];
        hvh = [-2, 9];
        hvd = [0, -3];
        hvth = [6, 1];
        hvtd = [7, 0];
        hvhd = [-8, -4];

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vt2"),
            headcoords: hvt,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vh2"),
            headcoords: hvh,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vd2"),
            headcoords: hvd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vth2"),
            headcoords: hvth,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vtd2"),
            headcoords: hvtd,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vhd2"),
            headcoords: hvhd,
        });

        // since moved heads directly, tails stay fixed and displacement changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        await check_items();

        // move tail of each copied vector through copied point
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

        // if defined by head, head stays fixed and displacement changes
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

        // if not defined by head,
        // displacement stays fixed and head changes
        hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
        hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        await check_items();

        // move head of each copied vector through copied point
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

        // for most vectors, tails stay fixed and displacement changes
        dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
        dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
        dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
        dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
        dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];

        // defined by head and displacement, displacement stays fixed and tail changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();

        // change displacement of each copied vector through copied vectors
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

        // for most vectors, tails stay fixed and head changes
        hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
        hvh = [tvh[0] + dvh[0], tvh[1] + dvh[1]];
        hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
        hvth = [tvth[0] + dvth[0], tvth[1] + dvth[1]];
        hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

        // defined by head and displacement, head stays fixed and tail changes
        tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

        await check_items();
    });

    it("vector adapts to coords of displacement", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<math name="math1">$vector1</math>
<graph>
    <vector name="vector1" tail="(1,2)" head="(3,5)" />
</graph>
  `,
        });

        async function check_items({ dx, dy }: { dx: number; dy: number }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([dx, dy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("math1")].stateValues
                    .value.tree,
            ).eqls(["vector", dx, dy]);
        }
        await check_items({ dx: 2, dy: 3 });

        // move vector head
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vector1"),
            headcoords: [9, 7],
        });
        await check_items({ dx: 8, dy: 5 });

        // move vector tail
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vector1"),
            tailcoords: [-2, 6],
        });
        await check_items({ dx: 11, dy: 1 });
    });

    it("three vectors with mutual references", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
    <vector name="vector1" head="$vector2.head" tail="(1,0)" />
    <vector name="vector2" tail="$vector3.tail" head="(3,2)" />
    <vector name="vector3" head="$vector1.tail" tail="(-1,4)" />
</graph>
<point extend="$vector1.head" name="v1h" />
<point extend="$vector1.tail" name="v1t" />
<point extend="$vector2.head" name="v2h" />
<point extend="$vector2.tail" name="v2t" />
<point extend="$vector3.head" name="v3h" />
<point extend="$vector3.tail" name="v3t" />
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
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector2")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([x3, y3]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector2")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector3")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([x3, y3]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector3")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([x1, y1]);
        }

        // move head of vector 1
        x2 = 7;
        y2 = -3;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v1h"),
            x: x2,
            y: y2,
        });
        await check_items();

        // move tail of vector 1
        x1 = -1;
        y1 = -4;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v1t"),
            x: x1,
            y: y1,
        });
        await check_items();

        // move tail of vector 2
        x3 = 9;
        y3 = -8;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v2t"),
            x: x3,
            y: y3,
        });
        await check_items();

        // move head of vector 2
        x2 = 3;
        y2 = 2;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v2h"),
            x: x2,
            y: y2,
        });
        await check_items();

        // move head of vector 3
        x1 = -5;
        y1 = 8;
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("v3h"),
            x: x1,
            y: y1,
        });
        await check_items();

        // move tail of vector 3
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

    it("copy two components of vector", async () => {
        // checking bug where second component wasn't updating
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <vector name="vector1" tail="(3, $b)" head="($a,4)" />
  <math extend="$vector1.x" name="v1x" />
  <math extend="$vector1.y" name="v1y" />
  <p><mathInput name="a" prefill="1"></mathInput></p>
  <p><mathInput name="b" prefill="2"></mathInput></p>
  
  `,
        });

        let a = 1;
        let b = 2;
        let dx = a - 3;
        let dy = 4 - b;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([3, b]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([a, 4]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([dx, dy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("v1x")].stateValues
                    .value.tree,
            ).eq(dx);
            expect(
                stateVariables[await resolvePathToNodeIdx("v1y")].stateValues
                    .value.tree,
            ).eq(dy);
        }
        await check_items();

        // changed values
        a = -5;
        b = 7;
        dx = a - 3;
        dy = 4 - b;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("a"),
            latex: `${a}`,
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("b"),
            latex: `${b}`,
            core,
        });
        await check_items();
    });

    it("vector with displacement and tail, move just tail", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <vector name="vector1" displacement="(-8,1)" tail="(4,1)" />
  </graph>
  <vector extend="$vector1" name="v1a" />
  `,
        });

        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([tailx, taily]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([headx, heady]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([displacementx, displacementy]);
        }
        await check_items();

        // move tail, make sure head doesn't move
        tailx = -3;
        taily = 7;
        displacementx = headx - tailx;
        displacementy = heady - taily;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vector1"),
            tailcoords: [tailx, taily],
        });
        await check_items();
    });

    it("vector with displacement and head, move just head", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
    <vector name="vector1" displacement="(-8,1)" head="(-4,2)" />
</graph>
<vector extend="$vector1" name="v1a" />
  `,
        });

        let tailx = 4;
        let taily = 1;
        let headx = -4;
        let heady = 2;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([tailx, taily]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([headx, heady]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([displacementx, displacementy]);
        }

        await check_items();

        // move head, make sure tail doesn't move
        headx = 3;
        heady = 5;
        displacementx = headx - tailx;
        displacementy = heady - taily;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vector1"),
            headcoords: [headx, heady],
        });
        await check_items();
    });

    it("vector with displacement, move just tail", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" displacement="(-8,1)" />
  </graph>
  <vector extend="$vector1" name="v1a" />
  `,
        });

        let tailx = 0;
        let taily = 0;
        let headx = -8;
        let heady = 1;
        let displacementx = headx - tailx;
        let displacementy = heady - taily;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.tail.map((v) => v.tree),
            ).eqls([tailx, taily]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.head.map((v) => v.tree),
            ).eqls([headx, heady]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("vector1")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls([displacementx, displacementy]);
        }

        // move tail, make sure head doesn't move
        tailx = -3;
        taily = 7;
        displacementx = headx - tailx;
        displacementy = heady - taily;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vector1"),
            tailcoords: [tailx, taily],
        });
        await check_items();
    });

    it("point inside vector overrides displacement", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
    <vector name="vector1" displacement="(9, 10)" ><point>(-4,2)</point></vector>
</graph>

<graph>
    <point extend="$vector1.tail" name="tail" />
    <point extend="$vector1.head" name="head" />
    <vector extend="$vector1.displacement" name="displacement" />
</graph>

<point extend="$vector1.tail" name="tail2" />
<point extend="$vector1.head" name="head2" />
<vector extend="$vector1.displacement" name="displacement2" />

  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector inside vector overrides displacement", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
    <vector name="vector1" displacement="(9, 10)" ><vector>(-4,2)</vector></vector>
</graph>

<graph>
    <point extend="$vector1.tail" name="tail" />
    <point extend="$vector1.head" name="head" />
    <vector extend="$vector1.displacement" name="displacement" />
</graph>

<point extend="$vector1.tail" name="tail2" />
<point extend="$vector1.head" name="head2" />
<vector extend="$vector1.displacement" name="displacement2" />
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("point inside vector overrides xs", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" xs="9 10" ><point>(-4,2)</point></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  

  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector inside vector overrides xs", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" xs="9 10" ><vector>(-4,2)</vector></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("displacement overrides xs", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" xs="9 10" displacement="(-4,2)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("point inside vector overrides x and y", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" x="9" y="10" ><point>(-4,2)</point></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("vector inside vector overrides x and y", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" x="9" y="10" ><vector>(-4,2)</vector></vector>
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("displacement overrides x and y", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" x="9" y="10" displacement="(-4,2)" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("xs overrides x and y", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <vector name="vector1" x="9" y="10" xs="-4 2" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        await common_test_process({ core, resolvePathToNodeIdx });
    });

    it("1D vector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <vector name="vector1">1</vector>
  <point extend="$vector1.tail" name="t" />
  <point extend="$vector1.head" name="h" />
  <vector extend="$vector1.displacement" name="d" />
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        check_vec_htd({
            componentIdx: await resolvePathToNodeIdx("vector1"),
            h: [1],
            t: [0],
            d: [1],
            stateVariables,
        });

        expect(
            stateVariables[await resolvePathToNodeIdx("h")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("d")
            ].stateValues.displacement.map((v) => v.tree),
        ).eqls([1]);
    });

    it("mutual dependence among entire head, tail, displacement", async () => {
        // this could be made more interesting once have operations on vectors
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <vector name="v1" head="$(v1.tail)" tail="(3,4)" />
  </graph>

  <graph>
    <vector name="v2" head="$(v2.displacement)" displacement="(3,4)" />
  </graph>

  <graph>
    <vector name="v3" tail="$(v3.head)" head="(3,4)" />
  </graph>

  <graph>
    <vector name="v4" tail="$(v4.displacement)" displacement="(3,4)" />
  </graph>

  <graph>
    <vector name="v5" displacement="$(v5.head)" head="(3,4)" />
  </graph>

  <graph>
    <vector name="v6" displacement="$(v6.tail)" tail="(3,4)" />
  </graph>
  `,
        });

        async function check_matching_head_tail(
            name: string,
            val: number[],
            stateVariables?: any,
        ) {
            let stateVars =
                stateVariables ||
                (await core.returnAllStateVariables(false, true));
            const ZEROS = [0, 0];
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx(name),
                h: val,
                t: val,
                d: ZEROS,
                stateVariables: stateVars,
            });
        }

        async function check_matching_head_disp(
            name: string,
            val: number[],
            stateVariables?: any,
        ) {
            let stateVars =
                stateVariables ||
                (await core.returnAllStateVariables(false, true));
            const ZEROS = [0, 0];
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx(name),
                h: val,
                t: ZEROS,
                d: val,
                stateVariables: stateVars,
            });
        }

        async function check_matching_tail_disp(
            name: string,
            val: number[],
            stateVariables?: any,
        ) {
            let stateVars =
                stateVariables ||
                (await core.returnAllStateVariables(false, true));
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx(name),
                h: val.map((v) => 2 * v),
                t: val,
                d: val,
                stateVariables: stateVars,
            });
        }

        // initial values
        let stateVariables = await core.returnAllStateVariables(false, true);
        await check_matching_head_tail("v1", [3, 4], stateVariables);
        await check_matching_head_tail("v3", [3, 4], stateVariables);
        await check_matching_head_disp("v2", [3, 4], stateVariables);
        await check_matching_head_disp("v5", [3, 4], stateVariables);
        await check_matching_tail_disp("v4", [3, 4], stateVariables);
        await check_matching_tail_disp("v6", [3, 4], stateVariables);

        // move v1, head and tail should match
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v1"),
            headcoords: [1, 2],
        });
        await check_matching_head_tail("v1", [1, 2]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v1"),
            tailcoords: [-4, 5],
        });
        await check_matching_head_tail("v1", [-4, 5]);

        // move v3, head and tail should match
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v3"),
            headcoords: [1, 2],
        });
        await check_matching_head_tail("v3", [1, 2]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v3"),
            tailcoords: [-4, 5],
        });
        await check_matching_head_tail("v3", [-4, 5]);

        // move v2, head and displacement should match
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v2"),
            headcoords: [1, 2],
        });
        await check_matching_head_disp("v2", [1, 2]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v2"),
            tailcoords: [5, 7],
        });
        await check_matching_head_disp("v2", [-4, -5]);

        // move v5, head and displacement should match
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v5"),
            headcoords: [1, 2],
        });
        await check_matching_head_disp("v5", [1, 2]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v5"),
            tailcoords: [5, 7],
        });
        await check_matching_head_disp("v5", [-4, -5]);

        // move v4, tail and displacement should match
        // since based on tail and displacement
        // Vector sets displacement to try to keep head in the same place
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v4"),
            headcoords: [-1, 1],
        });
        await check_matching_tail_disp("v4", [-4, -3]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v4"),
            tailcoords: [-10, -2],
        });
        await check_matching_tail_disp("v4", [2, -4]);

        // move v6, tail and displacement should match
        // since based on tail and displacement
        // Vector sets displacement to try to keep head in the same place
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v6"),
            headcoords: [-1, 1],
        });
        await check_matching_tail_disp("v6", [-4, -3]);
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v6"),
            tailcoords: [-10, -2],
        });
        await check_matching_tail_disp("v6", [2, -4]);
    });

    it("vector with no arguments, copy and specify attributes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g0">
    <vector name="v0" />
    <vector extend="$v0" head="(3,4)" name="v1" />
    <vector extend="$v1" tail="(-1,0)" name="v2" />
    <vector extend="$v0" tail="(2,-6)" name="v3" />
    <vector extend="$v3" displacement="(-3,4)" name="v4" />
    <vector extend="$v0" displacement="(5,-1)" name="v5" />
    <vector extend="$v5" head="(6,2)" name="v6" />
  </graph>

  <graph extend="$g0" name="g1" />

  <point extend="$g0.v0.tail" name="v0t" />
  <point extend="$g0.v0.head" name="v0h" />
  <point extend="$g0.v1.tail" name="v1t" />
  <point extend="$g0.v1.head" name="v1h" />
  <point extend="$g0.v2.tail" name="v2t" />
  <point extend="$g0.v2.head" name="v2h" />
  <point extend="$g0.v3.tail" name="v3t" />
  <point extend="$g0.v3.head" name="v3h" />
  <point extend="$g0.v4.tail" name="v4t" />
  <point extend="$g0.v4.head" name="v4h" />
  <point extend="$g0.v5.tail" name="v5t" />
  <point extend="$g0.v5.head" name="v5h" />
  <point extend="$g0.v6.tail" name="v6t" />
  <point extend="$g0.v6.head" name="v6h" />

  `,
        });

        let tails = [
            [0, 0],
            [0, 0],
            [-1, 0],
            [2, -6],
            [2, -6],
            [0, 0],
            [1, 3],
        ];

        let heads = [
            [1, 0],
            [3, 4],
            [3, 4],
            [3, -6],
            [-1, -2],
            [5, -1],
            [6, 2],
        ];

        let displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
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
                        ].stateValues.tail.map((v) => v.tree),
                    ).eqls(tails[i]);
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`g${j}.v${i}`)
                        ].stateValues.head.map((v) => v.tree),
                    ).eqls(heads[i]);
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`g${j}.v${i}`)
                        ].stateValues.displacement.map((v) => v.tree),
                    ).eqls(displacements[i]);
                }
            }
        }

        // move tail of g0/v0

        tails[0] = tails[1] = tails[5] = [3, 5];
        heads[5] = [
            tails[5][0] + displacements[5][0],
            tails[5][1] + displacements[5][1],
        ];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);
        heads[3] = [
            tails[3][0] + displacements[0][0],
            tails[3][1] + displacements[0][1],
        ];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v0"),
            tailcoords: tails[0],
        });
        await check_items();

        // move head of g1/v0

        heads[0] = [-2, 8];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);
        heads[3] = [
            tails[3][0] + displacements[0][0],
            tails[3][1] + displacements[0][1],
        ];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v0"),
            headcoords: heads[0],
        });
        await check_items();

        // move head of g0/v1

        heads[1] = heads[2] = [-9, -1];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v1"),
            headcoords: heads[1],
        });
        await check_items();

        // move tail of g1/v1

        tails[0] = tails[1] = tails[5] = [5, -3];
        heads[0] = [
            tails[0][0] + displacements[0][0],
            tails[0][1] + displacements[0][1],
        ];
        heads[5] = [
            tails[5][0] + displacements[5][0],
            tails[5][1] + displacements[5][1],
        ];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v1"),
            tailcoords: tails[1],
        });
        await check_items();

        // move tail of g0/v2

        tails[2] = [7, 9];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v2"),
            tailcoords: tails[2],
        });
        await check_items();

        // move head of g1/v2

        heads[1] = heads[2] = [8, 4];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v2"),
            headcoords: heads[2],
        });
        await check_items();

        // move head of g0/v3

        heads[3] = [-4, -7];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);
        heads[0] = [
            tails[0][0] + displacements[3][0],
            tails[0][1] + displacements[3][1],
        ];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v3"),
            headcoords: heads[3],
        });
        await check_items();

        // move tail of g1/v3

        tails[3] = tails[4] = [-6, 2];
        heads[4] = [
            tails[4][0] + displacements[4][0],
            tails[4][1] + displacements[4][1],
        ];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);
        heads[0] = [
            tails[0][0] + displacements[3][0],
            tails[0][1] + displacements[3][1],
        ];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v3"),
            tailcoords: tails[3],
        });
        await check_items();

        // move tail of g0/v4

        tails[3] = tails[4] = [-2, 3];
        heads[3] = [
            tails[3][0] + displacements[3][0],
            tails[3][1] + displacements[3][1],
        ];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v4"),
            tailcoords: tails[4],
        });
        await check_items();

        // move head of g1/v4

        heads[4] = [2, 0];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v4"),
            headcoords: heads[4],
        });
        await check_items();
        // move head of g0/v5

        heads[5] = [-9, -8];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);
        tails[6] = [
            heads[6][0] - displacements[5][0],
            heads[6][1] - displacements[5][1],
        ];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v5"),
            headcoords: heads[5],
        });
        await check_items();

        // move tail of g1/v5

        tails[0] = tails[1] = tails[5] = [3, 7];

        heads[0] = [
            tails[0][0] + displacements[0][0],
            tails[0][1] + displacements[0][1],
        ];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);
        tails[6] = [
            heads[6][0] - displacements[5][0],
            heads[6][1] - displacements[5][1],
        ];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v5"),
            tailcoords: tails[5],
        });
        await check_items();

        // move tail of g0/v6

        tails[6] = [8, -7];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);
        heads[5] = [
            tails[5][0] + displacements[6][0],
            tails[5][1] + displacements[6][1],
        ];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.v6"),
            tailcoords: tails[6],
        });
        await check_items();

        // move head of g1/v6

        heads[6] = [9, -5];

        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);
        heads[5] = [
            tails[5][0] + displacements[6][0],
            tails[5][1] + displacements[6][1],
        ];
        displacements = heads.map((v, i) => [
            v[0] - tails[i][0],
            v[1] - tails[i][1],
        ]);

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.v6"),
            headcoords: heads[6],
        });
        await check_items();
    });

    it("head/tail draggable without vector draggable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g0">
    <vector name="vdrag" head="(1,1)" />
    <vector name="vnoheaddrag" head="(1,2)" headdraggable="false" />
    <vector name="vnotaildrag" head="(1,3)" taildraggable="false" />
    <vector name="vnoheadtaildrag" head="(1,4)" headdraggable="false" taildraggable="false" />

    <vector name="vnodrag" head="(1,5)" draggable="false" />
    <vector name="vnodragheaddrag" head="(1,6)" draggable="false" headdraggable />
    <vector name="vnodragtaildrag" head="(1,7)" draggable="false" taildraggable />
    <vector name="vnodragheadtaildrag" head="(1,8)" draggable="false" headdraggable taildraggable />
  </graph>

  <graph extend="$g0" name="g1" />
  `,
        });

        // check state vars related to draggable
        {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vdrag")]
                    .stateValues.draggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vdrag")]
                    .stateValues.headDraggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vdrag")]
                    .stateValues.tailDraggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnoheaddrag")]
                    .stateValues.draggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnoheaddrag")]
                    .stateValues.headDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnoheaddrag")]
                    .stateValues.tailDraggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnotaildrag")]
                    .stateValues.draggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnotaildrag")]
                    .stateValues.headDraggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnotaildrag")]
                    .stateValues.tailDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnoheadtaildrag")]
                    .stateValues.draggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnoheadtaildrag")]
                    .stateValues.headDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnoheadtaildrag")]
                    .stateValues.tailDraggable,
            ).eq(false);

            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnodrag")]
                    .stateValues.draggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnodrag")]
                    .stateValues.headDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnodrag")]
                    .stateValues.tailDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnodragheaddrag")]
                    .stateValues.draggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnodragheaddrag")]
                    .stateValues.headDraggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnodragheaddrag")]
                    .stateValues.tailDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnodragtaildrag")]
                    .stateValues.draggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnodragtaildrag")]
                    .stateValues.headDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g0.vnodragtaildrag")]
                    .stateValues.tailDraggable,
            ).eq(true);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g0.vnodragheadtaildrag")
                ].stateValues.draggable,
            ).eq(false);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g0.vnodragheadtaildrag")
                ].stateValues.headDraggable,
            ).eq(true);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g0.vnodragheadtaildrag")
                ].stateValues.tailDraggable,
            ).eq(true);

            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vdrag")]
                    .stateValues.draggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vdrag")]
                    .stateValues.headDraggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vdrag")]
                    .stateValues.tailDraggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnoheaddrag")]
                    .stateValues.draggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnoheaddrag")]
                    .stateValues.headDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnoheaddrag")]
                    .stateValues.tailDraggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnotaildrag")]
                    .stateValues.draggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnotaildrag")]
                    .stateValues.headDraggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnotaildrag")]
                    .stateValues.tailDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnoheadtaildrag")]
                    .stateValues.draggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnoheadtaildrag")]
                    .stateValues.headDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnoheadtaildrag")]
                    .stateValues.tailDraggable,
            ).eq(false);

            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnodrag")]
                    .stateValues.draggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnodrag")]
                    .stateValues.headDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnodrag")]
                    .stateValues.tailDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnodragheaddrag")]
                    .stateValues.draggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnodragheaddrag")]
                    .stateValues.headDraggable,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnodragheaddrag")]
                    .stateValues.tailDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnodragtaildrag")]
                    .stateValues.draggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnodragtaildrag")]
                    .stateValues.headDraggable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.vnodragtaildrag")]
                    .stateValues.tailDraggable,
            ).eq(true);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.vnodragheadtaildrag")
                ].stateValues.draggable,
            ).eq(false);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.vnodragheadtaildrag")
                ].stateValues.headDraggable,
            ).eq(true);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.vnodragheadtaildrag")
                ].stateValues.tailDraggable,
            ).eq(true);
        }

        let vdrag_t = [0, 0];
        let vdrag_h = [1, 1];
        let vnoheaddrag_t = [0, 0];
        let vnoheaddrag_h = [1, 2];
        let vnotaildrag_t = [0, 0];
        let vnotaildrag_h = [1, 3];
        let vnoheadtaildrag_t = [0, 0];
        let vnoheadtaildrag_h = [1, 4];

        const vnodrag_t = [0, 0];
        const vnodrag_h = [1, 5];
        const vnodragheaddrag_t = [0, 0];
        let vnodragheaddrag_h = [1, 6];
        let vnodragtaildrag_t = [0, 0];
        const vnodragtaildrag_h = [1, 7];
        let vnodragheadtaildrag_t = [0, 0];
        let vnodragheadtaildrag_h = [1, 8];

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            async function check(name, tail, head) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.tail.map((v) => v.tree),
                ).eqls(tail);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.head.map((v) => v.tree),
                ).eqls(head);
            }
            await check("g0.vdrag", vdrag_t, vdrag_h);
            await check("g0.vnoheaddrag", vnoheaddrag_t, vnoheaddrag_h);
            await check("g0.vnotaildrag", vnotaildrag_t, vnotaildrag_h);
            await check(
                "g0.vnoheadtaildrag",
                vnoheadtaildrag_t,
                vnoheadtaildrag_h,
            );
            await check("g0.vnodrag", vnodrag_t, vnodrag_h);
            await check(
                "g0.vnodragheaddrag",
                vnodragheaddrag_t,
                vnodragheaddrag_h,
            );
            await check(
                "g0.vnodragtaildrag",
                vnodragtaildrag_t,
                vnodragtaildrag_h,
            );
            await check(
                "g0.vnodragheadtaildrag",
                vnodragheadtaildrag_t,
                vnodragheadtaildrag_h,
            );
            await check("g1.vdrag", vdrag_t, vdrag_h);
            await check("g1.vnoheaddrag", vnoheaddrag_t, vnoheaddrag_h);
            await check("g1.vnotaildrag", vnotaildrag_t, vnotaildrag_h);
            await check(
                "g1.vnoheadtaildrag",
                vnoheadtaildrag_t,
                vnoheadtaildrag_h,
            );
            await check("g1.vnodrag", vnodrag_t, vnodrag_h);
            await check(
                "g1.vnodragheaddrag",
                vnodragheaddrag_t,
                vnodragheaddrag_h,
            );
            await check(
                "g1.vnodragtaildrag",
                vnodragtaildrag_t,
                vnodragtaildrag_h,
            );
            await check(
                "g1.vnodragheadtaildrag",
                vnodragheadtaildrag_t,
                vnodragheadtaildrag_h,
            );
        }
        await check_items();

        // move head
        vdrag_h = [2, 1];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vdrag"),
            headcoords: vdrag_h,
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnoheaddrag"),
            headcoords: [2, 2],
        });
        vnotaildrag_h = [2, 3];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnotaildrag"),
            headcoords: vnotaildrag_h,
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnoheadtaildrag"),
            headcoords: [2, 4],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodrag"),
            headcoords: [2, 5],
        });
        vnodragheaddrag_h = [2, 6];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodragheaddrag"),
            headcoords: vnodragheaddrag_h,
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodragtaildrag"),
            headcoords: [2, 7],
        });
        vnodragheadtaildrag_h = [2, 8];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodragheadtaildrag"),
            headcoords: vnodragheadtaildrag_h,
        });

        await check_items();

        // move tail
        vdrag_t = [-1, -1];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vdrag"),
            tailcoords: vdrag_t,
        });
        vnoheaddrag_t = [-1, -2];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnoheaddrag"),
            tailcoords: vnoheaddrag_t,
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnotaildrag"),
            tailcoords: [-1, -3],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnoheadtaildrag"),
            tailcoords: [-1, -4],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodrag"),
            tailcoords: [-1, -5],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodragheaddrag"),
            tailcoords: [-1, -6],
        });
        vnodragtaildrag_t = [-1, -7];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodragtaildrag"),
            tailcoords: [-1, -7],
        });
        vnodragheadtaildrag_t = [-1, -8];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodragheadtaildrag"),
            tailcoords: vnodragheadtaildrag_t,
        });

        await check_items();

        // drag vector
        vdrag_h = [3, 1];
        vdrag_t = [-2, -2];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vdrag"),
            headcoords: vdrag_h,
            tailcoords: vdrag_t,
        });
        vnoheaddrag_h = [3, 2];
        vnoheaddrag_t = [-2, -2];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnoheaddrag"),
            headcoords: vnoheaddrag_h,
            tailcoords: vnoheaddrag_t,
        });
        vnotaildrag_h = [3, 3];
        vnotaildrag_t = [-2, -3];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnotaildrag"),
            headcoords: vnotaildrag_h,
            tailcoords: vnotaildrag_t,
        });
        vnoheadtaildrag_h = [3, 4];
        vnoheadtaildrag_t = [-2, -4];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnoheadtaildrag"),
            headcoords: vnoheadtaildrag_h,
            tailcoords: vnoheadtaildrag_t,
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodrag"),
            headcoords: [3, 5],
            tailcoords: [-2, -5],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodragheaddrag"),
            headcoords: [3, 6],
            tailcoords: [-2, -6],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodragtaildrag"),
            headcoords: [3, 7],
            tailcoords: [-2, -7],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g0.vnodragheadtaildrag"),
            headcoords: [3, 8],
            tailcoords: [-2, -8],
        });

        await check_items();

        // drag head, copy
        vdrag_h = [4, 1];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vdrag"),
            headcoords: vdrag_h,
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnoheaddrag"),
            headcoords: [4, 2],
        });
        vnotaildrag_h = [4, 3];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnotaildrag"),
            headcoords: vnotaildrag_h,
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnoheadtaildrag"),
            headcoords: [4, 4],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodrag"),
            headcoords: [4, 5],
        });
        vnodragheaddrag_h = [4, 6];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodragheaddrag"),
            headcoords: vnodragheaddrag_h,
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodragtaildrag"),
            headcoords: [4, 7],
        });
        vnodragheadtaildrag_h = [4, 8];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodragheadtaildrag"),
            headcoords: vnodragheadtaildrag_h,
        });

        await check_items();

        // drag tail, copy
        vdrag_t = [-3, -1];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vdrag"),
            tailcoords: vdrag_t,
        });
        vnoheaddrag_t = [-3, -2];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnoheaddrag"),
            tailcoords: vnoheaddrag_t,
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnotaildrag"),
            tailcoords: [-3, -3],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnoheadtaildrag"),
            tailcoords: [-3, -4],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodrag"),
            tailcoords: [-3, -5],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodragheaddrag"),
            tailcoords: [-3, -6],
        });
        vnodragtaildrag_t = [-3, -7];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodragtaildrag"),
            tailcoords: vnodragtaildrag_t,
        });
        vnodragheadtaildrag_t = [-3, -8];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodragheadtaildrag"),
            tailcoords: vnodragheadtaildrag_t,
        });

        await check_items();

        // drag vector copy
        vdrag_h = [5, 1];
        vdrag_t = [-4, -1];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vdrag"),
            headcoords: vdrag_h,
            tailcoords: vdrag_t,
        });
        vnoheaddrag_h = [5, 2];
        vnoheaddrag_t = [-4, -2];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnoheaddrag"),
            headcoords: vnoheaddrag_h,
            tailcoords: vnoheaddrag_t,
        });
        vnotaildrag_h = [5, 3];
        vnotaildrag_t = [-4, 3];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnotaildrag"),
            headcoords: vnotaildrag_h,
            tailcoords: vnotaildrag_t,
        });
        vnoheadtaildrag_h = [5, 4];
        vnoheadtaildrag_t = [-4, -4];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnoheadtaildrag"),
            headcoords: vnoheadtaildrag_h,
            tailcoords: vnoheadtaildrag_t,
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodrag"),
            headcoords: [5, 5],
            tailcoords: [-4, -5],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodragheaddrag"),
            headcoords: [5, 6],
            tailcoords: [-4, -6],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodragtaildrag"),
            headcoords: [5, 7],
            tailcoords: [-4, -7],
        });
        // no change
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("g1.vnodragheadtaildrag"),
            headcoords: [5, 8],
            tailcoords: [-4, -8],
        });

        await check_items();
    });

    it("vector from vector operations", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m" fixed>(6,3)</math>
    <graph>
      <vector name="v">(3,4) + 2(1,-1)</vector>
      <vector name="w">2$m - 3$v</vector>
    </graph>

    <math extend="$v" name="v2" />
    <math extend="$w" name="w2" />
    `,
        });

        let v = [5, 2];
        let w = [2 * 6 - 3 * v[0], 2 * 3 - 3 * v[1]];

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("v")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls(v);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("w")
                ].stateValues.displacement.map((v) => v.tree),
            ).eqls(w);
        }
        await check_items();

        // move v
        v = [1, 4];
        w = [2 * 6 - 3 * v[0], 2 * 3 - 3 * v[1]];
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v"),
            headcoords: v,
        });
        await check_items();

        // move w
        w = [-9, 9];
        v = [(2 * 6 - w[0]) / 3, (2 * 3 - w[1]) / 3]; // v = (2m - w)/3
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("w"),
            headcoords: w,
        });
        await check_items();
    });

    it("vector magnitude", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <vector name="v" head="(5,4)" tail="(-2,1)" displayDigits="10" />
    </graph>
    <math extend="$v.magnitude" name="magnitude" />
    <point name="A" extend="$v.tail" />
    <point name="B" extend="$v.head" />
    <mathInput name="mimagnitude" bindValueTo="$magnitude" />
    `,
        });

        let tlx = -2;
        let tly = 1;
        let hdx = 5;
        let hdy = 4;
        let len = Math.hypot(tly - hdy, tlx - hdx);
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues
                .magnitude.tree,
        ).eq(len);

        // move point A
        tlx = 7;
        tly = 2;
        len = Math.hypot(tly - hdy, tlx - hdx);
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("A"),
            x: tlx,
            y: tly,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues
                .magnitude.tree,
        ).eq(len);

        // change bound math input
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mimagnitude"),
            latex: "5 \\sqrt{2}",
            core,
        });
        len = 5 * Math.sqrt(2);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues
                .magnitude.tree,
        ).eq(len);

        // ignore requested negative magnitude
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mimagnitude"),
            latex: "-3",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues
                .magnitude.tree,
        ).eq(len);

        // move point B
        hdx = -9;
        hdy = 5;
        len = Math.hypot(tly - hdy, tlx - hdx);
        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("B"),
            x: hdx,
            y: hdy,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues
                .magnitude.tree,
        ).eq(len);
    });

    it("change vector by binding to values", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <vector name="v" />
  <vector name="v2" extend="$v" />

  <p>
  <mathInput bindValueTo="$v.head" name="mivh" />
  <mathInput bindValueTo="$v.tail" name="mivt" />
  <mathInput bindValueTo="$v.displacement" name="mivd" />
  </p>

  <p>
  <mathInput bindValueTo="$v2.head" name="miv2h" />
  <mathInput bindValueTo="$v2.tail" name="miv2t" />
  <mathInput bindValueTo="$v2.displacement" name="miv2d" />
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
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("v"),
                h,
                t,
                d,
                stateVariables,
            });
            check_vec_htd({
                componentIdx: await resolvePathToNodeIdx("v2"),
                h,
                t,
                d,
                stateVariables,
            });
        }
        await check_items();

        // change head using alt vector
        h = [6, 9];
        d = [6, 9];
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivh"),
            latex: "\\langle 6,9 \\rangle",
            core,
        });
        await check_items();

        // change tail using alt vector, shifts entire vector
        t = [-3, 7];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivt"),
            latex: "\\langle -3,7 \\rangle",
            core,
        });
        await check_items();

        // change displacement using alt vector, head shifts accordingly
        d = [-4, 1];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivd"),
            latex: "\\langle -4,1 \\rangle",
            core,
        });
        await check_items();

        // cannot change dimnension through displacement
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivd"),
            latex: "(9,8,7)",
            core,
        });
        d = [9, 8];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await check_items();

        // cannot change dimnension through tail
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivt"),
            latex: "(-5,-6,-7)",
            core,
        });
        t = [-5, -6];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await check_items();

        // cannot change dimnension through head
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mivh"),
            latex: "(9,-9,7)",
            core,
        });
        h = [9, -9];
        d[0] = h[0] - t[0];
        d[1] = h[1] - t[1];
        await check_items();

        // cannot change dimnension through copied head
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("miv2h"),
            latex: "(0,1,2,3)",
            core,
        });
        h = [0, 1];
        d[0] = h[0] - t[0];
        d[1] = h[1] - t[1];
        await check_items();

        // cannot change dimnension through copied tail
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("miv2t"),
            latex: "\\langle 2, 4, 6, 8 \\rangle",
            core,
        });
        t = [2, 4];
        h[0] = t[0] + d[0];
        h[1] = t[1] + d[1];
        await check_items();

        // cannot change dimnension through copied displacement
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

    it("display with angle brackets", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<booleanInput name="bi" />
<p name="p1"><vector name="v1" >(1,2)</vector></p>
<p name="p2"><vector name="v2" displayWithAngleBrackets>(1,2)</vector></p>
<p name="p3"><vector name="v3" displayWithAngleBrackets="$bi">(1,2)</vector></p>

<p name="p1a"><vector name="v1a" extend="$v1" displayWithAngleBrackets /></p>
<p name="p2a"><vector name="v2a" extend="$v2" displayWithAngleBrackets="false" /></p>
<p name="p3a"><vector name="v3a" extend="$v3" displayWithAngleBrackets="!$bi" /></p>

<p name="p1d"><vector name="v1d" extend="$v1.displacement" /></p>
<p name="p2d"><vector name="v2d" extend="$v2.displacement" /></p>
<p name="p3d"><vector name="v3d" extend="$v3.displacement" /></p>

<p name="p1ad"><vector name="v1ad" extend="$v1a.displacement" /></p>
<p name="p2ad"><vector name="v2ad" extend="$v2a.displacement" /></p>
<p name="p3ad"><vector name="v3ad" extend="$v3a.displacement" /></p>
  `,
        });

        let x1 = 1;
        let y1 = 2;
        let x2 = 1;
        let y2 = 2;
        let x3 = 1;
        let y3 = 2;
        let bi = false;

        async function check_items() {
            let parens1 = `( ${x1}, ${y1} )`;
            let brackets1 = `⟨ ${x1}, ${y1} ⟩`;
            let parens2 = `( ${x2}, ${y2} )`;
            let brackets2 = `⟨ ${x2}, ${y2} ⟩`;
            let parens3 = `( ${x3}, ${y3} )`;
            let brackets3 = `⟨ ${x3}, ${y3} ⟩`;

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                    .text,
            ).eqls(parens1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .text,
            ).eqls(brackets2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3")].stateValues
                    .text,
            ).eqls(bi ? brackets3 : parens3);

            expect(
                stateVariables[await resolvePathToNodeIdx("p1a")].stateValues
                    .text,
            ).eqls(brackets1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2a")].stateValues
                    .text,
            ).eqls(parens2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3a")].stateValues
                    .text,
            ).eqls(bi ? parens3 : brackets3);

            expect(
                stateVariables[await resolvePathToNodeIdx("p1d")].stateValues
                    .text,
            ).eqls(parens1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2d")].stateValues
                    .text,
            ).eqls(brackets2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3d")].stateValues
                    .text,
            ).eqls(bi ? brackets3 : parens3);

            expect(
                stateVariables[await resolvePathToNodeIdx("p1ad")].stateValues
                    .text,
            ).eqls(brackets1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2ad")].stateValues
                    .text,
            ).eqls(parens2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p3ad")].stateValues
                    .text,
            ).eqls(bi ? parens3 : brackets3);
        }
        await check_items();

        // update boolean input
        bi = true;
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("bi"),
            boolean: bi,
            core,
        });
        await check_items();

        // drag vector heads
        x1 = 2;
        y1 = 4;
        x2 = 3;
        y2 = 5;
        x3 = 4;
        y3 = 6;
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v1"),
            headcoords: [x1, y1],
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v2"),
            headcoords: [x2, y2],
        });
        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("v3"),
            headcoords: [x3, y3],
        });
        await check_items();
    });

    it("color vector text via style", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
    </setup>

    <p>Style number: <mathInput prefill="1" name="sn" /></p>

    <p><vector name="no_style">(1,1)</vector> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>

    <p><vector name="fixed_style" stylenumber="2">(1,-1)</vector> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>

    <p><vector name="variable_style" stylenumber="$sn">(-1,1)</vector> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      <vector extend="$no_style" anchor="(1,2)" />
      <vector extend="$fixed_style" anchor="(3,4)" />
      $variable_style
    </graph>

    `,
        });

        let variableTextStyleDescription = "black";
        let variableTextColor = "black";
        let variableBackgroundColor = "none";

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("tsd_no_style")]
                    .stateValues.value,
            ).toContain("black");
            expect(
                stateVariables[await resolvePathToNodeIdx("tc_no_style")]
                    .stateValues.value,
            ).toContain("black");
            expect(
                stateVariables[await resolvePathToNodeIdx("bc_no_style")]
                    .stateValues.value,
            ).toContain("none");

            expect(
                stateVariables[await resolvePathToNodeIdx("tsd_fixed_style")]
                    .stateValues.value,
            ).toContain("green");
            expect(
                stateVariables[await resolvePathToNodeIdx("tc_fixed_style")]
                    .stateValues.value,
            ).toContain("green");
            expect(
                stateVariables[await resolvePathToNodeIdx("bc_fixed_style")]
                    .stateValues.value,
            ).toContain("none");

            expect(
                stateVariables[await resolvePathToNodeIdx("tsd_variable_style")]
                    .stateValues.value,
            ).toContain(variableTextStyleDescription);
            expect(
                stateVariables[await resolvePathToNodeIdx("tc_variable_style")]
                    .stateValues.value,
            ).toContain(variableTextColor);
            expect(
                stateVariables[await resolvePathToNodeIdx("bc_variable_style")]
                    .stateValues.value,
            ).toContain(variableBackgroundColor);
        }
        await check_items();

        // Style number 2
        variableTextStyleDescription = "green";
        variableTextColor = "green";
        variableBackgroundColor = "none";
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("sn"),
            latex: "2",
            core,
        });
        await check_items();

        // Style number 3
        variableTextStyleDescription = "red with a blue background";
        variableTextColor = "red";
        variableBackgroundColor = "blue";
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("sn"),
            latex: "3",
            core,
        });
        await check_items();
    });

    it("vector with head and tail, tail constrained to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P">(4,1)
      <constrainToGrid dx="5" dy="3" />
  </point>
  <point name="Q">(-4,2)</point>
  <vector name="vector1" tail="$P" head="$Q" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        let tailx = 5;
        let taily = 0;
        let headx = -4;
        let heady = 2;
        let displacementTailShiftx = 0;
        let displacementTailShifty = 0;

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move vector up and to the right

        let moveX = 3;
        let moveY = 2;
        tailx += moveX;
        headx += moveX;
        taily += moveY;
        heady += moveY;

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vector1"),

            tailcoords: [tailx, taily],
            headcoords: [headx, heady],
        });

        // adjust for constraints
        moveX = 2;
        moveY = 1;
        tailx += moveX;
        headx += moveX;
        taily += moveY;
        heady += moveY;

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move copied head

        headx = -5;
        heady = 7;

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("head"),
            x: headx,
            y: heady,
        });

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move copied tail

        tailx = -3;
        taily = -9;

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tail"),
            x: tailx,
            y: taily,
        });

        // adjust for constraints
        tailx = -5;
        taily = -9;

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move copied displacement

        displacementTailShiftx = -4;
        displacementTailShifty = -5;

        let displacementx = 2;
        let displacementy = -3;

        headx = tailx + displacementx;
        heady = taily + displacementy;

        let displacementheadx = displacementTailShiftx + displacementx;
        let displacementheady = displacementTailShifty + displacementy;

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("displacement"),

            tailcoords: [displacementTailShiftx, displacementTailShifty],
            headcoords: [displacementheadx, displacementheady],
        });

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });
    });

    it("vector with head and tail, head constrained to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P">(4,1)</point>
  <point name="Q">(-4,2)
      <constrainToGrid dx="5" dy="3" />
  </point>
  <vector name="vector1" tail="$P" head="$Q" />
  </graph>

  <graph>
  <point extend="$vector1.tail" name="tail" />
  <point extend="$vector1.head" name="head" />
  <vector extend="$vector1.displacement" name="displacement" />
  </graph>
  
  `,
        });

        let tailx = 4;
        let taily = 1;
        let headx = -5;
        let heady = 3;
        let displacementTailShiftx = 0;
        let displacementTailShifty = 0;

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move vector up and to the right

        let moveX = 3;
        let moveY = 2;
        tailx += moveX;
        headx += moveX;
        taily += moveY;
        heady += moveY;

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("vector1"),

            tailcoords: [tailx, taily],
            headcoords: [headx, heady],
        });

        // adjust for constraints
        moveX = 2;
        moveY = 1;
        tailx += moveX;
        headx += moveX;
        taily += moveY;
        heady += moveY;

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move copied head

        headx = -5;
        heady = 7;

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("head"),
            x: headx,
            y: heady,
        });

        // adjust for constraints
        headx = -5;
        heady = 6;

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move copied tail

        tailx = -3;
        taily = -9;

        await movePoint({
            core,
            componentIdx: await resolvePathToNodeIdx("tail"),
            x: tailx,
            y: taily,
        });

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });

        // move copied displacement

        displacementTailShiftx = -4;
        displacementTailShifty = -5;

        let displacementx = 2;
        let displacementy = -3;

        headx = tailx + displacementx;
        heady = taily + displacementy;

        let displacementheadx = displacementTailShiftx + displacementx;
        let displacementheady = displacementTailShifty + displacementy;

        await moveVector({
            core,
            componentIdx: await resolvePathToNodeIdx("displacement"),

            tailcoords: [displacementTailShiftx, displacementTailShifty],
            headcoords: [displacementheadx, displacementheady],
        });

        // adjust for constraints
        headx = Math.round(headx / 5) * 5;
        heady = Math.round(heady / 3) * 3;
        headx = headx === 0 ? 0 : headx; // change -0 to 0
        displacementx = headx - tailx;
        displacementy = heady - taily;

        await testVectorCopiedHTD({
            core,
            resolvePathToNodeIdx,
            headx,
            heady,
            tailx,
            taily,
            displacementTailShiftx,
            displacementTailShifty,
        });
    });

    it("round vector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p name="p1v"><vector tail="(2.58106823,510.523950183)" head="(5.2164162,623.5234601)" name="v1"/></p>
<p name="p1d"><vector extend="$v1.displacement" name="v1d" /></p>
<p name="p1t"><point extend="$v1.tail" name="v1t" /></p>
<p name="p1h"><point extend="$v1.head" name="v1h" /></p>

<p name="p2v" ><vector extend="$v1" name="v2" displayDigits="6" /></p>
<p name="p2d" ><vector extend="$v2.displacement" name="v2d" /></p>
<p name="p2t" ><point extend="$v2.tail" name="v2t" /></p>
<p name="p2h" ><point extend="$v2.head" name="v2h" /></p>

<p name="p3v" ><vector extend="$v1" name="v3" displayDecimals="0" /></p>
<p name="p3d" ><vector extend="$v3.displacement" name="v3d" /></p>
<p name="p3t" ><point extend="$v3.tail" name="v3t" /></p>
<p name="p3h" ><point extend="$v3.head" name="v3h" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1v")].stateValues.text,
        ).eqls("( 2.64, 113 )");
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
            stateVariables[await resolvePathToNodeIdx("p2v")].stateValues.text,
        ).eqls("( 2.63535, 113 )");
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
            stateVariables[await resolvePathToNodeIdx("p3v")].stateValues.text,
        ).eqls("( 3, 113 )");
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
<graph description="A graph with warnings">
    <vector head="(1,2)" tail="(3,4)" displacement="(5,6)" name="vector1" />
    <vector head="(1,2)" tail="(3,4,5)" name="vector2" />
    <vector head="(1,2)" displacement="(3,4,5)" name="vector3" />
    <vector tail="(1,2)" displacement="(3,4,5)" name="vector4" />
</graph>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(4);

        expect(errorWarnings.warnings[0].message).contain(
            "Vector is prescribed by head, tail, and displacement.  Ignoring specified head",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.start.line).eq(3);
        expect(errorWarnings.warnings[0].position.start.column).eq(5);
        expect(errorWarnings.warnings[0].position.end.line).eq(3);
        expect(errorWarnings.warnings[0].position.end.column).eq(77);

        expect(errorWarnings.warnings[1].message).contain(
            "numDimensions mismatch in vector",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].position.start.line).eq(4);
        expect(errorWarnings.warnings[1].position.start.column).eq(5);
        expect(errorWarnings.warnings[1].position.end.line).eq(4);
        expect(errorWarnings.warnings[1].position.end.column).eq(58);

        expect(errorWarnings.warnings[2].message).contain(
            "numDimensions mismatch in vector",
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].position.start.line).eq(5);
        expect(errorWarnings.warnings[2].position.start.column).eq(5);
        expect(errorWarnings.warnings[2].position.end.line).eq(5);
        expect(errorWarnings.warnings[2].position.end.column).eq(66);

        expect(errorWarnings.warnings[3].message).contain(
            "numDimensions mismatch in vector",
        );
        expect(errorWarnings.warnings[3].level).eq(1);
        expect(errorWarnings.warnings[3].position.start.line).eq(6);
        expect(errorWarnings.warnings[3].position.start.column).eq(5);
        expect(errorWarnings.warnings[3].position.end.line).eq(6);
        expect(errorWarnings.warnings[3].position.end.column).eq(66);
    });

    it("handle bad head/tail", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <vector name="vector1" head="A" tail="B" />
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[await resolvePathToNodeIdx("vector1")]).not.eq(
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
      <vector name="A" styleNumber="1" labelIsName tail="(0,0)" head="(1,2)" />
      <vector name="B" styleNumber="2" labelIsName tail="(2,2)" head="(3,4)" />
      <vector name="C" styleNumber="5" labelIsName tail="(4,4)" head="(5,6)" />
    </graph>
    <p name="ADescription">Vector A is $A.styleDescription.</p>
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
            ).eq(`Vector A is thick ${AColor}.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("BDescription")]
                    .stateValues.text,
            ).eq(`B is a ${BShade} red vector.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("CDescription")]
                    .stateValues.text,
            ).eq(`C is a thin ${CColor} vector.`);
        }

        await test_items("light");
        await test_items("dark");
    });
});

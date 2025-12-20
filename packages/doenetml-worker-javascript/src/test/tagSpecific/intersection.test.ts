import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    movePoint,
    movePolygon,
    movePolyline,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function check_intersections(
    core: PublicDoenetMLCore,
    resolvePathToNodeIdx: ResolvePathToNodeIdx,
    coords1?: number[],
    coords2?: number[],
    coords3?: number[],
    coords4?: number[],
    coords5?: number[],
    coords6?: number[],
    coords7?: number[],
) {
    let stateVariables = await core.returnAllStateVariables(false, true);

    if (coords1) {
        expect(
            stateVariables[await resolvePathToNodeIdx("int[1]")].stateValues
                .xs[0].tree,
        ).closeTo(coords1[0], 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("int[1]")].stateValues
                .xs[1].tree,
        ).closeTo(coords1[1], 1e-12);
    } else {
        expect(stateVariables[await resolvePathToNodeIdx("int[1]")]).eq(
            undefined,
        );
    }

    if (coords2) {
        expect(
            stateVariables[await resolvePathToNodeIdx("int[2]")].stateValues
                .xs[0].tree,
        ).closeTo(coords2[0], 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("int[2]")].stateValues
                .xs[1].tree,
        ).closeTo(coords2[1], 1e-12);
    } else {
        expect(stateVariables[await resolvePathToNodeIdx("int[2]")]).eq(
            undefined,
        );
    }

    if (coords3) {
        expect(
            stateVariables[await resolvePathToNodeIdx("int[3]")].stateValues
                .xs[0].tree,
        ).closeTo(coords3[0], 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("int[3]")].stateValues
                .xs[1].tree,
        ).closeTo(coords3[1], 1e-12);
    } else {
        expect(stateVariables[await resolvePathToNodeIdx("int[3]")]).eq(
            undefined,
        );
    }

    if (coords4) {
        expect(
            stateVariables[await resolvePathToNodeIdx("int[4]")].stateValues
                .xs[0].tree,
        ).closeTo(coords4[0], 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("int[4]")].stateValues
                .xs[1].tree,
        ).closeTo(coords4[1], 1e-12);
    } else {
        expect(stateVariables[await resolvePathToNodeIdx("int[4]")]).eq(
            undefined,
        );
    }

    if (coords5) {
        expect(
            stateVariables[await resolvePathToNodeIdx("int[5]")].stateValues
                .xs[0].tree,
        ).closeTo(coords5[0], 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("int[5]")].stateValues
                .xs[1].tree,
        ).closeTo(coords5[1], 1e-12);
    } else {
        expect(stateVariables[await resolvePathToNodeIdx("int[5]")]).eq(
            undefined,
        );
    }

    if (coords6) {
        expect(
            stateVariables[await resolvePathToNodeIdx("int[6]")].stateValues
                .xs[0].tree,
        ).closeTo(coords6[0], 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("int[6]")].stateValues
                .xs[1].tree,
        ).closeTo(coords6[1], 1e-12);
    } else {
        expect(stateVariables[await resolvePathToNodeIdx("int[6]")]).eq(
            undefined,
        );
    }

    if (coords7) {
        expect(
            stateVariables[await resolvePathToNodeIdx("int[7]")].stateValues
                .xs[0].tree,
        ).closeTo(coords7[0], 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("int[7]")].stateValues
                .xs[1].tree,
        ).closeTo(coords7[1], 1e-12);
    } else {
        expect(stateVariables[await resolvePathToNodeIdx("int[7]")]).eq(
            undefined,
        );
    }
}

describe("Intersection tag tests", async () => {
    it("intersections between two lines", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P1">(1,2)</point>
  <point name="P2">(2,2)</point>
  <point name="P3">(3,2)</point>
  <point name="P4">(4,2)</point>
  
  <line name="l1" through="$P1 $P2" />
  <line name="l2" through="$P3 $P4" />
  <intersection name="int">$l1$l2</intersection>
  
  </graph>


  `,
        });

        // no intersection when lines coincide
        await check_intersections(core, resolvePathToNodeIdx);

        // make first line vertical
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 3,
            y: 5,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 3,
            y: -5,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [3, 2]);

        // make second line vertical
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: -4,
            y: 5,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P4"),
            x: -4,
            y: -5,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // make lines intersect again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: -8,
            y: -7,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 8,
            y: 9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: 4,
            y: 6,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P4"),
            x: -4,
            y: -6,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [2, 3]);

        // make lines equal again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 6,
            y: 9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: -6,
            y: -9,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);
    });

    it("intersections between three lines gives warning", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph><shortDescription>A graph with warnings</shortDescription>
  
  <line name="l1" />
  <line name="l2" through="(1,2) (3,4)" />
  <line name="l3" through="(-1,2) (-3,4)" />
  <intersection>$l1$l2$l3</intersection>
  
  </graph>
  `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Haven't implemented intersection for more than two items`,
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(7);
        expect(errorWarnings.warnings[0].position.start.column).eq(3);
        expect(errorWarnings.warnings[0].position.end.line).eq(7);
        expect(errorWarnings.warnings[0].position.end.column).eq(41);
    });

    it("intersection of two lines hides dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P1">(1,2)</point>
  <point name="P2">(2,2)</point>
  <point name="P3">(3,2)</point>
  <point name="P4">(4,2)</point>
  <line name="l1" through="$P1 $P2" />
  <line name="l2" through="$P3 $P4" />
  </graph>

  <booleanInput name='h1' prefill="false" >
    <label>Hide first intersection</label>
  </booleanInput>
  <booleanInput name='h2' prefill="true" >
    <label>Hide second intersection</label>
  </booleanInput>
  
  <p name="i1">Intersection 1: <intersection hide="$h1">$l1$l2</intersection></p>
  <p name="i2">Intersection 2: <intersection hide="$h2">$l1$l2</intersection></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i1")].stateValues.text,
        ).eq("Intersection 1: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("i2")].stateValues.text,
        ).eq("Intersection 2: ");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i1")].stateValues.text,
        ).eq("Intersection 1: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("i2")].stateValues.text,
        ).eq("Intersection 2: ");

        // make first line vertical
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 3,
            y: 5,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 3,
            y: -5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i1")].stateValues.text,
        ).eq("Intersection 1: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("i2")].stateValues.text,
        ).eq("Intersection 2: ( 3, 2 )");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i1")].stateValues.text,
        ).eq("Intersection 1: ( 3, 2 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("i2")].stateValues.text,
        ).eq("Intersection 2: ");

        // make second line vertical
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: -4,
            y: 5,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P4"),
            x: -4,
            y: -5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i1")].stateValues.text,
        ).eq("Intersection 1: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("i2")].stateValues.text,
        ).eq("Intersection 2: ");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i1")].stateValues.text,
        ).eq("Intersection 1: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("i2")].stateValues.text,
        ).eq("Intersection 2: ");

        // make lines intersect again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: -8,
            y: -7,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 8,
            y: 9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: 4,
            y: 6,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P4"),
            x: -4,
            y: -6,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i1")].stateValues.text,
        ).eq("Intersection 1: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("i2")].stateValues.text,
        ).eq("Intersection 2: ( 2, 3 )");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i1")].stateValues.text,
        ).eq("Intersection 1: ( 2, 3 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("i2")].stateValues.text,
        ).eq("Intersection 2: ");

        // make lines equal again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 6,
            y: 9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: -6,
            y: -9,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i1")].stateValues.text,
        ).eq("Intersection 1: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("i2")].stateValues.text,
        ).eq("Intersection 2: ");
    });

    it("intersections between two circles", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <mathInput name="r1" prefill="1" />
      <mathInput name="r2" prefill="1" />

      <graph>
        <point name="P1">(3,4)</point>
        <circle name="c1" center="$P1" radius="$r1" />
        <point name="P2">(3,6)</point>
        <circle name="c2" center="$P2" radius="$r2" />

        <intersection styleNumber="2" name="int">$c1 $c2</intersection>

      </graph>
    `,
        });

        // start with single intersection
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [3, 5],
            undefined,
        );

        // move first circle up
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 3,
            y: 5,
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [3 + Math.sqrt(3) / 2, 5.5],
            [3 - Math.sqrt(3) / 2, 5.5],
        );

        // increase radius of second circle
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("r2"),
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [3, 4],
            undefined,
        );

        // increase radius of second circle further
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("r2"),
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            undefined,
            undefined,
        );

        // increase radius of first circle
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("r1"),
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            undefined,
            undefined,
        );

        // make 30-60-90 triangle
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 3 - 2 * Math.sqrt(3),
            y: 5,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [3, 7], [3, 3]);

        // increase radius of first circle
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("r1"),
            core,
        });
        let h = Math.sqrt(16 - 3);
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [3 - Math.sqrt(3), 5 + h],
            [3 - Math.sqrt(3), 5 - h],
        );

        // make circles identical

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 3 - 2 * Math.sqrt(3),
            y: 5,
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            undefined,
            undefined,
        );
    });

    it("intersections between line and circle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <mathInput name="r" prefill="1" />

      <graph>
        <point name="P">(3,4)</point>
        <circle name="c" center="$P" radius="$r" />
        <point name="A">(4,1)</point>
        <point name="B">(4,-4)</point>
        <line name="l" through="$A $B" />
      
        <intersection styleNumber="2" name="int">$l $c</intersection>

      </graph>
    `,
        });

        // start with single intersection
        await check_intersections(core, resolvePathToNodeIdx, [4, 4]);

        // move circle up and to right
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 5,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 6], [4, 4]);

        // increase radius of circle
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("r"),
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 7], [4, 3]);

        // move line point 1
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -2,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // increase radius of circle to make it tangent to line
        await updateMathInputValue({
            latex: "9/\\sqrt{2}",
            componentIdx: await resolvePathToNodeIdx("r"),
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [-0.5, 0.5]);

        // increase radius of circle further
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("r"),
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [-5, 5], [4, -4]);
    });

    it("intersection involving zero or one object returns nothing", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <graph>
        <circle name="c" center="(3,4)" radius="2" />
        <line name="l" through="(4,8) (5,8)" />
      
        <intersection name="int1">$l</intersection>
        <intersection name="int2">$c</intersection>
        <intersection name="int3"></intersection>

      </graph>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[await resolvePathToNodeIdx("int1[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("int2[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("int3[1]")]).eq(
            undefined,
        );
    });

    it("intersections between two line segments", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P1">(1,2)</point>
  <point name="P2">(5,2)</point>
  <point name="P3">(3,2)</point>
  <point name="P4">(4,2)</point>
  
  <lineSegment name="l1" endpoints="$P1 $P2" />
  <lineSegment name="l2" endpoints="$P3 $P4" />
  <intersection name="int" styleNumber="2">$l1$l2</intersection>
  
  </graph>

  `,
        });

        //no intersection when line segments overlap over interval
        await check_intersections(core, resolvePathToNodeIdx);

        //make first line segment vertical
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 3,
            y: 5,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 3,
            y: -5,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [3, 2]);

        // move second line segment to just miss intersection
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: 3.01,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // shift line segment one to intersect again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 4,
            y: 5,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 4,
            y: -5,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 2]);

        // move second line segment to make it just miss again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P4"),
            x: 3.99,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // flip second line segment to make it intersect again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: 6,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 2]);

        // move second line segment to make it just miss again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P4"),
            x: 4.01,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // shift line segment one to intersect again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 5,
            y: 3,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 5,
            y: 1,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [5, 2]);

        // move second line segment to just miss intersection again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: 4.99,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        //make line segments intersect again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: -8,
            y: -7,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 8,
            y: 9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: 4,
            y: 6,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P4"),
            x: -4,
            y: -6,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [2, 3]);

        // move first line segment to make it just miss again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 2.01,
            y: 3,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);
    });

    it("intersections between line and line segment", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P1">(1,2)</point>
  <point name="P2">(2,2)</point>
  <point name="P3">(3,2)</point>
  <point name="P4">(4,2)</point>
  
  <line name="l1" through="$P1 $P2" />
  <lineSegment name="l2" endpoints="$P3 $P4" />
  <intersection name="int" styleNumber="2">$l1$l2</intersection>
  
  </graph>

  `,
        });

        // no intersection when line and line segment coincide
        await check_intersections(core, resolvePathToNodeIdx);

        // make first line vertical
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 3,
            y: 5,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 3,
            y: -5,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [3, 2]);

        // move second line segment to just miss intersection
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: 3.01,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // shift line one to intersect again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 4,
            y: 5,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 4,
            y: -5,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 2]);

        // move second line segment to make it just miss again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P4"),
            x: 3.99,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // flip second line segment to make it intersect again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: 6,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 2]);

        // move second line segment to make it just miss again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P4"),
            x: 4.01,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // shift line one to intersect again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 5,
            y: 3,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 5,
            y: 1,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [5, 2]);

        // move second line segment to just miss intersection again

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: 4.99,
            y: 2,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // make lines intersect again
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: -8,
            y: -7,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P2"),
            x: 8,
            y: 9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: 4,
            y: 6,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P4"),
            x: -4,
            y: -6,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [2, 3]);

        // move first line and still intersects
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P1"),
            x: 2.01,
            y: 3,
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [1.9798994974874389, 2.969849246231158],
        );
    });

    it("intersections between line segment and circle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <mathInput name="r" prefill="1" />

      <graph>
        <point name="P">(3,4)</point>
        <circle name="c" center="$P" radius="$r" />
        <point name="A">(4,3.99)</point>
        <point name="B">(4,-4)</point>
        <lineSegment name="l" endpoints="$A $B" />
      
        <intersection styleNumber="2" name="int">$l $c</intersection>

      </graph>
    `,
        });

        //start with no intersection
        await check_intersections(core, resolvePathToNodeIdx);

        //move line point 1 to intersect
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 4,
            y: 4,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 4]);

        //move circle up and to right
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 4,
            y: 5,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 4]);

        //extend line segment to intersect twice
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 4,
            y: 6,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 6], [4, 4]);

        //increase radius of circle
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("r"),
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 3]);

        //flip line segment to intersect at top
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B"),
            x: 4,
            y: 7,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 7]);

        //extend line segment to intersect twice
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 4,
            y: 3,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, 7], [4, 3]);

        //move line segment
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -0.5,
            y: 0.5,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B"),
            x: 3,
            y: -3,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        //increase radius of circle to make it tangent to line
        await updateMathInputValue({
            latex: "9/\\sqrt{2}",
            componentIdx: await resolvePathToNodeIdx("r"),
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [-0.5, 0.5]);

        //increase radius of circle further
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("r"),
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        //extend bottom of line segment
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B"),
            x: 4,
            y: -4,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [4, -4]);

        //extend top of line segment
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -5,
            y: 5,
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [-5, 5], [4, -4]);
    });

    it("intersections between two polygons", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>

  <triangle name="p1" />

  <rectangle name="p2" styleNumber="3" />
  <intersection name="int" styleNumber="2">$p1$p2</intersection>
  
  </graph>


  `,
        });

        // all three triangle vertices are intersections
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [1, 0],
            [0, 1],
            [0, 0],
        );

        // extending rectangle to upper right does not change intersections
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p2"),
            pointCoords: { 2: [4, 2] },
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [1, 0],
            [0, 1],
            [0, 0],
        );

        // moving bottom of rectangle down removes one intersection
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p2"),
            pointCoords: { 0: [0, -1] },
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [0, 1], [0, 0]);

        // moving left of rectangle left removes all intersections
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p2"),
            pointCoords: { 0: [-1, -1] },
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // move top of triangle upward
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p1"),
            pointCoords: { 0: [0, 4] },
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [0.5, 2], [0, 2]);

        // move right of triangle rightward
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p1"),
            pointCoords: { 1: [6, 0] },
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [4, 4 / 3],
            [3, 2],
            [4, 0],
            [0, 2],
        );
    });

    it("intersections between two polylines", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>

  <polyline name="p1" vertices = "(0,1) (1,0) (0,0)" />

  <polyline name="p2" styleNumber="3" vertices="(0,0) (1,0) (1,1) (0,1)" />
  <intersection name="int" styleNumber="2">$p1$p2</intersection>
  
  </graph>


  `,
        });

        // two of three vertices of triangular polyline are intersections
        // TODO: why isn't the third?
        await check_intersections(core, resolvePathToNodeIdx, [1, 0], [0, 1]);

        // extending polyline2 to right does not change intersections
        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p2"),
            pointCoords: { 1: [4, 0] },
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [1, 0], [0, 1]);

        // extending top of polyline2 up removes one intersection
        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p2"),
            pointCoords: { 3: [0, 4] },
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [1, 0]);

        // extending bottom polyline 2 removes all intersections
        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p2"),
            pointCoords: { 0: [0, -2] },
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx);

        // move top of polyline 1 rightward
        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p1"),
            pointCoords: { 0: [4, 1] },
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [2.5, 0.5]);

        // move middle of polyline1 down
        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p1"),
            pointCoords: { 1: [-1, -4] },
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [2, -1],
            [3.25, 0.25],
        );

        // move other end of polyline1 up
        await movePolyline({
            componentIdx: await resolvePathToNodeIdx("p1"),
            pointCoords: { 2: [1, 6] },
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [2, -1],
            [3.25, 0.25],
            [0.375, 2.875],
        );
    });

    it("intersections between polygon and circle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="r" prefill="1" />

  <graph>
    <point name="P">(0,0)</point>
    <circle name="c" center="$P" radius="$r" />
    <triangle name="p" />

    <intersection name="int" styleNumber="2">$p$c</intersection>
  
  </graph>

  `,
        });

        // two of three triangle vertices are intersections
        await check_intersections(core, resolvePathToNodeIdx, [0, 1], [1, 0]);

        // extend triangle down
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 2: [0, -10] },
            core,
        });

        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [0, 1],
            [1, 0],
            [0.9801980198019802, -0.19801980198019803],
            [0, -1],
        );

        // extend triangle right
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 1: [6, 1] },
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [0, 1], [0, -1]);

        // extend triangle left
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 0: [-6, 1] },
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [0, 1]);

        // Increase radius of circle to 6
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("r"),
            core,
        });
        await check_intersections(
            core,
            resolvePathToNodeIdx,
            [5.916079783099616, 1],
            [-5.916079783099616, 1],
            [5.934993883246796, 0.880822119285793],
            [2.4726494288551146, -5.46680938043229],
            [-5.934993883246796, 0.880822119285793],
            [-2.4726494288551146, -5.46680938043229],
        );

        // Increase radius of circle to 10
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("r"),
            core,
        });
        await check_intersections(core, resolvePathToNodeIdx, [0, -10]);
    });

    it("aslist", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

  <graph>
    <circle name="c" />
    <triangle name="p" />
    <intersection name="int" styleNumber="2">$p$c</intersection>
  </graph>

  <p name="pDefault"><intersection extend="$int"/></p>
  <p name="pNoList"><intersection asList="false" extend="$int"/></p>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pDefault")].stateValues
                .text,
        ).eq("( 0, 1 ), ( 1, 0 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("pNoList")].stateValues
                .text,
        ).eq("( 0, 1 )( 1, 0 )");
    });
});

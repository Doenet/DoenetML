import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("RegionBetweenCurves tag tests @group2", async () => {
    it("region between two curves", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <text name="t">a</text>
  <graph name="g1">
    <function name="f1">sin(x)</function>
    <function name="f2">cos(x)</function>
    <regionBetweenCurves name="r" boundaryValues="-3 5">$f1 $f2</regionBetweenCurves>
  </graph>

  <graph name="g2">
    <regionBetweenCurves extend="$g1.r" name="r" />
  </graph>

  <graph extend="$g2" name="g3" />


  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.value,
        ).eq("a");

        // Not sure what to test until can test jsxgraph output
    });

    it("region between two curves, flipped", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <text name="t">a</text>
  <graph name="g1">
    <curve flipFunction><function name="f1">sin(x)</function></curve>
    <curve flipFunction><function name="f2">cos(x)</function></curve>
    <regionBetweenCurves name="r" boundaryValues="-3 5" flipFunctions>$f1 $f2</regionBetweenCurves>
  </graph>

  <graph name="g2">
    <regionBetweenCurves extend="$g1.r" name="r" />
  </graph>

  <graph extend="$g2" name="g3" />


  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.value,
        ).eq("a");

        // Not sure what to test until can test jsxgraph output
    });

    it("constrain point to region between two curves", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="a" prefill="-6" />
  <mathInput name="b" prefill="4" />
  <graph>
    <function name="f1">sin(pi x/4)</function>
    <function name="f2">cos(pi x/4)</function>
    <regionBetweenCurves name="r" boundaryValues="$a $b">$f1 $f2</regionBetweenCurves>
    <point name="P">
        (0,5)
            <constrainTo>$r</constrainTo>
    </point>
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([0, 1]);

        // move point below
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: -2,
            y: -6,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        let px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        let py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(-2, 1e-12);
        expect(py).closeTo(-1, 1e-12);

        // move point to upper left
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: -9,
            y: 3,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(-6, 1e-12);
        expect(py).closeTo(1, 1e-12);

        // move point to lower left
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: -8,
            y: -6,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(-6, 1e-12);
        expect(py).closeTo(0, 1e-12);

        // move point to left
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: -10,
            y: 0.4,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(-6, 1e-12);
        expect(py).closeTo(0.4, 1e-12);

        // move point to right
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: 10,
            y: -0.2,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(4, 1e-12);
        expect(py).closeTo(-0.2, 1e-12);

        // move point to upper right
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: 5,
            y: 4,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(4, 1e-12);
        expect(py).closeTo(0, 1e-12);

        // move point to lower right
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: 6,
            y: -9,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(4, 1e-12);
        expect(py).closeTo(-1, 1e-12);

        // change boundaries
        await updateMathInputValue({
            latex: "-8",
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });
        await updateMathInputValue({
            latex: "-2",
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(-2, 1e-12);
        expect(py).closeTo(-1, 1e-12);

        // move point to upper right
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: 5,
            y: 4,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(-2, 1e-12);
        expect(py).closeTo(0, 1e-12);

        // move point to middle
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: -5.2,
            y: 0.1,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(-5.2, 1e-12);
        expect(py).closeTo(0.1, 1e-12);

        // move point to top
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: -6,
            y: 3,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(-6, 1e-12);
        expect(py).closeTo(1, 1e-12);

        // move point to left
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P`),
            x: -9.2,
            y: 0.6,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        px =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        py =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(px).closeTo(-8, 1e-12);
        expect(py).closeTo(0.6, 1e-12);
    });

    /**
     * Both region components clamp the point's coordinates into the region
     * (`Math.max(minx, Math.min(maxx, x1))`), and clamping reads `null` as
     * `0`. While the engine evaluated a blank or symbolic coordinate to `null`
     * rather than `NaN`, a point that should have been left alone was silently
     * pulled inside the region — the same defect as `<polygon>`'s
     * `nearestPoint`.
     */
    it("constraining to a region leaves a point with a non-numeric coordinate alone", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" />
    <graph>
      <function name="f">4</function>
      <regionBetweenCurveXAxis name="r" function="$f" boundaryValues="1 3" />
      <point name="blank" x="$mi" y="9">
        <constraints><constrainTo>$r</constrainTo></constraints>
      </point>
      <point name="symbolic" x="a" y="9">
        <constraints><constrainTo>$r</constrainTo></constraints>
      </point>
      <point name="numeric" x="2" y="9">
        <constraints><constrainTo>$r</constrainTo></constraints>
      </point>
    </graph>
    `,
        });

        async function coordsOf(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[
                await resolvePathToNodeIdx(name)
            ].stateValues.xs.map((v: any) => v.tree);
        }

        // The control: a numeric point really is clamped into the region.
        expect(await coordsOf("numeric")).eqls([2, 4]);
        expect(await coordsOf("blank")).eqls(["\uff3f", 9]);
        expect(await coordsOf("symbolic")).eqls(["a", 9]);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await coordsOf("blank")).eqls([2, 4]);
    });
});

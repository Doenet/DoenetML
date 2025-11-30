import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("RegionBetweenCurves tag tests", async () => {
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
});

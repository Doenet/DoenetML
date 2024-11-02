import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import { movePoint, updateMathInputValue } from "../utils/actions";
import { createFunctionFromDefinition } from "@doenet/utils";
import me from "math-expressions";
import Core from "../../Core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

function constantFromAst(tree) {
    //@ts-ignore
    return me.fromAst(tree).evaluate_to_constant();
}

describe("Function tag tests", async () => {
    it("function with nothing", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(0, 1e-12);
        expect(f(1)).closeTo(0, 1e-12);
        expect(f(2)).closeTo(0, 1e-12);
        expect(f(-1)).closeTo(0, 1e-12);
        expect(f(-2)).closeTo(0, 1e-12);
    });

    it("function with single minimum as number", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(2)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(2, 1e-12);
        expect(f(1)).closeTo(2 + 1, 1e-12);
        expect(f(2)).closeTo(2 + 4, 1e-12);
        expect(f(-1)).closeTo(2 + 1, 1e-12);
        expect(f(-2)).closeTo(2 + 4, 1e-12);
    });

    it("function with single minimum as half-empty tuple", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="( ,2)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(2, 1e-12);
        expect(f(1)).closeTo(2 + 1, 1e-12);
        expect(f(2)).closeTo(2 + 4, 1e-12);
        expect(f(-1)).closeTo(2 + 1, 1e-12);
        expect(f(-2)).closeTo(2 + 4, 1e-12);
    });

    it("function with single minimum as half-empty tuple (no space)", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(,2)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(2, 1e-12);
        expect(f(1)).closeTo(2 + 1, 1e-12);
        expect(f(2)).closeTo(2 + 4, 1e-12);
        expect(f(-1)).closeTo(2 + 1, 1e-12);
        expect(f(-2)).closeTo(2 + 4, 1e-12);
    });

    it("function with single minimum, change x-scale", async () => {
        let core = await createTestCore({
            doenetML: `
    <function xscale="3" minima="(2)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(2, 1e-12);
        expect(f(3)).closeTo(2 + 1, 1e-12);
        expect(f(6)).closeTo(2 + 4, 1e-12);
        expect(f(-3)).closeTo(2 + 1, 1e-12);
        expect(f(-6)).closeTo(2 + 4, 1e-12);
    });

    it("function with single minimum, change x-scale and y-scale", async () => {
        let core = await createTestCore({
            doenetML: `
    <function xscale="3" yscale="5" minima="(2)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(2, 1e-12);
        expect(f(3)).closeTo(2 + 1 * 5, 1e-12);
        expect(f(6)).closeTo(2 + 4 * 5, 1e-12);
        expect(f(-3)).closeTo(2 + 1 * 5, 1e-12);
        expect(f(-6)).closeTo(2 + 4 * 5, 1e-12);
    });

    it("function with single maximum", async () => {
        let core = await createTestCore({
            doenetML: `
    <function maxima="(3)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(3, 1e-12);
        expect(f(1)).closeTo(3 - 1, 1e-12);
        expect(f(2)).closeTo(3 - 4, 1e-12);
        expect(f(-1)).closeTo(3 - 1, 1e-12);
        expect(f(-2)).closeTo(3 - 4, 1e-12);
    });

    it("function with single maximum, change x-scale", async () => {
        let core = await createTestCore({
            doenetML: `
    <function xscale="3" maxima="(3)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(3, 1e-12);
        expect(f(3)).closeTo(3 - 1, 1e-12);
        expect(f(6)).closeTo(3 - 4, 1e-12);
        expect(f(-3)).closeTo(3 - 1, 1e-12);
        expect(f(-6)).closeTo(3 - 4, 1e-12);
    });

    it("function with single maximum, change x-scale and y-scale", async () => {
        let core = await createTestCore({
            doenetML: `
    <function xscale="3" yscale="5" maxima="(3)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(3, 1e-12);
        expect(f(3)).closeTo(3 - 1 * 5, 1e-12);
        expect(f(6)).closeTo(3 - 4 * 5, 1e-12);
        expect(f(-3)).closeTo(3 - 1 * 5, 1e-12);
        expect(f(-6)).closeTo(3 - 4 * 5, 1e-12);
    });

    it("function with single minimum, specify location as half-empty tuple", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(2, )" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(4, 1e-12);
        expect(f(1)).closeTo(1, 1e-12);
        expect(f(2)).closeTo(0, 1e-12);
        expect(f(3)).closeTo(1, 1e-12);
        expect(f(4)).closeTo(4, 1e-12);
    });

    it("function with single minimum, specify location as half-empty tuple (no space)", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(2,)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(4, 1e-12);
        expect(f(1)).closeTo(1, 1e-12);
        expect(f(2)).closeTo(0, 1e-12);
        expect(f(3)).closeTo(1, 1e-12);
        expect(f(4)).closeTo(4, 1e-12);
    });

    it("function with single minimum, specify location and value as tuple", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(2, -3)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(4 - 3, 1e-12);
        expect(f(1)).closeTo(1 - 3, 1e-12);
        expect(f(2)).closeTo(0 - 3, 1e-12);
        expect(f(3)).closeTo(1 - 3, 1e-12);
        expect(f(4)).closeTo(4 - 3, 1e-12);
    });

    it("function with single minimum, specify location and value as tuple", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(2, -3)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(4 - 3, 1e-12);
        expect(f(1)).closeTo(1 - 3, 1e-12);
        expect(f(2)).closeTo(0 - 3, 1e-12);
        expect(f(3)).closeTo(1 - 3, 1e-12);
        expect(f(4)).closeTo(4 - 3, 1e-12);
    });

    it("function with single extremum, specify location and value as tuple", async () => {
        let core = await createTestCore({
            doenetML: `
    <function extrema="(2, -3)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(-4 - 3, 1e-12);
        expect(f(1)).closeTo(-1 - 3, 1e-12);
        expect(f(2)).closeTo(0 - 3, 1e-12);
        expect(f(3)).closeTo(-1 - 3, 1e-12);
        expect(f(4)).closeTo(-4 - 3, 1e-12);
    });

    it("function with min and max", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(0,0)" maxima="(1,1)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(0, 1e-12);
        expect(f(1)).closeTo(1, 1e-12);
        expect(f(0.5)).closeTo(0.5, 1e-12);
        // like parabola to left of minimum
        expect(f(-1)).closeTo(1, 1e-12);
        expect(f(-2)).closeTo(4, 1e-12);
        expect(f(-3)).closeTo(9, 1e-12);
        // like parabola to right of maximum
        expect(f(2)).closeTo(0, 1e-12);
        expect(f(3)).closeTo(-3, 1e-12);
        expect(f(4)).closeTo(-8, 1e-12);
    });

    it("function with min and extremum", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(0,0)" extrema="(1,1)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(0, 1e-12);
        expect(f(1)).closeTo(1, 1e-12);
        expect(f(0.5)).closeTo(0.5, 1e-12);
        // like parabola to left of minimum
        expect(f(-1)).closeTo(1, 1e-12);
        expect(f(-2)).closeTo(4, 1e-12);
        expect(f(-3)).closeTo(9, 1e-12);
        // like parabola to right of maximum
        expect(f(2)).closeTo(0, 1e-12);
        expect(f(3)).closeTo(-3, 1e-12);
        expect(f(4)).closeTo(-8, 1e-12);
    });

    it("function with extremum and max", async () => {
        let core = await createTestCore({
            doenetML: `
    <function extrema="(0,0)" maxima="(1,1)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(0, 1e-12);
        expect(f(1)).closeTo(1, 1e-12);
        expect(f(0.5)).closeTo(0.5, 1e-12);
        // like parabola to left of minimum
        expect(f(-1)).closeTo(1, 1e-12);
        expect(f(-2)).closeTo(4, 1e-12);
        expect(f(-3)).closeTo(9, 1e-12);
        // like parabola to right of maximum
        expect(f(2)).closeTo(0, 1e-12);
        expect(f(3)).closeTo(-3, 1e-12);
        expect(f(4)).closeTo(-8, 1e-12);
    });

    it("function two extrema, same height", async () => {
        let core = await createTestCore({
            doenetML: `
    <function extrema="(0,0) (1,0)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(0, 1e-12);
        expect(f(1)).closeTo(0, 1e-12);
        expect(f(0.5)).closeTo(-1, 1e-12);
        // like parabola to left of maximum
        expect(f(-1)).closeTo(-1, 1e-12);
        expect(f(-2)).closeTo(-4, 1e-12);
        expect(f(-3)).closeTo(-9, 1e-12);
        // like parabola to right of maximum
        expect(f(2)).closeTo(-1, 1e-12);
        expect(f(3)).closeTo(-4, 1e-12);
        expect(f(4)).closeTo(-9, 1e-12);
    });

    it("function two extrema, second higher", async () => {
        let core = await createTestCore({
            doenetML: `
    <function extrema="(0,0) (1,2)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(0, 1e-12);
        expect(f(1)).closeTo(2, 1e-12);
        expect(f(0.5)).closeTo(1, 1e-12);
        // like parabola to left of minimum
        expect(f(-1)).closeTo(1, 1e-12);
        expect(f(-2)).closeTo(4, 1e-12);
        expect(f(-3)).closeTo(9, 1e-12);
        // like parabola to right of maximum
        expect(f(2)).closeTo(1, 1e-12);
        expect(f(3)).closeTo(-2, 1e-12);
        expect(f(4)).closeTo(-7, 1e-12);
    });

    it("function two extrema, second lower", async () => {
        let core = await createTestCore({
            doenetML: `
    <function extrema="(0,0) (1,-2)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(0, 1e-12);
        expect(f(1)).closeTo(-2, 1e-12);
        expect(f(0.5)).closeTo(-1, 1e-12);
        // like parabola to left of maximum
        expect(f(-1)).closeTo(-1, 1e-12);
        expect(f(-2)).closeTo(-4, 1e-12);
        expect(f(-3)).closeTo(-9, 1e-12);
        // like parabola to right of minimum
        expect(f(2)).closeTo(-1, 1e-12);
        expect(f(3)).closeTo(2, 1e-12);
        expect(f(4)).closeTo(7, 1e-12);
    });

    it("function with two minima", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima='(-2, ) (2, 1)' name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-2)).closeTo(1, 1e-12);
        expect(f(2)).closeTo(1, 1e-12);
        expect(f(0)).closeTo(2, 1e-12);
        // like parabola to left of minimum
        expect(f(-3)).closeTo(1 + 1, 1e-12);
        expect(f(-4)).closeTo(4 + 1, 1e-12);
        expect(f(-5)).closeTo(9 + 1, 1e-12);
        // like parabola to right of minimum
        expect(f(3)).closeTo(1 + 1, 1e-12);
        expect(f(4)).closeTo(4 + 1, 1e-12);
        expect(f(5)).closeTo(9 + 1, 1e-12);
    });

    it("function with two minima and maximum with specified height", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(-2, )  (2,1)" maxima="( , 5)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-2)).closeTo(1, 1e-12);
        expect(f(2)).closeTo(1, 1e-12);
        expect(f(0)).closeTo(5, 1e-12);
        // like parabola to left of minimum
        expect(f(-3)).closeTo(1 + 1, 1e-12);
        expect(f(-4)).closeTo(4 + 1, 1e-12);
        expect(f(-5)).closeTo(9 + 1, 1e-12);
        // like parabola to right of minimum
        expect(f(3)).closeTo(1 + 1, 1e-12);
        expect(f(4)).closeTo(4 + 1, 1e-12);
        expect(f(5)).closeTo(9 + 1, 1e-12);
    });

    it("function with two minima and extremum with specified height", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(-2,) (2, 1) " extrema="(,5)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-2)).closeTo(1, 1e-12);
        expect(f(2)).closeTo(1, 1e-12);
        expect(f(0)).closeTo(5, 1e-12);
        // like parabola to left of minimum
        expect(f(-3)).closeTo(1 + 1, 1e-12);
        expect(f(-4)).closeTo(4 + 1, 1e-12);
        expect(f(-5)).closeTo(9 + 1, 1e-12);
        // like parabola to right of minimum
        expect(f(3)).closeTo(1 + 1, 1e-12);
        expect(f(4)).closeTo(4 + 1, 1e-12);
        expect(f(5)).closeTo(9 + 1, 1e-12);
    });

    it("function with maximum and higher minimum", async () => {
        let core = await createTestCore({
            doenetML: `
    <function maxima="(-2,1)" minima="(2,2)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-2)).closeTo(1, 1e-12);
        expect(f(-3)).closeTo(0, 1e-12);
        expect(f(-2 + 4 / 3)).closeTo(0, 1e-12);

        expect(f(2)).closeTo(2, 1e-12);
        expect(f(3)).closeTo(3, 1e-12);
        expect(f(2 - 4 / 3)).closeTo(3, 1e-12);

        expect(f(0)).closeTo(1.5, 1e-12);
    });

    it("function with maximum and higher extremum", async () => {
        let core = await createTestCore({
            doenetML: `
    <function maxima="(-2,1)" extrema="(2,2)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-2)).closeTo(1, 1e-12);
        expect(f(-3)).closeTo(0, 1e-12);
        expect(f(0)).closeTo(0, 1e-12);

        expect(f(2)).closeTo(2, 1e-12);
        expect(f(3)).closeTo(1, 1e-12);
    });

    it("function with minimum and lower maximum", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(-2,3)" maxima="(2,2)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-2)).closeTo(3, 1e-12);
        expect(f(-3)).closeTo(4, 1e-12);
        expect(f(-2 + 4 / 3)).closeTo(4, 1e-12);

        expect(f(2)).closeTo(2, 1e-12);
        expect(f(3)).closeTo(1, 1e-12);
        expect(f(2 - 4 / 3)).closeTo(1, 1e-12);

        expect(f(0)).closeTo(2.5, 1e-12);
    });

    it("function with minimum and lower extremum", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(-2,3)" extrema="(2,2)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-2)).closeTo(3, 1e-12);
        expect(f(-3)).closeTo(4, 1e-12);
        expect(f(0)).closeTo(4, 1e-12);

        expect(f(2)).closeTo(2, 1e-12);
        expect(f(3)).closeTo(3, 1e-12);
    });

    it("function with extremum and lower maximum", async () => {
        let core = await createTestCore({
            doenetML: `
    <function extrema="(-2,3)" maxima="(2,2)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-2)).closeTo(3, 1e-12);
        expect(f(-3)).closeTo(2, 1e-12);
        expect(f(0)).closeTo(1, 1e-12);

        expect(f(2)).closeTo(2, 1e-12);
        expect(f(3)).closeTo(1, 1e-12);
    });

    it("functions with copied extrema that overwrite attributes", async () => {
        let core = await createTestCore({
            doenetML: `
    <extremum name="ex1" location="3" value="-2" />
    <extremum copySource="ex1" location="5" name="ex2" />
    <extremum copySource="ex1" value="2" name="ex3" />
    
    <graph>
      <function extrema="$ex1 $ex2" name="f" />
      <function extrema="$ex2 $ex3" name="g"/>
    </graph>
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(3)).closeTo(-2, 1e-12);
        expect(f(5)).closeTo(-2, 1e-12);

        expect(f(2)).closeTo(-3, 1e-12);
        expect(f(4)).closeTo(-3, 1e-12);
        expect(f(6)).closeTo(-3, 1e-12);

        let g = await core.components!["/g"].state.numericalf.value;

        expect(g(3)).closeTo(2, 1e-12);
        expect(g(5)).closeTo(-2, 1e-12);

        expect(g(2)).closeTo(1, 1e-12);
        expect(g(4)).closeTo(0, 1e-12);
        expect(g(6)).closeTo(-1, 1e-12);
    });

    it("copy function and overwrite extrema", async () => {
        let core = await createTestCore({
            doenetML: `
      <function minima="(2,3)" maxima="(4,4)" name="f" />
      <function copySource="f" maxima="(0,4)" name="g" styleNumber="2" />
      <function copySource="f" minima="(6,3)" name="h" styleNumber="3" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(2)).closeTo(3, 1e-12);
        expect(f(4)).closeTo(4, 1e-12);

        expect(f(1)).closeTo(4, 1e-12);
        expect(f(3)).closeTo(3.5, 1e-12);
        expect(f(5)).closeTo(3, 1e-12);

        let g = await core.components!["/g"].state.numericalf.value;

        expect(g(0)).closeTo(4, 1e-12);
        expect(g(2)).closeTo(3, 1e-12);

        expect(g(-1)).closeTo(3, 1e-12);
        expect(g(1)).closeTo(3.5, 1e-12);
        expect(g(3)).closeTo(4, 1e-12);

        let h = await core.components!["/h"].state.numericalf.value;

        expect(h(4)).closeTo(4, 1e-12);
        expect(h(6)).closeTo(3, 1e-12);

        expect(h(3)).closeTo(3, 1e-12);
        expect(h(5)).closeTo(3.5, 1e-12);
        expect(h(7)).closeTo(4, 1e-12);
    });

    it("function with maximum through points", async () => {
        let core = await createTestCore({
            doenetML: `
    <function maxima="(-2,2)" through="(-5,0) (-6,-1) (0, 0) (1, 0)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-2)).closeTo(2, 1e-12);
        expect(f(-5)).closeTo(0, 1e-12);
        expect(f(-6)).closeTo(-1, 1e-12);

        // extrapolates linearly
        let slope = f(-6) - f(-7);
        expect(f(-8)).closeTo(-1 - slope * 2, 1e-12);
        expect(f(-9)).closeTo(-1 - slope * 3, 1e-12);
        expect(f(-10)).closeTo(-1 - slope * 4, 1e-12);

        expect(f(0)).closeTo(0, 1e-12);
        expect(f(1)).closeTo(0, 1e-12);
        // extrapolates linearly
        expect(f(2)).closeTo(0, 1e-12);
        expect(f(3)).closeTo(0, 1e-12);
    });

    it("function with single through point", async () => {
        let core = await createTestCore({
            doenetML: `
    <function through="(-6,-1)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-6)).closeTo(-1, 1e-12);
        expect(f(-2)).closeTo(-1, 1e-12);
        expect(f(-12)).closeTo(-1, 1e-12);
        expect(f(12)).closeTo(-1, 1e-12);
    });

    it("function with single through point with slope", async () => {
        let core = await createTestCore({
            doenetML: `
    <function through="(-6,-1)" throughSlopes="3" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-6)).closeTo(-1, 1e-12);
        expect(f(-2)).closeTo(-1 + 3 * (-2 + 6), 1e-12);
        expect(f(-12)).closeTo(-1 + 3 * (-12 + 6), 1e-12);
        expect(f(12)).closeTo(-1 + 3 * (12 + 6), 1e-12);
    });

    it("function with single through point with dynamic slope", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>slope: <mathinput name="mi" /></p>
    <function throughSlopes="$mi" through="(-6,-1)" name="f" />
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-6)).closeTo(-1, 1e-12);
        expect(f(-2)).closeTo(-1 + 0 * (-2 + 6), 1e-12);
        expect(f(-12)).closeTo(-1 + 0 * (-12 + 6), 1e-12);
        expect(f(12)).closeTo(-1 + 0 * (12 + 6), 1e-12);

        await updateMathInputValue({ latex: "2", name: "/mi", core });
        f = await core.components!["/f"].state.numericalf.value;

        expect(f(-6)).closeTo(-1, 1e-12);
        expect(f(-2)).closeTo(-1 + 2 * (-2 + 6), 1e-12);
        expect(f(-12)).closeTo(-1 + 2 * (-12 + 6), 1e-12);
        expect(f(12)).closeTo(-1 + 2 * (12 + 6), 1e-12);

        await updateMathInputValue({ latex: "-3", name: "/mi", core });
        f = await core.components!["/f"].state.numericalf.value;

        expect(f(-6)).closeTo(-1, 1e-12);
        expect(f(-2)).closeTo(-1 - 3 * (-2 + 6), 1e-12);
        expect(f(-12)).closeTo(-1 - 3 * (-12 + 6), 1e-12);
        expect(f(12)).closeTo(-1 - 3 * (12 + 6), 1e-12);

        await updateMathInputValue({ latex: "", name: "/mi", core });
        f = await core.components!["/f"].state.numericalf.value;

        expect(f(-6)).closeTo(-1, 1e-12);
        expect(f(-2)).closeTo(-1 + 0 * (-2 + 6), 1e-12);
        expect(f(-12)).closeTo(-1 + 0 * (-12 + 6), 1e-12);
        expect(f(12)).closeTo(-1 + 0 * (12 + 6), 1e-12);
    });

    it("function with two through points with dynamic slope", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>slope: <mathinput name="mi" /></p>
    <function throughSlopes="$mi $mi" through="(-6,-1) (3,8)" name="f" />
    `,
        });

        // with undefined slope, get line through points

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-6)).closeTo(-1, 1e-12);
        expect(f(-2)).closeTo(-1 + 1 * (-2 + 6), 1e-12);
        expect(f(-12)).closeTo(-1 + 1 * (-12 + 6), 1e-12);
        expect(f(12)).closeTo(-1 + 1 * (12 + 6), 1e-12);

        await updateMathInputValue({ latex: "2", name: "/mi", core });
        f = await core.components!["/f"].state.numericalf.value;

        expect(f(-6 - 0.01)).closeTo(-1 - 0.01 * 2, 1e-3);
        expect(f(-6)).closeTo(-1, 1e-12);
        expect(f(-6 + 0.01)).closeTo(-1 + 0.01 * 2, 1e-3);

        expect(f(3 - 0.01)).closeTo(8 - 0.01 * 2, 1e-3);
        expect(f(3)).closeTo(8, 1e-12);
        expect(f(3 + 0.01)).closeTo(8 + 0.01 * 2, 1e-3);

        // extrapolate linearly
        expect(f(-6 - 3)).closeTo(-1 - 3 * 2, 1e-12);
        expect(f(3 + 3)).closeTo(8 + 3 * 2, 1e-12);

        await updateMathInputValue({ latex: "-3", name: "/mi", core });
        f = await core.components!["/f"].state.numericalf.value;

        expect(f(-6 - 0.01)).closeTo(-1 - 0.01 * -3, 1e-3);
        expect(f(-6)).closeTo(-1, 1e-12);
        expect(f(-6 + 0.01)).closeTo(-1 + 0.01 * -3, 1e-3);

        expect(f(3 - 0.01)).closeTo(8 - 0.01 * -3, 1e-3);
        expect(f(3)).closeTo(8, 1e-12);
        expect(f(3 + 0.01)).closeTo(8 + 0.01 * -3, 1e-3);

        // extrapolate linearly
        expect(f(-6 - 3)).closeTo(-1 - 3 * -3, 1e-12);
        expect(f(3 + 3)).closeTo(8 + 3 * -3, 1e-12);

        await updateMathInputValue({ latex: "", name: "/mi", core });
        f = await core.components!["/f"].state.numericalf.value;

        expect(f(-6)).closeTo(-1, 1e-12);
        expect(f(-2)).closeTo(-1 + 1 * (-2 + 6), 1e-12);
        expect(f(-12)).closeTo(-1 + 1 * (-12 + 6), 1e-12);
        expect(f(12)).closeTo(-1 + 1 * (12 + 6), 1e-12);
    });

    it("function through three points", async () => {
        let core = await createTestCore({
            doenetML: `
    <function through="(0,2) (2,1) (3,2)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(2, 1e-12);
        expect(f(2)).closeTo(1, 1e-12);
        expect(f(3)).closeTo(2, 1e-12);
        // extrapolate linearly
        let slope = f(4) - f(3);
        expect(f(5)).closeTo(2 + slope * 2, 1e-12);
        expect(f(6)).closeTo(2 + slope * 3, 1e-12);
        expect(f(7)).closeTo(2 + slope * 4, 1e-12);
        slope = f(0) - f(-1);
        expect(f(-2)).closeTo(2 - slope * 2, 1e-12);
        expect(f(-3)).closeTo(2 - slope * 3, 1e-12);
        expect(f(-4)).closeTo(2 - slope * 4, 1e-12);
    });

    it("function through three points, label with math", async () => {
        let core = await createTestCore({
            doenetML: `
    <function through="(0,2) (2,1) (3,2)" name="f" >
      <label><m>\\int f</m></label>
    </function>
    </graph>
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).closeTo(2, 1e-12);
        expect(f(2)).closeTo(1, 1e-12);
        expect(f(3)).closeTo(2, 1e-12);
        // extrapolate linearly
        let slope = f(4) - f(3);
        expect(f(5)).closeTo(2 + slope * 2, 1e-12);
        expect(f(6)).closeTo(2 + slope * 3, 1e-12);
        expect(f(7)).closeTo(2 + slope * 4, 1e-12);
        slope = f(0) - f(-1);
        expect(f(-2)).closeTo(2 - slope * 2, 1e-12);
        expect(f(-3)).closeTo(2 - slope * 3, 1e-12);
        expect(f(-4)).closeTo(2 - slope * 4, 1e-12);

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.label).eq("\\(\\int f\\)");
    });

    it("function through three points with slopes", async () => {
        let core = await createTestCore({
            doenetML: `
    <point>(2,1)</point>
    <function through="(0,2) (2,1) (3,2)" throughSlopes="0.5 2 -1" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(-0.01)).closeTo(2 - 0.01 * 0.5, 1e-3);
        expect(f(0)).closeTo(2, 1e-12);
        expect(f(0.01)).closeTo(2 + 0.01 * 0.5, 1e-3);

        expect(f(2 - 0.01)).closeTo(1 - 0.01 * 2, 1e-3);
        expect(f(2)).closeTo(1, 1e-12);
        expect(f(2 + 0.01)).closeTo(1 + 0.01 * 2, 1e-3);

        expect(f(3 - 0.01)).closeTo(2 - 0.01 * -1, 1e-3);
        expect(f(3)).closeTo(2, 1e-12);
        expect(f(3 + 0.01)).closeTo(2 + 0.01 * -1, 1e-3);

        // extrapolate linearly
        let slope = -1;
        expect(f(5)).closeTo(2 + slope * 2, 1e-12);
        expect(f(6)).closeTo(2 + slope * 3, 1e-12);
        expect(f(7)).closeTo(2 + slope * 4, 1e-12);
        slope = 0.5;
        expect(f(-2)).closeTo(2 - slope * 2, 1e-12);
        expect(f(-3)).closeTo(2 - slope * 3, 1e-12);
        expect(f(-4)).closeTo(2 - slope * 4, 1e-12);
    });

    it("function with conflicting points", async () => {
        let core = await createTestCore({
            doenetML: `
    <function through="(0,2) (2,1) (2,2)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        expect(f(0)).eqls(NaN);
        expect(f(1)).eqls(NaN);
        expect(f(2)).eqls(NaN);

        // calculate line/char begin on all warnings
        core.postErrorWarnings();

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Function contains two points with locations too close together. Can't define function`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(53);
    });

    it("function with non-numerical points and slope", async () => {
        let core = await createTestCore({
            doenetML: `
    <function through="(1,2) (a,b)" extrema="(5,6) (2,a)" maxima="(c,3)" minima="(d,e)" throughSlopes="5a" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        let fleft = (x) => 6 - (x - 5) ** 2 / 4;
        let fright = (x) => 6 - (x - 5) ** 2;
        expect(f(5)).closeTo(6, 1e-12);
        expect(f(1)).closeTo(2, 1e-12);
        expect(f(-2)).closeTo(fleft(-2), 1e-12);
        expect(f(7)).closeTo(fright(7), 1e-12);

        // calculate line/char begin on all warnings
        core.postErrorWarnings();

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(5);

        expect(errorWarnings.warnings[0].message).contain(
            `Ignoring non-numerical maximum of function`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(118);

        expect(errorWarnings.warnings[1].message).contain(
            `Ignoring non-numerical minimum of function`,
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(118);

        expect(errorWarnings.warnings[2].message).contain(
            `Ignoring non-numerical extremum of function`,
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(118);

        expect(errorWarnings.warnings[3].message).contain(
            `Ignoring non-numerical slope of function`,
        );
        expect(errorWarnings.warnings[3].level).eq(1);
        expect(errorWarnings.warnings[3].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[3].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[3].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[3].doenetMLrange.charEnd).eq(118);

        expect(errorWarnings.warnings[4].message).contain(
            `Ignoring non-numerical point of function`,
        );
        expect(errorWarnings.warnings[4].level).eq(1);
        expect(errorWarnings.warnings[4].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[4].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[4].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[4].doenetMLrange.charEnd).eq(118);
    });

    it("function with empty maximum", async () => {
        let core = await createTestCore({
            doenetML: `
      <function maxima="(,)" minima="(4,)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        let factual = (x) => (x - 4) ** 2;
        expect(f(4)).closeTo(0, 1e-12);
        expect(f(-2)).closeTo(factual(-2), 1e-12);
        expect(f(7)).closeTo(factual(7), 1e-12);

        // calculate line/char begin on all warnings
        core.postErrorWarnings();

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Ignoring empty maximum of function`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(7);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(54);
    });

    it("copy function and overwrite through points and slopes", async () => {
        let core = await createTestCore({
            doenetML: `
    <function through="(0,2) (2,1) (3,2)" name="f" styleNumber="1" />
    <function copySource="f" through="(1,5) (4,2)" name="g" styleNumber="2" />
    <function copySource="f" throughslopes="1 2 -3" name="h" styleNumber="3" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let f = createFunctionFromDefinition(
            stateVariables["/f"].stateValues.fDefinitions[0],
        );
        expect(f(0)).closeTo(2, 1e-12);
        expect(f(2)).closeTo(1, 1e-12);
        expect(f(3)).closeTo(2, 1e-12);
        // extrapolate linearly
        let slope = f(4) - f(3);
        expect(f(5)).closeTo(2 + slope * 2, 1e-12);
        expect(f(6)).closeTo(2 + slope * 3, 1e-12);
        expect(f(7)).closeTo(2 + slope * 4, 1e-12);
        slope = f(0) - f(-1);
        expect(f(-2)).closeTo(2 - slope * 2, 1e-12);
        expect(f(-3)).closeTo(2 - slope * 3, 1e-12);
        expect(f(-4)).closeTo(2 - slope * 4, 1e-12);

        let g = createFunctionFromDefinition(
            stateVariables["/g"].stateValues.fDefinitions[0],
        );
        expect(g(1)).closeTo(5, 1e-12);
        expect(g(4)).closeTo(2, 1e-12);
        // linear function
        slope = g(1) - g(0);
        expect(g(2)).closeTo(5 + slope * 1, 1e-12);
        expect(g(3)).closeTo(5 + slope * 2, 1e-12);
        expect(g(4)).closeTo(5 + slope * 3, 1e-12);
        expect(g(0)).closeTo(5 + slope * -1, 1e-12);
        expect(g(-1)).closeTo(5 + slope * -2, 1e-12);
        expect(g(-2)).closeTo(5 + slope * -3, 1e-12);

        let h = createFunctionFromDefinition(
            stateVariables["/h"].stateValues.fDefinitions[0],
        );
        expect(h(0)).closeTo(2, 1e-12);
        expect(h(2)).closeTo(1, 1e-12);
        expect(h(3)).closeTo(2, 1e-12);
        // extrapolate linearly at given slopes
        slope = -3;
        expect(h(5)).closeTo(2 + slope * 2, 1e-12);
        expect(h(6)).closeTo(2 + slope * 3, 1e-12);
        expect(h(7)).closeTo(2 + slope * 4, 1e-12);
        slope = 1;
        expect(h(-2)).closeTo(2 - slope * 2, 1e-12);
        expect(h(-3)).closeTo(2 - slope * 3, 1e-12);
        expect(h(-4)).closeTo(2 - slope * 4, 1e-12);
        // close to given slope near middle point
        slope = 2;
        expect(h(2.0001)).closeTo(1 + slope * 0.0001, 1e-7);
        expect(h(1.9999)).closeTo(1 + slope * -0.0001, 1e-7);
    });

    it("check monotonicity", async () => {
        let core = await createTestCore({
            doenetML: `
    <function through="(-5,0) (-4,0.1) (-3,0.3) (-2,3) (-1,3.1) (0,3.2) (1,5)" maxima="(6,6)" name="f" />
   `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        for (let x = -5; x <= 6; x += 0.1) {
            expect(f(x - 0.1)).lessThan(f(x));
        }
        expect(f(-5)).closeTo(0, 1e-12);
        expect(f(-4)).closeTo(0.1, 1e-12);
        expect(f(-3)).closeTo(0.3, 1e-12);
        expect(f(-2)).closeTo(3, 1e-12);
        expect(f(-1)).closeTo(3.1, 1e-12);
        expect(f(0)).closeTo(3.2, 1e-12);
        expect(f(1)).closeTo(5, 1e-12);
        expect(f(6)).closeTo(6, 1e-12);
        expect(f(7)).closeTo(5, 1e-12);
        expect(f(8)).closeTo(2, 1e-12);
    });

    it("point constrained to function", async () => {
        let core = await createTestCore({
            doenetML: `
    <function maxima="(5,6)" through="(0,5) (8,4)" name="f" />

    <point x="1" y="2" name="P">
      <constraints>
        <constrainTo>$f</constrainTo>
      </constraints>
    </point>
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let p = stateVariables["/P"];

        let x = constantFromAst(p.stateValues.xs[0]);
        let y = constantFromAst(p.stateValues.xs[1]);

        expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: -8, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        // @ts-ignore
        x = constantFromAst(p.stateValues.xs[0]);
        // @ts-ignore
        y = constantFromAst(p.stateValues.xs[1]);

        expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: 8, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        // @ts-ignore
        x = constantFromAst(p.stateValues.xs[0]);
        // @ts-ignore
        y = constantFromAst(p.stateValues.xs[1]);

        expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1e-5);
    });

    it("point constrained to function, symbolic initial x", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">x^2</function>
    <point x="sqrt(2)" y="1" name="P">
      <constraints>
        <constrainTo>
          $f
        </constrainTo>
      </constraints>
    </point>
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let p = stateVariables["/P"];

        expect(constantFromAst(p.stateValues.xs[0])).closeTo(
            Math.sqrt(2),
            1e-6,
        );
        expect(constantFromAst(p.stateValues.xs[1])).closeTo(2, 1e-6);

        await movePoint({ name: "/P", x: -2, y: 2, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        expect(constantFromAst(p.stateValues.xs[0])).closeTo(-2, 1e-6);
        expect(constantFromAst(p.stateValues.xs[1])).closeTo(4, 1e-6);
    });

    it("point constrained to function, restrict to closed domain", async () => {
        let core = await createTestCore({
            doenetML: `
    <function maxima="(5,6)" through="(0,5) (8,4)" domain="[-4,7]" name="f" />

    <point x="1" y="2" name="P">
      <constraints>
        <constrainTo>$f</constrainTo>
      </constraints>
    </point>
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let p = stateVariables["/P"];

        let x = constantFromAst(p.stateValues.xs[0]);
        let y = constantFromAst(p.stateValues.xs[1]);

        expect(x).closeTo(1, 1e-12);
        expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: -8, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).closeTo(-4, 1e-12);
        expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: 6, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).closeTo(6, 1e-12);
        expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: 8, y: -4, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).closeTo(7, 1e-12);
        expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1e-5);
    });

    it("point constrained to function, restrict to open domain", async () => {
        let core = await createTestCore({
            doenetML: `
    <function maxima="(5,6)" through="(0,5) (8,4)" domain="(-4,7)" name="f" />

    <point x="1" y="2" name="P">
      <constraints>
        <constrainTo>$f</constrainTo>
      </constraints>
    </point>
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let p = stateVariables["/P"];

        let x = constantFromAst(p.stateValues.xs[0]);
        let y = constantFromAst(p.stateValues.xs[1]);

        expect(x).closeTo(1, 1e-12);
        expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: -8, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).greaterThan(-4 + 1e-12);
        expect(x).lessThan(-4 + 1e-3);
        expect(6 - ((x - 5) * (x - 5)) / 25).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: 6, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).closeTo(6, 1e-12);
        expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: 8, y: -4, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).lessThan(7 - 1e-12);
        expect(x).greaterThan(7 - 1e-3);
        expect(6 - (x - 5) * (x - 5) * (2 / 9)).closeTo(y, 1e-5);
    });

    async function test_point_constrained_function_implicit_domain(core) {
        let f = (x) => Math.sqrt(x) * Math.sqrt(5 - x);

        let stateVariables = await returnAllStateVariables(core);

        let p = stateVariables["/P"];
        expect(constantFromAst(p.stateValues.xs[0])).closeTo(1, 1e-6);
        expect(constantFromAst(p.stateValues.xs[1])).closeTo(f(1), 1e-6);

        await movePoint({ name: "/P", x: -1, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        let x = constantFromAst(p.stateValues.xs[0]);
        let y = constantFromAst(p.stateValues.xs[1]);

        expect(y).closeTo(f(x), 1e-6);

        await movePoint({ name: "/P", x: 6, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(y).closeTo(f(x), 1e-6);

        await movePoint({ name: "/P", x: 8, y: -4, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(y).closeTo(f(x), 1e-6);

        await movePoint({ name: "/P", x: -1, y: -6, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(y).closeTo(f(x), 1e-6);
    }

    it("point constrained to function with restricted domain, not explicit", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">sqrt(x)sqrt(5-x)</function>
    <point x="1" y="2" name="P">
      <constraints>
        <constrainTo>
          $f
        </constrainTo>
      </constraints>
    </point>
    `,
        });

        await test_point_constrained_function_implicit_domain(core);
    });

    it("point constrained to function with restricted domain in graph, not explicit", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
    <function name="f">sqrt(x)sqrt(5-x)</function>
    <point x="1" y="2" name="P">
      <constraints>
        <constrainTo>
          $f
        </constrainTo>
      </constraints>
    </point>
    </graph>
    `,
        });

        await test_point_constrained_function_implicit_domain(core);
    });

    async function test_function_3_over_exp(core) {
        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f"].stateValues.numInputs).eq(1);

        const numericalf = await core.components!["/f"].state.numericalf.value;
        const symbolicf = (
            await core.components!["/f"].state.symbolicfs.value
        )[0];

        expect(numericalf(-5)).closeTo(3 / (1 + Math.exp(5 / 2)), 1e-12);
        expect(numericalf(1)).closeTo(3 / (1 + Math.exp(-1 / 2)), 1e-12);
        expect(
            symbolicf(me.fromAst(-5)).equals(me.fromText("3/(1+e^(5/2))")),
        ).eq(true);
        expect(
            symbolicf(me.fromAst(1)).equals(me.fromText("3/(1+e^(-1/2))")),
        ).eq(true);
        expect(
            symbolicf(me.fromAst("z")).equals(me.fromText("3/(1+e^(-z/2))")),
        ).eq(true);

        expect(
            me
                .fromAst(stateVariables["/fz"].stateValues.value.tree)
                .equals(me.fromText("3/(1+e^(-z/2))")),
        ).eq(true);
    }

    it("function determined by formula via sugar", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">
    3/(1+e^(-x/2))
    </function>

    <evaluate function="$f" input="z" name="fz" />

    `,
        });

        await test_function_3_over_exp(core);
    });

    it("function determined by formula via sugar, label with math", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">
    3/(1+e^(-x/2))
    <label>Hello $f.formula</label>
    </function>

    <evaluate function="$f" input="z" name="fz" />
    `,
        });

        await test_function_3_over_exp(core);

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f"].stateValues.label).eq(
            "Hello \\(\\frac{3}{1 + e^{-\\frac{x}{2}}}\\)",
        );
    });

    it("function determined by formula via sugar, with strings and macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">
    $a/(1+e^(-x/$b))
    </function>
    <number name="a">3</number>
    <math name="b">2</math>

    <evaluate function="$f" input="z" name="fz" />
    `,
        });

        await test_function_3_over_exp(core);
    });

    it("function determined by formula via sugar, with strings and maths", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">
    <number>3</number>/(1+e^(-x/<math>2</math>))
    </function>

    <evaluate function="$f" input="z" name="fz" />
    `,
        });

        await test_function_3_over_exp(core);
    });

    it("function determined by math formula", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f"><math>3/(1+e^(-x/2))</math></function>

    <evaluate function="$f" input="z" name="fz" />
    `,
        });

        await test_function_3_over_exp(core);
    });

    it("function determined by math formula, label with math", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">
      <label>Hello $f.formula</label>
      <math>3/(1+e^(-x/2))</math>
    </function>

    <evaluate function="$f" input="z" name="fz" />
    `,
        });

        await test_function_3_over_exp(core);

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f"].stateValues.label).eq(
            "Hello \\(\\frac{3}{1 + e^{-\\frac{x}{2}}}\\)",
        );
    });

    it("function determined by math formula, with macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">
    <math>$a/(1+e^(-x/$b))</math>
    </function>
    <number name="a">3</number>
    <math name="b">2</math>

    <evaluate function="$f" input="z" name="fz" />
    `,
        });

        await test_function_3_over_exp(core);
    });

    async function test_function_squared_time_sin(core) {
        const numericalf = await core.components!["/f"].state.numericalf.value;
        const symbolicf = (
            await core.components!["/f"].state.symbolicfs.value
        )[0];

        expect(numericalf(-5)).closeTo(
            (25 * Math.sin(0.5 * Math.PI * -5)) / 100,
            1e-12,
        );
        expect(numericalf(3)).closeTo(
            (9 * Math.sin(0.5 * Math.PI * 3)) / 100,
            1e-12,
        );
        expect(
            symbolicf(me.fromAst(-5)).equals(
                me.fromText("(-5)^2sin(pi(-5)/2)/100"),
            ),
        ).eq(true);
        expect(
            symbolicf(me.fromAst(3)).equals(
                me.fromText("(3)^2sin(pi(3)/2)/100"),
            ),
        ).eq(true);
        expect(
            symbolicf(me.fromAst("p")).equals(
                me.fromText("p^2sin(pi p/2)/100"),
            ),
        ).eq(true);
    }

    it("function determined by sugar formula in different variable", async () => {
        let core = await createTestCore({
            doenetML: `
    <function variables="q" name="f">
      q^2 sin(pi q/2)/100
    </function>

    `,
        });

        await test_function_squared_time_sin(core);
    });

    it("function determined by sugar formula in different variable, with strings and macros", async () => {
        let core = await createTestCore({
            doenetML: `
    <function variable="$var" name="f">
      $var^$c sin(pi $var/$c)/$d
    </function>

    <math name="var">q</math>
    <number name="c">2</number>
    <number name="d">100</number>
    `,
        });

        await test_function_squared_time_sin(core);
    });

    it("function determined by math formula in different variable", async () => {
        let core = await createTestCore({
            doenetML: `
      <function variables="q" name="f"><math>q^2 sin(pi q/2)/100</math></function>
    `,
        });

        await test_function_squared_time_sin(core);
    });

    it("function with empty variables attribute", async () => {
        let core = await createTestCore({
            doenetML: `
    <function variables="" name="f">
      x^2 sin(pi x/2)/100
    </function>
    `,
        });

        await test_function_squared_time_sin(core);
    });

    it("function determined by function", async () => {
        let core = await createTestCore({
            doenetML: `
    <function variable="q" name="f0"><math>q^2 sin(pi q/2)/100</math></function>
    <function name="f">
    $f0
    </function>
    `,
        });

        await test_function_squared_time_sin(core);
    });

    it("function determined by function, label with math", async () => {
        let core = await createTestCore({
            doenetML: `
    <function variables="q" name="f0"><math>q^2 sin(pi q/2)/100</math></function>
      <function name="f">
        $f0
        <label>$f.formula</label>
      </function>
    `,
        });

        await test_function_squared_time_sin(core);

        let stateVariables = await returnAllStateVariables(core);

        expect(
            stateVariables["/f"].stateValues.label
                .replaceAll("\\,", "")
                .replaceAll(" ", ""),
        ).eq("\\(\\frac{q^{2}\\sin\\left(\\frac{\\piq}{2}\\right)}{100}\\)");
    });

    it("warnings for bad variable or variable attribute", async () => {
        let core = await createTestCore({
            doenetML: `
    <function variables="sin(x)">x</function>
    <function variable="cos(x)">x</function>
    `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);

        expect(errorWarnings.warnings[0].message).contain(
            `Invalid value of a variable: cos(x)`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(25);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(30);

        expect(errorWarnings.warnings[1].message).contain(
            `Invalid value of a variable: sin(x)`,
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(26);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(31);
    });

    it("point constrained to function in different variable", async () => {
        let core = await createTestCore({
            doenetML: `
    <function variable="u" name="f">
      log(2u)
    </function>
    <point x="-3" y="5" name="P">
      <constraints>
        <constrainTo>$f</constrainTo>
      </constraints>
    </point>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let p = stateVariables["/P"];

        let x = constantFromAst(p.stateValues.xs[0]);
        let y = constantFromAst(p.stateValues.xs[1]);

        expect(Math.log(2 * x)).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: 8, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(Math.log(2 * x)).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: -8, y: -8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(Math.log(2 * x)).closeTo(y, 1e-5);
    });

    it("point constrained to function in different variable, restrict left-open domain", async () => {
        let core = await createTestCore({
            doenetML: `
    <function variables="u" domain="(0.1, 6]" name="f">
      log(2u)
    </function>
    <point x="-3" y="5" name="P">
      <constraints>
        <constrainTo>$f</constrainTo>
      </constraints>
    </point>

    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let p = stateVariables["/P"];

        let x = constantFromAst(p.stateValues.xs[0]);
        let y = constantFromAst(p.stateValues.xs[1]);

        expect(x).greaterThan(0.1 + 1e-12);
        expect(x).lessThan(0.1 + 1e-3);
        expect(Math.log(2 * x)).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: 4, y: 6, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).closeTo(4, 1e-12);
        expect(Math.log(2 * x)).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: 8, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).closeTo(6, 1e-12);
        expect(Math.log(2 * x)).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: -8, y: -8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).greaterThan(0.1 + 1e-12);
        expect(x).lessThan(0.1 + 1e-3);
        expect(Math.log(2 * x)).closeTo(y, 1e-5);
    });

    it("point constrained to function in different variable, restrict right-open domain", async () => {
        let core = await createTestCore({
            doenetML: `
    <function variable="u" domain="[0.1, 6)" name="f">
      log(2u)
    </function>
    <point x="-3" y="5" name="P">
      <constraints>
        <constrainTo>$f</constrainTo>
      </constraints>
    </point>

    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let p = stateVariables["/P"];

        let x = constantFromAst(p.stateValues.xs[0]);
        let y = constantFromAst(p.stateValues.xs[1]);

        expect(x).eq(0.1);
        expect(Math.log(2 * x)).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: 4, y: 6, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).closeTo(4, 1e-12);
        expect(Math.log(2 * x)).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: 8, y: 8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).lessThan(6 - 1e-12);
        expect(x).greaterThan(6 - 1e-3);
        expect(Math.log(2 * x)).closeTo(y, 1e-5);

        await movePoint({ name: "/P", x: -8, y: -8, core });

        stateVariables = await returnAllStateVariables(core);

        p = stateVariables["/P"];

        x = constantFromAst(p.stateValues.xs[0]);
        y = constantFromAst(p.stateValues.xs[1]);

        expect(x).closeTo(0.1, 1e-12);
        expect(Math.log(2 * x)).closeTo(y, 1e-5);
    });

    async function check_extrema({
        core,
        maxima,
        minima,
        haveGlobalMax = false,
        globalsup,
        haveGlobalMin = false,
        globalinf,
        globalsupLargerThan,
        globalinfSmallerThan,
        globalsupLocation,
        globalinfLocation,
        fName = "/f",
    }: {
        core: Core;
        maxima: number[][];
        minima: number[][];
        haveGlobalMax?: boolean;
        globalsup?: number;
        haveGlobalMin?: boolean;
        globalinf?: number;
        globalsupLargerThan?: number;
        globalinfSmallerThan?: number;
        globalsupLocation?: number;
        globalinfLocation?: number;
        fName?: string;
    }) {
        const extrema = [...maxima, ...minima].sort((a, b) => a[0] - b[0]);

        const stateVariables = await returnAllStateVariables(core);
        const fState = stateVariables[fName].stateValues;

        expect(fState.numMaxima).eq(maxima.length);
        let foundMaxima = fState.maxima;
        for (let [i, max] of maxima.entries()) {
            for (let [j, val] of max.entries()) {
                expect(foundMaxima[i][j]).closeTo(val, 1e-3);
            }
        }
        expect(fState.numMinima).eq(minima.length);
        let foundMinima = fState.minima;
        for (let [i, min] of minima.entries()) {
            for (let [j, val] of min.entries()) {
                expect(foundMinima[i][j]).closeTo(val, 1e-3);
            }
        }

        expect(fState.numExtrema).eq(extrema.length);

        let foundExtrema = fState.extrema;
        for (let [i, extr] of extrema.entries()) {
            for (let [j, val] of extr.entries()) {
                expect(foundExtrema[i][j]).closeTo(val, 1e-3);
            }
        }

        if (globalsupLargerThan !== undefined) {
            expect(fState.globalSupremum[1]).greaterThan(globalsupLargerThan);
            if (haveGlobalMax) {
                expect(fState.globalMaximum[1]).eq(fState.globalSupremum[1]);
            } else {
                expect(fState.globalMaximum).eqls([]);
            }
        } else {
            if (globalsup === undefined) {
                expect(fState.globalSupremum).eqls([]);
                expect(fState.globalMaximum).eqls([]);
            } else if (Number.isFinite(globalsup)) {
                expect(fState.globalSupremum[1]).closeTo(globalsup, 1e-3);
                if (haveGlobalMax) {
                    expect(fState.globalMaximum[1]).closeTo(globalsup, 1e-3);
                } else {
                    expect(fState.globalMaximum).eqls([]);
                }
            } else {
                expect(fState.globalSupremum[1]).eq(globalsup);
                expect(fState.globalMaximum).eqls([]);
            }
        }

        if (globalinfSmallerThan !== undefined) {
            expect(fState.globalInfimum[1]).lessThan(globalinfSmallerThan);
            if (haveGlobalMin) {
                expect(fState.globalMinimum[1]).eq(fState.globalInfimum[1]);
            } else {
                expect(fState.globalMinimum).eqls([]);
            }
        } else {
            if (globalinf === undefined) {
                expect(fState.globalInfimum).eqls([]);
                expect(fState.globalMinimum).eqls([]);
            } else if (Number.isFinite(globalinf)) {
                expect(fState.globalInfimum[1]).closeTo(globalinf, 1e-3);
                if (haveGlobalMin) {
                    expect(fState.globalMinimum[1]).closeTo(globalinf, 1e-3);
                } else {
                    expect(fState.globalMinimum).eqls([]);
                }
            } else {
                expect(fState.globalInfimum[1]).eq(globalinf);
                expect(fState.globalMinimum).eqls([]);
            }
        }
        if (globalsupLocation !== undefined) {
            if (Number.isFinite(globalsupLocation)) {
                expect(fState.globalSupremum[0]).closeTo(
                    globalsupLocation,
                    1e-3,
                );
            } else {
                expect(fState.globalSupremum[0]).eq(globalsupLocation);
            }
        }
        if (globalinfLocation !== undefined) {
            if (Number.isFinite(globalinfLocation)) {
                expect(fState.globalInfimum[0]).closeTo(
                    globalinfLocation,
                    1e-3,
                );
            } else {
                expect(fState.globalInfimum[0]).eq(globalinfLocation);
            }
        }
    }

    it("calculated extrema from spline", async () => {
        let core = await createTestCore({
            doenetML: `
    <point name="P1">(0.7, 5.43)</point>
    <point name="P2">(3,4)</point>
    <point name="P3">(5,6)</point>
    <point name="P4">(-5,6)</point>
    <function through="$P1 $P2" maxima="$P3" minima="$P4" name="f" />
     `,
        });

        await check_extrema({
            core,
            maxima: [
                [-2.15, 7],
                [5, 6],
            ],
            minima: [
                [-5, 6],
                [3, 4],
            ],
            globalsup: Infinity,
            globalinf: -Infinity,
        });

        await movePoint({ name: "/P1", x: 2, y: 2, core });

        await check_extrema({
            core,
            maxima: [
                [-1.5, 7],
                [5, 6],
            ],
            minima: [
                [-5, 6],
                [2, 2],
            ],
            globalsup: Infinity,
            globalinf: -Infinity,
        });

        await movePoint({ name: "/P1", x: 3.6, y: 5.1, core });

        await check_extrema({
            core,
            maxima: [
                [-1, 7],
                [3.6, 5.1],
                [5, 6],
            ],
            minima: [
                [-5, 6],
                [3, 4],
                [4.3, 5],
            ],
            globalsup: Infinity,
            globalinf: -Infinity,
        });

        await movePoint({ name: "/P1", x: 8, y: 9, core });

        await check_extrema({
            core,
            maxima: [
                [-1, 7],
                [5, 6],
            ],
            minima: [
                [-5, 6],
                [3, 4],
                [6.5, 5],
            ],
            globalsup: Infinity,
            globalinf: 4,
            haveGlobalMin: true,
        });

        await movePoint({ name: "/P1", x: 5, y: 2, core });

        await check_extrema({ core, maxima: [], minima: [] });

        await movePoint({ name: "/P1", x: -9, y: 0, core });

        await check_extrema({
            core,
            maxima: [
                [-7, 7],
                [-1, 7],
                [5, 6],
            ],
            minima: [
                [-5, 6],
                [3, 4],
            ],
            globalsup: 7,
            haveGlobalMax: true,
            globalinf: -Infinity,
        });

        await movePoint({ name: "/P4", x: 8, y: 3, core });

        await check_extrema({
            core,
            maxima: [[5, 6]],
            minima: [[8, 3]],
            globalsup: Infinity,
            globalinf: 0,
            haveGlobalMin: true,
        });

        await movePoint({ name: "/P4", x: 8, y: 6, core });

        await check_extrema({
            core,
            maxima: [
                [5, 6],
                [7, 7],
            ],
            minima: [
                [6, 5],
                [8, 6],
            ],
            globalsup: Infinity,
            globalinf: 0,
            haveGlobalMin: true,
        });
    });

    it("calculated extrema from spline, restrict to right-open domain", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>xmin = <mathinput name="xmin" prefill="-4" />
    xmax = <mathinput name="xmax" prefill="7" /></p>
    <point name="P1">(0.7, 5.43)</point>
    <point name="P2">(3,4)</point>
    <point name="P3">(5,6)</point>
    <point name="P4">(-5,6)</point>
    <function through="$P1 $P2" maxima="$P3" minima="$P4" name="f" domain="[$xmin, $xmax)" />
     `,
        });

        await check_extrema({
            core,
            maxima: [
                [-2.15, 7],
                [5, 6],
            ],
            minima: [[3, 4]],
            globalsup: 7,
            haveGlobalMax: true,
            globalinf: 2,
        });

        await updateMathInputValue({
            latex: "-2",
            name: "/xmin",
            core,
        });
        await updateMathInputValue({
            latex: "4",
            name: "/xmax",
            core,
        });

        await check_extrema({
            core,
            maxima: [],
            minima: [[3, 4]],
            globalsup: 6.9918,
            haveGlobalMax: true,
            globalinf: 4,
            haveGlobalMin: true,
        });

        await movePoint({ name: "/P1", x: 2, y: 2, core });

        await check_extrema({
            core,
            maxima: [[-1.5, 7]],
            minima: [[2, 2]],
            globalsup: 7,
            haveGlobalMax: true,
            globalinf: 2,
            haveGlobalMin: true,
        });

        await updateMathInputValue({
            latex: "-6",
            name: "/xmin",
            core,
        });
        await updateMathInputValue({
            latex: "8",
            name: "/xmax",
            core,
        });

        await check_extrema({
            core,
            maxima: [
                [-1.5, 7],
                [5, 6],
            ],
            minima: [
                [-5, 6],
                [2, 2],
            ],
            globalsup: 7,
            haveGlobalMax: true,
            globalinf: -3,
        });

        await movePoint({ name: "/P1", x: 3.6, y: 5.1, core });

        await check_extrema({
            core,
            maxima: [
                [-1, 7],
                [3.6, 5.1],
                [5, 6],
            ],
            minima: [
                [-5, 6],
                [3, 4],
                [4.3, 5],
            ],
            globalsup: 7,
            haveGlobalMax: true,
            globalinf: -3,
        });

        await updateMathInputValue({
            latex: "-1",
            name: "/xmin",
            core,
        });
        await updateMathInputValue({
            latex: "4",
            name: "/xmax",
            core,
        });

        await check_extrema({
            core,
            maxima: [
                [-1, 7],
                [3.6, 5.1],
            ],
            minima: [[3, 4]],
            globalsup: 7,
            haveGlobalMax: true,
            globalinf: 4,
            haveGlobalMin: true,
        });
    });

    it("calculated extrema from spline, restrict to left-open domain", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>xmin = <mathinput name="xmin" prefill="-4" />
    xmax = <mathinput name="xmax" prefill="7" /></p>
    <point name="P1">(0.7, 5.43)</point>
    <point name="P2">(3,4)</point>
    <point name="P3">(5,6)</point>
    <point name="P4">(-5,6)</point>
    <function through="$P1 $P2" maxima="$P3" minima="$P4" name="f" domain="($xmin, $xmax]" />
     `,
        });

        await check_extrema({
            core,
            maxima: [
                [-2.15, 7],
                [5, 6],
            ],
            minima: [[3, 4]],
            globalsup: 7,
            haveGlobalMax: true,
            globalinf: 2,
            haveGlobalMin: true,
        });

        await updateMathInputValue({
            latex: "-2",
            name: "/xmin",
            core,
        });
        await updateMathInputValue({
            latex: "4",
            name: "/xmax",
            core,
        });

        await check_extrema({
            core,
            maxima: [],
            minima: [[3, 4]],
            globalsup: 6.9918,
            globalinf: 4,
            haveGlobalMin: true,
        });

        await movePoint({ name: "/P1", x: 2, y: 2, core });

        await check_extrema({
            core,
            maxima: [[-1.5, 7]],
            minima: [[2, 2]],
            globalsup: 7,
            haveGlobalMax: true,
            globalinf: 2,
            haveGlobalMin: true,
        });

        await updateMathInputValue({
            latex: "-6",
            name: "/xmin",
            core,
        });
        await updateMathInputValue({
            latex: "8",
            name: "/xmax",
            core,
        });

        await check_extrema({
            core,
            maxima: [
                [-1.5, 7],
                [5, 6],
            ],
            minima: [
                [-5, 6],
                [2, 2],
            ],
            globalsup: 7,
            haveGlobalMax: true,
            globalinf: -3,
            haveGlobalMin: true,
        });

        await movePoint({ name: "/P1", x: 3.6, y: 5.1, core });

        await check_extrema({
            core,
            maxima: [
                [-1, 7],
                [3.6, 5.1],
                [5, 6],
            ],
            minima: [
                [-5, 6],
                [3, 4],
                [4.3, 5],
            ],
            haveGlobalMax: true,
            globalsup: 7,
            globalinf: -3,
            haveGlobalMin: true,
        });

        await updateMathInputValue({
            latex: "-1",
            name: "/xmin",
            core,
        });
        await updateMathInputValue({
            latex: "4",
            name: "/xmax",
            core,
        });

        await check_extrema({
            core,
            maxima: [[3.6, 5.1]],
            minima: [[3, 4]],
            globalsup: 7,
            globalinf: 4,
            haveGlobalMin: true,
        });
    });

    it("calculated extrema from spline, restrict domain, just through points", async () => {
        let core = await createTestCore({
            doenetML: `
    <point name="P1">(0, 0)</point>
    <point name="P2">(2, -1.8)</point>
    <point name="P3">(5,-4)</point>
    <point name="P4">(7,0)</point>
    <point name="P5">(8,1)</point>
    <function through="$P1 $P2 $P3 $P4 $P5" name="f" domain="(0,10)" />
     `,
        });

        // it is set up so that minimum of quadratic interpolating between first two points
        // is past maximum of domain
        // check for bug where this stopped looking for minima
        await check_extrema({
            core,
            maxima: [],
            minima: [[5, -4]],
            globalsup: 2.3333,
            globalinf: -4,
            haveGlobalMin: true,
        });

        // now move points so that the minimum of the cubic interpolating between
        // the first two points is past maximum of the domain
        // check for bug where this stopped looking for minima

        await movePoint({ name: "/P1", x: 0, y: -0.35, core });
        await movePoint({ name: "/P2", x: 1.8, y: -1.36, core });
        await movePoint({ name: "/P5", x: 1, y: -0.866, core });

        await check_extrema({
            core,
            maxima: [],
            minima: [[5, -4]],
            globalsup: 12,
            globalinf: -4,
            haveGlobalMin: true,
        });

        // now move points so that maximum of quadratic interpolating between first two points
        // is past maximum of domain
        // check for bug where this stopped looking for maxima

        await movePoint({ name: "/P1", x: 0, y: 0, core });
        await movePoint({ name: "/P2", x: 2, y: 1.8, core });
        await movePoint({ name: "/P3", x: 5, y: 4, core });
        await movePoint({ name: "/P5", x: 8, y: -1, core });

        await check_extrema({
            core,
            maxima: [[5, 4]],
            minima: [],
            globalsup: 4,
            haveGlobalMax: true,
            globalinf: -2.3333,
        });

        // now move points so that the maximum of the cubic interpolating between
        // the first two points is past maximum of the domain
        // check for bug where this stopped looking for maximum

        await movePoint({ name: "/P1", x: 0, y: 0.35, core });
        await movePoint({ name: "/P2", x: 1.8, y: 1.36, core });
        await movePoint({ name: "/P5", x: 1, y: 0.866, core });

        await check_extrema({
            core,
            maxima: [[5, 4]],
            minima: [],
            globalsup: 4,
            haveGlobalMax: true,
            globalinf: -12,
        });
    });

    it("calculated extrema from gaussians", async () => {
        let core = await createTestCore({
            doenetML: `
    <point name="P1">(0, 1)</point>
    <point name="P2">(3, 1)</point>
    <function name="f">$P1.y exp(-(x-$P1.x)^2)+$P2.y exp(-(x-$P2.x)^2)</function>
     `,
        });

        await check_extrema({
            core,
            maxima: [
                [0, 1],
                [3, 1],
            ],
            minima: [[1.5, 0.21]],
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: 0,
            haveGlobalMin: true,
        });

        await movePoint({ name: "/P2", x: 3, y: -1, core });

        await check_extrema({
            core,
            maxima: [[0, 1]],
            minima: [[3, -1]],
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
        });

        await movePoint({ name: "/P1", x: 0, y: -1, core });

        await check_extrema({
            core,
            maxima: [[1.5, -0.21]],
            minima: [
                [0, -1],
                [3, -1],
            ],
            globalsup: 0,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
        });
    });

    it("calculated extrema from sinusoid", async () => {
        let core = await createTestCore({
            doenetML: `
    Period: <mathinput name="period" />
    <function name="f">sin(2*pi*x/$period)</function>
     `,
        });

        function calc_extrema(period) {
            let numMaxima = 200 / period;
            let maximumLocations = [...Array(numMaxima).keys()].map(
                (x) => (x + 1 / 4 - numMaxima / 2) * period,
            );
            let maxima = maximumLocations.map((x) => [x, 1]);

            let numMinima = 200 / period;
            let minimumLocations = [...Array(numMinima).keys()].map(
                (x) => (x + 3 / 4 - numMinima / 2) * period,
            );
            let minima = minimumLocations.map((x) => [x, -1]);

            return { maxima, minima };
        }

        await check_extrema({ core, maxima: [], minima: [] });

        let period = 10;
        await updateMathInputValue({
            latex: `${period}`,
            name: "/period",
            core,
        });

        let extrema = calc_extrema(period);

        await check_extrema({
            core,
            maxima: extrema.maxima,
            minima: extrema.minima,
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
        });

        period = 5;
        await updateMathInputValue({
            latex: `${period}`,
            name: "/period",
            core,
        });

        extrema = calc_extrema(period);

        await check_extrema({
            core,
            maxima: extrema.maxima,
            minima: extrema.minima,
            haveGlobalMax: true,
            globalsup: 1,
            globalinf: -1,
            haveGlobalMin: true,
        });
    });

    it("calculated extrema from sinusoid, restrict domain", async () => {
        let core = await createTestCore({
            doenetML: `
    Period: <mathinput name="period" />
    xmin = <mathinput name="xmin" prefill="-10" />
    xmax = <mathinput name="xmax" prefill="10" />
    <function name="f" domain="($xmin, $xmax)">sin(2*pi*x/$period)</function>
     `,
        });

        function calc_extrema(period, minx, maxx) {
            let numMaxima = Math.floor((maxx - minx) / period);
            let firstMaxInd = Math.ceil(minx / period - 1 / 4);

            let maximumLocations = [...Array(numMaxima).keys()].map(
                (x) => (x + 1 / 4 + firstMaxInd) * period,
            );
            let maxima = maximumLocations.map((x) => [x, 1]);

            let numMinima = Math.floor((maxx - minx) / period);
            let firstMinInd = Math.ceil(minx / period - 3 / 4);

            let minimumLocations = [...Array(numMinima).keys()].map(
                (x) => (x + 3 / 4 + firstMinInd) * period,
            );
            let minima = minimumLocations.map((x) => [x, -1]);

            return { maxima, minima };
        }

        let xmin = -10,
            xmax = 10;

        await check_extrema({ core, maxima: [], minima: [] });

        let period = 10;
        await updateMathInputValue({
            latex: `${period}`,
            name: "/period",
            core,
        });

        let extrema = calc_extrema(period, xmin, xmax);

        await check_extrema({
            core,
            maxima: extrema.maxima,
            minima: extrema.minima,
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
        });

        xmin = -5;
        xmax = 25;
        await updateMathInputValue({
            latex: `${xmin}`,
            name: "/xmin",
            core,
        });
        await updateMathInputValue({
            latex: `${xmax}`,
            name: "/xmax",
            core,
        });

        extrema = calc_extrema(period, xmin, xmax);
        await check_extrema({
            core,
            maxima: extrema.maxima,
            minima: extrema.minima,
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
        });

        period = 5;
        await updateMathInputValue({
            latex: `${period}`,
            name: "/period",
            core,
        });

        extrema = calc_extrema(period, xmin, xmax);
        await check_extrema({
            core,
            maxima: extrema.maxima,
            minima: extrema.minima,
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
        });

        xmin = -1;
        xmax = 9;
        await updateMathInputValue({
            latex: `${xmin}`,
            name: "/xmin",
            core,
        });
        await updateMathInputValue({
            latex: `${xmax}`,
            name: "/xmax",
            core,
        });

        extrema = calc_extrema(period, xmin, xmax);
        await check_extrema({
            core,
            maxima: extrema.maxima,
            minima: extrema.minima,
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
        });
    });

    it("no extrema with horizontal asymptote", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">
      1/(1+exp(-10*x))
    </function>
    `,
        });

        await check_extrema({
            core,
            maxima: [],
            minima: [],
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: 0,
            haveGlobalMin: true,
        });
    });

    it("extrema of rational function", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">
      (x+8)(x-8)/((x-2)(x+4)(x-5)^2)
    </function>
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        // values of extrema computed in Sage
        let minimumLocations = [-2.29152990292159];
        let minima = minimumLocations.map((x) => [x, f(x)]);
        let maximumLocations = [
            -11.6660173492088, 3.18454272065031, 9.77300453148004,
        ];
        let maxima = maximumLocations.map((x) => [x, f(x)]);

        await check_extrema({
            core,
            maxima,
            minima,
            globalsupLargerThan: 1e5,
            haveGlobalMax: true,
            globalinfSmallerThan: -1e5,
            haveGlobalMin: true,
        });
    });

    it("intervals of extrema are not counted", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1" through="(-8,7) (-7,2) (-6,2) (-4,3) (-2,5) (8,5) (10,4)" />
    <function name="f2" styleNumber="2" through="(-8,2) (-7,2) (-6,2) (-4,3) (-2,5) (2,5) (6,4) (8,4)" />
    <function name="f3" copySource="f1" domain="(-7.5, 10)" />
    <function name="f4" copySource="f1" domain="(-9, 14)" />
    <function name="f5" styleNumber="3" through="(-8,2) (-2,5) (2,5) (6,1)" throughSlopes="0 0 0 0" />
    <function name="f6" styleNumber="4" through="(-8,2) (-2,5) (2,5) (6,7)" throughSlopes="0 0 0 0" />
    `,
        });

        let f4 = await core.components!["/f4"].state.numericalf.value;

        await check_extrema({
            core,
            maxima: [],
            minima: [],
            globalsup: Infinity,
            globalinf: -Infinity,
            globalsupLocation: -Infinity,
            globalinfLocation: Infinity,
            fName: "/f1",
        });
        await check_extrema({
            core,
            maxima: [],
            minima: [],
            globalsup: 5,
            haveGlobalMax: true,
            globalinf: 2,
            haveGlobalMin: true,
            globalsupLocation: -2,
            globalinfLocation: -8,
            fName: "/f2",
        });
        await check_extrema({
            core,
            maxima: [],
            minima: [],
            globalsup: 5,
            haveGlobalMax: true,
            globalinf: 2,
            haveGlobalMin: true,
            globalsupLocation: -2,
            globalinfLocation: -7,
            fName: "/f3",
        });
        await check_extrema({
            core,
            maxima: [],
            minima: [],
            globalsup: f4(-9, true),
            globalinf: f4(14, true),
            globalsupLocation: -9,
            globalinfLocation: 14,
            fName: "/f4",
        });
        await check_extrema({
            core,
            maxima: [],
            minima: [],
            globalsup: 5,
            haveGlobalMax: true,
            globalinf: 1,
            haveGlobalMin: true,
            globalsupLocation: -2,
            globalinfLocation: 6,
            fName: "/f5",
        });
        await check_extrema({
            core,
            maxima: [],
            minima: [],
            globalsup: 7,
            haveGlobalMax: true,
            globalinf: 2,
            haveGlobalMin: true,
            globalsupLocation: 6,
            globalinfLocation: -8,
            fName: "/f6",
        });
    });

    it("extrema of function with restricted domain, not explicit", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">
      log(x^2-1)*sqrt((x-5)^2-1)
    </function>
    `,
        });

        let f = await core.components!["/f"].state.numericalf.value;

        let calculatedMinLocation = (
            await core.components!["/f"].state.globalMinimum.value
        )[0];

        await check_extrema({
            core,
            maxima: [[2.614, 3.82]],
            minima: [],
            globalsup: f(-100),
            globalinf: f(calculatedMinLocation),
            haveGlobalMin: true,
            globalsupLocation: -100,
            globalinfLocation: -1,
        });
    });

    it("extrema in flat regions of functions", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1">2-(x-1.0131)^10</function>
    <function name="f2">3+(x+pi)^20</function>
    <function name="f3" domain="(1,5)">-8+3/(1+exp(-100sin(3x)))</function>
    `,
        });

        let f1 = await core.components!["/f1"].state.numericalf.value;
        let f2 = await core.components!["/f2"].state.numericalf.value;

        await check_extrema({
            core,
            maxima: [[1.0131, 2]],
            minima: [],
            globalsup: 2,
            haveGlobalMax: true,
            globalinf: f1(-100),
            globalsupLocation: 1.0131,
            globalinfLocation: -100,
            fName: "/f1",
        });
        await check_extrema({
            core,
            maxima: [],
            minima: [[-Math.PI, 3]],
            globalsup: f2(100),
            globalinf: 3,
            haveGlobalMin: true,
            globalsupLocation: 100,
            globalinfLocation: -Math.PI,
            fName: "/f2",
        });
        await check_extrema({
            core,
            maxima: [
                [(5 * Math.PI) / 6, -5],
                [(9 * Math.PI) / 6, -5],
            ],
            minima: [
                [(3 * Math.PI) / 6, -8],
                [(7 * Math.PI) / 6, -8],
            ],
            globalsup: -5,
            haveGlobalMax: true,
            globalinf: -8,
            haveGlobalMin: true,
            globalsupLocation: (5 * Math.PI) / 6,
            globalinfLocation: (3 * Math.PI) / 6,
            fName: "/f3",
        });
    });

    it("global extrema, in flat regions too flat for local extrema", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1">2-(x-1.0131)^100</function>
    <function name="f2">3+(x+pi)^200</function>
    <function name="f3" domain="(1,5)">-8+3/(1+exp(-1000sin(3x)))</function>
    `,
        });

        let f1 = await core.components!["/f1"].state.numericalf.value;

        await check_extrema({
            core,
            maxima: [],
            minima: [],
            globalsup: 2,
            haveGlobalMax: true,
            globalinf: f1(-100),
            globalinfLocation: -100,
            fName: "/f1",
        });
        expect(core.components!["/f1"].stateValues.globalMaximum[0]).within(
            0.0131,
            2.0131,
        );

        await check_extrema({
            core,
            maxima: [],
            minima: [],
            globalsup: Infinity,
            globalinf: 3,
            haveGlobalMin: true,
            fName: "/f2",
        });
        expect(core.components!["/f2"].stateValues.globalMinimum[0]).within(
            -Math.PI - 1,
            -Math.PI + 1,
        );
        await check_extrema({
            core,
            maxima: [],
            minima: [],
            globalsup: -5,
            haveGlobalMax: true,
            globalinf: -8,
            haveGlobalMin: true,
            fName: "/f3",
        });
        expect(core.components!["/f3"].stateValues.globalMaximum[0]).within(
            1,
            Math.PI / 3,
        );
        expect(core.components!["/f3"].stateValues.globalMinimum[0]).within(
            Math.PI / 3,
            (2 * Math.PI) / 3,
        );
    });

    it("extrema at domain endpoints, function from formula", async () => {
        let core = await createTestCore({
            doenetML: `
      <function name="f1" domain="(-pi,2pi)">cos(x)</function>
      <function name="f2" domain="[-pi,2pi]">cos(x)+1</function>
      <function name="f3" domain="(-3pi/2,3pi/2]">sin(x)+2</function>
      <function name="f4" domain="[-3pi/2,3pi/2)">sin(x)+3</function>

      <function name="f1a" domain="[-pi+10^(-6),2pi-10^(-6)]">cos(x)</function>
      <function name="f3a" domain="[-3pi/2+10^(-6),3pi/2]">sin(x)+2</function>
      <function name="f4a" domain="[-3pi/2,3pi/2-10^(-6)]">sin(x)+3</function>

      <function name="f5" domain="(0,3pi)">cos(x)</function>
      <function name="f6" domain="[0,3pi]">cos(x)+1</function>
      <function name="f7" domain="(0,3pi]">cos(x-pi)+4</function>
      <function name="f8" domain="[0,3pi)">cos(x-pi)+5</function>

      <function name="f9" domain="(-3pi, 0)">cos(x)</function>
      <function name="f10" domain="[-3pi, 0]">cos(x)+1</function>
      <function name="f11" domain="(-3pi, 0]">cos(x-pi)+4</function>
      <function name="f12" domain="[-3pi, 0)">cos(x-pi)+5</function>
    `,
        });

        await check_extrema({
            core,
            maxima: [[0, 1]],
            minima: [[Math.PI, -1]],
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
            fName: "/f1",
        });

        await check_extrema({
            core,
            maxima: [
                [0, 2],
                [2 * Math.PI, 2],
            ],
            minima: [
                [-Math.PI, 0],
                [Math.PI, 0],
            ],
            globalsup: 2,
            haveGlobalMax: true,
            globalinf: 0,
            haveGlobalMin: true,
            fName: "/f2",
        });

        await check_extrema({
            core,
            maxima: [[0.5 * Math.PI, 3]],
            minima: [
                [-0.5 * Math.PI, 1],
                [1.5 * Math.PI, 1],
            ],
            globalsup: 3,
            haveGlobalMax: true,
            globalinf: 1,
            haveGlobalMin: true,
            fName: "/f3",
        });

        await check_extrema({
            core,
            maxima: [
                [-1.5 * Math.PI, 4],
                [0.5 * Math.PI, 4],
            ],
            minima: [[-0.5 * Math.PI, 2]],
            globalsup: 4,
            haveGlobalMax: true,
            globalinf: 2,
            haveGlobalMin: true,
            fName: "/f4",
        });

        await check_extrema({
            core,
            maxima: [[0, 1]],
            minima: [[Math.PI, -1]],
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
            fName: "/f1a",
        });

        await check_extrema({
            core,
            maxima: [[0.5 * Math.PI, 3]],
            minima: [
                [-0.5 * Math.PI, 1],
                [1.5 * Math.PI, 1],
            ],
            globalsup: 3,
            haveGlobalMax: true,
            globalinf: 1,
            haveGlobalMin: true,
            fName: "/f3a",
        });

        await check_extrema({
            core,
            maxima: [
                [-1.5 * Math.PI, 4],
                [0.5 * Math.PI, 4],
            ],
            minima: [[-0.5 * Math.PI, 2]],
            globalsup: 4,
            haveGlobalMax: true,
            globalinf: 2,
            haveGlobalMin: true,
            fName: "/f4a",
        });

        await check_extrema({
            core,
            maxima: [[2 * Math.PI, 1]],
            minima: [[Math.PI, -1]],
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
            fName: "/f5",
        });

        await check_extrema({
            core,
            maxima: [
                [0, 2],
                [2 * Math.PI, 2],
            ],
            minima: [
                [Math.PI, 0],
                [3 * Math.PI, 0],
            ],
            globalsup: 2,
            haveGlobalMax: true,
            globalinf: 0,
            haveGlobalMin: true,
            fName: "/f6",
        });

        await check_extrema({
            core,
            maxima: [
                [Math.PI, 5],
                [3 * Math.PI, 5],
            ],
            minima: [[2 * Math.PI, 3]],
            globalsup: 5,
            haveGlobalMax: true,
            globalinf: 3,
            haveGlobalMin: true,
            fName: "/f7",
        });

        await check_extrema({
            core,
            maxima: [[Math.PI, 6]],
            minima: [
                [0, 4],
                [2 * Math.PI, 4],
            ],
            globalsup: 6,
            haveGlobalMax: true,
            globalinf: 4,
            haveGlobalMin: true,
            fName: "/f8",
        });

        await check_extrema({
            core,
            maxima: [[-2 * Math.PI, 1]],
            minima: [[-Math.PI, -1]],
            globalsup: 1,
            haveGlobalMax: true,
            globalinf: -1,
            haveGlobalMin: true,
            fName: "/f9",
        });

        await check_extrema({
            core,
            maxima: [
                [-2 * Math.PI, 2],
                [0, 2],
            ],
            minima: [
                [-3 * Math.PI, 0],
                [-1 * Math.PI, 0],
            ],
            globalsup: 2,
            haveGlobalMax: true,
            globalinf: 0,
            haveGlobalMin: true,
            fName: "/f10",
        });

        await check_extrema({
            core,
            maxima: [[-Math.PI, 5]],
            minima: [
                [-2 * Math.PI, 3],
                [0, 3],
            ],
            globalsup: 5,
            haveGlobalMax: true,
            globalinf: 3,
            haveGlobalMin: true,
            fName: "/f11",
        });

        await check_extrema({
            core,
            maxima: [
                [-3 * Math.PI, 6],
                [-1 * Math.PI, 6],
            ],
            minima: [[-2 * Math.PI, 4]],
            globalsup: 6,
            haveGlobalMax: true,
            globalinf: 4,
            haveGlobalMin: true,
            fName: "/f12",
        });
    });

    it("extrema at domain endpoints, function from formula, link=false", async () => {
        // Note: checking to see if rounding attributes are properly copied
        // for wrapped array state variables when link="false"
        let core = await createTestCore({
            doenetML: `
    <function name="f1" domain="(-pi,2pi)" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)</function>
    <function name="f2" domain="[-pi,2pi]" displayDecimals="5" displaySmallAsZero="10^(-6)">cos(x)+1</function>
 
    $f1.extrema{assignNames="f1e1 f1e2" link="false"}
    $f2.extrema{assignNames="f2e1 f2e2 f2e3 f2e4" link="false"}


    `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/f1e1"].stateValues.latex)).eq(
            "(0,1)",
        );
        expect(cleanLatex(stateVariables["/f1e2"].stateValues.latex)).eq(
            `(${Math.round(Math.PI * 10 ** 5) / 10 ** 5},-1)`,
        );
        expect(cleanLatex(stateVariables["/f2e1"].stateValues.latex)).eq(
            `(${Math.round(-Math.PI * 10 ** 5) / 10 ** 5},0)`,
        );
        expect(cleanLatex(stateVariables["/f2e2"].stateValues.latex)).eq(
            "(0,2)",
        );
        expect(cleanLatex(stateVariables["/f2e3"].stateValues.latex)).eq(
            `(${Math.round(Math.PI * 10 ** 5) / 10 ** 5},0)`,
        );
    });

    it("extrema at domain endpoints, interpolated function", async () => {
        let core = await createTestCore({
            doenetML: `
      <function name="f1" domain="(-sqrt(2),sqrt(10))" maxima="(-sqrt(2),sqrt(3))" minima="(sqrt(10), sqrt(11))" displayDecimals="5"/>
      <function name="f2" domain="[-sqrt(2),sqrt(10)]" maxima="(-sqrt(2),sqrt(3)+1)" minima="(sqrt(10), sqrt(11)+1)" displayDecimals="5"/>
      <function name="f3" domain="[-sqrt(2)+10^(-12),sqrt(10)-10^(-12)]" maxima="(-sqrt(2),sqrt(3)+2)" minima="(sqrt(10), sqrt(11)+2)" displayDecimals="5"/>

      <function name="f4" domain="(0,sqrt(10))" maxima="(0,sqrt(3))" minima="(sqrt(10), sqrt(11))" displayDecimals="5"/>
      <function name="f5" domain="[0,sqrt(10)]" maxima="(0,sqrt(3)+1)" minima="(sqrt(10), sqrt(11)+1)" displayDecimals="5"/>
      <function name="f6" domain="[0+10^(-12),sqrt(10)-10^(-12)]" maxima="(0,sqrt(3)+2)" minima="(sqrt(10), sqrt(11)+2)" displayDecimals="5"/>

      <function name="f7" domain="(-sqrt(2),0)" maxima="(-sqrt(2),sqrt(3))" minima="(0, sqrt(11))" displayDecimals="5"/>
      <function name="f8" domain="[-sqrt(2),0]" maxima="(-sqrt(2),sqrt(3)+1)" minima="(0, sqrt(11)+1)" displayDecimals="5"/>
      <function name="f9" domain="[-sqrt(2)+10^(-12),0-10^(-12)]" maxima="(-sqrt(2),sqrt(3)+2)" minima="(0, sqrt(11)+2)" displayDecimals="5"/>
    `,
        });

        let extremax1 = [0, 1 / 3, 2 / 3, 1].map(
            (a) => -Math.sqrt(2) * (1 - a) + Math.sqrt(10) * a,
        );
        let extremax2 = [0, 1 / 3, 2 / 3, 1].map((a) => Math.sqrt(10) * a);
        let extremax3 = [0, 1 / 3, 2 / 3, 1].map(
            (a) => -Math.sqrt(2) * (1 - a),
        );

        await check_extrema({
            core,
            maxima: [[extremax1[2], Math.sqrt(11) + 1]],
            minima: [[extremax1[1], Math.sqrt(3) - 1]],
            globalsup: Math.sqrt(11) + 1,
            haveGlobalMax: true,
            globalinf: Math.sqrt(3) - 1,
            haveGlobalMin: true,
            fName: "/f1",
        });
        await check_extrema({
            core,
            maxima: [
                [extremax1[0], Math.sqrt(3) + 1],
                [extremax1[2], Math.sqrt(11) + 2],
            ],
            minima: [
                [extremax1[1], Math.sqrt(3)],
                [extremax1[3], Math.sqrt(11) + 1],
            ],
            globalsup: Math.sqrt(11) + 2,
            haveGlobalMax: true,
            globalinf: Math.sqrt(3),
            haveGlobalMin: true,
            fName: "/f2",
        });
        await check_extrema({
            core,
            maxima: [[extremax1[2], Math.sqrt(11) + 3]],
            minima: [[extremax1[1], Math.sqrt(3) + 1]],
            globalsup: Math.sqrt(11) + 3,
            haveGlobalMax: true,
            globalinf: Math.sqrt(3) + 1,
            haveGlobalMin: true,
            fName: "/f3",
        });
        await check_extrema({
            core,
            maxima: [[extremax2[2], Math.sqrt(11) + 1]],
            minima: [[extremax2[1], Math.sqrt(3) - 1]],
            globalsup: Math.sqrt(11) + 1,
            haveGlobalMax: true,
            globalinf: Math.sqrt(3) - 1,
            haveGlobalMin: true,
            fName: "/f4",
        });
        await check_extrema({
            core,
            maxima: [
                [extremax2[0], Math.sqrt(3) + 1],
                [extremax2[2], Math.sqrt(11) + 2],
            ],
            minima: [
                [extremax2[1], Math.sqrt(3)],
                [extremax2[3], Math.sqrt(11) + 1],
            ],
            globalsup: Math.sqrt(11) + 2,
            haveGlobalMax: true,
            globalinf: Math.sqrt(3),
            haveGlobalMin: true,
            fName: "/f5",
        });
        await check_extrema({
            core,
            maxima: [[extremax2[2], Math.sqrt(11) + 3]],
            minima: [[extremax2[1], Math.sqrt(3) + 1]],
            globalsup: Math.sqrt(11) + 3,
            haveGlobalMax: true,
            globalinf: Math.sqrt(3) + 1,
            haveGlobalMin: true,
            fName: "/f6",
        });
        await check_extrema({
            core,
            maxima: [[extremax3[2], Math.sqrt(11) + 1]],
            minima: [[extremax3[1], Math.sqrt(3) - 1]],
            globalsup: Math.sqrt(11) + 1,
            haveGlobalMax: true,
            globalinf: Math.sqrt(3) - 1,
            haveGlobalMin: true,
            fName: "/f7",
        });
        await check_extrema({
            core,
            maxima: [
                [extremax3[0], Math.sqrt(3) + 1],
                [extremax3[2], Math.sqrt(11) + 2],
            ],
            minima: [
                [extremax3[1], Math.sqrt(3)],
                [extremax3[3], Math.sqrt(11) + 1],
            ],
            globalsup: Math.sqrt(11) + 2,
            haveGlobalMax: true,
            globalinf: Math.sqrt(3),
            haveGlobalMin: true,
            fName: "/f8",
        });
        await check_extrema({
            core,
            maxima: [[extremax3[2], Math.sqrt(11) + 3]],
            minima: [[extremax3[1], Math.sqrt(3) + 1]],
            globalsup: Math.sqrt(11) + 3,
            haveGlobalMax: true,
            globalinf: Math.sqrt(3) + 1,
            haveGlobalMin: true,
            fName: "/f9",
        });
    });

    it("two functions with mutual dependence", async () => {
        let core = await createTestCore({
            doenetML: `
    <point name="P1">(1,2)</point>
    <point name="P2">(3,4)</point>
    <point name="P3">(-5,7)</point>
    <point name="P4">(8,-1)</point>
    <function name="f1" yscale="5" maxima="($f2.numMaxima,$f2.numMinima)" through="(-8,5) (9,10)" />
    
    <function name="f2" yscale="$f1.yscale" through="$P1 $P2 $P3 $P4 " maxima="(0, )" />
         `,
        });

        async function check_items({
            numMaxf2,
            numMinf2,
            maxf1,
        }: {
            numMaxf2: number;
            numMinf2: number;
            maxf1: number[];
        }) {
            const stateVariables = await returnAllStateVariables(core);

            let f1 = stateVariables["/f1"].stateValues;
            let f2 = stateVariables["/f2"].stateValues;

            expect(f1.numMaxima).eq(1);
            expect(f1.numMinima).eq(2);
            expect(f2.numMaxima).eq(numMaxf2);
            expect(f2.numMinima).eq(numMinf2);

            expect(f1.maxima[0][0]).eq(maxf1[0]);
            expect(f1.maxima[0][1]).eq(maxf1[1]);

            expect(f1.xscale).eq(1);
            expect(f1.yscale).eq(5);
            expect(f2.xscale).eq(1);
            expect(f2.yscale).eq(5);
        }

        await check_items({ numMaxf2: 2, numMinf2: 1, maxf1: [2, 1] });

        await movePoint({ name: "/P1", x: 2, y: 6, core });

        await check_items({ numMaxf2: 1, numMinf2: 0, maxf1: [1, 0] });

        await movePoint({ name: "/P2", x: 3, y: 7, core });
        await movePoint({ name: "/P3", x: 9, y: 0, core });

        await check_items({ numMaxf2: 2, numMinf2: 2, maxf1: [2, 2] });
    });

    it("shadowed works correctly with initially unresolved", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="mi1" />
    <mathinput name="mi2" />
    
    <function xscale="$mi1" name="f1">$mi2 x^3+1</function>
    
    $f1{name="f1a"}
    
    <p name="p1">$f1a.xscale</p>
    <p name="p2">$f1.xscale</p>
    
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p1"].stateValues.text).eq("NaN");
        expect(stateVariables["/p2"].stateValues.text).eq("NaN");

        expect(cleanLatex(stateVariables["/f1"].stateValues.latex)).eq(
            "＿x^{3}+1",
        );

        await updateMathInputValue({ latex: "1", name: "/mi1", core });
        await updateMathInputValue({ latex: "2", name: "/mi2", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p1"].stateValues.text).eq("1");
        expect(stateVariables["/p2"].stateValues.text).eq("1");

        expect(cleanLatex(stateVariables["/f1"].stateValues.latex)).eq(
            "2x^{3}+1",
        );

        let f = stateVariables["/f1"].stateValues.numericalf;
        expect(f(-2)).eq(2 * (-2) ** 3 + 1);
        let fa = stateVariables["/f1a"].stateValues.numericalf;
        expect(fa(-2)).eq(2 * (-2) ** 3 + 1);

        await updateMathInputValue({ latex: "3", name: "/mi1", core });
        await updateMathInputValue({ latex: "4", name: "/mi2", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p1"].stateValues.text).eq("3");
        expect(stateVariables["/p2"].stateValues.text).eq("3");

        expect(cleanLatex(stateVariables["/f1"].stateValues.latex)).eq(
            "4x^{3}+1",
        );

        f = stateVariables["/f1"].stateValues.numericalf;
        expect(f(-2)).eq(4 * (-2) ** 3 + 1);
        fa = stateVariables["/f1a"].stateValues.numericalf;
        expect(fa(-2)).eq(4 * (-2) ** 3 + 1);
    });

    it("extrema of quartic, copied multiple times", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathinput name="mi1" prefill="1" />
    <mathinput name="mi2" prefill="0" />
    <mathinput name="mi3" prefill="-2" />
    
    <function name="f1">$mi1 x^4 + $mi2 x^3 +$mi3 x^2 +1</function>
    
    $f1{name="f1a"}

    $f1a{name="f1b"}
    `,
        });

        let maxima = [[0, 1]];
        let minima = [
            [-1, 0],
            [1, 0],
        ];

        await check_extrema({
            core,
            maxima,
            minima,
            globalinf: minima[0][1],
            haveGlobalMin: true,
            globalsupLargerThan: 1e6,
            fName: "/f1",
        });

        await check_extrema({
            core,
            maxima,
            minima,
            globalinf: minima[0][1],
            haveGlobalMin: true,
            globalsupLargerThan: 1e6,
            fName: "/f1a",
        });

        await check_extrema({
            core,
            maxima,
            minima,
            globalinf: minima[0][1],
            haveGlobalMin: true,
            globalsupLargerThan: 1e6,
            fName: "/f1b",
        });

        await updateMathInputValue({ latex: "2", name: "/mi2", core });

        maxima = [[0, 1]];
        minima = [
            [-2, -7],
            [0.5, 13 / 16],
        ];

        await check_extrema({
            core,
            maxima,
            minima,
            globalinf: minima[0][1],
            haveGlobalMin: true,
            globalsupLargerThan: 1e6,
            fName: "/f1",
        });

        await check_extrema({
            core,
            maxima,
            minima,
            globalinf: minima[0][1],
            haveGlobalMin: true,
            globalsupLargerThan: 1e6,
            fName: "/f1a",
        });

        await check_extrema({
            core,
            maxima,
            minima,
            globalinf: minima[0][1],
            haveGlobalMin: true,
            globalsupLargerThan: 1e6,
            fName: "/f1b",
        });

        await updateMathInputValue({
            latex: "-1",
            name: "/mi1",
            core,
        });

        maxima = [[0, 1]];
        minima = [];

        await check_extrema({
            core,
            maxima,
            minima,
            globalsup: maxima[0][1],
            haveGlobalMax: true,
            globalinfSmallerThan: -1e6,
            fName: "/f1",
        });
        await check_extrema({
            core,
            maxima,
            minima,
            globalsup: maxima[0][1],
            haveGlobalMax: true,
            globalinfSmallerThan: -1e6,
            fName: "/f1a",
        });
        await check_extrema({
            core,
            maxima,
            minima,
            globalsup: maxima[0][1],
            haveGlobalMax: true,
            globalinfSmallerThan: -1e6,
            fName: "/f1b",
        });
    });

    it("function of function formula can redefine variable", async () => {
        let core = await createTestCore({
            doenetML: `
    <function variables="t" name="f" symbolic simplify="false">st^3</function>

    <function name="f2" symbolic simplify="false">$f</function>
    <function name="f3" variable="s" symbolic simplify="false">$f.formula</function>

    $f{name="f4"}
    $f2{name="f5"}
    $f3{name="f6"}

    <p name="fOfu">$$f(u)</p>
    <p name="f2Ofu">$$f2(u)</p>
    <p name="f3Ofu">$$f3(u)</p>
    <p name="f4Ofu">$$f4(u)</p>
    <p name="f5Ofu">$$f5(u)</p>
    <p name="f6Ofu">$$f6(u)</p>
    
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f"].stateValues.variables[0].tree).eq("t");
        expect(stateVariables["/f2"].stateValues.variables[0].tree).eq("t");
        expect(stateVariables["/f3"].stateValues.variables[0].tree).eq("s");
        expect(stateVariables["/f4"].stateValues.variables[0].tree).eq("t");
        expect(stateVariables["/f5"].stateValues.variables[0].tree).eq("t");
        expect(stateVariables["/f6"].stateValues.variables[0].tree).eq("s");

        expect(stateVariables["/f"].stateValues.formula.tree).eqls([
            "*",
            "s",
            ["^", "t", 3],
        ]);
        expect(stateVariables["/f2"].stateValues.formula.tree).eqls([
            "*",
            "s",
            ["^", "t", 3],
        ]);
        expect(stateVariables["/f3"].stateValues.formula.tree).eqls([
            "*",
            "s",
            ["^", "t", 3],
        ]);
        expect(stateVariables["/f4"].stateValues.formula.tree).eqls([
            "*",
            "s",
            ["^", "t", 3],
        ]);
        expect(stateVariables["/f5"].stateValues.formula.tree).eqls([
            "*",
            "s",
            ["^", "t", 3],
        ]);
        expect(stateVariables["/f6"].stateValues.formula.tree).eqls([
            "*",
            "s",
            ["^", "t", 3],
        ]);

        expect(
            stateVariables[
                stateVariables["/fOfu"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["*", "s", ["^", "u", 3]]);
        expect(
            stateVariables[
                stateVariables["/f2Ofu"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["*", "s", ["^", "u", 3]]);
        expect(
            stateVariables[
                stateVariables["/f3Ofu"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["*", "u", ["^", "t", 3]]);
        expect(
            stateVariables[
                stateVariables["/f4Ofu"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["*", "s", ["^", "u", 3]]);
        expect(
            stateVariables[
                stateVariables["/f5Ofu"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["*", "s", ["^", "u", 3]]);
        expect(
            stateVariables[
                stateVariables["/f6Ofu"].activeChildren[0].componentName
            ].stateValues.value.tree,
        ).eqls(["*", "u", ["^", "t", 3]]);
    });

    it("function of interpolated function can redefine variable without changing function", async () => {
        let core = await createTestCore({
            doenetML: `
    <function minima="(2)" name="f" />

    <function name="f2">$f</function>
    <function name="f3" variables="s">$f</function>

    $f{name="f4"}
    $f2{name="f5"}
    $f3{name="f6"}

    $f.variable{assignNames="fv"}
    $f2.variable{assignNames="f2v"}
    $f3.variable{assignNames="f3v"}
    $f4.variable{assignNames="f4v"}
    $f5.variable{assignNames="f5v"}
    $f6.variable{assignNames="f6v"}

    <p name="fOf0">$$f(0)</p>
    <p name="f2Of0">$$f2(0)</p>
    <p name="f3Of0">$$f3(0)</p>
    <p name="f4Of0">$$f4(0)</p>
    <p name="f5Of0">$$f5(0)</p>
    <p name="f6Of0">$$f6(0)</p>

    <p name="fOf1">$$f(1)</p>
    <p name="f2Of1">$$f2(1)</p>
    <p name="f3Of1">$$f3(1)</p>
    <p name="f4Of1">$$f4(1)</p>
    <p name="f5Of1">$$f5(1)</p>
    <p name="f6Of1">$$f6(1)</p>

    <p name="fOf2">$$f(2)</p>
    <p name="f2Of2">$$f2(2)</p>
    <p name="f3Of2">$$f3(2)</p>
    <p name="f4Of2">$$f4(2)</p>
    <p name="f5Of2">$$f5(2)</p>
    <p name="f6Of2">$$f6(2)</p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f"].stateValues.variables[0].tree).eq("x");
        expect(stateVariables["/f2"].stateValues.variables[0].tree).eq("x");
        expect(stateVariables["/f3"].stateValues.variables[0].tree).eq("s");
        expect(stateVariables["/f4"].stateValues.variables[0].tree).eq("x");
        expect(stateVariables["/f5"].stateValues.variables[0].tree).eq("x");
        expect(stateVariables["/f6"].stateValues.variables[0].tree).eq("s");

        let Of0names = [
            "/fOf0",
            "/f2Of0",
            "/f3Of0",
            "/f4Of0",
            "/f5Of0",
            "/f6Of0",
        ];

        for (let name of Of0names) {
            expect(
                stateVariables[
                    stateVariables[name].activeChildren[0].componentName
                ].stateValues.value.tree,
            ).eqls(2);
        }

        let Of1names = [
            "/fOf1",
            "/f2Of1",
            "/f3Of1",
            "/f4Of1",
            "/f5Of1",
            "/f6Of1",
        ];

        for (let name of Of1names) {
            expect(
                stateVariables[
                    stateVariables[name].activeChildren[0].componentName
                ].stateValues.value.tree,
            ).eqls(3);
        }

        let Of2names = [
            "/fOf2",
            "/f2Of2",
            "/f3Of2",
            "/f4Of2",
            "/f5Of2",
            "/f6Of2",
        ];

        for (let name of Of2names) {
            expect(
                stateVariables[
                    stateVariables[name].activeChildren[0].componentName
                ].stateValues.value.tree,
            ).eqls(6);
        }
    });

    it("extrema not resolved if not requested", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">sin(x)</function>
    $f{name="f2"}
    <function name="f3">$f</function>
    <function name="g" maxima="(1,2) (4,3)" />
    $g{name="g2"}
    <function name="g3">$g</function>
    `,
        });

        let stateVariables = core.components!;

        expect(stateVariables["/f"].state.formula.isResolved).eq(true);
        expect(stateVariables["/f"].state.symbolicfs.isResolved).eq(false);
        expect(stateVariables["/f"].state.numericalfs.isResolved).eq(false);
        expect(stateVariables["/f"].state.allMaxima.isResolved).eq(false);
        expect(stateVariables["/f"].state.allMinima.isResolved).eq(false);
        expect(stateVariables["/f"].state.allExtrema.isResolved).eq(false);
        expect(stateVariables["/f"].state.numMaxima.isResolved).eq(false);
        expect(stateVariables["/f"].state.numMinima.isResolved).eq(false);
        expect(stateVariables["/f"].state.numExtrema.isResolved).eq(false);
        expect(stateVariables["/f"].state.maxima.isResolved).eq(false);
        expect(stateVariables["/f"].state.minima.isResolved).eq(false);
        expect(stateVariables["/f"].state.extrema.isResolved).eq(false);

        expect(stateVariables["/f2"].state.formula.isResolved).eq(true);
        expect(stateVariables["/f2"].state.symbolicfs.isResolved).eq(false);
        expect(stateVariables["/f2"].state.numericalfs.isResolved).eq(false);
        expect(stateVariables["/f2"].state.allMaxima.isResolved).eq(false);
        expect(stateVariables["/f2"].state.allMinima.isResolved).eq(false);
        expect(stateVariables["/f2"].state.allExtrema.isResolved).eq(false);
        expect(stateVariables["/f2"].state.numMaxima.isResolved).eq(false);
        expect(stateVariables["/f2"].state.numMinima.isResolved).eq(false);
        expect(stateVariables["/f2"].state.numExtrema.isResolved).eq(false);
        expect(stateVariables["/f2"].state.maxima.isResolved).eq(false);
        expect(stateVariables["/f2"].state.minima.isResolved).eq(false);
        expect(stateVariables["/f2"].state.extrema.isResolved).eq(false);

        expect(stateVariables["/f3"].state.formula.isResolved).eq(true);
        expect(stateVariables["/f3"].state.symbolicfs.isResolved).eq(false);
        expect(stateVariables["/f3"].state.numericalfs.isResolved).eq(false);
        expect(stateVariables["/f3"].state.allMaxima.isResolved).eq(false);
        expect(stateVariables["/f3"].state.allMinima.isResolved).eq(false);
        expect(stateVariables["/f3"].state.allExtrema.isResolved).eq(false);
        expect(stateVariables["/f3"].state.numMaxima.isResolved).eq(false);
        expect(stateVariables["/f3"].state.numMinima.isResolved).eq(false);
        expect(stateVariables["/f3"].state.numExtrema.isResolved).eq(false);
        expect(stateVariables["/f3"].state.maxima.isResolved).eq(false);
        expect(stateVariables["/f3"].state.minima.isResolved).eq(false);
        expect(stateVariables["/f3"].state.extrema.isResolved).eq(false);

        expect(stateVariables["/g"].state.formula.isResolved).eq(true);
        expect(stateVariables["/g"].state.symbolicfs.isResolved).eq(false);
        expect(stateVariables["/g"].state.numericalfs.isResolved).eq(false);
        expect(stateVariables["/g"].state.allMaxima.isResolved).eq(false);
        expect(stateVariables["/g"].state.allMinima.isResolved).eq(false);
        expect(stateVariables["/g"].state.allExtrema.isResolved).eq(false);
        expect(stateVariables["/g"].state.numMaxima.isResolved).eq(false);
        expect(stateVariables["/g"].state.numMinima.isResolved).eq(false);
        expect(stateVariables["/g"].state.numExtrema.isResolved).eq(false);
        expect(stateVariables["/g"].state.maxima.isResolved).eq(false);
        expect(stateVariables["/g"].state.minima.isResolved).eq(false);
        expect(stateVariables["/g"].state.extrema.isResolved).eq(false);

        expect(stateVariables["/g2"].state.formula.isResolved).eq(true);
        expect(stateVariables["/g2"].state.symbolicfs.isResolved).eq(false);
        expect(stateVariables["/g2"].state.numericalfs.isResolved).eq(false);
        expect(stateVariables["/g2"].state.allMaxima.isResolved).eq(false);
        expect(stateVariables["/g2"].state.allMinima.isResolved).eq(false);
        expect(stateVariables["/g2"].state.allExtrema.isResolved).eq(false);
        expect(stateVariables["/g2"].state.numMaxima.isResolved).eq(false);
        expect(stateVariables["/g2"].state.numMinima.isResolved).eq(false);
        expect(stateVariables["/g2"].state.numExtrema.isResolved).eq(false);
        expect(stateVariables["/g2"].state.maxima.isResolved).eq(false);
        expect(stateVariables["/g2"].state.minima.isResolved).eq(false);
        expect(stateVariables["/g2"].state.extrema.isResolved).eq(false);

        expect(stateVariables["/g3"].state.formula.isResolved).eq(true);
        expect(stateVariables["/g3"].state.symbolicfs.isResolved).eq(false);
        expect(stateVariables["/g3"].state.numericalfs.isResolved).eq(false);
        expect(stateVariables["/g3"].state.allMaxima.isResolved).eq(false);
        expect(stateVariables["/g3"].state.allMinima.isResolved).eq(false);
        expect(stateVariables["/g3"].state.allExtrema.isResolved).eq(false);
        expect(stateVariables["/g3"].state.numMaxima.isResolved).eq(false);
        expect(stateVariables["/g3"].state.numMinima.isResolved).eq(false);
        expect(stateVariables["/g3"].state.numExtrema.isResolved).eq(false);
        expect(stateVariables["/g3"].state.maxima.isResolved).eq(false);
        expect(stateVariables["/g3"].state.minima.isResolved).eq(false);
        expect(stateVariables["/g3"].state.extrema.isResolved).eq(false);
    });

    it("function determined by formula, specify 1 input", async () => {
        let core = await createTestCore({
            doenetML: `
    <function numInputs="1" name="f">3/(1+e^(-x/2))</function>
    <evaluate function="$f" input="z" name="fz" />
    `,
        });

        await test_function_3_over_exp(core);
    });

    async function test_function_two_var_exp(core) {
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(2);

        expect(stateVariables["/f"].stateValues.domain.map((x) => x.tree)).eqls(
            [
                [
                    "interval",
                    ["tuple", -Infinity, Infinity],
                    ["tuple", false, false],
                ],
                [
                    "interval",
                    ["tuple", -Infinity, Infinity],
                    ["tuple", false, false],
                ],
            ],
        );

        const f = stateVariables["/f"].stateValues.numericalf;

        expect(f(-5, 7)).closeTo(3 / (7 + Math.exp(5 / 2)), 1e-12);
        expect(f(1, 4)).closeTo(3 / (4 + Math.exp(-1 / 2)), 1e-12);
    }

    it("function of two variables determined by formula", async () => {
        let core = await createTestCore({
            doenetML: `
    <function numInputs="2" name="f">3/(y+e^(-x/2))</function>
    `,
        });

        await test_function_two_var_exp(core);
    });

    it("function of two variables determined by formula, specify variables", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" numInputs="2" variables="q r">3/(r+e^(-q/2))</function>
    `,
        });

        await test_function_two_var_exp(core);
    });

    it("function of two variables determined by formula, specify variables, no numInputs specified", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" variables="q r">3/(r+e^(-q/2))</function>
    `,
        });

        await test_function_two_var_exp(core);
    });

    it("function of two variables determined by formula, specify variables, no numInputs specified, restrict domain", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" variables="q r" domain="(-4,2] [1,3)">3/(r+e^(-q/2))</function>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(2);
        expect(stateVariables["/f"].stateValues.domain.map((x) => x.tree)).eqls(
            [
                ["interval", ["tuple", -4, 2], ["tuple", false, true]],
                ["interval", ["tuple", 1, 3], ["tuple", true, false]],
            ],
        );

        const f = stateVariables["/f"].stateValues.numericalf;

        expect(f(-4, 2)).eqls(NaN);
        expect(f(3, 3)).eqls(NaN);
        expect(f(2, 1)).closeTo(3 / (1 + Math.exp(-1)), 1e-12);
        expect(f(-3, 2)).closeTo(3 / (2 + Math.exp(3 / 2)), 1e-12);
    });

    async function test_function_three_var_exp(core) {
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(3);
        expect(stateVariables["/f"].stateValues.domain.map((x) => x.tree)).eqls(
            [
                [
                    "interval",
                    ["tuple", -Infinity, Infinity],
                    ["tuple", false, false],
                ],
                [
                    "interval",
                    ["tuple", -Infinity, Infinity],
                    ["tuple", false, false],
                ],
                [
                    "interval",
                    ["tuple", -Infinity, Infinity],
                    ["tuple", false, false],
                ],
            ],
        );

        const f = stateVariables["/f"].stateValues.numericalf;

        expect(f(-5, 7, -2)).closeTo(-2 / (7 + Math.exp(5 / 2)), 1e-12);
        expect(f(1, 4, -9)).closeTo(-9 / (4 + Math.exp(-1 / 2)), 1e-12);
    }

    it("function of three variables determined by formula", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" numInputs="3">z/(y+e^(-x/2))</function>
    `,
        });

        await test_function_three_var_exp(core);
    });

    it("function of three variables determined by formula, specify variables", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" variables="q r s">s/(r+e^(-q/2))</function>
    `,
        });

        await test_function_three_var_exp(core);
    });

    it("function of three variables determined by formula, specify variables, restrict domain", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" variables="q r s" domain="(2,5) [-4, 4] [-3, -1)">s/(r+e^(-q/2))</function>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(3);
        expect(stateVariables["/f"].stateValues.domain.map((x) => x.tree)).eqls(
            [
                ["interval", ["tuple", 2, 5], ["tuple", false, false]],
                ["interval", ["tuple", -4, 4], ["tuple", true, true]],
                ["interval", ["tuple", -3, -1], ["tuple", true, false]],
            ],
        );

        const f = stateVariables["/f"].stateValues.numericalf;

        expect(f(5, 3, -3)).eqls(NaN);
        expect(f(4, 3, -3)).closeTo(-3 / (3 + Math.exp(-2)), 1e-12);
        expect(f(3, 2, -1)).eqls(NaN);
        expect(f(3, 2, -2)).closeTo(-2 / (2 + Math.exp(-3 / 2)), 1e-12);
    });

    async function test_function_four_var_exp(core) {
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(4);
        expect(stateVariables["/f"].stateValues.domain.map((x) => x.tree)).eqls(
            [
                [
                    "interval",
                    ["tuple", -Infinity, Infinity],
                    ["tuple", false, false],
                ],
                [
                    "interval",
                    ["tuple", -Infinity, Infinity],
                    ["tuple", false, false],
                ],
                [
                    "interval",
                    ["tuple", -Infinity, Infinity],
                    ["tuple", false, false],
                ],
                [
                    "interval",
                    ["tuple", -Infinity, Infinity],
                    ["tuple", false, false],
                ],
            ],
        );

        const f = stateVariables["/f"].stateValues.numericalf;

        expect(f(-5, 7, -2, 6)).closeTo(-2 / (7 + Math.exp(5 / 2)) + 6, 1e-12);
        expect(f(1, 4, -9, -8)).closeTo(-9 / (4 + Math.exp(-1 / 2)) - 8, 1e-12);
    }

    it("function of four variables determined by formula", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" numInputs="4">x_3/(x_2+e^(-x_1/2))+x_4</function>
    `,
        });

        await test_function_four_var_exp(core);
    });

    it("function of four variables determined by formula, specify some variables", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" numInputs="4" variables="x y z">z/(y+e^(-x/2))+x_4</function>
    `,
        });

        await test_function_four_var_exp(core);
    });

    it("function of four variables determined by formula, specify some variables, restrict domain", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" numInputs="4" variables="x y z" domain="[-5,1] [2,4) (4, 7] (-8, -4)">z/(y+e^(-x/2))+x_4</function>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(4);
        expect(stateVariables["/f"].stateValues.domain.map((x) => x.tree)).eqls(
            [
                ["interval", ["tuple", -5, 1], ["tuple", true, true]],
                ["interval", ["tuple", 2, 4], ["tuple", true, false]],
                ["interval", ["tuple", 4, 7], ["tuple", false, true]],
                ["interval", ["tuple", -8, -4], ["tuple", false, false]],
            ],
        );

        const f = stateVariables["/f"].stateValues.numericalf;

        expect(f(-5, 2, 7, -4)).eqls(NaN);
        expect(f(-5, 2, 7, -5)).closeTo(7 / (2 + Math.exp(5 / 2)) - 5, 1e-12);
    });

    async function test_2d_vector_function_single_var(core) {
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(1);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(2);

        let f1 = stateVariables["/f"].stateValues.fs[0];
        let f2 = stateVariables["/f"].stateValues.fs[1];
        let numericalf1 = stateVariables["/f"].stateValues.numericalfs[0];
        let numericalf2 = stateVariables["/f"].stateValues.numericalfs[1];
        let symbolicf1 = stateVariables["/f"].stateValues.symbolicfs[0];
        let symbolicf2 = stateVariables["/f"].stateValues.symbolicfs[1];

        expect(f1(me.fromAst(-5)).equals(me.fromText("(-5)^2"))).eq(true);
        expect(f2(me.fromAst(-5)).equals(me.fromText("(-5)^3"))).eq(true);
        expect(f1(me.fromAst(3)).equals(me.fromText("3^2"))).eq(true);
        expect(f2(me.fromAst(3)).equals(me.fromText("3^3"))).eq(true);
        expect(f1(me.fromAst("z")).equals(me.fromText("z^2"))).eq(true);
        expect(f2(me.fromAst("z")).equals(me.fromText("z^3"))).eq(true);
        expect(numericalf1(-5)).closeTo(25, 1e-12);
        expect(numericalf2(-5)).closeTo(-125, 1e-12);
        expect(numericalf1(3)).closeTo(9, 1e-12);
        expect(numericalf2(3)).closeTo(27, 1e-12);
        expect(symbolicf1(me.fromAst(-5)).equals(me.fromText("(-5)^2"))).eq(
            true,
        );
        expect(symbolicf2(me.fromAst(-5)).equals(me.fromText("(-5)^3"))).eq(
            true,
        );
        expect(symbolicf1(me.fromAst(3)).equals(me.fromText("3^2"))).eq(true);
        expect(symbolicf2(me.fromAst(3)).equals(me.fromText("3^3"))).eq(true);
        expect(symbolicf1(me.fromAst("z")).equals(me.fromText("z^2"))).eq(true);
        expect(symbolicf2(me.fromAst("z")).equals(me.fromText("z^3"))).eq(true);
    }

    it("2D vector-valued function of a single variable", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">(x^2, x^3)</function>
    `,
        });

        await test_2d_vector_function_single_var(core);
    });

    it("2D vector-valued function of a single variable, specify variable", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" variable="t">(t^2, t^3)</function>
    `,
        });

        await test_2d_vector_function_single_var(core);
    });

    it("2D vector-valued function of a single variable, specify numOutputs", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" variables="t" numOutputs="2">(t^2, t^3)</function>
    `,
        });

        await test_2d_vector_function_single_var(core);
    });

    async function test_3d_vector_function_single_var(core) {
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(1);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(3);

        let f1 = stateVariables["/f"].stateValues.fs[0];
        let f2 = stateVariables["/f"].stateValues.fs[1];
        let f3 = stateVariables["/f"].stateValues.fs[2];
        let numericalf1 = stateVariables["/f"].stateValues.numericalfs[0];
        let numericalf2 = stateVariables["/f"].stateValues.numericalfs[1];
        let numericalf3 = stateVariables["/f"].stateValues.numericalfs[2];
        let symbolicf1 = stateVariables["/f"].stateValues.symbolicfs[0];
        let symbolicf2 = stateVariables["/f"].stateValues.symbolicfs[1];
        let symbolicf3 = stateVariables["/f"].stateValues.symbolicfs[2];

        expect(f1(me.fromAst(-5)).equals(me.fromText("(-5)^2"))).eq(true);
        expect(f2(me.fromAst(-5)).equals(me.fromText("(-5)^3"))).eq(true);
        expect(f3(me.fromAst(-5)).equals(me.fromText("(-5)^4"))).eq(true);
        expect(f1(me.fromAst(3)).equals(me.fromText("3^2"))).eq(true);
        expect(f2(me.fromAst(3)).equals(me.fromText("3^3"))).eq(true);
        expect(f3(me.fromAst(3)).equals(me.fromText("3^4"))).eq(true);
        expect(f1(me.fromAst("z")).equals(me.fromText("z^2"))).eq(true);
        expect(f2(me.fromAst("z")).equals(me.fromText("z^3"))).eq(true);
        expect(f3(me.fromAst("z")).equals(me.fromText("z^4"))).eq(true);
        expect(numericalf1(-5)).closeTo(25, 1e-12);
        expect(numericalf2(-5)).closeTo(-125, 1e-12);
        expect(numericalf3(-5)).closeTo(625, 1e-12);
        expect(numericalf1(3)).closeTo(9, 1e-12);
        expect(numericalf2(3)).closeTo(27, 1e-12);
        expect(numericalf3(3)).closeTo(81, 1e-12);
        expect(symbolicf1(me.fromAst(-5)).equals(me.fromText("(-5)^2"))).eq(
            true,
        );
        expect(symbolicf2(me.fromAst(-5)).equals(me.fromText("(-5)^3"))).eq(
            true,
        );
        expect(symbolicf3(me.fromAst(-5)).equals(me.fromText("(-5)^4"))).eq(
            true,
        );
        expect(symbolicf1(me.fromAst(3)).equals(me.fromText("3^2"))).eq(true);
        expect(symbolicf2(me.fromAst(3)).equals(me.fromText("3^3"))).eq(true);
        expect(symbolicf3(me.fromAst(3)).equals(me.fromText("3^4"))).eq(true);
        expect(symbolicf1(me.fromAst("z")).equals(me.fromText("z^2"))).eq(true);
        expect(symbolicf2(me.fromAst("z")).equals(me.fromText("z^3"))).eq(true);
        expect(symbolicf3(me.fromAst("z")).equals(me.fromText("z^4"))).eq(true);
    }

    it("3D vector-valued function of a single variable", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">(x^2, x^3, x^4)</function>
    `,
        });

        await test_3d_vector_function_single_var(core);
    });

    it("3D vector-valued function of a single variable, specify variable", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" variable="t">(t^2, t^3, t^4)</function>
    `,
        });

        await test_3d_vector_function_single_var(core);
    });

    it("2D vector-valued function of two variables", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" numInputs="2">(x^2y^3, x^3y^2)</function>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(2);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(2);

        let f1 = stateVariables["/f"].stateValues.fs[0];
        let f2 = stateVariables["/f"].stateValues.fs[1];
        let numericalf1 = stateVariables["/f"].stateValues.numericalfs[0];
        let numericalf2 = stateVariables["/f"].stateValues.numericalfs[1];
        let symbolicf1 = stateVariables["/f"].stateValues.symbolicfs[0];
        let symbolicf2 = stateVariables["/f"].stateValues.symbolicfs[1];

        expect(
            f1(me.fromAst(-5), me.fromAst(2)).equals(me.fromText("(-5)^2*2^3")),
        ).eq(true);
        expect(
            f2(me.fromAst(-5), me.fromAst(2)).equals(me.fromText("(-5)^3*2^2")),
        ).eq(true);
        expect(
            f1(me.fromAst(3), me.fromAst(-4)).equals(me.fromText("3^2*(-4)^3")),
        ).eq(true);
        expect(
            f2(me.fromAst(3), me.fromAst(-4)).equals(me.fromText("3^3*(-4)^2")),
        ).eq(true);
        expect(
            f1(me.fromAst("z"), me.fromAst("w")).equals(me.fromText("z^2w^3")),
        ).eq(true);
        expect(
            f2(me.fromAst("z"), me.fromAst("w")).equals(me.fromText("z^3w^2")),
        ).eq(true);
        expect(numericalf1(-5, 2)).closeTo(200, 1e-12);
        expect(numericalf2(-5, 2)).closeTo(-500, 1e-12);
        expect(numericalf1(3, -4)).closeTo(-576, 1e-12);
        expect(numericalf2(3, -4)).closeTo(432, 1e-12);
        expect(
            symbolicf1(me.fromAst(-5), me.fromAst(2)).equals(
                me.fromText("(-5)^2*2^3"),
            ),
        ).eq(true);
        expect(
            symbolicf2(me.fromAst(-5), me.fromAst(2)).equals(
                me.fromText("(-5)^3*2^2"),
            ),
        ).eq(true);
        expect(
            symbolicf1(me.fromAst(3), me.fromAst(-4)).equals(
                me.fromText("3^2*(-4)^3"),
            ),
        ).eq(true);
        expect(
            symbolicf2(me.fromAst(3), me.fromAst(-4)).equals(
                me.fromText("3^3*(-4)^2"),
            ),
        ).eq(true);
        expect(
            symbolicf1(me.fromAst("z"), me.fromAst("w")).equals(
                me.fromText("z^2w^3"),
            ),
        ).eq(true);
        expect(
            symbolicf2(me.fromAst("z"), me.fromAst("w")).equals(
                me.fromText("z^3w^2"),
            ),
        ).eq(true);
    });

    async function test_3d_vector_function_two_vars(core) {
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/f"].stateValues.numInputs).eq(2);
        expect(stateVariables["/f"].stateValues.numOutputs).eq(3);

        let f1 = stateVariables["/f"].stateValues.fs[0];
        let f2 = stateVariables["/f"].stateValues.fs[1];
        let f3 = stateVariables["/f"].stateValues.fs[2];
        let numericalf1 = stateVariables["/f"].stateValues.numericalfs[0];
        let numericalf2 = stateVariables["/f"].stateValues.numericalfs[1];
        let numericalf3 = stateVariables["/f"].stateValues.numericalfs[2];
        let symbolicf1 = stateVariables["/f"].stateValues.symbolicfs[0];
        let symbolicf2 = stateVariables["/f"].stateValues.symbolicfs[1];
        let symbolicf3 = stateVariables["/f"].stateValues.symbolicfs[2];

        expect(f1(-5, 2).equals(me.fromText("(-5)^2*2^3"))).eq(true);
        expect(f2(-5, 2).equals(me.fromText("(-5)^3*2^2"))).eq(true);
        expect(f3(-5, 2).equals(me.fromText("(-5)*2"))).eq(true);
        expect(f1(3, -4).equals(me.fromText("3^2*(-4)^3"))).eq(true);
        expect(f2(3, -4).equals(me.fromText("3^3*(-4)^2"))).eq(true);
        expect(f3(3, -4).equals(me.fromText("3*(-4)"))).eq(true);
        expect(f1("z", "w").equals(me.fromText("z^2w^3"))).eq(true);
        expect(f2("z", "w").equals(me.fromText("z^3w^2"))).eq(true);
        expect(f3("z", "w").equals(me.fromText("zw"))).eq(true);
        expect(numericalf1(-5, 2)).closeTo(200, 1e-12);
        expect(numericalf2(-5, 2)).closeTo(-500, 1e-12);
        expect(numericalf3(-5, 2)).closeTo(-10, 1e-12);
        expect(numericalf1(3, -4)).closeTo(-576, 1e-12);
        expect(numericalf2(3, -4)).closeTo(432, 1e-12);
        expect(numericalf3(3, -4)).closeTo(-12, 1e-12);
        expect(symbolicf1(-5, 2).equals(me.fromText("(-5)^2*2^3"))).eq(true);
        expect(symbolicf2(-5, 2).equals(me.fromText("(-5)^3*2^2"))).eq(true);
        expect(symbolicf3(-5, 2).equals(me.fromText("(-5)*2"))).eq(true);
        expect(symbolicf1(3, -4).equals(me.fromText("3^2*(-4)^3"))).eq(true);
        expect(symbolicf2(3, -4).equals(me.fromText("3^3*(-4)^2"))).eq(true);
        expect(symbolicf3(3, -4).equals(me.fromText("3*(-4)"))).eq(true);
        expect(symbolicf1("z", "w").equals(me.fromText("z^2w^3"))).eq(true);
        expect(symbolicf2("z", "w").equals(me.fromText("z^3w^2"))).eq(true);
        expect(symbolicf3("z", "w").equals(me.fromText("zw"))).eq(true);
    }

    it("3D vector-valued function of two variables", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" variables="s t">(s^2t^3, s^3t^2, st)</function>
    `,
        });

        await test_3d_vector_function_two_vars(core);
    });

    it("3D vector-valued function of two variables, as alt vector", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" variables="s t">⟨s^2t^3, s^3t^2, st⟩</function>
    `,
        });

        await test_3d_vector_function_two_vars(core);
    });

    it("copy function and overwrite symbolic attribute", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1" symbolic="false">x^2</function>
    <function copySource="f1" symbolic name="f2" />
    <function copySource="f2" symbolic="false" name="f3" />
    <function name="g1">x^2</function>
    <function copySource="g1" symbolic="false" name="g2" />
    <function copySource="g2" symbolic name="g3" />

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1"].stateValues.symbolic).eq(false);
        expect(stateVariables["/f2"].stateValues.symbolic).eq(true);
        expect(stateVariables["/f3"].stateValues.symbolic).eq(false);
        expect(stateVariables["/g1"].stateValues.symbolic).eq(true);
        expect(stateVariables["/g2"].stateValues.symbolic).eq(false);
        expect(stateVariables["/g3"].stateValues.symbolic).eq(true);
    });

    it("warnings on bad domain", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1" domain="(3,4)">x</function>
    <function name="f2" domain="(">x</function>
    <function name="f3" domain="(3,4,5)">x</function>
    <function name="f4" domain="">x</function>
    <function name="f5" domain="(3,4) (5,6)">x</function>

    <p>f1 domain: <interval name="domainf1" copySource="f1.domain" /></p>
    <p>f2 domain: <interval name="domainf2" copySource="f2.domain" /></p>
    <p>f3 domain: <interval name="domainf3" copySource="f3.domain" /></p>
    <p>f4 domain: <interval name="domainf4" copySource="f4.domain" /></p>
    <p>f5 domain: <interval name="domainf5" copySource="f5.domain" /></p>

    <function name="g1" numInputs="2" domain="(3,4)">x+y</function>
    <function name="g2" numInputs="2" domain="(3,4) (5,6)">x+y</function>
    <function name="g3" numInputs="2" domain="(3,4,5) (6,7)">x+y</function>
    <function name="g4" numInputs="2" domain="">x+y</function>
    <function name="g5" numInputs="2" domain="(3,4) (5,6) (7,8)">x+y</function>

    <p name="pDomaing1">g1 domain: $g1.domain</p>
    <p name="pDomaing2">g2 domain: $g2.domain</p>
    <p name="pDomaing3">g3 domain: $g3.domain</p>
    <p name="pDomaing4">g4 domain: $g4.domain</p>
    <p name="pDomaing5">g5 domain: $g5.domain</p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/domainf1"].stateValues.latex)).eq(
            "(3,4)",
        );
        expect(cleanLatex(stateVariables["/domainf2"].stateValues.latex)).eq(
            "(-\\infty,\\infty)",
        );
        expect(cleanLatex(stateVariables["/domainf3"].stateValues.latex)).eq(
            "(-\\infty,\\infty)",
        );
        expect(cleanLatex(stateVariables["/domainf4"].stateValues.latex)).eq(
            "(-\\infty,\\infty)",
        );
        expect(cleanLatex(stateVariables["/domainf5"].stateValues.latex)).eq(
            "(3,4)",
        );

        expect(stateVariables["/pDomaing1"].stateValues.text).eq(
            "g1 domain: ( -∞, ∞ ), ( -∞, ∞ )",
        );
        expect(stateVariables["/pDomaing2"].stateValues.text).eq(
            "g2 domain: ( 3, 4 ), ( 5, 6 )",
        );
        expect(stateVariables["/pDomaing3"].stateValues.text).eq(
            "g3 domain: ( -∞, ∞ ), ( -∞, ∞ )",
        );
        expect(stateVariables["/pDomaing4"].stateValues.text).eq(
            "g4 domain: ( -∞, ∞ ), ( -∞, ∞ )",
        );
        expect(stateVariables["/pDomaing5"].stateValues.text).eq(
            "g5 domain: ( 3, 4 ), ( 5, 6 )",
        );

        let errorWarnings = await core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(7);

        expect(errorWarnings.warnings[0].message).contain(
            `Insufficient dimensions for domain for function. Domain has 0 intervals but the function has 1 input.`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(47);

        expect(errorWarnings.warnings[1].message).contain(
            `Invalid format for domain for function`,
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(4);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(53);

        expect(errorWarnings.warnings[2].message).contain(
            `Insufficient dimensions for domain for function. Domain has 0 intervals but the function has 1 input.`,
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(5);
        expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(5);
        expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(46);

        expect(errorWarnings.warnings[3].message).contain(
            `Insufficient dimensions for domain for function. Domain has 1 interval but the function has 2 inputs.`,
        );
        expect(errorWarnings.warnings[3].level).eq(1);
        expect(errorWarnings.warnings[3].doenetMLrange.lineBegin).eq(14);
        expect(errorWarnings.warnings[3].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[3].doenetMLrange.lineEnd).eq(14);
        expect(errorWarnings.warnings[3].doenetMLrange.charEnd).eq(67);

        expect(errorWarnings.warnings[4].message).contain(
            `Invalid format for domain for function`,
        );
        expect(errorWarnings.warnings[4].level).eq(1);
        expect(errorWarnings.warnings[4].doenetMLrange.lineBegin).eq(16);
        expect(errorWarnings.warnings[4].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[4].doenetMLrange.lineEnd).eq(16);
        expect(errorWarnings.warnings[4].doenetMLrange.charEnd).eq(75);

        expect(errorWarnings.warnings[5].message).contain(
            `Insufficient dimensions for domain for function. Domain has 0 intervals but the function has 2 inputs.`,
        );
        expect(errorWarnings.warnings[5].level).eq(1);
        expect(errorWarnings.warnings[5].doenetMLrange.lineBegin).eq(17);
        expect(errorWarnings.warnings[5].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[5].doenetMLrange.lineEnd).eq(17);
        expect(errorWarnings.warnings[5].doenetMLrange.charEnd).eq(62);

        expect(errorWarnings.warnings[6].message).contain(
            `Invalid format for attribute domain of <function>`,
        );
        expect(errorWarnings.warnings[6].level).eq(1);
        expect(errorWarnings.warnings[6].doenetMLrange.lineBegin).eq(3);
        expect(errorWarnings.warnings[6].doenetMLrange.charBegin).eq(33);
        expect(errorWarnings.warnings[6].doenetMLrange.lineEnd).eq(3);
        expect(errorWarnings.warnings[6].doenetMLrange.charEnd).eq(33);
    });

    it("copy function and overwrite numInputs", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1" symbolic>xyz</function>
    <function copySource="f1" numInputs="2" name="f2" />
    <function copySource="f2" numInputs="3" name="f3" />
    
    <p name="p1">$$f1(a)</p>
    <p name="p2">$$f2(a,b)</p>
    <p name="p3">$$f3(a,b,c)</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1"].stateValues.numInputs).eq(1);
        expect(stateVariables["/f2"].stateValues.numInputs).eq(2);
        expect(stateVariables["/f3"].stateValues.numInputs).eq(3);
        expect(
            stateVariables["/f1"].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables["/f2"].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y"]);
        expect(
            stateVariables["/f3"].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);

        expect(stateVariables["/p1"].stateValues.text).eq("a y z");
        expect(stateVariables["/p2"].stateValues.text).eq("a b z");
        expect(stateVariables["/p3"].stateValues.text).eq("a b c");
    });

    it("copy function and overwrite variables", async () => {
        let core = await createTestCore({
            doenetML: `
    <text>a</text>
    <function name="f1" symbolic simplify="none">xyz</function>
    <function copySource="f1" variables="x y" name="f2" />
    <function copySource="f2" variables="x y z" name="f3" />
    <function copySource="f3" variables="z y" name="f4" />
    <function copySource="f4" variables="y" name="f5" />
    <function copySource="f4" variable="y" name="f5a" />
    
    <p name="p1">$$f1(a)</p>
    <p name="p2">$$f2(a,b)</p>
    <p name="p3">$$f3(a,b,c)</p>
    <p name="p4">$$f4(a,b)</p>
    <p name="p5">$$f5(a)</p>
    <p name="p5a">$$f5a(a)</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1"].stateValues.numInputs).eq(1);
        expect(stateVariables["/f2"].stateValues.numInputs).eq(2);
        expect(stateVariables["/f3"].stateValues.numInputs).eq(3);
        expect(stateVariables["/f4"].stateValues.numInputs).eq(2);
        expect(stateVariables["/f5"].stateValues.numInputs).eq(1);
        expect(stateVariables["/f5a"].stateValues.numInputs).eq(1);
        expect(
            stateVariables["/f1"].stateValues.variables.map((x) => x.tree),
        ).eqls(["x"]);
        expect(
            stateVariables["/f2"].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y"]);
        expect(
            stateVariables["/f3"].stateValues.variables.map((x) => x.tree),
        ).eqls(["x", "y", "z"]);
        expect(
            stateVariables["/f4"].stateValues.variables.map((x) => x.tree),
        ).eqls(["z", "y"]);
        expect(
            stateVariables["/f5"].stateValues.variables.map((x) => x.tree),
        ).eqls(["y"]);
        expect(
            stateVariables["/f5a"].stateValues.variables.map((x) => x.tree),
        ).eqls(["y"]);

        expect(stateVariables["/p1"].stateValues.text).eq("a y z");
        expect(stateVariables["/p2"].stateValues.text).eq("a b z");
        expect(stateVariables["/p3"].stateValues.text).eq("a b c");
        expect(stateVariables["/p4"].stateValues.text).eq("x b a");
        expect(stateVariables["/p5"].stateValues.text).eq("x a z");
        expect(stateVariables["/p5a"].stateValues.text).eq("x a z");
    });

    async function test_prop_index(core) {
        let stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/mn1"].stateValues.latex)).eq(
            "(2,1)",
        );
        expect(cleanLatex(stateVariables["/mx1"].stateValues.latex)).eq(
            "(8,9)",
        );
        expect(cleanLatex(stateVariables["/ex1"].stateValues.latex)).eq(
            "(-4,4)",
        );

        expect(cleanLatex(stateVariables["/mnl1"].stateValues.latex)).eq("2");
        expect(cleanLatex(stateVariables["/mxl1"].stateValues.latex)).eq("8");
        expect(cleanLatex(stateVariables["/exl1"].stateValues.latex)).eq("-4");

        expect(cleanLatex(stateVariables["/mnv1"].stateValues.latex)).eq("1");
        expect(cleanLatex(stateVariables["/mxv1"].stateValues.latex)).eq("9");
        expect(cleanLatex(stateVariables["/exv1"].stateValues.latex)).eq("4");

        expect(cleanLatex(stateVariables["/mn11"].stateValues.latex)).eq("-5");
        expect(cleanLatex(stateVariables["/mx11"].stateValues.latex)).eq("4");
        expect(cleanLatex(stateVariables["/ex11"].stateValues.latex)).eq("-5");

        // set propIndex to 1
        await updateMathInputValue({ latex: "1", name: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/mn1"].stateValues.latex)).eq(
            "(-7,-5)",
        );
        expect(cleanLatex(stateVariables["/mx1"].stateValues.latex)).eq(
            "(-4,4)",
        );
        expect(cleanLatex(stateVariables["/ex1"].stateValues.latex)).eq(
            "(-7,-5)",
        );

        expect(cleanLatex(stateVariables["/mnl1"].stateValues.latex)).eq("-7");
        expect(cleanLatex(stateVariables["/mxl1"].stateValues.latex)).eq("-4");
        expect(cleanLatex(stateVariables["/exl1"].stateValues.latex)).eq("-7");

        expect(cleanLatex(stateVariables["/mnv1"].stateValues.latex)).eq("-5");
        expect(cleanLatex(stateVariables["/mxv1"].stateValues.latex)).eq("4");
        expect(cleanLatex(stateVariables["/exv1"].stateValues.latex)).eq("-5");

        expect(cleanLatex(stateVariables["/mn11"].stateValues.latex)).eq("-7");
        expect(cleanLatex(stateVariables["/mx11"].stateValues.latex)).eq("-4");
        expect(cleanLatex(stateVariables["/ex11"].stateValues.latex)).eq("-7");
    }

    it("copy props with propIndex, dot and array notation", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>n: <mathinput name="n" prefill="2" /></p>

  <graph name="g">
    <function name="f" minima="(-7,-5) (2,1)" maxima="(-4,4) (8,9)" />
  </graph>
  
  <p><aslist><copy source="f.minima[$n]" assignNames="mn1 mn2" /></aslist></p>
  <p><aslist><copy source="f.maxima[$n]" assignNames="mx1 mx2" /></aslist></p>
  <p><aslist><copy source="f.extrema[$n]" assignNames="ex1 ex2 ex3 ex4" /></aslist></p>
  
  <p><aslist><copy source="f.minimumLocations[$n]" assignNames="mnl1 mnl2" /></aslist></p>
  <p><aslist><copy source="f.maximumLocations[$n]" assignNames="mxl1 mxl2" /></aslist></p>
  <p><aslist><copy source="f.extremumLocations[$n]" assignNames="exl1 exl2 exl3 exl4" /></aslist></p>
  
  <p><aslist><copy source="f.minimumValues[$n]" assignNames="mnv1 mnv2" /></aslist></p>
  <p><aslist><copy source="f.maximumValues[$n]" assignNames="mxv1 mxv2" /></aslist></p>
  <p><aslist><copy source="f.extremumValues[$n]" assignNames="exv1 exv2 exv3 exv4" /></aslist></p>

  <p><aslist><copy source="f.minimum1[$n]" assignNames="mn11 mn12" /></aslist></p>
  <p><aslist><copy source="f.maximum1[$n]" assignNames="mx11 mx12" /></aslist></p>
  <p><aslist><copy source="f.extremum1[$n]" assignNames="ex11 ex12 ex13 ex14" /></aslist></p>

  `,
        });

        await test_prop_index(core);
    });

    it("copy props with multidimensional propIndex, dot and array notation", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>n: <mathinput name="n" prefill="2" /></p>

  <graph name="g">
    <function name="f" minima="(-7,-5) (2,1)" maxima="(-4,4) (8,9)" />
  </graph>
  
  <p><aslist><copy source="f.minima[$n]" assignNames="mn1 mn2" /></aslist></p>
  <p><aslist><copy source="f.maxima[$n]" assignNames="mx1 mx2" /></aslist></p>
  <p><aslist><copy source="f.extrema[$n]" assignNames="ex1 ex2 ex3 ex4" /></aslist></p>
  
  <p><aslist><copy source="f.minima[$n][1]" assignNames="mnl1 mnl2" /></aslist></p>
  <p><aslist><copy source="f.maxima[$n][1]" assignNames="mxl1 mxl2" /></aslist></p>
  <p><aslist><copy source="f.extrema[$n][1]" assignNames="exl1 exl2 exl3 exl4" /></aslist></p>
  
  <p><aslist><copy source="f.minima[$n][2]" assignNames="mnv1 mnv2" /></aslist></p>
  <p><aslist><copy source="f.maxima[$n][2]" assignNames="mxv1 mxv2" /></aslist></p>
  <p><aslist><copy source="f.extrema[$n][2]" assignNames="exv1 exv2 exv3 exv4" /></aslist></p>

  <p><aslist><copy source="f.minima[1][$n]" assignNames="mn11 mn12" /></aslist></p>
  <p><aslist><copy source="f.maxima[1][$n]" assignNames="mx11 mx12" /></aslist></p>
  <p><aslist><copy source="f.extrema[1][$n]" assignNames="ex11 ex12 ex13 ex14" /></aslist></p>

  `,
        });
        await test_prop_index(core);
    });

    it("rounding, overwrite on copy", async () => {
        let core = await createTestCore({
            doenetML: `
  <function name="f1">255.029847 sin(0.52952342x) + 3</function>
  <function name="f2" displayDigits="4"> 255.029847 sin(0.52952342x) + 3</function>
  <function name="f3" displayDigits="4" padZeros> 255.029847 sin(0.52952342x) + 3</function>
  <function name="f4" displayDecimals="3"> 255.029847 sin(0.52952342x) + 3</function>
  <function name="f5" displayDecimals="3" padZeros> 255.029847 sin(0.52952342x) + 3</function>

  <function copysource="f1" name="f1dg6" displayDigits="6" />
  <function copysource="f2" name="f2dg6" displayDigits="6" />
  <function copysource="f3" name="f3dg6" displayDigits="6" />
  <function copysource="f4" name="f4dg6" displayDigits="6" />
  <function copysource="f5" name="f5dg6" displayDigits="6" />
  <function copysource="f1" name="f1dc7" displayDecimals="7" />
  <function copysource="f2" name="f2dc7" displayDecimals="7" />
  <function copysource="f3" name="f3dc7" displayDecimals="7" />
  <function copysource="f4" name="f4dc7" displayDecimals="7" />
  <function copysource="f5" name="f5dc7" displayDecimals="7" />
  <function copysource="f1" name="f1pt" padZeros />
  <function copysource="f2" name="f2pt" padZeros />
  <function copysource="f3" name="f3pt" padZeros />
  <function copysource="f4" name="f4pt" padZeros />
  <function copysource="f5" name="f5pt" padZeros />
  <function copysource="f1" name="f1pf" padZeros="false" />
  <function copysource="f2" name="f2pf" padZeros="false" />
  <function copysource="f3" name="f3pf" padZeros="false" />
  <function copysource="f4" name="f4pf" padZeros="false" />
  <function copysource="f5" name="f5pf" padZeros="false" />

  <math copysource="f1.formula" name="f1fdg6" displayDigits="6" />
  <math copysource="f2.formula" name="f2fdg6" displayDigits="6" />
  <math copysource="f3.formula" name="f3fdg6" displayDigits="6" />
  <math copysource="f4.formula" name="f4fdg6" displayDigits="6" />
  <math copysource="f5.formula" name="f5fdg6" displayDigits="6" />
  <math copysource="f1.formula" name="f1fdc7" displayDecimals="7" />
  <math copysource="f2.formula" name="f2fdc7" displayDecimals="7" />
  <math copysource="f3.formula" name="f3fdc7" displayDecimals="7" />
  <math copysource="f4.formula" name="f4fdc7" displayDecimals="7" />
  <math copysource="f5.formula" name="f5fdc7" displayDecimals="7" />
  <math copysource="f1.formula" name="f1fpt" padZeros />
  <math copysource="f2.formula" name="f2fpt" padZeros />
  <math copysource="f3.formula" name="f3fpt" padZeros />
  <math copysource="f4.formula" name="f4fpt" padZeros />
  <math copysource="f5.formula" name="f5fpt" padZeros />
  <math copysource="f1.formula" name="f1fpf" padZeros="false" />
  <math copysource="f2.formula" name="f2fpf" padZeros="false" />
  <math copysource="f3.formula" name="f3fpf" padZeros="false" />
  <math copysource="f4.formula" name="f4fpf" padZeros="false" />
  <math copysource="f5.formula" name="f5fpf" padZeros="false" />


  <function name="f1dg6a" displayDigits="6" >$f1</function>
  <function name="f2dg6a" displayDigits="6" >$f2</function>
  <function name="f3dg6a" displayDigits="6" >$f3</function>
  <function name="f4dg6a" displayDigits="6" >$f4</function>
  <function name="f5dg6a" displayDigits="6" >$f5</function>
  <function name="f1dc7a" displayDecimals="7" >$f1</function>
  <function name="f2dc7a" displayDecimals="7" >$f2</function>
  <function name="f3dc7a" displayDecimals="7" >$f3</function>
  <function name="f4dc7a" displayDecimals="7" >$f4</function>
  <function name="f5dc7a" displayDecimals="7" >$f5</function>
  <function name="f1pta" padZeros >$f1</function>
  <function name="f2pta" padZeros >$f2</function>
  <function name="f3pta" padZeros >$f3</function>
  <function name="f4pta" padZeros >$f4</function>
  <function name="f5pta" padZeros >$f5</function>
  <function name="f1pfa" padZeros="false" >$f1</function>
  <function name="f2pfa" padZeros="false" >$f2</function>
  <function name="f3pfa" padZeros="false" >$f3</function>
  <function name="f4pfa" padZeros="false" >$f4</function>
  <function name="f5pfa" padZeros="false" >$f5</function>



  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/f1"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );
        expect(cleanLatex(stateVariables["/f2"].stateValues.latex)).eq(
            "255\\sin(0.5295x)+3",
        );
        expect(cleanLatex(stateVariables["/f3"].stateValues.latex)).eq(
            "255.0\\sin(0.5295x)+3.000",
        );
        expect(cleanLatex(stateVariables["/f4"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );
        expect(cleanLatex(stateVariables["/f5"].stateValues.latex)).eq(
            "255.030\\sin(0.530x)+3.000",
        );

        expect(cleanLatex(stateVariables["/f1dg6"].stateValues.latex)).eq(
            "255.03\\sin(0.529523x)+3",
        );
        expect(cleanLatex(stateVariables["/f2dg6"].stateValues.latex)).eq(
            "255.03\\sin(0.529523x)+3",
        );
        expect(cleanLatex(stateVariables["/f3dg6"].stateValues.latex)).eq(
            "255.030\\sin(0.529523x)+3.00000",
        );
        expect(cleanLatex(stateVariables["/f4dg6"].stateValues.latex)).eq(
            "255.03\\sin(0.529523x)+3",
        );
        expect(cleanLatex(stateVariables["/f5dg6"].stateValues.latex)).eq(
            "255.030\\sin(0.529523x)+3.00000",
        );

        expect(cleanLatex(stateVariables["/f1fdg6"].stateValues.latex)).eq(
            "255.03\\sin(0.529523x)+3",
        );
        expect(cleanLatex(stateVariables["/f2fdg6"].stateValues.latex)).eq(
            "255.03\\sin(0.529523x)+3",
        );
        expect(cleanLatex(stateVariables["/f3fdg6"].stateValues.latex)).eq(
            "255.030\\sin(0.529523x)+3.00000",
        );
        expect(cleanLatex(stateVariables["/f4fdg6"].stateValues.latex)).eq(
            "255.03\\sin(0.529523x)+3",
        );
        expect(cleanLatex(stateVariables["/f5fdg6"].stateValues.latex)).eq(
            "255.030\\sin(0.529523x)+3.00000",
        );

        expect(cleanLatex(stateVariables["/f1dg6a"].stateValues.latex)).eq(
            "255.03\\sin(0.529523x)+3",
        );
        expect(cleanLatex(stateVariables["/f2dg6a"].stateValues.latex)).eq(
            "255.03\\sin(0.529523x)+3",
        );
        expect(cleanLatex(stateVariables["/f3dg6a"].stateValues.latex)).eq(
            "255.030\\sin(0.529523x)+3.00000",
        );
        expect(cleanLatex(stateVariables["/f4dg6a"].stateValues.latex)).eq(
            "255.03\\sin(0.529523x)+3",
        );
        expect(cleanLatex(stateVariables["/f5dg6a"].stateValues.latex)).eq(
            "255.030\\sin(0.529523x)+3.00000",
        );

        expect(cleanLatex(stateVariables["/f1dc7"].stateValues.latex)).eq(
            "255.029847\\sin(0.5295234x)+3",
        );
        expect(cleanLatex(stateVariables["/f2dc7"].stateValues.latex)).eq(
            "255.029847\\sin(0.5295234x)+3",
        );
        expect(cleanLatex(stateVariables["/f3dc7"].stateValues.latex)).eq(
            "255.0298470\\sin(0.5295234x)+3.0000000",
        );
        expect(cleanLatex(stateVariables["/f4dc7"].stateValues.latex)).eq(
            "255.029847\\sin(0.5295234x)+3",
        );
        expect(cleanLatex(stateVariables["/f5dc7"].stateValues.latex)).eq(
            "255.0298470\\sin(0.5295234x)+3.0000000",
        );

        expect(cleanLatex(stateVariables["/f1fdc7"].stateValues.latex)).eq(
            "255.029847\\sin(0.5295234x)+3",
        );
        expect(cleanLatex(stateVariables["/f2fdc7"].stateValues.latex)).eq(
            "255.029847\\sin(0.5295234x)+3",
        );
        expect(cleanLatex(stateVariables["/f3fdc7"].stateValues.latex)).eq(
            "255.0298470\\sin(0.5295234x)+3.0000000",
        );
        expect(cleanLatex(stateVariables["/f4fdc7"].stateValues.latex)).eq(
            "255.029847\\sin(0.5295234x)+3",
        );
        expect(cleanLatex(stateVariables["/f5fdc7"].stateValues.latex)).eq(
            "255.0298470\\sin(0.5295234x)+3.0000000",
        );

        expect(cleanLatex(stateVariables["/f1dc7a"].stateValues.latex)).eq(
            "255.029847\\sin(0.5295234x)+3",
        );
        expect(cleanLatex(stateVariables["/f2dc7a"].stateValues.latex)).eq(
            "255.029847\\sin(0.5295234x)+3",
        );
        expect(cleanLatex(stateVariables["/f3dc7a"].stateValues.latex)).eq(
            "255.0298470\\sin(0.5295234x)+3.0000000",
        );
        expect(cleanLatex(stateVariables["/f4dc7a"].stateValues.latex)).eq(
            "255.029847\\sin(0.5295234x)+3",
        );
        expect(cleanLatex(stateVariables["/f5dc7a"].stateValues.latex)).eq(
            "255.0298470\\sin(0.5295234x)+3.0000000",
        );

        expect(cleanLatex(stateVariables["/f1pt"].stateValues.latex)).eq(
            "255.03\\sin(0.530x)+3.00",
        );
        expect(cleanLatex(stateVariables["/f2pt"].stateValues.latex)).eq(
            "255.0\\sin(0.5295x)+3.000",
        );
        expect(cleanLatex(stateVariables["/f3pt"].stateValues.latex)).eq(
            "255.0\\sin(0.5295x)+3.000",
        );
        expect(cleanLatex(stateVariables["/f4pt"].stateValues.latex)).eq(
            "255.030\\sin(0.530x)+3.000",
        );
        expect(cleanLatex(stateVariables["/f5pt"].stateValues.latex)).eq(
            "255.030\\sin(0.530x)+3.000",
        );

        expect(cleanLatex(stateVariables["/f1fpt"].stateValues.latex)).eq(
            "255.03\\sin(0.530x)+3.00",
        );
        expect(cleanLatex(stateVariables["/f2fpt"].stateValues.latex)).eq(
            "255.0\\sin(0.5295x)+3.000",
        );
        expect(cleanLatex(stateVariables["/f3fpt"].stateValues.latex)).eq(
            "255.0\\sin(0.5295x)+3.000",
        );
        expect(cleanLatex(stateVariables["/f4fpt"].stateValues.latex)).eq(
            "255.030\\sin(0.530x)+3.000",
        );
        expect(cleanLatex(stateVariables["/f5fpt"].stateValues.latex)).eq(
            "255.030\\sin(0.530x)+3.000",
        );

        expect(cleanLatex(stateVariables["/f1pta"].stateValues.latex)).eq(
            "255.03\\sin(0.530x)+3.00",
        );
        expect(cleanLatex(stateVariables["/f2pta"].stateValues.latex)).eq(
            "255.0\\sin(0.5295x)+3.000",
        );
        expect(cleanLatex(stateVariables["/f3pta"].stateValues.latex)).eq(
            "255.0\\sin(0.5295x)+3.000",
        );
        expect(cleanLatex(stateVariables["/f4pta"].stateValues.latex)).eq(
            "255.030\\sin(0.530x)+3.000",
        );
        expect(cleanLatex(stateVariables["/f5pta"].stateValues.latex)).eq(
            "255.030\\sin(0.530x)+3.000",
        );

        expect(cleanLatex(stateVariables["/f1pf"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );
        expect(cleanLatex(stateVariables["/f2pf"].stateValues.latex)).eq(
            "255\\sin(0.5295x)+3",
        );
        expect(cleanLatex(stateVariables["/f3pf"].stateValues.latex)).eq(
            "255\\sin(0.5295x)+3",
        );
        expect(cleanLatex(stateVariables["/f4pf"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );
        expect(cleanLatex(stateVariables["/f5pf"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );

        expect(cleanLatex(stateVariables["/f1fpf"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );
        expect(cleanLatex(stateVariables["/f2fpf"].stateValues.latex)).eq(
            "255\\sin(0.5295x)+3",
        );
        expect(cleanLatex(stateVariables["/f3fpf"].stateValues.latex)).eq(
            "255\\sin(0.5295x)+3",
        );
        expect(cleanLatex(stateVariables["/f4fpf"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );
        expect(cleanLatex(stateVariables["/f5fpf"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );

        expect(cleanLatex(stateVariables["/f1pfa"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );
        expect(cleanLatex(stateVariables["/f2pfa"].stateValues.latex)).eq(
            "255\\sin(0.5295x)+3",
        );
        expect(cleanLatex(stateVariables["/f3pfa"].stateValues.latex)).eq(
            "255\\sin(0.5295x)+3",
        );
        expect(cleanLatex(stateVariables["/f4pfa"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );
        expect(cleanLatex(stateVariables["/f5pfa"].stateValues.latex)).eq(
            "255.03\\sin(0.53x)+3",
        );
    });

    it("handle bad through and other defining attributes", async () => {
        let core = await createTestCore({
            doenetML: `
    <text name="t1">a</text>
    <function through="A" minima="B" maxima="C" extrema="D" throughSlopes="E" name="f" />
   `,
        });

        // page loads
        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/t1"].stateValues.value).eq("a");
    });

    it("extrema shadow style number", async () => {
        let core = await createTestCore({
            doenetML: `
      <function name="f" styleNumber="2" domain="[-2,2]">x^3-x</function>
      <point name="max" copySource="f.maximum1" />
      <point name="min" copySource="f.minimum1" />
      <copy source="f.extrema" assignNames="ext1 ext2" />
      <point name="gmax" copySource="f.globalmaximum" />
      <point name="gmin" copySource="f.globalminimum" />
      <point name="sup" copySource="f.globalsupremum" />
      <point name="inf" copySource="f.globalinfimum" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/max"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/min"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/ext1"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/ext2"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/gmax"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/gmin"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/sup"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/inf"].stateValues.styleNumber).eq(2);
    });

    it("check bugfix: don't get invalid maxima due having incorrect derivative with function of interpolated function", async () => {
        let core = await createTestCore({
            doenetML: `
      <function name="f" maxima="(3,4)" />
      <function name="g" styleNumber="2">$$f(x)-x^4</function>
      <copy source="g.minima" assignNames="min" />
      <copy source="g.maxima" assignNames="max1 max2" />
      <copy source="g.extrema" assignNames="ext1 ext2" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/max1"].stateValues.xs.map((x) => x.tree)).eqls([
            1, -1,
        ]);
        expect(stateVariables["/max2"]).eq(undefined);
        expect(stateVariables["/min"]).eq(undefined);
        expect(stateVariables["/ext1"].stateValues.xs.map((x) => x.tree)).eqls([
            1, -1,
        ]);
        expect(stateVariables["/ext2"]).eq(undefined);
    });

    it("check bugfix: don't get invalid extrema due to roundoff error with function of interpolated function", async () => {
        let core = await createTestCore({
            doenetML: `
      <function name="f" maxima="(3,4)" />
      <function name="g" styleNumber="2">$$f(x)+(x-3)^2</function>
      <copy source="g.minima" assignNames="min" />
      <copy source="g.maxima" assignNames="max" />
      <copy source="g.extrema" assignNames="ext" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/max"]).eq(undefined);
        expect(stateVariables["/min"]).eq(undefined);
        expect(stateVariables["/ext"]).eq(undefined);
    });

    it("global extrema, double well, test all properties", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f">x^4-8x^2+8</function>
    <p>domain: <interval name="domain" copySource="f.domain" /></p>
    <p>min results for f: $f.globalMinimum{assignNames="fmin"}, $f.globalMinimumLocation{assignNames="fminl"}, $f.globalMinimumValue{assignNames="fminv"}, $f.globalMinimum[1]{assignNames="fminla"}, $f.globalMinimum[2]{assignNames="fminva"}</p>
    <p>min compactify results for f: $f.globalInfimum{assignNames="fmincd"}, $f.globalInfimumLocation{assignNames="fmincdl"}, $f.globalInfimumValue{assignNames="fmincdv"}, $f.globalInfimum[1]{assignNames="fmincdla"}, $f.globalInfimum[2]{assignNames="fmincdva"}</p>
    <p>max results for f: $f.globalMaximum{assignNames="fmax"}, $f.globalMaximumLocation{assignNames="fmaxl"}, $f.globalMaximumValue{assignNames="fmaxv"}, $f.globalMaximum[1]{assignNames="fmaxla"}, $f.globalMaximum[2]{assignNames="fmaxva"}</p>
    <p>max compactify results for f: $f.globalSupremum{assignNames="fmaxcd"}, $f.globalSupremumLocation{assignNames="fmaxcdl"}, $f.globalSupremumValue{assignNames="fmaxcdv"}, $f.globalSupremum[1]{assignNames="fmaxcdla"}, $f.globalSupremum[2]{assignNames="fmaxcdva"}</p>
    `,
        });

        let f100 = 100 ** 4 - 8 * 100 ** 2 + 8;

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f"].stateValues.domain.map((x) => x.tree)).eqls(
            [
                [
                    "interval",
                    ["tuple", -Infinity, Infinity],
                    ["tuple", false, false],
                ],
            ],
        );

        expect(stateVariables["/fmin"].stateValues.xs.map((x) => x.tree)).eqls([
            -2, -8,
        ]);
        expect(stateVariables["/fminl"].stateValues.value).eq(-2);
        expect(stateVariables["/fminla"].stateValues.value).eq(-2);
        expect(stateVariables["/fminv"].stateValues.value).eq(-8);
        expect(stateVariables["/fminva"].stateValues.value).eq(-8);

        expect(
            stateVariables["/fmincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-2, -8]);
        expect(stateVariables["/fmincdl"].stateValues.value).eq(-2);
        expect(stateVariables["/fmincdla"].stateValues.value).eq(-2);
        expect(stateVariables["/fmincdv"].stateValues.value).eq(-8);
        expect(stateVariables["/fmincdva"].stateValues.value).eq(-8);

        expect(stateVariables["/fmax"]).eq(undefined);
        expect(stateVariables["/fmaxl"].stateValues.value).eqls(NaN);
        expect(stateVariables["/fmaxla"].stateValues.value).eqls(NaN);
        expect(stateVariables["/fmaxv"].stateValues.value).eqls(NaN);
        expect(stateVariables["/fmaxva"].stateValues.value).eqls(NaN);

        expect(
            stateVariables["/fmaxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-100, f100]);
        expect(stateVariables["/fmaxcdl"].stateValues.value).eq(-100);
        expect(stateVariables["/fmaxcdla"].stateValues.value).eq(-100);
        expect(stateVariables["/fmaxcdv"].stateValues.value).eq(f100);
        expect(stateVariables["/fmaxcdva"].stateValues.value).eq(f100);
    });

    it("global extrema, double well, different domains", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1" domain="(-2,Infinity)">x^4-8x^2+8</function>
    <function name="f2" domain="(-Infinity,2)">x^4-8x^2+8</function>
    <function name="f3" domain="(0,2]">x^4-8x^2+8</function>
    <function name="f4" domain="[0,2)">x^4-8x^2+8</function>
    <function name="f5" domain="(-0.01,2.01)">x^4-8x^2+8</function>

    <p>f1: $f1.globalMinimum{assignNames="f1min"}, $f1.globalInfimum{assignNames="f1mincd"}, $f1.globalMaximum{assignNames="f1max"}, $f1.globalSupremum{assignNames="f1maxcd"}</p>
    <p>f2: $f2.globalMinimum{assignNames="f2min"}, $f2.globalInfimum{assignNames="f2mincd"}, $f2.globalMaximum{assignNames="f2max"}, $f2.globalSupremum{assignNames="f2maxcd"}</p>
    <p>f3: $f3.globalMinimum{assignNames="f3min"}, $f3.globalInfimum{assignNames="f3mincd"}, $f3.globalMaximum{assignNames="f3max"}, $f3.globalSupremum{assignNames="f3maxcd"}</p>
    <p>f4: $f4.globalMinimum{assignNames="f4min"}, $f4.globalInfimum{assignNames="f4mincd"}, $f4.globalMaximum{assignNames="f4max"}, $f4.globalSupremum{assignNames="f4maxcd"}</p>
    <p>f5: $f5.globalMinimum{assignNames="f5min"}, $f5.globalInfimum{assignNames="f5mincd"}, $f5.globalMaximum{assignNames="f5max"}, $f5.globalSupremum{assignNames="f5maxcd"}</p>
    `,
        });

        let f198 = 198 ** 4 - 8 * 198 ** 2 + 8;

        let stateVariables = await returnAllStateVariables(core);

        expect(
            stateVariables["/f1"].stateValues.domain.map((x) => x.tree),
        ).eqls([
            ["interval", ["tuple", -2, Infinity], ["tuple", false, false]],
        ]);
        expect(
            stateVariables["/f2"].stateValues.domain.map((x) => x.tree),
        ).eqls([
            ["interval", ["tuple", -Infinity, 2], ["tuple", false, false]],
        ]);
        expect(
            stateVariables["/f3"].stateValues.domain.map((x) => x.tree),
        ).eqls([["interval", ["tuple", 0, 2], ["tuple", false, true]]]);
        expect(
            stateVariables["/f4"].stateValues.domain.map((x) => x.tree),
        ).eqls([["interval", ["tuple", 0, 2], ["tuple", true, false]]]);
        expect(
            stateVariables["/f5"].stateValues.domain.map((x) => x.tree),
        ).eqls([["interval", ["tuple", -0.01, 2.01], ["tuple", false, false]]]);

        expect(stateVariables["/f1min"].stateValues.xs.map((x) => x.tree)).eqls(
            [2, -8],
        );
        expect(
            stateVariables["/f1mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([2, -8]);
        expect(stateVariables["/f1max"]).eq(undefined);
        expect(
            stateVariables["/f1maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([198, f198]);

        expect(stateVariables["/f2min"].stateValues.xs.map((x) => x.tree)).eqls(
            [-2, -8],
        );
        expect(
            stateVariables["/f2mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-2, -8]);
        expect(stateVariables["/f2max"]).eq(undefined);
        expect(
            stateVariables["/f2maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-198, f198]);

        expect(stateVariables["/f3min"].stateValues.xs.map((x) => x.tree)).eqls(
            [2, -8],
        );
        expect(
            stateVariables["/f3mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([2, -8]);
        expect(stateVariables["/f3max"]).eq(undefined);
        expect(
            stateVariables["/f3maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([0, 8]);

        expect(stateVariables["/f4min"]).eq(undefined);
        expect(
            stateVariables["/f4mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([2, -8]);
        expect(stateVariables["/f4max"].stateValues.xs.map((x) => x.tree)).eqls(
            [0, 8],
        );
        expect(
            stateVariables["/f4maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([0, 8]);

        expect(stateVariables["/f5min"].stateValues.xs[0].tree).closeTo(
            2,
            1e-5,
        );
        expect(stateVariables["/f5min"].stateValues.xs[1].tree).closeTo(
            -8,
            1e-5,
        );
        expect(stateVariables["/f5mincd"].stateValues.xs[0].tree).closeTo(
            2,
            1e-5,
        );
        expect(stateVariables["/f5mincd"].stateValues.xs[1].tree).closeTo(
            -8,
            1e-5,
        );
        expect(stateVariables["/f5max"].stateValues.xs[0].tree).closeTo(
            0,
            1e-5,
        );
        expect(stateVariables["/f5max"].stateValues.xs[1].tree).closeTo(
            8,
            1e-5,
        );
        expect(stateVariables["/f5maxcd"].stateValues.xs[0].tree).closeTo(
            0,
            1e-5,
        );
        expect(stateVariables["/f5maxcd"].stateValues.xs[1].tree).closeTo(
            8,
            1e-5,
        );
    });

    it("global extrema, sin, different domains", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1" domain="(-3pi/2,5pi/2)">sin(x)</function>
    <function name="f2" domain="(-pi/2,3pi/2)">sin(x)</function>
    <function name="f3" domain="(-pi/2,3pi/2]">sin(x)</function>
    <function name="f4" domain="(-pi/2, pi/2)">sin(x)</function>
    <function name="f5" domain="[-pi/2, pi/2]">sin(x)</function>
    <p>f1: $f1.globalMinimum{assignNames="f1min"}, $f1.globalInfimum{assignNames="f1mincd"}, $f1.globalMaximum{assignNames="f1max"}, $f1.globalSupremum{assignNames="f1maxcd"}</p>
    <p>f2: $f2.globalMinimum{assignNames="f2min"}, $f2.globalInfimum{assignNames="f2mincd"}, $f2.globalMaximum{assignNames="f2max"}, $f2.globalSupremum{assignNames="f2maxcd"}</p>
    <p>f3: $f3.globalMinimum{assignNames="f3min"}, $f3.globalInfimum{assignNames="f3mincd"}, $f3.globalMaximum{assignNames="f3max"}, $f3.globalSupremum{assignNames="f3maxcd"}</p>
    <p>f4: $f4.globalMinimum{assignNames="f4min"}, $f4.globalInfimum{assignNames="f4mincd"}, $f4.globalMaximum{assignNames="f4max"}, $f4.globalSupremum{assignNames="f4maxcd"}</p>
    <p>f5: $f5.globalMinimum{assignNames="f5min"}, $f5.globalInfimum{assignNames="f5mincd"}, $f5.globalMaximum{assignNames="f5max"}, $f5.globalSupremum{assignNames="f5maxcd"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1min"].stateValues.xs.map((x) => x.tree)).eqls(
            [-Math.PI / 2, -1],
        );
        expect(
            stateVariables["/f1mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-Math.PI / 2, -1]);
        expect(stateVariables["/f1max"].stateValues.xs.map((x) => x.tree)).eqls(
            [Math.PI / 2, 1],
        );
        expect(
            stateVariables["/f1maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([Math.PI / 2, 1]);

        expect(stateVariables["/f2min"]).eq(undefined);
        expect(
            stateVariables["/f2mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-Math.PI / 2, -1]);
        expect(stateVariables["/f2max"].stateValues.xs.map((x) => x.tree)).eqls(
            [Math.PI / 2, 1],
        );
        expect(
            stateVariables["/f2maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([Math.PI / 2, 1]);

        expect(stateVariables["/f3min"].stateValues.xs.map((x) => x.tree)).eqls(
            [(3 * Math.PI) / 2, -1],
        );
        expect(
            stateVariables["/f3mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([(3 * Math.PI) / 2, -1]);
        expect(stateVariables["/f3max"].stateValues.xs.map((x) => x.tree)).eqls(
            [Math.PI / 2, 1],
        );
        expect(
            stateVariables["/f3maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([Math.PI / 2, 1]);

        expect(stateVariables["/f4min"]).eq(undefined);
        expect(
            stateVariables["/f4mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-Math.PI / 2, -1]);
        expect(stateVariables["/f4max"]).eq(undefined);
        expect(
            stateVariables["/f4maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([Math.PI / 2, 1]);

        expect(stateVariables["/f5min"].stateValues.xs.map((x) => x.tree)).eqls(
            [-Math.PI / 2, -1],
        );
        expect(
            stateVariables["/f5mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-Math.PI / 2, -1]);
        expect(stateVariables["/f5max"].stateValues.xs.map((x) => x.tree)).eqls(
            [Math.PI / 2, 1],
        );
        expect(
            stateVariables["/f5maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([Math.PI / 2, 1]);
    });

    it("global extrema, 1/x, different domains", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1">1/x</function>
    <function name="f2" domain="(0,Infinity)">1/x</function>
    <function name="f3" domain="(-Infinity,0)">1/x</function>
    <function name="f4" domain="(-0.1, 100)">1/x</function>
    <function name="f5" domain="(-1,0)">-1/x</function>
    <p>f1: $f1.globalMinimum{assignNames="f1min"}, $f1.globalInfimum{assignNames="f1mincd"}, $f1.globalMaximum{assignNames="f1max"}, $f1.globalSupremum{assignNames="f1maxcd"}</p>
    <p>f2: $f2.globalMinimum{assignNames="f2min"}, $f2.globalInfimum{assignNames="f2mincd"}, $f2.globalMaximum{assignNames="f2max"}, $f2.globalSupremum{assignNames="f2maxcd"}</p>
    <p>f3: $f3.globalMinimum{assignNames="f3min"}, $f3.globalInfimum{assignNames="f3mincd"}, $f3.globalMaximum{assignNames="f3max"}, $f3.globalSupremum{assignNames="f3maxcd"}</p>
    <p>f4: $f4.globalMinimum{assignNames="f4min"}, $f4.globalInfimum{assignNames="f4mincd"}, $f4.globalMaximum{assignNames="f4max"}, $f4.globalSupremum{assignNames="f4maxcd"}</p>
    <p>f5: $f5.globalMinimum{assignNames="f5min"}, $f5.globalInfimum{assignNames="f5mincd"}, $f5.globalMaximum{assignNames="f5max"}, $f5.globalSupremum{assignNames="f5maxcd"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1min"].stateValues.xs[0].tree).within(
            -1e-6,
            -1e-300,
        );
        expect(stateVariables["/f1min"].stateValues.xs[1].tree).lessThan(-1e6);
        expect(
            stateVariables["/f1mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls(stateVariables["/f1min"].stateValues.xs.map((x) => x.tree));
        expect(stateVariables["/f1max"].stateValues.xs[0].tree).within(
            1e-300,
            1e-6,
        );
        expect(stateVariables["/f1max"].stateValues.xs[1].tree).greaterThan(
            1e6,
        );
        expect(
            stateVariables["/f1maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls(stateVariables["/f1max"].stateValues.xs.map((x) => x.tree));

        expect(stateVariables["/f2min"]).eq(undefined);
        expect(
            stateVariables["/f2mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([200, 1 / 200]);
        expect(stateVariables["/f2max"]).eq(undefined);
        expect(
            stateVariables["/f2maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([0, Infinity]);

        expect(stateVariables["/f3min"]).eq(undefined);
        expect(
            stateVariables["/f3mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([0, -Infinity]);
        expect(stateVariables["/f3max"]).eq(undefined);
        expect(
            stateVariables["/f3maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-200, -1 / 200]);

        expect(stateVariables["/f4min"].stateValues.xs[0].tree).within(
            -1e-6,
            -1e-300,
        );
        expect(stateVariables["/f4min"].stateValues.xs[1].tree).lessThan(-1e6);
        expect(
            stateVariables["/f4mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls(stateVariables["/f4min"].stateValues.xs.map((x) => x.tree));
        expect(stateVariables["/f4max"].stateValues.xs[0].tree).within(
            1e-300,
            1e-6,
        );
        expect(stateVariables["/f4max"].stateValues.xs[1].tree).greaterThan(
            1e6,
        );
        expect(
            stateVariables["/f4maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls(stateVariables["/f4max"].stateValues.xs.map((x) => x.tree));

        expect(stateVariables["/f5min"]).eq(undefined);
        expect(
            stateVariables["/f5mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-1, 1]);
        expect(stateVariables["/f5max"]).eq(undefined);
        expect(
            stateVariables["/f5maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([0, Infinity]);
    });

    it("global extrema, 1/x^2, different domains", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1">1/x^2</function>
    <function name="f2" domain="(0,Infinity)">1/x^2</function>
    <function name="f3" domain="(-Infinity,0)">1/x^2</function>
    <function name="f4" domain="(-0.1, 100)">1/x^2</function>
    <function name="f5" domain="(-1,0)">-1/x^2</function>
    <p>f1: $f1.globalMinimum{assignNames="f1min"}, $f1.globalInfimum{assignNames="f1mincd"}, $f1.globalMaximum{assignNames="f1max"}, $f1.globalSupremum{assignNames="f1maxcd"}</p>
    <p>f2: $f2.globalMinimum{assignNames="f2min"}, $f2.globalInfimum{assignNames="f2mincd"}, $f2.globalMaximum{assignNames="f2max"}, $f2.globalSupremum{assignNames="f2maxcd"}</p>
    <p>f3: $f3.globalMinimum{assignNames="f3min"}, $f3.globalInfimum{assignNames="f3mincd"}, $f3.globalMaximum{assignNames="f3max"}, $f3.globalSupremum{assignNames="f3maxcd"}</p>
    <p>f4: $f4.globalMinimum{assignNames="f4min"}, $f4.globalInfimum{assignNames="f4mincd"}, $f4.globalMaximum{assignNames="f4max"}, $f4.globalSupremum{assignNames="f4maxcd"}</p>
    <p>f5: $f5.globalMinimum{assignNames="f5min"}, $f5.globalInfimum{assignNames="f5mincd"}, $f5.globalMaximum{assignNames="f5max"}, $f5.globalSupremum{assignNames="f5maxcd"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/f1min"]).eq(undefined);
        expect(
            stateVariables["/f1mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-100, 1 / 10000]);
        expect(stateVariables["/f1max"].stateValues.xs[0].tree).within(
            -1e-6,
            -1e-300,
        );
        expect(stateVariables["/f1max"].stateValues.xs[1].tree).greaterThan(
            1e12,
        );
        expect(
            stateVariables["/f1maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls(stateVariables["/f1max"].stateValues.xs.map((x) => x.tree));

        expect(stateVariables["/f2min"]).eq(undefined);
        expect(
            stateVariables["/f2mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([200, 1 / 40000]);
        expect(stateVariables["/f2max"]).eq(undefined);
        expect(
            stateVariables["/f2maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([0, Infinity]);

        expect(stateVariables["/f3min"]).eq(undefined);
        expect(
            stateVariables["/f3mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-200, 1 / 40000]);
        expect(stateVariables["/f3max"]).eq(undefined);
        expect(
            stateVariables["/f3maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([0, Infinity]);

        expect(stateVariables["/f4min"]).eq(undefined);
        expect(
            stateVariables["/f4mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([100, 1 / 10000]);
        expect(stateVariables["/f4max"].stateValues.xs[0].tree).within(
            -1e-6,
            -1e-300,
        );
        expect(stateVariables["/f4max"].stateValues.xs[1].tree).greaterThan(
            1e12,
        );
        expect(
            stateVariables["/f4maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls(stateVariables["/f4max"].stateValues.xs.map((x) => x.tree));

        expect(stateVariables["/f5min"]).eq(undefined);
        expect(
            stateVariables["/f5mincd"].stateValues.xs.map((x) => x.tree),
        ).eqls([0, -Infinity]);
        expect(stateVariables["/f5max"]).eq(undefined);
        expect(
            stateVariables["/f5maxcd"].stateValues.xs.map((x) => x.tree),
        ).eqls([-1, -1]);
    });

    it("global extrema of linear interpolated function", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f1" through="(-8,7) (8,-1)" />
    <function name="f2" styleNumber="2" through="(-8,-5) (8,3)" />
    <function name="f3" copySource="f1" domain="(-10, -9)" />
    <function name="f4" copySource="f1" domain="[-7, 3]" />
    <function name="f5" copySource="f1" domain="(9, 10]" />
    <function name="f6" copySource="f2" domain="(-10, -9)" />
    <function name="f7" copySource="f2" domain="[-7, 3]" />
    <function name="f8" copySource="f2" domain="(9, 10]" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let f1 = stateVariables["/f1"];
        let f2 = stateVariables["/f2"];
        let f3 = stateVariables["/f3"];
        let f4 = stateVariables["/f4"];
        let f5 = stateVariables["/f5"];
        let f6 = stateVariables["/f6"];
        let f7 = stateVariables["/f7"];
        let f8 = stateVariables["/f8"];

        expect(f1.stateValues.domain.map((x) => x.tree)).eqls([
            [
                "interval",
                ["tuple", -Infinity, Infinity],
                ["tuple", false, false],
            ],
        ]);
        expect(f2.stateValues.domain.map((x) => x.tree)).eqls([
            [
                "interval",
                ["tuple", -Infinity, Infinity],
                ["tuple", false, false],
            ],
        ]);
        expect(f3.stateValues.domain.map((x) => x.tree)).eqls([
            ["interval", ["tuple", -10, -9], ["tuple", false, false]],
        ]);
        expect(f4.stateValues.domain.map((x) => x.tree)).eqls([
            ["interval", ["tuple", -7, 3], ["tuple", true, true]],
        ]);
        expect(f5.stateValues.domain.map((x) => x.tree)).eqls([
            ["interval", ["tuple", 9, 10], ["tuple", false, true]],
        ]);
        expect(f6.stateValues.domain.map((x) => x.tree)).eqls([
            ["interval", ["tuple", -10, -9], ["tuple", false, false]],
        ]);
        expect(f7.stateValues.domain.map((x) => x.tree)).eqls([
            ["interval", ["tuple", -7, 3], ["tuple", true, true]],
        ]);
        expect(f8.stateValues.domain.map((x) => x.tree)).eqls([
            ["interval", ["tuple", 9, 10], ["tuple", false, true]],
        ]);

        expect(f1.stateValues.globalMinimum).eqls([]);
        expect(f1.stateValues.globalInfimum).eqls([Infinity, -Infinity]);
        expect(f1.stateValues.globalMaximum).eqls([]);
        expect(f1.stateValues.globalSupremum).eqls([-Infinity, Infinity]);
        expect(f2.stateValues.globalMinimum).eqls([]);
        expect(f2.stateValues.globalInfimum).eqls([-Infinity, -Infinity]);
        expect(f2.stateValues.globalMaximum).eqls([]);
        expect(f2.stateValues.globalSupremum).eqls([Infinity, Infinity]);
        expect(f3.stateValues.globalMinimum).eqls([]);
        expect(f3.stateValues.globalInfimum).eqls([-9, 7.5]);
        expect(f3.stateValues.globalMaximum).eqls([]);
        expect(f3.stateValues.globalSupremum).eqls([-10, 8]);
        expect(f4.stateValues.globalMinimum).eqls([3, 1.5]);
        expect(f4.stateValues.globalInfimum).eqls([3, 1.5]);
        expect(f4.stateValues.globalMaximum).eqls([-7, 6.5]);
        expect(f4.stateValues.globalSupremum).eqls([-7, 6.5]);
        expect(f5.stateValues.globalMinimum).eqls([10, -2]);
        expect(f5.stateValues.globalInfimum).eqls([10, -2]);
        expect(f5.stateValues.globalMaximum).eqls([]);
        expect(f5.stateValues.globalSupremum).eqls([9, -1.5]);
        expect(f6.stateValues.globalMinimum).eqls([]);
        expect(f6.stateValues.globalInfimum).eqls([-10, -6]);
        expect(f6.stateValues.globalMaximum).eqls([]);
        expect(f6.stateValues.globalSupremum).eqls([-9, -5.5]);
        expect(f7.stateValues.globalMinimum).eqls([-7, -4.5]);
        expect(f7.stateValues.globalInfimum).eqls([-7, -4.5]);
        expect(f7.stateValues.globalMaximum).eqls([3, 0.5]);
        expect(f7.stateValues.globalSupremum).eqls([3, 0.5]);
        expect(f8.stateValues.globalMinimum).eqls([]);
        expect(f8.stateValues.globalInfimum).eqls([9, 3.5]);
        expect(f8.stateValues.globalMaximum).eqls([10, 4]);
        expect(f8.stateValues.globalSupremum).eqls([10, 4]);
    });
});

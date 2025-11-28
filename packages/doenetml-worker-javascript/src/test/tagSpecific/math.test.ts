import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveMath,
    movePoint,
    moveVector,
    updateBooleanInputValue,
    updateMathInputValue,
    updateMatrixInputValue,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";
import { test_in_graph } from "../utils/in-graph";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Math tag tests", async () => {
    it("1+1", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <math name="m1">1+1</math>
            <math name="m1s" simplify>1+1</math>
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["+", 1, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1s")].stateValues.value
                .tree,
        ).eqls(2);
    });

    it("string math string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m1">3<math name="m2">x+1</math>+5</math>
    <math name="m3" simplify>3<math>x+1</math>+5</math>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 3, ["+", "x", 1]], 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["+", 5, ["*", 3, ["+", "x", 1]]]);
    });

    it("hidden string copy/math string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m1" hide>x+1</math>
    <math name="m2">3<math extend="$m1" name="m1a" /> + 5</math>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1a")].stateValues.value
                .tree,
        ).eqls(["+", "x", 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 3, ["+", "x", 1]], 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.hide,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1a")].stateValues.hide,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.hide,
        ).eq(false);
    });

    it("math underscore when no value", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m1"></math>
    <math name="m2"> </math>
    <math name="m3"/>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eq("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eq("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eq("＿");
    });

    it("format latex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math format="latex" name="m">\\frac{x}{z}</math>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["/", "x", "z"]);
    });

    it("copy latex property", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="m">x/y</math>
  <latex extend="$m.latex" name="l1" />
  <text extend="$m.latex" name="l2" />
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("l1")].stateValues.value,
        ).eq("\\frac{x}{y}");
        expect(
            stateVariables[await resolvePathToNodeIdx("l2")].stateValues.value,
        ).eq("\\frac{x}{y}");
    });

    it("math with internal and external copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="a" simplify><math name="x">x</math> + $x + $z</math>
  <math name="z">z</math>
  <math extend="$a" name="a2" />
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], "z"]);
    });

    it("point adapts into a math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <text>a</text>
  <point>3</point>
  <math simplify name="m">2 + $_point1</math>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(5);
    });

    // TODO: do we are enough to restore this behavior?
    // We stopped putting spaces between adjacent string children so that entity combinations like &lt;= are not separated
    it.skip("adjacent string children in math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math simplify name="m">2<sequence length="0"/>3</math>
  <point name="P">($m, 3)</point>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].activeChildren[0],
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].activeChildren[1],
        ).eq("3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(3);

        // move point to (7,9)
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 7,
            y: 9,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        // Since we mark the component to ignore changes to defining children,
        // the activeChildren might not be changed
        // expect(stateVariables[await resolvePathToNodeIdx("m1")].activeChildren[0]).eq("7");
        // expect(stateVariables[await resolvePathToNodeIdx("m1")].activeChildren[1]).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(7);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree,
        ).eq(7);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree,
        ).eq(9);
    });

    it("math displayed rounded to 3 significant digits by default", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="m1">1.001</math>
  <math name="m2">0.3004 x + 4pi</math>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eq(1.001);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                .valueForDisplay.tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.latex,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 0.3004, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 0.3, "x"], ["*", 4, "pi"]]);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("0.3x+4\\pi");
    });

    it("mutual references of format", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="a" simplify format="$ti1">
    \\sin(y)
    <math name="c" format="$b.format">
      sin(x)
    </math>
  </math>
  <math name="b" simplify format="$ti2">
    sin(u)
    <math name="d" format="$a.format">
      \\sin(v)
    </math>
  </math>

  <text name="formata" extend="$a.format" />
  <text name="formatb" extend="$b.format" />
  <text name="formatc" extend="$c.format" />
  <text name="formatd" extend="$d.format" />

  <textInput name="ti1" prefill="latex"/>
  <textInput name="ti2" prefill="text"/>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .latex,
            ),
        ).eq("\\sin(x)\\sin(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("\\sin(u)\\sin(v)");
        expect(
            stateVariables[await resolvePathToNodeIdx("formata")].stateValues
                .value,
        ).eq("latex");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatb")].stateValues
                .value,
        ).eq("text");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatc")].stateValues
                .value,
        ).eq("text");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatd")].stateValues
                .value,
        ).eq("latex");

        // change format of second to latex
        await updateTextInputValue({
            componentIdx: await resolvePathToNodeIdx("ti2"),
            text: "latex",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .latex,
            ),
        ).eq("insx\\sin(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("insu\\sin(v)");
        expect(
            stateVariables[await resolvePathToNodeIdx("formata")].stateValues
                .value,
        ).eq("latex");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatb")].stateValues
                .value,
        ).eq("latex");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatc")].stateValues
                .value,
        ).eq("latex");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatd")].stateValues
                .value,
        ).eq("latex");

        // change format of first to text
        await updateTextInputValue({
            componentIdx: await resolvePathToNodeIdx("ti1"),
            text: "text",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .latex,
            ),
        ).eq("＿");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("sinu＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("formata")].stateValues
                .value,
        ).eq("text");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatb")].stateValues
                .value,
        ).eq("latex");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatc")].stateValues
                .value,
        ).eq("latex");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatd")].stateValues
                .value,
        ).eq("text");

        // change format of second back to text
        await updateTextInputValue({
            componentIdx: await resolvePathToNodeIdx("ti2"),
            text: "text",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .latex,
            ),
        ).eq("＿");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("\\sin(u)＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("formata")].stateValues
                .value,
        ).eq("text");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatb")].stateValues
                .value,
        ).eq("text");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatc")].stateValues
                .value,
        ).eq("text");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatd")].stateValues
                .value,
        ).eq("text");

        // change format of first back to latex
        await updateTextInputValue({
            componentIdx: await resolvePathToNodeIdx("ti1"),
            text: "latex",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a")].stateValues
                    .latex,
            ),
        ).eq("\\sin(x)\\sin(y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .latex,
            ),
        ).eq("\\sin(u)\\sin(v)");
        expect(
            stateVariables[await resolvePathToNodeIdx("formata")].stateValues
                .value,
        ).eq("latex");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatb")].stateValues
                .value,
        ).eq("text");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatc")].stateValues
                .value,
        ).eq("text");
        expect(
            stateVariables[await resolvePathToNodeIdx("formatd")].stateValues
                .value,
        ).eq("latex");
    });

    it("simplify math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Default is no simplification: <math name="m1">1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    <p>Explicit no simplify: <math name="m2" simplify="none">1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    <p>Full simplify a: <math name="m3" simplify>1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    <p>Full simplify b: <math name="m4" simplify="full">1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    <p>Simplify numbers: <math name="m5" simplify="numbers">1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    <p>Simplify numbers preserve order: <math name="m6" simplify="numberspreserveorder">1x^2-3 +0x^2 + 4 -2x^2-3 + 5x^2</math></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("1x^{2}-3+0x^{2}+4-2x^{2}-3+5x^{2}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("1x^{2}-3+0x^{2}+4-2x^{2}-3+5x^{2}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("4x^{2}-2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                    .latex,
            ),
        ).eq("4x^{2}-2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m5")].stateValues
                    .latex,
            ),
        ).eq("-2x^{2}+x^{2}+5x^{2}-2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m6")].stateValues
                    .latex,
            ),
        ).eq("x^{2}+1-2x^{2}-3+5x^{2}");

        let originalTree = [
            "+",
            ["*", 1, ["^", "x", 2]],
            -3,
            ["*", 0, ["^", "x", 2]],
            4,
            ["-", ["*", 2, ["^", "x", 2]]],
            -3,
            ["*", 5, ["^", "x", 2]],
        ];

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(originalTree);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(originalTree);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 4, ["^", "x", 2]], -2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 4, ["^", "x", 2]], -2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls([
            "+",
            ["*", -2, ["^", "x", 2]],
            ["^", "x", 2],
            ["*", 5, ["^", "x", 2]],
            -2,
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls([
            "+",
            ["^", "x", 2],
            1,
            ["*", -2, ["^", "x", 2]],
            -3,
            ["*", 5, ["^", "x", 2]],
        ]);
    });

    it("expand math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Default is to not expand: <math name="m1">(x-3)(2x+4)</math></p>
    <p>Expand: <math name="m2" expand="true">(x-3)(2x+4)</math></p>
    <p>Don't expand sum: <math name="m3">(x-3)(2x+4) - (3x+5)(7-x)</math></p>
    <p>Expand: <math name="m4" expand="true">(x-3)(2x+4) - (3x+5)(7-x)</math></p>
    <p>Expand: <math name="m5" expand>2(1-x)(1+x)(-2)</math></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("(x-3)(2x+4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("2x^{2}-2x-12");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("(x-3)(2x+4)-(3x+5)(7-x)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                    .latex,
            ),
        ).eq("5x^{2}-18x-47");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m5")].stateValues
                    .latex,
            ),
        ).eq("4x^{2}-4");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["*", ["+", "x", -3], ["+", ["*", 2, "x"], 4]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, ["^", "x", 2]], ["*", -2, "x"], -12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls([
            "+",
            ["*", ["+", "x", -3], ["+", ["*", 2, "x"], 4]],
            ["-", ["*", ["+", ["*", 3, "x"], 5], ["+", 7, ["-", "x"]]]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 5, ["^", "x", 2]], ["*", -18, "x"], -47]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 4, ["^", "x", 2]], -4]);
    });

    it("create vectors and intervals", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Default: <math name="m1">(1,2,3),(4,5),[6,7],(8,9],[10,11)</math></p>
    <p>Create vectors: <math name="m2" createvectors="true">(1,2,3),(4,5),[6,7],(8,9],[10,11)</math></p>
    <p>Create intervals: <math name="m3" createintervals="true">(1,2,3),(4,5),[6,7],(8,9],[10,11)</math></p>
    <p>Create vectors and intervals: <math name="m4" createvectors createintervals>(1,2,3),(4,5),[6,7],(8,9],[10,11)</math></p>
    <p>Alt vectors: <math name="m5">⟨1,2,3⟩,⟨4,5⟩,[6,7],(8,9],[10,11)</math></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("(1,2,3),(4,5),[6,7],(8,9],[10,11)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("(1,2,3),(4,5),[6,7],(8,9],[10,11)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("(1,2,3),(4,5),[6,7],(8,9],[10,11)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                    .latex,
            ),
        ).eq("(1,2,3),(4,5),[6,7],(8,9],[10,11)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m5")].stateValues
                    .latex,
            ),
        ).eq("\\langle1,2,3\\rangle,\\langle4,5\\rangle,[6,7],(8,9],[10,11)");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls([
            "list",
            ["tuple", 1, 2, 3],
            ["tuple", 4, 5],
            ["array", 6, 7],
            ["interval", ["tuple", 8, 9], ["tuple", false, true]],
            ["interval", ["tuple", 10, 11], ["tuple", true, false]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls([
            "list",
            ["vector", 1, 2, 3],
            ["vector", 4, 5],
            ["array", 6, 7],
            ["interval", ["tuple", 8, 9], ["tuple", false, true]],
            ["interval", ["tuple", 10, 11], ["tuple", true, false]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls([
            "list",
            ["tuple", 1, 2, 3],
            ["interval", ["tuple", 4, 5], ["tuple", false, false]],
            ["interval", ["tuple", 6, 7], ["tuple", true, true]],
            ["interval", ["tuple", 8, 9], ["tuple", false, true]],
            ["interval", ["tuple", 10, 11], ["tuple", true, false]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls([
            "list",
            ["vector", 1, 2, 3],
            ["vector", 4, 5],
            ["interval", ["tuple", 6, 7], ["tuple", true, true]],
            ["interval", ["tuple", 8, 9], ["tuple", false, true]],
            ["interval", ["tuple", 10, 11], ["tuple", true, false]],
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls([
            "list",
            ["altvector", 1, 2, 3],
            ["altvector", 4, 5],
            ["array", 6, 7],
            ["interval", ["tuple", 8, 9], ["tuple", false, true]],
            ["interval", ["tuple", 10, 11], ["tuple", true, false]],
        ]);
    });

    it("display small numbers as zero by default", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math name="m1" parseScientificNotation displaysmallaszero="false">2x + (1E-15)y</math></p>
  <p><math name="m2" parseScientificNotation>2x + (1E-15)y</math></p>
  <p><math name="m3" parseScientificNotation displaysmallaszero>2x + (1E-13)y</math></p>
  <p><math name="m4" parseScientificNotation displaysmallaszero="1E-12">2x + (1E-13)y</math></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("2x+1\\cdot10^{-15}y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("2x+0y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("2x+1\\cdot10^{-13}y");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                    .latex,
            ),
        ).eq("2x+0y");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], ["*", 1e-15, "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], ["*", 1e-15, "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], ["*", 1e-13, "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["+", ["*", 2, "x"], ["*", 1e-13, "y"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                .displaySmallAsZero,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                .displaySmallAsZero,
        ).eq(1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                .displaySmallAsZero,
        ).eq(1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                .displaySmallAsZero,
        ).eq(1e-12);
    });

    it("display digits and decimals", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math name="expr1">621802.3520303639164826281</math></p>
  <p><math name="expr2">31.3835205397397634 x + 4pi</math></p>
  <p><math name="expr1Dig5" displayDigits="5">621802.3520303639164826281</math></p>
  <p><math name="expr2Dig5" displayDigits="5">31.3835205397397634 x + 4pi</math></p>
  <p><math name="expr1Dec5" displayDecimals="5">621802.3520303639164826281</math></p>
  <p><math name="expr2Dec5" displayDecimals="5">31.3835205397397634 x + 4pi</math></p>
  <p><math extend="$expr1" name="expr1Dig5a" displayDigits="5" /></p>
  <p><math extend="$expr2" name="expr2Dig5a" displayDigits="5" /></p>
  <p><math extend="$expr1" name="expr1Dec5a" displayDecimals="5" /></p>
  <p><math extend="$expr2" name="expr2Dec5a" displayDecimals="5" /></p>
  <p><math extend="$expr1Dec5" name="expr1Dig5b" displayDigits="5" /></p>
  <p><math extend="$expr2Dec5" name="expr2Dig5b" displayDigits="5" /></p>
  <p><math extend="$expr1Dig5" name="expr1Dec5b" displayDecimals="5" /></p>
  <p><math extend="$expr2Dig5" name="expr2Dec5b" displayDecimals="5" /></p>
  <p><math extend="$expr1Dec5a" name="expr1Dig5c" displayDigits="5" /></p>
  <p><math extend="$expr2Dec5a" name="expr2Dig5c" displayDigits="5" /></p>
  <p><math extend="$expr1Dig5a" name="expr1Dec5c" displayDecimals="5" /></p>
  <p><math extend="$expr2Dig5a" name="expr2Dec5c" displayDecimals="5" /></p>
  <p><math extend="$expr1Dec5b" name="expr1Dig5d" displayDigits="5" /></p>
  <p><math extend="$expr2Dec5b" name="expr2Dig5d" displayDigits="5" /></p>
  <p><math extend="$expr1Dig5b" name="expr1Dec5d" displayDecimals="5" /></p>
  <p><math extend="$expr2Dig5b" name="expr2Dec5d" displayDecimals="5" /></p>

  <p><math extend="$expr1" name="expr1Dig5Dec1" displayDigits="5" displayDecimals="1" /></p>
  <p><math extend="$expr2" name="expr2Dig5Dec1" displayDigits="5" displayDecimals="1" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1")].stateValues
                    .latex,
            ),
        ).eq("621802.35");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2")].stateValues
                    .latex,
            ),
        ).eq("31.38x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig5")]
                    .stateValues.latex,
            ),
        ).eq("621800");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig5")]
                    .stateValues.latex,
            ),
        ).eq("31.384x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dec5")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dec5")]
                    .stateValues.latex,
            ),
        ).eq("31.38352x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig5a")]
                    .stateValues.latex,
            ),
        ).eq("621800");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig5a")]
                    .stateValues.latex,
            ),
        ).eq("31.384x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dec5a")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dec5a")]
                    .stateValues.latex,
            ),
        ).eq("31.38352x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig5b")]
                    .stateValues.latex,
            ),
        ).eq("621800");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig5b")]
                    .stateValues.latex,
            ),
        ).eq("31.384x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dec5b")]
                    .stateValues.latex,
            ),
        ).eq("31.38352x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig5c")]
                    .stateValues.latex,
            ),
        ).eq("621800");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig5c")]
                    .stateValues.latex,
            ),
        ).eq("31.384x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dec5c")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dec5c")]
                    .stateValues.latex,
            ),
        ).eq("31.38352x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig5d")]
                    .stateValues.latex,
            ),
        ).eq("621800");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig5d")]
                    .stateValues.latex,
            ),
        ).eq("31.384x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dec5d")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dec5d")]
                    .stateValues.latex,
            ),
        ).eq("31.38352x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig5Dec1")]
                    .stateValues.latex,
            ),
        ).eq("621802.4");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig5Dec1")]
                    .stateValues.latex,
            ),
        ).eq("31.384x+4\\pi");

        expect(
            stateVariables[await resolvePathToNodeIdx("expr1")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5a")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5a")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5a")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5a")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5b")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5b")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5b")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5b")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5c")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5c")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5c")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5c")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5d")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5d")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5d")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5d")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5Dec1")]
                .stateValues.value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5Dec1")]
                .stateValues.value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("expr1")].stateValues
                .valueForDisplay.tree,
        ).eq(621802.35);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5")].stateValues
                .valueForDisplay.tree,
        ).eq(621800);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.384, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5")].stateValues
                .valueForDisplay.tree,
        ).eq(621802.35203);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38352, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5a")].stateValues
                .valueForDisplay.tree,
        ).eq(621800);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.384, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5a")].stateValues
                .valueForDisplay.tree,
        ).eq(621802.35203);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38352, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5b")].stateValues
                .valueForDisplay.tree,
        ).eq(621800);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5b")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.384, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5b")].stateValues
                .valueForDisplay.tree,
        ).eq(621802.35203);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5b")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38352, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5c")].stateValues
                .valueForDisplay.tree,
        ).eq(621800);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5c")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.384, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5c")].stateValues
                .valueForDisplay.tree,
        ).eq(621802.35203);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5c")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38352, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5d")].stateValues
                .valueForDisplay.tree,
        ).eq(621800);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5d")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.384, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5d")].stateValues
                .valueForDisplay.tree,
        ).eq(621802.35203);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5d")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38352, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5Dec1")]
                .stateValues.valueForDisplay.tree,
        ).eq(621802.4);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5Dec1")]
                .stateValues.valueForDisplay.tree,
        ).eqls(["+", ["*", 31.384, "x"], ["*", 4, "pi"]]);
    });

    it("display digits and decimals 2", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math name="expr1">621802.3520303639164826281</math></p>
  <p><math name="expr2">31.3835205397397634 x + 4pi</math></p>
  <p><math name="expr1Dig5" displayDigits="5">621802.3520303639164826281</math></p>
  <p><math name="expr2Dig5" displayDigits="5">31.3835205397397634 x + 4pi</math></p>
  <p><math name="expr1Dec5" displayDecimals="5">621802.3520303639164826281</math></p>
  <p><math name="expr2Dec5" displayDecimals="5">31.3835205397397634 x + 4pi</math></p>
  <p><math extend="$expr1" name="expr1Dig5a" displayDigits="5" /></p>
  <p><math extend="$expr2" name="expr2Dig5a" displayDigits="5" /></p>
  <p><math extend="$expr1" name="expr1Dec5a" displayDecimals="5" /></p>
  <p><math extend="$expr2" name="expr2Dec5a" displayDecimals="5" /></p>
  <p><math extend="$expr1Dec5" name="expr1Dig8Dec5" displayDigits="8" displayDecimals="5" /></p>
  <p><math extend="$expr2Dec5" name="expr2Dig8Dec5" displayDigits="8" displayDecimals="5" /></p>
  <p><math extend="$expr1Dig5" name="expr1Dec8Dig5" displayDigits="5" displayDecimals="8" /></p>
  <p><math extend="$expr2Dig5" name="expr2Dec8Dig5" displayDigits="5" displayDecimals="8" /></p>
  <p><math extend="$expr1Dec5a" name="expr1Dig8Dec5a" displayDigits="8" displayDecimals="5" /></p>
  <p><math extend="$expr2Dec5a" name="expr2Dig8Dec5a" displayDigits="8" displayDecimals="5" /></p>
  <p><math extend="$expr1Dig5a" name="expr1Dec8Dig5a" displayDigits="5" displayDecimals="8" /></p>
  <p><math extend="$expr2Dig5a" name="expr2Dec8Dig5a" displayDigits="5" displayDecimals="8" /></p>
  <p><math extend="$expr1Dec8Dig5" name="expr1Dig3Dec8" displayDigits="3" displayDecimals="8" /></p>
  <p><math extend="$expr2Dec8Dig5" name="expr2Dig3Dec8" displayDigits="3" displayDecimals="8" /></p>
  <p><math extend="$expr1Dig8Dec5" name="expr1Dec3Dig8" displayDigits="8" displayDecimals="3" /></p>
  <p><math extend="$expr2Dig8Dec5" name="expr2Dec3Dig8" displayDigits="8" displayDecimals="3" /></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1")].stateValues
                    .latex,
            ),
        ).eq("621802.35");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2")].stateValues
                    .latex,
            ),
        ).eq("31.38x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig5")]
                    .stateValues.latex,
            ),
        ).eq("621800");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig5")]
                    .stateValues.latex,
            ),
        ).eq("31.384x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dec5")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dec5")]
                    .stateValues.latex,
            ),
        ).eq("31.38352x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig5a")]
                    .stateValues.latex,
            ),
        ).eq("621800");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig5a")]
                    .stateValues.latex,
            ),
        ).eq("31.384x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dec5a")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dec5a")]
                    .stateValues.latex,
            ),
        ).eq("31.38352x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig8Dec5")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig8Dec5")]
                    .stateValues.latex,
            ),
        ).eq("31.383521x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dec8Dig5")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203036");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dec8Dig5")]
                    .stateValues.latex,
            ),
        ).eq("31.38352054x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig8Dec5a")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig8Dec5a")]
                    .stateValues.latex,
            ),
        ).eq("31.383521x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dec8Dig5a")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203036");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dec8Dig5a")]
                    .stateValues.latex,
            ),
        ).eq("31.38352054x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dig3Dec8")]
                    .stateValues.latex,
            ),
        ).eq("621802.35203036");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dig3Dec8")]
                    .stateValues.latex,
            ),
        ).eq("31.38352054x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr1Dec3Dig8")]
                    .stateValues.latex,
            ),
        ).eq("621802.352");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("expr2Dec3Dig8")]
                    .stateValues.latex,
            ),
        ).eq("31.383521x+4\\pi");

        expect(
            stateVariables[await resolvePathToNodeIdx("expr1")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5a")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5a")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5a")].stateValues
                .value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5a")].stateValues
                .value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig8Dec5")]
                .stateValues.value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig8Dec5")]
                .stateValues.value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec8Dig5")]
                .stateValues.value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec8Dig5")]
                .stateValues.value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig8Dec5a")]
                .stateValues.value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig8Dec5a")]
                .stateValues.value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec8Dig5a")]
                .stateValues.value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec8Dig5a")]
                .stateValues.value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig3Dec8")]
                .stateValues.value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig3Dec8")]
                .stateValues.value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec3Dig8")]
                .stateValues.value.tree,
        ).eq(621802.3520303639);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec3Dig8")]
                .stateValues.value.tree,
        ).eqls(["+", ["*", 31.383520539739763, "x"], ["*", 4, "pi"]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("expr1")].stateValues
                .valueForDisplay.tree,
        ).eq(621802.35);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5")].stateValues
                .valueForDisplay.tree,
        ).eq(621800);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.384, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5")].stateValues
                .valueForDisplay.tree,
        ).eq(621802.35203);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38352, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig5a")].stateValues
                .valueForDisplay.tree,
        ).eq(621800);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig5a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.384, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec5a")].stateValues
                .valueForDisplay.tree,
        ).eq(621802.35203);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec5a")].stateValues
                .valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38352, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig8Dec5")]
                .stateValues.valueForDisplay.tree,
        ).eq(621802.35203);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig8Dec5")]
                .stateValues.valueForDisplay.tree,
        ).eqls(["+", ["*", 31.383521, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec8Dig5")]
                .stateValues.valueForDisplay.tree,
        ).eq(621802.35203036);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec8Dig5")]
                .stateValues.valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38352054, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig8Dec5a")]
                .stateValues.valueForDisplay.tree,
        ).eq(621802.35203);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig8Dec5a")]
                .stateValues.valueForDisplay.tree,
        ).eqls(["+", ["*", 31.383521, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec8Dig5a")]
                .stateValues.valueForDisplay.tree,
        ).eq(621802.35203036);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec8Dig5a")]
                .stateValues.valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38352054, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dig3Dec8")]
                .stateValues.valueForDisplay.tree,
        ).eq(621802.35203036);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dig3Dec8")]
                .stateValues.valueForDisplay.tree,
        ).eqls(["+", ["*", 31.38352054, "x"], ["*", 4, "pi"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr1Dec3Dig8")]
                .stateValues.valueForDisplay.tree,
        ).eq(621802.352);
        expect(
            stateVariables[await resolvePathToNodeIdx("expr2Dec3Dig8")]
                .stateValues.valueForDisplay.tree,
        ).eqls(["+", ["*", 31.383521, "x"], ["*", 4, "pi"]]);
    });

    it("pad zeros with display digits and decimals", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math name="m1">62.1</math></p>
  <p><math name="m2">162.1*10^(-3)</math></p>
  <p><math name="m3">1.3 x + 4pi</math></p>
  <p><math extend="$m1" name="dig5a" displayDigits="5" /></p>
  <p><math extend="$m1" name="dig5apad" displayDigits="5" padZeros /></p>
  <p><math extend="$m2" name="dig5b" displayDigits="5" /></p>
  <p><math extend="$m2" name="dig5bpad" displayDigits="5" padZeros /></p>
  <p><math extend="$m3" name="dig5c" displayDigits="5" /></p>
  <p><math extend="$m3" name="dig5cpad" displayDigits="5" padZeros /></p>
  <p><math extend="$m1" name="dec5a" displayDecimals="5" /></p>
  <p><math extend="$m1" name="dec5apad" displayDecimals="5" padZeros /></p>
  <p><math extend="$m2" name="dec5b" displayDecimals="5" /></p>
  <p><math extend="$m2" name="dec5bpad" displayDecimals="5" padZeros /></p>
  <p><math extend="$m3" name="dec5c" displayDecimals="5" /></p>
  <p><math extend="$m3" name="dec5cpad" displayDecimals="5" padZeros /></p>
  <p><math extend="$m1" name="dig5dec1a" displayDigits="5" displayDecimals="1" /></p>
  <p><math extend="$m1" name="dig5dec1apad" displayDigits="5" displayDecimals="1" padZeros /></p>
  <p><math extend="$m2" name="dig5dec1b" displayDigits="5" displayDecimals="1" /></p>
  <p><math extend="$m2" name="dig5dec1bpad" displayDigits="5" displayDecimals="1" padZeros /></p>
  <p><math extend="$m3" name="dig5dec1c" displayDigits="5" displayDecimals="1" /></p>
  <p><math extend="$m3" name="dig5dec1cpad" displayDigits="5" displayDecimals="1" padZeros /></p>

  <p><text extend="$dig5a.text" name="dig5aText" /></p>
  <p><text extend="$dig5apad.text" name="dig5apadText" /></p>
  <p><text extend="$dig5b.text" name="dig5bText" /></p>
  <p><text extend="$dig5bpad.text" name="dig5bpadText" /></p>
  <p><text extend="$dig5c.text" name="dig5cText" /></p>
  <p><text extend="$dig5cpad.text" name="dig5cpadText" /></p>
  <p><text extend="$dec5a.text" name="dec5aText" /></p>
  <p><text extend="$dec5apad.text" name="dec5apadText" /></p>
  <p><text extend="$dec5b.text" name="dec5bText" /></p>
  <p><text extend="$dec5bpad.text" name="dec5bpadText" /></p>
  <p><text extend="$dec5c.text" name="dec5cText" /></p>
  <p><text extend="$dec5cpad.text" name="dec5cpadText" /></p>
  <p><text extend="$dig5dec1a.text" name="dig5dec1aText" /></p>
  <p><text extend="$dig5dec1apad.text" name="dig5dec1apadText" /></p>
  <p><text extend="$dig5dec1b.text" name="dig5dec1bText" /></p>
  <p><text extend="$dig5dec1bpad.text" name="dig5dec1bpadText" /></p>
  <p><text extend="$dig5dec1c.text" name="dig5dec1cText" /></p>
  <p><text extend="$dig5dec1cpad.text" name="dig5dec1cpadText" /></p>

  <p><math extend="$dig5a.value" name="dig5aValue" /></p>
  <p><math extend="$dig5apad.value" name="dig5apadValue" /></p>
  <p><math extend="$dig5b.value" name="dig5bValue" /></p>
  <p><math extend="$dig5bpad.value" name="dig5bpadValue" /></p>
  <p><math extend="$dig5c.value" name="dig5cValue" /></p>
  <p><math extend="$dig5cpad.value" name="dig5cpadValue" /></p>
  <p><math extend="$dec5a.value" name="dec5aValue" /></p>
  <p><math extend="$dec5apad.value" name="dec5apadValue" /></p>
  <p><math extend="$dec5b.value" name="dec5bValue" /></p>
  <p><math extend="$dec5bpad.value" name="dec5bpadValue" /></p>
  <p><math extend="$dec5c.value" name="dec5cValue" /></p>
  <p><math extend="$dec5cpad.value" name="dec5cpadValue" /></p>
  <p><math extend="$dig5dec1a.value" name="dig5dec1aValue" /></p>
  <p><math extend="$dig5dec1apad.value" name="dig5dec1apadValue" /></p>
  <p><math extend="$dig5dec1b.value" name="dig5dec1bValue" /></p>
  <p><math extend="$dig5dec1bpad.value" name="dig5dec1bpadValue" /></p>
  <p><math extend="$dig5dec1c.value" name="dig5dec1cValue" /></p>
  <p><math extend="$dig5dec1cpad.value" name="dig5dec1cpadValue" /></p>

  <p><number extend="$dig5a.number" name="dig5aNumber" /></p>
  <p><number extend="$dig5apad.number" name="dig5apadNumber" /></p>
  <p><number extend="$dig5b.number" name="dig5bNumber" /></p>
  <p><number extend="$dig5bpad.number" name="dig5bpadNumber" /></p>
  <p><number extend="$dig5c.number" name="dig5cNumber" /></p>
  <p><number extend="$dig5cpad.number" name="dig5cpadNumber" /></p>
  <p><number extend="$dec5a.number" name="dec5aNumber" /></p>
  <p><number extend="$dec5apad.number" name="dec5apadNumber" /></p>
  <p><number extend="$dec5b.number" name="dec5bNumber" /></p>
  <p><number extend="$dec5bpad.number" name="dec5bpadNumber" /></p>
  <p><number extend="$dec5c.number" name="dec5cNumber" /></p>
  <p><number extend="$dec5cpad.number" name="dec5cpadNumber" /></p>
  <p><number extend="$dig5dec1a.number" name="dig5dec1aNumber" /></p>
  <p><number extend="$dig5dec1apad.number" name="dig5dec1apadNumber" /></p>
  <p><number extend="$dig5dec1b.number" name="dig5dec1bNumber" /></p>
  <p><number extend="$dig5dec1bpad.number" name="dig5dec1bpadNumber" /></p>
  <p><number extend="$dig5dec1c.number" name="dig5dec1cNumber" /></p>
  <p><number extend="$dig5dec1cpad.number" name="dig5dec1cpadNumber" /></p>

  <p><math name="dig5aMath">$dig5a</math></p>
  <p><math name="dig5apadMath">$dig5apad</math></p>
  <p><math name="dig5bMath">$dig5b</math></p>
  <p><math name="dig5bpadMath">$dig5bpad</math></p>
  <p><math name="dig5cMath">$dig5c</math></p>
  <p><math name="dig5cpadMath">$dig5cpad</math></p>
  <p><math name="dec5aMath">$dec5a</math></p>
  <p><math name="dec5apadMath">$dec5apad</math></p>
  <p><math name="dec5bMath">$dec5b</math></p>
  <p><math name="dec5bpadMath">$dec5bpad</math></p>
  <p><math name="dec5cMath">$dec5c</math></p>
  <p><math name="dec5cpadMath">$dec5cpad</math></p>
  <p><math name="dig5dec1aMath">$dig5dec1a</math></p>
  <p><math name="dig5dec1apadMath">$dig5dec1apad</math></p>
  <p><math name="dig5dec1bMath">$dig5dec1b</math></p>
  <p><math name="dig5dec1bpadMath">$dig5dec1bpad</math></p>
  <p><math name="dig5dec1cMath">$dig5dec1c</math></p>
  <p><math name="dig5dec1cpadMath">$dig5dec1cpad</math></p>

  <p><number name="dig5aNumber2">$dig5a</number></p>
  <p><number name="dig5apadNumber2">$dig5apad</number></p>
  <p><number name="dig5bNumber2">$dig5b</number></p>
  <p><number name="dig5bpadNumber2">$dig5bpad</number></p>
  <p><number name="dig5cNumber2">$dig5c</number></p>
  <p><number name="dig5cpadNumber2">$dig5cpad</number></p>
  <p><number name="dec5aNumber2">$dec5a</number></p>
  <p><number name="dec5apadNumber2">$dec5apad</number></p>
  <p><number name="dec5bNumber2">$dec5b</number></p>
  <p><number name="dec5bpadNumber2">$dec5bpad</number></p>
  <p><number name="dec5cNumber2">$dec5c</number></p>
  <p><number name="dec5cpadNumber2">$dec5cpad</number></p>
  <p><number name="dig5dec1aNumber2">$dig5dec1a</number></p>
  <p><number name="dig5dec1apadNumber2">$dig5dec1apad</number></p>
  <p><number name="dig5dec1bNumber2">$dig5dec1b</number></p>
  <p><number name="dig5dec1bpadNumber2">$dig5dec1bpad</number></p>
  <p><number name="dig5dec1cNumber2">$dig5dec1c</number></p>
  <p><number name="dig5dec1cpadNumber2">$dig5dec1cpad</number></p>

  <p><math extend="$dig5a.x1" name="dig5aX1" /></p>
  <p><math extend="$dig5apad.x1" name="dig5apadX1" /></p>
  <p><math extend="$dig5b.x1" name="dig5bX1" /></p>
  <p><math extend="$dig5bpad.x1" name="dig5bpadX1" /></p>
  <p><math extend="$dig5c.x1" name="dig5cX1" /></p>
  <p><math extend="$dig5cpad.x1" name="dig5cpadX1" /></p>
  <p><math extend="$dec5a.x1" name="dec5aX1" /></p>
  <p><math extend="$dec5apad.x1" name="dec5apadX1" /></p>
  <p><math extend="$dec5b.x1" name="dec5bX1" /></p>
  <p><math extend="$dec5bpad.x1" name="dec5bpadX1" /></p>
  <p><math extend="$dec5c.x1" name="dec5cX1" /></p>
  <p><math extend="$dec5cpad.x1" name="dec5cpadX1" /></p>
  <p><math extend="$dig5dec1a.x1" name="dig5dec1aX1" /></p>
  <p><math extend="$dig5dec1apad.x1" name="dig5dec1apadX1" /></p>
  <p><math extend="$dig5dec1b.x1" name="dig5dec1bX1" /></p>
  <p><math extend="$dig5dec1bpad.x1" name="dig5dec1bpadX1" /></p>
  <p><math extend="$dig5dec1c.x1" name="dig5dec1cX1" /></p>
  <p><math extend="$dig5dec1cpad.x1" name="dig5dec1cpadX1" /></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5a")].stateValues
                    .latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5apad")]
                    .stateValues.latex,
            ),
        ).eq("62.100");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5b")].stateValues
                    .latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5bpad")]
                    .stateValues.latex,
            ),
        ).eq("162.10\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5c")].stateValues
                    .latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5cpad")]
                    .stateValues.latex,
            ),
        ).eq("1.3000x+4.0000\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5a")].stateValues
                    .latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5apad")]
                    .stateValues.latex,
            ),
        ).eq("62.10000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5b")].stateValues
                    .latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5bpad")]
                    .stateValues.latex,
            ),
        ).eq("162.10000\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5c")].stateValues
                    .latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5cpad")]
                    .stateValues.latex,
            ),
        ).eq("1.30000x+4.00000\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1a")]
                    .stateValues.latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1apad")]
                    .stateValues.latex,
            ),
        ).eq("62.100");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1b")]
                    .stateValues.latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1bpad")]
                    .stateValues.latex,
            ),
        ).eq("162.10\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1c")]
                    .stateValues.latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1cpad")]
                    .stateValues.latex,
            ),
        ).eq("1.3000x+4.0000\\pi");

        expect(
            stateVariables[await resolvePathToNodeIdx("dig5aText")].stateValues
                .value,
        ).eq("62.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5apadText")]
                .stateValues.value,
        ).eq("62.100");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5bText")].stateValues
                .value,
        ).eq("162.1 * 10⁻³");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5bpadText")]
                .stateValues.value,
        ).eq("162.10 * 10⁻³");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5cText")].stateValues
                .value,
        ).eq("1.3 x + 4 π");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5cpadText")]
                .stateValues.value,
        ).eq("1.3000 x + 4.0000 π");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5aText")].stateValues
                .value,
        ).eq("62.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5apadText")]
                .stateValues.value,
        ).eq("62.10000");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5bText")].stateValues
                .value,
        ).eq("162.1 * 10⁻³");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5bpadText")]
                .stateValues.value,
        ).eq("162.10000 * 10⁻³");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5cText")].stateValues
                .value,
        ).eq("1.3 x + 4 π");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5cpadText")]
                .stateValues.value,
        ).eq("1.30000 x + 4.00000 π");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1aText")]
                .stateValues.value,
        ).eq("62.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1apadText")]
                .stateValues.value,
        ).eq("62.100");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1bText")]
                .stateValues.value,
        ).eq("162.1 * 10⁻³");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1bpadText")]
                .stateValues.value,
        ).eq("162.10 * 10⁻³");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1cText")]
                .stateValues.value,
        ).eq("1.3 x + 4 π");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1cpadText")]
                .stateValues.value,
        ).eq("1.3000 x + 4.0000 π");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5aValue")]
                    .stateValues.latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5apadValue")]
                    .stateValues.latex,
            ),
        ).eq("62.100");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5bValue")]
                    .stateValues.latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5bpadValue")]
                    .stateValues.latex,
            ),
        ).eq("162.10\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5cValue")]
                    .stateValues.latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5cpadValue")]
                    .stateValues.latex,
            ),
        ).eq("1.3000x+4.0000\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5aValue")]
                    .stateValues.latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5apadValue")]
                    .stateValues.latex,
            ),
        ).eq("62.10000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5bValue")]
                    .stateValues.latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5bpadValue")]
                    .stateValues.latex,
            ),
        ).eq("162.10000\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5cValue")]
                    .stateValues.latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5cpadValue")]
                    .stateValues.latex,
            ),
        ).eq("1.30000x+4.00000\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1aValue")]
                    .stateValues.latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1apadValue")]
                    .stateValues.latex,
            ),
        ).eq("62.100");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1bValue")]
                    .stateValues.latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1bpadValue")]
                    .stateValues.latex,
            ),
        ).eq("162.10\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1cValue")]
                    .stateValues.latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1cpadValue")]
                    .stateValues.latex,
            ),
        ).eq("1.3000x+4.0000\\pi");

        expect(
            stateVariables[await resolvePathToNodeIdx("dig5aNumber")]
                .stateValues.text,
        ).eq("62.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5apadNumber")]
                .stateValues.text,
        ).eq("62.100");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5bNumber")]
                .stateValues.text,
        ).eq("0.1621");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5bpadNumber")]
                .stateValues.text,
        ).eq("0.16210");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5cNumber")]
                .stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5cpadNumber")]
                .stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5aNumber")]
                .stateValues.text,
        ).eq("62.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5apadNumber")]
                .stateValues.text,
        ).eq("62.10000");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5bNumber")]
                .stateValues.text,
        ).eq("0.1621");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5bpadNumber")]
                .stateValues.text,
        ).eq("0.16210");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5cNumber")]
                .stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5cpadNumber")]
                .stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1aNumber")]
                .stateValues.text,
        ).eq("62.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1apadNumber")]
                .stateValues.text,
        ).eq("62.100");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1bNumber")]
                .stateValues.text,
        ).eq("0.1621");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1bpadNumber")]
                .stateValues.text,
        ).eq("0.16210");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1cNumber")]
                .stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1cpadNumber")]
                .stateValues.text,
        ).eq("NaN");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5aMath")]
                    .stateValues.latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5apadMath")]
                    .stateValues.latex,
            ),
        ).eq("62.100");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5bMath")]
                    .stateValues.latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5bpadMath")]
                    .stateValues.latex,
            ),
        ).eq("162.10\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5cMath")]
                    .stateValues.latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5cpadMath")]
                    .stateValues.latex,
            ),
        ).eq("1.3000x+4.0000\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5aMath")]
                    .stateValues.latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5apadMath")]
                    .stateValues.latex,
            ),
        ).eq("62.10000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5bMath")]
                    .stateValues.latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5bpadMath")]
                    .stateValues.latex,
            ),
        ).eq("162.10000\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5cMath")]
                    .stateValues.latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5cpadMath")]
                    .stateValues.latex,
            ),
        ).eq("1.30000x+4.00000\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1aMath")]
                    .stateValues.latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1apadMath")]
                    .stateValues.latex,
            ),
        ).eq("62.100");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1bMath")]
                    .stateValues.latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1bpadMath")]
                    .stateValues.latex,
            ),
        ).eq("162.10\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1cMath")]
                    .stateValues.latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1cpadMath")]
                    .stateValues.latex,
            ),
        ).eq("1.3000x+4.0000\\pi");

        expect(
            stateVariables[await resolvePathToNodeIdx("dig5aNumber2")]
                .stateValues.text,
        ).eq("62.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5apadNumber2")]
                .stateValues.text,
        ).eq("62.100");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5bNumber2")]
                .stateValues.text,
        ).eq("0.1621");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5bpadNumber2")]
                .stateValues.text,
        ).eq("0.16210");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5cNumber2")]
                .stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5cpadNumber2")]
                .stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5aNumber2")]
                .stateValues.text,
        ).eq("62.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5apadNumber2")]
                .stateValues.text,
        ).eq("62.10000");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5bNumber2")]
                .stateValues.text,
        ).eq("0.1621");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5bpadNumber2")]
                .stateValues.text,
        ).eq("0.16210");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5cNumber2")]
                .stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("dec5cpadNumber2")]
                .stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1aNumber2")]
                .stateValues.text,
        ).eq("62.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1apadNumber2")]
                .stateValues.text,
        ).eq("62.100");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1bNumber2")]
                .stateValues.text,
        ).eq("0.1621");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1bpadNumber2")]
                .stateValues.text,
        ).eq("0.16210");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1cNumber2")]
                .stateValues.text,
        ).eq("NaN");
        expect(
            stateVariables[await resolvePathToNodeIdx("dig5dec1cpadNumber2")]
                .stateValues.text,
        ).eq("NaN");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5aX1")]
                    .stateValues.latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5apadX1")]
                    .stateValues.latex,
            ),
        ).eq("62.100");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5bX1")]
                    .stateValues.latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5bpadX1")]
                    .stateValues.latex,
            ),
        ).eq("162.10\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5cX1")]
                    .stateValues.latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5cpadX1")]
                    .stateValues.latex,
            ),
        ).eq("1.3000x+4.0000\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5aX1")]
                    .stateValues.latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5apadX1")]
                    .stateValues.latex,
            ),
        ).eq("62.10000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5bX1")]
                    .stateValues.latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5bpadX1")]
                    .stateValues.latex,
            ),
        ).eq("162.10000\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5cX1")]
                    .stateValues.latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dec5cpadX1")]
                    .stateValues.latex,
            ),
        ).eq("1.30000x+4.00000\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1aX1")]
                    .stateValues.latex,
            ),
        ).eq("62.1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1apadX1")]
                    .stateValues.latex,
            ),
        ).eq("62.100");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1bX1")]
                    .stateValues.latex,
            ),
        ).eq("162.1\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1bpadX1")]
                    .stateValues.latex,
            ),
        ).eq("162.10\\cdot10^{-3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1cX1")]
                    .stateValues.latex,
            ),
        ).eq("1.3x+4\\pi");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dig5dec1cpadX1")]
                    .stateValues.latex,
            ),
        ).eq("1.3000x+4.0000\\pi");
    });

    it("dynamic rounding", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <p>Number: <math name="n">35203423.02352343201</math></p>
      <p>Number of digits: <mathInput name="nDigits" prefill="3" /></p>
      <p>Number of decimals: <mathInput name="nDecimals" prefill="3" /></p>
      <p><math extend="$n" displayDigits='$nDigits' displayDecimals='$nDecimals' name="na" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("n")].stateValues
                    .latex,
            ),
        ).eq("35203423.02");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("na")].stateValues
                    .latex,
            ),
        ).eq("35203423.024");

        // higher decimals
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("nDecimals"),
            latex: "5",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("na")].stateValues
                    .latex,
            ),
        ).eq("35203423.02352");

        // lower decimals
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("nDecimals"),
            latex: "-3",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("na")].stateValues
                    .latex,
            ),
        ).eq("35203000");

        // increase digits
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("nDigits"),
            latex: "12",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("na")].stateValues
                    .latex,
            ),
        ).eq("35203423.0235");

        // invalid nDigits, falls back to decimals
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("nDigits"),
            latex: "x",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("na")].stateValues
                    .latex,
            ),
        ).eq("35203000");

        // invalid both, no rounding
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("nDecimals"),
            latex: "y",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("na")].stateValues
                    .latex,
            ),
        ).eq("35203423.023523435");

        // only invalid nDecimals, falls back to digits
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("nDigits"),
            latex: "1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("na")].stateValues
                    .latex,
            ),
        ).eq("40000000");

        // negative decimals past number magnitude
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("nDecimals"),
            latex: "-8",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("na")].stateValues
                    .latex,
            ),
        ).eq("40000000");

        // becomes zero with no digits
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("nDigits"),
            latex: "0",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("na")].stateValues
                    .latex,
            ),
        ).eq("0");

        // get number back with less rounding
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("nDecimals"),
            latex: "-6",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("na")].stateValues
                    .latex,
            ),
        ).eq("35000000");
    });

    it("function symbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math name="m1">f(x)</math></p>
  <p><math name="m2">g(t)</math></p>
  <p><math name="m3">h(z)</math></p>
  <p><math name="m4" functionSymbols="g h">f(x)</math></p>
  <p><math name="m5" functionSymbols="g h">g(t)</math></p>
  <p><math name="m6" functionSymbols="g h">h(z)</math></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["apply", "f", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["apply", "g", "t"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["*", "h", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["*", "f", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls(["apply", "g", "t"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls(["apply", "h", "z"]);
    });

    it("copy and overwrite function symbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="m1">f(x)+m(x)</math>
  <math extend="$m1" functionSymbols="m" name="m2" />
  <math extend="$m2" functionSymbols="m f" name="m3" />

  <math name="m4" functionSymbols="m f">f(x)+m(x)</math>
  <math extend="$m4" functionSymbols="m" name="m5" />
  <math extend="$m5" functionSymbols="f" name="m6" />
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["+", ["apply", "f", "x"], ["*", "m", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", ["*", "f", "x"], ["apply", "m", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["+", ["apply", "f", "x"], ["apply", "m", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["+", ["apply", "f", "x"], ["apply", "m", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls(["+", ["*", "f", "x"], ["apply", "m", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls(["+", ["apply", "f", "x"], ["*", "m", "x"]]);
    });

    it("referencesAreFunctionSymbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><select name="f">f g h k m n</select></p>
  <p><select name="x">s t u v w x y z</select></p>

  <p><math name="m1">$f($x)</math></p>
  <p><math name="m2">$x($f)</math></p>
  <p><math name="m3" referencesAreFunctionSymbols="$f">$f($x)</math></p>
  <p><math name="m4" referencesAreFunctionSymbols="$f">$x($f)</math></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let f =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("f")]
                        .replacements?.[0].componentIdx
                ].replacements?.[0].componentIdx
            ].stateValues.value.tree;
        let x =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("x")]
                        .replacements?.[0].componentIdx
                ].replacements?.[0].componentIdx
            ].stateValues.value.tree;

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["*", f, x]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["*", x, f]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["apply", f, x]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["*", x, f]);
    });

    it("copy and overwrite referencesAreFunctionSymbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><select name="f">f g h k m n</select></p>

  <p><math name="m1">$f(x)</math></p>
  <p><math extend="$m1" referencesAreFunctionSymbols="$f" name="m2" /></p>
  <p><math extend="$m2" referencesAreFunctionSymbols="" name="m3" /></p>

  <p><math name="m4" referencesAreFunctionSymbols="$f">$f(x)</math></p>
  <p><math extend="$m4" referencesAreFunctionSymbols="" name="m5" /></p>
  <p><math extend="$m5" referencesAreFunctionSymbols="$f" name="m6" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let f =
            stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("f")]
                        .replacements?.[0].componentIdx
                ].replacements?.[0].componentIdx
            ].stateValues.value.tree;

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["*", f, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["apply", f, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["*", f, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["apply", f, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls(["*", f, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls(["apply", f, "x"]);
    });

    it("copy and overwrite simplify", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math name="m1">x+x</math></p>
  <p><math extend="$m1" simplify name="m2" /></p>
  <p><math extend="$m2" simplify="none" name="m3" /></p>
  <p><math extend="$m1.value" simplify name="m2a" /></p>
  <p><math extend="$m2.value" simplify="none" name="m3a" /></p>

  <p><math name="m4" simplify>x+x</math></p>
  <p><math extend="$m4" simplify="none" name="m5" /></p>
  <p><math extend="$m5" simplify name="m6" /></p>
  <p><math extend="$m4.value" simplify="none" name="m5a" /></p>
  <p><math extend="$m5a.value" simplify name="m6a" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["+", "x", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["+", "x", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2a")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3a")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls(["+", "x", "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5a")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m6a")].stateValues.value
                .tree,
        ).eqls(["*", 2, "x"]);
    });

    it("split symbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math name="m1">xyz</math></p>
  <p><math name="m2" splitSymbols="false">xyz</math></p>
  <p><math name="m3" splitSymbols="true">xyz</math></p>
  <p><math name="m4" simplify>xyx</math></p>
  <p><math name="m5" simplify splitSymbols="false">xyx</math></p>
  <p><math name="m6" simplify splitSymbols="true">xyx</math></p>
  <p><math name="m7">xy_uv</math></p>
  <p><math name="m8">x2_2x</math></p>
  <p><math name="m9">2x_x2</math></p>
  <p><math name="m10">xy uv x2y 2x x2</math></p>
  <p><math name="m11" splitSymbols="false">xy_uv</math></p>
  <p><math name="m12" splitSymbols="false">x2_2x</math></p>
  <p><math name="m13" splitSymbols="false">2x_x2</math></p>
  <p><math name="m14" splitSymbols="false">xy uv x2y 2x x2</math></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["*", "y", ["^", "x", 2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls("xyx");
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls(["*", "y", ["^", "x", 2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m7")].stateValues.value
                .tree,
        ).eqls(["*", "x", ["_", "y", "u"], "v"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m8")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "x2", 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m9")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "x", "x2"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m10")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "u", "v", "x2y", 2, "x", "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m11")].stateValues.value
                .tree,
        ).eqls(["_", "xy", "uv"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m12")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "x2", 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m13")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "x", "x2"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m14")].stateValues.value
                .tree,
        ).eqls(["*", "xy", "uv", "x2y", 2, "x", "x2"]);
    });

    it("split symbols, nested", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math name="m1"><math>xyz</math></math></p>
  <p><math name="m2" splitSymbols="false"><math>xyz</math></math></p>
  <p><math name="m3" splitSymbols="true"><math>xyz</math></math></p>
  <p><math name="m4" simplify><math>xyx</math></math></p>
  <p><math name="m5" simplify splitSymbols="false"><math>xyx</math></math></p>
  <p><math name="m6" simplify splitSymbols="true"><math>xyx</math></math></p>
  <p><math name="m7"><math>xy_uv</math></math></p>
  <p><math name="m8"><math>x2_2x</math></math></p>
  <p><math name="m9"><math>2x_x2</math></math></p>
  <p><math name="m10"><math>xy uv x2y 2x x2</math></math></p>
  <p><math name="m11" splitSymbols="false"><math>xy_uv</math></math></p>
  <p><math name="m12" splitSymbols="false"><math>x2_2x</math></math></p>
  <p><math name="m13" splitSymbols="false"><math>2x_x2</math></math></p>
  <p><math name="m14" splitSymbols="false"><math>xy uv x2y 2x x2</math></math></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["*", "y", ["^", "x", 2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls("xyx");
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls(["*", "y", ["^", "x", 2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m7")].stateValues.value
                .tree,
        ).eqls(["*", "x", ["_", "y", "u"], "v"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m8")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "x2", 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m9")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "x", "x2"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m10")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "u", "v", "x2y", 2, "x", "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m11")].stateValues.value
                .tree,
        ).eqls(["_", "xy", "uv"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m12")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "x2", 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m13")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "x", "x2"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m14")].stateValues.value
                .tree,
        ).eqls(["*", "xy", "uv", "x2y", 2, "x", "x2"]);
    });

    it("split symbols, latex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math format="latex" name="m1">xyz</math></p>
  <p><math format="latex" name="m2" splitSymbols="false">xyz</math></p>
  <p><math format="latex" name="m2a" >\\operatorname{xyz}</math></p>
  <p><math format="latex" name="m2b" splitSymbols="false" >\\operatorname{xyz}</math></p>
  <p><math format="latex" name="m3" splitSymbols="true">xyz</math></p>
  <p><math format="latex" name="m4" simplify>xyx</math></p>
  <p><math format="latex" name="m5" simplify splitSymbols="false">xyx</math></p>
  <p><math format="latex" name="m5a" simplify>\\operatorname{xyx}</math></p>
  <p><math format="latex" name="m5b" simplify splitSymbols="false">\\operatorname{xyx}</math></p>
  <p><math format="latex" name="m6" simplify splitSymbols="true">xyx</math></p>
  <p><math format="latex" name="m7">xy_uv</math></p>
  <p><math format="latex" name="m8">x2_2x</math></p>
  <p><math format="latex" name="m8a">\\operatorname{x2}_2x</math></p>
  <p><math format="latex" name="m9">2x_x2</math></p>
  <p><math format="latex" name="m9a">2x_\\operatorname{x2}</math></p>
  <p><math format="latex" name="m9b">2x_{x2}</math></p>
  <p><math format="latex" name="m10">xy uv x2y 2x x2</math></p>
  <p><math format="latex" name="m10a">xy uv \\operatorname{x2y} 2x \\operatorname{x2}</math></p>
  <p><math format="latex" name="m11" splitSymbols="false">xy_uv</math></p>
  <p><math format="latex" name="m11a">\\operatorname{xy}_\\operatorname{uv}</math></p>
  <p><math format="latex" name="m11b" splitSymbols="false">\\operatorname{xy}_\\operatorname{uv}</math></p>
  <p><math format="latex" name="m12" splitSymbols="false">x2_2x</math></p>
  <p><math format="latex" name="m12a" splitSymbols="false">\\operatorname{x2}_2x</math></p>
  <p><math format="latex" name="m13" splitSymbols="false">2x_x2</math></p>
  <p><math format="latex" name="m13a" splitSymbols="false">2x_\\operatorname{x2}</math></p>
  <p><math format="latex" name="m14" splitSymbols="false">xy uv x2y 2x x2</math></p>
  <p><math format="latex" name="m14a">\\operatorname{xy} \\operatorname{uv} x2y 2x x2</math></p>
  <p><math format="latex" name="m14b" splitSymbols="false">\\operatorname{xy} \\operatorname{uv} x2y 2x x2</math></p>
  <p><math format="latex" name="m15">3^x2</math></p>
  <p><math format="latex" name="m15a" splitSymbols="false">3^x2</math></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2a")].stateValues.value
                .tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2b")].stateValues.value
                .tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["*", "y", ["^", "x", 2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls("xyx");
        expect(
            stateVariables[await resolvePathToNodeIdx("m5a")].stateValues.value
                .tree,
        ).eqls("xyx");
        expect(
            stateVariables[await resolvePathToNodeIdx("m5b")].stateValues.value
                .tree,
        ).eqls("xyx");
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls(["*", "y", ["^", "x", 2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m7")].stateValues.value
                .tree,
        ).eqls(["*", "x", ["_", "y", "u"], "v"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m8")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "x2", 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m8a")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "x2", 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m9")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "x", "x"], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m9a")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "x", "x2"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m9b")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "x", "x2"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m10")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "u", "v", "x2y", 2, "x", "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m10a")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "u", "v", "x2y", 2, "x", "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m11")].stateValues.value
                .tree,
        ).eqls(["_", "xy", "uv"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m11a")].stateValues.value
                .tree,
        ).eqls(["_", "xy", "uv"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m11b")].stateValues.value
                .tree,
        ).eqls(["_", "xy", "uv"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m12")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "x2", 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m12a")].stateValues.value
                .tree,
        ).eqls(["*", ["_", "x2", 2], "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m13")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "x", "x2"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m13a")].stateValues.value
                .tree,
        ).eqls(["*", 2, ["_", "x", "x2"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m14")].stateValues.value
                .tree,
        ).eqls(["*", "xy", "uv", "x2y", 2, "x", "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m14a")].stateValues.value
                .tree,
        ).eqls(["*", "xy", "uv", "x2y", 2, "x", "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m14b")].stateValues.value
                .tree,
        ).eqls(["*", "xy", "uv", "x2y", 2, "x", "x2"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m15")].stateValues.value
                .tree,
        ).eqls(["*", ["^", 3, "x"], 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m15a")].stateValues.value
                .tree,
        ).eqls(["^", 3, "x2"]);
    });

    it("copy and overwrite split symbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math name="m1">xyz</math></p>
  <p><math extend="$m1" splitSymbols="false" name="m2" /></p>
  <p><math extend="$m2" splitSymbols name="m3" /></p>

  <p><math name="m4" splitSymbols="false">xyz</math></p>
  <p><math extend="$m4" splitSymbols name="m5" /></p>
  <p><math extend="$m5" splitSymbols="false" name="m6" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls(["*", "x", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls("xyz");
    });

    it("merge lists with other containers", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><math name="set">{<math>a,b,c</math>}</math></p>
  <!--<p><math name="tuple">(<math>a,b,c</math>,)</math></p>-->
  <p><math name="combinedSet">{<math>a,b,c</math>,d,<math>e,f</math>}</math></p>
  <p><math name="combinedTuple">(<math>a,b,c</math>,d,<math>e,f</math>)</math></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("set")].stateValues.value
                .tree,
        ).eqls(["set", "a", "b", "c"]);
        // expect(stateVariables['/tuple'].stateValues.value.tree).eqls(["tuple", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("combinedSet")]
                .stateValues.value.tree,
        ).eqls(["set", "a", "b", "c", "d", "e", "f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("combinedTuple")]
                .stateValues.value.tree,
        ).eqls(["tuple", "a", "b", "c", "d", "e", "f"]);
    });

    it("components of math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><mathInput name="m" prefill="(a,b,c)" /></p>
  <p><math name="m2">$m</math></p>
  <p><math name="m3" createVectors>$m</math></p>
  <p>Ndimensions: <number extend="$m.numDimensions" name="numDim1" /> <number extend="$m2.numDimensions" name="numDim2" /> <number extend="$m3.numDimensions" name="numDim3" /></p>
  <p>x: <math extend="$m[1]" name="x" /> <math extend="$m2.x" name="x_2" /><math extend=" $m3.x" name="x_3" /></p>
  <p>y: <math extend="$m[2]" name="y"/><math extend=" $m2.y" name="y_2" /><math extend=" $m3.y" name="y_3" /></p>
  <p>z: <math extend="$m[3]" name="z"/><math extend=" $m2.z" name="z_2" /><math extend=" $m3.z" name="z_3" /></p>
  <p>x1: <math extend="$m.x1" name="x1"/> <math extend="$m2.x1" name="x1_2" /> <math extend="$m3.x1" name="x1_3" /></p>
  <p>x2: <math extend="$m.x2" name="x2"/> <math extend="$m2.x2" name="x2_2" /> <math extend="$m3.x2" name="x2_3" /></p>
  <p>x3: <math extend="$m.x3" name="x3"/> <math extend="$m2.x3" name="x3_2" /> <math extend="$m3.x3" name="x3_3" /></p>
  <p>x4: <math extend="$m.x4" name="x4"/> <math extend="$m2.x4" name="x4_2" /> <math extend="$m3.x4" name="x4_3" /></p>
  <p>x: <mathInput bindValueTo="$x" name="mx" /> <mathInput bindValueTo="$m2.x" name="mx_2" /> <mathInput bindValueTo="$m3.x" name="mx_3" /></p>
  <p>y: <mathInput bindValueTo="$y" name="my" /> <mathInput bindValueTo="$m2.y" name="my_2" /> <mathInput bindValueTo="$m3.y" name="my_3" /></p>
  <p>z: <mathInput bindValueTo="$z" name="mz" /> <mathInput bindValueTo="$m2.z" name="mz_2" /> <mathInput bindValueTo="$m3.z" name="mz_3" /></p>
  <p>x1: <mathInput bindValueTo="$x1" name="mx1" /> <mathInput bindValueTo="$m2.x1" name="mx1_2" /> <mathInput bindValueTo="$m3.x1" name="mx1_3" /></p>
  <p>x2: <mathInput bindValueTo="$x2" name="mx2" /> <mathInput bindValueTo="$m2.x2" name="mx2_2" /> <mathInput bindValueTo="$m3.x2" name="mx2_3" /></p>
  <p>x3: <mathInput bindValueTo="$x3" name="mx3" /> <mathInput bindValueTo="$m2.x3" name="mx3_2" /> <mathInput bindValueTo="$m3.x3" name="mx3_3" /></p>
  <p>x4: <mathInput bindValueTo="$x4" name="mx4" /> <mathInput bindValueTo="$m2.x4" name="mx4_2" /> <mathInput bindValueTo="$m3.x4" name="mx4_3" /></p>
  `,
        });

        let indToComp = ["x", "y", "z"];

        async function check_values(
            xs: string[],
            operator: "tuple" | "vector" | "list" | "altvector",
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("numDim1")]
                    .stateValues.value,
            ).eq(xs.length);
            expect(
                stateVariables[await resolvePathToNodeIdx("numDim2")]
                    .stateValues.value,
            ).eq(xs.length);

            for (let [ind, x] of xs.entries()) {
                let comp = indToComp[ind];
                if (comp) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`${comp}`)]
                            .stateValues.value.tree,
                    ).eq(x);
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`${comp}_2`)]
                            .stateValues.value.tree,
                    ).eq(x);
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`${comp}_3`)]
                            .stateValues.value.tree,
                    ).eq(x);
                }

                expect(
                    stateVariables[await resolvePathToNodeIdx(`x${ind + 1}`)]
                        .stateValues.value.tree,
                ).eq(x);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`x${ind + 1}_2`)]
                        .stateValues.value.tree,
                ).eq(x);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`x${ind + 1}_3`)]
                        .stateValues.value.tree,
                ).eq(x);
            }

            let m3Operator = operator === "tuple" ? "vector" : operator;

            expect(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .value.tree,
            ).eqls([operator, ...xs]);
            expect(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .value.tree,
            ).eqls([operator, ...xs]);
            expect(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .value.tree,
            ).eqls([m3Operator, ...xs]);
        }

        await check_values(["a", "b", "c"], "tuple");

        // change xyz 1
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx"),
            latex: "d",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("my"),
            latex: "e",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mz"),
            latex: "f",
            core,
        });
        await check_values(["d", "e", "f"], "tuple");

        // change xyz 2
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx_2"),
            latex: "g",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("my_2"),
            latex: "h",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mz_2"),
            latex: "i",
            core,
        });
        await check_values(["g", "h", "i"], "tuple");

        // change xyz 3
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx_3"),
            latex: "j",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("my_3"),
            latex: "k",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mz_3"),
            latex: "l",
            core,
        });
        await check_values(["j", "k", "l"], "vector");

        // change x1x2x3 1
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx1"),
            latex: "m",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx2"),
            latex: "n",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx3"),
            latex: "o",
            core,
        });
        await check_values(["m", "n", "o"], "vector");

        // change x1x2x3 2
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx1_2"),
            latex: "p",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx2_2"),
            latex: "q",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx3_2"),
            latex: "r",
            core,
        });
        await check_values(["p", "q", "r"], "vector");

        // change x1x2x3 2
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx1_3"),
            latex: "s",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx2_3"),
            latex: "t",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx3_3"),
            latex: "u",
            core,
        });
        await check_values(["s", "t", "u"], "vector");

        // change to 4D list
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("m"),
            latex: "v,w,x,y",
            core,
        });

        await check_values(["v", "w", "x", "y"], "list");

        // change x1x2x3x4 1
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx1"),
            latex: "z",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx2"),
            latex: "a",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx3"),
            latex: "b",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx4"),
            latex: "c",
            core,
        });
        await check_values(["z", "a", "b", "c"], "list");

        // change x1x2x3x4 2
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx1_2"),
            latex: "d",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx2_2"),
            latex: "e",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx3_2"),
            latex: "f",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx4_2"),
            latex: "g",
            core,
        });
        await check_values(["d", "e", "f", "g"], "list");

        // change to 3D alt vector
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("m"),
            latex: "\\langle a,b,c\\rangle",
            core,
        });
        await check_values(["a", "b", "c"], "altvector");

        // change xyz 3
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mx_3"),
            latex: "j",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("my_3"),
            latex: "k",
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("mz_3"),
            latex: "l",
            core,
        });
        await check_values(["j", "k", "l"], "altvector");
    });

    it("aslist inside math, group", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  
  <group name="grp">
    <math>a</math>
    b
    <math>c</math>
  </group>


  <math name="nolist">$grp</math>
  <math name="list"><group extend="$grp" asList /></math>
  <math name="nolist2">($grp)</math>
  <math name="tuple">(<group extend="$grp" asList />)</math>
  <math name="doubleNoList">2$grp</math>
  <math name="doubleTuple">2<group extend="$grp" asList /></math>
  <math name="appendNoList">$grp, sin(x)</math>
  <math name="appendToList"><group extend="$grp" asList />, sin(x)</math>
  <math name="functionNoList">f($grp)</math>
  <math name="functionOfList">f(<group extend="$grp" asList />)</math>
  
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("nolist")].stateValues
                .value.tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("nolist")].stateValues
                .text,
        ).eq("a b c");

        expect(
            stateVariables[await resolvePathToNodeIdx("list")].stateValues.value
                .tree,
        ).eqls(["list", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("list")].stateValues.text,
        ).eq("a, b, c");

        expect(
            stateVariables[await resolvePathToNodeIdx("nolist2")].stateValues
                .value.tree,
        ).eqls(["*", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("nolist2")].stateValues
                .text,
        ).eq("a b c");

        expect(
            stateVariables[await resolvePathToNodeIdx("tuple")].stateValues
                .value.tree,
        ).eqls(["tuple", "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("tuple")].stateValues
                .text,
        ).eq("( a, b, c )");

        expect(
            stateVariables[await resolvePathToNodeIdx("doubleNoList")]
                .stateValues.value.tree,
        ).eqls(["*", 2, "a", "b", "c"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("doubleNoList")]
                .stateValues.text,
        ).eq("2 a b c");

        expect(
            stateVariables[await resolvePathToNodeIdx("doubleTuple")]
                .stateValues.value.tree,
        ).eqls(["*", 2, ["tuple", "a", "b", "c"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("doubleTuple")]
                .stateValues.text,
        ).eq("2 ( a, b, c )");

        expect(
            stateVariables[await resolvePathToNodeIdx("appendNoList")]
                .stateValues.value.tree,
        ).eqls(["list", ["*", "a", "b", "c"], ["apply", "sin", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("appendNoList")]
                .stateValues.text,
        ).eq("a b c, sin(x)");

        expect(
            stateVariables[await resolvePathToNodeIdx("appendToList")]
                .stateValues.value.tree,
        ).eqls(["list", "a", "b", "c", ["apply", "sin", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("appendToList")]
                .stateValues.text,
        ).eq("a, b, c, sin(x)");

        expect(
            stateVariables[await resolvePathToNodeIdx("functionNoList")]
                .stateValues.value.tree,
        ).eqls(["apply", "f", ["*", "a", "b", "c"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("functionNoList")]
                .stateValues.text,
        ).eq("f(a b c)");

        expect(
            stateVariables[await resolvePathToNodeIdx("functionOfList")]
                .stateValues.value.tree,
        ).eqls(["apply", "f", ["tuple", "a", "b", "c"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("functionOfList")]
                .stateValues.text,
        ).eq("f( a, b, c )");
    });

    it("aslist inside math, sequence", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  
  <sequence name="seq" to="4" />


  <math name="list" simplify>$seq</math>
  <math name="nolist" simplify><sequence extend="$seq" asList="false" /></math>
  <math name="tuple" simplify>($seq)</math>
  <math name="nolist2" simplify>(<sequence extend="$seq" asList="false" />)</math>
  <math name="doubleTuple" simplify>2$seq</math>
  <math name="doubleNoList" simplify>2<sequence extend="$seq" asList="false" /></math>
  <math name="appendToList" simplify>$seq, sin(x)</math>
  <math name="appendNoList" simplify><sequence extend="$seq" asList="false" />, sin(x)</math>
  <math name="functionOfList" simplify>sum($seq)</math>
  <math name="functionNoList" simplify>sum(<sequence extend="$seq" asList="false" />)</math>
  
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("list")].stateValues.value
                .tree,
        ).eqls(["list", 1, 2, 3, 4]);

        expect(
            stateVariables[await resolvePathToNodeIdx("nolist")].stateValues
                .value.tree,
        ).eq(24);

        expect(
            stateVariables[await resolvePathToNodeIdx("tuple")].stateValues
                .value.tree,
        ).eqls(["tuple", 1, 2, 3, 4]);

        expect(
            stateVariables[await resolvePathToNodeIdx("nolist2")].stateValues
                .value.tree,
        ).eq(24);

        expect(
            stateVariables[await resolvePathToNodeIdx("doubleTuple")]
                .stateValues.value.tree,
        ).eqls(["tuple", 2, 4, 6, 8]);

        expect(
            stateVariables[await resolvePathToNodeIdx("doubleNoList")]
                .stateValues.value.tree,
        ).eq(48);

        expect(
            stateVariables[await resolvePathToNodeIdx("appendToList")]
                .stateValues.value.tree,
        ).eqls(["list", 1, 2, 3, 4, ["apply", "sin", "x"]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("appendNoList")]
                .stateValues.value.tree,
        ).eqls(["list", 24, ["apply", "sin", "x"]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("functionOfList")]
                .stateValues.value.tree,
        ).eq(10);

        expect(
            stateVariables[await resolvePathToNodeIdx("functionNoList")]
                .stateValues.value.tree,
        ).eq(24);
    });

    it("aslist inside math, repeat", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  
  <repeat name="repeat" valueName="v" for="1 2 3">

      <number>$v^2</number>

      <math>x</math>

  </repeat>

  <math name="list" simplify>$repeat</math>
  <math name="nolist" simplify><repeat extend="$repeat" asList="false" /></math>
  <math name="tuple" simplify>($repeat)</math>
  <math name="nolist2" simplify>(<repeat extend="$repeat" asList="false" />)</math>
  <math name="doubleTuple" simplify>2$repeat</math>
  <math name="doubleNoList" simplify>2<repeat extend="$repeat" asList="false" /></math>
  
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("list")].stateValues.value
                .tree,
        ).eqls(["list", "x", ["*", 4, "x"], ["*", 9, "x"]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("nolist")].stateValues
                .value.tree,
        ).eqls(["*", 36, ["^", "x", 3]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("tuple")].stateValues
                .value.tree,
        ).eqls(["tuple", "x", ["*", 4, "x"], ["*", 9, "x"]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("nolist2")].stateValues
                .value.tree,
        ).eqls(["*", 36, ["^", "x", 3]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("doubleTuple")]
                .stateValues.value.tree,
        ).eqls(["tuple", ["*", 2, "x"], ["*", 8, "x"], ["*", 18, "x"]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("doubleNoList")]
                .stateValues.value.tree,
        ).eqls(["*", 72, ["^", "x", 3]]);
    });

    it("math inherits unordered of children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <math name="unordered1"><math unordered>2,3</math></math>
          <math name="unordered2">4<math unordered>(2,3)</math></math>
          <math name="unordered3" unordered><math>4</math><math unordered>(2,3)</math></math>
          <math name="ordered1">2,3</math>
          <math name="ordered2"><math>4</math><math unordered>(2,3)</math></math>
          <math name="ordered3" unordered="false"><math unordered>2,3</math></math>
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("unordered1")].stateValues
                .unordered,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("unordered2")].stateValues
                .unordered,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("unordered3")].stateValues
                .unordered,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ordered1")].stateValues
                .unordered,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ordered2")].stateValues
                .unordered,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ordered3")].stateValues
                .unordered,
        ).eq(false);
    });

    it("copy math and overwrite unordered", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <math name="ordered1">2,3</math>
          <math extend="$ordered1" unordered name="unordered1" />
          <math extend="$unordered1" unordered="false" name="ordered2" />
        
          <math name="unordered2" unordered>2,3</math>
          <math extend="$unordered2" unordered="false" name="ordered3" />
          <math extend="$ordered3" unordered name="unordered3" />
        
          <math name="unordered4"><math unordered>2,3</math></math>
          <math extend="$unordered4" unordered="false" name="ordered4" />
          <math extend="$ordered4" unordered name="unordered5" />
        
          <math name="ordered5" unordered="false"><math unordered>2,3</math></math>
          <math extend="$ordered5" unordered name="unordered6" />
          <math extend="$unordered6" unordered="false" name="ordered6" />
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("unordered1")].stateValues
                .unordered,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("unordered2")].stateValues
                .unordered,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("unordered3")].stateValues
                .unordered,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("unordered4")].stateValues
                .unordered,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("unordered5")].stateValues
                .unordered,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("unordered6")].stateValues
                .unordered,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ordered1")].stateValues
                .unordered,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ordered2")].stateValues
                .unordered,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ordered3")].stateValues
                .unordered,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ordered4")].stateValues
                .unordered,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ordered5")].stateValues
                .unordered,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("ordered6")].stateValues
                .unordered,
        ).eq(false);
    });

    it("copy math and overwrite unordered, change dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <booleanInput name="b1" prefill="true" />
          <booleanInput name="b2" />
          <booleanInput name="b3" prefill="true" />
        
          <p name="p1">
            <math name="m1" unordered="$b1">2,3</math>
            <math extend="$m1" unordered="$b2" name="m2" />
            <math extend="$m2" unordered="$b3" name="m3" />
          </p>
        
          <p extend="$p1" name="p2" />
          `,
        });

        async function check_values(b1: boolean, b2: boolean, b3: boolean) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("p1.m1")].stateValues
                    .unordered,
            ).eq(b1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p1.m2")].stateValues
                    .unordered,
            ).eq(b2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p1.m3")].stateValues
                    .unordered,
            ).eq(b3);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2.m1")].stateValues
                    .unordered,
            ).eq(b1);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2.m2")].stateValues
                    .unordered,
            ).eq(b2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p2.m3")].stateValues
                    .unordered,
            ).eq(b3);
        }

        let b1 = true;
        let b2 = false;
        let b3 = true;
        await check_values(b1, b2, b3);

        b1 = false;

        await updateBooleanInputValue({
            boolean: b1,
            componentIdx: await resolvePathToNodeIdx("b1"),
            core,
        });

        await check_values(b1, b2, b3);

        b2 = true;
        await updateBooleanInputValue({
            boolean: b2,
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        await check_values(b1, b2, b3);

        b3 = false;
        await updateBooleanInputValue({
            boolean: b3,
            componentIdx: await resolvePathToNodeIdx("b3"),
            core,
        });
        await check_values(b1, b2, b3);
    });

    it("shrink vector dimensions in inverse direction", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <math name="m">(x,y,z)</math>
          <mathInput name="mi" bindValueTo="$m" />
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .latex,
            ),
        ).eq("(x,y,z)");

        await updateMathInputValue({
            latex: "(x,y)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .latex,
            ),
        ).eq("(x,y)");
    });

    it("change one vector component in inverse direction does not affect other", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <number name="n">1</number>
          <graph>
            <point name="P" coords="(2$n+1,1)" />
            <point extend="$P" name="Q" x="2$n-1" />
          </graph>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([3, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([1, 1]);

        // move dependent point
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("Q"),
            x: -2,
            y: 3,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(-0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([0, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([-2, 3]);
    });

    it("change one vector component in inverse direction does not affect other, original in math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <number name="n">1</number>
          <math name="coords" simplify>(2$n+1,1)</math>
          <graph>
            <point name="P" coords="$coords" />
            <point extend="$P" name="Q" x="2$n-1" />
          </graph>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([3, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([1, 1]);

        // move dependent point
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("Q"),
            x: -2,
            y: 3,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(-0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([0, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([-2, 3]);
    });

    it("change one vector component in inverse direction does not affect other, through mathInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <number name="n">1</number>
          <math name="coords1" simplify>(2$n+1,1)</math>
          <mathInput name="coords2" bindValueTo="$coords1" />
          <graph>
            <point name="P" coords="$coords2" />
            <point extend="$P" name="Q" x="2$n-1" />
          </graph>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([3, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([1, 1]);

        // move dependent point
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("Q"),
            x: -2,
            y: 3,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(-0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([0, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([-2, 3]);

        // enter value in mathInput
        await updateMathInputValue({
            latex: "(6,9)",
            componentIdx: await resolvePathToNodeIdx("coords2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([6, 9]);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q")].stateValues.xs.map(
                (x: any) => x.tree,
            ),
        ).eqls([4, 9]);
    });

    it("copy value prop copies attributes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p><math name="m1" displayDigits="2">8.5203845251</math>
          <math extend="$m1.value" name="m1a" />
          <math extend="$m1.value" displayDigits="5" name="m1b" />
          <math copy="$m1.value" name="m1c" />
          <math copy="$m1.value" displayDigits="5" name="m1d" />
          </p>
        
          <p><math name="m2" displayDecimals="4">8.5203845251</math>
          <math extend="$m2.value" name="m2a" />
          <math extend="$m2.value" displayDecimals="6" name="m2b" />
          <math copy="$m2.value" name="m2c" />
          <math copy="$m2.value" displayDecimals="6" name="m2d" />
          </p>
        
          <p><math name="m3" displaySmallAsZero="false">0.000000000000000015382487</math>
          <math extend="$m3.value" name="m3a" />
          <math extend="$m3.value" displaySmallAsZero="true" name="m3b" />
          <math copy="$m3.value" name="m3c" />
          <math copy="$m3.value" displaySmallAsZero="true" name="m3d" />
          </p>
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("8.5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1a")].stateValues
                    .latex,
            ),
        ).eq("8.5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1b")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1c")].stateValues
                    .latex,
            ),
        ).eq("8.5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1d")].stateValues
                    .latex,
            ),
        ).eq("8.5204");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2a")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2b")].stateValues
                    .latex,
            ),
        ).eq("8.520385");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2c")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2d")].stateValues
                    .latex,
            ),
        ).eq("8.520385");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("1.54\\cdot10^{-17}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3a")].stateValues
                    .latex,
            ),
        ).eq("1.54\\cdot10^{-17}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3b")].stateValues
                    .latex,
            ),
        ).eq("0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3c")].stateValues
                    .latex,
            ),
        ).eq("1.54\\cdot10^{-17}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3d")].stateValues
                    .latex,
            ),
        ).eq("0");
    });

    it("set vector component to undefined, copy value", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <math name="m">(x,y)</math>
          <math extend="$m.value" name="m2" />
          <mathInput bindValueTo="$m.x" name="mi" />
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .latex,
            ),
        ).eq("(x,y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("(x,y)");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eq("x");

        await updateMathInputValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .latex,
            ),
        ).eq("(＿,y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("(＿,y)");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eq("");

        await updateMathInputValue({
            latex: "q",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .latex,
            ),
        ).eq("(q,y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("(q,y)");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eq("q");
    });

    it("set vector component to undefined, copy whole math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <math name="m">(x,y)</math>
          <math extend="$m" name="m2" />
          <mathInput bindValueTo="$m.x" name="mi" />
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .latex,
            ),
        ).eq("(x,y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("(x,y)");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eq("x");

        await updateMathInputValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .latex,
            ),
        ).eq("(＿,y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("(＿,y)");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eq("");

        await updateMathInputValue({
            latex: "q",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .latex,
            ),
        ).eq("(q,y)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("(q,y)");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .rawRendererValue,
        ).eq("q");
    });

    it("negative zero", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p><math name="m1">-0</math></p>
          <p><math name="m2">4 - 0</math></p>
          <p><math name="m3">0 - 0</math></p>
          <p><math name="m4">-0 - 0</math></p>
          <p><math name="m5">0 + -0</math></p>
          <p><math name="m6">0 - - 0</math></p>
          <p><math name="m7">-6/-0</math></p>
        
          <p><math name="m8">4 + <math>-0</math></math></p>
          <p><math name="m9">4 - <math>-0</math></math></p>
          <p><math name="m10"><math>-0</math> + <math>-0</math></math></p>
          <p><math name="m11"><math>-0</math> - <math>-0</math></math></p>
          <p><math name="m12"><math>-6</math>/<math>-0</math></math></p>
        
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("-0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("4-0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("0-0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                    .latex,
            ),
        ).eq("-0-0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m5")].stateValues
                    .latex,
            ),
        ).eq("0-0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m6")].stateValues
                    .latex,
            ),
        ).eq("0--0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m7")].stateValues
                    .latex,
            ),
        ).eq("-\\frac{6}{-0}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m8")].stateValues
                    .latex,
            ),
        ).eq("4-0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9")].stateValues
                    .latex,
            ),
        ).eq("4--0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10")].stateValues
                    .latex,
            ),
        ).eq("-0-0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m11")].stateValues
                    .latex,
            ),
        ).eq("-0--0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12")].stateValues
                    .latex,
            ),
        ).eq("\\frac{-6}{-0}");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["-", 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["+", 4, ["-", 0]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["+", 0, ["-", 0]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["+", ["-", 0], ["-", 0]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls(["+", 0, ["-", 0]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls(["+", 0, ["-", ["-", 0]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m7")].stateValues.value
                .tree,
        ).eqls(["-", ["/", 6, ["-", 0]]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("m8")].stateValues.value
                .tree,
        ).eqls(["+", 4, ["-", 0]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m9")].stateValues.value
                .tree,
        ).eqls(["+", 4, ["-", ["-", 0]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m10")].stateValues.value
                .tree,
        ).eqls(["+", ["-", 0], ["-", 0]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m11")].stateValues.value
                .tree,
        ).eqls(["+", ["-", 0], ["-", ["-", 0]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m12")].stateValues.value
                .tree,
        ).eqls(["/", -6, ["-", 0]]);
    });

    it("parse <", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p><math name="m1">x < y</math></p>
          <p><math name="m2">x <= y</math></p>
          <p><math name="m3">x <
              y</math></p>
          <p><math name="m4">x <=
              y</math></p>
          <p><math name="m5">x &lt; y</math></p>
          <p><math name="m6">x &lt;= y</math></p>
        
          <p><math name="m7" format="latex">x < y</math></p>
          <p><math name="m8" format="latex">x <
              y</math></p>
          <p><math name="m9" format="latex">x \\lt y</math></p>
          <p><math name="m10" format="latex">x &lt; y</math></p>
          <p><math name="m11" format="latex">x \\le y</math></p>
        
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["<", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["le", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["<", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["le", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls(["<", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.value
                .tree,
        ).eqls(["le", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m7")].stateValues.value
                .tree,
        ).eqls(["<", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m8")].stateValues.value
                .tree,
        ).eqls(["<", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m9")].stateValues.value
                .tree,
        ).eqls(["<", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m10")].stateValues.value
                .tree,
        ).eqls(["<", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m11")].stateValues.value
                .tree,
        ).eqls(["le", "x", "y"]);
    });

    it("display rounding preserved when only one math child", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p><math name="m1"><math displayDigits="5">8.5203845251</math></math>
            <math name="m1a"><number displayDigits="5">8.5203845251</number></math>
            <math name="m1b"><math displayDigits="5">8.5203845251</math>x+526195.5352</math>
            <math name="m1c"><number displayDigits="5">8.5203845251</number>x+526195.5352</math>
            <math name="m1d"><math displayDigits="5">8.5203845251</math><math displayDigits="5">x</math></math>
            <math name="m1e"><number displayDigits="5">8.5203845251</number><math displayDigits="5">x</math></math>
            <math name="m1f" displayDigits="7"><math displayDigits="5">8.5203845251</math></math>
            <math name="m1g" displayDecimals="4"><math displayDigits="8">8.5203845251+582342.423835237238</math></math>
          </p>
        
          <p><math name="m1_v" extend="$m1.value" />
            <math name="m1a_v" extend="$m1a.value" />
            <math name="m1b_v" extend="$m1b.value" />
            <math name="m1c_v" extend="$m1c.value" />
            <math name="m1d_v" extend="$m1d.value" />
            <math name="m1e_v" extend="$m1e.value" />
            <math name="m1f_v" extend="$m1f.value" />
            <math name="m1g_v" extend="$m1g.value" />
          </p>
        
          <p><math name="m2"><math displayDecimals="4">8.5203845251</math></math>
            <math name="m2a"><number displayDecimals="4">8.5203845251</number></math>
            <math name="m2b"><math displayDecimals="4">8.5203845251</math>x+526195.5352</math>
            <math name="m2c"><number displayDecimals="4">8.5203845251</number>x+526195.5352</math>
            <math name="m2d"><math displayDecimals="4">8.5203845251</math><math displayDecimals="4">x</math></math>
            <math name="m2e"><number displayDecimals="4">8.5203845251</number><math displayDecimals="4">x</math></math>
            <math name="m2f" displayDecimals="6"><math displayDecimals="4">8.5203845251</math></math>
            <math name="m2g" displayDigits="8"><math displayDecimals="4">8.5203845251+582342.423835237238</math></math>
          </p>
        
          <p><math name="m2_v" extend="$m2.value" />
            <math name="m2a_v" extend="$m2a.value" />
            <math name="m2b_v" extend="$m2b.value" />
            <math name="m2c_v" extend="$m2c.value" />
            <math name="m2d_v" extend="$m2d.value" />
            <math name="m2e_v" extend="$m2e.value" />
            <math name="m2f_v" extend="$m2f.value" />
            <math name="m2g_v" extend="$m2g.value" />
          </p>
        
          <p><math name="m3"><math displaySmallAsZero="false">0.000000000000000015382487</math></math>
            <math name="m3a"><number displaySmallAsZero="false">0.000000000000000015382487</number></math>
            <math name="m3b"><math displaySmallAsZero="false">0.000000000000000015382487</math>x+526195.5352</math>
            <math name="m3c"><number displaySmallAsZero="false">0.000000000000000015382487</number>x+526195.5352</math>
            <math name="m3d"><math displaySmallAsZero="false">0.000000000000000015382487</math><math displaySmallAsZero="false">x</math></math>
            <math name="m3e"><number displaySmallAsZero="false">0.000000000000000015382487</number><math displaySmallAsZero="false">x</math></math>
            <math name="m3f" displaySmallAsZero="true"><math displaySmallAsZero="false">0.000000000000000015382487</math></math>
          </p>
        
          <p><math name="m3_v" extend="$m3.value" />
            <math name="m3a_v" extend="$m3a.value" />
            <math name="m3b_v" extend="$m3b.value" />
            <math name="m3c_v" extend="$m3c.value" />
            <math name="m3d_v" extend="$m3d.value" />
            <math name="m3e_v" extend="$m3e.value" />
            <math name="m3f_v" extend="$m3f.value" />
          </p>
        
          <p><math name="m4"><math displayDigits="5" padZeros>8</math></math>
            <math name="m4a"><number displayDigits="5" padZeros>8</number></math>
            <math name="m4b"><math displayDigits="5" padZeros>8</math>x+526195.5352</math>
            <math name="m4c"><number displayDigits="5" padZeros>8</number>x+526195.5352</math>
            <math name="m4d"><math displayDigits="5" padZeros>8</math><math displayDigits="5" padZeros>x</math></math>
            <math name="m4e"><number displayDigits="5" padZeros>8</number><math displayDigits="5" padZeros>x</math></math>
            <math name="m4f" padZeros="false"><math displayDigits="5" padZeros>8</math></math>
          </p>
        
          <p><math name="m4_v" extend="$m4.value" />
            <math name="m4a_v" extend="$m4a.value" />
            <math name="m4b_v" extend="$m4b.value" />
            <math name="m4c_v" extend="$m4c.value" />
            <math name="m4d_v" extend="$m4d.value" />
            <math name="m4e_v" extend="$m4e.value" />
            <math name="m4f_v" extend="$m4f.value" />
          </p>
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1a")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1b")].stateValues
                    .latex,
            ),
        ).eq("8.52x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1c")].stateValues
                    .latex,
            ),
        ).eq("8.52x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1d")].stateValues
                    .latex,
            ),
        ).eq("8.52x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1e")].stateValues
                    .latex,
            ),
        ).eq("8.52x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1f")].stateValues
                    .latex,
            ),
        ).eq("8.520385");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1g")].stateValues
                    .latex,
            ),
        ).eq("8.5204+582342.4238");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1_v")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1a_v")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1b_v")].stateValues
                    .latex,
            ),
        ).eq("8.52x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1c_v")].stateValues
                    .latex,
            ),
        ).eq("8.52x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1d_v")].stateValues
                    .latex,
            ),
        ).eq("8.52x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1e_v")].stateValues
                    .latex,
            ),
        ).eq("8.52x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1f_v")].stateValues
                    .latex,
            ),
        ).eq("8.520385");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1g_v")].stateValues
                    .latex,
            ),
        ).eq("8.5204+582342.4238");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2a")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2b")].stateValues
                    .latex,
            ),
        ).eq("8.52x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2c")].stateValues
                    .latex,
            ),
        ).eq("8.52x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2d")].stateValues
                    .latex,
            ),
        ).eq("8.52x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2e")].stateValues
                    .latex,
            ),
        ).eq("8.52x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2f")].stateValues
                    .latex,
            ),
        ).eq("8.520385");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2g")].stateValues
                    .latex,
            ),
        ).eq("8.5203845+582342.42");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2_v")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2a_v")].stateValues
                    .latex,
            ),
        ).eq("8.5204");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2b_v")].stateValues
                    .latex,
            ),
        ).eq("8.52x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2c_v")].stateValues
                    .latex,
            ),
        ).eq("8.52x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2d_v")].stateValues
                    .latex,
            ),
        ).eq("8.52x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2e_v")].stateValues
                    .latex,
            ),
        ).eq("8.52x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2f_v")].stateValues
                    .latex,
            ),
        ).eq("8.520385");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2g_v")].stateValues
                    .latex,
            ),
        ).eq("8.5203845+582342.42");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("1.54\\cdot10^{-17}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3a")].stateValues
                    .latex,
            ),
        ).eq("1.54\\cdot10^{-17}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3b")].stateValues
                    .latex,
            ),
        ).eq("0x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3c")].stateValues
                    .latex,
            ),
        ).eq("0x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3d")].stateValues
                    .latex,
            ),
        ).eq("0x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3e")].stateValues
                    .latex,
            ),
        ).eq("0x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3f")].stateValues
                    .latex,
            ),
        ).eq("0");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3_v")].stateValues
                    .latex,
            ),
        ).eq("1.54\\cdot10^{-17}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3a_v")].stateValues
                    .latex,
            ),
        ).eq("1.54\\cdot10^{-17}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3b_v")].stateValues
                    .latex,
            ),
        ).eq("0x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3c_v")].stateValues
                    .latex,
            ),
        ).eq("0x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3d_v")].stateValues
                    .latex,
            ),
        ).eq("0x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3e_v")].stateValues
                    .latex,
            ),
        ).eq("0x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3f_v")].stateValues
                    .latex,
            ),
        ).eq("0");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                    .latex,
            ),
        ).eq("8.0000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4a")].stateValues
                    .latex,
            ),
        ).eq("8.0000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4b")].stateValues
                    .latex,
            ),
        ).eq("8x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4c")].stateValues
                    .latex,
            ),
        ).eq("8x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4d")].stateValues
                    .latex,
            ),
        ).eq("8x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4e")].stateValues
                    .latex,
            ),
        ).eq("8x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4f")].stateValues
                    .latex,
            ),
        ).eq("8");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4_v")].stateValues
                    .latex,
            ),
        ).eq("8.0000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4a_v")].stateValues
                    .latex,
            ),
        ).eq("8.0000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4b_v")].stateValues
                    .latex,
            ),
        ).eq("8x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4c_v")].stateValues
                    .latex,
            ),
        ).eq("8x+526195.54");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4d_v")].stateValues
                    .latex,
            ),
        ).eq("8x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4e_v")].stateValues
                    .latex,
            ),
        ).eq("8x");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4f_v")].stateValues
                    .latex,
            ),
        ).eq("8");
    });

    it("negative integer to power of integer", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <math name="m">(-3)^2</math>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .latex,
            ),
        ).eq("(-3)^{2}");
    });

    it("can get negative infinity from reciprocal when simplify", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <math name="ninf1" simplify>1/((0)(-1))</math>
          <math name="ninf2" simplify>1/((-1)(0))</math>
          <math name="ninf3" simplify>1/(-0)</math>
          <math name="ninf4" simplify>1/(-1(0))</math>
          <math name="ninf5" simplify>-1/0</math>
          <math name="ninf6" simplify>-1/((-1)(-0))</math>
        
          <math name="pinf1" simplify>1/((-0)(-1))</math>
          <math name="pinf2" simplify>1/((-1)(-0))</math>
          <math name="pinf3" simplify>-1/(-0)</math>
          <math name="pinf4" simplify>1/(-1(-0))</math>
          <math name="pinf5" simplify>1/0</math>
          <math name="pinf6" simplify>-1/((0)(-1))</math>
          <math name="pinf7" simplify>-1/((-1)(0))</math>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ninf1")].stateValues
                .value.tree,
        ).eq(-Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("ninf2")].stateValues
                .value.tree,
        ).eq(-Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("ninf3")].stateValues
                .value.tree,
        ).eq(-Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("ninf4")].stateValues
                .value.tree,
        ).eq(-Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("ninf5")].stateValues
                .value.tree,
        ).eq(-Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("ninf6")].stateValues
                .value.tree,
        ).eq(-Infinity);

        expect(
            stateVariables[await resolvePathToNodeIdx("pinf1")].stateValues
                .value.tree,
        ).eq(Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("pinf2")].stateValues
                .value.tree,
        ).eq(Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("pinf3")].stateValues
                .value.tree,
        ).eq(Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("pinf4")].stateValues
                .value.tree,
        ).eq(Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("pinf5")].stateValues
                .value.tree,
        ).eq(Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("pinf6")].stateValues
                .value.tree,
        ).eq(Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("pinf7")].stateValues
                .value.tree,
        ).eq(Infinity);
    });

    it("display blanks", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p>Display blanks: <booleanInput name="displayBlanks" /></p>
          <p><math name="m1" displayBlanks="$displayBlanks">x^() + /2</math></p>
          <p><math name="m2" displayBlanks="$displayBlanks">+++</math></p>
          <p><math name="m3" displayBlanks="$displayBlanks">2+</math></p>
          <p><math name="m4" displayBlanks="$displayBlanks">2+2+</math></p>
          <p><math name="m5" displayBlanks="$displayBlanks">'-_^</math></p>
          <p><math name="m6" displayBlanks="$displayBlanks">)</math></p>
          <p><math name="m7" displayBlanks="$displayBlanks">(,]</math></p>
          <p><math name="m8" displayBlanks="$displayBlanks">2+()</math></p>
          <p><math name="m9" displayBlanks="$displayBlanks">2+()+5</math></p>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("x^{}+\\frac{}{2}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("\\operatorname{+++}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("\\operatorname{2+}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                    .latex,
            ),
        ).eq("2+2+");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m5")].stateValues
                    .latex,
            ),
        ).eq("'-_{}^{}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m6")].stateValues
                    .latex,
            ),
        ).eq("");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m7")].stateValues
                    .latex,
            ),
        ).eq("(,]");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m8")].stateValues
                    .latex,
            ),
        ).eq("2+");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9")].stateValues
                    .latex,
            ),
        ).eq("2++5");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("displayBlanks"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("x^{\uff3f}+\\frac{\uff3f}{2}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("\\operatorname{+++}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("\\operatorname{2+}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                    .latex,
            ),
        ).eq("2+2+\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m5")].stateValues
                    .latex,
            ),
        ).eq("\uff3f'-\uff3f_{\uff3f}^{\uff3f}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m6")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m7")].stateValues
                    .latex,
            ),
        ).eq("(\uff3f,\uff3f]");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m8")].stateValues
                    .latex,
            ),
        ).eq("2+\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9")].stateValues
                    .latex,
            ),
        ).eq("2+\uff3f+5");
    });

    it("add and subtract vectors, multiply by scalar", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p>Tuple2: <math name="tuple2">(a,b)</math></p>
          <p>Vector2: <math name="vector2" createVectors>(c,d)</math></p>
          <p>Alt vector2: <math name="altvector2">⟨p,q⟩</math></p>
          <p>Interval: <math name="interval" createIntervals>(e,f)</math></p>
          <p>Tuple3: <math name="tuple3">(g,h,i)</math></p>
          <p>Vector3: <math name="vector3" createVectors>(j,k,l)</math></p>
          <p>Alt vector3: <math name="altvector3">⟨r,s,t⟩</math></p>
          <p><math name="t2t2sum">$tuple2+$tuple2</math></p>
          <p><math name="t2t2sumSimp" simplify>$tuple2+$tuple2</math></p>
          <p><math name="v2v2sum">$vector2+$vector2</math></p>
          <p><math name="v2v2sumSimp" simplify>$vector2+$vector2</math></p>
          <p><math name="a2a2sum">$altvector2+$altvector2</math></p>
          <p><math name="a2a2sumSimp" simplify>$altvector2+$altvector2</math></p>
          <p><math name="iisum">$interval+$interval</math></p>
          <p><math name="iisumSimp" simplify>$interval+$interval</math></p>
          <p><math name="t2v2sum">$tuple2+$vector2</math></p>
          <p><math name="t2v2sumSimp" simplify>$tuple2+$vector2</math></p>
          <p><math name="v2t2sum">$vector2+$tuple2</math></p>
          <p><math name="v2t2sumSimp" simplify>$vector2+$tuple2</math></p>
          <p><math name="t2a2sum">$tuple2+$altvector2</math></p>
          <p><math name="t2a2sumSimp" simplify>$tuple2+$altvector2</math></p>
          <p><math name="a2t2sum">$altvector2+$tuple2</math></p>
          <p><math name="a2t2sumSimp" simplify>$altvector2+$tuple2</math></p>
          <p><math name="v2a2sum">$vector2+$altvector2</math></p>
          <p><math name="v2a2sumSimp" simplify>$vector2+$altvector2</math></p>
          <p><math name="a2v2sum">$altvector2+$vector2</math></p>
          <p><math name="a2v2sumSimp" simplify>$altvector2+$vector2</math></p>
          <p><math name="t2v2diff">$tuple2-$vector2</math></p>
          <p><math name="t2v2diffSimp" simplify>$tuple2-$vector2</math></p>
          <p><math name="v2t2diff">$vector2-$tuple2</math></p>
          <p><math name="v2t2diffSimp" simplify>$vector2-$tuple2</math></p>
          <p><math name="t2a2diff">$tuple2-$altvector2</math></p>
          <p><math name="t2a2diffSimp" simplify>$tuple2-$altvector2</math></p>
          <p><math name="a2t2diff">$altvector2-$tuple2</math></p>
          <p><math name="a2t2diffSimp" simplify>$altvector2-$tuple2</math></p>
          <p><math name="v2a2diff">$vector2-$altvector2</math></p>
          <p><math name="v2a2diffSimp" simplify>$vector2-$altvector2</math></p>
          <p><math name="a2v2diff">$altvector2-$vector2</math></p>
          <p><math name="a2v2diffSimp" simplify>$altvector2-$vector2</math></p>
          <p><math name="t2isum">$tuple2+$interval</math></p>
          <p><math name="t2isumSimp" simplify>$tuple2+$interval</math></p>
          <p><math name="v2isum">$vector2+$interval</math></p>
          <p><math name="v2isumSimp" simplify>$vector2+$interval</math></p>
          <p><math name="a2isum">$altvector2+$interval</math></p>
          <p><math name="a2isumSimp" simplify>$altvector2+$interval</math></p>
          <p><math name="st2mul">m$tuple2</math></p>
          <p><math name="st2mulSimp" simplify>m$tuple2</math></p>
          <p><math name="st2mulExp" expand>m$tuple2</math></p>
          <p><math name="t2smul">$tuple2 m</math></p>
          <p><math name="t2smulSimp" simplify>$tuple2 m</math></p>
          <p><math name="t2smulExp" expand>$tuple2 m</math></p>
          <p><math name="sv2mul">m$vector2</math></p>
          <p><math name="sv2mulSimp" simplify>m$vector2</math></p>
          <p><math name="sv2mulExp" expand>m$vector2</math></p>
          <p><math name="v2smul">$vector2 m</math></p>
          <p><math name="v2smulSimp" simplify>$vector2 m</math></p>
          <p><math name="v2smulExp" expand>$vector2 m</math></p>
          <p><math name="sa2mul">m$altvector2</math></p>
          <p><math name="sa2mulSimp" simplify>m$altvector2</math></p>
          <p><math name="sa2mulExp" expand>m$altvector2</math></p>
          <p><math name="a2smul">$altvector2 m</math></p>
          <p><math name="a2smulSimp" simplify>$altvector2 m</math></p>
          <p><math name="a2smulExp" expand>$altvector2 m</math></p>
          <p><math name="simul">m$interval</math></p>
          <p><math name="simulSimp" simplify>m$interval</math></p>
          <p><math name="simulExp" expand>m$interval</math></p>
          <p><math name="ismul">$interval m</math></p>
          <p><math name="ismulSimp" simplify>$interval m</math></p>
          <p><math name="ismulExp" expand>$interval m</math></p>
          <p><math name="st2v2ssum">m$tuple2+$vector2*n</math></p>
          <p><math name="st2v2ssumSimp" simplify>m$tuple2+$vector2*n</math></p>
          <p><math name="st2v2ssumExp" expand>m$tuple2+$vector2*n</math></p>
          <p><math name="st2a2ssum">m$tuple2+$altvector2*n</math></p>
          <p><math name="st2a2ssumSimp" simplify>m$tuple2+$altvector2*n</math></p>
          <p><math name="st2a2ssumExp" expand>m$tuple2+$altvector2*n</math></p>
          <p><math name="sv2a2ssum">m$vector2+$altvector2*n</math></p>
          <p><math name="sv2a2ssumSimp" simplify>m$vector2+$altvector2*n</math></p>
          <p><math name="sv2a2ssumExp" expand>m$vector2+$altvector2*n</math></p>
        
          <p><math name="t3t3sum">$tuple3+$tuple3</math></p>
          <p><math name="t3t3sumSimp" simplify>$tuple3+$tuple3</math></p>
          <p><math name="v3v3sum">$vector3+$vector3</math></p>
          <p><math name="v3v3sumSimp" simplify>$vector3+$vector3</math></p>
          <p><math name="a3a3sum">$altvector3+$altvector3</math></p>
          <p><math name="a3a3sumSimp" simplify>$altvector3+$altvector3</math></p>
          <p><math name="t3v3sum">$tuple3+$vector3</math></p>
          <p><math name="t3v3sumSimp" simplify>$tuple3+$vector3</math></p>
          <p><math name="v3t3sum">$vector3+$tuple3</math></p>
          <p><math name="v3t3sumSimp" simplify>$vector3+$tuple3</math></p>
          <p><math name="t3a3sum">$tuple3+$altvector3</math></p>
          <p><math name="t3a3sumSimp" simplify>$tuple3+$altvector3</math></p>
          <p><math name="a3t3sum">$altvector3+$tuple3</math></p>
          <p><math name="a3t3sumSimp" simplify>$altvector3+$tuple3</math></p>
          <p><math name="v3a3sum">$vector3+$altvector3</math></p>
          <p><math name="v3a3sumSimp" simplify>$vector3+$altvector3</math></p>
          <p><math name="a3v3sum">$altvector3+$vector3</math></p>
          <p><math name="a3v3sumSimp" simplify>$altvector3+$vector3</math></p>
          <p><math name="t3v3diff">$tuple3-$vector3</math></p>
          <p><math name="t3v3diffSimp" simplify>$tuple3-$vector3</math></p>
          <p><math name="v3t3diff">$vector3-$tuple3</math></p>
          <p><math name="v3t3diffSimp" simplify>$vector3-$tuple3</math></p>
          <p><math name="t3a3diff">$tuple3-$altvector3</math></p>
          <p><math name="t3a3diffSimp" simplify>$tuple3-$altvector3</math></p>
          <p><math name="a3t3diff">$altvector3-$tuple3</math></p>
          <p><math name="a3t3diffSimp" simplify>$altvector3-$tuple3</math></p>
          <p><math name="v3a3diff">$vector3-$altvector3</math></p>
          <p><math name="v3a3diffSimp" simplify>$vector3-$altvector3</math></p>
          <p><math name="a3v3diff">$altvector3-$vector3</math></p>
          <p><math name="a3v3diffSimp" simplify>$altvector3-$vector3</math></p>
          <p><math name="st3mul">m$tuple3</math></p>
          <p><math name="st3mulSimp" simplify>m$tuple3</math></p>
          <p><math name="st3mulExp" expand>m$tuple3</math></p>
          <p><math name="t3smul">$tuple3 m</math></p>
          <p><math name="t3smulSimp" simplify>$tuple3 m</math></p>
          <p><math name="t3smulExp" expand>$tuple3 m</math></p>
          <p><math name="sv3mul">m$vector3</math></p>
          <p><math name="sv3mulSimp" simplify>m$vector3</math></p>
          <p><math name="sv3mulExp" expand>m$vector3</math></p>
          <p><math name="v3smul">$vector3 m</math></p>
          <p><math name="v3smulSimp" simplify>$vector3 m</math></p>
          <p><math name="v3smulExp" expand>$vector3 m</math></p>
          <p><math name="sa3mul">m$altvector3</math></p>
          <p><math name="sa3mulSimp" simplify>m$altvector3</math></p>
          <p><math name="sa3mulExp" expand>m$altvector3</math></p>
          <p><math name="a3smul">$altvector3 m</math></p>
          <p><math name="a3smulSimp" simplify>$altvector3 m</math></p>
          <p><math name="a3smulExp" expand>$altvector3 m</math></p>
          <p><math name="st3v3ssum">m$tuple3+$vector3*n</math></p>
          <p><math name="st3v3ssumSimp" simplify>m$tuple3+$vector3*n</math></p>
          <p><math name="st3v3ssumExp" expand>m$tuple3+$vector3*n</math></p>
          <p><math name="st3a3ssum">m$tuple3+$altvector3*n</math></p>
          <p><math name="st3a3ssumSimp" simplify>m$tuple3+$altvector3*n</math></p>
          <p><math name="st3a3ssumExp" expand>m$tuple3+$altvector3*n</math></p>
          <p><math name="sv3a3ssum">m$vector3+$altvector3*n</math></p>
          <p><math name="sv3a3ssumSimp" simplify>m$vector3+$altvector3*n</math></p>
          <p><math name="sv3a3ssumExp" expand>m$vector3+$altvector3*n</math></p>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2t2sum")]
                    .stateValues.latex,
            ),
        ).eq("(a,b)+(a,b)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2t2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(2a,2b)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2v2sum")]
                    .stateValues.latex,
            ),
        ).eq("(c,d)+(c,d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2v2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(2c,2d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2a2sum")]
                    .stateValues.latex,
            ),
        ).eq("\\langlep,q\\rangle+\\langlep,q\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2a2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\langle2p,2q\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("iisum")].stateValues
                    .latex,
            ),
        ).eq("(e,f)+(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("iisumSimp")]
                    .stateValues.latex,
            ),
        ).eq("2(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2v2sum")]
                    .stateValues.latex,
            ),
        ).eq("(a,b)+(c,d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2v2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(a+c,b+d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2t2sum")]
                    .stateValues.latex,
            ),
        ).eq("(c,d)+(a,b)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2t2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(a+c,b+d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2a2sum")]
                    .stateValues.latex,
            ),
        ).eq("(a,b)+\\langlep,q\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2a2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(a+p,b+q)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2t2sum")]
                    .stateValues.latex,
            ),
        ).eq("\\langlep,q\\rangle+(a,b)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2t2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(a+p,b+q)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2a2sum")]
                    .stateValues.latex,
            ),
        ).eq("(c,d)+\\langlep,q\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2a2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(c+p,d+q)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2v2sum")]
                    .stateValues.latex,
            ),
        ).eq("\\langlep,q\\rangle+(c,d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2v2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(c+p,d+q)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2v2diff")]
                    .stateValues.latex,
            ),
        ).eq("(a,b)-(c,d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2v2diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(a-c,b-d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2t2diff")]
                    .stateValues.latex,
            ),
        ).eq("(c,d)-(a,b)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2t2diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(-a+c,-b+d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2a2diff")]
                    .stateValues.latex,
            ),
        ).eq("(a,b)-\\langlep,q\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2a2diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(a-p,b-q)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2t2diff")]
                    .stateValues.latex,
            ),
        ).eq("\\langlep,q\\rangle-(a,b)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2t2diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(-a+p,-b+q)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2a2diff")]
                    .stateValues.latex,
            ),
        ).eq("(c,d)-\\langlep,q\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2a2diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(c-p,d-q)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2v2diff")]
                    .stateValues.latex,
            ),
        ).eq("\\langlep,q\\rangle-(c,d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2v2diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(-c+p,-d+q)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2isum")].stateValues
                    .latex,
            ),
        ).eq("(a,b)+(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2isumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(a,b)+(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2isum")].stateValues
                    .latex,
            ),
        ).eq("(c,d)+(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2isumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(c,d)+(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2isum")].stateValues
                    .latex,
            ),
        ).eq("\\langlep,q\\rangle+(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2isumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(e,f)+\\langlep,q\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st2mul")].stateValues
                    .latex,
            ),
        ).eq("m(a,b)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st2mulSimp")]
                    .stateValues.latex,
            ),
        ).eq("(am,bm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st2mulExp")]
                    .stateValues.latex,
            ),
        ).eq("(am,bm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2smul")].stateValues
                    .latex,
            ),
        ).eq("(a,b)m");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2smulSimp")]
                    .stateValues.latex,
            ),
        ).eq("(am,bm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2smulExp")]
                    .stateValues.latex,
            ),
        ).eq("(am,bm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv2mul")].stateValues
                    .latex,
            ),
        ).eq("m(c,d)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv2mulSimp")]
                    .stateValues.latex,
            ),
        ).eq("(cm,dm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv2mulExp")]
                    .stateValues.latex,
            ),
        ).eq("(cm,dm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2smul")].stateValues
                    .latex,
            ),
        ).eq("(c,d)m");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2smulSimp")]
                    .stateValues.latex,
            ),
        ).eq("(cm,dm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2smulExp")]
                    .stateValues.latex,
            ),
        ).eq("(cm,dm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sa2mul")].stateValues
                    .latex,
            ),
        ).eq("m\\langlep,q\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sa2mulSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\langlemp,mq\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sa2mulExp")]
                    .stateValues.latex,
            ),
        ).eq("\\langlemp,mq\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2smul")].stateValues
                    .latex,
            ),
        ).eq("\\langlep,q\\ranglem");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2smulSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\langlemp,mq\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2smulExp")]
                    .stateValues.latex,
            ),
        ).eq("\\langlemp,mq\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("simul")].stateValues
                    .latex,
            ),
        ).eq("m(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("simulSimp")]
                    .stateValues.latex,
            ),
        ).eq("m(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("simulExp")]
                    .stateValues.latex,
            ),
        ).eq("m(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("ismul")].stateValues
                    .latex,
            ),
        ).eq("(e,f)m");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("ismulSimp")]
                    .stateValues.latex,
            ),
        ).eq("m(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("ismulExp")]
                    .stateValues.latex,
            ),
        ).eq("m(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st2v2ssum")]
                    .stateValues.latex,
            ),
        ).eq("m(a,b)+(c,d)n");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st2v2ssumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(am+cn,bm+dn)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st2v2ssumExp")]
                    .stateValues.latex,
            ),
        ).eq("(am+cn,bm+dn)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st2a2ssum")]
                    .stateValues.latex,
            ),
        ).eq("m(a,b)+\\langlep,q\\ranglen");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st2a2ssumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(am+np,bm+nq)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st2a2ssumExp")]
                    .stateValues.latex,
            ),
        ).eq("(am+np,bm+nq)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv2a2ssum")]
                    .stateValues.latex,
            ),
        ).eq("m(c,d)+\\langlep,q\\ranglen");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv2a2ssumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(cm+np,dm+nq)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv2a2ssumExp")]
                    .stateValues.latex,
            ),
        ).eq("(cm+np,dm+nq)");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3t3sum")]
                    .stateValues.latex,
            ),
        ).eq("(g,h,i)+(g,h,i)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3t3sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(2g,2h,2i)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3v3sum")]
                    .stateValues.latex,
            ),
        ).eq("(j,k,l)+(j,k,l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3v3sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(2j,2k,2l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3a3sum")]
                    .stateValues.latex,
            ),
        ).eq("\\langler,s,t\\rangle+\\langler,s,t\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3a3sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\langle2r,2s,2t\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3v3sum")]
                    .stateValues.latex,
            ),
        ).eq("(g,h,i)+(j,k,l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3v3sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(g+j,h+k,i+l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3t3sum")]
                    .stateValues.latex,
            ),
        ).eq("(j,k,l)+(g,h,i)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3t3sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(g+j,h+k,i+l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3a3sum")]
                    .stateValues.latex,
            ),
        ).eq("(g,h,i)+\\langler,s,t\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3a3sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(g+r,h+s,i+t)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3t3sum")]
                    .stateValues.latex,
            ),
        ).eq("\\langler,s,t\\rangle+(g,h,i)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3t3sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(g+r,h+s,i+t)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3a3sum")]
                    .stateValues.latex,
            ),
        ).eq("(j,k,l)+\\langler,s,t\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3a3sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(j+r,k+s,l+t)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3v3sum")]
                    .stateValues.latex,
            ),
        ).eq("\\langler,s,t\\rangle+(j,k,l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3v3sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(j+r,k+s,l+t)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3v3diff")]
                    .stateValues.latex,
            ),
        ).eq("(g,h,i)-(j,k,l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3v3diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(g-j,h-k,i-l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3t3diff")]
                    .stateValues.latex,
            ),
        ).eq("(j,k,l)-(g,h,i)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3t3diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(-g+j,-h+k,-i+l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3a3diff")]
                    .stateValues.latex,
            ),
        ).eq("(g,h,i)-\\langler,s,t\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3a3diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(g-r,h-s,i-t)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3t3diff")]
                    .stateValues.latex,
            ),
        ).eq("\\langler,s,t\\rangle-(g,h,i)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3t3diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(-g+r,-h+s,-i+t)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3a3diff")]
                    .stateValues.latex,
            ),
        ).eq("(j,k,l)-\\langler,s,t\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3a3diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(j-r,k-s,l-t)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3v3diff")]
                    .stateValues.latex,
            ),
        ).eq("\\langler,s,t\\rangle-(j,k,l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3v3diffSimp")]
                    .stateValues.latex,
            ),
        ).eq("(-j+r,-k+s,-l+t)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st3mul")].stateValues
                    .latex,
            ),
        ).eq("m(g,h,i)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st3mulSimp")]
                    .stateValues.latex,
            ),
        ).eq("(gm,hm,im)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st3mulExp")]
                    .stateValues.latex,
            ),
        ).eq("(gm,hm,im)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3smul")].stateValues
                    .latex,
            ),
        ).eq("(g,h,i)m");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3smulSimp")]
                    .stateValues.latex,
            ),
        ).eq("(gm,hm,im)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t3smulExp")]
                    .stateValues.latex,
            ),
        ).eq("(gm,hm,im)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv3mul")].stateValues
                    .latex,
            ),
        ).eq("m(j,k,l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv3mulSimp")]
                    .stateValues.latex,
            ),
        ).eq("(jm,km,lm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv3mulExp")]
                    .stateValues.latex,
            ),
        ).eq("(jm,km,lm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3smul")].stateValues
                    .latex,
            ),
        ).eq("(j,k,l)m");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3smulSimp")]
                    .stateValues.latex,
            ),
        ).eq("(jm,km,lm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3smulExp")]
                    .stateValues.latex,
            ),
        ).eq("(jm,km,lm)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sa3mul")].stateValues
                    .latex,
            ),
        ).eq("m\\langler,s,t\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sa3mulSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\langlemr,ms,mt\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sa3mulExp")]
                    .stateValues.latex,
            ),
        ).eq("\\langlemr,ms,mt\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3smul")].stateValues
                    .latex,
            ),
        ).eq("\\langler,s,t\\ranglem");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3smulSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\langlemr,ms,mt\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a3smulExp")]
                    .stateValues.latex,
            ),
        ).eq("\\langlemr,ms,mt\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st3v3ssum")]
                    .stateValues.latex,
            ),
        ).eq("m(g,h,i)+(j,k,l)n");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st3v3ssumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(gm+jn,hm+kn,im+ln)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st3v3ssumExp")]
                    .stateValues.latex,
            ),
        ).eq("(gm+jn,hm+kn,im+ln)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st3a3ssum")]
                    .stateValues.latex,
            ),
        ).eq("m(g,h,i)+\\langler,s,t\\ranglen");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st3a3ssumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(gm+nr,hm+ns,im+nt)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("st3a3ssumExp")]
                    .stateValues.latex,
            ),
        ).eq("(gm+nr,hm+ns,im+nt)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv3a3ssum")]
                    .stateValues.latex,
            ),
        ).eq("m(j,k,l)+\\langler,s,t\\ranglen");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv3a3ssumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(jm+nr,km+ns,lm+nt)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sv3a3ssumExp")]
                    .stateValues.latex,
            ),
        ).eq("(jm+nr,km+ns,lm+nt)");
    });

    it("add and subtract matrices, multiply by scalar", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p>matrix22: <math name="matrix22" format="latex">\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}</math></p>
          <p>matrix21: <math name="matrix21" format="latex">\\begin{bmatrix}e\\\\f\\end{bmatrix}</math></p>
          <p>matrix12: <math name="matrix12" format="latex">\\begin{bmatrix}g&h\\end{bmatrix}</math></p>
          <p>Tuple2: <math name="tuple2">(i,j)</math></p>
          <p>Vector2: <math name="vector2" createVectors>(k,l)</math></p>
          <p>matrix22b: <math name="matrix22b" format="latex">\\begin{bmatrix}n&o\\\\p&q\\end{bmatrix}</math></p>
          <p><math name="m22m22sum">$matrix22+$matrix22</math></p>
          <p><math name="m22m22sumSimp" simplify>$matrix22+$matrix22</math></p>
          <p><math name="m21m21sum">$matrix21+$matrix21</math></p>
          <p><math name="m21m21sumSimp" simplify>$matrix21+$matrix21</math></p>
          <p><math name="m12m12sum">$matrix12+$matrix12</math></p>
          <p><math name="m12m12sumSimp" simplify>$matrix12+$matrix12</math></p>
          <p><math name="m21t2sum">$matrix21+$tuple2</math></p>
          <p><math name="m21t2sumSimp" simplify>$matrix21+$tuple2</math></p>
          <p><math name="m21v2sum">$matrix21+$vector2</math></p>
          <p><math name="m21v2sumSimp" simplify>$matrix21+$vector2</math></p>
          <p><math name="m12t2sum">$matrix12+$tuple2</math></p>
          <p><math name="m12t2sumSimp" simplify>$matrix12+$tuple2</math></p>
          <p><math name="m12v2sum">$matrix12+$vector2</math></p>
          <p><math name="m12v2sumSimp" simplify>$matrix12+$vector2</math></p>
          <p><math name="m22m21sum">$matrix22+$matrix21</math></p>
          <p><math name="m22m21sumSimp" simplify>$matrix22+$matrix21</math></p>
          <p><math name="m22m12sum">$matrix22+$matrix12</math></p>
          <p><math name="m22m12sumSimp" simplify>$matrix22+$matrix12</math></p>
          <p><math name="m21m12sum">$matrix21+$matrix12</math></p>
          <p><math name="m21m12sumSimp" simplify>$matrix21+$matrix12</math></p>
          <p><math name="m22m21m12m12m21m22sum">$matrix22+$matrix21+$matrix12+$matrix12+$matrix21+$matrix22</math></p>
          <p><math name="m22m21m12m12m21m22sumSimp" simplify>$matrix22+$matrix21+$matrix12+$matrix12+$matrix21+$matrix22</math></p>
        
          <p><math name="sm22mul">m$matrix22</math></p>
          <p><math name="sm22mulSimp" simplify>m$matrix22</math></p>
          <p><math name="sm22mulExp" expand>m$matrix22</math></p>
          <p><math name="m22smul">$matrix22 m</math></p>
          <p><math name="m22smulSimp" simplify>$matrix22 m</math></p>
          <p><math name="m22smulExp" expand>$matrix22 m</math></p>
          <p><math name="sm21mul">m$matrix21</math></p>
          <p><math name="sm21mulSimp" simplify>m$matrix21</math></p>
          <p><math name="sm21mulExp" expand>m$matrix21</math></p>
          <p><math name="m21smul">$matrix21 m</math></p>
          <p><math name="m21smulSimp" simplify>$matrix21 m</math></p>
          <p><math name="m21smulExp" expand>$matrix21 m</math></p>
          <p><math name="sm12mul">m$matrix12</math></p>
          <p><math name="sm12mulSimp" simplify>m$matrix12</math></p>
          <p><math name="sm12mulExp" expand>m$matrix12</math></p>
          <p><math name="m12smul">$matrix12 m</math></p>
          <p><math name="m12smulSimp" simplify>$matrix12 m</math></p>
          <p><math name="m12smulExp" expand>$matrix12 m</math></p>
        
        
          <p><math name="m22m22b">$matrix22+$matrix22b</math></p>
          <p><math name="m22m22bSimp" simplify>$matrix22+$matrix22b</math></p>
          <p><math name="m22m22bdiff">$matrix22-$matrix22b</math></p>
          <p><math name="m22m22bdiffSimp" simplify>$matrix22-$matrix22b</math></p>
          <p><math name="m22sm22b">$matrix22+m$matrix22b</math></p>
          <p><math name="m22sm22bSimp" simplify>$matrix22+m$matrix22b</math></p>
          <p><math name="m22sm22bExpSimp" expand simplify>$matrix22+m$matrix22b</math></p>
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22m22sum")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}+\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22m22sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}2a&2b\\\\2c&2d\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21m21sum")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}e\\\\f\\end{bmatrix}+\\begin{bmatrix}e\\\\f\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21m21sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}2e\\\\2f\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12m12sum")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}g&h\\end{bmatrix}+\\begin{bmatrix}g&h\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12m12sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}2g&2h\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21t2sum")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}e\\\\f\\end{bmatrix}+(i,j)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21t2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(i,j)+\\begin{bmatrix}e\\\\f\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21v2sum")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}e\\\\f\\end{bmatrix}+(k,l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21v2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(k,l)+\\begin{bmatrix}e\\\\f\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12t2sum")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}g&h\\end{bmatrix}+(i,j)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12t2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(i,j)+\\begin{bmatrix}g&h\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12v2sum")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}g&h\\end{bmatrix}+(k,l)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12v2sumSimp")]
                    .stateValues.latex,
            ),
        ).eq("(k,l)+\\begin{bmatrix}g&h\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22m21sum")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}+\\begin{bmatrix}e\\\\f\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22m21sumSimp")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}e\\\\f\\end{bmatrix}+\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22m12sum")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}+\\begin{bmatrix}g&h\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22m12sumSimp")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}g&h\\end{bmatrix}+\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21m12sum")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}e\\\\f\\end{bmatrix}+\\begin{bmatrix}g&h\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21m12sumSimp")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}g&h\\end{bmatrix}+\\begin{bmatrix}e\\\\f\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[
                    await resolvePathToNodeIdx("m22m21m12m12m21m22sum")
                ].stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}+\\begin{bmatrix}e\\\\f\\end{bmatrix}+\\begin{bmatrix}g&h\\end{bmatrix}+\\begin{bmatrix}g&h\\end{bmatrix}+\\begin{bmatrix}e\\\\f\\end{bmatrix}+\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[
                    await resolvePathToNodeIdx("m22m21m12m12m21m22sumSimp")
                ].stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}2g&2h\\end{bmatrix}+\\begin{bmatrix}2e\\\\2f\\end{bmatrix}+\\begin{bmatrix}2a&2b\\\\2c&2d\\end{bmatrix}",
        );

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sm22mul")]
                    .stateValues.latex,
            ),
        ).eq("m\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sm22mulSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}am&bm\\\\cm&dm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sm22mulExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}am&bm\\\\cm&dm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22smul")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}m");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22smulSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}am&bm\\\\cm&dm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22smulExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}am&bm\\\\cm&dm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sm21mul")]
                    .stateValues.latex,
            ),
        ).eq("m\\begin{bmatrix}e\\\\f\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sm21mulSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}em\\\\fm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sm21mulExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}em\\\\fm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21smul")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}e\\\\f\\end{bmatrix}m");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21smulSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}em\\\\fm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21smulExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}em\\\\fm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sm12mul")]
                    .stateValues.latex,
            ),
        ).eq("m\\begin{bmatrix}g&h\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sm12mulSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}gm&hm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sm12mulExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}gm&hm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12smul")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}g&h\\end{bmatrix}m");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12smulSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}gm&hm\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12smulExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}gm&hm\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22m22b")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}+\\begin{bmatrix}n&o\\\\p&q\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22m22bSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}a+n&b+o\\\\c+p&d+q\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22m22bdiff")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}-\\begin{bmatrix}n&o\\\\p&q\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22m22bdiffSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}a-n&b-o\\\\c-p&d-q\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22sm22b")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}+m\\begin{bmatrix}n&o\\\\p&q\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22sm22bSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}a+mn&b+mo\\\\c+mp&d+mq\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22sm22bExpSimp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}a+mn&b+mo\\\\c+mp&d+mq\\end{bmatrix}");
    });

    it("matrix multiplication", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p>matrix22a: <math name="matrix22a" format="latex">\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}</math></p>
          <p>matrix22b: <math name="matrix22b" format="latex">\\begin{bmatrix}e&f\\\\g&h\\end{bmatrix}</math></p>
          <p>matrix21a: <math name="matrix21a" format="latex">\\begin{bmatrix}i\\\\j\\end{bmatrix}</math></p>
          <p>matrix21b: <math name="matrix21b" format="latex">\\begin{bmatrix}k\\\\l\\end{bmatrix}</math></p>
          <p>matrix12a: <math name="matrix12a" format="latex">\\begin{bmatrix}m&n\\end{bmatrix}</math></p>
          <p>matrix12b: <math name="matrix12b" format="latex">\\begin{bmatrix}o&p\\end{bmatrix}</math></p>
          <p><math name="m22am22b">$matrix22a$matrix22b</math></p>
          <p><math name="m22am22bExp" expand>$matrix22a$matrix22b</math></p>
          <p><math name="m22bm22a">$matrix22b$matrix22a</math></p>
          <p><math name="m22bm22aExp" expand>$matrix22b$matrix22a</math></p>
          <p><math name="m22aSq">$matrix22a^2</math></p>
          <p><math name="m22aSqExp" expand>$matrix22a^2</math></p>
          <p><math name="m21am21b">$matrix21a$matrix21b</math></p>
          <p><math name="m21am21bExp" expand>$matrix21a$matrix21b</math></p>
          <p><math name="m12am12b">$matrix12a$matrix12b</math></p>
          <p><math name="m12am12bExp" expand>$matrix12a$matrix12b</math></p>
          <p><math name="m21am12a">$matrix21a$matrix12a</math></p>
          <p><math name="m21am12aExp" expand>$matrix21a$matrix12a</math></p>
          <p><math name="m12am21a">$matrix12a$matrix21a</math></p>
          <p><math name="m12am21aExp" expand>$matrix12a$matrix21a</math></p>
          <p><math name="longmult">$matrix22a$matrix21a$matrix12a$matrix22b$matrix21b$matrix12b</math></p>
          <p><math name="longmultExp" expand>$matrix22a$matrix21a$matrix12a$matrix22b$matrix21b$matrix12b</math></p>
          <p><math name="longMultResult" format="latex">\\begin{pmatrix}a e i k m o + a f i l m o + a g i k n o + a h i l n o + b e j k m o + b f j l m o + b g j k n o + b h j l n o & a e i k m p + a f i l m p + a g i k n p + a h i l n p + b e j k m p + b f j l m p + b g j k n p + b h j l n p\\\\
            c e i k m o + c f i l m o + c g i k n o + c h i l n o + d e j k m o + d f j l m o + d g j k n o + d h j l n o & c e i k m p + c f i l m p + c g i k n p + c h i l n p + d e j k m p + d f j l m p + d g j k n p + d h j l n p\\end{pmatrix}</math></p>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22am22b")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\begin{bmatrix}e&f\\\\g&h\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22am22bExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}ae+bg&af+bh\\\\ce+dg&cf+dh\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22bm22a")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}e&f\\\\g&h\\end{bmatrix}\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22bm22aExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}ae+cf&be+df\\\\ag+ch&bg+dh\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22aSq")].stateValues
                    .latex,
            ),
        ).eq("(\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix})^{2}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22aSqExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}a^{2}+bc&ab+bd\\\\ac+cd&bc+d^{2}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21am21b")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}i\\\\j\\end{bmatrix}\\begin{bmatrix}k\\\\l\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21am21bExp")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}i\\\\j\\end{bmatrix}\\begin{bmatrix}k\\\\l\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12am12b")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}m&n\\end{bmatrix}\\begin{bmatrix}o&p\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12am12bExp")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}m&n\\end{bmatrix}\\begin{bmatrix}o&p\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21am12a")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}i\\\\j\\end{bmatrix}\\begin{bmatrix}m&n\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m21am12aExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}im&in\\\\jm&jn\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12am21a")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}m&n\\end{bmatrix}\\begin{bmatrix}i\\\\j\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m12am21aExp")]
                    .stateValues.latex,
            ),
        ).eq("\\begin{bmatrix}im+jn\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("longmult")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\begin{bmatrix}i\\\\j\\end{bmatrix}\\begin{bmatrix}m&n\\end{bmatrix}\\begin{bmatrix}e&f\\\\g&h\\end{bmatrix}\\begin{bmatrix}k\\\\l\\end{bmatrix}\\begin{bmatrix}o&p\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("longmultExp")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}aeikmo+afilmo+agikno+ahilno+bejkmo+bfjlmo+bgjkno+bhjlno&aeikmp+afilmp+agiknp+ahilnp+bejkmp+bfjlmp+bgjknp+bhjlnp\\\\ceikmo+cfilmo+cgikno+chilno+dejkmo+dfjlmo+dgjkno+dhjlno&ceikmp+cfilmp+cgiknp+chilnp+dejkmp+dfjlmp+dgjknp+dhjlnp\\end{bmatrix}",
        );
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("longMultResult")]
                    .stateValues.latex,
            ),
        ).eq(
            "\\begin{bmatrix}aeikmo+afilmo+agikno+ahilno+bejkmo+bfjlmo+bgjkno+bhjlno&aeikmp+afilmp+agiknp+ahilnp+bejkmp+bfjlmp+bgjknp+bhjlnp\\\\ceikmo+cfilmo+cgikno+chilno+dejkmo+dfjlmo+dgjkno+dhjlno&ceikmp+cfilmp+cgiknp+chilnp+dejkmp+dfjlmp+dgjknp+dhjlnp\\end{bmatrix}",
        );
    });

    it("matrix-vector multiplication", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p>matrix22: <math name="matrix22" format="latex">\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}</math></p>
          <p>tuple2: <math name="tuple2">(e,f)</math></p>
          <p>vector2: <math createVectors name="vector2">(g,h)</math></p>
          <p>alt vector2: <math name="altvector2">⟨p,q⟩</math></p>
          <p><math name="m22t2">$matrix22$tuple2</math></p>
          <p><math name="m22t2Exp" expand>$matrix22$tuple2</math></p>
          <p><math name="t2m22">$tuple2$matrix22</math></p>
          <p><math name="t2m22Exp" expand>$tuple2$matrix22</math></p>
          <p><math name="m22v2">$matrix22$vector2</math></p>
          <p><math name="m22v2Exp" expand>$matrix22$vector2</math></p>
          <p><math name="v2m22">$vector2$matrix22</math></p>
          <p><math name="v2m22Exp" expand>$vector2$matrix22</math></p>
          <p><math name="m22a2">$matrix22$altvector2</math></p>
          <p><math name="m22a2Exp" expand>$matrix22$altvector2</math></p>
          <p><math name="a2m22">$altvector2$matrix22</math></p>
          <p><math name="a2m22Exp" expand>$altvector2$matrix22</math></p>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22t2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}(e,f)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22t2Exp")]
                    .stateValues.latex,
            ),
        ).eq("(ae+bf,ce+df)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2m22")].stateValues
                    .latex,
            ),
        ).eq("(e,f)\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2m22Exp")]
                    .stateValues.latex,
            ),
        ).eq("(e,f)\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22v2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}(g,h)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22v2Exp")]
                    .stateValues.latex,
            ),
        ).eq("(ag+bh,cg+dh)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2m22")].stateValues
                    .latex,
            ),
        ).eq("(g,h)\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2m22Exp")]
                    .stateValues.latex,
            ),
        ).eq("(g,h)\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22a2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\langlep,q\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m22a2Exp")]
                    .stateValues.latex,
            ),
        ).eq("\\langleap+bq,cp+dq\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2m22")].stateValues
                    .latex,
            ),
        ).eq("\\langlep,q\\rangle\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("a2m22Exp")]
                    .stateValues.latex,
            ),
        ).eq("\\langlep,q\\rangle\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}");
    });

    it("matrix and vector state variables", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p><text>a</text></p>
          <p>Originals: <math format="latex" name="v1">
            \\begin{pmatrix}
              1 \\\\ 2
            \\end{pmatrix}
          </math>
          <math format="latex" name="v2">
            \\begin{pmatrix}
              1 & 2
            \\end{pmatrix}
          </math>
          <math name="v3">(1,2)</math>
          <math name="v4">(1,2)'</math>
          <math name="v5">(1,2)^T</math>
          <math name="v6">1,2</math>
          <math name="v7" createVectors>(1,2)</math>
          <math name="v8" createVectors>(1,2)'</math>
          <math name="v9" createVectors>(1,2)^T</math>
          <math name="v10">⟨1,2⟩</math>
          <math name="v11">⟨1,2⟩'</math>
          <math name="v12">⟨1,2⟩^T</math>
          </p>
          <p>N dimensions:
            <integer extend="$v1.numDimensions" name="v1nd" />
            <integer extend="$v2.numDimensions" name="v2nd" />
            <integer extend="$v3.numDimensions" name="v3nd" />
            <integer extend="$v4.numDimensions" name="v4nd" />
            <integer extend="$v5.numDimensions" name="v5nd" />
            <integer extend="$v6.numDimensions" name="v6nd" />
            <integer extend="$v7.numDimensions" name="v7nd" />
            <integer extend="$v8.numDimensions" name="v8nd" />
            <integer extend="$v9.numDimensions" name="v9nd" />
            <integer extend="$v10.numDimensions" name="v10nd" />
            <integer extend="$v11.numDimensions" name="v11nd" />
            <integer extend="$v12.numDimensions" name="v12nd" />
          </p>
          <p>Vectors:
            <vector extend="$v1.vector" name="v1v" />
            <vector extend="$v2.vector" name="v2v" />
            <vector extend="$v3.vector" name="v3v" />
            <vector extend="$v4.vector" name="v4v" />
            <vector extend="$v5.vector" name="v5v" />
            <vector extend="$v6.vector" name="v6v" />
            <vector extend="$v7.vector" name="v7v" />
            <vector extend="$v8.vector" name="v8v" />
            <vector extend="$v9.vector" name="v9v" />
            <vector extend="$v10.vector" name="v10v" />
            <vector extend="$v11.vector" name="v11v" />
            <vector extend="$v12.vector" name="v12v" />
          </p>
          <p>Vectors as math:
            <math extend="$v1.vector" name="v1vm" />
            <math extend="$v2.vector" name="v2vm" />
            <math extend="$v3.vector" name="v3vm" />
            <math extend="$v4.vector" name="v4vm" />
            <math extend="$v5.vector" name="v5vm" />
            <math extend="$v6.vector" name="v6vm" />
            <math extend="$v7.vector" name="v7vm" />
            <math extend="$v8.vector" name="v8vm" />
            <math extend="$v9.vector" name="v9vm" />
            <math extend="$v10.vector" name="v10vm" />
            <math extend="$v11.vector" name="v11vm" />
            <math extend="$v12.vector" name="v12vm" />
          </p>
          <p>Vector x components:
            <math extend="$v1.x" name="v1x" />
            <math extend="$v2.x" name="v2x" />
            <math extend="$v3.x" name="v3x" />
            <math extend="$v4.x" name="v4x" />
            <math extend="$v5.x" name="v5x" />
            <math extend="$v6.x" name="v6x" />
            <math extend="$v7.x" name="v7x" />
            <math extend="$v8.x" name="v8x" />
            <math extend="$v9.x" name="v9x" />
            <math extend="$v10.x" name="v10x" />
            <math extend="$v11.x" name="v11x" />
            <math extend="$v12.x" name="v12x" />
          </p>
          <p>Vector y components:
            <math extend="$v1.y" name="v1y" />
            <math extend="$v2.y" name="v2y" />
            <math extend="$v3.y" name="v3y" />
            <math extend="$v4.y" name="v4y" />
            <math extend="$v5.y" name="v5y" />
            <math extend="$v6.y" name="v6y" />
            <math extend="$v7.y" name="v7y" />
            <math extend="$v8.y" name="v8y" />
            <math extend="$v9.y" name="v9y" />
            <math extend="$v10.y" name="v10y" />
            <math extend="$v11.y" name="v11y" />
            <math extend="$v12.y" name="v12y" />
          </p>
          <p>Vector x components b:
            <math extend="$v1.vector[1]" name="v1xb" />
            <math extend="$v2.vector[1]" name="v2xb" />
            <math extend="$v3.vector[1]" name="v3xb" />
            <math extend="$v4.vector[1]" name="v4xb" />
            <math extend="$v5.vector[1]" name="v5xb" />
            <math extend="$v6.vector[1]" name="v6xb" />
            <math extend="$v7.vector[1]" name="v7xb" />
            <math extend="$v8.vector[1]" name="v8xb" />
            <math extend="$v9.vector[1]" name="v9xb" />
            <math extend="$v10.vector[1]" name="v10xb" />
            <math extend="$v11.vector[1]" name="v11xb" />
            <math extend="$v12.vector[1]" name="v12xb" />
          </p>
          <p>Vector y components b:
            <math extend="$v1.vector[2]" name="v1yb" />
            <math extend="$v2.vector[2]" name="v2yb" />
            <math extend="$v3.vector[2]" name="v3yb" />
            <math extend="$v4.vector[2]" name="v4yb" />
            <math extend="$v5.vector[2]" name="v5yb" />
            <math extend="$v6.vector[2]" name="v6yb" />
            <math extend="$v7.vector[2]" name="v7yb" />
            <math extend="$v8.vector[2]" name="v8yb" />
            <math extend="$v9.vector[2]" name="v9yb" />
            <math extend="$v10.vector[2]" name="v10yb" />
            <math extend="$v11.vector[2]" name="v11yb" />
            <math extend="$v12.vector[2]" name="v12yb" />
          </p>
          <p>Matrix size:
            <numberList extend="$v1.matrixSize" name="v1ms" />
            <numberList extend="$v2.matrixSize" name="v2ms" />
            <numberList extend="$v3.matrixSize" name="v3ms" />
            <numberList extend="$v4.matrixSize" name="v4ms" />
            <numberList extend="$v5.matrixSize" name="v5ms" />
            <numberList extend="$v6.matrixSize" name="v6ms" />
            <numberList extend="$v7.matrixSize" name="v7ms" />
            <numberList extend="$v8.matrixSize" name="v8ms" />
            <numberList extend="$v9.matrixSize" name="v9ms" />
            <numberList extend="$v10.matrixSize" name="v10ms" />
            <numberList extend="$v11.matrixSize" name="v11ms" />
            <numberList extend="$v12.matrixSize" name="v12ms" />
          </p>
          <p>N rows:
            <integer extend="$v1.numRows" name="v1nr" />
            <integer extend="$v2.numRows" name="v2nr" />
            <integer extend="$v3.numRows" name="v3nr" />
            <integer extend="$v4.numRows" name="v4nr" />
            <integer extend="$v5.numRows" name="v5nr" />
            <integer extend="$v6.numRows" name="v6nr" />
            <integer extend="$v7.numRows" name="v7nr" />
            <integer extend="$v8.numRows" name="v8nr" />
            <integer extend="$v9.numRows" name="v9nr" />
            <integer extend="$v10.numRows" name="v10nr" />
            <integer extend="$v11.numRows" name="v11nr" />
            <integer extend="$v12.numRows" name="v12nr" />
          </p>
          <p>N columns:
            <integer extend="$v1.numColumns" name="v1nc" />
            <integer extend="$v2.numColumns" name="v2nc" />
            <integer extend="$v3.numColumns" name="v3nc" />
            <integer extend="$v4.numColumns" name="v4nc" />
            <integer extend="$v5.numColumns" name="v5nc" />
            <integer extend="$v6.numColumns" name="v6nc" />
            <integer extend="$v7.numColumns" name="v7nc" />
            <integer extend="$v8.numColumns" name="v8nc" />
            <integer extend="$v9.numColumns" name="v9nc" />
            <integer extend="$v10.numColumns" name="v10nc" />
            <integer extend="$v11.numColumns" name="v11nc" />
            <integer extend="$v12.numColumns" name="v12nc" />
          </p>
          <p>Matrices:
            <matrix extend="$v1.matrix" name="v1m" />
            <matrix extend="$v2.matrix" name="v2m" />
            <matrix extend="$v3.matrix" name="v3m" />
            <matrix extend="$v4.matrix" name="v4m" />
            <matrix extend="$v5.matrix" name="v5m" />
            <matrix extend="$v6.matrix" name="v6m" />
            <matrix extend="$v7.matrix" name="v7m" />
            <matrix extend="$v8.matrix" name="v8m" />
            <matrix extend="$v9.matrix" name="v9m" />
            <matrix extend="$v10.matrix" name="v10m" />
            <matrix extend="$v11.matrix" name="v11m" />
            <matrix extend="$v12.matrix" name="v12m" />
          </p>
          <p>Matrices as math:
            <math extend="$v1.matrix" name="v1mm" />
            <math extend="$v2.matrix" name="v2mm" />
            <math extend="$v3.matrix" name="v3mm" />
            <math extend="$v4.matrix" name="v4mm" />
            <math extend="$v5.matrix" name="v5mm" />
            <math extend="$v6.matrix" name="v6mm" />
            <math extend="$v7.matrix" name="v7mm" />
            <math extend="$v8.matrix" name="v8mm" />
            <math extend="$v9.matrix" name="v9mm" />
            <math extend="$v10.matrix" name="v10mm" />
            <math extend="$v11.matrix" name="v11mm" />
            <math extend="$v12.matrix" name="v12mm" />
          </p>
          <p>Row 1:
            <matrix extend="$v1.matrix[1]" name="v1r1" />
            <matrix extend="$v2.matrix[1]" name="v2r1" />
            <matrix extend="$v3.matrix[1]" name="v3r1" />
            <matrix extend="$v4.matrix[1]" name="v4r1" />
            <matrix extend="$v5.matrix[1]" name="v5r1" />
            <matrix extend="$v6.matrix[1]" name="v6r1" />
            <matrix extend="$v7.matrix[1]" name="v7r1" />
            <matrix extend="$v8.matrix[1]" name="v8r1" />
            <matrix extend="$v9.matrix[1]" name="v9r1" />
            <matrix extend="$v10.matrix[1]" name="v10r1" />
            <matrix extend="$v11.matrix[1]" name="v11r1" />
            <matrix extend="$v12.matrix[1]" name="v12r1" />
          </p>
          <p>Row 1 b:
            <matrix extend="$v1.row1" name="v1r1b" />
            <matrix extend="$v2.row1" name="v2r1b" />
            <matrix extend="$v3.row1" name="v3r1b" />
            <matrix extend="$v4.row1" name="v4r1b" />
            <matrix extend="$v5.row1" name="v5r1b" />
            <matrix extend="$v6.row1" name="v6r1b" />
            <matrix extend="$v7.row1" name="v7r1b" />
            <matrix extend="$v8.row1" name="v8r1b" />
            <matrix extend="$v9.row1" name="v9r1b" />
            <matrix extend="$v10.row1" name="v10r1b" />
            <matrix extend="$v11.row1" name="v11r1b" />
            <matrix extend="$v12.row1" name="v12r1b" />
          </p>
          <p>Row 1 c:
            <matrix extend="$v1.rows[1]" name="v1r1c" />
            <matrix extend="$v2.rows[1]" name="v2r1c" />
            <matrix extend="$v3.rows[1]" name="v3r1c" />
            <matrix extend="$v4.rows[1]" name="v4r1c" />
            <matrix extend="$v5.rows[1]" name="v5r1c" />
            <matrix extend="$v6.rows[1]" name="v6r1c" />
            <matrix extend="$v7.rows[1]" name="v7r1c" />
            <matrix extend="$v8.rows[1]" name="v8r1c" />
            <matrix extend="$v9.rows[1]" name="v9r1c" />
            <matrix extend="$v10.rows[1]" name="v10r1c" />
            <matrix extend="$v11.rows[1]" name="v11r1c" />
            <matrix extend="$v12.rows[1]" name="v12r1c" />
          </p>
          <p>Row 2:
            <matrix extend="$v1.matrix[2]" name="v1r2" />
            <matrix extend="$v2.matrix[2]" name="v2r2" />
            <matrix extend="$v3.matrix[2]" name="v3r2" />
            <matrix extend="$v4.matrix[2]" name="v4r2" />
            <matrix extend="$v5.matrix[2]" name="v5r2" />
            <matrix extend="$v6.matrix[2]" name="v6r2" />
            <matrix extend="$v7.matrix[2]" name="v7r2" />
            <matrix extend="$v8.matrix[2]" name="v8r2" />
            <matrix extend="$v9.matrix[2]" name="v9r2" />
            <matrix extend="$v10.matrix[2]" name="v10r2" />
            <matrix extend="$v11.matrix[2]" name="v11r2" />
            <matrix extend="$v12.matrix[2]" name="v12r2" />
          </p>
          <p>Row 2 b:
            <matrix extend="$v1.row2" name="v1r2b" />
            <matrix extend="$v2.row2" name="v2r2b" />
            <matrix extend="$v3.row2" name="v3r2b" />
            <matrix extend="$v4.row2" name="v4r2b" />
            <matrix extend="$v5.row2" name="v5r2b" />
            <matrix extend="$v6.row2" name="v6r2b" />
            <matrix extend="$v7.row2" name="v7r2b" />
            <matrix extend="$v8.row2" name="v8r2b" />
            <matrix extend="$v9.row2" name="v9r2b" />
            <matrix extend="$v10.row2" name="v10r2b" />
            <matrix extend="$v11.row2" name="v11r2b" />
            <matrix extend="$v12.row2" name="v12r2b" />
          </p>
          <p>Row 2 c:
            <matrix extend="$v1.rows[2]" name="v1r2c" />
            <matrix extend="$v2.rows[2]" name="v2r2c" />
            <matrix extend="$v3.rows[2]" name="v3r2c" />
            <matrix extend="$v4.rows[2]" name="v4r2c" />
            <matrix extend="$v5.rows[2]" name="v5r2c" />
            <matrix extend="$v6.rows[2]" name="v6r2c" />
            <matrix extend="$v7.rows[2]" name="v7r2c" />
            <matrix extend="$v8.rows[2]" name="v8r2c" />
            <matrix extend="$v9.rows[2]" name="v9r2c" />
            <matrix extend="$v10.rows[2]" name="v10r2c" />
            <matrix extend="$v11.rows[2]" name="v11r2c" />
            <matrix extend="$v12.rows[2]" name="v12r2c" />
          </p>
          <p>Column 1:
            <matrix extend="$v1.columns[1]" name="v1c1" />
            <matrix extend="$v2.columns[1]" name="v2c1" />
            <matrix extend="$v3.columns[1]" name="v3c1" />
            <matrix extend="$v4.columns[1]" name="v4c1" />
            <matrix extend="$v5.columns[1]" name="v5c1" />
            <matrix extend="$v6.columns[1]" name="v6c1" />
            <matrix extend="$v7.columns[1]" name="v7c1" />
            <matrix extend="$v8.columns[1]" name="v8c1" />
            <matrix extend="$v9.columns[1]" name="v9c1" />
            <matrix extend="$v10.columns[1]" name="v10c1" />
            <matrix extend="$v11.columns[1]" name="v11c1" />
            <matrix extend="$v12.columns[1]" name="v12c1" />
          </p>
          <p>Column 1 b:
            <matrix extend="$v1.column1" name="v1c1b" />
            <matrix extend="$v2.column1" name="v2c1b" />
            <matrix extend="$v3.column1" name="v3c1b" />
            <matrix extend="$v4.column1" name="v4c1b" />
            <matrix extend="$v5.column1" name="v5c1b" />
            <matrix extend="$v6.column1" name="v6c1b" />
            <matrix extend="$v7.column1" name="v7c1b" />
            <matrix extend="$v8.column1" name="v8c1b" />
            <matrix extend="$v9.column1" name="v9c1b" />
            <matrix extend="$v10.column1" name="v10c1b" />
            <matrix extend="$v11.column1" name="v11c1b" />
            <matrix extend="$v12.column1" name="v12c1b" />
          </p>
          <p>Column 2:
            <matrix extend="$v1.columns[2]" name="v1c2" />
            <matrix extend="$v2.columns[2]" name="v2c2" />
            <matrix extend="$v3.columns[2]" name="v3c2" />
            <matrix extend="$v4.columns[2]" name="v4c2" />
            <matrix extend="$v5.columns[2]" name="v5c2" />
            <matrix extend="$v6.columns[2]" name="v6c2" />
            <matrix extend="$v7.columns[2]" name="v7c2" />
            <matrix extend="$v8.columns[2]" name="v8c2" />
            <matrix extend="$v9.columns[2]" name="v9c2" />
            <matrix extend="$v10.columns[2]" name="v10c2" />
            <matrix extend="$v11.columns[2]" name="v11c2" />
            <matrix extend="$v12.columns[2]" name="v12c2" />
          </p>
          <p>Column 2 b:
            <matrix extend="$v1.column2" name="v1c2b" />
            <matrix extend="$v2.column2" name="v2c2b" />
            <matrix extend="$v3.column2" name="v3c2b" />
            <matrix extend="$v4.column2" name="v4c2b" />
            <matrix extend="$v5.column2" name="v5c2b" />
            <matrix extend="$v6.column2" name="v6c2b" />
            <matrix extend="$v7.column2" name="v7c2b" />
            <matrix extend="$v8.column2" name="v8c2b" />
            <matrix extend="$v9.column2" name="v9c2b" />
            <matrix extend="$v10.column2" name="v10c2b" />
            <matrix extend="$v11.column2" name="v11c2b" />
            <matrix extend="$v12.column2" name="v12c2b" />
          </p>
        
          <p>Matrix entry 12:
            <math extend="$v1.matrix[1][2]" name="v1me12" />
            <math extend="$v2.matrix[1][2]" name="v2me12" />
            <math extend="$v3.matrix[1][2]" name="v3me12" />
            <math extend="$v4.matrix[1][2]" name="v4me12" />
            <math extend="$v5.matrix[1][2]" name="v5me12" />
            <math extend="$v6.matrix[1][2]" name="v6me12" />
            <math extend="$v7.matrix[1][2]" name="v7me12" />
            <math extend="$v8.matrix[1][2]" name="v8me12" />
            <math extend="$v9.matrix[1][2]" name="v9me12" />
            <math extend="$v10.matrix[1][2]" name="v10me12" />
            <math extend="$v11.matrix[1][2]" name="v11me12" />
            <math extend="$v12.matrix[1][2]" name="v12me12" />
          </p>
          <p>Matrix entry 12 b:
            <math extend="$v1.rows[1][2]" name="v1me12b" />
            <math extend="$v2.rows[1][2]" name="v2me12b" />
            <math extend="$v3.rows[1][2]" name="v3me12b" />
            <math extend="$v4.rows[1][2]" name="v4me12b" />
            <math extend="$v5.rows[1][2]" name="v5me12b" />
            <math extend="$v6.rows[1][2]" name="v6me12b" />
            <math extend="$v7.rows[1][2]" name="v7me12b" />
            <math extend="$v8.rows[1][2]" name="v8me12b" />
            <math extend="$v9.rows[1][2]" name="v9me12b" />
            <math extend="$v10.rows[1][2]" name="v10me12b" />
            <math extend="$v11.rows[1][2]" name="v11me12b" />
            <math extend="$v12.rows[1][2]" name="v12me12b" />
          </p>
          <p>Matrix entry 12 c:
            <math extend="$v1.columns[2][1]" name="v1me12c" />
            <math extend="$v2.columns[2][1]" name="v2me12c" />
            <math extend="$v3.columns[2][1]" name="v3me12c" />
            <math extend="$v4.columns[2][1]" name="v4me12c" />
            <math extend="$v5.columns[2][1]" name="v5me12c" />
            <math extend="$v6.columns[2][1]" name="v6me12c" />
            <math extend="$v7.columns[2][1]" name="v7me12c" />
            <math extend="$v8.columns[2][1]" name="v8me12c" />
            <math extend="$v9.columns[2][1]" name="v9me12c" />
            <math extend="$v10.columns[2][1]" name="v10me12c" />
            <math extend="$v11.columns[2][1]" name="v11me12c" />
            <math extend="$v12.columns[2][1]" name="v12me12c" />
          </p>
          <p>Matrix entry 12 d:
            <math extend="$v1.row1[2]" name="v1me12d" />
            <math extend="$v2.row1[2]" name="v2me12d" />
            <math extend="$v3.row1[2]" name="v3me12d" />
            <math extend="$v4.row1[2]" name="v4me12d" />
            <math extend="$v5.row1[2]" name="v5me12d" />
            <math extend="$v6.row1[2]" name="v6me12d" />
            <math extend="$v7.row1[2]" name="v7me12d" />
            <math extend="$v8.row1[2]" name="v8me12d" />
            <math extend="$v9.row1[2]" name="v9me12d" />
            <math extend="$v10.row1[2]" name="v10me12d" />
            <math extend="$v11.row1[2]" name="v11me12d" />
            <math extend="$v12.row1[2]" name="v12me12d" />
          </p>
          <p>Matrix entry 12 e:
            <math extend="$v1.column2[1]" name="v1me12e" />
            <math extend="$v2.column2[1]" name="v2me12e" />
            <math extend="$v3.column2[1]" name="v3me12e" />
            <math extend="$v4.column2[1]" name="v4me12e" />
            <math extend="$v5.column2[1]" name="v5me12e" />
            <math extend="$v6.column2[1]" name="v6me12e" />
            <math extend="$v7.column2[1]" name="v7me12e" />
            <math extend="$v8.column2[1]" name="v8me12e" />
            <math extend="$v9.column2[1]" name="v9me12e" />
            <math extend="$v10.column2[1]" name="v10me12e" />
            <math extend="$v11.column2[1]" name="v11me12e" />
            <math extend="$v12.column2[1]" name="v12me12e" />
          </p>
          <p>Matrix entry 12 f:
            <math extend="$v1.matrixEntry1_2" name="v1me12f" />
            <math extend="$v2.matrixEntry1_2" name="v2me12f" />
            <math extend="$v3.matrixEntry1_2" name="v3me12f" />
            <math extend="$v4.matrixEntry1_2" name="v4me12f" />
            <math extend="$v5.matrixEntry1_2" name="v5me12f" />
            <math extend="$v6.matrixEntry1_2" name="v6me12f" />
            <math extend="$v7.matrixEntry1_2" name="v7me12f" />
            <math extend="$v8.matrixEntry1_2" name="v8me12f" />
            <math extend="$v9.matrixEntry1_2" name="v9me12f" />
            <math extend="$v10.matrixEntry1_2" name="v10me12f" />
            <math extend="$v11.matrixEntry1_2" name="v11me12f" />
            <math extend="$v12.matrixEntry1_2" name="v12me12f" />
          </p>
          <p>Matrix entry 21:
            <math extend="$v1.matrix[2][1]" name="v1me21" />
            <math extend="$v2.matrix[2][1]" name="v2me21" />
            <math extend="$v3.matrix[2][1]" name="v3me21" />
            <math extend="$v4.matrix[2][1]" name="v4me21" />
            <math extend="$v5.matrix[2][1]" name="v5me21" />
            <math extend="$v6.matrix[2][1]" name="v6me21" />
            <math extend="$v7.matrix[2][1]" name="v7me21" />
            <math extend="$v8.matrix[2][1]" name="v8me21" />
            <math extend="$v9.matrix[2][1]" name="v9me21" />
            <math extend="$v10.matrix[2][1]" name="v10me21" />
            <math extend="$v11.matrix[2][1]" name="v11me21" />
            <math extend="$v12.matrix[2][1]" name="v12me21" />
          </p>
          <p>Matrix entry 21 b:
            <math extend="$v1.rows[2][1]" name="v1me21b" />
            <math extend="$v2.rows[2][1]" name="v2me21b" />
            <math extend="$v3.rows[2][1]" name="v3me21b" />
            <math extend="$v4.rows[2][1]" name="v4me21b" />
            <math extend="$v5.rows[2][1]" name="v5me21b" />
            <math extend="$v6.rows[2][1]" name="v6me21b" />
            <math extend="$v7.rows[2][1]" name="v7me21b" />
            <math extend="$v8.rows[2][1]" name="v8me21b" />
            <math extend="$v9.rows[2][1]" name="v9me21b" />
            <math extend="$v10.rows[2][1]" name="v10me21b" />
            <math extend="$v11.rows[2][1]" name="v11me21b" />
            <math extend="$v12.rows[2][1]" name="v12me21b" />
          </p>
          <p>Matrix entry 21 c:
            <math extend="$v1.columns[1][2]" name="v1me21c" />
            <math extend="$v2.columns[1][2]" name="v2me21c" />
            <math extend="$v3.columns[1][2]" name="v3me21c" />
            <math extend="$v4.columns[1][2]" name="v4me21c" />
            <math extend="$v5.columns[1][2]" name="v5me21c" />
            <math extend="$v6.columns[1][2]" name="v6me21c" />
            <math extend="$v7.columns[1][2]" name="v7me21c" />
            <math extend="$v8.columns[1][2]" name="v8me21c" />
            <math extend="$v9.columns[1][2]" name="v9me21c" />
            <math extend="$v10.columns[1][2]" name="v10me21c" />
            <math extend="$v11.columns[1][2]" name="v11me21c" />
            <math extend="$v12.columns[1][2]" name="v12me21c" />
          </p>
          <p>Matrix entry 21 d:
            <math extend="$v1.row2[1]" name="v1me21d" />
            <math extend="$v2.row2[1]" name="v2me21d" />
            <math extend="$v3.row2[1]" name="v3me21d" />
            <math extend="$v4.row2[1]" name="v4me21d" />
            <math extend="$v5.row2[1]" name="v5me21d" />
            <math extend="$v6.row2[1]" name="v6me21d" />
            <math extend="$v7.row2[1]" name="v7me21d" />
            <math extend="$v8.row2[1]" name="v8me21d" />
            <math extend="$v9.row2[1]" name="v9me21d" />
            <math extend="$v10.row2[1]" name="v10me21d" />
            <math extend="$v11.row2[1]" name="v11me21d" />
            <math extend="$v12.row2[1]" name="v12me21d" />
          </p>
          <p>Matrix entry 21 e:
            <math extend="$v1.column1[2]" name="v1me21e" />
            <math extend="$v2.column1[2]" name="v2me21e" />
            <math extend="$v3.column1[2]" name="v3me21e" />
            <math extend="$v4.column1[2]" name="v4me21e" />
            <math extend="$v5.column1[2]" name="v5me21e" />
            <math extend="$v6.column1[2]" name="v6me21e" />
            <math extend="$v7.column1[2]" name="v7me21e" />
            <math extend="$v8.column1[2]" name="v8me21e" />
            <math extend="$v9.column1[2]" name="v9me21e" />
            <math extend="$v10.column1[2]" name="v10me21e" />
            <math extend="$v11.column1[2]" name="v11me21e" />
            <math extend="$v12.column1[2]" name="v12me21e" />
          </p>
          <p>Matrix entry 21 f:
            <math extend="$v1.matrixEntry2_1" name="v1me21f" />
            <math extend="$v2.matrixEntry2_1" name="v2me21f" />
            <math extend="$v3.matrixEntry2_1" name="v3me21f" />
            <math extend="$v4.matrixEntry2_1" name="v4me21f" />
            <math extend="$v5.matrixEntry2_1" name="v5me21f" />
            <math extend="$v6.matrixEntry2_1" name="v6me21f" />
            <math extend="$v7.matrixEntry2_1" name="v7me21f" />
            <math extend="$v8.matrixEntry2_1" name="v8me21f" />
            <math extend="$v9.matrixEntry2_1" name="v9me21f" />
            <math extend="$v10.matrixEntry2_1" name="v10me21f" />
            <math extend="$v11.matrixEntry2_1" name="v11me21f" />
            <math extend="$v12.matrixEntry2_1" name="v12me21f" />
          </p>
        
          <p>Graph vectors</p>
          <graph>
            <vector extend="$v1.vector" name="v1vb" />
            <vector extend="$v2.vector" name="v2vb" />
            <vector extend="$v3.vector" name="v3vb" />
            <vector extend="$v4.vector" name="v4vb" />
            <vector extend="$v5.vector" name="v5vb" />
            <vector extend="$v6.vector" name="v6vb" />
            <vector extend="$v7.vector" name="v7vb" />
            <vector extend="$v8.vector" name="v8vb" />
            <vector extend="$v9.vector" name="v9vb" />
            <vector extend="$v10.vector" name="v10vb" />
            <vector extend="$v11.vector" name="v11vb" />
            <vector extend="$v12.vector" name="v12vb" />
          </graph>
        
          <p>Change matrices</p>
          <p><matrixInput name="mi1" showSizeControls="false" bindValueTo="$v1.matrix" /></p>
          <p><matrixInput name="mi2" showSizeControls="false" bindValueTo="$v2.matrix" /></p>
          <p><matrixInput name="mi3" showSizeControls="false" bindValueTo="$v3.matrix" /></p>
          <p><matrixInput name="mi4" showSizeControls="false" bindValueTo="$v4.matrix" /></p>
          <p><matrixInput name="mi5" showSizeControls="false" bindValueTo="$v5.matrix" /></p>
          <p><matrixInput name="mi6" showSizeControls="false" bindValueTo="$v6.matrix" /></p>
          <p><matrixInput name="mi7" showSizeControls="false" bindValueTo="$v7.matrix" /></p>
          <p><matrixInput name="mi8" showSizeControls="false" bindValueTo="$v8.matrix" /></p>
          <p><matrixInput name="mi9" showSizeControls="false" bindValueTo="$v9.matrix" /></p>
          <p><matrixInput name="mi10" showSizeControls="false" bindValueTo="$v10.matrix" /></p>
          <p><matrixInput name="mi11" showSizeControls="false" bindValueTo="$v11.matrix" /></p>
          <p><matrixInput name="mi12" showSizeControls="false" bindValueTo="$v12.matrix" /></p>
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4")].stateValues
                    .latex,
            ),
        ).eq("(1,2)'");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5")].stateValues
                    .latex,
            ),
        ).eq("(1,2)^{T}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6")].stateValues
                    .latex,
            ),
        ).eq("1,2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8")].stateValues
                    .latex,
            ),
        ).eq("(1,2)'");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9")].stateValues
                    .latex,
            ),
        ).eq("(1,2)^{T}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10")].stateValues
                    .latex,
            ),
        ).eq("\\langle1,2\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11")].stateValues
                    .latex,
            ),
        ).eq("\\langle1,2\\rangle'");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12")].stateValues
                    .latex,
            ),
        ).eq("\\langle1,2\\rangle^{T}");

        expect(
            stateVariables[await resolvePathToNodeIdx("v1nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v2nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v3nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v4nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v5nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v6nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v7nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v8nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v9nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v10nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v11nd")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v12nd")].stateValues
                .value,
        ).eq(2);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12v")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12vm")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11x")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12x")].stateValues
                    .latex,
            ),
        ).eq("1");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11xb")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12xb")].stateValues
                    .latex,
            ),
        ).eq("1");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11y")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12y")].stateValues
                    .latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11yb")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12yb")].stateValues
                    .latex,
            ),
        ).eq("2");

        expect(
            stateVariables[await resolvePathToNodeIdx("v1ms")].stateValues
                .numbers,
        ).eqls([2, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v2ms")].stateValues
                .numbers,
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v3ms")].stateValues
                .numbers,
        ).eqls([2, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v4ms")].stateValues
                .numbers,
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v5ms")].stateValues
                .numbers,
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v6ms")].stateValues
                .numbers,
        ).eqls([2, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v7ms")].stateValues
                .numbers,
        ).eqls([2, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v8ms")].stateValues
                .numbers,
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v9ms")].stateValues
                .numbers,
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v10ms")].stateValues
                .numbers,
        ).eqls([2, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v11ms")].stateValues
                .numbers,
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("v12ms")].stateValues
                .numbers,
        ).eqls([1, 2]);

        expect(
            stateVariables[await resolvePathToNodeIdx("v1nr")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v2nr")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v3nr")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v4nr")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v5nr")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v6nr")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v7nr")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v8nr")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v9nr")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v10nr")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v11nr")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v12nr")].stateValues
                .value,
        ).eq(1);

        expect(
            stateVariables[await resolvePathToNodeIdx("v1nc")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v2nc")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v3nc")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v4nc")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v5nc")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v6nc")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v7nc")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v8nc")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v9nc")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v10nc")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("v11nc")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("v12nc")].stateValues
                .value,
        ).eq(2);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me12")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me12")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me12")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me12")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me12")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me12")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me12")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me12")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me12")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me12")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me12")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me12")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me12b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me12b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me12b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me12b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me12b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me12b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me12b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me12b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me12b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me12b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me12b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me12b")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me12c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me12c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me12c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me12c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me12c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me12c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me12c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me12c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me12c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me12c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me12c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me12c")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me12d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me12d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me12d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me12d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me12d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me12d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me12d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me12d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me12d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me12d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me12d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me12d")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me12e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me12e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me12e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me12e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me12e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me12e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me12e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me12e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me12e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me12e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me12e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me12e")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me12f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me12f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me12f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me12f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me12f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me12f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me12f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me12f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me12f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me12f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me12f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me12f")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me21")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me21")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me21")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me21")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me21")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me21")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me21")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me21")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me21")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me21")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me21")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me21")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me21b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me21b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me21b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me21b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me21b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me21b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me21b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me21b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me21b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me21b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me21b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me21b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me21c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me21c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me21c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me21c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me21c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me21c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me21c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me21c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me21c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me21c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me21c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me21c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me21d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me21d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me21d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me21d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me21d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me21d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me21d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me21d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me21d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me21d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me21d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me21d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me21e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me21e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me21e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me21e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me21e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me21e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me21e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me21e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me21e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me21e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me21e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me21e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1me21f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2me21f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3me21f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4me21f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5me21f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6me21f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7me21f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8me21f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9me21f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10me21f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11me21f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12me21f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        // move vectors

        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v1vb"),
            headcoords: [2, 1],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v2vb"),
            headcoords: [2, 2],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v3vb"),
            headcoords: [2, 3],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v4vb"),
            headcoords: [2, 4],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v5vb"),
            headcoords: [2, 5],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v6vb"),
            headcoords: [2, 6],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v7vb"),
            headcoords: [2, 7],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v8vb"),
            headcoords: [2, 8],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v9vb"),
            headcoords: [2, 9],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v10vb"),
            headcoords: [2, 10],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v11vb"),
            headcoords: [2, 11],
            core,
        });
        await moveVector({
            componentIdx: await resolvePathToNodeIdx("v12vb"),
            headcoords: [2, 12],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\\\1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3")].stateValues
                    .latex,
            ),
        ).eq("(2,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4")].stateValues
                    .latex,
            ),
        ).eq("(2,4)'");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5")].stateValues
                    .latex,
            ),
        ).eq("(2,5)^{T}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6")].stateValues
                    .latex,
            ),
        ).eq("2,6");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7")].stateValues
                    .latex,
            ),
        ).eq("(2,7)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8")].stateValues
                    .latex,
            ),
        ).eq("(2,8)'");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9")].stateValues
                    .latex,
            ),
        ).eq("(2,9)^{T}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10")].stateValues
                    .latex,
            ),
        ).eq("\\langle2,10\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11")].stateValues
                    .latex,
            ),
        ).eq("\\langle2,11\\rangle'");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12")].stateValues
                    .latex,
            ),
        ).eq("\\langle2,12\\rangle^{T}");

        // change from matrix inputs
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            rowInd: 1,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-2",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            rowInd: 0,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-3",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            rowInd: 1,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi4"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-4",
            componentIdx: await resolvePathToNodeIdx("mi4"),
            rowInd: 0,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi5"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-5",
            componentIdx: await resolvePathToNodeIdx("mi5"),
            rowInd: 0,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi6"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-6",
            componentIdx: await resolvePathToNodeIdx("mi6"),
            rowInd: 1,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi7"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-7",
            componentIdx: await resolvePathToNodeIdx("mi7"),
            rowInd: 1,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi8"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-8",
            componentIdx: await resolvePathToNodeIdx("mi8"),
            rowInd: 0,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi9"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-9",
            componentIdx: await resolvePathToNodeIdx("mi9"),
            rowInd: 0,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi10"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-10",
            componentIdx: await resolvePathToNodeIdx("mi10"),
            rowInd: 1,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi11"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-11",
            componentIdx: await resolvePathToNodeIdx("mi11"),
            rowInd: 0,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi12"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "-12",
            componentIdx: await resolvePathToNodeIdx("mi12"),
            rowInd: 0,
            colInd: 1,
            core,
            stateVariables,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3\\\\-1\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3&-2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v3")].stateValues
                    .latex,
            ),
        ).eq("(3,-3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v4")].stateValues
                    .latex,
            ),
        ).eq("(3,-4)'");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v5")].stateValues
                    .latex,
            ),
        ).eq("(3,-5)^{T}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v6")].stateValues
                    .latex,
            ),
        ).eq("3,-6");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v7")].stateValues
                    .latex,
            ),
        ).eq("(3,-7)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v8")].stateValues
                    .latex,
            ),
        ).eq("(3,-8)'");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v9")].stateValues
                    .latex,
            ),
        ).eq("(3,-9)^{T}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v10")].stateValues
                    .latex,
            ),
        ).eq("\\langle3,-10\\rangle");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v11")].stateValues
                    .latex,
            ),
        ).eq("\\langle3,-11\\rangle'");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("v12")].stateValues
                    .latex,
            ),
        ).eq("\\langle3,-12\\rangle^{T}");
    });

    it("matrix state variables, non vector matrices", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p>Originals: <math format="latex" name="m1">
            \\begin{pmatrix}
              1 & 2\\\\
              3 & 4\\\\
              5 & 6
            \\end{pmatrix}
          </math>
          <matrix name="m2">
            <row>1 2</row>
            <row>3 4</row>
            <row>5 6</row>
          </matrix>
          <matrix name="m3">
            <column>1 3 5</column>
            <column>2 4 6</column>
          </matrix>
          </p>
          <p>Matrix size:
            <numberList extend="$m1.matrixSize" name="m1ms" />
            <numberList extend="$m2.matrixSize" name="m2ms" />
            <numberList extend="$m3.matrixSize" name="m3ms" />
          </p>
          <p>N rows:
            <integer extend="$m1.numRows" name="m1nr" />
            <integer extend="$m2.numRows" name="m2nr" />
            <integer extend="$m3.numRows" name="m3nr" />
          </p>
          <p>N columns:
            <integer extend="$m1.numColumns" name="m1nc" />
            <integer extend="$m2.numColumns" name="m2nc" />
            <integer extend="$m3.numColumns" name="m3nc" />
          </p>
          <p>Matrices:
            <matrix extend="$m1.matrix" name="m1m" />
            <matrix extend="$m2.matrix" name="m2m" />
            <matrix extend="$m3.matrix" name="m3m" />
          </p>
          <p>Matrices as math:
            <math extend="$m1.matrix" name="m1mm" />
            <math extend="$m2.matrix" name="m2mm" />
            <math extend="$m3.matrix" name="m3mm" />
          </p>
          <p>Row 1:
            <matrix extend="$m1.matrix[1]" name="m1r1" />
            <matrix extend="$m2.matrix[1]" name="m2r1" />
            <matrix extend="$m3.matrix[1]" name="m3r1" />
          </p>
          <p>Row 1 b:
            <matrix extend="$m1.row1" name="m1r1b" />
            <matrix extend="$m2.row1" name="m2r1b" />
            <matrix extend="$m3.row1" name="m3r1b" />
          </p>
          <p>Row 1 c:
            <matrix extend="$m1.rows[1]" name="m1r1c" />
            <matrix extend="$m2.rows[1]" name="m2r1c" />
            <matrix extend="$m3.rows[1]" name="m3r1c" />
          </p>
          <p>Row 2:
            <matrix extend="$m1.matrix[2]" name="m1r2" />
            <matrix extend="$m2.matrix[2]" name="m2r2" />
            <matrix extend="$m3.matrix[2]" name="m3r2" />
          </p>
          <p>Row 2 b:
            <matrix extend="$m1.row2" name="m1r2b" />
            <matrix extend="$m2.row2" name="m2r2b" />
            <matrix extend="$m3.row2" name="m3r2b" />
          </p>
          <p>Row 2 c:
            <matrix extend="$m1.rows[2]" name="m1r2c" />
            <matrix extend="$m2.rows[2]" name="m2r2c" />
            <matrix extend="$m3.rows[2]" name="m3r2c" />
          </p>
          <p>Row 3:
            <matrix extend="$m1.matrix[3]" name="m1r3" />
            <matrix extend="$m2.matrix[3]" name="m2r3" />
            <matrix extend="$m3.matrix[3]" name="m3r3" />
          </p>
          <p>Row 3 b:
            <matrix extend="$m1.row3" name="m1r3b" />
            <matrix extend="$m2.row3" name="m2r3b" />
            <matrix extend="$m3.row3" name="m3r3b" />
          </p>
          <p>Row 3 c:
            <matrix extend="$m1.rows[3]" name="m1r3c" />
            <matrix extend="$m2.rows[3]" name="m2r3c" />
            <matrix extend="$m3.rows[3]" name="m3r3c" />
          </p>
          <p>Row 4:
            <matrix extend="$m1.matrix[4]" name="m1r4" />
            <matrix extend="$m2.matrix[4]" name="m2r4" />
            <matrix extend="$m3.matrix[4]" name="m3r4" />
          </p>
          <p>Row 4 b:
            <matrix extend="$m1.row4" name="m1r4b" />
            <matrix extend="$m2.row4" name="m2r4b" />
            <matrix extend="$m3.row4" name="m3r4b" />
          </p>
          <p>Row 4 c:
            <matrix extend="$m1.rows[4]" name="m1r4c" />
            <matrix extend="$m2.rows[4]" name="m2r4c" />
            <matrix extend="$m3.rows[4]" name="m3r4c" />
          </p>
          <p>Column 1:
            <matrix extend="$m1.columns[1]" name="m1c1" />
            <matrix extend="$m2.columns[1]" name="m2c1" />
            <matrix extend="$m3.columns[1]" name="m3c1" />
          </p>
          <p>Column 1 b:
            <matrix extend="$m1.column1" name="m1c1b" />
            <matrix extend="$m2.column1" name="m2c1b" />
            <matrix extend="$m3.column1" name="m3c1b" />
          </p>
          <p>Column 2:
            <matrix extend="$m1.columns[2]" name="m1c2" />
            <matrix extend="$m2.columns[2]" name="m2c2" />
            <matrix extend="$m3.columns[2]" name="m3c2" />
          </p>
          <p>Column 2 b:
            <matrix extend="$m1.column2" name="m1c2b" />
            <matrix extend="$m2.column2" name="m2c2b" />
            <matrix extend="$m3.column2" name="m3c2b" />
          </p>
          <p>Column 3:
            <matrix extend="$m1.columns[3]" name="m1c3" />
            <matrix extend="$m2.columns[3]" name="m2c3" />
            <matrix extend="$m3.columns[3]" name="m3c3" />
          </p>
          <p>Column 3 b:
            <matrix extend="$m1.column3" name="m1c3b" />
            <matrix extend="$m2.column3" name="m2c3b" />
            <matrix extend="$m3.column3" name="m3c3b" />
          </p>
        
          <p>Matrix entry 12:
            <math extend="$m1.matrix[1][2]" name="m1me12" />
            <math extend="$m2.matrix[1][2]" name="m2me12" />
            <math extend="$m3.matrix[1][2]" name="m3me12" />
          </p>
          <p>Matrix entry 12 b:
            <math extend="$m1.rows[1][2]" name="m1me12b" />
            <math extend="$m2.rows[1][2]" name="m2me12b" />
            <math extend="$m3.rows[1][2]" name="m3me12b" />
          </p>
          <p>Matrix entry 12 c:
            <math extend="$m1.columns[2][1]" name="m1me12c" />
            <math extend="$m2.columns[2][1]" name="m2me12c" />
            <math extend="$m3.columns[2][1]" name="m3me12c" />
          </p>
          <p>Matrix entry 12 d:
            <math extend="$m1.row1[2]" name="m1me12d" />
            <math extend="$m2.row1[2]" name="m2me12d" />
            <math extend="$m3.row1[2]" name="m3me12d" />
          </p>
          <p>Matrix entry 12 e:
            <math extend="$m1.column2[1]" name="m1me12e" />
            <math extend="$m2.column2[1]" name="m2me12e" />
            <math extend="$m3.column2[1]" name="m3me12e" />
          </p>
          <p>Matrix entry 12 f:
            <math extend="$m1.matrixEntry1_2" name="m1me12f" />
            <math extend="$m2.matrixEntry1_2" name="m2me12f" />
            <math extend="$m3.matrixEntry1_2" name="m3me12f" />
          </p>
          <p>Matrix entry 31:
            <math extend="$m1.matrix[3][1]" name="m1me31" />
            <math extend="$m2.matrix[3][1]" name="m2me31" />
            <math extend="$m3.matrix[3][1]" name="m3me31" />
          </p>
          <p>Matrix entry 31 b:
            <math extend="$m1.rows[3][1]" name="m1me31b" />
            <math extend="$m2.rows[3][1]" name="m2me31b" />
            <math extend="$m3.rows[3][1]" name="m3me31b" />
          </p>
          <p>Matrix entry 31 c:
            <math extend="$m1.columns[1][3]" name="m1me31c" />
            <math extend="$m2.columns[1][3]" name="m2me31c" />
            <math extend="$m3.columns[1][3]" name="m3me31c" />
          </p>
          <p>Matrix entry 31 d:
            <math extend="$m1.row3[1]" name="m1me31d" />
            <math extend="$m2.row3[1]" name="m2me31d" />
            <math extend="$m3.row3[1]" name="m3me31d" />
          </p>
          <p>Matrix entry 31 e:
            <math extend="$m1.column1[3]" name="m1me31e" />
            <math extend="$m2.column1[3]" name="m2me31e" />
            <math extend="$m3.column1[3]" name="m3me31e" />
          </p>
          <p>Matrix entry 31 f:
            <math extend="$m1.matrixEntry3_1" name="m1me31f" />
            <math extend="$m2.matrixEntry3_1" name="m2me31f" />
            <math extend="$m3.matrixEntry3_1" name="m3me31f" />
          </p>
          <p>Matrix entry 23:
            <math extend="$m1.matrix[2][3]" name="m1me23" />
            <math extend="$m2.matrix[2][3]" name="m2me23" />
            <math extend="$m3.matrix[2][3]" name="m3me23" />
          </p>
          <p>Matrix entry 23 b:
            <math extend="$m1.rows[2][3]" name="m1me23b" />
            <math extend="$m2.rows[2][3]" name="m2me23b" />
            <math extend="$m3.rows[2][3]" name="m3me23b" />
          </p>
          <p>Matrix entry 23 c:
            <math extend="$m1.columns[3][2]" name="m1me23c" />
            <math extend="$m2.columns[3][2]" name="m2me23c" />
            <math extend="$m3.columns[3][2]" name="m3me23c" />
          </p>
          <p>Matrix entry 23 d:
            <math extend="$m1.row2[3]" name="m1me23d" />
            <math extend="$m2.row2[3]" name="m2me23d" />
            <math extend="$m3.row2[3]" name="m3me23d" />
          </p>
          <p>Matrix entry 23 e:
            <math extend="$m1.column3[2]" name="m1me23e" />
            <math extend="$m2.column3[2]" name="m2me23e" />
            <math extend="$m3.column3[2]" name="m3me23e" />
          </p>
          <p>Matrix entry 23 f:
            <math extend="$m1.matrixEntry2_3" name="m1me23f" />
            <math extend="$m2.matrixEntry2_3" name="m2me23f" />
            <math extend="$m3.matrixEntry2_3" name="m3me23f" />
          </p>
        
        
          <p>Change matrices</p>
          <p><matrixInput name="mi1" showSizeControls="false" bindValueTo="$m1.matrix" /></p>
          <p><matrixInput name="mi2" showSizeControls="false" bindValueTo="$m2.matrix" /></p>
          <p><matrixInput name="mi3" showSizeControls="false" bindValueTo="$m3.matrix" /></p>
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1ms")].stateValues
                .numbers,
        ).eqls([3, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2ms")].stateValues
                .numbers,
        ).eqls([3, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3ms")].stateValues
                .numbers,
        ).eqls([3, 2]);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1nr")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2nr")].stateValues
                .value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3nr")].stateValues
                .value,
        ).eq(3);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1nc")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2nc")].stateValues
                .value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3nc")].stateValues
                .value,
        ).eq(2);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3m")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3mm")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r1c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1&2\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3&4\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3&4\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3&4\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3&4\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3&4\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3&4\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3&4\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3&4\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r2c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}3&4\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r3")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r3")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r3")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}5&6\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r3b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r3b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r3b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}5&6\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r3c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r3c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}5&6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r3c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}5&6\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r4")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r4")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r4")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r4b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r4b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r4b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1r4c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2r4c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3r4c")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\3\\\\5\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\3\\\\5\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3c1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\3\\\\5\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\3\\\\5\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\3\\\\5\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3c1b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}1\\\\3\\\\5\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\\\4\\\\6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\\\4\\\\6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3c2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\\\4\\\\6\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\\\4\\\\6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\\\4\\\\6\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3c2b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}2\\\\4\\\\6\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1c3")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2c3")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3c3")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1c3b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2c3b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3c3b")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}\\end{bmatrix}");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me12")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me12")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me12")].stateValues
                    .latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me12b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me12b")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me12b")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me12c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me12c")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me12c")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me12d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me12d")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me12d")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me12e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me12e")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me12e")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me12f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me12f")]
                    .stateValues.latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me12f")]
                    .stateValues.latex,
            ),
        ).eq("2");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me31")].stateValues
                    .latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me31")].stateValues
                    .latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me31")].stateValues
                    .latex,
            ),
        ).eq("5");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me31b")]
                    .stateValues.latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me31b")]
                    .stateValues.latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me31b")]
                    .stateValues.latex,
            ),
        ).eq("5");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me31c")]
                    .stateValues.latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me31c")]
                    .stateValues.latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me31c")]
                    .stateValues.latex,
            ),
        ).eq("5");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me31d")]
                    .stateValues.latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me31d")]
                    .stateValues.latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me31d")]
                    .stateValues.latex,
            ),
        ).eq("5");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me31e")]
                    .stateValues.latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me31e")]
                    .stateValues.latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me31e")]
                    .stateValues.latex,
            ),
        ).eq("5");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me31f")]
                    .stateValues.latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me31f")]
                    .stateValues.latex,
            ),
        ).eq("5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me31f")]
                    .stateValues.latex,
            ),
        ).eq("5");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me23")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me23")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me23")].stateValues
                    .latex,
            ),
        ).eq("\uff3f");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me23b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me23b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me23b")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me23c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me23c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me23c")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me23d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me23d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me23d")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me23e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me23e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me23e")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1me23f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2me23f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3me23f")]
                    .stateValues.latex,
            ),
        ).eq("\uff3f");

        // change from matrix inputs
        await updateMatrixInputValue({
            latex: "a",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "b",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            rowInd: 0,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "c",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            rowInd: 1,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "d",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            rowInd: 1,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "e",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            rowInd: 2,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "f",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            rowInd: 2,
            colInd: 1,
            core,
            stateVariables,
        });

        await updateMatrixInputValue({
            latex: "g",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "h",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            rowInd: 0,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "i",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            rowInd: 1,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "j",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            rowInd: 1,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "k",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            rowInd: 2,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "l",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            rowInd: 2,
            colInd: 1,
            core,
            stateVariables,
        });

        await updateMatrixInputValue({
            latex: "m",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "n",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            rowInd: 0,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "o",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            rowInd: 1,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "p",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            rowInd: 1,
            colInd: 1,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "q",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            rowInd: 2,
            colInd: 0,
            core,
            stateVariables,
        });
        await updateMatrixInputValue({
            latex: "r",
            componentIdx: await resolvePathToNodeIdx("mi3"),
            rowInd: 2,
            colInd: 1,
            core,
            stateVariables,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}a&b\\\\c&d\\\\e&f\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}g&h\\\\i&j\\\\k&l\\end{bmatrix}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("\\begin{bmatrix}m&n\\\\o&p\\\\q&r\\end{bmatrix}");
    });

    it("simplify complex numbers", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <math simplify name="e1">i^2</math>
          <math simplify name="e2">i^3</math>
          <math simplify name="e3">i^4</math>
          <math simplify name="e4">(1+i)(1-i)</math>
          <math simplify name="e5">aibici</math>
          <math simplify expand name="e6">(a+bi)(c+di)</math>
          <math simplify expand name="e7">(a+bi)(a-bi)</math>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e1")].stateValues
                    .latex,
            ),
        ).eq("-1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e2")].stateValues
                    .latex,
            ),
        ).eq("-i");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e3")].stateValues
                    .latex,
            ),
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e4")].stateValues
                    .latex,
            ),
        ).eq("2");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e5")].stateValues
                    .latex,
            ),
        ).eq("-abci");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e6")].stateValues
                    .latex,
            ),
        ).eq("ac+adi+bci-bd");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e7")].stateValues
                    .latex,
            ),
        ).eq("a^{2}+b^{2}");
    });

    it("simplify integer square root", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <math simplify name="e1">sqrt(40)</math>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("e1")].stateValues
                    .latex,
            ),
        ).eq("2\\sqrt{10}");
    });

    it("parse scientific notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p><math simplify name="m1"><math>2E+3</math>+3E+2</math>
          <math simplify name="m2" parseScientificNotation><math>2E+3</math>+3E+2</math>
          <math simplify name="m3"><math parseScientificNotation>2E+3</math>+3E+2</math>
          <math simplify name="m4" parseScientificNotation><math parseScientificNotation="false">2E+3</math>+3E+2</math></p>
        
        
          <p><math format="latex" simplify name="m1a"><math format="latex">2E+3</math>+3E+2</math>
          <math format="latex" simplify name="m2a" parseScientificNotation><math format="latex">2E+3</math>+3E+2</math>
          <math format="latex" simplify name="m3a"><math format="latex" parseScientificNotation>2E+3</math>+3E+2</math>
          <math format="latex" simplify name="m4a" parseScientificNotation><math format="latex" parseScientificNotation="false">2E+3</math>+3E+2</math></p>
        
          <p><math simplify name="m5"><math>2E3</math>+3E2</math>
          <math simplify name="m6" parseScientificNotation><math>2E3</math>+3E2</math>
          <math simplify name="m7"><math parseScientificNotation>2E3</math>+3E2</math>
          <math simplify name="m8" parseScientificNotation><math parseScientificNotation="false">2E3</math>+3E2</math>
          </p>
        
          <p><math format="latex" simplify name="m5a"><math format="latex">2E3</math>+3E2</math>
          <math format="latex" simplify name="m6a" parseScientificNotation><math format="latex">2E3</math>+3E2</math>
          <math format="latex" simplify name="m7a"><math format="latex" parseScientificNotation>2E3</math>+3E2</math>
          <math format="latex" simplify name="m8a" parseScientificNotation><math format="latex" parseScientificNotation="false">2E3</math>+3E2</math>
          </p>
        
          <p><booleanInput name="p1"><label>parse 1</label></booleanInput>
          <booleanInput name="p2"><label>parse 2</label></booleanInput>
          </p>
          <p><math simplify name="m9" parseScientificNotation="$p1"><math parseScientificNotation="$p2">2E+3</math>+3E+2</math></p>
          <p><math format="latex" simplify name="m9a" parseScientificNotation="$p1"><math format="latex" parseScientificNotation="$p2">2E+3</math>+3E+2</math></p>
          <p><math simplify name="m10" parseScientificNotation="$p1"><math parseScientificNotation="$p2">2E3</math>+3E2</math></p>
          <p><math format="latex" simplify name="m10a" parseScientificNotation="$p1"><math format="latex" parseScientificNotation="$p2">2E3</math>+3E2</math></p>
        
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("5E+5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("2300");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("3E+2002");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                    .latex,
            ),
        ).eq("2E+303");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1a")].stateValues
                    .latex,
            ),
        ).eq("5E+5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2a")].stateValues
                    .latex,
            ),
        ).eq("2300");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3a")].stateValues
                    .latex,
            ),
        ).eq("3E+2002");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4a")].stateValues
                    .latex,
            ),
        ).eq("2E+303");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m5")].stateValues
                    .latex,
            ),
        ).eq("3\\operatorname{E2}+2\\operatorname{E3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m6")].stateValues
                    .latex,
            ),
        ).eq("2300");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m7")].stateValues
                    .latex,
            ),
        ).eq("3\\operatorname{E2}+2000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m8")].stateValues
                    .latex,
            ),
        ).eq("2\\operatorname{E3}+300");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m5a")].stateValues
                    .latex,
            ),
        ).eq("3\\operatorname{E2}+2\\operatorname{E3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m6a")].stateValues
                    .latex,
            ),
        ).eq("2300");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m7a")].stateValues
                    .latex,
            ),
        ).eq("3\\operatorname{E2}+2000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m8a")].stateValues
                    .latex,
            ),
        ).eq("2\\operatorname{E3}+300");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9")].stateValues
                    .latex,
            ),
        ).eq("5E+5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9a")].stateValues
                    .latex,
            ),
        ).eq("5E+5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10")].stateValues
                    .latex,
            ),
        ).eq("3\\operatorname{E2}+2\\operatorname{E3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10a")].stateValues
                    .latex,
            ),
        ).eq("3\\operatorname{E2}+2\\operatorname{E3}");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("p1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9")].stateValues
                    .latex,
            ),
        ).eq("2E+303");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9a")].stateValues
                    .latex,
            ),
        ).eq("2E+303");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10")].stateValues
                    .latex,
            ),
        ).eq("2\\operatorname{E3}+300");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10a")].stateValues
                    .latex,
            ),
        ).eq("2\\operatorname{E3}+300");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("p2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9")].stateValues
                    .latex,
            ),
        ).eq("2300");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9a")].stateValues
                    .latex,
            ),
        ).eq("2300");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10")].stateValues
                    .latex,
            ),
        ).eq("2300");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10a")].stateValues
                    .latex,
            ),
        ).eq("2300");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("p1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9")].stateValues
                    .latex,
            ),
        ).eq("3E+2002");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9a")].stateValues
                    .latex,
            ),
        ).eq("3E+2002");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10")].stateValues
                    .latex,
            ),
        ).eq("3\\operatorname{E2}+2000");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10a")].stateValues
                    .latex,
            ),
        ).eq("3\\operatorname{E2}+2000");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("p2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9")].stateValues
                    .latex,
            ),
        ).eq("5E+5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m9a")].stateValues
                    .latex,
            ),
        ).eq("5E+5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10")].stateValues
                    .latex,
            ),
        ).eq("3\\operatorname{E2}+2\\operatorname{E3}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m10a")].stateValues
                    .latex,
            ),
        ).eq("3\\operatorname{E2}+2\\operatorname{E3}");
    });

    it("subscripts and superscripts numbers to unicode text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p><math name="m1">2x_1y_23+z_456-a_(7+8-90)</math></p>
          <p><math name="m2">2x^1y^23+z^456-a^(7+8-90)</math></p>
          <p><math name="m3">a^2 - b_2</math></p>
          <p name="m1t">$m1.text</p>
          <p name="m2t">$m2.text</p>
          <p name="m3t">$m3.text</p>
          <p><text name="t1">a₂-b²</text></p>
          
          <p><updateValue name="uv" type="text" target="$m3.text" newValue="$t1.text" ><label>Update via text</label></updateValue></p>
        
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1t")].stateValues.text,
        ).eq("2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2t")].stateValues.text,
        ).eq("2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3t")].stateValues.text,
        ).eq("a² - b₂");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m3t")].stateValues.text,
        ).eq("a₂ - b²");
    });

    it("math in graph", async () => {
        const doenetMLsnippet = `
        <graph >
            <math anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" fixed="$fixed1" fixLocation="$fixLocation1">"x^2/3</math>
            <math name="item2">e^(-x^2)</math>
        </graph>
        `;

        await test_in_graph(doenetMLsnippet, moveMath);
    });

    it("math in graph, handle bad anchor coordinates", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <graph >
              <math anchor="$anchorCoords1" name="math1">x^2</math>
            </graph>
            
        
            <p name="pAnchor1">Anchor 1 coordinates:  <point extend="$math1.anchor" name="math1anchor" /></p>
            <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="x" /></p>
            
        
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("math1anchor")]
                    .stateValues.latex,
            ),
        ).eq("x");

        // give good anchor coords
        await updateMathInputValue({
            latex: "(6,7)",
            componentIdx: await resolvePathToNodeIdx("anchorCoords1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("math1anchor")]
                    .stateValues.latex,
            ),
        ).eq("(6,7)");

        // give bad anchor coords again
        await updateMathInputValue({
            latex: "q",
            componentIdx: await resolvePathToNodeIdx("anchorCoords1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("math1anchor")]
                    .stateValues.latex,
            ),
        ).eq("q");
    });

    it("color math via style", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <setup>
              <styleDefinitions>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
              </styleDefinitions>
            </setup>
        
            <p>Style number: <mathInput prefill="1" name="sn" /></p>
        
            <p><math name="no_style">x^2</math> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
            <p><math name="fixed_style" stylenumber="2">x^3</math> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
            <p><math name="variable_style" stylenumber="$sn">x^4</math> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>
        
            <graph>
              $no_style{anchor="(1,2)"}
              $fixed_style{anchor="(3,4)"}
              $variable_style
            </graph>
        
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_no_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_fixed_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_variable_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_variable_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_variable_style")]
                .stateValues.text,
        ).eq("none");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("sn"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_variable_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_variable_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_variable_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_no_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_fixed_style")]
                .stateValues.text,
        ).eq("none");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("sn"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_variable_style")]
                .stateValues.text,
        ).eq("red with a blue background");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_variable_style")]
                .stateValues.text,
        ).eq("red");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_variable_style")]
                .stateValues.text,
        ).eq("blue");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_no_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_fixed_style")]
                .stateValues.text,
        ).eq("none");
    });

    it("math copied by plain macro, but not value, reflects style and anchor position", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <setup>
              <styleDefinitions>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" />
              </styleDefinitions>
            </setup>
        
            <graph name="g1">
              <math styleNumber="2" name="m1">x^2</math>
              <math styleNumber="3" anchor="(3,4)" name="m2" >x^3</math>
            </graph>
        
            <coords extend="$m1.anchor" name="m1coords" />
            <coords extend="$m2.anchor" name="m2coords" />
        
            <graph name="g2">
              <math extend="$m1" name="m1a" />
              <math extend="$m2" name="m2a" />
            </graph>
        
            <collect componentType="math" from="$g2" name="g2math" />
            <point extend="$g2math[1].anchor" name="m1acoords" />
            <point extend="$g2math[2].anchor" name="m2acoords" />
            
            <graph name="g3">
              <math extend="$m1.value" name="m1b" />
              <math extend="$m2.value" name="m2b" />
            </graph>
        
            <collect componentType="math" from="$g3" name="g3math" />
            <point extend="$g3math[1].anchor" name="m1bcoords" />
            <point extend="$g3math[2].anchor" name="m2bcoords" />
            
            <p name="p1"><math extend="$m1" name="m1c" /> <math extend="$m2" name="m2c" /></p>
        
            <p name="p2"><math extend="$m1.value" name="m1d" /> <math extend="$m2.value" name="m2d" /></p>
        
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["^", "x", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1a")].stateValues.value
                .tree,
        ).eqls(["^", "x", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1b")].stateValues.value
                .tree,
        ).eqls(["^", "x", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1c")].stateValues.value
                .tree,
        ).eqls(["^", "x", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1d")].stateValues.value
                .tree,
        ).eqls(["^", "x", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["^", "x", 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2a")].stateValues.value
                .tree,
        ).eqls(["^", "x", 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2b")].stateValues.value
                .tree,
        ).eqls(["^", "x", 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2c")].stateValues.value
                .tree,
        ).eqls(["^", "x", 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2d")].stateValues.value
                .tree,
        ).eqls(["^", "x", 3]);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1a")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1b")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1c")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1d")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2a")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2b")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2c")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2d")].stateValues
                .styleNumber,
        ).eq(1);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1acoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2acoords")]
                    .stateValues.latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move first maths
        await moveMath({
            componentIdx: await resolvePathToNodeIdx("m1"),
            x: -2,
            y: 3,
            core,
        });
        await moveMath({
            componentIdx: await resolvePathToNodeIdx("m2"),
            x: 4,
            y: -5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(-2,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(4,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1acoords")]
                    .stateValues.latex,
            ),
        ).eq("(-2,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2acoords")]
                    .stateValues.latex,
            ),
        ).eq("(4,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move second maths
        await moveMath({
            componentIdx: await resolvePathToNodeIdx("m1a"),
            x: 7,
            y: 1,
            core,
        });
        await moveMath({
            componentIdx: await resolvePathToNodeIdx("m2a"),
            x: -8,
            y: 2,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1acoords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2acoords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move third maths
        await moveMath({
            componentIdx: await resolvePathToNodeIdx("m1b"),
            x: -6,
            y: 3,
            core,
        });
        await moveMath({
            componentIdx: await resolvePathToNodeIdx("m2b"),
            x: -5,
            y: -4,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1acoords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2acoords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(-6,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(-5,-4)");
    });

    it("vec", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <math name="m1" format="latex">\\vec{a}</math>
            <math name="m2">vec a</math>
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("\\vec{a}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("\\vec{a}");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["vec", "a"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["vec", "a"]);
    });

    it("line segment", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <math name="m1" format="latex">\\overline{AB}</math>
            <math name="m2">linesegment(A,B)</math>
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("\\overline{AB}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("\\overline{AB}");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["linesegment", "A", "B"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["linesegment", "A", "B"]);
    });

    it("perp", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <math name="m1" format="latex">v \\perp u</math>
            <math name="m2">v perp u</math>
            <math name="m3" format="latex">v^\\perp</math>
            <math name="m4">v^perp</math>
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("v\\perpu");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("v\\perpu");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .latex,
            ),
        ).eq("v^{\\perp}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m4")].stateValues
                    .latex,
            ),
        ).eq("v^{\\perp}");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["perp", "v", "u"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["perp", "v", "u"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["^", "v", "perp"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(["^", "v", "perp"]);
    });

    it("parallel", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <math name="m1" format="latex">v \\parallel u</math>
            <math name="m2">v parallel u</math>
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .latex,
            ),
        ).eq("v\\parallelu");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .latex,
            ),
        ).eq("v\\parallelu");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["parallel", "v", "u"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["parallel", "v", "u"]);
    });

    it("basic units", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p>
            <math name="dol5">$5</math>
            <math name="perc25">25%</math>
            <math name="deg60">60 deg</math>
            <math name="dol5b" format="latex">\\$5</math>
            <math name="perc25b" format="latex">25\\%</math>
            <math name="deg60b" format="latex">60^{\\circ}</math>
            <math name="dol5c" format="latex">$5</math>
            <math name="perc25c" format="latex">25%</math>
            <math name="sin90deg">sin(90 deg)</math>
          </p>
          <p>
            <number name="ndol5">$5</number>
            <number name="nperc25">25%</number>
            <number name="ndeg60">60 deg</number>
            <number name="nsin90deg">sin(90 deg)</number>
          </p>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dol5")].stateValues
                    .latex,
            ),
        ).eq("\\$5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("perc25")].stateValues
                    .latex,
            ),
        ).eq("25\\%");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("deg60")].stateValues
                    .latex,
            ),
        ).eq("60^{\\circ}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dol5b")].stateValues
                    .latex,
            ),
        ).eq("\\$5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("perc25b")]
                    .stateValues.latex,
            ),
        ).eq("25\\%");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("deg60b")].stateValues
                    .latex,
            ),
        ).eq("60^{\\circ}");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("dol5c")].stateValues
                    .latex,
            ),
        ).eq("\\$5");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("perc25c")]
                    .stateValues.latex,
            ),
        ).eq("25\\%");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sin90deg")]
                    .stateValues.latex,
            ),
        ).eq("\\sin(90^{\\circ})");

        expect(
            stateVariables[await resolvePathToNodeIdx("ndol5")].stateValues
                .text,
        ).eq("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("nperc25")].stateValues
                .text,
        ).eq("0.25");
        expect(
            parseFloat(
                stateVariables[await resolvePathToNodeIdx("ndeg60")].stateValues
                    .text,
            ),
        ).closeTo(Math.PI / 3, 1e-2);
        expect(
            stateVariables[await resolvePathToNodeIdx("nsin90deg")].stateValues
                .text,
        ).eq("1");

        expect(
            stateVariables[await resolvePathToNodeIdx("dol5")].stateValues.value
                .tree,
        ).eqls(["unit", "$", 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("perc25")].stateValues
                .value.tree,
        ).eqls(["unit", 25, "%"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("deg60")].stateValues
                .value.tree,
        ).eqls(["unit", 60, "deg"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("dol5b")].stateValues
                .value.tree,
        ).eqls(["unit", "$", 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("perc25b")].stateValues
                .value.tree,
        ).eqls(["unit", 25, "%"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("deg60b")].stateValues
                .value.tree,
        ).eqls(["unit", 60, "deg"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("dol5c")].stateValues
                .value.tree,
        ).eqls(["unit", "$", 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("perc25c")].stateValues
                .value.tree,
        ).eqls(["unit", 25, "%"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ndol5")].stateValues
                .value,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("nperc25")].stateValues
                .value,
        ).eq(0.25);
        expect(
            stateVariables[await resolvePathToNodeIdx("ndeg60")].stateValues
                .value,
        ).closeTo(Math.PI / 3, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("nsin90deg")].stateValues
                .value,
        ).eq(1);
    });

    it("some support for integral", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p>
            <math name="indefint">int f(x) dx</math>
            <math name="defint">int_a^b f(x) dx</math>
            <math name="indefintb" format="latex">\\int f(x) dx</math>
            <math name="defintb" format="latex">\\int_a^b f(x) dx</math>
          </p>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("indefint")]
                    .stateValues.latex,
            ),
        ).eq("\\intf(x)dx");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("defint")].stateValues
                    .latex,
            ),
        ).eq("\\int_{a}^{b}f(x)dx");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("indefintb")]
                    .stateValues.latex,
            ),
        ).eq("\\intf(x)dx");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("defintb")]
                    .stateValues.latex,
            ),
        ).eq("\\int_{a}^{b}f(x)dx");
    });

    it("recover math values through latex state variables", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p>
            <vector name="v">(3,4)</vector>
            <point name="p">(5,6)</point>
            <function name="f">sin(x)/exp(x)</function>
            <m name="m">\\frac{x}{y}</m>
            <math name="math">y/z</math>
            <line name="l">y=x+4</line>
            <asList name="al"><math>sin(x)</math><math>cos(x)</math></asList>
            <mathList name="ml">tan(x) cot(y)</mathList>
          </p>
          <p>
            <math name="v2">$v.latex</math>
            <math name="p2">$p.latex</math>
            <math name="f2">$f.latex</math>
            <math name="m2">$m.latex</math>
            <math name="math2">$math.latex</math>
            <math name="l2">$l.latex</math>
            <math name="al2">$al.latex</math>
            <math name="ml2">$ml.latex</math>
          </p>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("v2")].stateValues.value
                .tree,
        ).eqls(["tuple", 3, 4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.value
                .tree,
        ).eqls(["tuple", 5, 6]);
        expect(
            stateVariables[await resolvePathToNodeIdx("f2")].stateValues.value
                .tree,
        ).eqls(["/", ["apply", "sin", "x"], ["apply", "exp", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["/", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("math2")].stateValues
                .value.tree,
        ).eqls(["/", "y", "z"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("l2")].stateValues.value
                .tree,
        ).eqls(["=", "y", ["+", "x", 4]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("al2")].stateValues.value
                .tree,
        ).eqls(["list", ["apply", "sin", "x"], ["apply", "cos", "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ml2")].stateValues.value
                .tree,
        ).eqls(["list", ["apply", "tan", "x"], ["apply", "cot", "y"]]);
    });

    it("Don't divide by vectors when inverting math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <number name="n">3</number>
          <math name="m" simplify>$n(3,4)</math>
          <mathInput name="mi" bindValueTo="$m" />
        
          <number name="n2">3</number>
          <math name="m2" simplify>$n2*4</math>
          <mathInput name="mi2" bindValueTo="$m2" />
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("n2")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["tuple", 9, 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(12);

        await updateMathInputValue({
            latex: "(6,8)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("n2")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eqls(["tuple", 9, 12]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(8);
    });

    it("support for some logical operators", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p>
            <math name="not_a">not a</math>
            <math name="not_b">!a</math>
            <math name="not_c" format="latex">\\lnot a</math>
            <math name="not_d" format="latex">\\neg a</math>
            <math name="not_e" format="latex">!a</math>
          </p>
          <p>
            <math name="implies_a">a implies b</math>
            <math name="implies_b">a ⇒ b</math>
            <math name="implies_c">a ⟹ b</math>
            <math name="implies_d" format="latex">a \\implies b</math>
            <math name="implies_e" format="latex">a \\Longrightarrow b</math>
            <math name="implies_f" format="latex">a \\Rightarrow b</math>
          </p>
        
          <p>
            <math name="impliedby_a">a impliedby b</math>
            <math name="impliedby_b">a ⇐ b</math>
            <math name="impliedby_c">a ⟸ b</math>
            <math name="impliedby_d" format="latex">a \\impliedby b</math>
            <math name="impliedby_e" format="latex">a \\Longleftarrow b</math>
            <math name="impliedby_f" format="latex">a \\Leftarrow b</math>
          </p>
        
          <p>
            <math name="iff_a">a iff b</math>
            <math name="iff_b">a ⇔ b</math>
            <math name="iff_c">a ⟺ b</math>
            <math name="iff_d" format="latex">a \\iff b</math>
            <math name="iff_e" format="latex">a \\Longleftrightarrow b</math>
            <math name="iff_f" format="latex">a \\Leftrightarrow b</math>
          </p>
        
          <p>
            <math name="rightarrow_a">a rightarrow b</math>
            <math name="rightarrow_b">a → b</math>
            <math name="rightarrow_c">a ⟶ b</math>
            <math name="rightarrow_d" format="latex">a \\to b</math>
            <math name="rightarrow_e" format="latex">a \\longrightarrow b</math>
            <math name="rightarrow_f" format="latex">a \\rightarrow b</math>
          </p>
        
          <p>
            <math name="leftarrow_a">a leftarrow b</math>
            <math name="leftarrow_b">a ← b</math>
            <math name="leftarrow_c">a ⟵ b</math>
            <math name="leftarrow_d" format="latex">a \\gets b</math>
            <math name="leftarrow_e" format="latex">a \\longleftarrow b</math>
            <math name="leftarrow_f" format="latex">a \\leftarrow b</math>
          </p>
        
          <p>
            <math name="leftrightarrow_a">a leftrightarrow b</math>
            <math name="leftrightarrow_b">a ↔ b</math>
            <math name="leftrightarrow_c">a ⟷ b</math>
            <math name="leftrightarrow_d" format="latex">a \\longleftrightarrow b</math>
            <math name="leftrightarrow_e" format="latex">a \\leftrightarrow b</math>
          </p>
          `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let nots = [
            await resolvePathToNodeIdx("not_a"),
            await resolvePathToNodeIdx("not_b"),
            await resolvePathToNodeIdx("not_c"),
            await resolvePathToNodeIdx("not_d"),
            await resolvePathToNodeIdx("not_e"),
        ];
        let implies = [
            await resolvePathToNodeIdx("implies_a"),
            await resolvePathToNodeIdx("implies_b"),
            await resolvePathToNodeIdx("implies_c"),
            await resolvePathToNodeIdx("implies_d"),
            await resolvePathToNodeIdx("implies_e"),
            await resolvePathToNodeIdx("implies_f"),
        ];
        let impliedby = [
            await resolvePathToNodeIdx("impliedby_a"),
            await resolvePathToNodeIdx("impliedby_b"),
            await resolvePathToNodeIdx("impliedby_c"),
            await resolvePathToNodeIdx("impliedby_d"),
            await resolvePathToNodeIdx("impliedby_e"),
            await resolvePathToNodeIdx("impliedby_f"),
        ];
        let iff = [
            await resolvePathToNodeIdx("iff_a"),
            await resolvePathToNodeIdx("iff_b"),
            await resolvePathToNodeIdx("iff_c"),
            await resolvePathToNodeIdx("iff_d"),
            await resolvePathToNodeIdx("iff_e"),
            await resolvePathToNodeIdx("iff_f"),
        ];

        let rightarrow = [
            await resolvePathToNodeIdx("rightarrow_a"),
            await resolvePathToNodeIdx("rightarrow_b"),
            await resolvePathToNodeIdx("rightarrow_c"),
            await resolvePathToNodeIdx("rightarrow_d"),
            await resolvePathToNodeIdx("rightarrow_e"),
            await resolvePathToNodeIdx("rightarrow_f"),
        ];
        let leftarrow = [
            await resolvePathToNodeIdx("leftarrow_a"),
            await resolvePathToNodeIdx("leftarrow_b"),
            await resolvePathToNodeIdx("leftarrow_c"),
            await resolvePathToNodeIdx("leftarrow_d"),
            await resolvePathToNodeIdx("leftarrow_e"),
            await resolvePathToNodeIdx("leftarrow_f"),
        ];
        let leftrightarrow = [
            await resolvePathToNodeIdx("leftrightarrow_a"),
            await resolvePathToNodeIdx("leftrightarrow_b"),
            await resolvePathToNodeIdx("leftrightarrow_c"),
            await resolvePathToNodeIdx("leftrightarrow_d"),
            await resolvePathToNodeIdx("leftrightarrow_e"),
        ];

        for (let id of nots) {
            expect(stateVariables[id].stateValues.value.tree).eqls([
                "not",
                "a",
            ]);
        }
        for (let id of implies) {
            expect(stateVariables[id].stateValues.value.tree).eqls([
                "implies",
                "a",
                "b",
            ]);
        }
        for (let id of impliedby) {
            expect(stateVariables[id].stateValues.value.tree).eqls([
                "impliedby",
                "a",
                "b",
            ]);
        }
        for (let id of iff) {
            expect(stateVariables[id].stateValues.value.tree).eqls([
                "iff",
                "a",
                "b",
            ]);
        }
        for (let id of rightarrow) {
            expect(stateVariables[id].stateValues.value.tree).eqls([
                "rightarrow",
                "a",
                "b",
            ]);
        }
        for (let id of leftarrow) {
            expect(stateVariables[id].stateValues.value.tree).eqls([
                "leftarrow",
                "a",
                "b",
            ]);
        }
        for (let id of leftrightarrow) {
            expect(stateVariables[id].stateValues.value.tree).eqls([
                "leftrightarrow",
                "a",
                "b",
            ]);
        }
    });

    it("numListItems and list", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><math name="m">2x, 3y, 4z</math>!</p>

    <p name="p2">Number of list items is $m.numListItems.</p>
    <p name="p3">list items: $m.list.</p>
    <p name="p4">math list from items: <mathList name="ml">$m.list</mathList>.</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Number of list items is 3.");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("list items: 2 x, 3 y, 4 z.");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("math list from items: 2 x, 3 y, 4 z.");

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues
                .numDimensions,
        ).eq(3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("m")
            ].stateValues.list.map((v: any) => v.tree),
        ).eqls([
            ["*", 2, "x"],
            ["*", 3, "y"],
            ["*", 4, "z"],
        ]);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("ml")
            ].stateValues.maths.map((v: any) => v.tree),
        ).eqls([
            ["*", 2, "x"],
            ["*", 3, "y"],
            ["*", 4, "z"],
        ]);
    });
});

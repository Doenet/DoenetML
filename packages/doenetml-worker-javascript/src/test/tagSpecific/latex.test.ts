import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Latex tag tests @group2", async () => {
    // Regression test for the worker crash described at
    // packages/docs-nextra/pages/reference/latex.mdx — using a property
    // reference such as `$math.latex` as the child of a `<latex>` element
    // previously triggered "Unknown state variable latex of <idx>" because
    // the `<latex>` value-dependency required `latex` on every textLike
    // child without marking the lookup optional. Children whose component
    // type does not expose a `latex` state variable (e.g. plain `<text>`,
    // a placeholder for a non-existent prop, or a `<mathInput>`) crashed
    // dependency setup. With `variablesOptional: true`, the dependency
    // gracefully falls back to the child's `text` state variable.

    it("text child without a latex state variable does not crash", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<latex name="lat"><text>foo</text></latex>`,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("lat")].stateValues.value,
        ).eq("foo");
    });

    it("$math.latex as a latex child renders the math as latex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<math name="expected">x^2 + 2x + 1</math>
<latex name="exp">$expected.latex</latex>
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("exp")].stateValues.value,
        ).eq("x^{2} + 2 x + 1");
    });

    it("$mathInput.latex as a latex child resolves without crashing", async () => {
        // `<mathInput>` does not expose a `latex` state variable, so the
        // reference resolves to a blank placeholder. The important thing
        // is that the worker does not throw an internal-state-variable
        // error that leaks to the rendered viewer.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<mathInput name="user" prefill="x^2" />
<latex name="exp">$user.latex</latex>
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            typeof stateVariables[await resolvePathToNodeIdx("exp")].stateValues
                .value,
        ).eq("string");
    });

    it("full docs example renders without a worker error", async () => {
        // Reproduces the example at
        // packages/docs-nextra/pages/reference/latex.mdx
        // "Compare a <mathInput> value against an expected expression".
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<setup>
  <math name="expected">x^2 + 2x + 1</math>
</setup>

<p>
  <mathInput name="user"><label>Expand <m>(x + 1)^2</m></label></mathInput>
</p>

<p>You entered (as LaTeX):
  <c><latex name="latex1">$user.latex</latex></c>
</p>
<p>Expected (as LaTeX):
  <c><latex name="latex2">$expected.latex</latex></c>
</p>
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("latex1")].stateValues
                .value,
        ).toBeDefined();
        expect(
            stateVariables[await resolvePathToNodeIdx("latex2")].stateValues
                .value,
        ).eq("x^{2} + 2 x + 1");
    });
});

import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("P tag tests", async () => {
    it("two paragraphs", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="p1">Hello, paragraph 1</p>
  <p name="p2">Bye, paragraph 2</p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Hello, paragraph 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Bye, paragraph 2");
    });

    it("paragraph with math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="p">math in paragraph: <math simplify>x+x</math></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("math in paragraph: 2 x");
    });

    it("spaces preserved between tags", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><text>Hello</text> <math>x</math></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("Hello x");
    });

    it("paragraphs with brs inside an hr between", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="p1">Hello<br/>paragraph 1</p>
  <hr/>
  <p name="p2">Bye<br/>paragraph 2</p>
  `,
        });

        // Not testing anything about `<hr>` and `<br>` other than they don't cause errors

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Hello paragraph 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Bye paragraph 2");

        let errorWarnings = core.core!.errorWarnings;
        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(0);
    });
});

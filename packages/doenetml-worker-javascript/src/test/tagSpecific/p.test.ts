import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("P tag tests", async () => {
    it("two paragraphs", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="p1">Hello, paragraph 1</p>
  <p name="p2">Bye, paragraph 2</p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);

        expect(stateVariables["/p1"].stateValues.text).eq("Hello, paragraph 1");
        expect(stateVariables["/p2"].stateValues.text).eq("Bye, paragraph 2");
    });

    it("paragraph with math", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="p">math in paragraph: <math simplify>x+x</math></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/p"].stateValues.text).eq(
            "math in paragraph: 2 x",
        );
    });

    it("spaces preserved between tags", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><text>Hello</text> <math>x</math></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/p"].stateValues.text).eq("Hello x");
    });
});

import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Orbital diagram tests", async () => {
    it("original diagram sugar works", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
 <orbitalDiagram labels="a b" name="od">(u,d, e, d) (e)</orbitalDiagram>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("od")].stateValues.value,
        ).eqls([
            { orbitalText: "a", boxes: ["U", "D", "", "D"] },
            { orbitalText: "b", boxes: [""] },
        ]);
    });
});

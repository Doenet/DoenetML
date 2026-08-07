import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "./utils/test-core";
const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("probe", async () => {
    it("f1a maxima", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <function name="f1a" domain="[-pi+10^(-6),2pi-10^(-6)]">cos(x)</function>
      `,
        });
        const sv = await core.returnAllStateVariables(false, true);
        const f = sv[await resolvePathToNodeIdx("f1a")];
        console.log("PROBE maxima:", JSON.stringify(f.stateValues.maxima));
        console.log("PROBE minima:", JSON.stringify(f.stateValues.minima));
        console.log("PROBE numMaxima:", f.stateValues.numMaxima);
    });
});

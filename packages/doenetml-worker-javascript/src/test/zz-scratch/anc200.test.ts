import { it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { censusOfCore } from "../perf/census";
vi.stubGlobal("postMessage", vi.fn());
vi.mock("hyperformula");
it("a200", async () => {
  const L: string[] = [];
  for (const anchored of [false, true]) {
    const doc = `<graph>` + Array.from({ length: 200 }, (_, i) => `<number${anchored ? ` anchor="(${i},1)"` : ""}>${i}</number>`).join("") + `</graph>`;
    const tc: any = await createTestCore({ doenetML: doc });
    await tc.core.returnAllStateVariables(false, true);
    const c = censusOfCore(tc.core);
    L.push(`${anchored ? "anchored" : "plain"}: comps ${c.components} SV ${c.stateVariables} deps ${c.dependencies}`);
  }
  require("fs").writeFileSync(process.env.OUT!, L.join("\n") + "\n");
}, 900000);

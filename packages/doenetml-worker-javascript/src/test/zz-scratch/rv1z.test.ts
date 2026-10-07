import { it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
vi.stubGlobal("postMessage", vi.fn());
vi.mock("hyperformula");
it("z", async () => {
  const L: string[] = [];
  const tc: any = await createTestCore({ doenetML: `<math name="z">-0</math><point name="q">(-0,2)</point><mathList name="ml">-0 2</mathList><graph><text name="t" anchor="(-0,2)">a</text></graph>` });
  const sv = await tc.core.returnAllStateVariables(false, true);
  for (const n of ["z","q","ml","t"]) { const s = sv[await tc.resolvePathToNodeIdx(n)].stateValues; L.push(n + " " + JSON.stringify([s.value?.tree, s.coords?.tree, s.xs?.map((x:any)=>x.tree), s.maths?.map((x:any)=>x.tree), s.anchor?.tree])); }
  const t = tc.core.core._components[await tc.resolvePathToNodeIdx("t")];
  const a = t.attributes.anchor;
  if (a.component) { const c = a.component; L.push("attrcomp xs " + JSON.stringify((await c.stateValues.xs).map((x:any)=>x.tree))); const ml = c.attributes.xs.component; L.push("mathlist children " + JSON.stringify(await Promise.all(ml.activeChildren.map(async (m:any)=> [(await m.stateValues.unnormalizedValue).tree,(await m.stateValues.value).tree])))); }
  require("fs").writeFileSync(process.env.RV1_OUT!, L.join("\n"));
}, 900000);

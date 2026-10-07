import { it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
vi.stubGlobal("postMessage", vi.fn());
vi.mock("hyperformula");
it("shape", async () => {
  const L: string[] = [];
  const tc: any = await createTestCore({ doenetML: `<graph><math name="m" anchor="(1,-2.5)">x</math><text name="t" anchor="(3, 4)">a</text></graph><regularPolygon name="r" center="(1,2)" radius="3"/><circle name="c" radius="2" center="(0,0)"/>` });
  const inner = tc.core.core;
  const desc = (c: any, d = 0): string => {
    if (typeof c === "string") return JSON.stringify(c);
    const at = Object.entries(c.attributes ?? {}).map(([k, a]: any) => a.component ? `${k}=${desc(a.component, d + 1)}` : `${k}:${a.type ?? "?"}`).join(",");
    return `${c.componentType}[${(c.definingChildren ?? []).map((x: any) => desc(x, d + 1)).join(",")}]{${at}}${c.essentialState && Object.keys(c.essentialState).length ? JSON.stringify(c.essentialState) : ""}`;
  };
  for (const n of ["m", "t", "r", "c"]) { const c = inner._components[await tc.resolvePathToNodeIdx(n)];
    for (const [k, a] of Object.entries(c.attributes) as any) if (a.component) L.push(`${n}.${k} = ${desc(a.component)}`); }
  const sv = await tc.core.returnAllStateVariables(false, true);
  L.push("m.anchor " + sv[await tc.resolvePathToNodeIdx("m")].stateValues.anchor.toString() + " tree " + JSON.stringify(sv[await tc.resolvePathToNodeIdx("m")].stateValues.anchor.tree));
  require("fs").writeFileSync("/tmp/claude-1000/-home-nykamp-src-DoenetML/883766ce-eb9c-4ac9-828b-69fedd57094c/scratchpad/b1bshape.txt", L.join("\n"));
}, 900000);
